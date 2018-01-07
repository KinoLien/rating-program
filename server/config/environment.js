
var constants = require('./const');

var utils = require('../utils');

module.exports = {

    loadSocketIo: function loadSocketIo(server) {

        var io = require('socket.io').listen(server);

        io.on('connection', function (socket) {
            require('../controllers/socket.js')(socket,io);
        });

        io.scoreManager = (function(rtc, ptpc, rdc, ms){
            var data = {};
            var outOfRange = function(val, bound){
                return isNaN(val) || isNaN(bound) || val < 0 || val >= bound;
            };
            var rangeInvalid = function(ratingIdx, participantIdx, roundIdx){
                return outOfRange(ratingIdx, rtc) || outOfRange(participantIdx, ptpc) || outOfRange(roundIdx, rdc);
            };
            return {
                getScore: function(ratingIdx, participantIdx, roundIdx){
                    if( rangeInvalid(ratingIdx, participantIdx, roundIdx) ) return null;
                    var key = [ratingIdx, participantIdx, roundIdx].join('-');
                    if( isNaN(data[key]) ) return null;
                    return data[key];
                },
                setScore: function(ratingIdx, participantIdx, roundIdx, score){
                    score = parseInt(score);
                    if( rangeInvalid(ratingIdx, participantIdx, roundIdx) ) return;
                    if( outOfRange(score, ms + 0.1) ) return;
                    var key = [ratingIdx, participantIdx, roundIdx].join('-');
                    data[key] = score;
                },
                reset: function(){ data = {}; },
                hasData: function(){ return Object.keys(data).length > 0; }
            };
        })(constants.ratings.length, constants.participants.length, constants.rounds.length, constants.maxScore);

        io.hasSocketInRoom = function(roomName){
            var room = this.sockets.adapter.rooms[ roomName ];
            return !!room && room.length > 0;
        };

        return io;
    },

    authorize: function authorize(io) {
        io.use(function (socket, next) {
            
            var rejectConnect = function(reason){
                console.log("Fail");
                socket.error(reason);
                socket.disconnect();
                next(new Error(reason));
            };

            var validRoles = ["rating", "console", "scoreview"];
            var params = utils.getParamPairs(socket.request);
            var currentRole = params["role"];

            if( !currentRole || validRoles.indexOf(currentRole) == -1 ){
                return rejectConnect("Server reject this connection with role: " + (currentRole || "undefined"));
            }else{
                if(currentRole == "rating"){
                    var currentRatingIdx = parseInt(params["idx"]);
                    if( isNaN(currentRatingIdx) || currentRatingIdx < 0 || 
                        currentRatingIdx >= constants.ratings.length ){
                        return rejectConnect("Server reject this connection with idx: " + currentRatingIdx);
                    }
                    socket.currentRatingIdx = currentRatingIdx;
                }
                socket.currentRole = currentRole;
                next();
            }
        });
    },
}
