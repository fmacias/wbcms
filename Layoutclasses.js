function dialogWindow(bModal,sHTML,nWidth,nHeight,bIsSelectForm,sIFrameSRC)
{
	this.windowId=null;
	this.html = sHTML;
	this.modal = bModal;
	this.width = nWidth;
	this.height = nHeight;
	this.bIsSelectForm = bIsSelectForm;
	this.iFrameSRC = sIFrameSRC;
	this.top = (window.screen.height-this.height)/2;
	this.left = (window.screen.width-this.width)/2;
	this.windowContent = null;
	this.windowContainer = null;
	this.show=function()
	{
		try
		{
			var BodyElement =document.body;
			var bodyWidth = window.screen.width;
			var bodyHeight = window.screen.height;
			this.windowId = customFunctionCreateWindow(this.width,this.height,this.left,this.top,this.html,this.modal,this.bIsSelectForm,this.iFrameSRC);
			this.windowContent = document.getElementById('windowContent' + this.windowId );
			this.windowContainer = document.getElementById('dhtml_goodies_id'+this.windowId);
		}catch(e)
		{
			throw new Error("\ndialogWindow.show fails. Error "+e.message);
		}
	};
}
function oHTMLElement()
{
		this.NodeValue = null;
		this.ClassName = null;
		this.ElementId = null;
		this.InnerHTML = null;
		this.Style = null;
		this.Attributes = null;
		this.oElement= null; 
		this.set = function(HTMLElementIn)
		{
			try
			{
				this.oElement = createHTMLElement(HTMLElementIn,this.NodeValue,this.ClassName,this.ElementId,this.InnerHTML,this.Style,this.Attributes);
			}catch(e){
				throw new Error("Error:Class oHTMLElement::set()"+e.message);
			}
		};
		this.getWidth = function()
		{
			try
			{
				return this.oElement.offsetWidth;
			}catch(e){
				throw new Error("Error:Class oHTMLElement::getWidth()"+e.message);
			}
		};
		this.getHeight = function()
		{
			try
			{
				return this.oElement.offsetHeight;
			}catch(e){
				throw new Error("Error:Class oHTMLElement::getHeight()"+e.message);
			}
		};
		this.clear = function(){
			try
			{
				this.NodeValue = null;
				this.ClassName = null;
				this.ElementId = null;
				this.InnerHTML = null;
				this.Style = null;
				this.Attributes = null;
				this.oElement= null; 
			}catch(e){
				throw new Error("Error:Class oHTMLElement::clear()"+e.message);
			}
		};
}
//container: it is the main container of each view (tree, editor and Preview)
function container(sInnerHTML)
{
	this.ClassName = "mainCont";
	this.Style = "width:100%;height:100%";
	this.ElementId = null;
}
container.prototype = new oHTMLElement();
//the header of each view
function contHeader(sInnerHTML)
{
	this.NodeValue = null;
	this.ElementId = null;
	this.ClassName = "contHeader";
	this.Style = "background:#99BAF3;display:block;padding:5px;font-weight:bold;width:100%";
	this.InnerHTML = null;
}
contHeader.prototype = new oHTMLElement();
//the body of each view
function contBody(sInnerHTML)
{
	this.ClassName = "conBody";
	this.Style = "display:block;background:#DCE7FB;overflow:scroll;width:100%;height:89%";
	this.ElementId = null;
}
contBody.prototype = new oHTMLElement();
//generic container is commun on every view
function genericContainer()
{
	this.Container = new container();
	this.Header = new contHeader();
	this.ContBody = new contBody();
	this.WindowContainer = null;
	this.WindowContent = null;
	this.WindowId = null;
	this.removeContainer = function()
	{
		try
		{
			var removedChild = this.Container.oElement.parentNode.removeChild(this.Container.oElement);
		}catch(e){
			throw new Error("Error:Class genericContainer::removeContainer()"+e.message);
		}	
	};
	/*this.drawContainer_old = function (width,height,top,left)
	{
		this.WindowContainer = null;
		this.WindowContent = null;
		var windowDOMElement = document.getElementById("dhtml_goodies_id"+this.WindowId);
		if (windowDOMElement)
		{
			width = (windowDOMElement.offsetWidth>0)?windowDOMElement.offsetWidth:width;
			height = (windowDOMElement.offsetHeight>0)?windowDOMElement.offsetHeight:height;
			top = (windowDOMElement.offsetTop>0)?windowDOMElement.offsetTop:top;
			left = (windowDOMElement.offsetLeft>0)?windowDOMElement.offsetLeft:left;
			var closeButton = document.getElementById('closeImage' + this.WindowId);
			fireEvent(closeButton,"click");
			windowDOMElement.parentNode.removeChild(windowDOMElement);
		}
		height = height-windowMinSize[1];
		height = (windowMinSize[1]>height)?windowMinSize[1]:height;
		this.WindowId = null;
		var dialog = new dialogWindow(false,"",width,height,false,"");
		dialog.top = top;
		dialog.left = left;
		dialog.show();
			//oReferenceObjectIn = dialog.windowContent;
		this.WindowContent = dialog.windowContent;
		this.WindowContainer = dialog.windowContainer;
		this.WindowId = dialog.windowId;
		this.create();
		this.Container.oElement = this.WindowContent.appendChild(this.Container.oElement);
		this.Header.oElement = this.Container.oElement.appendChild(this.Header.oElement);
		this.ContBody.oElement = this.Container.oElement.appendChild(this.ContBody.oElement);
	};*/
	this.drawContainer = function(width,height,top,left)
	{
		try
		{
			var windowDOMElement = document.getElementById("dhtml_goodies_id"+this.WindowId);
			if (windowDOMElement)
			{
				width = (windowDOMElement.offsetWidth>0)?windowDOMElement.offsetWidth:width;
				height = (windowDOMElement.offsetHeight>0)?windowDOMElement.offsetHeight:height;
				top = (windowDOMElement.offsetTop>0)?windowDOMElement.offsetTop:top;
				left = (windowDOMElement.offsetLeft>0)?windowDOMElement.offsetLeft:left;
				var closeButton = document.getElementById('closeImage' + this.WindowId);
				fireEvent(closeButton,"click");
				windowDOMElement.parentNode.removeChild(windowDOMElement);
			}
			this.drawWindow();
			this.create();
			this.addBody();
			this.setWindowSize(top,left,width,height);
		}catch(e){
			throw new Error("Error:Class genericContainer::drawContainer()"+e.message);
		}
	};
	this.setWindowSize = function(nTop, nLeft,nWidth, nHeight)
	{
		try
		{
			//windowMinSize from float script 80x30
			var currentWindow = document.getElementById("dhtml_goodies_id"+this.WindowId);
			if(document.getElementById("dhtml_goodies_id"+this.WindowId).offsetWidth==0)
			{
				this.drawWindow();
				this.addBody();
				currentWindow.parentNode.removeChild(currentWindow);
			}
			var windowDOMElement = document.getElementById("dhtml_goodies_id"+this.WindowId);
			activeWindowIframe = activeWindow.getElementsByTagName('IFRAME')[0];
			windowDOMElement.style.top = nTop.toString()+"px";
			windowDOMElement.style.left = nLeft.toString()+"px";
			windowDOMElement.style.width =  nWidth.toString()+"px";
				//windowDOMElement.style.height = nHeight.toString()+"px";
			this.WindowContent.style.height = (nHeight-windowMinSize[1]).toString()+"px";
			if(MSIEWIN && activeWindowIframe){
				activeWindowIframe.style.width = nWidth.toString() + 'px';	
				activeWindowIframe.style.height = (nHeight+20).toString() + 'px';	
			
			}
		}catch(e){
			throw new Error("Error:Class genericContainer::setWindowSize()"+e.message);
		}
	};
	this.drawWindow = function()
	{
		try
		{
			var dialog = new dialogWindow(false,"",10,10,false,"");
			dialog.top = 10;
			dialog.left = 10;
			dialog.show();
				//oReferenceObjectIn = dialog.windowContent;
			this.WindowContent = dialog.windowContent;
			this.WindowContainer = dialog.windowContainer;
			this.WindowId = dialog.windowId;
		}catch(e){
			throw new Error("Error:Class genericContainer::drawWindow()"+e.message);
		}
	},
	this.addBody = function()
	{
		try
		{
			this.Container.oElement = this.WindowContent.appendChild(this.Container.oElement);
			this.Header.oElement = this.Container.oElement.appendChild(this.Header.oElement);
			this.ContBody.oElement = this.Container.oElement.appendChild(this.ContBody.oElement);
		}catch(e){
			throw new Error("Error:Class genericContainer::addBody()"+e.message);
		}
	},
	this.create = function()
	{
		try
		{
			this.Container.set("div");
			this.Header.set("div");
			this.ContBody.set("div");
		}catch(e){
			throw new Error("Error:Class genericContainer::create()"+e.message);
		}
	};
}

