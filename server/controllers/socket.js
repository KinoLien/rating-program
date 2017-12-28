
// http://stackoverflow.com/questions/18831362/how-to-share-a-simple-image-on-facebook-with-callback

// var service = require('../services/service');

// var webshot = require('webshot');

var constants = require('../config/const');

// var path = require('path');

// var isDev = process.env.NODE_ENV === 'development';

module.exports = function (socket, io) {

    // var gameStatus = {};

    // if(isDev){
    //     socket._cacheEmit = socket.emit;
    //     socket.emit = function(){
    //         socket._cacheEmit.apply(this, arguments);
    //     };
    // }

    // if(socket.isBrowser){
    //     // console.log(socket.request.user);
    //     // socket.on()
    //     socket.emit('pass_token', { token: socket.token });
    // }

    // socket.join(socket.token);

    // socket.on('pass_compressed_image', function(message){
    //     socket.broadcast.to(socket.token).emit('pass_compressed_image', message);
    // });

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

    var currentRole = socket.currentRole;

    var getRoomByRole = function(role){
        return role + ( (typeof socket.currentRatingIdx == 'undefined')? "" : socket.currentRatingIdx );
    };

    socket.join( getRoomByRole(currentRole) );

    if(currentRole == "rating"){
        socket.to("console").emit('connected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
    }

    if(io.scoreManager.hasData() && ["rating","console"].indexOf(currentRole) != -1){
        // do reload scores
        var currentData = {};
        //
        socket.to( getRoomByRole(currentRole) ).emit('reload_data', currentData);
    }
    
    socket.on('rating_update_score', function(data, callbackFn) {
        if(typeof socket.currentRatingIdx == 'undefined'){
            callbackFn(false); return;
        }
        io.scoreManager.setScore(socket.currentRatingIdx, data.participantIdx, data.roundIdx, data.score);

        data.ratingIdx = socket.currentRatingIdx;

        socket.to("console").emit('update_score_from_rating', data);

        // console.log(data);
        // console.log(io.scoreManager.getScore(socket.currentRatingIdx, data.participantIdx, data.roundIdx));

        callbackFn(true);
    });

    socket.on('rating_get_allinfos', function(data, callbackFn){
        if(typeof socket.currentRatingIdx == 'undefined'){
            callbackFn(false); return;
        }
        callbackFn({
            participants: constants.participants,
            rounds: constants.rounds
        });
    });

    socket.on('disconnect', function (message) {
        if(currentRole == "rating"){
            socket.to("console").emit('disconnected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
        }
    });

}


