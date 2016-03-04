'use strict';

angular.module('tfaApp')
  .controller('StudentClassesCtrl', function ($scope,$route,toastr, unitsrv, coursesrv,$location ,$routeParams ) {

    //courses call
    //initial data set
    $scope.unit = {};
    $scope.topics = [];
    $scope.currentTopic = {};
    $scope.currentUnit = {};
    $scope.error = "";
    $scope.success = "";

    //Take objectID to query from the routeParams
    $scope.unitId = 0;
    $scope.blockId = 0;
    $scope.topicId = 0;
    if ($routeParams) {
      $scope.unitId = $routeParams.unitId;
      $scope.topicId = $routeParams.topicId;
      $scope.blockId = $routeParams.blockId;
    }

    var flagUnitId = false;
    //Initial query to set te Unit and Topic array
    unitsrv.getContentBlock({ id: $scope.blockId }, {
        success: function (block) {

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


        //Query to add the exam to the unit!
        var query = new Parse.Query('Exam');
        query.equalTo('student', Parse.User.current());
        query.include('unit');
        query.find({
            success: function (exams) {
              for (var i = 0; i < exams.length; i++) {
                for (var j = 0; j < $scope.block.unitsX.length; j++) {
                  if(exams[i].get('unit').id == $scope.block.unitsX[j].id){
                    $scope.block.unitsX[j].exam = exams[i]
                  }
                }
              }
            },
            error: function(error){
              toastr.error(error);
            }
        });

        $scope.currentUnit = $scope.block.unitsX[0];
        $scope.currentTopic = $scope.currentUnit.topicsX[0];

        //TO PUT IN THE HEADO OF THE UNIT
        // var query = new Parse.Query('Exam');
        // query.equalTo('unit', $scope.currentUnit);
        // query.equalTo('student', Parse.User.current());
        // query.find({
        //     success: function (exam) {
        //         //there are not exam for this unit and student
        //         if (exam.length == 0) {
        //             $scope.headExamDone = false;
        //             $scope.$apply();
        //
        //         } else {
        //             $scope.headExamDone = true;
        //             $scope.headExamGrade = exam[0].get('grade');
        //             $scope.$apply();
        //         }
        //     },
        //     error: function (error) {
        //         toastr.error(getErrorDesc(error));
        //     }
        // });

        $scope.$apply();
      },
      error: function(error){
        toastr.error(getErrorDesc(error));;
      }
    });

    $scope.headExamGrade = 0;
    $scope.headExamDone = false;
    //To set view of Details about Topic
    $scope.showTopic = function (unitId, topicIndex) {
        for (var i = 0; i < $scope.block.unitsX.length; i++) {
          if($scope.block.unitsX[i].id == unitId){
            $scope.currentUnit = $scope.block.unitsX[i];
          }
        }
        $scope.currentTopic = $scope.currentUnit.topicsX[topicIndex];

        //To mark if can do the exam in header!
        var query = new Parse.Query('Exam');
        query.equalTo('unit', $scope.currentUnit);
        query.equalTo('student', Parse.User.current());
        query.find({
            success: function (exam) {
                //there are not exam for this unit and student
                if (exam.length == 0) {
                    $scope.headExamDone = false;
                    $scope.$apply();

                } else {
                    $scope.headExamDone = true;
                    $scope.headExamGrade = exam[0].get('grade');
                    $scope.$apply();
                }
            },
            error: function () {
            }
        });

        //$scope.$apply();
    };

    $scope.unitToExam = {};
    $scope.examDone = false;
    $scope.currentExam = {};
    $scope.setUnitExam = function(unit){
      debugger;
        if(unit.exam){
          $scope.currentExam = unit.exam;
          $scope.examDone = true;
        } else {
          $scope.unitToExam = unit;
          $scope.examDone = false;
          $scope.currentExam = {};
        }
        $scope.$apply();

        // $scope.unitToExam = unit;
        // //Get the exam if already exist
        //
        //
        // var query = new Parse.Query('Exam');
        // query.equalTo('unit', $scope.unitToExam);
        // query.equalTo('student', Parse.User.current());
        // query.find({
        //     success: function (exam) {
        //         //there are not exam for this unit and student
        //         if (exam.length == 0) {
        //             $scope.examDone = false;
        //             $scope.$apply();
        //
        //         } else {
        //             $scope.examDone = true;
        //             $scope.currentExam = exam[0];
        //             $scope.$apply();
        //         }
        //     },
        //     error: function () {
        //     }
        // });

    }

    $scope.toExam = function () {
      toastr.info("Comanzaste el examen")
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $('body').removeAttr('style');
      debugger;
      $location.path("/student/doexam/" + $scope.unitToExam.id + "/" + $scope.blockId);
    }

    $scope.markAsRead = function(){
      if(!$scope.currentTopic.seen){
        unitsrv.markTopicSeenBy($scope.currentTopic, Parse.User.current()  ,{
            success: function (ok) {
            toastr.success("Marcaste esta unidad como le�da");
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
              toastr.error(error);
          }
        } );
     }
    };

    function setExamHead(unit) {


    }
});
