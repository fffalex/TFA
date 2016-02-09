'use strict';

angular.module('tfaApp')
  .controller('TeacherExamTemplateCtrl', function ($scope, toastr, $route,$routeParams,unitsrv) {

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

            $scope.unit.takeExam = $scope.unit.get('takeExam');
            $scope.unit.quantity = $scope.unit.get('questionExamQuantity');
            $scope.$apply();
          },
          error: function(error){
            toastr.error(getErrorDesc(error));
          }
        });
      },
      error: function(error){
          toastr.error(getErrorDesc(error));
      }
    });
    $scope.setQuestion = {}

    $scope.setQuestionEdit = function(question){
      $scope.setQuestion = question.toFullJSON();
      $scope.$apply();
    };

    $scope.saveQuestion = function(question){
      unitsrv.editQuestion(question,{
          success: function (ok) {
              toastr.success("Modificaste la pregunta correctamente");
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
            toastr.error(getErrorDesc(error));
        }
      });

    };

    $scope.saveSettings = function (quantity,takeExam) {
        var unit = new (Parse.Object.extend('Unit'))();
        unit.set('objectId', $scope.unit.id);
        unit.set('takeExam', takeExam);
        unit.set('questionExamQuantity', quantity);
        unit.save(null, {
            success: function (unit) {
                toastr.success("Se han guardado los cambios correctamente");
            },
            error: function () {
                toastr.error("Error al intentar guardar los cambios. Intentá más tarde");
            }
        });
        
    }

    $scope.deleteQuestion = function(question){
      unitsrv.removeQuestion(question, {
          success: function (ok) {
          toastr.success("Eliminaste la pregunta correctamente");
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
          toastr.error(getDescError(error));
        }
      })
    };

    $scope.addQuestion = function(question){
      unitsrv.addQuestion($scope.unit, question, {
          success: function (ok) {
              toastr.success("Creaste una nueva pregunta");
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $route.reload();
        },
        error:function(error){
          toastr.error(getErrorDesc(error));
        }
      })
    };


  });
