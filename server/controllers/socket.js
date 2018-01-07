
var constants = require('../config/const');

var getRatingRoom = function(idx){
    return "rating" + idx;
}

module.exports = function (socket, io) {

    var currentRole = socket.currentRole;

    var getRoomByRole = function(role){
        if(typeof socket.currentRatingIdx == 'undefined') return role;
        return getRatingRoom(socket.currentRatingIdx);
    };

    socket.join( getRoomByRole(currentRole) );

    if(currentRole == "rating"){
        socket.to("console").emit('connected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
    }

    socket.on('rating_update_score', function(data, callbackFn) {
        if(typeof socket.currentRatingIdx == 'undefined'){
            callbackFn(false); return;
        }
        io.scoreManager.setScore(socket.currentRatingIdx, data.participantIdx, data.roundIdx, data.score);

        data.ratingIdx = socket.currentRatingIdx;

        socket.to("console").emit('update_score_from_rating', data);

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

        var ratings = constants.ratings.map(function(item, idx){
            item.online = io.hasSocketInRoom(getRatingRoom(idx));
            return item;
        });

        var reloadScores = {};

        // round, part, rating maps.
        constants.rounds.forEach(function(rd, rdidx){
            if(!reloadScores[rdidx]) reloadScores[rdidx] = {};
            constants.participants.forEach(function(pt, ptidx){
                if(!reloadScores[rdidx][ptidx]) reloadScores[rdidx][ptidx] = {};
                constants.ratings.forEach(function(rt, rtidx){
                    var score = io.scoreManager.getScore(rtidx, ptidx, rdidx);
                    if(score == -1) score = 0;
                    reloadScores[rdidx][ptidx][rtidx] = score;
                });
            });
        });
        
        callbackFn({
            participants: constants.participants,
            rounds: constants.rounds,
            ratings: ratings,
            reloadScores: reloadScores
        });
    });

    socket.on('disconnect', function (message) {
        if(currentRole == "rating" && !io.hasSocketInRoom(getRoomByRole(currentRole)) ){
            socket.to("console").emit('disconnected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
        }
    });

}


