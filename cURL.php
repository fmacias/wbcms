<?php
/*
	[url] => http://www.ya.com
    [content_type] => text/html
    [http_code] => 200
    [header_size] => 226
    [request_size] => 107
    [filetime] => -1
    [ssl_verify_result] => 0
    [redirect_count] => 0
    [total_time] => 0.545302
    [namelookup_time] => 0.168344
    [connect_time] => 0.213883
    [pretransfer_time] => 0.213963
    [size_upload] => 0
    [size_download] => 76051
    [speed_download] => 139465
    [speed_upload] => 0
    [download_content_length] => 0
    [upload_content_length] => 0
    [starttransfer_time] => 0.27493
    [redirect_time] => 0
*/
function get_web_page( $url )
{
    $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page as an String
        CURLOPT_HEADER         => false,    // don't return headers in the output, but header also allow on curl_getinfo()
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "wunderbitCMS", // who am i
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
    $header  = curl_getinfo( $ch);
    curl_close( $ch );
	print_r($header);
	echo("ERror: ".$errmsg);
	
	/*preg_match( '@<meta.+http-equiv\s*=\s*"(Content-Type)".*>?@i',$content, $httpEquiv );
	if (isset($httpEquiv))
	{
		preg_match( '@content\s*=\s*"([\w/]+)(;\s+charset=([^\s"]+))?@i',$httpEquiv[0], $contentType );
	}
	if (isset($contentType))
	{
		//1 y 3
		print_r($contentType);	
	}*/
}
$currentURL = $_GET["ulr_in"];
get_web_page( $currentURL );
?>