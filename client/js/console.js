
var socketInstance = io.connect('?role=console');

var app = new Vue({
	el: '#dashboard-view',
	data:{
		participants: [],
		rounds: [],
		ratings: [],
		scores: {}
	},
	methods: {
		// average: function(scores){
		// 	var allKeys = Object.keys(scores);
		// 	var rawSum = this.sum(scores);
		// 	return parseFloat( ( rawSum / allKeys.length ).toFixed(2) );
		// },
		sum: function(scores){
			return Object.keys(scores).map(function(k){ return scores[k]; }).reduce(function(a,b){ return a+b; });
		},
		sumByPart: function(pidx){
			var self = this;
			var allScores = self.scores;
			// r => p => rating
			var rawSum = 0;
			for(var ridx in allScores){
				for(var ptcpidx in allScores[ridx]){
					if(ptcpidx == pidx){
						rawSum += self.sum(allScores[ridx][ptcpidx]);
					}
				}
			}
			// return parseFloat( (rawSum / (self.rounds.length * self.ratings.length)).toFixed(2) );
			return rawSum;
		},
		showScore: function(score){
			// event: scoreview_show_score
			socketInstance.emit('scoreview_show_score', { score: score });
		},
		showSplitScore: function(rdidx, ptidx){
			// event: scoreview_show_split_score
			socketInstance.emit('scoreview_show_split_score', { rdidx: rdidx, ptidx: ptidx });
		},
		showScoreWithPart: function(ptidx, score){
			// event: scoreview_show_score_with_part
			socketInstance.emit('scoreview_show_score_with_part', { score: score, ptidx: ptidx });
		},
		forceChangeScore: function(rdidx,ptidx,rtidx,score){
			socketInstance.emit('console_update_score', {
				ratingIdx: rtidx,
				participantIdx: ptidx,
				roundIdx: rdidx,
				score: score
			});
			this.scores[rdidx][ptidx][rtidx] = parseInt(score);
		}
	},
	computed: {},
	watch: {},
	mounted: function(){
		var self = this;

		socketInstance.emit('console_get_allinfos', {}, function(data){

			var initScore = {};
			var reloadScores = data.reloadScores;

			data.rounds.forEach(function(rd, rdidx){ // round
				if(!initScore[rdidx]) initScore[rdidx] = {}; 
				data.participants.forEach(function(pt, ptidx){ // participant
					if(!initScore[rdidx][ptidx]) initScore[rdidx][ptidx] = {};
					data.ratings.forEach(function(rt, rtidx){ // rating : score
						initScore[rdidx][ptidx][rtidx] = reloadScores[rdidx][ptidx][rtidx];
					});
				});
			});

			self.scores = initScore;
			self.participants = data.participants;
			self.rounds = data.rounds;
			self.ratings = data.ratings;
		});
	}
});

// =====================================
// Socket Handlers =====================
// =====================================
socketInstance.on('connected_with_rating', function(data){
	var idx = parseInt(data.idx);
	app.$set(app.ratings, idx, Object.assign({}, app.ratings[idx], {online: true} ));
});

socketInstance.on('disconnected_with_rating', function(data){
	var idx = parseInt(data.idx);
	app.$set(app.ratings, idx, Object.assign({}, app.ratings[idx], {online: false} ));
});

socketInstance.on('update_score_from_rating', function(data) {
	var rtidx = data.ratingIdx.toString(),
		ptidx = data.participantIdx.toString(),
		rdidx = data.roundIdx.toString(),
		score = parseInt(data.score);
	
	// round, participant, rating : score
	app.$data.scores[rdidx][ptidx][rtidx] = score;
});



