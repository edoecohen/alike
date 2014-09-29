$(document).ready( function() {
	
		
	// USER SUBMITS A QUERY
	$('.recommendation-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var query = $(this).find("input[name='query']").val();
		getRecommendations(query);
	});


	// GET BOOK RECOMMENDATIONS
	var getRecommendations = function(query) {
		
		// the parameters we need to pass in our request to TasteKid's API
		var request = {
			f: "gifted2903",
			k: "nwfhotk2owzk",
			format: "JSON",
			jsonp: "handleToReturn",
			verbose: 1
		};
		
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query,
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET",
		})

		//handleToReturn = function (myData) {
		//	console.log(myData);
		//	console.log(myData.Similar.Results);
		//}
		
		.done(handleToReturn = function (myData) {
			$.each(myData.Similar.Results, function(i, item) {
				var book = showBook(item);
				$('.results').append(book);
			});
		});
		//.fail(function(jqXHR, error, errorThrown){
		//	var errorElem = showError(error);
		//	$('.search-results').append(errorElem);
		//});
	};

// SHOW RESULTS FUNCTION
	var showBook = function(book) {
		
		// CLONE OUR RESULT TEMPLATE CODE
		var result = $('.templates .bookResult').clone();

		// SET THE TITLE FOR THE BOOK
		var bookTitle = result.find('.bookTitle a');
		bookTitle.text(book.Name);
		bookTitle.attr('href', book.wUrl);

		// SET THE DESCRIPTION OF THE BOOK
		var bookDescription = result.find('.bookDescription');
		bookDescription.text(book.wTeaser);

		return result;
	};


});
