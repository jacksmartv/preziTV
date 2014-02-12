var Network = {
    plugin : null,
    cType : null,
    checkHttp : null,
    phyConnection : null,
    contype : null,
    http_status : null,
    phy_status : null,
    result : [],
};
//This function is used to initialize the pluginObjectNetwork object
Network.init = function() {
    this.plugin = document.getElementById("pluginObjectNetwork");
    alert("Network.init ");
};
//This function is used to Check Connection Type
Network.CheckConnectionType = function() {
        //alert("Network.CheckConnectionType ");
		this.plugin = document.getElementById("pluginObjectNetwork");
        this.cType = this.plugin.GetActiveType();
    switch(this.cType) {
        case 1:
            this.contype = "Wired";
            break;
       case 0:
            this.contype = "Wireless";
            break;
       case -1:
            this.contype = "No Active Connection";
            break;
       default:
            this.contype = "Unknown";
            break;
    }
    
    return this.contype;
};
//This function is used to Check Physical Connection Status
Network.CheckPhyConnection = function()
{
    this.phyConnection = this.plugin.CheckPhysicalConnection(this.cType);
    switch(this.phyConnection)
    {
        case 1:
            this.phy_status = "OK";
            break;
       case 0:
            this.phy_status = "Failure";
            break;
       case -1:
            this.phy_status = "Error";
            break;
       default:
            this.phy_status = "Unknown";
            break;
    }    
    return this.phy_status;
}   ; 
//This function is used to Check Http Connection Status
Network.CheckHttpConnection = function() {
	this.checkHttp = this.plugin.CheckHTTP(this.cType);
    switch(this.checkHttp) {
		case 1:
            this.http_status = "OK";
            break;
       case 0:
            this.http_status = "Failure";
            break;
       case -1:
            this.http_status = "Error";
            break;
       default:
            this.http_status = "Unknown";
            break;
    }
    
    return this.http_status;
};
//This function is used to test the network by checking cnnection tye, physical/Http Connection Status
Network.Test = function()
{
	this.CheckConnectionType();
    this.CheckPhyConnection();
    this.CheckHttpConnection();	
    result = [this.contype, this.phy_status, this.http_status];
    return result;
};

var NetworkError = {
	networkErrorFocusFlag:true
};
//This function is used to show the network error and how it will be handled
NetworkError.showError = function(dataArr, callbackFunc) {
	alert("NetworkError.showError  called");
	var retData = Network.Test();   
		if(retData[1] == "OK" && retData[2] == "OK") {        
			if(typeof callbackFunc == "function") {
				alert("NetworkError callbackFunc called");
				callbackFunc(dataArr);
			}
			return;
		}
	   	NetworkError.networkErrorFocusFlag = true;		
		document.getElementById("networkerror_anchor").focus();
		timeIntev=setTimeout(function() {		
		NetworkError.recheckError(dataArr, callbackFunc);
		}, 200);
		
};

NetworkError.handleKeyNetworkError = function(){
	keycode = event.keyCode;	
	switch(keycode){		
		case  tvKey.KEY_ENTER:  		
		case  tvKey.KEY_RETURN:
	    case  tvKey.KEY_EXIT:
				event.preventDefault();	
				networkErrorFocusFlag=false;
				alert("NetworkError.handleKeyNetworkError");
				widgetAPI.sendExitEvent();
								break;
											
		default:
			noAction();
			break;
		
	}
};