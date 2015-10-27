'use strict';

angular.module('tfaApp')
  .controller('TeacherUnitdetailCtrl', function ($scope, $routeParams, unitsrv, coursesrv, ModalService) {
    $scope.unit = {};
    $scope.topics = [];
    $scope.currentTopic = {};
    $scope.error = "";
    var objectId=0;
    if($routeParams){
      objectId = $routeParams.objectId
    }

    $scope.showTopic = function (index) {
        $scope.currentTopic = $scope.topics[index];
        $scope.apply;
    }

    $scope.showEditModal = function(i) {
        ModalService.showModal({
            templateUrl: 'views/teacher/contents/unitedit.html',
            controller: 'TeacherUniteditCtrl',
            inputs: {
                topic: $scope.topics[i]
            }
        })
        .then(function (modal) {
            modal.element.modal();
            modal.close.then(function(done) {
                if(done){
                    //$scope.success = 'Exito';
                    //$scope.$apply();
                }
                //becose it bugged it 
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('body').removeAttr('style');
                $route.reload();
            });
        });
    }; 
      
    var query = new Parse.Query('Unit');
    query.equalTo('objectId',objectId);
    query.first({
            success: function (unit) {
                $scope.unit = unit.toFullJSON();
                unitsrv.getAllTopics(unit, {
                      success: function (topics) {
                        $scope.topics = topics;
                        $scope.currentTopic = $scope.topics[0];
                        $scope.$apply();
                      }
                });
            },
            error: function (error) {
                  $scope.error = "TODO MAL CHABON";
              }
            });
  });
    

    


