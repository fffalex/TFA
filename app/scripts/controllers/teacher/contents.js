'use strict';

angular.module('tfaApp')
  .controller('TeacherContentsCtrl', function ($scope, unitsrv, coursesrv) {
    
    var units = [];
    var topics = [];
    
    var topic = {title:'topic1'};
    topics.push(topic);
    var unit = {title:'unidad1',topics: topics};
    units.push(unit);
    var unit1 = {title:'unidad2',topics: topics};
    units.push(unit1);
    
    $scope.course = {title:'curso1',units:units};
    
    var coursesArr = [];
    coursesrv.getTeacherCourses(Parse.User.current(),{
          success: function (courses) {
              coursesArr = courses;
              unitsrv.getAllUnits(coursesArr[0],{
                success: function (units) {
                  var unitsArr = units;
                  console.log(unitsArr);
              },
              error: function (me, error) {
                  console.log(error);
              }
              });
              console.log(units);
          },
          error: function (me, error) {
              console.log(error);
          }
      });
            
   
    
    
    
    

});



