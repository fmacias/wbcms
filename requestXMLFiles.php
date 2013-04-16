<?php
try
{
	require_once("mainClass.php");
	session_start();
	$JSONString = $_SESSION["CurrentFile"]->oXMLFiles->getFilesJSON();
	header('Content-type: text/plain;charset=UTF-8');
	echo($JSONString);
}catch(Exception $e)
{
	 echo ("removeXMLFiles.php: ".  $e->getMessage()."\n");
}
?>