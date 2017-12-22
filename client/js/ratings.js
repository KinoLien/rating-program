
// var socketInstance = io.connect('?ratingSerial=' + );

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
    	participant_name: '',
    	round_name: '',
    	inputRate: '',
    	currentMaskHeight: 0,
    	loading: false
    },

    methods: {
    	sendRate: function(){

    	},
    	toBegin: function(){
    		this.participant_name = 'test';
    		this.round_name = 'test';
    	}
    },

    computed: {
    	currentRate: function(){
    		var newVal = this.inputRate;
    		if(isNaN(newVal) || newVal < 0) newVal = 0;
            if(newVal > 100) newVal = 100;
            return newVal;	
    	},
    	running: function(){
    		return this.participant_name && this.round_name;
    	}
    },

    watch:{
    	loading: function(){
    		this.currentMaskHeight = this.$el.offsetHeight;
    	}
    },

    mounted: function(){
        // to get width/height for loading wrap after rendered.
        // var main = this.$el;
        // var load = this.$refs.loadwrap;
        // $(load).height( main.offsetHeight );
    }

});
