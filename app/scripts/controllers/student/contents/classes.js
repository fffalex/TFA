'use strict';

angular.module('tfaApp')
  .controller('StudentClassesCtrl', function ($scope, unitsrv, coursesrv) {

    //courses call
    $scope.fullUnits = [];
    var coursesArr = [];

    $scope.xalert = function () {
        console.log("Se apreto todito");
    }
    
    $scope.wasSeen = function (unitIndex, TopicIndex) {

    }
    var course = Parse.User.current().get('assignedTo');
    var studentId = Parse.User.current().get('id');
    
    //to get curse units
    unitsrv.getAllUnits(course, {
                success: function(units){
                    $scope.fullUnits = units;
                    $scope.currentUnit = $scope.fullUnits[0];
                    $scope.currentTopic = $scope.currentUnit.topicsJSON[0];
                     
                    //for (var i = 0; i < $scope.fullUnits.length; i++) {
                    //    for (var j = 0; j < $scope.fullUnits.topicsJSON.length; j++) {
                    //        if($scope.fullUnits.topicsJSON[j].seenBy == studentId){
                    //            $scope.fullUnits.topicsJSON[j].
                    //        }
                    //    };
                    //};
                    $scope.$apply();
                },
                error: function(error){
                    console.log(error);
                }
              });
  
    $scope.showUnit = function (index) {
          $scope.currentUnit = $scope.fullUnits[index];
          $scope.currentTopic = $scope.fullUnits[index].topicsJSON[0];
          $scope.apply;
      };
      
    $scope.showTopic = function (index,unitId) {
          var result =  $.grep($scope.fullUnits, function(e){ return e.objectId == unitId; });
          $scope.currentUnit = result[0];
          $scope.currentTopic = $scope.currentUnit.topicsJSON[index];
          $scope.apply;
      };
  
  
  
  
  });
  
           