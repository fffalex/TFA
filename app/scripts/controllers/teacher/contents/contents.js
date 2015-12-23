'use strict';

angular.module('tfaApp')
  .controller('TeacherContentsCtrl', function ($scope, $route, unitsrv, coursesrv) {

      //To create Units to Course
      //    var u = new (Parse.Object.extend('Unit'));
      //    u.set('id','Kk0ckjolDF');
      //    var t = new (Parse.Object.extend('Topic'));
      //    t.set('id','KVetWv2NyR');
      //    var t1 = new (Parse.Object.extend('Topic'));
      //    t1.set('id','81zfuncBJP');
      //
      //    var relation = u.relation("topics");
      //    relation.add(t);
      //    relation.add(t1);
      //
      //    u.save();
      //
      //    var u5 = new (Parse.Object.extend('Unit'));
      //    u5.set('id','N5fnYadMwI');
      //    var t5 = new (Parse.Object.extend('Topic'));
      //    t5.set('id','elzA2xb0d7');
      //
      //    var relation = u5.relation("topics");
      //    relation.add(t5);
      //
      //    u5.save();






      //    var units = [];
      //    var topics = [];
      //
      //    var topic = {title:'topic1'};
      //    topics.push(topic);
      //    var unit = {title:'unidad1',topics: topics};
      //    units.push(unit);
      //    var unit1 = {title:'unidad2',topics: topics};
      //    units.push(unit1);
      //
      //    $scope.course = {title:'curso1',units:units};

      //courses call
      $scope.selectedCourse = {};
      $scope.fullUnits = [];
      $scope.fullCourses = [];
      $scope.blockName = '';
      $scope.blockDescription = '';

      $scope.show = function show(id){
          alert("se apreto el bicho "+id);
      };

      $scope.selectCourse = function(index){
        $scope.selectedCourse = $scope.fullCourses[index];
      };

      $scope.createBlock = function(name, desc){
        var block = {}
        block.name = name;
        block.description = desc;
        unitsrv.createBlock(block,Parse.User.current(),{
          success: function(or){
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            $('body').removeAttr('style');
            $route.reload();
          },
          error: function(error){
            $scope.error = error;
          }
        });
      }

      coursesrv.getTeacherCourses(Parse.User.current(), {
          success: function (courses) {
              $scope.fullCourses = courses;
              //$scope.fullUnits = $scope.fullCourses[0].get('contentBlock').get('units');
              $scope.selectedCourse = $scope.fullCourses[0];
              $scope.$apply();
          }
      });
      unitsrv.getAllTeacherContentBlocks(Parse.User.current(), {
          success: function (contents) {
              $scope.allContents = contents;
              $scope.$apply();
          },
          error: function (error) {
              $scope.error = error;
          }
      });

  });








              //COMPLEX CALL!
//              unitsrv.getAllUnitsAndTopics(coursesArr[0],{
//                success: function(fullCourse){
//                  $scope.fullCourse = fullCourse;
//                },
//                error: function(error){
//                  console.log(error);
//                }
//              });


              //unit call
//              unitsrv.getAllUnits(coursesArr[0],{
//                success: function (units) {
//                  var unitsArr = units;
//
//                  //topic call
//                  for(var i=0; i < unitsArr.length; i++){
//                    $scope.fullUnits = unitsrv.addTopicsToUnit(unitsArr[i]);
//                  }
//                },
//                error: function (me, error) {
//                    console.log(error);
//                }
//              });
//              $scope.fullCourse.units = $scope.fullUnits;
//              console.log('SCOPE COURSE:')
//              console.log($scope.fullCourse);
//          },
//          error: function (me, error) {
//              console.log(error);
//          }



    //PROMISES
//    coursesrv.getTeacherCourses(Parse.User.current()).then(function(courses){
//      unitsrv.getAllUnits(courses[0]);
//    }).then(function(units){
//      for(var i=0; i<units.length;i++){
//        unitsrv.getUnitsTopic(unitsArr[i]).then(function(topics){
//
//        });
//      }
//    }).then(function())
