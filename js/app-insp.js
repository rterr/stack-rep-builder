// this function takes the user object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showUser = function(userData) {

	// clone our result template code
	var result = $('.templates .user').clone();

	// Set the user image
	var userImg = result.find('.user-image img');
	userImg.attr('src', userData.user.profile_image);

	// set the user name (with link to profile)
	var userName = result.find('.user-name a');
	userName.attr('href', userData.user.link);
	userName.text(userData.user.display_name);

	// set the .reputation for user property in result
	var reputation = result.find('.user-reputation');
	reputation.text(userData.user.reputation);

	// set the .reputation for user property in result
	var postcount = result.find('.user-postcount');
	postcount.text(userData.post_count);

	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getInspiration = function(answerers) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {
		tagged: answerers,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'score'
	};
 	
 	var answerersURL = "http://api.stackexchange.com/2.2/tags/" + answerers + "/top-answerers/all_time";
 	console.log(answerersURL);

	$.ajax({
		url: answerersURL,
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var user = showUser(item);
			$('.results').append(user);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



$(document).ready( function() {

	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getInspiration(answerers);
	});
});
