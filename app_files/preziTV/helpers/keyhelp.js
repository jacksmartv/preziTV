function keyHelper(helpKeys){
	var keyHelp = new Array;
	var helpKey = '<ul id="keyhelp">';
	var iconPos = {
			'user': 97,
	        'red': 0,
	        'green':24,
	        'yellow':48,
	        'blue': 74,
	        'move' :315,
	        'topdown':340,
	        'leftright':355,
	        'enter': 383,
	        'tools':192,
	        'return': 407,
	        'exit':407,
	        'play':97,
	        'pause':97,
	        'stop':97,
	        'ff':97,
	        'rew':97,
	        'fullscreen':383,
	        'slideshow':383
		};
	console.log(helpKeys);
	$('#footer').html(' ');
	var i = 0;
	$.each(helpKeys, function(icon, title) {
		keyHelp[i]= '<li id="'+icon+'">'+title+'</li>';
		i++;
	});
	//keyHelp.reverse();
	helpKey += keyHelp.join('');
	helpKey += '</ul>';
	$('#footer').append(helpKey);
	var leftPos = 10;
	$.each(helpKeys, function(id, title) {
		//console.log($("#" + id).css());
		if(id == 'user'){
			$('#' + id).css({'left':'0px', 'width':'25px'});
			$('#' + id).css({'background-image':'url("images/keyhelp_white.png")'});
			$('#' + id).css({'background-position': '-'+iconPos[id]+'px 0'});
		}else{
		//$("#" + id).css('backgroundImage','url(images/keyhelp_white.png);"');
		$('#' + id).css({'left':leftPos+'px', 'width':'25px'});
		$('#' + id).css({'background-image':'url("images/keyhelp_white.png")'});
		$('#' + id).css({'background-position': '-'+iconPos[id]+'px 0'});
		}
		leftPos = leftPos + 100;
	});
};