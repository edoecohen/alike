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

	// GET ITEMS FROM AMAZON
	function sha256(stringToSign, secretKey) {
  		var hex = CryptoJS.HmacSHA256(stringToSign, secretKey);
  		return hex.toString(CryptoJS.enc.Base64);
	} 

	function timestamp() {
	    var date = new Date();
	    var y = date.getUTCFullYear().toString();
	    var m = (date.getUTCMonth() + 1).toString();
	    var d = date.getUTCDate().toString();
	    var h = date.getUTCHours().toString();
	    var min = date.getUTCMinutes().toString();
	    var s = date.getUTCSeconds().toString();

	    if(m.length < 2) { m = "0" + m; }
	    if(d.length < 2) { d = "0" + d; }
	    if(h.length < 2) { h = "0" + h; }
	    if(min.length < 2) { min = "0" + min; }
	    if(s.length < 2) { s = "0" + s}

	    var date = y + "-" + m + "-" + d;
	    var time = h + ":" + min + ":" + s;
	    return date + "T" + time + "Z";
	}

	var getAmazonItemInfo = function (query) {
	    
	    var AssociateTag = "alike-20";
	    var queryNew = encodeURIComponent(query);

	    var parameters = [];
	    parameters.push("AWSAccessKeyId=" + PublicKey);
	    parameters.push("Keywords=" + queryNew);
	    parameters.push("Operation=ItemSearch");
	    parameters.push("SearchIndex=All");
	    parameters.push("ResponseGroup=Small");
	    parameters.push("Service=AWSECommerceService");
	    parameters.push("Timestamp=" + encodeURIComponent(timestamp()));
	    parameters.push("Version=2011-08-01");
		parameters.push("AssociateTag=" + AssociateTag);

	    parameters.sort();
	    var paramString = parameters.join('&');

	    var signingKey = "GET\n" + "webservices.amazon.com\n" + "/onca/xml\n" + paramString

	    var signature = sha256(signingKey,PrivateKey);
	        signature = encodeURIComponent(signature);

	    var amazonUrl =  "http://webservices.amazon.com/onca/xml?" + paramString + "&Signature=" + signature;
	    console.log(amazonUrl);
		
		var amazonItem = $.ajax({
			url: amazonUrl,
			dataType: "jsonp",
			type: "GET",
			headers: { "Signature": signature}
		})
		.done(function(){
			console.log("done processing ajax")			
		});
	};




	
	//getAmazonItemInfo("catcher in the rye");
	//var catcher = getAmazonItemInfo("catcher in the rye");
	//var catcherParsed = xml2json.parser(catcher);


});
//http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAIKQHA7GGOCNPIX7Q&AssociateTag=alike-20&Keywords=u2&Operation=ItemSearch&ResponseGroup=Small&SearchIndex=All&Service=AWSECommerceService&Timestamp=2014-09-29T23%3A27%3A27Z&Version=2011-08-01&Signature=Amv81rCeRmq48CHe7nzWp375NFIuCaYjIHENB%2BVxOCc%3D
//http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAIKQHA7GGOCNPIX7Q&AssociateTag=alike-20&Keywords=u2&Operation=ItemSearch&ResponseGroup=Small&SearchIndex=All&Service=AWSECommerceService&Timestamp=2014-09-29T23%3A27%3A27Z&Version=2011-08-01&Signature=Amv81rCeRmq48CHe7nzWp375NFIuCaYjIHENB%2BVxOCc%3D&callback=jQuery1111008726128935813904_1412033246304&_=1412033246305




