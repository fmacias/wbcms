/*
Copyright 2013 Fernando Macias Ruano <fmaciasruano@gmail.com>
http://wunderbit.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var ENABLE_METAS = false;
var ENABLE_SCRIPTS = false;
//
var relProjeckts = new Object();
var relTemplates = new Object();
var relPages = new Object();
var relDataFiles = new Object();
var currentMenuOption = "";

function requestTemplates()
{
    try
    {
        /*for (var x in relTemplates)
         {
         relTemplates[x].removeMenuHTMLChilds();
         };*/
        oOpenTemplate.removeChilds();
        relTemplates = new Object();
        var RQSTTemplates = new AJAXTransport();
        RQSTTemplates.reply.onReply = function()
        {
            try
            {
                try
                {
                    var oJSONTemplates = eval("(" + this.Text + ")");
                } catch (e) {
                    throw new Error("Server Error: " + this.Text);
                }
                var oTemplates = oJSONTemplates;
                var counter = 0;
                for (var x in oTemplates)
                {
                    var curFileName = oTemplates[x].sFolder + oTemplates[x].sFilename;
                    oOpenTemplate.add(x, curFileName);
                    relTemplates[x] = oOpenTemplate.menuItems[x];
                    relTemplates[x].doAction = function()
                    {
                        //menuIndex right now is the index of the obejeckt oFile(set on [oOpenTemplate.add(x,curFileName)] ) which is imported from the server asincronouslly.
                        loadFile(this.menuIndex, "Template");
                    };
                    counter++;
                }
                if (counter == 0)
                {
                    oOpenTemplate.removeChilds();
                    oOpenTemplate.add("emptyTemplate", "There are not Templates related with this Projekt!");
                }
                var oCurrentDiv = document.getElementById(oOpenTemplate.menuIndex);
                var oCurrentContainer = oCurrentDiv.parentNode;
                var top = oCurrentContainer.offsetTop + oCurrentDiv.offsetTop;
                var left = oCurrentContainer.offsetLeft + oCurrentDiv.offsetWidth;
                oOpenTemplate.displayMainMenuOption(oOpenTemplate, top, left);
                if (oOpenTemplate.enabled)
                {
                    oOpenTemplate.enable();
                } else {
                    oOpenTemplate.disable();
                }
            } catch (e)
            {
                throw new Error("menuActions.js->requestTemplates()::RQSTTemplates.reply.onReply. Error: " + e.message);
            }
        };
        //RQSTTemplates.request('http://www.wunderbit.com/wbcms/requestTemplates.php');//sync
        RQSTTemplates.request('freedom/requesttemplates');//sync
    } catch (e)
    {
        throw new Error("menuDefinition.js->requestTemplates. Error: " + e.message);
    }
}
function requestPages()
{
    try
    {
        oOpenPages.removeChilds();
        relPages = new Object();
        var RQSTPages = new AJAXTransport();
        RQSTPages.reply.onReply = function()
        {
            try
            {
                try
                {
                    var oJSONPages = eval("(" + this.Text + ")");
                } catch (e) {
                    throw new Error("Server Error: " + this.Text);
                }
                oPages = oJSONPages;
                var counter = 0;
                //relPages = new Object();
                for (var x in oPages)
                {
                    var curFileName = oPages[x].sFolder + oPages[x].sFilename;
                    oOpenPages.add(x, curFileName);
                    relPages[x] = oOpenPages.menuItems[x];
                    relPages[x].doAction = function() {
                        loadFile(this.menuIndex, "Page");
                    };
                    counter++;
                }
                if (counter == 0)
                {
                    oOpenPages.removeChilds();
                    oOpenPages.add("emptyPage", "There are not pages related with this Projekt!");
                }
                var oCurrentDiv = document.getElementById(oOpenPages.menuIndex);
                var oCurrentContainer = oCurrentDiv.parentNode;
                var top = oCurrentContainer.offsetTop + oCurrentDiv.offsetTop;
                var left = oCurrentContainer.offsetLeft + oCurrentDiv.offsetWidth;
                oOpenPages.displayMainMenuOption(oOpenPages, top, left);
                if (oOpenPages.enabled)
                {
                    oOpenPages.enable();
                } else {
                    oOpenPages.disable();
                }
            } catch (e)
            {
                throw new Error("menuActions.js->requestPages()::RQSTPages.reply.onReply. Error: " + e.message);
            }
        };
        //RQSTPages.request('http://www.wunderbit.com/wbcms/requestPages.php');
        RQSTPages.request('freedom/requestpages');
    } catch (e)
    {
        throw new Error("menuDefinition.js->requestPages. Error: " + e.message);
    }
}
function requestXMLFiles()
{
    try
    {
        oOpenDataFiles.removeChilds();
        relDataFiles = new Object();
        var RQSTXMLFiles = new AJAXTransport();
        RQSTXMLFiles.reply.onReply = function()
        {
            try
            {
                try
                {
                    var oJSONXMLFiles = eval("(" + this.Text + ")");
                } catch (e)
                {
                    throw new Error("Server Error: " + this.Text);
                }
                oXMLFiles = oJSONXMLFiles;
                var counter = 0;
                //relDataFiles = new Object();
                for (var x in oXMLFiles)
                {
                    var curFileName = oXMLFiles[x].sFolder + oXMLFiles[x].sFilename;
                    oOpenDataFiles.add(x, curFileName);
                    relDataFiles[x] = oOpenDataFiles.menuItems[x];
                    relDataFiles[x].doAction = function()
                    {
                        //menuIndex right now is the index of the obejeckt oFile(set on [oOpenTemplate.add(x,curFileName)] ) which is imported from the server asincronouslly.
                        loadFile(this.menuIndex, "DataFile");
                    };
                    counter++;
                }
                if (counter == 0)
                {
                    oOpenDataFiles.removeChilds();
                    oOpenDataFiles.add("emptyDataFile", "There are not Data Files (XML Files) related with this Projekt!");
                }
                var oCurrentDiv = document.getElementById(oOpenDataFiles.menuIndex);
                var oCurrentContainer = oCurrentDiv.parentNode;
                var top = oCurrentContainer.offsetTop + oCurrentDiv.offsetTop;
                var left = oCurrentContainer.offsetLeft + oCurrentDiv.offsetWidth;
                oOpenDataFiles.displayMainMenuOption(oOpenDataFiles, top, left);
                if (oOpenDataFiles.enabled)
                {
                    oOpenDataFiles.enable();
                } else {
                    oOpenDataFiles.disable();
                }
            } catch (e)
            {
                throw new Error("menuActions.js->requestXMLFiles()::RQSTXMLFiles.reply.onReply. Error: " + e.message);
            }
        };
        //RQSTXMLFiles.request('http://www.wunderbit.com/wbcms/requestXMLFiles.php');
        RQSTXMLFiles.request('freedom/requestxmlfiles');
    } catch (e)
    {
        throw new Error("menuDefinition.js->requestXMLFiles. Error: " + e.message);
    }
}
/*
 function requestProjeckts()
 {
 try
 {
 oChangeProjeckt.removeChilds();
 relProjeckts = new Object();
 var RQSTProjeckts = new AJAXTransport();
 RQSTProjeckts.reply.onReply=function()
 {
 try
 {
 //window.alert(RQSTProjeckts.XMLHttpRequest.reply.Text);
 try
 {
 var oJSONProjeckts =eval("(" +this.Text + ")");
 }catch(e)
 {
 throw new Error("Server Error: "+this.Text);
 }
 oProjeckts = oJSONProjeckts;
 var counter = 0;
 //relProjeckts = new Object();
 for (var x in oProjeckts)
 {
 var curFileName = oProjeckts[x];
 oChangeProjeckt.add(curFileName+"_"+counter,curFileName);
 relProjeckts[curFileName] = oChangeProjeckt.menuItems[curFileName+"_"+counter];
 relProjeckts[curFileName].doAction = function (){
 window.alert(this.menuIndex);
 };
 counter++;
 }
 if (counter ==0)
 {
 oChangeProjeckt.removeChilds();
 oChangeProjeckt.add("emptyChangeProjeckt","There are no more Projekts in the work folder!");
 }
 var oCurrentDiv = document.getElementById(oChangeProjeckt.menuIndex);
 var oCurrentContainer = oCurrentDiv.parentNode; 
 var top = oCurrentContainer.offsetTop+oCurrentDiv.offsetTop;
 var left = oCurrentContainer.offsetLeft+oCurrentDiv.offsetWidth;
 oChangeProjeckt.displayMainMenuOption(oChangeProjeckt,top,left);
 if (oChangeProjeckt.enabled)
 {
 oChangeProjeckt.enable();
 }else{
 oChangeProjeckt.disable();
 }
 }catch(e)
 {
 throw new Error("menuActions.js->requestProjeckts()::RQSTProjeckts.reply.onReply. Error: "+e.message);
 }
 };
 RQSTProjeckts.request('http://www.wunderbit.com/wbcms/requestProjeckts.php');
 }catch(e)
 {
 throw new Error("menuDefinition.js->requestProjeckts. Error: "+e.message);
 }
 }*/
