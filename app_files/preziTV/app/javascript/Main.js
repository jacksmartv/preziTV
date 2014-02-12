var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var pluginAPI = new Common.API.Plugin();
var netState = null;
var vol = null;
var userMute = null;
var ObjectAudio = null;
var ObjectTVMW = null;
var NNaviPlugin = null;

var Main =
{
		spinner : null,
		spinnerTarget : null,
		spinnerOpts : null,
		playerID:null
		
};
Main.Login = function(){
	alert("MAIN LOGIN ------------------------------");
	var loginForm = '<div id="loginForm"><img src="images/prezi_login.png" />'
		+'<h2>Log in</h2>'
		+'<div><input size=35 type="text" id="userText"  maxlength="256" placeholder="E-mail" ></div>'
		+'<div><input size=35 type="password" id="passText"  maxlength="256" placeholder="Password" ></div>'
		+'<div><p>Press <span class="redButton">A</span> to Login</p></div>'
		+'</div>';
	$("#loginScreen").append(loginForm);
	$("#loginScreen").css("display","block");
};
Main.loginAction = function(){
	alert("MAIN LOGIN ACTION ---------------------------");
	
	$("#loginForm").animate({ left: "0px" },600,
			function() {
	    // Animation complete.
		//initFormLogin();
		Main.loginUser();
	  });
};
Main.loginUser = function(){
	$("#loading").css('display','block');
	Main.spinner.spin(Main.spinnerTarget);
	//if (userLogin != null && passLogin != null){
		//params.push("id="+userLogin);
		//params.push("pw="+passLogin);
		alert( userLogin +"------"+passLogin);
		
		preziAPI.login();	
	//}	
};
Main.onLoad = function()
{
	 //Create SPINNER
	Main.spinnerOpts = {
			  lines: 11, // The number of lines to draw
			  length: 20, // The length of each line
			  width: 10, // The line thickness
			  radius: 40, // The radius of the inner circle
			  corners: 0, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 10000, // The z-index (defaults to 2000000000)
			  top: '210px', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
			};
			$("#loading").css('display','block');
			Main.spinnerTarget = document.getElementById('spin');
			//alert(target);
			Main.spinner = new Spinner(Main.spinnerOpts).spin(Main.spinnerTarget);
			// Enable key event processing
			this.enableKeys();
			pluginAPI.registIMEKey();
			//volume OSD and audio plugin
			ObjectTVMW = document.getElementById("pluginObjectTVMW");
			ObjectAudio = document.getElementById("pluginAudio");
			NNaviPlugin = document.getElementById("pluginObjectNNavi");
			widgetAPI.sendReadyEvent();
			window.onShow = function () {
		    alert("[APPS] : setBannerstate ");
			    setTimeout(function(){
				    pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
				    pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
				    pluginAPI.unregistKey(tvKey.KEY_MUTE);
				    pluginAPI.unregistKey(tvKey.KEY_PANEL_VOL_UP);
				    pluginAPI.unregistKey(tvKey.KEY_PANEL_VOL_DOWN);
				    pluginAPI.unregistKey(7); //unregister volume up button
				    pluginAPI.unregistKey(11); //unregister volume down button
				    pluginAPI.unregistKey(27); //unregister mute button
				   /* pluginAPI.unregistKey(45); //unregister EXIT key
				    pluginAPI.unregistKey(262); //unregister MENU key*/
				    pluginAPI.unregistKey(147);//unregister INFO.L key
				    pluginAPI.unregistKey(261);//unregister Smart Hub key
			    },100);
			    NNaviPlugin.SetBannerState(1);
		   };
		    userMute = ObjectAudio.GetUserMute();
		    vol = ObjectAudio.GetVolume();
		    alert('-----volume::'+ObjectAudio.GetVolume()+'------mute::'+ObjectAudio.GetUserMute());
		    Main.Login();
		    setTimeout(function(){
		    	$('#splashScreen').remove();
		    	
		    	Main.spinner.stop();
		    	$("#loading").css('display','none');
		    	//$("#container").css("display","block");
		    },2000);
};

