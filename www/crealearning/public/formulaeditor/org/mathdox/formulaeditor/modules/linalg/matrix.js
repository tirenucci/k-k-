$identify("org/mathdox/formulaeditor/modules/linalg/matrix.js");

$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Node.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Matrix.js");
$require("org/mathdox/formulaeditor/presentation/Vector.js");
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js");
$require("org/mathdox/formulaeditor/semantics/MultaryListOperation.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  /**
   * Define a semantic tree node that represents the linalg2.matrix
   */
  org.mathdox.formulaeditor.semantics.Linalg2Matrix =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      symbol : {

        mathml   : ["<mfenced open=\"(\" close=\")\" class=\"linalg2matrix\"><mtable>","","</mtable></mfenced>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg2' name='matrix'/>"

      },

      precedence : 0,

      getPresentation : function(context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        
        // add inMatrix to a copy of the context
        // XXX see if an extend like function can be used
        var modifiedContext = {};
        for (var name in context) {
          modifiedContext[name] = context[name];
        }
        modifiedContext.inMatrix = true;

        var rows = [];

        for ( var row =0 ; row<this.operands.length ; row++) {
          var currentRow = [];
          for (var col = 0 ; col<this.operands[row].operands.length; col++) {
            var entry = this.operands[row].operands[col].getPresentationWithExplicitBrackets(
              modifiedContext);
            currentRow.push(entry);
          }
          rows[row] = currentRow;
        }

        var result = new presentation.Matrix();
        result.initialize.apply(result,rows);
       
        return result;
      }

    });

  /**
   * Define a semantic tree node that represents the linalg2.vector
   */
  org.mathdox.formulaeditor.semantics.Linalg2Vector =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        mathml   : ["<mo>[</mo>","<mo>,</mo>","<mo>]</mo>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg2' name='vector'/>"

      },

      precedence : 0,

      transpose: false,

      getPresentation : function(context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var entries = [];

	if (context.styleLinalg2Vector == "column") {
          var vector = new presentation.Vector();

          // add inVector to a copy of the context
          // XXX see if an extend like function can be used
          var modifiedContext = {};
          for (var name in context) {
            modifiedContext[name] = context[name];
          }
          modifiedContext.inVector = true;

          for (var i=0; i<this.operands.length; i++) {
            entries.push(this.operands[i].getPresentationWithExplicitBrackets(modifiedContext));
          }
       
          vector.initialize.apply(vector, entries);

          return vector;
        } else { // "row"
	  var row = new presentation.Row();

          entries.push(new presentation.Symbol("["));
          for (var i=0; i<this.operands.length; i++) {
            if (i>0) {
              entries.push(new presentation.Symbol(context.listSeparator));
            }
            entries.push(this.operands[i].getPresentationWithExplicitBrackets(context));
          }
          entries.push(new presentation.Symbol("]"));

	  row.initialize.apply(row, entries);
          return row;
        }
      }

    });

  /**
   * Extend the OpenMathParser object with parsing code for linalg2.matrixrow
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrix : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg2Matrix object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrix();
        result.initialize.apply(result,operands);

        return result;
      },

      /**
       * Returns a Linalg2Matrixrow object based on the OpenMath node.
       */
      handleLinalg2Matrixrow : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg2Matrixrow object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrixrow();
        result.initialize.apply(result,operands);
        return result;

      },

      /**
       * Returns a Linalg2Vector object based on the OpenMath node.
       */
      handleLinalg2Vector : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg2Vector object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Vector();
        result.initialize.apply(result, operands);
        return result;

      }

    });

  /**
   * Add the parsing code for Matrixlike.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

  org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
    function(context) { return {

      // expression160 = Linalg2Matrixlike | super.expression160
      expression160 : function() {
        var parent = arguments.callee.parent;
        pG.alternation(
          pG.rule("Linalg2Matrixlike"),
          parent.expression160).apply(this, arguments);
      },

      // Linalg2Matrixrow = "[" expression ("," expression)* "]"
      Linalg2Matrixlike :
        pG.transform(
          pG.concatenation(
            pG.literal("["),
            pG.rule("expression"),
            pG.repetition(
              pG.concatenation(
                pG.literal(context.listSeparator),
                pG.rule("expression")
              )
            ),
            pG.literal("]")
          ),
          function(result) {
            var array = [];
	    var i; // counter
            for (i=1; i+1<result.length; i=i+2) {
              array.push(result[i]);
            }
            var matrixLike;
            var allvector = true;
            for (i=0; i<array.length; i++) {
              allvector = allvector && 
                array[i] instanceof semantics.Linalg2Vector;
            }
            if (allvector) {
              /*
               * convert vectors in array to matrixrows
               */
              var matrixRows = [];
              for (i=0; i<array.length; i++) {
                var row = new semantics.Linalg2Matrixrow();
                row.initialize.apply(row, array[i].operands);
                matrixRows.push(row);
              }
              // create a new matrix
              matrixLike = new semantics.Linalg2Matrix();
              matrixLike.initialize.apply(matrixLike, matrixRows);
            } else {
              // create a vector 
              matrixLike = new semantics.Linalg2Vector();
              matrixLike.initialize.apply(matrixLike, array);
            }
            return matrixLike;
          }
        )
      };
    });

  /**
   * Extend the MathML object with parsing code for mfenced systems of equations
   */
  org.mathdox.formulaeditor.parsing.mathml.MathMLParser =
    $extend(org.mathdox.formulaeditor.parsing.mathml.MathMLParser, {
      handlemfenced: function(node, context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var children = node.childNodes;
        var className = node.getAttribute("class");
        var first;

        if (className == 'linalg2matrix' && children.length == 1) {
          first = children.item(0);
  
          if (first.localName == "mtable") {
             /* mfenced "{", ""; class logic1and and 1 child: mtable; assume logic1.and system */
            var mtable = this.parsemtable(first, context);
            var result = new presentation.Matrix();
            result.initialize.apply(result, mtable);
            return result;
          }
        }

        /* default: call parent */
        var parent = arguments.callee.parent;
        return parent.handlemfenced.call(this, node, context);
      }
    });

});
