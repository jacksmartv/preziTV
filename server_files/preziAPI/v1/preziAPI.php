<?php
/**********************************
wigleAPI with CURL by Jack Pelorus
[ jackpelorus@gmail.com ]
Created (25-10-2013) 
Last Modif (25-11-2013)
***********************************/
session_start();
include("simple_html_dom.php");
include("API.class.php");
// include our OAuth2 Server object
//include ("../../oauth2/server.php");
class preziAPI extends API{ 

	protected $success = false;
	//protected $sessionId = null;
	//protected $cookieMan = null;

	public function __construct($request, $origin) {
        parent::__construct($request);
        // error reporting (this is a demo, after all!)
        ini_set('display_errors',0);//error_reporting(E_ALL);
    }
    /**********************************
    Parsing headers for login Response
    ***********************************/
    private function http_parse_headers($header){  
      $retVal = array();
      $fields = explode("\r\n", preg_replace('/\x0D\x0A[\x09\x20]+/', ' ', $header));
      foreach( $fields as $field ) 
      {
        if(preg_match('/([^:]+): (.+)/m', $field, $match)) 
        {
          $match[1] = preg_replace('/(?<=^|[\x09\x20\x2D])./e', 'strtoupper("\0")', strtolower(trim($match[1])));
          if(isset($retVal[$match[1]]))           
            $retVal[$match[1]] = array($retVal[$match[1]], $match[2]);
           else        
            $retVal[$match[1]] = trim($match[2]);     
        }
      }
      return $retVal;
    } //end http_parse_headers
    public function logout(){
        unset($_SESSION["prezi_cookie"]);
        unset($_SESSION['full_cookie']);
        unset($_SESSION['prezi_auth']);
        unset($_SESSION['prezi_sessionid']);
        $url = "https://prezi.com/api/v2/auth/logout";
                $ch = curl_init();
                // set the target url
                curl_setopt($ch, CURLOPT_URL,$url);   
                curl_setopt ($ch, CURLOPT_HEADER, 0);
                curl_setopt ($ch, CURLINFO_HEADER_OUT, 0);     
                curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);
                //header parametes custom 
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                            'Access-Control-Allow-Orgin: *',
                            'Accept: application/json',
                            'Origin: chrome'
                            ));
                curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  1);
                curl_setopt($ch, CURLOPT_REFERER, 'https://www.prezi.com/');
                $result = curl_exec($ch);              
                curl_close ($ch);
                $this->loginState['loginState'] = "logout";
                $this->loginState['time'] = date("Y-m-d H:i:s e");
                $this->loginState['status'] = json_decode($result);
                $this->success = array('loginState'=>$this->loginState);
                return $this->success;
               
    }
    public function login(){
    	if ($this->method == 'POST') {
    		if($this->request['username'] != null || $this->request['password'] != null){
	    		$url = "https://prezi.com/api/v2/auth/login";
	    		$ch = curl_init();
		        // set the target url
		        curl_setopt($ch, CURLOPT_URL,$url);
		        // how many parameters to post
		        curl_setopt($ch, CURLOPT_POST, 2);
		        // post parameters
		        curl_setopt($ch, CURLOPT_POSTFIELDS,"username=".$this->request['username']."&password=".$this->request['password']);//."&csrfmiddlewaretoken=3200bb2dabf7e30ce24cd3b34174eabf");      
		        curl_setopt ($ch, CURLOPT_HEADER, 1);
		        curl_setopt ($ch, CURLINFO_HEADER_OUT, 1);     
		        curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);
                //header parametes custom 
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                            'Access-Control-Allow-Orgin: *',
                            'Accept: application/json',
                            'Origin: chrome'
                            ));
		        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
		        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  1);
		        curl_setopt($ch, CURLOPT_REFERER, 'https://www.prezi.com/');
                //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		        $result = curl_exec($ch);              
		        curl_close ($ch); 
		        $headers = $this->http_parse_headers($result);
		        //print_r($headers);//['Set-Cookie'];
		        // return count($headers['Set-Cookie']);//[0];
		        if (count($headers['Set-Cookie']) != 2 ){
		        	unset($_SESSION["prezi_auth"]);
		        	unset($_SESSION["prezi_sessionid"]);
                    $this->loginState['loginState'] = "User and password missmatch !!!";
                    $this->loginState['time'] = date("Y-m-d H:i:s e");
                    $this->loginState['status'] = json_decode($result);
                    $this->success = array($this->loginState);
                    return  $this->success;
		        }else{
		        	$_SESSION['full_cookie'] = $headers['Set-Cookie'];
		        	$_SESSION['prezi_auth'] = $headers['Set-Cookie'][0][0];
		        	$_SESSION['prezi_sessionid'] = $headers['Set-Cookie'][0][1];
                    $this->loginState['loginState'] = "ok";
                    $this->loginState['time'] = date("Y-m-d H:i:s e");
                    //$this->loginState['status'] = json_decode($result);
		        	$this->success = array('session'=>$_SESSION,'loginState'=>$this->loginState);
                    return $this->success;
		        }
    		}else{
            /***************************************
            *  ERROR "User and password missmatch !!!" *
            ***************************************/ 
                $this->loginState['loginState'] = "User and password not sended!!!";
                $this->loginState['time'] = date("Y-m-d H:i:s e");
                $this->loginState['status'] = json_decode($result);
                $this->success = array('loginState'=>$this->loginState);
                return  $this->success;
                }
    	} else {
            /***************************************
            *  ERROR "Only accepts POST requests" *
            ***************************************/
            $this->loginState['loginState'] = "Only accepts POST requests";
            $this->loginState['time'] = date("Y-m-d H:i:s e");
            $this->success = array('loginState'=>$this->loginState);
            return  $this->success;
        	
    	}
    }
    public function getUserSet(){
                $url = "http://prezi.com/api/usersettings/";
                $ch = curl_init();
                // set the target url
                curl_setopt($ch, CURLOPT_URL,$url);
                curl_setopt($ch, CURLOPT_COOKIE, $_SESSION['prezi_auth'].';'.$_SESSION['prezi_sessionid']);     
                curl_setopt ($ch, CURLOPT_HEADER, 0);
                curl_setopt ($ch, CURLINFO_HEADER_OUT, 0); 
                //curl_setopt($ch, CURLOPT_TIMEOUT, 60);   
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                            'Access-Control-Allow-Orgin: *',
                            'Accept: application/json',
                            'Origin: chrome',
                            'Content-Type: application/json'
                            ));
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
                curl_setopt($ch, CURLOPT_REFERER, 'https://www.prezi.com/');
                curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
                $result = curl_exec($ch);
                $list = json_decode($result);
                $this->success = array('preziList'=>$list);
                return $this->success;
                curl_close($ch);

    }
    public function getProfile(){
                $id_user = $this->request['user_id'];
                $url = "http://prezi.com/api/v1/user/".$id_user."/?format=json";  //"https://prezi.com/api/v2/auth/optional/?next=http://prezi.com/api/v1/user/me";
                $ch = curl_init();
                // set the target url
                curl_setopt($ch, CURLOPT_URL,$url);
                curl_setopt($ch, CURLOPT_COOKIE, $_SESSION['prezi_auth'].'; '.$_SESSION['prezi_sessionid']);     
                curl_setopt ($ch, CURLOPT_HEADER, 1);
                curl_setopt ($ch, CURLINFO_HEADER_OUT, 1); 
                //curl_setopt($ch, CURLOPT_TIMEOUT, 60);   
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                            //'Access-Control-Allow-Orgin: *',
                            'Accept: application/json',
                            'Origin: chrome',
                            'Content-Type: application/xml'
                            ));
                curl_setopt($ch, CURLOPT_COOKIESESSION, 0);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
                curl_setopt($ch,CURLOPT_USERAGENT,' Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36');
                curl_setopt($ch, CURLOPT_REFERER, 'https://prezi.com/api/v2/auth/required/');
                curl_setopt($ch, CURLOPT_AUTOREFERER, 0);
                curl_setopt($ch, CURLOPT_HTTPGET, 1);
                //curl_setopt($ch, CURLOPT_TRANSFERTEXT, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  1);
                $result = curl_exec($ch);
                print_r($result);
                $list = json_decode($result);
                $this->success = array('userData'=>$list);
                //return $this->success;
                curl_close($ch);

    }
    public function preziList() {
    	        $url = "https://prezi.com/api/v2/presentation/?format=json&mine=true&search_your=&filter_by=all&order_by=-modified_at&limit=11&offset=0&include_permissions=1";
                //$url = "http://prezi.com/my/prezi/list";
	    		$ch = curl_init();
		        // set the target url
		        curl_setopt($ch, CURLOPT_URL,$url);
		        curl_setopt($ch, CURLOPT_COOKIE, $_SESSION['prezi_auth'].';'.$_SESSION['prezi_sessionid']);     
		        curl_setopt ($ch, CURLOPT_HEADER, 0);
		        curl_setopt ($ch, CURLINFO_HEADER_OUT, 0); 
		        //curl_setopt($ch, CURLOPT_TIMEOUT, 60);   
		        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                            'Access-Control-Allow-Orgin: *',
                            'Accept: application/json',
                            'Origin: chrome',
                            'Content-Type: application/json'
                            ));
  				curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
		        curl_setopt($ch, CURLOPT_REFERER, 'https://www.prezi.com/');
		        curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,  1);
		        $result = curl_exec($ch);
    			$list = json_decode($result);
                $this->success = array('preziList'=>$list);
                return $this->success;
    			curl_close($ch);
    }
    
}//end class preziAPI
/*
Popular prezi list == http://prezi.com/api/v1/popularprezi/?format=json&limit=12&minimum%5Fresult=3&related%5Fto=8ldtkuetjw4r

presentacion frm api en JSON == https://prezi.com/api/v2/presentation/8ldtkuetjw4r/?format=json

prezi user setings en JSON == http://prezi.com/api/usersettings/ de aca saco el id y de ahi llamo a la url user me

prezi user me URL == https://prezi.com/api/v1/user/68890685/?format=json

comentarios sobre las prezi == http://prezi.com/comment/json/?id=8ldtkuetjw4r (es la id del prezi)

auth optional == https://prezi.com/api/v2/auth/optional/
auth required == https://prezi.com/api/v2/auth/required/

get list of my prezi from v2 == https://prezi.com/api/v2/presentation/?format=json&mine=true&search_your=&filter_by=all&order_by=-modified_at&limit=11&offset=0&include_permissions=1

        jQuery.extend(Site, {
            PRESENTATION_API_ENDPOINT: 'https://prezi.com/api/v2/presentation/',
            PRESENTATION_SERVICE_ENDPOINT: '//prezi.com/api/v2/',
            GROUP_API_ENDPOINT: 'https://gs.prezi.com/api/v1',
            PREZI_BASE: 'https://prezi.com',
            PREZI_DOMAIN: 'prezi.com',
            STATIC_URL: '//prezi-a.akamaihd.net/dynapps-versioned/1273/',
            expiredLicense: false,
            hasTrialLicense: false,
            eligibleForReferral: false,
            user_id: '68890685',
            nps: false
        });
        X-Requested-With:XMLHttpRequest
        window.csrftoken = '3200bb2dabf7e30ce24cd3b34174eabf';

    

*/



/***********************
    REST Response
 **********************/
// Requests from the same server don't have a HTTP_ORIGIN header
if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
   $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}
try {
    $API = new preziAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}
?>
