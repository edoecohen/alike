$(document).ready( function() {

	// COLLECT QUERY FROM USER

	// RUN A TASTEKID SEARCH ON QUERY
	// FOR EACH ITEM RESULT CLONE TEMPLATE AND ENTER INTO CONTAINER
	// GET IMAGES TO ADD FOR ITEMS
	// RUN MASONRY ON CONTAINER
	// ADD YOUTUBE LINKS

	// IF USER CLICKS ON FILTER THEN RUN ANOTHER SEARCH
	// & HIDE OTHER CONTAINERS
	// & CHANGE THE FILTERS TO SHOW NEW FILTER
	// RUN MASONRY ON CONTAINER

	// zero out results if previous search has run


	var changePlaceholders = function () {
		var placeHolders = ["musician", "movie", "book", "author", "tv show"];
		var colors = ['#C50404', '#0499C5', '#7704C5', '#10C504', '#EF970F'];
		var artForm = $('.artForm');
		var i = 0;
		var j = 0;

		setInterval( function () {
			artForm.text(placeHolders[i++]);
			artForm.css("color", colors[j++]);
			if (i >= placeHolders.length) {
				i = 0;
				j= 0;
			}
		}, 1500);
	};
	changePlaceholders();
	
	var query;
	var container;

	var request = {
		f: "gifted2903",
		k: "nwfhotk2owzk",
		format: "JSON",
		verbose: 1
	};
	var myData = [];

	// USER SUBMITS A QUERY
	$('.recommendation-getter').submit( function(event){

		// get the value of the query the user submitted
		query = $(this).find("input[name='query']").val();
		getTasteKid(query, "");
		$('#landing').hide();
		$('#mainCon').removeClass('hidden');
		$(this).find("input[name='query']").val('').focusout();
	});

	/* GET RECOMMENDATIONS
	var getRecommendations = function(query) {
		//container.removeData().empty();
		
	};*/

	var getTasteKid = function (query, type) {
		
		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q=" + query + type + "&jsonp=itemRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})	
		.success(itemRecs = function (myData) {
		
		// CHANGE FILTER & CONTAINER DESTINATION DEPENDING ON RESULT OF QUERY
			var changeFilter = function (category) {
				$(".category:contains(" + category + ")").parent().addClass('selected');
				$(".category:contains(" + category + ")").parent().addClass('loaded');
				$(".category:contains(" + category + ")").parent().find($('.recCount')).text(myData.Similar.Results.length + " Alikes").show();
			};
			if(!$('.filter').hasClass('loaded')) {
				if(myData.Similar.Info[0].Type == "music") {
					changeFilter("Music");
					var container = $("#masonry-con-music");
				}
				else if (myData.Similar.Info[0].Type == "movie") {
					changeFilter("Movies");
					var container = $("#masonry-con-movie");
				}
				else if (myData.Similar.Info[0].Type == "show") {
					changeFilter("TV Shows");
					var container = $("#masonry-con-show");
				}
				else {
					changeFilter("Books");
					var container = $("#masonry-con-book");
				};
			}
			else {
				if(myData.Similar.Results[0].Type == "music") {
					changeFilter("Music");
					var container = $("#masonry-con-music");
				}
				else if (myData.Similar.Results[0].Type == "movie") {
					changeFilter("Movies");
					var container = $("#masonry-con-movie");
				}
				else if (myData.Similar.Results[0].Type == "show") {
					changeFilter("TV Shows");
					var container = $("#masonry-con-show");
				}
				else {
					changeFilter("Books");
					var container = $("#masonry-con-book");
				};
			};
				
		// SHOW THE QUERY RESULTS FIRST
			$.each(myData.Similar.Info, function(i, item) {
				var showResult = showRec(item);
				container.prepend(showResult);
			});

		// SHOW THE RECOMMENDED ITEMS
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				container.append(resultItem);	
			});
			container.show();
			container.masonry();
			modals();
		});
	};
	
	$('#filters').on('click', '.filter', function() {
		var nameOfFilter = $(this).find($('.category')).text();
		var categoryTag;
		
		// PASS NAME OF FILTER TO CATEGORY AND SEARCH NAMES
		if (nameOfFilter == 'Music') {
			container = $('#container-con-music');
			searchTag = '//music';
		}
		else if (nameOfFilter == "Books") {
			container = $('#container-con-book');
			searchTag = '//books';

		}
		else if (nameOfFilter == "Movies") {
			container = $('#container-con-movie');
			searchTag = '//movies';
		}
		else {
			container = $('#container-con-show');
			searchTag = '//shows';
		};

		container.siblings().hide();

		// IF THIS QUERY HAS BEEN LOADED HIDE OTHERS AND SHOW THIS
		if ($(this).hasClass('loaded')) {
			$('.results').hide();
			container.show();
			container.masonry();
			console.log(container);
		}
		else {
			$(this).addClass('loaded');
			getTasteKid(query, searchTag);
			$( document ).ajaxComplete(function() {
				$('.results').hide();
				container.show();
			});
			console.log(container);
			container.masonry();
		};
		

		$('.filter').removeClass('selected');
		$('.filter').find('.recCount').hide();
		$(this).addClass('selected');
		$(this).find('.recCount').show;
	});


// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {
		
		// CLONE OUR RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();

		// PLACE THE IMAGE
		/*var recImg = result.find('.recImg');

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
					//container.imagesLoaded(function(){ 
					    container.masonry({
					        columnWidth: 60,
					  		itemSelector: '.item',
					  		gutter: 15
					    }); 
					//});
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
		placeImage(); */

		// SET THE TITLE FOR THE BOOK
		var recTitle = result.find('.recTitle');
		recTitle.text(recommendation.Name);
		//recTitle.attr('href', recommendation.wUrl);

		// SET THE TYPE OF THE BOOK
		var recType = result.find('.recType');
		recType.addClass(recommendation.Type);
		result.addClass(recommendation.Type);

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

		/*$('html').click(function() {
			$('.gigante').find('.recDescription').fadeOut();
			$('.gigante').removeClass('gigante');
			container.masonry();
		});*/
	};

	/*$( document ).ajaxStop(function() {
		$('.recTitle').on('click', function() {
			var query = 
			getRecommendations(query);
		});
	});

	$(document).ajaxComplete(function() {
		$('.recTitle').on('click', function() {
			var query = $(this).text();
			console.log(query);
			getRecommendations(query);
		});

		$('#masonry-con').show();
	});

	//DUCK DUCK GO IMAGE SEARCH
	var duckSearch = function (query) {
		var duckURI = BuildDuckGoUri(query);

		var duckDuckGo = $.ajax ({
			url: duckURI,
			type: 'GET',
			crossDomain: true,
    		dataType: 'jsonp'
		})
		.success( duckSearch = function(myData) {
			console.log(myData);
		});
	};

	function BuildDuckGoUri(query) {
 		//Build an uri for the DuckDuckGo API call.                                
		var duckApiUrl = "http://api.duckduckgo.com/?q=";
		// var bingApiImageCount = "1";                
		 
		var s = duckApiUrl + query //+ "%20" + recommendation.Type + "%27" +//
		//"&image.count=" + bingApiImageCount +
		//"&Image.Offset=" + 0 +
		+ "&format=json" + "&t=alike";
		 
		return s;                
	};  

	duckSearch("u2");
	*/
});








