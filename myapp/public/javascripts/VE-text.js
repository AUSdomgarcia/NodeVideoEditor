var VE = window.VE || {};

VE.Text = function Text(caption) {
    var scope = this;
    this.$canvasContainer = $('.canvas-container');

    this.textbox = new fabric.Textbox(caption, {
        width: 300,
        top: 0,
        left: 0,
        fontSize: 22,
        fontFamily: 'Arial',
        textAlign: 'center',
        breakWords: true,

        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        perPixelTargetFind: true,
        targetFindTolerance: 4,
        selectable: false,
        hasRotatingPoint: false
    });
};

VE.Text.prototype = {
    setTopLeft: function setTopLeft(top, left) {
        this.textbox.setTop(top);
        this.textbox.setLeft(left);
    },

    onResize: function onResize() {
        this.textbox.setHeight(this.$canvasContainer.height());
        this.textbox.setWidth(this.$canvasContainer.width());
    }
};