'use strict';

angular.module('tfaApp')
  .controller('StudentClassesCtrl', function ($scope,$route, unitsrv, coursesrv, $routeParams ) {

    //courses call
    //initial data set
    $scope.unit = {};
    $scope.topics = [];
    $scope.currentTopic = {};
    $scope.currentUnit = {};
    $scope.error = "";
    $scope.success = "";

    //Take objectID to query from the routeParams
    var unitId = 0;
    var blockId = 0;
    var topicId = 0;
    if ($routeParams) {
      $scope.unitId = $routeParams.unitId;
      $scope.topicId = $routeParams.topicId;
      $scope.blockId = $routeParams.blockId;
    }

    var flagUnitId = false;
    //Initial query to set te Unit and Topic array
    unitsrv.getContentBlock({id:'WSrnTu2Luw'},{
      success: function(block){
        $scope.block = block;
        $scope.block.unitsX = [];
        if($scope.block.get('units') != undefined){
          for (var j = 0; j < $scope.block.get('units').length; j++) {
            var unit = $scope.block.get('units')[j];
            unit.topicsX = [];
            if( unit.get('status') != 0){
              //For each topic in Unit
              if(unit.get('topics') != undefined){
                for (var k = 0; k < unit.get('topics').length; k++) {
                  if(unit.get('topics')[k].get('status') != 0){
                    unit.topicsX.push(unit.get('topics')[k]);
                  }
                  if (unit.get('topics')[k].get('seenBy') != undefined){
                    for (var i = 0; i < unit.get('topics')[k].get('seenBy').length; i++) {
                      if ( unit.get('topics')[k].get('seenBy')[i].id == Parse.User.current().id){
                        unit.get('topics')[k].seen = true;
                      }
                    }
                  }
                }
                //To check if all topic was seen by the student (Check the unit too)
                unit.seen = true;
                for (var i = 0; i < unit.topicsX.length; i++) {
                  if(unit.topicsX[i].seen != true){
                    unit.seen = false;
                  }
                }
              }
              $scope.block.unitsX.push(unit);
            }
          }
        }
        $scope.currentUnit = $scope.block.unitsX[0];
        $scope.currentTopic = $scope.currentUnit.topicsX[0];
        $scope.$apply();
      },
      error: function(error){
        $scope.error = error;;
      }
    });

    //To set view of Details about Topic
    $scope.showTopic = function (unitId, topicIndex) {
        for (var i = 0; i < $scope.block.unitsX.length; i++) {
          if($scope.block.unitsX[i].id == unitId){
            $scope.currentUnit = $scope.block.unitsX[i];
          }
        }
        $scope.currentTopic = $scope.currentUnit.topicsX[topicIndex];
        $scope.$apply();
    };

    $scope.unitToExam = {};
    $scope.setUnitExam = function(unit){
      $scope.unitToExam = unit;
      $scope.$apply();
    }

    $scope.toExam = function(){
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $('body').removeAttr('style');
      $location.path( "/student/doexam/"+$scope.unitToExam.id+"/0/0" );
    }

    $scope.markAsRead = function(){
      unitsrv.markTopicSeenBy($scope.currentTopic, Parse.User.current()  ,{
        success: function(ok){
          $('.modal-backdrop').remove();
          $('body').removeClass('modal-open');
          $('body').removeAttr('style');
          $scope.currentTopic.seen = true;
          $scope.currentUnit.seen = true;
          for (var i = 0; i < $scope.currentUnit.topicsX.length; i++) {
            if ($scope.currentUnit.topicsX[i].seen != true){
              $scope.currentUnit.seen = false;
            }
          }
          $scope.$apply();
        },
        error: function(error){
          $scope.error(error);
        }
      } );
    };
});
