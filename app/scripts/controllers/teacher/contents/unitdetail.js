'use strict';

angular.module('tfaApp')
  .controller('TeacherUnitdetailCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService,$route) {
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
      $scope.newContent = 'Escriba su contenido aqu�';

      //Take objectID to query from the routeParams
      var objectId = 0;
      if ($routeParams) {
          objectId = $routeParams.objectId
      }
      //Initial query to set te Unit and Topic array
      var query = new Parse.Query('Unit');
      query.equalTo('objectId', objectId);
      query.include('topics');
      query.first({
          success: function (unit) {
              $scope.unit = unit
              $scope.topics = []
              for (var i = 0; i < unit.get('topics').length; i++) {
                  if (unit.get('topics')[i].get('status') == 1) {
                      $scope.topics.push(unit.get('topics')[i])
                  }
              }
              $scope.topics = sortByKey($scope.topics, "number");
              $scope.currentTopic = $scope.topics[0];
              $scope.currentTopicCopy = angular.copy($scope.currentTopic);
              $scope.creating = false;
              $scope.$apply();
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
      $scope.showTopic = function (index) {
          $scope.editable = false;
          $scope.creating = false;
          $scope.currentTopic = $scope.topics[index];
          $scope.currentTopicCopy = angular.copy($scope.currentTopic);
          $scope.apply;
      };

      //view edition on
      $scope.switchEditMode = function (index) {
          if(index){
            $scope.currentTopic = $scope.topics[index];
            $scope.apply;
          }
          $scope.editable = true;
      };

      //cancel edition view ang come back to details view
      $scope.cancelEdition = function(){
          $scope.currentTopic = angular.copy($scope.currentTopicCopy);
          $scope.editable = false;
      };

      //creating view on
      $scope.showCreatingTopic = function () {
          $scope.creating = true;
          $scope.editable = false
      };

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
              $scope.error = "El numero de topico ya existe";
          } else {
              var topicData = {};
              topicData.title = newTitle;
              topicData.content = newContent;
              topicData.number = newNumber;
              unitsrv.createTopic(topicData, $scope.unit, {
                  success: function (newTopic) {
                      $scope.editable = false;
                      $scope.creating = false;
                      $scope.error = '';
                      $scope.success = "Has agregado un nuevo topic correctamente";
                      $scope.currentTopic = newTopic;
                      $scope.topics.push(newTopic);
                      $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                      $scope.$apply();
                      
                  },
                  error: function (newTopic, error) {
                      $scope.error = getErrorDesc(error);
                      $scope.$apply();
                  }
              });
          }
          
      };

      //Save new topic to parse 
      $scope.saveEditedTopic = function () {
          unitsrv.modifyTopic($scope.currentTopic, {
              success: function () {
                  $scope.editable = false;
                  $scope.error = '';
                  $scope.currentTopicCopy = angular.copy($scope.currentTopic);
                  $scope.success = "Has modificado el topic correctamente";
                  $scope.$apply();
              },
              error: function (of, error) {
                  $scope.error = getErrorDesc(error);
                  $scope.$apply();
              }
          });


      };
      
      $scope.setTopicToDelete= function(index){
        $scope.toDeleteTopic = $scope.topics[index]; 
        $scope.$apply();
      };
      
      $scope.deleteTopic = function(){
        unitsrv.deleteTopic($scope.toDeleteTopic, {
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
    

    


