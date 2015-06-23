'use strict';

/**
 * @ngdoc function
 * @name globiandaApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the globiandaApp
 */
angular.module('tfaApp')
  .controller('NavbarCtrl', function ($scope, authsrv, $location) {

    //current user status
    $scope.isLoggedIn = false;
    $scope.isTeacher = false;
    $scope.isStudent = false;
	
    //
    $scope.actUser = {};
    $scope.fbProfileUrl = '';

    $scope.$watch(function() {
    	return authsrv.getCurrentUser();
    }, function(newValue) {
        $scope.isLoggedIn = authsrv.isLoggedIn();
    	if ($scope.isLoggedIn) {
            $scope.actUser = newValue;
            $scope.isTeacher = authsrv.hasAccess('teacher');
            $scope.isStudent = authsrv.hasAccess('student');
    	} else {
            $scope.fbProfileUrl = '';
            $scope.isTeacher = false;
            $scope.isStudent = false;
            $scope.actUser = {};
    	}
    });

    $scope.isActive = function(route) {
	   return route === $location.path();
	};

  });
