/* requires:
libs.js
states.js
meta.js
*/

// functions contained here
// GenerateAndDownload() 
// generateFinalURLS() 
// getFileName(geography) 
// var download = function(content, fileName, mimeType) 

async function GenerateAndDownload() {
	var urls = generateFinalURLS();
	
	// Get metadata list for making verbose later, for every endpoint in our URLS
	var allEndPoints = [];
	allEndPoints = allEndPoints.concat(urls.wide.map(d=>"https://educationdata.urban.org/api/v1/api-endpoint-varlist/?endpoint_id=" + d.endpoint_id))
	allEndPoints = allEndPoints.concat(urls.long.map(d=>"https://educationdata.urban.org/api/v1/api-endpoint-varlist/?endpoint_id=" + d.endpoint_id))


	meta.metaListOriginal = [];

	for (var i = 0; i < allEndPoints.length; i++) {
		var metaResponse = await getAllData(allEndPoints[i],{on:false})
		var unpacked = unpackResponses(metaResponse);
		meta.metaListOriginal = meta.metaListOriginal.concat(unpacked)
	}	

	if (urls.wide.length != 0) {		
		getResults(urls.wide,"wide")	
	} 
	if (urls.long.length != 0) {		
		getResults(urls.long,"long")	
	}

	getDataDictionary()

	// Generate the URLS that will be avail for download

	// List out URLS avail for download
}

function getDataDictionary(){
	var steps = {
		start: 0.05,
		csvConvert: 0.01
	}

	// put the details in the dom!
	$("#dictionary .result-file .download.link").html(`<a>${getFileName()}_datadictionary.csv</a>`)
	
	bar2.animate(steps.start)

	for (var i = 0; i < meta[meta.universe].endpoints.length; i++) {
		if (meta[meta.universe].endpoints[i].is_long === true) {
			for (var j = 0; j < meta.metaListOriginal.length; j++) {
				if (meta[meta.universe].endpoints[i].endpoint_id == meta.metaListOriginal[j].endpoint_id) {
					meta.metaListOriginal[j].is_long = true;
				}
			}
		}
	}

	var attributes = meta.metaListOriginal.filter(function(d){
		// if d.variable is in meta.selectedattributes variables
		// and if d.endpoint_id is in

		if (d.is_long === true) {
			return d
		}

		if (meta.selectedattributes.map(x => x.variable).indexOf(d.variable) !== -1) {
			var index = meta.selectedattributes.map(x => x.variable).indexOf(d.variable)

			if (d.endpoint_id == meta.selectedattributes[index].endpoint_id) {
				return d
			}
		}
	}).map(function(d){
			return {
				variable:d.variable,
				label:d.label,
				description:d.description,
				data_type:d.data_type,
				endpoint_id:d.endpoint_id
			}
		})

	bar2.animate(0.5)

	var args = makeCSV(attributes)

	args.filename = args.filename + "_datadictionary"

	$("#dictionary .result-file .download.link").data(args)



	bar2.animate(1.0)
	
	$("#dictionary div.progress").addClass("disabled")
	$("#dictionary div.download").addClass("active")

	// take the attribute metadata and remove items not listed in meta.selectedattributes. 

	// zip into csv
	// post
}

function makeCSV(masterData) {

	////////// Make the results a CSV ////////////

	// Building the CSV from the Data two-dimensional array
	// Each column is separated by ";" and new line "\n" for next row
	var csvContent = '';
	
	var headers = "\"" + Object.keys(masterData[0]).join('","') + "\"" + '\n';
	csvContent += headers;

	masterData.forEach(function(infoObject, index) {
	  infoArray = Object.values(infoObject);

	  // put a quote mark on the first item in each line		  		  
	  // put a trailing quote mark on the last item in each line		
	  // add quotes around everything else as well
	  dataString = "\"" + infoArray.join('","') + "\"";

	  // Add the whole line to the content
	  csvContent += index < masterData.length ? dataString + '\n' : dataString;
	});
	
	var args = {
		data: csvContent,
		filename: getFileName(),			
	};

	return args
}

