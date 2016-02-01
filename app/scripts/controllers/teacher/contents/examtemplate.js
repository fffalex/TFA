'use strict';

angular.module('tfaApp')
  .controller('TeacherExamTemplateCtrl', function ($scope, $route,$routeParams,unitsrv) {

    $scope.error = "";
    $scope.success = "";
    var objectId = 0;
    var blockId = 0;
    if ($routeParams) {
      objectId = $routeParams.objectId;
      blockId = $routeParams.blockId;

    }
    $scope.unitId = objectId;
    $scope.blockId = blockId;
    $scope.unit = {};
    $scope.allQuestion = [];
    $scope.newQuestion = {};
    $scope.newQuestion.question ="";
    $scope.newQuestion.trueAnswer ="";
    $scope.newQuestion.falseAnswer1 ="";
    $scope.newQuestion.falseAnswer2 ="";
    $scope.newQuestion.falseAnswer3 ="";


    var query = new Parse.Query('Unit');
    query.equalTo('objectId', objectId);
    query.include('topics');
    query.first({
      success: function (unit) {
        $scope.unit = unit;
        unitsrv.getAllQuestions(unit,{
          success:function(questions){
            $scope.allQuestion = questions;
            $scope.$apply();
          },
          error: function(error){
            $scope.error = error;
            $scope.$apply();
          }
        });
      },
      error: function(error){
          $scope.error = error;
          $scope.$apply();
      }
    });
    $scope.setQuestion = {}

    $scope.setQuestionEdit = function(question){
      $scope.setQuestion = question.toFullJSON();
      $scope.$apply();
    };

    $scope.saveQuestion = function(question){
      unitsrv.editQuestion(question,{
        success:function(ok){
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
          $scope.error = error;
        }
      });

    };

    $scope.deleteQuestion = function(question){
      unitsrv.removeQuestion(question, {
        success:function(ok){
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
          $scope.error = error;
        }
      })
    };

    $scope.addQuestion = function(question){
      unitsrv.addQuestion($scope.unit, question, {
        success:function(ok){
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
          $scope.error = error;
        }
      })
    };


  });