Main.onUnload = function()
{
	alert("onUnload ======IME==============================================");
	if (imeBox) {
		imeBox._blur();
	}
	if (imeBoxLoginUser) {
		imeBoxLoginUser._blur();
	}
	if (imeBoxLoginPass) {
		imeBoxLoginPass._blur();
	}
};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Main.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);
	var whoFocus = $( ".focusin" );
	var inFocus = {
			'elfocus' : whoFocus.attr('id'),
			'pafocus' : whoFocus.parent().attr('id')
			//'elitems' : $( "#" + whoFocus.parent().attr('id'))
			//'scrollitem': $( "#" + whoFocus.parent().attr('id')).parent().attr('id')
			};
	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			//widgetAPI.sendReturnEvent();
			if(inFocus.elfocus == 'prezi-player'){
				preziAPI.preziPlayer.stop();
				$('#prezi-player').removeClass('focusin');
				$('#prezi-player').css('display','none');
				$('#preziapiplayer').html('');
				$('#'+$( ".focusPrez" ).parent().attr('id')).addClass('focusin');
				Main.spinner.stop();
			
			}
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			alert(inFocus.pafocus);
			
			if(inFocus.pafocus == 'presentations'){
				alert(inFocus.elfocus);
				if($('#'+inFocus.elfocus).is(':first-child')){
					$('#'+inFocus.elfocus).removeClass('focusin');
					$('#'+inFocus.elfocus+' div').removeClass('focusPrez');
					$("ul#"+inFocus.pafocus+" li:last").addClass("focusin");
					$("ul#"+inFocus.pafocus+" li:last div").addClass("focusPrez");
				}
				else{
				$('#'+inFocus.elfocus).removeClass('focusin');
				$('#'+inFocus.elfocus+' div').removeClass('focusPrez');
				$('#'+$('#'+inFocus.elfocus).prev().attr('id')+' div').addClass('focusPrez');
				$('#'+inFocus.elfocus).prev().addClass('focusin ');
				}
				//$('#'+inFocus.elfocus).prev().attr('id');
			}
			if(inFocus.elfocus == 'prezi-player'){
				preziAPI.preziPlayer.flyToPreviousStep();
			}
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			alert(inFocus.pafocus);
			if(inFocus.pafocus == 'presentations'){
				alert(inFocus.elfocus);
				if($('#'+inFocus.elfocus).is(':last-child')){
					$('#'+inFocus.elfocus).removeClass('focusin');
					$('#'+inFocus.elfocus+' div').removeClass('focusPrez');
					$("ul#"+inFocus.pafocus+" li:first").addClass("focusin");
					$("ul#"+inFocus.pafocus+" li:first div").addClass("focusPrez");
				}
				else{
					$('#'+inFocus.elfocus).removeClass('focusin');
					$('#'+inFocus.elfocus+' div').removeClass('focusPrez');
					$('#'+inFocus.elfocus).next().addClass('focusin');
					$('#'+$('#'+inFocus.elfocus).next().attr('id')+' div').addClass('focusPrez');
				}
			}
			if(inFocus.elfocus == 'prezi-player'){
				preziAPI.preziPlayer.flyToNextStep();
			}
			break;
		case tvKey.KEY_UP:
			alert("UP");
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			alert(inFocus.elfocus);
			alert($('#'+inFocus.elfocus+' div').attr('data-resource'));
			$('#'+inFocus.elfocus).removeClass('focusin');
			
			Main.playerID = inFocus.elfocus;
			preziAPI.playerView();
			break;
		case tvKey.KEY_RED:
			alert("RED");
			Main.loginAction();
			break;
		case tvKey.KEY_BLUE:
			alert("BLUE");
			//open pop up whit steps y podes hacer go to tal step
			if(inFocus.elfocus == 'prezi-player'){
				$('#'+inFocus.elfocus).removeClass('focusin');
				preziAPI.stepWindow();
			}
			
			break;
		default:
			alert("Unhandled key");
			break;
	}
};
