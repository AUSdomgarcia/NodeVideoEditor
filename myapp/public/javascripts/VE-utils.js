var VE = window.VE || {};

// Text Base
VE.Text = function Text(caption) {
	var scope = this;
	this.$canvasContainer = $('.canvas-container');

    this.textbox = new fabric.Textbox(caption, {
        width: 300,
        top: 0,
        left: 0,
        fontSize: 22,
        fontFamily: 'Arial',
        textAlign: 'center',
        breakWords: true,

        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        perPixelTargetFind: true,
        targetFindTolerance: 4,
        selectable: false,
        hasRotatingPoint: false
    });
};

VE.Text.prototype = {
	setTopLeft: function setTopLeft(top,left){
		this.textbox.setTop(top);
		this.textbox.setLeft(left);
	},
    
	onResize : function onResize(){
		this.textbox.setHeight(this.$canvasContainer.height());
        this.textbox.setWidth(this.$canvasContainer.width());
    }
}

// UTILS
// =====
VE.utils = {};

VE.utils.overlayGroup = function overlayGroup(canvas) {
    var scope = this;
    var group = new fabric.Group([], {
        top: 0,
        left: 0,
        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        perPixelTargetFind: true,
        targetFindTolerance: 4,
        selectable: false,
        hasRotatingPoint: false
    });
    return group;
}

VE.utils.Extends_WrapLine = function Extends_WrapLine() {
    fabric.Textbox.prototype._wrapLine = function(ctx, text, lineIndex) {
        var lineWidth = 0,
            lines = [],
            line = '',
            words = text.split(' '),
            word = '',
            letter = '',
            offset = 0,
            infix = ' ',
            wordWidth = 0,
            infixWidth = 0,
            letterWidth = 0,
            largestWordWidth = 0;

        for (var i = 0; i < words.length; i++) {
            word = words[i];
            wordWidth = this._measureText(ctx, word, lineIndex, offset);
            lineWidth += infixWidth;

            // Break Words if wordWidth is greater than textbox width
            if (this.breakWords && wordWidth > this.width) {
                line += infix;
                var wordLetters = word.split('');
                while (wordLetters.length) {
                    letterWidth = this._getWidthOfChar(ctx, wordLetters[0], lineIndex, offset);
                    if (lineWidth + letterWidth > this.width) {
                        lines.push(line);
                        line = '';
                        lineWidth = 0;
                    }
                    line += wordLetters.shift();
                    offset++;
                    lineWidth += letterWidth;
                }
                word = '';
            } else {
                lineWidth += wordWidth;
            }

            if (lineWidth >= this.width && line !== '') {
                lines.push(line);
                line = '';
                lineWidth = wordWidth;
            }

            if (line !== '' || i === 1) {
                line += infix;
            }
            line += word;
            offset += word.length;
            infixWidth = this._measureText(ctx, infix, lineIndex, offset);
            offset++;

            // keep track of largest word
            if (wordWidth > largestWordWidth && !this.breakWords) {
                largestWordWidth = wordWidth;
            }
        }

        i && lines.push(line);

        if (largestWordWidth > this.dynamicMinWidth) {
            this.dynamicMinWidth = largestWordWidth;
        }
        return lines;
    };
};
