var VE = window.VE || {};

VE.fabric = function Fabric(opts) {
    var scope = this;
    this.$canvasContainer = $('.canvas-container');
    // props
    this.elemId = opts.elemId;
    this.canvas = new fabric.Canvas(this.elemId);

    this.SCALE_VIDEO = 1.5;
    this.SCALE_IMAGE = 0.55;

    // group
    this.group = VE.utils.overlayGroup(fabric.canvas);
    this.canvas.add(this.group);

    console.log(this.WIDTH,this.HEIGHT);
};

VE.fabric.prototype = {
    setCanvasType: function setCanvasType(type){
        switch(type){
            case 'image':
                this.canvas.setHeight(900 * this.SCALE_IMAGE);
                this.canvas.setWidth(900 * this.SCALE_IMAGE);
            break;

            case 'video':
                this.canvas.setHeight(180 * this.SCALE_VIDEO);
                this.canvas.setWidth(320 * this.SCALE_VIDEO);
            break;
        }

        this.HEIGHT = this.canvas.getHeight();
        this.WIDTH = this.canvas.getWidth();

        this.update();
    },

    setFont: function setFont(fontface){
        this.hashtag.setFont(fontface);
        this.name.setFont(fontface);
    },

    addText: function addText() {
        var scope = this;
        // instance
        this.name = new VE.Text('Sunsilk PH');
        this.hashtag = new VE.Text('#SunsilkHastags');

        // Coord
        var offset = -14;
        this.name.modifyWidth(125);
        this.name.modifyFont('Arial', 18);
        this.name.setTopLeft(150, ( (this.WIDTH/2) - (this.name.WIDTH/2) + offset) );

        console.log('name', this.name.WIDTH, 'canvas', this.WIDTH/2);

        this.hashtag.setTopLeft(0, scope.WIDTH/2);
        
        // add text
        this.canvas.add(this.name.textbox);

        // this.canvas.add(this.hashtag.textbox);
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
                height: scope.HEIGHT,
                width: scope.WIDTH
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
        // Disable Resize
        // this.canvas.setHeight(this.$canvasContainer.height());
        // this.canvas.setWidth(this.$canvasContainer.width());

        // Name
        this.name.onResize();
        this.hashtag.onResize();
        this.canvas.renderAll();
    },

    update: function update(){
        this.canvas.renderAll();
    },

    modifyDimension : function modifyDimension(w,h){
        this.canvas.setWidth(w);
        this.canvas.setHeight(h);
        this.update();
    }
}
