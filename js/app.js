$(document).ready( function() {
	
		
	// USER SUBMITS A QUERY
	$('.recommendation-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').empty();
		// get the value of the tags the user submitted
		var query = $(this).find("input[name='query']").val();
		getRecommendations(query);
		getAmazonItemInfo(query);
	});

	var allRecs = [];
	var books = "//books";
	var authors = "//authors";

	// GET BOOK RECOMMENDATIONS
	var getRecommendations = function(query) {
		
		// the parameters we need to pass in our request to TasteKid's API
		var request = {
			f: "gifted2903",
			k: "nwfhotk2owzk",
			format: "JSON",
			verbose: 1
		};

		// GET BOOK RECOMMENDATIONS
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query+books+"&jsonp=bookRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.done(bookRecs = function (myData) {

			// SHOW THE QUERY RESULTS FIRST
			$.each(myData.Similar.Info, function(i, item) {
				var showResult = showRec(item);
				$('.results').prepend(showResult);
			});

			// PUSH ALL BOOK RECS INTO allRecs ARRAY
			$.each(myData.Similar.Results, function(i, item) {
		        allRecs.push({
		            Name: item.Name, 
		            wUrl: item.wUrl,
		            Type: item.Type,
		            wTeaser: item.wTeaser
		        });
			});
			
			//SHOW BOOK RECOMMENDATIONS IN THE RESULTS
			$.each(allRecs, function(i, item) {
				var resultItem = showRec(item);
				$('.results').append(resultItem);
			});

		//.fail(function(jqXHR, error, errorThrown){
		//	var errorElem = showError(error);
		//	$('.search-results').append(errorElem);
		//});
		});

		console.log(allRecs);
		
	};

// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {
		
		// CLONE OUR RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();

		// SET THE TITLE FOR THE BOOK
		var bookTitle = result.find('.recTitle a');
		bookTitle.text(recommendation.Name);
		bookTitle.attr('href', recommendation.wUrl);

		// SET THE TITLE OF THE BOOK
		var recType = result.find('.recType');
		recType.text(recommendation.Type);

		// SET THE DESCRIPTION OF THE BOOK
		var bookDescription = result.find('.recDescription');
		bookDescription.text(recommendation.wTeaser);

		// When user clicks 'Alike' take the recTitle and pass into query
		var alikeButton = result.find('.alikeButton');
		alikeButton.on('click', function() {
			var query = recommendation.Name;
			$('.results').empty();
			getRecommendations(query);
		});

		return result;
	};

	
	
	//getAmazonItemInfo("catcher in the rye");
	//var catcher = getAmazonItemInfo("catcher in the rye");
	//var catcherParsed = xml2json.parser(catcher);


});