//
//
//				Definition of AttContainer, which is a property of NodeAttributes
//
//
function btnRemoveAtt()
{
	this.InnerHTML = "remove";
	this.createElements=function()
	{
		try
		{
			this.set("button");
			if (currentMenuOption=="ProjectView")
			{
				this.oElement.disabled=true;
			}else{
				this.oElement.disabled=false;
				//this.oElement.removeAttribute("disabled");
			}
			this.oElement.onclick = function(){};//pofimophic function: Defined in the object AttContainer
		}catch(e){
			throw new Error("Error:Class btnRemoveAtt::createElements()"+e.message);
		}	
	};
}
btnRemoveAtt.prototype = new oHTMLElement();
//
function ContbtnRemoveAtt()
{
	this.ClassName = "floatRight";
	this.createElements=function()
	{
		try
		{
			this.set("span");
			this.btnRemoveAtt.createElements();
			this.btnRemoveAtt.oElement = this.oElement.appendChild(this.btnRemoveAtt.oElement);
		}catch(e){
			throw new Error("Error:Class ContbtnRemoveAtt::createElements()"+e.message);
		}	
	};
	this.clearAll = function()
	{
		try
		{
			this.clear();
			this.btnRemoveAtt.clear();
		}catch(e){
			throw new Error("Error:Class ContbtnRemoveAtt::clearAll()"+e.message);
		}	
	};
}
ContbtnRemoveAtt.prototype = new oHTMLElement();
ContbtnRemoveAtt.prototype.btnRemoveAtt = new btnRemoveAtt();
//
function AttTextArea()
{
	this.Style ="border:1px solid #707070;margin:0px 5px 0 5px";
	this.createElements=function(){
		try
		{
			this.set("textarea");
			//this.oElement.rows = "1";
			this.oElement.value = "AttContent_in";
			var nWidth = this.refContainer.getWidth()-42;
			this.oElement.style.width = nWidth.toString()+"px";
			if (currentMenuOption=="ProjectView")
			{
				this.oElement.readOnly=true;
			}else{
				this.oElement.readOnly=false;
			}
		}catch(e){
			throw new Error("Error:Class AttTextArea::createElements()"+e.message);
		}	
	};
}
AttTextArea.prototype = new oHTMLElement();

