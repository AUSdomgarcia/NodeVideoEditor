"use strict";

// Window Hooks
window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();


window.addEventListener("DOMContentLoaded", function() {
    // Utils Text.prototype
    VE.utils.Prototype_WrapLine();
    VE.utils.Prototype_GetName();

    var $type = null;

    // Main Fabric
    var Fabric = new VE.fabric({ elemId: 'mainCanvas' });

    // Loader
    var Loader = new VE.loader({ root: 'http://sunsilk.storyteching.ph/', apiURL: 'http://sunsilk.storyteching.ph/api/template' });
    Loader.attachFabric(Fabric);

    // dynamicTextbox
    var dynamicTextbox = new VE.dynamicTextbox();
    dynamicTextbox.initialTextbox();

    // Video loaded
    var VideoJS = new VE.videoJS();
    VideoJS.attachFabric(Fabric);

    var request;

    var render = function() { // <--- DITO

        if (typeof Fabric !== 'object' || typeof VideoJS !== 'object') return;

        VE.utils.resetFPSto(23, fabric.util.requestAnimFrame, function() {

            if (VideoJS.videojs.paused() === false) {

                if (VideoJS.bufferComplete === true && VideoJS.isVideoAdded === true) {
                    Fabric.canvas.renderAll();
                }

                if (VideoJS.canCaptureContext === true) {
                    VideoJS.getContextAvailable();
                }
            }

        });
    };

    fabric.util.requestAnimFrame(render);

    // Window Events
    window.addEventListener("resize", function() {
        Fabric.onResize();
    }, false);

    var module = {
        videoModule: {
            controllerByType: function controllerByType(type) {
                switch (type) {
                    case 'image':
                        // $('#myvideo').get(0).pause();
                        // $('#myvideo').hide();
                        break;
                    case 'video':
                        // $('#myvideo').get(0).play();
                        // $('#myvideo').show();
                        break;
                }
            }
        },

        UImodule: {
            bindEvents: function bindEvents() {
                // Radio Button
                $('.canvas-type').on('click', 'input[type="radio"]', function(evt) {
                    Fabric.setCanvasType(evt.target.value);
                    $type = evt.target.value;

                    module.videoModule.controllerByType($type);
                });
                // Keybord Input
                var KeyboardInput = new VE.KeyboardInput();
                KeyboardInput.hashtag.on("change paste keyup", function(evt) {
                    var value = $(this).val();
                    Fabric.hashtag.textbox.setText(value);
                    Fabric.canvas.renderAll();
                });

                KeyboardInput.name.on("change paste keyup", function(evt) {
                    var value = $(this).val();
                    Fabric.name.textbox.setText(value);
                    Fabric.canvas.renderAll();
                });
                // Loader Image 
                Loader.$overlayList.on('click', 'a', function(evt) {
                    if (Loader.canvas === null) return;
                    var url = $(this).attr('data-overlay');
                    var id = $(this).attr('data-id');
                    Loader.overlayId = id;
                    Fabric.loadImage({ url: url });
                });
                // Loader Video
                Loader.$videoList.on('click', 'a', function(evt) {
                    if (Loader.canvas === null) return;
                    var url = $(this).attr('data-video');
                    var id = $(this).attr('data-id');
                    Loader.videoId = id;

                    var myvideo = document.getElementById('myvideo');

                    myvideo.pause();

                    var source = $('#myvideo').children();
                    $(source[0])[0].src = url;
                    myvideo.load();
                    myvideo.play();
                });
            }
        },

        templateModule: {
            templatefunction: function templatefunction() {
                // Awesome!
            }
        }
    }

    // Click Events
    var exportBtn = $('.exportBtn');
    exportBtn.on('click', function(evt) {

        //http://stackoverflow.com/questions/33716349/clone-canvas-with-fabric-js-and-continue-editing

        Fabric.zoomIt(1.65); // to achieve size 898x898

        var dataURL = Fabric.canvas.toDataURL("image/png");

        var blob = VE.utils.toBlob(dataURL);

        var fd = new FormData();

        fd.append('image', blob, 'any');
        fd.append('hashtag', Fabric.hashtag.textbox.getText());
        fd.append('name', Fabric.name.textbox.getText());
        fd.append('overlay_template_id', Loader.overlayId);
        fd.append('video_template_id', Loader.videoId);
        fd.append('output_type', $type);

        alert($type);

        Fabric.modifyDimension(495, 495);
        Fabric.clear();

        $.ajax({
            type: 'POST',
            url: Loader.root.concat('api/handle'),
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            console.log('JeffreyWayOfResponse:', data);

        });
    });

    // Document Hooks
    document.onreadystatechange = function() {
        if (document.readyState === 'complete' && typeof Fabric === 'object') {

            // check default first
            $('.canvas-type input[type="radio"]').each(function(evt) {
                if ($(this).is(':checked')) {
                    $type = $(this).val();
                }
            });

            module.videoModule.controllerByType($type);

            module.UImodule.bindEvents();

            Fabric.setCanvasType($type);

            Fabric.defaultText();

            Fabric.modifyFont('Arial', 25);

            Fabric.onResize();

        }
    };
});





// var delay = setTimeout(function() {
//     clearTimeout(delay);
//     Fabric.update();
// }, 5000);

// Loader.promise.post(Loader.root.concat('api/handle'), {
//     data: fd
// }, {
//     // 'Content-Type': 'application/json'
//     'Content-Type': false
// })
// .then(function(response) {
//         console.log(response);
//     })
//     .catch(function(error) {
//         if (error) throw error;
//     });
