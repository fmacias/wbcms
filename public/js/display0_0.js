//
var bodyWidth = 0, bodyHeight = 0;
//contants:
var WINDOW_CONTAINER_SEPARATOR_SIZE = 2;
var WINDOW_CONTAINER_BORDER = 2;
var WINDOW_CONTAINER_BODY_BORDER = 2;
var Z_INDEX = 20;

var oTreeContainer = null;
var oPreviewContainer = null;
var oEditorContainer = null;
var oSourceCodeEditor = null;
//
var oMainContainer = null;
var containerDrag = new dragDivElement();
containerDrag.move = function(e)
{
	if (this.oElement ==null)return;
	if(document.all)e = event;
	this.oElement.style.top = (e.clientY+this.sizeTopFromY)+"px" ;
	this.oElement.style.left = (e.clientX+this.sizeLeftFromX)+"px" ;
	//this.oElement.style.left = CurrentLeft+(-1*(leftRest))-leftRest;
};
var verticalSeparator = new dragSeparatorElement();
verticalSeparator.move=function(e)
{
	if (this.separator ==null)return;
	if(document.all)e = event;
	var globalContainerWidth = this.separator.mainElement.parentNode.offsetWidth;
	this.setLeft(e.clientX,globalContainerWidth);
	if (this.separator.leftLimit>e.clientX)
	{
		this.setLeft(this.separator.leftLimit,globalContainerWidth);
		this.stop();
	}
	if (this.separator.rightLimit<e.clientX)
	{
		this.setLeft(this.separator.rightLimit,globalContainerWidth);
		this.stop();
	}
};

var horizontalSeparator = new dragSeparatorElement();
horizontalSeparator.move=function(e)
{
	if (this.separator ==null)return;
	if(document.all)e = event;
	var globalContainerHeight = this.separator.mainElement.parentNode.offsetHeight;
	this.setTop(e.clientY,globalContainerHeight);
	if (this.separator.topLimit>e.clientY)
	{
		this.setTop(this.separator.topLimit,globalContainerHeight);
		this.stop();
	}
	if (this.separator.bottomLimit<e.clientY)
	{
		this.setTop(this.separator.bottomLimit,globalContainerHeight);
		this.stop();
	}
};
function dragSeparatorElement()
{
	this.separator=null;
	this.stop=function()
	{
		currentDrag = 
		{
			stop:function(){},
			move:function(){}
		};
		this.separator = null;
	};
	this.setLeft=function(eClientX,maxWidth)
	{
		var nLeft = getHTMLElementLeft(this.separator.mainElement);
		//
		var separatorLeft = eClientX-nLeft;
		//
		var mainContainerWidth = separatorLeft-(WINDOW_CONTAINER_BORDER*2);
		//
		//var bodyHeight = mainContainerWidth-mainContainerBody.offsetLeft-WINDOW_CONTAINER_BODY_BORDER*2;
		//
		this.separator.oElement.style.left = separatorLeft+'px';
		//(WINDOW_CONTAINER_BORDER*2
		this.separator.mainElement.style.width = mainContainerWidth+'px';
		for (var y=0;y<this.separator.relElements.length;y++)
		{
			this.separator.relElements[y].style.width = (maxWidth-separatorLeft-this.separator.width-WINDOW_CONTAINER_BORDER*2)+"px";
			this.separator.relElements[y].style.left = (separatorLeft+this.separator.width)+"px";
		}
	};
	this.setTop=function(eClientY,maxHeight)
	{
		var mainContainerBody = this.separator.mainElement.childNodes[4];
		//
		var nTop = getHTMLElementTop(this.separator.mainElement);
		//
		var separatorY = eClientY-nTop;
		//
		var mainContainerHeight = separatorY-(WINDOW_CONTAINER_BORDER*2);
		//
		var curBodyHeight = mainContainerHeight-mainContainerBody.offsetTop-WINDOW_CONTAINER_BODY_BORDER*2;
		//
		this.separator.oElement.style.top = separatorY+'px';
		this.separator.mainElement.style.height = (separatorY-(WINDOW_CONTAINER_BORDER*2))+'px';
		mainContainerBody.style.height = curBodyHeight+"px";
		for (var y=0;y<this.separator.relElements.length;y++)
		{
			//
			var currentRelElement = this.separator.relElements[y];
			var relWinBody = this.separator.relElements[y].childNodes[4];
			//
			var curContainerTop = separatorY+this.separator.height;
			var curElementHeight = maxHeight-curContainerTop-(WINDOW_CONTAINER_BORDER*2);
			//
			currentRelElement.style.top = curContainerTop+"px";
			currentRelElement.style.height = curElementHeight+"px";
			//
			var curBodyHeight = curElementHeight-relWinBody.offsetTop-WINDOW_CONTAINER_BODY_BORDER*2;
			
			relWinBody.style.height = curBodyHeight+"px";
			//
		}
	};
	this.move = function(){};
	this.set=function(oSeparator)
	{
		this.separator = oSeparator;
	};
};
function dragDivElement()
{
	this.oElement = null;
	this.startPosX = 0;
	this.startPosY= 0;
	this.sizeTopFromY =0;
	this.sizeLeftFromX =0;
	this.stop=function()
	{
		this.oElement = null;
		currentDrag = 
		{
			stop:function(){},
			move:function(){}
		};
	};
	this.move= function(){};
	this.set= function(oElement)
	{
		this.oElement = oElement;
	};
	this.setMarginFromY= function(){
		this.sizeTopFromY = this.oElement.offsetTop-this.startPosY;
	};
	this.setMarginFromX= function(){
		this.sizeLeftFromX = this.oElement.offsetLeft-this.startPosX;
	};
}
var currentDrag = {
	stop:function(){},
	move:function(){}
};

