$(document).ready( function() {
	
	
	var getRecommendations = function(query) {
		
		// the parameters we need to pass in our request to TasteKid's API
		var request = {
			q: query,
			f: "gifted2903",
			k: "nwfhotk2owzk",
			format: "JSON",
			jsonp: "handleToReturn",

		};
		
		$.ajax({
			url: "http://www.tastekid.com/ask/ws",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET",
		});


		handleToReturn = function (myData) {
			console.log(myData);
			console.log(myData.Similar.Results);
		};
		//.done(function(result) {
		
			//$.each(result.results, function(i, item) {
			//	var question = showBooks(item);
			//	$('.results').append(question);
			//});
		//});
		//.fail(function(jqXHR, error, errorThrown){
		//	var errorElem = showError(error);
		//	$('.search-results').append(errorElem);
		//});
	};

	
	// USER SUBMITS A QUERY
	$('.recommendation-getter').submit( function(event){
		// zero out results if previous search has run
		// $('.results').html('');
		// get the value of the tags the user submitted
		var query = $(this).find("input[name='query']").val();
		getRecommendations(query);
		console.log(query);
	});

});
