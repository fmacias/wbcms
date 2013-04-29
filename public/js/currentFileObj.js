var selectedFile =
{
	previousFile:null,
	file:null,//url
	fileName:null,
	iframeContainer:null,
	LoadMode:"load", //or reload or null
	contentType:null,
	fileExtension:null,
	originalDOM:null,
	currentDOM:null,
	XMLRelNodes:"",
	sIdXMLElement:0,
	changed:false,
	EnableMetas:false,
	EnableScripts:false,
	ParserMimeType:null,
	charSet:null,
	parseringDOM:null,
	curHTMLCharSet:"UTF-8", //default one
	getFile:function()
	{
		try
		{
			var oSelf = this;
			var AJAXrqstOriginalDOM = new AJAXTransport();
			AJAXrqstOriginalDOM.reply.onReply=function()
			{
				try
				{
					CurrentTreeElement.reset();
					CurrentPreviewElement.reset();
					//drawEditSection();
					oSelf.originalDOM = this.XML;
					oSelf.loadFile();
					//document.getElementById("refFile").innerHTML = oSelf.file;
					oTreeContainer.container.setWindowTitle(oSelf.file);
					oPreviewContainer.container.setWindowTitle(oSelf.file);
					oSelf.changed=false;
				}catch(e)
				{
					throw new Error("\nselectedFile.getFile.AJAXrqstOriginalDOM.reply.onReply fails. Error "+e.message);
				}
			};
                        alert("get file:"+this.file);
                        AJAXrqstOriginalDOM.requestSendForm("fileName="+this.file,"freedom/getfile");
			//AJAXrqstOriginalDOM.requestSendForm("fileName="+this.file,"getFile.php");
		}catch(e)
		{
			throw new Error("\nselectedFile.getFile fails. Error: "+e.message+", requested File: "+this.file);
		}
	},
	//constructor:function(fileName_in,contentType)
	setFileProperties:function(oJSONFile)
	{
		
		var fileType = oJSONFile.sContentType;
		var regex = /\w+$/;
		var sFileExtensionType = fileType.match(regex)[0];
		
		this.file=oJSONFile.sHttpPath+oJSONFile.sFilename;//url
		this.contentType = oJSONFile.sContentType;
		//this.fileExtension = oJSONFile.fileExtension.toUpperCase();
		this.fileExtension = sFileExtensionType.toUpperCase();
		this.fileName = oJSONFile.sFilename;
		this.ParserMimeType = oJSONFile.ParserMimeType;
		this.charSet = oJSONFile.charSet;
	},
	constructor:function(oJSONFiles)
	{
		try
		{
			this.setFileProperties(oJSONFiles);
			var load = true;
			if (this.changed==true)
			{
				load = false;
				var oSelf = this;
				var innerHTML = "<form>"+
				"<div class='nodeLegend'>The File currently loaded has not be saved.<p/>Are you sure you wan't to perform this action bevor saving the file bevor?</div>"+
				"</form>";
				var dialog = new floatWindow(null,null,null,900,400);
				dialog.draw(innerHTML,null,true,true);
				dialog.doAction= function()
				{
					oSelf.getFile();
				};
			}
			if (load)
			{
				this.getFile();
			}
		}catch(e)
		{
			var innerHTML = "<p>selectedFile.constructor Error:</p>";
			innerHTML += "<p>"+e.message+"</p>";
			notificationWindow.create(innerHTML);
			//window.alert("\nselectedFile.constructor fails. Error "+e.message);
		}
	},
	setIframeContainer:function(oIFrameIn)
	{
		try
		{
			this.iframeContainer = oIFrameIn; 
		}catch(e)
		{
			throw new Error("\nselectedFile.setIframeContainer fails. Error "+e.message);
		}	
	},
	setCurrentDOM:function()
	{
		if (this.fileExtension=="XML")
		{
			//nothing
		}else{
			var contentDocument = this.getIFrameDocument();
			if (contentDocument)
			{
				this.currentDOM = contentDocument;
			}
		}
	},
	loadFile:function()
	{
		try
		{
			oTreeContainer.initTree();
			oPreviewContainer.addIFrame();
			var iframeContainer = oPreviewContainer.getIFrame();
			this.setIframeContainer(iframeContainer);
			var IFrame = this.iframeContainer;
			if (this.fileExtension=="XML")
			{
				this.setCurrentDOMFromRequest();
				this.reloadXMLPreview();
			}else if ((this.fileExtension=="HTML")||(this.fileExtension=="HTM")||(this.fileExtension=="XHTML"))
				{
							IFrame.setAttribute("src", this.file);
							if (window.addEventListener)
							{
								IFrame.addEventListener("load",onFrameLoad, false); //invoke function
							}else if (window.attachEvent)
							{
								IFrame.attachEvent("onload", onFrameLoad); //invoke function 
							}
				}
		}catch(e)
		{
			throw new Error("\nselectedFile.loadFile fails. Error "+e.message);
		}	
	},
	reset:function()
	{
		try
		{
			this.previousFile=null;
			this.file=null;
		}catch(e)
		{
			throw new Error("\nselectedFile.reset fails. Error "+e.message);
		}	
	},
	setCurrentDOMFromRequest:function()
	{
		try
		{
			this.currentDOM = this.originalDOM;
			oTreeContainer.loadTree();
			//loadTree();
		}catch(e)
		{
			throw new Error("\nselectedFile.setCurrentDOMFromRequest fails. Error "+e.message);
		}	
	},
	CreateDataFile:function()
	{
		try
		{
			if ((this.fileExtension=="HTML")||(this.fileExtension=="HTM"))
			{
				this.XMLRelNodes = "";
				var sIdXMLElement = 0;
				this.extractRelateTextNodes(this.currentDOM.body);
				this.sIdXMLElement =0;
				this.XMLRelNodes = '<?xml version="1.0" encoding="UTF-8"?><NODES>'+this.XMLRelNodes+'</NODES>';
				var AJAXRqstCreateDataFile = new AJAXTransport();
				AJAXRqstCreateDataFile.reply.onReply=function()
				{
					try
					{
						replyCreateDataFile(AJAXRqstCreateDataFile.reply);
					}catch(e)
					{
						throw new Error("\nselectedFile.CreateDataFile.AJAXRqstCreateDataFile.reply.onReply fails. Error "+e.message);
					}
				};
				AJAXRqstCreateDataFile.requestSendForm("sData="+this.XMLRelNodes ,RQST_setDataFile);
				oTreeContainer.loadTree();
				//loadTree();//function of tree.js
			}else{
				//window.alert("this operation is only for text/html shema available");
				var innerHTML = "<p>selectedFile.CreateDataFile Error:</p>";
				innerHTML += "<p>this operation is only for text/html shema available</p>";
				notificationWindow.create(innerHTML);
			}
		}catch(e)
		{
			throw new Error("\nselectedFile.CreateDataFile fails. Error "+e.message);
		}	
	},
	extractRelateTextNodes:function(Node_in)
	{
		try
		{
			if (Node_in.nodeType)
			{
				if (Node_in.nodeType==1)//is one Element
				{
					for(var x=0;x<Node_in.childNodes.length;x++)
					{
						 this.extractRelateTextNodes(Node_in.childNodes[x]);
					}
				}else if (Node_in.nodeType==3)//Text node
				{
					var selfValue= Node_in.nodeValue;
					selfValue = selfValue.trim();
					//selfValue.rtrim();
					selfValue =selfValue.delNEL();
					selfValue =selfValue.delTAB();
					if (selfValue)
					{
						this.XMLRelNodes +='<NODE id="relNode'+this.sIdXMLElement.toString()+'">'+Node_in.nodeValue+'</NODE>';
						var oParent = Node_in.parentNode;
						var oNewElement = document.createElement("RELATEDNODE");
						oNewElement.innerHTML = Node_in.nodeValue;
						var oNewAtt = document.createAttribute("id");
						oNewAtt.nodeValue = "relNode"+this.sIdXMLElement.toString();
						oNewElement.setAttributeNode(oNewAtt);
						oParent.replaceChild(oNewElement,Node_in);
						this.sIdXMLElement++;
					}
				}
			}
		}catch(e)
		{
			throw new Error("\nselectedFile.extractRelateTextNodes fails. Error "+e.message);
		}	
	},
	editFileSourceCode:function(oTextArea)
	{
		try
		{
				oTextArea.value = "";
				var RQSTSource = new AJAXTransport();
				//
				var aHeaders = new Array();
				var contentType = new XMLHttpHeader("Content-type", this.contentType);
				var charSet = new XMLHttpHeader("charset", this.charSet);
				aHeaders.push(contentType);
				aHeaders.push(charSet);
				RQSTSource.reply.onReply=function()
				{
					try
					{
					//	window.alert(this.Text);
						oTextArea.value = this.Text;
					}catch(e){
						var innerHTML = "<p>selectedFile.editFileSourceCode Error:</p>";
						innerHTML += "<p>"+this.Text+"</p>";
						notificationWindow.create(innerHTML);
						//window.alert(this.Text);
					}
				};
				RQSTSource.requestSendForm("FileName="+this.file,"freedom/requestsourcecode",aHeaders);

		}catch(e)
		{
			throw new Error("\nselectedFile.editFileSourceCode fails. Error "+e.message);
		}	
	},
	setEnableMetas:function(Boolean_in)
	{
		try
		{
			if (Boolean_in)
			{
				this.EnableMetas=true;
			}else
			{
				this.EnableMetas=false;
			}
			this.availableMetaTags();
		}catch(e)
		{
			throw new Error("\nselectedFile.setEnableMetas fails. Error "+e.message);
		}	
	},
	setEnableScripts:function(Boolean_in)
	{
		try
		{
			if (Boolean_in)
			{
				this.EnableScripts=true;
			}else{
				this.EnableScripts=false;
			}
			this.avaiableScriptTags();
		}catch(e)
		{
			throw new Error("\nselectedFile.setEnableScripts fails. Error "+e.message);
		}	
	},
	availableMetaTags:function()
	{
		try
		{
			if (this.fileExtension=="XML")
			{
				return;
			}
			if (!(this.currentDOM))
			{
				var innerHTML = "<p>selectedFile.availableMetaTags Error:</p>";
				innerHTML += "<p>selectedFile.CurrentDOM has not been asigned</p>";
				notificationWindow.create(innerHTML);
				//window.alert("selectedFile.CurrentDOM has not been asigned");
				return;
			}
			var metas = this.currentDOM.getElementsByTagName("meta");
			for (var x=0;x<metas.length;x++)
			{
				var currentMeta = metas[x];
				if (currentMeta.attributes.length>0)
				{
					var aAttToTreat = new Array();
					var attHttp_equiv = currentMeta.getAttribute("http-equiv");
					//The content-type will never be treated
					if (attHttp_equiv != "Content-Type")
					{
							for (var y=0;y<currentMeta.attributes.length;y++)
							{
								var currentAttribute = currentMeta.attributes[y];
								aAttToTreat.push(currentAttribute);
							}
	
						for (var z=0;z<aAttToTreat.length;z++)
						{
							var attName = aAttToTreat[z].nodeName;
							var attValue = aAttToTreat[z].nodeValue;
							var currentAttribute = aAttToTreat[z];
							//if EnableMetas
							if (this.EnableMetas)
							{
								//if disabled
								if (attName.search("_disabled")!=-1)//if found
								{
										//create new attribute without _disabled at the end.
										var newAttName = attName.replace(/_disabled$/,"");
										var attribute = this.currentDOM.createAttribute(newAttName);
										attribute.value = attValue;
										currentMeta.setAttributeNode(attribute);
										//currentMeta.replaceChild(attribute,currentAttribute);
										//								
										//remove original one.
										currentMeta.removeAttributeNode(currentAttribute);
								}
							}else
							{
								if (attName.search("_disabled")==-1)//if not found
								{		
									//create new attribute with _disabled at the end.
									var newAttName = attName+"_disabled";
									var attribute = this.currentDOM.createAttribute(newAttName);
									attribute.value = attValue;
									currentMeta.setAttributeNode(attribute);
									//currentMeta.replaceChild(attribute,currentAttribute);
									//remove original one.
									currentMeta.removeAttributeNode(currentAttribute);
								}
							}
						}
					}
				}
			}
	}catch(e)
	{
		throw new Error("\nselectedFile.setEnableScripts fails. Error "+e.message);
	}	
	},
	avaiableScriptTags:function()
	{
		try
		{
			if (this.fileExtension=="XML")
			{
				return;
			}
			if (!(this.currentDOM))
			{
				//window.alert("selectedFile.CurrentDOM has not been asigned");
				var innerHTML = "<p>selectedFile.avaiableScriptTags Error:</p>";
				innerHTML += "<p>selectedFile.CurrentDOM has not been asigned</p>";
				notificationWindow.create(innerHTML);
				return;
			}
			var scripts = this.currentDOM.getElementsByTagName("script");
			for (var x=0;x<scripts.length;x++)
			{
				var currentScript = scripts[x];
				//if (currentScript.attributes.length>0)
				//{
					var currentTypeAttribute = currentScript.getAttributeNode("type");
					if (currentTypeAttribute)
					{
						var currenAttribute = currentTypeAttribute;
						var attName = currenAttribute.nodeName;//always the type
						var attValue = currenAttribute.nodeValue;
						if (this.EnableScripts)
						{
							var type_disabledAtt = currentScript.getAttributeNode("type_disabled");
							if (type_disabledAtt)
							{
								var attNameDisabled = type_disabledAtt.nodeName;//always the type
								var attValueDisabled = type_disabledAtt.nodeValue;
								currentScript.removeAttribute(attNameDisabled);
								currenAttribute.nodeValue = attValueDisabled;
							}else
							{
								if (attValue=="disabled")
								{
									currentScript.removeAttribute(currenAttribute);
								}
							}
						}else
						{
							var typeDisableValue = currentScript.getAttributeNode("type_disabled");
							if (!(typeDisableValue))
							{
								var attribute = this.currentDOM.createAttribute("type_disabled");
								attribute.value = attValue;
								currentScript.setAttributeNode(attribute);
								currenAttribute.nodeValue = "disabled";
							}	
						}
					}else{
						if (this.EnableScripts)
						{
							//nothing
						}else{
							var attribute = this.currentDOM.createAttribute("type");
							attribute.value = "disabled";
							currentScript.setAttributeNode(attribute);
						}
					}
				//}
			}
		}catch(e)
		{
			throw new Error("\nselectedFile.avaiableScriptTags fails. Error "+e.message);
		}	
	},
	getIFrameDocument:function()
	{
		var contentDocument = null;
		if (this.iframeContainer.contentDocument)
		{
			contentDocument = this.iframeContainer.contentDocument;
		}else if (this.iframeContainer.contentWindow){
			contentDocument = this.iframeContainer.contentWindow.document;
		}
		if (contentDocument == null)
		{
			throw new Error("You can not run this application. Your navigator does not support the current DOM specifications!");
		}
		return contentDocument;
	},
	save:function()
	{
		try
		{
//
			var bSourceView = (oSourceCodeEditor.container.oElement.style.display=="block")?true:false;
			var bEditView = (oTreeContainer.container.oElement.style.display=="block")?true:false;
//						
			this.setEnableMetas(true); 
			this.setEnableScripts(true);
//
			CurrentPreviewElement.removeHightLight();
			var oSelf = this;
			var fileType = this.contentType;
			var regex = /\w+$/;
			var sFileExtensionType = fileType.match(regex)[0];
			//
			if (bEditView)
			{
				if (this.contentType == "application/xhtml+xml" )
				{
					this.saveXHTML();
				}else if (sFileExtensionType.toUpperCase() == "XML" )
				{
					this.saveXML();
				}else if ( sFileExtensionType.toUpperCase() == "HTML" )
				{
					this.setCurHTMLCharSet();
					if (this.curHTMLCharSet != this.charSet)
					{
						var AJAXRqstUpgradeFileEncoding = new AJAXTransport();
						AJAXRqstUpgradeFileEncoding.reply.onReply=function()
						{
							try
							{
								var oJSONFile = eval("(" +this.Text + ")");
							}catch(e)
							{
								var innerHTML = "<p>Error:</p>";
								innerHTML += "<p>"+this.Text+"</p>";
								notificationWindow.create(innerHTML);
								return;
							}
							oSelf.setFileProperties(oJSONFile);
							oSelf.saveHTML();
						};
						AJAXRqstUpgradeFileEncoding.requestSendForm("charset="+this.curHTMLCharSet,"changeCharSet.php");
					}else
					{
						this.saveHTML();
					}
				}
			}else if(bSourceView)
			{
				this.saveSourceCode();
			}else
			{
				throw new Error("Unexpected Error: selectedFile.save() fails: no View mode available!");
			}
			this.setEnableMetas(ENABLE_METAS); 
			this.setEnableScripts(ENABLE_SCRIPTS);
		}catch(e)
		{
			throw new Error("Save fails: error: "+e.message);
		}
	},
	getDOMToSend:function()
	{
		try
		{
			var newDOM = getEmptyXMLDOM();
			var currentDocumentElement = CreateDOMElements(selectedFile.currentDOM.documentElement,null,newDOM);
			//
			var PI = newDOM.createProcessingInstruction("xml", "version='1.0' encoding='"+this.charSet+"'");
			newDOM.appendChild(currentDocumentElement);
			//
			//newDOM.insertBefore(PI,newDOM.firstChild);
			return newDOM;
		}catch(e){
			var innerHTML = "<p>selectedFile.getDOMToSend Error:</p>";
			innerHTML += "<p>"+e.message+"</p>";
			notificationWindow.create(innerHTML);
			//window.alert("getDOMToSend: fails: error: "+e.message);
		}
		
	},
	reloadXMLPreview:function()
	{
		var IFrame = this.iframeContainer;
		var AJAXTempTreeFile = new AJAXTransport();
		AJAXTempTreeFile.reply.onReply=function()
		{
			try
			{
				try
				{
					var oJSONFile =eval("(" +this.Text + ")");
				}catch(e){
					throw new Error("Server Error: "+this.Text);
				}
				IFrame.setAttribute("src", oJSONFile.sHttpPath+oJSONFile.sFilename);
				if (window.addEventListener)
				{
					IFrame.addEventListener("load",afterXMLLoad, false); //invoke function
				}else if (window.attachEvent)
				{
					IFrame.attachEvent("onload", afterXMLLoad); //invoke function 
				}
		}catch(e)
			{
				throw new Error("\nselectedFile.loadFile.AAJAXTempTreeFile.reply.onReply fails. Error "+e.message);
			}
		};
		AJAXTempTreeFile.request("freedom/rqstxmltree");
	},
	setCurHTMLCharSet:function()
	{
		var metas = this.currentDOM.getElementsByTagName("meta");
		for (var x=0;x<metas.length;x++)
		{
			var currentMeta = metas[x];
			if (currentMeta.attributes.length>0)
			{
				var aAttToTreat = new Array();
				var attHttp_equiv = currentMeta.getAttribute("http-equiv");
				if (attHttp_equiv.toUpperCase() == "CONTENT-TYPE")
				{
					var attContent = currentMeta.getAttribute("content");
					if (attContent)
					{
						var re = /charset|\s=|\s(.+)$/;
						var aATT = attContent.match(re);
						if (aATT[1])
						{
							var curCharset = aATT[1];
							this.curHTMLCharSet = curCharset.split("=")[1];
							return;
						}
						//this.curHTMLCharSet = ;
					}
				}
			}
		}
	},
	saveXML:function()
	{
		try
		{
			var aHeaders = new Array();
			var contentType = new XMLHttpHeader("Content-type", this.contentType+"; charset="+this.charSet);
			aHeaders.push(contentType);
			var currentDOM = this.currentDOM;
			var oSelf = this;
			//
			var AJAXRqstSaveXML = new AJAXTransport();
			AJAXRqstSaveXML.reply.onReply=function()
			{
				try
				{
					var oJSONFile = eval("(" +this.Text + ")");
				}catch(e)
				{
					var innerHTML = "<p>selectedFile.saveXML Error:</p>";
					innerHTML += "<p>"+this.Text+"</p>";
					notificationWindow.create(innerHTML);
					//window.alert("Error: "+this.Text);
					return;
				}
				//window.alert("Document Succesfully Saved!");
				var innerHTML = "<p>Document Succesfully Saved!</p>";
				notificationWindow.create(innerHTML);
				//var dialog = notificationWindow.dialog;
				oSelf.setFileProperties(oJSONFile);
				oSelf.changed=false;
				oSelf.reloadXMLPreview();
			};
			//AJAXRqstSaveXML.requestSendDOM(currentDOM,"saveXMLFile.php",aHeaders);
			AJAXRqstSaveXML.requestSendDOM(currentDOM,"freedom/savexmlfile", aHeaders);
		}catch(e)
		{
			//window.alert("currentileObj.js::saveXML return an Error. Message: "+e.message);
			var innerHTML = "<p>currentileObj.js::saveXML return an Error. Message: "+e.message+"</p>";
			notificationWindow.create(innerHTML);
		}
	},
	saveXHTML:function()
	{
		try
		{
			//should i create an IE xml Document with pi before?
			var aHeaders = new Array();
			var contentType = new XMLHttpHeader("Content-type", this.contentType+"; charset="+this.charSet);
			aHeaders.push(contentType);
			var currentDOM = this.currentDOM;
			var oSelf = this;
			//
			var AJAXRqstSaveXML = new AJAXTransport();
			AJAXRqstSaveXML.reply.onReply=function()
			{
				try
				{
					var oJSONFile = eval("(" +this.Text + ")");
				}catch(e){
					//window.alert("Error: "+this.Text);
					var innerHTML = "<p>Error: "+this.Text+"</p>";
					notificationWindow.create(innerHTML);
					return;
				}
				//window.alert("Document Succesfully Saved!");
				var innerHTML = "<p>Error: Document Succesfully Saved!</p>";
				notificationWindow.create(innerHTML);
				oSelf.setFileProperties(oJSONFile);
				oSelf.changed=false;
			//	oSelf.reloadXMLPreview();
			};
			//AJAXRqstSaveXML.requestSendDOM(currentDOM,"saveXMLFile.php",aHeaders);
			AJAXRqstSaveXML.requestSendDOM(currentDOM,"freedom/savexmlfile", aHeaders);
		}catch(e)
		{
			throw new Error("currentileObj.js::saveXHTML return an Error. Message: "+e.message);
		}		
	},
	saveHTML:function()
	{
		try
		{
			if (BrowserDetect.browser == "Explorer")
			{
				//throw new Error("Microsoft Internet Explorer is not able to send a HTML DOM Document over XMLHttpRequest. !");
				var innerHTML = "<p>Microsoft Internet Explorer is not able to send a HTML DOM Document over XMLHttpRequest. !</p>";
				notificationWindow.create(innerHTML);
				return;
			}
			// alert: no disponible for IExplorer
			var aHeaders = new Array();
			var contentType = new XMLHttpHeader("Content-type", this.contentType+"; charset="+this.charSet);
			aHeaders.push(contentType);
			var currentDOM = this.currentDOM;
			var oSelf = this;
			//
			var AJAXRqstSaveHTML = new AJAXTransport();
			AJAXRqstSaveHTML.reply.onReply=function()
			{
				try
				{
					var oJSONFile = eval("(" +this.Text + ")");
				}catch(e){
					//window.alert("Error: "+this.Text);
					var innerHTML = "<p>"+this.Text+"</p>";
					notificationWindow.create(innerHTML);
					return;
				}
				//window.alert("Document Succesfully Saved!");
				var innerHTML = "<p>Document Succesfully Saved!</p>";
				notificationWindow.create(innerHTML);
				oSelf.setFileProperties(oJSONFile);
				oSelf.changed=false;
			};
			AJAXRqstSaveHTML.requestSendDOM(currentDOM,"freedom/savehtmldom",aHeaders);
		}catch(e)
		{
			throw new Error("currentileObj.js::saveHTML return an Error. Message: "+e.message);
		}		
	},
	saveSourceCode:function()
	{
		try
		{
			var fileStringContent = oSourceCodeEditor.TextArea.oElement.value;
			var oSelf = this;
			var AJAXRqstSaveSourceHTML = new AJAXTransport();
			AJAXRqstSaveSourceHTML.reply.onReply=function()
			{
				try
				{
					var oJSONFile = eval("(" +this.Text + ")");
				}catch(e)
				{
					var innerHTML = this.Text;
					notificationWindow.create(innerHTML);
					//		window.alert("Error: "+this.Text);
					return;
				}
				var innerHTML = "<p>Document Succesfully Saved!</p>";
				notificationWindow.create(innerHTML);
				var dialog = notificationWindow.dialog;
				dialog.afterClose=function(){};
				//window.alert("Document Succesfully Saved!");
				oSelf.setFileProperties(oJSONFile);
				oSelf.changed=false;
			};
			//AJAXRqstSaveSourceHTML.requestSendForm(fileStringContent,"saveSourceCode.php");
			AJAXRqstSaveSourceHTML.requestSendForm(fileStringContent,"freedom/savesourcecode");
		}catch(e)
		{
			throw new Error("currentileObj.js::saveSourceCode return an Error. Message: "+e.message);
		}		
	}
};
function onFrameLoad()
{
	try
	{
		var iFramePreview = oPreviewContainer.container.winBody.oElement.firstChild;
		var contentDocument = null;
		if (iFramePreview.contentDocument)
		{
			contentDocument = iFramePreview.contentDocument;
		}else if (iFramePreview.contentWindow){
			contentDocument = iFramePreview.contentWindow.document;
		}
		if (contentDocument == null)
		{
			throw new Error("You can not run this application. Your navigator does not support the current DOM specifications!");
		}
		selectedFile.currentDOM = contentDocument;// iFramePreview.contentDocument;
		oTreeContainer.loadTree();
		//loadTree();//function of tree.js
	}catch(e)
	{
		//window.alert("\nonFrameLoad fails. Error "+e.message);
		var innerHTML = "<p>onFrameLoad fails. Error "+e.message+"</p>";
		notificationWindow.create(innerHTML);
	}	
}
function reloadIframe(IFrame)
{
	try
	{
		if (IFrame.contentDocument)
		{
			IFrame.contentDocument.location.reload(true);
		}else if (iFramePreview.contentWindow){
			IFrame.contentWindow.document.location.reload(true);
		}
	}catch(e)
	{
		//window.alert("\nreloadIframe fails. Error "+e.message);
		var innerHTML = "<p>reloadIframe fails. Error "+e.message+"</p>";
		notificationWindow.create(innerHTML);
	}	
}
function afterXMLLoad()
{
	
	var iFramePreview = selectedFile.iframeContainer;
	if (window.addEventListener)
	{
		iFramePreview.removeEventListener('load', afterXMLLoad, false);
	}else if (window.attachEvent)
	{
		iFramePreview.detachEvent ('onload', afterXMLLoad);
	}
	if (iFramePreview.contentDocument)
	{
		iFramePreview.contentDocument.location.reload(true);
	}else if (iFramePreview.contentWindow){
		iFramePreview.contentWindow.document.location.reload(true);
	}
}
