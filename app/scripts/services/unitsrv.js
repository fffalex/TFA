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
                      unit.set('id', unitData.objectId);
                      var relation = unit.relation("topics");
                      relation.add(topic);
                      unit.save({
                          success: function (r) {
                              console.log('ok!');
                              cb.success(top.toFullJSON());
                          },
                          error: function (r, error) {
                              console.log(error);
                              cb.error(top.toFullJSON(), error);
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

      //obtiene todas las unidades de un curso
      getAllUnits: function unitGetAllUnits(cours,cb){
        var course = new (Parse.Object.extend('Course'));
        if (cours.objectId) {
            course.set('id', cours.objectId);
        }
        if (cours.id) {
            course.set('id', cours.id);
        }
        var relation = course.relation('units');
        var newUnits = [];
        
        var query = relation.query();
        query.ascending('number');
        query.find({
            success: function (units) {
              newUnits = [];
              var promises = [];
              
              units.forEach(function(res){
                promises.push(res.relation('topics').query().ascending('number').find({
                  success: function(topics){
                    res = res.toFullJSON();
                    res.topicsJSON = topics.toFullJSON();
                    newUnits.push(res);                  
                    
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
                  cb.success(newUnits);
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

        //obtiene todas las unidades de un curso
      getAllUnitsTopicSeenBy: function unitGetAllUnits(cours, cb) {
          var course = new (Parse.Object.extend('Course'));
          if (cours.objectId) {
              course.set('id', cours.objectId);
          }
          if (cours.id) {
              course.set('id', cours.id);
          }
          var relation = course.relation('units');
          //Declaration for the 1st promises Units>>Topics
          var newUnits = [];

          var query = relation.query();
          query.ascending('number');
          query.find({
              success: function (units) {
                  newUnits = [];
                  var promises = [];
                  var masterPromises = [];

                  //Declaration for the 2nd promises Topics>>Students
                  var topicToSet = [];

                  //For each unit fills it with its topics
                  units.forEach(function (res) {
                      promises.push(res.relation('topics').query().find({
                          success: function (topics) {
                              topicToSet = [];
                              var promises2 = [];

                              //For each topic fills it with the students that already seen it
                              topics.forEach(function (res2) {
                                  promises2.push(res2.relation('seenBy').query().find({
                                      success: function (students) {
                                          res2 = res2.toFullJSON();
                                          res2.seenByJSON = students.toFullJSON();
                                          topicToSet.push(res2);
                                      },
                                      error: function (s2res, error) {
                                          console.log(error);
                                      }
                                  }));
                              });



                              Parse.Promise.when(promises2).then(function () {
                                  res = res.toFullJSON();
                                  res.topicsJSON = topicToSet;
                                  newUnits.push(res);
                                  topicToSet = [];
                                  masterPromises.push(res.relation('topics').query().find({
                                      success: function (topics) {

                                      },
                                      error: function (s2res, error) {

                                      }
                                  }));

                              });
                          },
                          error: function (sres, error) {
                              console.log(error);
                          }
                      }));
                  });

                  Parse.Promise.when(promises, masterPromise).then(function () {
                      //this two are assigned toggether
                      //notify parent
                      if (cb && cb.success) {
                          cb.success(newUnits);
                          console.log(newUnits);
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

      setAllTopicAndSeenByAllStudent: function(cours,cb){
          var course = new (Parse.Object.extend('Course'));
          if (cours.objectId) {
              course.set('id', cours.objectId);
          }
          if (cours.id) {
              course.set('id', cours.id);
          }
          var relation = course.relation('units');
          //Declaration for the 1st promises Units>>Topics
          var newUnits = [];
        
          var query = relation.query();
          query.ascending('number');
          query.find({
              success: function (units) {
                  newUnits = [];
                  var promises = [];

                  var masterPromise = new Parse.Promise();
                  var totalUnits = units.length;
                  var currentTotalUnits = 1;
                  
                  
                  //Declaration for the 2nd promises Topics>>Students
                  var topicToSet = [];
                    
                  //For each unit fills it with its topics
                  units.forEach(function (res) {
                      promises.push(res.relation('topics').query().find({
                          success: function(topics){
                              topicToSet = [];
                              var promises2 = [];

                              //For each topic fills it with the students that already seen it
                              topics.forEach(function(res2){
                                  promises2.push(res2.relation('seenBy').query().find({
                                      success: function(students){
                                          res2 = res2.toFullJSON();
                                          res2.seenByJSON = students.toFullJSON();
                                          topicToSet.push(res2);
                                      },
                                      error: function(s2res, error){
                                          console.log(error);
                                      }
                                  }));
                              });

                              

                              Parse.Promise.when(promises2).then(function () {
                                  res = res.toFullJSON();
                                  res.topicsJSON = topicToSet;
                                  newUnits.push(res);
                                  topicToSet = [];
                                  if (currentTotalUnits == totalUnits) {
                                      masterPromise.resolve(cb);
                                  } else {
                                      currentTotalUnits = currentTotalUnits + 1;
                                  }

                              });
                          },
                          error: function(sres,error){
                              console.log(error);
                          }
                      }));
                  });
                  
                  Parse.Promise.when(promises,masterPromise).then(function(){
                      //this two are assigned toggether
                      //notify parent
                      if (cb && cb.success) {
                          cb.success(newUnits);
                          console.log(newUnits);
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


      

      
      getAllTopics: function unitGetAllTopics(uni,cb){
        var unit = new (Parse.Object.extend('Unit'));
        unit.set('id',uni.id);
        var relation = unit.relation('topics');        
        var query = relation.query();
        query.ascending('number');
        query.equalTo('status', '1');
        query.find({
            success: function (topics) {
              if (cb && cb.success) {
                cb.success(topics.toFullJSON());
              }
            },
            error: function (error) {
              if (cb && cb.error) {
                cb.error(error);
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
      
      deleteTopic: function unitDeleteTopic(topicData, cb){
        var topic = new (Parse.Object.extend('Topic'))();
          topic.set('id', topicData.objectId);
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

  
  
  