<?php
$user = $_GET["UserName"];
$pass = "RxDfDb.ir3NDA";
$rootWB = $_SERVER['DOCUMENT_ROOT'].'/';
require_once("constants.php");
function recurse_copy($src,$dst) 
{ 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
            } 
            else { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            } 
        } 
    } 
    closedir($dir); 
}

if (file_exists($rootWB.".htaccess")) 
{
		$htaccess = fopen($rootWB."wbcms/.htaccess", 'a');
		if ($htaccess==false)
		{
			throw new Exception("\n\tFile->setUserWorkFolders: could not create the .htaccess file\n");
		}
		fputs($htaccess, "\n"."require user $user");
		fclose($htaccess);
}
if (file_exists($rootWB."users/.htpasswd"))
{
	$htpasswd = fopen($rootWB."users/.htpasswd", 'a');
	fputs($htpasswd, "\n$user:$pass");
	fclose($htpasswd);
}
if (file_exists($rootWB.$user)){}else
{
	mkdir($rootWB.$user);
	recurse_copy($rootWB."ADVA",$rootWB.$user);
	$FileContent= file_get_contents($rootWB.$user."/projects/config.xml");
	$FileContent = preg_replace("/ADVA/",$user,$FileContent);
	file_put_contents($rootWB.$user."/projects/config.xml", $FileContent);
}
?>