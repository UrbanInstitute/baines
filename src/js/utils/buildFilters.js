/* requires:
libs.js
states.js
meta.js
*/

// Functions loaded here
// async addState(meta,state,selection)
// async getResults(urls)
// filteredSelection(data)
// unpackResponses(data)
// listOfUniqueVals(data,param,secondary)
// updateTotalAndLogic(count)
// generateLogicString()
// unpack(array)
// numberWithCommas(x)

async function addState(meta,state,selection) {
	// at beginning of JSON call, disable inputs
	$(".geofilter").prop("disabled", true);	
	$(".dropbtn").removeClass("enabled")
	$(".loader-cont").addClass("active")	

	// If the state hasn't been called from the API yet, call the API, otherwise DONT....might not work yet
	if (!meta.filterList.loadedStates[state.data]) {

		meta.filterList.loadedStates[state.data] = true;
		
		// the false in masterurl refers to whether to include other filters
		var masterUrl = getMasterUrl(meta,state,false)

		var responses = await getAllData(masterUrl,{on:false})

		var unpacked = unpackResponses(responses);

		// make the API call
		allData = allData.concat(unpacked);			

	} 
	
	// Since the state name is already added to the filter list in the baselevel.js click event,
	// we can dedupe, using the filterlist
	dedupeData = filteredSelection(allData);
	
	// return filter options	
	var geofilters = meta[meta.universe].geofilters;

	for (var filter in geofilters) {			
		// filter rank < active higher rank filter, use dedupe data, 
		// for smaller municipalities, use the deduped data...i.e. you can only pick schools that are in 
		// the already selected districts/cities
		if (geofilters[filter].rank === 0) {
			buildGeographyFilters(dedupeData,geofilters[filter])
		} 
		else {
			buildGeographyFilters(dedupeData,geofilters[filter])		
		}
	}

	
		// in the future if you wanted to do selections by radius!
		// Washington DC
		// var point1 = [38.9027902,-77.0506895];
		// Abington PA
		// var point1 = [40.120213, -75.116932]

		// console.log('-----------')
		// var insideGroup = []

		// var t00 = performance.now();
		// for (var i = 0; i < dedupeData.length; i++) {	
		// 	var point2 = [dedupeData[i].latitude,dedupeData[i].longitude];
		// 	if ( withinRadius(point1,point2,1,"miles") ) {
		// 		insideGroup.push(dedupeData[i])
		// 	}
		// }
		// var t01 = performance.now();
		// console.log(insideGroup)
		// console.log("insideGroup took " + (t01-t00) + " ms to calculate, an average of " + (t01-t00)/dedupeData.length + " ms per calc")


	// After all the JSON calls have run, enable all other filter options
	// remove red star
	$(".geofilter").prop("disabled", false);
	$(".red").addClass("disabled")
	$(".dropbtn").addClass("enabled");
	$(".loader-cont").removeClass("active");
	$(".generator").removeClass("disabled");

	// console.log(selection)

	///// add tag and prepare meta for the filtering /////
	addTag(state,$(selection).parent());
	updateTotalAndLogic(dedupeData.length);
}

async function getResults(urls,type) {

	var t0 = performance.now()
	console.log(`starting getResults for ${urls[0].url}`)

	// $('.filter-master-titles').append(urls[0].url)

	$("#data" + type).addClass('active')

	var steps = {
		start: 0.05,
		csvConvert: 0.01
	}

	if (type === "wide") {
		var Thisbar = barWide;
		var typeName = "directory"
	} else {
		var Thisbar = barLong;
		var typeName = "enrollment"
	}

	// put the details in the dom!
	$("#data" + type + " .result-file .download.link").html(`<a>${getFileName()}_${typeName}.csv</a>`)

	// fix the description
	$("#data" + type + " .result-description").html(urls[0].text)
	// $("#data" + type + " .result-description").html(urls[0].url)
	

	// at beginning of JSON call, disable inputs
	// $("#leaid-autocompletez").prop("disabled", true);	
	// $(".dropbtn").removeClass("enabled")
	// $(".loader-cont").addClass("active")

	// if result already loaded maybe we don't call it again?

	// loop through generated URLS

	Thisbar.animate(steps.start)

	var masterData = []	

	var downloadTime = (1-steps.start-steps.csvConvert) / urls.length;

	for (var i = 0; i < urls.length; i++) {		

		if (urls.length === 1) {
			var subloadtime = {on:true,time:downloadTime}
		} else {
			var subloadtime = {on:false}
		}

		var responses = await getAllData(urls[i].url,subloadtime,type)
		// make the API call
		var resultData0 = unpackResponses(responses); //let this be animate(0.8)

		// console.log(resultData0)
		// Dan FIX this!!! so that all are verbose
		if (type === "longf") {
			
			masterData = masterData.concat(resultData0)
		} else {
			var resultData = makeVerbose(resultData0,type) //let this be animate(0.9)
			
			masterData = masterData.concat(resultData)
		}
		

		Thisbar.animate(downloadTime*i+steps.start)
	}

	Thisbar.animate(1-steps.csvConvert)

	// tell the results how long your file is!
	$("#data .result-file .download.details").html(`${numberWithCommas(masterData.length)} records and ${meta.selectedattributes.length} attributes`)

	var args = makeCSV(masterData)

	
	$("#data" + type + " .result-file .download.link").data(args)
	
	Thisbar.animate(1.0)
	
	$("#data" + type + " div.progress").addClass("disabled")
	$("#data" + type + " div.download").addClass("active")

	var t1 = performance.now()
	console.log(`it took ${(t1-t0)/1000} seconds for ${type}`)
}

