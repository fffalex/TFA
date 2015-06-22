'use strict';

/**
 * @ngdoc function
 * @name tfaApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller for the logout of users
 */
angular.module('tfaApp')
    .controller('LogoutCtrl', function ($scope, $location, authsrv) {

        authsrv.logout({
            success: function () {
                $location.path('/');
            }, error: function () {
            }
        });

    });
