# bujim

gameEngine.js Fuctions:

- startBoard (Size M, Size N, WinningScore): builds the board for each level and it's called by the levelCalculator

- nextMove (clicklocation): tracks coordinates of the choice, calls the function allowed and handles graphic changes. Also, hides the hay and unhides the jod when the square is chosen. It also handles the change of color of the squares.

- allowed (x,y): checks if the move is legal for those coordinates and if the square is already taken. Returns variable checkallowed=1 if allowed or 0 if not

- checkchance (x,y): checks the possible next moves and counts them. Determines if the game is over or not and reloads the page afterwards after updating the cookie.

- checkvalues(val): makes sure that the next moves evaluated by checkchance are not out of bound.



levelCalcular.js Functions:

- (default) cookie handling from the start to determine the level
- reset (): after level 10 is won, it will offer the user to reset the progress
- viewData(): used only for development and check the status of the cookies

It also contains a switch(levelReached) that calls startBoard from gameEngine.js to start the game


