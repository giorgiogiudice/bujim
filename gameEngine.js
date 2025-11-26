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

var x = 0;
var y = 0;
// var isMuted = false; // Removed
// winning Score
var WinScore;
var xPrev;
var yPrev;
var currMove;
var lastMove;
var cell;
// var jolPos; // Deprecated: using single sprite
var hayPos;
// var jolPosPrev='X'; // Deprecated
var zeroCheck;
var checkallowed = 'X';
var movesAvail = 0;
var score_counter = 0;
var MaxLeft;
var board;
var checkBoard;
var LevelTimer;
var cols; // Store columns globally
var musicVolume = 1;
var sfxVolume = 1;
var isMusicOn = true;
var isSFXOn = true;
var gameEnded = false;

function startBoard(M, N, W) {
	// Bujim board
	// var M; // Passed as arg
	// var N; // Passed as arg
	cols = N;
	board = new Array(M);

	// Set CSS variable for columns and rows
	const boardEl = document.getElementById("board");
	boardEl.style.setProperty('--cols', N);
	boardEl.style.setProperty('--rows', M);

	// Clear existing board content (except the sprite wrapper)
	const wrapper = document.getElementById('donkey-wrapper');
	boardEl.innerHTML = '';
	if (wrapper) {
		boardEl.appendChild(wrapper);
		// Ensure sprite is inside
		if (!wrapper.querySelector('#active-donkey')) {
			const newSprite = document.createElement('div');
			newSprite.id = 'active-donkey';
			newSprite.className = 'donkey-sprite';
			wrapper.appendChild(newSprite);
		}
	} else {
		// Create wrapper and sprite if missing
		const newWrapper = document.createElement('div');
		newWrapper.id = 'donkey-wrapper';
		newWrapper.className = 'donkey-wrapper';
		newWrapper.style.display = 'none'; // Hidden initially

		const newSprite = document.createElement('div');
		newSprite.id = 'active-donkey';
		newSprite.className = 'donkey-sprite';

		newWrapper.appendChild(newSprite);
		boardEl.appendChild(newWrapper);
	}

	// Loop to create 2D array
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(N);
	}

	// Display the board  
	for (var i = 0; i < M; i++) {
		for (var j = 0; j < N; j++) {
			let cellId;
			// javascript doesn't store leading 0s
			if (i == 0) {
				cellId = j.toString();
			} else {
				cellId = i + "" + j;
			}

			const square = document.createElement('div');
			square.className = 'square';
			square.id = cellId;
			square.onclick = function () { nextMove(cellId); };

			// Add hay image
			const hayImg = document.createElement('img');
			hayImg.src = 'hay.png';
			hayImg.id = 'hay' + cellId;
			hayImg.style.display = 'inline'; // Visible by default
			square.appendChild(hayImg);

			boardEl.appendChild(square);
		}
	}

	// this board will be used for tracking choices
	checkBoard = new Array(M)
	for (var i = 0; i < checkBoard.length; i++) {
		checkBoard[i] = new Array(N);
	}

	// fill checkBoard with 0s
	for (var i = 0; i < M; i++) {
		for (var j = 0; j < N; j++) {
			checkBoard[i][j] = 0;
		}
	}

	MaxLeft = N;
	WinScore = W;

	// Reset state
	score_counter = 0;
	gameEnded = false;
	document.getElementById("score").innerHTML = score_counter;

	// Update Target and Level display
	const targetEl = document.getElementById("target");
	if (targetEl) targetEl.innerHTML = WinScore;

	const levelEl = document.getElementById("displayLevel");
	// Assuming 'level' is available globally from levelCalculator.js
	if (levelEl && typeof level !== 'undefined') levelEl.innerHTML = level;

	checkallowed = 'X';
	xPrev = undefined;
	yPrev = undefined;

	// Hide sprite initially
	const activeWrapper = document.getElementById('donkey-wrapper');
	if (activeWrapper) activeWrapper.style.display = 'none';
}

// checks the move after the click
function nextMove(clicklocation) {
	// Convert to string to ensure charAt works
	let locStr = clicklocation.toString();

	// stores coordinates after the first row
	if (locStr.length == 2) {
		// store coordinates
		x = locStr.charAt(0);
		y = locStr.charAt(1);
		zeroCheck = 0;
	}
	// stores coordinates of first row only
	else {
		y = locStr.charAt(0);
		x = 0;
		zeroCheck = 1;
	}

	// Parse integers for math
	let xInt = parseInt(x);
	let yInt = parseInt(y);

	allowed(xInt, yInt);

	if (board[xInt][yInt] != 'X' && checkallowed == 1) {
		// the cell is now taken
		board[xInt][yInt] = 'X';
		// increase score every legal move
		score_counter++;
		// update score
		document.getElementById("score").innerHTML = score_counter;

		// account for leding 0s
		if (zeroCheck == 0) {
			currMove = x + y;
		} else {
			currMove = y;
		}

		hayPos = "hay" + currMove;

		// Visual updates
		const currentSquare = document.getElementById(currMove);
		currentSquare.classList.add('taken'); // Add CSS class for styling

		// Hide hay
		document.getElementById(hayPos).style.visibility = "hidden";

		// Move sprite
		moveSprite(xInt, yInt);

		// Play jump sound
		playSound("jumpSound");

		lastMove = currMove;
		xPrev = xInt;
		yPrev = yInt;

		checkchance(xPrev, yPrev);

	} else {
		showMessage("You can't move here!");
	}
}

