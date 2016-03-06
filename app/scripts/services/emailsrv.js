'use strict';

/**
 * @ngdoc service
 * @name globiandaApp.emailsrv
 * @description
 * # emailsrv
 * Factory in the globiandaApp.
 */
angular.module('tfaApp')
  .factory('emailsrv', function () {
    return {

      //To send emails by address (addresses should be a array of emails address)
      sendEmail: function sendEmail(addresses,subject,content,cb){
        var data = {};
        data.addresses=addresses;
        data.subject=subject;
        data.content=content;

        Parse.Cloud.run("sendEmail", data, {
          success: function(object) {
            if (cb && cb.success) {
              cb.success(object);
            }
          },
          error: function (err) {
            if (cb && cb.error) {
              cb.error(err);
            }
          }
        });


      }
      };
  });
