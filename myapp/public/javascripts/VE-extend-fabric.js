var VE = window.VE || {};

VE.fabric = function Fabric(opts) {
    var scope = this;

    this.elemId = opts.elemId;
    this.canvas = new fabric.Canvas(this.elemId);
};

VE.fabric.prototype = {
	loadImage: function loadImage(opts){
		var scope = this;
		this.url = opts.url;

		var requestImg = new fabric.Image.fromURL(this.url, function(loadedImg){
			scope.canvas.add(loadedImg);
		});
	},
}