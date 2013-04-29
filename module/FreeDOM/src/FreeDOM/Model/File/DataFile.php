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

class DataFile extends File
{

    public $Id = NULL;
    public $sLang = NULL;
    public $bDefaultOne = false;

    function __construct($sId, $sLang, $sFileNameIn, $sDefaultOne, $fileFolder)
    {
        try {
            parent::__construct($sFileNameIn, $fileFolder);
            $this->Id = $sId;
            $this->sLang = $sLang;
            $this->bDefaultOne = (strtoupper($sDefaultOne) == "TRUE") ? true : false;
        } catch (\Exception $e) {
            throw new \Exception('dataFile->__construct: ' . $e->getMessage() . '\n');
        }
    }

}
