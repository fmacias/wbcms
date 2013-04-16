<?php
	require_once("mainClass.php");
	session_start();
	//
	unset($_SESSION["CurrentFile"]);
	clearstatcache();
	$USER = $_SERVER[REMOTE_USER];
	
	
	//
	//header('Location: http://www.wunderbit.com/thanks/index.php');
    //header('HTTP/1.0 401 Unauthorized');
     //header('WWW-Authenticate: Basic realm="root"');
    // header('Location: http://fakeuser:fakepw@wunderbit.com/wbcms',301);
     //header('Location: http://www.wunderbit.com/thanks/index.php');
//     header('HTTP/1.0 401 Unauthorized');
?>