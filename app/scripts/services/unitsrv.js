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
        createUnit: function unitCreateUnit(unitData,cb) {
            var unit = new (Parse.Object.extend('Unit'));
            unit.set('title', unitData.title);
            unit.set('number', unitData.number);
            unit.set('description', unitData.description);
            unit.save(null, {
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

              //success: function (top) {
              //    if (cb && cb.success) {
              //        var unit = new (Parse.Object.extend('Unit'));
              //        unit.set('id', unitData.objectId);
              //        var relation = unit.relation("topics");
              //        relation.add(topic);
              //        unit.save({
              //            success: function (r) {
              //                console.log('ok!');
              //                cb.success(top.toFullJSON());
              //            },
              //            error: function (r, error) {
              //                console.log(error);
              //                cb.error(top.toFullJSON(), error);
              //            }
              //        });
              //  }
              //},
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

      getAllTeacherContentBlocks: function unitGeAllContentBlocks(teacher,cb){
          var query = new Parse.Query('ContentBlock');
          query.equalTo('teacher', teacher);
          query.include('contentBlock.units');
          query.include('contentBlock.units.topics');
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
      }
    };
  });

  
  
  