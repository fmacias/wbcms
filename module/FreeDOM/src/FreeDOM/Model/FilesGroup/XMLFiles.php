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

class XMLFiles extends FilesGroup
{
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
            $XMLFiles = $newDOM->createElement("XMLFiles");
            foreach ($aFiles as $Index => $Value) {
                $FileName = $newDOM->createElement("FileName");
                $FileName->nodeValue = $Value->sFilename;
                //
                $FileName->setAttribute("BaseURL", $Value->BaseURL);
                //
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
                //////////////
                //
	        	//
		$AppendedFile = $XMLFiles->appendChild($FileName);
            }
            return($XMLFiles);
        } catch (\Exception $e) {
            throw new \Exception('XMLFiles->getDOMNode: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sFileNameIn
     * @param type $XMLFolder
     * @param type $sBaseURL
     * @param null $UserId
     * @param null $Password
     * @throws Exception
     */
    public function addXMLFile($sFileNameIn, $XMLFolder, $sBaseURL, $UserId,
            $Password)
    {
        try {
            if (!(isset($UserId)))
                $UserId = NULL;
            if (!(isset($Password)))
                $Password = NULL;
            //if (!(isset($this->aFiles[$sFileNameIn])))
            if (!(isset($this->aFiles[$XMLFolder . $sFileNameIn])))
            {
                $pattern = '/(\.\w*$)/'; // Extracts the file name from a path
                preg_match_all($pattern, $sFileNameIn, $matches, PREG_SET_ORDER);
                $ArrLength = count($matches);
                if ($ArrLength == 0)
                {
                    //echo ('{Error:"Wrong Extension"}');
                    throw new \Exception('Wrong File Extension. File' . $sFileNameIn . '\n');
                    //return false;	
                }
                $CurrentFileExtension = $matches[0][1];
                if ((strtoupper($CurrentFileExtension) != ".XML") &&
                        (strtoupper($CurrentFileExtension) != ".XSL"))
                {
                    throw new \Exception('file is not an XML. Extension: ' . $CurrentFileExtension . '\n');
                    //echo ('{Error:"file is not an XML"}');
                    //return false;
                }
                $currentXMLFile = new File\XMLFile($sFileNameIn, $sBaseURL,
                        $XMLFolder);
                $bCreateFromXML = false;
                if (isset($sBaseURL))
                {
                    if (($sBaseURL == "") || ($sBaseURL == NULL))
                    {
                        $bCreateFromXML = true;
                    }
                } else
                {
                    $bCreateFromXML = true;
                }
                if ($bCreateFromXML)
                {
                    $currentXMLFile->createFileFormURL(WBit_URL . DTDs_FOLDER . "utf8.xml",
                            $UserId, $Password);
                } else
                {
                    $currentXMLFile->createFileFormURL($sBaseURL, $UserId,
                            $Password);
                }
                $this->aFiles[$XMLFolder . $sFileNameIn] = $currentXMLFile;
                //return true;
            } else
            {
                throw new \Exception('XMLFiles->addXMLFile: XMLFile ' . $XMLFolder . $sFileNameIn . ' could not be added because already exists!\n');
            }
        } catch (\Exception $e) {
            if (isset($this->aFiles[$XMLFolder . $sFileNameIn]))
            {
                //$this->remove($XMLFolder.$sFileNameIn);
            }
            throw new \Exception('XMLFiles->addXMLFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $sFileNameIn
     * @param type $oldFileName
     * @param type $XMLFolder
     * @param type $sBaseURL
     * @param type $UserId
     * @param type $Password
     * @throws Exception
     */
    public function modifyXMLFile($sFileNameIn, $oldFileName, $XMLFolder,
            $sBaseURL, $UserId, $Password)
    {
        try {
            if ((isset($this->aFiles[$XMLFolder . $sFileNameIn])) && ($XMLFolder . $sFileNameIn == $oldFileName))
            {
                $bCreateFromXML = false;
                if (isset($sBaseURL))
                {
                    if (($sBaseURL == "") || ($sBaseURL == NULL))
                    {
                        $bCreateFromXML = true;
                    }
                } else
                {
                    $bCreateFromXML = true;
                }
                if ($bCreateFromXML)
                {

                    $this->aFiles[$XMLFolder . $sFileNameIn]->createFileFormURL(WBit_PATH . DTDs_FOLDER . "utf8.xml",
                            $UserId, $Password);
                } else
                {
                    $this->aFiles[$XMLFolder . $sFileNameIn]->createFileFormURL($sBaseURL,
                            $UserId, $Password);
                }
            } else
            {
                $this->addXMLFile($sFileNameIn, $XMLFolder, $sBaseURL, $UserId,
                        $Password);
                $this->remove($oldFileName);
            }
        } catch (\Exception $e) {
            if (isset($this->aFiles[$XMLFolder . $sFileNameIn]))
            {
                //$this->remove($XMLFolder.$sFileNameIn);
            }
            throw new \Exception('XMLFiles->addXMLFile: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $folder
     * @throws Exception
     */
    public function setXMLFilesFolder($folder)
    {
        try {
            $this->XMLFilesFolder = $folder;
        } catch (\Exception $e) {
            throw new \Exception('XMLFiles->setXMLFilesFolder: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * 
     * @param type $fileNameIndex
     * @throws Exception
     */
    public function removeDataFile($fileNameIndex)
    {
        try {
            $this->remove($fileNameIndex);
            /* if ($this->aFiles[$fileNameIndex]->removeFile())
              {
              unset($this->aFiles[$fileNameIndex]);
              return true;
              }
              return false; */
        } catch (\Exception $e) {
            throw new \Exception('XMLFiles->removeDataFile: ' . $e->getMessage() . '\n');
        }
    }

}