//
function AttName()
{
	this.InnerHTML = "AttName"; //node value
	this.ClassName = "floatLeft";
	this.Style = "margin:5px 5px 5px 5px";
	this.createElements=function()
	{
		try
		{
			this.set("span");
		}catch(e){
			throw new Error("Error:Class AttName::createElements()"+e.message);
		}	
	};
}
AttName.prototype = new oHTMLElement();
//
//
function AttContainer()
{
	this.Style= "border:1px solid #CCCCCC;margin: 5px 5px 5px 5px;padding:0px 0px 5px 0px"
	this.ClassName = "attContainer";
	this.createElements=function()
	{
		try
		{
			this.set("div");
			this.AttName.createElements();
			this.ContBtnRemoveAtt.createElements();
			this.AttTextArea.createElements();
			//
			this.AttName.oElement = this.oElement.appendChild(this.AttName.oElement);
			this.ContBtnRemoveAtt.oElement = this.oElement.appendChild(this.ContBtnRemoveAtt.oElement);
			this.AttTextArea.oElement = this.oElement.appendChild(this.AttTextArea.oElement);
			//
			var nWidth = this.refContainer.getWidth()-30;
			this.oElement.style.width = nWidth.toString()+"px";
			var oSelf = this;
			this.ContBtnRemoveAtt.btnRemoveAtt.oElement.onclick =function()
			{
				oSelf.removeContainer();
			};
		}catch(e){
			throw new Error("Error:Class AttContainer::createElements()"+e.message);
		}		
	};
	this.removeContainer = function(){
		try
		{
			this.oElement = this.oElement.parentNode.removeChild(this.oElement);
			this.oElement = null;
			this.ContBtnRemoveAtt.btnRemoveAtt.textAreaInnerHTML.setSize();
			/*this.clear();
			this.AttName.clear();
			this.ContBtnRemoveAtt.clearAll();
			this.AttTextArea.clear();*/
		}catch(e){
			throw new Error("Error:Class AttContainer::removeContainer()"+e.message);
		}	
	};
//	this.set("div");
}
AttContainer.prototype = new oHTMLElement();
AttContainer.prototype.AttName = new AttName();
AttContainer.prototype.ContBtnRemoveAtt = new ContbtnRemoveAtt();
AttContainer.prototype.AttTextArea = new AttTextArea();

