var ref = new Firebase("https://glowing-fire-6341.firebaseio.com");

var app = angular.module('app', ['ngRoute','ngCookies', 'firebase'])
.config(function($routeProvider, $locationProvider){
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

}).run(function($rootScope, $location, $cookies){
	var user = $cookies.get("user");
	$rootScope.loggedInUser = user;
	$rootScope.$on("$routeChangeStart", function(event, next, current){
		if(! $rootScope.loggedInUser){
			var publicPages = [
				"/pages/login.html",
				"/pages/sign-up.html",
			];
			if(publicPages.indexOf(next.templateUrl) !== -1){

			} else {
				$location.path('/login');
			}
		}
	});
});

function loginCtrl($scope, $firebaseAuth, $location, $cookies, $rootScope){
	if($rootScope.loggedInUser){
		$location.path("/");
	}
	auth = $firebaseAuth(ref);

	$scope.remember = false;
	$scope.formData = {
		email: "",
		password: "",
	}

	$scope.login = function(formData){
		$scope.authData = null;
		$scope.error = null;
		auth.$authWithPassword(formData).then(function(authData){
			if($scope.remember){
				$cookies.put("user", authData.uid);
			}
			$rootScope.loggedInUser = authData.uid;
			$location.path("/");
		}).catch(function(error){
			$scope.error = error;
		});
	}
};
function signUpCtrl($scope, $http, $firebaseObject, $location){
	if($rootScope.loggedInUser){
		$location.path("/");
	}
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

	$scope.data = $firebaseObject(ref);
	console.log($scope.data);
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

