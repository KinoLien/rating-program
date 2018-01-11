
var socketInstance = io.connect('?role=rating&idx=' + window.rtIdx);

var app = new Vue({
    el: '#input-view',

    data: {
    	participantName: '',
    	roundName: '',
    	inputRate: '',
    	currentMaskHeight: 0,
    	loading: false,
    	allRunDown: [],
    	runDownIdx: -1,
    	beginning: true,
    	ending: false,
    	canGoNext: false
    },

    methods: {
        doAutoFocus: function(){
            var self = this;
            self.$nextTick(function(){
                if(self.$refs.scoreRef) self.$refs.scoreRef.focus();
            });
        },
    	sendRate: function(){
    		var self = this;
    		self.loading = true;
    		var runDown = self.allRunDown[self.runDownIdx];
    		socketInstance.emit('rating_update_score', {
    			participantIdx: runDown.participantIdx,
    			roundIdx: runDown.roundIdx,
    			score: self.currentRate || 0
    		}, function(success){
    			if(success){
    				self.canGoNext = true;
    				self.loading = false;
    			}
    		});
    	},
    	toNext: function(jumpTo){
    		var self = this;

    		if(isNaN(jumpTo)){
	    		self.runDownIdx++;
	    		self.inputRate = '';
	    		self.canGoNext = false;
                self.doAutoFocus();
    		}else{
    			self.runDownIdx = jumpTo;
				self.inputRate = self.allRunDown[jumpTo].currentScore;
				self.canGoNext = true;
				self.toBegin();
    		}
    	},
    	toBegin: function(){
            var self = this;
            if(self.beginning) {
                self.beginning = false;
                self.doAutoFocus();
            }
    	}
    },

    computed: {
    	currentRate: function(){
    		var newVal = this.inputRate;
    		if(newVal.toString().length == 0) return '';
    		newVal = parseInt(newVal);
    		if(newVal < 0) newVal = 0;
            if(newVal > window.rtMaxScore) newVal = window.rtMaxScore;
            return newVal;	
    	},
    	running: function(){
    		return !this.beginning && !this.ending;
    	},
    	nextText: function(){
    		var self = this;
    		var allLen = self.allRunDown.length;
    		if(self.runDownIdx + 1 < allLen){
    			var runDown = self.allRunDown[self.runDownIdx + 1];
    			return runDown.roundInfo.name + runDown.participantInfo.name;
    		}else{
    			return "評分結束";
    		}
    	}
    },

    watch:{
    	loading: function(){
    		this.currentMaskHeight = this.$el.offsetHeight;
    	},
    	runDownIdx: function(val){
    		var self = this;
    		var allLen = self.allRunDown.length;
    		if(val != -1 && val < allLen){
    			var runDown = self.allRunDown[val];
    			self.roundName = runDown.roundInfo.name;
    			self.participantName = runDown.participantInfo.name;
    		}else if(val >= allLen){
    			self.ending = true;
    		}
    	}
    },

    mounted: function(){
        var self = this;
		self.loading = true;

		socketInstance.emit('rating_get_allinfos', {}, function(data){
			// data.participants
			// data.rounds
			var runDown = [];
			var reloadScores = data.reloadScores;
			var jumpTo;

			data.rounds.forEach(function(roundInfo, ridx){
				data.participants.forEach(function(participantInfo, pidx){
					var currentScore = reloadScores[ridx][pidx];
					var runObj = {
						roundInfo: roundInfo,
						roundIdx: ridx,
						participantInfo: participantInfo,
						participantIdx: pidx
					};

					if(currentScore){
						runObj.currentScore = currentScore;
						jumpTo = runDown.length;
					}

					runDown.push(runObj);
				});
			});
			self.allRunDown = runDown;
			self.toNext(jumpTo);
			self.loading = false;
		});
    }

});
