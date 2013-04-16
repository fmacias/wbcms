<?php 
function get_url_contents($url)
{
	$ch = curl_init();
	$timeout = 5; // set to zero for no timeout
	curl_setopt ($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC ) ; 
	curl_setopt($ch, CURLOPT_USERPWD, "Susanne:#123456!Su"); 
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$file_contents = curl_exec($ch);
	$content_type = curl_getinfo( $ch, CURLINFO_CONTENT_TYPE );
	preg_match( '@([\w/+]+)(;\s+charset=(\S+))?@i', $content_type, $matches );
	$mime = NULL;
	$charset = NULL;
	if ( isset( $matches[1] ) )
	    $mime = $matches[1];
	if ( isset( $matches[3] ) )
	    $charset = $matches[3];
	return array('content' => $file_contents, 'mime' => $mime, 'charset'=>$charset,'contentType'=>$content_type);
/*	if (( ! ( isset ( $mime ) ))&&( ! ( isset ( $charset ) )))
	{
		preg_match( '@<meta\s+http-equiv="Content-Type"\s+content="([\w/]+)(;\s+charset=([^\s"]+))?@i',$file_contents, $matches );
		if ( isset( $matches[1] ) )
		    $mime = $matches[1];
		if ( isset( $matches[3] ) )
		    $charset = $matches[3];
				
	}
	if (( ! ( isset ( $mime ) ))&&( ! ( isset ( $charset ) )))
	{
		preg_match( '@<\?xml.+encoding="([^\s"]+)@si', $file_contents, $matches );
		$mime = 'application/xml';
		if ( isset( $matches[1] ) )
			$charset = $matches[1];
		}
	curl_close($ch);
*/	
}

function get_web_page( $url )
{
    $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "wunderbit.com", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    );
    $ch = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch,CURLINFO_CONTENT_TYPE);
    curl_close( $ch );
    echo($err);
    echo($errmsg);
	print_r($header);
    /*$header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    $header['content'] = $content;
    return $header;*/
}
?>