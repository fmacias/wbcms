<?php
try
{
	require_once("mainClass.php");
	session_start();
	$JSONString = $_SESSION["CurrentFile"]->oPages->getFilesJSON();
	header('Content-type: text/plain;charset=UTF-8');
	echo($JSONString);
}catch(Exception $e)
{
	echo("requestPage.php: ".  $e->getMessage(). "\n");
}	
?>