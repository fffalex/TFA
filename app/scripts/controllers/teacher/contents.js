'use strict';

angular.module('tfaApp')
  .controller('TeacherContentsCtrl', function ($scope) {
    
    var units = [];
    var topics = [];
    
    var topic = {title:'topic1'};
    topics.push(topic);
    var unit = {title:'unidad1',topics: topics};
    units.push(unit);
    var unit1 = {title:'unidad2',topics: topics};
    units.push(unit1);
    
    $scope.course = {title:'curso1',units:units};
    
    
    
    

});



