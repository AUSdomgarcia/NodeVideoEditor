var VE = window.VE || {};

VE.TextBoxController = function TextBoxController(opts) {
	this.$ul = $('#dynamic-textbox');
	this.fabric = null;
	this.idCtr = 1;
};

VE.TextBoxController.prototype = {

	initialTextbox: function initialTextbox(){
		var scope = this;
		var ul = $(".list-textbox");


		$('#btnadd').on('click', function(){
			var text = $(this).parent().find('input[type="text"]').val();
			
			var fontSize = $('#fontSize').val();

			var lineHeight = $('#lineHeight').val();

			var color = $('#font-option').val();

			var fonts = $('#fonts option:selected').val();
			
			scope.fabric.data.push({ text: text });
				
			// clear
			$("#template-input").val('');

			ul.append(
				'<li data-id="">'+ text +
				'<button class="btn-delete">Delete</button></li>'
			);
			
			ul.find('li').last().attr('id', scope.fabric.getTextboxId( (scope.idCtr++), fonts, +fontSize, color, lineHeight, text ) );
		});

		ul.on('click', 'li > button',function(){
			var li = $(this).parent();
			var li_id = li.attr('id');
			
			scope.fabric.canvas.getItemByMyID( +li_id ).remove();
			
			scope.fabric.update();
			li.remove();
		});
	},

	attachFabric: function attachFabric(fabric){
		this.fabric = fabric;
	},

}