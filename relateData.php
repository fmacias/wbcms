<?php
class File
{
	public $sPath='';
	public $sHttpPath='';
	public $sFilename='';
	public $fileExtension = '';
	public $sFolder='';
	public $sContentType = '';
	public $ParserMimeType = '';
	public $charSet = ''; 
	function __construct($sFileNameIn,$fileFolder)
	{
		try
		{	
			if (!isset($fileFolder))
			{
				$fileFolder = "";
			}
			if ($this->setFolder($fileFolder))
			{
				$this->sPath = FILESYSTEM_PATH.$this->sFolder;
				$this->sHttpPath = URL_PATH.$this->sFolder;
				$this->sFilename = $sFileNameIn;
				$this->setDefaultContentType();//sets sContent type and File Extension
				$this->createDefaultFile();
			}else
			{
				throw new Exception("\n\tFile->__construct: Folder could not be created\n");
			}
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->__construct: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
	protected function setFolder($fileFolder)
	{
		try
		{
		//check the folder sintax
			$fileFolder = ltrim($fileFolder);
			$fileFolder = rtrim($fileFolder);
			$aFolders = split('[/]', $fileFolder);
			$FolderLength = count($aFolders);
			$pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
			foreach($aFolders as $fKey=>$fValue)
			{
				if (preg_match ($pattern , $fValue)==1)
				{
					throw new Exception ("\n\tFile->setFolder: Folders or a Files names can not contain any of the following characters: \/:*?''<> |\n");
				}			
			}
			$currentPath= FILESYSTEM_PATH;
			$currentFolder = "";
			$bSetFolder = TRUE;
			foreach($aFolders as $fKey=>$fValue)
			{
				if ($fValue!="")
				{
					//echo "setFolder->".$fValue."\n";
					if (!(file_exists($currentPath.'/'.$fValue))) 
					{
						$folderCreated = mkdir($currentPath.'/'.$fValue);
						$bSetFolder = $folderCreated; 		
					}else
					{
						$bSetFolder = TRUE;	
					}
					if ($bSetFolder)
					{
						$currentPath = $currentPath.'/'.$fValue;
						$currentFolder .= $fValue.'/';
					}else
					{
						//if its not the las element(folder) or it is the last element an the value is not empty(it means does not finish with /)
						//if (($nArrCounter < $FolderLength)||(($nArrCounter == $FolderLength)&&($fValue!="")))
						//{
							throw new Exception("\n\tFile->setFolder: The file could not be created: path: ".$currentPath."\n");
						//}
					}
				}
			}
			$this->sFolder = $currentFolder;
			return true;
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->setFolder: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
	protected function createDefaultFile()
	{
		try
		{
			//clearstatcache();
			if (file_exists($this->sPath.$this->sFilename)) 
			{
			    //echo "The file $filename exists";
			} else 
			{
				$ourFileHandle = fopen($this->sPath.$this->sFilename, 'w');// or die("can't open file");
				if ($ourFileHandle==false)
				{
					throw new Exception("\n\tFile->createDefaultFile: can't open file: path: ".$this->sPath.", Filename: ".$this->sFilename."\n");
				}
				fclose($ourFileHandle);
			}
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->createDefaultFile: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
	public function createFileFormURL($URL,$UserId,$Password)
	{
		try
		{
			//$str = $this->get_url_contents($URL);
			//clearstatcache();
			$str= $this->get_url_contents($URL,$UserId,$Password);	
			$Bytes = $this->file_put_contents($str);
			if ($Bytes)
			{
				$this->setParserContentType();
			}else
			{
				throw new Exception("\n\tFile->createFileFormURL: file_put_contents fails. Returned Bytes: ".$Bytes."\n");
			}
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->createFileFormURL: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
	public function get_url_contents( $url,$UserId,$PassWord)
	{
		try
		{
			//	$url = preg_match( '@([\w/+]+)(;\s+charset=(\S+))?@i', $url, $matches );
				$url = preg_replace("/http:\/\//","",$url);
				$urlEncoded = rawurlencode($url);
				$urlEncoded = preg_replace("/%2F/","/",$urlEncoded);
				$urlEncoded = preg_replace("/%3F/","?",$urlEncoded);
				$urlEncoded = preg_replace("/%3D/","=",$urlEncoded);
				$url = 'http://'.$urlEncoded;
				//
		    	$cURLoptions = array(
		        CURLOPT_RETURNTRANSFER => true,     // return web page as an String
		        CURLOPT_HEADER         => false,    // don't return headers in the output, but header also allow on curl_getinfo()
		        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
		        CURLOPT_ENCODING       => "",       // handle all encodings
		        CURLOPT_USERAGENT      => "wunderbitCMS", // who am i
		        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
		        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
		        CURLOPT_TIMEOUT        => 120,      // timeout on response
		        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
		    );
		    $ch = curl_init( $url );
		    curl_setopt_array( $ch, $cURLoptions );
		    if ((isset($UserId))&& (isset($PassWord)))
		    {
			    if (($UserId!=NULL)||($UserId!=""))
			    {
				    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC ) ; 
					curl_setopt($ch, CURLOPT_USERPWD, $UserId.":".$PassWord);
			    }
		    } 
		    $content = curl_exec( $ch );
		    $err     = curl_errno( $ch );
		    $errmsg  = curl_error( $ch );
		    $header  = curl_getinfo( $ch);
		    preg_match( '@([\w/+]+)(;\s+charset=(\S+))?@i', $header["content_type"], $matches );
		    if (isset( $matches[1] )) $this->sContentType = $matches[1];
		    if (isset($matches[3]))$this->charSet = $matches[3];
		    curl_close( $ch );
			if ($err!=0)
			{
				throw new Exception("\n\tcURL returns an Error. Error: ".$errmsg."\n\t URL: ".$url."\n");
			}else if ($header["http_code"]==401)//authentification required
			{
				throw new Exception("\n\tAuthentifications required! Provide the username and the password[".$UserId.":".$PassWord."]\n");
			}else if($header["http_code"]!=200)
			{
				throw new Exception("\n\tThe URL could not be collected! Request Status: ".$header["http_code"]."\n");
			}
			//
			//$sContentType $charSet
			//get Content Type and Charset from cURL contentType
			/*if ( isset( $matches[1] ) ) $sContentType = $matches[1];
			if ( isset( $matches[3] ) ) $charSet = $matches[3];
			
			//get content Type from meta tag
			if (( ! ( isset ( $sContentType ) ))||( ! ( isset ( $charSet ) )))
			{
					preg_match( '@<meta.+http-equiv\s*=\s*"(Content-Type)".*>?@i',$content, $httpEquiv );
					if (isset($httpEquiv))
					{
						preg_match( '@content\s*=\s*"([\w/]+)(;\s+charset=([^\s"]+))?@i',$httpEquiv[0], $contentType );
					}
					if (isset($contentType))
					{
						if (!( isset ( $sContentType )))
						{
							$sContentType = $contentType[1];
						}
						if (!( isset ( $charSet )))
						{
							$charSet = $contentType[3];
						}
					}
			}
			if (( ! ( isset ( $sContentType ) ))||( ! ( isset ( $charSet ) )))
			{
				preg_match( '@<\?xml.+encoding\s*="([^\s"]+)@si', $content, $encoding );
				if (isset($encoding))
				{
					if (!( isset ( $sContentType )))
					{
						$sContentType = 'application/xml';
					}
					if (!( isset ( $charSet )))
					{
						$charSet = $matches[1];
					}
				}
			}*/
			return $content;
			//
			//set
			//
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->get_url_contents: ".  $e->getMessage()."url: ".$url."\n");
			 //return false;
		}
	}
	public function createFileFormDTD($DTD)
	{
		try{
			$this->createFileFormURL(WBit_PATH.DTDs_FOLDER.$DTD.".html");
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tFile->createFileFormDTD: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
	public function createDefaultXMLFile()
	{
		try
		{
			//$sourceCode = file_get_contents($this->sTemplateFileName);
			//$bytes = $this->file_put_contents($sourceCode);
		}catch(Exception $e)
		{
			  throw new Exception  ("\n\tFile->createDefaultXMLFile: ".  $e->getMessage()."\n");
		}
	}
	public function getFileJSON() //common getFileJSON
	{
		try{
			return (json_encode($this));
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFile->createDefaultXMLFile: ".  $e->getMessage()."\n");
		}
	}
	protected function setDefaultContentType()
	{
		try
		{
			$pattern = '/\w*$/';
			$matchesCount = preg_match($pattern,$this->sFilename, $matches);
			if (strtoupper($matches[0])=="XML")
			{
				$this->sContentType ="application/xml";
			}else if((strtoupper($matches[0])=="HTML")||(strtoupper($matches[0])=="HTM"))
			{
				$this->sContentType ="text/html";
			}else if(strtoupper($matches[0])=="XHTML")
			{
				$this->sContentType ="application/xhtml+xml";
			}
			$this->ParserMimeType = $this->sContentType; 
			$this->fileExtension = strtoupper($matches[0]);
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFile->setDefaultContentType: ".  $e->getMessage()."\n");
		}
	}
	/*
	protected function get_url_contents($url){
		try
		{
	        $ch = curl_init();
			$timeout = 5; // set to zero for no timeout
			curl_setopt ($ch, CURLOPT_URL, $url);
			curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
			$file_contents = curl_exec($ch);
			curl_close($ch);
			return $file_contents;
		}catch(Exception $e)
		{
			 throw new Exception  ('File->get_url_contents: '.  $e->getMessage().'\n');
		}
	}*/
	public function file_put_contents($data)
  	{
  		try
  		{
	       if (($h = fopen($this->sPath.$this->sFilename, 'w')) === false) 
	       {
	       	 throw new Exception  ("\n\tFile->file_put_contents: fopen fails for file".  $this->sPath.$this->sFilename."\n");
	       }
	       if (($bytes = fwrite($h, $data)) === false) {
	       		throw new Exception  ("\n\tFile->file_put_contents: fwrite fails for file".  $this->sPath.$this->sFilename."\n");
	       }
	       fclose($h);
	       return $bytes;
  		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFile->file_put_contents: ".  $e->getMessage()."\n");
		}
   	}
   	public function removeFile()
   	{
   		try
   		{
   			if (file_exists($this->sPath.$this->sFilename))	unlink($this->sPath.$this->sFilename);
	   	}catch(Exception $e)
		{
			throw new Exception  ("\n\tFile->removeFile: unlink fails for file ".  $this->sPath.$this->sFilename."\n");
		}
   	}
   	/*public function setContentTypeFromFileContent()//$ParserMimeType
   	{
   	try{
		  	if (($this->fileExtension=="HTML")||($this->fileExtension=="HTML"))
	   		{
	   			$this->sContentType = $this->getContentTypeDOCTYPE();
	   		}else if($this->fileExtension=="XML")
	   		{
	   			$this->sContentType ="application/xml";
	   		}else if($this->fileExtension=="XHTML")
	   		{
	   			$this->sContentType ="application/xhtml+xml";
	   		}else{
	   			$this->sContentType ="unknown";
	   		}
   		}catch(Exception $e)
		{
			 throw new Exception  ('File->setContentTypeFromFileContent: '.  $e->getMessage().'\n');
		}
   	}*/
   	public function setParserContentType()
   	{
   		//get the content type used by the aplication for parsering, independing of the mime type which is used to display
   		//the page in the navigator. The reason is that because of XHTML and HTML5 documents requires the aplication/xhtml+xml mime type for parsering, althought
   		//usually is used text/html mime type to indicate the to the web browser that the page must be processed as html.
   		try
   		{
			$completeFileName = $this->sPath.$this->sFilename;
			$fileExtension = $this->fileExtension;
			$newDOM = new DOMDocument();
		 	switch ($this->sContentType) 
		 	{
			    case "text/html"://parse as html to get the charset althout xhtml
			    	$loaded = @$newDOM->loadHTMLFile($completeFileName);
			        break;
			    case "application/xml"://parse as XML to get the charset
			    	$loaded = @$newDOM->load($completeFileName);
			        break;
			    case "application/xhtml+xml"://parse as XML
			    	$loaded = @$newDOM->load($completeFileName);
			        break;
			    case "text/xml"://parse as XML
			    	$loaded = @$newDOM->load($completeFileName);
			        break;
			    case "text/xhtml"://parse as XML
			    	$loaded = @$newDOM->load($completeFileName);
			        break;
			    default:
			    	$pattern = '/xml$/';
					$matchesCount = preg_match($pattern,$this->sContentType, $matches);
					if (strtoupper($matches[0])=="XML")
					{
						$loaded = @$newDOM->load($completeFileName);
						$this->ParserMimeType =  "application/xhtml+xml";
					}else
					{
						 throw new Exception  ("\n\tFile->getParserContentType: content Type not supporte by the application. Content Type: ".$this->sContentType."\n");
					}
			    	break;
			}
	   		$docType = $newDOM->doctype;
	   		$publicId = $docType->publicId;
	   		$systemId = $docType->systemId;
	   		
	   		//publicIDs of XHTML
	   		$pIdFrameSet = "-//W3C//DTD XHTML 1.0 Frameset//EN";
	   		$pIdStrict = "-//W3C//DTD XHTML 1.0 Strict//EN";
	   		$pIdTransitional = "-//W3C//DTD XHTML 1.0 Transitional//EN";
	   		//systemId of XHTML
	   		//$sIdFrameSet = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd";
	   		//$sIdStrict = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd";
	   		//$sIdTransitional = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd";
	   		//check if xhtml. I just look for the publid Id and don't validate if the definition is right or not. It means, if there is system is empty or there is not xsml in the documentElement of the docuemnte,
	   		//the documente will also be parser according to xhtml especifications. 
	   		if ($publicId==$pIdFrameSet)
	   		{
	   			//xhtml frame set
	   			$this->ParserMimeType =  "application/xhtml+xml"; 
	   		}elseif($publicId==$pIdStrict)
	   		{
	   			//xhtml strict
	   				$this->ParserMimeType =  "application/xhtml+xml";
	   		}elseif($publicId==$pIdTransitional)
	   		{
	   			//xhtml Transitional
	   			$this->ParserMimeType =  "application/xhtml+xml";
	   		}else{
	   			//throw new Exception("setParserContentType: PublicId: ".$publicId.", SystemId: ".$systemId.", Name: ".$docType->name);
	   			$this->ParserMimeType =  $this->sContentType;	
	   		}
	   		//if charSet is empty means it was not found in BOM, which is also collected by cURL.
	   		if (($this->charSet=="")||($newDOM->encoding))
	   		{
	   			if ($newDOM->encoding!="")
	   			{
	   				$this->charSet = $newDOM->encoding;
	   			}else
	   			{
	   				$this->charSet = "UTF-8";
	   			}
	   		}
	   		unset($newDOM);
   		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFile->getParserContentType: ".  $e->getMessage()."\n");
		}	
   	}
}
abstract class FilesGroup//abstract class
{
	abstract public function getDOMNode();//Polimorphic
	
	public $aFiles = array();//common
	public function getJSONString() //common
	{
		try{
			$URLFiles= array();
			$sFile = "";
			$sFiles = "Files:{";
			$URLFiles = 'URLFiles:[';
			$coma="";
			foreach($this->aFiles as $selfIndex=> $selfValue)
			{
				$httpPath = $selfValue->sHttpPath;
				$httpFileName = $selfValue->sFilename;
				$currentFile = $httpPath.$httpFileName;
				$sFile .= $coma.'"'.$currentFile.'"'; 
				$coma = ",";
			}
			$URLFiles .= $sFile.']';
			$sFiles .= $URLFiles;
			$sFiles .= "}";
			return '{'.$sFiles.'}';
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFilesGroup->getJSONString: ".  $e->getMessage()."\n");
		}	
	}
	public function getFilesJSON() //common
	{
		try{
			if (count($this->aFiles)>0)
			{
				return (json_encode($this->aFiles));
			}else{
				return ("{}");
			}
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFilesGroup->getJSONString: ".  $e->getMessage()."\n");
		}	
	}
	/*public function getFSFileByURL($URLFileIn)//common
	{
		try{
			foreach($this->aFiles as  $selfIndex=> $selfValue)
			{
				$selfURL = $selfValue->sHttpPath;
				$selfFile = $selfValue->sFilename;
				echo $selfURL." ,".$selfFile; 
				$selfURL .=$selfFile;
				if ($selfURL==$URLFileIn)
				{
					return $selfValue->sPath.$selfValue->sFilename;
				}
			}
			return null;
		}catch(Exception $e)
		{
			 throw new Exception  ('FilesGroup->getFSFileByURL: '.  $e->getMessage().'\n');
		}	
	}*/
	public function getArrayFileNames()//Common: may be delete
	{
		try{
			$aFileNames = array();
			foreach($this->aFiles as  $selfIndex=> $selfValue)
			{
				$aFileNames[]=$selfValue->sFileName;
			}
			return $aFileNames;
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFilesGroup->getArrayFileNames: ".  $e->getMessage()."\n");
		}
	}
	public function addExplicit($ObjectIn,$sObjectIndex)
    {
    	try
    	{
    		$this->aFiles[$sObjectIndex] = $ObjectIn;
    	}catch(Exception $e)
		{
			throw new Exception  ("\n\tFilesGroup->addExplicit: ".  $e->getMessage()."\n");
		} 
    }
 	public function remove($sObjectIndex)
    {
	    try{
	    	$this->aFiles[$sObjectIndex]->removeFile();
	    	unset($this->aFiles[$sObjectIndex]);
	   	}catch(Exception $e)
		{
			 throw new Exception  ("\n\tFilesGroup->remove: ".  $e->getMessage()."\n, Object Index: ".$sObjectIndex."\n");
		}   
    }
}
class Templates extends FilesGroup
{
	public $templatesFolder = NULL;
	function __construct($sProjektFolder)
	{
		try{
			$this->templatesFolder=PROJEKTS_FOLDER.$sProjektFolder."/"."Templates";
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tTemplates->__construct: ".  $e->getMessage()."\n");
		}
	}
    public function getDOMNode()
    {
    	try{
	        $aFiles = $this->aFiles;
	        $newDOM = new DOMDocument();
	        $Templates =$newDOM->createElement("Templates");
	        foreach($aFiles as $Index=>$Value)
	        {
	        	$FileName = $newDOM->createElement("FileName");
	        	$FileName->nodeValue = $Value->sFilename;
	        	$FileName->setAttribute("BaseURL", $Value->BaseURL);
	        	//
	        	$FileName->setAttribute("Path",$Value->sPath);
	        	$FileName->setAttribute("URL",$Value->sHttpPath.$Value->sFilename);
				$FileName->setAttribute("FileExtension",$Value->fileExtension);
				$FileName->setAttribute("Folder",$Value->sFolder);
	        	$FileName->setAttribute("ContentType",$Value->sContentType);
	        	$FileName->setAttribute("ParserMime",$Value->ParserMimeType);
				$FileName->setAttribute("charSet",$Value->charSet);
	        	//
	        	$AppendedFile = $Templates->appendChild($FileName);	
	        }
	        return($Templates);    
    	}catch(Exception $e)
		{
			 throw new Exception  ("\n\tTemplates->getDOMNode: ".  $e->getMessage()."\n");
		}    
    }
    public function addTemplate($sFileNameIn,$sBaseURL,$UserId,$Password)//&& UserId, and Password
    {
    	try
    	{
    		if (!(isset($UserId))) $UserId = NULL;
    		if (!(isset($Password))) $Password = NULL;
	    	if (!(isset($this->aFiles[$sFileNameIn])))
	    	{
	    		$currentTemplate = new Template($sFileNameIn,$sBaseURL,$this->templatesFolder);//&& UserId, and Password
	    		$currentTemplate->createFileFormURL($sBaseURL,$UserId,$Password);
	    		$this->aFiles[$sFileNameIn] = $currentTemplate;
	    		//return true;
	    	}else{
	    		throw new Exception  ("\n\tTemplates->addTemplate: Template could not be added because the file !".$this->aFiles[$sFileNameIn]->sHttpPath.$this->aFiles[$sFileNameIn]->sFilename." exists!\n");
	    	}
	    	//return false;
    	}catch(Exception $e)
		{
			if (isset($this->aFiles[$sFileNameIn]))
			{
				//$this->remove($sFileNameIn);
			}
			throw new Exception  ("\n\tTemplates->addTemplate: ".  $e->getMessage()."\n");
		} 
    }
    public function modifyTemplate($NewFileName,$OldFileName,$URLToImport,$UserName,$Password)//&& UserId, and Password
    {
    	try
    	{
    		//if is modificating this instance and for this fileName
    		if ((isset($this->aFiles[$NewFileName]))&&($NewFileName==$OldFileName))
    		{
    			//if the file exists, just import the url and set the BaseURL
    			$this->aFiles[$NewFileName]->createFileFormURL($URLToImport,$UserName,$Password);
    			$this->aFiles[$NewFileName]->BaseURL = $URLToImport;
    		}else
    		{
    			//if not , create a new Template Object. The object will created if the file does not exists. To control relational integrity.
    			$this->addTemplate($NewFileName,$URLToImport,$UserName,$Password);
    			//if an error wont continue.
    			//delete the old instance.
    			$this->removeTemplate($OldFileName);	
    		}
       	}catch(Exception $e)
		{
			throw new Exception  ("\n\tTemplates->addTemplate: ".  $e->getMessage()."\n");
		} 
    }
	public function setTemplatesFolder($folder)
    {
    	try
    	{
    		$this->templatesFolder = $folder;	
    	}catch(Exception $e)
		{
			 throw new Exception  ("\n\tTemplates->setTemplatesFolder: ".  $e->getMessage()."\n");
		} 
    }
  	public function removeTemplate($fileNameIndex)
    {
    	try{
			$this->remove($fileNameIndex);
    	}catch(Exception $e)
		{
			 throw new Exception  ("\n\tTemplates->removeTemplate: ".  $e->getMessage()."\n");
		} 
    }
}
class Pages extends FilesGroup
{
	public function existTemplate($URLTemplate)
	{
		try{
			foreach($this->aFiles as $Page=>$Value)
			{
				//$URLTemplate = $Value->sHttpPath.$Value->sFilename;
				if (($Value->sTemplateFileName==$URLTemplate)&&($Value->sTemplateFileName!=""))
				{
					return true;
				}
			}
			return false;
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tPages->existTemplate: ".  $e->getMessage()."\n");
		} 
	}
	public function setRelTemplateName($newTemplateURL,$oldTemplateURL)
	{
		try
		{
			foreach($this->aFiles as $Page=>$Value)
			{
				if ($Value->sTemplateFileName==$oldTemplateURL)
				{
					$Value->sTemplateFileName = $newTemplateURL;
				}
			}
		}catch(Exception $e)
		{
			 throw new Exception  ("\n\tPages->setRelTemplateName: ".  $e->getMessage()."\n");
		} 
	}
	public function getDOMNode()
    {
	    	try
	    	{
		        $aFiles = $this->aFiles;
		        $newDOM = new DOMDocument();
		        $Pages =$newDOM->createElement("Pages");
		        foreach($aFiles as $Index=>$Value)
		        {
		        	$Page =$newDOM->createElement("Page");
		        	$FileName = $newDOM->createElement("FileName");
		        	$FileName->nodeValue = $Value->sFilename;
		        	//
			        	$FileName->setAttribute("Path",$Value->sPath);
			        	$FileName->setAttribute("URL",$Value->sHttpPath.$Value->sFilename);
						$FileName->setAttribute("FileExtension",$Value->fileExtension);
						$FileName->setAttribute("Folder",$Value->sFolder);
			        	$FileName->setAttribute("ContentType",$Value->sContentType);
			        	$FileName->setAttribute("ParserMime",$Value->ParserMimeType);
						$FileName->setAttribute("charSet",$Value->charSet);
		        	//	        	
		        	$TemplateFileName = NULL;
		        	$Data = NULL;
		        	$attFolder = NULL;
		        	if (!(is_null($Value->sTemplateFileName)))
		        	{
			        	$TemplateFileName = $newDOM->createElement("TemplateFileName");
			        	$TemplateFileName->nodeValue = $Value->sTemplateFileName;
		        	}
		        	if (!(is_null($Value->oDataFiles)))
		        	{
		        		$Data = $Value->oDataFiles->getDOMNode();
		        		$Data = $newDOM->importNode($Data, true);
		        	}
		        	$appendedPage = $Page->appendChild($FileName);
		        	if (!(is_null($TemplateFileName)))
		        	{
		        		$appendedPage = $Page->appendChild($TemplateFileName);
		        	}
		        	if (!(is_null($Data)))
		        	{
		        		$appendedPage = $Page->appendChild($Data);
		        	}
		        	if (!(is_null($Value->sFolder)))
		        	{
		        		$attFolder=$Page->setAttribute("Folder", $Value->sFolder);
		        	}
		        	$appendedPage = $Pages->appendChild($Page);
		        }
		        return($Pages);     
        }catch(Exception $e)
		{
			 throw new Exception  ('Templates->getDOMNode: '.  $e->getMessage().'\n');
		}    
    }
    public function addPage($sFileNameIn,$sPageFolder,$URLTemplate,$UserId,$Password)
    {
	    try
	    {
	    	if (!(isset($this->aFiles[$sPageFolder.$sFileNameIn])))
	    	{
	    		$currentPage=new Page($sFileNameIn,$sPageFolder);
	    		$currentPage->setRelatedTemplate($URLTemplate,$UserId,$Password);
	    		$this->aFiles[$sPageFolder.$sFileNameIn]= $currentPage;
	    		//$this->relateTemplate($sPathTemplateFileNameIn);
	    	}else{
	    		throw new Exception  ('Templates->addPage: Page '.$sPageFolder.$sFileNameIn.' could not be added because already exists!\n');
	    	}
	   	}catch(Exception $e)
		{
			if (isset($this->aFiles[$sPageFolder.$sFileNameIn]))
			{
			//	$this->remove($sPageFolder.$sFileNameIn);
			//	$this->removePage($sPageFolder.$sFileNameIn);
			}
			throw new Exception  ('Templates->addPage: '.  $e->getMessage().'\n');
		}    
    }
 	public function modifyPage($sFileNameIn,$oldFileNameIn,$sPageFolder,$URLTemplate,$UserId,$Password)
    {
	    try
	    {
	    //if is modificating this instance and for this fileName
    		if ((isset($this->aFiles[$sPageFolder.$sFileNameIn]))&&($sPageFolder.$sFileNameIn==$oldFileNameIn))
    		{
    			$this->aFiles[$sPageFolder.$sFileNameIn]->setRelatedTemplate($URLTemplate,$UserId,$Password);
    		}else
    		{
    			$this->addPage($sFileNameIn,$sPageFolder,$URLTemplate,$UserId,$Password);
   				$this->removePage($oldFileNameIn);
    		}
	   	}catch(Exception $e)
		{
			throw new Exception  ('Templates->addPage: '.  $e->getMessage().'\n');
		}    
    }
  	public function removePage($fileNameIndex)
    {
    	try
    	{
			$this->remove($fileNameIndex);
    	}catch(Exception $e)
		{
			 throw new Exception  ('Templates->removeTemplate: '.  $e->getMessage().'\n');
		} 
    }
    public function existXMLData($CompleteFileName)
    {
	    try{
	    	foreach($this->aFiles as $Page=>$Value)//for each page
			{
				foreach($Value->oDataFiles->aFiles as $DFile=>$DFValue)
				{
					//echo("<p>".$DFValue->sPath.$DFValue->sFilename."==".$CompleteFileName."</p>");
					if ($DFValue->sFolder.$DFValue->sFilename==$CompleteFileName)
					{
						return true;
					}
				}
			}
			return false;
		}catch(Exception $e)
		{
			 throw new Exception  ('Templates->existXMLData: '.  $e->getMessage().'\n');
		}   
    }
}
class Data extends FilesGroup
{
    public function getDOMNode() 
    {
    	try{
	    	$aFiles = $this->aFiles;
	        $newDOM = new DOMDocument();
	        $Data =$newDOM->createElement("Data");
	    	foreach($aFiles as $Index=>$Value)
	        {
	        	$DataFileName = $newDOM->createElement("FileName");
	        	$DataFileName->nodeValue = $Value->sFilename;
	        	$DataFileName->setAttribute("Id",$Value->Id);
	        	$DataFileName->setAttribute("Lang",$Value->sLang);
	        	$sDefaultOne = ($Value->bDefaultOne)?"true":"false";
	        	$DataFileName->setAttribute("Default",$sDefaultOne);
	        	//
			    $DataFileName->setAttribute("Path",$Value->sPath);
			    $DataFileName->setAttribute("URL",$Value->sHttpPath.$Value->sFilename);
				$DataFileName->setAttribute("FileExtension",$Value->fileExtension);
				$DataFileName->setAttribute("Folder",$Value->sFolder);
			    $DataFileName->setAttribute("ContentType",$Value->sContentType);
			    $DataFileName->setAttribute("ParserMime",$Value->ParserMimeType);
				$DataFileName->setAttribute("charSet",$Value->charSet);
		        //
	        	$appendedData = $Data->appendChild($DataFileName);
	        }
	        return $Data;
        }catch(Exception $e)
		{
			 throw new Exception  ('Data->getDOMNode: '.  $e->getMessage().'\n');
		}   
    }
    public function addDataFile($sId,$sFileName,$sLang,$sDefaultOne,$sFolder)
    {
    	try
    	{
    		if (!(isset($this->aFiles[$sFolder.$sFileName])))
	    	{
    			$this->aFiles[$sFolder.$sFileName] = new DataFile($sId,$sLang,$sFileName,$sDefaultOne,$sFolder);
	    	}else{
	    		throw new Exception  ('Data->addDataFile: Data File '.$sFolder.$sFileName.' already related with the page!\n');
	    	}
    	}catch(Exception $e)
		{
			 //Don't delete the file, because this object is used only to related XMLFiles with pages. The only relevant properties of the object are the FileName related properties
			 //Whose must be used to get the correct file from the object XMLFiles related with the project.
			 //if (isset($this->aFiles[$sFolder.$sFileName])) $this->removeDataRelation($sFolder.$sFileName);
			 throw new Exception  ('Data->addDataFile: '.  $e->getMessage().'\n');
		}  
    }
	public function modifyDataFile($sId,$sFileName,$oldFileIndex,$sLang,$sDefaultOne,$sFolder)
    {
    	try
    	{
    		if ((isset($this->aFiles[$sFolder.$sFileName]))&&($sFolder.$sFileName==$oldFileIndex))
    		{
    			$this->aFiles[$sFolder.$sFileName]->Id = $sId;
    			$this->aFiles[$sFolder.$sFileName]->sLang = $sLang;
    			$this->aFiles[$sFolder.$sFileName]->bDefaultOne = $sDefaultOne;
    		}else
    		{
    			$this->addDataFile($sId,$sFileName,$sLang,$sDefaultOne,$sFolder);
    			$this->removeDataRelation($oldFileIndex);	
    		}
    	}catch(Exception $e)
		{
			 //Don't delete the file, because this object is used only to related XMLFiles with pages. The only relevant properties of the object are the FileName related properties
			 //Whose must be used to get the correct file from the object XMLFiles related with the project.
			 //if (isset($this->aFiles[$oldFileIndex])) unset($this->aFiles[$sFolder.$sFileName]);
			 throw new Exception  ('Data->addDataFile: '.  $e->getMessage().'\n');
		}  
    }
    public function removeDataRelation($FileNameId)
    {
    	try{
    		unset($this->aFiles[$FileNameId]);
    	}catch(Exception $e)
		{
			 throw new Exception  ('Data->removeDataRelation: '.  $e->getMessage().'\n');
		}  
    }
}
class XMLFiles extends FilesGroup
{
	//public $XMLFilesFolder = NULL;
	/*function __construct($sProjektFolder)
	{
		try{
			$this->XMLFilesFolder="wbcms/projekts/".$sProjektFolder."/"."XMLFiles";
		}catch(Exception $e)
		{
			 throw new Exception  ('XMLFiles->__construct: '.  $e->getMessage().'\n');
		}  
	}*/
    public function getDOMNode()
    {
	    try{
	        $aFiles = $this->aFiles;
	        $newDOM = new DOMDocument();
	        $XMLFiles =$newDOM->createElement("XMLFiles");
	        foreach($aFiles as $Index=>$Value)
	        {
	        	$FileName = $newDOM->createElement("FileName");
	        	$FileName->nodeValue = $Value->sFilename;
	        	//
	        	$FileName->setAttribute("BaseURL", $Value->BaseURL);
	        	//
	        	//
			      	$FileName->setAttribute("Path",$Value->sPath);
			       	$FileName->setAttribute("URL",$Value->sHttpPath.$Value->sFilename);
					$FileName->setAttribute("FileExtension",$Value->fileExtension);
					$FileName->setAttribute("Folder",$Value->sFolder);
			       	$FileName->setAttribute("ContentType",$Value->sContentType);
			       	$FileName->setAttribute("ParserMime",$Value->ParserMimeType);
					$FileName->setAttribute("charSet",$Value->charSet);
		        //	        	
		        //////////////
	        	//
	        	//
		       	$AppendedFile = $XMLFiles->appendChild($FileName);	
	        }
	        return($XMLFiles);     
        }catch(Exception $e)
		{
			 throw new Exception  ('XMLFiles->getDOMNode: '.  $e->getMessage().'\n');
		}     
    }
    
    public function addXMLFile($sFileNameIn,$XMLFolder,$sBaseURL,$UserId,$Password)
    {
	    try{
	    	if (!(isset($UserId))) $UserId = NULL;
    		if (!(isset($Password))) $Password = NULL;
	    	//if (!(isset($this->aFiles[$sFileNameIn])))
	    	if (!(isset($this->aFiles[$XMLFolder.$sFileNameIn])))
	    	{
		    	$pattern = '/(\.\w*$)/'; // Extracts the file name from a path
				preg_match_all($pattern,$sFileNameIn, $matches, PREG_SET_ORDER);
				$ArrLength = count($matches);
				if ($ArrLength==0)
				{
					//echo ('{Error:"Wrong Extension"}');
					throw new Exception  ('Wrong File Extension. File'.$sFileNameIn.'\n');
					//return false;	
				}
				$CurrentFileExtension = $matches[0][1];
				if ((strtoupper($CurrentFileExtension)!=".XML")&&
						(strtoupper($CurrentFileExtension)!=".XSL"))
				{
						throw new Exception  ('file is not an XML. Extension: '.$CurrentFileExtension.'\n');
					//echo ('{Error:"file is not an XML"}');
					//return false;
				}
				$currentXMLFile = new XMLFile($sFileNameIn,$sBaseURL,$XMLFolder);
	    		$bCreateFromXML =false;
				if (isset($sBaseURL))
				{
					if (($sBaseURL=="")||($sBaseURL==NULL))
					{
							$bCreateFromXML = true;
					}
				}else
				{
							$bCreateFromXML = true;
				}
				if 	($bCreateFromXML)
				{
					$currentXMLFile->createFileFormURL(WBit_URL.DTDs_FOLDER."utf8.xml",$UserId,$Password);
				}else
				{
					$currentXMLFile->createFileFormURL($sBaseURL,$UserId,$Password);
				}
				$this->aFiles[$XMLFolder.$sFileNameIn]=$currentXMLFile;
		    		//return true;
		    }else{
	    		throw new Exception  ('XMLFiles->addXMLFile: XMLFile '.$XMLFolder.$sFileNameIn.' could not be added because already exists!\n');
	    	}
    	}catch(Exception $e)
		{
			if (isset($this->aFiles[$XMLFolder.$sFileNameIn]))
			{
				//$this->remove($XMLFolder.$sFileNameIn);
			}
			throw new Exception  ('XMLFiles->addXMLFile: '.  $e->getMessage().'\n');
		}  
    }
    public function modifyXMLFile($sFileNameIn,$oldFileName,$XMLFolder,$sBaseURL,$UserId,$Password)
    {
    	try
    	{
    		if ((isset($this->aFiles[$XMLFolder.$sFileNameIn]))&&($XMLFolder.$sFileNameIn==$oldFileName))
    		{
    			$bCreateFromXML =false;
				if (isset($sBaseURL))
				{
					if (($sBaseURL=="")||($sBaseURL==NULL))
					{
							$bCreateFromXML = true;
					}
				}else{
							$bCreateFromXML = true;
				}
				if 	($bCreateFromXML)
				{
					
					$this->aFiles[$XMLFolder.$sFileNameIn]->createFileFormURL(WBit_PATH.DTDs_FOLDER."utf8.xml",$UserId,$Password);
				}else
				{
					$this->aFiles[$XMLFolder.$sFileNameIn]->createFileFormURL($sBaseURL,$UserId,$Password);
				}
    		}else
    		{
    			$this->addXMLFile($sFileNameIn,$XMLFolder,$sBaseURL,$UserId,$Password);
    			$this->remove($oldFileName);
    		}
    	}catch(Exception $e)
		{
			if (isset($this->aFiles[$XMLFolder.$sFileNameIn]))
			{
				//$this->remove($XMLFolder.$sFileNameIn);
			}
			throw new Exception  ('XMLFiles->addXMLFile: '.  $e->getMessage().'\n');
		}  
    }
	/*public function removeXMLFile($sFileNameIn)
    {
    	try
    	{
	    	if (isset($this->aFiles[$sFileNameIn]))
	    	{
	    		unset($this->aFiles[$sFileNameIn]);
	    		return true;
	    	}
	    	return false;
    	}catch(Exception $e)
		{
			 throw new Exception  ('XMLFiles->removeXMLFile: '.  $e->getMessage().'\n');
		} 
    }*/
    public function setXMLFilesFolder($folder){
    	try{
    		$this->XMLFilesFolder = $folder;
    	}catch(Exception $e)
		{
			 throw new Exception  ('XMLFiles->setXMLFilesFolder: '.  $e->getMessage().'\n');
		} 
    }
	public function removeDataFile($fileNameIndex)
    {
    	try
    	{
    		$this->remove($fileNameIndex);
	    	/*if ($this->aFiles[$fileNameIndex]->removeFile())
	    	{
	    		unset($this->aFiles[$fileNameIndex]);
	    		return true;
	    	}	
	    	return false;*/
    	}catch(Exception $e)
		{
			 throw new Exception  ('XMLFiles->removeDataFile: '.  $e->getMessage().'\n');
		} 
    }
}
class Template extends File
{
	public $BaseURL = NULL;
	function __construct($sFileNameIn,$BaseURLIn,$templatesFolder)//$sFileNameIn,$sBaseURL,$this->templatesFolder,$UserId,$Password
	{
		try
		{
			//if (create the file)//in case of error throw new: if header status != 200 retuns return the error.
			$this->BaseURL = $BaseURLIn;
			parent::__construct($sFileNameIn,$templatesFolder);//creates the object with an empty file
		}catch(Exception $e)
		{
			throw new Exception  ('Template->__construct:Template could not be created! '.  $e->getMessage().'\n');
		}
	}
}
class page extends File
{
	public $pageFolder = NULL;
	public $sTemplateFileName = NULL;
	public $oDataFiles = NULL;
//	function __construct($oDataFile,$sFileNameIn)
	function __construct($sFileNameIn,$pageFolder)
	{
		try
		{
			parent::__construct($sFileNameIn,$pageFolder);
			$this->pageFolder = $pageFolder;
			$this->oDataFiles = new Data;
		}catch(Exception $e)
		{
		 	throw new Exception  ('page->__construct: '.  $e->getMessage().'\n');
		}
	}
 	public function setRelatedTemplate($URLTemplate,$UserId,$Password)
    {
    	try{
	   		$this->createFileContentFromTemlate($UserId,$Password,$URLTemplate);
	 	}catch(Exception $e)
		{
			 throw new Exception  ('Templates->relateTemplate: '.  $e->getMessage().'\n');
		}   
    }
	protected function createFileContentFromTemlate($UserId,$Password,$URLTemplate)
	{
		try
		{
			$this->createFileFormURL($URLTemplate,$UserId, $Password);
			$this->sTemplateFileName =$URLTemplate;
		}catch(Exception $e)
		{
		 throw new Exception  ('page->createFileContentFromTemlate: '.  $e->getMessage().'\n');
		}
	}
	public function getDataFiles()
	{
		try
		{
			$aFileNames = array();
			foreach($this->oDataFiles->aFiles as  $selfIndex=> $selfValue)
			{
				$aFileNames[]=$selfValue->sFileName;
			}
			return $aFileNames;
		}catch(Exception $e)
		{
		 throw new Exception  ('page->getDataFiles: '.  $e->getMessage().'\n');
		}
	}
	public function addDataFile($sId,$sFileName,$sLang,$sDefaultOne,$sFolder)
	{
		try
		{
			//$this->$oDataFiles->aFiles[$oDataFile->sFileName]= $oDataFile;
			$this->oDataFiles->addDataFile($sId,$sFileName,$sLang,$sDefaultOne,$sFolder);
		}catch(Exception $e)
		{
		 throw new Exception  ('page->addDataFile: '.  $e->getMessage().'\n');
		}
	}
	public function getArrDataFileNames()
	{
		try
		{
			$this->oDataFiles->getArrayFileNames();	
		}catch(Exception $e)
		{
		 throw new Exception  ('page->getArrDataFileNames: '.  $e->getMessage().'\n');
		}
	}
	public function getJSONData(){
		try{
			$this->oDataFiles->getJSONString();	
		}catch(Exception $e)
		{
		 throw new Exception  ('page->getJSONData: '.  $e->getMessage().'\n');
		}
	}
	public function setPageFolder($folder)
	{
		try
		{
			$this->pageFolder = $folder;
		}catch(Exception $e)
		{
		 throw new Exception  ('page->setPageFolder: '.  $e->getMessage().'\n');
		}
	}
}
class dataFile extends File
{
	public $Id = NULL;
	public $sLang = NULL;
	public $bDefaultOne = false;
	function __construct($sId,$sLang,$sFileNameIn,$sDefaultOne,$fileFolder)
	{
		try
		{
			parent::__construct($sFileNameIn,$fileFolder);
			$this->Id = $sId;
			$this->sLang = $sLang;
			$this->bDefaultOne = (strtoupper($sDefaultOne)=="TRUE")?true:false;
		}catch(Exception $e)
		{
		 	throw new Exception  ('dataFile->__construct: '.  $e->getMessage().'\n');
		}
	}
}
class XMLFile extends File
{
	public $XMLFileFolder = NULL;
	public $BaseURL = NULL; 
	function __construct($sFileNameIn,$BaseURLIn,$XMLFileFolder)//($sFileNameIn,$sBaseURL,$XMLFolder,$UserId,$Password);
	{
		try
		{
			$this->BaseURL = $BaseURLIn;
			$this->XMLFileFolder = $XMLFileFolder;
			parent::__construct($sFileNameIn,$XMLFileFolder);//creates the object with an empty file
		}catch(Exception $e)
		{
		 throw new Exception  ('XMLFile->__construct: '.  $e->getMessage().'\n');
		}
	}
}
class projeckt
{
	public $sXMLFileName = NULL;
	public $sProjektFolder = NULL;
	public $sName=NULL;
	public $oTemplates = NULL;
	public $oPages = NULL; 
	public $oXMLFiles = NULL;
	public function getProjektXMLFile()
	{
		try
		{
			return $this->sXMLFileName;
		}catch(Exception $e)
		{
		 throw new Exception  ('projeckt->getProjektXMLFile: '.  $e->getMessage().'\n');
		}
	}
	public function getProjektName()
	{
		try
		{
			return $this->sName;
		}catch(Exception $e)
		{
		 throw new Exception  ('projeckt->getProjektName: '.  $e->getMessage().'\n');
		}
	}
	function setProjectFolder($ProjecktFolder)
	{
		try
		{
			if (mkdir(PROJEKTS_PATH.$ProjecktFolder))
			{
				$this->sProjektFolder=$ProjecktFolder;
				if (!(mkdir(PROJEKTS_PATH.$ProjecktFolder."/"."Templates")))
				{
					throw new Exception  ('mkdir fails. Templates Folder Could not be created. Folder: '.PROJEKTS_PATH.$ProjecktFolder.'/Templates\n');
					//return false;
				}
				/*if (!(mkdir(PROJEKTS_PATH.$ProjecktFolder."/"."XMLFiles")))
				{
						throw new Exception  ('mkdir fails. XMLFiles Folder Could not be created. Folder: '.PROJEKTS_PATH.$ProjecktFolder.'/XMLFiles\n');
					//return false;
				}*/
			}else
			{
				throw new Exception  ('mkdir fails. ProjectFolder Folder Could not be created. Folder: '.PROJEKTS_PATH.$ProjecktFolder.'\n');
			}
		}catch(Exception $e)
		{
		 throw new Exception  ('projeckt->setProjectFolder: '.  $e->getMessage().'\n');
		}
	}
	function createNewProject($sProjeckName)
	{
		try
		{
			$this->sName = $sProjeckName;
			$this->sXMLFileName = $sProjeckName.".xml";
			$this->oTemplates = new Templates($this->sProjektFolder);
			$this->oPages = new Pages;
			$this->oXMLFiles = new XMLFiles;
			$this->saveProjectIntoXML();
			return true;
		}catch(Exception $e)
		{
		 throw new Exception  ('projeckt->createNewProject: '.  $e->getMessage().'\n');
		}
	}
	function loadProject($sProjecktFileName)
	{
		try
		{
			if ($sProjecktFileName)
			{
				if ($this->loadFromXML(PROJEKTS_PATH.$sProjecktFileName))//from select project form
				{
					$this->sXMLFileName=$sProjecktFileName;
					return true;
				}else{
					return false;
				}
			}
		}catch(Exception $e)
		{
		 	throw new Exception  ('projeckt->loadProject fails: '.  $e->getMessage().'\n');
		}
	}
	public function saveProjectIntoXML()
	{
		try
		{
			$newDOM = new DOMDocument('1.0', 'iso-8859-1');
			$xslt = $newDOM->createProcessingInstruction('xml-stylesheet', 'type="text/xsl" href="xmltree.xsl"');
			$newDOM->appendChild($xslt);
			$root = $newDOM->createElement("Projeckt");
			$root->setAttribute("Name",$this->sName);
			$root->setAttribute("Folder",$this->sProjektFolder);
			$templates = $this->oTemplates->getDOMNode();
			$templates = $newDOM->importNode($templates, true);
			$Pages = $this->oPages->getDOMNode();
			$Pages = $newDOM->importNode($Pages,true);
			$XMLFiles = $this->oXMLFiles->getDOMNode();
			$XMLFiles = $newDOM->importNode($XMLFiles,true);
			$appendedChild = $root->appendChild($templates);
			$appendedChild = $root->appendChild($Pages);
			$appendedChild = $root->appendChild($XMLFiles);
			$appendedChild = $newDOM->appendChild($root);
			if ($newDOM->save(PROJEKTS_PATH.$this->sXMLFileName))
			{
				unset($newDOM);
//				return true;
			}else{
				unset($newDOM);
				$error = 'DOMDocument->save() fails! file:'.PROJEKTS_PATH.$this->sXMLFileName.'\n';
    			throw new Exception($error);
			}
		}catch(Exception $e)
		{
			throw new Exception('projeckt->saveProjectIntoXML: '.  $e->getMessage(). '\n');
			//return false;
			
		}
	}
	public function loadFromXML($xmlFileNameIn)
	{
		try
		{
			$currentDOM = new DOMDocument();
			if ($currentDOM->load($xmlFileNameIn)!=1)
			{
				unset($currentDOM);
				throw new Exception("DOMDocument->load(".$xmlFileNameIn.") fails!");
				//return false;	
			}
			$documentElement = $currentDOM->documentElement;
			if ($documentElement->nodeName!= "Projeckt")
			{
				unset($currentDOM);
				throw new Exception('DOMDocument->documentElement->nodeName ist not a <Projekt> element!');
				//return false;
			}
			$sCurrentName = $documentElement->getAttribute("Name");
			if ($sCurrentName=="")
			{
				unset($currentDOM);
				throw new Exception('Root element <projekt> has not related attribute [name]. This project hast not a name.  Name Obligatory!\n');
				//echo("the root element <projekt> has not related name. this project hast not a name.  Name Oblygatory");
				//error: the root element <projekt> has not related name. this project hast not a name.  Name Oblygatory
				//return false;
			}
			$sCurrentFolder = $documentElement->getAttribute("Folder");
			if ($sCurrentFolder=="")
			{
				unset($currentDOM);
				//echo("LoadFromXML:4");
				//error: the root element <projekt> has not related name. this project hast not a name.  Name Oblygatory
				throw new Exception('Root element <projekt> has not related attribute [Folder]. This project hast not a Folder.  Folder Obligatory!\n');
				//return false;
			}
			$this->sProjektFolder = $sCurrentFolder;
			$currentChildNodes = $documentElement->childNodes;
			if ($currentChildNodes->length!=3)
			{
				//echo("LoadFromXML:5");
				//project element requires the elements <Templates> and <Pages> and <XMLFiles> respectibelly. Althougth empty
				unset($currentDOM);
				throw new Exception('<Projeckt> element requires the element <Templates>,<Pages> and <XMLFiles> respectibelly. Althougth empty\n');
				//return false;
			}
			$templatesNode = $currentChildNodes->item(0);
			$pagesNode = $currentChildNodes->item(1);
			$XMLFilesNode = $currentChildNodes->item(2);
			if ($templatesNode->nodeName != "Templates")
			{
				//echo("LoadFromXML:6");
				//<templates> element must exist, althought without elements
				unset($currentDOM);
				throw new Exception('<templates> element must exist, althought without childNodes\n');
				//return false;
			}
			$this->oTemplates = new Templates($this->sProjektFolder);
			if ($pagesNode->nodeName != "Pages")
			{
				///echo("LoadFromXML:7");
				//<pages> element must exist, althought without elements
				unset($currentDOM);
				throw new Exception('<pages> element must exist, althought without elements\n');
				//return false;
			}
			$this->oPages = new Pages;
			if ($XMLFilesNode->nodeName != "XMLFiles")
			{
				//echo("LoadFromXML:8");
				//<templates> element must exist, althought without elements
				unset($currentDOM);
				throw new Exception('<XMLFiles> element must exist, althought without elements\n');
				//return false;
			}
			$this->oXMLFiles = new XMLFiles($this->sProjektFolder);
			$this->sName = $sCurrentName;
			if ($this->SetoTemplates($templatesNode)==false)
			{
				//echo("LoadFromXML:9");
				unset($currentDOM);
				throw new Exception('SetoTemplates() function fails!\n');
				//return false;
			}
			if ($this->SetoPages($pagesNode)==false)
			{
				//echo("LoadFromXML:10");
				unset($currentDOM);
				throw new Exception('SetoPages() function fails!\n');
				//return false;
			}
			if ($this->SetoXMLFiles($XMLFilesNode)==false)
			{
				//echo("LoadFromXML:11");
				unset($currentDOM);
				throw new Exception('SetoXMLFiles() function fails!\n');
				//return false;
			}
			unset($currentDOM);
			return true;	
		}catch(Exception $e)
		{
			//write into log error log file throw new Exception('projeckt->loadFromXML: '.  $e->getMessage(). '\n');
			return false;
		}
	}
	protected function SetoTemplates($DOMNodeTemplates)
	{
		try
		{
			//$this->oTemplates->setTemplatesFolder("wbcms/projekts/".$this->sProjektFolder."/"."Templates");
			$CurrentChildNodes = $DOMNodeTemplates->childNodes;
			if ($CurrentChildNodes->length==0)
			{
				//no templates defined
				return true;//is not an error, a template is not required
			}
			//$aFileNames = array();
			//$this->oTemplates = new Templates;
			for ($x=0;$x<$CurrentChildNodes->length;$x++)
			{
				if ($CurrentChildNodes->item($x)->nodeName != "FileName")
				{
					//error the name of the element must be FileName
					throw new Exception('The name of the element must be FileName');
					//return false;
				}
				$CurFileName = $CurrentChildNodes->item($x)->nodeValue;
				$CurBaseURL = $CurrentChildNodes->item($x)->getAttribute("BaseURL");
				//
				$CurPath = $CurrentChildNodes->item($x)->getAttribute("Path");
				$CurURL = $CurrentChildNodes->item($x)->getAttribute("URL");
				$CurExtension = $CurrentChildNodes->item($x)->getAttribute("FileExtension");
				$CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
				$CurContentType = $CurrentChildNodes->item($x)->getAttribute("ContentType");
				$CurMime= $CurrentChildNodes->item($x)->getAttribute("ParserMime");
				$CurCharSet = $CurrentChildNodes->item($x)->getAttribute("charSet");
				//
				//($sFileNameIn,$BaseURLIn,$templatesFolder)
				$templatesFolder = $this->oTemplates->templatesFolder;
				$currentTemplate = new Template($CurFileName,$CurBaseURL,$templatesFolder);
				//
				$currentTemplate->sPath=$CurPath;
				$currentTemplate->sHttpPath=URL_PATH.$CurFolder;
				$currentTemplate->fileExtension = $CurExtension;
				$currentTemplate->sFolder=$CurFolder;
				$currentTemplate->sContentType = $CurContentType;
				$currentTemplate->ParserMimeType = $CurMime;
				$currentTemplate->charSet = $CurCharSet; 
				//
				//$currentTemplate
				//$this->oTemplates->addTemplate($CurFileName,$CurBaseURL);
				$this->oTemplates->addExplicit($currentTemplate,$CurFileName);
			}
			return true;
		}catch(Exception $e)
		{
			throw new Exception('projeckt->SetoTemplates: '.  $e->getMessage(). "\n");
		}
	}
	protected function SetoPages($DOMNodePages)
	{
		try
		{
			$CurrentChildNodes = $DOMNodePages->childNodes;
			if ($CurrentChildNodes->length==0)
			{
				//no <page> element defined
				return true;//is not an error, a page is not required
			}
			//for each page element
			for ($y=0;$y<$CurrentChildNodes->length;$y++)
			{
				//page Elements
				$nodePage = $CurrentChildNodes->item($y)->childNodes;
				if ($nodePage->length == 0)
				{
					throw new Exception("Node page can't be empty");
					//return false;
				}
				if ($nodePage->length > 3)
				{
					throw new Exception("Only 3 Elements belong to the page Element.FileName , TemplateFileName and Data");
					//return false;
				}
				if (($nodePage->length ==1)&&($nodePage->item(0)!="FileName"))
				{
					throw new Exception("Node FileName is the obligaroty Element");
					//return false;
				}
				$nodeDataIndex = NULL;
				$sTemplateFileName = "";
				if ($nodePage->length == 3)
				{
					if ($nodePage->item(0))
					{
						if ($nodePage->item(0)->nodeName!= "FileName")
						{
							throw new Exception("The first Element must be the element <FileName>");
							//return false;
						}
					}
					if ($nodePage->item(1))
					{
						if ($nodePage->item(1)->nodeName != "TemplateFileName")
						{
							throw new Exception("The second Element can not be diferent than <TemplateFileName>");
							//return false;
						}else{
							//
							$sTemplateFileName = $nodePage->item(1)->nodeValue;
						}
					}
					if ($nodePage->item(2))
					{
						if ($nodePage->item(2)->nodeName != "Data")
						{
							throw new Exception("The third Element can not be diferent than <Data>");
							//return false;	
						}
						$nodeDataIndex = 2;
					}
				}else if($nodePage->length == 2)
				{
					if ($nodePage->item(0))
					{
						if ($nodePage->item(0)->nodeName!= "FileName")
						{
							throw new Exception("The first Element can not be diferent than <FileName>");
							//return false;
						}
					}
					if ($nodePage->item(1))
					{
						if (($nodePage->item(1)->nodeName != "Data")And($nodePage->item(1)->nodeName != "TemplateFileName"))
						{
							throw new Exception("The second Element can either be diferent than <FileName> and <TemplateFileName>");
							//echo("5".$nodePage->item(1)->nodeName);
							//return false;	
						}
						if ($nodePage->item(1)->nodeName == "Data")
						{
							$nodeDataIndex = 1;
						}
					}
				}
				$pageFolder = $CurrentChildNodes->item($y)->getAttribute("Folder");
				/*if ($pageFolder=="")
				{
					return false;
				}*/
				$nodeFileName = $nodePage->item(0)->nodeValue;
				
				$CurPath = $nodePage->item(0)->getAttribute("Path");
				$CurURL = $nodePage->item(0)->getAttribute("URL");
				$CurExtension = $nodePage->item(0)->getAttribute("FileExtension");
				$CurFolder = $nodePage->item(0)->getAttribute("Folder");
				$CurContentType = $nodePage->item(0)->getAttribute("ContentType");
				$CurMime= $nodePage->item(0)->getAttribute("ParserMime");
				$CurCharSet = $nodePage->item(0)->getAttribute("charSet");
				//$this->oPages = new Pages;
				$CurrentPage = new Page($nodeFileName,$pageFolder);
				//
				$CurrentPage->sPath=$CurPath;
				$CurrentPage->sHttpPath=URL_PATH.$CurFolder;
				$CurrentPage->fileExtension = $CurExtension;
				$CurrentPage->sFolder=$CurFolder;
				$CurrentPage->sContentType = $CurContentType;
				$CurrentPage->ParserMimeType = $CurMime;
				$CurrentPage->charSet = $CurCharSet; 
				//
				//$this->oPages->addPage($nodeFileName,$pageFolder);
				$this->oPages->addExplicit($CurrentPage,$pageFolder.$nodeFileName);
				$PageObjDataFiles = $this->oPages->aFiles[$pageFolder.$nodeFileName]->oDataFiles;
				$this->oPages->aFiles[$pageFolder.$nodeFileName]->sTemplateFileName = $sTemplateFileName;
				if (!(is_null($nodeDataIndex)))//always
				{
					$nodeData = $nodePage->item($nodeDataIndex);
					$dataElements = $nodeData->childNodes;
					$aFileNames[] = array();
					for ($x=0;$x<$dataElements->length;$x++)
					{
						$sNodeFileName=$dataElements->item($x);
						if ($sNodeFileName->nodeName != "FileName")
						{
							//the name of each node belongs to Data element must be <FileName>
							throw new Exception("The name of each node which belongs to Data element must be <FileName> nodeName is <".$sNodeFileName->nodeName.">");
							//return false;
						}
						$sCurDataFileName = $sNodeFileName->nodeValue;
						$sCurDataFileId = $nodeData->getAttribute("Id");
						$sCurDataLang=$nodeData->getAttribute("Lang");
						$sCurDefault=$nodeData->getAttribute("Default");
						//
						$CurPath = $sNodeFileName->getAttribute("Path");
						$CurURL = $sNodeFileName->getAttribute("URL");
						$CurExtension = $sNodeFileName->getAttribute("FileExtension");
						$CurFolder = $sNodeFileName->getAttribute("Folder");
						$CurContentType = $sNodeFileName->getAttribute("ContentType");
						$CurMime= $sNodeFileName->getAttribute("ParserMime");
						$CurCharSet = $sNodeFileName->getAttribute("charSet");
						//
						$currentDataFile = new dataFile($sCurDataFileId,$sCurDataLang,$sCurDataFileName,$sCurDefault,$CurFolder);
						//
						$currentDataFile->sPath=$CurPath;
						$currentDataFile->sHttpPath=URL_PATH.$CurFolder;
						$currentDataFile->fileExtension = $CurExtension;
						$currentDataFile->sFolder=$CurFolder;
						$currentDataFile->sContentType = $CurContentType;
						$currentDataFile->ParserMimeType = $CurMime;
						$currentDataFile->charSet = $CurCharSet; 
						//
						$PageObjDataFiles->addExplicit($currentDataFile,$CurFolder.$sCurDataFileName);
						//$PageObjDataFiles->addDataFile($sCurDataFileId,$sCurDataLang,$sCurDataFileName,$sCurDefault,"wbcms/projekts/".$this->sProjektFolder."/"."XMLFiles");
					}
				}
			}
			//end for each page Element
			return true;
		}catch(Exception $e)
		{
			throw new Exception('projeckt->SetoPages: '.  $e->getMessage(). '\n');
		}
	}
	function SetoXMLFiles($DOMNodeXMLFiles)
	{
		try
		{
			//$this->oXMLFiles->setXMLFilesFolder("wbcms/projekts/".$this->sProjektFolder."/"."XMLFiles");
			$CurrentChildNodes = $DOMNodeXMLFiles->childNodes;
			if ($CurrentChildNodes->length==0)
			{
				//no XMLfile defined
				return true;//is not an error, a template is not required
			}
			//$aFileNames = array();
			//$this->oTemplates = new Templates;
			for ($x=0;$x<$CurrentChildNodes->length;$x++)
			{
				if ($CurrentChildNodes->item($x)->nodeName != "FileName")
				{
					throw new Exception("The name of the element must be FileName\n");
					//return false;
				}
				$CurFileName = $CurrentChildNodes->item($x)->nodeValue;
				$CurBaseURL = $CurrentChildNodes->item($x)->getAttribute("BaseURL");
				$CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
				//
				$CurPath = $CurrentChildNodes->item($x)->getAttribute("Path");
				$CurURL = $CurrentChildNodes->item($x)->getAttribute("URL");
				$CurExtension = $CurrentChildNodes->item($x)->getAttribute("FileExtension");
				$CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
				$CurContentType = $CurrentChildNodes->item($x)->getAttribute("ContentType");
				$CurMime= $CurrentChildNodes->item($x)->getAttribute("ParserMime");
				$CurCharSet = $CurrentChildNodes->item($x)->getAttribute("charSet");
				//
				$currentXMLFile = new XMLFile($CurFileName,$CurBaseURL,$CurFolder);
				//
				$currentXMLFile->sPath=$CurPath;
				$currentXMLFile->sHttpPath=URL_PATH.$CurFolder;
				$currentXMLFile->fileExtension = $CurExtension;
				$currentXMLFile->sFolder=$CurFolder;
				$currentXMLFile->sContentType = $CurContentType;
				$currentXMLFile->ParserMimeType = $CurMime;
				$currentXMLFile->charSet = $CurCharSet; 
				//
				//$this->oXMLFiles->addXMLFile($CurFileName,$CurFolder,$CurBaseURL);
				$this->oXMLFiles->addExplicit($currentXMLFile,$CurFolder.$CurFileName);
			}
			return true;	
		}catch(Exception $e)
		{
			throw new Exception('projeckt->SetoXMLFiles: '.  $e->getMessage(). '\n');
		}
	}
	public function getArrTemplatesFileNames()
	{
		try
		{
			$this->oTemplates->getArrayFileNames();	
		}catch(Exception $e)
		{
			throw new Exception('projeckt->getArrTemplatesFileNames: '.  $e->getMessage(). '\n');
		}
	}
	public function getArrPagesFileNames()
	{
		try
		{
			$this->oPages->getArrayFileNames();	
		}catch(Exception $e)
		{
			throw new Exception('projeckt->getArrPagesFileNames: '.  $e->getMessage(). '\n');
		}
	}
	public function getJSONTemplates(){
		try
		{
			$this->oTemplates->getJSONString();	
		}catch(Exception $e)
		{
			throw new Exception('projeckt->getJSONTemplates: '.  $e->getMessage(). '\n');
		}
	}
	public function getJSONPages(){
		try
		{
			$this->oPages->getJSONString();	
		}catch(Exception $e)
		{
			throw new Exception('projeckt->getJSONPages: '.  $e->getMessage(). '\n');
		}
	}
	public function getJSONXMLFiles(){
		try
		{
			$this->oXMLFiles->getJSONString();
		}catch(Exception $e)
		{
			throw new Exception('projeckt->getJSONXMLFiles: '.  $e->getMessage(). '\n');
		}	
	}
	public function getProjectsFromFileSystemPath()
	{
		try
		{
			$xmlFiles = array();
			if ($handle = opendir(PROJEKTS_PATH)) 
			{
			    while (false !== ($file = readdir($handle))) 
			    {
			        $pos = strrpos( $file, '.' );
					if( $pos !== false ) 
					{
						$file_ext = substr( $file, ( $pos + 1 ) );
						if (strtoupper($file_ext)=="XML")
						{
							$xmlFiles[] = $file;
						}
					}
				}
		    }
		    closedir($handle);
		    foreach ($xmlFiles as $xmlIndex =>$xmlValue)
		    {
		    	if ($this->loadProject($xmlValue)==false)
		    	{
		    		unset($xmlFiles[$xmlIndex]); 
		    	}
		    	$this->setPropertiesToNull();
		    }
		    return $xmlFiles;
	    }catch(Exception $e)
		{
			throw new Exception("projeckt->getProjectsFromFileSystemPath: ".  $e->getMessage(). "path: ".PROJEKTS_PATH."\n");
		}	
	}
	protected function setPropertiesToNull()
	{
		try
		{
			$this->sXMLFileName = NULL;
			$this->sName=NULL;
			$this->oTemplates = NULL;
			$this->oPages = NULL; 
			$this->oXMLFiles = NULL;		
			$this->sProjektFolder = NULL;
		}catch(Exception $e)
		{
			throw new Exception("projeckt->setPropertiesToNull: ".  $e->getMessage(). "\n");
		}	
	}
	public function removeTemplate($sFileNameIn_Id)
    {
    	try
    	{
	    	if (isset($this->oTemplates->aFiles[$sFileNameIn_Id]))
	    	{
	    		$path = $this->oTemplates->aFiles[$sFileNameIn_Id]->sHttpPath;
	    		$FileName = $this->oTemplates->aFiles[$sFileNameIn_Id]->sFilename;
	    		//$CompletFileName = $path.$FileName;
	    		$templateURL = $path.$FileName;
		    	if ($this->oPages->existTemplate($templateURL)==false)//referencial Integrity
		    	{	
		    		$this->oTemplates->removeTemplate($sFileNameIn_Id);
		    	}else
		    	{
		    		throw new Exception("\t\n The Template File ".$sFileNameIn_Id." could not be deleted because its related with one the page.\n ");
		    	}
	    	}else
	    	{
	    		throw new Exception("\n The Teplate File ".$sFileNameIn_Id." was not found!. \n");
	    	}
       	}catch(Exception $e)
		{
			throw new Exception("projeckt->removeTemplate: ".  $e->getMessage(). "\n");
		}	
    }
    public function removePage($sFileNameIn_Id)
    {
    	try
    	{
	    	$bRemoved = $this->oPages->removePage($sFileNameIn_Id);
		    return $bRemoved;
	    }catch(Exception $e)
		{
			throw new Exception("projeckt->removePage: ".  $e->getMessage(). "\n");
		}	
    }
	public function removeXMLData($sFileNameIn_Id)
    {
    	try
    	{
	    	if (isset($this->oXMLFiles->aFiles[$sFileNameIn_Id]))
	    	{
	    		//$path = $this->oTemplates->aFiles[$sFileNameIn_Id]->sPath;
	    		//$FileName = $this->oXMLFiles->aFiles[$sFileNameIn_Id]->sFilename;
	    		//$CompletFileName = $path.$FileName;
		    	if ($this->oPages->existXMLData($sFileNameIn_Id)==false)
		    	{	
		    		$this->oXMLFiles->removeDataFile($sFileNameIn_Id);
//		    		return $bRemoved;
		    	}else
		    	{
		    		throw new Exception("\n The XML File ".$sFileNameIn_Id." could not be deleted because its related with one the page. ");
		    	}
	    	}else{
	    			throw new Exception("\n The XML File ".$sFileNameIn_Id." was not found!. ");
	    	}
	       //	return false;
       	}catch(Exception $e)
		{
			throw new Exception("projeckt->removeXMLData: ".  $e->getMessage(). "\n");
		}	
    }
}
?>