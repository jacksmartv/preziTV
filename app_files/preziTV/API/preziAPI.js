/*preziAPI.js*/
var preziAPI = {};

	preziAPI.success = false;
	preziAPI.user_id = null;
	preziAPI.loginState = null;
	preziAPI.listado = null;
	
	preziAPI.sessionId = null;
	preziAPI.cookieMan = null;
	
	preziAPI.login_username = 'username';
	preziAPI.login_password = 'password';
	preziAPI.endPointJSAPI = "http://jackpelorus.com.ar/prezi/preziAPI";
	preziAPI.login_url = preziAPI.endPointJSAPI+'/login';
	preziAPI.list_url = preziAPI.endPointJSAPI+'/preziList';
	preziAPI.profile_url = preziAPI.endPointJSAPI+'/getProfile';
	preziAPI.playerURL = null;
	preziAPI.playerAPI = "http://prezi.github.io/prezi-player/lib/PreziPlayer/prezi_player.js";
	preziAPI.preziPlayer = null;
	preziAPI.intervalStatus = null;
	preziAPI.stepCount = null;

	alert("API LOADED START !!");

	preziAPI.login = function(){
		$.ajax({
            type:"POST",
            url:preziAPI.login_url,
            dataType: "json",
		    data:"username=jackpelorus@gmail.com&password=jack2265",
            contentType: 'application/x-www-form-urlencoded',
            complete:function(xhr) {
    				
            },
            error: function(xhr){
            	alert(xhr.statusCode);
                alert(JSON.stringify(xhr));
            },
            success: function(data){
            	//console.log(data);
            	preziAPI.loginState = data.loginState;
            	//return data;
            	if (preziAPI.loginState['loginState'] == 'ok'){
            		alert('success login');
            		preziAPI.success = true;
            		preziAPI.listPrezi();	
            	}
            	
            }
		});
	};
	preziAPI.viewProfile = function(){
		//alert(JSON.stringify(preziAPI.user_id));
		//alert(JSON.stringify(preziAPI.listado));
		//public_display_name
		var userInfo = "<div id='titleHead'><h2>All prezis owned by "+preziAPI.user_id['public_display_name']+"</h2></div>";
		
		//var userList =JSON.stringify(preziAPI.listado);
		var userList = '<h2> Total Prezi: '+preziAPI.listado.preziList.meta['total_count']+'</h2>'
			+'<ul id="presentations" class="prezi-list thumbnails">';
			//+'<li>prezi</li>';
			var listado = preziAPI.listado.preziList.objects;
			for ( var int = 0; int < listado.length; int++) {
				alert(int);
				alert(JSON.stringify(listado[int]));
				var listcomponent = listado[int];
				alert(listcomponent.title);
				//listcomponent.created_at
				//listcomponentthumb_url
				//userList +='<li><img src="'+listcomponent.thumb_url+'" >'
				userList +='<li  id="'+listcomponent.id+'" style="background:url('+listcomponent.thumb_url+');background-repeat:no-repeat;" >'
						+'<div class="item" data-resource="'+listcomponent.resource_uri+'"><p>'+listcomponent.title+'</p>' 
						+'<p>'+listcomponent.created_at+'</p></div>'
						
						+'</li>';
				
			}
			
		
		userList +='</ul>';
		//alert(userList);
		$('#header').append(userInfo);
		$("#contentScreen").html(userList);
		$("#loginScreen").css("display","none");
		$("#container").css('display', 'block');
		$('#presentations li:first').addClass('focusin');
		$('#presentations li:first div').addClass('focusPrez');
		Main.spinner.stop();
	};
	preziAPI.listPrezi = function(){
		$.ajax({
            type:"GET",
            url:preziAPI.list_url,
            dataType: "json",
            complete:function(xhr) {
    				
            },
            error: function(xhr){
            	alert(xhr.statusCode);
                alert(JSON.stringify(xhr));
            },
            success: function(data){
            	console.log(data);
            	preziAPI.listado = data;
            	//alert(data.preziList.objects[0].owner['id']);
            	preziAPI.user_id = data.preziList.objects[0].owner;
            	//alert('success list and id user');
            	preziAPI.viewProfile();

            }
		});
	};

	preziAPI.playerView = function(){
		
	$('#prezi-player').css('display','block');
	//$('#prezi-player').css('background',"#DCDCDC");
	$('#prezi-player').addClass('focusin');
	//Main.spinner.spin(Main.spinnerTarget);

	/*preziAPI.preziPlayer = new PreziPlayer('preziapiplayer', 
											{
											preziId: Main.playerID, 
											width: 960, 
											height: 540,
											controls:true,
											debug:true
											}
	);
	
	preziAPI.intervalStatus = setInterval(function(){
		var status = preziAPI.preziPlayer.getStatus();
		if (status == 'contentready'){
			clearInterval(preziAPI.intervalStatus);
			
			//alert(preziAPI.preziPlayer.getStepCount());
			preziAPI.stepCount = preziAPI.preziPlayer.getStepCount();
			
			//alert(preziAPI.preziPlayer.getAnimationCountOnSteps());
			Main.spinner.stop();
		}
		alert(status);
	}, 500);*/
	//preziAPI.preziPlayer.play(500);
	//.getCurrentStep()
	//.flyToStep(step_idx)
	};
	
	preziAPI.stepWindow = function(){
		//preziAPI.stepCount
		alert(preziAPI.stepCount+'/*/-/-*/-*/-*/-*/-*/-*/-*/-*/-*/-*/*-/-*');
		//preziAPI.preziPlayer.getCurrentStep();
		var stepUp = '<div id="stepForm"><img src="images/prezi_logo_pop.png" />'
			+'<p>Select Step</p>'
			+'<div><p>Total Steps: '+preziAPI.stepCount+' Steps</p></div>'
			//+'<div><p>Current Step: Step '+preziAPI.preziPlayer.getCurrentStep()+'</p></div>'
			+'<div><p>Current Step: Step '+8+'</p></div>'
			+'<div><p>Go to Step:</p></div> <ul id="stepMenu"><li id="dropStep">0</li><li id="aup"></li><li id="adown"></li></ul>'
			//+'<div style="float: left;border:1px solid red;"><div id="dropStep">0</div><div id="aup"></div><div id="adown"></div></div>'
			+'';
			//stepUp+='</div>';
		
		$('#divPopup').html(stepUp);
		//$('.overlay').css('display','none');
		//$('.loading').css('display','none');
		//$('#divPopup').css('top','10px');
		//$('#divPopup').css('left','685px');
		$('#divPopup').css('display','block');
		$('#aup').addClass('focusin focusList');
	};
			