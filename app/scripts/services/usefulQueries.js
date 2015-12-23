angular.module('tfaApp')
  .controller('USEFULQUERIESCTRL', function ($scope, unitsrv, coursesrv) {

    //Get all topics that the user already has read, and store its in a seenTopics array
    $scope.getAllTopicsSeenByStudent = function (studentData){
      $scope.seenTopics = [];
      var content = studentData.get('assignedTo').get('contentBlock');
      unitsrv.getContentBlock(content, {
        success: function(fullContent){
          var topics = fullContent.get('units').get('topics');
          for (var i = 0; i < topics.length;  i++) {
            var seen = topics[i].get('seenBy');
            for (var j = 0; j < seen.length; j++) {
                if(seen[j].id == studentData.id){
                  $scope.seenTopics.push(topics[i]);
                }
            }
          }
        },
        error: function(error){
          console.log(error)
        };
      });
    };

    $scope.canDoExam = function(studentData, unitData){
      examsrv.getAllStudentExams(studentData,{
        succes:function(exams){
          var check = false;
          for (var i = 0; i < exams.length; i++) {
            if (exams[i].get('unit').id === unitData.id){
              console.log('ya rindio');
              check = true;
            }
          }
          if(check){
            //SHOW EERRORS
          }else{
            //LET THE CHILD DO THE EXAM
          }
        },
        error: function(){

        }
      });
    }
});