function oHTMLElement()
{
		this.HTMLElementName = null;
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
				if ((HTMLElementIn==undefined)&&(this.HTMLElementName==null))
				{
					throw new Error("Error:Class oHTMLElement::set(). error: HTMLElementName fails");
				}
				if (this.HTMLElementName)
				{
					HTMLElementIn=this.HTMLElementName;
				}else if(HTMLElementIn){
					this.HTMLElementName=HTMLElementIn;
				}
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
function genericContainer()
{
	this.width = null;
	this.height = null;
	this.top = null;
	this.left = null;
	this.constructor = function()
	{
		try
		{
			//this.HTMLElementType = "div";
			//this.set(this.HTMLElementType);
			this.set();
			this.setOElemetSize();
			//this.oElement = document.getElementById("mainContainerID").appendChild(this.oElement);
			//this.setOElemetSize();
		}catch(e){
			throw new Error("Error:Class genericContainer::constructor()"+e.message);
		}
	};
	this.setPosAndSize = function(ntop,nleft,nwidth,nheight)
	{
		try
		{
			if (this.oElement==null)
			{
				this.Style = "position:absolute;top:"+ntop+"px;left:"+nleft+"px;width:"+nwidth+"px;height:"+nheight+"px";
				//this.set(this.HTMLElementType);
				this.set();
			}else{
				this.oElement.style.top = ntop+"px";
				this.oElement.style.left = nleft+"px";
				this.oElement.style.width = nwidth+"px";
				this.oElement.style.height = nheight+"px";
			}
			this.setOElemetSize();
		}catch(e){
			throw new Error("Error:Class genericContainer::setPosAndSize()"+e.message);
		}
	}; 
	this.setOElemetSize=function()
	{
		this.width = this.oElement.offsetWidth;
		this.height = this.oElement.offsetHeight;
		this.top = this.oElement.offsetTop;
		this.left = this.oElement.offsetLeft;
	};
}
genericContainer.prototype = new oHTMLElement();

function Separator(top,left,width,height,orientation)
{
	this.HTMLElementName = "img";
	this.className = "separator";
	this.size =4;
	this.Style="position:absolute;top:"+top+"px;left:"+left+"px;width:"+this.size+"px;height:"+height+"px;cursor:move;margin:0;padding:0;background:#ECE9D8";//background:red;cursor:move;margin:0;padding:0 color:#C0C0C0 ;
	this.Attributes="src=img.gif,boder=1";
	this.orientation = null;
	this.mainElement=null;//ref element
	this.relElements=new Array();//each element is a htmlContainer
	this.x=null;
	this.y=null;
	this.topLimit=50;
	this.leftLimit=300;
	this.rightLimit=0;
	this.bottomLimit=0;
	this.addRelElement=function(HTMLElement)
	{
		this.relElements.push(HTMLElement);
	};
	this.setOrientation=function(sOrientation)
	{
		if ((sOrientation.toUpperCase() == "VERTICAL")||(sOrientation.toUpperCase() == "HORIZONTAL"))
		{
			this.orientation = sOrientation.toUpperCase();
		}
	};
	this.draw=function(sOrientation)
	{
		this.setOrientation(sOrientation);
		this.constructor();
		var oSeparator = this;
		this.oElement.onmousedown = function(e)
		{
			oSeparator.onMouseDown(e);
		};
	};
	this.remove=function()
	{
		if (this.oElement)
		{
			var removedNode = this.oElement.parentNode.removeChild(this.oElement);
		}
	};
	this.onMouseDown = function(e)
	{
		if(document.all)e = event;
		this.x = (this.orientation=="VERTICAL")?e.clientX:null;
		this.y = (this.orientation=="HORIZONTAL")?e.clientY:null;
		if (this.orientation=="VERTICAL")
		{
			verticalSeparator.set(this);
			currentDrag = verticalSeparator;
		}	
		if (this.orientation=="HORIZONTAL")
		{
			horizontalSeparator.set(this);
			currentDrag = horizontalSeparator;
		}
	};
	this.setOrientation(orientation);
}
Separator.prototype = new genericContainer();
try
{
function toolbarButton()
{
	this.HTMLElementName = "button";
	this.Style ="";
	this.relMenuOption = null;
	this.onclick = function(){};
	this.enable = function(){
		if (this.relMenuOption)
		{
			this.relMenuOption.enable();
		}
		//this.oElement.setAttribute("disabled","true");
		//this.oElement.disabled = false;
		this.oElement.removeAttribute("disabled");
	};
	this.disable = function(){
		if (this.relMenuOption)
		{
			this.relMenuOption.disable();
		}
		//this.oElement.removeAttribute("disabled");
		//this.oElement.disabled = true;
		this.oElement.setAttribute("disabled","true");
		
	};
};
toolbarButton.prototype = new oHTMLElement();
toolbarButton.prototype.construct = function()
{
	this.set();
	var self = this;
	this.oElement.onclick = function()
	{
		self.onclick();
	};
};
toolbarButton.prototype.setrelMenuOption = function(oMenuOptionIn)
{
	this.relMenuOption = oMenuOptionIn;
};
var reload = new toolbarButton();
reload.NodeValue ="Reload";
reload.onclick = function(){

};
var changeDOM = new toolbarButton();
changeDOM.NodeValue ="Change DOM";
changeDOM.onclick = function(){
	oChange.doAction();
};
var createAttribute = new toolbarButton();
createAttribute.NodeValue ="Add Attribute";
createAttribute.onclick = function(){
	createNewAttribute();
};
var saveDOM = new toolbarButton();
saveDOM.NodeValue ="Save";
saveDOM.onclick = function(){
	oSave.doAction();
};
var removeElement = new toolbarButton();
removeElement.NodeValue ="Remove";
removeElement.onclick = function(){
	oRemove.doAction();
};
var appendChild = new toolbarButton();
appendChild.NodeValue ="Append";
appendChild.onclick = function(){
	oAppendChild.doAction();
};
var insertBefore = new toolbarButton();
insertBefore.NodeValue ="Insert";
insertBefore.onclick = function(){
	oInsertBefore.doAction();
};
var renameElement = new toolbarButton();
renameElement.NodeValue ="Rename";
renameElement.onclick = function(){
	oRename.doAction();
};

var avalMetas = new toolbarButton();
avalMetas.NodeValue ="Metas";
avalMetas.Style ="color:red";
avalMetas.onclick = function()
{
	try
	{
		avalMeta();
	}catch(e){
		window.alert("avalMetas button fails. error: "+e.message);
	}
};

var avalScripts = new toolbarButton();
avalScripts.NodeValue ="Script";
avalScripts.Style ="color:red";
avalScripts.onclick = function(){
	avalScript();
};
}catch(e){
	window.alert(e.message);
}
function headerElement()
{
try
{
	this.windowName = new oHTMLElement();
	this.minButton = new oHTMLElement();
	this.maxButton = new oHTMLElement();
	this.closeButton = new oHTMLElement();
	
	this.HTMLElementName = "div";
	//this.NodeValue ="headerId";
	this.ClassName= "classHeader";
	this.Style = "position:relative;display:block;height:22px;background-image:url(images/top_center.gif);background-repeat:repeat-x";
	this.set();
	//
	this.windowName.HTMLElementName = "span";
	this.windowName.ClassName = "floatLeft";
	this.windowName.Style = "float:left;color:white;font-size:80%;font-weight:bold";
	this.windowName.InnerHTML = "Window Name";
	this.windowName.set();
	//
	this.minButton.HTMLElementName = "span";
	this.minButton.ClassName = "minButton";
	this.minButton.Style = "float:right";
	this.minButton.InnerHTML = "<img src='images/minimize.gif' alt='minimize' border='0'/>";
	this.minButton.set();
	
	this.maxButton.HTMLElementName = "span";
	this.maxButton.ClassName = "maxButton";
	this.maxButton.Style = "float:right";
	this.maxButton.InnerHTML = "<img src='images/maximize.gif' alt='Maximize' border=''/>";
	this.maxButton.set();
	
	this.closeButton.HTMLElementName = "span";
	this.closeButton.ClassName = "closeButton";
	this.closeButton.Style = "float:right;display:none";
	this.closeButton.InnerHTML = "<img src='images/close.gif' alt='Maximize' border=''/>";
	this.closeButton.set();
	
	var separator = createHTMLElement("div",null,null,null,null,"clear:both;display:block",null);
	
	var windowTopContainer = createHTMLElement("div",null,"headerTopContainer",null,null,"clear:both;display:block",null);
	this.windowName.oElement = windowTopContainer.appendChild(this.windowName.oElement);
	this.closeButton.oElement = windowTopContainer.appendChild(this.closeButton.oElement);
	this.maxButton.oElement = windowTopContainer.appendChild(this.maxButton.oElement);
	this.minButton.oElement= windowTopContainer.appendChild(this.minButton.oElement);
	
	this.oElement.appendChild(windowTopContainer);
	this.oElement.appendChild(separator);
}catch(e)
{
	window.alert("headerElement fails: "+e.message);
}
}
headerElement.prototype = new oHTMLElement();

function toolbarElement()
{
	try
	{
		this.buttonPannel = new oHTMLElement();
		this.HTMLElementName = "div";
		this.ClassName= "toolbarHeader";
		this.set();
		this.buttonPannel.HTMLElementName = "div";
		this.buttonPannel.ClassName= "buttonPannel";
		this.buttonPannel.Style = "position:relative;overflow:auto;margin:2px;float:right";//padding:0px 3px 3px 3px;
		this.buttonPannel.set();
		this.oElement.appendChild(this.buttonPannel.oElement);
	}catch(e)
	{
		window.alert("headerElement fails: "+e.message);
	}
}
toolbarElement.prototype = new oHTMLElement();
function winTitleElement()
{
	try
	{
	this.Border=1;
	this.HTMLElementName = "div";
	this.NodeValue ="Value";
	this.Style = "float:left;border:"+this.Border+"px solid #707070;width:150px;margin:3px 3px 0px 3px;padding:3px;border-bottom:0;background:#6699CC;overflow:hidden;width:200px";
	this.ClassName = "Title";
	this.HighLight = null;
	this.titleDescription = null;
	this.set();
	var oSelf = this;
	this.oElement.onmouseover = function()
	{
		try
		{
			var absoluteTop = getHTMLElementTop(this);
			var absoluteLeft = getHTMLElementLeft(this);
			var elementHeight = this.offsetHeight+oSelf.Border*2;
			Z_INDEX++;
			oSelf.HighLight = createHTMLElement("div",oSelf.titleDescription,null,null,null,"position:absolute;top:"+absoluteTop+"px;margin:0;padding:0;left:"+absoluteLeft+"px;background:#FFFFCC;height:"+elementHeight+"px;z-index:"+Z_INDEX,null);
			oSelf.HighLight = document.body.appendChild(oSelf.HighLight);
			if (oSelf.HighLight.offsetWidth<this.offsetWidth)
			{
				oSelf.HighLight.style.width = this.offsetWidth+"px";
			}
			oSelf.HighLight.onmouseout = function()
			{
				this.parentNode.removeChild(this);
				oSelf.HighLight = null;
				Z_INDEX--;
			};
		}catch(e){
			window.alert("winTitleElement: this.oElement.onmouseover"+e.message);
		}
	};
	}catch(e){
		window.alert("winTitleElement: "+e.message);
	}
}
winTitleElement.prototype = new oHTMLElement();
function bodyElement()
{
	//
	//
	this.HTMLElementName = "div";
	//this.NodeValue ="body";
	this.ClassName= "bodyHeader";
	this.Border=WINDOW_CONTAINER_BORDER;
	this.Style = "dispaly:block;overflow:scroll;background:#F9F9F9;border:"+this.Border+"px solid #6699CC;text-align:center;margin:0;padding:0";
	this.set();
}
bodyElement.prototype = new oHTMLElement();
function containerWindow()
{
	this.SeparatorBorder=1;
	this.header = new headerElement();
	this.toolbar = new toolbarElement();
	this.title = new winTitleElement();
	this.winBody = new bodyElement();
	this.HTMLElementName = "div";
	this.buttons = new Array();
}
containerWindow.prototype = new genericContainer();
containerWindow.prototype.setWindowTitle = function(title_in)
{
	this.title.titleDescription = title_in;
	var tempDiv = createHTMLElement("div",title_in,"floatLeft",null,null,this.title.Style,null);//this.title.Style
	tempDiv = document.body.appendChild(tempDiv);
	tempDiv.style.height = "auto";
	tempDiv.style.width = "auto";
	tempDiv.style.overflow = "visible";
	//
//	var titleHeight = this.title.oElement.offsetHeight;
	var titleWidth = this.title.oElement.offsetWidth-2;
	//
	var curSTR = title_in;
	if (titleWidth<tempDiv.offsetWidth)
	{
		var restWidth = tempDiv.offsetWidth-titleWidth;
		var restPercent = (restWidth*100)/tempDiv.offsetWidth;
		//
		var restchars = Math.round((restPercent*(tempDiv.innerHTML.length))/100);
		restchars +=3;
		var charsToCatch = Math.round(tempDiv.innerHTML.length-restchars);
		
		curSTR = tempDiv.innerHTML.substr(restchars,charsToCatch);
		curSTR = "..."+curSTR;
	}
	this.title.oElement.innerHTML =curSTR;
	document.body.removeChild(tempDiv);
	//
};
containerWindow.prototype.setWindowName = function(winName)
{
	this.header.windowName.oElement.innerHTML = winName;
};
containerWindow.prototype.draw =function()
{
	try
	{
		this.set();
		this.header.oElement = this.oElement.appendChild(this.header.oElement);
		this.toolbar.oElement = this.oElement.appendChild(this.toolbar.oElement);
		this.title.oElement = this.oElement.appendChild(this.title.oElement);
		var separator = createHTMLElement("div","",null,null,null,"clear:both;display:block;border-bottom:"+this.SeparatorBorder+"px solid #707070",null);
		this.oElement.appendChild(separator);
		this.winBody.oElement = this.oElement.appendChild(this.winBody.oElement);
		this.header.oElement.onmouseover = function()
		{
			if (this.title.HighLight)
			{
				this.title.HighLight.parentNode.removeChild(this.title.HighLight);
			}
		};
	}catch(e)
	{
		window.alert("containerWindow fails: "+e.message);
	}
};
//
function containersOperations(){}
	containersOperations.prototype.setSeparator=function(sOrientation)
	{
		try
		{
			
			this.separator.remove();
			
			this.separator.draw(sOrientation);
			
			this.container.oElement.parentNode.appendChild(this.separator.oElement);
			
			this.setSeparatorSize();
			
			this.setSeparatorMainElement();
			
		}catch(e)
		{
			window.alert("containerWindow fails: "+e.message);
		}
	};
	containersOperations.prototype.setSeparatorSize = function()
	{
		var relElementWidth = this.container.width;//-this.separator.border*2;
		var relElementHeight = this.container.height;//-this.separator.border*2;
		var relElementTop = this.container.top;
		var relElementLeft = this.container.left;
		if (this.separator.orientation=="VERTICAL")
		{
			this.separator.setPosAndSize(relElementTop, relElementWidth, this.separator.size, relElementHeight);//this.separator.border*2			
		}else if (this.separator.orientation=="HORIZONTAL")
		{
			this.separator.setPosAndSize(relElementTop+relElementHeight, relElementLeft, relElementWidth,this.separator.size);//this.separator.size -this.separator.border*2
		}
	};
	containersOperations.prototype.setSeparatorMainElement = function()
	{
		this.separator.mainElement = this.container.oElement;
	};
	containersOperations.prototype.setBodyHeight = function()
	{
		var containerHeight = this.container.oElement.offsetHeight;
		var nheight = containerHeight-this.container.winBody.oElement.offsetTop-(this.container.winBody.Border*2)- WINDOW_CONTAINER_BORDER*2;
		var curBodyheight = nheight+"px";
		
		this.container.winBody.oElement.style.height = curBodyheight;
	};
	containersOperations.prototype.setSeparatorLimits = function()
	{
		if(this.separator.mainElement)
		{
			this.separator.topLimit=100;
			this.separator.leftLimit=240;
			this.separator.rightLimit=this.separator.mainElement.parentNode.offsetWidth-180;
			this.separator.bottomLimit=this.separator.mainElement.parentNode.offsetHeight-100;
		}
	};
	containersOperations.prototype.addButtonIntoPannel = function(ButtonElementIn)
	{
		ButtonElementIn.construct();
		this.container.toolbar.buttonPannel.oElement.appendChild(ButtonElementIn.oElement);
		this.container.buttons.push(ButtonElementIn);
	};
	containersOperations.prototype.enableButtons = function()
	{
		try
		{
				var buttons = this.container.buttons;
			for(var x=0;x<buttons.length;x++)
			{
				buttons[x].enable();
			}
		}catch(e)
		{
			window.alert("containersOperations.enableButtons fails: "+e.message);
		}
	};
	containersOperations.prototype.disableButtons = function()
	{
		try
		{
			var buttons = this.container.buttons;
			for(var x=0;x<buttons.length;x++)
			{
				buttons[x].disable();
			}
		}catch(e)
		{
			window.alert("containersOperations.disableButtons fails: "+e.message);
		}
	};
	containersOperations.prototype.closeWindow = function()
	{
		try
		{
			this.container.oElement.parentNode.removeChild(this.container.oElement);
			var modalLayer = document.getElementById("IdModalLayer");
			if (modalLayer)
			{
				var removedLayer = modalLayer.parentNode.removeChild(modalLayer);
			}
			this.afterClose();
		}catch(e)
		{
			window.alert("containersOperations.closeWindow fails: "+e.message);
		}
	};
	containersOperations.prototype.accepted = function()
	{
		this.container.oElement.parentNode.removeChild(this.container.oElement);
		var modalLayer = document.getElementById("IdModalLayer");
		if (modalLayer)
		{
			var removedLayer = modalLayer.parentNode.removeChild(modalLayer);
		}
		this.doAction();
	};
function oLevel(DOMElementIn,nLevel,sIndex){
	try
	{
		this.numOfElements =DOMElementIn.childNodes.length;
		this.Elements = new Array();
		this.index = (sIndex==undefined)?"root":sIndex;
		this.desc = DOMElementIn.nodeName;
		this.setElement= function(DOMElementIn,nLevel,sIndex)
		{
			nLevel--;
			this.Elements = new Array(this.numOfElements);
			var nodeIndexList = "";
			for (var x=0;x<this.Elements.length;x++)
			{
				if (DOMElementIn.childNodes[x].nodeType==1)//Store the childIndex only for Elements
				{
					var currentIndex = x.toString();
					nodeIndexList = (sIndex=="root")?currentIndex:sIndex+","+currentIndex;
					var currentLevel = new oLevel(DOMElementIn.childNodes[x],nLevel,nodeIndexList);
					this.Elements[x]=currentLevel;
				}
			}
		};
		this.expand = function()
		{
			var expandButton = document.getElementById("treeContainer_"+this.index).parentNode.firstChild.firstChild;//expand button
			var curSRC = expandButton.getAttribute("src");
			var regFileName = new RegExp(/\w*.\w*$/);
			var pngFileName = regFileName.exec(curSRC)[0];
			if (pngFileName=="up.png")//if the element is not expanded, otherwise has been expandend bevor.
			{
				fireEvent(expandButton,"click");
			}
		};
		this.expand();
		if (nLevel>0)
		{
			this.setElement(DOMElementIn,nLevel,this.index);
		}
	}catch(e){
		throw new Error("oLevel fails: "+e.message);
	}
}
function genericTreeContainer(top,left,width,height)
{
	try
	{
		this.container = new containerWindow();
		//container
		this.Border = WINDOW_CONTAINER_BORDER;
		this.container.ElementId = "Tree";
		this.container.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:"+this.Border+"px solid #707070;overflow:auto;background-color:#CCCCCC";
		this.draw = function()
		{
			try
			{
				this.container.draw();
				this.container.winBody.oElement.style.textAlign ="left"; 
				this.addButtonIntoPannel(appendChild);
				this.addButtonIntoPannel(insertBefore);
				this.addButtonIntoPannel(renameElement);
				this.addButtonIntoPannel(removeElement);
			}catch(e){
				throw new Error("genericTreeContainer: "+e.message);
			}
		};
		this.adaptBody = function()
		{
			this.setBodyHeight();
		};
		this.loadTree= function()
		{
			try
			{
				var oCurBody = this.container.winBody.oElement;
				removeChilds(oCurBody);
				//enable the metas und script to the original values.
				selectedFile.setEnableMetas(true);
				selectedFile.setEnableScripts(true);
				var dataDocumentElement = selectedFile.currentDOM.documentElement;
				var NewElements = CreateTreeByDOMElement(dataDocumentElement);
				if (dataDocumentElement)
				{
					oCurBody.appendChild(NewElements);
					CurrentTreeElement.setdocumentElementName(dataDocumentElement.nodeName);
					CurrentTreeElement.highLight();
					if (CurrentTreeElement.element)
					{
						CurrentTreeElement.expand();
					}
					var expandTreeByLevel = new oLevel(dataDocumentElement,2);
					if (CurrentTreeElement.element)
					{
						var bodyRange = oCurBody.offsetTop+oCurBody.offsetHeight;
						if (CurrentTreeElement.element.offsetTop > bodyRange)
						{
							oCurBody.scrollTop = CurrentTreeElement.element.offsetTop;
						}
						var editElement = CurrentTreeElement.element.firstChild.childNodes[1];//expand button
						if (editElement)
						{
							fireEvent(editElement, "click");
						}
					}
				}
				//set the metas and the script acording to the user specifications.
				selectedFile.setEnableMetas(ENABLE_METAS);
				selectedFile.setEnableScripts(ENABLE_SCRIPTS);
				
				//oCurBody
			}catch(e){
				throw new Error("loadTree fails: "+e.message);
			}
		};
		this.initTree = function()
		{
			this.container.winBody.oElement.innerHTML = "<h4>Loading Tree</h4>";
		};
		this.avalButtonsByNode=function (DOMElement)
		{
			if (this.container.header.windowName.oElement.innerHTML=="Project Configuration File")
			{
				return;
			}
			if ((selectedFile.fileExtension.toUpperCase()=="HTML")||(selectedFile.fileExtension.toUpperCase()=="XHTML"))
			{
				renameElement.disable();
			}else{
				renameElement.enable();	
			}
		};
	}catch(e){
		throw new Error("Error:Class genericTreeContainer::constructor()"+e.message);
	}
}
genericTreeContainer.prototype = new containersOperations();
genericTreeContainer.prototype.container = new Object();
genericTreeContainer.prototype.separator = new Separator(0,0,0,0,"vertical");

function genericSourceCodeContainer(top,left,width,height)
{
	try
	{
		this.container = new containerWindow();
		this.Border = WINDOW_CONTAINER_BORDER;
		this.container.HTMLElementName = "div";
		//this.container.NodeValue ="preview";
		this.container.ElementId = "Preview";
		this.container.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:"+this.Border+"px solid #707070;overflow:auto;background-color:#CCCCCC;display:none";
		//this.container.header.oElement.innerHTML ="preview";
		//this.container.constructor();
		this.TextArea.HTMLElementName= "textarea";
		this.TextArea.Style = "border:1px solid #707070;margin: 0.5%;padding:0px 0px 5px 0px;width:95%";
		this.TextArea.set();
		this.draw = function()
		{
			try
			{
			this.container.draw();
			this.TextArea.oElement = this.container.winBody.oElement.appendChild(this.TextArea.oElement);
			}catch(e){
				window.alert("genericSourceCodeContainer"+e.message);
			}
		};
		this.adaptBody = function()
		{
			this.setBodyHeight();
		};
	}catch(e){
		throw new Error("Error:Class genericSourceCodeContainer::constructor()"+e.message);
	}
}
genericSourceCodeContainer.prototype = new containersOperations();
genericSourceCodeContainer.prototype.container = new Object();
genericSourceCodeContainer.prototype.separator = new Separator(0,0,0,0,"horizontal");
genericSourceCodeContainer.prototype.TextArea = new oHTMLElement();

function genericPreviewContainer(top,left,width,height)
{
	try
	{
		this.container = new containerWindow();
		this.Border = WINDOW_CONTAINER_BORDER;
		this.container.HTMLElementName = "div";
		this.container.ElementId = "Preview";
		this.container.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:"+this.Border+"px solid #707070;overflow:auto;background-color:#CCCCCC";
		this.draw = function()
		{
			try
			{
				this.container.draw();
				//this.addButtonIntoPannel(reload);
				this.addButtonIntoPannel(avalMetas);
				this.addButtonIntoPannel(avalScripts);
			}catch(e){
				window.alert("genericPreviewContainer: "+e.message);
			}
		};
		this.adaptBody = function()
		{
			this.setBodyHeight();
		};
		this.addIFrame = function(sIFrameSRC)
		{
			try
			{
			removeChilds(this.container.winBody.oElement);
			this.container.winBody.oElement.style.overflow = "hidden";
			this.container.winBody.oElement.style.magin = "0";
			this.container.winBody.oElement.style.padding = "0";
			//
			var containerHeight = this.container.oElement.offsetHeight;
			var curBodyHeight = containerHeight-this.container.winBody.oElement.offsetTop;
			var heightPercent = ((curBodyHeight*100)/containerHeight)+"%";
			//
			var containerWidth = this.container.oElement.offsetWidth;
			var curBodyWidth = containerWidth-this.container.winBody.oElement.offsetLeft;
			var WidthPercent = (((curBodyWidth*100)/containerWidth))+"%";
			
			
			var IFrame = document.createElement("iframe");
			if (sIFrameSRC)
			{
				IFrame.src = sIFrameSRC;
			}
			IFrame.id = "previewIFrameId";
			IFrame.frameBorder = "0";
			IFrame.magin = "0 0 0 0";
			IFrame.padding = "0 0 0 0";
			IFrame.scrolling = "yes";
			IFrame.style.zIndex = "-1";
			IFrame.width ="100%";
			IFrame.height ="100%";

			var appededIFrame = this.container.winBody.oElement.appendChild(IFrame);
			}catch(e)
			{
				window.alert("add IFrame fails: "+e.message);
			}
		};
		this.getIFrame = function()
		{
			var iFrame = document.getElementById("previewIFrameId");
			return iFrame;
		};
		this.setXMLDisableView = function()
		{
			var Ps = "<p>On Editing XML Files the preview file is directly related with the currently stored one on the server.</p>";
			Ps += "<p>Save an reload the file if you want the Preview available.</p>";
			var sStyle = "position:absolute;top:30%;left:0;width:100%;text-align:center;color:white";
			var oSelf = this;
			if (!(document.getElementById("previewWarningLayer")))
			{
				var warningLayer = createHTMLElement("div",null,null,"previewWarningLayer",Ps,sStyle,null);
				warningLayer.style.MozOpacity = "0.9";
				warningLayer.style.KhtmlOpacity = "0.9";
				warningLayer.style.filter = "alpha(opacity=" + (0.9 * 100) + ");";
				warningLayer.style.background ="black";
				warningLayer.style.zIndex= Z_INDEX++;
				var warningButton = createHTMLElement("button","Save and Reload",null,null,null,null,null);
				warningLayer = this.container.winBody.oElement.appendChild(warningLayer);
				warningButton = warningLayer.appendChild(warningButton);
				warningButton.onclick = function()
				{
					oSelf.reloadIFrame();
				};
			}

			this.reloadIFrame=function()
			{
				try
				{
				var current_ = document.getElementById("previewWarningLayer");
				var parent = current_.parentNode;
				parent.removeChild(current_);
				oSave.doAction();
				CurrentPreviewElement.enabled=true;
				}catch(e){
					window.alert("reloadIFrame() fails Error: "+e.message);
				}
			};
			//on Editing XML Window the preview file is directly related with the file currently stored on the server.
			//Save an reload the file if you want the this view.
			//button "Save and Reload" setXMLDisableView
		};
	}catch(e){
		throw new Error("Error:Class genericPreviewContainer::constructor()"+e.message);
	}
}
genericPreviewContainer.prototype = new containersOperations();
genericPreviewContainer.prototype.container = new Object();
genericPreviewContainer.prototype.separator = new Separator(0,0,0,0,"horizontal");
/////////////

//                                       editor

/////////////////

//
try
{

function AttContainer(AttName, AttValue)
{
	try
	{
		this.HTMLElementName = "div";
		this.Style = "border:1px solid #CCCCCC;margin:5px;padding:5px";
		this.set();
		var curAttHeader = new oHTMLElement();
		curAttHeader.HTMLElementName = "div";
		curAttHeader.Style = "display:block;position:relative;margin:0;padding:0";
		curAttHeader.set();
		curAttHeader.oElement = this.oElement.appendChild(curAttHeader.oElement);
		//
		this.AttName = new oHTMLElement();
		this.AttBtnRemove = new oHTMLElement();
		this.AttValue = new oHTMLElement();
		//
		this.AttName.HTMLElementName = "span";
		this.AttName.Style = "float:left";
		this.AttName.ClassName = "floatLeft";
		this.AttName.InnerHTML = AttName;
		this.AttName.set();
		this.AttName.oElement = curAttHeader.oElement.appendChild(this.AttName.oElement);
		//
		this.AttBtnRemove.HTMLElementName = "button";
		this.AttBtnRemove.Style = "float:right";
		this.AttBtnRemove.ClassName = "floatRight";
		this.AttBtnRemove.NodeValue = "remove";
		this.AttBtnRemove.set();
		this.AttBtnRemove.oElement = curAttHeader.oElement.appendChild(this.AttBtnRemove.oElement);
		//
		var curAttBody = new oHTMLElement();
		curAttBody.HTMLElementName = "div";
		//curAttBody.Style = "clear:both;display:block;position:relative;margin:0;padding:0;width:100%";
		curAttBody.Style = "clear:both;margin:0;padding:0;text-align:right";
		curAttBody.set();
		curAttBody.oElement = this.oElement.appendChild(curAttBody.oElement);
		//
		this.AttValue.HTMLElementName = "input";
		this.AttValue.Style = "width:97%";
		//this.AttValue.Attributes = "value="+AttValue;
		this.AttValue.set();
		this.AttValue.oElement = curAttBody.oElement.appendChild(this.AttValue.oElement);
		this.AttValue.oElement.value = AttValue;
		
		//
	}catch(e)
	{
		window.alert("class AttContainer fails: "+ e.message);
	}
};
AttContainer.prototype = new oHTMLElement();
function NodeEditor()
{
	this.textEditor.HTMLElementName = "textarea";
	this.textEditor.Style = "border:1px solid #707070;margin: 0.5%;padding:0px 0px 5px 0px;width:95%";
	this.textEditor.set();
	this.ButtonDisabled = false;
	this.attributes = new Object();
	this.addAttribute = function(AttName, AttValue)
	{
		try
		{
			var newAttContainer = new AttContainer(AttName, AttValue);
			
			if (this.ButtonDisabled)
			{
				newAttContainer.AttBtnRemove.oElement.setAttribute("disabled","true");
			}else{
				newAttContainer.AttBtnRemove.oElement.removeAttribute("disabled");
			}
			var curHTMLElement = this.textEditor.oElement.parentNode.insertBefore(newAttContainer.oElement,this.textEditor.oElement);
			this.attributes[AttName] = newAttContainer;
			var oSelf = this;
			this.attributes[AttName].AttBtnRemove.oElement.onclick = function()
			{
				oSelf.removeAttribute(AttName);
			};
			//this.textEditor.oElement.style.height =  (this.textEditor.oElement.offsetHeight-curHTMLElement.offsetHeight)+"px";
		}catch(e)
		{
			window.alert("class NodeEditor.addAttribute fails: "+ e.message);
		}
	};
	this.removeAttribute = function(AttName)
	{
		try
		{
			var innerHTML = "<div class='nodeLegend'>Are you sure you want to remove this attribute?</div>";
			confirmWindow.create(innerHTML);
			var dialog = confirmWindow.dialog;
			var oSelf = this;
			dialog.doAction= function()
			{
				var attHeight = oSelf.attributes[AttName].offsetHeight;
				oSelf.attributes[AttName].oElement.parentNode.removeChild(oSelf.attributes[AttName].oElement);
				delete(oSelf.attributes[AttName]);
			}
			//this.textEditor.oElement.height =(this.textEditor.oElement.offsetHeight-attHeight)+"px";
		}catch(e)
		{
			window.alert("class NodeEditor.removeAttribute fails: "+ e.message);
		}
	};
	this.disableRemoveButtons = function()
	{
		try
		{
			for (var x in this.attributes)
			{
				this.attributes[x].AttBtnRemove.oElement.setAttribute("disabled","true");
				//this.attributes[x].AttBtnRemove.oElement.disabled = true;
			}
			this.ButtonDisabled = true;
		}catch(e){
			window.alert("class NodeEditor.disableRemoveButtons fails: "+ e.message);
		}
	};
	
	this.enableRemoveButtons = function()
	{
		try
		{
			for (var x in this.attributes)
			{
				this.attributes[x].AttBtnRemove.oElement.removeAttribute("disabled");
				//this.attributes[x].AttBtnRemove.oElement.disabled = false;
			}
			this.ButtonDisabled = false;
		}catch(e){
			window.alert("class NodeEditor.enableRemoveButtons fails: "+ e.message);
		}
	};
	this.destruct=function()
	{
		for (var x in this.attributes)
		{
			var removedCHild = this.attributes[x].oElement.parentNode.removeChild(this.attributes[x].oElement);
		}
		this.attributes = new Object();
	};
};
//NodeEditor.prototype.attributes = new Object();
NodeEditor.prototype.textEditor = new oHTMLElement();


function genericEditorContainer(top,left,width,height)
{
	try
	{
		this.container =  new containerWindow();
		this.Border = WINDOW_CONTAINER_BORDER;
		this.container.HTMLElementName = "div";
		//this.container.NodeValue ="editor";
		this.container.ElementId = "Editor";
		this.container.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:"+this.Border+"px solid #707070;overflow:auto;background-color:#CCCCCC";
		//this.container.header.oElement.innerHTML ="editor";
		this.draw = function()
		{
			try
			{
				this.container.draw();
				this.addButtonIntoPannel(changeDOM);
				this.addButtonIntoPannel(saveDOM);
				this.addButtonIntoPannel(createAttribute);
			}catch(e){
				window.alert("genericEditorContainer: "+e.message);
			}
		};
		this.adaptBody = function()
		{
			this.setBodyHeight();
		};
		this.editNode = function(NodeValue,sNodeAttributes,NodeInnerHTML)
		{
			this.nodeEditor.textEditor.oElement.removeAttribute("readOnly");
			if (selectedFile.fileExtension=="HTML")
			{
				var upperNodeValue = NodeValue.toUpperCase();
				if ((upperNodeValue=="HTML")||
						(upperNodeValue=="HEAD")||
							(upperNodeValue=="META")||
								(upperNodeValue=="LINK")||
									(IsSGML(upperNodeValue))
					)
				{
					this.nodeEditor.textEditor.oElement.setAttribute("readOnly","true");
				}
			}
			this.nodeEditor.destruct();
			this.container.setWindowTitle(NodeValue);
			this.nodeEditor.textEditor.oElement = this.container.winBody.oElement.appendChild(this.nodeEditor.textEditor.oElement);
			this.nodeEditor.textEditor.oElement.style.height = this.container.winBody.oElement.offsetHeight+"px";
			this.nodeEditor.textEditor.oElement.value = NodeInnerHTML;
			//this.nodeEditor.textEditor.oElement.style.height = 5+"px";
			var aRelatedNodeAttributes = sNodeAttributes.split("#;#");
			var content = "";
			if (aRelatedNodeAttributes.length>0)
			{
				try
				{
					//currentEditor.drawNodeArea();
					for (var x=0;x<aRelatedNodeAttributes.length;x++)
					{
						if (aRelatedNodeAttributes[x])
						{
							var AttName = "";
							var AttContent = "";
							var re = /^(\S+)=([\S\s\W.]*)/;
							var aATT = aRelatedNodeAttributes[x].match(re);
							if (aATT[1])
							{
								var AttName = aATT[1];
							}
							if (aATT[2])
							{
								var AttContent = aATT[2];
							}
							//createAttTextArea(AttName,AttContent);
							this.nodeEditor.addAttribute(AttName, AttContent);
						}
					}
				}catch(e)
				{
					window.alert("class genericEditorContainer.editNode fails: "+ e.message);
				}
			}
		};
	}catch(e){
		throw new Error("Error:Class genericEditorContainer::constructor()"+e.message);
	}
}
genericEditorContainer.prototype = new containersOperations();
genericEditorContainer.prototype.container = new Object();
genericEditorContainer.prototype.separator = new Separator(0,0,0,0,"vertical");
genericEditorContainer.prototype.nodeEditor = new NodeEditor();
}catch(e){
	window.alert(e.message);
}

////////////////////////////////////////////// end editor

function mainContainer(nwidth,nheight)
{
	this.left = "5";
	this.top = "5";
	this.width = nwidth-this.left*2;
	this.height = nheight-this.top*2;
	this.ElementId = "mainContainerID";
	this.HTMLElementName = "div";
	this.Style = "position:relative;top:"+this.top+"px;left:"+this.left+"px;px;margin:0px;padding:0;width:"+this.width+"px;height:"+this.height+"px;background:#AAAAAA;overflow:auto";//overflow:hidden ;overflow:hidden background:#707070
	this.set();
	this.oElement.onclick = function()
	{
		mainMenu.removeMenuHTMLContainers();
	};
	this.draw = function()
	{
		try
		{
			if (document.getElementById(this.ElementId))
			{
				removeChild(document.getElementById(this.ElementId));
				this.set();
			}
			currentHTMLElement = document.body.appendChild(this.oElement);
			this.setPosAndSize(this.top,this.left,this.width,this.height);
			currentHTMLElement = this.oElement;
			this.tree.draw();
			treeHTMLElement = this.tree.container.oElement;
			//
			this.preview.draw();
			previewHTMLElement = this.preview.container.oElement;
			//
			this.editor.draw();
			editorHTMLElement = this.editor.container.oElement;
			//
			this.sourceCodeEditor.draw();
			sourceCodeHTMLElement = this.sourceCodeEditor.container.oElement;
			//
			treeHTMLElement= currentHTMLElement.appendChild(treeHTMLElement);
			previewHTMLElement=currentHTMLElement.appendChild(previewHTMLElement);
			editorHTMLElement=currentHTMLElement.appendChild(editorHTMLElement);
			sourceCodeHTMLElement = currentHTMLElement.appendChild(sourceCodeHTMLElement);;
			/*this.tree.container.oElement.style.display = "none";
			this.editor.container.oElement.style.display = "none";
			this.preview.container.oElement.style.display = "none";*/
			this.setOElemetSize();
			this.tree.container.oElement.style.display = "none";
			this.preview.container.oElement.style.display = "none";
			this.editor.container.oElement.style.display = "none";
			this.sourceCodeEditor.container.oElement.style.display = "none";
		}catch(e){
			window.alert("mainContainer.draw()fails: "+e.message);
		}
	};
	
	this.setTreeView = function()
	{
		try
		{
			this.tree.container.oElement.style.display = "block";
			this.preview.container.oElement.style.display = "block";
			this.editor.container.oElement.style.display = "block";
			//
			//
			this.sourceCodeEditor.container.oElement.style.display = "none";
			var separatorSize = this.tree.separator.size;//separator size is the same for every object this.tree.separator.border*2
			//
			var treeBorder = this.tree.Border*2;
			var editorBorder = this.editor.Border*2;
			var previewBorder = this.preview.Border*2;
			var maxWidth = this.oElement.offsetWidth;
			var maxHeight = this.oElement.offsetHeight-treeBorder;
			//
			//this.tree.container.oElement.style.display = "block";
			this.tree.container.setPosAndSize(0, 0,(maxWidth/2)-separatorSize-treeBorder, maxHeight);
			this.tree.setSeparator("vertical");
			this.tree.separator.addRelElement(this.preview.container.oElement);
			this.tree.separator.addRelElement(this.editor.container.oElement);
		
			//window.alert("separator background: "+this.tree.separator.oElement.style.background);
			//
			
			var previewTop = this.tree.container.top;
			var previewLeft = this.tree.separator.left+this.tree.separator.width;
			var previewWidth = this.oElement.offsetWidth-this.tree.container.width-previewBorder-separatorSize;
			var previewHeight = (this.tree.container.height/2)-separatorSize;
			//
			this.preview.container.setPosAndSize(previewTop,previewLeft, previewWidth,previewHeight);
			this.preview.setSeparator("horizontal");
			this.preview.separator.addRelElement(this.editor.container.oElement);
		
			this.tree.separator.addRelElement(this.preview.separator.oElement);
			//
			
			var editorTop = this.preview.separator.top+this.preview.separator.height;
			var editorLeft = this.preview.container.left;
			var editorWidth = this.oElement.offsetWidth-this.tree.container.width-editorBorder-separatorSize;
			var editorHeight = maxHeight-this.preview.container.height-separatorSize;
			//
			this.editor.container.setPosAndSize(editorTop,editorLeft, editorWidth,editorHeight);
			//
			this.editor.adaptBody();
			this.tree.adaptBody();
			this.preview.adaptBody();
			//
			
			this.editor.setSeparatorLimits();
			this.tree.setSeparatorLimits();
			this.preview.setSeparatorLimits();
		}catch(e){
			window.alert("mainContainer.setTreeView()fails: "+e.message);
		}
	};
	this.setSourceCodeView=function()
	{
		this.tree.container.oElement.style.display = "none";
		this.preview.container.oElement.style.display = "none";
		this.editor.container.oElement.style.display = "none";
		//
		if (this.tree.separator.oElement) this.tree.separator.oElement.style.display = "none";
		if (this.preview.separator.oElement)this.preview.separator.oElement.style.display = "none";
		if (this.editor.separator.oElement) this.editor.separator.oElement.style.display = "none";
		//
		this.sourceCodeEditor.container.oElement.style.display = "block";
		//
		var sourceCodeEditorBorder = this.sourceCodeEditor.Border*2;
		var maxWidth = this.oElement.offsetWidth;
		var maxHeight = this.oElement.offsetHeight-sourceCodeEditorBorder;
		//
		this.sourceCodeEditor.container.setPosAndSize(0, 0,maxWidth-sourceCodeEditorBorder, maxHeight);
		this.sourceCodeEditor.adaptBody();
		this.sourceCodeEditor.TextArea.oElement.style.height = (this.sourceCodeEditor.container.winBody.oElement.offsetHeight-this.sourceCodeEditor.TextArea.oElement.offsetTop)+"px" ;
	};
	this.setEditorView=function()
	{
		this.tree.container.oElement.style.display = "block";
		this.preview.container.oElement.style.display = "block";
		this.editor.container.oElement.style.display = "block";
		this.sourceCodeEditor.container.oElement.style.display = "none";
		//
	};
	this.setPreviewView = function(){};
}
mainContainer.prototype = new genericContainer();
mainContainer.prototype.tree = new genericTreeContainer(0,0,0,0);
mainContainer.prototype.preview = new genericPreviewContainer(0,0,0,0);
mainContainer.prototype.editor = new genericEditorContainer(0,0,0,0);
mainContainer.prototype.sourceCodeEditor = new genericSourceCodeContainer(0,0,0,0);

window.initBodySize=function()
{
	try
	{
		bodyHeight = this.getBodyHeight();
		bodyWidth = this.getBodyWidth();
	}catch(e)
	{
		window.alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
};
window.getBodyWidth=function()
{
	try
	{
		var nWidth = 1207;
		var currentBodyWidth = document.body.offsetWidth;
		document.body.style.width = "100%";
		nWidth  = document.body.offsetWidth;
		if( document.body && (document.body.clientWidth ) )
		{
			nWidth  =document.body.clientWidth;
		}
		document.body.style.width = currentBodyWidth+"px";
		return nWidth;
	}catch(e)
	{
		window.alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
};
window.getBodyHeight= function()
{
	try
	{
		var nHeight = 768;
	//	if( document.body && (document.body.clientHeight ) ) 
	//	{
	//		nHeight = document.body.clientHeight;
	//	}else if(( document.documentElement && document.documentElement.clientHeight ))  
	//	{
			nHeight = document.documentElement.clientHeight;
//		}
		return nHeight;
	}catch(e)
	{
		window.alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
};

function windowFooter()
{
	try
	{
		this.HTMLElementName = "div";
		this.Style = "display:block;text-align:center;background:#CCCCCC;border-top:3px solid #707070";//border:"+WINDOW_CONTAINER_BORDER+"px solid #707070;width:100%;
		this.OKButton = new oHTMLElement();
		this.CancelButton = new oHTMLElement();
		this.OKButton.HTMLElementName = "button";
		this.OKButton.NodeValue = "OK";
		this.OKButton.set();
		this.CancelButton.HTMLElementName = "button";
		this.CancelButton.NodeValue = "Cancel";
		this.CancelButton.set();
		this.constructor();
		this.OKButton.oElement = this.oElement.appendChild(this.OKButton.oElement);
		this.CancelButton.oElement = this.oElement.appendChild(this.CancelButton.oElement);
		var self = this;
	}catch(e){
		window.alert("Error:Class windowFooter: "+e.message);
	}
}
windowFooter.prototype = new genericContainer();

function floatWindow(windowId,top,left,width,height)
{
	try
	{
		this.container = new containerWindow();
		//
		this.top = (top)?top:null;
		this.left =(left)?left:null;
		this.width =(width)?width:null;
		this.height =(height)?height:null;
		this.modal = false;
		this.Border = WINDOW_CONTAINER_BORDER;
		this.container.HTMLElementName = "div";
		this.container.ElementId = (windowId)?windowId:null;
		this.container.Style = "position:absolute;border:"+this.Border+"px solid #707070;overflow:auto;background-color:#CCCCCC";
		this.container.Style += (this.top)?";top:"+this.top+"px":"";
		this.container.Style += (this.left)?";left:"+this.left+"px":"";
		this.container.Style +=	(this.width)?";width:"+this.width+"px":"";
		this.container.Style +=	(this.height)?";height:"+this.height+"px":"";
		var closeButton = this.container.header.closeButton;
		this.container.header.closeButton.oElement.style.display = "block";
		this.container.header.minButton.oElement.style.display = "none";
		this.container.header.maxButton.oElement.style.display = "none";
		this.draw = function(sHTML, sIFrameSRC,bModal,bUserInputRequired)
		{
			try
			{
			
			this.container.draw();
			Z_INDEX++;
			this.container.oElement.style.zIndex = Z_INDEX;
			this.setDefaultPosition();
			document.body.appendChild(this.container.oElement);
			this.adaptBody();
			if (sHTML)
			{
				this.addHTML(sHTML);
			}else if(sIFrameSRC){
				this.addIFrame(sIFrameSRC);
			}
			if (bModal)
			{
				this.setModal();
			}
			if (bUserInputRequired)
			{
				//this.container.footer = new windowFooter();
				this.container.oElement.appendChild(this.footer.oElement);
				this.container.oElement.style.height = (this.container.oElement.offsetHeight+this.footer.oElement.offsetHeight)+"px";
			};
			var self = this;
			this.container.header.oElement.onmousedown = function(e)
			{
				if(document.all)e = event;
				self.onmoving(e);
			};
			}catch(e){
				window.alert("Error:Class floatWindow.draw() fails: "+e.message);
			}
		};
		this.adaptBody = function()
		{
			this.setBodyHeight();
		};
		this.onmoving = function(e)
		{
			if(document.all)e = event;
			try{
				 containerDrag.set(this.container.oElement);
				 containerDrag.startPosX = e.clientX;
				 containerDrag.startPosY= e.clientY;
				 containerDrag.setMarginFromY();
				 containerDrag.setMarginFromX();
				 currentDrag =containerDrag;
				
			}catch(e){
				window.alert(e.message);
			}
			
		};
		this.addHTML = function(sHTML)
		{
			this.container.winBody.oElement.innerHTML = sHTML;
		};
		this.addIFrame = function(sIFrameSRC)
		{
			this.container.winBody.oElement.style.overflow = "hidden";
			this.container.winBody.oElement.style.magin = "0";
			this.container.winBody.oElement.style.padding = "0";
			//
			var containerHeight = this.container.oElement.offsetHeight;
			var curBodyHeight = containerHeight-this.container.winBody.oElement.offsetTop;
			var heightPercent = ((curBodyHeight*100)/containerHeight)+"%";
			//
			var containerWidth = this.container.oElement.offsetWidth;
			var curBodyWidth = containerWidth-this.container.winBody.oElement.offsetLeft;
			var WidthPercent = (((curBodyWidth*100)/containerWidth))+"%";
			//			
			var IFrame = document.createElement("iframe");
			IFrame.src = sIFrameSRC;
			IFrame.frameBorder = "0";
			IFrame.magin = "0 0 0 0";
			IFrame.padding = "0 0 0 0";
			IFrame.scrolling = "yes";
			IFrame.style.zIndex = "-1";
			IFrame.width ="100%";
			IFrame.height ="100%";

			var appededIFrame = this.container.winBody.oElement.appendChild(IFrame);
		};
		this.setDefaultPosition = function()
		{
			this.width =(!(this.width))?bodyWidth/2:this.width;
			this.height =(!(this.height))?bodyHeight/2:this.height;
			this.top = (!(this.top))?(bodyHeight/2)-(this.height/2):this.top;
			this.left =(!(this.left))?(bodyWidth/2)-(this.width/2):this.left;
			if ((this.container.oElement.offsetWidth==0)||(this.container.oElement.offsetHeight==0))
			{
				this.container.setPosAndSize(this.top,this.left,this.width, this.height);
			}
		};
		this.setModal=function()
		{
			Z_INDEX--;
			var BodyElement =document.body;
			var layer = createHTMLElement("div",null,null,"IdModalLayer");
			layer.style.position = "absolute";
			layer.style.top = "0px";
			layer.style.left = "0px";
			layer.style.width = bodyWidth+"px";
			layer.style.height = bodyHeight+"px";
			layer.style.background = "white";
			layer.style.zIndex=Z_INDEX;
			layer.style.opacity = "0.4";
			layer.style.MozOpacity = "0.4";
			layer.style.KhtmlOpacity = "0.4";
			layer.style.filter = "alpha(opacity=" + (0.4 * 100) + ");";
			BodyElement.appendChild(layer);
		};
		this.onclosing = function()
		{
			try
			{
			
				this.closeWindow();
			}catch(e){
				window.alert(e.message);
			}
		};
		var oSelf = this;
		closeButton.oElement.firstChild.onclick = function()
		{
			oSelf.onclosing();
		};
		this.footer.OKButton.oElement.onclick = function()
		{
			oSelf.accepted();
		};
		this.footer.CancelButton.oElement.onclick = function()
		{
			oSelf.closeWindow();
		};
		this.afterClose=function(){};
		this.doAction=function(){};
	}catch(e){
		window.alert("Error:Class floatWindow::constructor()"+e.message);
	}
}
floatWindow.prototype = new containersOperations();
floatWindow.prototype.container = new Object();
floatWindow.prototype.footer = new windowFooter();
function oProjektCreate()
{
	this.caption.InnerHTML = "<b>Create new Project:</b>";
	this.caption.Style= "padding:5px";
	this.input.Name="inputProject";
	this.input.Attributes = 'type="text",value=,name="porjecktName"';
	this.input.Style="margin:5px;width:70%";
	this.btnCreate.NodeValue = "Create";
	this.CaptionFileName.InnerHTML = "Projekt Configuration File";
	this.CaptionFileName.Style= "padding:5px";
	this.captionFolder.InnerHTML = "Project Folder:";
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
							oProjektView.doAction();
						}else{
							//window.alert("The projekt could not be created!");
							throw new Error("The projekt could not be created!");
						}
					}catch(e){
						throw new Error("Error:Class oProjektCreate::createElements::AJAXCreateProjekt.reply.onReply()"+e.message);
					}
				};
                                AJAXCreateProjekt.requestSendForm(
                                        "porjectName="+projektName+"&projectFolder="+projektFolder,
                                        "freedom/createproject"
                                );
				//AJAXCreateProjekt.requestSendForm("porjecktName="+projektName+"&ProjectFolder="+projektFolder,"createProject.php");
				//create new Project
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
	this.caption.InnerHTML = "<b>Select an Existing Project:</b>";
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
							oProjektView.doAction();
						}else{
							throw new Error("The projekt could not be selected!");
						}
					}catch(e){
						throw new Error("Error:Class oProjektsSelection::createElements::AJAXSelectProjekt.reply.onReply()"+e.message);
					}
				};
				//AJAXSelectProjekt.requestSendForm("selectedProject="+projektName,"loadProject.php");
				AJAXSelectProjekt.requestSendForm("selectedProject="+projektName,"freedom/loadproject");
				//create new Project
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
					throw new Error("Error:Class oProjektsSelection::getProjekts::RQSTProjects.reply.onReply()"+e.message);
				}
			};
                        RQSTProjeckts.request("freedom/getprojects");
		}catch(e){
			throw new Error("Error:Class oProjektsSelection::getProjekts()"+e.message);
		}
	};
}
oProjektsSelection.prototype.caption=  new oHTMLElement();
oProjektsSelection.prototype.selector=  new oHTMLElement();
oProjektsSelection.prototype.btnSelect=  new oHTMLElement();
//
var notificationWindow = 
{
	dialog:new Object(),
	create:function(innerHTML_in)
	{
		this.dialog = new Object();
		this.dialog = new floatWindow(null,null,null,400,150);
		this.dialog.draw(innerHTML_in,null,true,false);
		this.dialog.container.setWindowName("Notification");
		this.dialog.container.setWindowTitle("Message");
	}
};
//
var confirmWindow = 
{
	dialog:new Object(),
	create:function(innerHTML_in)
	{
		this.dialog = new Object();
		this.dialog = new floatWindow(null,null,null,400,150);
		this.dialog.draw(innerHTML_in,null,true,true);
		this.dialog.container.setWindowName("Confirmation Required");
		this.dialog.container.setWindowTitle("Message");
	}
};
var nodePerformanceWindow = 
{
	dialog:new Object(),
	create:function(top,left,innerHTML_in,title_in,windowName_in)
	{
		this.dialog = new Object();
		this.dialog = new floatWindow(null,top,left,320,200);
		this.dialog.draw(innerHTML_in,null,true,true);
		this.dialog.container.winBody.oElement.style.textAlign = "left";
		this.dialog.container.winBody.oElement.style.paddingLeft = "10px";
		this.dialog.container.setWindowName(windowName_in);
		this.dialog.container.setWindowTitle(title_in);
	}
};
var oViewLoadProject ={
	window: null,
	selectProjekt: new oProjektsSelection(),
	createProjekt: new oProjektCreate(),
	createProjectSeletionWindow:function()
	{
		try
		{
			var currentWindow = this.window;
			currentWindow.draw(null,null,true,false);
			currentWindow.container.setWindowName("Project Selection Dialog");
			currentWindow.container.setWindowTitle("Projects");
			//
			currentWindow.container.winBody.oElement.style.textAlign = "left";
			var divSelect = createHTMLElement("div",null,null,null,null,"display:block",null);
			var divCreate = createHTMLElement("div",null,null,null,null,"display:block;border:1px solid #99BAF3",null);
			
			this.selectProjekt.createElements();
			this.createProjekt.createElements();
			divSelect = currentWindow.container.winBody.oElement.appendChild(divSelect);
			divCreate = currentWindow.container.winBody.oElement.appendChild(divCreate);
			
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
			//
		}catch(e){
			throw new Error("Error:Class DivLoadProject::draw()"+e.message);
		}
	},
	createWindow:function(){
		this.window= new floatWindow("projectsWindow");
		this.createProjectSeletionWindow();
	}
};

