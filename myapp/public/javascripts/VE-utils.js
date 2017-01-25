var VE = window.VE || {};

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
};

VE.utils.toBlob = function toBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], { type: mimeString });
};

VE.utils.Prototype_WrapLine = function Prototype_WrapLine() {
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

VE.utils.Prototype_GetName = function Prototype_GetName(){
    fabric.Canvas.prototype.getItemsByName = function(name) {
      var objectList = [],
          objects = this.getObjects();

      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].name && objects[i].name === name) {
          objectList.push(objects[i]);
        }
      }
      return objectList;
    };
}
