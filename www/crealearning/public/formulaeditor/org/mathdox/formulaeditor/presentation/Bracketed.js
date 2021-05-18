$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/Bracketed.js");

$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");

$main(function(){

  /**
   * Representation of a column of mathematical expressions in the presentation
   * tree.
   */
  org.mathdox.formulaeditor.presentation.Bracketed =
    $extend(org.mathdox.formulaeditor.presentation.Node, {
      // array
      middle : null,
      // left bracket
      leftBracket : null,
      // right bracket
      rightBracket : null,
      // should we draw boxes ?
      drawBox : false,
      // enable slow deleting
      slowDelete : true,
      // enable splitting into brackets and content
      separable : true,

      /**
       * Draws the matrix to the canvas.
       *
       * See also: org.mathdox.formulaeditor.presentation.Node.draw
       */
      draw : function(canvas, context, x, y, invisible) {
        var height;
        var ldheight = 0, rdheight = 0;
        var bracketheight=0;
        var ldwidth = 0, rdwidth = 0;

        // invisible drawing of array to set dimensions
        
        this.middle.draw(canvas, context, 0, 0, true);

        // if the left and right symbols are brackets set the height
        // invisible drawing of brackets to set dimensions
        
        if (this.leftBracket !== null && this.leftBracket !== undefined) {
          this.leftBracket.minimumHeight = this.middle.dimensions.height;
          this.leftBracket.draw(canvas, context, 0, 0, true);
          ldheight = this.leftBracket.dimensions.height;
          bracketheight = ldheight;
          ldwidth = this.leftBracket.dimensions.width;
        }
        if (this.rightBracket !== null && this.rightBracket !== undefined) {
          this.rightBracket.minimumHeight = this.middle.dimensions.height;
          this.rightBracket.draw(canvas, context, 0, 0, true);
          rdheight = this.rightBracket.dimensions.height;
          if (bracketheight === 0 ) {
            bracketheight = rdheight;
          }
          rdwidth = this.rightBracket.dimensions.width;
        }


        height = Math.max(
            ldheight,
            this.middle.dimensions.height,
            rdheight);

        var yAdjust = 0;
        var yAdjustBrackets = 0;
        
        // brackets are higher than the array
        if (height>this.middle.dimensions.height) {
          yAdjust = (height - this.middle.dimensions.height)/2;
        }

        // brackets are smaller than the array
        // assuming right bracket has the same size as the left bracket

        if (bracketheight<height) {
          yAdjustBrackets = (height - bracketheight)/2;
        }

        this.dimensions = { 
          height : height,
          width : 
            ldwidth + 
            this.middle.dimensions.width +
            rdwidth,
          left : x,
          top : y + this.middle.dimensions.top - yAdjust
        };
        
        this.drawHighlight(canvas, invisible);

        if (this.leftBracket !== null && this.leftBracket !== undefined) {
          this.leftBracket.minimumHeight = this.middle.dimensions.height;
          this.leftBracket.draw(canvas, context,  
            x - this.leftBracket.dimensions.left, 
            this.dimensions.top + yAdjustBrackets - 
            this.leftBracket.dimensions.top, 
            invisible);
        }

        this.middle.draw(canvas, context,  
          x + ldwidth - this.middle.dimensions.left, 
          y, invisible);

        if (this.rightBracket !== null && this.rightBracket !== undefined) {
          this.rightBracket.minimumHeight = this.middle.dimensions.height;
          this.rightBracket.draw(canvas, context, 
            x + this.rightBracket.dimensions.width + 
              this.middle.dimensions.width - this.rightBracket.dimensions.left,
            this.dimensions.top + yAdjustBrackets - 
            this.rightBracket.dimensions.top, 
            invisible);
        }
        
        if ((!invisible) &&this.drawBox) {
          canvas.drawBox(this.middle.dimensions);

          if (this.leftBracket !== null && this.leftBracket !== undefined) {
            canvas.drawBoxWithBaseline(this.leftBracket.dimensions, this.dimensions.top + this.dimensions.height - yAdjustBrackets);
          }

          if (this.rightBracket !== null && this.rightBracket !== undefined) {
            canvas.drawBoxWithBaseline(this.rightBracket.dimensions, this.dimensions.top + this.dimensions.height - yAdjustBrackets);
          }

          canvas.drawBoxWithBaseline(this.dimensions,y);
        }

        return this.dimensions;
      },
      functionsFromRow : [ "getFirstCursorPosition",
        "getLastCursorPosition", "getLowerCursorPosition",
        "getHigherCursorPosition" ],
      getCursorPosition: function(x,y) {
        var dimensions;

        dimensions = this.leftBracket.dimensions;
        if (x < dimensions.left + dimensions.width) {
          if (this.parent !== null) {
            return { row: this.parent, index: this.index };
          } else {
            return null;
          }
          return this.getFollowingCursorPosition();
        }
        dimensions = this.middle.dimensions;
        if (x < dimensions.left + dimensions.width) {
          return this.middle.getCursorPosition(x,y);
        }
        if (this.parent !== null) {
          return { row: this.parent, index: this.index+1 };
        } else {
          return this.getPrecedingCursorPosition();
        }
      },
      getFollowingCursorPosition : function(index, descend) {

        // default value for descend
        if (descend === null || descend === undefined) {
          descend = true;
        }

        // when index is not specified, return the first position in the array
        if (index === null || index === undefined) {
          return this.middle.getFollowingCursorPosition();
        }
        
        var result = null;

        if (index === 0) {
          if (descend) {
            result = this.middle.getFollowingCursorPosition();
          }
        }

        if (result === null) {
          // when we're at the end of the matrix, ask the parent of the matrix
          // for the position following this matrix
          if (this.parent !== null) {
            return this.parent.getFollowingCursorPosition(this.index, false);
          }
        }
        
        return result;
      },
      getPrecedingCursorPosition : function(index, descend) {

        // default value for descend
        if (descend === null || descend === undefined) {
          descend = true;
        }

        // when index is not specified, return the first position in the array
        if (index === null || index === undefined) {
          return this.middle.getPrecedingCursorPosition();
        }
        
        var result = null;

        if (index == 1) {
          if (descend) {
            result = this.middle.getPrecedingCursorPosition();
          }
        }

        if (result === null) {
          // when we're at the beginning of the matrix, ask the parent of the
          // matrix for the position before this matrix
          if (this.parent !== null) {
            return this.parent.getPrecedingCursorPosition(this.index+1, false);
          }
        }
        
        return result;
      },
      initialize : function () {
        if (arguments.length>0) {
          this.leftBracket = arguments[0];
          this.middle = arguments[1];
          this.rightBracket = arguments[2];
          this.children = [];
          this.children.push(this.middle);
        } else {
          this.children = [];
        }

        var presentation = org.mathdox.formulaeditor.presentation;
        /* copy the cursor/position functions from Row */

        var row = new presentation.Row(); // only an instance has the functions

        for (var i=this.functionsFromRow.length - 1; i>=0; i--) {
          if (! this[this.functionsFromRow[i]] ) {
            this[this.functionsFromRow[i]] = 
              row[ this.functionsFromRow[i] ];
          }
        }
        this.updateChildren();
      },
      /**
       * Returns a copy of this presentation object, without index information
       * To be used for copy/paste or undo. See also Presentation/Node.js
       */
      copy : function () {
        return this.clone(this.leftBracket.copy(), this.children[0].copy(), this.rightBracket.copy());
      },
      getSemantics: function(context) {
        var sem = this.middle.getSemantics(context, null, null, "functionArguments", null);
        var value = sem.value;

        if (!(value instanceof Array)) {
          value.addExplicitBrackets();
          return {
            rule: "braces",
            value: value
          };
        } else if (value.length === 1) {
          // NOTE: probably should not occur
          value[0].addExplicitBrackets();
          return {
            rule: "braces",
            value: value[0]
          };
        } else {
          return {
            rule: "bracesWithSeparatedArguments",
            value: value
          };
        }
      }
    });

  var presentation = org.mathdox.formulaeditor.presentation;

  org.mathdox.formulaeditor.presentation.Row =
    $extend(org.mathdox.formulaeditor.presentation.Row, {
      checkRemove : function(editor, position) {
        if (this.parent && this.parent instanceof presentation.Bracketed && this.parent.separable === true &&
            this.parent.parent && this.parent.parent instanceof presentation.Row) {
          var index = this.parent.index;
          var moveright;
          var i;
          var value;
          
          if (position == "start") {
            if (this.parent.rightBracket !== null && this.parent.rightBracket !== undefined) {
              value = this.parent.rightBracket.value;
              if (value !== null && value!==undefined && value !== "")  {

                moveright = this.parent.parent.insert(index, new presentation.Symbol(value));
                if (moveright) {
                  index++;
                }    
                index--;
              }
            }

            for (i=0; i<this.children.length; i++) {
              moveright = this.parent.parent.insert(index, this.children[i]);

              if (moveright) {
                index++;
              }
              index--;
            }

            this.parent.parent.remove(this.parent.index);
            this.parent.parent.updateChildren();

            editor.cursor.position = { 
              row : this.parent.parent,
              index : index
            };
          }

          if (position == "end") {
            if (this.parent.leftBracket !== null && this.parent.leftBracket !== undefined) {
              value = this.parent.leftBracket.value;
              if (value !== null && value!==undefined && value !== "")  {
                moveright = this.parent.parent.insert(index, new presentation.Symbol(value));

                if (moveright) {
                  index++;
                }
              }
            }

            for (i=0; i<this.children.length; i++) {
              moveright = this.parent.parent.insert(index, this.children[i]);

              if (moveright) {
                index++;
              }
            }

            this.parent.parent.remove(this.parent.index);
            this.parent.parent.updateChildren();
            
            editor.cursor.position = { 
              row : this.parent.parent,
              index : index
            };
          }
        } else {
          /* call checkRemove from parent */
          arguments.callee.parent.checkRemove.call(this, editor, position);
        }
      }
    });
});
