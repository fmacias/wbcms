//WCMS functions
//This object contains followin information
//The DIV Id(s) to be treated and the Id of the sections to relate with them.

/*function oDivsToLoad(sJSONStr)
 {
 this.Obj = new Object();
 this.JSONString = sJSONStr;
 this.SetHTMLNodeInThisSection = function (aSectionIds_in,CurrentSection,currentDiv)//append each Node found in each related section in the corresponding HTMLDIVElement 
 {
 try
 {
 for (var a=0;a<aSectionIds_in.length;a++)
 {
 var CurrentSectionID = CurrentSection.getAttribute("id");
 if (aSectionIds_in[a].id == CurrentSectionID)
 {
 var CurrentHTMLNodes = CurrentSection.getElementsByTagName("HTML");
 for (var b=0;b<CurrentHTMLNodes.length;b++)
 {
 for (var z=0;z<CurrentHTMLNodes[b].childNodes.length;z++)
 {
 var CurrentNode = CurrentHTMLNodes[b].childNodes[z];
 var NewElement = CreateDOMElements(CurrentNode);
 if (NewElement)
 {
 currentDiv.appendChild(NewElement);
 }
 }
 }
 }
 }
 var LasSectionIdIndex = a-1;
 if (aSectionIds_in[LasSectionIdIndex].SectionsIds)
 {
 if (aSectionIds_in[LasSectionIdIndex].SectionsIds.length>0)
 {
 //Si hay seciones pertenecientes a otras secciones, el contenido de estas secciones se agregar�n en 
 //en el ultimo elemento de la seccion a la que pertenecen.
 this.SetHTMLNodeInThisSection(aSectionIds_in[LasSectionIdIndex].SectionsIds,CurrentSection,currentDiv.lastChild);
 }
 }
 }catch(e)
 {
 throw new Error("\oDivsToLoad->SetHTMLNodeInThisSection(): Name"+e.name+", Message:"+e.message+", Description:"+e.description);
 }
 };
 this.AppendNewChilds=function()
 {
 try
 {
 var Sections = CurrentXMLRawData.documentElement.getElementsByTagName("section");
 for (var x in this.Obj)
 {
 var CurrentDOMDIV = document.getElementById(x);
 removeChilds(CurrentDOMDIV);
 }
 for (var y=0;y<Sections.length;y++)
 {
 var thisSection = Sections[y];
 for (var n in this.Obj)
 {
 var currentDiv = document.getElementById(n);
 if (currentDiv!=undefined)
 {
 if (this.Obj[n].SectionsIds)
 {
 this.SetHTMLNodeInThisSection(this.Obj[n].SectionsIds,thisSection,currentDiv);
 }
 }else{
 throw new Error("El div.id<<"+n+">> no existe!");
 }
 }
 }
 }catch(e)
 {
 throw new Error("\oDivsToLoad->AppendNewChilds(): Name"+e.name+", Message:"+e.message+", Description:"+e.description);
 }
 };
 this.SetoDIVsToLoad=function()
 {
 try
 {
 //var JSONString = this.Text;
 var oJSON = eval("(" + this.JSONString + ")");
 this.Obj = oJSON;
 //this.JSONString = JSONString;
 }catch(e)
 {
 throw new Error("SetaDIVsToLoad error Error name: "+e.name+", message:"+e.message+", Description:"+e.description);
 }
 };
 this.commonActionBehavior=function()
 {
 try
 {
 this.SetoDIVsToLoad();
 this.AppendNewChilds();
 }catch(e)
 {
 throw new Error("\ncommonActionBehavior(): Error name: "+e.name+", message:"+e.message+", Description:"+e.description);
 }
 };
 this.setJSONObj=function()
 {
 try
 {
 //var JSONString = this.Text;
 var oJSON = eval("(" + this.JSONString + ")");
 this.Obj = oJSON;
 //this.JSONString = JSONString;
 }catch(e)
 {
 throw new Error("\ncsetJSONObj(): Error name: "+e.name+", message:"+e.message+", Description:"+e.description);
 }
 };
 this.setJSONObj=function()
 {
 try
 {
 //var JSONString = this.Text;
 var oJSON = eval("(" + this.JSONString + ")");
 this.Obj = oJSON;
 //this.JSONString = JSONString;
 }catch(e)
 {
 throw new Error("\ncsetJSONObj(): Error name: "+e.name+", message:"+e.message+", Description:"+e.description);
 }
 };
 }*/
