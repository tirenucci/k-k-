$package("org.mathdox.formulaeditor.presentation");

$identify("org/mathdox/formulaeditor/presentation/SymbolAliases.js");

$main(function(){
  org.mathdox.formulaeditor.presentation.SymbolAliases = {
    // U+2061 function application  -> '' empty string
    '⁡' : null,
    // U+2062 invisible times -> '' empty string
    '⁢': null,
    // U+2064 invisible plus -> '' empty string
    '⁤' : null,
    // U+2212, minus sign -> hyphen-minus
    '−' : '-',
    // U+2217 asterisk operator -> U+002A asterisk
    '∗' : '*',
    // U+22C5 dot operator -> U+00B7 middle dot
    '⋅' : '·',
    // quote -> U+2032 [superscript] prime
    "'" : '′'
  };
});
