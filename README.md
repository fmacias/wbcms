Free D.O.M. XML and (X)HTML Editor
==================================

Introduction
------------
Free-D.O.M. (Document Object Model)

This is a simple application written for learning purposes.
This application was written at the begin without any php framework and
currently has been adapted to work unter a Zend Framework 2. Basically the 
application it composed by the modules written in its module folder.

This application allows you to get html from the any web and download into one
specified folder on your server to be used as template, and to create pages based on those templates.
It also possible to edit XML Files with a visual Interface and store them directly 
on your server over the browser. Its your own responsability to keep the licencenses of the downloaded 
web sites and to make a good use of the application. 

The application could be extended to edit big XML files with your browser,
create a whole CMS, allow XPath expresions, create a visual Mapping Interface
for XML Unification ( mapping ). Theses features are not available at today.

Installation
------------

Using Composer (recommended)
----------------------------
Installation:
    git clone https://github.com/fmacias/wbcms.git
    cd wbcms
    curl -s https://getcomposer.org/installer | php --
    php composer.phar install
   
Set up a user:
    rename the files htaccess.dist and htpasswd.dist
    and checkout them to modify one path.

    The application requires basic Autentification, so that its possible to
    create several users, and each one will have his own file structure.
    
    I provide one test user for testing operation with a testing file structure.
    user: Anonym password: anonym

Virtual Host
------------
Afterwards, set up a virtual host to point to the public/ directory of the
project and you should be ready to go!
