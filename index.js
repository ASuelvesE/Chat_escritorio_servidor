const express = require('express')
const path = require('path')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/'));

// views is directory for all template files
app.set('views', __dirname + '/index.html');
app.set('view engine', 'ejs');

console.log("outside io");

var usuarios  = [];
console.log("Usuarios conectados: " + usuarios.length)

io.on('connection', function(socket){

    console.log('Se ha conectado un usuario');

  socket.on('usuario nuevo', function(msg){
    var salida = "";
    console.log('Usuario añadido al array');
    usuarios.push (new Usuario(msg,socket.id));

    for(var i = 0;i<usuarios.length;i++){
      salida += "\n" + usuarios[i].nombre + "\n";
    }
    io.emit('actualiza usuarios', salida);
    console.log("Usuarios conectados: " + salida);
  });


  socket.on('evento chat', function(chat,usuario){
    console.log(usuario+ " : " + chat);
    io.emit('evento chat', chat,usuario);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado: ' + socket.id);
    for(var i = 0;i<usuarios.length;i++){
      if(usuarios[i].socket == socket.id){
        usuarios.splice(i, 1);
        console.log("Se ha eliminado del array a: " + usuarios[i].nombre);
      }
    }
    //usuarios.pop();
  });
});

http.listen(app.get('port'), function() {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});




////////////////////-------CLASES ------------------------------------////////////////////////////


class Usuario{
  constructor(nombre,socket){
    this.nombre = nombre;
    this.socket = socket;
  }
}