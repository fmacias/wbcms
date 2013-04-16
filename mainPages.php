<?php
try
{
	require_once("mainClass.php");
	session_start();
	$FileNameId = $_POST["FileNameId"];
	$CurrentFileName = trim($_POST["FileName"]);
	$URLTemplate = trim($_POST["URLTemplate"]);
	$folderName = $_POST["FolderName"];
	$folderName = ltrim($_POST["FolderName"]);
	$folderName = rtrim($_POST["FolderName"]);
	$aFolders = array();
	$unsetOldArray = false;
	$UserName = trim($_POST["UserName"]);
	$Password = $_POST["Password"]; 
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
		throw new Exception("Wrong File Name. FileName:".$CurrentFileName);
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
				throw new Exception('A folder or a File name can not contain any of the following characters: \/:*?"<> |');
			}
			if ($fValue)
			{
				$treatedFolderName .= $fValue."/"; 
			}elseif($counter<$aFoldersLength)
			{
				throw new Exception('The folder is wrong. A folder kan not be empty!');
			}			
			
		}
	}
	$folderName = $treatedFolderName;
	//echo $folderName;
	$CurrentFileName = $matches[0][1];
	if ($URLTemplate=="")
	{
		throw new Exception("\n\tA page is alway based on a Template. Template must be set!");
	}
	
	$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	$curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
	$completeFileName = $folderName.$CurrentFileName;
	//
	if ($completeFileName==$curCompleteFileName)
	{
		throw new Exception ("\n\tThe file you are triying to modify is being edited right now!");
	}
	if ($adding)
	{
		$_SESSION["CurrentFile"]->oPages->addPage($CurrentFileName,$folderName,$URLTemplate,$UserName,$Password);
	}else if($modifying)
	{
		//if ($folderName.$CurrentFileName != $FileNameId)
		//{
			$_SESSION["CurrentFile"]->oPages->modifyPage($CurrentFileName,$FileNameId,$folderName,$URLTemplate,$UserName,$Password);
		//}
	}
	echo $_SESSION["CurrentFile"]->oPages->aFiles[$folderName.$CurrentFileName]->getFileJSON();
}catch(Exception $e)
{
	 echo ("\n\tmainPages.php: ".  $e->getMessage()."\n, input Params: folder: ".$folderName.", file Name Id: ".$FileNameId.", CurrentFileName: ".$CurrentFileName.", URL Templates: ".$URLTemplate.", User Name: ".$UserName.", Password:".$Password);
}
?>