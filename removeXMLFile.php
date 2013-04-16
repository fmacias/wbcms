<?php
try
{
require_once("mainClass.php");
session_start();
$FileNameId = $_POST["FileNameId"];

	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	//
	$curPage = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId];
	$completeFileName = $curPage->sFolder.$curPage->sFilename;;
	//
	if ($completeFileName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}

$_SESSION["CurrentFile"]->removeXMLData($FileNameId);
$_SESSION["CurrentFile"]->saveProjectIntoXML();
/*
if ($removed)
{
	$_SESSION["CurrentFile"]->saveProjectIntoXML();
}else
{
	if (isset($_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId]))
	{
		throw new Exception ('Some pages may belong to this XML File and the change wont be consider!.!');
	}else{
		throw new Exception ('For some reason the file could not be removed!');
	}
}*/
echo ('{removed:"yes"}');
}catch(Exception $e)
{
	 echo ("removeXMLFile.php: ".  $e->getMessage()."\n");
}
?>