document.DOMLoaded=function()
{
	try
	{
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		window.initBodySize();
		if ((warnings.length>0)||(alerts.length>0))
		{
			curAlerts = "";
			for (var y=0;y<alerts.length;y++)
			{
				curAlerts += '<div style="border:1px solid #F0F0F0;padding:5px;margin:5px">'+alerts[y]+'</div>';
			}
			curWarning = "";
			for (var x=0;x<warnings.length;x++)
			{
				curWarning += '<div style="border:1px solid #F0F0F0;padding:5px;margin:5px">'+warnings[x]+'</div>';
			}
			var confirmation = "<p>Load Application?</p>"
			var curWindow = new floatWindow(null,null,null,800,400);
			curWindow.draw(curAlerts+curWarning+confirmation,null,true,true);
			curWindow.doAction= function(){
				load();
			};
		}else{
			load();
		}
	}catch(e)
	{
		window.alert("document.DOMLoaded: "+e.message);
	}
};

function createParseringIframe(sIFrameSRC)
{
	if (!(document.getElementById("parseringIFrame")))
	{
		var IFrame = document.createElement("iframe");
		if (sIFrameSRC)
		{
			IFrame.src = sIFrameSRC;
		}
		IFrame.id = "parseringIFrame";
		IFrame.frameBorder = "0";
		IFrame.magin = "0 0 0 0";
		IFrame.padding = "0 0 0 0";
		IFrame.scrolling = "yes";
		IFrame.style.zIndex = "-1";
		IFrame.width ="1px";
		IFrame.height ="1px";
		document.body.appendChild(IFrame);
	}else{
		document.getElementById("parseringIFrame").src = sIFrameSRC;
	}
	
}
var BrowserDetect = {
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [
			{
				string: navigator.userAgent,
				subString: "Chrome",
				identity: "Chrome"
			},
			{ 	string: navigator.userAgent,
				subString: "OmniWeb",
				versionSearch: "OmniWeb/",
				identity: "OmniWeb"
			},
			{
				string: navigator.vendor,
				subString: "Apple",
				identity: "Safari",
				versionSearch: "Version"
			},
			{
				prop: window.opera,
				identity: "Opera"
			},
			{
				string: navigator.vendor,
				subString: "iCab",
				identity: "iCab"
			},
			{
				string: navigator.vendor,
				subString: "KDE",
				identity: "Konqueror"
			},
			{
				string: navigator.userAgent,
				subString: "Firefox",
				identity: "Firefox"
			},
			{
				string: navigator.vendor,
				subString: "Camino",
				identity: "Camino"
			},
			{		// for newer Netscapes (6+)
				string: navigator.userAgent,
				subString: "Netscape",
				identity: "Netscape"
			},
			{
				string: navigator.userAgent,
				subString: "MSIE",
				identity: "Explorer",
				versionSearch: "MSIE"
			},
			{
				string: navigator.userAgent,
				subString: "Gecko",
				identity: "Mozilla",
				versionSearch: "rv"
			},
			{ 		// for older Netscapes (4-)
				string: navigator.userAgent,
				subString: "Mozilla",
				identity: "Netscape",
				versionSearch: "Mozilla"
			}
		],
		dataOS : [
			{
				string: navigator.platform,
				subString: "Win",
				identity: "Windows"
			},
			{
				string: navigator.platform,
				subString: "Mac",
				identity: "Mac"
			},
			{
				   string: navigator.userAgent,
				   subString: "iPhone",
				   identity: "iPhone/iPod"
		    },
			{
				string: navigator.platform,
				subString: "Linux",
				identity: "Linux"
			}
		]

	};
