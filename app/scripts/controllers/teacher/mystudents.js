'use strict';

angular.module('tfaApp')
  .controller('MyStudentsCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService,$route) {
    $scope.courses = [];
    
    coursesrv.getTeacherCourses(Parse.User.current(), {
          success: function (courses) {
              $scope.courses = courses;
              $scope.$apply();
              coursesrv.getStudentsCourse(Parse.User.current(),{
                  success: function(coursesFull){
                    $scope.courses = coursesFull;
                    
                  }
                });
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