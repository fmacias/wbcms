<?php
try
{
	require_once("mainClass.php");
	session_start();
	$currentSession = $_SESSION["CurrentFile"];
	//
	$FileContent= file_get_contents( "php://input");
	if ($currentSession->curOFileObj->charSet != "UTF-8")
   	{

   	}else
   	{
   		
   	}
   	$FileContent = preg_replace("/&amp;/","&",$FileContent);
	$FileContent = preg_replace("/&lt;/","<",$FileContent);
	$FileContent = preg_replace("/&gt;/",">",$FileContent);
	//
	$pattern = '/\w*$/';
	$matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
	$fileType = strtoupper($matches[0]);
	//
	//if ($fileType=="XML")
	//{
	//	$Bytes = $_SESSION["CurrentFile"]->saveXML2($FileContent);
	//}else
	//{
		$Bytes = $_SESSION["CurrentFile"]->saveHTML2($FileContent);
	//}
	if ($Bytes>0)
	{
		$_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
		$_SESSION["CurrentFile"]->saveProjectIntoXML();
		$fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
		echo $fileJSON;
	}else
	{
		 throw new Exception  ("document could not be stored!");
	}
}catch(Exception $e)
{
	echo('saveDOM.php: '.  $e->getMessage(). '\n');
}
?>