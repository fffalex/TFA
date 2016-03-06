'use strict';

angular.module('tfaApp')
  .controller('TeacherMyStudentsCtrl', function ($scope, $routeParams, examsrv, unitsrv, toastr,coursesrv, $route) {
    $scope.courses = [];
    $scope.selectedCourse = {};
    $scope.allRowsSelected = false;

    $scope.selectCourse = function(index){
      $scope.selectedCourse = $scope.courses[index];
      $scope.allRowsSelected = false;
    };



    coursesrv.getAllStudentsInCourse(Parse.User.current(),{
        success: function(coursesFull){
          $scope.courses = coursesFull;
          $scope.selectedCourse = $scope.courses[0];
          $scope.$apply();
        },
        error: function (error){
          $scope.error = error;
        }
      });

    //Agregar un ERROR:?

    $scope.predicate = 'date';
    $scope.reverse = true;

    $scope.orderField = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };

    $scope.selectAllRows = function () {
      if ($scope.allRowsSelected) {
        for (var i = 0; i < $scope.selectedCourse.students.length; i++) {
          $scope.selectedCourse.students[i].selected = true;
        }
        $scope.allRowsSelected = true;
      } else {
        for (var i = 0; i < $scope.selectedCourse.students.length; i++) {
          $scope.selectedCourse.students[i].selected = false;
        }
        $scope.allRowsSelected = false;

      }
    };

    $scope.doSend = function () {
      if ($scope.message && $scope.subject) {
        toastr.error("Error en el servidor SMTP. No se ha podido enviar el mensaje. Intente nuevamente más tarde");
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        $('body').removeAttr('style');
        $('#sendNotificationModal').modal('toggle');
// var uniqueAddresses = [];
        // if(isSeller){
        //   var addresses = [];
        //   for (var i=0; i < orders.length ;i++ ){
        //     addresses.push(orders[i].buyer.email);
        //   }
        //
        //   //TO Remove Equal email address
        //     uniqueAddresses = addresses.filter(function(elem, pos) {
        //     return addresses.indexOf(elem) == pos;
        //   });
        // }else{
        //   uniqueAddresses.push(orders[0].offer.meal.seller.email);
        // }
        //
        // //TO ADD A SIGN OF THE SENDER
        // var sender = authsrv.getCurrentUser();
        // var messageWithSign = $scope.message;
        // if(sender){
        //   var messageWithSign = $scope.message+"\n\n Atentamente: "+sender.name+" "+sender.lastName+"\n TE: "+sender.phoneNumber;
        // }
        //
        // emailsrv.sendEmail(uniqueAddresses, $scope.subject,messageWithSign,{
        //   success: function(result){
        //     $scope.error = '';
        //     close(true, 200);
        //   },
        //   error: function(error){
        //     $scope.error = getErrorDesc(error);
        //     //$scope.$apply();
        //   }
        // });
      } else {
        toastr.warning("Los campos deben estar cargados");
      }
    };

  });
