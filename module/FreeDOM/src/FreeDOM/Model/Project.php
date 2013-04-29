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

use FreeDOM\Model\FilesGroup;
use FreeDOM\Model\File;

class Project
{

    public $sXMLFileName = NULL;
    public $sProjektFolder = NULL;
    public $sName = NULL;
    public $oTemplates = NULL;
    public $oPages = NULL;
    public $oXMLFiles = NULL;

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getProjektXMLFile()
    {
        try {

            return $this->sXMLFileName;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getProjektXMLFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getProjektName()
    {
        try {

            return $this->sName;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getProjektName: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $ProjecktFolder
     * @throws Exception
     */
    public function setProjectFolder($ProjecktFolder)
    {
        try {

            if (mkdir(PROJEKTS_PATH . $ProjecktFolder))
            {
                $this->sProjektFolder = $ProjecktFolder;

                if (!(mkdir(PROJEKTS_PATH . $ProjecktFolder . "/" . "Templates")))
                {

                    throw new \Exception(
                    'mkdir fails. Templates Folder Could not be created. 
                        Folder: ' . PROJEKTS_PATH . $ProjecktFolder . '/Templates\n'
                    );
                    //return false;
                }
            } else
            {
                throw new \Exception(
                'mkdir fails. ProjectFolder Folder Could not be 
                    created. Folder: ' .
                PROJEKTS_PATH . $ProjecktFolder . '\n');
            }
        } catch (\Exception $e) {

            throw new \Exception('projeckt->setProjectFolder: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sProjeckName
     * @return boolean
     * @throws Exception
     */
    public function createNewProject($sProjeckName)
    {
        try {
            $this->sName = $sProjeckName;
            $this->sXMLFileName = $sProjeckName . ".xml";
            $this->oTemplates = new FilesGroup\Templates($this->sProjektFolder);
            $this->oPages = new FilesGroup\Pages();
            $this->oXMLFiles = new FilesGroup\XMLFiles();
            $this->saveProjectIntoXML();
            return true;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->createNewProject: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sProjecktFileName
     * @return boolean
     * @throws Exception
     */
    public function loadProject($sProjecktFileName)
    {
        try {

            if ($sProjecktFileName)
            {

                ## //from select project form
                if ($this->loadFromXML(PROJEKTS_PATH . $sProjecktFileName))
                {
                    $this->sXMLFileName = $sProjecktFileName;
                    return true;
                } else
                {
                    return false;
                }
            }
        } catch (\Exception $e) {
            throw new \Exception('projeckt->loadProject fails: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function saveProjectIntoXML()
    {
        try {
            $newDOM = new \DOMDocument('1.0', 'iso-8859-1');
            $xslt = $newDOM->createProcessingInstruction(
                    'xml-stylesheet', 'type="text/xsl" href="xml/xmltree.xsl"'
            );
            $newDOM->appendChild($xslt);
            $root = $newDOM->createElement("Projeckt");
            $root->setAttribute("Name", $this->sName);
            $root->setAttribute("Folder", $this->sProjektFolder);
            $templates = $this->oTemplates->getDOMNode();
            $templates = $newDOM->importNode($templates, true);
            $Pages = $this->oPages->getDOMNode();
            $Pages = $newDOM->importNode($Pages, true);
            $XMLFiles = $this->oXMLFiles->getDOMNode();
            $XMLFiles = $newDOM->importNode($XMLFiles, true);
            $appendedChild = $root->appendChild($templates);
            $appendedChild = $root->appendChild($Pages);
            $appendedChild = $root->appendChild($XMLFiles);
            $appendedChild = $newDOM->appendChild($root);

            if ($newDOM->save(PROJEKTS_PATH . $this->sXMLFileName))
            {
                unset($newDOM);
            } else
            {

                unset($newDOM);
                $error = 'DOMDocument->save() fails! file:' . PROJEKTS_PATH . $this->sXMLFileName . '\n';
                throw new \Exception($error);
            }
        } catch (\Exception $e) {
            throw new \Exception('projeckt->saveProjectIntoXML: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $xmlFileNameIn
     * @return boolean
     * @throws Exception
     */
    public function loadFromXML($xmlFileNameIn)
    {
        try {

            $currentDOM = new \DOMDocument();

            if ($currentDOM->load($xmlFileNameIn) != 1)
            {
                unset($currentDOM);
                throw new \Exception("DOMDocument->load(" . $xmlFileNameIn . ") fails!");
            }
            $documentElement = $currentDOM->documentElement;

            if ($documentElement->nodeName != "Projeckt")
            {
                unset($currentDOM);
                throw new \Exception('DOMDocument->documentElement->nodeName ist not a <Projekt> element!');
            }
            $sCurrentName = $documentElement->getAttribute("Name");

            if ($sCurrentName == "")
            {
                unset($currentDOM);
                throw new \Exception(
                'Root element <projekt> has not related attribute [name]. 
                        This project hast not a name.  Name Obligatory!\n'
                );
            }
            $sCurrentFolder = $documentElement->getAttribute("Folder");

            if ($sCurrentFolder == "")
            {
                unset($currentDOM);
                throw new \Exception(
                'Root element <projekt> has not related attribute [Folder]. 
                        This project hast not a Folder.  Folder Obligatory!\n'
                );
            }
            $this->sProjektFolder = $sCurrentFolder;
            $currentChildNodes = $documentElement->childNodes;

            if ($currentChildNodes->length != 3)
            {
                unset($currentDOM);
                throw new \Exception(
                '<Projeckt> element requires the element <Templates>,
                        <Pages> and <XMLFiles> respectibelly. Althougth empty\n'
                );
            }

            $templatesNode = $currentChildNodes->item(0);
            $pagesNode = $currentChildNodes->item(1);
            $XMLFilesNode = $currentChildNodes->item(2);

            if ($templatesNode->nodeName != "Templates")
            {
                unset($currentDOM);
                throw new \Exception('<templates> element must exist, althought without childNodes\n');
            }

            $this->oTemplates = new FilesGroup\Templates($this->sProjektFolder);

            if ($pagesNode->nodeName != "Pages")
            {
                unset($currentDOM);
                throw new \Exception('<pages> element must exist, althought without elements\n');
            }
            $this->oPages = new FilesGroup\Pages();

            if ($XMLFilesNode->nodeName != "XMLFiles")
            {
                unset($currentDOM);
                throw new \Exception('<XMLFiles> element must exist, althought without elements\n');
            }
            $this->oXMLFiles = new FilesGroup\XMLFiles($this->sProjektFolder);
            $this->sName = $sCurrentName;

            if ($this->SetoTemplates($templatesNode) == false)
            {
                unset($currentDOM);
                throw new \Exception('SetoTemplates() function fails!\n');
            }

            if ($this->SetoPages($pagesNode) == false)
            {
                unset($currentDOM);
                throw new \Exception('SetoPages() function fails!\n');
            }

            if ($this->SetoXMLFiles($XMLFilesNode) == false)
            {
                unset($currentDOM);
                throw new \Exception('SetoXMLFiles() function fails!\n');
            }
            unset($currentDOM);
            return true;
        } catch (\Exception $e) {

            return false;
        }
    }

    /**
     * 
     * @param type $DOMNodeTemplates
     * @return boolean
     * @throws Exception
     */
    protected function SetoTemplates($DOMNodeTemplates)
    {
        try {

            $CurrentChildNodes = $DOMNodeTemplates->childNodes;

            if ($CurrentChildNodes->length == 0)
            {
                ## no templates defined
                ## is not an error, a template is not required
                return true;
            }

            for ($x = 0; $x < $CurrentChildNodes->length; $x++) {

                if ($CurrentChildNodes->item($x)->nodeName != "FileName")
                {

                    ## error the name of the element must be FileName
                    throw new \Exception('The name of the element must be FileName');
                }
                $CurFileName = $CurrentChildNodes->item($x)->nodeValue;
                $CurBaseURL = $CurrentChildNodes->item($x)->getAttribute("BaseURL");
                $CurPath = $CurrentChildNodes->item($x)->getAttribute("Path");
                $CurURL = $CurrentChildNodes->item($x)->getAttribute("URL");
                $CurExtension = $CurrentChildNodes->item($x)->getAttribute("FileExtension");
                $CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
                $CurContentType = $CurrentChildNodes->item($x)->getAttribute("ContentType");
                $CurMime = $CurrentChildNodes->item($x)->getAttribute("ParserMime");
                $CurCharSet = $CurrentChildNodes->item($x)->getAttribute("charSet");
                $templatesFolder = $this->oTemplates->templatesFolder;
                $currentTemplate = new File\Template($CurFileName, $CurBaseURL,
                        $templatesFolder);
                $currentTemplate->sPath = $CurPath;
                $currentTemplate->sHttpPath = URL_PATH . $CurFolder;
                $currentTemplate->fileExtension = $CurExtension;
                $currentTemplate->sFolder = $CurFolder;
                $currentTemplate->sContentType = $CurContentType;
                $currentTemplate->ParserMimeType = $CurMime;
                $currentTemplate->charSet = $CurCharSet;
                $this->oTemplates->addExplicit($currentTemplate, $CurFileName);
            }
            return true;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->SetoTemplates: ' . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $DOMNodePages
     * @return boolean
     * @throws Exception
     */
    protected function SetoPages($DOMNodePages)
    {
        try {
            $CurrentChildNodes = $DOMNodePages->childNodes;

            if ($CurrentChildNodes->length == 0)
            {

                ## no <page> element defined
                ## is not an error, a page is not required
                return true; //is not an error, a page is not required
            }
            ##for each page element
            for ($y = 0; $y < $CurrentChildNodes->length; $y++) {
                //page Elements
                $nodePage = $CurrentChildNodes->item($y)->childNodes;

                if ($nodePage->length == 0)
                {

                    throw new \Exception("Node page can't be empty");
                }

                if ($nodePage->length > 3)
                {

                    throw new \Exception(
                    "Only 3 Elements belong to the page Element. 
                    FileName , TemplateFileName and Data"
                    );
                }
                if (
                        ($nodePage->length == 1) &&
                        ($nodePage->item(0) != "FileName")
                )
                {

                    throw new \Exception("Node FileName is the obligaroty Element");
                }
                $nodeDataIndex = NULL;
                $sTemplateFileName = "";

                if ($nodePage->length == 3)
                {

                    if ($nodePage->item(0))
                    {

                        if ($nodePage->item(0)->nodeName != "FileName")
                        {

                            throw new \Exception("The first Element must be the element <FileName>");
                        }
                    }

                    if ($nodePage->item(1))
                    {

                        if ($nodePage->item(1)->nodeName != "TemplateFileName")
                        {

                            throw new \Exception(
                            "The second Element can not be diferent than <TemplateFileName>"
                            );
                        } else
                        {
                            //
                            $sTemplateFileName = $nodePage->item(1)->nodeValue;
                        }
                    }

                    if ($nodePage->item(2))
                    {

                        if ($nodePage->item(2)->nodeName != "Data")
                        {

                            throw new \Exception("The third Element can not be diferent than <Data>");
                        }

                        $nodeDataIndex = 2;
                    }
                } else if ($nodePage->length == 2)
                {

                    if ($nodePage->item(0))
                    {

                        if ($nodePage->item(0)->nodeName != "FileName")
                        {

                            throw new \Exception("The first Element can not be diferent than <FileName>");
                        }
                    }
                    if ($nodePage->item(1))
                    {

                        if (
                                ($nodePage->item(1)->nodeName != "Data") &&
                                ($nodePage->item(1)->nodeName != "TemplateFileName")
                        )
                        {
                            throw new Exception("The second Element can either be diferent than <FileName> and <TemplateFileName>");
                        }

                        if ($nodePage->item(1)->nodeName == "Data")
                        {
                            $nodeDataIndex = 1;
                        }
                    }
                }
                $pageFolder = $CurrentChildNodes->item($y)->getAttribute("Folder");
                $nodeFileName = $nodePage->item(0)->nodeValue;
                $CurPath = $nodePage->item(0)->getAttribute("Path");
                $CurURL = $nodePage->item(0)->getAttribute("URL");
                $CurExtension = $nodePage->item(0)->getAttribute("FileExtension");
                $CurFolder = $nodePage->item(0)->getAttribute("Folder");
                $CurContentType = $nodePage->item(0)->getAttribute("ContentType");
                $CurMime = $nodePage->item(0)->getAttribute("ParserMime");
                $CurCharSet = $nodePage->item(0)->getAttribute("charSet");
                $CurrentPage = new File\Page($nodeFileName, $pageFolder);
                $CurrentPage->sPath = $CurPath;
                $CurrentPage->sHttpPath = URL_PATH . $CurFolder;
                $CurrentPage->fileExtension = $CurExtension;
                $CurrentPage->sFolder = $CurFolder;
                $CurrentPage->sContentType = $CurContentType;
                $CurrentPage->ParserMimeType = $CurMime;
                $CurrentPage->charSet = $CurCharSet;
                //
                $this->oPages->addExplicit($CurrentPage,
                        $pageFolder . $nodeFileName);
                $PageObjDataFiles = $this->oPages->aFiles[$pageFolder . $nodeFileName]->oDataFiles;
                $this->oPages->aFiles[$pageFolder . $nodeFileName]->sTemplateFileName = $sTemplateFileName;

                if (!(is_null($nodeDataIndex)))
                {//always
                    $nodeData = $nodePage->item($nodeDataIndex);
                    $dataElements = $nodeData->childNodes;
                    $aFileNames[] = array();

                    for ($x = 0; $x < $dataElements->length; $x++) {

                        $sNodeFileName = $dataElements->item($x);

                        if ($sNodeFileName->nodeName != "FileName")
                        {
                            ## the name of each node belongs to Data element must be <FileName>
                            throw new \Exception(
                            "The name of each node which belongs to Data element 
                            must be <FileName> nodeName is <" .
                            $sNodeFileName->nodeName . ">"
                            );
                        }
                        $sCurDataFileName = $sNodeFileName->nodeValue;

                        $sCurDataFileId = $nodeData->getAttribute("Id");
                        $sCurDataLang = $nodeData->getAttribute("Lang");
                        $sCurDefault = $nodeData->getAttribute("Default");
                        //
                        $CurPath = $sNodeFileName->getAttribute("Path");
                        $CurURL = $sNodeFileName->getAttribute("URL");
                        $CurExtension = $sNodeFileName->getAttribute("FileExtension");
                        $CurFolder = $sNodeFileName->getAttribute("Folder");
                        $CurContentType = $sNodeFileName->getAttribute("ContentType");
                        $CurMime = $sNodeFileName->getAttribute("ParserMime");
                        $CurCharSet = $sNodeFileName->getAttribute("charSet");
                        //
                        $currentDataFile = new File\DataFile(
                                $sCurDataFileId, $sCurDataLang,
                                $sCurDataFileName, $sCurDefault, $CurFolder
                        );
                        //
                        $currentDataFile->sPath = $CurPath;
                        $currentDataFile->sHttpPath = URL_PATH . $CurFolder;
                        $currentDataFile->fileExtension = $CurExtension;
                        $currentDataFile->sFolder = $CurFolder;
                        $currentDataFile->sContentType = $CurContentType;
                        $currentDataFile->ParserMimeType = $CurMime;
                        $currentDataFile->charSet = $CurCharSet;
                        //
                        $PageObjDataFiles->addExplicit($currentDataFile,
                                $CurFolder . $sCurDataFileName);
                    }
                }
            }
            //end for each page Element
            return true;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->SetoPages: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $DOMNodeXMLFiles
     * @return boolean
     * @throws Exception
     */
    public function SetoXMLFiles($DOMNodeXMLFiles)
    {
        try {
            $CurrentChildNodes = $DOMNodeXMLFiles->childNodes;

            if ($CurrentChildNodes->length == 0)
            {
                ## no XMLfile defined
                ## is not an error, a template is not required
                return true;
            }

            for ($x = 0; $x < $CurrentChildNodes->length; $x++) {

                if ($CurrentChildNodes->item($x)->nodeName != "FileName")
                {
                    throw new \Exception("The name of the element must be FileName\n");
                }
                $CurFileName = $CurrentChildNodes->item($x)->nodeValue;
                $CurBaseURL = $CurrentChildNodes->item($x)->getAttribute("BaseURL");
                $CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
                $CurPath = $CurrentChildNodes->item($x)->getAttribute("Path");
                $CurURL = $CurrentChildNodes->item($x)->getAttribute("URL");
                $CurExtension = $CurrentChildNodes->item($x)->getAttribute("FileExtension");
                $CurFolder = $CurrentChildNodes->item($x)->getAttribute("Folder");
                $CurContentType = $CurrentChildNodes->item($x)->getAttribute("ContentType");
                $CurMime = $CurrentChildNodes->item($x)->getAttribute("ParserMime");
                $CurCharSet = $CurrentChildNodes->item($x)->getAttribute("charSet");
                //
                $currentXMLFile = new File\XMLFile($CurFileName, $CurBaseURL,
                        $CurFolder);
                //
                $currentXMLFile->sPath = $CurPath;
                $currentXMLFile->sHttpPath = URL_PATH . $CurFolder;
                $currentXMLFile->fileExtension = $CurExtension;
                $currentXMLFile->sFolder = $CurFolder;
                $currentXMLFile->sContentType = $CurContentType;
                $currentXMLFile->ParserMimeType = $CurMime;
                $currentXMLFile->charSet = $CurCharSet;
                //
                $this->oXMLFiles->addExplicit($currentXMLFile,
                        $CurFolder . $CurFileName);
            }
            return true;
        } catch (\Exception $e) {

            throw new \Exception('projeckt->SetoXMLFiles: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function getArrTemplatesFileNames()
    {
        try {

            $this->oTemplates->getArrayFileNames();
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getArrTemplatesFileNames: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function getArrPagesFileNames()
    {
        try {

            $this->oPages->getArrayFileNames();
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getArrPagesFileNames: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function getJSONTemplates()
    {
        try {

            $this->oTemplates->getJSONString();
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getJSONTemplates: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function getJSONPages()
    {
        try {

            $this->oPages->getJSONString();
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getJSONPages: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @throws Exception
     */
    public function getJSONXMLFiles()
    {
        try {

            $this->oXMLFiles->getJSONString();
        } catch (\Exception $e) {

            throw new \Exception('projeckt->getJSONXMLFiles: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getProjectsFromFileSystemPath()
    {
        try {

            $xmlFiles = array();

            if ($handle = opendir(PROJEKTS_PATH))
            {

                while (false !== ($file = readdir($handle))) {
                    $pos = strrpos($file, '.');

                    if ($pos !== false)
                    {
                        $file_ext = substr($file, ( $pos + 1));

                        if (strtoupper($file_ext) == "XML")
                        {
                            $xmlFiles[] = $file;
                        }
                    }
                }
            }
            closedir($handle);

            foreach ($xmlFiles as $xmlIndex => $xmlValue) {

                if ($this->loadProject($xmlValue) == false)
                {
                    unset($xmlFiles[$xmlIndex]);
                }
                $this->setPropertiesToNull();
            }
            return $xmlFiles;
        } catch (\Exception $e) {

            throw new \Exception(
            "projeckt->getProjectsFromFileSystemPath: " .
            $e->getMessage() . "path: " . PROJEKTS_PATH . "\n"
            );
        }
    }

    /**
     * 
     * @throws Exception
     */
    protected function setPropertiesToNull()
    {
        try {

            $this->sXMLFileName = NULL;
            $this->sName = NULL;
            $this->oTemplates = NULL;
            $this->oPages = NULL;
            $this->oXMLFiles = NULL;
            $this->sProjektFolder = NULL;
        } catch (\Exception $e) {

            throw new \Exception("projeckt->setPropertiesToNull: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $sFileNameIn_Id
     * @throws Exception
     */
    public function removeTemplate($sFileNameIn_Id)
    {
        try {

            if (isset($this->oTemplates->aFiles[$sFileNameIn_Id]))
            {
                $path = $this->oTemplates->aFiles[$sFileNameIn_Id]->sHttpPath;
                $FileName = $this->oTemplates->aFiles[$sFileNameIn_Id]->sFilename;
                $templateURL = $path . $FileName;

                ## referencial Integrity
                if ($this->oPages->existTemplate($templateURL) == false)
                {
                    $this->oTemplates->removeTemplate($sFileNameIn_Id);
                } else
                {
                    throw new \Exception(
                    "\t\n The Template File " . $sFileNameIn_Id .
                    " could not be deleted because its related with one the page.\n"
                    );
                }
            } else
            {
                throw new \Exception("\n The Teplate File " . $sFileNameIn_Id . " was not found!. \n");
            }
        } catch (\Exception $e) {

            throw new \Exception(
            "projeckt->removeTemplate: " .
            $e->getMessage() . "\n"
            );
        }
    }

    public function removePage($sFileNameIn_Id)
    {
        try {

            $bRemoved = $this->oPages->removePage($sFileNameIn_Id);
            return $bRemoved;
        } catch (\Exception $e) {

            throw new \Exception("projeckt->removePage: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $sFileNameIn_Id
     * @throws Exception
     */
    public function removeXMLData($sFileNameIn_Id)
    {
        try {
            if (isset($this->oXMLFiles->aFiles[$sFileNameIn_Id]))
            {

                if ($this->oPages->existXMLData($sFileNameIn_Id) == false)
                {
                    $this->oXMLFiles->removeDataFile($sFileNameIn_Id);
                } else
                {
                    throw new Exception("\n The XML File " . $sFileNameIn_Id . " could not be deleted because its related with one the page. ");
                }
            } else
            {
                throw new \Exception("\n The XML File " . $sFileNameIn_Id . " was not found!. ");
            }
        } catch (\Exception $e) {

            throw new \Exception(
            "projeckt->removeXMLData: " .
            $e->getMessage() . "\n"
            );
        }
    }

}
