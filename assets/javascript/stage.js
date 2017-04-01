//When the browser is loaded the curtains will begin opening after 2 seconds. The curtains and balance will then open completely in the reamining 3 seconds.
$(document).ready(function() {
	setTimeout(openCurtain, 2000);
	setTimeout(hideStage, 5000);
});

//Curtains left/right open after 2 seconds of the brower loading
function openCurtain() {
		$("#stage").addClass("opening");
}

//After the curtains are fully opened the stage <div> encompassing the page will fade out and allow functionality to the buttons behind it.
function hideStage() {
	$("#stage").addClass("opened");
}



