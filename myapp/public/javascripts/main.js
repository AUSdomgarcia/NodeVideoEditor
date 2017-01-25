"use strict";

// Window Hooks
window.addEventListener("DOMContentLoaded", function() {
    // Utils Text.prototype
    VE.utils.Prototype_WrapLine();
    VE.utils.Prototype_GetName();

    var $type = null;

    // Main Fabric
    var Fabric = new VE.fabric({ elemId: 'mycanvas' });

    // Request
    var Request = new VE.request({ root: 'http://sunsilk.storyteching.ph/', apiURL: 'http://sunsilk.storyteching.ph/api/template' });
    Request.attachFabric(Fabric);

    // Window Events
    window.addEventListener("resize", function() {
        Fabric.onResize();
    }, false);

    // Click Events
    var exportBtn = $('.exportBtn');
    exportBtn.on('click', function(evt) {

        //http://stackoverflow.com/questions/33716349/clone-canvas-with-fabric-js-and-continue-editing
        var clone = new VE.fabric({ elemId: 'dynamic-canvas' });

        clone.canvas.loadFromJSON(JSON.stringify(Fabric.canvas));
        clone.modifyDimension(900,900);
        clone.canvas.renderAll();

        var dataURL = clone.canvas.toDataURL("image/png");
        // var dataURL = Fabric.canvas.toDataURL("image/png");

        var blob = VE.utils.toBlob(dataURL);

        var fd = new FormData();

        fd.append('image', blob, 'any');
        fd.append('hashtag', Fabric.hashtag.textbox.getText());
        fd.append('name', Fabric.name.textbox.getText());
        fd.append('overlay_template_id', Request.overlayId);
        fd.append('video_template_id', Request.videoId);

        alert($type);

        fd.append('output_type', $type);

        $.ajax({
            type: 'POST',
            url: Request.root.concat('api/handle'),
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            console.log('JeffreyWayOfResponse:', data);
        });

        // Request.promise.post(Request.root.concat('api/handle'), {
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
    });

    // Document Hooks
    document.onreadystatechange = function() {
        if (document.readyState === 'complete' && typeof Fabric === 'object') {
            
            // check default first
            $('.canvas-type input[type="radio"]').each(function(evt){
                if( $(this).is(':checked') ){
                    $type = $(this).val();
                }
            });

            Fabric.setCanvasType($type);
            Fabric.addText();
            Fabric.onResize();
        }
    };

    // Canvas Type
    function bindUIElement(){
        $('.canvas-type').on('click','input[type="radio"]', function(evt){
            Fabric.setCanvasType(evt.target.value);
            $type = evt.target.value;
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

        // Request->Overlay(Image)
        Request.$overlayList.on('click', 'a', function(evt) {
            if (Request.canvas === null) return;
            var url = $(this).attr('data-overlay');
            var id = $(this).attr('data-id');
            Request.overlayId = id;
            Fabric.loadImage({ url: url });
        });

        Request.$videoList.on('click', 'a', function(evt) {
            if (Request.canvas === null) return;
            var url = $(this).attr('data-video');
            var id = $(this).attr('data-id');
            Request.videoId = id;

            var myvideo = document.getElementById('myvideo');

            myvideo.pause();

            var source = $('#myvideo').children();
            $(source[0])[0].src = url;
            myvideo.load();
            myvideo.play();
        });
    }


    bindUIElement();

    // var delay = setTimeout(function() {
    //     clearTimeout(delay);
    //     Fabric.setFont('Arial');
    //     Fabric.update();
    // }, 5000);
});
