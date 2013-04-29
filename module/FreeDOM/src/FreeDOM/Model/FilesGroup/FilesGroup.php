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

abstract class FilesGroup
{

    /**
     * Polimorphic
     * @see \FilesGroup::*
     */
    abstract public function getDOMNode();

    /**
     * collection of \File objects
     * @var array 
     */
    public $aFiles = array();

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getJSONString()
    { //common
        try {

            $URLFiles = array();
            $sFile = "";
            $sFiles = "Files:{";
            $URLFiles = 'URLFiles:[';
            $coma = "";

            foreach ($this->aFiles as $selfIndex => $selfValue) {
                $httpPath = $selfValue->sHttpPath;
                $httpFileName = $selfValue->sFilename;
                $currentFile = $httpPath . $httpFileName;
                $sFile .= $coma . '"' . $currentFile . '"';
                $coma = ",";
            }
            $URLFiles .= $sFile . ']';
            $sFiles .= $URLFiles;
            $sFiles .= "}";
            return '{' . $sFiles . '}';
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFilesGroup->getJSONString: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getFilesJSON()
    {
        try {

            if (count($this->aFiles) > 0)
            {
                return (json_encode($this->aFiles));
            } else
            {
                return ("{}");
            }
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFilesGroup->getJSONString: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @return type
     * @throws Exception
     */
    public function getArrayFileNames()
    {//Common: may be delete
        try {

            $aFileNames = array();
            foreach ($this->aFiles as $selfIndex => $selfValue) {
                $aFileNames[] = $selfValue->sFileName;
            }
            return $aFileNames;
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFilesGroup->getArrayFileNames: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $ObjectIn
     * @param type $sObjectIndex
     * @throws Exception
     */
    public function addExplicit($ObjectIn, $sObjectIndex)
    {
        try {

            $this->aFiles[$sObjectIndex] = $ObjectIn;
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFilesGroup->addExplicit: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $sObjectIndex
     * @throws Exception
     */
    public function remove($sObjectIndex)
    {
        try {

            $this->aFiles[$sObjectIndex]->removeFile();
            unset($this->aFiles[$sObjectIndex]);
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFilesGroup->remove: " .
            $e->getMessage() . "\n, Object Index: " .
            $sObjectIndex . "\n"
            );
        }
    }

}
