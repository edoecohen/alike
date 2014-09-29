$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var query = $(this).find("input[name='tags']").val();
		getRecommendations(query);
	});

	$('.inspiration-getter').submit( function(event){
		$('.results').html('');
		var tags = $(this).find("input[name='answerers']").val();
		getDudes(tags);
	});


	// this function takes the question object returned by StackOverflow 
	// and creates new result to be appended to DOM
	var showBooks = function(book) {
		
		// clone our result template code
		var result = $('.templates .book').clone();
		
		// Set the Name properties in the result of the Books
		var questionElem = result.find('.question-text a');
		questionElem.attr('href', book.results.wUrl);
		questionElem.text(book.results.name);

		// set the #views for question property in result
		var teaser = result.find('.book-teaser');
		teaser.text(book.results.wTeaser);

		return result;
	};


	// this function takes the results object from StackOverflow
	// and creates info about search results to be appended to DOM
	var showSearchResults = function(query, resultNum) {
		var total = resultNum + ' results for <strong>' + query;
		return total;
	};

	// takes error string and turns it into displayable DOM element
	var showError = function(error){
		var errorElem = $('.templates .error').clone();
		var errorText = '<p>' + error + '</p>';
		errorElem.append(errorText);
	};

	// takes a string of semi-colon separated tags to be searched
	// for on StackOverflow
	var getRecommendations = function(query) {
		
		// the parameters we need to pass in our request to TasteKids's API
		var request = {
			q: query,
			f: "gifted2903",
			k: "nwfhotk2owzk",
			format: "JSON",
			jsonp: "callback"
		};
		
		var result = $.ajax({
			url: "http://www.tastekid.com/ask/ws",
			data: request,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			var searchResults = showSearchResults(request.tagged, result.results.length);

			$('.search-results').html(searchResults);

			$.each(result.results, function(i, item) {
				var question = showBooks(item);
				$('.results').append(question);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
	};

});
