"use strict";

window.addEventListener("DOMContentLoaded", function() {
    // Utils Text.prototype
    VE.utils.Extends_WrapLine();

    // Main Fabric
    var fabric = new VE.fabric({ elemId: 'mycanvas' });
    fabric.initText();
    fabric.onResize();

    var exportBtn = $('.exportBtn');

    exportBtn.on('click', function(evt) {
        var url = fabric.canvas.toDataURL("image/png");
        document.write('<img src="' + url + '"/>');
    });

    window.addEventListener("resize", function() {
        fabric.onResize();
    }, false);

    function add1() {
        fabric.loadImage({ url: './images/png1.png' });
    }

    function add2() {
        fabric.loadImage({ url: './images/png2.png' });
    }

    var is = true;
    $('.template-overlay-controls').on('click', 'a', function(evt) {
        var bool = is ? false : true;
        is = bool;
        if (is) {
            add1();
        } else {
            add2();
        }
    });
});
