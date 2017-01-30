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

    this.textArr = [];

    this.videoJS = null;

    this.HEIGHT = Math.floor(900 * this.SCALE_IMAGE);
    this.WIDTH = Math.floor(900 * this.SCALE_IMAGE);

    this.data = [{ text:"Sample", id: 0 }];
};

VE.fabric.prototype = {

    deleteById: function deleteById(id){
        // 
    },

    getTextboxId: function getTextboxId(id, fonts, fontsize, color, lineHeight, text){
        var scope = this;

        this.DTextbox = new VE.Text(id, fonts, fontsize, color, lineHeight, text);

        this.textArr.push.apply(this.textArr, [this.DTextbox]);

        this.canvas.add(this.DTextbox.textbox);

        this.canvas.setActiveObject(this.DTextbox.textbox);

        this.canvas.renderAll();

        return scope.DTextbox.getId();
    },

    selectObjectById: function selectObjectById(){
        // 
    },

    attachVideoJS: function attachVideoJS(plugin){
        var scope = this;
        this.videoJS = plugin;        
    },

    setCanvasType: function setCanvasType(type){
        var scope = this;

        switch(type){
            case 'image':
                this.canvas.setHeight(this.HEIGHT); // <--- IBALIK
                this.canvas.setWidth(this.WIDTH); // <--- IBALIK
                
                // DISABLE VIDEO EVENTS AND DISPLAY
                this.videoJS.videojs.pause();
                this.videoJS.$two.hide();
                this.videoJS.$loaderStatus.hide();
            break;

            case 'video':
                // this.canvas.setHeight(Math.floor(367)); // <--- IBALIK
                // this.canvas.setWidth(Math.floor(652)); // <--- IBALIK
                this.videoJS.$loaderStatus.show();
                this.videoJS.$two.show();
            break;
        }
    },

    // modifyFont: function modifyFont(fontface, fontsize){
    //     this.textArr.map(function(el){
    //         el.modifyFont(fontface, fontsize);
    //     });
    // },

    defaultText: function defaultText() {
        var scope = this;
        // instance
        // this.name = new VE.Text('Sunsilk PH');
        // this.hashtag = new VE.Text('#SomeHashtagGoals');

        // this.textArr.push.apply(this.textArr, [this.name, this.hashtag]);

        // Coord
        // var offset = -14;
        // var itr = 0;

        // this.textArr.map(function(el){
        //     el.modifyWidth(125);
        //     el.setTopLeft(150 * itr, ( (scope.WIDTH/2) - (scope.name.WIDTH/2) + offset) );
        //     scope.canvas.add(el.textbox);
        //     itr++;
        // });

        // this.canvas.renderAll();
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

    clear: function clear(){
        var objects = this.canvas.getObjects();
        for (var i in objects) {
            delete objects[i];
            this.canvas.remove(objects[i]);
            this.update();
        }

        // For active
        if(this.canvas.getActiveGroup()){
              this.canvas.getActiveGroup().forEachObject(function(o){ this.canvas.remove(o) });
              this.canvas.discardActiveGroup().renderAll();
        } else {
          this.canvas.remove(this.canvas.getActiveObject());
        }

        this.update();
    },

    loadImage: function loadImage(opts) {
        var scope = this;
        this.url = opts.url;

        var requestImg = new fabric.Image.fromURL(this.url, function(loadedImg) {
            alert('Image Loaded!');
            // config
            loadedImg.set({
                left: 0,
                top: 0,
                height: scope.canvas.getHeight(),
                width: scope.canvas.getWidth()
            });
            
            scope.group.addWithUpdate(loadedImg);
            scope.textArr.map(function(el){
                scope.canvas.bringToFront(el.textbox);
            });
            // scope.removeOverlay();
            scope.canvas.renderAll();
            
        } , { crossOrigin: 'Anonymous' });
    },

    onResize: function onResize() {
        var scope = this;

        this.textArr.map(function(el){
            el.onResize();
        });
        this.canvas.renderAll();
    },

    update: function update(){
        this.canvas.renderAll();
    },

    returnInitialSize: function returnInitialSize(){
        var scope = this;

        this.canvas.setHeight(this.HEIGHT);
        this.canvas.setWidth(this.WIDTH);
    },

    modifyDimension : function modifyDimension(w,h){
        this.canvas.setWidth(Math.floor(w)); // <--- IBALIK
        this.canvas.setHeight(Math.floor(h)) // <--- IBALIK
        this.update();
    },

    zoomIt: function zoomIt(factor) {
        this.canvas.setHeight(Math.floor(this.canvas.getHeight() * factor)); // <--- IBALIK
        this.canvas.setWidth(Math.floor(this.canvas.getWidth() * factor)); // <--- IBALIK

        if (this.canvas.backgroundImage) {
            // Need to scale background images as well
            var bi = this.canvas.backgroundImage;
            bi.width = bi.width * factor; bi.height = bi.height * factor;
        }
        var objects = this.canvas.getObjects();
        for (var i in objects) {
            var scaleX = objects[i].scaleX;
            var scaleY = objects[i].scaleY;
            var left = objects[i].left;
            var top = objects[i].top;

            var tempScaleX = scaleX * factor;
            var tempScaleY = scaleY * factor;
            var tempLeft = left * factor;
            var tempTop = top * factor;

            objects[i].scaleX = tempScaleX;
            objects[i].scaleY = tempScaleY;
            objects[i].left = tempLeft;
            objects[i].top = tempTop;

            objects[i].setCoords();
        }
        this.canvas.renderAll();
        this.canvas.calcOffset(); // <--- IBALIK
    },

    onContextUpdate: function onContextUpdate(){
        
    }
}
