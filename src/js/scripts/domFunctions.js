/* requires:
libs.js
states.js
meta.js
buildFilters.js
*/

// functions

function passStringEncode(subCat) {

	if (subCat === "" || subCat == null) {
		return "None"	
	} else {
		var passStringEncoded = subCat.toLowerCase()
		passStringEncoded = passStringEncoded.replace(/[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
		return passStringEncoded;	
	}
}

function removeFromNestedArrays (array,suggestion) {
	for (var i = array.length - 1; i >= 0; --i) {
		// This can work for nested or not nested
    	if (array[i].value == suggestion || array[i] == suggestion) {
    		array.splice(i,1);	    	
	        break;
	    }
	};
}

// add item from source array (meta.presets) to dedupedArray
function addToNestedArray(sourceArray,dedupedArray,selection) {
	for (var i = sourceArray.length - 1; i >= 0; --i) {
    	if (sourceArray[i].value == selection) {    
    		dedupedArray.push(sourceArray[i])		    	
	        break;
	    }
	};
}

function addTag(suggestion,selection) {
	var tagToAdd = `<div data-type=${suggestion.searchKey} data-id=${suggestion.data} class="tagbox filter">${suggestion.value}</div>`
	
	$(selection).find("input,div.dropbtn").after(tagToAdd);

	// any time you add a tag, remove all 
	removeDownload()
}

function removeTag(selection) {
	// remove item from tag list in DOM
	$(selection).remove();	
}

// for the attributes page, add a combo
function addTagCombo(combo,selection) {
	var tagToAdd = `
	<div data-id="${combo.variable}" class="tagbox combo">
		${combo.name}
	</div>
	`

	$(selection).append(tagToAdd);

	$(".tagbox[data-id=" + combo.variable + "]").data(combo);
}

// log that info in metadata
function logChangeInAttributeMetadata(selecter,type,OnOffToggle) {


	if (type === "combos") {
		var descVar = "description",
		thisType = "combos";
	} else if (type === "attributes") {
		var descVar = "variable",
		thisType = "data";
	}

	var changeCat = meta.attributeMetadata.find(x => +x.category_id == +selecter.category_id);

	if (selecter.sub_category === "None") {
		var changeItem = changeCat.subcategories[0][thisType].find(x => passStringEncode(x[descVar]) == passStringEncode(selecter.variable))

	} else {			
		var changeSub = changeCat.subcategories.find(x=> passStringEncode(x.sub_category) == selecter.sub_category);			
		var changeItem = changeSub[thisType].find(x => passStringEncode(x[descVar]) == passStringEncode(selecter.variable))
	}

	// Turn selection ON or OFF or TOGGLE
	if (OnOffToggle === "on") {
		changeItem.selected = true;
	} else if (OnOffToggle === "off") {
		changeItem.selected = false;
	} else {
		changeItem.selected = !changeItem.selected;
	}
}

function removeDownload() {
	// console.log('here')
	$(".results-page").removeClass("active")

	// console.log($(".result-file .download"))

	$(".result-file .download").removeClass("active")

	// not sure if either of these are working...don't think they are?
	$(".result-file .download").empty()
	$("#data .result-description").empty()

	$(".progress").removeClass("disabled")
	barWide.set(0)
	barLong.set(0)
	bar2.set(0)


}

function clearFilters(type) {
	if (type === "all") {
		$(".tagbox.filter").remove();
			meta.filterList.short.state_location = [];
			meta.filterList.short.school_type = [];
			meta.filterList.short.school_level = [];
			meta.filterList.short.leaid = [];
			meta.filterList.short.ncessch = [];
			meta.filterList.short.charter = [];
		
	} else {
		$(".tagbox[data-type=" + type +"]").remove();
		meta.filterList.short[type] = [];
	}
}

// This adds the options to the dropdowns!
function addDropdownOptions(data,div,type) {
	for (var i = 0; i < data.length; i++) {
	    var option = "<div class='option filter' data-type='" + type +"' data-id='"+ data[i].id +"'>" + data[i].value +"</div>"
	    $('#' + div).append(option)
	} 
}


function checkSelected(selection) {
	// console.log($(selection).attr("data-id"))
	var dataID = $(selection).attr("data-id");

	$("[data-id=" + dataID + "]").toggleClass("checked")		
	
	// check to see if parent checkbox needs to be changed
	// change color of master check
	var numBoxes = $(selection).parent().parent().parent().find(".c-entry").length;
	var numBoxesChecked = $(selection).parent().parent().parent().find(".c-entry").children(".checkbox.checked").length;
	var parentSelection = $(selection).parent().parent().parent().children(".checkbox-category-title").children(".checkbox")

	if (numBoxes === numBoxesChecked) {
		// check the master full (remove semi, add checked)
		parentSelection.addClass("checked")
		parentSelection.removeClass("semi")
	} else if (numBoxesChecked === 0) {
		// no checkmark (remove semi, remove checked)
		parentSelection.removeClass("checked semi")
	} else {
		// add checkmark add semi
		parentSelection.addClass("checked semi")
	}

	var selecter = {
		category_id: $(selection).attr("data-category"), 
		sub_category: $(selection).attr("data-sub"),
		variable: $(selection).attr("data-id")
	}		

	// select in metadata
	logChangeInAttributeMetadata(selecter,"attributes","toggle")

}

// builds each category in the attributes section
function buildCategory(category,expanded) {
	function getTitle(){
		var opened = expanded ? "active" : "";
		var checked = expanded ? "checked" : "";
		var common = expanded ? "common" : "";
		return `<div class="checkbox-category-title checkbox-container ">
			<div class="checkbox master ${checked} ${common}"></div>
			<div class="c-title">${category.category}</div>
			<div class="c-count">(${category.count})</div>
			<div class="c-expand ${opened}"></div>			 
		</div>`
		// ${titleGroupBy} removed top level groupby statement 
	}

	function getSubCat(subCat) {
		var opened = expanded ? "" : "hidden";
		var checked = expanded ? "checked" : "";
		var common = expanded ? "common" : "";
		
		
		if (subCat.data[0].sub_category !== "") {				
			var sub = passStringEncode(subCat.data[0].sub_category)
			var visible = "active"
		} else {
			var sub = "None"
			var visible = "hidden"
		}


		var attributes = [];
		for (var i = 0; i < subCat.data.length; i++) {
				
			attributes.push(`
				<div class="c-entry">
					<div 
						data-id=${subCat.data[i].variable} 
						data-category=${subCat.data[i].category_id}
						data-sub=${sub}					
						class="checkbox ${checked} ${common}"
					></div>
					<div class="c-text">${subCat.data[i].label}</div>
				</div>		
			`)
		}

		return `
		<div data-id="${subCat.sub_category}" class="checkbox-container checkbox-subcategory ${opened}">
			<div class="checkbox-subcategory-title ${visible}">
				<div class="c-title">${subCat.sub_category}</div>		
				${getGroupBy(subCat)}
			</div>	
			${attributes.join('')}
		</div>`

		
	}

	function getGroupBy(subCat) {
		// list of options in for loop sent to array

		var combos = subCat.combos;
		var combosFinished = [];

		for (var i = 0; i < combos.length; i++) {
			if (combos[i].description !== "") {
				// console.log(combos[i])
				combosFinished.push(`
					<div class="option combo" 
						data-id="${passStringEncode(combos[i].description)}" 
						data-sub="${passStringEncode(subCat.sub_category)}" 
						data-category="${subCat.data[0].category_id}" 						
					>
						${combos[i].description}
					</div>
				`)
			}
		};

		if (combosFinished.length > 1) {
			return `
				<div class="c-grouping-container">
					GROUP BY
					<div class="c-grouping-dropdown">
						<div class="dropbtn enabled groupby">
				          <span class="drop-inner">Select</span>
				          <span class="arrow"></span>
				          <div id="myDropdownX" class="dropdown-content">
				          	${combosFinished.join('')}
				          </div>
				        </div>
					</div>
				</div>
				<div class="c-grouping-combos"></div>
				`
		} else {
			return ''
		}
	}
	
	var title = getTitle();	
	var subcats = [];
	for (var i = 0; i < category.subcategories.length; i++) {
		subcats.push(getSubCat(category.subcategories[i]))
	}
	
	var categoryFinished = `<div data-id="${category.category_id}" class="checkbox-category-body">${title}${subcats.join('')}</div>`;
	return categoryFinished
}

async function addAttributeOptions(variableUrl,endpoints) {	
	// fetch attribute metadata (all)
	var response = await fetch(variableUrl);
	var variableJSON = await response.json();

	// process attribute metadata into grouped lists

	// console.log(variableJSON.results)

		// limit to what is in the enpoints we need

	// filter attributes by whether they appear in the list of meta endpoints
	// Dan FIX, DAN HERE might be able to make this not endpoints but instead category id's
	var filteredAttributes = variableJSON.results.filter(
	    function(e) {	    	
	      return this.indexOf(e.endpoint_id) >= 0;
	    },endpoints.map(x=>x.endpoint_id)
	);
	
	// sort Attributes
	filteredAttributes = filteredAttributes.sort(function(a,b){
		return a.category_id - b.category_id
	})

	// store attributes in Meta
	var commonlyUsed = {
		"category_id":0,
		"category":"Commonly used",
		"subcategories":[{
				"sub_category":"",
				"combos":[],
				"data": []
			}			
		],
		"count":0
	};

	// group Attributes
	for (var i = 0; i < filteredAttributes.length; i++) {
		
		// if filteredAttributes[i].category_id ! exist, create		
		if (typeof meta.attributeMetadata.find(x => x.category_id === filteredAttributes[i].category_id) == 'undefined') {
			meta.attributeMetadata.push({
				"category_id":filteredAttributes[i].category_id,
				"category":filteredAttributes[i].category,
				"subcategories":[],
				"count":0
			})
		}

		var category = meta.attributeMetadata.filter(x => x.category_id === filteredAttributes[i].category_id)[0];
		
		// if filteredAttributes[i].subcategory ! exist, create
		if (typeof category.subcategories.find(x => x.sub_category === filteredAttributes[i].sub_category) == 'undefined') {
			category.subcategories.push({
				"sub_category":filteredAttributes[i].sub_category,
				"combos":[
					{
						api_combo:filteredAttributes[i].api_combo1,
						description:filteredAttributes[i].combo1,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo2,
						description:filteredAttributes[i].combo2,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo3,
						description:filteredAttributes[i].combo3,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo4,
						description:filteredAttributes[i].combo4,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo5,
						description:filteredAttributes[i].combo5,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo6,
						description:filteredAttributes[i].combo6,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo7,
						description:filteredAttributes[i].combo7,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo8,
						description:filteredAttributes[i].combo8,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo9,
						description:filteredAttributes[i].combo9,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo10,
						description:filteredAttributes[i].combo10,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo11,
						description:filteredAttributes[i].combo11,
						selected:false
					},
					{
						api_combo:filteredAttributes[i].api_combo12,
						description:filteredAttributes[i].combo12,
						selected:false
					}
				],
				"data":[]
			})
		}		

		var isPreSelected = false

		// Create list of commonly used attributes
		if (filteredAttributes[i].commonly_used === 1) {
			commonlyUsed.subcategories[0].data.push({
				"variable": filteredAttributes[i].variable,
				"varlist_id": filteredAttributes[i].varlist_id,
				"endpoint_id": filteredAttributes[i].endpoint_id,
				"years_available": filteredAttributes[i].years_available,
				"label": filteredAttributes[i].label,
				"category_id": filteredAttributes[i].category_id,
				"sub_category": filteredAttributes[i].sub_category
			})

			isPreSelected = !isPreSelected
		}

		// add data to that subcategory
		var subcategory = category.subcategories.filter(x => x.sub_category === filteredAttributes[i].sub_category)[0];
		subcategory.data.push({
			"variable": filteredAttributes[i].variable,
			"varlist_id": filteredAttributes[i].varlist_id,
			"endpoint_id": filteredAttributes[i].endpoint_id,
			"years_available": filteredAttributes[i].years_available,
			"label": filteredAttributes[i].label,
			"category_id": filteredAttributes[i].category_id,
			"sub_category": filteredAttributes[i].sub_category,
			"selected": isPreSelected
		})

		category.count+=1;
	}

	commonlyUsed.count = commonlyUsed.subcategories[0].data.length;
	
	// nest commonlyUsed variables and build in DOM
	$(".attribute-option-body").append(buildCategory(commonlyUsed,true))
	
	// build all other attribute categories 
	for (var i = 0; i < meta.attributeMetadata.length; i++) {
		$(".attribute-option-body").append(buildCategory(meta.attributeMetadata[i]),false)
	}

	// pre-check all common pre-checked items
	var categoriesForPreCheck = [];
	for (var i = 0; i < commonlyUsed.subcategories[0].data.length; i++) {	

		$("[data-id=" + commonlyUsed.subcategories[0].data[i].variable + "]").addClass("checked")			

		// get unique pre-checked category list
		if (categoriesForPreCheck.indexOf(commonlyUsed.subcategories[0].data[i].category_id) < 0) {
	      categoriesForPreCheck.push(commonlyUsed.subcategories[0].data[i].category_id)
		}

		// hereh
	}

	// get unique categories to semi check at onset because of prechecked items
	for (var i = 0; i < categoriesForPreCheck.length; i++) {		
		$(".checkbox-category-body[data-id=" + categoriesForPreCheck[i] +"]").children(".checkbox-category-title").children(".checkbox").addClass("checked semi")
	}
	

}

// async function getMetadata(variableUrl) {	
// 	var response = await fetch(variableUrl);
// 	var variableJSON = await response.json();

// 	return variableJSON;
// }

// this function removes a selection from the deduplicated sub list of schools
function removeSelection(currentType,currentSelection,currentSelectionShort) {

	// add selection back into the deduped list (preset list)	
	addToNestedArray(meta.filterList.long[currentType],meta.ccd.presets[currentType],currentSelection)

	// remove selection from filterList Long
	removeFromNestedArrays(meta.filterList.long[currentType],currentSelection)
	// remove selection from filterList short	
	removeFromNestedArrays(meta.filterList.short[currentType],currentSelectionShort)
	
	if (currentType === "state_location") {
		// if currentType is state_location, we're going to remove that states
		// data from the dedupeData and return the remainder		

		dedupeData = removeData(currentType,currentSelectionShort);	

		var fips = justStates.filter(d=>d.value === currentSelection)[0].fips;	
		if (fips < 10) {
			fips = "0" + fips.toString();
		} else {
			fips = fips.toString()
		}
		// we're also going to remove any districts that are in that state
		// any tagbox that's id starts with the correct fips code, remove. 
		$(".tagbox[data-id^=" + fips +"]").remove();

		// ADD IN THE REMOVE OF SCHOOLS FROM STATES HERE
		// ADD IN THE REMOVE OF SCHOOLS WHEN DISTRICT IS REMOVED?



	} else {

		// else, we're going to allData and going to refilter from there. 
		dedupeData = filteredSelection(allData);
	}
	
	// filter what's available in both districts and schools based on selection
	var geofilters = meta[meta.universe].geofilters;

	for (var filter in geofilters) {
		if (geofilters[filter].rank === 0) {
			buildGeographyFilters(filteredSelection(allData,["ncessch"]),geofilters[filter])
		} 
		else {
			// Should this be dedupedata? for districts? or something else?
			buildGeographyFilters(allData,geofilters[filter])		
		}
	}	

	updateTotalAndLogic(dedupeData.length)
}

// this is only used for removing state data from dedupeData
function removeData(currentType,ID) {
	// remove everything with that type/id combo
	var result = dedupeData.filter(function(d){ return d[currentType] !== ID })
	return result;
}


// Event listeners



///////////document is ready ////////////////
$(document).ready(function(){
  	
  	// Add filter options to DOM for dropdowns
  	// add school level options
	addDropdownOptions(meta.ccd.presets.school_level,"myDropdown1","school_level");
	// add school type options
	addDropdownOptions(meta.ccd.presets.school_type,"myDropdown2","school_type");
	// add charter options
	addDropdownOptions(meta.ccd.presets.charter,"myDropdown3","charter");

	// old attribute info
	// var attributeURL = 	"https://educationdata-stg.urban.org/api/v1/api-endpoint-varlist/?endpoint_id=24"
	
	// new attribute list info
	var	attributeURL = "https://educationdata.urban.org/api/v1/api-point-and-click/";
	// endpoints we will use
	var endpoints = meta[meta.universe].endpoints;

	addAttributeOptions(attributeURL,endpoints);

	// running through everything at the start of the load prior to any major API calls

	// Select state first
		// then callback for addState
		// addState(meta);

	// initial state autocomplete 
	$( '#state-autocompletez').autocomplete( {
		lookup: meta.ccd.presets.state_location,
		lookupLimit: 10,
		maxHeight: 350,
		showNoSuggestionNotice: true,
		noSuggestionNotice: function () {
		  return "No state found"
		},
		onSelect: function (suggestion) {
			// clear internal value
			$(this).val('');

			// push current item to list of filtered items (states)
			meta.filterList.long.state_location.push(suggestion);		
			meta.filterList.short.state_location.push(suggestion.data)

			// remove suggestion as option from deduped list
			removeFromNestedArrays(meta.ccd.presets.state_location,suggestion.value)

			// create filters as a result of suggestion (includes API calls)
			addState(meta,suggestion,this);
			
		}
	} );

	// subsequent filters, initally set to inactive

	// load listeners for autocomplete into the dom
	$( '#leaid-autocompletez').autocomplete( {
	  lookup: meta.ccd.presets.leaid,
	  lookupLimit: 10,
	  maxHeight: 350,
	  showNoSuggestionNotice: true,
	  noSuggestionNotice: function () {
	    return "No District found"
	  },
	  onSelect: function (suggestion) {
	  	$(this).val('');

	  	// add tag to DOM
	  	addTag(suggestion,$(this).parent());

	  	// add item to filter list
	  	meta.filterList.long.leaid.push(suggestion);		
		meta.filterList.short.leaid.push(suggestion.data)

		// remove suggestion as option from deduped list
		removeFromNestedArrays(meta.ccd.presets.leaid,suggestion.value)
		
		//filter Data!
		// if filter we want to upate other filter options? 
		
		dedupeData = filteredSelection(allData)

		var geofilters = meta[meta.universe].geofilters;

		for (var filter in geofilters) {			
			// filter rank < active higher rank filter, use dedupe data, 
			// for smaller municipalities, use the deduped data...i.e. you can only pick schools that are in 
			// the already selected districts/cities
			if (geofilters[filter].rank === 0) {
				buildGeographyFilters(filteredSelection(allData,["ncessch"]),geofilters[filter])
			} 
			else {
				buildGeographyFilters(allData,geofilters[filter])		
			}
		}		

		updateTotalAndLogic(dedupeData.length)

	  }
	} );  

	// load listeners for autocomplete into the dom
	$( '#ncessch-autocompletez').autocomplete( {
	  lookup: meta.ccd.presets.ncessch,
	  lookupLimit: 10,
	  maxHeight: 350,
	  showNoSuggestionNotice: true,
	  noSuggestionNotice: function () {
	    return "No School found"
	  },
	  onSelect: function (suggestion) {
	  	$(this).val('');

	  	// add tag to DOM
	  	addTag(suggestion,$(this).parent());

	  	// add item to filter list
	  	meta.filterList.long.ncessch.push(suggestion);		
		meta.filterList.short.ncessch.push(suggestion.data)

		// remove suggestion as option from deduped list
		removeFromNestedArrays(meta.ccd.presets.ncessch,suggestion.value)
		
		//filter Data!
		// if filter we want to upate other filter options? 
		dedupeData = filteredSelection(allData)

		updateTotalAndLogic(dedupeData.length)

	  }
	} );  



	// log which files should be generated in the meta;
	var files = $(".input-area.checkbox");
	for (var i = 0; i < files.length; i++) {
		meta.files.push(files[i].dataset.file)
	}
	
	// filter dropdown actions
	$(document).on("mouseover",".dropbtn.enabled",function(){	
		$(this).children().addClass("hover")
	})
	$(document).on("mouseout",".dropbtn.enabled",function(){
		$(this).children().removeClass("hover")
	})

	$(document).click(function(){
		$('.dropbtn.enabled').children().removeClass("active")
	})

	$(document).on("click",".dropbtn.enabled",function(e){
		e.stopPropagation();		
		// $(".dropdown-content").removeClass("active")
		$(".arrow").removeClass("active")

		$(this).children().toggleClass("active")  		
	})	  

	// when you click on an option from the attributes combo section
	$(document).on("click",".option.combo",function(e){
		var pick = $(this);

		var selecter = {
			category_id: $(pick).attr("data-category"), 
			sub_category: $(pick).attr("data-sub"),
			variable: $(pick).attr("data-id"),
			name: $(pick).text()
		}

		// Add indicator of what is selected in the DOM
		addTagCombo(selecter,pick.parent().parent().parent().parent().parent().children(".c-grouping-combos"))

		// log that info in metadata
		logChangeInAttributeMetadata(selecter,"combos","on")
	});

	$(document).on("click",".tagbox.combo",function(e){		
		var selecter = $(this).data();		

		// remove selection from the metadata
		logChangeInAttributeMetadata(selecter,"combos","off")

		// remove the tag from DOM
		removeTag(this);
	})

	// when you click on an option from the first filter section
	$(document).on("click",".option.filter",function(e){
		var pick = $(this)

		var suggestion = {
			searchKey: pick.attr("data-type"),
			data: pick.attr("data-id"),
			value: pick.text()
		}	

		// add tag for this
		addTag(suggestion,pick.parent().parent().parent());

		// add item to the FilterList
  		meta.filterList.long[suggestion.searchKey].push(suggestion);		
		meta.filterList.short[suggestion.searchKey].push(+suggestion.data)		

		// Filter the damn thang
		dedupeData = filteredSelection(allData);

		// filter what's available in both districts and schools based on selection
		var geofilters = meta[meta.universe].geofilters;

		for (var filter in geofilters) {
			if (geofilters[filter].rank === 0) {
				buildGeographyFilters(filteredSelection(allData,["ncessch"]),geofilters[filter])
			} 
			else {

				// wtf should i do here....i have changed to "allData" which gives you all
				// districts, even if it is a) not in that state b) not satisfying the school level, etc. filter 
				// .therefore we need to figure out how to take allData and filter where state = selected, districts = all WHERE special filter (school level, etc) is set to its specification
				// note, this means that we DO NOT filter be selected leaid nor selected ncessch. YET this seems to 
				// return 0... even when it should return some number. 
				
				// console.log(filteredSelection(allData,["ncessch"]))
				// console.log(filteredSelection(allData,["leaid"]))
				// console.log(filteredSelection(allData))
				// console.log(allData)
				// console.log(dedupeData)
				buildGeographyFilters(allData,geofilters[filter])		
			}
		}	

		// update the display
		updateTotalAndLogic(dedupeData.length);
	})

	// This event listener removes the tagbox when it is clicked. It also adds the selected piece of data back into the filter option list.
	$(document).on("click",".tagbox.filter",function(){

		var currentType = $(this).attr("data-type");
		var currentSelection = $(this).text();	
		var currentSelectionShort = $(this).attr("data-id")

		removeSelection(currentType,currentSelection,currentSelectionShort);

		removeTag(this);
		// MUST REMOVE TAGS AND DO ALL OF THE ABOVE FOR SUB-DISTRICS WHEN THIS IS DONE BY A STATE level

		// remove the links
		removeDownload();

		$(".warning.nullset").remove();


		// if their aren't any states left selected, turn back on the disables
		if (meta.filterList.long.state_location.length === 0) {

			$(".geofilter").prop("disabled", true);				
			$(".dropbtn").removeClass("enabled")
			$(".red").removeClass("disabled")
			$(".generator").addClass("disabled")			
			updateTotalAndLogic(0)
			$(".logic-preview").empty()

			// when there's no states automatically remove everything
			clearFilters("all")
		}
	})

	$(document).on("click",".main-tabs",function(){
		$(".main-tabs").removeClass("active")
		$(this).addClass("active")

		var tabName = $(this).attr("data-tabname")
		$(".major-option").removeClass("active")
		$(".major-option." + tabName).addClass("active")
	})

	$(document).on("click",".clear-selection",function(){			
		$(".warning.nullset").remove();

		var type = $(this).attr("data-type");
		clearFilters(type);
		dedupeData = filteredSelection(allData);
		updateTotalAndLogic(dedupeData.length)
	})


	$(document).on("click","#generate-that",function(){
		// scroll the page downward to the results section

		// BEN THIS IS TO PROTECT FROM NULL SETS
		if (dedupeData.length !== 0) {
			// generate the URLS from the meta, call them (if not too long), return summary to the results section
			$(".results-page").addClass("active")
			var elmnt = document.getElementById("these-results");
			elmnt.scrollIntoView();			
			GenerateAndDownload()
		} else {
			var warning = `<div class="warning red nullset">* Your filters will not yield results. Try adjusting your selections.</div>`
			$(".estimate-preview").append(warning)
		}

		
	})

	// Jquery DOM interactions for Attributes
	// Click a plus button
	$(document).on("click",".c-expand",function(){
		// change the plus to a minus and vv
		$(this).toggleClass("active")
		// change the subcategories from hidden to not, etc.
		$(this).parent().siblings(".checkbox-subcategory").toggleClass("hidden")

	})

	// click checkbox
	$(document).on("click",".checkbox",function(){

		// Click a master checkbox		
		if ($(this).hasClass("master")) {

			$(this).removeClass("semi")
			$(this).toggleClass("checked")

			// if toggle on do one thing
			if ($(this).hasClass("checked")) {
				//selected children checkboxes that are checked
				var children = $(this).parent().siblings(".checkbox-subcategory").children(".c-entry").children(".checkbox:not(.checked)");	
			} else {
				var children = $(this).parent().siblings(".checkbox-subcategory").children(".c-entry").children(".checkbox.checked");
			}
			// if toggle off do another

			for (var i = 0; i < children.length; i++) {
				checkSelected(children[i]);
			}

		} else {
			// else if not master do the checkie!

			// select items in Data
			checkSelected(this);
		}

		// Click commonly Used checkbox
		// if ($(this).hasClass("")) {}
	})

		
		// Click any other checkbox

})

