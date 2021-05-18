
$identify("org/mathdox/formulaeditor/modules/linalg1/outerproduct.js");

$require("org/mathdox/parsing/ParserGenerator.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");
$require("org/mathdox/formulaeditor/parsing/expression/ExpressionContextParser.js");
$require("org/mathdox/formulaeditor/semantics/MultaryOperation.js");
$require("org/mathdox/formulaeditor/semantics/Keyword.js");
$require("org/mathdox/formulaeditor/parsing/openmath/KeywordList.js");

$main(function(){

  var symbol = {
    onscreen : "×",
    openmath : null, // use default with model:cd and model:name
    mathml   : "<mo>×</mo>"
  };

  /**
   * Define a semantic tree node that represents linalg1.outerproduct.
   */
  org.mathdox.formulaeditor.semantics.Linalg1Outerproduct =
    $extend(org.mathdox.formulaeditor.semantics.MultaryOperation, {

      symbol : {

        onscreen : symbol.onscreen,
        openmath : "<OMS cd='linalg1' name='outerproduct'/>",
        mathml   : symbol.mathml

      },

      associative : false,
      precedence : 140

    });
  
  /**
   * Extend the OpenMathParser object with parsing code for linalg1.outerproduct.
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

    /**
     * Returns an equality object based on the OpenMath node.
     */
    handleLinalg1Outerproduct : function(node) {

      // parse the children of the OMA
      var children = node.childNodes;
      var operands = [];
      for (var i=1; i<children.length; i++) {
        operands.push(this.handle(children.item(i)));
      }

      // construct the corresponding object
      var result = new org.mathdox.formulaeditor.semantics.Linalg1Outerproduct();
      result.initialize.apply(result, operands);

      return result;
    }

  });

  org.mathdox.formulaeditor.parsing.openmath.KeywordList["linalg1__outerproduct"] = new org.mathdox.formulaeditor.semantics.Keyword("linalg1", "outerproduct", symbol, "infix");

  /**
   * Add the parsing code for an infix-once symbol.
   */
  var semantics = org.mathdox.formulaeditor.semantics;
  var pG = new org.mathdox.parsing.ParserGenerator();

  
  if ( "><" == "×" ) {
  
  
    // only one expression, same on screen
    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
      function(context) { 
        
          if (context.symbolArith1Times !== '×') { 
        
        return {
          // expression140 = outerproduct | super.expression140
          expression140 : function() {
            var parent = arguments.callee.parent;
            pG.alternation(
              pG.rule("linalg1outerproduct"),
              parent.expression140).apply(this, arguments);
          },
    
          // linalg1outerproduct = 
          //    expression140 "><" expression150
          linalg1outerproduct : function() {
            var parent = arguments.callee.parent;
            return pG.transform(
              pG.concatenation(
                pG.rule("expression140"),
                pG.literal("><"),
                pG.rule("expression150")
              ),
              function(result) {
                return parent.infix_Update(new semantics.Linalg1Outerproduct(result[0], result[2]));
              }
            ).apply(this, arguments);
          }
        };
        
          } else { return {}; };
        
      }
    );
  
  
  } else { // allow alternative as displayed on the screen
    org.mathdox.formulaeditor.parsing.expression.ExpressionContextParser.addFunction( 
      function(context) { 
        
          if (context.symbolArith1Times !== '×') { 
        
        return {
          // expression140 = linalg1outerproduct | 
          //   super.expression140
          expression140 : function() {
            var parent = arguments.callee.parent;
            pG.alternation(
              pG.rule("linalg1outerproduct"),
              parent.expression140).apply(this, arguments);
          },

          // linalg1outerproduct = 
          //    expression140 ("><"|"×") expression150
          linalg1outerproduct : function() {
            var parent = arguments.callee.parent;
            return pG.transform(
              pG.concatenation(
                pG.rule("expression140"),
  	        pG.alternation(
  	          pG.literal("><"),
  	          pG.literal("×")
  	        ),
                pG.rule("expression150")
              ),
              function(result) {
                return parent.infix_Update(new semantics.Linalg1Outerproduct(result[0], result[2]));
              }
            ).apply(this, arguments);
          }
        };
        
          } else { return {}; };
        
      }
    );
  }
  
});
