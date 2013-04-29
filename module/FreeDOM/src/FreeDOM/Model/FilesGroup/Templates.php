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
namespace FreeDOM\Model\FilesGroup;

use FreeDOM\Model\File;

class Templates extends FilesGroup
{

    public $templatesFolder = NULL;

    /**
     * 
     * @param type $sProjektFolder
     * @throws Exception
     */
    function __construct($sProjektFolder)
    {
        try {
            $this->templatesFolder = PROJEKTS_FOLDER . $sProjektFolder . "/" . "Templates";
        } catch (\Exception $e) {
            throw new \Exception("\n\tTemplates->__construct: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getDOMNode()
    {
        try {
            $aFiles = $this->aFiles;
            $newDOM = new \DOMDocument();
            $Templates = $newDOM->createElement("Templates");
            foreach ($aFiles as $Index => $Value) {
                $FileName = $newDOM->createElement("FileName");
                $FileName->nodeValue = $Value->sFilename;
                $FileName->setAttribute("BaseURL", $Value->BaseURL);
                //
                $FileName->setAttribute("Path", $Value->sPath);
                $FileName->setAttribute("URL",
                        $Value->sHttpPath . $Value->sFilename);
                $FileName->setAttribute("FileExtension", $Value->fileExtension);
                $FileName->setAttribute("Folder", $Value->sFolder);
                $FileName->setAttribute("ContentType", $Value->sContentType);
                $FileName->setAttribute("ParserMime", $Value->ParserMimeType);
                $FileName->setAttribute("charSet", $Value->charSet);
                //
                $AppendedFile = $Templates->appendChild($FileName);
            }
            return($Templates);
        } catch (\Exception $e) {
            throw new \Exception("\n\tTemplates->getDOMNode: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $sFileNameIn
     * @param type $sBaseURL
     * @param null $UserId
     * @param null $Password
     * @throws Exception
     */
    public function addTemplate($sFileNameIn, $sBaseURL, $UserId, $Password)
    {//&& UserId, and Password
        try {
            if (!(isset($UserId)))
                $UserId = NULL;
            if (!(isset($Password)))
                $Password = NULL;
            if (!(isset($this->aFiles[$sFileNameIn])))
            {
                $currentTemplate = new File\Template($sFileNameIn, $sBaseURL,
                        $this->templatesFolder); //&& UserId, and Password
                $currentTemplate->createFileFormURL($sBaseURL, $UserId,
                        $Password);
                $this->aFiles[$sFileNameIn] = $currentTemplate;
                //return true;
            } else
            {
                throw new Exception("\n\tTemplates->addTemplate: Template could not be added because the file !" . $this->aFiles[$sFileNameIn]->sHttpPath . $this->aFiles[$sFileNameIn]->sFilename . " exists!\n");
            }
            //return false;
        } catch (\Exception $e) {
            if (isset($this->aFiles[$sFileNameIn]))
            {
                //$this->remove($sFileNameIn);
            }
            throw new \Exception("\n\tTemplates->addTemplate: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $NewFileName
     * @param type $OldFileName
     * @param type $URLToImport
     * @param type $UserName
     * @param type $Password
     * @throws Exception
     */
    public function modifyTemplate($NewFileName, $OldFileName, $URLToImport,
            $UserName, $Password)
    {//&& UserId, and Password
        try {
            //if is modificating this instance and for this fileName
            if ((isset($this->aFiles[$NewFileName])) && ($NewFileName == $OldFileName))
            {
                //if the file exists, just import the url and set the BaseURL
                $this->aFiles[$NewFileName]->createFileFormURL($URLToImport,
                        $UserName, $Password);
                $this->aFiles[$NewFileName]->BaseURL = $URLToImport;
            } else
            {
                //if not , create a new Template Object. The object will created if the file does not exists. To control relational integrity.
                $this->addTemplate($NewFileName, $URLToImport, $UserName,
                        $Password);
                //if an error wont continue.
                //delete the old instance.
                $this->removeTemplate($OldFileName);
            }
        } catch (\Exception $e) {
            throw new \Exception("\n\tTemplates->addTemplate: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $folder
     * @throws Exception
     */
    public function setTemplatesFolder($folder)
    {
        try {
            $this->templatesFolder = $folder;
        } catch (\Exception $e) {
            throw new \Exception("\n\tTemplates->setTemplatesFolder: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $fileNameIndex
     * @throws Exception
     */
    public function removeTemplate($fileNameIndex)
    {
        try {
            $this->remove($fileNameIndex);
        } catch (\Exception $e) {
            throw new \Exception("\n\tTemplates->removeTemplate: " . $e->getMessage() . "\n");
        }
    }

}
