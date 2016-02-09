'use strict';

angular.module('tfaApp')
        .controller('TeacherUnitdetailCtrl', function ($scope, $routeParams, toastr, unitsrv, coursesrv, ModalService, $route) {
          //initial data set
          $scope.unit = {};
          $scope.topics = [];
          $scope.currentTopic = {};
          $scope.error = "";
          $scope.success = "";
          $scope.toDeleteTopic;
          $scope.isDeleted = false;

          //Control function flows
          $scope.editable = false;
          $scope.creating = false;

          //For create new Topic
          $scope.newTitle = '';
          $scope.newNumber = '';
          $scope.newContent = 'Escriba su contenido aquí';

          //Take objectID to query from the routeParams
          var objectId = 0;
          var blockId = 0;
          var topicId = 0;
          if ($routeParams) {
            objectId = $routeParams.objectId;
            topicId = $routeParams.secondId;
            blockId = $routeParams.blockId;

          }
          $scope.unitId = objectId;
          $scope.blockId = blockId;
          var flagUnitId = false;
          var defaultTopic = new (Parse.Object.extend('Topic'));
          defaultTopic.set('number', 1);
          defaultTopic.set('title', 'No posee ningún tema para esta unidad');
          defaultTopic.set('content', 'Seleccione crear tema');
          //Initial query to set te Unit and Topic array
          var query = new Parse.Query('Unit');
          query.equalTo('objectId', objectId);
          query.include('topics');
          query.first({
            success: function (unit) {
              $scope.unit = unit;
              $scope.topics = [];
              if (unit.get('topics') !== undefined) {
                for (var i = 0; i < unit.get('topics').length; i++) {
                  if (unit.get('topics')[i].get('status') == 1) {
                    $scope.topics.push(unit.get('topics')[i]);
                  }

                  if (unit.get('topics')[i].id == topicId) {
                    $scope.currentTopic = unit.get('topics')[i];
                    $scope.currentTitle  = $scope.currentTopic.get('title');
                    $scope.currentNumber  = $scope.currentTopic.get('number');
                    $scope.currentContent = $scope.currentTopic.get('content');
                    $scope.currentTopicCopy = angular.copy($scope.currentUnit);
                    flagUnitId = true;
                  }
                }
                $scope.topics = sortByKey($scope.topics, "number");
                if (!flagUnitId) {
                  $scope.currentTopic = $scope.topics[0];
                  $scope.currentTitle  = $scope.currentTopic.get('title');
                  $scope.currentNumber  = $scope.currentTopic.get('number');
                  $scope.currentContent = $scope.currentTopic.get('content');
                  $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                }
                $scope.creating = false;
                $scope.$apply();
              } else {
                $scope.currentTopic = defaultTopic;
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
                toastr.error(getErrorDesc(error));
                
            }
          });



          //To set view of Details about Topic
          $scope.showTopic = function (index) {
            $scope.editable = false;
            $scope.creating = false;
            $scope.currentTopic = $scope.topics[index];
            $scope.currentTitle  = $scope.currentTopic.get('title');
            $scope.currentNumber  = $scope.currentTopic.get('number');
            $scope.currentContent = $scope.currentTopic.get('content');
            $scope.currentTopicCopy = angular.copy($scope.currentTopic);
            $scope.apply;
          };

          //view edition on
          $scope.switchEditMode = function (index) {
            if (index) {
              $scope.currentTopic = $scope.topics[index];
              $scope.apply;
            }
            $scope.editable = true;
          };

          //cancel edition view ang come back to details view
          //cancel edition view ang come back to details view
          $scope.cancelEdition = function () {
            $scope.currentTopic = angular.copy($scope.currentUnitCopy);
            $scope.editable = false;
            $scope.creating = false;
          };

          //creating view on
          $scope.showCreatingTopic = function () {
            $scope.creating = true;
            $scope.editable = false
          };

          //Do topic creation, validation data and save it to parse
          //Need the parameter of the scope becuase when ng-click, the scope
          //isn't updated (It can be fixed using a form and ng-submit)
          $scope.createNewTopic = function (newNumber, newTitle, newContent) {
            var existFlag = false
            for (var i = 0; i < $scope.topics.length; i++) {
              if ($scope.topics[i].get("number") == newNumber)
              {
                existFlag = true;
              }
            }
            if (existFlag) {
                //DO NOTHING
                toastr.warning("El número de tema ya existe. Debés usar otro");
              //$scope.error = "El numero de topico ya existe";
            } else
                if (newNumber == "" || newTitle == "" || newContent == "") {
                    toastr.warning("Debés completar todos los campos solicitados");
                    //$scope.error = "Debe completar todos los campos solicitados";
                } else {
              var topicData = {};
              topicData.title = newTitle;
              topicData.content = newContent;
              topicData.number = newNumber;
              unitsrv.createTopic(topicData, $scope.unit, {
                  success: function (newTopic) {
                    toastr.success("Creaste un nuevo tema");
                    $route.reload();
//                  $scope.editable = false;
//                  $scope.creating = false;
//                  $scope.error = '';
//                  $scope.success = "Has agregado un nuevo topic correctamente";
//                  $scope.currentTopic = newTopic;
//                  $scope.currentTitle  = $scope.currentTopic.get('title');
//                  $scope.currentNumber  = $scope.currentTopic.get('number');
//                  $scope.currentContent = $scope.currentTopic.get('content');
//                  $scope.topics.push(newTopic);
//                  $scope.currentTopicCopy = angular.copy($scope.currentTopic);
//                  $scope.$apply();

                },
                  error: function (newTopic, error) {
                      toastr.error(getErrorDesc(error));
                }
              });
            }

          };


          //Save new topic to parse
          $scope.saveEditedTopic = function (number, title, content) {
              var existFlag = false
              for (var i = 0; i < $scope.topics.length; i++) {
                  if ($scope.topics[i].get("number") == number && $scope.currentTopic.get('number') != number) {
                      existFlag = true;
                  }
              }
              if (existFlag) {
                  //DO NOTHING
                  toastr.warning("El número de tema ya existe. Debés usar otro");
                  //$scope.error = "El numero de topico ya existe";
              } else
                  if (number == "" || title == "" || content == "") {
                      toastr.warning("Debés completar todos los campos solicitados");
                      //$scope.error = "Debe completar todos los campos solicitados";
                  } else {
                      $scope.currentTopic.title = title;
                      $scope.currentTopic.number = number;
                      $scope.currentTopic.content = content;
                    unitsrv.modifyTopic($scope.currentTopic, {
                        success: function () {
                        toastr.success("Modificaste el tema correctamente");
                        $route.reload();
                        // $scope.editable = false;
                        // $scope.error = '';
                        // $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                        // $scope.success = "Has modificado el topic correctamente";
                        // $scope.$apply();
                      },
                        error: function (of, error) {
                        toastr.error(getErrorDesc(error));
                        //$scope.error = getErrorDesc(error);
                        $scope.$apply();
                      }
                    });
              }
          };

          $scope.setTopicToDelete = function (index) {
            $scope.toDeleteTopic = $scope.topics[index];
            //$scope.$apply();
          };

          $scope.deleteTopic = function () {
            unitsrv.deleteTopic($scope.toDeleteTopic, {
                success: function () {
                toastr.success("Eliminaste el tema correctamente");
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('body').removeAttr('style');
                $scope.$apply();
                $route.reload();
              },
              error: function (of, error) {
                toastr.error(getErrorDesc(error));
                $scope.$apply();
              }
            });

          };
        });
