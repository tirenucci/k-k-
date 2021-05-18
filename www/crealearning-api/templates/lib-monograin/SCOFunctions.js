/*******************************************************************************
**
** Filename: SCOFunctions.js
**
** File Description: This file contains several JavaScript functions that are
**                   used by the Sample SCOs contained in the Sample Course.
**                   These functions encapsulate actions that are taken when the
**                   user navigates between SCOs, or exits the Lesson.
**
** Author: ADL Technical Team
**
** Contract Number:
** Company Name: CTC
**
** Design Issues:
**
** Implementation Issues:
** Known Problems:
** Side Effects:
**
** References: ADL SCORM
**
/*******************************************************************************
**
** Concurrent Technologies Corporation (CTC) grants you ("Licensee") a non-
** exclusive, royalty free, license to use, modify and redistribute this
** software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee
** does not utilize the software in a manner which is disparaging to CTC.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-
** INFRINGEMENT, ARE HEREBY EXCLUDED.  CTC AND ITS LICENSORS SHALL NOT BE LIABLE
** FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
** DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL CTC  OR ITS
** LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT,
** INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
** CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF
** OR INABILITY TO USE SOFTWARE, EVEN IF CTC  HAS BEEN ADVISED OF THE
** POSSIBILITY OF SUCH DAMAGES.
**
*******************************************************************************/
var startDate;
var exitPageStatus;

function loadPage()
{
    doLMSInitialize();

   var status = doLMSGetValue( "cmi.core.lesson_status" );

   if (status == "not attempted")
   {
	  // the student is now attempting the lesson
	  doLMSSetValue( "cmi.core.lesson_status", "incomplete" );
   }

   exitPageStatus = false;
   startTimer();
}


function startTimer()
{
   startDate = new Date().getTime();
}

function computeTime()
{
   if ( startDate != 0 )
   {
      var currentDate = new Date().getTime();
      var elapsedSeconds = ( (currentDate - startDate) / 1000 ); //Start date inconnue
      var formattedTime = convertTotalSeconds( elapsedSeconds );
   }
   else
   {
      formattedTime = "0000:00:00.00";
   }

   doLMSSetValue( "cmi.core.session_time", formattedTime );
}

function doBack(status)
{
	if (status) {
		doLMSSetValue( "cmi.core.lesson_status", status );
	}
   doLMSSetValue( "cmi.core.exit", "suspend" );

   computeTime();
   exitPageStatus = true;

   var result;

   result = doLMSCommit();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.

   result = doLMSFinish();
   //réinitialiser le temps pour les cas de multi commit
   startTimer();

}

function doContinue( status , timeOut)
{
	timeOut = timeOut || false;
   // Reinitialize Exit to blank
   if (timeOut) {
	   doLMSSetValue( "cmi.core.exit", "time-out" );
   }
   else {
	   doLMSSetValue( "cmi.core.exit", "" );
   }

   var mode = doLMSGetValue( "cmi.core.lesson_mode" );

   if ( mode != "review"  &&  mode != "browse" )
   {
      doLMSSetValue( "cmi.core.lesson_status", status );
   }

   computeTime();
   exitPageStatus = true;

   var result;
   result = doLMSCommit();
	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.

   //result = doLMSFinish();
   //réinitialiser le temps pour les cas de multi commit
   startTimer();
}

/*
 * retourne le temps total passé par l'utilisateur sur ce grain en seconde
 * @return int
 */
function doGetTotalTime()
{
	//return doLMSGetValue( "cmi.core.total_time" );
	var totalTime = doLMSGetValue( "cmi.core.total_time" );
	return convertStringTimeToSeconds(totalTime);
}

/*
 * retourne la langue choisi par l'apprenant
 * @return string
 */
function doGetStudentLanguage()
{
    startTimer();
	return doLMSGetValue( "cmi.suspend_data" );
}
/*
 * set la langue choisi par l'apprenant
 * @param string lang
 */
function doSetStudentLanguage(lang)
{
	doLMSSetValue( "cmi.suspend_data", lang );
}

