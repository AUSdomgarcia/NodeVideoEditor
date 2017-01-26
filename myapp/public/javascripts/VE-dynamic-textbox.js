var VE = window.VE || {};

VE.dynamicTextbox = function dynamicTextbox(opts) {
	this.$ul = $('#dynamic-textbox');
};

VE.dynamicTextbox.prototype = {

	initialTextbox: function initialTextbox(){

		var HTMLtemplate = 
		'<li>' 					+
		'<input type="text">'   +
		'<button>Add</button>'  +
		'<button>Edit</button>' +
		'</li>';

		this.$ul.append(HTMLtemplate);
	}
}