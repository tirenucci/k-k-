/**
 * CLEClasses.js
 * Lib de classes CreaLearning pour la gestion des questionnaires
 * et la communication avec le LMS.
 *
 */
//"use strict";

/***********************************************************************
 * Classe CLEQuizManager.
 *
 **********************************************************************/
CLEQuizManager = (function(hasLMS,forceCommit)
{
//public:
	if(forceCommit === undefined) {
	      forceCommit = 1;
	   }

	this.questions = new Array();
	this.hasLMS = hasLMS;
	this.forceCommit = forceCommit;
	this.startTime = new Date().getTime();
});

CLEQuizManager.prototype.computeTime = (function()
{
   var formattedTime = "0000:00:00.00";
   if ( this.startTime != 0 )
   {
      var currentDate = new Date().getTime();
      var elapsedSeconds = ( (currentDate - this.startTime) / 1000 );
      formattedTime = convertTotalSeconds( elapsedSeconds );
   }
   return formattedTime;
   //doLMSSetValue( "cmi.core.session_time", formattedTime );
});

CLEQuizManager.prototype.addQuestion = (function(q)
{
	this.questions.push(q);
});

CLEQuizManager.prototype.findQuestion = (function(id)
{
	for (var m = 0; m < this.questions.length; m++) {
		if (this.questions[m].identifier == id) {
			return this.questions[m];
		}
	}
	return null;
});

CLEQuizManager.prototype.disable = (function(d)
{
	$('#cle-container :input').each(function() {
		$(this).attr('disabled', 'true');
	});

	for (var m = 0; m < this.questions.length; m++) {
		this.questions[m].disable(d);
	}
});

CLEQuizManager.prototype.checkForm = (function()
{
	var resume = '';

	// On vérifie que les champs ont été remplis
	for (var m = 0; m < this.questions.length; m++)
	{
		var numQuestion 	= m + 1;
		var myAnswer		= this.questions[m].checkForm();
		if(myAnswer.response) {
			resume += 'Question ' + numQuestion + ' : ' + myAnswer.response + '\n';
		}
	}

	if (resume != '') {
		alert(resume);
		return false;
	}
	return true;
});

/**
 * calcul du score, feedback et enregistrement
 * score: normalisation du score de chaque quiz [0,1]
 * pondération (*[0,1])
 * moyenne des scores des quiz d'un grain
 * *100
 */
