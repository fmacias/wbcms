<?php
function defineConstants($USER)
{
	define("USER",$USER);
	//
	define("WBit_URL","http://".$_SERVER['HTTP_HOST']."/");
	define("WBit_PATH",$_SERVER['DOCUMENT_ROOT']."/");
	define("APP_PATH",$_SERVER['DOCUMENT_ROOT']."/wbcms/");
	define("APP_FOLDER","wbcms/");
	define("DTDs_FOLDER","DTDs/");//public folder with empty files used for the application to create empty templates
	//
	define("URL_PATH","http://".$_SERVER['HTTP_HOST']."/$USER/");//Root URL
	define("FILESYSTEM_PATH",$_SERVER['DOCUMENT_ROOT']."/$USER/"); //absolute PATH of the server root folder
	define("PROJEKTS_PATH",$_SERVER['DOCUMENT_ROOT']."/$USER/projects/");//folder with the projekt files
	define("PROJEKTS_URL","http://".$_SERVER['HTTP_HOST']."/$USER/projects/");//folder with the projekt files
	//define("PROJEKTS_FOLDER","$USER/projects/");//folder with the projekt files
	define("PROJEKTS_FOLDER","projects/");//folder with the projekt files
}
if (!(isset($_SERVER[REDIRECT_REMOTE_USER]))||($_SERVER[REDIRECT_REMOTE_USER]==""))
{
	 throw new Exception ("\n\tConstants could not be created: ".  $e->getMessage()."\n");
}

defineConstants($_SERVER[REDIRECT_REMOTE_USER]);
/*define("URL_PATH","http://".$_SERVER['HTTP_HOST']."/");//Root URL
define("APP_FOLDER","wbcms/");//Root URL
define("FILESYSTEM_PATH",$_SERVER['DOCUMENT_ROOT']."/"); //absolute PATH of the server root folder
define("PROJEKTS_PATH",$_SERVER['DOCUMENT_ROOT']."/wbcms/projects/");//folder with the projekt files
define("PROJEKTS_URL","http://".$_SERVER['HTTP_HOST']."/wbcms/projects/");//folder with the projekt files
define("PROJEKTS_FOLDER","wbcms/projects/");//folder with the projekt files
define("DTDs_FOLDER","DTDs/");//public folder with empty files used for the application to create empty templates*/
?>
