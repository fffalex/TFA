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
            course.set('year', courseData.year);
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

        setContentBlock: function courseSetContentBlock(courseData, contentBlock, cb) {
          var course = new (Parse.Object.extend('Course'));
          course.set('id', courseData.id);
          course.set('contentBlock', contentBlock);
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



      //Obtiene todos los cursos disponibles!
      // getAllCourses: function getAllCourses(cb){
      //     var query = new Parse.Query('Course');
      //     query.include('arrayUnits');
      //     query.find({
      //       success: function (courses) {
      //         if (cb && cb.success) {
      //           cb.success(courses.toFullJSON());
      //         }
      //       },
      //       error: function (error) {
      //         if (cb && cb.error) {
      //           cb.error(error);
      //         }
      //       }
      //     });
      //   },

      //Obtiene los cursos asignados a un Teacher
      getTeacherCourses: function getTeacherCourse(teacher,cb){
        var query = new Parse.Query('Course');
        query.include('contentBlock');
        //query.equalTo('contentBlock.teacher', teacher);
        query.include('contentBlock.units');
        query.include('contentBlock.units.topics');
        query.find({
            success: function (courses) {
                var teacherCourses = [];
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].get('contentBlock').get('teacher').get('id') === teacher.get('id')) {
                        teacherCourses.push(courses[i]);
                    }
                }
                if (cb && cb.success) {
                cb.success(teacherCourses);
              }
            },
            error: function (error) {
              if (cb && cb.error) {
                cb.error(error);
              }
            }
          });
      },

      //Use this
      getAllStudentsInCourse: function courseGetAllStudentsInCourse(teacher,cb){
        getTeacherCourses(teacher, {
          success: function (courses) {
            newCourses = [];
            var promises = [];
            courses.forEach(function(res){
              var query = new Parse.Query('User');
              promises.push(query.equalTo('assignedTo', res.objectId).descending('lastName')
              .include('assignedTo').include('assignedTo.contentBlock').find({
                success: function(students){
                  res = res.toFullJSON();
                  res.students = students;
                  newCourses.push(res);
                },
                error: function(sres,error){
                  console.log(error);
                }
              }));
            });

            Parse.Promise.when(promises).done(function(){
              //this two are assigned toggether
              //notify parent
              if (cb && cb.success) {
                cb.success(newCourses);
              }
            });

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


      getStudentsCourse: function getTeacherCourse(teacher,cb){
        var query = new Parse.Query('Course');
        var newCourses = [];
        query.equalTo('teacher',teacher);
        query.find({
            success: function (courses) {
              newCourses = [];
              var promises = [];
              courses.forEach(function(res){
                var query = new Parse.Query('User');
                promises.push(query.equalTo('assignedTo', res.objectId).find({
                  success: function(students){
                    res = res.toFullJSON();
                    res.studentsJSON = students.toFullJSON();
                    newCourses.push(res);
                  },
                  error: function(sres,error){
                    console.log(error);
                  }
                }));
              });

              Parse.Promise.when(promises).done(function(){
                //this two are assigned toggether
                //notify parent
                if (cb && cb.success) {
                  cb.success(newCourses);
                }
              });

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
        }
      };
  });
