//reset();
var levelReached = localStorage.getItem("level");

if (levelReached == null || levelReached == "null" || parseInt(levelReached) < 1) {
	level = 1;
	levelReached = 1;
	localStorage.setItem("level", 1);
} else {
	level = levelReached;
}


function reset() {
	var r = confirm("Do you want to reset your progress and start from Level 1?");
	if (r == true) {
		localStorage.setItem("level", 1);
		location.reload();
	}
}

function viewData() {
	//shows all the key / value pairs
	for (i = 0; i < localStorage.length; i++) {
		key = localStorage.key(i);
		value = localStorage.getItem(key);
		alert(key + ": " + value);
	} // end for loop
}


//start the correct level
// startBoard(MxN and winningscore)
switch (parseInt(levelReached)) {
	case 0:
	//intro not used as of now
	case 1:
		startBoard(4, 4, 5);
		break;
	case 2:
		startBoard(4, 5, 6);
		break;
	case 3:
		startBoard(5, 5, 12);
		break;
	case 4:
		startBoard(5, 5, 18);
		break;
	case 5:
		startBoard(5, 5, 22); //I could ask for 25
		break;
	case 6:
		startBoard(6, 6, 30);
		break;
	case 7:
		startBoard(7, 7, 42); //my highest 48
		break;
	case 8:
		startBoard(8, 8, 57);
		break;
	case 9:
		startBoard(9, 9, 74);
		break;
	case 10:
		startBoard(10, 10, 100); //it's doable, just very hard
		break;
	default:
		reset();

}