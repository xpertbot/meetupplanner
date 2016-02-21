var ref = new Firebase("https://glowing-fire-6341.firebaseio.com");

var app = angular.module('app', ['ngRoute','ngCookies', 'firebase'])
.config(["$routeProvider", "$locationProvider" ,
function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl:'/pages/event.html',
			controller: "eventCtrl",
		}).when('/sign-up', {
			templateUrl: '/pages/sign-up.html',
			controller: "signUpCtrl",
		}).when('/login', {
			templateUrl:'/pages/login.html',
			controller: "loginCtrl",
		}).otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);

}
]).run(["$rootScope", "$location", "$cookies",
function($rootScope, $location, $cookies){
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
}
]).directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);

app.controller("eventCtrl", ["$scope", "$rootScope", "$firebaseArray","$cookies", "$location",
function($scope, $rootScope, $firebaseArray, $cookies, $location){
	$scope.currentEvents = $firebaseArray(ref.child("events"));

	$scope.newEvent = {
		guestList: []
	};

	$scope.addEvent = function(isValid){
		if(isValid){
			$scope.newEvent.user = $rootScope.loggedInUser;
			$scope.newEvent.startDate = $scope.newEvent.startDate.getTime(),
			$scope.newEvent.endDate = $scope.newEvent.endDate.getTime(),

			ref.child("events").push().set($scope.newEvent);
			$scope.newEvent = {guestList: []};
			$scope.eventForm.$setPristine(true);
			$scope.eventForm.$setUntouched(true);
		}
	}
	$scope.addGuest = function(){
		$scope.newEvent.guestList.push($scope.guest);
		$scope.guest = "";
	}

	$scope.logout = function(){
		$rootScope.loggedInUser = null;
		$cookies.remove("user");
		$location.path("/login");
	}

	if("geolocation" in navigator){
		//Generate Location information for the event.
		navigator.geolocation.getCurrentPosition(function(position){
			// console.log(position);
		}, function(error){
			console.log("ERROR:" + error.code + " - "+ error.message);
		});
	} else {
		// Empty Models for the location information

	}
}
]);

app.controller("loginCtrl", ["$scope", "$firebaseAuth", "$location", "$cookies", "$rootScope",
function($scope, $firebaseAuth, $location, $cookies, $rootScope){
	if($rootScope.loggedInUser){
		$location.path("/");
	}

	auth = $firebaseAuth(ref);

	$scope.remember = false;
	$scope.loginData = {
		email: "",
		password: "",
	}

	$scope.login = function(isValid){
		if(isValid){
			$scope.authData = null;
			auth.$authWithPassword($scope.loginData).then(function(authData){
				if($scope.remember){
					$cookies.put("user", authData.uid);
				}
				$rootScope.loggedInUser = authData.uid;
				$location.path("/");
			}).catch(function(error){
				$scope.errors = [];
				$scope.errors.push(error);
			});
		}
	}
}
]);


app.controller('signUpCtrl', ['$scope', "$http", "$location", "$rootScope",
function($scope, $http, $location, $rootScope){
	if($rootScope.loggedInUser){
		$location.path("/");
	}
	$scope.signUpData = {};
	$scope.userData = {
		name: "",
		bio: "",
	};

	$scope.processForm = function(isValid){
		if(isValid){
			ref.createUser({
				email: $scope.signUpData.email,
				password: $scope.signUpData.password,
			}, function(error, userData){
				if(error){
					$scope.errors = [];
					$scope.errors.push(error);
				} else {
					var userRef = ref.child("users");
					userRef.child(userData.uid).set($scope.userData, function(){
						$rootScope.$apply(function(){
							$location.path('/login');
							console.log($location.path());
						});
					});
				}
			});
		}
	}
}
]);

