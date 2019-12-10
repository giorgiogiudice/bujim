/*

to do:

-- Cookie
-- Levels
-- 2 Modes, Solitaire or Competitive


FOR FUTURE DEVELOPMENT
-- work with rectangular board
-- undo moves
-- push score on DB with time and level
*/

var x=0;
var y=0;
// winning Score
var WinScore;
var xPrev;
var yPrev;
var currMove;
var lastMove;
var cell;
var jolPos;
var hayPos;
var jolPosPrev='X';
//var hayPosPrev='X';
var zeroCheck;
var checkallowed='X';
var movesAvail=0;
var score_counter=0;
var MaxLeft;
var board;
var checkBoard;
var LevelTimer;

function startBoard(M,N,W) {
	// Bujim board
	var M;
	var N;
	board = new Array(M);
	var width=M*56;
	var height=N*56;
	// multiply by 56 to get size of the board
	document.getElementById("board").style.width = width;
	document.getElementById("board").style.height = height;

	//display initial score


	// Loop to create 2D array
	for (var i = 0; i < board.length; i++) { 
		board[i] = new Array(N); 
	}



	// Display the board  
	for (var i = 0; i < M; i++) { 
		for (var j = 0; j < N; j++)    {
			// javascript doesn't store leading 0s
			if (i == 0) {
				document.write('<div class="square" id='+ j +' onclick="nextMove(' + j + ')"><img src="don.png" id="jol'+ j +'" width=55% style="display: none;"><img src="hay.png" id="hay'+ j +'" width=110% style="display: inline;"></div>');
			} else {
				cell= i + "" + j;
				document.write('<div class="square" id='+ cell +' onclick="nextMove(' + cell + ')"><img src="don.png" id="jol'+ cell +'" width=55% style="display: none;"><img src="hay.png" id="hay'+ cell +'" width=110% style="display: inline;"></div>');
			}
		} 
		
	}  


	// this board will be used for tracking choices
	checkBoard = new Array(M)
	for (var i = 0; i < checkBoard.length; i++) { 
		checkBoard[i] = new Array(N); 
	}

	// fill checkBoard with 0s
	// Display the board  
	for (var i = 0; i < M; i++) { 
		for (var j = 0; j < N; j++)    {
			checkBoard[i][j]=0;
		} 
		
	}

	MaxLeft=N;
	WinScore=W;

}








// checks the move after the click
function nextMove(clicklocation) {	
	// stores coordinates after the first row
	if (clicklocation.toString().length==2) {
		// store coordinates
		x = String(clicklocation).charAt(0);
		y = clicklocation.toString().charAt(1);
		zeroCheck=0;
			
	}	
	// stores coordinates of first row only
	else {
		y = String(clicklocation).charAt(0);
		x = 0;
		zeroCheck=1;
	}
	
	allowed(x,y);
	
	if (board[x][y]!='X' && checkallowed==1) {
		// the cell is now taken
		board[x][y]='X';
		// increase score every legal move
		score_counter++;
		// update score
		document.getElementById("score").innerHTML = score_counter;
		
		// account for leding 0s
		if (zeroCheck==0) {
			currMove=x+y;
		} else {
			currMove=y;
		}
		
		jolPos="jol"+currMove;
		hayPos="hay"+currMove;
		document.getElementById(currMove).style.backgroundColor = "brown";
		document.getElementById(jolPos).style.display = "inline";
		document.getElementById(hayPos).style.visibility  = "hidden";
		
	
		// keep track of last move
		if (jolPosPrev!='X') {
			document.getElementById(jolPosPrev).style.display = "none";

		}
		lastMove=currMove;
		xPrev=x;
		yPrev=y;
		jolPosPrev=jolPos;
		//hayPosPrev=hayPos;
		checkchance(xPrev, yPrev);
			
	} else {
		alert("You can't move here!");
	}
}

