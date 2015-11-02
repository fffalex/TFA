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
    unitsrv.getAllUnitsTopicSeenBy(course, {
                success: function(units){
                    $scope.fullUnits = units;
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
  });
  
           