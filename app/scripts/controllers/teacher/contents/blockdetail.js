'use strict';

angular.module('tfaApp')
  .controller('TeacherBlockdetailCtrl', function ($scope, $routeParams, $location, unitsrv, coursesrv, ModalService,toastr, $route) {
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
      $scope.newDescription = '';

      $scope.$watch('newNumber', function (newValue, oldValue) {
        if (newValue && newValue !== '' && newValue <= 0) {
            $scope.newNumber = oldValue;
        }
      });

            $scope.$watch('currentNumber', function (newValue, oldValue) {
        if (newValue && newValue !== '' && newValue <= 0) {
            $scope.currentNumber = oldValue;
        }
      });


      //Take objectID to query from the routeParams
      var objectId = 0;
      var unitId = 0;
      if ($routeParams) {
          objectId = $routeParams.objectId;
          unitId = $routeParams.secondId;
      }
      $scope.blockId = objectId;
      var defaultUnit = new (Parse.Object.extend('Unit'));
      defaultUnit.set('number', 1);
      defaultUnit.set('title', 'No posee ninguna Unidad para este Bloque');
      defaultUnit.set('content', 'Seleccione crear tema');
      //Initial query to set te Unit and Topic array
      var query = new Parse.Query('ContentBlock');
      var flagUnitId = false
      query.equalTo('objectId', objectId);
      query.include('units');
      query.first({
          success: function (block) {
            if(block){
              $scope.block = block;
              $scope.blockName = $scope.block.get('name');
              $scope.blockDescription = $scope.block.get('description');
              $scope.units = [];
              if (block.get('units')) {
                  for (var i = 0; i < block.get('units').length; i++) {
                      if (block.get('units')[i].get('status') == 1) {
                          $scope.units.push(block.get('units')[i]);

                          if(block.get('units')[i].id == unitId){
                             $scope.currentUnit = block.get('units')[i];
                             $scope.currentTitle  = $scope.currentUnit.get('title');
                             $scope.currentNumber  = $scope.currentUnit.get('number');
                             $scope.currentDescription = $scope.currentUnit.get('description');
                             $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                             flagUnitId = true;
                          }
                      }
                  }
                  $scope.units = sortByKey($scope.units, "number");
                  if(!flagUnitId){
                    $scope.currentUnit= $scope.units[0];
                    $scope.currentTitle  = $scope.currentUnit.get('title');
                    $scope.currentNumber  = $scope.currentUnit.get('number');
                    $scope.currentDescription = $scope.currentUnit.get('description');
                    $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                  }

                  $scope.creating = false;
                  $scope.$apply();
              } else {
                  $scope.currentUnit = defaultUnit;
                  $scope.$apply();
              }
            } else {
                toastr.error("No se encuentra el Bloque de Contenido solicitado");
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
              toastr.error(getErrorDesc(error));
          }
      });


      //To set view of Details about Topic
      $scope.showUnit = function (index) {
          $scope.editable = false;
          $scope.creating = false;
          $scope.currentUnit = $scope.units[index];
          $scope.currentTitle  = $scope.currentUnit.get('title');
          $scope.currentNumber  = $scope.currentUnit.get('number');
          $scope.currentDescription = $scope.currentUnit.get('description');
          $scope.currentUnitCopy = angular.copy($scope.currentUnit);
          $scope.apply;
      };

      //view edition on
      $scope.switchEditMode = function (index) {
          if (index) {
              $scope.currentUnit = $scope.units[index];
              $scope.currentTitle  = $scope.currentUnit.get('title');
              $scope.currentNumber = $scope.currentUnit.get('number');
              $scope.currentDescription = $scope.currentUnit.get('description');
              $scope.apply;
          }
          $scope.editable = true;
      };

      //cancel edition view ang come back to details view
      $scope.cancelEdition = function () {
          $scope.currentUnit = angular.copy($scope.currentUnitCopy);
          $scope.editable = false;
          $scope.creating = false;
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
              if ($scope.units[i].get("number") == newNumber) {
                  existFlag = true;
              }
          }
          if (existFlag) {
              //DO NOTHING
              toastr.warning("El número de unidad ya existe. Debés usar otro");
          } else
              if (newNumber == "" || newTitle == "" || newDescription == "") {
                  toastr.warning("Debés completar todos los campos solicitados");
              } else {
              var unitData = {};
              unitData.title = newTitle;
              unitData.description = newDescription;
              unitData.number = newNumber;
              unitsrv.createUnit(unitData, $scope.block, {
                  success: function (newUnit) {
                      toastr.success("Creaste una nueva unidad");
//                      $scope.editable = false;
//                      $scope.creating = false;
//                      $scope.error = '';
//                      $scope.success = "Has agregado una nueva unidad correctamente";
//                      $scope.currentUnit = newUnit;
//                      $scope.currentTitle = $scope.currentUnit.get('title');
//                      $scope.currentNumber  = $scope.currentUnit.get('number');
//                      $scope.currentDescription = $scope.currentUnit.get('description');
//                      $scope.units.push(newUnit);
//                      $scope.currentUnitCopy = angular.copy($scope.currentUnit);
//                      $scope.$apply();
                      $route.reload();

                  },
                  error: function (currentUnit, error) {
                      toastr.error(getErrorDesc(error));
                  }
              });
          }

      };

      //Save new topic to parse
      $scope.saveEditedUnit = function (number,title, desc) {
          var existFlag = false
          for (var i = 0; i < $scope.units.length; i++) {
              if ($scope.units[i].get("number") == number && $scope.currentUnit.get('number') != number) {
                  existFlag = true;
              }
          }
          if (existFlag) {
              //DO NOTHING
              toastr.warning("El número de tema ya existe. Debés usar otro");
              //$scope.error = "El numero de topico ya existe";
          } else
              if (number == "" || title == "" || desc == "") {
                  toastr.warning("Debés completar todos los campos solicitados");
                  //$scope.error = "Debe completar todos los campos solicitados";
              } else {
                  $scope.currentUnit.title = title;
                  $scope.currentUnit.number = number;
                  $scope.currentUnit.description = desc;
                  unitsrv.modifyUnit($scope.currentUnit, {
                      success: function (unit) {
                          toastr.success("Modificaste la unidad correctamente");
                          //                  $scope.currentUnit = unit;
                          //                  $scope.currentTitle = $scope.currentUnit.get('title');
                          //                  $scope.currentNumber  = $scope.currentUnit.get('number');
                          //                  $scope.currentDescription = $scope.currentUnit.get('description');
                          //                  $scope.editable = false;
                          //                  $scope.error = '';
                          //                  $scope.currentUnitCopy = angular.copy($scope.currentUnit);
                          //                  $scope.success = "Has modificado la unidad correctamente";
                          //                  $scope.$apply();
                          $route.reload();
                      },
                      error: function (of, error) {
                          toastr.error(getErrorDesc(error));

                      }
                  });
              }

      };

      $scope.setUnitToDelete = function (index) {
          $scope.toDeleteUnit = $scope.units[index];
          $scope.$apply();

      };

      $scope.deleteUnit = function () {
          unitsrv.deleteUnit($scope.toDeleteUnit, {
              success: function (or) {
                  toastr.success("Eliminaste la unidad correctamente");
                  $('.modal-backdrop').remove();
                  $('body').removeClass('modal-open');
                  $('body').removeAttr('style');
                  $route.reload();
              },
              error: function (of, error) {
                  toastr.error(getErrorDesc(error));
              }
          });

      };

      $scope.modifyBlock = function(name,desc){
          $scope.block.name = name;
          $scope.block.description = desc;
          if(name == "" || desc == ""){
            toastr.warning("Los campos no pueden estar vacíos")
          } else {
          unitsrv.modifyBlock($scope.block, {
              success: function (or) {
                  toastr.success("Modificaste el bloque de contenido correctamente");
                  $('.modal-backdrop').remove();
                  $('body').removeClass('modal-open');
                  $('body').removeAttr('style');
                  $route.reload();
              },
              error: function(){
                  toastr.error(getErrorDesc(error));

              }
          });
        }
      }

      $scope.deleteBlock = function(){
        unitsrv.deleteBlock($scope.block, {
            success: function (or) {
                toastr.success("Eliminaste el bloque de contenido correctamente");
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('body').removeAttr('style');
//                  $scope.$apply();
                //$route.reload();
                 $location.path('/teacher/contents/');
            },
            error: function (of, error) {
                toastr.error(getErrorDesc(error));
            }
        });
      }
  });
