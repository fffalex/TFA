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
                    var unitArray = { "__type": "Pointer", "className": "Unit", "objectId": un.id };
                    block.add('units', topicArray);
                    block.save({
                        success: function (r) {
                            console.log('ok!');
                            cb.success(un);
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
                        var topicArray = { "__type": "Pointer", "className": "Topic", "objectId": top.id };
                        unit.add('topics', topicArray);
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
          topic.set('id', topicData.objectId);
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
          unit.set('id', unitData.objectId);
          unit.set('title', unitData.title);
          unit.set('description', unitData.content);
          unit.set('number', unitData.number);
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

      getAllTeacherContentBlocks: function unitGeAllContentBlocks(teacher,cb){
          var query = new Parse.Query('ContentBlock');
          query.equalTo('teacher', teacher);
          query.include('units');
          query.include('units.topics');
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
      
      deleteTopic: function unitDeleteTopic(topicData, unitData, cb){
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

      deleteUnit: function unitDeleteTopic(unitData, blockData, cb) {
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
      }
    };
  });

  
  
  