'use strict';

/**
 * @ngdoc function
 * @name globiandaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the globiandaApp
 */
angular.module('tfaApp')
  .controller('MainCtrl', function ($scope, $location, authsrv) {

    //current user status
    $scope.isLoggedIn = false;
    $scope.isTeacher = false;
    $scope.isStudent = false;

    $scope.$watch(function() {
      return authsrv.getCurrentUser();
    }, function(newValue) {
      $scope.isLoggedIn = authsrv.isLoggedIn();
      if ($scope.isLoggedIn) {
        $scope.isTeacher = authsrv.hasAccess('teacher');
        $scope.isStudent = authsrv.hasAccess('student');
      } else {
        $scope.isTeacher = false;
        $scope.isStudent = false;
      }
      if($scope.isTeacher){
        $location.path('/teacher/contents');
      } else if ($scope.isStudent) {
        $location.path('/student/contents/mycontent');
      } else {
        console.log('consomepanchi error');
      }
    });
  });
