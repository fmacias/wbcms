//include Layoutclasses.js bevore this scrit
//Objects definition required for the layout representation and used in treeli.js and template.js

function drawEditProjektSection()
{
	try
	{
		/*currentTree.draw();
		oTreeContainer = currentTree.ContBody.oElement;
	
		currentEditor.draw();
		oTextAreaContainer = currentEditor.ElementInnerHTML.textAreaInnerHTML;
		
		currentPreview.draw();*/
		//oMainContainer.oElement.display = "yes";
	}catch(e)
	{
		window.alert("layoutActions.js::drawEditProjektSection(). Error: "+e.message);
	}
}
function drawEditSection()
{
	try
	{
		/*currentTree.draw();
		oTreeContainer = currentTree.ContBody.oElement;
		
		currentEditor.draw();
		oTextAreaContainer = currentEditor.ElementInnerHTML.textAreaInnerHTML;
		
		currentPreview.draw();*/
		oMainContainer.setTreeView();
		//oMainContainer.setEditorView();
	}catch(e)
	{
		window.alert("layoutActions.js::drawEditSection(). Error: "+e.message);
	}
	
}
function drawSourceCode()
{
	try
	{
		oMainContainer.setSourceCodeView();
		/*clearEditSection();
		viewSourCode.draw(divPositionReference);
		var nEditorHeight = (82*window.screen.height)/100;
		var HeadHeight = viewSourCode.Header.oElement.offsetHeight;
		viewSourCode.Container.oElement.style.height = nEditorHeight.toString()+"px";
		viewSourCode.ContBody.oElement.style.height = (nEditorHeight-HeadHeight).toString()+"px"; 
		viewSourCode.TextArea.oElement.style.height = (viewSourCode.ContBody.oElement.offsetHeight-10).toString()+"px";
		viewSourCode.TextArea.oElement.style.width = (viewSourCode.ContBody.oElement.offsetWidth-10).toString()+"px";*/
	}catch(e)
	{
		window.alert("layoutActions.js::drawSourceCode(). Error: "+e.message);
	}
}
function drawLoadProjekt()
{
	try
	{
		window.alert("drawLoadProjekt is empty");
		/*var nMargin = 10;
		var Height = window.screen.height;
		//
		var nEditorHeight = (53.703703*window.screen.height)/100;
		clearEditSection();
		viewLoadProject.draw(divPositionReference);
		var HeadHeight = viewLoadProject.Header.oElement.offsetHeight;
		
		viewLoadProject.Container.oElement.style.position = "absolute";
		viewLoadProject.Container.oElement.style.top = "0";
		viewLoadProject.Container.oElement.style.left = nMargin.toString()+"px";
		
		var curTop = (window.screen.height-viewLoadProject.Container.oElement.offsetHeight)/2;
		var curLeft = (window.screen.width-viewLoadProject.Container.oElement.offsetWidth)/2;*/
	}catch(e)
	{
		window.alert("layoutActions.js::drawLoadProjekt(). Error: "+e.message);
	}
}
function clearEditSection()
{
	try
	{
		window.alert("clearEditSection is empty");
		//removeChilds(divPositionReference);
	}catch(e)
	{
		window.alert("layoutActions.js::clearEditSection() fails. Error: "+e.message);
	}
}
function view1() //default view
{
	try
	{
		window.alert("view1 is empty");
		/*initBodySize();
		var mainMenu = document.getElementById("mainMenu");
		var topLeft = mainMenu.offsetHeight;
		var halfTop = (bodyHeight/2)+windowMinSize[1];
		var widowHeight = bodyHeight;
		var windowWidth = bodyWidth;
		var previewHalfHeight =  bodyHeight/2;
		var LeftLeft = 0;
		var halfLeft = bodyWidth/2;
		var halfWidth = bodyWidth/2;
		var halfHeight = bodyHeight/2;
		currentTree.setWindowSize(halfTop, LeftLeft,halfWidth, halfHeight);
		currentEditor.setWindowSize(halfTop, halfLeft,halfWidth, halfHeight);
		currentEditor.ElementInnerHTML.textAreaInnerHTML.setSize();
		currentPreview.setWindowSize(topLeft, LeftLeft,windowWidth, previewHalfHeight);
		currentPreview.setIFrameSize();*/
	}catch(e)
	{
		throw new Error("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
function view2() //preview unther
{
	try
	{
		window.alert("view2 is empty");
		/*initBodySize();
		var mainMenu = document.getElementById("mainMenu");
		var topLeft = mainMenu.offsetHeight;
		var halfTop = (bodyHeight/2)+windowMinSize[1];
		var widowHeight = bodyHeight;
		var windowWidth = bodyWidth;
		var previewHalfHeight =  bodyHeight/2;
		var LeftLeft = 0;
		var halfLeft = bodyWidth/2;
		var halfWidth = bodyWidth/2;
		var halfHeight = bodyHeight/2;
		currentTree.setWindowSize(topLeft, LeftLeft,halfWidth, halfHeight);
		currentEditor.setWindowSize(topLeft, halfLeft,halfWidth, halfHeight);
		currentEditor.ElementInnerHTML.textAreaInnerHTML.setSize();
		currentPreview.setWindowSize(halfTop, LeftLeft,windowWidth, widowHeight);
		currentPreview.setIFrameSize();*/
	}catch(e)
	{
		throw new Error("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
function view3() //default cascade
{
	try
	{
		window.alert("view3 is empty");
		/*initBodySize();
		var mainMenu = document.getElementById("mainMenu");
		var topLeft = mainMenu.offsetHeight;
		var halfTop = (bodyHeight/2)+windowMinSize[1];
		var widowHeight = bodyHeight;
		var windowWidth = bodyWidth;
		var previewHalfHeight =  bodyHeight/2;
		var LeftLeft = 0;
		var halfLeft = bodyWidth/2;
		var halfWidth = bodyWidth/2;
		var halfHeight = bodyHeight/2;
		 
		currentTree.setWindowSize(topLeft, LeftLeft,halfWidth, halfHeight);
		currentEditor.setWindowSize(topLeft+40, LeftLeft+40,halfWidth, halfHeight);
		currentEditor.ElementInnerHTML.textAreaInnerHTML.setSize();
		currentPreview.setWindowSize(topLeft+80, LeftLeft+80,halfWidth, halfHeight);
		currentPreview.setIFrameSize();*/
	}catch(e)
	{
		throw new Error("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
function view4() //tree left, preview an Editor cascade
{
	try
	{
		window.alert("view4 is empty");
		/*initBodySize();
		var mainMenu = document.getElementById("mainMenu");
		var topLeft = mainMenu.offsetHeight;
		var halfTop = (bodyHeight/2)+windowMinSize[1];
		var widowHeight = bodyHeight;
		var windowWidth = bodyWidth;
		var previewHalfHeight =  bodyHeight/2;
		var LeftLeft = 0;
		var halfLeft = bodyWidth/2;
		var halfWidth = bodyWidth/2;
		var halfHeight = bodyHeight/2;
		 
		currentTree.setWindowSize(topLeft, LeftLeft,halfWidth-20, widowHeight);
		currentEditor.setWindowSize(topLeft, halfWidth-20,halfWidth-20, halfHeight-20);
		currentEditor.ElementInnerHTML.textAreaInnerHTML.setSize();
		currentPreview.setWindowSize(topLeft+20, halfWidth+20,halfWidth, halfHeight);
		currentPreview.setIFrameSize();*/
	}catch(e)
	{
		throw new Error("layoutActions.js::view1() fails. Error: "+e.message);
	}
}
/*function initBodySize()
{
	try
	{
		var restHeight = screen.height-screen.availHeight;
		var restWidth = screen.width-screen.availWidth;
		bodyHeight = getBodyHeight();
		bodyWidth  = getBodyWidth();
		bodyHeight -=restHeight;//windowBorder = 1px
		bodyWidth -=restWidth;//windowBorder = 1px
		//the windows will always have 2 pixel borders
		bodyWidth -=2;
		bodyHeight -=2;
		//
		bodyWidth -=20;//the clients view ist too big.
		//window.alert(bodyWidth+" x "+bodyHeight);  
	}catch(e)
	{
		window.alert("layoutActions.js::view1() fails. Error: "+e.message);
	}
}*/