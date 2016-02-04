'use strict';

angular.module('tfaApp')
  .controller('StudentDoExamCtrl', function ($scope,$route, unitsrv, coursesrv, examsrv, $routeParams ) {

    //initial data set
    $scope.unit = {};
    $scope.error = "";
    $scope.success = "";

    //Take objectID to query from the routeParams
    var unitId = 0;
    if ($routeParams) {
      unitId = $routeParams.objectId;
    }
    $scope.allQuestion = [];

    var query = new Parse.Query('Unit');
    query.equalTo('objectId', unitId);
    query.first({
      success: function (unit) {
        $scope.unit = unit;
        unitsrv.getAllRandomQuestions(unit,{
          success: function(questions){
            $scope.allQuestion = questions;
            $scope.$apply();
          },
          error: function(error){
            $scope.error = error;
          }
        });
      },
      error: function(error){
          $scope.error = error;
      }
    });

    $scope.finishExam = function(){
      var correctCount = 0;
      for (var i = 0; i < $scope.allQuestion.length; i++) {
        if($scope.allQuestion[i].get('trueAnswer') == $scope.allQuestion[i].choose ){
          var correctCount = correctCount+1;
          $scope.allQuestion[i].isCorrect = true;
        }
      }
      var incorrectCount = $scope.allQuestion.length - correctCount;
      var grade = (correctCount / $scope.allQuestion.length) * 100;
      examsrv.create($scope.unit, $scope.allQuestion,grade,correctCount,incorrectCount,{
        success: function(ok){
          console.log("tranco todo");
        },
        error: function(error){
          console.log(error);
        }
      });
    }

    $scope.endTime = function(){
      debugger;
      console.log("se termino");
    }



  });
