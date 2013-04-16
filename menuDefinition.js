var checkedMainOption = "";
var uncheckedMainOption = "";
var saved = false;
//
function requestTemplates()
{
	try
	{
		var RQSTTemplates = new AJAXTransport();
		RQSTTemplates.reply.onReply=function()
		{
			try
			{
				var oJSONTemplates =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			var oTemplates = oJSONTemplates;
			var counter = 0;
			for (var x in oTemplates)
			{
				var curFileName = oTemplates[x].sFolder+oTemplates[x].sFilename;
				oOpenTemplate.add(x,curFileName);
				relTemplates[x] = oOpenTemplate.menuItems[x];
				relTemplates[x].doAction = function ()
				{
					//menuIndex right now is the index of the obejeckt oFile(set on [oOpenTemplate.add(x,curFileName)] ) which is imported from the server asincronouslly.
					loadFile(this.menuIndex,"Template");
				};
				counter++;
			}
			if (counter ==0)
			{
				oOpenTemplate.removeChilds();
				oOpenTemplate.add("emptyTemplate","There are not Templates related with this Projekt!");
			}
			var oCurrentDiv = document.getElementById(oOpenTemplate.menuIndex);
			var oCurrentContainer = oCurrentDiv.parentNode; 
			var top = oCurrentContainer.offsetTop+oCurrentDiv.offsetTop;
			var left = oCurrentContainer.offsetLeft+oCurrentDiv.offsetWidth;
			oOpenTemplate.displayMainMenuOption(oOpenTemplate,top,left);
			if (oOpenTemplate.enabled)
			{
				oOpenTemplate.enable();
			}else{
				oOpenTemplate.disable();
			}
		};
		RQSTTemplates.request('http://www.wunderbit.com/wbcms/requestTemplates.php');//sync
	}catch(e)
	{
		throw new Error("menuDefinition.js->requestTemplates. Error: "+e.message);
	}
}
function requestPages()
{
	try
	{
		var RQSTPages = new AJAXTransport();
		RQSTPages.reply.onReply=function()
		{
			try
			{
			var oJSONPages =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			oPages = oJSONPages;
			var counter = 0;
			for (var x in oPages)
			{
				var curFileName = oPages[x].sFolder+oPages[x].sFilename;
				oOpenPages.add(x,curFileName);
				relPages[x] = oOpenPages.menuItems[x];
				relPages[x].doAction = function (){
					loadFile(this.menuIndex,"Page");
				};
				counter++;
			}
			if (counter ==0)
			{
				oOpenPages.removeChilds();
				oOpenPages.add("emptyPage","There are not pages related with this Projekt!");
			}
			var oCurrentDiv = document.getElementById(oOpenPages.menuIndex);
			var oCurrentContainer = oCurrentDiv.parentNode; 
			var top = oCurrentContainer.offsetTop+oCurrentDiv.offsetTop;
			var left = oCurrentContainer.offsetLeft+oCurrentDiv.offsetWidth;
			oOpenPages.displayMainMenuOption(oOpenPages,top,left);
			if (oOpenPages.enabled)
			{
				oOpenPages.enable();
			}else{
				oOpenPages.disable();
			}
			
		};
		RQSTPages.request('http://www.wunderbit.com/wbcms/requestPages.php');
	}catch(e)
	{
		throw new Error("menuDefinition.js->requestPages. Error: "+e.message);
	}
}
function requestXMLFiles()
{
	try
	{
		var RQSTXMLFiles = new AJAXTransport();
		RQSTXMLFiles.reply.onReply=function()
		{
			try
			{
				var oJSONXMLFiles =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			oXMLFiles = oJSONXMLFiles;
			var counter = 0;
			for (var x in oXMLFiles)
			{
				var curFileName = oXMLFiles[x].sFolder+oXMLFiles[x].sFilename;
				oOpenDataFiles.add(x,curFileName);
				relDataFiles[x] = oOpenDataFiles.menuItems[x];
				relDataFiles[x].doAction = function ()
				{
					//menuIndex right now is the index of the obejeckt oFile(set on [oOpenTemplate.add(x,curFileName)] ) which is imported from the server asincronouslly.
					loadFile(this.menuIndex,"DataFile");
				};
				counter++;
			}
			if (counter ==0)
			{
				oOpenDataFiles.removeChilds();
				oOpenDataFiles.add("emptyDataFile","There are not Data Files (XML Files) related with this Projekt!");
			}
			var oCurrentDiv = document.getElementById(oOpenDataFiles.menuIndex);
			var oCurrentContainer = oCurrentDiv.parentNode; 
			var top = oCurrentContainer.offsetTop+oCurrentDiv.offsetTop;
			var left = oCurrentContainer.offsetLeft+oCurrentDiv.offsetWidth;
			oOpenDataFiles.displayMainMenuOption(oOpenDataFiles,top,left);
			if (oOpenDataFiles.enabled)
			{
				oOpenDataFiles.enable();
			}else{
				oOpenDataFiles.disable();
			}
		};
		RQSTXMLFiles.request('http://www.wunderbit.com/wbcms/requestXMLFiles.php');
	}catch(e)
	{
		throw new Error("menuDefinition.js->requestXMLFiles. Error: "+e.message);
	}
}
function requestProjeckts()
{
	try
	{
		var RQSTProjeckts = new AJAXTransport();
		RQSTProjeckts.reply.onReply=function()
		{
			//alert(RQSTProjeckts.XMLHttpRequest.reply.Text);
			try
			{
			var oJSONProjeckts =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			oProjeckts = oJSONProjeckts;
			var counter = 0;
			for (var x in oProjeckts)
			{
				var curFileName = oProjeckts[x];
				oChangeProjeckt.add(curFileName+"_"+counter,curFileName);
				relProjeckts[curFileName] = oChangeProjeckt.menuItems[curFileName+"_"+counter];
				relProjeckts[curFileName].doAction = function (){
					alert(this.menuIndex);
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
		};
		RQSTProjeckts.request('http://www.wunderbit.com/wbcms/requestProjeckts.php');
	}catch(e)
	{
		throw new Error("menuDefinition.js->requestProjeckts. Error: "+e.message);
	}
}
//function loadFile(sFileNameIn,sFileCategorie)
function loadFile(oFileIndex,sFileCategorie)
{
	try
	{
		//set on the server the file name of the current file is being used.
		var AJAXRqstSetDefaultFile = new AJAXTransport();
		AJAXRqstSetDefaultFile.reply.onReply=function()
		{
			//alert(this.Text);
			try
			{
				var oJSONFile =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			if (oJSONFile.sFilename)
			{
				fileOpenMenuState();
				var fileURL = oJSONFile.sHttpPath+oJSONFile.sFilename;
				currentMenuOption =oFileIndex;
				selectedFile.constructor(fileURL,oJSONFile.sContentType);
			}
		};																 
		AJAXRqstSetDefaultFile.requestSendForm("FileIndex="+oFileIndex+"&FileCategorie="+sFileCategorie,"requestSetFile.php");
	}catch(e)
	{
		throw new Error("menuDefinition.js->loadFile. Error: "+e.message);
	}
}
//
var mainMenu = new Menu("mainMenu","");
mainMenu.add("file","File");
mainMenu.add("view","View");
var oView = mainMenu.menuItems.view;
oView.add("sourceCode","Source Code");
oView.add("editor","Edit View");
var oSourceCode = oView.menuItems.sourceCode;
oSourceCode.doAction = function ()
{
	try
	{
		drawSourceCode();
		var oTextArea = viewSourCode.TextArea.oElement;
		var sSourceCode = selectedFile.editFileSourceCode(oTextArea);
	}catch(e)
	{
		alert("menuDefinition.js->oSourceCode.doAction. Error: "+e.message);
	}
};
var oEditor = oView.menuItems.editor;
oEditor.doAction = function ()
{
	try
	{
		var AJAXRqstGetCurrentFile = new AJAXTransport();
		AJAXRqstGetCurrentFile.reply.onReply=function()
		{
			try
			{
				var oJSONFile =eval("(" +this.Text + ")");
			}catch(e){
				throw new Error("Server Error: "+this.Text);
			}
			drawEditSection();
			fileOpenMenuState();
			currentMenuOption = "EditorView";
			var fileURL = oJSONFile.currentURLFile;
			var contentType = oJSONFile.ContentType;
			var oAPreview = document.getElementById("preview");
			selectedFile.constructor(fileURL,contentType);
			document.getElementById("refFile").innerHTML = fileURL;
		};
		AJAXRqstGetCurrentFile.request("requestGetFile.php");
	}catch(e)
	{
		alert("menuDefinition.js->oEditor.doAction. Error: "+e.message);
	}
};
mainMenu.add("projeckt","Projekt");
mainMenu.add("nodePerformance","Node Performance");
var oNodePerformance = mainMenu.menuItems["nodePerformance"];
oNodePerformance.doAction = function ()
{
	try
	{
		if (currentMenuOption=="ProjectView")
		{
			alert("The projekt configuration file can not run this action. Use the Projekt menu for that!");
			mainMenu.removeMenuHTMLContainers();
			return;
		}
		if(CurrentTreeElement.element == null)
		{
			alert("No Element has been selected on the Tree!/nPlease, select a node.");
			mainMenu.removeMenuHTMLContainers();
			return;
		}
		currentMenuOption = "nodePerformance";
	}catch(e)
	{
		alert("menuDefinition.js->oNodePerformance.doAction. Error: "+e.message);
	}
};
oNodePerformance.add("appendChild","Append new Child");
var oAppendChild = oNodePerformance.menuItems["appendChild"];
oAppendChild.doAction = function ()
{
	try
	{
		currentMenuOption = "oAppendChild";
		var innerHTML = '<form id="formAppendChild">'+
						'<h4>Append Child</h4>'+
						'<div class="viewNodeName">'+
						'<div class="nodeLegend">Node Name:  &lsaquo;'+CurrentTreeElement.getRelatedNodeName()+'&rsaquo;</div>'+
						'<input type="text" name ="NodeName" value=""/>'+
						'</div>'+
						'</form>';
		var oTreeDiv = document.getElementById("tree");
		var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
		var dialog = new dialogWindow(true,innerHTML,320,150,true,"");
		var nElementTop = getHTMLElementTop(Identificator);
		var identWidth = getHTMLElementWidth(Identificator);
		dialog.top = nElementTop-oTreeDiv.scrollTop;
		dialog.left = getHTMLElementLeft(Identificator)+identWidth+5;
		dialog.show();
		dialog.windowContent.doAction= function()
		{
			var oInput = this.getElementsByTagName('input')[0];
			appendChildNode(CurrentTreeElement.element.nodeIndexList,oInput.value.toString());
		};
		mainMenu.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oNodePerformance.doAction. Error: "+e.message);
	}
};
oNodePerformance.add("insertBefore","Insert Element Before");
var oInsertBefore = oNodePerformance.menuItems["insertBefore"];
oInsertBefore.doAction = function ()
{
	try
	{
		currentMenuOption = "insertBefore";
		var innerHTML = '<form id="formAppendChild">'+
		'<h4>Insert Before</h4>'+
		'<div class="viewNodeName">'+
		'<div class="nodeLegend">Node Name:&lsaquo;'+CurrentTreeElement.getRelatedNodeName()+'&rsaquo;</div>'+
		'<input type="text" name ="NodeName" value=""/>'+
		'</div>'+
		'</form>';
		var oTreeDiv = document.getElementById("tree");
		var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
		var dialog = new dialogWindow(true,innerHTML,320,150,true,"");
		var nElementTop = getHTMLElementTop(Identificator);
		var identWidth = getHTMLElementWidth(Identificator);
		dialog.top = nElementTop-oTreeDiv.scrollTop;
		dialog.left = getHTMLElementLeft(Identificator)+identWidth+5;
		dialog.show();
		dialog.windowContent.doAction= function()
		{
			try
			{
				var oInput = this.getElementsByTagName('input')[0];
				insertBeforeElement(CurrentTreeElement.element.nodeIndexList,oInput.value.toString());
			}catch(e)
			{
				alert("menuDefinition.js->oInsertBefore.doAction.dialog.windowContent.doAction Error: "+e.message);
			}
		};
		mainMenu.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oInsertBefore.doAction. Error: "+e.message);
	}
};
oNodePerformance.add("rename","Rename Element");
var oRename = oNodePerformance.menuItems["rename"];
oRename.doAction = function ()
{
	try
	{
		currentMenuOption = "rename";
		var innerHTML = '<form id="formAppendChild">'+
		'<h4>Rename</h4>'+
		'<div class="viewNodeName">'+
		'<div class="nodeLegend">Rename Node: &lsaquo;'+CurrentTreeElement.getRelatedNodeName()+'&rsaquo;</div>'+
		'<input type="text" name ="NodeName" value="'+CurrentTreeElement.getRelatedNodeName()+'"/>'+
		'</div>'+
		'</form>';
		var oTreeDiv = document.getElementById("tree");
		var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
		var dialog = new dialogWindow(true,innerHTML,320,150,true,"");
		var nElementTop = getHTMLElementTop(Identificator);
		var identWidth = getHTMLElementWidth(Identificator);
		dialog.top = nElementTop-oTreeDiv.scrollTop;
		dialog.left = getHTMLElementLeft(Identificator)+identWidth+5;
		dialog.show();
		dialog.windowContent.doAction= function()
		{
			try
			{
				var oInput = this.getElementsByTagName('input')[0];
				renameNode(CurrentTreeElement.element.nodeIndexList,oInput.value.toString());
			}catch(e)
			{
				alert("menuDefinition.js->oRename.doAction.dialog.windowContent.doAction Error: "+e.message);
			}		
		};
		mainMenu.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oRename.doAction. Error: "+e.message);
	}
};
oNodePerformance.add("remove","Remove Element");
var oRemove = oNodePerformance.menuItems["remove"];
oRemove.doAction = function ()
{
	try
	{
		currentMenuOption = "remove";
		var innerHTML = '<form id="formAppendChild">'+
		'<h4>Remove</h4>'+
		'<div class="viewNodeName">'+
		'<div class="nodeLegend">Remove Node: &lsaquo;'+CurrentTreeElement.getRelatedNodeName()+'&rsaquo;</div>'+
		'<input type="text" name ="NodeName" value="'+CurrentTreeElement.getRelatedNodeName()+'" disabled="true"/>'+
		'</div>'+
		'</form>';
		var oTreeDiv = document.getElementById("tree");
		var Identificator = CurrentTreeElement.element.childNodes[0].childNodes[1];
		var dialog = new dialogWindow(true,innerHTML,320,150,true,"");
		var nElementTop = getHTMLElementTop(Identificator);
		var identWidth = getHTMLElementWidth(Identificator);
		dialog.top = nElementTop-oTreeDiv.scrollTop;
		dialog.left = getHTMLElementLeft(Identificator)+identWidth+5;
		dialog.show();
		dialog.windowContent.doAction= function()
		{
			try
			{
				var oInput = this.getElementsByTagName('input')[0];
				removeElement(CurrentTreeElement.element.nodeIndexList,oInput.value.toString());
			}catch(e)
			{
				alert("menuDefinition.js->oRemove.doAction.dialog.windowContent.doAction Error: "+e.message);
			}		
		};
		mainMenu.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oRename.doAction. Error: "+e.message);
	}
};
//
mainMenu.add("help","Help");
mainMenu.add("window","Window");
var oWindow = mainMenu.menuItems.window;
oWindow.add("defaultView","Default View");
var oDefaultView = oWindow.menuItems.defaultView;
oWindow.add("previewView","Preview View");
var oPreviewView = oWindow.menuItems.previewView;
oWindow.add("treeView","Tree View");
var oTreeView = oWindow.menuItems.treeView;
oWindow.add("cascadeView","Cascade View");
var oCascadeView = oWindow.menuItems.cascadeView;
oDefaultView.doAction = function(){
	try
	{
		view1();
	}catch(e)
	{
		alert("menuDefinition.js->oDefaultView.doAction. Error: "+e.message);
	}
};
oPreviewView.doAction = function(){
	try
	{
		view2();
	}catch(e)
	{
		alert("menuDefinition.js->oPreviewView.doAction. Error: "+e.message);
	}
};
oTreeView.doAction = function(){
	try
	{
		view4();
	}catch(e)
	{
		alert("menuDefinition.js->oTreeView.doAction. Error: "+e.message);
	}
};
oCascadeView.doAction = function(){
	try
	{
		view3();
	}catch(e)
	{
		alert("menuDefinition.js->oCascadeView.doAction . Error: "+e.message);
	}
};
//
oMenuFile = mainMenu.menuItems.file;
oMenuFile.add("new","New");
oMenuFile.add("open","Open");
oMenuFile.add("changeDom","Change without saving");
var oChange = oMenuFile.menuItems["changeDom"];

oChange.doAction = function ()
{
	try
	{
		if (currentMenuOption=="ProjectView")
		{
			alert("The projekt configuration file can not run this action. Use the Projekt menu for that!");
		}else
		{
			currentMenuOption = "changeDom";
			changeCurrentDom();
			selectedFile.changed=true;
		}
		oMenuFile.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oChange.doAction . Error: "+e.message);
	}
};

oMenuFile.add("save","Save");
var oSave = oMenuFile.menuItems["save"];

oSave.doAction = function ()
{
	try
	{
		currentMenuOption = "save";
		selectedFile.changed=false;
		alert("save");
		oMenuFile.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oSave.doAction . Error: "+e.message);
	}
};
oMenuFile.add("saveUs","...save us");
var oSaveUs = oMenuFile.menuItems["saveUs"];

oSaveUs.doAction = function ()
{
	try
	{
		currentMenuOption = "saveUs";
		oMenuFile.removeMenuHTMLContainers();
	}catch(e)
	{
		alert("menuDefinition.js->oSaveUs.doAction . Error: "+e.message);
	}
};
//Begin File menu definition
//new
		var oNew = oMenuFile.menuItems["new"];

		oNew.add("newDataFile","Data File");

		var oNewDataFile = oNew.menuItems["newDataFile"];
		oNewDataFile.onPress = true;
		oNewDataFile.doAction = function ()
		{
			try
			{
				currentMenuOption = "newDataFile";
				var dialog = new dialogWindow(true,"",790,590,false,'http://www.wunderbit.com/wbcms/mainXMLFiles.html');
				//var dialog = new dialogWindow(true,"<b>hola</b>",790,590,false,"");
				dialog.show();
				dialog.windowContainer.afterClose=function()
				{
					try
					{
						this.callToPreview = function()
						{
							try
							{
								var innerHTML = "<form>"+
								"<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>"+
								"</form>";
								var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
								dialog.show();
								dialog.windowContent.doAction= function()
								{
									try
									{
										oProjektView.doAction();
									}catch(e)
									{
										alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose.callToPreview Error: "+e.message);
									}
								};
								}catch(e)
								{
									alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: "+e.message);
								}
						};
						//
						var oSelf = this;
						var RQSTStoreProjekt = new AJAXTransport();
						RQSTStoreProjekt.reply.onReply=function()
						{
							try{
								try
								{
									var oAnswer =eval("(" +this.Text + ")");
								}catch(e){
									throw new Error("Server Error: "+this.Text);
								}
									oSelf.callToPreview();
							}catch(e){
								alert(e.description+", \n this.Text: "+this.Text);
							}
						};
						RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
					}catch(e)
					{
						alert("menuDefinition.js->oNewDataFile.doAction.dialog.windowContainer.afterClose . Error: "+e.message);
					}
				};
				oMenuFile.removeMenuHTMLContainers();
			}catch(e)
			{
				alert("menuDefinition.js->oNewDataFile.doAction. Error: "+e.message);
			}
		};
		oNew.add("newTemplate","Template");

		var oNewTemplate = oNew.menuItems["newTemplate"];
		oNewTemplate.onPress = true;
		oNewTemplate.doAction = function ()
		{
			try
			{
				currentMenuOption = "newTemplate";
				var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/mainTemplates.html');
				dialog.show();
				dialog.windowContainer.afterClose=function()
				{
					try
					{
						this.callToPreview = function()
						{	
							try
							{
								var innerHTML = "<form>"+
								"<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>"+
								"</form>";
								var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
								dialog.show();
								dialog.windowContent.doAction= function()
								{
									try
									{
										oProjektView.doAction();
									}catch(e)
									{
										alert("menuDefinition.js->oNewTemplate.doAction.dialog.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: "+e.message);
									}
								};
							}catch(e)
							{
								alert("menuDefinition.js->oNewTemplate.doAction.dialog.windowContainer.afterClose.callToPreview Error: "+e.message);
							}
						};
						//
						var oSelf = this;
						var RQSTStoreProjekt = new AJAXTransport();
						RQSTStoreProjekt.reply.onReply=function()
						{
							try{
								try
								{
									var oAnswer =eval("(" +this.Text + ")");
								}catch(e){
									throw new Error("Server Error: "+this.Text);
								}
								oSelf.callToPreview();
							}catch(e){
								alert(e.description+", \n this.Text: "+this.Text);
							}
						};
						RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
					}catch(e)
					{
						alert("menuDefinition.js->oNewTemplate.doAction.dialog.windowContainer.afterClose Error: "+e.message);
					}
				};
				oMenuFile.removeMenuHTMLContainers();
			}catch(e)
			{
				alert("menuDefinition.js->oNewTemplate.doAction. Error: "+e.message);
			}
		};
		oNew.add("newPage","Page");

		var oNewPage = oNew.menuItems["newPage"];
		oNewPage.onPress = true;
		oNewPage.doAction = function ()
		{
			try
			{
				currentMenuOption = "newPage";
				var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/mainPages.html');
				dialog.show();
				dialog.windowContainer.afterClose=function()
				{
					try
					{
						this.callToPreview = function()
						{	
							try
							{
								var innerHTML = "<form>"+
								"<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>"+
								"</form>";
								var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
								dialog.show();
								dialog.windowContent.doAction= function()
								{
									try
									{
										oProjektView.doAction();
									}catch(e)
									{
										alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: "+e.message);
									}
								};
							}catch(e)
							{
								alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose.callToPreview Error: "+e.message);
							}
						};
						//
						var oSelf = this;
						var RQSTStoreProjekt = new AJAXTransport();
						RQSTStoreProjekt.reply.onReply=function()
						{
							try{
								try
								{
									var oAnswer =eval("(" +this.Text + ")");
								}catch(e){
									throw new Error("Server Error: "+this.Text);
								}
								oSelf.callToPreview();
							}catch(e){
								alert(e.description+", \n this.Text: "+this.Text);
							}
						};
						RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
					}catch(e)
					{
						alert("menuDefinition.js->oNewPage.doAction.windowContainer.afterClose Error: "+e.message);
					}
				};
				oMenuFile.removeMenuHTMLContainers();
			}catch(e)
			{
				alert("menuDefinition.js->oNewPage.doAction. Error: "+e.message);
			}
		};
		
		oNew.add("newRelDataFiles","Relations of Data Files with Pages");
		var oNewRelDataFiles = oNew.menuItems["newRelDataFiles"];
		oNewRelDataFiles.doAction = function ()
		{
			try
			{
				currentMenuOption = "newRelDataFiles";
				var dialog = new dialogWindow(true,"",800,600,false,'http://www.wunderbit.com/wbcms/relPageData.html');
				//var dialog = new dialogWindow(true,"",790,590,true,false,'http://www.wunderbit.com/wbcms/mainPages.html');
				dialog.show();
				dialog.windowContainer.afterClose=function()
				{
					try
					{
						this.callToPreview = function()
						{	
							try
							{
								var innerHTML = "<form>"+
								"<div class='nodeLegend'>Would you like to load the configuration file to see the last modifications?</div>"+
								"</form>";
								var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
								dialog.show();
								dialog.windowContent.doAction= function()
								{
									try
									{
										oProjektView.doAction();
									}catch(e)
									{
										alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose.callToPreview.dialog.windowContent.doAction Error: "+e.message);
									}
								};
							}catch(e)
							{
								alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose.callToPreview Error: "+e.message);
							}
						};
						//
						var oSelf = this;
						var RQSTStoreProjekt = new AJAXTransport();
						RQSTStoreProjekt.reply.onReply=function()
						{
							try{
								try
								{
									var oAnswer =eval("(" +this.Text + ")");
								}catch(e){
									throw new Error("Server Error: "+this.Text);
								}
								oSelf.callToPreview();
							}catch(e){
								alert(e.description+", \n this.Text: "+this.Text);
							}
						};
						RQSTStoreProjekt.request('http://www.wunderbit.com/wbcms/saveProjektInToXML.php');
					}catch(e)
					{
						alert("menuDefinition.js->oNewRelDataFiles.doAction.dialog.windowContainer.afterClose Error: "+e.message);
					}
				};
				oMenuFile.removeMenuHTMLContainers();
			}catch(e)
			{
				alert("menuDefinition.js->oNewRelDataFiles.doAction. Error: "+e.message);
			}
		};
//open
		var oOpen = oMenuFile.menuItems["open"];
		oOpen.add("_projeckt","Projeckt");
		var oProjekt = oOpen.menuItems["_projeckt"];
		oProjekt.add("changeProjeckt","Other Projekt");
		var oChangeProjeckt = oProjekt.menuItems["changeProjeckt"];
		var relProjeckts = new Object();
		oChangeProjeckt.add("emptyChangeProjeckt","There are no more Projekts in the work folder!");
		oChangeProjeckt.onSelect = function ()
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
				alert("menuDefinition.js->oChangeProjeckt.onSelect. Error: "+e.message);
			}
		};
		oProjekt.add("openTemplate","Template");
		var oOpenTemplate = oProjekt.menuItems["openTemplate"];
		oOpenTemplate.add("emptyTemplate","There are not Templates related with this Projekt!");
		oOpenTemplate.onSelect = function ()
		{
			try
			{
				if (document.getElementById("_"+oOpenTemplate.menuIndex))
				{
					delete(oOpenTemplate.menuItems["emptyTemplate"]);
					oOpenTemplate.removeMenuHTMLContainers();
					requestTemplates();
				}
			}catch(e)
			{
				alert("menuDefinition.js->oOpenTemplate.onSelect. Error: "+e.message);
			}
		};
		var relTemplates = new Object();
		oProjekt.add("openPages","Pages");
		var oOpenPages = oProjekt.menuItems["openPages"];
		oOpenPages.add("emptyPage","There are not pages related with this Projekt!");
		oOpenPages.onSelect = function ()
		{
			try
			{
				if (document.getElementById("_"+oOpenPages.menuIndex))
				{
					delete(oOpenPages.menuItems["emptyPage"]);
					oOpenPages.removeMenuHTMLContainers();
					requestPages();
				}
			//oMenuFile.removeMenuHTMLContainers();
			}catch(e)
			{
				alert("menuDefinition.js->oOpenPages.onSelect. Error: "+e.message);
			}
		};
		var relPages = new Object();
//
		oProjekt.add("openDataFiles","Data Files");
		var oOpenDataFiles = oProjekt.menuItems["openDataFiles"];
		oOpenDataFiles.add("emptyDataFile","There are not Data Files (XML Files) related with this Projekt!");
		oOpenDataFiles.onSelect = function ()
		{
			try
			{
				if (document.getElementById("_"+oOpenDataFiles.menuIndex))
				{
					delete(oOpenDataFiles.menuItems["emptyDataFile"]);
					oOpenDataFiles.removeMenuHTMLContainers();
					requestXMLFiles();
				}
			}catch(e)
			{
				alert("menuDefinition.js->oOpenDataFiles.onSelect. Error: "+e.message);
			}
		};
		var relDataFiles = new Object();
//projekt
	oMenuProjekt = mainMenu.menuItems.projeckt;
	oMenuProjekt.add("projektView","View");
	oMenuProjekt.add("projektTemplates","Templates");
	oMenuProjekt.add("projektPages","Pages");
	oMenuProjekt.add("dataRelation","Data Relation");
	oMenuProjekt.add("XMLFiles","XMLFiles");
	oMenuProjekt.add("changeProjekt","Change Projekt");
	
	oProjektView = oMenuProjekt.menuItems.projektView;
	
	oProjektTemplates = oMenuProjekt.menuItems.projektTemplates;
	oProjektTemplates.add("templatesMaintanance","Maintanance");
	oTempMaintanance =oProjektTemplates.menuItems.templatesMaintanance;
	oTempMaintanance.doAction= function()
	{
		try
		{
			oNewTemplate.doAction();
			oMenuProjekt.removeMenuHTMLContainers();
		}catch(e)
		{
			alert("menuDefinition.js->oTempMaintanance.doAction. Error: "+e.message);
		}
	};
	oProjektPages = oMenuProjekt.menuItems.projektPages;
	oProjektPages.add("pagesMaintanance","Maintanance");
	oPageMaintanance =oProjektPages.menuItems.pagesMaintanance;
	oPageMaintanance.doAction= function()
	{
		try
		{
			oNewPage.doAction();
			oMenuProjekt.removeMenuHTMLContainers();
		}catch(e)
		{
			alert("menuDefinition.js->oPageMaintanance.doAction. Error: "+e.message);
		}
	};
	oProjektDataRelation = oMenuProjekt.menuItems.dataRelation;
	oProjektDataRelation.add("dataRelation","Maintanance");
	oDataRelMaintanance =oProjektDataRelation.menuItems.dataRelation;
	oDataRelMaintanance.doAction= function()
	{
		try
		{
			oNewRelDataFiles.doAction();
			oMenuProjekt.removeMenuHTMLContainers();
		}catch(e)
		{
			alert("menuDefinition.js->oDataRelMaintanance.doAction. Error: "+e.message);
		}
	};
	
	oProjektXMLFiles = oMenuProjekt.menuItems.XMLFiles;
	oProjektXMLFiles.add("XMLFilesMaintanance","Maintanance");
	oXMLFilesMaintanance =oProjektXMLFiles.menuItems.XMLFilesMaintanance;
	oXMLFilesMaintanance.doAction= function()
	{
		try
		{
			oNewDataFile.doAction();
			oMenuProjekt.removeMenuHTMLContainers();
		}catch(e)
		{
			alert("menuDefinition.js->oXMLFilesMaintanance.doAction. Error: "+e.message);
		}
	};
	oProjektView.doAction = function ()
	{
		try
		{
			oMenuProjekt.removeMenuHTMLContainers();
			var AJAXRQSTProjektView = new AJAXTransport();
			AJAXRQSTProjektView.reply.onReply=function()
			{
				try
				{
					try
					{
						var projektViewText = this.Text;
						var oProjektViewInfo = eval("(" + projektViewText + ")");
					}catch(e){
						throw new Error("Server Error: "+this.Text);
					}
					var sXMLFile = oProjektViewInfo.projektXMLFile;
					var sProjektName = oProjektViewInfo.projektName;
					var sContentType = oProjektViewInfo.contentType;
					currentMenuOption = "ProjectView";
					loadFile(sXMLFile,"ConfigFile");
				}catch(e)
				{
					alert("menuDefinition.js->oProjektView.doAction.AJAXRQST.ProjektView.reply.onReply Error: "+e.message);
				}
			};
			AJAXRQSTProjektView.request("http://www.wunderbit.com/wbcms/getProjectViewXML.php");
		}catch(e)
		{
			alert("menuDefinition.js->oProjektView.doAction . Error: "+e.message);
		}
	};
	oChangeProjekt = oMenuProjekt.menuItems.changeProjekt;
	oChangeProjekt.doAction = function ()
	{
		try
		{
			viewLoadProject.draw();
			saved=false;
		}catch(e)
		{
			alert("menuDefinition.js->oChangeProjekt.doAction. Error: "+e.message);
		}
	};
//End Menu Projekt
//Begin Menu Help
	oMenuHelp = mainMenu.menuItems.help;
	oMenuHelp.add("helpAbout","About");
	
	oHelpAbout = oMenuHelp.menuItems.helpAbout;
	oHelpAbout.doAction = function ()
	{
		try
		{
			alert("oMenuProjekt.menuItems.helpAbout");
			oMenuHelp.removeMenuHTMLContainers();
		}catch(e)
		{
			alert("menuDefinition.js->oHelpAbout.doAction. Error: "+e.message);
		}
	};
//End Menu Help
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
		oSaveUs.disable();
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
	oMenuHelp.enable();
	oSave.disable();
	oChange.disable();
	//window
	oDefaultView.enable();
	oPreviewView.enable();
	oTreeView.enable();
	oCascadeView.enable();
	}catch(e)
	{
		alert("menuDefinition.js->defaultMenuState. Error: "+e.message);
	}
	
}
function fileOpenMenuState()
{
	try
	{
		defaultMenuState();
		oNodePerformance.enable();
		oView.enable();
		oSave.enable();
		oChange.enable();
		oDefaultView.enable();
		oPreviewView.enable();
		oTreeView.enable();
		oCascadeView.enable();
	}catch(e)
	{
		alert("menuDefinition.js->fileOpenMenuState. Error: "+e.message);
	}
}
function editProjektOpenMenuState()
{
	try
	{
		defaultMenuState();
	}catch(e)
	{
		alert("menuDefinition.js->editProjektOpenMenuState. Error: "+e.message);
	}
}