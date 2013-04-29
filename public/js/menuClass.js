var currentFontColor = "";
var checkedMainOption = "";
var uncheckedMainOption = "";
function Menu(sMenuIndex,sMenuCaption) 
{
	this.superMenuIndex = null;
	this.menuIndex = sMenuIndex;
	this.menuCaption = sMenuCaption; 
	this.menuItems = new Object();
	this.numChilds = 0;
	this.onSelect = function(){}; // Trigger: when one menu option is selected. Polimorphyc function which behavior is defined in the instance.
	this.enabled = false;
	this.doAction = function(){};//Trigger: when one option has benn clicked.Polimorphyc function which behavior is defined in the instance.
	Menu.prototype.add = function(menuIndex, menuCaption) 
	{
		try
		{
			this.numChilds++;
			this.menuItems[menuIndex] = new Menu(menuIndex, menuCaption);
			this.menuItems[menuIndex].superMenuIndex = this;
		}catch(e){
			throw new Error("wbCMSMenu.js::Menu(). Error: "+e.message);
		}
	};
}
Menu.prototype.enable = function()
{
	try
	{
		this.enabled = true;
		var currentElement = document.getElementById(this.menuIndex);
		if (currentElement)
		{
			currentElement.style.color = "";
		}
		for (var x in this.menuItems)
		{
			this.menuItems[x].enable();
			
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.enable(). Error: "+e.message);
	}
};
Menu.prototype.disable = function(){
	try
	{
		this.enabled = false;
		var currentElement = document.getElementById(this.menuIndex);
		if (currentElement)
		{
			currentElement.style.color = "#CCCCCC";
		}
		for (var x in this.menuItems)
		{
			this.menuItems[x].disable();
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.disable(). Error: "+e.message);
		
	}
};
Menu.prototype.removeChilds = function()
{
	try
	{
		for (var x in this.menuItems)
		{
			delete(this.menuItems[x]);
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.removeChilds(). Error: "+e.message);
	}
};
Menu.prototype.removeMenuHTMLContainers = function()
{
	try
	{
		if (this.numChilds>0)
		{
			this.removeMenuHTMLChilds();
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.removeMenuHTMLContainers(). Error: "+e.message);
	}
};
Menu.prototype.removeMenuHTMLChilds = function()
{
	try
	{
		for (var x in this.menuItems)
		{
			var currentElement = document.getElementById("_"+this.menuItems[x].menuIndex);
			if (currentElement)
			{
				var removedChild = currentElement.parentNode.removeChild(currentElement);
			}
			this.menuItems[x].removeMenuHTMLChilds();
		}
		var currentElement = document.getElementById("_"+this.menuIndex);
		if (currentElement)
		{
			var removedChild = currentElement.parentNode.removeChild(currentElement);
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.removeMenuHTMLChilds(). Error: "+e.message);
	}
};
Menu.prototype.removeRestMenuHTMLContainers=function()//try catch throw new
{
	try
	{
		var oMenuSupContainer = this.superMenuIndex;
		var currentMenuIndex = this.menuIndex;
		for (var x in oMenuSupContainer.menuItems)
		{
			if (oMenuSupContainer.menuItems[x].menuIndex != currentMenuIndex)
			{
				oMenuSupContainer.menuItems[x].removeMenuHTMLContainers();
			}
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.removeRestMenuHTMLContainers(). Error: "+e.message);
	}
};
Menu.prototype.displayMain = function( )//return true or false and alert
{
	try
	{
		var body = document.getElementsByTagName("body")[0];
		var oHTMLDivMainMenu = createHTMLElement("div","","menuBar",this.menuIndex,null,"position:relative;top:0px;left:0px;display:block;padding:0",null);//;width:"+window.getBodyWidth()+"px" width:"+window.getBodyWidth()+"px"
		var oHTMLSpanSeparatorOption = createHTMLElement("div",null,null,null,null,"clear:both",null);
		var BodyFirstChild = body.firstChild;
		
		if (BodyFirstChild)
		{
			var appendedSpan = body.insertBefore(oHTMLSpanSeparatorOption,BodyFirstChild);
		}else
		{
			var appendedSpan = body.appendChild(oHTMLSpanSeparatorOption);
		}
		var mainDiv = body.insertBefore(oHTMLDivMainMenu,appendedSpan);
		//var mainDiv = body.appendChild(oHTMLDivMainMenu);
		var indexSubmenu = null;
		var currentTop = 0;
		var currentLeft = 0;
		for (indexSubmenu in this.menuItems)
		{
			var oHTMLDivMenuOption = createHTMLElement("div",this.menuItems[indexSubmenu].menuCaption,"floatLeft",this.menuItems[indexSubmenu].menuIndex,null,"position:absolute;top:"+currentTop+"px;left:"+currentLeft+"px;text-align:center;height:29px;padding:5px 20px 0 20px;cursor:pointer;cursor:hand",null);
			//var oHTMLDivMenuOption = createHTMLElement("div",this.menuItems[indexSubmenu].menuCaption,"floatLeft",this.menuItems[indexSubmenu].menuIndex,null,"position:absolute;text-align:center;height:29px;padding:5px 20px 0 20px;cursor:pointer;cursor:hand",null);
			oHTMLDivMenuOption.setAttribute("NodeId",this.menuItems[indexSubmenu].menuIndex);
			oHTMLDivMenuOption.menuOption = new Object();
			oHTMLDivMenuOption.menuOption = this.menuItems[indexSubmenu];
			oHTMLDivMenuOption.onmouseover = function(){
				uncheckedMainOption = this.id;
				this.style.background = "#3D49A2";
				currentFontColor = this.style.color;
				this.style.color = "white";
				//changeBackground();
				//openMenu();
				var nodeId = this.getAttribute("NodeId");
				var selfNode = document.getElementById(nodeId);
				if (uncheckedMainOption!=checkedMainOption)
				{
					var previousMenu = document.getElementById(checkedMainOption);
					if (previousMenu)
					{
						previousMenu.style.background = "";
						previousMenu.style.color = "";
					}
				}
				checkedMainOption = selfNode.id;		
				var height = selfNode.offsetHeight;
				var selfTop = getHTMLElementTop(selfNode);
				var top = height+selfTop; 
				var left = getHTMLElementLeft(selfNode);
				selfNode.menuOption.displayMainMenuOption(selfNode,top,left);
				this.menuOption.onSelect();
			};
			oHTMLDivMenuOption.onmouseout = checkDelBackground;
			//
			var oSelf = this;
			oHTMLDivMenuOption.onclick = function()
			{
				fireEvent(this,"mouseover");
			};
			//oHTMLDivMenuOption.onclick = openMenu;
			var appendedChild = mainDiv.appendChild(oHTMLDivMenuOption);
			//oHTMLDivMenuOption.style.width = null;
			oHTMLDivMenuOption = null;
			currentLeft = getHTMLElementLeft(appendedChild)+getHTMLElementWidth(appendedChild);
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.displayMain(). Error: "+e.message);
	}
};
Menu.prototype.displayMainMenuOption = function(self,top,left)//try catch return throw new
{
	try
	{
		//window.alert(self.offsetWidth);
		
		var body = document.getElementsByTagName("body")[0];
		this.removeRestMenuHTMLContainers();
		if (document.getElementById("_"+this.menuIndex))
		{
			this.removeMenuHTMLContainers();
		}else{
			var oHTMLOptionContainer = createHTMLElement("div","",null,"_"+this.menuIndex,null,"position:absolute;top:"+top+"px;left:"+left+"px;background:#F9F9F9;padding:0 0px 0 0px;border:3px solid #707070;overflow:visible",null);//width:"+self.offsetWidth+"px
			oHTMLOptionContainer.style.zIndex = 20000;
						
			var appendedChild = body.appendChild(oHTMLOptionContainer);
			
			for (var oIndex in this.menuItems)
			{
				//window.alert(getHTMLElementHeight(oHTMLOptionContainer));
				var currentTop = top;
				//"clear:both;position:absolute;top:"currentTop+"px;left:"+left+";padding:5px 0 0 0;cursor:pointer;cursor:hand;overflow:visible"
				var oHTMLDivOption = createHTMLElement("div","","menuOption",this.menuItems[oIndex].menuIndex,null,"clear:both;display:block;padding:0 0 0 0;cursor:pointer;cursor:hand;overflow:visible;left:-1px",null);
				//var oHTMLDivOption = createHTMLElement("div"," ","menuOption",this.menuItems[oIndex].menuIndex,null,"clear:both;display:block;height:29px;padding:5px 0 0 0;cursor:pointer;cursor:hand;overflow:visible",null);
				var addedOption = appendedChild.appendChild(oHTMLDivOption);
				
				//
				addedOption.menuOption = new Object();
				addedOption.menuOption = this.menuItems[oIndex];
				addedOption.onmouseover = function()
				{
					uncheckedMainOption = this.id;
					this.style.background = "#3D49A2";
					currentFontColor = this.style.color;
					this.style.color = "white";
				};
				addedOption.onmouseout = function()
				{
					uncheckedMainOption = this.id;
					this.style.background = "";	
					this.style.color = currentFontColor;
				};
				//
				var oHTMLSpanDesc = createHTMLElement("div",this.menuItems[oIndex].menuCaption,null,null,null,"padding:7px",null);//"selOptionLeft"
				var addedSpan = addedOption.appendChild(oHTMLSpanDesc);
				if (this.menuItems[oIndex].numChilds>0)
				{
					//var oHTMLSpanPointer = createHTMLElement("span",">",null,null,null,"position:absolute;right:0px",null);//"selOptionRight"
					var oHTMLSpanPointer = createHTMLElement("span",">",null,null,null,"position:absolute;right:0px",null);//"selOptionRight"
					var addedPointer = addedSpan.appendChild(oHTMLSpanPointer);
					//
					addedOption.setAttribute("relContainer","_"+this.menuIndex);
					//
					addedOption.onclick = function()
					{
						try
						{
							var orelContainer = this.getAttribute("relContainer");
							var oHTMLDivMenuContainer = document.getElementById(orelContainer); 
							var top = oHTMLDivMenuContainer.offsetTop+this.offsetTop;
							//
							var left = oHTMLDivMenuContainer.offsetLeft+oHTMLDivMenuContainer.offsetWidth;
							this.menuOption.displayMainMenuOption(this,top,left);
							this.menuOption.onSelect();
						}catch(e){
							window.alert(e.message);
						}
					};
					//addedOption.onclick = function(){};
				}else
				{
					/*addedOption.onmouseover = function()
					{
						uncheckedMainOption = this.id;
						this.style.background = "#3D49A2";
						currentFontColor = this.style.color;
						this.style.color = "white";
					};*/
					addedOption.onclick = function(){
						try
						{
							var currAddOption = this;
							if (currAddOption.menuOption.enabled)
							{
								currAddOption.menuOption.doAction();
							}
							currAddOption.menuOption.onSelect();
						}catch(e)
						{
							window.alert("wbCMSMenu.js::doMenuAction() fails. Error: "+e.message);
						}
					};
				}
				if(this.menuItems[oIndex].enabled)
				{
					addedOption.style.color = "";
				}else{
					addedOption.style.color = "#CCCCCC";
				}
				
				/*var maxWidth = 289;
				var minWidth = 160;
				if (addedOption.offsetWidth>maxWidth)
				{
					currentWidth = maxWidth;
					addedOption.style.width =currentWidth+"px";
					addedOption.style.height = addedOption.offsetHeight+"px";
				}*/
				//
			/*	var addedOption = body.appendChild(addedOption);
				var currentWidth = addedOption.offsetWidth;
				addedOption.style.width = currentWidth+"px";
				//
				var removedOption = body.removeChild(addedOption);
				var newOption = appendedChild.appendChild(removedOption);
				
				window.alert(newOption.offsetWidth);*/
				//
			}
			var containerWidth = appendedChild.offsetWidth;
			var containerHeight = appendedChild.offsetHeight;
			if (containerWidth<160) containerWidth = 160;
			appendedChild.style.width = containerWidth+"px";
			appendedChild.style.height = containerHeight+"px";
		}
	}catch(e)
	{
		throw new Error("wbCMSMenu.js::Menu.displayMainMenuOption(). Error: "+e.message);
	}
};
Menu.prototype.getMenuItem = function(MenuItemId){};
/*function showMain(oHTMLDivMainMenu)
{
	var mainMenuId = oHTMLDivMainMenu.id;
	var currentMainMenu = mainMenu.menuItems[mainMenuId];
	currentMainMenu.displayMain();
}*/
/*function showMenuOption(HTMLElementId)
{
	var currentElement = document.getElementById(HTMLElementId);
	currentElement.menuOption.displayMainMenuOption();
}*/
function openMenu()//return nothing, on Error Alert
{
	try
	{
		var nodeId = this.getAttribute("NodeId");
		var selfNode = document.getElementById(nodeId);
		if (uncheckedMainOption!=checkedMainOption)
		{
			var previousMenu = document.getElementById(checkedMainOption);
			if (previousMenu){
				previousMenu.style.background = "";
				previousMenu.style.color = "";
			}
		}
		checkedMainOption = selfNode.id;		
		var height = selfNode.offsetHeight;
		var selfTop = getHTMLElementTop(selfNode);
		var top = height+selfTop; 
		var left = getHTMLElementLeft(selfNode);
		selfNode.menuOption.displayMainMenuOption(selfNode,top,left);
		this.menuOption.onSelect();
	}catch(e){
		window.alert("wbCMSMenu.js::openMenu() fails. Error: "+e.message);
	}
}
function showSubmenu()//return nothing, on Error Alert
{
	try
	{
		var orelContainer = this.getAttribute("relContainer");
		var oHTMLDivMenuContainer = document.getElementById(orelContainer); 
		var top = oHTMLDivMenuContainer.offsetTop+this.offsetTop;
		
		var left = oHTMLDivMenuContainer.offsetLeft+oHTMLDivMenuContainer.offsetWidth;
		this.menuOption.displayMainMenuOption(this,top,left);
		this.menuOption.onSelect();
	}catch(e)
	{
		window.alert("wbCMSMenu.js::showSubmenu() fails. Error: "+e.message);
	}
}
function doMenuAction()//return nothing, on Error alert
{
	try
	{
		if (this.menuOption.enabled)
		{
			this.menuOption.doAction();
		}
		this.menuOption.onSelect();
	}catch(e)
	{
		window.alert("wbCMSMenu.js::doMenuAction() fails. Error: "+e.message);
	}
}
function changeBackground()//return nothing, on Error Alert
{
	try
	{
		uncheckedMainOption = this.id;
		this.style.background = "#3D49A2";
		currentFontColor = this.style.color;
		this.style.color = "white";
	}catch(e)
	{
		window.alert("wbCMSMenu.js::changeBackground() fails. Error: "+e.message);
	}
}
function delBackground()//return nothing, on Error Alert
{
	try
	{
		uncheckedMainOption = this.id;
		this.style.background = "";	
		this.style.color = currentFontColor;
	}catch(e)
	{
		window.alert("wbCMSMenu.js::delBackground() fails. Error: "+e.message);
	}
}
function checkDelBackground()//return nothing, on Error Alert
{
	try
	{
		var unCheck = false;
		var currentHTMLContainer = document.getElementById("_"+this.menuOption.menuIndex);
		if (currentHTMLContainer)
		{
			var sClass = currentHTMLContainer.getAttribute("class");
			if (sClass!=null)
			{
				if (sClass=="menuOption")
				{
					unCheck = true;
				}
			}
		}else{
			unCheck = true;
		}
		
		if (unCheck)
		{
			uncheckedMainOption = this.id;
			this.style.background = "";	
			this.style.color = "";
		}
	}catch(e)
	{
		window.alert("wbCMSMenu.js::checkDelBackground() fails. Error: "+e.message);
	}
}