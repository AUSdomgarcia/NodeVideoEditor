var VE = window.VE || {};

VE.video = function video(opts) {
	this.$video = $('#myvideo');
	this.videoElement = document.getElementById('myvideo');;
	this.canvas = null;
	this.HEIGHT = NaN;
	this.WIDTH = NaN;
	this.group = null;
	this.fabricVideo = null;
};

VE.video.prototype = {

	attachFabric: function addFabric(canvas) {
        var scope = this;

        this.canvas = canvas;
        this.group = VE.utils.overlayGroup(canvas);
    },
    
    onReady: function onReady(callback){
    	var scope = this;
    	var currTime = 0;
    	
    	this.videoElement.onprogress = function(e){

    		if(scope.videoElement.buffered.end(0)){

    			if(scope.videoElement.buffered.end(0) >= scope.videoElement.duration){
    				scope.init();
    			}
    		}
    		// console.log(scope.videoElement.currentTime, scope.videoElement.duration);
    	};

    },


    onSetDimension: function onSetDimension(){
		var scope = this;
		//658
		//498
    	var MAX_EDITOR_WIDTH = 698;
		var VIDEO_SCALE = 0.34;
		
		this.videoElement.onloadedmetadata = function(e){
			scope.$video.height(1);
			scope.$video.width(1);

    		if(scope.videoElement.videoWidth>MAX_EDITOR_WIDTH){
				scope.WIDTH = scope.videoElement.videoWidth * VIDEO_SCALE;
				scope.HEIGHT = scope.videoElement.videoHeight * VIDEO_SCALE;
			} else {
				// Setup Video Dimension
				scope.HEIGHT = scope.videoElement.videoHeight;
		        scope.WIDTH = scope.videoElement.videoWidth;
			}

	        // Setup Canvas based on Video Dimension
	        scope.canvas.setHeight(scope.HEIGHT);
	        scope.canvas.setWidth(scope.WIDTH);
    	};
    },

	init: function init(){
		var scope = this;

		this.fabricVideo = new fabric.Image(scope.videoElement, {
		    width: scope.WIDTH,
		    height:scope.HEIGHT,
		    hasControls: false,
	        hasBorders: false,
	        selectable: false,
	        hasRotatingPoint: false,
		    originY: 'top',
		    originX: 'left',
		    // centeredScaling: true
		});	


		// scope.group.addWithUpdate(fabricVideo);
		scope.canvas.add(this.fabricVideo);
	},

	onPlay: function onPlay(){
		var scope = this;

		this.fabricVideo.getElement().play();	
	}
}