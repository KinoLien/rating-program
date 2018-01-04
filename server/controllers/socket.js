
// http://stackoverflow.com/questions/18831362/how-to-share-a-simple-image-on-facebook-with-callback

// var service = require('../services/service');

// var webshot = require('webshot');

var constants = require('../config/const');

// var path = require('path');

// var isDev = process.env.NODE_ENV === 'development';

module.exports = function (socket, io) {

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

    socket.on('console_get_allinfos', function(data, callbackFn){
        callbackFn({
            participants: constants.participants,
            rounds: constants.rounds,
            ratings: constants.ratings
        });
    });

    socket.on('disconnect', function (message) {
        if(currentRole == "rating"){
            var room = io.sockets.adapter.rooms[ getRoomByRole(currentRole) ];
            if(!room || room.length < 1){
                socket.to("console").emit('disconnected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
            }
        }
    });

}


