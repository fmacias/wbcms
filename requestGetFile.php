<?php
try
{
	require_once("mainClass.php");
	session_start();
	$currentFile = $_SESSION["CurrentFile"];
	echo json_encode($currentFile);
}catch(Exception $e)
{
	echo("requestGetFile: ".  $e->getMessage(). "\n");
}
?>