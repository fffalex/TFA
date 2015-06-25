'use strict';

/**
 * @ngdoc service
 * @name globiandaApp.offersrv
 * @description
 * # offersrv
 * Factory in the globiandaApp.
 */
angular.module('tfaApp')
  .factory('coursesrv', function () {

    return {
        
        create: function courseCreate(courseData,cb) {
            var course = new (Parse.Object.extend('Course'));
            course.set('grade', courseData.grade );
            course.set('division', courseData.division);
            course.set('turn', courseData.turn);
            course.set('schoolYear', courseData.schoolYear);
            course.save(null, {
              success: function (of) {
                if (cb && cb.success) {
                  cb.success(of.toFullJSON());
                }
              },
              error: function (of, error) {
                if (cb && cb.error) {
                  cb.error(of.toFullJSON(),error);
                }
              }
            });
      },

      getAllCourses: function getAllCourses(cb){
        var query = new Parse.Query('Course');
          query.find({
            success: function (courses) {
              if (cb && cb.success) {
                cb.success(courses.toFullJSON());
              }
            },
            error: function (error) {
              if (cb && cb.error) {
                cb.error(error);
              }
            }
          });
        },
    
      
      };
  });