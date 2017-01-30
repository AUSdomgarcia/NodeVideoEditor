var VE = window.VE || {};

VE.Text = function Text(idRef, fontRef, fontSizeRef, colorRef, lineHeightRef, textRef) {

    var scope = this;

    this.$canvasContainer = $('.canvas-container');

    this.textbox = new fabric.Textbox(textRef, {

        id: idRef,

        width: 200,
        top: 0,
        left: 0,
        fontSize: fontSizeRef,

        fontFamily: fontRef,

        textAlign: 'center',
        breakWords: true,
        
        lineHeight: lineHeightRef || 0.8,
        
        editable: false,

        // fontFamily: 'DancingintheMoonlight',
        // hasControls: false,
        // hasBorders: false,
        // hoverCursor: 'default',
        // selectable: false,
        // hasRotatingPoint: false

        hasControls: true,
        hasBorders: true,
        selectable: true,
        hasRotatingPoint: true,

        perPixelTargetFind: true,
        targetFindTolerance: 4,
    });

    this.textbox.set({ fill: '#' + colorRef })

    this.HEIGHT = this.textbox.getHeight();
    this.WIDTH = this.textbox.getWidth();
};

VE.Text.prototype = {

    getId: function getId() {
        return this.textbox.id;
    },

    setTopLeft: function setTopLeft(top, left) {
        this.textbox.setTop(top);
        this.textbox.setLeft(left);
    },

    modifyWidth: function modifyWidth(value) {
        this.textbox.setWidth(value);
        this.WIDTH = this.textbox.getWidth();
    },

    modifyFont: function modifyFont(fontface, fontsize) {
        this.textbox.fontFamily = fontface;
        this.textbox.fontSize = fontsize;
    },

    onResize: function onResize() {
        if (this.HEIGHT !== 0 && this.WIDTH !== 0) {
            this.textbox.setHeight(this.HEIGHT);
            this.textbox.setWidth(this.WIDTH);
        }
    }
};
