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

class Data extends FilesGroup
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
            $Data = $newDOM->createElement("Data");
            foreach ($aFiles as $Index => $Value) {
                $DataFileName = $newDOM->createElement("FileName");
                $DataFileName->nodeValue = $Value->sFilename;
                $DataFileName->setAttribute("Id", $Value->Id);
                $DataFileName->setAttribute("Lang", $Value->sLang);
                $sDefaultOne = ($Value->bDefaultOne) ? "true" : "false";
                $DataFileName->setAttribute("Default", $sDefaultOne);
                //
                $DataFileName->setAttribute("Path", $Value->sPath);
                $DataFileName->setAttribute("URL",
                        $Value->sHttpPath . $Value->sFilename);
                $DataFileName->setAttribute("FileExtension",
                        $Value->fileExtension);
                $DataFileName->setAttribute("Folder", $Value->sFolder);
                $DataFileName->setAttribute("ContentType", $Value->sContentType);
                $DataFileName->setAttribute("ParserMime", $Value->ParserMimeType);
                $DataFileName->setAttribute("charSet", $Value->charSet);
                //
                $appendedData = $Data->appendChild($DataFileName);
            }
            return $Data;
        } catch (\Exception $e) {
            throw new \Exception('Data->getDOMNode: ' . $e->getMessage() . '\n');
        }
    }
    /**
     * 
     * @param type $sId
     * @param type $sFileName
     * @param type $sLang
     * @param type $sDefaultOne
     * @param type $sFolder
     * @throws Exception
     */
    public function addDataFile($sId, $sFileName, $sLang, $sDefaultOne, $sFolder)
    {
        try {
            if (!(isset($this->aFiles[$sFolder . $sFileName])))
            {
                $this->aFiles[$sFolder . $sFileName] = new File\DataFile($sId,
                        $sLang, $sFileName, $sDefaultOne, $sFolder);
            } else
            {
                throw new \Exception('Data->addDataFile: Data File ' . $sFolder . $sFileName . ' already related with the page!\n');
            }
        } catch (\Exception $e) {
            //Don't delete the file, because this object is used only to related XMLFiles with pages. The only relevant properties of the object are the FileName related properties
            //Whose must be used to get the correct file from the object XMLFiles related with the project.
            //if (isset($this->aFiles[$sFolder.$sFileName])) $this->removeDataRelation($sFolder.$sFileName);
            throw new \Exception('Data->addDataFile: ' . $e->getMessage() . '\n');
        }
    }
    /**
     * 
     * @param type $sId
     * @param type $sFileName
     * @param type $oldFileIndex
     * @param type $sLang
     * @param type $sDefaultOne
     * @param type $sFolder
     * @throws Exception
     */
    public function modifyDataFile($sId, $sFileName, $oldFileIndex, $sLang,
            $sDefaultOne, $sFolder)
    {
        try {
            if ((isset($this->aFiles[$sFolder . $sFileName])) && ($sFolder . $sFileName == $oldFileIndex))
            {
                $this->aFiles[$sFolder . $sFileName]->Id = $sId;
                $this->aFiles[$sFolder . $sFileName]->sLang = $sLang;
                $this->aFiles[$sFolder . $sFileName]->bDefaultOne = $sDefaultOne;
            } else
            {
                $this->addDataFile($sId, $sFileName, $sLang, $sDefaultOne,
                        $sFolder);
                $this->removeDataRelation($oldFileIndex);
            }
        } catch (\Exception $e) {
            //Don't delete the file, because this object is used only to related XMLFiles with pages. The only relevant properties of the object are the FileName related properties
            //Whose must be used to get the correct file from the object XMLFiles related with the project.
            //if (isset($this->aFiles[$oldFileIndex])) unset($this->aFiles[$sFolder.$sFileName]);
            throw new \Exception('Data->addDataFile: ' . $e->getMessage() . '\n');
        }
    }
    /**
     * 
     * @param type $FileNameId
     * @throws Exception
     */
    public function removeDataRelation($FileNameId)
    {
        try {
            unset($this->aFiles[$FileNameId]);
        } catch (\Exception $e) {
            throw new \Exception('Data->removeDataRelation: ' . $e->getMessage() . '\n');
        }
    }

}
