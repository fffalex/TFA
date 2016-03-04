'use strict';
/**
 * @ngdoc function
 * @name tfaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller for the login user
 */
angular.module('tfaApp')
        .controller('LoginCtrl', function ($scope, toastr,$location, authsrv) {

            // Login initialization
            $scope.form = {};
            $scope.error = '';

            var username = /^[a-zA-Z0-9_-]+$/;

            $scope.doLogin = function () {
                if (!$scope.form.username || $scope.form.username.length < 4 || $scope.form.username.length > 16) {
                    toastr.warning('El nombre de usuario debe tener entre 4 y 16 caracteres');
                }
                else if (!$scope.form.username || !username.test($scope.form.username)) {
                    toastr.warning('El nombre de usuario no debe contener caracteres especiales ni espacios en blanco');
                }
                else if (!$scope.form.password || $scope.form.password.length < 4) {
                    toastr.warning('Debe especificar una contraseña de al menos 4 caracteres');
                }
                else {
                    authsrv.login($scope.form.username, $scope.form.password, {
                        success: function loginSuccess() {
                            toastr.success("¡Bienvenido!","¡Ingresaste correctamente!");
                            redirectUrl();
                            $scope.$apply();
                        },
                        error: function loginError(us, err) {
                            toastr.error(getErrorDesc(err));
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
                  if(authsrv.hasAccess('teacher'))
                  {
                      $location.path('/teacher/content');
                  }
                  if(authsrv.hasAccess('student'))
                  {
                      $location.path('/teacher/student');
                  }
                    authsrv.clearPreviousUrl();
                } else {
                    $location.path('/');
                }
            };

        });
