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
    initText: function initText() {
        var scope = this;
        this.name = new VE.Text('Domz Garcia');
        this.hashtag = new VE.Text('#SunsilkHastags');
        this.hashtag.setTopLeft(465, 0);
        // add text
        this.canvas.add(this.name.textbox);
        this.canvas.add(this.hashtag.textbox);
    },

    updateName: function updateName(value){
        var scope = this;
        this.name.setText(value);
        this.canvas.renderAll();
    },

    updateHashtag: function updateHashtag(value){
        var scope = this;
        this.hashtag.setText(value);
        this.canvas.renderAll();
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
            });

            if (!scope.canvas.contains(scope.group)) {
                scope.group.addWithUpdate(loadedImg);                
            } else {
                scope.group.addWithUpdate(loadedImg);
            }

            // Remove every changes
            scope.removeOverlay();

            // Bring Text to top
            scope.canvas.bringToFront(scope.name.textbox);
            scope.canvas.renderAll();
        });
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