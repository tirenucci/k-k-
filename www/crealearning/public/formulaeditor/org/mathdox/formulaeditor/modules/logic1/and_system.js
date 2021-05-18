$identify("org/mathdox/formulaeditor/modules/logic1/and_system.js");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/modules/logic1/and.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/presentation/Boxed.js");
$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PseudoRow.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/semantics/MultaryListOperation.js");
$require("org/mathdox/parsing/ParserGenerator.js");

$main(function(){

  /**
   * Defines a presentation node that represents a system of equations.
   */
  org.mathdox.formulaeditor.presentation.Logic1And_system =
    $extend(org.mathdox.formulaeditor.presentation.Boxed, {
      /**
       * Initialize with presentation children.
       * Should each be a row with equations
       */
      initialize: function(children) {
        var parent = arguments.callee.parent;

        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;

        var paContents = [];
        var child;
        var row;

        var i;
        for (i = 0; i<children.length; i++) {
          child = children[i];
          row = [];
          row.push(child);
          paContents.push(row);
        }

        var parray = new presentation.PArray();
	parray.initialize.apply(parray, paContents);
	
        var focusEntries = paContents;

        var prowContents = [];
        prowContents.push(parray);

        var left = new presentation.Bracket("{");
        var right = null; /* no right bracket */

        var prow = new presentation.PseudoRow();
        prow.initialize.apply(prow, prowContents);

        var bracketed = new presentation.Bracketed(left, parray, right);
        bracketed.separable = false;

        var row = new presentation.Row(bracketed);

        return parent.initialize.call(this, semantics.Logic1And_system, children, row, focusEntries);
      }
  });

  /**
   * Defines a semantic tree node that represents a system of equations.
   */
  org.mathdox.formulaeditor.semantics.Logic1And_system =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      /* display style is "system" */
      style: "system",

      symbol: {
        openmath: "<OMS cd='logic1' name='and'/>"
      },

      getMathML: function(context) {
        var result = "<mfenced open=\"{\" close=\"\" class=\"logic1and\"><mtable>";
        var i;

        for (i=0; i<this.operands.length; i++) {
          /* for each operand create row with a single entry */
          /* do not use mrow inside table */
          result = result + "<mtr><mtd>" + this.operands[i].getMathML(context, false) + "</mtd></mtr>";
        }

        result = result + "</mtable></mfenced>";

	return result;
      },

      getPresentation: function (context) {
        var presentation = org.mathdox.formulaeditor.presentation;

        var children = [];
        var child;

        var i;
        for (i = 0; i<this.operands.length; i++) {
          child = new presentation.Row(this.operands[i].getPresentation(context));
          children.push(child);
        }

        return new presentation.Logic1And_system(children);
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
        var className = node.getAttribute("class");
        var children = node.childNodes;
        var first;

        if (className == 'logic1and' && children.length == 1) {
          first = children.item(0);
  
          if (first.localName == "mtable") {
            /* mfenced "{", ""; class logic1and and 1 child: mtable; assume logic1.and system */
            var mtable = this.parsemtable(first, context);

            /* nx1 -> n array */
            var args = [];
            var i;
            for (i=0; i<mtable.length; i++) {
              args.push(mtable[i][0]);
            }

            var result = new presentation.Logic1And_system(args);
            return result;
          }
        }
        
        /* default: call parent */
        var parent = arguments.callee.parent;
        return parent.handlemfenced.call(this, node, context);
      }
    });
  /**
   * Extend the OpenMathParser object with parsing code for logic1.and with style system
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns a Logic1And object based on the style 
       */
      handleLogic1And : function(node, style) {

        // construct an And object
	if (style == "system") {
	  // parse the children of the OMA
          var children = node.childNodes;
          var operands = [];

          for (var i=1; i<children.length; i++) {
            operands.push(this.handle(children.item(i)));
          }

          var result = new org.mathdox.formulaeditor.semantics.Logic1And_system();
          result.initialize.apply(result, operands);

          return result;
        } else {
	  /* use parent method */
	  return arguments.callee.parent.handleLogic1And.call(this, node, style);
	}
      }

    });

  org.mathdox.formulaeditor.parsing.expression.KeywordList.andsystem = {
    /* fake clone function */
    clone : function() {
      return this;
    },
    parseResultFun : function(oper, array) {
      var semantics = org.mathdox.formulaeditor.semantics;
      var oper = new semantics.Logic1And_System();
      oper.initialize.apply(oper, array);

      return oper;
    }
  };


});
