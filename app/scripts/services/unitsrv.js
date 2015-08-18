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
            var unit = new (Parse.Object.extend('Course'));
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
        
        createTopic: function unitCreateTopic (topicData,cb) {
            var topic = new (Parse.Object.extend('Course'));
            topic.set('title', topicData.title);
            topic.set('content', topicData.content);
            topic.set('link', topicData.link);
            //CHECKK RELATION WITH UNIT
            topic.set('contentOnUnit', topicData.Unit );
            topic.save(null, {
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

      getAllUnits: function getAllUnits(cours,cb){
        var course = new (Parse.Object.extend('Course'));
        course.set('id',cours.objectId);
        
        var relation = course.relation("units");
        var query = relation.query();
        query.find({
            success: function (units) {
              if (cb && cb.success) {
                cb.success(units.toFullJSON());
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