// check moves
function allowed(x,y) {
	//checks jol's movements after the first time
	if (checkallowed !='X') {
		// move 2 down
		if (xPrev-x==-3 && yPrev==y) {
			checkallowed=1;
		} 
		// move 2 up
		else if (xPrev-x==+3 && yPrev==y) {
			checkallowed=1;
		} 
		// right by 2
		else if (yPrev-y==+3 && xPrev==x) {
			checkallowed=1;
		}
		// left by 2
		else if (yPrev-y==-3 && xPrev==x) {
			checkallowed=1;
		}
		// oblique down-right by 1
		else if (xPrev-x==-2 && yPrev-y==-2) {
			checkallowed=1;
		}
		// oblique down-left by 1
		else if (xPrev-x==-2 && yPrev-y==+2) {
			checkallowed=1;
		}
		// oblique top-left by 1
		else if (xPrev-x==+2 && yPrev-y==+2) {
			checkallowed=1;
		}
		// oblique top-right by 1
		else if (xPrev-x==+2 && yPrev-y==-2) {
			checkallowed=1;
		}
		
		
		// not allowed
		else {
		checkallowed=0;
		}



	} 
	// the jol can be placed everywhere the first time
	else {
		checkallowed=1;
	}
}

 
 
// calculate moves available (in the future calculate best moves)
function checkchance(a,b) {
	movesAvail=0;
	var aU3=parseInt(a)-3;
	var aD3=parseInt(a)+3;
	var aU2=parseInt(a)-2;
	var aD2=parseInt(a)+2;
 
	var bU3=parseInt(b)-3;
	var bD3=parseInt(b)+3;
	var bU2=parseInt(b)-2;
	var bD2=parseInt(b)+2;
 
	var curr_position;
	
	// check up
	if (checkvalues(aU3)==true && board[aU3][b]!="X") {
		movesAvail++;
		curr_position=aU3+ "" + b;		
	}
	
	
	// check down
	if (checkvalues(aD3)==true && board[aD3][b]!="X") {
		movesAvail++;
		curr_position=aD3+ "" + b;
	}
	
	
	
	
	// check right
	if (checkvalues(bD3)==true && board[a][bD3]!="X") {
		movesAvail++;
		curr_position=a+ "" + bD3;
	}
	
	
	
	// check left
	if (checkvalues(bU3)==true && board[a][bU3]!="X") {
		movesAvail++;
		curr_position=a+ "" + bU3;
	}
	
	
	
	
	// diagonal up-left
	if (checkvalues(aU2)==true && checkvalues(bU2)==true && board[aU2][bU2]!="X") {
		movesAvail++;
		curr_position=aU2+ "" + bU2;
	}
	
	
	
	
	
	// oblique down-left
	if (checkvalues(aD2)==true && checkvalues(bU2)==true && board[aD2][bU2]!="X") {
		movesAvail++;
		curr_position=aD2+ "" + bU2;
	}
	
	
	
	
	// oblique down-right
	if (checkvalues(aD2)==true && checkvalues(bD2)==true && board[aD2][bD2]!="X") {
		movesAvail++;
		curr_position=aD2+ "" + bD2;
	}
	
	
	
	// oblique up-right
	if (checkvalues(aU2)==true && checkvalues(bD2)==true && board[aU2][bD2]!="X") {
		movesAvail++;
		curr_position=aU2+ "" + bD2;
	}
	

	// check if victory or loss
	if (movesAvail==0 || score_counter==WinScore) {
		if (score_counter>=WinScore) {
			var victorymusic = document.getElementById("victory");
			victorymusic.play();
			levelReached++;
			localStorage.setItem("level", levelReached);
			alert("YOU WON! NOW TRY TO BEAT LEVEL " + levelReached);
			location.reload();
		}
		else {
			var lostmusic = document.getElementById("lost");
			lostmusic.play();
			alert("You lost :(. You scored " + score_counter + " points, and the goal is " + WinScore);
			location.reload();

		}
	}
	
	
}

// Make sure the array check for MovesAvailable is not out of bound
function checkvalues(val) {
	
	if (val<MaxLeft && val>=0) {
		return true
	} 
	else {
		return false
	}

}

/*
// TIMER FOR FUTURE USE

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer== -1) {
			display = document.querySelector('#time').innerHTML="00:00";
			// stop functions
			window.countdownlevel=function(){return false;};
			window.startTimer=function(){return false;};
        }
    }, 1000);
}

function countdownlevel() {
	LevelTimer=5;
    display = document.querySelector('#time');
    startTimer(LevelTimer, display);
};
*/

 
 