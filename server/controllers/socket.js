
// http://stackoverflow.com/questions/18831362/how-to-share-a-simple-image-on-facebook-with-callback

// var service = require('../services/service');

// var webshot = require('webshot');

var path = require('path');

var isDev = process.env.NODE_ENV === 'development';

var _ = require('lodash');

module.exports = function (socket, io) {

    // var gameStatus = {};

    if(isDev){
        socket._cacheEmit = socket.emit;
        socket.emit = function(){
            socket._cacheEmit.apply(this, arguments);
        };
    }

    if(socket.isBrowser){
        // console.log(socket.request.user);
        // socket.on()
        socket.emit('pass_token', { token: socket.token });
    }

    socket.join(socket.token);

    socket.on('pass_compressed_image', function(message){
        socket.broadcast.to(socket.token).emit('pass_compressed_image', message);
    });

    // socket.on('req_start', function(message){

    // });

    // socket.on('req_next_block_question', function(){

    // });

    // socket.on('req_answer_question', function(message){

    // });

    // socket.on('req_check_blocks', function(){

    // });

    // socket.on('req_check_gift', function(){

    // });

    // socket.on('req_show_result', function(message){

    // });

    // socket.on('req_end', function(message){

    // });

    socket.on('disconnect', function (message) {

    });

}


