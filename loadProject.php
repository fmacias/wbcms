<?php
try
{
	require_once("mainClass.php");
	session_start();
	$selectedProject = $_POST["selectedProject"];
	$currentNewProject = new CurrentFile;
	if ($currentNewProject->loadProject($selectedProject))
	{
		$_SESSION["CurrentFile"] = $currentNewProject;
		echo (json_encode($_SESSION["CurrentFile"]));
	}else
	{
		throw new Exception("loadProject returns false. Projeckt could not be created!");
	}
}catch(Exception $e)
{
	echo('loadProject.php. Error: '.  $e->getMessage().'\n');
}
//header('Location: index.php');
?>