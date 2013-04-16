<?php
try
{
	require_once("mainClass.php");
	session_start();
	$DOMOperationsFile = "";
	$currentSession = $_SESSION["CurrentFile"];
	if ($currentSession->curOFileObj->ParserMimeType == "text/html")
	{
		$DOMOperationsFile = $currentSession->getHTMLWorkingFile(); 
	}else if ($currentSession->curOFileObj->ParserMimeType == "application/xhtml+xml")
	{
		$DOMOperationsFile = $currentSession->getXHTMLWorkingFile();
	}
//	echo ('{rqstState:"OK"}');
	echo ("{DOMOpFile:\"$DOMOperationsFile\"}");
}catch(Exception $e)
{
	throw new Exception  ('rqstParseringHTML.php fails '.  $e->getMessage().'\n');
}
?>