//function loadFile(sFileNameIn,sFileCategorie)
function loadFile(oFileIndex, sFileCategorie, isConfigFile)
{
    try
    {
        if (!(isConfigFile))
        {
            var isConfigFile = false;
        }
        if (isConfigFile)
        {
            editProjektOpenMenuState();
        } else {
            fileOpenMenuState();
        }
        //set on the server the file name of the current file is being used.
        var AJAXRqstSetDefaultFile = new AJAXTransport();
        AJAXRqstSetDefaultFile.reply.onReply = function()
        {
            try
            {
                //window.alert(this.Text);
                try
                {
                    var oJSONFile = eval("(" + this.Text + ")");
                } catch (e)
                {
                    throw new Error("Server Error: " + this.Text);
                }
                if (oJSONFile.sFilename)
                {
                    //fileOpenMenuState();
                    var fileURL = oJSONFile.sHttpPath + oJSONFile.sFilename;
                    currentMenuOption = oFileIndex;
                    //selectedFile.constructor(fileURL,oJSONFile.sContentType);
                    selectedFile.constructor(oJSONFile);
                }
            } catch (e)
            {
                throw new Error("menuActions.js->loadFile()::AJAXRqstSetDefaultFile.reply.onReply. Error: " + e.message);
            }
        };

        AJAXRqstSetDefaultFile.requestSendForm("FileIndex=" + oFileIndex + "&FileCategorie=" + sFileCategorie, "freedom/requestsetfile");
        //AJAXRqstSetDefaultFile.requestSendForm("FileIndex="+oFileIndex+"&FileCategorie="+sFileCategorie,"requestSetFile.php");
    } catch (e)
    {
        throw new Error("menuDefinition.js->loadFile. Error: " + e.message);
    }
}
oSourceCode.doAction = function()
{
    try
    {
        if (selectedFile.changed == true)
        {
            var innerHTML = "<form>" +
                    "<div class='nodeLegend'>The File currently loaded has not be saved.<p>The current file has not be saved and this view will load the current stored file from the server. </p><p>Are you sure you wan't to perform this action befor saving?</p></div>" +
                    "</form>";
            var dialog = new floatWindow(null, null, null, 600, 300);
            dialog.draw(innerHTML, null, true, true);
            dialog.doAction = function()
            {
                drawSourceCode();
                fileOpenMenuState();
                var oTextArea = oSourceCodeEditor.TextArea.oElement;
                var sSourceCode = selectedFile.editFileSourceCode(oTextArea);
            };
        } else
        {
            drawSourceCode();
            fileOpenMenuState();
            var oTextArea = oSourceCodeEditor.TextArea.oElement;
            var sSourceCode = selectedFile.editFileSourceCode(oTextArea);
        }
    } catch (e)
    {
        window.alert("menuDefinition.js->oSourceCode.doAction. Error: " + e.message);
    }
};
oEditor.doAction = function()
{
    try
    {
        //if (selectedFile.changed==true)
        //{
        selectedFile.loadFile();
        //}
        drawEditSection();
        fileOpenMenuState();
        //oProjektView.doAction();
        /*var AJAXRqstGetCurrentFile = new AJAXTransport();
         AJAXRqstGetCurrentFile.reply.onReply=function()
         {
         try
         {
         try
         {
         var oJSONFile =eval("(" +this.Text + ")");
         }catch(e)
         {
         throw new Error("Server Error: "+this.Text);
         }
         drawEditSection();
         fileOpenMenuState();
         currentMenuOption = "EditorView";
         var fileURL = oJSONFile.currentURLFile;
         var contentType = oJSONFile.ContentType;
         var oAPreview = oPreviewContainer.windBody.firstChild;
         var curFileObj = oJSONFile.curOFileObj;
         //selectedFile.constructor(fileURL,contentType);
         selectedFile.constructor(curFileObj);
         }catch(e)
         {
         throw new Error("\nmenuActions.js->oEditor.doAction()::AJAXRqstGetCurrentFile.reply.onReply. Error: "+e.message);
         }
         };
         AJAXRqstGetCurrentFile.request("requestGetFile.php");*/
    } catch (e)
    {
        window.alert("menuDefinition.js->oEditor.doAction. Error: " + e.message);
    }
};
oNodePerformance.doAction = function()
{
    try
    {
        if (currentMenuOption == "ProjectView")
        {
            window.alert("The projekt configuration file can not run this action. Use the Projekt menu for that!");
            mainMenu.removeMenuHTMLContainers();
            return;
        }
        if (CurrentTreeElement.element == null)
        {
            window.alert("No Element has been selected on the Tree!/nPlease, select a node.");
            mainMenu.removeMenuHTMLContainers();
            return;
        }
        currentMenuOption = "nodePerformance";
    } catch (e)
    {
        window.alert("menuDefinition.js->oNodePerformance.doAction. Error: " + e.message);
    }
};
oAppendChild.doAction = function()
{
    try
    {
        currentMenuOption = "oAppendChild";
        var innerHTML = '<h4>Input Node Name</h4><input type="text" name ="NodeName" value="" />';
        var oTreeDiv = oTreeContainer.container.winBody.oElement.firstChild;
        var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
        //
        var nElementTop = getHTMLElementTop(Identificator);
        var identWidth = getHTMLElementWidth(Identificator);
        nElementTop = nElementTop - oTreeContainer.container.winBody.oElement.scrollTop;
        var nleft = getHTMLElementLeft(Identificator) + identWidth + 5;
        //
        var relatedNodeName = CurrentTreeElement.getRelatedNodeName();
        nodePerformanceWindow.create(nElementTop, nleft, innerHTML, "into " + relatedNodeName, "Append New Child");
        //
        var dialog = nodePerformanceWindow.dialog;
        dialog.doAction = function()
        {
            try
            {
                var oInput = this.container.winBody.oElement.getElementsByTagName('input')[0];
                appendChildNode(CurrentTreeElement.element.nodeIndexList, oInput.value.toString());
                if (selectedFile.fileExtension == "XML")
                {
                    CurrentPreviewElement.enabled = false;
                    oPreviewContainer.setXMLDisableView();
                }
            } catch (e)
            {
                window.alert("menuDefinition.js->oAppendChild.doAction.dialog.windowContent.doAction Error: " + e.message);
            }
        };
        mainMenu.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oAppendChild.doAction. Error: " + e.message);
    }
};
oInsertBefore.doAction = function()
{
    try
    {
        currentMenuOption = "oInsertBefore";
        var innerHTML = '<h4>Input Node Name</h4><input type="text" name ="NodeName" value="" />';
        /*var oTreeDiv = document.getElementById("tree");
         var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];*/

        var oTreeDiv = oTreeContainer.container.winBody.firstChild;
        var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
        //
        var nElementTop = getHTMLElementTop(Identificator);
        var identWidth = getHTMLElementWidth(Identificator);
        nElementTop = nElementTop - oTreeContainer.container.winBody.oElement.scrollTop;
        var nleft = getHTMLElementLeft(Identificator) + identWidth + 5;
        //
        var relatedNodeName = CurrentTreeElement.getRelatedNodeName();
        nodePerformanceWindow.create(nElementTop, nleft, innerHTML, "before " + relatedNodeName, "Insert Before Child");
        //
        var dialog = nodePerformanceWindow.dialog;
        dialog.doAction = function()
        {
            try
            {
                var oInput = this.container.winBody.oElement.getElementsByTagName('input')[0];
                insertBeforeElement(CurrentTreeElement.element.nodeIndexList, oInput.value.toString());
                if (selectedFile.fileExtension == "XML")
                {
                    CurrentPreviewElement.enabled = false;
                    oPreviewContainer.setXMLDisableView();
                }
            } catch (e)
            {
                window.alert("menuDefinition.js->oInsertBefore.doAction.dialog.windowContent.doAction Error: " + e.message);
            }
        };
        mainMenu.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oInsertBefore.doAction. Error: " + e.message);
    }
};
oRename.doAction = function()
{
    try
    {
        currentMenuOption = "rename";
        currentMenuOption = "oInsertBefore";
        var innerHTML = '<h4>Input New Node Name</h4><input type="text" name ="NodeName" value="" />';
        /*var oTreeDiv = document.getElementById("tree");
         var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];*/

        var oTreeDiv = oTreeContainer.container.winBody.firstChild;
        var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];

        var nElementTop = getHTMLElementTop(Identificator);
        var identWidth = getHTMLElementWidth(Identificator);
        nElementTop = nElementTop - oTreeContainer.container.winBody.oElement.scrollTop;
        var nleft = getHTMLElementLeft(Identificator) + identWidth + 5;
        //
        var relatedNodeName = CurrentTreeElement.getRelatedNodeName();
        nodePerformanceWindow.create(nElementTop, nleft, innerHTML, "rename " + relatedNodeName, "Rename Child");
        //
        var dialog = nodePerformanceWindow.dialog;
        dialog.doAction = function()
        {
            try
            {
                var oInput = this.container.winBody.oElement.getElementsByTagName('input')[0];
                renameNode(CurrentTreeElement.element.nodeIndexList, oInput.value.toString());
                if (selectedFile.fileExtension == "XML")
                {
                    CurrentPreviewElement.enabled = false;
                    oPreviewContainer.setXMLDisableView();
                }
            } catch (e)
            {
                window.alert("menuDefinition.js->oRename.doAction.dialog.windowContent.doAction Error: " + e.message);
            }
        };
        mainMenu.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oRename.doAction. Error: " + e.message);
    }
};
oRemove.doAction = function()
{
    try
    {
        currentMenuOption = "remove";
        var innerHTML = '<h4>Remove Node</h4><input type="text" name ="NodeName" value="' + CurrentTreeElement.getRelatedNodeName() + '" disabled="true"/>';
        /*var oTreeDiv = document.getElementById("tree");
         var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];*/

        var oTreeDiv = oTreeContainer.container.winBody.oElement.firstChild;
        var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];

        var nElementTop = getHTMLElementTop(Identificator);
        var identWidth = getHTMLElementWidth(Identificator);
        nElementTop = nElementTop - oTreeContainer.container.winBody.oElement.scrollTop;
        var nleft = getHTMLElementLeft(Identificator) + identWidth + 5;
        //
        //
        var relatedNodeName = CurrentTreeElement.getRelatedNodeName();
        nodePerformanceWindow.create(nElementTop, nleft, innerHTML, "remove " + relatedNodeName, "Remove Child");
        //
        var dialog = nodePerformanceWindow.dialog;
        dialog.doAction = function()
        {
            try
            {
                var oInput = this.container.winBody.oElement.getElementsByTagName('input')[0];
                removeNode(CurrentTreeElement.element.nodeIndexList, oInput.value.toString());
                if (selectedFile.fileExtension == "XML")
                {
                    CurrentPreviewElement.enabled = false;
                    oPreviewContainer.setXMLDisableView();
                }
            } catch (e)
            {
                window.alert("menuDefinition.js->oRemove.dialog.doAction Error: " + e.message);
            }
        };
        mainMenu.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oRename.doAction. Error: " + e.message);
    }
};
//
oDefaultView.doAction = function() {//XML View
    try
    {
        //view1();
        oMainContainer.setTreeView();
    } catch (e)
    {
        window.alert("menuDefinition.js->oDefaultView.doAction. Error: " + e.message);
    }
};
oPreviewView.doAction = function() {//HTML View
    try
    {
        //view2();
        //oMainContainer.setPreviewView();
    } catch (e)
    {
        window.alert("menuDefinition.js->oPreviewView.doAction. Error: " + e.message);
    }
};
oTreeView.doAction = function() {
    try
    {
        //view4();
    } catch (e)
    {
        window.alert("menuDefinition.js->oTreeView.doAction. Error: " + e.message);
    }
};
oCascadeView.doAction = function() {
    try
    {
        //view3();
    } catch (e)
    {
        window.alert("menuDefinition.js->oCascadeView.doAction . Error: " + e.message);
    }
};
//
oChange.doAction = function()
{
    try
    {
        if (currentMenuOption == "ProjectView")
        {
            window.alert("The projekt configuration file can not run this action. Use the Projekt menu for that!");
        } else
        {
            currentMenuOption = "changeDom";
            changeCurrentDom();
            selectedFile.changed = true;
            if (selectedFile.fileExtension == "XML")
            {
                CurrentPreviewElement.enabled = false;
                oPreviewContainer.setXMLDisableView();
            }
            //if XML
            //disable oPreview
            //display a layer into the preview.
            //on Editing XML Window the preview file is directly related with the file currently stored on the server.
            //Save an reload the file if you want the this view.
            //button "Save and Reload" setXMLDisableView
        }
        oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oChange.doAction . Error: " + e.message);
    }
};
oSave.doAction = function()
{
    try
    {
        currentMenuOption = "save";
        oMenuFile.removeMenuHTMLContainers();
        selectedFile.save();
    } catch (e)
    {
        //throw new Error(e.message);
        //window.alert("menuDefinition.js->oSave.doAction . Error: "+e.message);
        e.showAlert();
    }
};
/*oSaveUs.doAction = function ()
 {
 try
 {
 currentMenuOption = "saveUs";
 oMenuFile.removeMenuHTMLContainers();
 }catch(e)
 {
 window.alert("menuDefinition.js->oSaveUs.doAction . Error: "+e.message);
 }
 };*/