CLEQuizManager.prototype.checkAnswers = (function(timeOut,showCorrectAnswers)
{
	timeOut = timeOut || false;
	showCorrectAnswers = showCorrectAnswers || false;
	var score = new Object();
	score.min = 0;
	score.max = 0;
	score.raw = 0;
	score.normalized = 0;
	score.sumWeighting = 0;
	score.status = "?"; // test

	var elapsed = this.computeTime();
	var formattedTime = new Date().toTimeString().substring(0, 8);

	for (var k = 0; k < this.questions.length; k++) {
		var question			= this.questions[k];
		var qId					= question.identifier;
		var qType				= question.getInteractionType();
		var qPattern 			= question.getInteractionPattern();
		var qWeight				= question.weight;
		var qMaxScore			= question.maxScore;

		var myAnswer			= question.checkAnswer();
		var myIScore			= myAnswer.iScore;
		var mySScore			= myAnswer.sScore;
		var myNormalizedScore	= myAnswer.iScore / qMaxScore * qWeight;
		var myResponse			= myAnswer.response;

		if (this.hasLMS && this.forceCommit) {
			doLMSSetValue('cmi.interactions.' + k + '.id', 'Q'+qId);
			doLMSSetValue('cmi.interactions.' + k + '.result', mySScore);
			doLMSSetValue('cmi.interactions.' + k + '.student_response', myResponse);
			doLMSSetValue('cmi.interactions.' + k + '.type', qType);
			doLMSSetValue('cmi.interactions.' + k + '.time', formattedTime);
			doLMSSetValue('cmi.interactions.' + k + '.latency', elapsed);
			doLMSSetValue('cmi.interactions.' + k + '.correct_responses.0.pattern', qPattern);
			doLMSSetValue('cmi.interactions.' + k + '.weighting', qWeight);
		}
//		_PrintError('>> id=' + 'Q'+qId + ', type=\'' + qType + '\', patt=\'' + qPattern + '\', maxScore=' + qMaxScore + ', weight=' + qWeight + ', time=' + formattedTime);
//		_PrintError("IScore : " + myIScore);
//		_PrintError("SScore : '" + mySScore + "'");
//		_PrintError("Response : '" + myResponse + "'");

		if (mySScore == "neutral") {
			score.raw += myIScore;
		} else {
			score.max += qMaxScore;
			score.raw += myIScore;
			score.sumWeighting += qWeight;
			score.normalized += myNormalizedScore;
		}

		// Styling des bonnes réponses
		for (var i=0; i < question.answers.length; i++) {
			if (question.answers[i].score > 0) {
				$("#label_" + question.answers[i].name).addClass('cle-highlight-correct');
			} else {
				$("#label_" + question.answers[i].name).addClass('cle-highlight-incorrect');
			}
		}

		// Affichage du message feedback
		if(myIScore != qMaxScore) {
			if(question.feedbackFail != "") {
				$('#feedback_'+qId).addClass('cle-feedback-fail');
				$('#feedback_'+qId).html(question.feedbackFail);
				if (showCorrectAnswers)
				{
					var correctAnswer = question.getCorrectAnswerLabel();
					if (correctAnswer.length != "")
					{
						var html = '<div class="correctAnswer">' + JSmessages[lang]['quiz_correct_answer_title'] + correctAnswer + '</div>';
						$('#feedback_'+qId).before(html);
					}
				}
			}
		} else {
			if (question.feedbackWin != "") {
				$('#feedback_'+qId).addClass('cle-feedback-win');
				$('#feedback_'+qId).html(question.feedbackWin);
			}
		}
	}

	// normalisation
	//score.normalized = "" /*CMIBlank*/;
	score.max = 100; // !!!
	if (score.sumWeighting) {
		score.normalized = parseFloat((score.normalized / score.sumWeighting * 100.0).toFixed(2));
		score.raw = score.normalized; // !!!
	}

	/*if (this.mastery_score.length) {
		score.status = score.normalized >= parseFloat(this.mastery_score) ? 'passed' : 'failed';
	}*/
	_PrintError(score);
	//_PrintError(this.mastery_score);

	if (this.hasLMS  && this.forceCommit) {
		doLMSSetValue('cmi.core.score.min', score.min.toFixed(2));
		doLMSSetValue('cmi.core.score.max', score.max.toFixed(2));
		doLMSSetValue('cmi.core.score.raw', score.raw.toFixed(2));

		var masteryScore = doLMSGetValue('cmi.student_data.mastery_score');
		var status = (score.normalized >= masteryScore) ? 'passed' : 'failed';

		doContinue(status, timeOut);
	}
});

/***********************************************************************
 * Classe CLEQuiz.
 *
 **********************************************************************/
CLEQuiz = (function()
{
//public:
	this.identifier = 0;
	this.maxScore = 0;
	this.feedbackWin = null;
	this.feedbackFail = null;
	this.answers = new Array(); //{name,value,score,type}

});

CLEQuiz.prototype.disable = (function(d)
{
});

CLEQuiz.prototype.checkAnswer = (function()
{
	return null;
});

CLEQuiz.prototype.checkForm = (function()
{
	return null;
});

CLEQuiz.prototype.getInteractionPattern = (function()
{
	var patterns = "";

	for (var i=0; i<this.answers.length; i++)
	{
		if (this.answers[i].score > 0) {
			if (this.getInteractionType() == "matching")
			{
				var label = this.answers[i].label;
				label = label.split('/resources/');
				label = label[label.length - 1];
				patterns +=  label + ',';
			}
			else {
				patterns += this.answers[i].value + ',';
			}
			//patterns += this.answers[i].name + ',';
		}
	}
	if (patterns.length > 0) {
		patterns = patterns.slice(0, patterns.length - 1);
	}
	return patterns;
});

CLEQuiz.prototype.getCorrectAnswerLabel = (function()
		{
			var labels = [];

			for (var i=0; i<this.answers.length; i++)
			{
				if (this.answers[i].score > 0) {
					var label = this.answers[i].label;
					// Correction de label pour le bloc Sequence
					// Mettre le URL dans un element HTML convenable: image, audio ou video
					if (typeof label === "string" )
					{
						label = label.split('=>');
						if (label.length > 1)
							{
								var src = label[1].split(' - ');
								switch(label[0]) {
								case "_IMG":
									label = '<img class="cle-block-img" style="display:inline;" src="' + src[0] + '">';
									if (src.length > 1) {
										label = label + ' - ' +  src[1];
									}
									break;
								case "_SND":
									label ='<audio controls="" class="cle-block-audio">' +
										'<source src="' + src[0] + '">' +
										'<embed src="' + src[0] + '"></audio>';
									break;
								case "_VID":
									label ='<video controls="" class="cle-block-video">' +
										'<source src="' + src[0] + '">'+
										'<embed src="' + src[0] + '"></video>';
									break;
								default:
									label = label.join('=>');
								}
							}
					}
					labels.push(label) ;
				}
			}

			if (labels.length > 1) {
				return "<ul><li>"+ labels.join('</li><li>') + "</li></ul>";
			}
			return labels[0];
		});

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuiz.prototype.getInteractionType = (function()
{
	return undefined;
});

