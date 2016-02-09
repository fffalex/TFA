'use strict';

/**
 * @ngdoc function
 * @name tfaApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller for the singup of the users
 */
angular.module('tfaApp')
        .controller('SignupCtrl', function ($scope, toastr, $location, authsrv, coursesrv) {

            // form initialization
            $scope.form = {};
            //change this for teacher profile!
            $scope.form.isTeacher = false;
            $scope.form.myCourse;
            $scope.error = '';
            $scope.courses = [];
            $scope.addedCourses = [];


            var phone = /^(\+)?\d{0,20}$/;
            var username = /^[a-zA-Z0-9_-]+$/;
            var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

            $scope.$watch('form.phoneNumber', function (newValue, oldValue) {
                if (newValue && newValue !== '' && !phone.test(newValue)) {
                    $scope.form.phoneNumber = oldValue;
                }
            });

            coursesrv.getAllCourses({
                success: function (courses) {
                    $scope.courses = courses;
                    $scope.myCourse = $scope.courses[0];
                    $scope.$apply();
                },
                error: function (me, error) {
                    toastr.error(error);
                }
            });

            $scope.addCourse = function(course){
              var index = $scope.courses.indexOf(course);
              if($scope.addedCourses.indexOf(course) == -1){
                $scope.addedCourses.push($scope.courses[index]);
                //console.log("agrego tranka");

              }else{
                console.log("Salio -1 faill");
              }
            };
            $scope.removeCourse = function(index){
              $scope.addedCourses.splice(index, 1);
            };



            $scope.doSignUp = function () {
                $scope.form.courses = $scope.addedCourses;
                $scope.form.myCourse;
                if (!$scope.form.username || $scope.form.username.length < 4 || $scope.form.username.length > 16) {
                    toastr.warning('El nombre de usuario debe tener entre 4 y 16 caracteres');
                } else if (!$scope.form.username || !username.test($scope.form.username)) {
                    toastr.warning('El nombre de usuario no debe contener caracteres especiales ni espacios en blanco');
                } else if (!$scope.form.email || !email.test($scope.form.email)) {
                    toastr.warning('Formato de email incorrecto');
                } else if (!$scope.form.password || $scope.form.password.length < 4) {
                    toastr.warning('Debe especificar una contraseña de al menos 4 caracteres');
                } else if (!$scope.form.name || $scope.form.name.length < 2 || $scope.form.name.length > 32) {
                    toastr.warning('Debe especificar un nombre');
                }
                else if (!$scope.form.lastName || $scope.form.lastName.length < 2 || $scope.form.lastName.length > 32) {
                    toastr.warning('Debe especificar un apellido');
                }
                else if (!$scope.form.phoneNumber || !phone.test($scope.form.phoneNumber)) {
                    toastr.warning('Formato de número de teléfono incorrecto, debe tener al menos 10 dígitos');
                }
                //CHECK THE USER STORIES
                else if (($scope.form.companyName || $scope.form.address) && (!$scope.form.specialty || !$scope.form.specialty.length)) {
                    toastr.warning('Como profesor, debe especificar una dirección');
                }
                else if (($scope.form.companyName || $scope.form.address) && (!$scope.form.address || !$scope.form.address.length)) {
                    toastr.warning('Como profesor, debe especificar una dirección');
                }
                else {
                    authsrv.signUp($scope.form, {
                        success: function signUpSuccess() {
                            toastr.success("¡Bienvenido!", "¡Te registraste correctamente!")
                            $location.path('/');

                        },
                        error: function signUpError(us, err) {
                            toastr.error(getErrorDesc(err));
                        }
                    });
                }
            };

        });
