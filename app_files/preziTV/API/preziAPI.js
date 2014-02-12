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
	preziAPI.carousel = null;
	preziAPI.current = null;

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
            	preziAPI.loginState = data.loginState;
            	if (preziAPI.loginState['loginState'] == 'ok'){
            		alert('success login');
            		preziAPI.success = true;
            		preziAPI.listPrezi();	
            	}
            	
            }
		});
	};
	preziAPI.viewProfile = function(){
		var userInfo = "<div id='titleHead'><h2>All prezis owned by "+preziAPI.user_id['public_display_name']+"</h2></div>";
		var userList = '<div class="carousel-container"><div id="carousel">';
		var listado = preziAPI.listado.preziList.objects;
		for ( var int = 0; int < listado.length; int++) {
			//alert(int);
			//alert(JSON.stringify(listado[int]));
			var listcomponent = listado[int];
			//alert(listcomponent.title);
			userList += ' <div class="carousel-feature" id="'+listcomponent.id+'">'
					+'<a href="#" data-resource="'+listcomponent.resource_uri+'"><img class="carousel-image" alt="'+listcomponent.title+'" src="'+listcomponent.thumb_url+'"></a>'
					+'<div class="carousel-caption">'
					+'<p>'+listcomponent.title+'</p>'
					+' </div></div>';			
		}
		userList +='</div></div>';
		keyHelper(itemsHelp ={
				'red':'Logout',
	            //'green':'Buscar',
	            'yellow':'Help',
	            //'blue':'Fav.',
	            'leftright' :'Navigate',
	            'enter': 'Enter',
	            'return': 'Back',
	            'exit':'Exit'
	  	 });
		
		$('#header').append(userInfo);
		$("#contentScreen").html(userList);
		$("#loginScreen").css("display","none");
		$("#container").css('display', 'block');
		//$('#carousel div').addClass('focusin');
		//$('#presentations li:first div').addClass('focusPrez');
		
		preziAPI.carousel = $("#carousel").featureCarousel({
				autoPlay:0,
				topPadding:30,
				largeFeatureWidth:1.8,
				largeFeatureHeight:1.8,
				smallFeatureWidth:1,
				smallFeatureHeight:1,
				trackerIndividual:false,
	        });
		preziAPI.carousel.current();
		
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
            	//console.log(data);
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
	Main.spinner.spin(Main.spinnerTarget);
	//$('#footer').css('width','70%');
	keyHelper(itemsHelp ={
			//'red':'Logout',
            //'green':'Buscar',
            //'yellow':'Help',
            'blue':'Steps',
            'leftright' :'Prev/Next',
            //'enter': 'Enter',
            'return': 'Back',
            //'exit':'Exit'
  	 });

	preziAPI.preziPlayer = new PreziPlayer('preziapiplayer', 
											{
											preziId: Main.playerID, 
											width: 960, 
											height: 530,
											controls:true,
											debug:true
											}
	//largeFeatureWidth	Three different possibilities. Value of '0' means take original image width. Between '0' and '1', multiply by original image width. Greater than '1', replace with original image width.	integer	0
	//largeFeatureHeight	See above, but for height instead of width.	integer	0
	//smallFeatureWidth	Three different possibilities. Value of '0' means take HALF original image width. Between '0' and '1', multiply by original image width. Greater than '1', replace with original image width.	integer	0.5
	//smallFeatureHeight	See above, but for height instead of width.	integer	0.5
	//topPadding
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
	}, 1000);
	};
	
	preziAPI.stepWindow = function(){
		var stepUp = '<div id="stepForm"><img src="images/prezi_logo_pop.png" />'
			+'<p>Select Step</p>'
			+'<div><p>Total Steps: '+preziAPI.stepCount+' Steps</p></div>'
			+'<div><p>Current Step: Step '+preziAPI.preziPlayer.getCurrentStep()+'</p></div>'
			//+'<div><p>Current Step: Step '+8+'</p></div>'
			+'<div><p>Go to Step:</p></div> <ul id="stepMenu"><li id="dropStep"></li></ul>'
			//+'<div style="float: left;border:1px solid red;"><div id="dropStep">0</div><div id="aup"></div><div id="adown"></div></div>'
			+'<div style="position:absolute;bottom:0;"><p>Use up/down keys to set Step and then press Enter</p></div>';
			//stepUp+='</div>';
		
		$('#divPopup').html(stepUp);
		$('#divPopup').css('display','block');
		$('#dropStep').html(preziAPI.preziPlayer.getCurrentStep());
		$('#dropStep').addClass('focusin focusList');
	};
			