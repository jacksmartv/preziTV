var t=null;
var XHRToolKit = function (pURL, pArgs, pSendResultFunc) {
    var URL = pURL;     //URL to fetch data
    var sendResultFunc = pSendResultFunc;  //callback function
    var XHRObj = null;    //XHR Object
     var args=pArgs; //args for Post request
   // this method requests data from an applicable URL
    
      this.sendXHRRequest = function() {         
        if (XHRObj) //distroy XHRObj if already exist (This function  is executed to optimize the memory usage)
            delete XHRObj();
        XHRObj = new XMLHttpRequest();   //create a new XHR request
        if (XHRObj) {
			if(t){
				clearTimeout(t);	
				t=null;
				
			}
			t= null; //setTimeout("timedCount()",15000);
        //If XHR onreadystatechange=4, means data reception is completed, now we can receive response.
            XHRObj.onreadystatechange = function () {
                if (XHRObj.readyState == 4) {
                   receiveXHRResponse();
                }
            };
			if (XHRObj.overrideMimeType) {
				XHRObj.overrideMimeType('text/xml');
			}
            XHRObj.open("GET", URL, true); 
            XHRObj.send(null);
        }
        else 	{
        alert("XHR Object is NULL");
        }
    };
	
	  this.sendXHRRequestPost = function() {
		alert("this.sendXHRRequestPost");
       //networkError.showError();
        if (XHRObj) //distroy XHRObj if already exist (This function  is executed to optimize the memory usage)
           delete XHRObj;
        XHRObj = new XMLHttpRequest();   //create a new XHR request
        if (XHRObj) {
			if(t){
				clearTimeout(t);	
				t=null;
				
			}
			t=setTimeout("timedCount()",15000);
        //If XHR onreadystatechange=4, means data reception is completed, now we can receive response.
            XHRObj.onreadystatechange = function () {
			//alert("XHRObj.readyState=="+XHRObj.readyState)
                if (XHRObj.readyState == 4) {
				//alert("readyState::"+XHRObj.readyState);
                   receiveXHRResponse();
				}
		};
		XHRObj.open("POST", URL, true); 
		XHRObj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		XHRObj.setRequestHeader('Access-Control-Allow-Origin','*');
        XHRObj.send(args);
        }
        else 	{
        alert("XHR Object is NULL");
        }
    };

/*timedCount = function(){
		alert("== timedCount ==");
		countParser=0;
		clearTimeout(t);	
		t=null;
		if (XHRObj) {
			XHRObj.abort();
			delete XHRObj;
			}
		if(Parser.methodIdx==1){
			ref1.getTokens(dataArr1.url,dataArr1.str);		
		}else if(Parser.methodIdx==2){
			 refAlbums.getAlbums(dataArr1.url,dataArr1.str);		
		}
		else if(Parser.methodIdx==3){
			 refPhotos.getPhotos(dataArr1.url,dataArr1.str);		
		}else{
		}
};*/

//receiveXHRResponse 
    var receiveXHRResponse = function(){       
		clearTimeout(t);
		t=null;
   // A HTTP status is 200, means good server response.
 // Boolean value indicating whether or not the communication succeeds to a callback function.
        if (XHRObj.status == 200 && XHRObj.readyState == 4) {
            sendResultFunc(true);
        }
        else {            
            sendResultFunc(false);
        }
    };

//Parse JSON data
//return JSON response obj 
	this.DecodeJSON = function(pStr){
		var objReturn = null;
		//JSON.parse methosd return a JSON response obj 
		objReturn = JSON.parse(pStr,function (key, value) {
			var type;
			if (value && typeof value === 'object') {
				type = value.type;
				if (typeof type === 'string' && typeof window[type] === 'function') {
					return new (window[type])(value);
				}
			}
			return value;
		});
		return objReturn;
	};

//Get responseText for JSONParser related to this XHRObj
    this.getResponseText = function () {
        return XHRObj.responseText;
    };
	
   //Get responseXML for XMLParser related to this XHRObj
    this.getResponseXML = function () {
        return XHRObj.responseXML;
    };
	
    //Get XHRObj
	this.getXHRObj = function () {
		return XHRObj;
	};
    
    //About XHR obj 
    this.abortXHRObj = function () {
        if (XHRObj) {
            debug("Aborting..XHR");
            XHRObj.abort();
			if (XHRObj) {
				delete XHRObj;
			}
        }
    };
};