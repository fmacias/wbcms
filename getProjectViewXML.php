<?php
try
{
	require_once("mainClass.php");
	session_start();
	$projektXMLFile = $_SESSION["CurrentFile"]->getProjektXMLFile();
	$projektName = $_SESSION["CurrentFile"]->getProjektName();
	$XMLURL = PROJEKTS_URL.$projektXMLFile;
	//clearstatcache();
	/*Header("Cache-control: private, no-cache");
	Header("Expires: Mon, 26 Jun 1997 05:00:00 GMT");
	Header("Pragma: no-cache");*/
	//header ("Last-Modified: " . gmdate ("D, d M Y H:i:s") . " GMT");
	//header("Pragma: no-cache");
	//header("Cache: no-cache");
	echo ('{projektXMLFile:"'.$XMLURL.'",projektName:"'.$projektName.'",contentType:"text/xml"}');
}catch(Exception $e)
{
	echo('getProjectViewXML.php: '.  $e->getMessage(). '\n');
}
?>