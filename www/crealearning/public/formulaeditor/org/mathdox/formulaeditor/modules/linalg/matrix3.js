$identify("org/mathdox/formulaeditor/modules/linalg/matrix3.js");

$require("org/mathdox/formulaeditor/modules/linalg/matrix.js");
$require("org/mathdox/formulaeditor/modules/linalg/matrixrow.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  /**
   * Define a semantic tree node that represents the linalg3.matrixcolumn
   */
  org.mathdox.formulaeditor.semantics.Linalg3Matrixcolumn =
    $extend(org.mathdox.formulaeditor.semantics.Linalg2Matrixrow, {

      symbol : {

        mathml   : ["<mfenced open='(' close =')'><mtable><mtr><mtd>","</mtd></mtr><mtr><mtd>","</mtd></mtr></mtable></mfenced>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg3' name='matrixcolumn'/>"

      },
    });

  org.mathdox.formulaeditor.presentation.Linalg3Vector = 
    $extend(org.mathdox.formulaeditor.presentation.Vector, {
      semanticVectorName : "Linalg3Vector"
    });

  /**
   * Define a semantic tree node that represents the linalg3.vector
   */
  org.mathdox.formulaeditor.semantics.Linalg3Vector =
    $extend(org.mathdox.formulaeditor.semantics.Linalg2Vector, {

      symbol : {

        mathml   : ["<mfenced open='(' close=')' class='linalg3vector'><mtable><mtr><mtd>","</mtd></mtr><mtr><mtd>","</mtd></mtr></mtable></mfenced>"],
        onscreen : ["[", ",", "]"],
        openmath : "<OMS cd='linalg3' name='vector'/>"

      },

      precedence : 0,

      transpose : true,

      getPresentation : function(context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var entries = [];
        var vector = new presentation.Vector();

        // add inVector to a copy of the context
        var modifiedContext = {};
        for (var name in context) {
          modifiedContext[name] = context[name];
        }
        modifiedContext.inVector = true;

        for (var i=0; i<this.operands.length; i++) {
          entries.push(this.operands[i].getPresentationWithExplicitBrackets(modifiedContext));
        }
       
        vector.initialize.apply(vector, entries);
        vector.semanticVectorName = "Linalg3Vector";

        return vector;
      }

    });
  /**
   * Extend the MathML object with parsing code for mfenced systems of equations
   */
  org.mathdox.formulaeditor.parsing.mathml.MathMLParser =
    $extend(org.mathdox.formulaeditor.parsing.mathml.MathMLParser, {
      handlemfenced: function(node, context) {
        var presentation = org.mathdox.formulaeditor.presentation;

        var opensymbol = node.getAttribute("open");
        var closesymbol = node.getAttribute("close");
        var separators = node.getAttribute("separators");
        var className = node.getAttribute("class");
        var children = node.childNodes;
        var first;

        if (children.length == 1) {
          first = children.item(0);
  
          if (className == "linalg3vector" && first.localName == "mtable") {
            /* mfenced "{", ""; and 1 child: mtable; assume logic1.and system */
            var mtable = this.parsemtable(first, context);

            /* nx1 -> n array */
            var args = [];
            var i;
            for (i=0; i<mtable.length; i++) {
              args.push(mtable[i][0]);
            }

            var result = new presentation.Linalg3Vector();
            result.initialize.apply(result, args);

            return result;
          } else if (className == "linalg3matrix" && first.localName == "mtable") {
            var mtable = this.parsemtable(first, context);
            var columns = [];
            
            /* 1 row in outer table */
            for (var i=0; i<mtable[0].length; i++) {
              var col = [];
              
              for (var j=0; j<mtable[0][i].length; j++) {
                /* 1 column in inner table */
                col.push(mtable[0][i][j][0]);
              }

              columns.push(col);
            }

            /* transpose matrix */
            var rows = [];
            
            for (j=0; j<columns[0].length; j++) {
              var row = [];

              for (i=0; i<columns.length; i++) {
                row.push(columns[i][j]);
              }

              rows.push(row);
            }

            var result = new presentation.Matrix();
            result.initialize.apply(result, rows);
       
            return result;
          }
        }
        
        /* default: call parent */
        var parent = arguments.callee.parent;
        return parent.handlemfenced.call(this, node, context);
      }
    });

  /**
   * Extend the OpenMathParser object with parsing code for linalg3
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Linalg2Matrix object based on the OpenMath node.
       */
      handleLinalg3Matrix : function(node) {
        var i,j;

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }
        var transposed = [];
        for (i=1; i<children.length; i++) {
          child = this.handle(children.item(i)); 
          
          for (j=0; j<child.operands.length; j++) {
            if (i==1) {
              transposed.push([]);
            }

            transposed[j].push(child.operands[j]);
          }
        }
        var newoperands = [];
        for (i=0; i<transposed.length; i++) {
          var row = new org.mathdox.formulaeditor.semantics.Linalg2Matrixrow();
          row.initialize.apply(row, transposed[i]);
          newoperands.push(row);
        }

        // construct a Linalg2Matrix object
        var result = new org.mathdox.formulaeditor.semantics.Linalg2Matrix();
        result.initialize.apply(result,newoperands);

        return result;
      },

      /**
       * Returns a Linalg3Matrixcolumn object based on the OpenMath node.
       */
      handleLinalg3Matrixcolumn : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg3Matrixcolumn object
        var result = new org.mathdox.formulaeditor.semantics.Linalg3Matrixcolumn();
        result.initialize.apply(result,operands);
        return result;

      },

      /**
       * Returns a Linalg3Vector object based on the OpenMath node.
       */
      handleLinalg3Vector : function(node) {

        // parse the children of the OMA
        var children = node.childNodes;
        var operands = [];
        for (var i=1; i<children.length; i++) {
          operands.push(this.handle(children.item(i)));
        }

        // construct a Linalg3Vector object
        var result = new org.mathdox.formulaeditor.semantics.Linalg3Vector();
        result.initialize.apply(result, operands);
        return result;

      }

    });

});
