(function() {
var ref = new Firebase("https://glowing-fire-6341.firebaseio.com");

var app = angular.module('app', ['ngRoute','ngCookies', 'firebase'])
.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl:'/pages/event.html',
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
			if(publicPages.indexOf(next.templateUrl) == -1){
				$location.path('/login');
			}
		}
	});
});

function eventCtrl($scope, $rootScope, $firebaseArray){
	$scope.currentEvents = $firebaseArray(ref.child("events"));

	$scope.newEvent = {
		guestList: []
	};

	$scope.addEvent = function(){
		$scope.newEvent.user = $rootScope.loggedInUser;
		ref.child("events").push().set({
			name: $scope.newEvent.name,
			type: $scope.newEvent.type,
			startDate: $scope.newEvent.startDate.getTime(),
			endDate: $scope.newEvent.endDate.getTime(),
			guestList: $scope.newEvent.guestList,
			address: $scope.newEvent.address,
			city: $scope.newEvent.city,
			zip: $scope.newEvent.zip,
			country: $scope.newEvent.country,
			additionalInfo: $scope.newEvent.additionalInfo
		});
		$scope.newEvent = {guestList: []};
	}
	$scope.addGuest = function(){
		$scope.newEvent.guestList.push($scope.guest);
		$scope.guest = "";
	}

};

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
		$scope.errors = [];
		auth.$authWithPassword(formData).then(function(authData){
			if($scope.remember){
				$cookies.put("user", authData.uid);
			}
			$rootScope.loggedInUser = authData.uid;
			$location.path("/");
		}).catch(function(error){
			console.log(error);
			$scope.errors.push(error);
		});
	}
};

function signUpCtrl($scope, $http, $location, $rootScope){
	if($rootScope.loggedInUser){
		$location.path("/");
	}
	$scope.formData = {};

	$scope.processForm = function(){
		$scope.errors = [];
		ref.createUser({
			email: $scope.formData.email,
			password: $scope.formData.password,
		}, function(error, userData){
			if(error){
				console.log(error);
				$scope.errors.push(error);
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
							console.log(error);
							$scope.errors.push(error);
						} else {
							$location.path("/");
						}
					});
				});
			}
		});
	}
};
})();
