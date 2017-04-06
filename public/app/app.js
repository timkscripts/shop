/*
	Shop
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
        userData: [],	//Who are you logged in as
        itemData: [],	//All json data related to all items
        userCart: [],	//whats in your cart?
        cartQty: 0,    	    // how many are in your cart
        userHistory: []
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
        },
        getUserData: function () {
            return data.userData;
        },
        setUserData: function (userData) {
            data.userData = userData;
        },
        getItemData: function () {
            return data.itemData;
        },
        setItemData: function (itemData) {
            data.itemData = itemData;
        },
        getUserCart: function () {
            return data.userCart;
        },
        setUserCart: function (userCart) {
            data.userCart = userCart;
        },
        getCartQty: function () {
            return data.cartQty;
        },
        setCartQty: function (CartQtys) {
            data.cartQty = CartQtys;
        }, 
        getUserHistory: function () {
            return data.userHistory;
        },
        setUserHistory: function (userHistory) {
            data.userHistory = userHistory;
        }
    };

});

/*
														Login Conroller
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('loginController', function($scope, $http, globalVars, $window, $http) {
    $scope.login = function(){
    			    // grab the user data
					//$scope.data = globalVars.getUserData();
					// create something to store username
					$scope.user = [] ;
					// push the username to our user data
					$scope.user.push({
				        name: $scope.username
				    });
					// turns out angular populates hashkey values into the arrays. so we erase those
				    var data = angular.toJson($scope.user);
				        
				    // We post the data to the json
					$http({
				    	url: '/user',
				    	method: "POST",
				    	data: data, 
				    	header: { 'Content-Type': 'application/json' }
					});

					$window.location.href = '/shop.html';
	}
});

/*
														LogOut Conroller
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('logoutController', function($scope, $http, globalVars, $window, $http) {
    $scope.logout = function(){
    			    // grab the user data
					//$scope.data = globalVars.getUserData();
					// create something to store username
					$scope.user = [] ;
					
					// turns out angular populates hashkey values into the arrays. so we erase those
				    var data = angular.toJson($scope.user);
				        
				    // We post the data to the json
					$http({
				    	url: '/user',
				    	method: "POST",
				    	data: data, 
				    	header: { 'Content-Type': 'application/json' }
					});

					$window.location.href = '/';
	}
});

/*
														Set User Information
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('setUserInfoController', function($scope, $http, globalVars) {

	    $http.get('/public/app/user.json').
	        then(function(response) {
	        	//grab the response data
	            $scope.userData = response.data;
	            //set ur user information
	            globalVars.setUserData($scope.userData);
	        });   // http get

	       


		}); // controller

/*
														Set Cart Information
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('setUserCartController', function($scope, $http, globalVars) {
				// Keep track of the users cart QTY
				$scope.qty = globalVars.getCartQty();
	    		 
				$http.get('/public/app/userCart.json').
		        then(function(response) {
		        	//grab the response data
		            $scope.cartData = response.data;
		            //set ur user information
		            globalVars.setUserCart($scope.cartData);

   				

					
		        });   // http get

		       
	            
		});

appGame.controller('setUserCartController2', function($scope, $http, globalVars) {
				// Keep track of the users cart QTY
				$scope.qty = globalVars.getCartQty();
	    		 

		       
	            
		});
/*
														Set Item Information
				-------------------------------------------------------------------------------------------------------------------------------------
				-------------------------------------------------------------------------------------------------------------------------------------
*/
appGame.controller('setItemInfoController', function($scope, $http, globalVars, $window) {
		$scope.qty = globalVars.getCartQty();
		//when we show the user their cart
		$scope.currentCart = globalVars.getUserCart();
		// get current user
		$scope.currentUser = globalVars.getUserData();
		//store user history
		$scope.uHistory = globalVars.getUserHistory();
		// itemWidth is the size of the image on default. When the user mouse overs, it increases
		$scope.itemWidth = '100px';
		// itemHeight is the size of the image on default, when the user mouse overs it increases
		$scope.itemHeight = '100px';
		// filter is the current filter set
		$scope.filter = [];
		// the background colors for our filter menu
		$scope.foodColor = 'white';
		$scope.bookColor = 'white';
		$scope.cleanColor = 'white';
		$scope.electronicColor = 'white';
		$scope.kitchenColor = 'white';
		// we determine what the user is viewing here, main page = 0, item page = 1, 2 is cart page, 3 is history
		$scope.location = 0;
		// when we view an items page we need to know what item we are viewing
		$scope.currItem = "";
		// store what map view we have
		$scope.mapPlace = "sears";
		// When we click on a filter, we want to add it to our filter list
		$scope.addItem = function(itemToAdd, colorToChange){
				
					// for each item type, we set our background color and add to our filter array
					if (itemToAdd == "Food"){
			    		if ($scope.foodColor == 'red'){
			    			$scope.foodColor = 'white';
			    			for(var i = 0 ; i < $scope.filter.length; i++){
							    if($scope.filter[i].hasOwnProperty('name') && $scope.filter[i].name === itemToAdd) {
							     	$scope.filter.splice(i, 1)
							    }
							} 
			    			
			    		} else {

			    			$scope.foodColor = 'red';
			    			$scope.filter.push({
						        name:itemToAdd
						    });
			    		}
			    	} // food if
			    	else if (itemToAdd == "Book"){
			    		if ($scope.bookColor == 'red'){
			    			$scope.bookColor = 'white';
			    			for(var i = 0 ; i < $scope.filter.length; i++){
							    if($scope.filter[i].hasOwnProperty('name') && $scope.filter[i].name === itemToAdd) {
							     	$scope.filter.splice(i, 1)
							    }
							} 
			    			
			    		} else {

			    			$scope.bookColor = 'red';
			    			$scope.filter.push({
						        name:itemToAdd
						    });
			    		}
			    	} // book if
			    	else if (itemToAdd == "Cleaning"){
			    		if ($scope.cleanColor == 'red'){
			    			$scope.cleanColor = 'white';
			    			for(var i = 0 ; i < $scope.filter.length; i++){
							    if($scope.filter[i].hasOwnProperty('name') && $scope.filter[i].name === itemToAdd) {
							     	$scope.filter.splice(i, 1)
							    }
							} 
			    			
			    		} else {

			    			$scope.cleanColor = 'red';
			    			$scope.filter.push({
						        name:itemToAdd
						    });
			    		}
			    	} // Cleaning if
			    	else if (itemToAdd == "Electronic"){
			    		if ($scope.electronicColor == 'red'){
			    			$scope.electronicColor = 'white';
			    			for(var i = 0 ; i < $scope.filter.length; i++){
							    if($scope.filter[i].hasOwnProperty('name') && $scope.filter[i].name === itemToAdd) {
							     	$scope.filter.splice(i, 1)
							    }
							} 
			    			
			    		} else {

			    			$scope.electronicColor = 'red';
			    			$scope.filter.push({
						        name:itemToAdd
						    });
			    		}
			    	} // Electronic if
			    	else if (itemToAdd == "Kitchen"){
			    		if ($scope.kitchenColor == 'red'){
			    			$scope.kitchenColor = 'white';
			    			for(var i = 0 ; i < $scope.filter.length; i++){
							    if($scope.filter[i].hasOwnProperty('name') && $scope.filter[i].name === itemToAdd) {
							     	$scope.filter.splice(i, 1)
							    }
							} 
			    			
			    		} else {

			    			$scope.kitchenColor = 'red';
			    			$scope.filter.push({
						        name:itemToAdd
						    });
			    		}
			    	} // Kitchen if
			    	
		}

		// we clear the filter
		$scope.clearFilter = function(){
			$scope.filter = [];
			$scope.foodColor = 'white';
			$scope.bookColor = 'white';
			$scope.cleanColor = 'white';
			$scope.electronicColor = 'white';
			$scope.kitchenColor = 'white';
		}

		// When the user clicks to view shop
		$scope.showShop = function(){
			$scope.location = 2; // shop page
			$scope.currentCart = globalVars.getUserCart();
			$scope.currentUser = globalVars.getUserData();
			$scope.data = globalVars.getUserCart();
					//alert($scope.data);
					// set up our items in the cart
					$scope.items = $scope.data ;
		}
		// We need to check when our filter is active what are we filtering by
        $scope.hasValue = function(obj, key, value, i) {
        	//alert(i);
        	

        	for(var i = 0 ; i < obj.length; i++){
			    if(obj[i].hasOwnProperty(key) && obj[i].name === value) {

			     	return true;
			    }
			} 


		    return false;
		}
		// when the user clicks an item, we show the item details here
		$scope.showItem = function(item, trackHistory){ //if trackHistory is 0, track it
			$scope.location = 1; // item page
			$scope.currItem = item; // our current item view

			if (trackHistory == 0){
				$scope.userHistory = globalVars.getUserHistory();
				$scope.items = $scope.userHistory;
				// if there is no user history then...
				if ($scope.items.length < 1){
					
					$scope.items = [];
				}
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();

				if(dd<10) {
				    dd='0'+dd
				} 

				if(mm<10) {
				    mm='0'+mm
				} 

				today = mm+'/'+dd+'/'+yyyy;
				// push the user name and where they navigated
				$scope.items.push({
							uname:$scope.currentUser,
			        		itemname:item,
			        		time:today
			    });
				
				// update our local history
				globalVars.setUserHistory($scope.items);

				// turns out angular populates hashkey values into the arrays. so we erase those
			    var data = angular.toJson($scope.items);
			    // We post the data to the json
				$http({
			    	url: '/uhistory',
			    	method: "POST",
			    	data: data, 
			    	header: { 'Content-Type': 'application/json' }
				});
			}
		}
		// when the user clicks to go back on the item page
		$scope.goBack = function(item){
			$scope.location = 0; // item page
			
		}

		//When the user clicks add to cart
		$scope.addCart = function(itemName, locationName, locationContact, locationAddress){
					// grab our user data, to determine our user name
					$scope.userDataReturn = globalVars.getUserData();
					// when we add something to the cart, we tie it to the current user
					$scope.userName = $scope.userDataReturn[0].name
					//alert($scope.userName);
			 		// grab tthe cart data
					$scope.data = globalVars.getUserCart();
					//alert($scope.data);
					// set up our items in the cart
					$scope.items = $scope.data ;
					//alert($scope.data);

					//We need a flag to know if this item is already in the cart
					$scope.flagInCart = 0; //0 is no, 1 is yes
					$scope.qty = 1; //if item exists, grab quantity
					// check if cart data exists, if so add to QTY
					for(var i = 0 ; i < $scope.items.length; i++){
								    if  (  ($scope.items[i].uname == $scope.userName) && ($scope.items[i].laddress == locationAddress)  && ($scope.items[i].itemname == itemName) ) {
								    	//alert("name already exists");
								    	$scope.flagInCart = 1;
								    	$scope.qty = $scope.items[i].qty + 1;
								    	
								    	$scope.items.splice(i, 1); //remove record from item to re-add with proper qty
								    }
								} 

					// if our current cart is empty, we need to define a new array here
					if ($scope.items.length < 1){
						
						$scope.items = [];
					}

					// push the user name and their score
					$scope.items.push({
								uname:$scope.userName,
				        		itemname:itemName,
						        lname:locationName,
						        lcontact:locationContact,
						        laddress:locationAddress,
						        qty:$scope.qty,
						        delivery:"pickup"

				    });
					
					// update our local cart
					globalVars.setUserCart($scope.items);

					// turns out angular populates hashkey values into the arrays. so we erase those
				    var data = angular.toJson($scope.items);


			// globalVars.setUserCart($scope.items);
        		$scope.cartData = globalVars.getUserCart();
	           // grab our user data, to determine our user name
				$scope.userDataReturn = globalVars.getUserData();
				$scope.qty = 0;
				// when we add something to the cart, we tie it to the current user
				if ($scope.userDataReturn.length > 0){
					$scope.userName = $scope.userDataReturn[0].name;
					
		            for(var i = 0 ; i < $scope.cartData.length; i++){
						    if  (  ($scope.cartData[i].uname == $scope.userName) ) {
						    	//$scope.qty = $scope.items[i].qty + 1;
						    	
						    	$scope.qty += $scope.cartData[i].qty;
						    } // if
					} // for
				} // if
				$scope.returnQty = [];
				$scope.returnQty.push({qty:$scope.qty});
				globalVars.setCartQty($scope.returnQty[0].qty);
				

				        
				    // We post the data to the json
					$http({
				    	url: '/cart',
				    	method: "POST",
				    	data: data, 
				    	header: { 'Content-Type': 'application/json' }
					});
		}

		// this is how we got our item json data
	    $http.get('/public/app/item.json').//retrieve items
	        then(function(response) {
	        	//grab the response data
	            $scope.itemData = response.data.Items;
	            //set ur user information
	            globalVars.setItemData($scope.itemData);
	            
	        });

	        // this is how we got our item json data
	    $http.get('/public/app/userHistory.json').//retrieve user history
	        then(function(response) {
	        	//grab the response data
	            $scope.historyData = response.data;
	            //set ur user information
	            globalVars.setUserHistory($scope.historyData);
	            
	        });
	        $scope.viewHistory = function(){
	        	$scope.uHistory = globalVars.getUserHistory();
	        	$scope.currentUser = globalVars.getUserData();
	        	$scope.location = 3;

	        }
	        $scope.viewMap = function(mapplace){
	        	$scope.location = 4;
	        	$scope.mapPlace = mapplace;

	        }

	           globalVars.setCartQty($scope.qty);
	           globalVars.setUserCart($scope.items);

				// Keep track of the users cart QTY
				$scope.qty = globalVars.getCartQty();
	    		 
				$http.get('/public/app/userCart.json').
		        then(function(response) {
		        	//grab the response data
		            $scope.cartData = response.data;
		            //set ur user information
		            globalVars.setUserCart($scope.cartData);

   				// globalVars.setUserCart($scope.items);
        		$scope.cartData = globalVars.getUserCart();
	           // grab our user data, to determine our user name
				$scope.userDataReturn = globalVars.getUserData();
				$scope.qty = 0;
				// when we add something to the cart, we tie it to the current user
				if ($scope.userDataReturn.length > 0){
					$scope.userName = $scope.userDataReturn[0].name;
					
		            for(var i = 0 ; i < $scope.cartData.length; i++){
						    if  (  ($scope.cartData[i].uname == $scope.userName) ) {
						    	//$scope.qty = $scope.items[i].qty + 1;
						    	
						    	$scope.qty += $scope.cartData[i].qty;
						    } // if
					} // for
				} // if
				$scope.returnQty = [];
				$scope.returnQty.push({qty:$scope.qty});
				globalVars.setCartQty($scope.returnQty[0].qty);
				

					
		        });   // http get
	           	
		        $scope.myFunction = function() {
				    document.getElementById("myDropdown").classList.toggle("show");
				}

				// Close the dropdown menu if the user clicks outside of it
				$window.onclick = function(event) {
				  if (!event.target.matches('.dropbtn')) {

				    var dropdowns = document.getElementsByClassName("dropdown-content");
				    var i;
				    for (i = 0; i < dropdowns.length; i++) {
				      var openDropdown = dropdowns[i];
				      if (openDropdown.classList.contains('show')) {
				        openDropdown.classList.remove('show');
				      }
				    }
				  }
				} //$window

				$scope.setDelivery = function(type, index){

					$scope.currentCart[index].delivery = type;
				}
					           //$scope.qty = globalVars.getCartQty();
		});






/*



								XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



*/





}()); // end app