/***********************************************************************
 * Classe CLEQuizTrueFalse
 *
 **********************************************************************/
CLEQuizTrueFalse = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizTrueFalse.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizTrueFalse.prototype.constructor = CLEQuizTrueFalse; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizTrueFalse.prototype.getInteractionType = (function()
{
	return 'true-false';
});

CLEQuizTrueFalse.prototype.checkAnswer = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResponse = '';

	for (var i = 0; i < 2; i++) {
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput.checked == true) {
			myScore += this.answers[i].score;
			//myResponse += idAnswer.slice(-1); // 't' ou 'f'
			myResponse += this.answers[i].label;
		}
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: myScore ? "correct" : "wrong",
		iScore: myScore,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizTrueFalse.prototype.checkForm = (function()
{
	var result = 0;
	for (var i = 0; i < 2; i++) {
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput.checked == true) {
			result += 1;
		}
	}

	//Objet reponse
	var myAnswer =
	{
		response: !result ? JSmessages[lang]['quiz_truefalse_invalid'] : '',
	};
	return myAnswer;
});

/***********************************************************************
 * Classe CLEQuizSequence
 *
 **********************************************************************/
function listMoveSel(liItem, direction) {
	var  $op = $('#' + liItem );

    var callback = function() {
    	if($op.length){
    		direction == 'up' ?
    				$op.first().prev().before($op) :
    				$op.last().next().after($op);
    	}
    };
    $op.fadeOut(500, callback).fadeIn(500);
};

CLEQuizSequence = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizSequence.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizSequence.prototype.constructor = CLEQuizSequence; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizSequence.prototype.getInteractionType = (function()
{
	return 'sequencing';
});

CLEQuizSequence.prototype.checkAnswer = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResponse = '';
	var numAnswers = this.answers.length;

	var ok = true;
	var list = document.getElementById(this.identifier);

	for (var i=0; i<list.children.length; i++) {
		var idAnswer = list.children[i].id;
		var target = this.answers[i].name;

		for(var j = 0; j < numAnswers; j++) {
			if (this.answers[j].name == idAnswer)
			{
				myResponse += this.answers[j].value +',';
				break;
			}
		}

		//myResponse += list.children[i].textContent +',';
		if (idAnswer != target) {
			ok = false;
		}
	};
	if (myResponse.length > 0) {
		myResponse = myResponse.slice(0, myResponse.length - 1);
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: ok ? "correct" : "wrong",
		iScore: ok ? 1 : 0,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizSequence.prototype.checkForm = (function()
{
	return '';
});

CLEQuizSequence.prototype.disable = (function(d)
{
	// On desactive la liste
	$('.cle-quiz-sequence-arrow').hide();

	var list = $('#' + this.identifier);
	list.addClass("cle_quiz_disabled");
});

/***********************************************************************
 * Classe CLEQuizMcq
 *
 **********************************************************************/
CLEQuizMcq = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizMcq.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizMcq.prototype.constructor = CLEQuizMcq; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizMcq.prototype.getInteractionType = (function()
{
	return 'choice';
});

CLEQuizMcq.prototype.checkAnswer = (function()
{
	//CHOIX MULTIPLES
	//my = apprenant
	var myScore = 0;
	var myResponse = '';
	var numAnswers = this.answers.length;

	for (var i=0; i<numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput.checked == true)
		{
			myScore += this.answers[i].score;
			myResponse += this.answers[i].value + ',';
		}
	}
	if (myResponse.length > 0) {
		myResponse = myResponse.slice(0, myResponse.length - 1);
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: myScore != this.maxScore ? "wrong" : "correct",
		iScore: myScore != this.maxScore ? 0 : myScore,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizMcq.prototype.checkForm = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResult = '';
	var numAnswers = this.answers.length;

	//CHOIX MULTIPLES
	var resultMcq = 0;
	for (var i = 0; i < numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput.checked == true) {
			resultMcq += 1;
		}
	}
	if(resultMcq == 0) {
		myResult = JSmessages[lang]['quiz_qcm_invalid'];
	}

	//Objet reponse
	var myAnswer =
	{
		response: myResult
	};
	return myAnswer;
});

