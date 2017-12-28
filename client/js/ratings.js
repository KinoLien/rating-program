
var socketInstance = io.connect('?role=rating&idx=' + window.rtIdx);

// socketInstance.on('connect', function(msg) {
//     console.log("Browser Connected. ");
// });
// socketInstance.on('pass_token', function(data) {
//     <% if (typeof isDev == "boolean" && isDev) { %>
//     // for test
//     $("#qrcodeText").text(data.token);
//     <% } %>
//     qrcodelib.toCanvas($('#qrcode')[0], data.token, function(error) {
//         if (error) console.error(error)
//         console.log('QR code generated!');
//     });
// });
// socketInstance.on('pass_compressed_image', function(data) {
//     var image = '<li>' + '<input type="checkbox" id="pr' +
//         frame.items.length + '" /><label for="pr' + frame.items.length + '" class="img-label" id="li' + frame.items.length + '"><img id="item-' +
//         frame.items.length + '" src="data:' + data.type + ';base64,' +
//         data.base64 + '" path="' + data.filepath + '"/></label>' + '</li>';
//     frame.add(image);
//     frame.activate(frame.items.length - 1);
// });
// socketInstance.on('connected_with_device', function(data) {
//     console.log('Connected with device!');
//     $('#qrcode-modal').modal('hide');
//     $('body').css('overflow', 'scroll');
//     $('#connected-modal').modal('show');

//     $('#connected-alert').show();

//     app.$data.loading = false;
// });

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
    	toNext: function(){
    		var self = this;

    		self.runDownIdx++;
    		self.inputRate = '';

    		self.canGoNext = false;
    	},
    	toBegin: function(){
    		if(this.beginning) this.beginning = false;
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
			data.rounds.forEach(function(roundInfo, ridx){
				data.participants.forEach(function(participantInfo, pidx){
					runDown.push({
						roundInfo: roundInfo,
						roundIdx: ridx,
						participantInfo: participantInfo,
						participantIdx: pidx
					});
				});
			});
			self.allRunDown = runDown;
			self.toNext();
			self.loading = false;
		});
    }

});
