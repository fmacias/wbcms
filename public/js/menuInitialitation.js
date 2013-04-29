//initialitaion of the menu. Load wbCMSMenu.js which contains the classe bevor
var saved = false;
//
try
{
    //main Menu:
    var mainMenu = new Menu("mainMenu", "");
    mainMenu.add("file", "File");
    mainMenu.add("view", "View");
    mainMenu.add("projeckt", "Project");
    mainMenu.add("nodePerformance", "Node Performance");
    mainMenu.add("help", "Help");
    mainMenu.add("window", "Window");

    //menu view:
    var oView = mainMenu.menuItems.view;
    oView.add("sourceCode", "Source Code");
    oView.add("editor", "Edit View");
    oView.add("adaptView", "Adapt Screen");
    var oSourceCode = oView.menuItems.sourceCode;
    var oEditor = oView.menuItems.editor;
    var oAdaptView = oView.menuItems.adaptView;

    //menu Node Performance:
    var oNodePerformance = mainMenu.menuItems["nodePerformance"];
    oNodePerformance.add("appendChild", "Append new Child");
    var oAppendChild = oNodePerformance.menuItems["appendChild"];
    oNodePerformance.add("insertBefore", "Insert Element Before");
    var oInsertBefore = oNodePerformance.menuItems["insertBefore"];
    oNodePerformance.add("rename", "Rename Element");
    var oRename = oNodePerformance.menuItems["rename"];
    oNodePerformance.add("remove", "Remove Element");
    var oRemove = oNodePerformance.menuItems["remove"];

    //menu Window:
    var oWindow = mainMenu.menuItems.window;
    oWindow.add("defaultView", "Default View");
    var oDefaultView = oWindow.menuItems.defaultView;
    oWindow.add("previewView", "Preview View");
    var oPreviewView = oWindow.menuItems.previewView;
    oWindow.add("treeView", "Tree View");
    var oTreeView = oWindow.menuItems.treeView;
    oWindow.add("cascadeView", "Cascade View");
    var oCascadeView = oWindow.menuItems.cascadeView;
    //menu File
    var oMenuFile = mainMenu.menuItems.file;
    //	menu File::New
    oMenuFile.add("new", "New");
    var oNew = oMenuFile.menuItems["new"];
    oNew.add("newDataFile", "XML File");
    var oNewDataFile = oNew.menuItems["newDataFile"];
    oNewDataFile.onPress = true;
    //menu File::Open
    oMenuFile.add("open", "Open");
    //menu File::Change without savig
    oMenuFile.add("changeDom", "Change without saving");
    var oChange = oMenuFile.menuItems["changeDom"];
    //menu File::Save without savig
    oMenuFile.add("save", "Save");
    var oSave = oMenuFile.menuItems["save"];
    //menu File::Disconnect menu
    oMenuFile.add("disconnect", "Disconnect");
    var oDisconnect = oMenuFile.menuItems["disconnect"];
    //menu File::New::Template
    oNew.add("newTemplate", "Template");
    var oNewTemplate = oNew.menuItems["newTemplate"];
    oNewTemplate.onPress = true;
    //menu File::New::Page
    oNew.add("newPage", "Page");
    var oNewPage = oNew.menuItems["newPage"];
    oNewPage.onPress = true;
    //menu File::New::Relation of Data files with Pages
    oNew.add("newRelDataFiles", "Relations of XML Files with Pages");
    var oNewRelDataFiles = oNew.menuItems["newRelDataFiles"];
    //menu File:Open
    var oOpen = oMenuFile.menuItems["open"];
    oOpen.add("_projeckt", "Project");
    var oProjekt = oOpen.menuItems["_projeckt"];
    //oProjekt.add("changeProjeckt","Other Project");
    //	var oChangeProjeckt = oProjekt.menuItems["changeProjeckt"];
    //	oChangeProjeckt.add("emptyChangeProjeckt","There are no more Projekts in the work folder!");
    //
    //
    oProjekt.add("openTemplate", "Template");
    var oOpenTemplate = oProjekt.menuItems["openTemplate"];
    oOpenTemplate.add("emptyTemplate", "There are not Templates related with this Projekt!");
    //

    //
    oProjekt.add("openPages", "Pages");
    var oOpenPages = oProjekt.menuItems["openPages"];
    oOpenPages.add("emptyPage", "There are not pages related with this Projekt!");
    //

    //
    oProjekt.add("openDataFiles", "XML Files");
    var oOpenDataFiles = oProjekt.menuItems["openDataFiles"];
    oOpenDataFiles.add("emptyDataFile", "There are not Data Files (XML Files) related with this Projekt!");
    //

    //
    //projekt
    var oMenuProjekt = mainMenu.menuItems.projeckt;
    oMenuProjekt.add("projektView", "View");
    var oProjektView = oMenuProjekt.menuItems.projektView;
    oMenuProjekt.add("projektTemplates", "Templates");
    var oProjektTemplates = oMenuProjekt.menuItems.projektTemplates;
    oProjektTemplates.add("templatesMaintanance", "Maintanance");
    var oTempMaintanance = oProjektTemplates.menuItems.templatesMaintanance;

    oMenuProjekt.add("projektPages", "Pages");
    var oProjektPages = oMenuProjekt.menuItems.projektPages;
    oProjektPages.add("pagesMaintanance", "Maintanance");
    var oPageMaintanance = oProjektPages.menuItems.pagesMaintanance;

    oMenuProjekt.add("dataRelation", "Data Relation");
    var oProjektDataRelation = oMenuProjekt.menuItems.dataRelation;
    oProjektDataRelation.add("dataRelation", "Maintanance");
    var oDataRelMaintanance = oProjektDataRelation.menuItems.dataRelation;

    oMenuProjekt.add("XMLFiles", "XMLFiles");
    var oProjektXMLFiles = oMenuProjekt.menuItems.XMLFiles;
    oProjektXMLFiles.add("XMLFilesMaintanance", "Maintanance");
    var oXMLFilesMaintanance = oProjektXMLFiles.menuItems.XMLFilesMaintanance;
    oMenuProjekt.add("changeProjekt", "Change Project");
    var oChangeProjekt = oMenuProjekt.menuItems.changeProjekt;

    var oMenuHelp = mainMenu.menuItems.help;
    oMenuHelp.add("helpAbout", "About");
    var oHelpAbout = oMenuHelp.menuItems.helpAbout;
} catch (e) {
    window.alert("menuInitialitation.js fails. Error: " + e.message);
}