/***********************************************************************
 * Classe CLEQuizCloze
 *
 **********************************************************************/
CLEQuizCloze = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizCloze.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizCloze.prototype.constructor = CLEQuizCloze; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizCloze.prototype.getInteractionType = (function()
{
	return 'fill-in';
});

CLEQuizCloze.prototype.checkAnswer = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResponse = "";
	var numAnswers = this.answers.length;

	for (var i=0; i<numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);
		var val = answerInput.value;
		var target = this.answers[i].value;
		myResponse += val+',';

		var ok = false;
		if (this.isRegExp) {
			var mod = this.isCaseSensitive>0
				? ""
				: "i";
			var regexp = new RegExp (target, mod);
			ok = regexp.test(val);
		} else {
			// on traite toujours le caractère |
			var targets = target.split("|");
			for (var j=0; j<targets.length; j++) {
				ok = this.isCaseSensitive==0 ?
						val.trim().toUpperCase() == targets[j].toUpperCase() :
							val.trim() == targets[j];
				if (ok) {
					break;
				}
			}
		}

		if (ok) {
			myScore += this.answers[i].score;
		}
	}

	if (myResponse.length > 0) {
		myResponse = myResponse.slice(0, myResponse.length - 1);
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: myScore != this.maxScore ? "wrong" : "correct",
		iScore: myScore != this.maxScore ? 0 : myScore,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizCloze.prototype.checkForm = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResult = '';
	var numAnswers = this.answers.length;

	var resultMcq = 0;
	for (var i = 0; i < numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput && answerInput.value != '') {
			resultMcq += 1;
		}
	}
	if(resultMcq != numAnswers) {
		myResult = JSmessages[lang]['quiz_cloze_invalid'];
	}

	//Objet reponse
	var myAnswer =
	{
		response: myResult
	};
	return myAnswer;
});

/***********************************************************************
 * Classe CLEQuizNumeric
 *
 **********************************************************************/
function quizNumChanged(id) {
	var  op = $('#' + id);
	var n = op.val();
	n = n.replace(/,/,".");
	op.val(parseFloat(n));
};

CLEQuizNumeric = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizNumeric.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizNumeric.prototype.constructor = CLEQuizNumeric; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizNumeric.prototype.getInteractionType = (function()
{
	return 'numeric';
});

