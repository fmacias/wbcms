<?php
try
{
	//php may lost the session on assicrpnous calling
	require_once("mainClass.php");
	session_start();
	$fileName = $_POST["fileName"];//url
	$currentSession = $_SESSION["CurrentFile"];
	//clearstatcache();
	$_SESSION["CurrentFile"] = $currentSession; 
	header('Location: '.$fileName);
}catch(Exception $e)
{
	echo('getFile.php: '.  $e->getMessage(). '\n');
}
?>