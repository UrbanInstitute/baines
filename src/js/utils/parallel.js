/* requires:
libs.js
states.js
meta.js
*/

// Functions here:
//// getAllData -- async call to compile multiple API calls into one dataset
//// getMasterUrl -- function used to concatenate metadata url parameters into our master URL 

// var urls = ["https://educationdata.urban.org/api/v1/schools/ccd/directory/2014/","https://educationdata.urban.org/api/v1/schools/ccd/directory/2014/?page=2"]

async function getAllData(masterUrl,timed,type) {

    try {

		var response = await fetch(masterUrl);
		var myStartJson = await response.json();

		// get metadata for later. 
		if (meta.universe === "ccd") {
			endpoint_id = "24"
		}		

		var count = myStartJson.count;
		
		// return early if the call size is too large
		if (count > 1000000) {
			console.log('too big')
			window.alert("This selection is too large! Try something else.");
			return
		}

		var urls = [];

		for (var i = 0; i < Math.ceil(count/1000); i++) {
			var newUrl = masterUrl + "&page=" + (i+1);
			urls.push(newUrl)
		}

		var perTime = timed.time / (Math.ceil(count/1000))	

		var data = []

		/* Normal loops don't create a new scope */
		// $(urls).each(function(i,d) {
		// 	$.getJSON(d, function(result) {
		// 		// sum += data.value;
				
		// 		data.push(result)
		// 	});
		// });

		// Asyncronously call all jsons 
		var data = await Promise.all(
            urls.map(
                url =>
                    fetch(url).then(function(response){
                    		
                    		// if this is a results page, trigger the timer/loader/progress function
                    		if (timed.on) { 
                    			if (type === "wide") {
                    				barWide.animate(barWide.value() + perTime )                    		
                    			} 
                    			else {
                    				barLong.animate(barWide.value() + perTime )                    		
                    			}
                    		}

	                        return response.json();
	                    }
                    )));		
		console.log('done getting data from ' + masterUrl)
		return (data)
 
    } catch (error) {
        console.log(error)
 		// show error

 		$(".error-container").addClass("active")
 		$(".loader-cont").removeClass("active")


        throw (error)
    }
}

function getMasterUrl(meta,state,otherfilters) {
	var filterItemsList = [];
	var thisUniverse = meta.universe;

	// // list of possible variables
	// meta[thisUniverse].allVars;

	// Add the state for this URL
	filterItemsList.push("fips=" + state.fips)
	filterItemsList.push("year=" + meta.filterList.short.year)

	// add filter fields to narrow
	if (otherfilters) {
		for (var item in meta.filterList.short) {
			if (meta.filterList.short[item].length !== 0 && item !== "state_location" && item !== "year") {
				filterItemsList.push(item + "=" + meta.filterList.short[item])		
			}		
		}
	}
	

	// add fields that you want to return
	if (meta[thisUniverse].shortFields.length != 0) {
		filterItemsList.push("fields=" + meta[thisUniverse].shortFields)
	}

	var queryString = filterItemsList.join("&");

	var masterUrl = meta.rootURL + meta.api + meta.universe + "/" + meta.primaryVar + "/?" + queryString;
	return masterUrl;
}