//
//
//
//
//				Definition of NodeArea, which is a property of DivEditor
//
//

function NodeIdentification()
{
	this.ElementId = "NodeIdentification";
	this.Style = "font-weight:bold;margin:0 5px 0 5px";
	this.createElements=function()
	{
		try
		{
			this.set("span");
		}catch(e){
			throw new Error("Error:Class NodeIdentification::createElements()"+e.message);
		}	
	};
}
NodeIdentification.prototype = new oHTMLElement();
//
//
function NodeAttributes()
{
	this.ElementId = "NodeAtributes";
	this.Containers = new Array();
	this.LastContainer = null;
	this.createElements=function()
	{
		try
		{
			this.Containers = new Array();
			this.LastContainer = null;
			this.set("span");	
		}catch(e){
			throw new Error("Error:Class NodeAttributes::createElements()"+e.message);
		}
	};
	this.addContainer = function()
	{
		try
		{
			var oSelf = this;
			var currAttContainer = new AttContainer();
			currAttContainer.createElements();
			currAttContainer.oElement = oSelf.oElement.appendChild(currAttContainer.oElement);//draw
			this.LastContainer = currAttContainer;
			this.Containers.push(currAttContainer);
		}catch(e){
			throw new Error("Error:Class NodeAttributes::addContainer()"+e.message);
		}
	};
}
NodeAttributes.prototype = new oHTMLElement();
//NodeAttributes.prototype.AttContainers = new Array();
//classes Left Container
function NodeArea()
{
	this.Style = "display:block;width:100%";
	this.ElementId = "attArea";
	this.createElements=function(){
		try
		{
			this.set("div");
			this.NodeIdentification.set("span");
			this.NodeIdentification.oElement = this.oElement.appendChild(this.NodeIdentification.oElement);
			this.NodeAttributes.createElements();
			this.NodeAttributes.oElement = this.oElement.appendChild(this.NodeAttributes.oElement);
		}catch(e){
			throw new Error("Error:Class NodeArea::createElements()"+e.message);
		}
	};
}
NodeArea.prototype =  new oHTMLElement();
NodeArea.prototype.NodeIdentification = new NodeIdentification();
NodeArea.prototype.NodeAttributes = new NodeAttributes();
//
//
//
//
//				Definition of contTextArea, which is a property of DivEditor
//
//
function textAreaInnerHTML()
{
	this.Style = "border:1px solid #707070;margin:5px 5px 5px 5px";
	this.createElement = function()
	{
		try
		{
			this.set("textarea");
			this.oElement.rows = "1";
			if (currentMenuOption=="ProjectView")
			{
				this.oElement.readOnly=true;
			}else{
				this.oElement.readOnly=false;
			}
		}catch(e){
			throw new Error("Error:Class textAreaInnerHTML::createElement()"+e.message);
		}
	};
	this.setSize=function()
	{
		try
		{
			var windowContentHeight = this.currentEditor.WindowContent.offsetHeight;
			var  factor1= windowContentHeight;
			var factor2= this.refSelNode.getHeight();
			factor3 = this.refAttArea.getHeight();
			var nOutputHeight =factor1-factor2-factor3-30;
			this.oElement.style.height = nOutputHeight.toString()+"px";
			factor1 = this.refDivRight.getWidth()-30; 
			this.oElement.style.width = factor1.toString()+"px";
		}catch(e){
			throw new Error("Error:Class textAreaInnerHTML::setSize()"+e.message);
		}
	};
	this.setInnerHTML=function(sInnerHTML)
	{
		try
		{
			this.oElement.innerHTML = sInnerHTML;
		}catch(e){
			throw new Error("Error:Class textAreaInnerHTML::setInnerHTML()"+e.message);
		}
	};
}
textAreaInnerHTML.prototype = new oHTMLElement();

