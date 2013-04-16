<?php
try
{
	require_once("mainClass.php");
	session_start();
	//$curFileName = $_POST["FileName"];//File Index
	$curFileIndex = $_POST["FileIndex"];//File Index
	$curCategorie = $_POST["FileCategorie"];
	$oFile = NULL;
	switch ($curCategorie) {
	    case "Template":
	        $oFile = $_SESSION["CurrentFile"]->oTemplates->aFiles[$curFileIndex];
	    	break;
	    case "Page":
	        $oFile = $_SESSION["CurrentFile"]->oPages->aFiles[$curFileIndex];
	        break;
	    case "DataFile":
	    	$oFile = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$curFileIndex];
	        break;
	      case "ConfigFile":
	      	$oFile = new File($_SESSION["CurrentFile"]->sXMLFileName,"projects");
	      	/*header('Content-type: text/plain;charset=UTF-8');
			$fileJSON =$oProjektFile->getFileJSON();
			echo $fileJSON;
			return;*/
	        break;
	    default:
	    	echo '{Error:"Categorie must be Template, Page,DataFile or ConfigFile"}';
	    	return false;
	}
	$_SESSION["CurrentFile"]->setCurrent($oFile);
	header('Content-type: text/plain;charset=UTF-8');
	$fileJSON =$oFile->getFileJSON();
	echo $fileJSON;
}catch(Exception $e)
{
	echo("requestSetFile: ".  $e->getMessage(). "\n");
}
?>