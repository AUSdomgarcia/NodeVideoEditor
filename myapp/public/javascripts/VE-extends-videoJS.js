var VE = window.VE || {};

VE.videoJS = function videoJS() {
    var scope = this;

    this.bufferComplete = false;
    this.canCaptureContext = false;
    this.isVideoAdded = false;
    this.isCompiling = false;

    this.VIDEO_DURATION = 0;
    this.MAX_EDITOR_WIDTH = 698;
    this.VIDEO_SCALE = 0.34;

    this.captureCounter = 0;

    this.Frame = 0;
    this.HEIGHT = NaN;
    this.WIDTH = NaN;
    this.VWIDTH = NaN;
    this.VHEIGHT = NaN;
    this.group = null;
    this.fabric = null;

    this.fabricVideo = null;
    this.videoElement = null; // = document.getElementById('myvideo');

    this.$video = $('#myvideo');
    this.$mainCanvas = $('#mainCanvas');
    this.$btnGenerate = $('.btn-generate');

    this.API_SUFFIX = '_html5_api';

    this.whammy = new Whammy.Video(23); //<--- DITO

    this.videojs = videojs('mainVideo', { 'controls': true, 'autoplay': true, 'preload': 'auto' }, function() {
        scope.addHooks();
    });
};

VE.videoJS.prototype = {

    attachFabric: function attachFabric(fabric) {
        var scope = this;
        this.fabric = fabric;
        // alert('attach Fabric');
        this.group = VE.utils.overlayGroup(this.fabric.canvas);
    },

    addHooks: function addHooks() {
        var scope = this;

        // Get <video> metadata (height,width,duration)
        this.videojs.on('loadedmetadata', function() {
            scope.VIDEO_DURATION = scope.videojs.duration();
            scope.WIDTH = scope.videojs.videoWidth();
            scope.HEIGHT = scope.videojs.videoHeight();
            console.log('addHooks get metadata:', scope.WIDTH, scope.HEIGHT);
        });

        this.videojs.on('ended', function() {

            console.log('video ended!');

            if (scope.videojs.currentTime() >= scope.VIDEO_DURATION && scope.isVideoAdded === false && scope.bufferComplete === false) {
                scope.isVideoAdded = true;
                scope.bufferComplete = true;
                scope.addVideo();

            } else if (scope.canCaptureContext === true && scope.bufferComplete === true) {
                // scope.bufferComplete = false;
                scope.canCaptureContext = false;
                scope.compileWEBM();
                console.log('should compile now');
            }
        });

        this.$btnGenerate.on('click', function(e) {
            if (scope.bufferComplete) {
                // 1. Play video again
                // 2. Capture using Whammy.js
                scope.canCaptureContext = true;
                scope.videojs.play();
            }
        });
    },

    addVideo: function addVideo() {
        var scope = this;

        var status = document.getElementById('loader-status');
        status.innerHTML = "Video loaded to Canvas.";

        // calc width
        if (this.WIDTH > this.MAX_EDITOR_WIDTH) {
            this.VWIDTH = this.WIDTH * this.VIDEO_SCALE;
            this.VHEIGHT = this.HEIGHT * this.VIDEO_SCALE;
        } else {
            this.VWIDTH = this.WIDTH;
            this.VHEIGHT = this.HEIGHT;
        }

        this.videoElement = document.getElementById('mainVideo'.concat(this.API_SUFFIX));

        this.fabricVideo = new fabric.Image(this.videoElement, {
            width: scope.VWIDTH,
            height: scope.VHEIGHT,

            hasControls: false,
            hasBorders: false,
            selectable: false,
            hasRotatingPoint: false,

            defaultCursor: 'default',
            originY: 'top',
            originX: 'left',
            // centeredScaling: true
        });

        this.fabric.canvas.add(this.fabricVideo);
        this.fabric.canvas.sendToBack(this.fabricVideo); // <-- then send to back

        this.fabric.canvas.setWidth(652); //Math.floor(this.VWIDTH));
        this.fabric.canvas.setHeight(367); //Math.floor(this.VHEIGHT));

        console.log(scope.fabric.canvas.getWidth(), scope.fabric.canvas.getHeight());
    },

    compileWEBM: function compileWEBM() { // <_---- DITO
        var scope = this;

        // var video = new Whammy.Video(23);
        // var last_time = +new Date;
        // var context = this.clock(last_time += 1000);
        // video.add( context );
        // video.compile(false, function(output) {
        //     var url = webkitURL.createObjectURL(output);
        //     document.getElementById('awesome').src = url;
        // });

        this.whammy.compile(false, function(output) { // <--- The problem was fabric do not have defined width height
            var url = webkitURL.createObjectURL(output);
            document.getElementById('awesome').src = url;
        });
    },

    getContextAvailable: function getContextAvailable() {
        var scope = this;

        console.log('now capturing');
        var ctx = scope.$mainCanvas.get(0).getContext("2d");
        ctx.width = 652;
        ctx.height = 367;

        // console.log(ctx);
        // console.log('main', this.fabric.canvas.getContext('2d').canvas);
        // scope.canCaptureContext = false;
        // return;

        scope.whammy.add(ctx);

        // this.whammy.add(this.fabric.canvas); //<-- DITO
    },

    clock: function clock(time) {
        var now = new Date();

        now.setTime(time);
        var ctx = document.getElementById('dynamic-canvas').getContext('2d');
        ctx.save();
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 150, 150); // videos cant handle transprency
        ctx.translate(75, 75);
        ctx.scale(0.4, 0.4);
        ctx.rotate(-Math.PI / 2);
        ctx.strokeStyle = "black";
        ctx.fillStyle = "white";
        ctx.lineWidth = 8;
        ctx.lineCap = "round";

        // Hour marks
        ctx.save();
        for (var i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI / 6);
            ctx.moveTo(100, 0);
            ctx.lineTo(120, 0);
            ctx.stroke();
        }
        ctx.restore();

        // Minute marks
        ctx.save();
        ctx.lineWidth = 5;

        for (i = 0; i < 60; i++) {
            if (i % 5 != 0) {
                ctx.beginPath();
                ctx.moveTo(117, 0);
                ctx.lineTo(120, 0);
                ctx.stroke();
            }
            ctx.rotate(Math.PI / 30);
        }
        ctx.restore();

        var sec = now.getSeconds();
        var min = now.getMinutes();
        var hr = now.getHours();
        hr = hr >= 12 ? hr - 12 : hr;

        ctx.fillStyle = "black";

        // write Hours
        ctx.save();
        ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec)
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(80, 0);
        ctx.stroke();
        ctx.restore();

        // write Minutes
        ctx.save();
        ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec)
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(112, 0);
        ctx.stroke();
        ctx.restore();

        // Write seconds
        ctx.save();
        ctx.rotate(sec * Math.PI / 30);
        ctx.strokeStyle = "#D40000";
        ctx.fillStyle = "#D40000";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(83, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fillStyle = "#555";
        ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#325FA2';
        ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.restore();

        return ctx;
    }
}
