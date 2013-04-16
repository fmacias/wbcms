<?php
try
{
	require_once("mainClass.php");
	session_start();
	$fileNameId = $_POST["FileNameId"];
	$CompleteFileName = trim($_POST["FileName"]);//always right, always an existing XML File.
	$pageFileName = $_POST["PageFileName"];
	$byDefault = strtoupper($_POST["byDefault"]);
	$index=trim($_POST["Index"]);
	$language = trim($_POST["Language"]);

//modifiying o adding a new one?
	if ($fileNameId!="")
	{
		$adding = false;
		$modifying = true;
	}else{
		$adding = true;
		$modifying = false;
	}
	$pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\´\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
	preg_match_all($pattern,$CompleteFileName, $matches, PREG_SET_ORDER);
	$ArrLength = count($matches);
	if ($ArrLength==0)
	{
		throw new Exception('Wrong File Name');
	}
	$CurrentFileName = $matches[0][1];
	//folder with the XML Files of this projeckt
	$relXMLFile = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$CompleteFileName];
	$fileFolder = $relXMLFile->sFolder;
	$selectedPage = $_SESSION["CurrentFile"]->oPages->aFiles[$pageFileName];
	$dataFiles = $selectedPage->oDataFiles; 
	//echo("index: ".$index.", CurrentFileName: ".$CurrentFileName.", FileNameId: ".$FileNameId.", language: ".$language.", byDefault:".$byDefault.", fileFolder:".$fileFolder);
	if ($adding)
	{
		$dataFiles->addDataFile($index,$CurrentFileName,$language,$byDefault,$fileFolder);
	}else if($modifying)
	{
		//delete the reference of the file but not the file
		//unset($dataFiles->aFiles[$index]);
		$dataFiles->modifyDataFile($index,$CurrentFileName,$fileNameId,$language,$byDefault,$fileFolder);
	}
	echo $dataFiles->aFiles[$fileFolder.$CurrentFileName]->getFileJSON();
}catch(Exception $e)
{
	 echo ("mainRelPageData.php: ".  $e->getMessage()."\n");
}
?>