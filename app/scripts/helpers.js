'use strict';
/**
 * @ngdoc helpers
 * @name tfaApp.helpers
 * @description
 * Helpers for the tfaApp.
 */

//Parse error codes...
var errorCodes = [
  {Code: 1, Message: 'Error interno del servidor. No hay información disponible.'},
  {Code: 100, Message: 'Fallo en la conexión a los servidores, inténtalo nuevamente.'},
  {Code: 101, Message: 'El usuario no existe o ingresó una contraseña incorrecta.'},
  {Code: 102, Message: 'Ha intentado encontrar valores que coincidan con un tipo de datos que no admite la coincidencia exacta de base de datos, tal como un arreglo o un diccionario.'},
  {Code: 103, Message: 'Nombre de clase faltante o inválida. Los nombres de clases son sensibles a mayúsculas. Deben comenzar con una letra y tener el formato a-zA-Z0-9_.'},
  {Code: 104, Message: 'Falta el id del objeto.'},
  {Code: 105, Message: 'Nombre de clave inválido. Las claves son sensibles a mayúsculas. Deben comenzar con una letra y tener el formato a-zA-Z0-9_.'},
  {Code: 106, Message: 'Puntero con formato incorrecto. Los punteros deben contener un nombre de clase y un identificador de objeto.'},
  {Code: 107, Message: 'Objeto JSON con formato incorrecto. Se esperaba un diccionario JSON.'},
  {Code: 108, Message: 'Intento de acceder a una función que sólo está disponible internamente.'},
  {Code: 111, Message: 'Campo establecido a un tipo incorrecto.'},
  {Code: 112, Message: 'Nombre del canal inválido. Un nombre de canal es una cadena vacia (canal de difusión-broadcast) o bien, contiene solamente caracteres con el formato a-zA-Z0-9_ y comienza con una letra.'},
  {Code: 114, Message: 'Token de dispositivo inválido.'},
  {Code: 115, Message: 'Push está mal configurado. Vea los detalles para averiguar como configurarlo.'},
  {Code: 116, Message: 'EL objeto es demasiado grande.'},
  {Code: 119, Message: 'La operación no está permitida para clientes.'},
  {Code: 120, Message: 'Los resultados no fueron encontrados en el caché.'},
  {Code: 121, Message: 'Las claves no pueden incluir "$" o ".".'},
  {Code: 122, Message: 'Nombre de archivo inválido. El nombre del archivo sólo puede contener caracteres del tipo a-zA-Z0-9_. y tener entre 1 y 120 caracteres.'},
  {Code: 123, Message: 'ACL inválido. Se ha guardado un ACL con un formato inválido. Esto no debería ocurrir si utiliza PFACL.'},
  {Code: 124, Message: 'El tiempo de respuesta de la solicitud ha caducado en el servidor. Típicamente esto indica que la solicitud es muy larga.'},
  {Code: 125, Message: 'La dirección de email es inválida.'},
  {Code: 126, Message: 'Falta el tipo de contenido.'},
  {Code: 127, Message: 'Falta la longitud del contenido.'},
  {Code: 128, Message: 'Longitud del contenido inválida.'},
  {Code: 129, Message: 'El archivo es demasiado grande.'},
  {Code: 130, Message: 'Error al guardar un archivo.'},
  {Code: 137, Message: 'Un campo único contiene un valor que ya esta siendo utilizado.'},
  {Code: 139, Message: 'Nombre de rol inválido.'},
  {Code: 140, Message: 'No se pudo realizar la operación, intente nuevamente (error de cuota).'},
  {Code: 141, Message: 'El Código en la Nube contiene un error.'},
  {Code: 142, Message: 'Ha fallado la verificación del Código en la Nube.'},
  {Code: 143, Message: 'Recibo de compra del producto faltante.'},
  {Code: 144, Message: 'Recibo de compra del producto inválido.'},
  {Code: 145, Message: 'El pago está deshabilitado en este dispositivo.'},
  {Code: 146, Message: 'El identificador del producto es inválido.'},
  {Code: 147, Message: 'No se encuentra el producto en la App Store.'},
  {Code: 148, Message: 'Respuesta del servidor de Apple inválida.'},
  {Code: 149, Message: 'Fallo en la descarga del producto debido a un error de sistema.'},
  {Code: 150, Message: 'Fallo al convertir datos a una imagen.'},
  {Code: 151, Message: 'Archivo no guardado.'},
  {Code: 153, Message: 'Fallo al borrar el archivo.'},
  {Code: 155, Message: 'La aplicación ha excedido su límite de solicitudes, intente nuevamente en unos minutos.'},
  {Code: 160, Message: 'Nombre de evento inválido.'},
  {Code: 200, Message: 'Nombre de usuario faltante o vacío.'},
  {Code: 201, Message: 'Password faltante o vacío.'},
  {Code: 202, Message: 'EL nombre de usuario ya está siendo utilizado por otro usuario.'},
  {Code: 203, Message: 'El email ya está siendo utilizado.'},
  {Code: 204, Message: 'No se encuentra el email y debe ser especificado.'},
  {Code: 205, Message: 'No se ha encontrado al usuario con email especificado.'},
  {Code: 206, Message: 'El usuario no puede ser alterado por un cliente sin sesión.'},
  {Code: 207, Message: 'Los usuarios sólo pueden ser creados a través del registro.'},
  {Code: 208, Message: 'Cuenta existente ya vinculada a otro usuario.'},
  {Code: 209, Message: 'El identificador de usuario no coincide.'},
  {Code: 250, Message: 'Identificador vinculación faltante en solicitud.'},
  {Code: 251, Message: 'Sessión vinculada inválida.'},
  {Code: 252, Message: 'El servicio de vinculación inicado (ej. Facebook or Twitter) no es soportado.'},
  {Code: 600, Message: 'Hubo varios errores. Los errores agregados tienen una propiedad "error", la cual es un arreglo de objetos error con más detalles sobre cada error que ha ocurrido.'},
  {Code: 601, Message: 'El cliente no puede leer un archivo de entrada.'},
  {Code: 602, Message: 'Un código de error verdadero no está disponible porque se tuvo que utilizar un objeto XDomainRequestreal para permitir solicitudes CORS en Internet Explorer, el cual obtiene el cuerpo de las respuestas HTTP que tienen un código de estado non-2XX, se aconseja evitar el uso de Internet Explorer.'}
];

