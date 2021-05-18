
$identify("org/mathdox/formulaeditor/modules/interval1/interval_oc.js");

$package("org.mathdox.formulaeditor.semantics");

$require("org/mathdox/formulaeditor/Options.js");
$require("org/mathdox/formulaeditor/modules/interval1/interval_multi.js");
$require("org/mathdox/formulaeditor/parsing/mathml/MathMLParser.js");
$require("org/mathdox/formulaeditor/parsing/openmath/OpenMathParser.js");

$main(function(){

  /**
   * Defines a semantic tree node that represents an interval.
   */
  org.mathdox.formulaeditor.semantics.Interval1Interval_oc =
    $extend(org.mathdox.formulaeditor.semantics.Interval1Interval_multi, {

      symbol : {

        openmath : "<OMS cd='interval1' name='interval_oc'/>"

      },

      leftOpen: true,
      rightOpen: false,
      className: "Interval1Interval_oc"

    });

  /**
   * Extend the MathML object with parsing code for mfenced
   */
  org.mathdox.formulaeditor.parsing.mathml.MathMLParser =
    $extend(org.mathdox.formulaeditor.parsing.mathml.MathMLParser, {
      handlemfenced: function(node, context) {
        var result = this.handlemfencedinterval(node, context, true, false, "Interval1Interval_oc");

        if (result !== null) {
          return result;
        }

        /* default: call parent */
        var parent = arguments.callee.parent;
        return parent.handlemfenced.call(this, node, context);
      }
    });

  /**
   * Extend the OpenMathParser object with parsing code for
   * interval1.interval
   */
  org.mathdox.formulaeditor.parsing.openmath.OpenMathParser =
    $extend(org.mathdox.formulaeditor.parsing.openmath.OpenMathParser, {

      /**
       * Returns an Interval object based on the OpenMath node.
       */
      handleInterval1Interval_oc : function(node) {

        var children = node.childNodes;
	var arr = [];

	for (var i = 1; i<children.length; i++) {
	  var child = this.handle(children.item(i));
	  if (child !== null) {
            /* ignore comments */
            arr.push(child);
	  }
	}

	var result = new org.mathdox.formulaeditor.semantics.Interval1Interval_oc();
	result.initialize.apply(result, arr);

        return result;
      }

    });

});
