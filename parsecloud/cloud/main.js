
// Use Parse.Cloud.define to define as many cloud functions as you want.
//Included some helpers =)
var helpers = require('cloud/helpers.js');
 
// OBJECT USER
 
// beforeSave: USER -- Data Validation
Parse.Cloud.beforeSave(Parse.User, function (request, response) {
 
  //regex definition
  var checkPhoneNumber = /^(\+)?\d{10,20}$/;///^\d{3}\d{3}\d{4}|\d{10}/;
  var checkLength = /^([a-zA-Z0-9_-]){4,16}$/;
  var checkName = /^[a-zA-Z0-9_-]+$/;
  var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
 
  //
  var user = request.object;
  var isNew = !user.id;
   
  //add trimming
  var phoneNumber = user.get('phoneNumber');
  if(phoneNumber)phoneNumber=phoneNumber.trim();
 
  var username = user.get('username');
  if(username)username=username.trim();
 
  var name = user.get('name');
  if(name)name=name.trim();
 
  var lastName = user.get('lastName');
  if(lastName)lastName=lastName.trim();
 
  var email = user.get('email');
  if(email)email=email.trim();
 
  var specialty = user.get('specialty');
  if(specialty)specialty=specialty.trim();
 
  var address = user.get('address');
  if(address)address=address.trim();

  if ((isNew && !phoneNumber) || (phoneNumber && !checkPhoneNumber.test(phoneNumber))) {
    response.error('Formato de número de teléfono incorrecto, debe tener al menos 10 dígitos');
  }
  else if ((isNew && !username) || (username && (username.length < 4 || username.length > 16))) {
    response.error('El nombre de usuario debe tener entre 4 y 16 caracteres');
  }
  else if ((isNew && !username) || (username && !checkName.test(username))) {
    response.error('El nombre de usuario no debe contener caracteres especiales ni espacios en blanco');
  } 
  else if ((isNew && !name) || (name && (name.length < 2 || name.length > 32))) {
    response.error('Debe especificar un nombre');
  }
  else if ((isNew && !lastName) || (lastName && (lastName.length < 2 || lastName.length > 32))) {
    response.error('Debe especificar un apellido');
  }
  else if ((isNew && !email) || (email && !emailFormat.test(email))) {
    response.error('Formato de email incorrecto');
  } 
  else if (specialty || address) {
    if ((isNew && !specialty) || (specialty && !specialty.length)) {
      response.error('debe especificar una dirección');
    }
    else if ((isNew && !address) || (address && !address.length)) {
      response.error('debe especificar una dirección');
    }
    else{
      response.success();
    }
  }else{
    response.success();
  }
 
  //crear thumbnails...
  /*helpers.createThumbnail(user.get('avatar'),username + '_thumb',96).
  then(function (cropped) {
    user.set('thumbnail', cropped);
  }).then(function (result) {
    response.success();
  }, function (error) {
    response.error(error)
  });*/
 
});
 
// afterSave: USER -- role setting
Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.object;
  if (!user.existed()) {
    Parse.Cloud.useMasterKey();
    //only assings role if it isn't a regular user(client/buyer)
    query = new Parse.Query(Parse.Role);
    if (user.get('assignedTo')) {
      query.equalTo("name", "student");
    } else {
      query.equalTo("name", "teacher");
    }
    query.first ( {
      success: function(object) {
        object.relation("users").add(request.user);
        object.save(null,{
          success: function (us) {
            //response.success();
          },
          error: function (us, error) {
            //response.error('Ocurrió un error en la asignación de roles: ' + error.message)
          }
        });
      },
      error: function(error) {
        throw "Got an error " + error.code + " : " + error.message;
        //response.error('Ocurrió un error en la asignación de roles: ' + error.message);
      }
    });
  } else {
    //response.success();
  }
});