'use strict';

angular.module('tfaApp')
  .controller('StudentMyContentCtrl', function ($scope,$route, coursesrv, $routeParams ) {

    $scope.error = "";
    $scope.success = "";
    $scope.course = {};
    coursesrv.getCourse(Parse.User.current().get('assignedTo'),{
      success:function(course){
        $scope.course = course;
        $scope.$apply();
      },
      error:function(error){
        $scope.error = error;
      }
    });
  });
