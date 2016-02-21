'use strict';

angular.module('tfaApp')
  .controller('TeacherMyStudentsCtrl', function ($scope, $routeParams, examsrv, unitsrv, coursesrv, ModalService,$route) {
    $scope.courses = [];
    $scope.selectedCourse = {};
    $scope.allRowsSelected = false;

    $scope.selectCourse = function(index){
      $scope.selectedCourse = $scope.courses[index];
      $scope.allRowsSelected = false;
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

    $scope.selectAllRows = function () {
      if ($scope.allRowsSelected) {
        for (var i = 0; i < $scope.selectedCourse.students.length; i++) {
          $scope.selectedCourse.students[i].selected = true;
        }
        $scope.allRowsSelected = true;
      } else {
        for (var i = 0; i < $scope.selectedCourse.students.length; i++) {
          $scope.selectedCourse.students[i].selected = false;
        }
        $scope.allRowsSelected = false;

      }
    };

  });
