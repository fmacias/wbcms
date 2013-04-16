<?php
try
{
require_once("mainClass.php");
session_start();
$FileNameId = $_POST["FileNameId"];

	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	$templateFileName = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sFilename;
	$templateFilePath  = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sFolder;
	$completeName = $templateFilePath.$templateFileName;
	//
	if ($completeName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}
//$_SESSION["CurrentFile"]->oTemplates->removeTemplate($FileNameId);
$_SESSION["CurrentFile"]->removeTemplate($FileNameId);
$_SESSION["CurrentFile"]->saveProjectIntoXML();
/*if ($removed)
{
	$saved = $_SESSION["CurrentFile"]->saveProjectIntoXML();
	if ($saved==false)
	{
		$selectedProject = $_SESSION["CurrentFile"]->sXMLFileName;
		if ($_SESSION["CurrentFile"]->loadProject($selectedProject))
		{
			throw new Exception ('The modifications could not be stored in the XML Configuration file. The changes wont be consider!');
		}
	}
}else
{
	if (isset($_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]))
	{
		throw new Exception ('Some pages may belong to this Template and the change wont be consider!.!');
	}else{
		throw new Exception ('For some reason the file could not be removed!');
	}
}*/
echo ('{rqstState:"OK"}');
}catch(Exception $e)
{
	 echo ("removeTemplate.php: ".  $e->getMessage()."\n");
}
?>