$(document).ready( function() {

	var container = $('#masonry-con');

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

	// GET RECOMMENDATIONS
	var getRecommendations = function(query) {
		container.removeData().empty();

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
		// SHOW THE QUERY RESULTS FIRST
			$.each(myData.Similar.Info, function(i, item) {
				var showResult = showRec(item);
				$('.results').prepend(showResult);
			});
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				$('.results').append(resultItem);	
			});
			modals();
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
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				$('.results').append(resultItem);
			});
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
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				$('.results').append(resultItem);
			});
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
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				$('.results').append(resultItem);
			});
		});
	};

// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {
		
		// CLONE OUR RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();

		// PLACE THE IMAGE
		var recImg = result.find('.recImg');

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
					var recImg = result.find('.recImg img');
					recImg.attr('src', imageURL);
				
					//Initiate your masonry
					container.imagesLoaded(function(){ 
					    container.masonry({
					        columnWidth: 60,
					  		itemSelector: '.item',
					  		gutter: 15
					    }); 
					});
				});
			};
			
			function BuildBingApiUri(query) {
		 		//Build an uri for the Bing API call.                                
				var bingApiUrl = "https://api.datamarket.azure.com/Bing/Search/v1/Image";
				// var bingApiImageCount = "1";                
				 
				var s = bingApiUrl +
				"?Query=%27" + query + "%20" + recommendation.Type + "%27" +
				//"&image.count=" + bingApiImageCount +
				//"&Image.Offset=" + 0 +
				"&$format=json";
				 
				return s;                
			};    

			bingSearch(recommendation.Name);

		}; 
		placeImage();

		// SET THE TITLE FOR THE BOOK
		var recTitle = result.find('.recTitle');
		recTitle.text(recommendation.Name);
		//recTitle.attr('href', recommendation.wUrl);

		// SET THE TYPE OF THE BOOK
		var recType = result.find('.recType');
		recType.addClass(recommendation.Type);

		// SET THE DESCRIPTION OF THE BOOK
		var recDescriptionText = result.find('.text');
		recDescriptionText.text(recommendation.wTeaser);

		var videoURL = recommendation.yUrl;
		var recVideoHolder = result.find('.recVideoHolder');
		recVideoHolder.html('<iframe width="480" height="360" src="' + videoURL + '?rel=0" frameborder="0" allowfullscreen></iframe>');

		var videoType = result.find('.video');
		var setVideoType = function () {
			if (recommendation.Type == 'movie' || 'show') {
				videoType.text("Trailer");
			}
			else if (recommendation.Type == 'music') {
				videoType.text("Music Video");
			}
			else {
				videoType.text("");
			}
		};
		setVideoType();

		return result;		
	};

// ITEM OPENS TO SHOW DESCRIPTION
	var modals = function() {
		$('.recImg').bind('click', function(event) {
			if($(this).parent().hasClass('gigante')) {
				return;
			}
			else {
				event.stopPropagation();
				$('.gigante').find('.recDescription').fadeOut();
				$('.gigante').removeClass('gigante');
				$(this).parent().addClass('gigante');
				$(this).find('.recDescription').fadeIn();
				container.masonry();
				console.log("Image was clicked correctly");
			};
		});

		$('.video').on('click', function(event) {
			event.stopPropagation();
	  		$(this).parent().parent().parent().parent().find('.recVideo').modal({
	  			fadeDuration: 250,
	  			showClose: true
	  		});
	  		return false;
		});

		$('.recVideo').on('modal:open', function () { 
			var videoHTML =  $(this).parent().find('.recVideoHolder').html();
			$(this).html(videoHTML);
			console.log("Video modal is open!")
		});

		$('.recVideo').on('modal:close', function () {
			$(this).html('');
			console.log("Video is removed!");
		});

		$('html').click(function() {
			$('.gigante').find('.recDescription').fadeOut();
			$('.gigante').removeClass('gigante');
			container.masonry();
		});
	};

	/*$( document ).ajaxStop(function() {
		$('.recTitle').on('click', function() {
			var query = 
			getRecommendations(query);
		});
	});*/

	$(document).ajaxComplete(function() {
		$('.recTitle').on('click', function() {
			var query = $(this).text();
			console.log(query);
			getRecommendations(query);
		});

		$('#masonry-con').show();
	});


});