function generateFinalURLS() {

	// clear existing URLS
	meta.generatedURLS = {
		"wide":[],
		"long":[]
	};

	// get base url
	var baseURL = `${meta.rootURL}${meta.api}${meta.universe}/${meta.primaryVar}`

	// console.log(baseURL)
	
	// get year
	var year = meta.filterList.short.year;
	
	// can call from unchainables/geofilters?
	var endQueryTypes = ["school_type","school_level","charter"];
	var endQueryTextTypes = ["school type","school level","charter"];
	var endQueries = [];
	var endQueriesText = [];	

	for (var i = 0; i < endQueryTypes.length; i++) {
		if (meta.filterList.short[endQueryTypes[i]].length > 0) {			
			endQueries.push(`&${endQueryTypes[i]}=${meta.filterList.short[endQueryTypes[i]].join(",")}`)
			
			endQueriesText.push(`${endQueryTextTypes[i]} of ${meta.filterList.long[endQueryTypes[i]].map(d=>d.value).join(", ")}`)
		}
	}



	// chain together school types, levels, charter
	endQueries = endQueries.join("")
	endQueriesText = endQueriesText.join(" and ");
	// console.log(endQueriesText)

	// update list of fields here

	var urlList = getFieldList(meta.attributeMetadata);	

	if (endQueriesText.length !== 0) {
		endQueriesText = ", with " + endQueriesText	
	}	

	meta.selectedattributes = []

	// console.log(urlList)

	for (var url in urlList) {
		
		var theseAttributes = urlList[url].map(function(a){
			return {variable:a.variable,endpoint_id:a.endpoint_id}
		});

		meta.selectedattributes = meta.selectedattributes.concat(theseAttributes)

		var endpoint = urlList[url][0].endpoint_id;


		// DAN FIX
		if (url === "/schools/ccd/directory/{year}/") {
			// If its Ccd directory, use 
			// https://educationdata.urban.org/api/v1/api-db-values/ccd/ncessch/?year=2014&fields=ncessch,lea_name,zip_mailing,leaid
			// do the old way			

			var fields = "&fields=" + theseAttributes.map(x=>x.variable).join(",")

			oldWay(baseURL,year,endQueries,endQueriesText,fields,endpoint)
		} else {

			// do the new way
			newWay(url,theseAttributes,endpoint,year)
		}

	}

	// if state, ask by state for BOTH
	// if district, ask by 
		// chained district for enrollment
		// individual district for directory
	// if individual school, ask by
		// chained school name for enrollment
		// individual school name for directory

	return(meta.generatedURLS)
}

function newWay(url,theseAttributes,endpoint,year) {
	if (url.slice(-1) === "/") {
		var leader = "?"
	} else {
		var leader = "&"
	}

	// if schools are selected, go this way. 
	if (meta.filterList.short.ncessch.length > 0) {
		// create a list of school IDs

		geo = meta.filterList.short.ncessch.map(x=>+x.slice(-5)).join(',');

		// get list of districts
		var fields = leader + "school_id=" + geo;

	}
	// else if districts are selected, go this way. 
	else if (meta.filterList.short.leaid.length > 0) {
		
		// create a list of district IDs		
		geo = meta.filterList.short.leaid.map(x=>+x).join(',');		

		// get list of districts
		var fields = leader + "leaid=" + geo;
		
	}

	// else go states way
	else {
		// could i just do this Map above instead of the 
		geo = meta.filterList.long.state_location.map(x=>x.fips).join(',');
		// create a list of state IDs
		var fields = leader + "fips=" + geo;
	}	

	url = url.replace("{year}", year);
	// var finalURL = `${meta.rootURL}/api/v1${url}&${fields}`
	// Dan FIX when you get the correct root URL working after its merged off of stage
	var finalURL = `https://educationdata-stg.urban.org/api/v1${url}${fields}`	

// FIX THIS WHEN YOU GO TO NON-ENROLLMENT MULTITAB
	meta.generatedURLS.long.push({
		text: `Enrollment info for ${year}`,
		type: meta.universe,
		// filename: getFileName(meta.filterList.long.ncessch[i].data),
		url: finalURL,
		endpoint_id:endpoint
	})
}