oDisconnect.doAction = function()
{
    try
    {
        window.alert("Not Implemented. Close the navigator to end your serssion");
        /*var RQSTDisconnect = new AJAXTransport();
         RQSTDisconnect.reply.onReply=function()
         {
         try{
         try
         {
         var oAnswer =eval("(" +this.Text + ")");
         }catch(e){
         throw new Error("Server Error on Disconnection: "+this.Text);
         }
         
         }catch(e){
         window.alert(e.description+", \n this.Text: "+this.Text);
         }
         };
         RQSTDisconnect.request('http://www.wunderbit.com/wbcms/disconnect.php');*/
    } catch (e)
    {
        window.alert("menuDefinition.js->oDisconnect.doAction fails . Error: " + e.message);
    }
};
oNewDataFile.doAction = function()
{
    try
    {
        currentMenuOption = "newDataFile";
        //var dialog = new dialogWindow(true,"",790,590,false,'http://www.wunderbit.com/wbcms/mainXMLFiles.html');
        //var dialog = new dialogWindow(true,"<b>hola</b>",790,590,false,"");
        //dialog.show();
        //dialog.windowContainer.afterClose=function()
        //
        var dialog = new floatWindow(null, null, null, 900, 400);
        dialog.draw(null, 'maintanance/mainXMLFiles.html', true, false);
        dialog.container.setWindowName("XML Files Maintanance");
        dialog.container.setWindowTitle("XML Files");
        dialog.afterClose = function()
        {
            try
            {
                this.callToPreview = function()
                {
                    try
                    {
                        var innerHTML = "<form>" +
                                "<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>" +
                                "</form>";
                        /*var dialog = new floatWindow(null,null,null,320,105);
                         dialog.draw(innerHTML,null,true,true);
                         dialog.container.setWindowName("Confirmation Required");
                         dialog.container.setWindowTitle("Message");
                         dialog.doAction= function()*/
                        confirmWindow.create(innerHTML);
                        var dialog = confirmWindow.dialog;
                        dialog.doAction = function()

                        {
                            try
                            {
                                oProjektView.doAction();
                            } catch (e)
                            {
                                window.alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose.callToPreview Error: " + e.message);
                            }
                        };
                    } catch (e)
                    {
                        window.alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: " + e.message);
                    }
                };
                //
                var oSelf = this;
                var RQSTStoreProjekt = new AJAXTransport();
                RQSTStoreProjekt.reply.onReply = function()
                {
                    try
                    {
                        try
                        {
                            var oAnswer = eval("(" + this.Text + ")");
                        } catch (e)
                        {
                            throw new Error("Server Error: " + this.Text);
                        }
                        oSelf.callToPreview();
                    } catch (e) {
                        window.alert(e.description + ", \n this.Text: " + this.Text);
                    }
                };
                RQSTStoreProjekt.request('freedom/saveprojectintoxml');
            } catch (e)
            {
                window.alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose . Error: " + e.message);
            }
        };
        oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oNewDataFile.doAction. Error: " + e.message);
    }
};
oNewTemplate.doAction = function()
{
    try
    {
        currentMenuOption = "newTemplate";
        /*
         var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/mainTemplates.html');
         dialog.show();
         dialog.windowContainer.afterClose=function()*/
        var dialog = new floatWindow(null, null, null, 900, 400);
        dialog.draw(null, 'maintanance/mainTemplates.html', true, false);
        dialog.container.setWindowName("Templates Maintanance");
        dialog.container.setWindowTitle("Templates");
        dialog.afterClose = function()
        {
            try
            {
                this.callToPreview = function()
                {
                    try
                    {
                        var innerHTML = "<form>" +
                                "<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>" +
                                "</form>";
                        confirmWindow.create(innerHTML);
                        var dialog = confirmWindow.dialog;
                        dialog.doAction = function()
                        {
                            try
                            {
                                oProjektView.doAction();
                            } catch (e)
                            {
                                window.alert("menuDefinition.js->oNewTemplate.doAction.dialog.afterClose.callToPreview.dialog.doAction Error: " + e.message);
                            }
                        };
                    } catch (e)
                    {
                        window.alert("menuDefinition.js->oNewTemplate.doAction.dialog.afterClose.callToPreview Error: " + e.message);
                    }
                };
                //
                var oSelf = this;
                var RQSTStoreProjekt = new AJAXTransport();
                RQSTStoreProjekt.reply.onReply = function()
                {
                    try {
                        try
                        {
                            var oAnswer = eval("(" + this.Text + ")");
                        } catch (e)
                        {
                            throw new Error("Server Error: " + this.Text);
                        }
                        oSelf.callToPreview();
                    } catch (e) {
                        throw new Error(e.description + ", \n this.Text: " + this.Text);
                    }
                };

                RQSTStoreProjekt.request('freedom/saveprojectintoxml');
            } catch (e)
            {
                window.alert("menuDefinition.js->oNewTemplate.doAction.dialog.afterClose Error: " + e.message);
            }
        };
        oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oNewTemplate.doAction. Error: " + e.message);
    }
};
oNewPage.doAction = function()
{
    try
    {
        currentMenuOption = "newPage";
        /*var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/mainPages.html');
         dialog.show();
         dialog.windowContainer.afterClose=function()*/
        var dialog = new floatWindow(null, null, null, 900, 400);
        dialog.draw(null, 'maintanance/mainPages.html', true, false);
        dialog.container.setWindowName("Pages Maintanance");
        dialog.container.setWindowTitle("Pages");
        dialog.afterClose = function()
        {
            try
            {
                this.callToPreview = function()
                {
                    try
                    {
                        var innerHTML = "<form>" +
                                "<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>" +
                                "</form>";
                        /*
                         var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
                         dialog.show();
                         dialog.windowContent.doAction= function()
                         */
                        /*
                         var dialog = new floatWindow(null,null,null,320,105);
                         dialog.draw(innerHTML,null,true,true);
                         dialog.doAction= function()
                         */
                        confirmWindow.create(innerHTML);
                        var dialog = confirmWindow.dialog;
                        dialog.doAction = function()
                        {
                            try
                            {
                                oProjektView.doAction();
                            } catch (e)
                            {
                                window.alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: " + e.message);
                            }
                        };
                    } catch (e)
                    {
                        window.alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose.callToPreview Error: " + e.message);
                    }
                };
                //
                var oSelf = this;
                var RQSTStoreProjekt = new AJAXTransport();
                RQSTStoreProjekt.reply.onReply = function()
                {
                    try {
                        try
                        {
                            var oAnswer = eval("(" + this.Text + ")");
                        } catch (e)
                        {
                            throw new Error("Server Error: " + this.Text);
                        }
                        oSelf.callToPreview();
                    } catch (e) {
                        throw new Error(e.description + ", \n this.Text: " + this.Text);
                    }
                };
                //RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
                RQSTStoreProjekt.request('freedom/saveprojectintoxml');
            } catch (e)
            {
                window.alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose Error: " + e.message);
            }
        };
        oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oNewPage.doAction. Error: " + e.message);
    }
};
oNewRelDataFiles.doAction = function()
{
    try
    {
        currentMenuOption = "newRelDataFiles";
        /*
         var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/relPageData.html');
         dialog.show();
         dialog.windowContainer.afterClose=function()*/
        var dialog = new floatWindow(null, null, null, 900, 400);
        dialog.draw(null, 'maintanance/relPageData.html', true, false);
        dialog.container.setWindowName("Relation of XML Files with a page");
        dialog.container.setWindowTitle("Relations with one Page");
        dialog.afterClose = function()
        {
            try
            {
                this.callToPreview = function()
                {
                    try
                    {
                        var innerHTML = "<form>" +
                                "<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>" +
                                "</form>";
                        confirmWindow.create(innerHTML);
                        var dialog = confirmWindow.dialog;
                        dialog.doAction = function()

                        {
                            try
                            {
                                oProjektView.doAction();
                            } catch (e)
                            {
                                window.alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: " + e.message);
                            }
                        };
                    } catch (e)
                    {
                        window.alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose.callToPreview Error: " + e.message);
                    }
                };
                //
                var oSelf = this;
                var RQSTStoreProjekt = new AJAXTransport();
                RQSTStoreProjekt.reply.onReply = function()
                {
                    try
                    {
                        try
                        {
                            var oAnswer = eval("(" + this.Text + ")");
                        } catch (e)
                        {
                            throw new Error("Server Error: " + this.Text);
                        }
                        oSelf.callToPreview();
                    } catch (e) {
                        throw new Error(e.description + ", \n this.Text: " + this.Text);
                    }
                };
                //RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
                RQSTStoreProjekt.request('freedom/saveprojectintoxml');

            } catch (e)
            {
                window.alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose Error: " + e.message);
            }
        };
        oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oNewRelDataFiles.doAction. Error: " + e.message);
    }
};
/*oChangeProjeckt.onSelect = function ()
 {
 try
 {
 if (document.getElementById("_"+oChangeProjeckt.menuIndex))
 {
 delete(oChangeProjeckt.menuItems["emptyChangeProjeckt"]);
 oChangeProjeckt.removeMenuHTMLContainers();
 requestProjeckts();
 }
 }catch(e)
 {
 window.alert("menuDefinition.js->oChangeProjeckt.onSelect. Error: "+e.message);
 }
 };*/
