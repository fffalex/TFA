'use strict';

/**
 * @ngdoc service
 * @name tfa.authsrv
 * @description
 * # authsrv
 * Authentication service for user authorization and authentication and 
 * grant role access.
 */

angular.module('tfaApp')
  .factory('authsrv', function ($q) {
    
    // current authenticated user and role
    var currentUser=null, currentRoles=null;

    // route saving used after login, to redirect to the desired route
    var previousUrl;

    // obtain and update the current user of the site
    function updateCurrentUser(userData, cb){
      // get or update current user
      var user = Parse.User.current();
      var roles = [];
      // if it is logged in
      if(user){
        //get roles...
        var role = new Parse.Query(Parse.Role);
        role.equalTo('users',user).find({
          success: function(results) {
            // found user roles
            if(results.length){
              roles = results;
              //append internal roles...
              //promise version (PARSE!)
              var promises = [];
              results.forEach(function(res){
                promises.push(res.getRoles().query().find({
                  success: function(sresults){
                    roles = roles.concat(sresults);
                  },
                  error: function(sres,error){
                    console.log(error);
                  }
                }));
              });
              Parse.Promise.when(promises).done(function(){
                //this two are assigned toggether
                currentRoles = roles;
                currentUser = user.toFullJSON();
                //notify parent
                if (cb && cb.success) {
                  cb.success(userData);
                }
              });
            }else{
              //this two are assigned toggether and fix users without roles
              currentRoles = [new Parse.Role('user', new Parse.ACL())];
              currentUser = user.toFullJSON();
              //notify parent
              if (cb && cb.success) {
                cb.success(userData);
              }
              console.log('Warning! user hasn\'t roles!');
            }
          },
          error: function(error) {
            //this two are assigned toggether and error getting user roles
            currentRoles = [new Parse.Role('guest', new Parse.ACL())];
            currentUser = user.toFullJSON();
            //notify parent
            if (cb && cb.success) {
              cb.success(userData);
            }
            console.log('Error when getting user roles! ' + error);
          }
        });
      }else{
        //this two are assigned toggether and guests has "guest" role
        currentRoles = [new Parse.Role('guest', new Parse.ACL())];
        currentUser = user;
        //notify parent
        if (cb && cb.success) {
          cb.success(userData);
        }
      }
    }



    function uploadPicture(file, cb) {
      if (!cb) {
        throw 'This function need a callback';
      }
      var name = strNormalize(file.name);
      var picture = new Parse.File(name, file);
      picture.save({
        success: function () {
          if (cb && cb.success) {
            cb.success(picture);
          }
        },
        error: function (error) {
          if (cb && cb.error) {
            cb.error(error);
          }
        }
      });
    }

    return {

      initialized: function authInitialized(){
        return (currentRoles !== null);
      },

      initialize: function authInitialize(){
        var that=this;
        //promise for loading user data...
        return $q(function(resolve, reject){
          if(!that.initialized()){
            updateCurrentUser(null,{success:resolve,error:reject});
          }else{
            resolve();
          } 
        });
      },

      // login
      login: function authLogin(user,pass,cb) {
        Parse.User.logIn(user,pass, {
          success: function(user) {
            updateCurrentUser(user.toFullJSON(), cb);
          },
          error: function (user, error) {
            if(cb && cb.error) {
              cb.error(user.toFullJSON(), error);
            }
          }
        });
      },

      //sign up
      // userData has username, password, email, name, lastName, phoneNumber, isSeller(bool)
      signUp: function authSignUp(userData, cb){
        var user = new Parse.User();
        // common data for all users
        user.set('username', userData.username);
        user.set('password', userData.password);
        user.set('email', userData.email);
        user.set('name', userData.name);
        user.set('lastName', userData.lastName);
        user.set('phoneNumber', userData.phoneNumber);
        //To set a relation many-to-many
        var relation = user.relation("teachOn");
        relation.add(userData.teachOn);

        //
        if (userData.isTeacher) {
          user.set('specialty', userData.specialty);
          user.set('address', userData.address);
        }
        user.signUp(null, {
          success: function (user) {
            updateCurrentUser(user.toFullJSON(), cb);
          },
          error: function (user, error) {
            if (cb && cb.error) {
              cb.error(user.toFullJSON(), error);
            }
          }
        });
      },

      //logout
      logout: function authLogout(cb) {
        if(currentUser){
          Parse.User.logOut().then(function () {
            updateCurrentUser(null, cb);
          },function (error) {
            if(cb && cb.error){
              cb.error(error);
            }
          });
        }else if(cb && cb.error){
          cb.error('User not logged');
        }
      },

      //loginfb
      /*loginFb: function authLoginFb(cb) {
        Parse.FacebookUtils.logIn('email', {
          success: function(user) {
            if (!user.existed()) {
              FB.api('/me', function(me){
                user.set('fullname', me.name);
                user.set('email', me.email);
                user.set('fbid', me.id);
                user.save(null, {
                  success: function(user) {
                    // Execute any logic that should take place after the object is saved.
                    updateCurrentUser(user.toFullJSON(), cb);
                  },
                  error: function(user, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new object, with error code: ' + error.message);
                  }});
              });
            } else {
              updateCurrentUser(user.toFullJSON(), cb);
            }
          },
          error: function(user, error) {
            if (cb && cb.error) {
              cb.error(user.toFullJSON(), error);
            }
          }
        });
      },*/

      //is logged in
      isLoggedIn: function authIsLoggedIn() {
        return (currentUser !== null);
      },

      //get user roles
      getRoles: function authGetRoles() {
        return currentRoles;
      },

      //check user has a role or roles
      hasAccess: function authHasAccess(access) {
        if(currentRoles&&currentRoles.length){
          if(!$.isArray(access)){
            access=[access];
          }
          for (var i = 0; i < currentRoles.length; i++) {
            if(currentRoles[i].attributes){
              var r = currentRoles[i].get('name');
              if($.inArray(r, access)!==-1){
                return true;
              }
            }
          }
        }
        return false;
      },

      //get current user
      getCurrentUser: function authGetCurrentUser() {
        return currentUser;
      },

      // set url
      setPreviousUrl: function authSetPreviousUrl (url) {
        previousUrl = url;
      },

      // get url
      getPreviousUrl: function authGetPreviousUrl () {
        return previousUrl;
      },

      // clear the url
      clearPreviousUrl: function authClearPreviousUrl () {
        previousUrl = undefined;
      },

      // get user data from authenticated user
      getCurrentUserData: function authGetCurrentUserData (cb) {
        if(currentUser){
          Parse.User.current().fetch({
            success:function(user){
              if(cb && cb.success){
                cb.success(user.toFullJSON());
              }
            },
            error:function(error){
              if(cb && cb.error){
                cb.error(error);
              }
            }
          });
        }else if(cb && cb.error){
          cb.error('User not logged');
        }
      },

      // update the data of the authenticated user
      updateCurrentUserData: function authUpdateCurrentUserData (fullname, email, phone, cb) {
        if(currentUser){
          var user = Parse.User.current();
          user.set('fullname', fullname);
          user.set('email', email);
          user.set('phone', phone);
          user.save(null, {
            success: function (user) {
              if (cb && cb.success) {
                cb.success(user.toFullJSON());
              }
            },
            error: function (user, error) {
              if (cb && cb.error) {
                cb.error(user.toFullJSON(), error);
              }
            }
          });
        }else if(cb && cb.error){
          cb.error('User not logged');
        }
      },

      // upload profile image of the authenticated user
      /*uploadProfileImg: function authUploadProfileImg (file, cb) {
        if(currentUser){
          var avatar = new Parse.File(currentUser.username+'-avatar', file);
          avatar.save({
            success: function(){
              var user = Parse.User.current();
              user.set('avatar', avatar);
              user.save(null, {
                success: function (user) {
                  if (cb && cb.success) {
                    cb.success(user.toFullJSON());
                  }
                },
                error: function (user, error) {
                  if (cb && cb.error) {
                    cb.errorUser(user.toFullJSON(), error);
                  }
                }
              });
            },
            error: function(error){
              if(cb && cb.errorFile){
                cb.errorFile(error);
              }
            }
          });
        }else if(cb && cb.error){
          cb.error('User not logged');
        }
      },*/

      // resetPassword
      resetPassword: function authResetPassword (email, cb) {
        Parse.User.requestPasswordReset(email, {
          success: function() {
            if(cb && cb.success){
              cb.success();
            }
          },
          error: function(error) {
            if(cb && cb.error){
              cb.error(error);
            }
          }
        });
      },

       // update the data of the user profile
      updateUserDataProfile: function updateUserDataProfile(userData, cb) {
        if(currentUser){
          var user = new (Parse.Object.extend('User'));
          user.set('id',userData.objectId);
          user.set('name', userData.name);
          user.set('lastName', userData.lastName);
          user.set('email', userData.email);
          user.set('address', userData.address);
          user.set('phoneNumber', userData.phoneNumber);
          user.set('companyName', userData.companyName);

         if (userData.profilePicture && userData.profilePicture instanceof File) {
          uploadPicture(userData.profilePicture, {
            success: function (image) {
              user.set('profilePicture', image);
              user.save(null, {
                success: function (user) {

                   //Ver si se puede forzar de otra manera los datos 
                   //del local storage luego de hacer la edicion del user

                    Parse.User.current().set('id',userData.objectId);
                    Parse.User.current().set('name', userData.name);
                    Parse.User.current().set('lastName', userData.lastName);
                    Parse.User.current().set('email', userData.email);
                    Parse.User.current().set('address', userData.address);
                    Parse.User.current().set('phoneNumber', userData.phoneNumber);
                    Parse.User.current().set('profilePicture', userData.profilePicture);

                  if (cb && cb.success) {
                    cb.success(user.toFullJSON());
                  }
                },
                error: function (user, error) {
                  if (cb && cb.error) {
                    cb.error(user.toFullJSON(), error);
                  }
                }
              });
            },
            error: function (error) {
              if (cb && cb.error) {
                cb.error(error);
              }
            }
          });
        } else { 

          user.save(null, {
            success: function (user) {
              //Ver si se puede forzar de otra manera los datos 
              //del local storage luego de hacer la edicion del user
              Parse.User.current().set('id',userData.objectId);
              Parse.User.current().set('name', userData.name);
              Parse.User.current().set('lastName', userData.lastName);
              Parse.User.current().set('email', userData.email);
              Parse.User.current().set('address', userData.address);
              Parse.User.current().set('phoneNumber', userData.phoneNumber);
              Parse.User.current().set('profilePicture', userData.profilePicture);

              if (cb && cb.success) {
                cb.success(user.toFullJSON());
              }
            },
            error: function (user, error) {
              if (cb && cb.error) {
                cb.error(user.toFullJSON(), error);
              }
            }
          });
         }
        }else if(cb && cb.error){
          cb.error('User not logged');
        }
      }


    };
  });