function moveSprite(row, col) {
	const wrapper = document.getElementById('donkey-wrapper');
	const sprite = document.getElementById('active-donkey');
	if (!wrapper || !sprite) return;

	// Show wrapper if hidden (first move)
	wrapper.style.display = 'block';

	const xPos = col * 100; // 100% of wrapper width (which is 1 cell width)
	const yPos = row * 100; // 100% of wrapper height (which is 1 cell height)

	// Move the wrapper
	wrapper.style.transform = `translate(${xPos}%, ${yPos}%)`;

	// Animate the sprite (pop effect)
	sprite.classList.remove('pop-anim');
	void sprite.offsetWidth; // trigger reflow
	sprite.classList.add('pop-anim');
}

function showMessage(msg) {
	const container = document.getElementById("message-container");
	if (container) {
		container.textContent = msg;
		// Clear after 2 seconds
		setTimeout(() => {
			container.textContent = "";
		}, 2000);
	}
}

function playSound(id) {
	if (!isSFXOn) return;
	const sound = document.getElementById(id);
	if (sound) {
		sound.currentTime = 0;
		sound.volume = sfxVolume;
		sound.play().catch(e => console.log("Audio play failed:", e));
	}
}

// Initialize audio and restore settings
document.addEventListener('DOMContentLoaded', function () {
	initAudio();
});

function initAudio() {
	const savedMusicVol = localStorage.getItem('musicVolume');
	const savedSFXVol = localStorage.getItem('sfxVolume');
	const savedMusicOn = localStorage.getItem('isMusicOn');
	const savedSFXOn = localStorage.getItem('isSFXOn');

	if (savedMusicVol !== null) musicVolume = parseFloat(savedMusicVol);
	if (savedSFXVol !== null) sfxVolume = parseFloat(savedSFXVol);
	if (savedMusicOn !== null) isMusicOn = savedMusicOn === 'true';
	if (savedSFXOn !== null) isSFXOn = savedSFXOn === 'true';

	updateAudioUI();
	updateBackgroundMusic();
}

function updateAudioUI() {
	const musicToggle = document.getElementById('musicToggle');
	const sfxToggle = document.getElementById('sfxToggle');
	const musicSlider = document.getElementById('musicVolume');
	const sfxSlider = document.getElementById('sfxVolume');

	if (musicToggle) {
		musicToggle.textContent = isMusicOn ? 'ON' : 'OFF';
		musicToggle.className = isMusicOn ? '' : 'off';
	}
	if (sfxToggle) {
		sfxToggle.textContent = isSFXOn ? 'ON' : 'OFF';
		sfxToggle.className = isSFXOn ? '' : 'off';
	}
	if (musicSlider) musicSlider.value = musicVolume;
	if (sfxSlider) sfxSlider.value = sfxVolume;
}

function updateBackgroundMusic() {
	const bgMusic = document.getElementById('backgroundMusic');
	if (!bgMusic) return;

	bgMusic.volume = musicVolume;

	if (isMusicOn) {
		// Try to play if not playing
		if (bgMusic.paused) {
			bgMusic.play().catch(e => console.log("Music play failed:", e));
		}
	} else {
		bgMusic.pause();
	}
}

function toggleMusic() {
	isMusicOn = !isMusicOn;
	localStorage.setItem('isMusicOn', isMusicOn);
	updateAudioUI();
	updateBackgroundMusic();
}

function toggleSFX() {
	isSFXOn = !isSFXOn;
	localStorage.setItem('isSFXOn', isSFXOn);
	updateAudioUI();
}

function updateMusicVolume(val) {
	musicVolume = parseFloat(val);
	localStorage.setItem('musicVolume', musicVolume);
	updateBackgroundMusic();
}

function updateSFXVolume(val) {
	sfxVolume = parseFloat(val);
	localStorage.setItem('sfxVolume', sfxVolume);
}

function openSettings() {
	const modal = document.getElementById('settingsModal');
	if (modal) modal.style.display = "block";
}

