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

class WebLanguage
{

    protected $sLanguage = '';

    function __construct()
    {
        $sCurrentLanguage = strtoupper(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'],
                        0, 2));
        $this->sLanguage = $sCurrentLanguage;
    }

}
