/*
	Game App
	The funcion of this game app is to play the game Snake inside a webbrowser.
	There are 3 controllers that are used. Display, input and game.
	Game controller handles all of the game logic of snake. It takes input from the input controller through a factory. And the display data from the display controller.
	The display controller just reads the screen data and outputs the graphics.
	The input controller shows some values on keypress, keydown etc.. The main function is it captures the users key code and sends it to the fatory.
*/

(function() {
	// Declare our App here.
	var appGame = angular.module('gameApp', ['ngAnimate']);

	var global_DisplayWidth = 64;
	var global_DisplayHeight = 32;
	var global_gameSpeed = 250;



// Create the factory that share the variables
appGame.factory('globalVars', function(){

	var data = {
        FirstName: '', 		//test variable, not used
        screen: [],			//this is a 2D array of our screen pixel values
        gameState: 0,		//this variable determines where we are in any game
        userInput: 0,		//this is the keycode detected from the user
        leaderBoard: []		//this is an object of .name and .score
    };


    return {
        getFirstName: function () {
            return data.FirstName;
        },
        setFirstName: function (firstName) {
            data.FirstName = firstName;
        },
        getScreen: function () {
            return data.screen;
        },
        setScreen: function (screenValue) {
            data.screen = screenValue;
        },
        getState: function () {
            return data.gameState;
        },
        setState: function (gameState) {
            data.gameState = gameState;
        },
        getUserInput: function () {
            return data.userInput;
        },
        setUserInput: function (userInput) {
            data.userInput = userInput;
        },
        getLeaderBoard: function () {
            return data.leaderBoard;
        },
        setLeaderBoard: function (leaderBoard) {
            data.leaderBoard = leaderBoard;
        }
    };

});

/*
														Login Conroller
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('loginController', function($scope, $http, globalVars, $window) {
    $scope.login = function(){
			$window.location.href = '/shop.html';
	}
});


// highscores controller grabs the http json response data and populates our factory highscore board variable
appGame.controller('highscores', function($scope, $http, globalVars) {
    $http.get('/public/app/restfuls.json').
        then(function(response) {
        	//grab the response data
            $scope.board = response.data;
            //set our leader board to the json received
            globalVars.setLeaderBoard($scope.board);
            //alert(globalVars.getLeaderBoard());
        });   
});

	// the test controller is used to test a variable
	appGame
		.controller('testController', ['$scope', function($scope) {
				//Test controller, test our value
				$scope.playerX = 20;
		}]); // End Game Controller

	// Game Controller
	appGame
		.controller('gameController', ['$scope', '$http', 'globalVars', '$timeout', '$filter', function($scope, $http, globalVars, $timeout, $filter) {
				/*
					gameController
					This controllers purpose is to perform the logic of the actual game. In this case, snake. Once all of the logic is done, we
					want to change the screens graphics.
				*/
				// grab the screen data
				$scope.Screen = globalVars.getScreen();

				//get user input
				$scope.userInput = globalVars.getUserInput();

				// Total ticks the app has been running
			 	$scope.counter = 0;
			 	// Manage the flow of our game logic with this variable
			 	$scope.gameState = globalVars.gameState;
			 	// When we start the game, we show a pretty graphical effect to 'initialize'.
			 	// we determine how long this happens with this counter
			 	$scope.initCounter = 0;

			 	/*
					Player variables. In this case the player is our snake
			 	*/
			 	// Playr X position on the screen. the head of the snake
			 	$scope.playerX = 20;
			 	// Player Y position on the screen. the head of the snake
			 	$scope.playerY = 10;
			 	// We only need to erase the tail of the player so we track it here
			 	//$scope.playerTailX = 20;
			 	//$scope.playerTailY = 10;
			 	// store the 'direction' of the tail too.  0 is right, 1 is down, 2 is left, 3 is up.
			 	//$scope.playerTailDirection = 0;

			 	// Flag, if 0 , need to spawn fruit for snake to eat
			 	$scope.spawnFruit = 0; 
			 	// Store the last direction of the player to stop them from going backwards
			 	$scope.lastDirection = -1;
				
				// Player direction they travel. 0 is right, 1 is down, 2 is left, 3 is up.
				$scope.playerDirection = 0;		 	

				// we need to know how many snake pieces are the body
				$scope.snakeBodySize = 1;

				// snake body array. For every snake piece we want to know its order, and position
				$scope.snakeBody = [ [$scope.snakeBodySize,$scope.playerX, $scope.playerY] ];

				// how many points do you have?
				$scope.score = 0; 

				// highscore
				$scope.highScore = function(){
					// data to post nodejs server

					//grab the persons name for the high score
					var person = prompt("Please enter your name for highscore", "Jon Snow");

					//if they hit cancel, return
					if (person === null) {
				        return; //break out of the function early
				    }
				    // change our game state to 5, no more highscore setting
				    $scope.gameState = 5;
				    // grab the leader board data already
					$scope.data = globalVars.getLeaderBoard();
					// set up our items in the scoreboard
					$scope.items = $scope.data ;
					// push the user name and their score
					$scope.items.push({
				        name: person,
				        score: $scope.score
				    });
					// turns out angular populates hashkey values into the arrays. so we erase those
				    var data = angular.toJson($scope.items);
				        
				    // We post the data to the json
					$http({
				    	url: '/',
				    	method: "POST",
				    	data: data, 
				    	header: { 'Content-Type': 'application/json' }
					});




				}
			 	// When a game runs, every 'frame' it does something. This timer is our game ticker.
			    $scope.onTimeout = function(){

			    	// Incrememnt the game counter to know how long total we've been running
			        $scope.counter++;
			        // Here we determine where we are in our game. Initializing? Playing? Game over? etc..
			        switch($scope.gameState) {
					    case 0: // User has not started any game
					        // do nothing
					        break;
					    case 1: // User loads a game
					        $scope.colorize();
					        $scope.initCounter++;
					        if ($scope.initCounter >= 20){
					        	$scope.gameState = 2;
					        }
					        break;
					    case 2: // start new game
					        $scope.newGame();
					        $scope.gameState = 3;
					        break;
					    case 3:
					    	$scope.gameMain();
					    	break;
					    case 4: //game over
					    	$scope.gameOver();
					    	break;
					    default:
					       // do nothing
					} 
					// We keep the timer cycling every 50 MS
			        mytimeout = $timeout($scope.onTimeout,global_gameSpeed);
			    }

			    // When a new game happens we have to draw the board
			    $scope.newGame = function() {
			    	$scope.Screen = globalVars.getScreen();
			    	for (i=0; i < global_DisplayWidth; i++) { //width hardcoded
						for (e=0; e < global_DisplayHeight; e++) { // height hardcoded
							// For every pixel on the screen ...
							if (  (e == 0) || (i == 0) || (e == 19) || (i == 39)  ){
								$scope.Screen[e][i].value = 8 ; //draw walls
							} else if (e == $scope.playerY && i == $scope.playerX) {
								$scope.Screen[e][i].value = 1 ; //draw player
							} else {
								$scope.Screen[e][i].value = 7 ; //draw background
							}
						}
					}
			    }

			    // main logic for the game. after the game has started, this gets called over and over until game over
			    $scope.gameMain = function() {

			    	// Draw fruit if needed
			    	if ($scope.spawnFruit == 0){
			    		do{
			    			// while there is no fruit, generate a random position and determine if the player exists there, else, draw the fruit there
			    			 var randomX = Math.floor((Math.random() * 39) + 1);
			    			 var randomY = Math.floor((Math.random() * 19) + 1);
			    			 // if it does not equal player, or wall (just to be safe), then spawn fruit
			    			 if (  ($scope.Screen[randomY][randomX].value != 8) && ($scope.Screen[randomY][randomX].value != 1)  ){
			    			 	$scope.Screen[randomY][randomX].value = 2;
			    			 	$scope.spawnFruit = 1;
			    			 }

			    		} while ($scope.spawnFruit == 0);
			    	}

			    	// Manage user input
			    	if (  (globalVars.getUserInput() == 87) && ($scope.lastDirection != 3)  ){ // up
			    		$scope.playerDirection = 1;
			    		$scope.lastDirection = 1;
			    	} else if (  (globalVars.getUserInput() == 65) && ($scope.lastDirection != 0)  ){ //left
			    		$scope.playerDirection = 2;
			    		$scope.lastDirection = 2;
			    	} else if (  (globalVars.getUserInput() == 68) && ($scope.lastDirection != 2)  ){ // right
			    		$scope.playerDirection = 0;
			    		$scope.lastDirection = 0;
			    	} else if (  (globalVars.getUserInput() == 83) && ($scope.lastDirection != 1)  ){ // down
			    		$scope.playerDirection = 3;
			    		$scope.lastDirection = 3;
			    	}



			    	//erase players head
			    	$scope.Screen[$scope.playerY][$scope.playerX].value = 7;

			    	// Move player
			    	if ($scope.playerDirection == 0){
			    		$scope.playerX += 1;
			    	} else if ($scope.playerDirection == 1) {
			    		$scope.playerY -= 1;

			    	} else if ($scope.playerDirection == 2) {
			    		$scope.playerX -= 1;

			    	} else if ($scope.playerDirection == 3) {
			    		$scope.playerY += 1;

			    	}

			    	// Detect if player hit fruit
			    	if  (  $scope.Screen[$scope.playerY][$scope.playerX].value == 2  ){
			    		// we set our flag to know to make new fruit next frame
			    		$scope.spawnFruit = 0;
			    		// we add to our body size, and store these coordinates.
			    		$scope.snakeBodySize += 1;
			    		$scope.snakeBody.unshift([$scope.snakeBodySize,$scope.playerX, $scope.playerY]);
			    		$scope.score += 10;

			    	}

			    	

			    	// erase all of our snake bodies on screen
			    	for (i = ($scope.snakeBodySize - 1); i >= 0; i--){
			    			$scope.Screen[$scope.snakeBody[i][2]][$scope.snakeBody[i][1]].value = 7;
				    }

				    //adjust our snake bodies on screen positions
			    	for (i = ($scope.snakeBodySize - 1); i >= 0; i--){
			    			if (i > 0){
			    				$scope.snakeBody[i][1] = angular.copy( $scope.snakeBody[(i-1)][1] );
			    				$scope.snakeBody[i][2] = angular.copy( $scope.snakeBody[(i-1)][2] );
			    			} else {
				    			$scope.snakeBody[i][1] = $scope.playerX;
				    			$scope.snakeBody[i][2] = $scope.playerY;
				    		}

			    	}

			    	// Detect if player hit a wall and lost
			    	if (  ($scope.Screen[ $scope.snakeBody[0][2] ][ $scope.snakeBody[0][1] ].value == 8)  ){
			    		$scope.gameState = 4;
			    	}

			    	// re-draw our snake bodies.
			    	for (i = ($scope.snakeBodySize - 1); i >= 0; i--){
			    		// check if our head collided with any other part of our body to see if we lost
			    		if (i > 1){ // cant hit the position directly before the head piece
				    		if (  ($scope.snakeBody[0][2] == $scope.snakeBody[i][2]) && ($scope.snakeBody[0][1] == $scope.snakeBody[i][1])  ){
				    			$scope.gameState = 4;
				    		}
			    		}
		    			$scope.Screen[$scope.snakeBody[i][2]][$scope.snakeBody[i][1]].value = 1;
			    	}
			    	
			    	
			    	// draw player head
			    	$scope.Screen[$scope.snakeBody[0][2]][$scope.snakeBody[0][1]].value = 4;

			    }

			    // stop the game when game over
			    $scope.gameOver = function() {
			    	$timeout.cancel(mytimeout);
			    }
				// We declare our timer variable at 50 MS
			    var mytimeout = $timeout($scope.onTimeout,global_gameSpeed);


			    // loadSnake gets called when the user loads the game. It sets our game state to initialize.
			    $scope.loadSnake = function(){
			    	//$(".inputRead").focus();
			    	document.getElementById('giveFocus').focus();
					$scope.userInput = globalVars.getUserInput();
				 	$scope.counter = 0;
				 	$scope.gameState = globalVars.gameState;
				 	$scope.initCounter = 0;
				 	$scope.playerX = 20;
				 	$scope.playerY = 10;
					$scope.playerDirection = 0;	
					$scope.spawnFruit = 0; 
					$scope.lastDirection = -1;
				
				// Player direction they travel. 0 is right, 1 is down, 2 is left, 3 is up.
				$scope.playerDirection = 0;		 	

				// we need to know how many snake pieces are the body
				$scope.snakeBodySize = 1;

				// snake body array. For every snake piece we want to know its order, and position
				$scope.snakeBody = [ [$scope.snakeBodySize,$scope.playerX, $scope.playerY] ];

				// how many points do you have?
				$scope.score = 0; 


				    $timeout.cancel(mytimeout);
			    	mytimeout = $timeout($scope.onTimeout,global_gameSpeed);
			    	$scope.colorize();
			    	$scope.gameState = 1;
			    	//globalVars.setScreen($scope.Screen);
			    }

			    // This will stop our game completely. (pause)
			    $scope.stop = function(){
			        $timeout.cancel(mytimeout);

			    }
			    // resume our gameplay
			    $scope.resume = function(){
			         mytimeout = $timeout($scope.onTimeout,global_gameSpeed);

			    }
			   

			    // When we want to update the display, we get the screen data.
			    //$scope.Screen = globalVars.getScreen();

			    // This is our init effect when the game first starts.
				$scope.colorize = function(  ) { 
					var colorCount = 0;
					$scope.Screen[2][2].value = 0;
					for (i=0; i < global_DisplayWidth; i++) {
						for (e=0; e < global_DisplayHeight; e++) {
							// For every pixel on the screen, randomize it.
							$scope.Screen[e][i].value = Math.floor((Math.random() * 7) + 0);
						}
					}
					// Once we are done modifying our screen data, send it back to our factory.
					globalVars.setScreen($scope.Screen);
	    		};




	    	// This is a demo function developed to test changing a pixel on the screen
	    	// this is no longer used
			$scope.setScreen = function() {
			        $scope.screen = [];
					$scope.screen = globalVars.getScreen();
					$scope.screen[2][2].value = 0;
					globalVars.setScreen($scope.screen);
					        
			   };
			// variable not used
			$scope.Alpha = globalVars;

			// When everything is all said and done, send back the game state.
	        globalVars.setState($scope.gameState);
	        // and game display
	        globalVars.setScreen($scope.screen);
		}]); // End Game Controller

	appGame
		.controller('inputController', ['$scope', '$http' , 'globalVars', function($scope, $http, globalVars) {  
				//input controller detects if we pressed up or down.
	    		$scope.isKeyDown = 0;
	    		$scope.isKeyUp = 0;
				$scope.isKeyPress = 0;
				$scope.globalVars = globalVars; //grab our global variables
			   	$scope.keyDown = function( event ) {
			   		//alert(event.keyCode);
			        $scope.isKeyDown = 1;
			        $scope.isKeyUp = 0;
			        globalVars.setUserInput(event.keyCode); //send our keycode
			        
			        
			    };

			    $scope.keyUp = function() {
			        $scope.isKeyUp = 1;
			        $scope.isKeyDown = 0;
			        $scope.isKeyPress = 0;
			    };
			    $scope.keyPress = function() {
			        $scope.isKeyPress = 1;
			    };
	    	    $scope.detectInput = function( event ) { 
	    			$scope.event = event;
	    	    };
	      	
		}]); // end input conroller

	appGame
		.controller('displayController', ['$scope', '$http' ,'$rootScope','globalVars', function($scope, $http, $rootScope, globalVars) {  
				// Height and width are hard coded here. With a little bit of work you could make this dynamic.
				$scope.DisplayWidth = global_DisplayWidth;
				$scope.DisplayHeight = global_DisplayHeight;
				// our screen array we populate with values
				$scope.Screen=[];
				// We first populate 1 line of pixels, then we duplicate this for height
				$scope.WidthArray = [];
				// this is a pixel object. due to not being allowed duplicate array values when using ng-repeat, we use key/value pairs
				$scope.pixel = [];
				//These colors are used when drawing to the screen
				$scope.backgroundArray = ['#199229','#FF0000', '#00FF00', '#F0F0F0', '#ABCDEF', '#11A3c9', '#A11FF1', '#222222', '#DDDDDD'];
				// For every width of the screen populate the width array
  				for (i=0; i < $scope.DisplayWidth; i++) {
					$scope.counter = i;
					$scope.key = $scope.counter.toString();
					$scope.value = $scope.counter;
					//$scope.pixels[ $scope.key ] = $scope.value;
					$scope.pixel = {key: $scope.key, value: $scope.value}
				    $scope.WidthArray.push( angular.copy($scope.pixel ) );
				}
				// For every height of the screen, copy the width that many times
				for (i=0; i < $scope.DisplayHeight; i++) {
				  $scope.Screen.push( angular.copy($scope.WidthArray) ); // angular copy allows us to change 1 array and not effect other copies
				}

				// For fun, change 1 pixel to black.
				$scope.Screen[6][6].value = 0;
				
				globalVars.setScreen($scope.Screen);
	    		$scope.resizeScreen = function(h, w) {
	    			global_DisplayWidth = w;
	    			global_DisplayHeight = h;
			        $scope.DisplayWidth = global_DisplayWidth;
					$scope.DisplayHeight = global_DisplayHeight;
			    };
	    		
		}]); // end dispay




}()); // end app