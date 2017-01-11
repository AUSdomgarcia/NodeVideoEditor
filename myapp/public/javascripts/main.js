"use strict";

window.addEventListener("DOMContentLoaded", function() {
    // Utils Text.prototype
    VE.utils.Extends_WrapLine();

    // Main Fabric
    var Fabric = new VE.fabric({ elemId: 'mycanvas' });
    Fabric.addText();
    Fabric.onResize();

    // Loaders
    var Loader = new VE.loader({ root: 'http://sunsilk.storyteching.ph/', apiURL: 'http://sunsilk.storyteching.ph/api/template' });
    Loader.attachFabric(Fabric);

    // Window Events
    window.addEventListener("resize", function() {
        Fabric.onResize();
    }, false);

    // Click Events
    var exportBtn = $('.exportBtn');
    exportBtn.on('click', function(evt) {
        var url = fabric.canvas.toDataURL("image/png");
        document.write('<img src="' + url + '"/>');
    });

    Loader.$overlayList.on('click', 'a', function(evt) {
        if (Loader.canvas === null) return;
        var url = $(this).attr('data-overlay');
        Fabric.loadImage({ url: url });
    });

    Loader.$videoList.on('click', 'a', function(evt) {
        if (Loader.canvas === null) return;
        var url = $(this).attr('data-video');
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
