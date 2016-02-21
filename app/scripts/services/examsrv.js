'use strict';

angular.module('tfaApp')
  .factory('examsrv', function () {
    return {
      create: function examCreate(unitData,answersData,grade,incorrects,corrects,cb) {
          var exam = new (Parse.Object.extend('Exam'));
          //Get all courseData and UserData for the currentUser:::
          exam.set("student", Parse.User.current());
          exam.set("unit", unitData);
          exam.set("grade", grade);
          exam.set("incorrectsAnswers", incorrects);
          exam.set("correctsAnswers", corrects);
          exam.save(null, {
            success: function (exam) {
              var arrayAnswer = [];
              for(var i = 0; i < answersData.length; i++){
                var answer = new (Parse.Object.extend('Answer'));
                answer.set('answer', answersData[i].choose);
                answer.set('question', answersData[i]);
                answer.set('exam',exam);
                if(answersData[i].isCorrect){
                  answer.set('isCorrect', true);
                } else {
                  answer.set('isCorrect', false);
                }
                arrayAnswer.push(answer);
              }
              Parse.Object.saveAll(arrayAnswer, {
                  success: function(objs) {
                    if(cb && cb.success){
                      cb.success(objs);
                    }
                    // objects have been saved...
                  },
                  error: function(error) {
                      // an error occurred...
                      if (cb && cb.error) {
                        cb.error(error);
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

    //Get all Exams BIGGER query
    getAllExams: function examGetAllExams(cb){
      var query = new Parse.Query('Exam');
      query.include('unit');
      query.include('student');
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
  })
