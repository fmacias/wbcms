<?php
try
{
	require_once("mainClass.php");
	session_start();
	$currentSession = $_SESSION["CurrentFile"];
	
	/*function temp_put_contents($data)
  	{
  		try
  		{
	       if (($h = fopen(FILESYSTEM_PATH.APP_FOLDER."domTestTemp.txt", 'w')) === false) 
	       {
	       	 throw new Exception  ("\n\tFile->file_put_contents: fopen fails for file".  FILESYSTEM_PATH.APP_FOLDER."domTestTemp.txt"."\n");
	       }
	       if (($bytes = fwrite($h, $data)) === false) {
	       		throw new Exception  ("\n\tFile->file_put_contents: fwrite fails for file". FILESYSTEM_PATH.APP_FOLDER."domTestTemp.txt"."\n");
	       }
	       fclose($h);
	       return $bytes;
  		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFile->file_put_contents: ".  $e->getMessage()."\n");
		}
   	}*/
   
   	if ($currentSession->curOFileObj->charSet != "UTF-8")
   	{
   		$FileContent= utf8_decode(file_get_contents( "php://input"));
   	}else{
   			$FileContent= file_get_contents( "php://input");
   	}
	$bytes = $_SESSION["CurrentFile"]->saveCurrentDocument($FileContent);
	echo ("{bytes:".$bytes."}");
}catch(Exception $e)
{
	echo('saveDOM.php: '.  $e->getMessage(). '\n');
}
?>