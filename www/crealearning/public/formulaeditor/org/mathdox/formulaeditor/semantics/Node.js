$package("org.mathdox.formulaeditor.semantics");

$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");

$identify("org/mathdox/formulaeditor/semantics/Node.js");


$main(function(){

  /**
   * Representation of a node in the semantic tree.
   */
  org.mathdox.formulaeditor.semantics.Node = $extend(Object, {

      /**
       * expected number of arguments
       * "null" means no information
       */
      argcount : null,

      /**
       * explicit Brackets
       * 0 means no brackets: x
       * 1 means one set of brackets: (x)
       * 2 means two sets of brackets: ((x))
       * 
       * see the functions addExplicitBrackets, getExplicitBrackets,
       * hasExplicitBrackets, setExplicitBrackets below
       **/
      explicitBrackets : 0,

      /**
       * checkArguments: check the number of arguments, returns true or an error string
       */
      checkArguments : function(operands) {
        var argcount;
        
        if (operands === null || operands === undefined) {
          argcount = 0;
        } else {
          argcount = operands.length;
        }

        if (this.argcount === null) {
          return true;
        } else if (this.argcount == argcount) {
          return true;
        } else {
          return "expecting "+this.argcount+" argument(s), but found "+argcount+" argument(s) instead";
        }
      },

    /**
     * Returns the presentation tree node that is used to draw this semantic
     * tree node on a canvas. This is an abstract method, so it is expected that
     * subclasses will override this method.
     *
     * context: object that can contain information that might influence the
     * presentation of child objects. context cascades; it is either the same,
     * or copied and then extended or modified.
     */
    getPresentation : function(context) {
      throw new Error("abstract method called");
    },

    /**
     * Returns the presentation surrounded with brackets if explicitBrackets is
     * non-zero. This can be used in places where this is the main element, and
     * not inside a row.
     *
     * NOTE: might need collapse if default presentation is a row
     */
    getPresentationWithExplicitBrackets : function(context) {
      var result = this.getPresentation(context);

      if (this.hasExplicitBrackets()) {
        var presentation = org.mathdox.formulaeditor.presentation;

        result = new presentation.Row( new presentation.Symbol('('), 
          result, new presentation.Symbol(')'));
      }

      return result;
    },

    /**
     * Returns the OpenMath representation of the node. This is an abstract
     * method, so it is expected that subclasses will override this method.
     */
    getOpenMath : function() {
      throw new Error("abstract method called");
    },

    /**
     * Returns the MathML presentation of the node. This is an abstract method,
     * so it is expected that subclasses will override this method.
     */
    getMathML : function(context) {
      throw new Error("abstract method called");
    },

    /**
     * Returns the MathML presentation surrounded with mfenced if
     * explicitBrackets is non-zero. This can be used in places where this is
     * the main element, and not inside a row.
     */
    getMathMLWithExplicitBrackets : function(context) {
      var result = this.getMathML(context);

      if (this.hasExplicitBrackets()) {
        result = "<mfenced>" + result + "</mfenced>";
      }

      return result;
    },
    /**
     * get the value as a string, useful when multiple internal representations are possible
     */
    getValueAsString : function() {
      return this.value.toString();
    },

    /**
     * Utility method to add bracket to mathml using mfenced 
     * mimicked to resemble addPresentationBracket Open/Close
     * does not use context at the moment
     *
     * Note: pres structure should be:
     * pres.array: presentation items
     * pres.old: old presentation structure containing array and possibly leftBracket
     * pres.leftBracket: left Bracket
     */
    addMathMLBracketOpen : function(context, pres, bracket) {
      var tmp = {
        array: pres.array,
        leftBracket: pres.leftBracket,
        old: pres.old
      };
      pres.old = tmp;
      
      pres.leftBracket = bracket; // store as string
      pres.array = [];
    },
    addMathMLBracketClose : function(context, pres, bracket) {
      var rightBracket = bracket;

      var innerMathML = pres.array.join("");
      row.initialize.apply(row, pres.array);

      var bracketed = '<mfenced open="' + pres.LeftBracket + '" close="' + rightBracket + '">' + 
          innerMathML + '</mfenced>';

      pres.array = pres.old.array;
      pres.leftBracket = pres.old.leftBracket;
      pres.old = pres.old.old;

      pres.array.push(bracketed);
    },
    /**
     * Utility method to add a bracket to presentation array
     *
     * Note: pres structure should be:
     * pres.array: presentation items
     * pres.old: old presentation structure containing array and possibly leftBracket
     * pres.leftBracket: left Bracket
     * rightBracket: closing Bracket
     */
    addPresentationBracketOpen : function(context, pres, bracket) {
      var presentation = org.mathdox.formulaeditor.presentation;

      if (context.optionResizeBrackets === true) {
	var tmp = {
	  array: pres.array,
	  leftBracket: pres.leftBracket,
	  old: pres.old
	};
	pres.old = tmp;

        pres.leftBracket = new presentation.Bracket(bracket);
        pres.array = [];
      } else {
	pres.array.push(new presentation.Bracket(bracket));
      }
    },
    addPresentationBracketClose : function(context, pres, bracket) {
      var presentation = org.mathdox.formulaeditor.presentation;

      if (context.optionResizeBrackets === true) {
        var rightBracket = new presentation.Bracket(bracket);

	var row = new presentation.Row();
	row.initialize.apply(row, pres.array);

        var bracketed = new presentation.Bracketed(pres.leftBracket, row, rightBracket);

        pres.array = pres.old.array;
        pres.leftBracket = pres.old.leftBracket;
        pres.old = pres.old.old;

        pres.array.push(bracketed);
      } else {
        pres.array.push(new presentation.Bracket(bracket));
      }
    },
    /**
     * increase the explicit bracket count by 1 
     **/
    addExplicitBrackets : function() {
      this.explicitBrackets += 1;
    },
    /**
     * get the explicit bracket count 
     **/
    getExplicitBrackets : function() {
      return this.explicitBrackets;
    },
    /**
     * get generic OpenMath Attributes
     * - brackets
     */
    getOpenMathCommonAttributes : function() {
      var result="";
      var options = new org.mathdox.formulaeditor.Options();

      // add explicit brackets if present
      if (options.getOption("optionExplicitBrackets") === true && this.hasExplicitBrackets()) {
        result = result + " brackets='" + this.getExplicitBrackets() + "'";
      }

      return result;
    },
    /**
     * check if the explicit bracket count > 0
     **/
    hasExplicitBrackets : function() {
      return (this.explicitBrackets > 0) ;
    },
    /**
     * set the explicit bracket count 
     **/
    setExplicitBrackets : function(value) {
      this.explicitBrackets = value;
    },
  });

});
