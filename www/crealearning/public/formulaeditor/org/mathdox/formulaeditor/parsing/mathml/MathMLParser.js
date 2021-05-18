$package("org.mathdox.formulaeditor.parsing.mathml");

$identify("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");

// NOTE: expression is on purpose, there is no keyword/variable list for mathml parsing yet
$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/parsing/expression/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/expression/VariableList.js");
$require("org/mathdox/formulaeditor/parsing/xml/XMLParser.js");
$require("org/mathdox/formulaeditor/presentation/Root.js");
$require("org/mathdox/formulaeditor/presentation/Row.js");
$require("org/mathdox/formulaeditor/presentation/Symbol.js");
$require("org/mathdox/formulaeditor/presentation/SymbolAliases.js");

$main(function(){

  org.mathdox.formulaeditor.parsing.mathml.MathMLParser = 
      $extend(org.mathdox.formulaeditor.parsing.xml.XMLParser, {
    
    name: "MathMLParser",

    /* main handle function */
    handlemath: function(node, context) {
      return this.handlemrow(node, context);
    },

    /** 
     * artificial handle functions, not called by tags, 
     * but as helper functions 
     */
    handleTextNode: function(node, context, style) {
      // TODO:
      // - create symbols here
      // - ignore some symbols
      // - what to do with symbols that can't be shown
      var presentation = org.mathdox.formulaeditor.presentation;

      // use ""+... to force casting to string
      var value = ""+node.firstChild.nodeValue;

      // fix for differential d
      if (node.localName == "mo" && value == "d") {
        // U+2146 Differential d
        value = "ⅆ";
      }

      var row;

      var arr = [];
      var i;

      for (i=0; i<value.length; i++) {
        var ch = value.charAt(i);
        
        if (org.mathdox.formulaeditor.presentation.SymbolAliases[ch] !== null) {
          if (style === null || style === undefined) {
            arr.push(new presentation.Symbol(ch));
          } else {
            arr.push(new presentation.Symbol(ch, style));
          }
        } else {
          console.log("null character at position: "+i);
        }
      }
      if (arr.length>0) {
        row = new presentation.Row();
        row.initialize.apply(row, arr);
      } else {
        row = null;
      }

      return row;
    },

    /* 1 attribute is expected, if more are present an mrow is inferred, handle it as such.*/
    handleInferredMrow: function(node, context) {
      var children = node.childNodes;

      if (children.length != 1) {
        return this.handlemrow(node, context);
      } else {
        return this.handle(children.item(0));
      }
    },

    /** 
     * order based on mathml specs, in groups: token elements, general layout
     * schemata, script and limit schemata, tabular math, elementary math, enlivening expressions
     */
    /* 3.2 token elements */
    /* token math:mi */
    handlemi: function(node, context) {
      // TODO: check for layout information
      var result;
      var value = ""+node.firstChild.nodeValue;
      var parsing = org.mathdox.formulaeditor.parsing;
      var options = new org.mathdox.formulaeditor.Options();
      var presentation = org.mathdox.formulaeditor.presentation;

      if (parsing.expression.KeywordList[value] !== undefined) {
        result = new presentation.Row(
            parsing.expression.KeywordList[value].clone().getPresentation(options.getPresentationContext()));
      } else if (parsing.expression.VariableList[value] !== undefined) {
        result = new presentation.Row(
            parsing.expression.VariableList[value].clone().getPresentation(options.getPresentationContext()));
      } else {
        result = this.handleTextNode(node, context, "math");
      }

      return result;
    },
    /* token math:mn */
    handlemn: function(node, context) {
      return this.handleTextNode(node, context);
    },
    /* token math:mo */
    handlemo: function(node, context) {
      return this.handleTextNode(node, context);
    },

    /* token math:ms */
    handlems: function(node, context) {
      var presentation = org.mathdox.formulaeditor.presentation;
      return new presentation.Row(new presentation.Symbol("\""), this.handleTextNode(node, context), 
        new presentation.Symbol("\""));
    },

    /* token math:mspace */
    handlemspace: function(node, context) {
      return null;
    },
    /* token math:mtext */
    handlemtext: function(node, context) {
      return this.handleTextNode(node, context);
    },
    /** 
     * general layout schemata
     *
     * supported elements:
     * mrow, mfrac, msqrt, mroot, mstyle(*), merror(*), mpadded(*),
     * mphantom(**), mfenced, menclose(*)
     *
     * notes: 
     *  * treated as mrow
     *  ** returns null
     */

    /* general layout : math:mrow */
    handlemrow: function(node, context) {
      var children = node.childNodes;
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        if (child !== null) { 
          // ignore comments and empty textnodes
          entries.push(child);
        }
      }

      var row = new presentation.Row();
      row.initialize.apply(row, entries);
      return row;
    },

    /* general layout : math:mfrac */
    handlemfrac: function(node, context) {
      var children = node.childNodes;
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      return new presentation.Fraction(entries[0], entries[1]);
    },    

    /* general layout : math:sqrt */
    handlemsqrt: function(node, context) {
      var presentation = org.mathdox.formulaeditor.presentation;
      
      var index = this.handleInferredMrow(node, context);
      var base = new presentation.Row("2");

      return new presentation.Row(new presentation.Root(index, base));
    },

    /* general layout : math:mroot */
    handlemroot: function(node, context) {
      var children = node.childNodes;

      var base = this.handle(children.item(1), context);
      var index = this.handle(children.item(0), context);

      var presentation = org.mathdox.formulaeditor.presentation;

      return new presentation.Root(index, base);
    },

    /*
     * general layout : math:mstyle 
     * currently : ignore, treat as row
     */
    handlemstyle: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:merror 
     * currently : ignore, treat as row
     */
    handlemerror: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mpadded 
     * currently : ignore, treat as row
     */
    handlempadded: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mphantom 
     * currently : return null
     */
    handlemphantom: function(node, context) {
      return this.handlemrow(node, context);
    },

    /*
     * general layout : math:mphantom 
     */
    handlemfenced: function(node, context) {
      var opensymbol = node.getAttribute("open");
      var closesymbol = node.getAttribute("close");
      var separators = node.getAttribute("separators");
      var children = node.childNodes;

      var presentation = org.mathdox.formulaeditor.presentation;
      var entries = [];
      var i;

      if (opensymbol === null || opensymbol === undefined) {
        opensymbol = '(';
      } 
      entries.push(new presentation.Symbol(opensymbol));
      
      var separr;
      if (separators === null || separators === undefined) {
        separators = ',';
        separr = [ separators ];
      } else {
        separr = separators.split("\\s+");
        // check for empty parts
        if (separr[0] === "") {
          // remove first element
          separr = separr.slice(1);
        }

        if (separr.length>0) {
          if (separr[separr.length-1] === "") {
            // remove last element
            separr.splice(separr.length-1);
          }
        }

        // check if length is 1, and if so update
        if (separr.length==1) {
          var arr = [];

          for (i=0;i<separr[0].length;i++) {
            arr.push(separr[0].charAt(i));
          }
          separr = arr;
        }
      }

      // for each child : add child and possibly separator
      for (i = 0; i<children.length; i++) {
        if (i>0) {
          // separator-attribute is not empty
          var sep;
          if (separr.length>0) { 
            if (i<separr.length) {
              sep = separr[i];
            } else {
              sep = separr[0];
            }
          }
          for (var j=0;j<sep.length;j++) {
            entries.push(new presentation.Symbol(sep.charAt(j)));
          }
        }

        // add child
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      if (closesymbol === null || closesymbol === undefined) {
        closesymbol = ')';
      } 
      entries.push(new presentation.Symbol(closesymbol));

      var row = new presentation.Row();
      row.initialize.apply(row, entries);
      return row;
    },

    /*
     * general layout : math:menclose 
     * currently : ignore, treat as row
     */
    handlemenclose: function(node, context) {
      return this.handlemrow(node, context);
    },

    /* 
     * script and limit schemata 
     *
     * supported elements:
     * mover, msub, msup, msubsup, munder
     *
     * not supported elements:
     * mmultiscripts
     */

    /* script and limit schemata : math:mover like math:msup */
    handlemover: function(node, context) {
      return this.handlemsup(node, context);
    },

    /* script and limit schemata : math:msub */
    handlemsub: function(node, context) {
      var children = node.childNodes;
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      var first = children.item(0);

      if ( first.localName == "mi" || first.localName == "mo" ) {
        var symbol = first.firstChild.nodeValue.trim();
        var below;
        below = this.handle(children.item(1));
        
        if (symbol == "lim") {
          return new presentation.Limit(below);
        }
      }

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      return new presentation.Row(entries[0], new presentation.Subscript(entries[1]));
    },

    /* script and limit schemata : math:msup */
    handlemsup: function(node, context) {
      var children = node.childNodes;
      var entries = [];
      var presentation = org.mathdox.formulaeditor.presentation;

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      return new presentation.Row(entries[0], new presentation.Superscript(entries[1]));
    },

    /* script and limit schemata : math:msubsup */
    handlemsubsup: function(node, context) {
      // special cases, definite integral, product, sum
      var children = node.childNodes;
      var presentation = org.mathdox.formulaeditor.presentation;
      
      var first = children.item(0);

      if ( first.localName == "mo" ) {
        var symbol = first.firstChild.nodeValue.trim();
        var above, below;
        below = this.handle(children.item(1));
        above = this.handle(children.item(2));

        // U+220F N-ary product
        // U+03A0 greek capital letter pi
        if (symbol == "∏" || symbol == "Π") {
          return new presentation.Product(above, below);
        // U+2211 N-ary summation
        // U+03A3 Greek capital letter sigma
        } else if (symbol == "∑" || symbol == "Σ") {
          return new presentation.Sum(above, below);
        // U+222B integral
        } else if (symbol == "∫") {
          return new presentation.Defint(below,above);
        } 
      } 

      /* default handling */

      var entries = [];

      for (var i=0; i<children.length; i++) {
        var child = this.handle(children.item(i), context);

        entries.push(child);
      }

      return new presentation.Row(entries[0], new presentation.Subscript(entries[1]), new presentation.Superscript(entries[2]));
    },

    /* script and limit schemata : math:munder like math:msub */
    handlemunder: function(node, context) {
      return this.handlemsub(node, context);
    },

    handlemunderover: function(node, context) {
      return this.handlemsubsup(node, context);
    },

    /* convert an mtable with mtr/mtd to an array of presentation items */
    parsemtable: function(node, context) {
      /**
       * assume node is an mtable
       * parse table into rows and columns
       */

      var table = [];
      var children = node.childNodes;
      var i,j;

      for ( i=0; i<children.length; i++) {
        if ((children.item(i)).localName == "mtr") {
          var row = [];
          
          var entries = (children.item(i)).childNodes;

          for ( j=0; j<entries.length; j++) {
            if ((entries.item(j)).localName == "mtd") {
              var entryChildren = (entries.item(j)).childNodes;
              if (entryChildren.length == 1 && entryChildren.item(0).localName == "mtable") {
                // special case: mtable inside mtable, happens with linalg3matrix
                row.push(this.parsemtable(entryChildren.item(0), context));
              } else {
                var pres = this.handlemrow(entries.item(j), context);
                row.push(pres);
              }
            }
          }
          table.push(row);
        }
      }

      return table;
    }

  });

});
