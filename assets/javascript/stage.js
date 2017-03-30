$(document).ready(function() {

	setTimeout(openCurtain, 2000);
	setTimeout(hideStage, 5000);

	$(".popcornBtn").on("click", ".popcorn", function(){
	console.log("working");
	$(".containerModal").fadeOut();
	$(".popcornBtn").fadeOut();	
});
	$(".resultsBtn").on("click", ".btn", function(){
	console.log("results");
	$(".row").fadeOut();
});

});

function openCurtain() {
	$("#stage").addClass("opening");
}

function hideStage() {
	$("#stage").addClass("opened");
}

//When the user pushes the popcorn button the modal and popcorn button should disappear and the row containing all the user information should appear

