'use strict';

angular.module('tfaApp')
  .controller('TeacherStudentProgressCtrl', function ($scope,$route,toastr, unitsrv, coursesrv,$location ,$routeParams ) {

    //Take objectID to query from the routeParams
    var objectId = 0;
    var blockId = 0;
    if ($routeParams) {
        objectId = $routeParams.objectId;
        blockId = $routeParams.blockId;
    }
    $scope.student = {};
    $scope.currentExam = {};
    $scope.allExams = [];
    $scope.passed = [];
    $scope.disaproved = [];
    var gradeToPassExam = Parse.User.current().get('minToPassExam');
    var query = new Parse.Query('User');
    query.include('assignedTo');
    query.equalTo('objectId', objectId);
    query.first({
      success: function (student) {
        $scope.student = student;
        if(student){
          unitsrv.getContentBlock({id: blockId},{
            success: function(block){
              $scope.block = block;
              $scope.block.unitsX = [];
              $scope.topicRead = 0;
              $scope.totalTopic = 0;
              //For each unit in Content
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
                          $scope.totalTopic = $scope.totalTopic + 1;

                            if (unit.get('topics')[k].get('seenBy') != undefined){
                              for (var i = 0; i < unit.get('topics')[k].get('seenBy').length; i++) {
                                if ( unit.get('topics')[k].get('seenBy')[i].id == $scope.student.id){
                                  unit.get('topics')[k].seen = true;
                                  $scope.topicRead = $scope.topicRead + 1 ;
                                }
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
              var userStudent = new (Parse.Object.extend('User'))();
              userStudent.set('id', objectId);
              query.equalTo('student', userStudent);
              query.include('unit');
              query.find({
                  success: function (exams) {
                    for (var i = 0; i < exams.length; i++) {
                      for (var j = 0; j < $scope.block.unitsX.length; j++) {
                        if(exams[i].get('unit').id == $scope.block.unitsX[j].id){
                          $scope.block.unitsX[j].exam = exams[i]

                          $scope.allExams.push(exams[i]);
                          //to calculate grade
                          debugger;
                          if(exams[i].get('grade') < 60){
                              $scope.disaproved.push(exams[i]);
                            } else {
                              $scope.passed.push(exams[i]);
                          }
                        }
                      }

                    }
                    $scope.$apply();
                  },
                  error: function(error){
                    toastr.error(error);
                  }
              });
              $scope.$apply();
            },
            error: function(error){
              toastr.error(getErrorDesc(error));
            }

          });
      } else {
        toastr.error("No se encontró el alumno Intenta mas tarde");
      }

      },
      error: function(error){
        toastr.error(error);
      }
    });

    $scope.showExam = function(exam){
      $scope.currentExam = exam;
      var query = new Parse.Query('Answer');
      query.include('question');
      query.equalTo('exam',exam);
      query.find({
        success: function(answers){
          $scope.currentExam.answers = answers;
          $scope.$apply();
        },
        error: function(){
          toastr.error(getErrorDesc(error));
        }
      });
    }

});
