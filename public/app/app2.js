//

(function() {
	// Declare our App here.
	var appGame = angular.module('gameApp', ['ngAnimate']);






// Create the factory that share the Fact
appGame.factory('globalVars', function(){

	var data = {
        FirstName: '',
        screen: [],
        gameState: 0,
        userInput: 0,
        leaderBoard: []
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
appGame.controller('highscores', function($scope, $http, globalVars) {
    $http.get('/public/app/restfuls.json').
        then(function(response) {
            $scope.board = response.data;
            globalVars.setLeaderBoard($scope.board);
            //alert(globalVars.getLeaderBoard());
        });   
});


/*
	appGame
		.factory("mySharedService", function($rootScope){
        var mySharedService = {};

        mySharedService.values = {};

        mySharedService.setValues = function(params){
            mySharedService.values = params;
            $rootScope.$broadcast('dataPassed');
        }

        return mySharedService; 
   });
*/

	appGame
		.controller('testController', ['$scope', function($scope) {
			$scope.playerX = 20;

	}]);
	
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
				//alert($scope.userInput);

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
			 	$scope.playerTailX = 20;
			 	$scope.playerTailY = 10;
			 	// store the 'direction' of the tail too.  0 is right, 1 is down, 2 is left, 3 is up.
			 	$scope.playerTailDirection = 0;

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

				$scope.highScore = function(){
					// data to post nodejs server
					var person = prompt("Please enter your name for highscore", "Jon Snow");
					if (person === null) {
				        return; //break out of the function early
				    }
				    $scope.gameState = 5;
					$scope.data = globalVars.getLeaderBoard();
					
			        //alert($scope.data);
					var _data = {
					    'message': 'Can I help you?'
					};
					$scope.items = $scope.data ;

					$scope.items.push({
				        name: person,
				        score: $scope.score
				    });

				    var data = angular.toJson($scope.items);

					$scope.objectToJSON = {};
					var taskCopy = angular.copy($scope._data);
				        
				        if (angular.isObject(taskCopy)) {
				        		$scope.objectToJSON = $filter('json')(taskCopy);
				        }
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
			        mytimeout = $timeout($scope.onTimeout,100);
			    }

			    $scope.newGame = function() {
			    	$scope.Screen = globalVars.getScreen();
			    	for (i=0; i < 40; i++) { //width hardcoded
						for (e=0; e < 20; e++) { // height hardcoded
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



			    	//erase players tail
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
			    		if (i > 1){
				    		if (  ($scope.snakeBody[0][2] == $scope.snakeBody[i][2]) && ($scope.snakeBody[0][1] == $scope.snakeBody[i][1])  ){
				    			$scope.gameState = 4;
				    		}
			    		}
		    			$scope.Screen[$scope.snakeBody[i][2]][$scope.snakeBody[i][1]].value = 1;
			    	}
			    	
			    	
			    	// draw player head
			    	$scope.Screen[$scope.snakeBody[0][2]][$scope.snakeBody[0][1]].value = 4;

			    }

			    $scope.gameOver = function() {
			    	$timeout.cancel(mytimeout);
			    }
				// We declare our timer variable at 50 MS
			    var mytimeout = $timeout($scope.onTimeout,100);


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
			    	mytimeout = $timeout($scope.onTimeout,100);
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
			         mytimeout = $timeout($scope.onTimeout,100);

			    }
			   

			    // When we want to update the display, we get the screen data.
			    //$scope.Screen = globalVars.getScreen();

			    // This is our init effect when the game first starts.
				$scope.colorize = function(  ) { 
					var colorCount = 0;
					$scope.Screen[2][2].value = 0;
					for (i=0; i < 40; i++) {
						for (e=0; e < 20; e++) {
							// For every pixel on the screen, randomize it.
							$scope.Screen[e][i].value = Math.floor((Math.random() * 7) + 0);
						}
					}
					// Once we are done modifying our screen data, send it back to our factory.
					globalVars.setScreen($scope.Screen);
	    		};




	    	// This is a demo function developed to test changing a pixel on the screen
			$scope.setScreen = function() {
			        $scope.screen = [];
					$scope.screen = globalVars.getScreen();
					$scope.screen[2][2].value = 0;
					globalVars.setScreen($scope.screen);
					        
			   };
			
			$scope.Alpha = globalVars;
			

			// When everything is all said and done, send back the game state.
	        globalVars.setState($scope.gameState);
	        // and game display
	        globalVars.setScreen($scope.screen);
		}]); // End Game Controller

	appGame
		.controller('inputController', ['$scope', '$http' , 'globalVars', function($scope, $http, globalVars) {  
				//$scope.B = globalVars;
	    		$scope.isKeyDown = 0;
	    		$scope.isKeyUp = 0;
				$scope.isKeyPress = 0;
				$scope.globalVars = globalVars;
			   	$scope.keyDown = function( event ) {
			   		//alert(event.keyCode);
			        $scope.isKeyDown = 1;
			        $scope.isKeyUp = 0;
			        globalVars.setUserInput(event.keyCode);
			        
			        
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
				$scope.DisplayWidth = 40;
				$scope.DisplayHeight = 20;
				$scope.Screen=[];
				$scope.WidthArray = [];
				$scope.pixel = [];
				//$scope.pixels = [];
				$scope.backgroundArray = ['#199229','#FF0000', '#00FF00', '#F0F0F0', '#ABCDEF', '#11A3c9', '#A11FF1', '#222222', '#DDDDDD'];

  				for (i=0; i < $scope.DisplayWidth; i++) {
					$scope.counter = i;
					$scope.key = $scope.counter.toString();
					$scope.value = $scope.counter;
					//$scope.pixels[ $scope.key ] = $scope.value;
					$scope.pixel = {key: $scope.key, value: $scope.value}
				    $scope.WidthArray.push( angular.copy($scope.pixel ) );
				}
				for (i=0; i < $scope.DisplayHeight; i++) {
				  $scope.Screen.push( angular.copy($scope.WidthArray) );
				}


				$scope.Screen[6][6].value = 0;
				

	    		//$scope.globalVar = globalVars;
	    		//$scope.globalVar.data.FirstName.push( angular.copy($scope.Screen ) ) ;
	    		globalVars.setScreen($scope.Screen);
	    		////alert(globalVars.getScreen());
				//$scope.Screen[0][0].value = 2;

  					/*

				for (i=0; i < $scope.DisplayWidth; i++) {
				  $scope.WidthArray.push( angular.copy($scope.pixel) );
				  if ($scope.pixel < 9){
				  	$scope.pixel++;
				  } else {
				  	$scope.pixel = 0;
				  }
				}
				for (i=0; i < $scope.DisplayHeight; i++) {
				  $scope.Screen.push( angular.copy($scope.WidthArray) );
				}
				//$scope.Screen = $scope.Screen.slice();
				$scope.Screen[14][15] = 7;
				//alert($scope.Screen[1][1] );
				var i = 0;
				var length = $scope.Screen.length;
				var e = 0;
				var length2 = $scope.Screen[0].length
				for (i = 0; i < length; i++) {
					for (e = 0; e < length2; e++) {
				  		// do something with array[i]
				  		if ((e == 5) && (i == 5)){
				  			$scope.Screen[i][e] = 1;
				  		}
					}
				}
					   */
	      	
		}]);



/*
	TWITTER
*/

}();