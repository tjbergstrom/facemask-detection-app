

function openNav() {
	document.getElementById("mySidebar").style.width = "256px";
	document.getElementById("main").style.marginLeft = "256px";
}

function closeNav() {
	document.getElementById("mySidebar").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
}

function redirectStreamPage(streamType, streamSource) {
	localStorage.streamType = streamType;
	localStorage.streamSource = streamSource;
	location.href = '/stream';
}



//
