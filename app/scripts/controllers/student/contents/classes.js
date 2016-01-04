'use strict';

angular.module('tfaApp')
  .controller('StudentClassesCtrl', function ($scope, unitsrv, coursesrv) {

    //courses call
    //initial data set
    $scope.unit = {};
    $scope.topics = [];
    $scope.currentTopic = {};
    $scope.error = "";
    $scope.success = "";

    //Control function flows
    $scope.editable = false;
    $scope.creating = false;

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
          $scope.$apply();
        } else {
          $scope.error = "No hay ningun tema"

        }
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
      $scope.currentTitle  = $scope.currentTopic.get('title');
      $scope.currentNumber  = $scope.currentTopic.get('number');
      $scope.currentContent = $scope.currentTopic.get('content');
      $scope.currentTopicCopy = angular.copy($scope.currentTopic);
      $scope.apply;
    };

});
