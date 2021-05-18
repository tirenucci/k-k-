$identify("org/mathdox/formulaeditor/modules/interval1/interval_multi.js");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Boxed.js");
$require("org/mathdox/formulaeditor/presentation/Bracket.js");
$require("org/mathdox/formulaeditor/presentation/Bracketed.js");
$require("org/mathdox/formulaeditor/presentation/PseudoRow.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/semantics/MultaryListOperation.js");

$main(function(){

  /**
   * Defines a presentation node that represents an interval.
   */
  org.mathdox.formulaeditor.presentation.Interval1Interval_multi =
    $extend(org.mathdox.formulaeditor.presentation.Boxed, {
      /**
       * Initialize with presentation children.
       * Should each be a row with equations
       */
      initialize: function(className, left, operands, right, listSep) {
        var parent = arguments.callee.parent;

        var contents = [];
        var children = [];
        var child;

        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;
        
        if (operands === null || operands === undefined) {
          return;
        }

        child = new presentation.Row(operands[0]);
        children.push(child);
        contents.push(child);

        var i;
        for (i = 0; i<listSep.length; i++) {
          contents.push(new presentation.Symbol(listSep.charAt(i)));
        }

        child = new presentation.Row(operands[1]);
        children.push(child);
        contents.push(child);

        var prow = new presentation.PseudoRow();
        prow.initialize.apply(prow, contents);

        var bracketed = new presentation.Bracketed(left, prow, right);
        bracketed.separable = false;

        var row = new presentation.Row(bracketed);

        return parent.initialize.call(this, semantics[className], children, row);
     }
  });

  /**
   * Defines a semantic tree node that represents an interval.
   */
  org.mathdox.formulaeditor.semantics.Interval1Interval_multi =
    $extend(org.mathdox.formulaeditor.semantics.MultaryListOperation, {

      /* to be filled in by extending classes */
      symbol : null,
      leftOpen: null,
      rightOpen: null,
      className: null,

      getMathML: function(context) {
        var result;
        var context;
        
        var bracketLeft, bracketRight;

        if (this.leftOpen) {
          // U+27EE Mathematical Left Flatteneed Parenthesis
          bracketLeft="⟮";
        } else {
          // U+3014 Left Turtoise Shell Bracket 
          bracketLeft="〔";
        }
        
        if (this.rightOpen) {
          // U+27EF Mathematical Right Flatteneed Parenthesis
          bracketRight="⟯";
        } else {
          // U+3015 Right Turtoise Shell Bracket 
          bracketRight="〕";
        }

        var options = new org.mathdox.formulaeditor.Options();
        context = options.getPresentationContext();

        var separatorString = "";
        if (context.listSeparatorFixed != ',') {
          separatorString = " separators=\""+options.listSeparatorFixed+"\"";
        }

        result = "<mfenced open=\"" + bracketLeft + "\" close=\"" + bracketRight + "\"" +
                separatorString +">";

        result = result + this.operands[0].getMathMLWithExplicitBrackets(context);
        result = result + this.operands[1].getMathMLWithExplicitBrackets(context);

        result+="</mfenced>";
        
        return result;
      },

      getPresentation: function (context) {
        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;

        var contents = [];
        var children = [];
        var child;

        var option = context.optionInterval1Brackets;

        var bracket;

        if (this.leftOpen) {
          bracket = option.lo;
        } else {
          bracket = option.lc;
        }

        var left = new presentation.Bracket(bracket);

        child = new presentation.Row(this.operands[0].getPresentationWithExplicitBrackets(context));
        children.push(child);
        contents.push(child);

        /* use the fixed list separator string from the context */
        var listSep = context.listSeparatorFixed;

        child = new presentation.Row(this.operands[1].getPresentationWithExplicitBrackets(context));
        children.push(child);

        if (this.rightOpen) {
          bracket = option.ro;
        } else {
          bracket = option.rc;
        }

        var right = new presentation.Bracket(bracket);

        return new presentation.Interval1Interval_multi(this.className, left, children, right, listSep);
      }

    });

  /**
   * Extend the MathML object with parsing code for mfenced intervals
   */
  org.mathdox.formulaeditor.parsing.mathml.MathMLParser =
    $extend(org.mathdox.formulaeditor.parsing.mathml.MathMLParser, {
      handlemfencedinterval: function(node, context, leftOpen, rightOpen, className) {
        var presentation = org.mathdox.formulaeditor.presentation;

        var openSymbol = node.getAttribute("open");
        var closeSymbol = node.getAttribute("close");
        var children = node.childNodes;

        if (children.length == 2) {
          // U+27EE Mathematical Left Flatteneed Parenthesis
          // U+3014 Left Turtoise Shell Bracket 
          var leftTest = ((leftOpen && openSymbol == "⟮")||((!leftOpen) && openSymbol=="〔"));

          // U+27EF Mathematical Right Flatteneed Parenthesis
          // U+3015 Right Turtoise Shell Bracket 
          var rightTest = ((rightOpen && closeSymbol == "⟯")||((!rightOpen) && closeSymbol=="〕"));
  
          if (leftTest && rightTest) {
            /* mfenced interval */
            /* code is partly duplicate from above, not the nicest solution */
            var option = context.optionInterval1Brackets;

            var bracket;

            if (leftOpen) {
              bracket = option.lo;
            } else {
              bracket = option.lc;
            }

            var left = new presentation.Bracket(bracket);

            if (rightOpen) {
              bracket = option.ro;
            } else {
              bracket = option.rc;
            }

            var right = new presentation.Bracket(bracket);

            var listSep = context.listSeparatorFixed;

            var operands = [];
            operands.push(this.handle(children.item(0)));
            operands.push(this.handle(children.item(1)));

            var result = new presentation.Interval1Interval_multi(className, left, operands, right, listSep);

            return result;
          }
        }

        /* does not match */
        return null;
      }
    });
});
