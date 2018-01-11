
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

        var rtidx = socket.currentRatingIdx;
        var reloadScores = {};
        constants.rounds.forEach(function(rd, rdidx){
            if(!reloadScores[rdidx]) reloadScores[rdidx] = {};
            constants.participants.forEach(function(pt, ptidx){
                reloadScores[rdidx][ptidx] = io.scoreManager.getScore(rtidx, ptidx, rdidx);
            });
        });

        callbackFn({
            participants: constants.participants,
            rounds: constants.rounds,
            reloadScores: reloadScores
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
                    reloadScores[rdidx][ptidx][rtidx] = io.scoreManager.getScore(rtidx, ptidx, rdidx) || 0;
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

    socket.on('console_update_score', function(data){
        io.scoreManager.setScore(data.ratingIdx, data.participantIdx, data.roundIdx, data.score);
    })

    socket.on('scoreview_show_score', function(data){
        socket.to("scoreview").emit('show_score_from_console', data);
        // console.log(data);
    });

    socket.on('scoreview_show_split_score', function(data){
        var rdidx = data.rdidx,
            ptidx = data.ptidx,
            scores = [];

        constants.ratings.map(function(rt, rtidx){
            scores.push(io.scoreManager.getScore(rtidx, ptidx, rdidx) || 0);
        });

        socket.to("scoreview").emit('show_split_score_from_console', { scores: scores });
        // console.log({ scores: scores });
    });

    socket.on('scoreview_show_score_with_part', function(data){
        var ptidx = data.ptidx,
            score = data.score,
            info = constants.participants[ptidx];
        socket.to("scoreview").emit('show_score_with_part_from_console', { score: score, name: info.name });
        // console.log({ score: score, name: info.name });
    });

    socket.on('disconnect', function (message) {
        if(currentRole == "rating" && !io.hasSocketInRoom(getRoomByRole(currentRole)) ){
            socket.to("console").emit('disconnected_with_rating', { idx: socket.currentRatingIdx, info: constants.ratings[socket.currentRatingIdx] });
        }
    });

}


