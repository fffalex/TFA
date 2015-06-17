'use strict';

/**
 * @ngdoc function
 * @name tfaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tfaApp
 */
angular.module('tfaApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
