<?php
try
{
	require_once("mainClass.php");
	session_start();
	$_SESSION["CurrentFile"]->saveProjectIntoXML();
	echo ('{}');
	/*if ($saved)
	{
		$currentSession = $_SESSION["CurrentFile"];
		$_SESSION["CurrentFile"] = $currentSession; 
		echo ('{}');
	}else
	{
			 throw new Exception ('The modifications could not be stored in the XML Configuration file. The changes wont be consider!');
	}*/
}catch(Exception $e)
{
	echo("saveProjektInToXML.php: ".  $e->getMessage(). "\n");
}
?>