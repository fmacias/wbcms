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

class Application
{
    public static function init($user)
    {
        # Instance of Class  FreeDOM\Model\FreeDOM
        # its stored in the session
        session_start();
        # Define constants 
        self::defineConstants($user);
        # each user hast one working directory
        # for now.
        # @todo one user several working directories
        self::setUserWorkFolders($user);
    }
    private static function createFolder($fileFolder)
    {
        try {
            # check the folder sintax
            $fileFolder = ltrim($fileFolder);
            $fileFolder = rtrim($fileFolder);
            $aFolders = split('[/]', $fileFolder);
            $FolderLength = count($aFolders);
            $pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
            foreach ($aFolders as $fKey => $fValue) {

                if (preg_match($pattern, $fValue) == 1)
                {
                    throw new \Exception(
                    "\n\tcreateFolder: Folders or a Files names can 
                                not contain any of the following characters: 
                                \/:*?''<> |\n");
                }
            }
            $currentPath = WBit_PATH . 'users/';
            $currentFolder = "";
            $bSetFolder = TRUE;
            foreach ($aFolders as $fKey => $fValue) {

                if ($fValue != "")
                {
                    //echo "setFolder->".$fValue."\n";
                    if (!(file_exists($currentPath . '/' . $fValue)))
                    {
                        $folderCreated = mkdir($currentPath . '/' . $fValue);
                        $bSetFolder = $folderCreated;
                    } else
                    {
                        $bSetFolder = TRUE;
                    }
                    if ($bSetFolder)
                    {
                        $currentPath = $currentPath . '/' . $fValue;
                        $currentFolder .= $fValue . '/';
                    } else
                    {
                        throw new \Exception(
                        "\n\tcreateFolder: The file could not be 
                                created: path: " . $currentPath . "\n"
                        );
                    }
                }
            }
            return true;
        } catch (\Exception $e) {
            throw new \Exception("\n\tcreateFolder: " . $e->getMessage() . "\n");
            //return false;
        }
    }

    private static function setUserWorkFolders($user)
    {
        if ($this->createFolder("$user/projects/") == false)
        {
            throw new \Exception('setUserWorkFolders fails: ' . $e->getMessage() . '\n');
        }
    }

    /**
     * @todo do not use constant for this subject.
     * configuration file should be adedd to store
     * this required values.
     * For now leave it in that way.
     * @param type $user
     */
    private static function defineConstants($user)
    {
        define("USER", $user);
        //
        define("WBit_URL", "http://" . $_SERVER['HTTP_HOST'] . "/");
        define("WBit_PATH", $_SERVER['DOCUMENT_ROOT'] . "/");
        define("APP_PATH", $_SERVER['DOCUMENT_ROOT'] . "/");
        define("APP_FOLDER", "freedom/");
        # public folder with empty files used for the application to create empty templates
        define("DTDs_FOLDER", "DTDs/");
        # Root URL
        define("URL_PATH", "http://" . $_SERVER['HTTP_HOST'] . "/users/$user/");
        # absolute PATH of the server root folder
        define("FILESYSTEM_PATH", $_SERVER['DOCUMENT_ROOT'] . "/users/$user/");
        # folder with the projekt files
        define("PROJEKTS_PATH",
                $_SERVER['DOCUMENT_ROOT'] . "/users/$user/projects/");
        # folder with the projekt files
        define("PROJEKTS_URL",
                "http://" . $_SERVER['HTTP_HOST'] . "/users/$user/projects/");
        # folder with the projekt files
        define("PROJEKTS_FOLDER", "projects/");
    }
}