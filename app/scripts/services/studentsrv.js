'use strict';

/**
 * @ngdoc service
 * @name tfaApp.studentsrv
 * @description
 * # studentsrv
 * Factory in the tfaApp.
 */
angular.module('tfaApp')
  .factory('studentsrv', function () {
    return {
        getAllStudents: function studentGetAllStudents(courseData,cb) {
            var query = new Parse.Query('User');
            query.equalTo('assignedTo', courseData.objectId);
            query.find({
              success: function (students) {
                if (cb && cb.success) {
                  cb.success(students.toFullJSON());
                }
              },
              error: function (error) {
                if (cb && cb.error) {
                  cb.error(error);
                }
              }
            });
        },

        getAllCourseStudents: function studentGetAllCourseStudents (cb) {


        }
    };
  });
