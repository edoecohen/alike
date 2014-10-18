$(document).ready( function() {

/*
- add Amazon links
- Close option to close description (?)
- get image for each item
*/

// LANDING PAGE WITH ROTATING TEXT
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


// COLLECT QUERY FROM USER
	var query;
	var container = $("#masonry-con");
	var msnry = container.masonry({
		columnWidth: 60,
		gutter: 10,
		itemSelector: '.item'
	});
	var items = $('.item');

	var myData = [];

	$('.recommendation-getter').submit( function(event){
		
		query = $(this).find("input[name='query']").val();
		getTasteKid(query);
		$('#landing').hide();
		$('#mainCon').removeClass('hidden');
		$(this).find("input[name='query']").val('').focusout();
	});

// GET TASTEKID RECOMMENDATIONS
	var request = {
		f: "gifted2903",
		k: "nwfhotk2owzk",
		format: "JSON",
		verbose: 1
	};

	var getTasteKid = function (query) {
		if(container.html().length > 0) {
			var items = $('.item');
			container.masonry('remove', items);
			//container.masonry();
		};

		$.ajax({
			url: "http://www.tastekid.com/ask/ws?q=" + query + "&jsonp=itemRecs",
			data: request,
			contentType: "application/json",
			dataType: "jsonp",
			type: "GET"
		})
		.success(itemRecs = function (myData) {
			
		// SHOW THE QUERY RESULTS FIRST
			$.each(myData.Similar.Info, function(i, item) {
				var showResult = showRec(item);
				container.append(showResult).masonry( 'appended', showResult, true );
			});

		// SHOW THE RECOMMENDED ITEMS
			$.each(myData.Similar.Results, function(i, item) {
				var resultItem = showRec(item);
				container.append(resultItem).masonry( 'appended', resultItem, true );
			});
			
			container.imagesLoaded(function(){ 
				container.masonry({
					gutter: 12,
					itemSelector: '.item'
				});
			});

			modals();
		});
	};

// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {

		// CLONE RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();

		// PLACE THE IMAGE
		var recImg = result.find('.recImg');

		var placeImage = function () {
			
			var imageURL;

			// SEARCH FOR THE QUERY IMAGE VIA BING
			function bingSearch(query) {            
			//Build a new API uri.
				var bingApiAppId = ":2KE1qCnJ8FJaHjFPqBcPNPB4gxK+S3QxGStHkBTK/pQ";

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
					        //columnWidth: 60,
					  		itemSelector: '.item',
					  		gutter: 12
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

		
		// SET THE TITLE FOR THE ITEM
		var recTitle = result.find('.recTitle');
		recTitle.text(recommendation.Name);

		// SET THE TYPE OF THE ITEM
		var recType = result.find('.recType');
		recType.addClass(recommendation.Type);

		// SET THE DESCRIPTION OF THE BOOK
		var recDescriptionText = result.find('.text');
		recDescriptionText.text(recommendation.wTeaser);

		// SET THE VIDEO URL & FUNCTIONALITY
		var videoURL = recommendation.yUrl;
		var recVideoHolder = result.find('.recVideoHolder');
		recVideoHolder.html('<iframe width="480" height="360" src="' + videoURL + '?rel=0" frameborder="0" allowfullscreen></iframe>');

		var videoType = result.find('.video');
		
		var changeVideoType = function () {
			if(recommendation.Type == 'music') {
				videoType.text("Music Video");
			}
			else if(recommendation.Type == 'movie') {
				videoType.text("Trailer");
			}
			else if(recommendation.Type == 'show') {
				videoType.text("Trailer");
			}
			else {
				videoType.text("");
			};
		};
		changeVideoType();

		var recBuyLink = result.find('.buyRec');
		var buyThisLink = "http://www.amazon.com/s?url=search-alias%3Daps&field-keywords=" + recommendation.Name;
		recBuyLink.attr("href", buyThisLink);

		return result;
	};

// ITEM OPENS TO SHOW DESCRIPTION
	var modals = function() {

		// USER CLICKS ALIKE BUTTON
		$('.alike').bind('click', function() {
			newSearch = $(this).parent().parent().parent().find('.recTitle').text();
			getTasteKid(newSearch);
			window.scrollTo(0, 0);
		});

		// OPEN & CLOSE DESCRIPTION WHEN IMG OR TITLE ARE CLICKED
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
			};
		});

		$('.recTitle').bind('click', function(event) {
			if($(this).parent().hasClass('gigante')) {
				$(this).parent().find('.recDescription').fadeOut();
				$(this).parent().removeClass('gigante');
				container.masonry();
			}
			else {
				event.stopPropagation();
				$('.gigante').find('.recDescription').fadeOut();
				$('.gigante').removeClass('gigante');
				$(this).parent().addClass('gigante');
				$(this).siblings('.recImg').find('.recDescription').fadeIn();
				container.masonry();
			};
		});

		// SHOW VIDEO POPUP
		$('.video').on('click', function(event) {
			event.stopPropagation();
	  		$(this).parent().parent().parent().parent().find('.recVideo').modal({
	  			fadeDuration: 250,
	  			showClose: true,
	  		});
	  		return false;
		});

		$('.recVideo').on('modal:open', function () { 
			var videoHTML =  $(this).parent().find('.recVideoHolder').html();
			$(this).html(videoHTML);
		});

		$('.recVideo').on('modal:close', function () {
			$(this).html('');
		});
	};
});