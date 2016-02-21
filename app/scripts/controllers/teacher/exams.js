'use strict';

angular.module('tfaApp')
  .controller('TeacherExamsCtrl', function ($scope, $routeParams, examsrv, unitsrv,toastr, coursesrv, ModalService,$route) {
    $scope.courses = [];
    $scope.selectedCourse = {};
    $scope.allRowsSelected = false;

    $scope.selectCourse = function(index){
      $scope.selectedCourse = $scope.courses[index];
      $scope.allRowsSelected = false;
    };


    $scope.exams = [];
    coursesrv.getAllStudentsInCourse(Parse.User.current(),{
        success: function(coursesFull){
          $scope.courses = coursesFull;
          $scope.selectedCourse = $scope.courses[0];
          examsrv.getAllExams({
            success: function(exams){

                for (var j = 0; j < $scope.courses.length; j++) {
                  $scope.courses[j].exams = [];
                  for (var k = 0; k < $scope.courses[j].students.length; k++) {
                    for (var i = 0; i < exams.length; i++) {

                      if(exams[i].get('student').id == $scope.courses[j].students[k].id){
                        for (var l = 0; l < $scope.courses[j].teacherContent.get('units').length; l++) {
                          if($scope.courses[j].teacherContent.get('units')[l].id == exams[i].get('unit').id){
                            //$scope.courses[j].exams.push(exams[i]);
                            $scope.courses[j].exams.push(exams[i]);
                          }
                        }
                      }

                    }
                  }
                  $scope.$apply();
                }

              //$scope.$apply();
            },
            error: function(error){
              toastr.error(getErrorDesc(error));
            }
          });
          $scope.$apply();
        },
        error: function (error){
          $scope.error = error;
        }
      });

    //Agregar un ERROR:?

    $scope.predicate = 'date';
    $scope.reverse = true;

    $scope.orderField = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };

    $scope.selectAllRows = function () {
      if ($scope.allRowsSelected) {
        for (var i = 0; i < $scope.selectedCourse.exams.length; i++) {
          $scope.selectedCourse.exams[i].selected = true;
        }
        $scope.allRowsSelected = true;
      } else {
        for (var i = 0; i < $scope.selectedCourse.exams.length; i++) {
          $scope.selectedCourse.exams[i].selected = false;
        }
        $scope.allRowsSelected = false;

      }
    };

  });
