$package("org.mathdox.formulaeditor.parsing.openmath");

$identify("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");

$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");
$require("org/mathdox/formulaeditor/parsing/openmath/VariableList.js");
$require("org/mathdox/formulaeditor/parsing/xml/XMLParser.js");
$require("org/mathdox/formulaeditor/semantics/FunctionApplication.js");
$require("org/mathdox/formulaeditor/semantics/Integer.js");
$require("org/mathdox/formulaeditor/semantics/SemanticFloat.js");
$require("org/mathdox/formulaeditor/semantics/String.js");
$require("org/mathdox/formulaeditor/semantics/Variable.js");

$main(function(){

  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser = $extend(
        org.mathdox.formulaeditor.parsing.xml.XMLParser, {

    name: "OpenMathParser",

    /**
     * Extracts the local name of the node, and uses that to figure out which
     * method should be called to handle this node. For instance, when an
     * <OMI> node is encountered, the handleOMI method is called.
     */
    handle: function(node, context) {
      var result = arguments.callee.parent.handle.call(this, node, context);

      this.processExplicitBrackets(node, result);

      return result;
    },

    /**
     * Handles an <OMOBJ> node by processing its child node.
     */
    handleOMOBJ: function(node) {

      var child = node.firstChild;

      if (child !== null) {
        return this.handle(child);
      }
      else {
        return null;
      }

    },

    /**
     * Handle an <OMA> node.
     */
    handleOMA: function(node) {
      var symbol;
      var semantics = org.mathdox.formulaeditor.semantics;

      var style = node.getAttribute("style");
      var result;

      // handle <OMA>'s with as first argument an <OMS/>
      if ("OMS" == node.firstChild.localName) {

        // helper function that uppercases first character of provided string
        var uppercase = function(string) {
            return string.substring(0,1).toUpperCase() + string.substring(1);
        };

        // figure out which handler method to call; for instance, for handling 
        // an <OMA> with as first argument <OMS cd='arith1' name='plus'/>, the
        // handleAri!h1Plus method is called
        var symbolname= node.firstChild.getAttribute("cd") + "__" + node.firstChild.getAttribute("name");

        var handler = "handle";

        handler += uppercase(node.firstChild.getAttribute("cd"));
        handler += uppercase(node.firstChild.getAttribute("name"));

        // call the handler method
        if (handler in this) {
          result = this[handler](node, style);

          this.processExplicitBrackets(node, result);

          return result;
        } else if (org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname] !== null && org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname] !== undefined) {
          /* return a FunctionApplication at the end */
          symbol = this.handle(node.firstChild);
        } else {
          var cd = node.firstChild.getAttribute("cd");
          var name = node.firstChild.getAttribute("name");
          var keywordsymbol = {
            onscreen : null,
            openmath : null,
            mathml: "<mi>"+cd+"."+name+"</mi>"
          };
          symbol = new semantics.Keyword(cd, name, keywordsymbol, "function");
        }

      } else if ("OMV" == node.firstChild.localName) {
        /* return a FunctionApplication at the end */
        symbol = this.handle(node.firstChild);
      } else if ("OMA" == node.firstChild.localName) {
        symbol = this.handle(node.firstChild);
      } else {
        throw new Error(
          "OpenMathParser doesn't know how to handle an <OMA> that does " +
          "not have an <OMS/> or <OMV/> as first argument");

      }

      if (symbol) {
        var children = node.childNodes;
        var operands = [];

        for (var i=1; i<children.length; i++) {
          var child = this.handle(children.item(i));

          if (child !== null) { 
            // ignore comments
            operands.push(child);
          }
        }
      
        if (style !== "" && style !== null) {
          result = new semantics.FunctionApplication(symbol, operands, style);
        } else {
          result = new semantics.FunctionApplication(symbol, operands);
        }

	this.processExplicitBrackets(node, result);

        return result;
      }
    },

    /**
     * Handles an <OMBIND> node by pretending its an <OMA> node.
     */
    handleOMBIND: function(node) {

      return this.handleOMA(node);
    },

    /**
     * Ignores an <OMBVAR> node.
     */
    handleOMBVAR: function(node) {

      return this.handle(node.firstChild);

    },

    /**
     * Handles an <OMF> node.
     */
    handleOMF: function(node) {

      var semantics = org.mathdox.formulaeditor.semantics;
      if (node.getAttribute("dec")) {
        return new semantics.SemanticFloat(node.getAttribute("dec"));
      }

    },

    /**
     * Handles an <OMI> node.
     */
    handleOMI: function(node) {

      var semantics = org.mathdox.formulaeditor.semantics;
      var nodeValue = node.firstChild.nodeValue;
      var value;

      if (String(parseInt(nodeValue)) == nodeValue) {
	// parses as integer
	value = parseInt(nodeValue);
      } else if (nodeValue.match("^-?[0-9]+$") !== null) {
	// big integer
	value = { 
          rule: "bigint",
	  value: nodeValue
	};
      } else {
	// not an integer
	value = 0;
	console.log("while parsing OMI: integer expected but found \""+nodeValue+"\" using value 0.");
      }
      return new semantics.Integer(value);
    },

    /**
     * Handles an <OMS> node that is translated to a symbol without arguments
     */
    handleOMS: function(node) {
      var symbolname= node.getAttribute("cd") + "__" + node.getAttribute("name");
      var keyword = org.mathdox.formulaeditor.parsing.openmath.KeywordList[symbolname];

      if (keyword !== null && keyword !== undefined) {
        // get an instance, to allow explicit bracket count
        keyword = keyword.clone();

        if (keyword.type == "constant" || keyword.type == "function") {
          return keyword;
        } else if (keyword.type == "infix" || keyword.type == "unary") {
          //check if parent is palette_row
          var error = false; // set to true if an error is found
          var parentNode = node.parentNode;
          var omsNode = parentNode.firstChild;
          if (omsNode.localName!="OMS") {
            throw new Error(
              "OpenMathParser doesn't know how to handle this keyword of unknown type ("+keyword.type+"): " + node + " when it is not first in an <OMA>. First sibling is "+ omsNode.localName+".");
          }
          if (omsNode.getAttribute("cd")=="editor1" && 
            omsNode.getAttribute("name")=="palette_row") {
            // inside a palette_row -> return the found infix symbol
            return keyword;
          } else {
            throw new Error(
              "OpenMathParser doesn't know how to handle this keyword of unknown type ("+keyword.type+"): " + node + " when it is not first in an <OMA>. INFO: was expecting symbol reference 'editor1.palette_row' instead found '"+omsNode.getAttribute("cd")+"."+omsNode.getAttribute("name")+"'.");
          }

        } else {
          throw new Error(
            "OpenMathParser doesn't know how to handle this keyword of unknown type ("+keyword.type+"): " + node + " when it is not first in an <OMA>.");
        }
      } else {
        var semantics = org.mathdox.formulaeditor.semantics;
        var cd = node.getAttribute("cd");
        var name = node.getAttribute("name");
        var keywordsymbol = {
          onscreen : null,
          openmath : null,
          mathml: "<mi>"+cd+"."+name+"</mi>"
        };
        return new semantics.Keyword(cd, name, keywordsymbol, "constant");
      }
    },

    /**
     * Handles an <OMSTR> node.
     */
    handleOMSTR: function(node) {
      var semantics = org.mathdox.formulaeditor.semantics;
      var children = [];
      var name="";
      var i;
      var child;
      for (i=0;i<node.childNodes.length; i++) {
	child = node.childNodes.item(i);
        if (child.nodeType == 3) { // Node.TEXT_NODE
	  children.push(child.nodeValue);
	}
      }
      return new semantics.SString(children.join(""));
    },
    /**
     * Handles an <OMV> node.
     */
    handleOMV: function(node) {

      var semantics = org.mathdox.formulaeditor.semantics;
      var varname= node.getAttribute("name");
      var variable = org.mathdox.formulaeditor.parsing.openmath.VariableList[varname];

      if (variable !== null && variable !== undefined) {
	return variable.clone();
      } else {
      	return new semantics.Variable(varname);
      }

    },

    /**
     * library code to check for explicit brackets 
     */
    processExplicitBrackets: function(node, result) {
      var brackets = node.getAttribute("brackets");
      var style = node.getAttribute("style");

      if (brackets === null || brackets === "" || isNaN(brackets) ) {
	if (style === "brackets") {
	  brackets = 1;
	} else {
          brackets = 0;
        }
      } else {
        brackets = parseInt(brackets);
      }

      if (brackets > 0) {
        result.setExplicitBrackets(brackets);
      }
    }

  });

});
