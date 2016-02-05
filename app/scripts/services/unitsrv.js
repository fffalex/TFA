'use strict';

/**
 * @ngdoc service
 * @name globiandaApp.offersrv
 * @description
 * # offersrv
 * Factory in the globiandaApp.
 */
angular.module('tfaApp')
  .factory('unitsrv', function () {
    return {
        createUnit: function unitCreateUnit(unitData,blockData,cb) {
            var unit = new (Parse.Object.extend('Unit'));
            unit.set('title', unitData.title);
            unit.set('number', unitData.number);
            unit.set('description', unitData.description);
            unit.set('status', '1');
            unit.save(null, {
              success: function (un) {
                if (cb && cb.success) {
                    var block = new (Parse.Object.extend('ContentBlock'));
                    block.set('id', blockData.id);
                    //var unitArray = { "__type": "Pointer", "className": "Unit", "objectId": un.id };
                    block.add('units',createPointer('Unit', un.id));
                    block.save({
                        success: function (r) {
                            console.log('ok!');
                            cb.success(un);
                        },
                        error: function (r, error) {
                            console.log(error);
                            cb.error(un, error);
                        }
                    });
                }
              },
              error: function (of, error) {
                if (cb && cb.error) {
                  cb.error(of.toFullJSON(),error);
                }
              }
            });
        },

        createBlock: function unitCreateBlock(blockData,teacher, cb) {
            var block = new (Parse.Object.extend('ContentBlock'));
            block.set('name', blockData.name);
            block.set('teacher', teacher);
            block.set('description', blockData.description);
            block.set('status', '1');
            block.save(null, {
              success: function (or) {
                if (cb && cb.success) {
                  cb.success(or);
                }
              },
              error: function (of, error) {
                if (cb && cb.error) {
                  cb.error(of.toFullJSON(),error);
                }
              }
            });
        },

        createTopic: function unitCreateTopic (topicData, unitData ,cb) {
            var topic = new (Parse.Object.extend('Topic'));
            topic.set('title', topicData.title);
            topic.set('content', topicData.content);
            topic.set('status', '1');
            topic.set('number', topicData.number);
            //topic.set('link', topicData.link);
            //CHECKK RELATION WITH UNIT
            //topic.set('contentOnUnit', topicData.Unit ); DEprecated
            topic.save(null, {
                success: function (top) {
                    if (cb && cb.success) {
                        var unit = new (Parse.Object.extend('Unit'));
                        unit.set('id', unitData.id);
                        //var topicArray = { "__type": "Pointer", "className": "Topic", "objectId": top.id };
                        unit.add('topics', createPointer('Topic', top.id));
                        unit.save({
                            success: function (r) {
                                console.log('ok!');
                                cb.success(top);
                            },
                            error: function (r, error) {
                                console.log(error);
                                cb.error(top, error);
                            }
                        });
                    }
                },
              error: function (of, error) {
                if (cb && cb.error) {
                  cb.error(of.toFullJSON(),error);
                }
              }
            });
        },


      modifyTopic: function unitModifyTopic(topicData, cb) {
          var topic = new (Parse.Object.extend('Topic'))();
          topic.set('id', topicData.id);
          topic.set('title', topicData.title);
          topic.set('content', topicData.content);
          topic.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or.toFullJSON());
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or.toFullJSON(), error);
                  }
              }
          });
      },

      modifyUnit: function unitModifyTopic(unitData, cb) {
          var unit = new (Parse.Object.extend('Unit'))();
          unit.set('id', unitData.id);
          unit.set('title', unitData.title);
          unit.set('description', unitData.description);
          unit.set('number', unitData.number);
          unit.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or);
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or, error);
                  }
              }
          });
      },

      modifyBlock: function unitModifyBlock(blockData, cb) {
          var block = new (Parse.Object.extend('ContentBlock'))();
          block.set('id', blockData.id);
          block.set('description', blockData.description);
          block.set('name', blockData.name);
          block.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or);
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or, error);
                  }
              }
          });
      },

      //Get all Data relation abour units and topics
      getAllTeacherContentBlocks: function unitGeAllTeacherContentBlocks(teacher,cb){
          var query = new Parse.Query('ContentBlock');
          query.equalTo('teacher', teacher);
          query.include('units');
          query.equalTo('status', '1');
          query.include('units.topics');
          query.include('units.topics.seenBy');
          query.find({
              success: function (contentBlocks) {
                  if (cb && cb.success) {
                      cb.success(contentBlocks);
                  }
              },
              error: function (error) {
                  if (cb && cb.error) {
                      cb.error(error);
                  }
              }
          });
      },

      //Get Specific ContentBlock alla Data
      getContentBlock: function unitGetContentBlock(contentData, cb){
          var query = new Parse.Query('ContentBlock');
          query.equalTo('objectId', contentData.id);
          query.include('units');
          query.include('units.topics');
          //query.include('units.topics.seenBy');
          query.first({
              success: function (contentBlock) {
                  if (cb && cb.success) {
                      cb.success(contentBlock);
                  }
              },
              error: function (error) {
                  if (cb && cb.error) {
                      cb.error(error);
                  }
              }
          });
      },

      deleteTopic: function unitDeleteTopic(topicData, cb){
        var topic = new (Parse.Object.extend('Topic'))();
          topic.set('id', topicData.id);
          topic.set('status', '0');
          topic.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or.toFullJSON());
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or.toFullJSON(), error);
                  }
              }
          });
      },

      deleteBlock: function unitDeleteTopic(blockData, cb){
        var block = new (Parse.Object.extend('ContentBlock'))();
          block.set('id', blockData.id);
          block.set('status', '0');
          block.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or.toFullJSON());
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or.toFullJSON(), error);
                  }
              }
          });
      },

      deleteUnit: function unitDeleteTopic(unitData, cb) {
          var unit = new (Parse.Object.extend('Unit'))();
          unit.set('id', unitData.id);
          unit.set('status', '0');
          unit.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or.toFullJSON());
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or.toFullJSON(), error);
                  }
              }
          });
      },

      //Add a new question to the Unit (for unit evaluations)
      addQuestion: function unitAddQuestion(unitData, questionData, cb) {
          var unit = new (Parse.Object.extend('Unit'))();
          unit.set('id', unitData.id);
          var question = new (Parse.Object.extend('Question'))();
          question.set('unit', unit);
          question.set('status', '1');
          if( questionData.question == "" || questionData.question == undefined
              || questionData.trueAnswer== "" || questionData.trueAnswer == undefined
              || questionData.falseAnswer1 == "" || questionData.falseAnswer1 == undefined){
                cb.error('La pregunta, la respuesta verdadera y la primer respuesta incorrecta no pueden ser vacías');
          } else {
            question.set('question', questionData.question);
            question.set('trueAnswer', questionData.trueAnswer);
            question.set('falseAnswer1', questionData.falseAnswer1);
            if(questionData.falseAnswer2 != "" && questionData.falseAnswer2 != undefined)
              question.set('falseAnswer2', questionData.falseAnswer2);
            if(questionData.falseAnswer3 != "" && questionData.falseAnswer3 != undefined)
              question.set('falseAnswer3', questionData.falseAnswer3);
            question.save(null, {
                success: function (or) {
                    if (cb && cb.success) {
                        cb.success(or.toFullJSON());
                    }
                },
                error: function (or, error) {
                    if (cb && cb.error) {
                        cb.error(error);
                    }
                }
            });
          }
      },

      //Edit a new question to the Unit (for unit evaluations)
      editQuestion: function unitAddQuestion(questionData, cb) {
          var question = new (Parse.Object.extend('Question'))();
          question.set('objectId', questionData.objectId);
          if( questionData.question == "" || questionData.question == undefined
              || questionData.trueAnswer== "" || questionData.trueAnswer == undefined
              || questionData.falseAnswer1 == "" || questionData.falseAnswer1 == undefined){
                cb.error('La pregunta, la respuesta verdadera y la primer respuesta incorrecta no pueden ser vacías');
          } else {
            question.set('question', questionData.question);
            question.set('trueAnswer', questionData.trueAnswer);
            question.set('falseAnswer1', questionData.falseAnswer1);
            if(questionData.falseAnswer2 != "" && questionData.falseAnswer2 != undefined)
              question.set('falseAnswer2', questionData.falseAnswer2);
            if(questionData.falseAnswer3 != "" && questionData.falseAnswer3 != undefined)
              question.set('falseAnswer3', questionData.falseAnswer3);
            question.save(null, {
                success: function (or) {
                    if (cb && cb.success) {
                        cb.success(or.toFullJSON());
                    }
                },
                error: function (or, error) {
                    if (cb && cb.error) {
                        cb.error(error);
                    }
                }
            });
          }
      },

      removeQuestion: function unitRemoveQuestion(questionData, cb) {
          var question = new (Parse.Object.extend('Question'))();
          question.set('id', questionData.id);
          question.set('status', '0');
          question.save(null, {
              success: function (or) {
                  if (cb && cb.success) {
                      cb.success(or.toFullJSON());
                  }
              },
              error: function (or, error) {
                  if (cb && cb.error) {
                      cb.error(or.toFullJSON(), error);
                  }
              }
          });
      },

      markTopicSeenBy: function unitMarkTopicSeenBy(topicData, studentData, cb) {
        var topic = new (Parse.Object.extend('Topic'));
        topic.set('id', topicData.id);
        //var studentArray = { "__type": "Pointer", "className": "User", "objectId": studentData.id };
        topic.add('seenBy', createPointer('User', studentData.id));
        topic.save({
            success: function (r) {
                console.log('ok!');
                cb.success(r);
            },
            error: function (r, error) {
                console.log(error);
                cb.error(top, error);
            }
        });
      },

      getAllQuestions: function unitGetAllQuestion(unitData,cb){
        // var unit = new (Parse.Object.extend('Unit'))();
        // unit.set('id', unitData.id);
        var query = new Parse.Query('Question');
        query.equalTo('unit', unitData);
        query.equalTo('status', '1');
        query.find({
            success: function (questions){
                if (cb && cb.success) {
                    cb.success(questions);
                }
            },
            error: function (error) {
                if (cb && cb.error) {
                    cb.error(error);
                }
            }
        });
      },

      //Add randomize to the question's array
      getAllRandomQuestions: function unitGetAllQuestion(unitData,cb){
        var unit = new (Parse.Object.extend('Unit'))();
        unit.set('id', unitData.id);
        var query = new Parse.Query('Question');
        query.equalTo('unit', unit);
        query.equalTo('status', '1');
        query.find({
            success: function (questions) {
              for (var i = 0; i < questions.length; i++) {
                questions[i].answers = [];
                questions[i].answers.push(questions[i].get('trueAnswer'));
                questions[i].answers.push(questions[i].get('falseAnswer1'));
                if(questions[i].get('falseAnswer2') != "" && questions[i].get('falseAnswer2') != undefined)
                {
                  questions[i].answers.push(questions[i].get('falseAnswer2'));
                }
                if(questions[i].get('falseAnswer3') != "" && questions[i].get('falseAnswer3') != undefined)
                {
                  questions[i].answers.push(questions[i].get('falseAnswer3'));
                }
                questions[i].answers = shuffle(questions[i].answers);
                questions[i].choose = "";

              }
              if (cb && cb.success) {
                  cb.success(questions);
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
