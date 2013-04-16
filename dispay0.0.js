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
function genericContainer()
{
	this.constructor = function()
	{
		try
		{
			this.HTMLElementType = "div";
			this.set(this.HTMLElementType);
		}catch(e){
			throw new Error("Error:Class genericContainer::constructor()"+e.message);
		}
	};
	this.setPosAndSize = function(top,left,width,height)
	{
		try
		{
			this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px";
			if (this.oElement==null)
			{
				this.set(this.HTMLElementType);
			}else{
				this.oElement.style.top = top+"px";
				this.oElement.style.left = left+"px";
				this.oElement.style.width = width+"px";
				this.oElement.style.height = height+"px";
			}
		}catch(e){
			throw new Error("Error:Class genericContainer::setPosAndSize()"+e.message);
		}
	}; 
}
genericContainer.prototype = new oHTMLElement();

function verticalSeparator(HTMLElementLeft, HTMLElementRight,top,left,width,height)
{
	this.NodeValue ="v";
	this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;background:red";
	this.constructor();
	this.refElementLeft= HTMLElementLeft;
	this.refElementRight= HTMLElementRight;
	var oSelfLeft = this.refElementLeft;
	var oSelfRight = this.refElementRight;
	this.oElement.onmousedown = function()
	{
	//	oSelfLeft
	//	oSelfRight
	};
	this.oElement.onmouseup = function()
	{
	//	oSelfLeft
	//	oSelfRight
	};
	this.oElement.style.cursor="crosshair";
}
verticalSeparator.prototype = new genericContainer();

function horizontalSeparator(HTMLElementTop, HTMLElementBottom,top,left,width,height)
{
	this.NodeValue ="h";
	this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;background:red";
	this.constructor();
	this.refElementTop= HTMLElementTop;
	this.refElementBottom= HTMLElementBottom;
	var oSelfTop = this.refElementTop;
	var oSelfBottom = this.refElementBottom;
	
	this.oElement.onmousedown = function()
	{
	//	oSelfLeft
	//	oSelfRight
	};
	this.oElement.onmouseup = function()
	{
	//	oSelfLeft
	//	oSelfRight
	};
}
horizontalSeparator.prototype = new genericContainer();

function genericTreeContainer(top,left,width,height)
{
	try
	{
		this.NodeValue ="Tree";
		this.ElementId = "Tree";
		this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:3px solid #707070";
		this.constructor();
	}catch(e){
		throw new Error("Error:Class genericTreeContainer::constructor()"+e.message);
	}
}
genericTreeContainer.prototype = new genericContainer();

function genericPreviewContainer(top,left,width,height)
{
	try
	{
		this.NodeValue ="preview";
		this.ElementId = "Preview";
		this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:3px solid #707070";
		this.constructor();
	}catch(e){
		throw new Error("Error:Class genericPreviewContainer::constructor()"+e.message);
	}
}
genericPreviewContainer.prototype = new genericContainer();

function genericEditorContainer(top,left,width,height)
{
	try
	{
		this.NodeValue ="editor";
		this.ElementId = "Editor";
		this.Style = "position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;border:3px solid #707070";
		this.constructor();
	}catch(e){
		throw new Error("Error:Class genericEditorContainer::constructor()"+e.message);
	}
}
genericEditorContainer.prototype = new genericContainer();

function displayTree()
{
	try
	{
		var leftWidth = (bodyWidth/3)-(defaultBorder*2)-SeparatorWidth;
		var rightWidth = bodyWidth-leftWidth-(defaultBorder*2);
		var leftHeight = bodyHeight-defaultBorder*2;
		var PreviewHeight = (bodyHeight/2)-(defaultBorder*2)-SeparatorWidth;
		var EditorHeight = PreviewHeight;
		
		TreeContainer.setPosAndSize(0, 0, leftWidth, leftHeight);
	
		PreviewContainer.setPosAndSize(0, leftWidth+SeparatorWidth, rightWidth, PreviewHeight);
		EditorContainer.setPosAndSize(PreviewHeight+SeparatorWidth, leftWidth+SeparatorWidth, rightWidth, EditorHeight);
		var rightElement = createHTMLElement("div");
		oVerticalSeparator = new verticalSeparator(TreeContainer.oElement, rightElement,0,leftWidth+defaultBorder+SeparatorWidth, SeparatorWidth, bodyHeight);
		
		
		oVerticalSeparator = new verticalSeparator(TreeContainer.oElement, rightElement,0,leftWidth, SeparatorWidth, bodyHeight);
		oHorizontalSeparator = new horizontalSeparator(PreviewContainer.oElement, EditorContainer.oElement,PreviewHeight, leftWidth, rightWidth,SeparatorWidth);
		
		PreviewContainer.oElement = rightElement.appendChild(PreviewContainer.oElement);
		oHorizontalSeparator.oElement = rightElement.appendChild(oHorizontalSeparator.oElement);
		EditorContainer.oElement = rightElement.appendChild(EditorContainer.oElement);
		
		TreeContainer.oElement = document.body.appendChild(TreeContainer.oElement);
		oVerticalSeparator.oElement = document.body.appendChild(oVerticalSeparator.oElement);
		
		document.body.appendChild(rightElement);
	}catch(e){
		throw new Error("displayTree"+e.message);
	}
}
function displayPreviewTop()
{

}
function displayPreviewBottom()
{

}
function initBodySize()
{
	try
	{
		var restHeight = screen.height-screen.availHeight;
		var restWidth = screen.width-screen.availWidth;
		bodyHeight = getBodyHeight();
		bodyWidth  = getBodyWidth();
		/*bodyHeight -=restHeight;
		bodyWidth -=restWidth;*/
		//the windows will always have 2 pixel borders
		/*bodyWidth -=2;
		bodyHeight -=2;*/
		//
		//bodyWidth -=20;//the clients view ist too big.
		//alert(bodyWidth+" x "+bodyHeight);  
	}catch(e)
	{
		alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
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
document.DOMLoaded=function()
{
	try
	{
//		alert("loaded");
		displayTree();
	}catch(e)
	{
		alert("document.DOMLoaded: "+e.message);
	}
};
try
{
var TreeContainer = new genericTreeContainer(0,0,0,0);
var PreviewContainer = new genericPreviewContainer(0,0,0,0);
var EditorContainer = new genericEditorContainer(0,0,0,0);
var oVerticalSeparator = null;
var oHorizontalSeparator = null;
var defaultBorder = 3;
var SeparatorWidth = 3;
var bodyWidth = 0, bodyHeight = 0;
initBodySize();
}catch(e){
	alert("layoutActions.js::view1() fails. Error: "+e.message);
}