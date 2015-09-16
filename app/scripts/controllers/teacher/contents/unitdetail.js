'use strict';

angular.module('tfaApp')
  .controller('TeacherUnitdetailCtrl', function ($scope, $routeParams, unitsrv, coursesrv) {
    $scope.unit = {};
    $scope.topics = [];
    $scope.error = "";
    var objectId=0;
    if($routeParams){
      objectId = $routeParams.objectId
    }
    var query = new Parse.Query('Unit');
    query.equalTo('objectId',objectId);
    query.first({
            success: function (unit) {
                $scope.unit = unit.toFullJSON();
                unitsrv.getAllTopics(unit, {
                      success: function (topics) {
                        $scope.topics = topics;
                        $scope.$apply();
                      }
                });
            },
            error: function (error) {
                  $scope.error = "TODO MAL CHABON";
              }
            });
  });
    

    