function contTextArea()
{
	this.ElementId = "textAreaContainer";
	this.Style = "display:block;width:100%";
	this.createElements=function()
	{
		try
		{
			this.set("div");
			this.textAreaInnerHTML.createElement();
			this.textAreaInnerHTML.oElement = this.oElement.appendChild(this.textAreaInnerHTML.oElement);
			this.textAreaInnerHTML.setSize();
		}catch(e){
			throw new Error("Error:Class contTextArea::createElements()"+e.message);
		}
	};
}
contTextArea.prototype = new oHTMLElement();
contTextArea.prototype.textAreaInnerHTML = new textAreaInnerHTML();
//
function DivTree()
{
	this.Container.ElementId = "divLeft";
	//this.Container.Style+=";width:100%";
	this.Header.InnerHTML = 'Current File:<span id="refFile"></span>';
	this.ContBody.ElementId = "tree";
	//this.ContBody.Style+= ";overflow:scroll";
	this.draw = function()
	{
		try
		{
			var mainMenu = document.getElementById("mainMenu");
			var top = 35;
			var left = 0;
			if (mainMenu)
				top = mainMenu.offsetHeight;
			this.drawContainer(bodyWidth/2,bodyHeight/2,top,left);
		}catch(e){
			throw new Error("Error:Class DivTree::draw()"+e.message);
		}
		
	}; 
};
DivTree.prototype = new genericContainer();
//
function BtnAddAttribute()
{
	this.NodeValue="Create Attribute";
	this.ClassName = "floatRight";
	this.createElements = function()
	{
		try
		{
			this.set("button");
			if (currentMenuOption=="ProjectView")
			{
				this.oElement.disabled=true;
			}else{
				this.oElement.disabled=false;
			}
			var oSelf = this;
			this.oElement.onclick = function()
			{
				try
				{
					/*ÜoSelf.NodeAttributes.addContainer();
					*/
					addAttribute();
					//oSelf.textAreaInnerHTML.setSize();
				}catch(e)
				{
					alert("BtnAddAttribute.oElement.onclick fails. Error: "+e.message);
				}
			};
		}catch(e){
			throw new Error("Error:Class BtnAddAttribute::createElements()"+e.message);
		}
	};
}
BtnAddAttribute.prototype = new oHTMLElement();

function DivEditor()
{
	this.Container.ElementId = "divRight";
	//this.Container.Style += ";width:100%";
	this.Header.ElementId="refSelNode";
	this.Header.InnerHTML = 'Current Node Selection<span id="addAttButton" class="floatright"></span>';
	this.ContBody.ElementId = "currentView";
	this.draw = function()
	{
		try
		{
			var mainMenu = document.getElementById("mainMenu");
			var top = 35;
			var left = bodyWidth/2;
			if (mainMenu)
				top = mainMenu.offsetHeight;
			this.drawContainer(bodyWidth/2,bodyHeight/2,top,left);
			this.HeaderBtnAddAttribute.createElements();
			this.NodeArea.createElements();
			this.ElementInnerHTML.createElements();
			this.HeaderBtnAddAttribute.oElement =this.Header.oElement.appendChild(this.HeaderBtnAddAttribute.oElement);
			this.NodeArea.oElement =this.ContBody.oElement.appendChild(this.NodeArea.oElement);
			this.ElementInnerHTML.oElement =this.ContBody.oElement.appendChild(this.ElementInnerHTML.oElement);
		}catch(e){
			throw new Error("Error:Class DivEditor::draw()"+e.message);
		}
	};
}
DivEditor.prototype = new genericContainer();
DivEditor.prototype.HeaderBtnAddAttribute = new BtnAddAttribute();
DivEditor.prototype.NodeArea = new NodeArea();
DivEditor.prototype.ElementInnerHTML = new contTextArea();

function BtnReloadIframe()
{
	this.NodeValue="Refresh";
	this.ClassName = "floatRight";
	this.createElements = function()
	{
		this.set("button");
		var oSelf = this;
		this.oElement.onclick = function()
		{
			try
			{
				var Iframe = document.getElementById("IFramePreview");
				if (Iframe)
				{
					Iframe.contentDocument.location.reload(true);
				}
			}catch(e){
				throw new Error("Error:Class BtnReloadIframe::onclick()"+e.message);
			}
		};
	};
}
BtnReloadIframe.prototype = new oHTMLElement();

