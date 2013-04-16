<?php
try
{
require_once("mainClass.php");
session_start();
$FileNameId = $_POST["FileNameId"];
$PageFileName = $_POST["PageFileName"];
$currentPage = $_SESSION["CurrentFile"]->oPages->aFiles[$PageFileName];
$currentPage->oDataFiles->removeDataRelation($FileNameId);
$_SESSION["CurrentFile"]->saveProjectIntoXML();
echo('{}');
}catch(Exception $e)
{
	 echo ("removeDataRelation.php:".  $e->getMessage()."\n");
}
?>