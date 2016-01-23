var app = angular.module('meetUpPlanner', []);

app.controller('formCtrl', ["$scope",function($scope){
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

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			if(position.address){
				$scope.zip = position.address.postalCode;
				$scope.country = position.address.country;
			}
		});
	}

}]);