//chars normalization map
var charsMap = {
  'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'AE','Ç':'C',
  'È':'E','É':'E','Ê':'E','Ë':'E','Ì':'I','Í':'I','Î':'I','Ï':'I',
  'Ð':'D','Ñ':'N','Ò':'O','Ó':'O','Ô':'O','Õ':'O','Ö':'O','Ø':'O',
  'Ù':'U','Ú':'U','Û':'U','Ü':'U','Ý':'Y','ß':'s',
  'à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae','ç':'c',
  'è':'e','é':'e','ê':'e','ë':'e','ì':'i','í':'i','î':'i','ï':'i',
  'ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o',
  'ù':'u','ú':'u','û':'u','ü':'u','ý':'y','ÿ':'y',
  'Ā':'A','ā':'a','Ă':'A','ă':'a','Ą':'A','ą':'a',
  'Ć':'C','ć':'c','Ĉ':'C','ĉ':'c','Ċ':'C','ċ':'c','Č':'C','č':'c',
  'Ď':'D','ď':'d','Đ':'D','đ':'d',
  'Ē':'E','ē':'e','Ĕ':'E','ĕ':'e','Ė':'E','ė':'e','Ę':'E','ę':'e','Ě':'E','ě':'e',
  'Ĝ':'G','ĝ':'g','Ğ':'G','ğ':'g','Ġ':'G','ġ':'g','Ģ':'G','ģ':'g',
  'Ĥ':'H','ĥ':'h','Ħ':'H','ħ':'h',
  'Ĩ':'I','ĩ':'i','Ī':'I','ī':'i','Ĭ':'I','ĭ':'i','Į':'I','į':'i','İ':'I','ı':'i',
  'Ĳ':'IJ','ĳ':'ij','Ĵ':'J','ĵ':'j','Ķ':'K','ķ':'k',
  'Ĺ':'L','ĺ':'l','Ļ':'L','ļ':'l','Ľ':'L','ľ':'l','Ŀ':'L','ŀ':'l','Ł':'L','ł':'l',
  'Ń':'N','ń':'n','Ņ':'N','ņ':'n','Ň':'N','ň':'n','ŉ':'n',
  'Ō':'O','ō':'o','Ŏ':'O','ŏ':'o','Ő':'O','ő':'o','Œ':'OE','œ':'oe',
  'Ŕ':'R','ŕ':'r','Ŗ':'R','ŗ':'r','Ř':'R','ř':'r',
  'Ś':'S','ś':'s','Ŝ':'S','ŝ':'s','Ş':'S','ş':'s','Š':'S','š':'s',
  'Ţ':'T','ţ':'t','Ť':'T','ť':'t','Ŧ':'T','ŧ':'t',
  'Ũ':'U','ũ':'u','Ū':'U','ū':'u','Ŭ':'U','ŭ':'u','Ů':'U','ů':'u','Ű':'U','ű':'u','Ų':'U','ų':'u',
  'Ŵ':'W','ŵ':'w','Ŷ':'Y','ŷ':'y','Ÿ':'Y','Ź':'Z','ź':'z','Ż':'Z','ż':'z','Ž':'Z','ž':'z',
  'ſ':'s','ƒ':'f','Ơ':'O','ơ':'o','Ư':'U','ư':'u','Ǎ':'A','ǎ':'a','Ǐ':'I','ǐ':'i','Ǒ':'O','ǒ':'o',
  'Ǔ':'U','ǔ':'u','Ǖ':'U','ǖ':'u','Ǘ':'U','ǘ':'u','Ǚ':'U','ǚ':'u','Ǜ':'U','ǜ':'u',
  'Ǻ':'A','ǻ':'a','Ǽ':'AE','ǽ':'ae','Ǿ':'O','ǿ':'o'
};

