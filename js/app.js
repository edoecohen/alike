$(document).ready( function() {

var allRecs = [];	

	// USER SUBMITS A QUERY
	$('.recommendation-getter').submit( function(event){
		// zero out results if previous search has run

		// get the value of the tags the user submitted
		var query = $(this).find("input[name='query']").val();
		getRecommendations(query);
	});

	var music = "//music";
	var books = "//books";
	var authors = "//authors";
	var movies = "//movies";
	var shows = "//shows";

	// GET BOOK RECOMMENDATIONS
	var getRecommendations = function(query) {
		$('.results').empty();
		allRecs.length = 0

		// the parameters we need to pass in our request to TasteKid's API
		var request = {
			f: "gifted2903",
			k: "nwfhotk2owzk",
			format: "JSON",
			verbose: 1
		};

		// GET MUSIC RECOMMENDATIONS
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query+music+"&jsonp=musicRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.success(musicRecs = function (myData) {
			allRecs.push(myData.Similar.Results);
		});

		// GET BOOK RECOMMENDATIONS
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query+books+"&jsonp=bookRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.success(bookRecs = function (myData) {
			allRecs.push(myData.Similar.Results);
		});

		// GET MOVIE RECOMMENDATIONS
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query+movies+"&jsonp=movieRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.success(movieRecs = function (myData) {
			allRecs.push(myData.Similar.Results);
		});

		// GET TV RECOMMENDATIONS
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q="+query+shows+"&jsonp=showRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.success(showRecs = function (myData) {

			// SHOW THE QUERY RESULTS FIRST
			$.each(myData.Similar.Info, function(i, item) {
				var showResult = showRec(item);
				$('.results').prepend(showResult);
			});

			allRecs.push(myData.Similar.Results);
			console.log(allRecs);
			
			//SHOW ALL RECOMMENDATIONS IN THE RESULTS
			for (index = 0; index < allRecs.length; ++index) {
			    $.each(allRecs[index], function(i, item) {
					var resultItem = showRec(item);
					$('.results').append(resultItem);
				});
			};	
		});

		console.log(allRecs);
	};

// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {
		
		// CLONE OUR RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();

		// PLACE THE IMAGE
		var placeImage = function () {
			
			var imageURL;

			// SEARCH FOR THE QUERY IMAGE VIA BING
			function bingSearch(query) {            
			//Build a new API uri.
				var bingApiAppId = ":B5fcSyue4p3NPOJywYMxTf2ZkpAxGE2i75rJs2BPbgw";
				var encodedAppKey = btoa(bingApiAppId);
				var bingUri = BuildBingApiUri(query);

		  		//Make the API call.        
				var bingResult = $.ajax({
				url: bingUri,
				type: 'GET',
				headers: {	"Authorization": "Basic " + encodedAppKey}
				})
				.success( bingResult = function (myData){
					imageURL = myData.d.results[0].MediaUrl;
					var recImage = result.find('.recImage img');
					recImage.attr('src', imageURL);
					console.log(imageURL);
				});
			};
			
			function BuildBingApiUri(query) {
		 		//Build an uri for the Bing API call.                                
				var bingApiUrl = "https://api.datamarket.azure.com/Bing/Search/v1/Image";
				// var bingApiImageCount = "1";                
				 
				var s = bingApiUrl +
				"?Query=%27" + query + "%27" +
				//"&image.count=" + bingApiImageCount +
				//"&Image.Offset=" + 0 +
				"&$format=json";
				 
				return s;                
			};    

			bingSearch(recommendation.Name);

		}; 
		placeImage();

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
			getRecommendations(query);
		});

		return result;
	};


           

});


