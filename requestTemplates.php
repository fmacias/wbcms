<?php
try
{
require_once("mainClass.php");
session_start();
//print_r($_SESSION["CurrentFile"]);
$JSONString = $_SESSION["CurrentFile"]->oTemplates->getFilesJSON();
header('Content-type: text/plain;charset=UTF-8');
echo($JSONString);
}catch(Exception $e)
{
	 echo ("removeTemplates.php: ".  $e->getMessage()."\n");
}
?>