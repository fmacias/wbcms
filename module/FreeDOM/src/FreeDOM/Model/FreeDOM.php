<?php

/**
 * Free-D.O.M
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 *
 * @category   Free-D.O.M
 * @copyright  Copyright (c) 2009-2013, Fernando Macias Ruano, www.wunderbit.com < fmaciasruano@gmail.com > .
 * @license    http://www.wunderbit.com/license     New BSD License
 */

namespace FreeDOM\Model;

class FreeDOM extends Project
{

    /**
     * Current FileName
     * @var string
     */
    public $currentFile = '';

    /**
     * Current URL+FileName
     * @var string
     */
    public $currentURLFile = '';

    /**
     * Current File System+FileName
     * @var string
     */
    public $currentFSFile = '';

    /**
     *
     * @var type 
     */
    public $currentFileExtension = '';

    /**
     *
     * @var type 
     */
    public $ContentType = '';

    /**
     *
     * @var type 
     */
    public $MimeType = '';

    /**
     *
     * @var type 
     */
    public $charSet = '';

    /**
     *
     * @var type 
     */
    public $curOFileObj = NULL;

    /**
     * @todo controller operation
     */
    public function openProjectsForm()
    {
        header('Location: projects.php');
    }

    /**
     * 
     * @param type $PostProjecktFileName
     * @throws Exception
     */
    public function loadProjectFile($PostProjecktFileName)
    {
        try {
            if ($PostProjecktFileName)
            {
                parent::loadProject($PostProjecktFileName["ProjecktFileName"]);
            }
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->loadProjectFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $ProjectName
     * @throws Exception
     */
    public function createProject($ProjectName)
    {
        try {
            if ($ProjectName)
            {
                parent::createNewProject($ProjectName);
            }
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->createProject: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $oFile
     * @throws Exception
     */
    public function setCurrent($oFile)
    {
        try {
            $this->currentFile = $oFile->sFilename;
            $this->currentURLFile = $oFile->sHttpPath . $oFile->sFilename;
            $this->currentFSFile = $oFile->sPath . $oFile->sFilename;
            $this->ContentType = $oFile->sContentType;
            $this->currentFileExtension = $oFile->fileExtension;
            $this->MimeType = $oFile->MimeType;
            $this->charSet = $oFile->charSet;
            $this->curOFileObj = $oFile;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->setCurrent: ' . $e->getMessage() . '\n');
        }
    }

    public function getAbsoluteFileName()
    {
        $absolutFileName = sprintf(
                '%s%s%s', FILESYSTEM_PATH, $this->curOFileObj->sPath,
                $this->curOFileObj->sFilename
        );
        return $absolutFileName;
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getCurrentFileInfoJSON()
    {
        try {
            $JSON = "{FileName:\"$this->currentURLFile\",ContentType:\"$this->ContentType\"}";
            return $JSON;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->getCurrentFileInfoJSON: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $XHTMLCode_in
     * @return type
     * @throws Exception
     */
    public function saveCurrentFile($XHTMLCode_in)
    {
        try {
            if ($this->ContentType == "text/html")
            {
                return $this->saveHTML($XHTMLCode_in);
            } else
            {
                return $this->saveXML($XHTMLCode_in);
            }
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveCurrentFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $HTMLCode_in
     * @return type
     * @throws Exception
     */
    protected function saveHTML($HTMLCode_in)
    {
        try {
            $strDocumentElement = $HTMLCode_in;
            $selfDOM = new \DOMDocument();
            $selfDOM->loadHTMLFile($this->currentURLFile);
            $DocTypePublicId = $selfDOM->doctype->publicId;
            $DocTypeSystemId = $selfDOM->doctype->systemId;
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
            $HTMLDOMStr = $DocType . $strDocumentElement;
//
            $newHTMLTemp = new \DOMDocument();
            $newHTMLTemp->loadHTML($newHTMLTemp);

            $newnode = $selfDOM->importNode($newHTMLTemp->documentElement);
            $removedChild = $selfDOM->removeChild($selfDOM->documentElement);
            $appendChild = $selfDOM->appendChild($newnode);
            $Bytes = $selfDOM->save($this->currentFSFile);
            unset($selfDOM);
            unset($newHTMLTemp);
            return $Bytes;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveCurrentFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $XMLCode_in
     * @return type
     * @throws Exception
     */
    protected function saveXML($XMLCode_in)
    {
        try {
            $newDOM = new \DOMDocument();
            $newDOM->loadXML($XMLCode_in);
            $selfDOM = new \DOMDocument();
            $selfDOM->load($this->currentURLFile);
            $newnode = $selfDOM->importNode($newDOM->firstChild, true);
            $removedChild = $selfDOM->removeChild($selfDOM->documentElement);
            $appendChild = $selfDOM->appendChild($newnode);
            $Bytes = $selfDOM->save($_SESSION["RQSTFiles"]->currentFSFile);
            return $Bytes;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveXML: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return string
     * @throws Exception
     */
    public function getDocumentTypeString()
    {
        try {
            $DocTypePublicId = null;
            $DocTypeSystemId = null;
            $DocTypeName = null;
            $DocTypeInternalSubset = null;
            $DocType = null;
//error_reporting(0);
            $selfDOM = new \DOMDocument();
            if (($this->ContentType == "application/xhtml+xml") || ($this->ContentType == "application/xml"))
            {
                $selfDOM->load($this->currentFSFile);
            } else if (($this->ContentType == "text/html"))
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
                    $DocType .='[' . $DocTypeInternalSubset . ']';
                }
                $DocType .= ">";
            }
            unset($selfDOM);
            return $DocType;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->getDocumentTypeString: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getSourceCode()
    {
        try {
            $sourceCode = file_get_contents($this->currentFSFile);
            return $sourceCode;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->getSourceCode: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $DOMString
     * @return type
     * @throws Exception
     */
    public function saveXML2($DOMString)
    {
        try {
//
            $selfDOM = new \DOMDocument();
//
            $bytes = 0;
            $newDOM = new \DOMDocument("1.0", $this->curOFileObj->charSet);
            $selfDOM->load(FILESYSTEM_PATH . $this->currentFSFile);
            $newDOM->loadXML($DOMString);
            $curDocElement = $newDOM->documentElement;
            $newElement = $selfDOM->importNode($curDocElement, true);
            $replacedChild = $selfDOM->replaceChild($newElement,
                    $selfDOM->documentElement);
            $Bytes = $selfDOM->save($this->currentFSFile);
            unset($selfDOM);
            unset($newDOM);
            return $Bytes;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveCurrentDocument() fails ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return string
     */
    public function getHTMLWorkingFile()
    {
        $charSet = $this->curOFileObj->charSet;
        $fileContent = "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">";
        $fileContent .= "<html>";
        $fileContent .= "<head>";
        $fileContent .= "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=$charSet\">";
        $fileContent .= "<title>Insert title here</title>";
        $fileContent .= "</head>";
        $fileContent .= "<body>";
        $fileContent .= " </body>";
        $fileContent .= "</html>";
//
        $fileURL = WBit_URL . APP_FOLDER . "HTMLTransitional.html";
        $fileSystem = FILESYSTEM_PATH . APP_FOLDER . "HTMLTransitional.html";
//
        $newDOM = new \DOMDocument();
        $newDOM->loadHTML($fileContent);
        $bytes = $newDOM->save($fileSystem);
        return $fileURL;
    }

    /**
     * 
     * @param type $DOMString
     * @param type $encoding
     * @return type
     * @throws Exception
     */
    public function saveXMLFromString($DOMString, $encoding)
    {
        try {
            $bytes = 0;
            $newDOM = new \DOMDocument("1.0", $encoding);
            $newDOM->loadXML($DOMString);
            $Bytes = $newDOM->save($this->currentFSFile);
            unset($newDOM);
            return $Bytes;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveXMLFromString() fails ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return string
     */
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
        $fileURL = WBit_URL . APP_FOLDER . "XHTMLTransitional.html";
        $fileSystem = FILESYSTEM_PATH . APP_FOLDER . "XHTMLTransitional.html";
//
        $newDOM = new \DOMDocument();
        $newDOM->loadHTML($fileContent);
        $bytes = $newDOM->save($fileSystem);
        return $fileURL;
//return $fileURL;
    }

    /**
     * 
     * @param type $HTMLCode_in
     * @return type
     * @throws Exception
     */
    public function saveHTML2($HTMLCode_in)
    {
        try {
//load current DOM
            $bytes = 0;
            $parserMimeType = $this->curOFileObj->ParserMimeType;
            $PI = "";
            if (($parserMimeType == "application/xhtml+xml"))
            {
                $curCharSet = $this->curOFileObj->charSet;
                $PI = "<?xml version=\"1.0\" encoding=\"$curCharSet\"?>";
            }
            $Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($PI . "\n" . $HTMLCode_in);
            return $Bytes;
        } catch (\Exception $e) {
            throw new \Exception('CurrentFile->saveHTML2: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $HTMLCode_in
     * @return type
     * @throws Exception
     */
    public function saveHTMLXHTML($HTMLCode_in)
    {
        $pattern = '/\w*$/';
        $matchesCount = preg_match($pattern, $this->curOFileObj->sContentType,
                $matches);
        $fileType = strtoupper($matches[0]);
//
        $parserMimeType = $this->curOFileObj->ParserMimeType;
        $contentType = $this->curOFileObj->sContentType;
//
        $Bytes = 0;
//
        if ($parserMimeType == "application/xhtml+xml")
        {
            $selfDOM = new \DOMDocument();
            $selfLoaded = $selfDOM->load($this->currentFSFile);
            $loaded = false;
            if ($selfLoaded)
            {
                if ($selfLoaded->encoding == "")
                {
                    $PI_ = $selfDOM->createProcessingInstruction('xml',
                            'version="1.0" encoding="UTF-8"');
                    $selfDOM->appendChild($PI_);
                }
                $newDOM = new \DOMDocument("1.0", $this->curOFileObj->charSet);
                $loaded = $newDOM->loadXML($HTMLCode_in);
                if ($loaded)
                {
                    if ($newDOM->encoding == "")
                    {
                        $PI = $newDOM->createProcessingInstruction('xml',
                                'version="1.0" encoding="UTF-8"');
                        $newDOM->appendChild($PI);
                    }
                    $newElement = $selfDOM->importNode($newDOM->documentElement,
                            true);
                    $replacedChild = $selfDOM->replaceChild($newElement,
                            $selfDOM->documentElement);
//$appendedChild = $selfDOM->appendChild($newElement);
                    $Bytes = $selfDOM->save($this->currentFSFile);
                }
            }
            if ($loaded == false)
            {
                unset($newDOM);
                unset($selfDOM);
                $newDOM = new \DOMDocument("1.0", $this->curOFileObj->charSet);
                $loaded = $newDOM->loadXML($HTMLCode_in);
                $Bytes = $newDOM->save($this->currentFSFile);
            }
        } else if ($parserMimeType == "text/html")
        {
            $Bytes = $_SESSION["CurrentFile"]->curOFileObj->file_put_contents($HTMLCode_in);
        } else
        {
            throw new \Exception("content Type: " . $contentType . " not supported! \n");
        }
        return $Bytes;
    }

    public function redirect($url)
    {
        header('Location: ' . $url);
    }

}
