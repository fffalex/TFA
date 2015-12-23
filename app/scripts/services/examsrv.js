'use strict';

angular.module('tfaApp')
  .factory('examsrv', function () {
    return {
      create: function examCreate(examData,cb) {
          var exam = new (Parse.Object.extend('Exam'));
          exam.set('year', examData.year);
          exam.set('division', examData.division);
          exam.set('turn', examData.turn);
          exam.set('schoolYear', examData.schoolYear);
          exam.save(null, {
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

    //Get all student Exams
    getAllStudentExams: function examGetAllStudentExams(studentData, cb){
      var query = new Parse.Query('Exam');
      query.equalTo('student', studentData.id);
      query.include('unit');
      query.include('incorrects');
      query.include('corrects');
      query.find({
          success: function (exams) {
              if (cb && cb.success) {
                  cb.success(exams);
              }
          },
          error: function (error) {
              //Get all student Exams
              if (cb && cb.error) {
                  cb.error(error);
              }
          }
      });
    },

    



    }
  }):