CLEQuizNumeric.prototype.checkAnswer = (function()
{
	var myScore = 0;
	var myResponse = '';

	var idAnswer = this.answers[0].name;
	var val = Number($("#" + idAnswer).val());
	myResponse = val;

	// arrondie avec la précision indiquée
	// et calcule la valeur absolue de la différence entre
	// la réponse et la bonne réponse, puis compare cette valeur
	// avec la tolérance indiquée
	val = val.toFixed(this.precision);
	var diff = (val - this.answers[0].value).toFixed(this.precision)
	myScore = (Math.abs(diff) <= this.tolerance)
		? this.answers[0].score
		: 0;

	//Objet reponse
	var myAnswer =
	{
		sScore: myScore ? "correct" : "wrong",
		iScore: myScore,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizNumeric.prototype.checkForm = (function()
{
	var myResult = '';
	var idAnswer = this.answers[0].name;
	var val = $("#" + idAnswer).val();

	if(val == '') {
		myResult = JSmessages[lang]['quiz_numeric_invalid'];
	}

	//Objet reponse
	var myAnswer =
	{
		response: myResult
	};
	return myAnswer;
});

CLEQuizNumeric.prototype.disable = (function(d)
{
	//var idAnswer = this.answers[0].name;
	//$("#" + idAnswer).spinner(d  ? 'disable' : 'enable');
});

/***********************************************************************
 * Classe CLEQuizLikert
 *
 **********************************************************************/
CLEQuizLikert = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizLikert.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizLikert.prototype.constructor = CLEQuizLikert; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizLikert.prototype.getInteractionType = (function()
{
	return 'likert';
});

CLEQuizLikert.prototype.checkAnswer = (function()
{
	//le bloc likert n'est pas vraiment une question qui doit avoir une note
	//var myScore = 0;
	var myResponse = '';
	var numAnswers = this.answers.length;

	for (var i = 0; i < numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput && answerInput.checked) {
			myResponse = this.answers[i].value;
			//myScore = i;
		}
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: "neutral",
		//iScore: myScore,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizLikert.prototype.checkForm = (function()
{
	var myScore = 0;
	var myResult = '';
	var numAnswers = this.answers.length;

	var result = 0;
	for (var i = 0; i < numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput && answerInput.checked) {
			result += 1;
			break;
		}
	}
	if(!result) {
		myResult = JSmessages[lang]['quiz_likert_invalid'];
	}

	//Objet reponse
	var myAnswer =
	{
		response: myResult
	};
	return myAnswer;
});

CLEQuizLikert.prototype.disable = (function(d)
{
	var list = $('#' + this.identifier);
	list.addClass("cle_quiz_disabled");

	var numAnswers = this.answers.length;

	for (var i = 0; i < numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		if (answerInput) {
			answerInput.disabled = d;
		}
	}
});

/***********************************************************************
 * Classe CLEQuizMatch
 *
 **********************************************************************/
function _isValueSelected(quiz, value) {
	for (var m = 0; m < quiz.answers.length; m++) {
		var ans = quiz.answers[m];
		var bSel = $( "#" + ans.name + " option:selected" ).val() == value;
		if (bSel) {return bSel;}
	}
	return false;
}

function _disableValue(quiz, value, curSelectId, bEnable) {
	for (var m = 0; m < quiz.answers.length; m++) {
		var ans = quiz.answers[m];
		var name = ans.name;

		if (name != curSelectId) {
			if (bEnable) {
				$('#' + name + ' option[value="' + value + '"]').removeAttr('disabled');
			} else {
				$('#' + name + ' option[value="' + value + '"]').attr('disabled', true);
			}
		}
	}
}

function quizMatchSelChanged(select) {
	$('body').css('cursor', 'wait');
	var ar = select[0].id.split("_", 2);
	var idQuiz = ar[0];
	var quiz = quizManager.findQuestion(idQuiz);

	if (!quiz.isExclusive) {
		$('body').css('cursor', 'auto');
		return;
	}

	var bNoSelection = select[0].options.selectedIndex == 0;
	var selValue = select[0].options[select[0].options.selectedIndex];

	// disable ce choix dans les _autres_ listes
	if (!bNoSelection) {
		_disableValue(quiz, selValue.value, select[0].id, false);
	}

	//enable la selection précédente
	var oldSelection = $('#' + select[0].id).data('oldSelection');
	if (oldSelection) {
		_disableValue(quiz, oldSelection, select[0].id, true);
	}

	// stocke la selection précédente
	$('#' + select[0].id).data('oldSelection',selValue.value /*select[0].options.selectedIndex*/);

	$('body').css('cursor', 'auto');
}

CLEQuizMatch = (function()
{
	// parent ctor
	CLEQuiz.call(this);
});

CLEQuizMatch.prototype = Object.create(CLEQuiz.prototype); // hérite de CLEQuiz
CLEQuizMatch.prototype.constructor = CLEQuizMatch; // correction du constructeur: il pointe CLEQuiz()

/**
 * Renvoie le type d'interaction standard SCORM
 * correspondant au type de la question.
 * @return string
 */
CLEQuizMatch.prototype.getInteractionType = (function()
{
	return 'matching';
});

CLEQuizMatch.prototype.checkAnswer = (function()
{
	var myScore = 0;
	var myResponse = '';
	var numAnswers = this.answers.length;

	for (var i=0; i<numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);
		var sel = answerInput.options.selectedIndex;
		var value = answerInput.options[sel].value;

		//myResponse += (i+1) + "." + value.slice(-1)+',';
		var label = this.answers[i].label;
		label = label.split(' - ');
		label = label[0].split('/resources/');
		label = label[label.length - 1];
		myResponse += label + ' - ' + answerInput.options[sel].text + ',';

		myScore += (value.slice(-1) == this.answers[i].value);
	}

	if (myResponse.length > 0) {
		myResponse = myResponse.slice(0, myResponse.length - 1);
	}

	//Objet reponse
	var myAnswer =
	{
		sScore: myScore == this.maxScore ? "correct" : "wrong",
		iScore: myScore == this.maxScore ? myScore : 0,
		response: myResponse
	};
	return myAnswer;
});

CLEQuizMatch.prototype.checkForm = (function()
{
	//my = apprenant
	var myScore = 0;
	var myResult = '';
	var numAnswers = this.answers.length;
	var bSelection = true;

	for (var i=0; i<numAnswers; i++)
	{
		var idAnswer = this.answers[i].name;
		var answerInput = document.getElementById(idAnswer);

		bSelection = bSelection && answerInput.options.selectedIndex != 0;
	}

	if(!bSelection) {
		myResult = JSmessages[lang]['quiz_match_invalid'];
	}

	//Objet reponse
	var myAnswer =
	{
		response: myResult
	};
	return myAnswer;
});