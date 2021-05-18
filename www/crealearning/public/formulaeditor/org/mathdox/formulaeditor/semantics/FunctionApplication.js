$package("org.mathdox.formulaeditor.semantics");

$identify("org/mathdox/formulaeditor/semantics/FunctionApplication.js");

$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/semantics/Node.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");

$main(function(){

  /**
   * Representation of an n-ary function application.
   */
  org.mathdox.formulaeditor.semantics.FunctionApplication =
    $extend(org.mathdox.formulaeditor.semantics.Node, {

      /**
       * The operands of the operation.
       */
      operands: null,
      
      /**
       * Information about the style
       * style="sub" means presentation should be subscript
       */
      style: null,
      /**
       * Information about the symbol that is used to represent this operation.
       */
      symbol: null,

      /**
       * Initializes the operation using the specified arguments as operands.
       */
      initialize : function(symbol, operands, style) {
        this.symbol = symbol;
        this.operands = operands;
        if (style !== undefined) {
          this.style = style;
        }
      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getPresentation(context)
       */
      getPresentation : function(context) {

        var presentation = org.mathdox.formulaeditor.presentation;
        var semantics = org.mathdox.formulaeditor.semantics;

        // construct an array of the presentation of operand nodes interleaved
        // with operator symbols
        var pres = {}
        pres.array = [];

        var bracketed;

        var style = this.getStyle(context);

        if (this.symbol instanceof semantics.MultaryOperation || this.symbol.hasExplicitBrackets()) {
          this.addPresentationBracketOpen(context, pres, "(");
        }
        if (style != "firstsuper") {
          pres.array.push(this.symbol.getPresentation(context));
        }
        if (this.symbol instanceof semantics.MultaryOperation || this.symbol.hasExplicitBrackets()) {
          this.addPresentationBracketClose(context, pres, ")");
        }
        if (style != "sub" && style != "firstsub" && style != "firstsuper") {
          // no brackets in subscript style "sub" or if the first argument is
          // handled differently
          this.addPresentationBracketOpen(context, pres, "(");
        }
        for (var i=0; i<this.operands.length; i++) {
          var operand = this.operands[i];
	  var sym;
          if (i>0) {
            sym = new presentation.Symbol(context.listSeparator);
            if (style == "sub") {
              // subscript style
              pres.array.push(new presentation.Subscript(sym));
              // first subscript (after the symbol)
            } else if ((style == "firstsub" ||style == "firstsuper") && i==1) {
              this.addPresentationBracketOpen(context, pres, "(");
            } else if (style == "firstsuper" && i==0) {
              // first superscript (before the symbol); 
              // print nothing yet
            } else {
              // normal style
              pres.array.push(sym);
            }
          }
          
          if (this.operands.length > 1 || style == "sub") {
            sym = operand.getPresentationWithExplicitBrackets(context);
          } else {
            sym = operand.getPresentation(context);
          }
          if (style == "sub") {
            // subscript style
            pres.array.push(new presentation.Subscript(sym));
          } else if (style == "firstsub" && i==0) {
            pres.array.push(new presentation.Subscript(sym));
          } else if (style == "firstsuper" && i==0) {
            pres.array.push(new presentation.Superscript(sym));
            // NOTE: not testing whether the Symbol is a Multary Operation
            pres.array.push(this.symbol.getPresentationWithExplicitBrackets(context));
          } else {
            // normal style
            pres.array.push(sym);
          }
        }
        
        if (style != "sub") {
          // no brackets in subscript style "sub"
          this.addPresentationBracketClose(context, pres, ")");
        }

        // create and return new presentation row using the constructed array
        var result = new presentation.Row();
        result.initialize.apply(result, pres.array);

        return result;

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getOpenMath()
       */
      getOpenMath : function() {
        var semantics = org.mathdox.formulaeditor.semantics;
        var result;

        /* check number of arguments */
        if (this.symbol instanceof semantics.Keyword) {
          var argtest = this.symbol.checkArguments(this.operands);

          if (typeof argtest === "string") {
            result = "<OME><OMS cd='moreerrors' name='encodingError'/>";
            result += "<OMSTR>invalid expression entered: "+ argtest+"</OMSTR>";
            result += "</OME>";
            return result;
          }
          /* otherwise: everything is fine; continue */
        }

        if (this.style !== null) {
          result = "<OMA style='"+this.style+"'";
        } else {
          result = "<OMA";
        }
        result += this.getOpenMathCommonAttributes()+">";

        result += this.symbol.getOpenMath();
        for (var i=0; i<this.operands.length; i++) {
          result = result + this.operands[i].getOpenMath();
        }
        result = result + "</OMA>";

        return result;

      },

      /**
       * See org.mathdox.formulaeditor.semantics.Node.getMathML()
       */
      getMathML : function(context) {
        var semantics = org.mathdox.formulaeditor.semantics;

        // construct an array of the mathml of operand nodes interleaved
        // with operator symbol mathml
        var pres = {}
        pres.array = [];

        var style = this.getStyle(context);

        var separator = context.listSeparator;
        var separatorMML = "<mo>" + separator + "</mo>";
        var symbolMML = this.symbol.getMathML(context);

        if ((this.symbol instanceof semantics.MultaryOperation) || this.symbol.hasExplicitBrackets()) {
          symbolMML = "<mfenced>" + symbolMML + "</mfenced>";
        }

        var operandsMML = [];
        
        for (var i=0; i<this.operands.length; i++) {
          var operand = this.operands[i];
          if (this.operands.length > 1 || style == "sub" ) {
            operandsMML.push(operand.getMathMLWithExplicitBrackets(context));
          } else {
            operandsMML.push(operand.getMathML(context));
          }
        }

        var result="";

        if (style == "sub") {
          result = "<msub>" + symbolMML + operandsMML.join(separatorMML) + "</msub>";
        } else if (style == "firstsub") {
          result = "<msub>" + symbolMML + operandsMML[0] + "</msub>" + 
              '<mfenced separator="' + separator + '">' + operandsMML.slice(1).join('') + '</mfenced>' ;
        } else if (style == "firstsuper") {
          result = "<mmultiscripts>" + symbolMML + "<mprescripts/>" + operandMML[0] + "<none/>" + "</mmultiscripts>" + 
              '<mfenced separator="' + separator + '">' + operandsMML.slice(1).join('') + '</mfenced>' ;
        } else {
          result = symbolMML + '<mfenced separator="' + separator + '">' + operandsMML.join('') + '</mfenced>' ;
        }

        return result;
      },
      /**
       * get the style, with some overrides in special cases, like log, based
       * on options
       *
       * returned values, firstsub, firstsuper, sub
       */
      getStyle : function(context) {
        var style = this.style;
        var semantics = org.mathdox.formulaeditor.semantics;

        if ( (context.styleTransc1Log == "postfix") && 
            (this.symbol instanceof semantics.Keyword) && 
            (this.symbol.cd == "transc1") && (this.symbol.name == "log") ) {
          style = "firstsub";
        } else if ( (context.styleTransc1Log == "prefix") && 
            (this.symbol instanceof semantics.Keyword) && 
            (this.symbol.cd == "transc1") && (this.symbol.name == "log") ) {
          style = "firstsuper";
        }

        return style;
      }

    });

});
