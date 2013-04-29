<?php

namespace FreeDOM\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use FreeDOM\Model\FreeDOM;
use FreeDOM\Model\File\File as FreeDOMFile;
use FreeDOM\Model\Project;

class FreeDOMController extends AbstractActionController
{

    public function loadProjectAction()
    {
	try
	{
	        $this->layout('layout/json');
		$selectedProject = $_POST["selectedProject"];
		$currentNewProject = new FreeDOM();
		if ($currentNewProject->loadProject($selectedProject))
		{
			$_SESSION["CurrentFile"] = $currentNewProject;
			echo (json_encode($_SESSION["CurrentFile"]));
		}else
		{
			throw new \Exception("loadProject returns false. Projeckt could not be created!");
		}
	}catch(\Exception $e)
	{
		echo('loadProject fails: '.  $e->getMessage().'\n');
	}
	return true;
    }
    public function getProjectsAction()
    {

        $this->layout('layout/json');
        $oProjeckt = new Project();
        $aProjekts = $oProjeckt->getProjectsFromFileSystemPath();
        unset($oProjeckt);
        header('Content-type: text/plain;charset=UTF-8');
        echo(json_encode($aProjekts));
        return true;
    }

    public function createProjectAction()
    {
        try {
            $this->layout('layout/json');
            $ProjectName = trim($_POST["porjectName"]);
            $ProjectFolder = trim($_POST["projectFolder"]);
            if ($ProjectName == "")
            {
                throw new \Exception("Projekt name is obligatory");
            }
            if ($ProjectFolder == "")
            {
                throw new \Exception("Projekt Folder is obligatory");
            }
            $currentNewProject = new FreeDOM();
            $currentNewProject->setProjectFolder($ProjectFolder);
            $currentNewProject->createNewProject($ProjectName);
            $_SESSION["CurrentFile"] = $currentNewProject;
            echo (json_encode($currentNewProject));
        } catch (\Exception $e) {
            echo('createProject.php. Error: ' . $e->getMessage() . '\n');
        }
        return true;
    }

    public function getProjectViewXMLAction()
    {
        try {
            $this->layout('layout/json');
            $projektXMLFile = $_SESSION["CurrentFile"]->getProjektXMLFile();
            $projektName = $_SESSION["CurrentFile"]->getProjektName();
            $XMLURL = PROJEKTS_URL . $projektXMLFile;
            echo ('{projektXMLFile:"' . $XMLURL . '",projektName:"' . $projektName . '",contentType:"text/xml"}');
        } catch (Exception $e) {
            echo('getProjectViewXMLAction() fails: ' . $e->getMessage() . '\n');
        }
        return true;
    }

