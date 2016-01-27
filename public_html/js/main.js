var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/pages/event.html',
			controller: eventCtrl,
		}).when('/sign-up', {
			templateUrl: '/pages/sign-up.html',
			controller: signUpCtrl,
		}).when('/login', {
			templateUrl:'/pages/login.html',
			controller: loginCtrl,
		}).otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

});

function loginCtrl($scope){
	console.log('Login');
};
function eventCtrl($scope){
	$scope.guestList = new Array();
	$scope.events = [];
	var newEvent = new Object();

	$scope.addEvent = function(){
		$scope.events.push(newEvent);
	}
	$scope.addGuest = function(){
		$scope.guestList.push($scope.guest);
		$scope.guest = "";
		console.log($scope.guestList);
	}

	$scope.check = function(value){
		console.log(value);
	}

	// if(navigator.geolocation){
	// 	navigator.geolocation.getCurrentPosition(function(position){
	// 		if(position.address){
	// 			$scope.zip = position.address.postalCode;
	// 			$scope.country = position.address.country;
	// 		}
	// 	});
	// }

};
function signUpCtrl($scope){
	console.log('sign Up');
};