function closeSettings() {
	const modal = document.getElementById('settingsModal');
	if (modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
	const modal = document.getElementById('settingsModal');
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

function restartLevel() {
	location.reload();
}

// check moves
function allowed(x, y) {
	// If it's the first move (no previous position), it's allowed
	if (xPrev === undefined || yPrev === undefined) {
		checkallowed = 1;
		return;
	}

	// Check distance from previous position
	let dx = xPrev - x;
	let dy = yPrev - y;

	// Valid moves:
	// 2 squares horizontally or vertically (distance 3 in grid coordinates?)
	// Wait, the original logic had:
	// xPrev - x == -3 (move 2 down?)
	// Let's re-verify the grid logic.
	// If I am at 0,0. Next square is 0,1.
	// The original code used:
	// xPrev-x == -3 && yPrev==y
	// This implies a distance of 3 indices?
	// But the grid is just 0, 1, 2, 3...
	// If I move from 0,0 to 2,0 (2 down).
	// x changes from 0 to 2. dx = -2.
	// Why did the original code check for -3?
	// "He can jump 2 squares horizontally and vertically"
	// Maybe it means skipping 2 squares? i.e. landing on the 3rd?
	// "He can jump 2 squares... and only one obliquely"
	// If I jump 2 squares, I land on the 3rd one?
	// Or I jump over 1 square and land on the 2nd?
	// Standard chess knight is 2+1.
	// This seems to be:
	// 2 squares straight -> distance of +/- 3? (0 -> 3)
	// 1 square obliquely -> distance of +/- 2? (0 -> 2)

	// Let's stick to the original logic values but clean up the code.
	// Original:
	// move 2 down: xPrev-x == -3
	// move 2 up: xPrev-x == +3
	// right by 2: yPrev-y == +3
	// left by 2: yPrev-y == -3
	// oblique: +/- 2 in both x and y?
	// oblique down-right: xPrev-x == -2 && yPrev-y == -2

	checkallowed = 0; // Default to not allowed

	// Straight moves (distance 3)
	if ((Math.abs(dx) === 3 && dy === 0) || (Math.abs(dy) === 3 && dx === 0)) {
		checkallowed = 1;
	}
	// Oblique moves (distance 2 diagonal)
	else if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
		checkallowed = 1;
	}
}



// calculate moves available (in the future calculate best moves)
function checkchance(a, b) {
	if (gameEnded) return;
	movesAvail = 0;
	var aU3 = parseInt(a) - 3;
	var aD3 = parseInt(a) + 3;
	var aU2 = parseInt(a) - 2;
	var aD2 = parseInt(a) + 2;

	var bU3 = parseInt(b) - 3;
	var bD3 = parseInt(b) + 3;
	var bU2 = parseInt(b) - 2;
	var bD2 = parseInt(b) + 2;

	var curr_position;

	// check up
	if (checkvalues(aU3) == true && board[aU3][b] != "X") {
		movesAvail++;
		curr_position = aU3 + "" + b;
	}


	// check down
	if (checkvalues(aD3) == true && board[aD3][b] != "X") {
		movesAvail++;
		curr_position = aD3 + "" + b;
	}




	// check right
	if (checkvalues(bD3) == true && board[a][bD3] != "X") {
		movesAvail++;
		curr_position = a + "" + bD3;
	}



	// check left
	if (checkvalues(bU3) == true && board[a][bU3] != "X") {
		movesAvail++;
		curr_position = a + "" + bU3;
	}




	// diagonal up-left
	if (checkvalues(aU2) == true && checkvalues(bU2) == true && board[aU2][bU2] != "X") {
		movesAvail++;
		curr_position = aU2 + "" + bU2;
	}





	// oblique down-left
	if (checkvalues(aD2) == true && checkvalues(bU2) == true && board[aD2][bU2] != "X") {
		movesAvail++;
		curr_position = aD2 + "" + bU2;
	}




	// oblique down-right
	if (checkvalues(aD2) == true && checkvalues(bD2) == true && board[aD2][bD2] != "X") {
		movesAvail++;
		curr_position = aD2 + "" + bD2;
	}



	// oblique up-right
	if (checkvalues(aU2) == true && checkvalues(bD2) == true && board[aU2][bD2] != "X") {
		movesAvail++;
		curr_position = aU2 + "" + bD2;
	}



	// check if victory or loss
	// Check if score reached target OR no moves left
	if (movesAvail == 0 || score_counter >= WinScore) {
		gameEnded = true;
		if (score_counter >= WinScore) {
			var victorymusic = document.getElementById("victory");
			// Use playSound logic for victory music if we want it controlled by SFX or Music? 
			// Usually victory is SFX.
			if (isSFXOn && victorymusic) {
				victorymusic.volume = sfxVolume;
				victorymusic.play().catch(e => { });
			}
			levelReached++;
			localStorage.setItem("level", levelReached);
			showMessage("YOU WON! NOW TRY TO BEAT LEVEL " + levelReached);
			setTimeout(function () {
				location.reload();
			}, 3000);
		}
		else {
			var lostmusic = document.getElementById("lost");
			if (isSFXOn && lostmusic) {
				lostmusic.volume = sfxVolume;
				lostmusic.play().catch(e => { });
			}
			showMessage("You lost :(. You scored " + score_counter + " points, and the goal is " + WinScore);
			setTimeout(function () {
				location.reload();
			}, 3000);
		}
	}


}

// Make sure the array check for MovesAvailable is not out of bound
function checkvalues(val) {

	if (val < MaxLeft && val >= 0) {
		return true
	}
	else {
		return false
	}

}