function DivPreview()
{
	this.Container.ElementId = "preview";
	this.Header.ElementId = "previewTitle";
	this.Header.NodeValue ="Preview";
	this.ContBody.ElementId = "iframeContainer";
	this.ContBody.Style += ";background:white;width:100%";
	this.draw = function()
	{
		try
		{
			var mainMenu = document.getElementById("mainMenu");
			var top = bodyHeight/2;
			var left =0;
			if (mainMenu)
				top += mainMenu.offsetHeight;
			this.drawContainer(bodyWidth,bodyHeight,top+20,left);
			this.RefreshBtn.createElements();
			this.RefreshBtn.oElement =this.Header.oElement.appendChild(this.RefreshBtn.oElement);
			this.ContBody.oElement.style.overflow = "visible";
			this.ContBody.oElement.style.height = (this.Container.oElement.offsetHeight-this.Header.oElement.offsetHeight)+"px"; 
			var a = 1;
		}catch(e){
			throw new Error("Error:Class DivPreview::draw()"+e.message);
		}
	};
	this.addIFrame = function()
	{
		try
		{
			//selectedFile.setIframeContainer(this.ContBody.oElement);
			var iFrameContainer = this.ContBody.oElement;
			removeChilds(this.ContBody.oElement);
			var IFrame = document.createElement("iframe");
			IFrame.setAttribute("id", "IFramePreview");
			IFrame.setAttribute("name", "IFramePreview");
			//IFrame.setAttribute("src", selectedFile.file);
			IFrame.frameBorder = "0";
			IFrame.scrolling = "yes";
			IFrame.style.zIndex = "-1";
			var selfIFrame= iFrameContainer.appendChild(IFrame);
			selfIFrame.width =selfIFrame.parentNode.offsetWidth+"px";
			selfIFrame.height =selfIFrame.parentNode.offsetHeight+"px";
			return iFrameContainer;		
		}catch(e){
			throw new Error("Error:Class DivPreview::createElements()"+e.message);
		}
	};
	this.addIFrame___ = function()
	{
		selectedFile.setIframeContainer(this.ContBody.oElement);
		removeChilds(this.ContBody.oElement);
		var IFrame = document.createElement("iframe");
		IFrame.setAttribute("id", "IFramePreview");
		IFrame.setAttribute("name", "IFramePreview");
		IFrame.setAttribute("src", selectedFile.file);
		IFrame.frameBorder = "0";
		IFrame.scrolling = "yes";
		IFrame.style.zIndex = "-1";
		if ((selectedFile.fileExtension=="HTML")||(selectedFile.fileExtension=="HTM"))
		{		
			if (window.addEventListener)
			{
				IFrame.addEventListener("load",onFrameLoad, false); //invoke function
			}else if (window.attachEvent)
			{
				IFrame.attachEvent("onload", onFrameLoad); //invoke function 
			}
		}
		var selfIFrame= selectedFile.iframeContainer.appendChild(IFrame);
		selfIFrame.width =selfIFrame.parentNode.offsetWidth+"px";
		selfIFrame.height =selfIFrame.parentNode.offsetHeight+"px";
	};
	this.setIFrameSize = function()
	{
		try
		{
			this.ContBody.oElement.style.height = (this.WindowContent.offsetHeight-this.Header.oElement.offsetHeight)+"px";
			var IFrame= document.getElementById("IFramePreview");
			if (IFrame)
			{
				IFrame.width =IFrame.parentNode.offsetWidth+"px";
				IFrame.height =IFrame.parentNode.offsetHeight+"px";
			}
		}catch(e){
			throw new Error("Error:Class DivPreview::setIFrameSize()"+e.message);
		}
	};
};
DivPreview.prototype = new genericContainer();
DivPreview.prototype.RefreshBtn = new BtnReloadIframe();

function DivSourceCode()
{
	this.Container.ElementId = "sourceCode";
	//this.Container.Style+=";width:98%;margin:0.5%";
	this.Header.ElementId = "sourceCodeHeader";
	this.Header.NodeValue ="Source Code";
	this.ContBody.ElementId = "bodySourceCode";
	this.TextArea.Style= "border:1px solid #707070;margin:5px"; 
	this.draw = function()
	{
		try
		{
			this.drawContainer(bodyWidth,bodyHeight,35,0);
			this.TextArea.set("textarea");
			this.TextArea.oElement = this.ContBody.oElement.appendChild(this.TextArea.oElement);
		}catch(e){
			throw new Error("Error:Class DivSourceCode::draw()"+e.message);
		}
		
	};
};
DivSourceCode.prototype = new genericContainer();
DivSourceCode.prototype.TextArea =  new oHTMLElement();

