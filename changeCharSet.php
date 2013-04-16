<?php
try
{
	require_once("mainClass.php");
	session_start();
	$postedCharSet = $_POST["charset"];
	$_SESSION["CurrentFile"]->curOFileObj->charSet=$postedCharSet;
	/*if ($_SESSION["CurrentFile"]->curOFileObj->charSet=="UTF-8")
	{
		if ($postedCharSet!="UTF-8")
		{
			utf8_encode
		}else
		{
			
		}	
	}else
	{
		if ($postedCharSet=="UTF-8")
		{
			
		}else{
			
		}	
	}*/
	$fileJSON = $_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
	echo $fileJSON;
}catch(Exception $e)
{
	echo('changeCharSet.php: '.  $e->getMessage(). '\n');
}
?>