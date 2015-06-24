var Image = require('parse-image');

exports.log = function(){
  var ret = '';
  for (var i = 0; i < arguments.length; i++) {
    if(typeof(arguments[i]) == 'object'){
      ret+=' ' + JSON.stringify(arguments[i]);
    }else{
      ret+=' ' + arguments[i];
    }
  }
  if(ret){
    console.log('----------------------- LOG START ------------------------');
    console.log(ret);
    console.log('------------------------ LOG END -------------------------');
  }
}

exports.sendEmail = function(toAddress,subject, htmlstring)
{
  var Mandrill = require('mandrill');
  Mandrill.initialize('vHa8A1DV1EfoY7INdZATbQ');
  Mandrill.sendEmail({   
    "message": {
      "html" : htmlstring,
      "text" : "Reserved for spam",
      "subject": subject,
      "from_email": "alexdedek@hotmail.com",
      "from_name": "Alex",
      "to": toAddress,
    },
    async: true
  },{
    success: function() {
      //response.success("Email sent!");
    },
    error: function(error) {
      console.error('Error Sending Emails! ' + JSON.stringify(error));
      //response.error("Uh oh, something went wrong");
    }
  });
};

//thumbnail treatment
exports.resizePicture = function(picture, filename, width, height, force)
{
  var promise = new Parse.Promise();
  Parse.Cloud.httpRequest({
    url: picture
  }, function (error) {
    promise.reject(error);
  }).then(function (response) {
    var image = new Image();
    return image.setData(response.buffer);
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // transformar en cuadrado tomando el menor valor entre altura y ancho
    if(force || image.width() > width || image.height() > height){
      var ratio = image.width()/image.height();
      if(ratio < 1) {
        width = height * ratio;
      }else {
        height = width / ratio;
      }
    }else{
      // JPEG es mas liviano
      return image.setFormat('JPEG');
    }
    // resize
    return image.scale({
      width: width,
      height: height
    }).then(function (image) {
      // JPEG es mas liviano
      return image.setFormat('JPEG');
    }, function (error) {
      promise.reject(error);
    });
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // Poner la data en un buffer
    return image.data();
  }, function (error) {
    promise.reject(error);
  }).then(function (buffer) {
    // guardar en un file
    filename = filename.substr(0, filename.lastIndexOf('.'));
    var base64 = buffer.toString('base64');
    var resized = new Parse.File(filename + '.jpg', { base64: base64 });
    //return 
    return resized.save();
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    promise.resolve(image);
  }, function (error) {
    promise.reject(error);
  });
  return promise;
};

//thumbnail treatment
exports.createThumbnail = function(picture, filename, cropsize)
{
  var promise = new Parse.Promise();
  Parse.Cloud.httpRequest({
    url: picture
  }, function (error) {
    promise.reject(error);
  }).then(function (response) {
    var image = new Image();
    return image.setData(response.buffer);
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // transformar en cuadrado tomando el menor valor entre altura y ancho
    var size = Math.min(image.width(), image.height());
    return image.crop({
      left: (image.width() - size) / 2,
      top: (image.height() - size) / 2,
      width: size,
      height: size
    });
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // resize
    return image.scale({
      width: cropsize,
      height: cropsize
    });
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // JPEG es mas liviano
    return image.setFormat('JPEG');
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    // Poner la data en un buffer
    return image.data();
  }, function (error) {
    promise.reject(error);
  }).then(function (buffer) {
    // guardar en un file
    filename = filename.substr(0, filename.lastIndexOf('.'));
    var base64 = buffer.toString('base64');
    var cropped = new Parse.File(filename + '.jpg', { base64: base64 });
    return cropped.save();
  }, function (error) {
    promise.reject(error);
  }).then(function (image) {
    promise.resolve(image);
  }, function (error) {
    promise.reject(error);
  });
  return promise;
};