function oProjektCreate()
{
	this.caption.InnerHTML = "<b>Create new Projeckt:</b>";
	this.caption.Style= "padding:5px";
	this.input.Name="inputProject";
	this.input.Attributes = 'type="text",value=,name="porjecktName"';
	this.input.Style="margin:5px;width:70%";
	this.btnCreate.NodeValue = "Create";
	this.CaptionFileName.InnerHTML = "Projekt Configuration File";
	this.CaptionFileName.Style= "padding:5px";
	this.captionFolder.InnerHTML = "Projeckt Folder:";
	this.captionFolder.Style = "padding:5px";
	this.projektFolder.Attributes = 'type="text",value=,name="porjecktFolder"';
	this.projektFolder.Style= "margin:5px;width:70%";
	this.createElements = function()
	{
		try
		{
			this.caption.set("div");
			this.input.set("input");
			this.captionFolder.set("div");
			this.projektFolder.set("input");
			this.btnCreate.set("button");
			this.CaptionFileName.set("div");
			var oSelfInput = this.input.oElement;
			var oSelfFolder = this.projektFolder.oElement;
			var self = this;
			this.btnCreate.oElement.onclick= function()
			{
				var projektName = oSelfInput.value;
				var projektFolder = oSelfFolder.value;
				var AJAXCreateProjekt = new AJAXTransport();
				AJAXCreateProjekt.reply.onReply=function()
				{
					try
					{
						try
						{
							var textReply = eval("(" +this.Text + ")");
						}catch(e)
						{
							throw new Error("Server Error: "+this.Text);
						}
						if (textReply)
						{
							defaultMenuState();
							oProjektView.doAction();
							//self.ProjektWindow.removeWindow();
							
							var windowId = self.ProjektWindow.WindowId;
							var closeButton = document.getElementById('closeImage' + windowId);
							fireEvent(closeButton,"click");
						}else{
							//alert("The projekt could not be created!");
							throw new Error("The projekt could not be created!");
						}
					}catch(e){
						throw new Error("Error:Class oProjektCreate::createElements::AJAXCreateProjekt.reply.onReply()"+e.message);
					}
				};
				AJAXCreateProjekt.requestSendForm("porjecktName="+projektName+"&projecktFolder="+projektFolder,"createProject.php");
				//create new projeckt
			};
		}catch(e){
			throw new Error("Error:Class oProjektCreate::draw()"+e.message);
		}
	};
}
oProjektCreate.prototype.caption=  new oHTMLElement();
oProjektCreate.prototype.CaptionFileName=  new oHTMLElement();
oProjektCreate.prototype.input=  new oHTMLElement();
oProjektCreate.prototype.captionFolder =  new oHTMLElement();
oProjektCreate.prototype.projektFolder =  new oHTMLElement();
oProjektCreate.prototype.btnCreate=  new oHTMLElement();

function oProjektsSelection()
{
	this.caption.InnerHTML = "<b>Select an Existing Projeckt:</b>";
	this.caption.Style= "padding:5px";
	this.selector.Name="selectedProject";
	this.selector.Style="margin:5px;width:70%";
	this.btnSelect.NodeValue = "Select";
	this.createElements = function()
	{
		try
		{
			this.caption.set("div");
			this.selector.set("select");
			this.btnSelect.set("button");
			var oSelfSelect = this.selector.oElement; 
			var self = this;
			this.btnSelect.oElement.onclick= function()
			{
				var projektName = oSelfSelect.value;
				var AJAXSelectProjekt = new AJAXTransport();
				AJAXSelectProjekt.reply.onReply=function()
				{
					try
					{
						try
						{
							var textReply = eval("(" +this.Text + ")");
						}catch(e){
							throw new Error("Server Error: "+this.Text);
						}
						if (textReply)
						{
							defaultMenuState();
							oProjektView.doAction();
							//self.ProjektWindow.removeWindow();
							var windowId = self.ProjektWindow.WindowId;
							var closeButton = document.getElementById('closeImage' + windowId);
							fireEvent(closeButton,"click");
						}else{
							//alert("The projekt could not be selected!");
							throw new Error("The projekt could not be selected!");
						}
					}catch(e){
						throw new Error("Error:Class oProjektsSelection::createElements::AJAXSelectProjekt.reply.onReply()"+e.message);
					}
				};
				AJAXSelectProjekt.requestSendForm("selectedProject="+projektName,"loadProject.php");
				//create new projeckt
			};
		}catch(e){
			throw new Error("Error:Class oProjektsSelection::createElements()"+e.message);
		}
	};
	this.getProjekts= function()
	{
		try
		{
			var RQSTProjeckts = new AJAXTransport();
			var oSelf = this.selector;
			RQSTProjeckts.reply.onReply=function()
			{
				try
				{
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
						//
						var oHTMLOption = createHTMLElement("option",null,null,null,null,null,null);
						oHTMLOption.value=curFileName;
						oHTMLOption.text = curFileName;
						if (window.navigator.appName.toUpperCase() == "MICROSOFT INTERNET EXPLORER")
						{
							oSelf.oElement.add(oHTMLOption);
						}else{
							oSelf.oElement.add(oHTMLOption,null);
						}
						counter++;
					}
				}catch(e)
				{
					throw new Error("Error:Class oProjektsSelection::getProjekts::RQSTProjeckts.reply.onReply()"+e.message);
				}
			};
			RQSTProjeckts.request('http://www.wunderbit.com/wbcms/requestProjeckts.php');
		}catch(e){
			throw new Error("Error:Class oProjektsSelection::getProjekts()"+e.message);
		}
	};
}
oProjektsSelection.prototype.caption=  new oHTMLElement();
oProjektsSelection.prototype.selector=  new oHTMLElement();
oProjektsSelection.prototype.btnSelect=  new oHTMLElement();

