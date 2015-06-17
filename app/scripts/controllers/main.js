'use strict';

/**
 * @ngdoc function
 * @name tfaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tfaApp
 */
angular.module('tfaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
