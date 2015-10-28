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



      var objectId = 0;
      if ($routeParams) {
          objectId = $routeParams.objectId
      }

      $scope.showTopic = function (index) {
          $scope.currentTopic = $scope.topics[index];
          $scope.currentTopicCopy = angular.copy($scope.currentTopic);
          $scope.apply;
      }

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
                      $scope.$apply();
                  }
              });
          },
          error: function (error) {
              $scope.error = "TODO MAL CHABON";
          }
      });

      $scope.switchEditMode = function () {
          $scope.editable = true;
      }

      $scope.cancelEdition = function(){
          $scope.currentTopic = angular.copy($scope.currentTopicCopy);
          $scope.editable = false;
      }

      $scope.showCreatingTopic = function () {
          $scope.creating = true;
          $scope.editable = false
      }

      $scope.createNewTopic = function () {
          var existFlag = false
          for (var i = 0; i < $scope.topics.length; i++) {
              if($scope.topics[i].number == $scope.newNumber)
              {
                  existFlag = true;
              }
          }
          if(existFlag){
          
          } else {
              var topicData = {}
              topicData.title = $scope.newTitle;
              topicData.content = $scope.newContent;
              topicData.number = $scope.newNumber;
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
    

    


