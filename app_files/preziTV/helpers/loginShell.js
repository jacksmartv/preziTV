var imeBoxLoginUser = null;
var imeBoxLoginPass = null;
var userLogin = null;
var passLogin = null;
function textobjKeyFunc(keyCode){
    switch(keyCode) {
        case(29460) : // Up Key
            alert("[IME] =========================== Up Key!");
            if (_g_ime.pluginMouse_use_YN) {
                ime._blur();
            }
            else{
                
            }
            document.getElementById('item').focus();
        break;
        
        case (29461) : // Down Key
            var objPass = document.getElementById('passText');
            if (objPass) {
                alert("[IME] passText type change");
                if (objPass.type == "password") {
                	imeBoxLoginPass.setShowHideString("show password");
                }
                else{
                	imeBoxLoginPass.setShowHideString("hide password");
                }
            }
            _g_ime.Recog_use_YN = false;
            if(_g_ime.pluginMouse_use_YN){
            	imeBoxLoginUser._blur();
                imeBoxLoginPass._focus();
            }
            else{
            }
            document.getElementById('passText').focus();
            
        break;
    }
    return false;
}
function inputHighlight(keySet,focusObj){
    alert("[IME] inputHighlight callback ====================================");
    alert("[IME] inputHighlight keySet :"+keySet);
    alert("[IME] inputHighlight focusObj :"+focusObj);
   // $("#searchText").css('border','3px solid blue');
   // $("#searchText").css('border-radius','5px');
    /*if(keySet == "qwerty"){
        if(focusObj == "inputobj"){
            document.getElementById("searchText").style.borderWidth = "3px";    
            document.getElementById("searchText").style.borderColor = "blue";
        }
        else {
            document.getElementById("searchText").style.borderWidth = "0px";
            document.getElementById("searchText").style.borderColor = "black";
        }
        
    }
    else{*/
       // $("#searchText").css.('border','3px solid blue');
   // }
};
function initPass(imeobj){
    var inputobj = imeobj.getInputObj();
    alert("start initializing IME : "+inputobj.id);
    imeobj.setKeySetFunc("qwerty");
    imeobj.setKeypadPos(imeobj.ABkeypad_xyz[0], imeobj.ABkeypad_xyz[1]); //540p
    imeobj.setQWERTYPos(imeobj.ABqwerty_xyz[0], imeobj.ABqwerty_xyz[1]);     //IME XT9, new function 
    imeobj.setEnterFunc(function(arg){
		 passLogin = arg;
		 imeobj._blur();
		 $('#divPopup').css('display','none');
		 Main.enableKeys();
		 Main.loginUser(); //aca declaras la funcion para enviar los datos
	 });
    if(_g_ime.pluginMouse_use_YN){
    	imeobj._focus();
    	document.getElementById('passText').focus();
    }
    else{
    	document.getElementById('passText').focus();
    }
    imeobj.setBlockSpace(false);
    imeobj.setString("");  
    imeobj.setKeyFunc(tvKey.KEY_RETURN, 
			function(keyCode){
				imeobj._blur();
				$('#divPopup').css('display','none');
				Main.enableKeys();
			});
    imeobj.setAuto(false);
    imeobj.setInputHighlightFunc(inputHighlight);
    alert("ime_init end..."); 
	 /*if (setUseShowHidePasswordMenu) {
	        imeobj.setShowHideString("show password");
	        imeobj.setShowHideString("hide password");
	        imeobj.setShowHideString2("show password", "hide password");
	    }*/	
};
function initUser(imeobj){
    var inputobj = imeobj.getInputObj();
    alert("start initializing IME : "+inputobj.id);
    imeobj.setKeySetFunc("qwerty");
    imeobj.setKeypadPos(imeobj.ABkeypad_xyz[0], imeobj.ABkeypad_xyz[1]); //540p
    imeobj.setQWERTYPos(imeobj.ABqwerty_xyz[0], imeobj.ABqwerty_xyz[1]);     //IME XT9, new function 
    imeobj.setEnterFunc(function(arg){
    	userLogin = arg;
    	//imeobj._blur();
    	//document.getElementById('passText').focus();
    	var objPass = document.getElementById('passText');
            if (objPass) {
                alert("[IME] passText type change");
                if (objPass.type == "password") {
                	imeBoxLoginPass.setShowHideString("show password");
                }
                else{
                	imeBoxLoginPass.setShowHideString("hide password");
                }
            }
            _g_ime.Recog_use_YN = false;
            if(_g_ime.pluginMouse_use_YN){
            	imeBoxLoginUser._blur();
                imeBoxLoginPass._focus();
            }
            else{
            }
            document.getElementById('passText').focus();
    });
    imeobj.setKeyFunc(tvKey.KEY_UP, textobjKeyFunc);
    imeobj.setKeyFunc(tvKey.KEY_DOWN, textobjKeyFunc);
    imeobj.setKeyFunc(tvKey.KEY_RED, textobjKeyFunc);
    if(_g_ime.pluginMouse_use_YN){
    	imeobj._focus();
    	document.getElementById('userText').focus();
    }
    else{
    	document.getElementById('userText').focus();
    }
    imeobj.setBlockSpace(false);
    imeobj.setString("");  
    imeobj.setKeyFunc(tvKey.KEY_RETURN, 
			function(keyCode){
				imeobj._blur();
				$('#divPopup').css('display','none');
				Main.enableKeys();
			});
    imeobj.setAuto(false);
    imeobj.setInputHighlightFunc(inputHighlight);
    alert("ime_init end..."); 
};

function initFormLogin(){
	imeBoxLoginPass = new IMEShell("passText", initPass,this);
	if(!imeBoxLoginPass){
		alert("object for IMEShell LOGIN >>> create failed");
	}
	imeBoxLoginUser = new IMEShell("userText", initUser,this);
	if(!imeBoxLoginUser){
		alert("object for IMEShell LOGIN >>> create failed");
	}
};