    public function requestSetFileAction()
    {
        try {
            $this->layout('layout/json');
            $curFileIndex = $_POST["FileIndex"]; //File Index
            $curCategorie = $_POST["FileCategorie"];
            $oFile = NULL;

            switch ($curCategorie) {
                case "Template":
                    $oFile = $_SESSION["CurrentFile"]->oTemplates->aFiles[$curFileIndex];
                    break;
                case "Page":
                    $oFile = $_SESSION["CurrentFile"]->oPages->aFiles[$curFileIndex];
                    break;
                case "DataFile":
                    $oFile = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$curFileIndex];
                    break;
                case "ConfigFile":
                    $oFile = new FreeDOMFile($_SESSION["CurrentFile"]->sXMLFileName,
                            "projects");
                    break;
                default:
                    echo '{Error:"Categorie must be Template, Page,DataFile or ConfigFile"}';
                    return false;
            }
            $_SESSION["CurrentFile"]->setCurrent($oFile);
            header('Content-type: text/plain;charset=UTF-8');
            $fileJSON = $oFile->getFileJSON();
            echo $fileJSON;
        } catch (Exception $e) {
            echo("requestSetFile fails: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function getFileAction()
    {
        try {
            $this->layout('layout/json');
            header('Content-type: text/xml; charset=utf-8');
            echo file_get_contents($_SESSION["CurrentFile"]->currentFSFile);
        } catch (Exception $e) {
            echo('getFile fails: ' . $e->getMessage() . '\n');
        }
        return true;
    }

    public function rqstxmltreeAction()
    {
        try {
            $this->layout('layout/json');
            $tempFileName = $_SESSION["CurrentFile"]->currentFile . ".html";
            $tempFile = new FreeDOMFile($tempFileName, "temp");
            //
            $currentFile = $_SESSION["CurrentFile"]->currentFSFile;
            $xslFilePath = APP_PATH . "xml/xmltree.xsl";
            $doc = new \DOMDocument();

            $xsl = new \XSLTProcessor();
            $doc->load($xslFilePath);
            $xsl->importStyleSheet($doc);
            $doc->load($currentFile);
            $xsltOuptput = $xsl->transformToXML($doc);
            $tempFile->file_put_contents($xsltOuptput);
            $fileJSON = $tempFile->getFileJSON();
            echo $fileJSON;
        } catch (Exception $e) {
            echo("rqstXMLTreeHTML: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function saveProjectIntoXMLAction()
    {
        try {
            $this->layout('layout/json');
            $_SESSION["CurrentFile"]->saveProjectIntoXML();
            echo ('{}');
        } catch (Exception $e) {
            echo("saveProjectIntoXMLAction fails " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function requestTemplatesAction()
    {
        try {
            $this->layout('layout/json');
            $JSONString = $_SESSION["CurrentFile"]->oTemplates->getFilesJSON();
            header('Content-type: text/plain; charset=UTF-8');
            echo($JSONString);
        } catch (Exception $e) {
            echo ("requestTemplatesAction fails " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function mainTemplatesAction()
    {
        $this->layout('layout/json');
        return $this->mainTemplates();
    }

    public function removeTemplateAction()
    {
        $this->layout('layout/json');
        return $this->removeTemplate();
    }

    public function mainPagesAction()
    {
        $this->layout('layout/json');
        return $this->mainPages();
    }

    public function requestPagesAction()
    {
        try {
            $this->layout('layout/json');
            $JSONString = $_SESSION["CurrentFile"]->oPages->getFilesJSON();
            header('Content-type: text/plain;charset=UTF-8');
            echo($JSONString);
        } catch (\Exception $e) {
            echo("requestPageAction fails: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function removePageAction()
    {
        try {
            $this->layout('layout/json');
            $FileNameId = $_POST["FileNameId"];
            $curFile = $_SESSION["CurrentFile"]->curOFileObj;
            $curCompleteFileName = $curFile->sFolder . $curFile->sFilename;
            //
            $curPage = $_SESSION["CurrentFile"]->oPages->aFiles[$FileNameId];
            $completeFileName = $curPage->sFolder . $curPage->sFilename;
            ;
            //
            if ($completeFileName == $curCompleteFileName)
            {
                throw new \Exception("\n\tThe file you are triying to modify is being edited right now!");
            }
            $_SESSION["CurrentFile"]->oPages->removePage($FileNameId);
            $_SESSION["CurrentFile"]->saveProjectIntoXML();
            echo('{}');
        } catch (\Exception $e) {
            echo ("removePage.php: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function requestXmlFilesAction()
    {
        try {
            $this->layout('layout/json');
            $JSONString = $_SESSION["CurrentFile"]->oXMLFiles->getFilesJSON();
            header('Content-type: text/plain;charset=UTF-8');
            echo($JSONString);
        } catch (\Exception $e) {
            echo ("requestXmlFiles fails: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function mainRelPageDataAction()
    {
        $this->layout('layout/json');
        return $this->mainRelPageData();
    }

    public function removeDataRelationAction()
    {
        try {
            $this->layout('layout/json');
            $FileNameId = $_POST["FileNameId"];
            $PageFileName = $_POST["PageFileName"];
            $currentPage = $_SESSION["CurrentFile"]->oPages->aFiles[$PageFileName];
            $currentPage->oDataFiles->removeDataRelation($FileNameId);
            $_SESSION["CurrentFile"]->saveProjectIntoXML();
            echo('{}');
        } catch (\Exception $e) {
            echo ("removeDataRelation fails:" . $e->getMessage() . "\n");
        }
        return true;
    }

    public function removeXmlFileAction()
    {
        try
	{
		$this->layout('layout/json');
		$FileNameId = $_POST["FileNameId"];

		$curFile = $_SESSION["CurrentFile"]->curOFileObj;
	        $curCompleteFileName = $curFile->sFolder.$curFile->sFilename;
        	//
	        $curPage = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId];
        	$completeFileName = $curPage->sFolder.$curPage->sFilename;;
	        //
        	if ($completeFileName==$curCompleteFileName)
	        {
        	        throw new \Exception ("\n\tThe file you are triying to modify is being edited right now!");
	        }

		$_SESSION["CurrentFile"]->removeXMLData($FileNameId);
		$_SESSION["CurrentFile"]->saveProjectIntoXML();
		echo ('{removed:"yes"}');
	}catch(\Exception $e)
	{
        	echo ("removeXMLFile fails: ".  $e->getMessage()."\n");
	}
	return true;
    }

    public function mainXmlFilesAction()
    {
        $this->layout('layout/json');
        return $this->mainXmlFiles();
    }
    public function saveXMLFileAction()
    {
	try
	{
                $this->layout('layout/json');
		$currentSession = $_SESSION["CurrentFile"];
		$FileContent= utf8_encode(file_get_contents( "php://input"));
		$FileContent= file_get_contents( "php://input");
		$bytes = $_SESSION["CurrentFile"]->saveXML2($FileContent);
		$_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
		$_SESSION["CurrentFile"]->saveProjectIntoXML();
		$fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
		echo $fileJSON;
	}catch(\Exception $e)
	{
		echo('saveXMLFileAction fails: '.  $e->getMessage(). '\n');
	}
	return true;
    }
    public function requestSourceCodeAction()
    {
	try
	{
                $this->layout('layout/json');
        	$currentSession = $_SESSION["CurrentFile"];
	        $mime = $currentSession->curOFileObj->sContentType;
        	$charset = $currentSession->curOFileObj->charSet;
        	$pattern = '/\w*$/';
 	        $matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
        	$fileType = strtoupper($matches[0]);
	        $curFileEncoding = $currentSession->curOFileObj->charSet;
        	//
	        header("Cache-Control: no-cache"); // HTTP/1.1
	        header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Datum in der Vergangenheit
        	header('Content-type: '.$mime.';charset='.$charset);
		echo file_get_contents($currentSession->currentURLFile);
	}catch(\Exception $e)
	{
        	echo('requestSourceCodeAction fails: '.  $e->getMessage(). '\n');
	}
	return true;
    }
    public function saveSourceCodeAction()
    {
         $this->layout('layout/json');
	 return $this->saveSourceCode();
    }
    public function saveHTMLDOMAction()
    {
        $this->layout('layout/json');
	return $this->saveHTMLDOM();
    }

    private function mainTemplates()
    {
        try {
            $FileNameId = $_POST["FileNameId"];
            $CurrentFileName = trim($_POST["FileName"]);
            $BaseURL = trim($_POST["BaseURL"]);
            $HTML_DTD = $_POST["basedHTMLDTD"];
            $unsetOldArray = false;
            $URLToImport = "";
            $UserName = trim($_POST["UserName"]);
            $Password = trim($_POST["Password"]);
            if ($FileNameId != "")
            {
                $adding = false;
                $modifying = true;
            } else
            {
                $adding = true;
                $modifying = false;
            }
            $pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\Ž\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
            preg_match_all($pattern, $CurrentFileName, $matches, PREG_SET_ORDER);
            $ArrLength = count($matches);
            if ($ArrLength == 0)
            {
                throw new \Exception("\n\tWrong File Name. File name: " . $CurrentFileName);
            }
            $CurrentFileName = $matches[0][1];
            if (($BaseURL == "") && ($HTML_DTD == ""))
            {
                throw new \Exception("\n\tEither the URL Base or the DTD must be set");
            }
            if ($BaseURL)
            {
                $URLToImport = $BaseURL;
            } else if ($HTML_DTD)
            {
                $URLToImport = WBit_URL . DTDs_FOLDER . $HTML_DTD;
            }

            $curFile = $_SESSION["CurrentFile"]->curOFileObj;
            $curCompleteFileName = $curFile->sFolder . $curFile->sFilename;
            $completeFileName = $_SESSION["CurrentFile"]->oTemplates->templatesFolder . "/" . $CurrentFileName;
            //
            if ($completeFileName == $curCompleteFileName)
            {
                throw new \Exception("\n\tThe file you are triying to modify is being edited right now!");
            }

            if ($adding)
            {
                $_SESSION["CurrentFile"]->oTemplates->addTemplate($CurrentFileName,
                        $URLToImport, $UserName, $Password);
            } else if ($modifying)
            {
                //check if this file name ist not used for any other template
                if ((isset($_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName])) && ($CurrentFileName != $FileNameId))
                {
                    throw new \Exception("\n\tThe file " . $CurrentFileName . " is already being used by another template.");
                }
                $oldTemplate = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId];
                $oldTemplateURL = $oldTemplate->sHttpPath . $oldTemplate->sFilename;
                //
                $_SESSION["CurrentFile"]->oTemplates->modifyTemplate($CurrentFileName,
                        $FileNameId, $URLToImport, $UserName, $Password);

                $curNewTemplate = $_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName];
                $newTemplateURL = $curNewTemplate->sHttpPath . $curNewTemplate->sFilename;
                $_SESSION["CurrentFile"]->oPages->setRelTemplateName($newTemplateURL,
                        $oldTemplateURL);
            }
            echo $_SESSION["CurrentFile"]->oTemplates->aFiles[$CurrentFileName]->getFileJSON();
        } catch (\Exception $e) {
            $postParams = $FileNameId . "," . $CurrentFileName . "," . $BaseURL . "," . WBit_URL . DTDs_FOLDER . $HTML_DTD . "," . $UserName . "," . $Password;
            echo ("\nmainTemplates fails:" . $e->getMessage() . ", posted Params: " . $postParams . "\n");
        }
        return true;
    }

    private function removeTemplate()
    {
        try {
            $FileNameId = $_POST["FileNameId"];
            $curFile = $_SESSION["CurrentFile"]->curOFileObj;
            $curCompleteFileName = $curFile->sFolder . $curFile->sFilename;
            $templateFileName = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sFilename;
            $templateFilePath = $_SESSION["CurrentFile"]->oTemplates->aFiles[$FileNameId]->sFolder;
            $completeName = $templateFilePath . $templateFileName;
            //
            if ($completeName == $curCompleteFileName)
            {
                throw new \Exception("\n\tThe file you are triying to modify is being edited right now!");
            }
            //$_SESSION["CurrentFile"]->oTemplates->removeTemplate($FileNameId);
            $_SESSION["CurrentFile"]->removeTemplate($FileNameId);
            $_SESSION["CurrentFile"]->saveProjectIntoXML();
            echo ('{rqstState:"OK"}');
        } catch (\Exception $e) {
            echo ("removeTemplate fails: " . $e->getMessage() . "\n");
        }
        return true;
    }

    private function mainPages()
    {

        try {
            $FileNameId = $_POST["FileNameId"];
            $CurrentFileName = trim($_POST["FileName"]);
            $URLTemplate = trim($_POST["URLTemplate"]);
            $folderName = $_POST["FolderName"];
            $folderName = ltrim($_POST["FolderName"]);
            $folderName = rtrim($_POST["FolderName"]);
            $aFolders = array();
            $unsetOldArray = false;
            $UserName = trim($_POST["UserName"]);
            $Password = $_POST["Password"];
            if ($FileNameId != "")
            {
                $adding = false;
                $modifying = true;
            } else
            {
                $adding = true;
                $modifying = false;
            }
            $pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\Ž\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
            preg_match_all($pattern, $CurrentFileName, $matches, PREG_SET_ORDER);
            $ArrLength = count($matches);
            if ($ArrLength == 0)
            {
                throw new \Exception("Wrong File Name. FileName:" . $CurrentFileName);
            }
            //check the folder
            $treatedFolderName = "";
            if ($folderName != "")
            {
                //check the folder sintax
                $aFolders = split('[/]', $folderName);
                $pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
                $aFoldersLength = count($aFolders);
                $counter = 0;
                foreach ($aFolders as $fKey => $fValue) {
                    $counter++;
                    if (preg_match($pattern, $fValue) == 1)
                    {
                        throw new \Exception('A folder or a File name can not contain any of the following characters: \/:*?"<> |');
                    }
                    if ($fValue)
                    {
                        $treatedFolderName .= $fValue . "/";
                    } elseif ($counter < $aFoldersLength)
                    {
                        throw new \Exception('The folder is wrong. A folder kan not be empty!');
                    }
                }
            }
            $folderName = $treatedFolderName;
            //echo $folderName;
            $CurrentFileName = $matches[0][1];
            if ($URLTemplate == "")
            {
                throw new \Exception("\n\tA page is alway based on a Template. Template must be set!");
            }

            $curFile = $_SESSION["CurrentFile"]->curOFileObj;
            $curCompleteFileName = $curFile->sFolder . $curFile->sFilename;
            $completeFileName = $folderName . $CurrentFileName;
            //
            if ($completeFileName == $curCompleteFileName)
            {
                throw new \Exception("\n\tThe file you are triying to modify is being edited right now!");
            }
            if ($adding)
            {
                $_SESSION["CurrentFile"]->oPages->addPage($CurrentFileName,
                        $folderName, $URLTemplate, $UserName, $Password);
            } else if ($modifying)
            {
                //if ($folderName.$CurrentFileName != $FileNameId)
                //{
                $_SESSION["CurrentFile"]->oPages->modifyPage($CurrentFileName,
                        $FileNameId, $folderName, $URLTemplate, $UserName,
                        $Password);
                //}
            }
            echo $_SESSION["CurrentFile"]->oPages->aFiles[$folderName . $CurrentFileName]->getFileJSON();
        } catch (\Exception $e) {
            echo ("\n\tmainPages.php: " . $e->getMessage() . "\n, input Params: folder: " . $folderName . ", file Name Id: " . $FileNameId . ", CurrentFileName: " . $CurrentFileName . ", URL Templates: " . $URLTemplate . ", User Name: " . $UserName . ", Password:" . $Password);
        }
        return true;
    }

    private function mainRelPageData()
    {
        try {
            $fileNameId = $_POST["FileNameId"];
            $CompleteFileName = trim($_POST["FileName"]); //always right, always an existing XML File.
            $pageFileName = $_POST["PageFileName"];
            $byDefault = strtoupper($_POST["byDefault"]);
            $index = trim($_POST["Index"]);
            $language = trim($_POST["Language"]);

            //modifiying o adding a new one?
            if ($fileNameId != "")
            {
                $adding = false;
                $modifying = true;
            } else
            {
                $adding = true;
                $modifying = false;
            }
            $pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\Ž\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
            preg_match_all($pattern, $CompleteFileName, $matches, PREG_SET_ORDER);
            $ArrLength = count($matches);
            if ($ArrLength == 0)
            {
                throw new \Exception('Wrong File Name');
            }
            $CurrentFileName = $matches[0][1];
            //folder with the XML Files of this projeckt
            $relXMLFile = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$CompleteFileName];
            $fileFolder = $relXMLFile->sFolder;
            $selectedPage = $_SESSION["CurrentFile"]->oPages->aFiles[$pageFileName];
            $dataFiles = $selectedPage->oDataFiles;
            //echo("index: ".$index.", CurrentFileName: ".$CurrentFileName.", FileNameId: ".$FileNameId.", language: ".$language.", byDefault:".$byDefault.", fileFolder:".$fileFolder);
            if ($adding)
            {
                $dataFiles->addDataFile($index, $CurrentFileName, $language,
                        $byDefault, $fileFolder);
            } else if ($modifying)
            {
                //delete the reference of the file but not the file
                //unset($dataFiles->aFiles[$index]);
                $dataFiles->modifyDataFile($index, $CurrentFileName,
                        $fileNameId, $language, $byDefault, $fileFolder);
            }
            echo $dataFiles->aFiles[$fileFolder . $CurrentFileName]->getFileJSON();
        } catch (\Exception $e) {
            echo ("mainRelPageData fails: " . $e->getMessage() . "\n");
        }
        return true;
    }

    public function mainXmlFiles()
    {
        try {
            $FileNameId = $_POST["FileNameId"];
            $CurrentFileName = trim($_POST["FileName"]);
            $BaseURL = trim($_POST["BaseURL"]);
            $UserName = trim($_POST["UserName"]);
            $Password = $_POST["Password"];
            $folderName = $_POST["folderName"];
            $folderName = ltrim($folderName);
            $folderName = rtrim($folderName);
            $aFolders = array();
            if ($FileNameId != "")
            {
                $adding = false;
                $modifying = true;
            } else
            {
                $adding = true;
                $modifying = false;
            }
            $pattern = '/([\^°\!§\$\%\&\{\}\=\+\#\'\Ž\-\.\;\,\w\s]+\.\w*$)/'; // Extracts the file name from a path
            preg_match_all($pattern, $CurrentFileName, $matches, PREG_SET_ORDER);
            $ArrLength = count($matches);
            if ($ArrLength == 0)
            {
                throw new \Exception('Wrong File Name');
            }
            //check the folder
            $treatedFolderName = "";
            if ($folderName != "")
            {
                //check the folder sintax
                $aFolders = split('[/]', $folderName);
                $pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
                $aFoldersLength = count($aFolders);
                $counter = 0;
                foreach ($aFolders as $fKey => $fValue) {
                    $counter++;
                    if (preg_match($pattern, $fValue) == 1)
                    {
                        throw new \Exception("\n\tA folder or a File name can not contain any of the following characters: \/:*?/\"<> |");
                    }
                    if ($fValue)
                    {
                        $treatedFolderName .= $fValue . "/";
                    } elseif ($counter < $aFoldersLength)
                    {
                        throw new \Exception("\n\tThe folder is wrong. A folder kan not be empty!");
                    }
                }
            }
            $folderName = $treatedFolderName;
            $CurrentFileName = $matches[0][1];

            $curFile = $_SESSION["CurrentFile"]->curOFileObj;
            $curCompleteFileName = $curFile->sFolder . $curFile->sFilename;
            $completeFileName = $folderName . $CurrentFileName;
            //
            if ($completeFileName == $curCompleteFileName)
            {
                throw new \Exception("\n\tThe file you are triying to modify is being edited right now!");
            }

            //if (($BaseURL=="")&&($HTML_DTD==""))
            if (($BaseURL == "") && ($CurrentFileName == ""))
            {
                throw new \Exception("\n\tEither the URL or the File Name must be set");
            }
            if ($adding)
            {
                $_SESSION["CurrentFile"]->oXMLFiles->addXMLFile($CurrentFileName,
                        $folderName, $BaseURL, $UserName, $Password);
            } else if ($modifying)
            {
                $path = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId]->sPath;
                $FileName = $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$FileNameId]->sFilename;
                $CompletFileName = $path . $FileName;
                if ($_SESSION["CurrentFile"]->oPages->existXMLData($CompletFileName))//referencial Integrity
                {
                    throw new \Exception('The XML File ' . $FileNameId . ' can not be replaced with the ' . $folderName . $CurrentFileName . ' because some pages belong to this file.');
                }
                $_SESSION["CurrentFile"]->oXMLFiles->modifyXMLFile($CurrentFileName,
                        $FileNameId, $folderName, $BaseURL, $UserName, $Password);
            }
            echo $_SESSION["CurrentFile"]->oXMLFiles->aFiles[$folderName . $CurrentFileName]->getFileJSON();
        } catch (\Exception $e) {
            echo ("mainXMLFiles.php: " . $e->getMessage() . "\n");
        }
        return true;
    }
    private function saveSourceCode()
    {
            try
        {

                $currentSession = $_SESSION["CurrentFile"];
                $FileContent= file_get_contents( "php://input");

                $pattern = '/\w*$/';
                $matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
                $fileType = strtoupper($matches[0]);
                $curFileEncoding = $currentSession->curOFileObj->charSet;
                //
                if ($fileType=="XML")
                {
                        preg_match( '@<\?xml.+encoding\s*="([^\s"]+)@si', $FileContent, $encoding );
                //	
                        if (isset($encoding))
                        {
                                $charSet = $encoding[1];
                        }
                        if (!(isset($charSet)))
                        {
                                $charSet = "UTF-8";
                        }
                        if ($charSet=="UTF-8")
                        {
                                //$FileContent= utf8_encode($FileContent);
                        }else{
                                $FileContent= utf8_decode($FileContent);
                        }
                //$FileContent= utf8_encode($FileContent);
                        $bytes = $_SESSION["CurrentFile"]->saveXMLFromString($FileContent,$charSet);
                }else if ($fileType == "HTML")
                {
                        preg_match( '@<meta.+http-equiv\s*=\s*"(Content-Type)".*>?@i',$FileContent, $httpEquiv );
                        if (isset($httpEquiv))
                        {
                                preg_match( '@content\s*=\s*"([\w/]+)(;\s+charset=([^\s"]+))?@i',$httpEquiv[0], $contentType );
                        }
                        if (isset($contentType))
                        {
                                $charSet = $contentType[3];
                        }
                        if (!(isset($charSet)))
                        {
                                $charSet = "UTF-8";
                        }
                        if ($charSet == "UTF-8")
                        {
                        }else
                        {
                                //$FileContent= utf8_decode($FileContent);
                        }
                        if ($charSet != "UTF-8")
                        {
                                //$FileContent= utf8_decode(file_get_contents( "php://input"));
                        }
                        $Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($FileContent);
                }else{
                         throw new \Exception  ('saveSourceCode.php->file not recongnized. file type: '.$this->curOFileObj->sContentType.'\n');
                }
                //$Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($FileContent);
                $_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
                $_SESSION["CurrentFile"]->saveProjectIntoXML();
                $fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
                echo $fileJSON;
        }catch(\Exception $e)
        {
                echo('saveSourceCode fails: '.  $e->getMessage(). '\n');
        }
        return true;
    }
    private function saveHTMLDOM()
    {
        try
        {
                $currentSession = $_SESSION["CurrentFile"];
                //
                $FileContent= file_get_contents( "php://input");
                if ($currentSession->curOFileObj->charSet != "UTF-8")
                {

                }else
                {

                }
                $FileContent = preg_replace("/&amp;/","&",$FileContent);
                $FileContent = preg_replace("/&lt;/","<",$FileContent);
                $FileContent = preg_replace("/&gt;/",">",$FileContent);
                //
                $pattern = '/\w*$/';
                $matchesCount = preg_match($pattern,$_SESSION["CurrentFile"]->curOFileObj->sContentType, $matches);
                $fileType = strtoupper($matches[0]);
                //
                //if ($fileType=="XML")
                //{
                //	$Bytes = $_SESSION["CurrentFile"]->saveXML2($FileContent);
                //}else
                //{
                        $Bytes = $_SESSION["CurrentFile"]->saveHTML2($FileContent);
                //}
                if ($Bytes>0)
                {
                        $_SESSION["CurrentFile"]->curOFileObj->setParserContentType();
                        $_SESSION["CurrentFile"]->saveProjectIntoXML();
                        $fileJSON =$_SESSION["CurrentFile"]->curOFileObj->getFileJSON();
                        echo $fileJSON;
                }else
                {
                         throw new \Exception  ("document could not be stored!");
                }
        }catch(\Exception $e)
        {
                echo('saveDOM fails: '.  $e->getMessage(). '\n');
        }
        return true;
    }
}