function createPointer(className, objectId){
  return {"__type":"Pointer","className":className,"objectId":objectId}
};

//get error description for parse error code...
function getErrorDesc(error) {
  //for error messages
  if (typeof error === 'string') {
    return error;
  }

  if(error.code) {
    //some cloud errors contain real error in message
    if(error.message[0] === '{') {
      error=JSON.parse(error.message);
    }

    //parse cloud error returned by cloud app
    if(error.code === 142) {
      return error.message;
    }

    //get error description by code
    for(var i = 0; i < errorCodes.length && errorCodes[i].Code <= error.code; i++){
      if(errorCodes[i].Code === error.code) {
        return errorCodes[i].Message;
      }
    }

    return error.message;
  }
  console.log(error);
  return 'Error desconocido';
}

//normalize file names for parse (can be user for other things)
function strNormalize(str) {
  //replace illegal characters
  var re = new RegExp(Object.keys(charsMap).join('|'),'gi');
  var ret = str.replace(re, function(matched) {
    return charsMap[matched.toLowerCase()];
  }).replace(/[^a-zA-Z0-9\_\.]/g,'');

  //check name length
  if(ret.length > 80) {//80 + 42 (Parse prefix) = 122
    var parts= ret.split('.');
    var ext = '.' + parts.pop().toLowerCase();
    ret = parts.join('.').substring(0,76) + ext;
  }

  return ret;
}

//To do randomize questions
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Parse.Object.prototype.toFullJSON = function() {
  var json = this.toJSON();
  var tmp = null;
  for (var p in json) {
    if(typeof(json[p]) === 'object' && json[p].__type){
      switch(json[p].__type){
        case 'Date':
          json[p] = this.get(p);
        break;
        case 'File':
          tmp = this.get(p);
          if(tmp && tmp.url){
            json[p] = tmp.url();
          }else{
            json[p] = tmp;
          }
        break;
        case 'Pointer':
          tmp = this.get(p);
          if(tmp && tmp.toFullJSON){
            json[p] = tmp.toFullJSON();
          }else{
            json[p] = tmp;
          }
        break;
        case 'Array':case 'Object':case 'Relation':
          json[p] = this.get(p);
        break;
        case 'GeoPoint':throw 'NOT SUPPORTED!';
        default:
          console.log('Unknown type: ' + json[p].__type);
        break;
      }
    }
  }
  return json;
};

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a.get(key); var y = b.get(key);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

Parse.Collection.prototype.toFullJSON = function() {
  return this.map(function(model){ return model.toFullJSON(); });
};

Array.prototype.toFullJSON = function(){
  return this.map(function(m){
    if(m instanceof Parse.Object){
      return m.toFullJSON();
    }
    return m;
  });
};