function DivLoadProject()
{
	this.Container.ElementId = "projekts";
	//this.Container.Style+=";position:relative;top:10px;width:99%;";
	this.Header.InnerHTML = 'Available Projekts';
	this.ContBody.ElementId = "bodyProjekts";
	this.draw = function()
	{
		try
		{
			var divSelect = createHTMLElement("div",null,null,null,null,"display:block",null);
			var divCreate = createHTMLElement("div",null,null,null,null,"display:block;border:1px solid #99BAF3",null);
			var mainMenu = document.getElementById("mainMenu");
			var top = mainMenu.offsetHeight;
			var left = 0;
			this.drawContainer(600,300,top,left);
			this.WindowContainer.style.top = "35px";
			this.WindowContainer.style.left = "5px";
			this.selectProjekt.createElements();
			this.createProjekt.createElements();
			divSelect = this.ContBody.oElement.appendChild(divSelect);
			divCreate = this.ContBody.oElement.appendChild(divCreate);
			
			this.selectProjekt.caption.oElement =divSelect.appendChild(this.selectProjekt.caption.oElement);
			this.selectProjekt.selector.oElement =divSelect.appendChild(this.selectProjekt.selector.oElement);
			this.selectProjekt.btnSelect.oElement =divSelect.appendChild(this.selectProjekt.btnSelect.oElement);
			this.selectProjekt.getProjekts();
			
			this.createProjekt.caption.oElement =divCreate.appendChild(this.createProjekt.caption.oElement);
			this.createProjekt.captionFolder.oElement = divCreate.appendChild(this.createProjekt.captionFolder.oElement);
			this.createProjekt.projektFolder.oElement = divCreate.appendChild(this.createProjekt.projektFolder.oElement);
			
			this.createProjekt.CaptionFileName.oElement = divCreate.appendChild(this.createProjekt.CaptionFileName.oElement);
			this.createProjekt.input.oElement =divCreate.appendChild(this.createProjekt.input.oElement);
			this.createProjekt.btnCreate.oElement =divCreate.appendChild(this.createProjekt.btnCreate.oElement);
		}catch(e){
			throw new Error("Error:Class DivLoadProject::draw()"+e.message);
		}
	};	
}
DivLoadProject.prototype = new genericContainer();
DivLoadProject.prototype.selectProjekt =  new oProjektsSelection();
DivLoadProject.prototype.createProjekt =  new oProjektCreate();
function getBodyWidth()
{
	try
	{
		var nWidth = 800;
		if( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
			nWidth = window.innerWidth;
		 } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		   //IE 6+ in 'standards compliant mode'
			 nWidth = document.documentElement.clientWidth;
		 } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		  //IE 4 compatible
			 nWidth = document.body.clientWidth;
		}
		return nWidth;
	}catch(e)
	{
		alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
function getBodyHeight()
{
	try
	{
		var nHeight = 600;
		if( typeof( window.innerWidth ) == 'number' ) {
		    //Non-IE
			nHeight = window.innerHeight;
		 } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		   //IE 6+ in 'standards compliant mode'
			 nHeight = document.documentElement.clientHeight;
		 } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		  //IE 4 compatible
			 nHeight = document.body.clientHeight;
		}
		return nHeight;
	}catch(e)
	{
		alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
}