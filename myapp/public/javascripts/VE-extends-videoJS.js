var VE = window.VE || {};

VE.videoJS = function videoJS() {
    var scope = this;
    this.bufferComplete = false;
    this.canCaptureContext = false;

    this.VIDEO_DURATION = 0;

    this.MAX_EDITOR_WIDTH = 698;
    this.VIDEO_SCALE = 0.34;

    this.$video = $('#myvideo');

    this.$btnGenerate = $('.btn-generate');

    this.HEIGHT = NaN;
    this.WIDTH = NaN;

    this.VWIDTH = NaN;
    this.VHEIGHT = NaN;

    this.group = null;
    this.fabric = null;

    this.fabricVideo = null;
    this.videoElement = null;// = document.getElementById('myvideo');

    this.API_SUFFIX = '_html5_api';

    this.videojs = videojs('mainVideo', { 'controls': true, 'autoplay': true, 'preload': 'auto'}, function() {
        scope.addHooks();
    });

    this.Whammy = new Whammy.Video(23); 

    this.actionTimes = 0;

    this.Frame = 0;
};

VE.videoJS.prototype = {

    attachFabric: function attachFabric(fabric) {
        var scope = this;
        this.fabric = fabric;
        
        alert('initialize');

        this.group = VE.utils.overlayGroup(this.fabric.canvas);
    },

    addHooks: function addHooks() {
        var scope = this;

        this.videojs.on('loadedmetadata', function() {
            scope.VIDEO_DURATION = scope.videojs.duration();
            scope.WIDTH = scope.videojs.videoWidth();
            scope.HEIGHT = scope.videojs.videoHeight();

            console.log(scope.WIDTH, scope.HEIGHT);
        });

        this.videojs.on('timeupdate', function() {
        	

            if (scope.videojs.currentTime() >= scope.VIDEO_DURATION) {
                scope.actionTimes++;

                console.log('actionTimes', scope.actionTimes);

                if(scope.actionTimes >= 1 && scope.canCaptureContext===false){

	                scope.bufferComplete = true;

	                scope.setDimensionToFabric();

                } else {

                	scope.canCaptureContext = false;
                	scope.bufferComplete = false;
                	scope.actionTimes = 0;

                	// scope.videojs.play();
                	scope.compileWEBM();
                }
            }
        });

        this.$btnGenerate.on('click', function(e){
        	if(scope.bufferComplete){
        		// 1. Play video again
        		// 2. Capture using Whammy.js
		    	scope.canCaptureContext = true;
		    	scope.actionTimes = 0;
		    	scope.videojs.play();
        	}
        });
    },

    setDimensionToFabric: function setDimensionToFabric() {
        var scope = this;

        if (this.WIDTH > this.MAX_EDITOR_WIDTH) {
            this.VWIDTH = this.WIDTH * this.VIDEO_SCALE;
            this.VHEIGHT = this.HEIGHT * this.VIDEO_SCALE;
        } else {
            this.VWIDTH = this.WIDTH;
            this.VHEIGHT = this.HEIGHT;
        }

        // Setup Canvas based on Video Dimension
        this.fabric.canvas.setWidth(this.VWIDTH);
        this.fabric.canvas.setHeight(this.VHEIGHT);

        this.generateVideoStage();
    },

    generateVideoStage: function(){
    	var scope = this;

    	this.videoElement = document.getElementById('mainVideo'.concat(this.API_SUFFIX));

    	this.fabricVideo = new fabric.Image( this.videoElement, {
		    width:  scope.VWIDTH,
		    height: scope.VHEIGHT,

		    hasControls: false,
	        hasBorders: false,
	        selectable: false,
	        hasRotatingPoint: false,

	        defaultCursor: 'crosshair',
		    originY: 'top',
		    originX: 'left',
		    // centeredScaling: true
		});	

    	this.fabric.canvas.defaultCursor = 'default';

		this.fabric.canvas.add(this.fabricVideo);
		this.fabric.canvas.sendToBack(this.fabricVideo); // <-- then send to back
    },

    compileWEBM: function compileWEBM(){
    	var scope = this;

    	console.log('compileWEBM');

		this.Whammy.compile(false, function(output){
			var url = webkitURL.createObjectURL(output);
			scope.canCaptureContext = false;
			document.getElementById('whammyCompile').src = url;
		});
    },

    getContextAvailable: function getContextAvailable(){
    	var scope = this;

    	if(scope.canCaptureContext === true && scope.bufferComplete === true){

    		// scope.fabric.canvas.renderAll();

    		if(scope.Whammy){
    			// console.log( scope.fabric.canvas );
	    		scope.Whammy.add( scope.fabric.canvas );
    			scope.Frame++;
    		}

	    	console.log('Frames', scope.Frame);
    	}
    }
}
