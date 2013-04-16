<?php
try
{
	require_once("mainClass.php");
	session_start();
	$ProjecktName = trim($_POST["porjecktName"]);
	$ProjecktFolder = trim($_POST["projecktFolder"]);
	if ($ProjecktName=="")
	{
		throw new Exception("Projekt name is obligatory");
	}
	if ($ProjecktFolder=="")
	{
		throw new Exception("Projekt Folder is obligatory");
	}
	$currentNewProject = new CurrentFile;
	$currentNewProject->setProjectFolder($ProjecktFolder);
	$currentNewProject->createNewProject($ProjecktName);
	$_SESSION["CurrentFile"] = $currentNewProject;
	/*if ($currentNewProject->setProjectFolder($ProjecktFolder))
	{
		if ($currentNewProject->createNewProject($ProjecktName))
		{
			$_SESSION["CurrentFile"] = $currentNewProject;
			echo "true";
		}else{
			echo "false";
		}
	}else{
		echo "false";
	}*/
	echo (json_encode($currentNewProject));
}catch(Exception $e)
{
	echo('createProject.php. Error: '.  $e->getMessage().'\n');
}
//header('Location: index.php');

?>