oOpenTemplate.onSelect = function()
{
    try
    {
        if (document.getElementById("_" + oOpenTemplate.menuIndex))
        {
            delete(oOpenTemplate.menuItems["emptyTemplate"]);
            oOpenTemplate.removeMenuHTMLContainers();
            requestTemplates();
        }
    } catch (e)
    {
        window.alert("menuDefinition.js->oOpenTemplate.onSelect. Error: " + e.message);
    }
};
oOpenPages.onSelect = function()
{
    try
    {
        if (document.getElementById("_" + oOpenPages.menuIndex))
        {
            delete(oOpenPages.menuItems["emptyPage"]);
            oOpenPages.removeMenuHTMLContainers();
            requestPages();
        }
        //oMenuFile.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oOpenPages.onSelect. Error: " + e.message);
    }
};
oOpenDataFiles.onSelect = function()
{
    try
    {
        if (document.getElementById("_" + oOpenDataFiles.menuIndex))
        {
            delete(oOpenDataFiles.menuItems["emptyDataFile"]);
            oOpenDataFiles.removeMenuHTMLContainers();
            requestXMLFiles();
        }
    } catch (e)
    {
        window.alert("menuDefinition.js->oOpenDataFiles.onSelect. Error: " + e.message);
    }
};
oTempMaintanance.doAction = function()
{
    try
    {
        oNewTemplate.doAction();
        oMenuProjekt.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oTempMaintanance.doAction. Error: " + e.message);
    }
};
oPageMaintanance.doAction = function()
{
    try
    {
        oNewPage.doAction();
        oMenuProjekt.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oPageMaintanance.doAction. Error: " + e.message);
    }
};
oDataRelMaintanance.doAction = function()
{
    try
    {
        oNewRelDataFiles.doAction();
        oMenuProjekt.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oDataRelMaintanance.doAction. Error: " + e.message);
    }
};
oXMLFilesMaintanance.doAction = function()
{
    try
    {
        oNewDataFile.doAction();
        oMenuProjekt.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oXMLFilesMaintanance.doAction. Error: " + e.message);
    }
};
oProjektView.doAction = function()
{
    try
    {
        //defaultMenuState();
        drawEditSection();
        var AJAXRQSTProjektView = new AJAXTransport();
        AJAXRQSTProjektView.reply.onReply = function()
        {
            try
            {
                try
                {
                    var projektViewText = this.Text;
                    var oProjektViewInfo = eval("(" + projektViewText + ")");
                } catch (e)
                {
                    throw new Error("Server Error: " + this.Text);
                }
                var sXMLFile = oProjektViewInfo.projektXMLFile;
                var sProjektName = oProjektViewInfo.projektName;
                var sContentType = oProjektViewInfo.contentType;
                currentMenuOption = "ProjectView";
                loadFile(sXMLFile, "ConfigFile", true);
            } catch (e)
            {
                throw new Error("menuDefinition.js->oProjektView.doAction.AJAXRQST.ProjektView.reply.onReply Error: " + e.message);
            }
        };
        AJAXRQSTProjektView.request("freedom/getprojectviewxml");
    } catch (e)
    {
        window.alert("menuDefinition.js->oProjektView.doAction . Error: " + e.message);
    }
};
oChangeProjekt.doAction = function()
{
    try
    {
        oMenuProjekt.removeMenuHTMLContainers();
        oViewLoadProject.createWindow();
        //oViewLoadProject.createProjectSeletionWindow();
        //viewLoadProject.draw();
        saved = false;
    } catch (e)
    {
        window.alert("menuDefinition.js->oChangeProjekt.doAction. Error: " + e.message);
    }
};
//End Menu Projekt
//Begin Menu Help
oHelpAbout.doAction = function()
{
    try
    {
        //window.alert("oMenuProjekt.menuItems.helpAbout");
        //var innerHTML = "licence";
        //var dialog = new floatWindow(null,null,null,600,300);
        //dialog.draw(innerHTML,null,true,true);
        //var dialog = new floatWindow(null,null,null,900,400);
        var dialog = new floatWindow(null, null, null, 900, 400);
        dialog.draw(null, 'maintanance/licence.html', true, false);
        dialog.container.setWindowName("Licence");
        dialog.container.setWindowTitle("BSD-3-Clause");
        //oMenuHelp.removeMenuHTMLContainers();
    } catch (e)
    {
        window.alert("menuDefinition.js->oHelpAbout.doAction. Error: " + e.message);
    }
};
//End Menu Help
oAdaptView.doAction = function()
{
    var bSourceView = (oSourceCodeEditor.container.oElement.style.display == "block") ? true : false;
    var bEditView = (oTreeContainer.container.oElement.style.display == "block") ? true : false;
    window.initBodySize();
    var menuBar = document.getElementById("mainMenu");
    menuBar.style.width = bodyWidth + "px";
    oMainContainer.setPosAndSize(5, 5, bodyWidth - 10, bodyHeight - menuBar.offsetHeight - 10);
    if (bEditView)
    {
        oMainContainer.setTreeView();
    } else if (bSourceView)
    {
        oMainContainer.setSourceCodeView();
    }
};
function createNewAttribute()
{
    try
    {
        if (!(CurrentPreviewElement.element))
        {
            alert("No element selected!");
            return;
        }
        var innerHTML = '<div class="nodeLegend">Input the Name:</div>' +
                '<input type="text" name ="NodeName" value=""/>' +
                '</div>';
        var nElementTop = getHTMLElementTop(oEditorContainer.container.winBody.oElement);
        var nElementLeft = getHTMLElementTop(oEditorContainer.container.winBody.oElement) + (oEditorContainer.container.winBody.oElement.offsetWidth - 200);

        nodePerformanceWindow.create(null, null, innerHTML, "Add New Attribute", "Create Attribute");
        //
        var dialog = nodePerformanceWindow.dialog;
        dialog.doAction = function()
        {
            try
            {
                var oInput = this.container.winBody.oElement.getElementsByTagName('input')[0];
                if (oInput.value)
                {
                    oEditorContainer.nodeEditor.addAttribute(oInput.value, "");
                }
            } catch (e) {
                window.alert("menuActions.js->addAttribute()->doAction() fails: " + e.message);
            }
        };
    } catch (e) {
        window.alert("menuActions.js->addAttribute() fails: " + e.message);
    }
}
function avalScript()
{
    var sScriptState = (ENABLE_METAS) ? "enable" : "disable";
    var sScriptOpositeState = (ENABLE_METAS) ? "disable" : "enable";

    var innerHTML = "<p>SCRIPT Tags are disabled by default at the preview because them could influence the behavior of the application.</p>";
    innerHTML += "<p>If you enable them, it could have unexepted influences.</p>";
    innerHTML += "<p>Would you like to " + sScriptOpositeState + " them?</p>";
    confirmWindow.create(innerHTML);
    var dialog = confirmWindow.dialog;
    dialog.doAction = function()
    {
        ENABLE_SCRIPTS = (ENABLE_SCRIPTS) ? false : true;
        selectedFile.setEnableScripts(ENABLE_SCRIPTS);
        var button = avalScripts.oElement;
        var color = (ENABLE_SCRIPTS) ? "green" : "red";
        button.style.color = color;
    };
}
function avalMeta()
{
    try
    {
        var sMetaState = (ENABLE_METAS) ? "enable" : "disable";
        var sMetaOpositeState = (ENABLE_METAS) ? "disable" : "enable";

        var innerHTML = "<p>META Tags are disabled by default at the preview because some of them could influence the behavior of the application.</p>";
        innerHTML += "<p>If you enable them, it could have unexepted influences.</p>";
        innerHTML += "<p>Would you like to " + sMetaOpositeState + " them?</p>";
        confirmWindow.create(innerHTML);
        var dialog = confirmWindow.dialog;
        dialog.doAction = function()
        {
            ENABLE_METAS = (ENABLE_METAS) ? false : true;
            selectedFile.setEnableMetas(ENABLE_METAS);
            var button = avalMetas.oElement;
            var color = (ENABLE_METAS) ? "green" : "red";
            button.style.color = color;
        };
    } catch (e) {
        window.alert("avalMetas fails: " + e.message);
    }
}
/*
 
 oMenuFile
 oChange
 oSave
 oSaveUs
 oNew
 oNewDataFile
 oNewTemplate
 oNewPage
 oNewRelDataFiles
 oOpen
 oProjekt
 oChangeProjeckt
 oOpenTemplate
 oOpenPages
 oOpenDataFiles
 oView
 oSourceCode
 oEditor
 
 oMenuProjekt
 oProjektView
 oProjektTemplates
 oTempMaintanance
 oPageMaintanance
 oDataRelMaintanance
 oXMLFilesMaintanance
 
 oNodePerformance
 oAppendChild
 oInsertBefore
 oRename
 oRemove
 
 oMenuHelp
 oHelpAbout
 
 */
