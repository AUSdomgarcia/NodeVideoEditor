var VE = window.VE || {};

VE.fabric = function Fabric(opts) {
    var scope = this;
    this.$canvasContainer = $('.canvas-container');
    // props
    this.elemId = opts.elemId;
    this.canvas = new fabric.Canvas(this.elemId);
    this.canvas.setHeight(this.$canvasContainer.height());
    this.canvas.setWidth(this.$canvasContainer.width());
    // group
    this.group = VE.utils.overlayGroup(fabric.canvas);
    this.canvas.add(this.group);
};

VE.fabric.prototype = {

    addText: function addText() {
        var scope = this;
        this.name = new VE.Text('Sunsilk PH');
        this.hashtag = new VE.Text('#SunsilkHastags');
        this.hashtag.setTopLeft(465, 0);
        // add text
        this.canvas.add(this.name.textbox);
        this.canvas.add(this.hashtag.textbox);
    },

    getText : function getText(text){
        var scope = this;
        return this[text];
    },

    removeOverlay: function removeOverlay() {
        var scope = this;
        var len = this.group.getObjects().length;
        if (len > 1) {
            var items = this.group.getObjects();
            this.group.remove(items[0]);
            this.canvas.renderAll();
        }
    },

    loadImage: function loadImage(opts) {
        var scope = this;
        this.url = opts.url;

        var requestImg = new fabric.Image.fromURL(this.url, function(loadedImg) {
            // config
            loadedImg.set({
                left: 0,
                top: 0,
                height: scope.$canvasContainer.height(),
                width: scope.$canvasContainer.width()
            });

            if (!scope.canvas.contains(scope.group)) {
                scope.group.addWithUpdate(loadedImg);
            } else {
                scope.group.addWithUpdate(loadedImg);
                scope.canvas.bringToFront(scope.name.textbox);
                scope.canvas.bringToFront(scope.hashtag.textbox);
                scope.removeOverlay();
            }

            scope.canvas.renderAll();
            
        } , { crossOrigin: 'Anonymous' });
    },

    onResize: function onResize() {
        var scope = this;
        this.canvas.setHeight(this.$canvasContainer.height());
        this.canvas.setWidth(this.$canvasContainer.width());
        // Name
        this.name.onResize();
        this.hashtag.onResize();
        this.canvas.renderAll();
    }
}
