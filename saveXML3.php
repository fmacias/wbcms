<?php
$url = $_GET["URL"];
$fileExtension = $_GET["extension"];
$fileDoc = new DOMDocument();
//$loaded = $fileDoc->load('http://localhost/wbcms/test.xml');
if ($fileExtension=="html")
	$loaded = @$fileDoc->loadHTMLFile($url);
else if ($fileExtension=="xml")
{
	$loaded = $fileDoc->load($url);
}
//$newNode = $fileDoc->importNode($doc->firstChild, true);
if ($loaded)
{
	echo ("<br/>Actual Encoding: ");
	echo $fileDoc->actualEncoding;
	
	//to create the doctype
	echo ("2<br/>doctype->PublicId: ");
	echo $fileDoc->doctype->publicId;
	echo ("2<br/>doctype->SystemId: ");
	echo $fileDoc->doctype->systemId;
	echo ("<br/> doctype->name: ");
	echo $fileDoc->doctype->name;
	//echo $fileDoc->doctype->entities;
	//echo $fileDoc->doctype->notations;
	echo ("<br/>doctype->internal subsets: ");
	echo $fileDoc->doctype->internalSubsets;
	
	echo ("2<br/>documentURI: ");
	echo $fileDoc->documentURI;
	echo ("<br/>formatOutput: ");
	echo $fileDoc->formatOutput;
	echo ("<br/>Encoding: ");
	echo $fileDoc->encoding;
	echo ("<br/>Version");
	echo $fileDoc->version;
	echo ("<br/>xmlEncoding: ");
	echo $fileDoc->xmlEncoding;
	echo ("<br/>Version: ");
	echo $fileDoc->version;
	echo ("<br/>xmlVersion: ");
	echo $fileDoc->xmlVersion;
	echo ("<br/>childNodes.length: ");
	echo $fileDoc->childNodes->length;
	echo ("<br/>childNodes[0].nodeName: ");
	echo $fileDoc->childNodes->item(0)->nodeName;
	echo ("<br/>childNodes[0].nodeType: ");
	echo $fileDoc->childNodes->item(0)->nodeType;
	echo ("<br/>childNodes[0].length: ");
	echo $fileDoc->childNodes->item(0)->childNodes->length;
	echo ("<br/>childNodes[1].nodeName: ");
	echo $fileDoc->childNodes->item(1)->nodeName;
	echo ("<br/>childNodes[1].length: ");
	echo $fileDoc->childNodes->item(1)->childNodes->length;
	echo ("<br/>childNodes[1].nodeType: ");
	echo $fileDoc->childNodes->item(1)->nodeType;
	echo "<br/>Done";
}
//$fileDoc->childNodes->item(0)->replaceChild($newNode,$fileDoc->documentElement);

//print $fileDoc->saveHTMLFile();


/*
header('Content-type: text/plain;charset=UTF-8');
echo ("{Bytes:\"$Bytes\",URL:\"$URL\"}");
*/
?>