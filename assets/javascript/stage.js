$(document).ready(function() {

	setTimeout(openCurtain, 2000);
	setTimeout(hideStage, 5000);

});

function openCurtain() {
	$("#stage").addClass("opening");
}

function hideStage() {
	$("#stage").addClass("opened");
}


