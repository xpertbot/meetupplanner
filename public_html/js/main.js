var ref = new Firebase("https://glowing-fire-6341.firebaseio.com");
var app = angular.module('app', ['ngRoute','ngCookies', 'firebase']);

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

function loginCtrl($scope, $firebaseAuth, $location, $cookies){
	auth = $firebaseAuth(ref);
	$scope.formData = {
		email: "",
		password: "",
	}
	$scope.login = function(formData){
		$scope.authData = null;
		$scope.error = null;
		auth.$createUser(formData).then(function(authData){
			$cookies.put(userId, authData.uid);
			$location.path("/");
		}).catch(function(error){
			console.log(error);
			$scope.error = error;
		});
	}
};
function signUpCtrl($scope, $http, $firebaseObject, $location){
	$scope.formData = {};

	$scope.processForm = function(){
		ref.createUser({
			email: $scope.formData.email,
			password: $scope.formData.password,
		}, function(error, userData){
			if(error){
				$scope.error(error);
			} else {
				var userRef = ref.child("users");
				userRef.child(userData.uid).set({
					name: $scope.formData.name,
					bio: $scope.formData.bio,
				}, function(){
					ref.authWithPassword({
						"email": $scope.formData.email,
						"password": $scope.formData.password,
					}, function(error, authData){
						if(error){
							console.log("Error authenticating User");
						} else {
							$location.path("/");
						}
					});
				});
			}
		});
	}
};
function eventCtrl($scope, $firebaseObject){

	$scope.data = $firebaseObject(ref)
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

