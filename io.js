
var sio = require('socket.io');
var debug = require('debug');

process.title = 'socket.io-computer-io';

var port = process.env.COMPUTER_IO_PORT || 3001;
var io = module.exports = sio(port);
console.log('listening on *:' + port);

// redis socket.io adapter
var uri = require('redis').uri;
io.adapter(require('socket.io-redis')(uri));

// redis queries instance
var redis = require('./redis').io();

var uid = process.env.WEPLAY_SERVER_UID || port;
debug('server uid %s', uid);

io.total = 0;
io.on('connection', function(socket){
  var req = socket.request;

  // keep track of connected clients
  updateCount(++io.total);
  socket.on('disconnect', function(){
    updateCount(--io.total);
  });

  // send keypress to emulator
  socket.on('keydown', function(key){
    redis.publish('computer:keydown', key);
  });

  // send mouse move to emulator
  socket.on('mousemove', function(move) {
    /* fill later */
  });
});

// socket broadcast shortcut
function broadcast(socket/*, …*/){
  var args = Array.prototype.slice.call(arguments, 1);
  socket.broadcast.emit.apply(socket, args);
}