var Z_INDEX = 1;
String.prototype.rltrimFeedChar = function() {
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.ltrim = function() {
    return this.replace(/^\s+/, "");

};
String.prototype.rtrim = function() {
    return  this.replace(/\s+$/, "");
};
String.prototype.delNEL = function() {
    return this.replace(/\\n/, "");
};
String.prototype.delTAB = function() {
    return this.replace(/\\t/, "");
};
Error.prototype.showAlert = function() {
    window.alert(this.message);
};
//position:absolute;top:"+top+"px;left:"+left+"px;width:"+width+"px;height:"+height+"px;z-index:999;background:white;padding-left:20px
function getDisableLayer(top, left, width, height, zIndex)
{
    try
    {
        Z_INDEX++;
        var appendedLayer = null;
        var positionStyle = "top:" + top + "px;left:" + left + "px;width:" + (width - 4) + "px;height:" + height + "px"; //height:"+height+"px
        var defaultStyle = "position:absolute;background:white;" + positionStyle;//padding-left:20px;"
        var disableLayer = createHTMLElement("div", null, null, null, "<a id='errorTitle'>....saving modifications</a><span style='float:right'>close</span><div class='disable_error_message'>Message:</div>", defaultStyle, null);
        var selfBody = document.getElementsByTagName("body");
        if (selfBody.length > 0)
        {
            appendedLayer = selfBody[0].appendChild(disableLayer);
            appendedLayer.firstChild.onclick = function()
            {
                try
                {
                    var errorNode = this.parentNode.childNodes[2];
                    if (this.innerHTML == "View Error")
                    {
                        Z_INDEX++;
                        this.innerHTML = "Hide Error";
                    } else
                    {
                        Z_INDEX--;
                        this.innerHTML = "View Error";
                    }
                    this.parentNode.style.zIndex = Z_INDEX;
                    errorNode.fx.expand();
                    //Z_INDEX--;
                    //window.alert("done");
                    //disableLayer.fx.expand();
                } catch (e) {
                    window.alert("wcms.js::getDisableLayer::appendedLayer.onmousseover fails:" + e.message);
                }
            };
            var close = appendedLayer.childNodes[1];
            close.onclick = function()
            {
                try
                {
                    var removedLayer = appendedLayer.parentNode.removeChild(appendedLayer);
                } catch (e) {
                    window.alert("wcms.js::getDisableLayer::close.onclick fails:" + e.message);
                }
            };
        }
        if (appendedLayer == null) {
            throw new Error("Disable Layer was not created!");
        }
        return appendedLayer;
    } catch (e) {
        window.alert("wcms.js::getDisableLayer fails:" + e.message);
    }
}
function showErrorDisableLayer(disableLayer, errorString)
{
    try
    {
        if (!(disableLayer.childNodes[2]))
        {
            window.alert("There is no Error seccion defined in the layer");
            return;
        }
        if (!(disableLayer.childNodes[2].className = "disable_error_message"))
        {
            window.alert("There is not Error seccion defined in the layer");
            return;
        }
        var errorNode = disableLayer.childNodes[2];
        //
        //errorNode.style.overflow = "hidden";
        //errorNode.style.height = "0px";

        //disableLayer.fx = new Fx(disableLayer);
        //disableLayer.style.overflow = "hidden";
        //disableLayer.style.border ="1px solid red";
        errorNode.setAttribute("style", "background:white;border:1px solid white;text-align:left:padding:1%");
        errorNode.style.background = "white";
        errorNode.style.border = "1px solid red";
        errorNode.style.textAlign = "center";
        //
        disableLayer.style.background = "red";
        disableLayer.firstChild.innerHTML = "View Error";
        var curTextArea = createHTMLElement("textarea", errorString, null, null, null, "width:98%", "rows=10", null);
        //var TextNode = document.createTextNode(errorString);
        //errorNode.appendChild(TextNode);
        errorNode.appendChild(curTextArea);
        errorNode.fx = new Fx(errorNode);
        errorNode.fx.expand();
    } catch (e) {
        window.alert("wcms.js::showErrorDisableLayer fails:" + e.message);
    }
}
function showSuccessDisableLayer(disableLayer)
{
    try
    {
        if (!(disableLayer.childNodes[2]))
        {
            window.alert("There is no Error seccion defined in the layer");
            return;
        }
        if (!(disableLayer.childNodes[2].className = "disable_error_message"))
        {
            window.alert("There is not Error seccion defined in the layer");
            return;
        }
        var errorNode = disableLayer.childNodes[2];
        errorNode.setAttribute("style", "background:white;border:1px solid green");
        disableLayer.style.background = "green";
        disableLayer.fx = new Fx(disableLayer);
        disableLayer.fx.fadeOut();
        var removedLayer = disableLayer.parentNode.removeChild(disableLayer);
    } catch (e) {
        window.alert("wcms.js::showSuccessDisableLayer fails:" + e.message);
    }
}