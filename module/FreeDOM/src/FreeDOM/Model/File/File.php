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

class File
{

    /**
     * Absolute Path File Name
     * @var string
     */
    public $sPath = '';

    /**
     * URL and File Name
     * @var strin 
     */
    public $sHttpPath = '';

    /**
     * Base Name of file
     * @var string
     */
    public $sFilename = '';

    /**
     * File Type
     * @var string
     */
    public $fileExtension = '';

    /**
     * relative Folder
     * @var string 
     */
    public $sFolder = '';

    /**
     * Content Type
     * @var string
     */
    public $sContentType = '';

    /**
     * mime type
     * @var String
     */
    public $ParserMimeType = '';

    /**
     * charset
     * @var string
     */
    public $charSet = '';

    /**
     * 
     * @param type $sFileNameIn
     * @param string $fileFolder
     * @throws \Exception
     */
    function __construct($sFileNameIn, $fileFolder)
    {
        try {

            if (!isset($fileFolder))
            {
                $fileFolder = "";
            }

            if ($this->setFolder($fileFolder))
            {
                #$this->sPath = FILESYSTEM_PATH . $this->sFolder;
                $this->sPath = $this->sFolder;
                $this->sHttpPath = URL_PATH . $this->sFolder;
                $this->sFilename = $sFileNameIn;
                $this->setDefaultContentType(); //sets sContent type and File Extension
                $this->createDefaultFile();
            } else
            {
                throw new \Exception(
                "\n\tFile->__construct: Folder could not be created\n"
                );
            }
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->__construct: " . $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $fileFolder
     * @return boolean
     * @throws \Exception
     */
    protected function setFolder($fileFolder)
    {
        try {

            //check the folder sintax
            $fileFolder = ltrim($fileFolder);
            $fileFolder = rtrim($fileFolder);
            $aFolders = split('[/]', $fileFolder);
            $FolderLength = count($aFolders);
            $pattern = '/(?i:\\|\:|\*|\?|"|<|>|\|)/';
            foreach ($aFolders as $fKey => $fValue) {

                if (preg_match($pattern, $fValue) == 1)
                {
                    throw new \Exception(
                    "\n\tFile->setFolder: Folders or a Files names can 
                        not contain any of the following characters: 
                        \/:*?''<> |\n"
                    );
                }
            }
            $currentPath = FILESYSTEM_PATH;
            $currentFolder = "";
            $bSetFolder = TRUE;
            foreach ($aFolders as $fKey => $fValue) {

                if ($fValue != "")
                {

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
                        "\n\tFile->setFolder: The file 
                            could not be created: path: " . $currentPath . "\n"
                        );
                    }
                }
            }
            $this->sFolder = $currentFolder;
            return true;
        } catch (\Exception $e) {

            throw new \Exception("\n\tFile->setFolder: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @throws \Exception
     */
    protected function createDefaultFile()
    {
        try {

            //clearstatcache();
            if (file_exists(FILESYSTEM_PATH.$this->sPath . $this->sFilename))
            {
                
            } else
            {
                $ourFileHandle = fopen(FILESYSTEM_PATH.$this->sPath . $this->sFilename, 'w');
                if ($ourFileHandle == false)
                {
                    throw new \Exception(
                    "\n\tFile->createDefaultFile: can't open file: path: " .
                    $this->sPath . ", Filename: " . $this->sFilename . "\n"
                    );
                }
                fclose($ourFileHandle);
            }
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFile->createDefaultFile: " . $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $URL
     * @param type $UserId
     * @param type $Password
     * @throws \Exception
     */
    public function createFileFormURL($URL, $UserId, $Password)
    {
        try {
            $str = $this->get_url_contents($URL, $UserId, $Password);
            $Bytes = $this->file_put_contents($str);
            if ($Bytes)
            {
                $this->setParserContentType();
            } else
            {
                throw new \Exception(
                "\n\tFile->createFileFormURL: file_put_contents fails. 
                    Returned Bytes: " . $Bytes . "\n"
                );
            }
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->createFileFormURL: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $url
     * @param type $UserId
     * @param type $PassWord
     * @return type
     * @throws \Exception
     */
    public function get_url_contents($url, $UserId, $PassWord)
    {
        try {

            ## $url = preg_match( '@([\w/+]+)(;\s+charset=(\S+))?@i', $url, $matches );
            $url = preg_replace("/http:\/\//", "", $url);
            $urlEncoded = rawurlencode($url);
            $urlEncoded = preg_replace("/%2F/", "/", $urlEncoded);
            $urlEncoded = preg_replace("/%3F/", "?", $urlEncoded);
            $urlEncoded = preg_replace("/%3D/", "=", $urlEncoded);
            $url = 'http://' . $urlEncoded;
            //
            $cURLoptions = array(
                CURLOPT_RETURNTRANSFER => true, // return web page as an String
                CURLOPT_HEADER => false, // don't return headers in the output, but header also allow on curl_getinfo()
                CURLOPT_FOLLOWLOCATION => true, // follow redirects
                CURLOPT_ENCODING => "", // handle all encodings
                CURLOPT_USERAGENT => "free D.O.M.", // who am i
                CURLOPT_AUTOREFERER => true, // set referer on redirect
                CURLOPT_CONNECTTIMEOUT => 120, // timeout on connect
                CURLOPT_TIMEOUT => 120, // timeout on response
                CURLOPT_MAXREDIRS => 10, // stop after 10 redirects
            );

            $ch = curl_init($url);
            curl_setopt_array($ch, $cURLoptions);

            if ((isset($UserId)) && (isset($PassWord)))
            {

                if (($UserId != NULL) || ($UserId != ""))
                {
                    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
                    curl_setopt($ch, CURLOPT_USERPWD, $UserId . ":" . $PassWord);
                }
            }

            $content = curl_exec($ch);
            $err = curl_errno($ch);
            $errmsg = curl_error($ch);
            $header = curl_getinfo($ch);

            preg_match(
                    '@([\w/+]+)(;\s+charset=(\S+))?@i', $header["content_type"],
                    $matches
            );

            if (isset($matches[1]))
                $this->sContentType = $matches[1];
            if (isset($matches[3]))
                $this->charSet = $matches[3];
            curl_close($ch);
            if ($err != 0)
            {
                throw new \Exception(
                "\n\tcURL returns an Error. Error: " .
                $errmsg . "\n\t URL: " .
                $url . "\n"
                );
                ## authentification required
            } else if ($header["http_code"] == 401)
            {
                throw new \Exception(
                "\n\tAuthentifications required! 
                        Provide the username and the password
                        [" . $UserId . ":" . $PassWord . "]\n"
                );
            } else if ($header["http_code"] != 200)
            {
                throw new \Exception(
                "\n\tThe URL could not be collected! 
                        Request Status: " . $header["http_code"] . "\n"
                );
            }
            return $content;
        } catch (\Exception $e) {

            throw new \Exception(
            "\n\tFile->get_url_contents: " .
            $e->getMessage() . "url: " . $url . "\n"
            );
        }
    }

    /**
     * @deprecated not used
     * @param type $DTD
     * @throws \Exception
     */
    public function createFileFormDTD($DTD)
    {
        try {
            $this->createFileFormURL(WBit_PATH . DTDs_FOLDER . $DTD . ".html");
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->createFileFormDTD: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * @deprecated
     * @throws \Exception
     */
    public function createDefaultXMLFile()
    {
        try {
            //$sourceCode = file_get_contents($this->sTemplateFileName);
            //$bytes = $this->file_put_contents($sourceCode);
        } catch (\Exception $e) {
            throw new \Exception("\n\tFile->createDefaultXMLFile: " . $e->getMessage() . "\n");
        }
    }

    /**
     * 
     * @return type
     * @throws \Exception
     */
    public function getFileJSON()
    {
        try {
            return (json_encode($this));
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->createDefaultXMLFile: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @throws \Exception
     */
    protected function setDefaultContentType()
    {
        try {

            $pattern = '/\w*$/';
            $matchesCount = preg_match($pattern, $this->sFilename, $matches);

            if (strtoupper($matches[0]) == "XML")
            {
                $this->sContentType = "application/xml";
            } else if (
                    (strtoupper($matches[0]) == "HTML") ||
                    (strtoupper($matches[0]) == "HTM")
            )
            {
                $this->sContentType = "text/html";
            } else if (strtoupper($matches[0]) == "XHTML")
            {
                $this->sContentType = "application/xhtml+xml";
            }

            $this->ParserMimeType = $this->sContentType;
            $this->fileExtension = strtoupper($matches[0]);
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->setDefaultContentType: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @param type $data
     * @return type
     * @throws \Exception
     */
    public function file_put_contents($data)
    {
        try {
            $currentFile = FILESYSTEM_PATH.$this->sPath . $this->sFilename;
            if (
                    ($h = fopen($currentFile, 'w')) === false
            )
            {
                throw new \Exception(
                    "\n\tFile->file_put_contents: fopen fails for file" .
                    $this->sPath . $this->sFilename . "\n"
                );
            }

            if (($bytes = fwrite($h, $data)) === false)
            {
                throw new \Exception(
                "\n\tFile->file_put_contents: fwrite fails for file" .
                $this->sPath . $this->sFilename . "\n"
                );
            }
            fclose($h);
            return $bytes;
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->file_put_contents: " .
            $e->getMessage() . "\n"
            );
        }
    }

    /**
     * 
     * @throws \Exception
     */
    public function removeFile()
    {
        try {

            if (file_exists(FILESYSTEM_PATH.$this->sPath . $this->sFilename))
                unlink($this->sPath . $this->sFilename);
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->removeFile: unlink fails for file " .
            $this->sPath . $this->sFilename . "\n"
            );
        }
    }

    /**
     * get the content type used by the aplication for parsering operations, 
     * independing of the mime type which is used to display the page in 
     * the browser. 
     * The reason is that because of XHTML and HTML5 documents requires the 
     * aplication/xhtml+xml mime type for parsering, althought usually is 
     * used text/html mime type to indicate to the web browser that the 
     * page must be processed as html.
     * 
     * @throws \Exception
     */
    public function setParserContentType()
    {
        try {
            $completeFileName = FILESYSTEM_PATH.$this->sPath . $this->sFilename;
            $fileExtension = $this->fileExtension;
            $newDOM = new \DOMDocument();
            switch ($this->sContentType) {
                ## parse as html to get the charset althout xhtml
                case "text/html":
                    $loaded = @$newDOM->loadHTMLFile($completeFileName);
                    break;
                ## parse as XML to get the charset
                case "application/xml":
                    $loaded = @$newDOM->load($completeFileName);
                    break;
                ## parse as XML
                case "application/xhtml+xml":
                    $loaded = @$newDOM->load($completeFileName);
                    break;
                ## parse as XML
                case "text/xml":
                    $loaded = @$newDOM->load($completeFileName);
                    break;
                ## parse as XML
                case "text/xhtml":
                    $loaded = @$newDOM->load($completeFileName);
                    break;
                default:
                    $pattern = '/xml$/';
                    $matchesCount = preg_match(
                            $pattern, $this->sContentType, $matches
                    );

                    if (strtoupper($matches[0]) == "XML")
                    {
                        $loaded = @$newDOM->load($completeFileName);
                        $this->ParserMimeType = "application/xhtml+xml";
                    } else
                    {
                        throw new \Exception(
                        "\n\tFile->getParserContentType: content Type 
                            not supporte by the application. Content Type: " .
                        $this->sContentType . "\n"
                        );
                    }
                    break;
            }
            $docType = $newDOM->doctype;
            $publicId = $docType->publicId;
            $systemId = $docType->systemId;

            //publicIDs of XHTML
            $pIdFrameSet = "-//W3C//DTD XHTML 1.0 Frameset//EN";
            $pIdStrict = "-//W3C//DTD XHTML 1.0 Strict//EN";
            $pIdTransitional = "-//W3C//DTD XHTML 1.0 Transitional//EN";
            ## systemId of XHTML
            ## $sIdFrameSet = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd";
            ## $sIdStrict = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd";
            ## $sIdTransitional = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd";
            ## check if xhtml. I just look for the publid Id and don't 
            ## validate if the definition is right or not. It means, if 
            ## system is empty or there is not xsml in the 
            ## documentElement of the docuemnt,
            ## the documente will also be parser according to xhtml 
            ## specifications. 
            if ($publicId == $pIdFrameSet)
            {
                ## xhtml frame set
                $this->ParserMimeType = "application/xhtml+xml";
            } elseif ($publicId == $pIdStrict)
            {
                ## xhtml strict
                $this->ParserMimeType = "application/xhtml+xml";
            } elseif ($publicId == $pIdTransitional)
            {
                ## xhtml Transitional
                $this->ParserMimeType = "application/xhtml+xml";
            } else
            {
                ## throw new \Exception("setParserContentType: PublicId: ".
                ## $publicId.", SystemId: ".$systemId.", Name: ".
                ## $docType->name);
                $this->ParserMimeType = $this->sContentType;
            }

            if (($this->charSet == "") || ($newDOM->encoding))
            {

                if ($newDOM->encoding != "")
                {
                    $this->charSet = $newDOM->encoding;
                } else
                {
                    $this->charSet = "UTF-8";
                }
            }
            unset($newDOM);
        } catch (\Exception $e) {
            throw new \Exception(
            "\n\tFile->getParserContentType: " .
            $e->getMessage() . "\n"
            );
        }
    }

}