$(".result-file .download.link").click(function(e){
	var args = $(this).data();
	// Convert CSV and place as link
	download(args.data, args.filename + ".csv", 'text/csv;encoding:utf-8');
})

function buildGeographyFilters(data,filter) {	
	// data = filter by which geography you are and your rank...
	// if state(s) selected, get all schools or districts from alldata(a.k.a data)
	// if states and districts selected, districts should be filtered from alldata, schools from avail deduped data
	var subset = listOfUniqueVals(data,filter.proper_name,filter.data_name);

	meta[meta.universe].presets[filter.data_name] = subset;
	$( '#' + filter.data_name +'-autocompletez').autocomplete('setOptions',{lookup: subset});	
}


function withinRadius(point1,point2,radius,unit){


	function toRadians(x) { return x * Math.PI / 180; };

	// convert lat/long to number of miles?
	var lat1 = point1[0],
	lon1 = point1[1],
	lat2 = point2[0],
	lon2 = point2[1];
	
	var R = 6371e3; // metres
	var Phi1 = toRadians(lat1);
	var Phi2 = toRadians(lat2);
	var DeltaPhi = toRadians(lat2-lat1);
	var DeltaLambda = toRadians(lon2-lon1);

	var a = Math.sin(DeltaPhi/2) * Math.sin(DeltaPhi/2) +
	        Math.cos(Phi1) * Math.cos(Phi2) *
	        Math.sin(DeltaLambda/2) * Math.sin(DeltaLambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c; //in meters
	d = d/1000; // in km
	if (unit === "miles") {
		d = d*0.621371; //in miles
	}

	

	// var distance = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));

	if (d <= radius) {
		return true;	
	} else {
		return false;
	}	
}

function filteredSelection(data,exceptions=[]) {
	// filter all filter items from the data besides states obvi cuz they're already z...i thnik
	// don't filter on the items listed in exceptions
	var filterList = meta.filterList.short;

	// console.log(exceptions)
	// console.log(filterList)

	var queryItems = Object.keys(filterList).filter(function(d) {
		if (d !== "year" && exceptions.indexOf(d) === -1) {
			return d 
		}		
	})

	// console.log(queryItems)

	var NumFilters = 0;

	for (var item in filterList) {		

		if (filterList[item].length !== 0 && item !== "year") {
			NumFilters += 1;
		}	
	}	

	var result = data.filter(function(d){
		// if satisfies meta.filterList.short	

		// count the number of successful filters
		var counter = 0;

		for (var i = 0; i < queryItems.length; i++) {
			var item =queryItems[i]

			// if d[item] is inside filterList[item], it passes the test
			if (filterList[item].indexOf(d[item]) !== -1) {
				counter +=1;
			}
		}

		if (counter === NumFilters) {
			return d
		}
	})

	return result;
}

function makeVerbose(data,type) {

	// create map of attributeMetadata by variable name
	var attributeData = meta.metaListOriginal.reduce((obj, item) => (obj[item.variable] = item, obj) ,{});

	if (type === "long") {
		// console.log(attributeData)
		listOfAttributes = Object.keys(attributeData)
	} else {
		listOfAttributes = meta.selectedattributes.map(x=>x.variable)
	}

	// convert preset values from string to json
	for (var i = 0; i < listOfAttributes.length; i++) {

		// if last two characters of string are not correct, make them correct (specifically for fips which is wrong)
		if (attributeData[listOfAttributes[i]].values.slice(-1) != '"') {			
			attributeData[listOfAttributes[i]].values = attributeData[listOfAttributes[i]].values+'"'
		}
		var jsonValues = JSON.parse("{" + attributeData[listOfAttributes[i]].values + "}")

		attributeData[listOfAttributes[i]].valuesJSON = jsonValues;
	}			

	for (var i = 0; i < data.length; i++) {
		for (var item in data[i]) {
			if (attributeData[item]) {
				for (var preset in attributeData[item].valuesJSON){
					if (data[i][item] == preset) {
						data[i][item] = attributeData[item].valuesJSON[preset];
					}
				}
			}
	
		}
	}
	

	// for length of all data
		// for each convertible variable within each entry, convert the result	

	return data
}

// what does this do!
function unpackResponses(data) {
	var master = [];
	var filters = {};

	for (var i = 0; i < data.length; i++) {
		master = master.concat(data[i].results)		
	}

	return master
}	

function listOfUniqueVals(data,param,secondary) {
	var flags = {}, output = [], l = data.length, i;
	for( i=0; i<l; i++) {
	    if( flags[data[i][param]]) continue;
	    flags[data[i][param]] = true;
	    output.push({
	    	value: data[i][param],
	    	primaryKey: param,
	    	data: data[i][secondary],
	    	searchKey: secondary	    	
	    });
	}
	return output
}

// update the right hand side
function updateTotalAndLogic(count) {
	$(".estimated-schools").text(numberWithCommas(count))


	$(".logic-preview").html(generateLogicString());
}

function generateLogicString() {
	var states = meta.filterList.long.state_location.map(d => d.value)
	var districts = meta.filterList.long.leaid.map(d => d.value)
	var schools = meta.filterList.long.ncessch.map(d => d.value)
	var school_level = meta.filterList.long.school_level.map(d => d.value);
	var school_type = meta.filterList.long.school_type.map(d => d.value);
	var charter = meta.filterList.long.charter.map(d => d.value);

	function unpack(array) {
		if (array.length === 0) {
			return "All"
		}
		else if (array.length === 1) {
			return array;
		} 
		else {
			return "(<br><span class='cushion'></span>" + array.join("<i> OR</i><br><span class='cushion'></span>") + "<br>)";
		}
	}	
	
	var roughQuery = `<i>SELECT</i> all schools <i>FROM</i> ${meta.universe} <i>WHERE</i><br>
	<span class="plus">+</span> year = <span class="underline">${meta.filterList.short.year}</span><i> AND</i><br>	
	<span class="plus">+</span> state = <span class="underline">${unpack(states)}</span><i> AND</i><br>
	<span class="plus">+</span> district = <span class="underline">${unpack(districts)}</span><i> AND</i><br>
	<span class="plus">+</span> school = <span class="underline">${unpack(schools)}</span><i> AND</i><br>
	<span class="plus">+</span> school level = <span class="underline">${unpack(school_level)}</span><i> AND</i><br>
	<span class="plus">+</span> school type = <span class="underline">${unpack(school_type)}</span><i> AND</i><br>
	<span class="plus">+</span> charter = <span class="underline">${unpack(charter)}</span>`
	return roughQuery
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getFieldList(attributeMetadata) {
	var fieldList = {};
	// var urlList = []

	// search through the meta data to find selected attributes and combos
	for (var i = 0; i < attributeMetadata.length; i++) {		
		for (var j = 0; j < attributeMetadata[i].subcategories.length; j++) {

			var selected_attributes = attributeMetadata[i].subcategories[j].data.filter(x => x.selected === true);

			if (selected_attributes.length != 0) {

				var search_urls = attributeMetadata[i].subcategories[j].combos.filter(x => x.selected === true);
				if (search_urls.length === 0) {
					search_urls[0] = attributeMetadata[i].subcategories[j].combos[0];
				}

				for (var k = 0; k < search_urls.length; k++) {
					if (!fieldList[search_urls[k].api_combo]) {						
						fieldList[search_urls[k].api_combo] = selected_attributes;	
					} else {
						fieldList[search_urls[k].api_combo] = fieldList[search_urls[k].api_combo].concat(selected_attributes);
					}
					
				}	
			}
		}
	}


	// console.log(fieldList["/schools/ccd/directory/{year}/"])

	return fieldList
}