function oldWay(baseURL,year,endQueries,endQueriesText,fields,endpoint){
		// if there's districs (or non-chains) do district specific
	// generate ccd files!...in future use unchainable geo fitler meta info

	// if schools are selected, go this way. 
	if (meta.filterList.short.ncessch.length > 0) {
		for (var i = 0; i < meta.filterList.long.ncessch.length; i++) {
			// for every district, generate a ccd file
			var geography = `ncessch=${meta.filterList.long.ncessch[i].data}`;			
			var finalURL = `${baseURL}/?year=${year}&${geography}${endQueries}${fields}`;
			meta.generatedURLS.wide.push({
				// text: `All schools for ${meta.filterList.long.ncessch[i].value} in the year ${year}${endQueriesText}`,
				text: `Directory info for ${year}`,
				type: meta.universe,
				// filename: getFileName(meta.filterList.long.ncessch[i].data),
				url: finalURL,
				endpoint_id:endpoint
			})
		}
	}

	else if (meta.filterList.short.leaid.length > 0) {
		for (var i = 0; i < meta.filterList.long.leaid.length; i++) {
			// for every district, generate a ccd file
			var geography = `leaid=${meta.filterList.long.leaid[i].data}`;			
			var finalURL = `${baseURL}/?year=${year}&${geography}${endQueries}${fields}`;
			meta.generatedURLS.wide.push({
				// text: `All schools for ${meta.filterList.long.leaid[i].value} in the year ${year}${endQueriesText}`,
				text: `Directory info for ${year}`,
				type: meta.universe,
				// filename: getFileName(meta.filterList.long.leaid[i].data),
				url: finalURL,
				endpoint_id:endpoint
			})
		}
	}  	

	 else {
		// else list all states together
		var states = meta.filterList.long.state_location.map(d=>d.fips).join(",");
		var textStates = meta.filterList.long.state_location.map(d=>d.value).join(", ")		
		var geography = `fips=${states}`;
		var finalURL = `${baseURL}/?year=${year}&${geography}${endQueries}${fields}`;

		meta.generatedURLS.wide.push({
			// text: `All schools for ${textStates} in the year ${year}${endQueriesText}`,
			text: `Directory info for ${year}`,
			type: meta.universe,
			// filename: getFileName(meta.filterList.long.state_location.map(d=>d.data).join("-")),
			url: finalURL,
			endpoint_id:endpoint
		})
	}
}

function getFileName() {	
	// var year = meta.filterList.short.year.join("-");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();

	if (dd < 10) {
	  dd = '0' + dd;
	}

	if (mm < 10) {
	  mm = '0' + mm;
	}

	today = mm +"."+ dd +"."+ yyyy;
	var filename = `EducationDataPortal_${today}`
	return filename
}

// The download function takes a CSV string, the filename and mimeType as parameters
// Scroll/look down at the bottom of this snippet to see how download is called
var download = function(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([content], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
  }
}


// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

var barWide = new ProgressBar.Line(ProgDataWide, {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 100,
  color: 'rgb(162,162,161)',
  trailColor: '#eee',
  trailWidth: 2,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#999',
      position: 'absolute',
      right: '-50px',
      top: '0px',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: 'rgb(162,162,161)'},
  to: {color: '#1696d2'},
  step: (state, barWide) => {
    barWide.setText(Math.round(barWide.value() * 100) + ' %');
    barWide.path.setAttribute('stroke', state.color);
  }
});

var barLong = new ProgressBar.Line(ProgDataLong, {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 100,
  color: 'rgb(162,162,161)',
  trailColor: '#eee',
  trailWidth: 2,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#999',
      position: 'absolute',
      right: '-50px',
      top: '0px',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: 'rgb(162,162,161)'},
  to: {color: '#1696d2'},
  step: (state, barLong) => {
    barLong.setText(Math.round(barLong.value() * 100) + ' %');
    barLong.path.setAttribute('stroke', state.color);
  }
});


var bar2 = new ProgressBar.Line(ProgDict, {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1000,
  color: 'rgb(162,162,161)',
  trailColor: '#eee',
  trailWidth: 2,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#999',
      position: 'absolute',
      right: '-50px',
      top: '0px',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: 'rgb(162,162,161)'},
  to: {color: '#1696d2'},
  step: (state, bar2) => {
    bar2.setText(Math.round(bar2.value() * 100) + ' %');
    bar2.path.setAttribute('stroke', state.color);
  }
});