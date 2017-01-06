(function(){
	"use strict";

	var fabric = new VE.fabric({elemId:'mycanvas'});

	function autoClick(){
		fabric.loadImage({url:'./images/png1.png'});
	}
	
	autoClick();

})();