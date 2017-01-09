var VE = window.VE || {};

VE.Keyboard = function Keyboard() {
    var scope = this;

    this.hashtagInput = $('#hashtagInput');
    this.nameInput = $('#nameInput');

    this.hashtagInput.on("change paste keyup", function(evt) {
        console.log($(this).val());
    });
};

VE.Keyboard.prototype = {
    helper: function helper(){
    	// ..
    }
};
