<?php
try
{
	require_once("mainClass.php");
	session_start();
	$currentProjeckt = $_SESSION["CurrentFile"]->sXMLFileName;
	$oProjeckt = new projeckt;
	$aProjekts = $oProjeckt->getProjectsFromFileSystemPath();
	unset($oProjeckt);
	/*foreach($aProjekts as $key=>$value)
	{
		if ($value==$currentProjeckt)
		{
			unset($aProjekts[$key]);
		}
	}*/
	header('Content-type: text/plain;charset=UTF-8');
	echo(json_encode($aProjekts));
}catch(Exception $e)
{
	echo("requestProjeckts: ".  $e->getMessage(). "\n");
}
?>