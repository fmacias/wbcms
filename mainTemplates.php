<?php
try
{
require_once("mainClass.php");
session_start();

	$FileNameId = $_POST["FileNameId"];
	$CurrentFileName = trim($_POST["FileName"]);
	$BaseURL = trim($_POST["BaseURL"]);
	$HTML_DTD = $_POST["basedHTMLDTD"];
	$unsetOldArray = false;
	$URLToImport = "";
	$UserName = trim($_POST["UserName"]);
	$Password = trim($_POST["Password"]);
	if ($FileNameId!="")
	{
		$adding = false;
		$modifying = true;
	}else{
		$adding = true;
		$modifying = false;
	}
	$pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\´\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
	preg_match_all($pattern,$CurrentFileName, $matches, PREG_SET_ORDER);
	$ArrLength = count($matches);
	if ($ArrLength==0)
	{
		throw new Exception ("\n\tWrong File Name. File name: ".$CurrentFileName);
	}
	$CurrentFileName = $matches[0][1];
	if (($BaseURL=="")&&($HTML_DTD==""))
	{
		throw new Exception("\n\tEither the URL Base or the DTD must be set");
	}
	if ($BaseURL)
	{
			$URLToImport = $BaseURL;
	}else if ($HTML_DTD)
	{
			$URLToImport = WBit_URL.DTDs_FOLDER.$HTML_DTD;	
	}
	
	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	$completeFileName = $_SESSION["CurrentFile"]->oTemplates->templatesFolder."/".$CurrentFileName;
	//
	if ($completeFileName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}
	
	if ($adding)
	{
		$_SESSION["CurrentFile"]->oTemplates->addTemplate($CurrentFileName,$URLToImport,$UserName,$Password);
	}else if($modifying)
	{
		//check if this file name ist not used for any other template
		if ((isset($_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName]))&&($CurrentFileName!=$FileNameId))
		{
			throw new Exception("\n\tThe file ".$CurrentFileName." is already being used by another template.");
		}
		//check if there are not pages related with the template is going to be modified
		/*$path = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sPath;
    	$FileName = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sFilename;
    	$CompletFileName = $path.$FileName;
		if($_SESSION["CurrentFile"]->oPages->existTemplate($CompletFileName)==true)
		{
			throw new Exception ("\n\tThe template ".$FileNameId." can not be replaced with the ".$CurrentFileName." because some pages belong to this template.");
		}*/
		$oldTemplate = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId];
		$oldTemplateURL = $oldTemplate->sHttpPath.$oldTemplate->sFilename;
		//
		$_SESSION["CurrentFile"]->oTemplates->modifyTemplate($CurrentFileName,$FileNameId,$URLToImport,$UserName,$Password);
		
		$curNewTemplate = $_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName];
		$newTemplateURL = $curNewTemplate->sHttpPath.$curNewTemplate->sFilename;
		$_SESSION["CurrentFile"]->oPages->setRelTemplateName($newTemplateURL,$oldTemplateURL);
	}
	echo $_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName]->getFileJSON();
}catch(Exception $e)
{
	$postParams = $FileNameId.",".$CurrentFileName.",".$BaseURL.",".WBit_URL.DTDs_FOLDER.$HTML_DTD.",".$UserName.",".$Password;
	 echo ("\nmainTemplates.php return an Error:".  $e->getMessage().", posted Params: ".$postParams."\n");
}
?>
