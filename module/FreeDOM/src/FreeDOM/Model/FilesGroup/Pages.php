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

class Pages extends FilesGroup
{

    /**
     * 
     * @param type $URLTemplate
     * @return boolean
     * @throws Exception
     */
    public function existTemplate($URLTemplate)
    {
        try {
            foreach ($this->aFiles as $Page => $Value) {
                //$URLTemplate = $Value->sHttpPath.$Value->sFilename;
                if (($Value->sTemplateFileName == $URLTemplate) && ($Value->sTemplateFileName != ""))
                {
                    return true;
                }
            }
            return false;
        } catch (\Exception $e) {
            throw new \Exception("\n\tPages->existTemplate: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @param type $newTemplateURL
     * @param type $oldTemplateURL
     * @throws Exception
     */
    public function setRelTemplateName($newTemplateURL, $oldTemplateURL)
    {
        try {
            foreach ($this->aFiles as $Page => $Value) {
                if ($Value->sTemplateFileName == $oldTemplateURL)
                {
                    $Value->sTemplateFileName = $newTemplateURL;
                }
            }
        } catch (\Exception $e) {
            throw new \Exception("\n\tPages->setRelTemplateName: " . $e->getMessage() . "\n");
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
            $Pages = $newDOM->createElement("Pages");
            foreach ($aFiles as $Index => $Value) {
                $Page = $newDOM->createElement("Page");
                $FileName = $newDOM->createElement("FileName");
                $FileName->nodeValue = $Value->sFilename;
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
                    $attFolder = $Page->setAttribute("Folder", $Value->sFolder);
                }
                $appendedPage = $Pages->appendChild($Page);
            }
            return($Pages);
        } catch (\Exception $e) {
            throw new \Exception('Templates->getDOMNode: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sFileNameIn
     * @param type $sPageFolder
     * @param type $URLTemplate
     * @param type $UserId
     * @param type $Password
     * @throws Exception
     */
    public function addPage($sFileNameIn, $sPageFolder, $URLTemplate, $UserId,
            $Password)
    {
        try {
            if (!(isset($this->aFiles[$sPageFolder . $sFileNameIn])))
            {
                $currentPage = new File\Page($sFileNameIn, $sPageFolder);
                $currentPage->setRelatedTemplate($URLTemplate, $UserId,
                        $Password);
                $this->aFiles[$sPageFolder . $sFileNameIn] = $currentPage;
                //$this->relateTemplate($sPathTemplateFileNameIn);
            } else
            {
                throw new Exception('Templates->addPage: Page ' . $sPageFolder . $sFileNameIn . ' could not be added because already exists!\n');
            }
        } catch (\Exception $e) {
            if (isset($this->aFiles[$sPageFolder . $sFileNameIn]))
            {
                //	$this->remove($sPageFolder.$sFileNameIn);
                //	$this->removePage($sPageFolder.$sFileNameIn);
            }
            throw new \Exception('Templates->addPage: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sFileNameIn
     * @param type $oldFileNameIn
     * @param type $sPageFolder
     * @param type $URLTemplate
     * @param type $UserId
     * @param type $Password
     * @throws Exception
     */
    public function modifyPage($sFileNameIn, $oldFileNameIn, $sPageFolder,
            $URLTemplate, $UserId, $Password)
    {
        try {
            //if is modificating this instance and for this fileName
            if ((isset($this->aFiles[$sPageFolder . $sFileNameIn])) && ($sPageFolder . $sFileNameIn == $oldFileNameIn))
            {
                $this->aFiles[$sPageFolder . $sFileNameIn]->setRelatedTemplate($URLTemplate,
                        $UserId, $Password);
            } else
            {
                $this->addPage($sFileNameIn, $sPageFolder, $URLTemplate,
                        $UserId, $Password);
                $this->removePage($oldFileNameIn);
            }
        } catch (\Exception $e) {
            throw new \Exception('Templates->addPage: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $fileNameIndex
     * @throws Exception
     */
    public function removePage($fileNameIndex)
    {
        try {
            $this->remove($fileNameIndex);
        } catch (\Exception $e) {
            throw new \Exception('Templates->removeTemplate: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $CompleteFileName
     * @return boolean
     * @throws Exception
     */
    public function existXMLData($CompleteFileName)
    {
        try {
            foreach ($this->aFiles as $Page => $Value) {//for each page
                foreach ($Value->oDataFiles->aFiles as $DFile => $DFValue) {
                    //echo("<p>".$DFValue->sPath.$DFValue->sFilename."==".$CompleteFileName."</p>");
                    if ($DFValue->sFolder . $DFValue->sFilename == $CompleteFileName)
                    {
                        return true;
                    }
                }
            }
            return false;
        } catch (\Exception $e) {
            throw new \Exception('Templates->existXMLData: ' . $e->getMessage() . '\n');
        }
    }

}
