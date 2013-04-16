<?php
try
{
	require_once("mainClass.php");
	session_start();
	$currentSession = $_SESSION["CurrentFile"];
	$FileContent= utf8_encode(file_get_contents( "php://input"));
	/*if ($currentSession->curOFileObj->charSet == "UTF-8")
   	{
   		$FileContent= utf8_encode(file_get_contents( "php://input"));
   	}else
   	{
   		$FileContent= file_get_contents( "php://input");
   	}*/
	$FileContent= file_get_contents( "php://input");
	$bytes = $_SESSION["CurrentFile"]->saveXML2($FileContent);
	$_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
	$_SESSION["CurrentFile"]->saveProjectIntoXML();
	$fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
	echo $fileJSON;
}catch(Exception $e)
{
	echo('saveDOM.php: '.  $e->getMessage(). '\n');
}
?>