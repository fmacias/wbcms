<?php
$file = $_GET["file"];
$finfo = finfo_open(FILEINFO_MIME); // return mime type ala mimetype extension

if (!$finfo) {
    echo "Opening fileinfo database failed";
    exit();
}
/* get mime-type for a specific file */
//$filename = "/usr/local/something.txt";
echo finfo_file($finfo, $file);

/* close connection */
finfo_close($finfo);
?>
