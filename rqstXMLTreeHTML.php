<?php
try
{
	require_once("mainClass.php");
	session_start();
	$tempFileName = $_SESSION["CurrentFile"]->currentFile.".html";
	$tempFile = new File($tempFileName,"temp");
	//
	$currentFile = $_SESSION["CurrentFile"]->currentFSFile;
	$xslFilePath = APP_PATH."xmltree.xsl" ;
	$doc = new DOMDocument();
	$xsl = new XSLTProcessor();
	$doc->load($xslFilePath);
	$xsl->importStyleSheet($doc);
	$doc->load($currentFile);
	$xsltOuptput = $xsl->transformToXML($doc);
	$tempFile->file_put_contents($xsltOuptput);
	$fileJSON = $tempFile->getFileJSON();
	echo $fileJSON;
}catch(Exception $e)
{
	echo("rqstXMLTreeHTML: ".  $e->getMessage(). "\n");
}
?> 
