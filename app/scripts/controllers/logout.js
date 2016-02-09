'use strict';

/**
 * @ngdoc function
 * @name tfaApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller for the logout of users
 */
angular.module('tfaApp')
    .controller('LogoutCtrl', function ($scope,toastr, $location, authsrv) {

        authsrv.logout({
            success: function () {
                toastr.success("Saliste de tu cuenta correctamente");
                $location.path('/');
            }, error: function () {
            }
        });

    });
