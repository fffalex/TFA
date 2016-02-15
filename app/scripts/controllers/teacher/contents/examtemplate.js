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
    $scope.newQuestion.falseAnswer3 = "";

    $scope.$watch('unit.quantity', function (newValue, oldValue) {
        if (newValue && newValue != '' && (newValue < 0 || newValue > $scope.allQuestion.length)) {
            $scope.unit.quantity = oldValue;
            if($scope.allQuestion.length == 0){
              toastr.warning("No tenés preguntas asociadas a esta unidad", "Debés crear por lo menos una pregunta");
            }
        }
    });

    $scope.$watch('unit.minutes', function (newValue, oldValue) {
        if (newValue && newValue !== '' && newValue <= 0) {
            $scope.unit.minutes = oldValue;
        }
    });


    var query = new Parse.Query('Unit');
    query.equalTo('objectId', objectId);
    query.include('topics');
    query.first({
      success: function (unit) {
        $scope.unit = unit;
        unitsrv.getAllQuestions(unit,{
          success:function(questions){
            $scope.allQuestion = questions;

            $scope.unit.allowExam = $scope.unit.get('allowExam');
            $scope.unit.quantity = $scope.unit.get('questionExamQuantity');
            $scope.unit.minutes = $scope.unit.get('examMinutes');
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

    $scope.saveSettings = function (quantity,allowExam,minutes) {
        var unit = new (Parse.Object.extend('Unit'))();
        unit.set('objectId', $scope.unit.id);
        unit.set('allowExam', allowExam);
        unit.set('questionExamQuantity', quantity);
        unit.set('examMinutes',minutes);
        unit.save(null, {
            success: function (unit) {
                toastr.success("Se han guardado los cambios correctamente");
            },
            error: function () {
                toastr.error("Error al intentar guardar los cambios. Intent� m�s tarde");
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
