<?php
try
{
require_once("mainClass.php");
session_start();
	$FileNameId = $_POST["FileNameId"];
	$CurrentFileName = trim($_POST["FileName"]);
	$BaseURL = trim($_POST["BaseURL"]);
	$UserName = trim($_POST["UserName"]);
	$Password = $_POST["Password"];
	$folderName = $_POST["folderName"];
	$folderName = ltrim($folderName);
	$folderName = rtrim($folderName);
	$aFolders = array();
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
		throw new Exception('Wrong File Name');
	}
	//check the folder
	$treatedFolderName = "";
	if ($folderName!="")
	{
		//check the folder sintax
		$aFolders = split('[/]', $folderName);
		$pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
		$aFoldersLength = count($aFolders);
		$counter = 0;
		foreach($aFolders as $fKey=>$fValue)
		{
			$counter++;
			if (preg_match ($pattern , $fValue)==1)
			{
				throw new Exception("\n\tA folder or a File name can not contain any of the following characters: \/:*?/\"<> |");
			}
			if ($fValue)
			{
				$treatedFolderName .= $fValue."/"; 
			}elseif($counter<$aFoldersLength)
			{
				throw new Exception("\n\tThe folder is wrong. A folder kan not be empty!");
			}			
			
		}
	}
	$folderName = $treatedFolderName;
	$CurrentFileName = $matches[0][1];
	
	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	$completeFileName = $folderName.$CurrentFileName;
	//
	if ($completeFileName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}
	
	//if (($BaseURL=="")&&($HTML_DTD==""))
	if (($BaseURL=="")&&($CurrentFileName==""))
	{
		throw new Exception("\n\tEither the URL or the File Name must be set");
	}
	if ($adding)
	{
		$_SESSION["CurrentFile"]->oXMLFiles->addXMLFile($CurrentFileName,$folderName,$BaseURL,$UserName,$Password);	
	}else if($modifying)
	{
		/*if ((isset($_SESSION["CurrentFile"]->oXMLFiles->aFiles[$folderName.$CurrentFileName]))&&($folderName.$CurrentFileName!=$FileNameId))
		{
			throw new Exception ('The file name'.$CurrentFileName.' is already being used by another XML Data File.');
		}*/
		$path = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId]->sPath;
    	$FileName = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId]->sFilename;
    	$CompletFileName = $path.$FileName;
		if ($_SESSION["CurrentFile"]->oPages->existXMLData($CompletFileName))//referencial Integrity
	    {	
	    	throw new Exception ('The XML File '.$FileNameId.' can not be replaced with the '.$folderName.$CurrentFileName.' because some pages belong to this file.');
	    }
		$_SESSION["CurrentFile"]->oXMLFiles->modifyXMLFile($CurrentFileName,$FileNameId,$folderName,$BaseURL,$UserName,$Password);
	}
	echo $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$folderName.$CurrentFileName]->getFileJSON();
}catch(Exception $e)
{
	echo ("mainXMLFiles.php: ".  $e->getMessage()."\n");
}
?>