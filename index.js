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
    console.log('Usuario añadido al array');
    io.emit('usuario nuevo', msg);
    usuarios.push (msg);
    for (var valor of usuarios) {
      io.emit('actualiza usuarios', valor);
      console.log("Usuarios conectados: " + valor);
    }
  });

  socket.on('actualiza usuarios', function(msg){
    console.log("Devolviendo los usuarios conectados");
    for (var valor of usuarios) {
      io.emit('actualiza usuarios', valor);
      //socket.broadcast.emit('actualiza usuarios', valor)
      console.log("Usuarios conectados: " + valor);
    }

  });


  socket.on('evento chat', function(chat,usuario){
    console.log(usuario+ " : " + chat);
    io.emit('evento chat', chat,usuario);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado: ' + socket.id);
    usuarios.pop();
  });
});

http.listen(app.get('port'), function() {
  console.log('Servidor funcionando en el puerto:', app.get('port'));
});