function doQuit()
{
   doLMSSetValue( "cmi.core.exit", "logout" );

   computeTime();
   exitPageStatus = true;

   var result;

   result = doLMSCommit();

	// NOTE: LMSFinish will unload the current SCO.  All processing
	//       relative to the current page must be performed prior
	//		 to calling LMSFinish.

   //result = doLMSFinish();
   //réinitialiser le temps pour les cas de multi commit
   startTimer();
}

/*******************************************************************************
** The purpose of this function is to handle cases where the current SCO may be
** unloaded via some user action other than using the navigation controls
** embedded in the content.   This function will be called every time an SCO
** is unloaded.  If the user has caused the page to be unloaded through the
** preferred SCO control mechanisms, the value of the "exitPageStatus" var
** will be true so we'll just allow the page to be unloaded.   If the value
** of "exitPageStatus" is false, we know the user caused to the page to be
** unloaded through use of some other mechanism... most likely the back
** button on the browser.  We'll handle this situation the same way we
** would handle a "quit" - as in the user pressing the SCO's quit button.
*******************************************************************************/
function unloadPage()
{
	if (exitPageStatus != true)
	{
		doQuit();
	}

	// NOTE:  don't return anything that resembles a javascript
	//		  string from this function or IE will take the
	//		  liberty of displaying a confirm message box.

}

/*******************************************************************************
** this function will convert seconds into hours, minutes, and seconds in
** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
** Min of 2 digits
*******************************************************************************/
function convertTotalSeconds(ts)
{
    if (isNaN(ts)) //Si le temps est mal mesuré bam erreur
    {
        console.log("Issue in time, a NaN conversion to time occured. Took zero instead !")
    }

    ts = Math.round(ts); //On arrondi les secondes pour avoir un entier, ceci aura peut d'incience si on 0.9s, cela n'en rajoutera qu'une

    // On prend la partie restante en seconde après avoir retranché les heures
    // Exemple: 3720 secondes = 1h 2m . Donc 3720 % 3600 = 120 -> les 2 minutes
    var hour =  Math.floor(ts / 3600); //Exemple: l'arrondi de 1.0333 comme 1.99 est 1 avec Math.floor(), on veut le nombre d'heure sous forme d'entier donc 1 et pas 2 sinon on fausse la donnée
    ts = (ts % 3600); //Récupère le reste de la division de ts par 3600, dans l'exemple récupère 120

    var min = Math.floor(ts / 60);
    ts = (ts % 60);    

    // A partir d'ici il ne reste que des secondes dans la variable ts

    // convert seconds to conform to CMITimespan type (e.g. SS.00)
    if (ts == 0) {
        var strSec = "00.00";
    } else {
        var strSec = String(ts);
        if (strSec.length == 1)
        {
            // 8s -> 08.00
            strSec = "0" + strSec + ".00";
        }
        else
        {
            // 36s -> 36.00
            strSec = strSec + ".00";
        }
    }

    //On rajoute le zéro devant l'heure ou les minutes, SCORM prend un format HHHH, une heure à 4 chiffres
    var lenStrHour = String(hour).length;  //Longueur de la chaine d'heures
    switch (lenStrHour)
    {
        case 0:
            hour = "0000";
            break;
        case 1:
            hour = "000" + hour;
            break;
        case 2:
            hour = "00" + hour;
            break;
        case 3:
            hour = "0" + hour;
            break;
        // Le case 4 y est mais est inutile
        case 4:
            hour = hour;
            break;
        default:
            hour = hour;
    }

    var lenStrMinute = String(min).length;  //Longueur de la chaine de minutes
    switch (lenStrMinute)
    {
        case 0:
            min = "00";
            break;
        case 1:
            min = "0" + min;
            break;
        case 2:
            min = min;
            break;
        default:
            min = min;
    }

   var strTime = hour+":"+min+":"+strSec;

   return strTime;
}

/*******************************************************************************
** this function will convert CMITimespan  to seconds
** CMITimespan type format - HHHH:MM:SS.SS (Hours has a max of 4 digits &
** Min of 2 digits
*******************************************************************************/
function convertStringTimeToSeconds(strTime)
{
	var time = strTime.split(':');

	var seconds = time[0] * 3600;
	seconds += time[1] * 60;
	seconds += time[2];

	return Math.floor(seconds);
}

