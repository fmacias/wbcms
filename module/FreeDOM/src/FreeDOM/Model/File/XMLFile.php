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

class XMLFile extends File
{

    public $XMLFileFolder = NULL;
    public $BaseURL = NULL;

    function __construct($sFileNameIn, $BaseURLIn, $XMLFileFolder)
    {//($sFileNameIn,$sBaseURL,$XMLFolder,$UserId,$Password);
        try {
            $this->BaseURL = $BaseURLIn;
            $this->XMLFileFolder = $XMLFileFolder;
            parent::__construct($sFileNameIn, $XMLFileFolder); //creates the object with an empty file
        } catch (\Exception $e) {
            throw new \Exception('XMLFile->__construct: ' . $e->getMessage() . '\n');
        }
    }

}
