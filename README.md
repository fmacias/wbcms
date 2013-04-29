Free D.O.M. XML and (X)HTML Editor
==================================

Introduction
------------
Free-D.O.M. (Document Object Model)

This is a simple application written for learning purpouses.
This application was written at the begining without any php framework and
currently adapted to work unter a Zend Framework 2 application. Basically the 
application it composed by the modules written in its module folder.

This application allows you to get html from the any web and download into one
specified folder on your server to be used as template, and to create pages based on those templates.
It also possible to edit XML Files with a visual Interface and store them directly 
on your server over the browser. Its your own responsability to keep the licencenses of the downloaded 
web sites and to make a good use of the application. 

The application could be extended to edit big XML files with your browser,
create a whole CMS, allow XPath expresions, create a visual Mapping Interface
for XML Standarizations. Theses features are not avaiable at today.

Installation
------------

Using Composer (recommended)
----------------------------
Installation:

    curl -s https://getcomposer.org/installer | php --
    git clone git://github.com/wunderbit/FreeDOM.git
    php composer.phar install
   
Set up a user:

    modify the .htaccess file unther the public folder.

    The application requires basic authentification, so that its possible to
    create serveral users, and each one will have his own file structure.
    Because of that you need to create the user an modify the .htaccess file unther 
    the public folder.

    I provide one test user for testing operation with a testing file structure.

Virtual Host
------------
Afterwards, set up a virtual host to point to the public/ directory of the
project and you should be ready to go!
