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

  socket.on('usuario nuevo', function(msg,sala){
    var salida = "";
    console.log('Usuario añadido al array');
    usuarios.push (new Usuario(msg,socket.id,sala));

    for(var i = 0;i<usuarios.length;i++){
      salida += "\n   -" + usuarios[i].nombre + "   [" + usuarios[i].sala + "]" + "\n";
    }
    io.emit('actualiza usuarios', salida);
    console.log("Usuarios conectados: ");
    for(var i = 0;i<usuarios.length;i++){
        console.log(usuarios[i].nombre);
    }
  });


  socket.on('evento chat', function(chat,usuario,sala){
    console.log(usuario+ " : " + chat);
    io.emit('evento chat', chat,usuario,sala);
  });

  socket.on('disconnect', () => {
    var salida = "";
    console.log('Un usuario se ha desconectado: ' + socket.id);
    for(var i = 0;i<usuarios.length;i++){
      if(usuarios[i].socket == socket.id){
        console.log("Se ha eliminado del array a: " + usuarios[i].nombre);
        usuarios.splice(i, 1);
      }
    }
    for(var i = 0;i<usuarios.length;i++){
      salida += "\n   -" + usuarios[i].nombre + "   [" + usuarios[i].sala + "]" + "\n";
    }
    io.emit('actualiza usuarios', salida);
  });
});

http.listen(app.get('port'), function() {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});




////////////////////-------CLASES ------------------------------------////////////////////////////


class Usuario{
  constructor(nombre,socket,sala){
    this.nombre = nombre;
    this.socket = socket;
    this.sala = sala;
  }
}