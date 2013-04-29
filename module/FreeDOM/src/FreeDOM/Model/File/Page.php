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
namespace FreeDOM\Model\File;

use FreeDOM\Model\FilesGroup\Data as FreeDOMData;

class Page extends File
{

    public $pageFolder = NULL;
    public $sTemplateFileName = NULL;
    public $oDataFiles = NULL;

//	function __construct($oDataFile,$sFileNameIn)
    function __construct($sFileNameIn, $pageFolder)
    {
        try {
            parent::__construct($sFileNameIn, $pageFolder);
            $this->pageFolder = $pageFolder;
            $this->oDataFiles = new FreeDOMData();
        } catch (\Exception $e) {
            throw new \Exception('page->__construct: ' . $e->getMessage() . '\n');
        }
    }

    public function setRelatedTemplate($URLTemplate, $UserId, $Password)
    {
        try {
            $this->createFileContentFromTemlate($UserId, $Password, $URLTemplate);
        } catch (\Exception $e) {
            throw new \Exception('Templates->relateTemplate: ' . $e->getMessage() . '\n');
        }
    }

    protected function createFileContentFromTemlate($UserId, $Password,
            $URLTemplate)
    {
        try {
            $this->createFileFormURL($URLTemplate, $UserId, $Password);
            $this->sTemplateFileName = $URLTemplate;
        } catch (\Exception $e) {
            throw new \Exception('page->createFileContentFromTemlate: ' . $e->getMessage() . '\n');
        }
    }

    public function getDataFiles()
    {
        try {
            $aFileNames = array();
            foreach ($this->oDataFiles->aFiles as $selfIndex => $selfValue) {
                $aFileNames[] = $selfValue->sFileName;
            }
            return $aFileNames;
        } catch (\Exception $e) {
            throw new \Exception('page->getDataFiles: ' . $e->getMessage() . '\n');
        }
    }

    public function addDataFile($sId, $sFileName, $sLang, $sDefaultOne, $sFolder)
    {
        try {
            //$this->$oDataFiles->aFiles[$oDataFile->sFileName]= $oDataFile;
            $this->oDataFiles->addDataFile($sId, $sFileName, $sLang,
                    $sDefaultOne, $sFolder);
        } catch (\Exception $e) {
            throw new \Exception('page->addDataFile: ' . $e->getMessage() . '\n');
        }
    }

    public function getArrDataFileNames()
    {
        try {
            $this->oDataFiles->getArrayFileNames();
        } catch (\Exception $e) {
            throw new \Exception('page->getArrDataFileNames: ' . $e->getMessage() . '\n');
        }
    }

    public function getJSONData()
    {
        try {
            $this->oDataFiles->getJSONString();
        } catch (\Exception $e) {
            throw new \Exception('page->getJSONData: ' . $e->getMessage() . '\n');
        }
    }

    public function setPageFolder($folder)
    {
        try {
            $this->pageFolder = $folder;
        } catch (\Exception $e) {
            throw new \Exception('page->setPageFolder: ' . $e->getMessage() . '\n');
        }
    }

}

