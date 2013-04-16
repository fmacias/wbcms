<?php 
try
{
	require_once("mainClass.php");
	session_start();
	$USER = $_SERVER[REMOTE_USER];
	setUserWorkFolders($USER);
	Header("Cache-Control: No-cache, Must-revalidate");
	require_once("index3.html");
}catch(Exception $e)
{
	 echo ("\n\tindex.php fails: ".  $e->getMessage());
}
?>