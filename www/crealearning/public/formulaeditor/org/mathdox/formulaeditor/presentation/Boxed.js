$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Boxed.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/PArray.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");

$main(function(){
  org.mathdox.formulaeditor.presentation.Boxed =
    $extend(org.mathdox.formulaeditor.presentation.PArray, {

    semanticClass : null,

    children : null,
    focusChildren : null,

    margin : 5,

    slowDelete: true,
    
    initialize : function(semanticClass, children, presentation, focusEntries) {
      this.semanticClass = semanticClass;

      /* fill entries from focusEntries */

      if (focusEntries === null || focusEntries === undefined) {
        focusEntries = children;
      }
      if ((focusEntries instanceof Array) && (focusEntries.length>0) && (!(focusEntries[0] instanceof Array))) {
        this.entries = [];
        this.entries.push(focusEntries);
      } else {
        this.entries = focusEntries;
      }

      if (this.entries !== null && this.entries !== undefined) {
        this.rows = this.entries.length;
        this.columns = this.entries[0].length;

        /* for all elements in entries: add them to focusChildren */
        this.focusChildren = [];
        for (var row = 0; row < this.rows; row++) {
          for (var col = 0; col < this.columns; col++) {
            this.focusChildren.push(this.entries[row][col]);
          }
        }
      }

      this.children = children;
      if (this.children !== null && this.children !== undefined) {
        this.presentation = presentation;
        this.updateChildren();
      }
    },

    draw : function(canvas, context, x, y, invisible) { 
      var dim = this.presentation.draw(canvas, context, 0, 0, true);

      var height = this.presentation.dimensions.height;
      var width = this.presentation.dimensions.width;

      this.dimensions = {
        height : height + 2*this.margin,
        width : width + 2* this.margin,
        left : dim.left + x,
        top : dim.top + y - this.margin 
      }

      this.drawHighlight(canvas, invisible);

      if (!invisible) {
        canvas.drawBox(this.dimensions, "#7F7F7F");
        this.presentation.draw(canvas, context, x + this.margin, y, false);
      }

      return this.dimensions;
    },

    getFirstCursorPosition : function(index) {
      return this.getFollowingCursorPosition();
    },
    
    getLastCursorPosition : function(index) {
      return this.getPrecedingCursorPosition();
    },

    getCursorPosition : function(x, y) {
      /* starting minimum is distance to closest side border */
      var dminx = Math.min(Math.abs(x- this.dimensions.left),Math.abs((this.dimensions.left+this.dimensions.width) - x));
      var dminy = Math.min(Math.abs(y- this.dimensions.top),Math.abs((this.dimensions.top+this.dimensions.height) - y));
      var dmin = dminx+dminy;
      var dx,dy;
      var id = -1;
      
      for (var i = 0; i< this.focusChildren.length; i++) {
        var child = this.focusChildren[i];
        if (x < child.dimensions.left) {
          dx = child.dimensions.left - x;
        } else if (x <= child.dimensions.left + child.dimensions.width) {
          dx = 0;
        } else {
          dx = x - (child.dimensions.left + child.dimensions.width);
        }
        if (y < child.dimensions.top) {
          dy = child.dimensions.top - y;
        } else if (y <= child.dimensions.top + child.dimensions.height) {
          dy = 0;
        } else {
          dy = y - (child.dimensions.top + child.dimensions.height);
        }
         
	if (dx+dy<dmin) {
          id = i;
          dmin = dx+dy;
        }
      }

      var pos;
      if (id >=0) {
        pos = this.focusChildren[id].getCursorPosition(x,y);
        if (pos !== null) {
          return pos;
        } else {
          if (x >= this.focusChildren[id].dimensions.left + this.focusChildren[idx].dimensions.width) {
            return this.focusChildren[id].getPrecedingCursorPosition();
          } else {
            return this.focusChildren[id].getFollowingCursorPosition();
          }
        }
      } else { /* code from Node.js */
        if (this.parent !== null) {
          if (x < this.dimensions.left + this.dimensions.width / 2) {
            return this.parent.getPrecedingCursorPosition(this.index+1,false);
          }
          else {
            return this.parent.getFollowingCursorPosition(this.index,false);
          }
        } else {
          return null;
        }
      }
    },

    getSemantics : function(context) {
      var values = [];
      var i;
      for (i=0; i<this.children.length; i++) {
        values.push(this.children[i].getSemantics(context).value);
      }

      var value = null;

      if (this.semanticClass !== null) {
	value = new this.semanticClass();
	value.initialize.apply(value, values);
      }

      return {
        value : value,
        rule : "braces"
      }

    }
  });

});
