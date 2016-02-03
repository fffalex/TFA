'use strict';

angular.module('tfaApp')
  .controller('StudentDoExamCtrl', function ($scope,$route, unitsrv, coursesrv, $routeParams ) {

    //initial data set
    $scope.unit = {};

    //Take objectID to query from the routeParams
    var unitId = 0;
    if ($routeParams) {
      unitId = $routeParams.objectId;
    }
    $scope.allQuestion = [];
    var unit = {}
    unit.id = unitId;
    unitsrv.getAllRandomQuestions(unit,{
      success: function(questions){
        $scope.allQuestion = questions;
        $scope.$apply();
      },
      error: function(error){
        $scope.error = error;
      }
    });
  });
