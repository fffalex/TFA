'use strict';

angular.module('tfaApp')
  .controller('StudentDoExamCtrl', function ($scope,$route, unitsrv, toastr, coursesrv, examsrv,$location, $routeParams ) {

    //initial data set
    $scope.unit = {};
    $scope.error = "";
    $scope.success = "";
    $scope.finished = false;
    $scope.canDoExam = true;

    //Take objectID to query from the routeParams
    var unitId = 0;
    if ($routeParams) {
      unitId = $routeParams.objectId;
    }
    $scope.allQuestion = [];

    //Get the unit
    var query = new Parse.Query('Unit');
    query.equalTo('objectId', unitId);
    query.first({
      success: function (unit) {
        $scope.unit = unit;

        //Get the exam if already exist
        var query = new Parse.Query('Exam');
        query.equalTo('unit', $scope.unit);
        query.equalTo('student', Parse.User.current());
        query.find({
          success: function(exam){
            //there are not exam for this unit and student
            if (exam.length == 0){
              unitsrv.getAllRandomQuestions(unit,{
                success: function(questions){
                  $scope.allQuestion = questions;
                  $scope.$apply();
                },
                error: function(error){
                  $scope.error = error;
                }
              });
            } else {
              $scope.canDoExam = false;
              toastr.error("Ya has rendido este examen");

            }
          },
          error: function(error){
              toastr.error(getErrorDesc(error));
          }
        })


      },
      error: function(error){
          toastr.error(getErrorDesc(error));
      }
    });




    $scope.results = {};
    $scope.results.grade = 0;
    $scope.results.corrects = 0;
    $scope.results.incorrects = 0;
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

      $scope.results.grade = grade;
      $scope.results.corrects = correctCount;
      $scope.results.incorrects = incorrectCount;
      $scope.finished = true;
      examsrv.create($scope.unit, $scope.allQuestion,grade,correctCount,incorrectCount,{
          success: function (ok) {
              toastr.success("Se guardó tu examen correctamente");
          $scope.finished = true;
          $scope.$apply();
        },
        error: function(error){
            toastr.error(getErrorDesc(error));
        }
      });
    }

    //To call method when time is over
    $scope.callbackTimer = {}
    $scope.callbackTimer.finished=function(){
      $('#timeoutModal').modal('show');
      $scope.finishExam(true);

    }

    $scope.redirectToUnit = function () {
      toastr.success("Completaste el examen de esta unidad");
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $('body').removeAttr('style');
      $location.path( "/student/contents/classes/"+unitId+"/0/0" );
    }

  });
