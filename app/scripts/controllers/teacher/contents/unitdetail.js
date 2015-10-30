'use strict';

angular.module('tfaApp')
  .controller('TeacherUnitdetailCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService) {
      //initial data set
      $scope.unit = {};
      $scope.topics = [];
      $scope.currentTopic = {};
      $scope.error = "";

      //Control function flows
      $scope.editable = false;
      $scope.creating = false;

      //For create new Topic
      $scope.newTitle = '';
      $scope.newNumber = '';
      $scope.newContent = 'Escriba su contenido aquí';

      //Take objectID to query from the routeParams
      var objectId = 0;
      if ($routeParams) {
          objectId = $routeParams.objectId
      }
      //Initial query to set te Unit and Topic array
      var query = new Parse.Query('Unit');
      query.equalTo('objectId', objectId);
      query.first({
          success: function (unit) {
              $scope.unit = unit.toFullJSON();
              unitsrv.getAllTopics(unit, {
                  success: function (topics) {
                      $scope.topics = topics;
                      $scope.currentTopic = $scope.topics[0];
                      $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                      $scope.creating = false;
                      $scope.$apply();
                  }
              });
          },
          error: function (error) {
              $scope.error = "TODO MAL CHABON";
          }
      });



      //To set view of Details about Topic
      $scope.showTopic = function (index) {
          $scope.editable = false;
          $scope.creating = false;
          $scope.currentTopic = $scope.topics[index];
          $scope.currentTopicCopy = angular.copy($scope.currentTopic);
          $scope.apply;
      }

      //view edition on
      $scope.switchEditMode = function () {
          $scope.editable = true;
      }

      //cancel edition view ang come back to details view
      $scope.cancelEdition = function(){
          $scope.currentTopic = angular.copy($scope.currentTopicCopy);
          $scope.editable = false;
      }

      //creating view on
      $scope.showCreatingTopic = function () {
          $scope.creating = true;
          $scope.editable = false
      }

      //Do topic creation, validation data and save it to parse
      //Need the parameter of the scope becuase when ng-click, the scope
      //isn't updated (It can be fixed using a form and ng-submit)
      $scope.createNewTopic = function (newNumber,newTitle,newContent) {
          var existFlag = false
          for (var i = 0; i < $scope.topics.length; i++) {
              if($scope.topics[i].number == newNumber)
              {
                  existFlag = true;
              }
          }
          if(existFlag){
              //DO NOTHING
              $scope.error = "El número de topico ya existe";
          } else {
              var topicData = {}
              topicData.title = newTitle;
              topicData.content = newContent;
              topicData.number = newNumber;
              unitsrv.createTopic(topicData, $scope.unit, {
                  success: function () {
                      $scope.editable = false;
                      $scope.error = '';
                      $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                      $scope.$apply();
                  },
                  error: function (of, error) {
                      $scope.error = getErrorDesc(error);
                      $scope.$apply();
                  }
              });
          }
          
      }

      //Save new topic to parse 
      $scope.saveEditedTopic = function () {
          unitsrv.modifyTopic($scope.currentTopic, {
              success: function () {
                  $scope.editable = false;
                  $scope.error = '';
                  $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                  $scope.$apply();
              },
              error: function (of, error) {
                  $scope.error = getErrorDesc(error);
                  $scope.$apply();
              }
          });


      }
  });
    

    


