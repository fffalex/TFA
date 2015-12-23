'use strict';

angular.module('tfaApp')
  .controller('MyStudentsCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService,$route) {
    $scope.courses = [];
    $scope.selectedCourse = {};

    $scope.selectCourse = function(index){
      $scope.selectedCourse = $scope.courses[index];
    };

    coursesrv.getAllStudentsInCourse(Parse.User.current(),{
        success: function(coursesFull){
          $scope.courses = coursesFull;
          $scope.selectedCourse = $scope.courses[0];
          $scope.$apply();
        },
        error: function (error){
          $scope.error = error;
        }
      });

    //Agregar un ERROR:?

    $scope.predicate = 'date';
    $scope.reverse = true;

    $scope.orderField = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };

  });
