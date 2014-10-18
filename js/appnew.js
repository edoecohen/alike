$(document).ready( function() {

/*
- if user runs a new search, then it should work fine
- for each item result, clone template and enter into container
- For search query item, apply highlight
- get image for each item
- run Masonry on container (after every item?)
- if user clicks on title or image then description should show
& image should increase
- add Youtube links
- add Amazon links

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


	var myData = [];

	$('.recommendation-getter').submit( function(event){
		if(container.html().length > 0) {
			var items = $('.item');
			container.masonry('remove', items);
			container.masonry();
		};
		
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

			container.masonry();
			//modals();
		});
	};

// SHOW RECOMMENDATIONS FUNCTION
	var showRec = function(recommendation) {

		// CLONE RESULT TEMPLATE CODE
		var result = $('.templates .recResult').clone();
		
		// SET THE TITLE FOR THE ITEM
		var recTitle = result.find('.recTitle');
		recTitle.text(recommendation.Name);

		// SET THE TYPE OF THE ITEM
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
	
});