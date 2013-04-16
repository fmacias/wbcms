<?php
require_once("constants.php");
require_once("relateData.php");

function createFolder($fileFolder)
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
					throw new Exception ("\n\tcreateFolder: Folders or a Files names can not contain any of the following characters: \/:*?''<> |\n");
				}			
			}
			$currentPath= WBit_PATH;
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
							throw new Exception("\n\tcreateFolder: The file could not be created: path: ".$currentPath."\n");
						//}
					}
				}
			}
			//$this->sFolder = $currentFolder;
			return true;
		}catch(Exception $e)
		{
			 throw new Exception ("\n\tcreateFolder: ".  $e->getMessage()."\n");
			 //return false;
		}
	}
function setUserWorkFolders($USER)
{
	//defineConstants($USER);
	/*
	define("WBit_URL","http://".$_SERVER['HTTP_HOST']."/");
	define("WBit_PATH",$_SERVER['DOCUMENT_ROOT']."/");
	define("APP_PATH","http://".$_SERVER['DOCUMENT_ROOT']."/wbcms/");
	define("APP_FOLDER","wbcms/");
	define("DTDs_FOLDER","DTDs/");//public folder with empty files used for the application to create empty templates
	//
	define("URL_PATH","http://".$_SERVER['HTTP_HOST']."/$USER/");//Root URL
	define("FILESYSTEM_PATH",$_SERVER['DOCUMENT_ROOT']."/$USER/"); //absolute PATH of the server root folder
	define("PROJEKTS_PATH",$_SERVER['DOCUMENT_ROOT']."/$USER/projects/");//folder with the projekt files
	define("PROJEKTS_URL","http://".$_SERVER['HTTP_HOST']."/$USER/projects/");//folder with the projekt files
	define("PROJEKTS_FOLDER","$USER/projects/");//folder with the projekt files
	*/
	//
	if (createFolder("$USER/projects/")==false)
	{
		 throw new Exception  ('setUserWorkFolders fails: '.  $e->getMessage().'\n');
	}
	//
	/*if (file_exists(FILESYSTEM_PATH.".htaccess")){} else 
	{
		$htaccess = fopen(FILESYSTEM_PATH.".htaccess", 'w');
		if ($htaccess==false)
		{
			throw new Exception("\n\tFile->setUserWorkFolders: could not create the .htaccess file\n");
		}
		fputs($htaccess, 
	    "AuthType Basic\n".
	    "AuthName \"Password Required\"\n".
	    "AuthUserFile ".FILESYSTEM_PATH."/.htpasswd\n");
		 fputs($htaccess, "require user $USER\n");
		 fclose($htaccess);
	}
	if (file_exists(FILESYSTEM_PATH.".htpasswd")){
		
	}else 
	{
		$htpasswd = fopen(FILESYSTEM_PATH.".htpasswd", 'w');
		fputs($htpasswd, "$USER:".crypt($USER)."\n");
		fclose($htpasswd);
	}*/
}
class WEBLanguage{
	protected $sLanguage='';
	function __construct()
	{
		$sCurrentLanguage = strtoupper(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'],0,2));
		$this->sLanguage = $sCurrentLanguage;
	}
}
class CurrentFile extends projeckt //always  the file is being used
{
	public $currentFile = ''; //Current FileName
	public $currentURLFile = ''; //Current URL+FileName
	public $currentFSFile = ''; //Current File System+FileName
	public $currentFileExtension = '';
	public $ContentType = '';
	public $MimeType = '';
	public $charSet = '';
	public $curOFileObj = NULL;
	/*function __construct()
	{
		if (parent::sName==NULL)
		{
			$this->openProjectsForm();
		}
	}*/
	public function openProjectsForm()
	{
		header('Location: projects.php');
	}
	public function loadProjectFile($PostProjecktFileName)
	{
		try{
			if ($PostProjecktFileName)
			{
				parent::loadProject($PostProjecktFileName["ProjecktFileName"]);
			}
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->loadProjectFile: '.  $e->getMessage().'\n');
		}
	}
	public function createProject($ProjectName)
	{
		try
		{
			if ($ProjectName)
			{
				parent::createNewProject($ProjectName);
			}
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->createProject: '.  $e->getMessage().'\n');
		}
	}
	//public function setCurrent($FileNameIn)
	public function setCurrent($oFile)
	{
		try
		{
			//$oFile->setContentTypeFromFileContent();
			$this->currentFile = $oFile->sFilename;
			$this->currentURLFile = $oFile->sHttpPath.$oFile->sFilename;
			$this->currentFSFile = $oFile->sPath.$oFile->sFilename;
			$this->ContentType =$oFile->sContentType;
			$this->currentFileExtension =$oFile->fileExtension;
			$this->MimeType= $oFile->MimeType;
			$this->charSet= $oFile->charSet;
			$this->curOFileObj = $oFile;
		//$this->setFileContentType($oFile->sFilename);
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->setCurrent: '.  $e->getMessage().'\n');
		}
	}
	public function getCurrentFileInfoJSON()
	{
		try
		{
			$JSON="{FileName:\"$this->currentURLFile\",ContentType:\"$this->ContentType\"}";
			return $JSON;
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->getCurrentFileInfoJSON: '.  $e->getMessage().'\n');
		}
	}
	/*protected function setFileContentType($fileNameIn)
	{
		$pattern = '/\w*$/';
		$matchesCount = preg_match($pattern,$fileNameIn, $matches);
		if (strtoupper($matches[0])=="XML")
		{
			$this->ContentType ="text/xml";
		}else if((strtoupper($matches[0])=="HTML")||(strtoupper($matches[0])=="HTM"))
		{
			$this->ContentType ="text/html";
		}else if(strtoupper($matches[0])=="XHTML")
		{
			$this->ContentType ="application/xhtml";
		}
		$this->currentFileExtension = strtoupper($matches[0]);
	}*/
	public function saveCurrentFile($XHTMLCode_in)
	{
		try
		{
			if ($this->ContentType =="text/html")
			{
				return $this->saveHTML($XHTMLCode_in);
			}else
			{
				return $this->saveXML($XHTMLCode_in);
			}
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->saveCurrentFile: '.  $e->getMessage().'\n');
		}
	}
	protected function saveHTML($HTMLCode_in)
	{
		try
		{
			$strDocumentElement = $HTMLCode_in;
			$selfDOM = new DOMDocument();
			$selfDOM->loadHTMLFile($this->currentURLFile);
			$DocTypePublicId = $selfDOM->doctype->publicId;
			$DocTypeSystemId =	$selfDOM->doctype->systemId;
			$DocTypeName = $selfDOM->doctype->name;
			//unset($selfDOM);
			if ($DocTypeName)
			{
				$DocType = "<!DOCTYPE $DocTypeName";
				if ($DocTypePublicId)
				{
					$DocType .= " PUBLIC \"$DocTypePublicId\"";
				}
				if ($DocTypeSystemId)
				{
					$DocType .= " \"$DocTypeSystemId\"";
				}
				$DocType .= ">";
			}
			$HTMLDOMStr = $DocType.$strDocumentElement;
			//
			$newHTMLTemp = new DOMDocument;
			$newHTMLTemp->loadHTML($newHTMLTemp);
			
			$newnode = $selfDOM->importNode($newHTMLTemp->documentElement);
			$removedChild = $selfDOM->removeChild($selfDOM->documentElement);
			$appendChild = $selfDOM->appendChild($newnode);
			$Bytes =  $selfDOM->save($this->currentFSFile);
			unset($selfDOM);
			unset($newHTMLTemp);
			return $Bytes; 	
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->saveCurrentFile: '.  $e->getMessage().'\n');
		}	 
	}
	protected function saveXML($XMLCode_in)
	{
		try
		{
			$newDOM = new DOMDocument();
			$newDOM->loadXML($XMLCode_in);
			$selfDOM = new DOMDocument();
			$selfDOM->load($this->currentURLFile);
			$newnode = $selfDOM->importNode($newDOM->firstChild, true);
			$removedChild = $selfDOM->removeChild($selfDOM->documentElement);
			$appendChild = $selfDOM->appendChild($newnode);
			$Bytes = $selfDOM->save($_SESSION["RQSTFiles"]->currentFSFile);
			return $Bytes;
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->saveXML: '.  $e->getMessage().'\n');
		}	
	}
	/*public function getPIString()
	{
		$selfDOM = new DOMDocument();
		if (($this->currentFileExtension=="XML")||($this->currentFileExtension=="XHTML"))
		{
			$selfDOM->load($this->currentFSFile);
		}else if(($this->currentFileExtension=="HTML")||($this->currentFileExtension=="HTM"))
		{
			$selfDOM->loadHTMLFile($this->currentFSFile);	
		}
		$pi = "";
		if ($selfDOM->childNodes->item(0)->nodeType==7)
		{
			$currentPI = $selfDOM->childNodes->item(0);
			$target = $currentPI->target;
			$data = $currentPI->data;
			$pi = '<? target='.$target.' data='.$data.'>';
		}
		unset($selfDOM);
		return $pi;
	}*/
	public function getDocumentTypeString()
	{
		try
		{
			$DocTypePublicId = null;
			$DocTypeSystemId =	null;
			$DocTypeName = null;
			$DocTypeInternalSubset = null;
			$DocType = null;
			//error_reporting(0);
			$selfDOM = new DOMDocument();
			if (($this->ContentType =="application/xhtml+xml")||($this->ContentType =="application/xml"))
			{
				$selfDOM->load($this->currentFSFile);
			}else if(($this->ContentType =="text/html"))
			{
				error_reporting(0);
				$selfDOM->loadHTMLFile($this->currentFSFile);	
				error_reporting(E_ALL);
				$internalSubset = $selfDOM->doctype->internalSubset;
				unset($selfDOM);
				return $internalSubset;
			}
			$DocTypeName = $selfDOM->doctype->name;
			$DocTypeInternalSubset = $selfDOM->doctype->internalSubset;
			if ($DocTypeName)
			{
				$DocType = "<!DOCTYPE $DocTypeName ";
				if ($DocTypeInternalSubset)
				{
					$DocType .='['.$DocTypeInternalSubset.']';
				}
				$DocType .= ">";
			}
			unset($selfDOM);
			return $DocType;
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->getDocumentTypeString: '.  $e->getMessage().'\n');
		}
	}
	public function getSourceCode()
	{
		try
		{
			$sourceCode = file_get_contents($this->currentFSFile);
			return $sourceCode;
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->getSourceCode: '.  $e->getMessage().'\n');
		}
	}
	public function saveXML2($DOMString)
	{
		try
		{
			//
			$selfDOM = new DOMDocument();
			//
			$bytes = 0;
			$newDOM = new DOMDocument("1.0",$this->curOFileObj->charSet);
			$selfDOM->load($this->currentFSFile);
			$newDOM->loadXML($DOMString);
			$curDocElement = $newDOM->documentElement;
			$newElement = $selfDOM->importNode($curDocElement,true);
			$replacedChild = $selfDOM->replaceChild($newElement,$selfDOM->documentElement);
			$Bytes = $selfDOM->save($this->currentFSFile);
			unset($selfDOM);
			unset($newDOM);
			return $Bytes;	
		}catch(Exception $e)
			{
				  throw new Exception  ('CurrentFile->saveCurrentDocument() fails '.  $e->getMessage().'\n');
			}
	}
	public function getHTMLWorkingFile()
	{
		$charSet = $this->curOFileObj->charSet;
		$fileContent =  "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">";
		$fileContent .= "<html>";
		$fileContent .= "<head>";
		$fileContent .= "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=$charSet\">";
		$fileContent .= "<title>Insert title here</title>";
		$fileContent .= "</head>";
		$fileContent .= "<body>";
		$fileContent .= " </body>";
		$fileContent .= "</html>";
		//
		$fileURL = WBit_URL.APP_FOLDER."HTMLTransitional.html";
		$fileSystem = FILESYSTEM_PATH.APP_FOLDER."HTMLTransitional.html";
		//
		$newDOM = new DOMDocument();
		$newDOM->loadHTML($fileContent);
		$bytes = $newDOM->save($fileSystem);
		return $fileURL;
	} 
	public function saveXMLFromString($DOMString,$encoding)
	{
		try
		{
			$bytes = 0;
			$newDOM = new DOMDocument("1.0",$encoding);
			$newDOM->loadXML($DOMString);
			$Bytes = $newDOM->save($this->currentFSFile);
			unset($newDOM);
			return $Bytes;	
		}catch(Exception $e)
			{
				  throw new Exception  ('CurrentFile->saveXMLFromString() fails '.  $e->getMessage().'\n');
			}
	}
	public function getXHTMLWorkingFile()
	{
		$charSet = $this->curOFileObj->charSet;
		$parserMimeType = $this->curOFileObj->ParserMimeType;
		$fileContent = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
		$fileContent .= "<html>";
		$fileContent .= "<head>";
		$fileContent .= "<meta http-equiv=\"Content-Type\" content=\"$parserMimeType; charset=$charSet\" />";
		$fileContent .= "<title>Insert title here</title>";
		$fileContent .= "</head>";
		$fileContent .= "<body>";
		$fileContent .= " </body>";
		$fileContent .= "</html>";
		//
		$fileURL = WBit_URL.APP_FOLDER."XHTMLTransitional.html";
		$fileSystem = FILESYSTEM_PATH.APP_FOLDER."XHTMLTransitional.html";
		//
		$newDOM = new DOMDocument();
		$newDOM->loadHTML($fileContent);
		$bytes = $newDOM->save($fileSystem);
		return $fileURL;
		//return $fileURL;
	}
public function saveHTML2($HTMLCode_in)
	{
		try
		{
			//load current DOM
			$bytes = 0;
			/*
			  $selfDOM = new DOMDocument();
			  @$selfDOM->loadHTMLFile($this->currentFSFile);
			//
			//create new DOM
			$DocTypePublicId = $selfDOM->doctype->publicId;
			$DocTypeSystemId =	$selfDOM->doctype->systemId;
			$DocTypeName = $selfDOM->doctype->name;
			//unset($selfDOM);
			$DocType = "";
			if ($DocTypeName)
			{
				$DocType = "<!DOCTYPE $DocTypeName";
				if ($DocTypePublicId)
				{
					$DocType .= " PUBLIC \"$DocTypePublicId\"";
				}
				if ($DocTypeSystemId)
				{
					$DocType .= " \"$DocTypeSystemId\"";
				}
				$DocType .= ">";
			}*/
			$parserMimeType = $this->curOFileObj->ParserMimeType;
			$PI = "";
			if (($parserMimeType=="application/xhtml+xml"))
			{
				$curCharSet = $this->curOFileObj->charSet;
				$PI = "<?xml version=\"1.0\" encoding=\"$curCharSet\"?>";
			}
			$Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($PI."\n".$HTMLCode_in);
			return $Bytes; 	
		}catch(Exception $e)
		{
			  throw new Exception  ('CurrentFile->saveHTML2: '.  $e->getMessage().'\n');
		}	 
	}
	public function saveHTMLXHTML($HTMLCode_in)
	{
		$pattern = '/\w*$/';
		$matchesCount = preg_match($pattern,$this->curOFileObj->sContentType, $matches);
		$fileType = strtoupper($matches[0]);
		//
		$parserMimeType = $this->curOFileObj->ParserMimeType;
		$contentType = $this->curOFileObj->sContentType;
		//
		$Bytes = 0;
		//
		if ( $parserMimeType=="application/xhtml+xml" )
		{
			$selfDOM = new DOMDocument();
			$selfLoaded = $selfDOM->load($this->currentFSFile);
			$loaded = false;
			if ($selfLoaded)
			{
				if ( $selfLoaded->encoding == "")
				{
					$PI_ = $selfDOM->createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
					$selfDOM->appendChild($PI_);
				}
				$newDOM = new DOMDocument("1.0",$this->curOFileObj->charSet);
				$loaded = $newDOM->loadXML($HTMLCode_in);
				if ($loaded)
				{
					if ( $newDOM->encoding == "")
					{
						$PI = $newDOM->createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
						$newDOM->appendChild($PI);
					}
					$newElement = $selfDOM->importNode($newDOM->documentElement,true);
					$replacedChild = $selfDOM->replaceChild($newElement,$selfDOM->documentElement);
					//$appendedChild = $selfDOM->appendChild($newElement);
					$Bytes = $selfDOM->save($this->currentFSFile);
				}
			}
			if ($loaded==false)
			{
				unset($newDOM);
				unset($selfDOM);
				$newDOM = new DOMDocument("1.0",$this->curOFileObj->charSet);
				$loaded = $newDOM->loadXML($HTMLCode_in);
				$Bytes = $newDOM->save($this->currentFSFile);
			}
		}/*else if ( ( $fileType == "HTML" )&& ( $parserMimeType == "application/xhtml+xml" ) )
		{
			$newDOM = new DOMDocument();
			$curCharSet = $this->curOFileObj->charSet;
			$PI = "<?xml version=\"1.0\" encoding=\"$curCharSet\" ?>\n";
			$loaded = @$newDOM->loadHTML($PI.$HTMLCode_in);
			if ($loaded)
			{
				$Bytes = $newDOM->save($this->currentFSFile);
			}
		}*/else if ($parserMimeType == "text/html")
		{
			$Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($HTMLCode_in);
		}else{
			 throw new Exception  ("content Type: ".$contentType." not supported! \n");
		}
		return $Bytes;
	}
}
?>