'use strict';
/**
 * @ngdoc function
 * @name tfaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller for the login user
 */
angular.module('tfaApp')
        .controller('LoginCtrl', function ($scope, $location, authsrv) {

            // Login initialization
            $scope.form = {};
            $scope.error = '';

            var username = /^[a-zA-Z0-9_-]+$/;

            $scope.doLogin = function () {
                if (!$scope.form.username || $scope.form.username.length < 4 || $scope.form.username.length > 16) {
                    $scope.error = 'El nombre de usuario debe tener entre 4 y 16 caracteres';
                }
                else if (!$scope.form.username || !username.test($scope.form.username)) {
                    $scope.error = 'El nombre de usuario no debe contener caracteres especiales ni espacios en blanco';
                }
                else if (!$scope.form.password || $scope.form.password.length < 4) {
                    $scope.error = 'Debe especificar una contraseña de al menos 4 caracteres';
                }
                else {
                    authsrv.login($scope.form.username, $scope.form.password, {
                        success: function loginSuccess() {
                            redirectUrl();
                            $scope.$apply();
                        },
                        error: function loginError(us, err) {
                            $scope.error = getErrorDesc(err);
                            $scope.$apply();
                        }
                    });
                }
            };

            $scope.hideError = function () {
                $scope.error = '';
            };


            //CHANGE THIS FOR THE HOME ROUTE FOR MY APP
            var redirectUrl = function () {
                if (authsrv.getPreviousUrl() !== '/login') {
                    $location.path('/HOMEHERE!');
                    authsrv.clearPreviousUrl();
                } else {
                    $location.path('/');
                }
            };

        });
