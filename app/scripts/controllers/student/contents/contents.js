'use strict';

angular.module('tfaApp')
  .controller('StudentContentsCtrl', function ($scope, unitsrv, coursesrv) {

    //courses call
    $scope.fullUnits = [];
    var coursesArr = [];
    
    var course = Parse.User.current().get('assignedTo');
    
    //to get curse units
    unitsrv.getAllUnits(course,{
                success: function(units){
                    $scope.fullUnits = units;
                    $scope.$apply();
                },
                error: function(error){
                  
                }
              });
  });
  
           