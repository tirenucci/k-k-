/*
 * chaque grain expose : var requiredBrowserVer = [["Internet Explorer",x],["Opera",x],["Firefox",x],["Chrome",x],["Safari",x]];
 */

function cleCheckBrowserCompatibility(requiredBrowserVer) {
	var clientBrower = get_browser(), clientBrowerVer = get_browser_version();
	clientBrowerVer = parseFloat(clientBrowerVer);

	for (var i = 0; i < requiredBrowserVer.length; i++) {
		var _data = requiredBrowserVer[i];
		var _browser = _data[0];
		if (clientBrower == _browser) {
			// ok
			var _reqVer = _data[1];

			if (_reqVer > clientBrowerVer) {
				// trop vieux
				var str = $.turbolead.get('_CLE_ERR_OLD_BROWSER');

				var _str = "";
				$.each(requiredBrowserVer, function(val) {
					val = requiredBrowserVer[val];
				     _str += val[0] + " : " + val[1] + "\n";
				});
				str += _str;

				alert (str);
				return;
			}
		}
	}

	// on ne fait rien si on n'a pas d'info concernant le navigateur du client
}

function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1]||'');
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[0];
    }

function get_browser_version(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1]||'');
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[1];
    }

/************************************************************
 * Gestion de la boite de dialogue "Patientez"
 ************************************************************/
function cleWarningDialog(msg, maxTime, minTime)
{
	maxTime = (typeof(maxTime)==='undefined' || maxTime==null) ? null : maxTime;
	minTime = (typeof(minTime)==='undefined' || minTime==null) ? null : minTime;
		$( "#cle-dialog-warning" ).dialog({
			dialogClass: "timeLimit",
			height: "auto",
			width: "auto",
			minHeight: 0,

			modal: true,
			open: function(event, ui) {
				$(".ui-dialog-titlebar").hide();
		        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
		        $(".ui-dialog").css("z-index","99999999");
		        $(".ui-dialog").css("position","fixed");
		    },
			buttons: [
						{
						    text: "Ok",
						    click: function() {
						    	$( this ).dialog( "close" );
						    	if (maxTime != null) {
						    		var deadline = new Date(Date.parse(new Date()) + maxTime * 1000);
						    		initializeClock("max_time_allowed", deadline);
						    	}
						    	if (minTime != null) {
						    		var deadline = new Date(Date.parse(new Date()) + minTime * 1000);
						    		initializeClock("min_time_allowed", deadline);
						    	}
						    }
						}
			          ]
		 });
		$( "#cle-dialog-warning-text" ).html( msg );
		return;
}
