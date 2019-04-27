// ANY UTILITIES CAN BE PUT HERE


// This adds the options to the dropdowns!
function addDropdownOptions(data,div,type) {
	if (type.substring(0,4) !== "year") {
		for (var i = 0; i < data.length; i++) {
		    var option = "<div class='option filter' data-type='" + type +"' data-id='"+ data[i].id +"'>" + data[i].value +"</div>"
		    $('#' + div).append(option)
		} 	
	} else {
		$('#' + div).empty();

		
		for (var i = data.end; i >= data.start; i--) {
		    var option = "<div class='option year' data-type='" + type +"' data-id='year"+ i +"'>" + i +"</div>"
		    $('#' + div).append(option)
		} 	
	}
}

