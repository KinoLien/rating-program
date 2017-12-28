
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
                    if( rangeInvalid(ratingIdx, participantIdx, roundIdx) ) return -1;
                    var key = [ratingIdx, participantIdx, roundIdx].join('-');
                    if( isNaN(data[key]) ) return -1;
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

        return io;
    },

    authorize: function authorize(io) {
        io.use(function (socket, next) {
            // var tokenRoom,
            //     params = utils.getParamPairs(socket.request);

            // var isBrowser = utils.getCookie(socket.request);
            // var isDevice = (tokenRoom = params["token"]) && io.sockets.adapter.rooms[tokenRoom];

            // socket.isBrowser = isBrowser;
            // socket.token = tokenRoom || utils.getToken();

            // if( isBrowser || isDevice ){
            //     // browser open room or room exist
            //     console.log("OK");
            //     if( isDevice ){
            //         socket.to(tokenRoom).emit('connected_with_device', tokenRoom);
            //     }
            //     next();
            // } else{
            //     console.log("Fail");
            //     next(new Error("Server reject this connection with token: " + tokenRoom));
            // }
            var rejectConnect = function(reason){
                console.log("Fail");
                socket.error(reason);
                socket.disconnect();
                next(new Error(reason));
            };

            var validRoles = ["rating", "console", "view"];
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
