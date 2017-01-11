"use strict";

window.addEventListener("DOMContentLoaded", function() {
    // Utils Text.prototype
    VE.utils.Extends_WrapLine();

    // Main Fabric
    var Fabric = new VE.fabric({ elemId: 'mycanvas' });
    Fabric.addText();
    Fabric.onResize();

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
        var url = Fabric.canvas.toDataURL("image/png");
        var blob = VE.utils.toBlob(url);
        var fd = new FormData();

        fd.append('image', blob, 'any');
        fd.append('hashtag', Fabric.hashtag.textbox.getText());
        fd.append('name', Fabric.name.textbox.getText());
        fd.append('overlay_template_id', Request.overlayId);
        fd.append('video_template_id', Request.videoId);

        // $.ajax({
        //     type: 'POST',
        //     url: Request.root.concat('api/handle'),
        //     data: fd,
        //     processData: false,
        //     contentType: false
        // }).done(function(data) {
        //     console.log(data);
        // });

        Request.promise.post(Request.root.concat('api/handle'), {
            data: fd
        }, {
            // 'Content-Type': 'application/json'
            'Content-Type': false
        })
        .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                if (error) throw error;
            });
    });

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

    // Inputs
    var KeyInputs = new VE.KeyInputs();
    KeyInputs.hashtag.on("change paste keyup", function(evt) {
        var value = $(this).val();
        Fabric.hashtag.textbox.setText(value);
        Fabric.canvas.renderAll();
    });

    KeyInputs.name.on("change paste keyup", function(evt) {
        var value = $(this).val();
        Fabric.name.textbox.setText(value);
        Fabric.canvas.renderAll();
    });


});