BrowserDetect.init();
var warnings = new Array();
var alerts = new Array();
var defaultWarning = "<p>For a correct perfomance on saving files I suggest that you disable the automatic caching of files while using this application.</p>"
defaultWarning += "<br />This point still open in this Beta Version.";
defaultWarning += "<p>The application will work anyway and you will be also able to test it. I would be grateful if you test it anyway.</p>";
warnings.push(defaultWarning);
if (BrowserDetect.browser == "Explorer")
{
	if (BrowserDetect.version < 8)
	{
		var _alert = "Yo need at least Microsoft Internet Explorer 8";
		alerts.push(_alert);
	}
	if (BrowserDetect.version >= 8)
	{
		var warning = "<p>Internet Explorer 8 does not allow to send a HTML D.O.M. Document over XMLHttpRequest to the server.";
		warning += "For this reason, you wont be able to store HTML files on the server.</p>";
		warning += "<p>With Internet Explorer 8 you should disable automatic proxy caching for a correct view after modifications. </p>";
		warning += "<p>The rest of the functionalities are available.</p>";
		warnings.push(warning);
	}
}
if (BrowserDetect.browser == "Opera")
{
	if (BrowserDetect.version < 9.8)
	{
		var warning = "This application was tested with opera 9.8. I can not ensure that it will work with your current version.";
		warnings.push(warning);
	}
}
if (BrowserDetect.browser == "Firefox")
{
	if (BrowserDetect.version < 3.6)
	{
		var warning = "This application was tested with Firefox 3.6. I can not ensure that it will work with your current version.";
		warnings.push(warning);
	}
}
if (BrowserDetect.browser == "Safari")
{
	if (BrowserDetect.version < 5)
	{
		var warning = "This application was tested with Safari 5. I can not ensure that it will work with your current version.";
		warnings.push(warning);
	}
}
function load()
{
		try
		{
			mainMenu.displayMain();
			//
			var menuBar= document.getElementById("mainMenu");
			//
			//
			changeDOM.setrelMenuOption(oChange);
			//createAttribute.setrelMenuOption(oMenuOptionIn);
			saveDOM.setrelMenuOption(oSave);
			//
			removeElement.setrelMenuOption(oRemove);
			appendChild.setrelMenuOption(oAppendChild);
			insertBefore.setrelMenuOption(oInsertBefore);
			renameElement.setrelMenuOption(oRename);
			//reload.setrelMenuOption();
			
			oMainContainer = new mainContainer(bodyWidth,bodyHeight-menuBar.offsetHeight);//-menuBar.offsetHeight
			oMainContainer.draw();
			
			oTreeContainer = oMainContainer.tree;
			oPreviewContainer = oMainContainer.preview;
			oEditorContainer = oMainContainer.editor; 
			oSourceCodeEditor = oMainContainer.sourceCodeEditor;
			oViewLoadProject.createWindow();
			oChangeProjekt.enable();	
			
			document.documentElement.onmouseup = function(e)
			{
				try
				{
				if(document.all)e = event;
				currentDrag.stop(e);
				}catch(e){
					throw new Error("document.DOMLoaded: "+e.message);
					return;
				}
			};		
			document.documentElement.onmousemove = function(e){
				try
				{
					if(document.all)e = event;
					currentDrag.move(e);
				}catch(e){
					throw new Error("document.DOMLoaded: "+e.message);
					return;
				}
			};
			document.documentElement.ondragstart = function(e){
				try
				{
					if(document.all)e = event;
					currentDrag.move(e);
					//window.alert("ondragstart");
				}catch(e){
					throw new Error("document.DOMLoaded: "+e.message);
					return;
				}
			}; 
	}catch(e)
	{
		window.alert("document.DOMLoaded: "+e.message);
	}
}
