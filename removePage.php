<?php
try
{
require_once("mainClass.php");
session_start();
$FileNameId = $_POST["FileNameId"];

	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	//
	$curPage = $_SESSION["CurrentFile"]->oPages->aFiles[$FileNameId];
	$completeFileName = $curPage->sFolder.$curPage->sFilename;;
	//
	if ($completeFileName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}

$_SESSION["CurrentFile"]->oPages->removePage($FileNameId);
$_SESSION["CurrentFile"]->saveProjectIntoXML();
echo('{}');
}catch(Exception $e)
{
	 echo ("removePage.php: ".  $e->getMessage()."\n");
}
?>