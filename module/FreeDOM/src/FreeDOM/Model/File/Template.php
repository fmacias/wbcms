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

class Template extends File
{

    public $BaseURL = NULL;

    function __construct($sFileNameIn, $BaseURLIn, $templatesFolder)//$sFileNameIn,$sBaseURL,$this->templatesFolder,$UserId,$Password
    {
        try {
            //if (create the file)//in case of error throw new: if header status != 200 retuns return the error.
            $this->BaseURL = $BaseURLIn;
            parent::__construct($sFileNameIn, $templatesFolder); //creates the object with an empty file
        } catch (\Exception $e) {
            throw new \Exception('Template->__construct:Template could not be created! ' . $e->getMessage() . '\n');
        }
    }

}