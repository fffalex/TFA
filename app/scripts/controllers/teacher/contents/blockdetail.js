﻿'use strict';

angular.module('tfaApp')
  .controller('TeacherBlockdetailCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService, $route) {
      //initial data set
      $scope.block = {};
      $scope.units = [];
      $scope.currentUnit = {};
      $scope.error = "";
      $scope.success = "";
      $scope.toDeleteUnit;
      $scope.isDeleted = false;

      //Control function flows
      $scope.editable = false;
      $scope.creating = false;

      //For create new Topic
      $scope.newTitle = '';
      $scope.newNumber = '';
      $scope.newDescription = 'Escriba su contenido aquí';

      //Take objectID to query from the routeParams
      var objectId = 0;
      if ($routeParams) {
          objectId = $routeParams.objectId
      }
      var defaultUnit = new (Parse.Object.extend('Unit'));
      defaultUnit.set('number', 1);
      defaultUnit.set('title', 'No posee ningún tema para esta unidad');
      defaultUnit.set('content', 'Seleccione crear tema');
      //Initial query to set te Unit and Topic array
      var query = new Parse.Query('ContentBlock');
      query.equalTo('objectId', objectId);
      query.include('units');
      query.first({
          success: function (block) {
              $scope.block = block;
              $scope.units = [];
              if (block.get('units') !== undefined) {
                  for (var i = 0; i < block.get('units').length; i++) {
                      if (block.get('units')[i].get('status') == 1) {
                          $scope.units.push(block.get('units')[i]);
                      }
                  }
                  $scope.units = sortByKey($scope.units, "number");
                  $scope.currentUnit= $scope.units[0];
                  $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                  $scope.creating = false;
                  $scope.$apply();
              } else {
                  $scope.currentUnit = defaultUnit;
                  $scope.$apply();
              }
          },
          //success: function (unit) {
          //    $scope.unit = unit.toFullJSON();
          //    unitsrv.getAllTopics(unit, {
          //        success: function (topics) {
          //            $scope.topics = topics;
          //            $scope.currentTopic = $scope.topics[0];
          //            $scope.currentTopicCopy = angular.copy($scope.currentTopic);
          //            $scope.creating = false;
          //            $scope.$apply();
          //        }
          //    });
          //},
          error: function (error) {
              $scope.error = "TODO MAL CHABON";
          }
      });



      //To set view of Details about Topic
      $scope.showUnit = function (index) {
          $scope.editable = false;
          $scope.creating = false;
          $scope.currentUnit = $scope.units[index];
          $scope.currentUnitCopy = angular.copy($scope.currentUnit);
          $scope.apply;
      };

      //view edition on
      $scope.switchEditMode = function (index) {
          if (index) {
              $scope.currentUnit = $scope.units[index];
              $scope.apply;
          }
          $scope.editable = true;
      };

      //cancel edition view ang come back to details view
      $scope.cancelEdition = function () {
          $scope.currentUnit = angular.copy($scope.currentUnitCopy);
          $scope.editable = false;
      };

      //creating view on
      $scope.showCreatingUnit = function () {
          $scope.creating = true;
          $scope.editable = false
      };

      //Do topic creation, validation data and save it to parse
      //Need the parameter of the scope becuase when ng-click, the scope
      //isn't updated (It can be fixed using a form and ng-submit)
      $scope.createNewUnit = function (newNumber, newTitle, newDescription) {
          var existFlag = false
          for (var i = 0; i < $scope.units.length; i++) {
              if ($scope.units[i].number == newNumber) {
                  existFlag = true;
              }
          }
          if (existFlag) {
              //DO NOTHING
              $scope.error = "El numero de topico ya existe";
          } else {
              var unitData = {};
              unitData.title = newTitle;
              unitData.description = newDescription;
              unitData.number = newNumber;
              unitsrv.createUnit(unitData, $scope.block, {
                  success: function (newUnit) {
                      $scope.editable = false;
                      $scope.creating = false;
                      $scope.error = '';
                      $scope.success = "Has agregado un nuevo topic correctamente";
                      $scope.currentUnit = newUnit;
                      $scope.topics.push(newUnit);
                      $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                      $scope.$apply();

                  },
                  error: function (currentUnit, error) {
                      $scope.error = getErrorDesc(error);
                      $scope.$apply();
                  }
              });
          }

      };

      //Save new topic to parse 
      $scope.saveEditedUnit = function () {
          unitsrv.modifyUnit($scope.currentUnit, {
              success: function () {
                  $scope.editable = false;
                  $scope.error = '';
                  $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                  $scope.success = "Has modificado el topic correctamente";
                  $scope.$apply();
              },
              error: function (of, error) {
                  $scope.error = getErrorDesc(error);
                  $scope.$apply();
              }
          });


      };

      $scope.setUnitToDelete = function (index) {
          $scope.toDeleteUnit = $scope.units[index];
          $scope.$apply();
      };

      $scope.deleteUnit = function () {
          unitsrv.deleteUnit($scope.toDeleteUnit, {
              success: function () {
                  $('.modal-backdrop').remove();
                  $('body').removeClass('modal-open');
                  $('body').removeAttr('style');
                  $scope.$apply();
                  $route.reload();
              },
              error: function (of, error) {
                  $scope.errorDelete = getErrorDesc(error);
                  $scope.$apply();
              }
          });

      };
  });




