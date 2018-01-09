
var socketInstance = io.connect('?role=scoreview');

var app = new Vue({
	el: '#score-view',
	data:{
		remoteData: {}
	},
	methods: {},
	computed: {
		onlyScore: function(){
			return !this.remoteData.name && this.remoteData.score;
		},
		multiScores: function(){
			return this.remoteData.scores && this.remoteData.scores.length;
		},
		scoreWithName: function(){
			return this.remoteData.name && this.remoteData.score;
		}
	},
	watch: {},
	mounted: function(){}
});

// =====================================
// Socket Handlers =====================
// =====================================
['show_score_from_console', 'show_split_score_from_console', 'show_score_with_part_from_console']
	.forEach(function(evName){
		socketInstance.on(evName, function(data){
			app.$data.remoteData = data;
		});
	});
