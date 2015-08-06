'use strict';

//load initial config for keys using json 
var config=$.parseJSON($.ajax({url: 'config/global.json', dataType: 'json', async: false}).responseText);

Parse.initialize(config.parse.applicationId,config.parse.javaScriptKey);

/**
 * @ngdoc overview
 * @name tfaApp
 * @description
 * # tfaApp
 *
 * Main module of the application.
 */
angular
  .module('tfaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    //'pickadate',
    //'angularModalService',
    //'xeditable'
    
  ]).config(function ($routeProvider) {
    //create a custom provider to set a default resolve attribute
    //that will initialize autsrv data (Roles + extra data)
    var customRouteProvider = angular.extend({}, $routeProvider, {
      when: function (path, route) {
        route.oldresolve = route.resolve;
        route.resolve = {
          //Initialize auth data and check user access
          authCheck: ['$q','$injector','authsrv', function ($q,$injector,authsrv) {
            //this will return a promise object
            //that will signal when the data is loaded
            return authsrv.initialize().then(function () {
              //promise for checking user access...
              return $q(function (resolve, reject) {
                if(route && route.access && !authsrv.hasAccess(route.access)){
                  //rejected...
                  return reject({ needsAuthentication: true, redirectUrl: route.defaultRoute });
                }
                //resolving internal "resolves"
                if(route.oldresolve){
                  //invoke internal resolves
                  var locals = {};
                  angular.forEach(route.oldresolve, function (value, key) {
                    locals[key] = angular.isString(value) ?
                      $injector.get(value) : $injector.invoke(value, null, null, key);
                  });
                  $q.all(locals).then(function () {
                    //all "resolve" resolved
                    resolve();
                  },function (error) {
                    //error resolving "resolve"
                    reject(error);
                  });
                }else{
                  //just resolve
                  resolve();
                }
              });
            });
          }]
        };
        $routeProvider.when(path, route);
        return this;
      }
    });
    
    customRouteProvider//$routeProvider
//      .when('/', {
//        templateUrl: 'views/main.html',
//        controller: 'MainCtrl',
//        access: 'user'
//      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        access: 'guest'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        access: 'guest'
      })
      .when('/logout', {
        access: 'user',
        resolve: {
          logout: ['$q','$location','authsrv', function ($q,$location,authsrv) {
            return $q(function (resolve /*,reject*/ ) {
              authsrv.logout({
                success:function () {
                  $location.path('/');
                  resolve();
                },error:function () {
                  resolve();
                }
              });
            });
          }]
        }
      })
      .when('/teacher/contents', {
        templateUrl: 'views/teacher/contents.html',
        controller: 'TeacherContentsCtrl',
        access: 'teacher'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  //cambio para no usar xeditable
  //.run(function ($rootScope, $location, $timeout, authsrv, editableOptions) {
  .run(function ($rootScope, $location, $timeout, authsrv) {
    $rootScope.$on('$routeChangeStart', function (event, next /*,current*/ ) {
      //save previous url that has been intented to access
      //to will be used when login is success
      if(next.$$route && next.$$route.originalPath !== '/login') {
        authsrv.setPreviousUrl(next.$$route.originalPath);
      }
      
      //IF i am going to use some modal
      $('.modal').modal('hide');
      $('.modal').on('hidden', function () {
        //becose it bugged it 
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
      });
      //show loading gif
      $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
      //hide loading gif
      $timeout(function () {$rootScope.loading = false;}, 200);
    });

    $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
      //no access???
      if (rejection && rejection.needsAuthentication === true) {
        var redirectUrl=rejection.redirectUrl;
        if(!redirectUrl){
          redirectUrl=(authsrv.isLoggedIn() ? '/' : '/login');
        }
        //redirect
        $location.path(redirectUrl);
      }
      //hide loading gif
      $timeout(function () {$rootScope.loading = false;}, 200);
    });
     //desactivo el editable
     //editableOptions.theme = 'bs3';
  });
  
//  .config(function ($routeProvider) {
//    $routeProvider
//      .when('/', {
//        templateUrl: 'views/main.html',
//        controller: 'MainCtrl'
//      })
//      .when('/about', {
//        templateUrl: 'views/about.html',
//        controller: 'AboutCtrl'
//      })
//      .otherwise({
//        redirectTo: '/'
//      });
  
