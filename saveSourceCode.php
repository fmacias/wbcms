<?php
try
{
	require_once("mainClass.php");
	session_start();
	
	$currentSession = $_SESSION["CurrentFile"];
	$FileContent= file_get_contents( "php://input");
	
	$pattern = '/\w*$/';
	$matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
	$fileType = strtoupper($matches[0]);
	$curFileEncoding = $currentSession->curOFileObj->charSet;
	//
	if ($fileType=="XML")
	{
		preg_match( '@<\?xml.+encoding\s*="([^\s"]+)@si', $FileContent, $encoding );
	//	
		if (isset($encoding))
		{
			$charSet = $encoding[1];
		}
		if (!(isset($charSet)))
		{
			$charSet = "UTF-8";
		}
		if ($charSet=="UTF-8")
		{
			//$FileContent= utf8_encode($FileContent);
		}else{
			$FileContent= utf8_decode($FileContent);
		}
	//$FileContent= utf8_encode($FileContent);
		$bytes = $_SESSION["CurrentFile"]->saveXMLFromString($FileContent,$charSet);
	}else if ($fileType == "HTML")
	{
		preg_match( '@<meta.+http-equiv\s*=\s*"(Content-Type)".*>?@i',$FileContent, $httpEquiv );
		if (isset($httpEquiv))
		{
			preg_match( '@content\s*=\s*"([\w/]+)(;\s+charset=([^\s"]+))?@i',$httpEquiv[0], $contentType );
		}
		if (isset($contentType))
		{
			$charSet = $contentType[3];
		}
		if (!(isset($charSet)))
		{
			$charSet = "UTF-8";
		}
		if ($charSet == "UTF-8")
		{
		}else
		{
			//$FileContent= utf8_decode($FileContent);
		}
		//$bytes = $_SESSION["CurrentFile"]->saveHTML2($FileContent);
		/*if ($charSet == "UTF-8")
		{
	  		$FileContent= utf8_encode(file_get_contents( "php://input"));
 		 }else{
		 	$FileContent= file_get_contents( "php://input");
		 }*/
		 /*else
		 {
		  		$FileContent= utf8_encode(file_get_contents( "php://input"));
		 }*/
//		$FileContent= file_get_contents( "php://input");
		if ($charSet != "UTF-8")
		{
	  		//$FileContent= utf8_decode(file_get_contents( "php://input"));
 		}
		$Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($FileContent);
	}else{
		 throw new Exception  ('saveSourceCode.php->file not recongnized. file type: '.$this->curOFileObj->sContentType.'\n');
	}
	//$Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($FileContent);
	$_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
	$_SESSION["CurrentFile"]->saveProjectIntoXML();
	$fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
	echo $fileJSON;
}catch(Exception $e)
{
	echo('saveSourceCode.php: '.  $e->getMessage(). '\n');
}
?>