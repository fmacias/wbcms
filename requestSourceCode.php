<?php
//$sourceCode = $_SESSION["CurrentFile"]->getSourceCode();//call to file_get_contents
/* Get the content type from the HTTP response */
//$nlines = count( $http_response_header );
//header("location: ".$_SESSION["CurrentFile"]->currentURLFile);
//echo($_SESSION["CurrentFile"]->currentFSFile);
//file_get_contents($_SESSION["CurrentFile"]->currentFSFile);
//var_dump($http_response_header);

/*$stat = stat($_SESSION["CurrentFile"]->currentFSFile);
print_r($_SERVER);
print_r(posix_getpwuid($stat['uid']));
*/
//print_r($_SERVER);
/*for ( $i = $nlines-1; $i >= 0; $i-- ) {
    $line = $http_response_header[$i];
    if ( substr_compare( $line, 'Content-Type', 0, 12, true ) == 0 ) 
    {
    	echo substr_compare( $line, 'Content-Type', 0, 12, true );
    	break;
    }
}
echo "done";*/
/* Get the MIME type and character set */
/*preg_match( '@Content-Type:\s+([\w/+]+)(;\s+charset=(\S+))?@i', $content_type, $matches );
if ( isset( $matches[1] ) )
    $mime = $matches[1];
if ( isset( $matches[3] ) )
    $charset = $matches[3];

if (( ! ( isset ( $mime ) ))||( ! ( isset ( $charset ) )))
{
	preg_match( '@<meta\s+http-equiv="Content-Type"\s+content="([\w/]+)(;\s+charset=([^\s"]+))?@i',$sourceCode, $matches );
	if ( isset( $matches[1] ) )
	    $mime = $matches[1];
	if ( isset( $matches[3] ) )
	    $charset = $matches[3];
}
if (( ! ( isset ( $mime ) ))||( ! ( isset ( $charset ) )))
{
	preg_match( '@<\?xml.+encoding="([^\s"]+)@si', $sourceCode, $matches );
	$mime = 'application/xml';
	if ( isset( $matches[1] ) )
		$charset = $matches[1];
}
*/
/*require_once("common.php");
$URL= $_SESSION["CurrentFile"]->currentURLFile;
$fileInfo = get_url_contents($URL);
$content = $fileInfo["content"];
$mime = $fileInfo["mime"];
$charset = $fileInfo["charset"];
$contentType = $fileInfo["contentType"];
if ($charset)
{
	header('Content-type: '.$mime.';charset='.$charset);
}
echo $content."MIme: ".$mime." charset: ".$charset."contentType: ".$contentType;*/
try
{
	require_once("mainClass.php");
	session_start();
	$currentSession = $_SESSION["CurrentFile"];
	$mime = $currentSession->curOFileObj->sContentType;
	$charset = $currentSession->curOFileObj->charSet;
	/*header('Content-type: '.$mime.';charset='.$charset);
	header('location: '.$currentSession->currentURLFile);*/
	$pattern = '/\w*$/';
	$matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
	$fileType = strtoupper($matches[0]);
	$curFileEncoding = $currentSession->curOFileObj->charSet;
	//
	/*if ($fileType=="XML")
	{
		header('Content-type: '.$mime.';charset='.$charset);
		header('location: '.$currentSession->currentURLFile);
	}else{
		header('Content-type: '.$mime.';charset='.$charset);
		header('location: '.$currentSession->currentURLFile);
	}*/
	/*$fileContent = file_get_contents($_SESSION["CurrentFile"]->currentFSFile);
	if ($currentSession->curOFileObj->charSet != "UTF-8")
   	{
		$fileContent = utf8_encode($fileContent);
   	}
   	echo ($fileContent);
   	*/
	header("Cache-Control: no-cache"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Datum in der Vergangenheit
	//header("Pragma: no-cache");
	//header("Expires: -1");
	header('Content-type: '.$mime.';charset='.$charset);
	header('location: '.$currentSession->currentURLFile);
}catch(Exception $e)
{
	echo('requestSourceCode.php: '.  $e->getMessage(). '\n');
}
?>