function defaultMenuState()
{
    try
    {
        oMenuFile.enable();
        //
        oChange.disable();
        oSave.disable();
        //oSaveUs.disable();
        //oView.disable();
        //oView
        oSourceCode.disable();
        oEditor.disable();
        oMenuProjekt.enable();
        //oNodePerformance.disable();
        oAppendChild.disable();
        oInsertBefore.disable();
        oRename.disable();
        oRemove.disable();
        oChangeProjekt.enable();
        oMenuHelp.enable();

        //oSave.disable();
        //oChange.disable();
        //window
        oDefaultView.enable();
        oPreviewView.enable();
        oTreeView.enable();
        oCascadeView.enable();
        oAdaptView.enable();
    } catch (e)
    {
        window.alert("menuDefinition.js->defaultMenuState. Error: " + e.message);
    }
}
function fileOpenMenuState()
{
    try
    {
        defaultMenuState();
        oSourceCode.enable();
        oEditor.enable();
        oNewDataFile.disable();
        oNewTemplate.disable();
        oNewPage.disable();
        oNewRelDataFiles.disable();

        /*oTempMaintanance.disable();
         oPageMaintanance.disable();
         oDataRelMaintanance.disable();
         oXMLFilesMaintanance.disable();*/
        //
        oTreeContainer.enableButtons();
        oPreviewContainer.enableButtons();
        oEditorContainer.enableButtons();
        oEditorContainer.nodeEditor.enableRemoveButtons();
        oTreeContainer.container.setWindowName("File DOM Tree");
        oPreviewContainer.container.setWindowName("Preview");
        oEditorContainer.container.setWindowName("Current DOM Element");
    } catch (e)
    {
        window.alert("menuDefinition.js->fileOpenMenuState. Error: " + e.message);
    }
}
function editProjektOpenMenuState()
{
    try
    {
        defaultMenuState();
        oTreeContainer.disableButtons();
        oPreviewContainer.disableButtons();
        oEditorContainer.disableButtons();
        oEditorContainer.nodeEditor.disableRemoveButtons();
        //
        oTreeContainer.container.setWindowName("Project Configuration File");
        oPreviewContainer.container.setWindowName("Preview");
        oEditorContainer.container.setWindowName("Current DOM Element");
        /*
         oNodePerformance.disable();
         oView.disable();
         oSave.disable();
         oChange.disable();
         oDefaultView.enable();
         oPreviewView.enable();
         oTreeView.enable();
         oCascadeView.enable();
         */
    } catch (e)
    {
        window.alert("menuDefinition.js->editProjektOpenMenuState. Error: " + e.message);
    }
}
