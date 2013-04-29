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

// XMLNode is currently selected
var CurrentNode;
var ArrayWithChilds = new Array();
var ArrayCurrentNodeRef = new Array();
var DIVElementNodeId = 0;
var textAreaHeight = 0;
var textAreaWidth = 0;
function CreateTreeByDOMElement(Node_in, NodeToAdd, childNodeIndex)
{
    try {
        if (Node_in.nodeType)
        {
            var args = CreateTreeByDOMElement.arguments;//Creates the structure of the node
            if (Node_in.nodeType == 1)//is one Element
            {
                var NewNode = createTreeNode(Node_in, childNodeIndex);
                NewNode.RelatedNodeName = Node_in.nodeName;
                NewNode.RelatedNodeAttributes = "";
                var lastChild = NewNode.lastChild;
                if (Node_in.getAttribute("HightLight"))
                {
                    Node_in.removeAttribute("HightLight");
                    CurrentTreeElement.addElement(NewNode);
                    //delete(Node_in.HightLight);
                }
                if (args[1] == undefined)
                {
                    NewNode.isRoot = true;
                } else {
                    NewNode.isRoot = false;
                }
                var CurrentAttributes = Node_in.attributes;
                if (CurrentAttributes.length > 0)
                {
                    var AttSeparator = "";
                    var newAttributecontainer = createHTMLElement("ul", null, null, null, null, null, null);
                    var newAttributesCaption = createHTMLElement("li", null, null, null, "<b>Attributes</b>", "color:#616161", null);
                    var newAttributesNode = createHTMLElement("ul", null, null, null, null, null, null);
                    for (var k = 0; k < Node_in.attributes.length; k++)
                    {
                        var CurrentAttr = Node_in.attributes[k];
                        var curAttribute = createHTMLElement("li", null, "attribureInfos", null, "<b>" + CurrentAttr.nodeName + "</b> = " + CurrentAttr.nodeValue, "color:#616161", null);
                        newAttributesNode.appendChild(curAttribute);
                        NewNode.RelatedNodeAttributes += AttSeparator + CurrentAttr.nodeName + "=" + CurrentAttr.nodeValue;
                        AttSeparator = "#;#";
                    }
                    newAttributesCaption.appendChild(newAttributesNode);
                    newAttributecontainer.appendChild(newAttributesCaption);
                    lastChild.appendChild(newAttributecontainer);
                }
                if ((args[1] == undefined) || (args[1] == ""))
                {
                    var newNodeToAdd = NewNode;
                } else
                {
                    var newNodeToAdd = AppendChild(NodeToAdd, NewNode);
                }
                var LastNodeIndex = newNodeToAdd.childNodes.length - 1;
                var newNodeToAdd___ = newNodeToAdd.childNodes[LastNodeIndex];
                //newNodeToAdd = newNodeToAdd.lastChild;
                //}
                if (NewNode.isRoot == false) {
                    newNodeToAdd___ = newNodeToAdd___.lastChild;
                }
                var nodeIndexList = "";
                NodeToAdd = newNodeToAdd;
                var currentIndex = 0;
                for (var x = 0; x < Node_in.childNodes.length; x++)
                {
                    var currentNodeValue = Node_in.childNodes[x].nodeValue;
                    var existCharFeed = false;
                    if (currentNodeValue)
                    {
                        if (currentNodeValue.match(/[\n\n\t\v]/)) //contains tab, form feed, line feed
                        {
                            existCharFeed = true;
                        }
                        currentNodeValue = currentNodeValue.rltrimFeedChar();//remove al this space, tab, form feed, line feed from the left and from the right size
                    }
                    if ((Node_in.childNodes[x].nodeType == 3) && (currentNodeValue == "") && (existCharFeed)) {
                        Node_in.childNodes[x].parentNode.removeChild(Node_in.childNodes[x]);//remove node with expecial line feed, tab feed,...
                        x--;
                    } else {
                        if (Node_in.childNodes[x].nodeType == 1)//Store the childIndex only for Elements
                        {
                            nodeIndexList = (childNodeIndex == undefined) ? x : childNodeIndex + "," + x;
                        }
                        //nodeIndexList = (childNodeIndex==undefined)?x:childNodeIndex+","+x;
                        NodeToAdd = CreateTreeByDOMElement(Node_in.childNodes[x], newNodeToAdd___, nodeIndexList);
                        NodeToAdd = newNodeToAdd;
                    }
                }
            } else if (Node_in.nodeType == 2)//Attribute
            {
                var attribute = document.createAttribute(Node_in.nodeName);
                attribute.value = Node_in.nodeValue;
                NodeToAdd = AppendChild(NodeToAdd, attribute);
            } else if (Node_in.nodeType == 3)//Text node
            {
                var currentNodeValue = Node_in.nodeValue;
                var existCharFeed = false;
                if (currentNodeValue.match(/[\n\n\t\v]/)) //contains tab, form feed, line feed
                {
                    existCharFeed = true;
                }
                currentNodeValue = currentNodeValue.rltrimFeedChar();//remove al this space, tab, line feed from the left and from the right size
                if ((existCharFeed) && (currentNodeValue == ""))
                {
                    //ignore, this node text contains only special charakters like tab fee, line feed or tab feed
                } else
                {
                    //var newTextContainer = createHTMLElement("ul",null,"wbcmsXMLNode",null,null,null);
                    /*var newTextCaption = createHTMLElement("li",null,null,null,"<b>Text</b>","color:#616161",null);
                     //
                     var newTextNode = createHTMLElement("ul",null,null,null,null,null,null);
                     var curText = createHTMLElement("li",currentNodeValue,null,null,null,"color:#616161",null);
                     newTextNode.appendChild(curText);
                     newTextCaption.appendChild(newTextNode);
                     newTextContainer.appendChild(newTextCaption);*/
                    //
                    var TextNode = document.createTextNode(currentNodeValue);
                    NodeToAdd.parentNode.firstChild.childNodes[2].appendChild(TextNode);//innerHTML = currentNodeValue;
                    //NodeToAdd = AppendChild(NodeToAdd,newTextContainer);
                }
            } else if (Node_in.nodeType == 8)//Comment Node
            {
                var newTextContainer = createHTMLElement("ul", null, null, null, null, null, null);
                var newTextCaption = createHTMLElement("li", null, null, null, "<b>Comment</b>", "color:#616161", null);
                var newTextNode = createHTMLElement("ul", null, null, null, null, null, null);
                var curText = createHTMLElement("li", Node_in.nodeValue, null, null, null, "color:#616161", null);
                newTextNode.appendChild(curText);
                newTextCaption.appendChild(newTextNode);
                newTextContainer.appendChild(newTextCaption);
                NodeToAdd = AppendChild(NodeToAdd, newTextContainer);
            } else if (Node_in.nodeType == 4) {//CDataSection node
                var newTextContainer = createHTMLElement("ul", null, null, null, null, null, null);
                var newTextCaption = createHTMLElement("li", null, null, null, "<b>CDATA</b>", "color:#616161", null);
                var newTextNode = createHTMLElement("ul", null, null, null, null, null, null);
                var curText = createHTMLElement("li", Node_in.nodeValue, null, null, null, "color:#616161", null);
                newTextNode.appendChild(curText);
                newTextCaption.appendChild(newTextNode);
                newTextContainer.appendChild(newTextCaption);
                NodeToAdd = AppendChild(NodeToAdd, newTextContainer);
            }
        }
        if (NodeToAdd)
        {
            return NodeToAdd;
        } else {
            return false;
        }
    } catch (e) {
        throw new Error("CreateTreeByDOMElement fails: " + e.message);
    }
}
/*function CreateTreeByDOMElement___0(Node_in,NodeToAdd,childNodeIndex)
 {
 //var NewNode;
 if (Node_in.nodeType)
 {
 var args = CreateTreeByDOMElement.arguments;//Creates the structure of the node
 if (Node_in.nodeType==1)//is one Element
 {
 var NewNode = createTreeNode(Node_in,childNodeIndex);
 NewNode.RelatedNodeName = Node_in.nodeName;
 NewNode.RelatedNodeAttributes="";
 if (Node_in.HightLight)
 {
 
 CurrentTreeElement.addElement(NewNode);
 delete(Node_in.HightLight);
 }
 if (args[1]==undefined)
 {
 NewNode.isRoot = true;
 }else{
 NewNode.isRoot = false;
 }
 var CurrentAttributes = Node_in.attributes;
 if (CurrentAttributes.length>0)
 {
 var AttSeparator = ""; 
 var newAttributecontainer = createHTMLElement("ul",null,null,null,null,null,null);
 var newAttributesCaption = createHTMLElement("li",null,null,null,"<b>Attributes</b>","color:#616161",null);
 var newAttributesNode = createHTMLElement("ul",null,null,null,null,null,null);
 for (var k=0;k<Node_in.attributes.length;k++)
 {
 var CurrentAttr = Node_in.attributes[k];
 var curAttribute = createHTMLElement("li",null,"attribureInfos",null,"<b>"+CurrentAttr.nodeName+"</b> = "+CurrentAttr.nodeValue,"color:#616161",null);
 newAttributesNode.appendChild(curAttribute);
 NewNode.RelatedNodeAttributes +=AttSeparator+CurrentAttr.nodeName+"="+CurrentAttr.nodeValue;
 AttSeparator = "#;#";
 }
 newAttributesCaption.appendChild(newAttributesNode);
 newAttributecontainer.appendChild(newAttributesCaption);
 NewNode.lastChild.appendChild(newAttributecontainer);
 }
 if ((args[1]==undefined)||(args[1]==""))
 {
 var NodeToAdd = NewNode;
 
 }else
 {
 NodeToAdd = AppendChild(NodeToAdd,NewNode);
 }
 var LastNode = NodeToAdd;
 //if (NewNode.isRoot==false)
 //{
 var LastNodeIndex = NodeToAdd.childNodes.length-1;
 LastNode = NodeToAdd.childNodes[LastNodeIndex];
 //}
 var nodeIndexList = "";
 for(var x=0;x<Node_in.childNodes.length;x++)
 {
 if (Node_in.childNodes[x].nodeType==1)//Store the childIndex only for Elements
 {
 nodeIndexList = (childNodeIndex==undefined)?x:childNodeIndex+","+x;
 }
 NodeToAdd = CreateTreeByDOMElement(Node_in.childNodes[x],LastNode,nodeIndexList);
 //NodeToAdd = AppendChild(NodeToAdd,NewNode);
 }
 }else if (Node_in.nodeType==2)//Attribute
 {
 var attribute = document.createAttribute(Node_in.nodeName);
 attribute.value = Node_in.nodeValue;
 NodeToAdd = AppendChild(NodeToAdd,attribute);
 }else if (Node_in.nodeType==3)//Text node
 {
 if ((Node_in.nodeValue!="\n")&&
 (Node_in.nodeValue != "\ln")&&
 (Node_in.nodeValue != "\t"))
 {
 var newTextContainer = createHTMLElement("ul",null,null,null,null,null,null);
 var newTextCaption = createHTMLElement("li",null,null,null,"<b>Text</b>","color:#616161",null);
 
 var newTextNode = createHTMLElement("ul",null,null,null,null,null,null);
 var curText = createHTMLElement("li",Node_in.nodeValue,null,null,null,"color:#616161",null);
 newTextNode.appendChild(curText);
 newTextCaption.appendChild(newTextNode);
 newTextContainer.appendChild(newTextCaption);
 NodeToAdd = AppendChild(NodeToAdd,newTextContainer);
 }
 }else if (Node_in.nodeType==8)//Comment Node
 {
 if ((Node_in.nodeValue!="\n")&&
 (Node_in.nodeValue != "\ln")&&
 (Node_in.nodeValue != "\t"))
 {
 var newTextContainer = createHTMLElement("ul",null,null,null,null,null,null);
 var newTextCaption = createHTMLElement("li",null,null,null,"<b>Comment</b>","color:#616161",null);
 var newTextNode = createHTMLElement("ul",null,null,null,null,null,null);
 var curText = createHTMLElement("li",Node_in.nodeValue,null,null,null,"color:#616161",null);
 newTextNode.appendChild(curText);
 newTextCaption.appendChild(newTextNode);
 newTextContainer.appendChild(newTextCaption);
 NodeToAdd = AppendChild(NodeToAdd,newTextContainer);
 }
 }
 }
 if (NodeToAdd)
 {
 return NodeToAdd;
 }else{
 return false;
 }
 }
 function setSelectedDiv(currentElement)
 {
 try
 {
 if (currentElement.getAttribute("id"))
 {
 var thisId = currentElement.getAttribute("id");
 }
 if (currentElement.getAttribute("class"))
 {
 var thisClass = currentElement.getAttribute("class");
 }
 if (thisClass=="DIVElementNode")
 {
 var currentDiv = document.getElementById(thisId);
 if (currentDiv)
 {
 CurrentTreeElement.addElement(currentDiv);
 oNodeIdentification.oElement.innerHTML = "";
 //document.getElementById("NodeIdentification").innerHTML = "";
 oNodeAttributes.oElement.innerHTML = "";
 //document.getElementById("NodeAtributes").innerHTML = "";
 //EditElement(currentDiv,self_in)
 }		
 }	
 }catch(e){
 window.alert("setSelectedDiv fails: "+e.message);
 }
 }*/
var CurrentTreeElement =
        {//Currently selected node representation in the Tree
            previousElement: null,
            element: null,
            documentElementName: null,
            setdocumentElementName: function(sDocumentElementNameIn)
            {
                try
                {
                    this.documentElementName = sDocumentElementNameIn.toUpperCase();
                } catch (e) {
                    throw new Error("CurrentTreeElement.setdocumentElementName fails: " + e.message);
                }
            },
            expand: function() {
                try
                {
                    if (this.element)
                    {
                        this.expandElement(this.element);
                    }
                } catch (e) {
                    throw new Error("CurrentTreeElement.expand fails: " + e.message);
                }
            },
            expandElement: function(element_in)
            {
                try
                {
                    if (element_in.parentNode)
                    {
                        var expandButton = element_in.firstChild.firstChild;
                        fireEvent(expandButton, "click");
                        if (element_in.parentNode.parentNode.RelatedNodeName)
                        {
                            var previousElement = element_in.parentNode.parentNode;
                            if (previousElement.RelatedNodeName.toUpperCase() == this.documentElementName)
                            {
                                return;
                            }
                            this.expandElement(previousElement);
                        }
                    }
                } catch (e) {
                    throw new Error("CurrentTreeElement.expandElement fails: " + e.message);
                }
            },
            addElement: function(elementIn)
            {
                try
                {
                    this.element = elementIn;
                } catch (e) {
                    throw new Error("CurrentTreeElement.addElement fails: " + e.message);
                }
            },
            highLight: function()
            {
                try
                {
                    if (!(this.element))
                    {
                        return;
                    }
                    if (this.previousElement)
                    {
                        this.previousElement.style.background = "";
                    }
                    this.element.style.background = "#ECE9D8";
                    this.previousElement = this.element;
                    //var expandButton = this.element.firstChild.firstChild;
                    //fireEvent(expandButton, "click");
                } catch (e) {
                    throw new Error("CurrentTreeElement.addElement fails: " + e.message);
                }
            },
            highLightElement: function(elementIn)
            {
                try
                {
                    this.addElement(elementIn);
                    this.highLight();
                } catch (e) {
                    throw new Error("CurrentTreeElement.addElement fails: " + e.message);
                }
            },
            reset: function()
            {
                try
                {
                    //this.element.style.background = "";
                    //this.previousElement.style.background = "";
                    this.previousElement = null;
                    this.element = null;
                    this.documentElementName = null;
                } catch (e) {
                    throw new Error("CurrentTreeElement.reset fails: " + e.message);
                }
            },
            getRelatedNodeName: function() {
                try
                {
                    if (this.element) {
                        if (this.element.RelatedNodeName)
                            return this.element.RelatedNodeName;
                    }
                    return "";
                } catch (e) {
                    throw new Error("CurrentTreeElement.getRelatedNodeName fails: " + e.message);
                }
            }

        };
var CurrentPreviewElement = {//Currently selected node representation in the IFrame 
    previousElement: null,
    element: null,
    highlightElement: null,
    enabled: true,
    higlightEfect: function()
    {
        try
        {
            if (this.element)
            {
                /*var left = document.getElementById("IFramePreview").offsetLeft;
                 var top = document.getElementById("IFramePreview").offsetTop;*/
                /*left= getHTMLElementLeft(this.element);
                 top = getHTMLElementTop(this.element);
                 var width = getHTMLElementWidth(this.element);
                 var height = getHTMLElementHeight(this.element);
                 */
                //var IFrame= document.getElementById("IFramePreview");
                var IFrame = oPreviewContainer.container.winBody.oElement.firstChild;
                //currentPreview.setIFrameSize();
                var width = this.element.offsetWidth;
                var height = this.element.offsetHeight;
                var left = getHTMLElementLeft(this.element);//this.element.offsetLeft;
                var top = getHTMLElementTop(this.element);//this.element.offsetTop;

                this.sethighlightElement(top, left, width, height);
                top = (top < 30) ? top : top - 30;
                IFrame.contentWindow.scrollTo(left, top);
            }
        } catch (e) {
            throw new Error("CurrentPreviewElement.higlightEfect fails: " + e.message);
        }
    },
    sethighlightElement: function(top, left, width, height)
    {
        try
        {
            /*if 	(selectedFile.fileExtension.toUpperCase()=="XML"){
             return;
             }*/
            var currentDOM = null;
            var selfBody = null;
            if (selectedFile.fileExtension == "XML")
            {
                var iframeContentDocument = selectedFile.getIFrameDocument();
                selfBody = iframeContentDocument.body;
                currentDOM = iframeContentDocument;
                //var selfBody = selectedFile.currentDOM.getElementsByTagName("body");
            } else {
                //var selfBody = selectedFile.currentDOM.getElementsByTagName("body");
                selfBody = selectedFile.currentDOM.body;
                currentDOM = selectedFile.currentDOM;
            }
            if (this.highlightElement == null)
            {
                var HTMLElement = currentDOM.createElement("DIV");
                var AttrStyle = currentDOM.createAttribute("style");
                AttrStyle.value = "position:absolute;left:0;top:0;width:0;height:0";
                HTMLElement.setAttributeNode(AttrStyle);
                var AttrId = currentDOM.createAttribute("id");
                AttrId.value = "Id_hightlight";
                HTMLElement.setAttributeNode(AttrId);
                //var HTMLElement = createHTMLElement("DIV",null,null,"Id_hightlight",null,"position:absolute;left:0;top:0;width:0;height:0",null,null);
                if (selfBody)
                {
                    selfBody.appendChild(HTMLElement);
                    this.highlightElement = currentDOM.getElementById("Id_hightlight");
                }
            }
            if (this.highlightElement)
            {
                this.highlightElement.style.position = "absolute";
                this.highlightElement.style.width = width.toString() + "px";
                this.highlightElement.style.height = height.toString() + "px";
                this.highlightElement.style.top = top.toString() + "px";
                this.highlightElement.style.left = left.toString() + "px";

                left = this.element.offsetLeft + width + 'px';
                top = this.element.offsetTop + height + 'px';

                this.highlightElement.style.opacity = "0.6";
                this.highlightElement.style.MozOpacity = "0.6";
                this.highlightElement.style.KhtmlOpacity = "0.6";
                this.highlightElement.style.filter = "alpha(opacity=" + (0.6 * 100) + ");";
                this.highlightElement.style.background = "black";
                this.highlightElement.style.border = "1px";
                this.highlightElement.style.borderStyle = "solid";
                this.highlightElement.style.borderColor = "blue";
                this.highlightElement.style.zIndex = "4";
            }
        } catch (e) {
            throw new Error("CurrentTreeElement.sethighlightElement fails: " + e.message + ", your navigator may not support the DOM specifications!  ");
        }
    },
    addElement: function(elementIn)
    {
        try
        {
            this.element = elementIn;
            this.previousElement = this.element;
            if (this.enabled == false)
            {
                return;
            }
            this.higlightEfect();
        } catch (e) {
            throw new Error("CurrentTreeElement.addElement fails: " + e.message);
        }
    },
    reset: function()
    {
        try
        {
            this.previousElement = null;
            this.element = null;
            this.highlightElement = null;
        } catch (e) {
            throw new Error("CurrentTreeElement.reset fails: " + e.message);
        }
    },
    removeHightLight: function()
    {
        try
        {
            if (this.highlightElement)
            {
                if (this.highlightElement.parentNode)
                    this.highlightElement.parentNode.removeChild(this.highlightElement);
                this.highlightElement = null;
            }
        } catch (e) {
            throw new Error("CurrentTreeElement.removeHightLight fails: " + e.message);
        }
    }
};
//function EditElement(nodeIndexList,self_in)
/*function EditElement(self_in)
 {
 var thisDiv = self_in.parentNode.parentNode;
 oNodeIdentification.oElement.innerHTML = thisDiv.RelatedNodeName;
 oNodeAttributes.oElement.innerHTML = thisDiv.RelatedNodeAttributes;
 if (thisDiv.nodeIndexList) ArrayWithChilds = thisDiv.nodeIndexList.split(",");
 editAtt(thisDiv.RelatedNodeAttributes);
 CurrentTreeElement.highLightElement(thisDiv);
 ArrayCurrentNodeRef = ArrayWithChilds;
 editNode();
 hightlightNode(viewMode);
 ArrayWithChilds = new Array();
 oTextAreaContainer.setSize();
 }*/
/*function editRoot()
 {
 var dataDocumentElement = selectedFile.currentDOM.documentElement;
 //oCurrentEditor.drawElementInnerHTML();
 oTextAreaContainer.oElement.value = "";
 //createTextArea();
 //regex to delete the hightlight from the editor
 //	var regGetHightLight = /<div\sid="Id_hightlight"[(\w)(\s)(")(:)(;)(\-)(%)(=)(.)(>)]+<\/div>/g;
 var regGetHightLight = /<div.+id="Id_hightlight".*><\/div>/;
 var XMLNewChild = CreateDOMElements(dataDocumentElement,null,document);
 var currInnerHTML = XMLNewChild.innerHTML;
 var newInnerHTML = currInnerHTML.replace(regGetHightLight, "");
 //XMLNewChild.innerHTML = newInnerHTML;
 //oTextAreaContainer.oElement.value = XMLNewChild.innerHTML;
 oTextAreaContainer.oElement.value = newInnerHTML;
 //document.getElementById("textAreaContainer").firstChild.value = XMLNewChild.innerHTML;
 ArrayWithChilds = new Array();	
 }*/
function editNode__()
{
    try
    {
        var dataDocumentElement = selectedFile.currentDOM.documentElement;
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
            window.alert("Document is empty");
            return;
        }
        var oTextAreaContainer = oEditorContainer.nodeEditor.textEditor;
        oTextAreaContainer.oElement.value = "";
        //Default XMLNewChild
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (XMLNewChild)
                XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
        }
        if (XMLNewChild)
        {
            //recorrer el elemento y por cada uno

            var regGetHightLight = /<DIV.+id="Id_hightlight".*>[\s]*<\/DIV>/;
            //var XMLHTMLNewChild = CreateDOMElements(XMLNewChild,null,document); //createa replica text/html so that i can use the property innerHTML
            var parserMimeType = selectedFile.ParserMimeType;
            if ((parserMimeType == "application/xhtml+xml") || (parserMimeType == "text/html"))
            {
                //everithing ok
            } else {
                //not recongnized in that case
                var regContentType = new RegExp(/\w*$/);
                var extension = regContentType.exec(parserMimeType)[0].toUpperCase();
                if (extension == "XML")
                {
                    //parsing sintax also application/xhtml+xml
                    parserMimeType == "application/xhtml+xml";
                }
            }
            //var regContentType = new RegExp(/\w*$/);
            //this.fileExtension = regContentType.exec(contentType)[0].toUpperCase();

            var innerHTML = DOMElementToString(XMLNewChild, selectedFile.ParserMimeType, true);
            //var XMLHTMLNewChild = CreateDOMElements(XMLNewChild,null,document); //createa replica text/html so that i can use the property innerHTML
            //var currentInnerHTML = XMLHTMLNewChild.innerHTML;
            if (innerHTML)
            {
                innerHTML = innerHTML.replace(regGetHightLight, "");
                oTextAreaContainer.oElement.value = innerHTML;
            }
        }
    } catch (e) {
        throw new Error("editNode fails: " + e.message);
    }
}
function getNodeValue()
{
    try
    {
        var dataDocumentElement = selectedFile.currentDOM.documentElement;
        var innerHTML = "";
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
            throw new Error("Document is empty");
        }
        var oTextAreaContainer = oEditorContainer.nodeEditor.textEditor;
        oTextAreaContainer.oElement.value = "";
        //Default XMLNewChild
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            try
            {
                if (XMLNewChild)
                    XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
            } catch (e) {
                window.alert("Unexpected Error: " + e.message);
            }
        }

        if (XMLNewChild)
        {
            //recorrer el elemento y por cada uno
            //
            /*
             var parserMimeType = selectedFile.ParserMimeType;
             if ((parserMimeType == "application/xhtml+xml")||(parserMimeType == "text/html"))
             {
             //everithing ok
             }else
             {
             //not recongnized. in that case
             var regContentType = new RegExp(/\w*$/);
             var extension = regContentType.exec(parserMimeType)[0].toUpperCase();
             if (extension == "XML")
             {
             //parsing sintax also application/xhtml+xml
             parserMimeType = "application/xhtml+xml";
             }else if(extension == "HTML")
             {
             parserMimeType == "text/html";
             }else{
             throw new Error("mime Type for parsering operations not recongnizable: MimeType: "+parserMimeType);
             }
             }
             */
            var curHTMLElement = null;
            if (selectedFile.fileExtension == "XML")
            {
                var innerHTML = DOMElementToString(XMLNewChild, "application/xhtml+xml", true, null);
            } else
            {
                /*var iframeParserOperations = document.getElementById("parseringIFrame");
                 var iframeOpersDOM = iframeParserOperations.contentDocument;
                 curHTMLElement = CreateDOMElements(XMLNewChild,null,iframeOpersDOM);
                 window.alert(curHTMLElement.innerHTML);
                 */
                var innerHTML = XMLNewChild.innerHTML;
            }
            //window.alert("element value: "+innerHTML);
            if (innerHTML)
            {
                var regGetHightLight = /<DIV.+id="Id_hightlight".*><\/DIV>/;
                //remove all type="disable"
                var regType_disable = /\stype=\"disabled\"/g;
                //rename type_disable and meta_disable
                var reg_disable = /_disabled/g;
                var reg_amp = /&amp;/g;
                var reg_lt = /&lt;/g;
                var reg_gt = /&gt;/g;
                innerHTML = innerHTML.replace(regGetHightLight, "");
                innerHTML = innerHTML.replace(regType_disable, "");
                innerHTML = innerHTML.replace(reg_disable, "");
                innerHTML = innerHTML.replace(reg_amp, "&");
                innerHTML = innerHTML.replace(reg_lt, "<");
                innerHTML = innerHTML.replace(reg_gt, ">");
            }
            return innerHTML;
        }
    } catch (e) {
        throw new Error("editNode fails: " + e.message);
    }
}
function getXMLUlChilds(DOMElementIn)
{
    try
    {
        var aULList = new Array();
        var currentElement = null;
        for (var x = 0; x < DOMElementIn.childNodes.length; x++)
        {
            currentElement = DOMElementIn.childNodes[x];
            if (currentElement.nodeType == 1)
            {
                if ((currentElement.nodeName.toUpperCase() == "UL") && ((currentElement.className == "wbcmsXMLNode") || (currentElement.className == "comment") || (currentElement.className == "textElement")))//textElement
                {
                    aULList.push(currentElement);
                }
            }
        }
        return aULList;
    } catch (e) {
        throw new Error("getXMLUlChilds fails: " + e.message);
    }
}
function getXMLUlChilds__(DOMElementIn)
{
    try
    {
        var aULList = new Array();
        var nodeList = DOMElementIn.getElementsByTagName("ul");
        var currentElement = null;
        for (var x = 0; x < nodeList.length; x++)
        {
            currentElement = nodeList[x];
            if (currentElement.nodeType == 1)
            {
                if ((currentElement.nodeName.toUpperCase() == "UL") && (currentElement.className == "wbcmsXMLNode"))
                {
                    aULList.push(currentElement);
                }
            }
        }
        return aULList;
    } catch (e) {
        throw new Error("getXMLUlChilds fails: " + e.message);
    }
}
function hightlightXMLNode()
{
    try
    {
        CurrentPreviewElement.removeHightLight();

        var iframeContentDocument = selectedFile.getIFrameDocument();
        selfBody = iframeContentDocument.body;
        currentDOM = iframeContentDocument;
        var ULNodeList = getXMLUlChilds(selfBody);
        if (ULNodeList.length > 0)
        {
            var selectedNodeRoot = ULNodeList[0];
            var selectedNode = selectedNodeRoot;
            if (ArrayCurrentNodeRef.length > 0)
            {
                var rootChilds = getXMLUlChilds(selectedNodeRoot);
                var currentIndex = Number(ArrayCurrentNodeRef[0]);
                var selectedNode = rootChilds[currentIndex];
                for (var x = 1; x < ArrayCurrentNodeRef.length; x++)
                {
                    currentIndex = Number(ArrayCurrentNodeRef[x]);
                    var currentChilds = getXMLUlChilds(selectedNode);
                    selectedNode = currentChilds[currentIndex];
                }
            }
        }
        if (selectedNode)
        {
            if (selectedNode.nodeType == 1)
            {
                CurrentPreviewElement.addElement(selectedNode);
            }
        }
    } catch (e) {
        throw new Error("hightlightXMLNode fails: " + e.message);
    }
}
function hightlightNode()
{
    try
    {
        //CurrentPreviewElement.removeHightLight();
        var viewDocumentElement = selectedFile.currentDOM.documentElement;
        frameDocumentElement = viewDocumentElement;
        //var XMLNewChild = null;
        var thisNode = null;
        if (viewDocumentElement)
        {
            thisNode = viewDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (thisNode)
                thisNode = thisNode.childNodes[ArrayWithChilds[x]];
        }
        if (thisNode)
        {
            if (thisNode.nodeType == 1)
            {
                CurrentPreviewElement.addElement(thisNode);
            }
        }
    } catch (e) {
        throw new Error("hightlightNode fails: " + e.message);
    }
}
function renameNode(indexList, sNodeName)
{
    try {
        var dataDocumentElement = selectedFile.currentDOM.documentElement;
        ArrayWithChilds = new Array();
        if (indexList)
        {
            ArrayWithChilds = indexList.split(",");
        }
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
            window.alert("Document is empty");
            return;
        }
        //Default XMLNewChild
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (XMLNewChild)
                XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
        }
        if (XMLNewChild)
        {
            //var oldNodeHTMLReplica = CreateDOMElements(XMLNewChild,null,selectedFile.currentDOM);
            var oNewChild = selectedFile.currentDOM.createElement(sNodeName);
            for (var k = 0; k < XMLNewChild.attributes.length; k++)
            {
                var CurrentAttr = CreateDOMElements(XMLNewChild.attributes[k], null, selectedFile.currentDOM);
                var current = AppendChild(oNewChild, CurrentAttr);
            }
            for (var x = 0; x < XMLNewChild.childNodes.length; x++)
            {
                var node = CreateDOMElements(XMLNewChild.childNodes[x], null, selectedFile.currentDOM);
                var current = AppendChild(oNewChild, node);
            }
            var oldNode = XMLNewChild.parentNode.replaceChild(oNewChild, XMLNewChild);
            oNewChild.setAttribute("HightLight", "true");
            oTreeContainer.loadTree();
            //loadTree();
        }
    } catch (e) {
        throw new Error("renameNode fails: " + e.message);
    }
}
function appendChildNode(indexList, sNodeName)
{
    try
    {
        ArrayWithChilds = new Array();
        var selfDOM = selectedFile.currentDOM;
        var dataDocumentElement = selfDOM.documentElement;
        if (indexList)
        {
            ArrayWithChilds = indexList.split(",");
        }
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
        }
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (XMLNewChild)
                XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
        }
        if (XMLNewChild)
        {
            var oNewChild = selfDOM.createElement(sNodeName);
            oNewChild = XMLNewChild.appendChild(oNewChild);
            oNewChild.setAttribute("HightLight", "true");
            oTreeContainer.loadTree();
            //document.getElementById("treeContainer_"+this.index).parentNode.firstChild.firstChild;//expand button
            //fireEvent(expandButton,"click");
        }
    } catch (e) {
        throw new Error("appendChildNode fails: " + e.message);
    }
}
function insertBeforeElement(indexList, sNodeName)
{
    try {
        var dataDocumentElement = selectedFile.currentDOM.documentElement;
        ArrayWithChilds = new Array();
        if (indexList)
        {
            ArrayWithChilds = indexList.split(",");
        }
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
            window.alert("Document is empty");
            return;
        }
        //Default XMLNewChild
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (XMLNewChild)
                XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
        }
        if (XMLNewChild)
        {
            var oNewChild = selectedFile.currentDOM.createElement(sNodeName);
            var addedChild = XMLNewChild.parentNode.insertBefore(oNewChild, XMLNewChild);
            addedChild.HightLight = true;
            oNewChild.setAttribute("HightLight", "true");
            oTreeContainer.loadTree();
            //loadTree();
        }
    } catch (e) {
        throw new Error("insertBeforeElement fails: " + e.message);
    }
}
function removeNode(indexList, sNodeName)
{
    try {
        var dataDocumentElement = selectedFile.currentDOM.documentElement;
        ArrayWithChilds = new Array();
        if (indexList)
        {
            ArrayWithChilds = indexList.split(",");
        }
        if (selectedFile.currentDOM.childNodes.length == 0)
        {
            ArrayWithChilds = new Array();
            CurrentTreeElement.reset();
            CurrentPreviewElement.reset();
            window.alert("Document is empty");
            return;
        }
        //Default XMLNewChild
        var XMLNewChild = null;
        if (dataDocumentElement)
        {
            XMLNewChild = dataDocumentElement;
        }
        for (var x = 0; x < ArrayWithChilds.length; x++)
        {
            if (XMLNewChild)
                XMLNewChild = XMLNewChild.childNodes[ArrayWithChilds[x]];
        }
        if (XMLNewChild)
        {
            var parentNode = XMLNewChild.parentNode;
            var removedChild = XMLNewChild.parentNode.removeChild(XMLNewChild);
            //parentNode.HightLight = true;
            parentNode.setAttribute("HightLight", "true");
            oTreeContainer.loadTree();
            //loadTree();
        }
    } catch (e) {
        throw new Error("removeNode fails: " + e.message);
    }
}
/*function hightlightRoot()
 {
 try
 {
 CurrentPreviewElement.removeHightLight();
 var viewDocumentElement =selectedFile.currentDOM.documentElement;
 CurrentPreviewElement.addElement(viewDocumentElement);
 }catch(e){
 throw new Error("hightlightRoot fails: "+e.message);
 }
 }*/
function createTreeNode(Node_in, ChildNodeIndex)
{
    try
    {
        var NodeName_in = Node_in.nodeName;
        var id = Node_in.id;
        var className = Node_in.className;
        var attName = ((Node_in.getAttribute("name")) || (Node_in.getAttribute("Name")) || (Node_in.getAttribute("NAME")));
        var identificator = (Node_in.id) ? "#" + Node_in.id : "";
        identificator = ((!(identificator)) && (className)) ? "." + className : identificator;
        identificator = ((!(identificator)) && (attName)) ? "@" + attName : identificator;
        identificator = (identificator) ? "<b style='color:red'>" + identificator + "</b>" : "";
        var oIdentificator = createHTMLElement("span", null, null, null, identificator, null, null);
        var justUL = createHTMLElement("ul", null, null, null, null, null, null);
        var ULCategorie = createHTMLElement("ul", null, "treeContainer", null, null, "display:none", null);
        var LiSubcategorie = createHTMLElement("li", null, "subcat", null, null, null, null);
        var imgExpand = createHTMLElement("img", null, "BTNDownUp", null, null, null, "alt=Down_Up,src=images/up.png,alt=up/down");
        LiSubcategorie.appendChild(imgExpand);
        //ULCategorie.appendChild(imgExpand);
        //var AnclaElement = createHTMLElement("a",NodeName_in,"BTNElementNode",null,null,null,"href=#"+NodeName_in);
        var AnclaElement = createHTMLElement("a", NodeName_in, "BTNElementNode", null, null, null, null);
        //var AnclaElement = createHTMLElement("a",NodeName_in,"BTNElementNode",null,null,null,null);
        //		
        var spanTextNode = createHTMLElement("span", "", "spanTextNode", null, null, "color:#CC0099;padding-left:3px", null);
        //
        var CurrentChildList = null;
        if (ChildNodeIndex != undefined)//other than root element
        {
            CurrentChildList = ChildNodeIndex.toString();
            ULCategorie.id = "treeContainer_" + ChildNodeIndex;
        } else {
            ULCategorie.id = "treeContainer_root";
        }
        //
        LiSubcategorie = justUL.appendChild(LiSubcategorie);
        ULCategorie = justUL.appendChild(ULCategorie);
        justUL.nodeIndexList = CurrentChildList;
        oIdentificator = AnclaElement.appendChild(oIdentificator);
        AnclaElement = LiSubcategorie.appendChild(AnclaElement);
        //
        spanTextNode = LiSubcategorie.appendChild(spanTextNode);
        imgExpand.onclick = function()
        {
            try
            {
                var parentLi = this.parentNode;
                var parentUl = parentLi.parentNode;
                //
                var curSRC = this.getAttribute("src");
                var regFileName = new RegExp(/\w*.\w*$/);
                var pngFileName = regFileName.exec(curSRC)[0];
                //
                if (pngFileName == "up.png")
                {
                    parentUl.lastChild.style.display = "block";
                    this.setAttribute("src", "images/down.png");
                } else {
                    parentUl.lastChild.style.display = "none";
                    this.setAttribute("src", "images/up.png");
                }
            } catch (e) {
                window.alert("createTreeNode.imgExpand.onclick fails: Error: " + e.message);
            }
        };
        //ChildNodeIndex = (ChildNodeIndex==undefined)?"root":ChildNodeIndex;
        //ChildNodeIndex = ChildNodeIndex;
        AnclaElement.onclick = function()
        {
            try
            {
                var thisUl = this.parentNode.parentNode;
                //oNodeIdentification.oElement.innerHTML = thisUl.RelatedNodeName;
                //oNodeAttributes.oElement.innerHTML = thisUl.RelatedNodeAttributes;
                if (thisUl.nodeIndexList)
                    ArrayWithChilds = thisUl.nodeIndexList.split(",");
                //editAtt(thisUl.RelatedNodeAttributes);
                CurrentTreeElement.highLightElement(thisUl);
                ArrayCurrentNodeRef = ArrayWithChilds;
                //editNode();
                var nodeValue = getNodeValue();
                oEditorContainer.editNode(thisUl.RelatedNodeName, thisUl.RelatedNodeAttributes, nodeValue);
                if (selectedFile.fileExtension.toUpperCase() == "XML")
                {
                    hightlightXMLNode();
                } else
                {
                    CurrentPreviewElement.enabled = true;
                    hightlightNode();
                }
                ArrayWithChilds = new Array();
                oTreeContainer.avalButtonsByNode(CurrentPreviewElement.element);
                //oTextAreaContainer.setSize();
            } catch (e)
            {
                window.alert("createTreeNode.AnclaElement.onclick fails: Error: " + e.message);
            }
        };
        if (Node_in.id == "Id_hightlight")
        {
            justUL.style.display = "none";
        }
        return justUL;
    } catch (e) {
        throw new Error("createTreeNode fails: " + e.message);
    }
}
/*function changeCurrentDom___()
 {
 try
 {
 CurrentPreviewElement.removeHightLight();
 var sXML = document.getElementById("textAreaContainer").firstChild.value;
 var dataDocumentElement = selectedFile.currentDOM.documentElement;//so i can get an text/xhtml in order to text/xml.
 var oldChild = dataDocumentElement;
 var fileExtension = selectedFile.fileExtension;
 for(var x=0;x<ArrayCurrentNodeRef.length;x++)
 {
 if ((x+1)==ArrayCurrentNodeRef.length)//last child, the child to replace
 {
 if (currentNode==undefined)
 {
 var currentNode = dataDocumentElement;
 }
 oldChild = currentNode.childNodes[ArrayCurrentNodeRef[x]];
 }else
 {
 if (currentNode == undefined)
 {
 currentNode = dataDocumentElement.childNodes[ArrayCurrentNodeRef[x]];
 }else
 {
 currentNode = currentNode.childNodes[ArrayCurrentNodeRef[x]];
 }	
 }
 }
 if (currentNode==undefined)
 {
 var currentNode = dataDocumentElement.parentNode;
 }
 var newChild = CreateDOMElements(oldChild,null,document);//Create HTMLElement
 removeChilds(newChild);
 
 if ((fileExtension=="HTML")||(fileExtension=="HTM")||(fileExtension=="XHTML"))
 {
 var bIsChildBody = isChildOfBody(oldChild,selectedFile.currentDOM);
 var bIsChildHead = isChildOfHead(oldChild,selectedFile.currentDOM);
 var bIsDocumentElement = isDocumentElement(oldChild,selectedFile.currentDOM);
 var bIsChildOfDocumentElement = isChildOfDocumentElement(oldChild,selectedFile.currentDOM);
 if (bIsChildBody)
 {
 newChild.innerHTML = sXML;
 }else if (bIsChildHead)
 {
 var HTMLTempElement = createHTMLElement("temp",null,null,null,sXML,null,null);
 window.alert(HTMLTempElement.innerHTML);
 for(var x= 0;x<HTMLTempElement.childNodes.length;x++)
 {
 var currentElement = HTMLTempElement.childNodes[x];
 var currentElementDefinition = CreateDOMElements(currentElement,null,document);
 var curAdition = AppendChild(newChild,currentElementDefinition);
 }
 window.alert("new Child = "+newChild.innerHTML);
 delete (HTMLTempElement);
 }else if(bIsDocumentElement){
 newChild.innerHTML = sXML;
 }else if(bIsChildOfDocumentElement){
 var HTMLTempElement = createHTMLElement(oldChild.nodeName,null,null,null,sXML,null,null);
 newChild = HTMLTempElement;
 }else{
 throw new Error("changeCurrentDom: The structure of this HTML Document is not recongnizable!");
 }
 }else{
 newChild.innerHTML = sXML;
 }
 var oAttributeArea = document.getElementById("NodeAtributes");
 for (var x=0;x<oAttributeArea.childNodes.length;x++)
 {
 var currAttName = oAttributeArea.childNodes[x].firstChild.innerHTML;
 var currAttValue= oAttributeArea.childNodes[x].lastChild.value;
 if (newChild.getAttribute(currAttName))
 {
 newChild.setAttribute(currAttName,currAttValue)
 }else{
 var newAttribute = selectedFile.currentDOM.createAttribute(currAttName);
 newAttribute.nodeValue = currAttValue;
 newChild.setAttributeNode(newAttribute);
 }
 }
 //newChild = CreateDOMElements(newChild,null,selectedFile.currentDOM);
 newChild = selectedFile.currentDOM.importNode(newChild,true);
 var replacedChild = currentNode.replaceChild(newChild,oldChild);
 oTreeContainer.loadTree();
 //loadTree();
 
 //saveXML();
 }catch(e){
 window.alert("\nchangeCurrentDom(): Error name: "+e.name+", message:"+e.message+", Description:"+e.message);
 }
 }*/
function changeCurrentDom()
{
    try
    {
        //selectedFile.setEnableMetas(true); 
        CurrentPreviewElement.removeHightLight();
        CurrentTreeElement.reset();
        var sXML = new String(oEditorContainer.nodeEditor.textEditor.oElement.value);
        sXML = sXML.rltrimFeedChar();
        //
        var regContentType = new RegExp(/\w*$/);
        var extension = regContentType.exec(selectedFile.ParserMimeType)[0].toUpperCase();
        //
        if ((selectedFile.ParserMimeType == "application/xml") || ((extension == "XML") && (selectedFile.contentType != "text/html")))
        {
            var dataDocumentElement = selectedFile.currentDOM.documentElement;
            var selectedNode = null;
            if (dataDocumentElement)
            {
                selectedNode = dataDocumentElement;
            }
            for (var x = 0; x < ArrayCurrentNodeRef.length; x++)
            {
                if (selectedNode)
                    selectedNode = selectedNode.childNodes[ArrayCurrentNodeRef[x]];
            }
            var tmpNodeName = selectedNode.nodeName;
            var processingInstruction = '<?xml version="1.0" encoding="' + selectedFile.charSet + '"?>';
            var tmpDOM = getDOMFromString(processingInstruction + "<" + tmpNodeName + ">" + sXML + "</" + tmpNodeName + ">");
            if (tmpDOM)
            {

                var element = tmpDOM.documentElement;
                //var setElementToDOMType = selectedFile.currentDOM.importNode(element,true);//CreateDOMElements(element,null, selectedFile.currentDOM);
                var setElementToDOMType = CreateDOMElements(element, null, selectedFile.currentDOM);
                var newElement = setElementToDOMType;
            } else {

                return;
            }
        } else //if (selectedFile.ParserMimeType=="text/html")
        {
            var selectedNode = CurrentPreviewElement.element;
            var tmpNodeName = selectedNode.nodeName.toUpperCase();
            /*if ((tmpNodeName=="HTML")||
             (tmpNodeName=="HEAD")||
             (tmpNodeName=="META")||
             (tmpNodeName=="LINK")
             )*/
            if ((tmpNodeName == "HTML") ||
                    (tmpNodeName == "HEAD") ||
                    (tmpNodeName == "META") ||
                    (tmpNodeName == "LINK") ||
                    (IsSGML(tmpNodeName))
                    )
            {
                //throw new Error("The inner Content of the HTML Elements <HTML>,<HEAD> AND <META> wont be modified in that way. If you want to manipulate the inner content of these elements manually you can do that over the menu [view]->[Source] or with the menu [Node Performance] ");
            } else
            {
                if (typeof(selectedNode.innerHTML) == "string")
                {
                    try
                    {
                        selectedNode.innerHTML = sXML;
                        var newElement = selectedNode;
                    } catch (e)
                    {
                        throw new Error("this HTML Element does not allow to overwritte the property innerHTML of the element. It is not an error! Manipulate it over the view->source or with the Node Performance Menu option.");
                    }
                }
            }
        }
        //var tmpImportedNode = selectedFile.currentDOM.importNode(createElementType,true);
        if (newElement != undefined)
        {
            var replacedChild = selectedNode.parentNode.replaceChild(newElement, selectedNode);
        } else {
            var newElement = selectedNode;
        }
        //
        var oAttributeArea = oEditorContainer.nodeEditor.attributes;
        var attributesIndex = new Object();
        //
        var AttToRemove = new Object();
        for (var x = 0; x < newElement.attributes.length; x++)
        {
            var curAttName = newElement.attributes[x].nodeName;
            AttToRemove[curAttName] = curAttName;
        }
        for (var x in AttToRemove)
        {
            newElement.removeAttribute(AttToRemove[x]);
        }
        //
        for (var x in oAttributeArea)
        {
//			window.alert("oAttributeArea x= "+x);
            var currAttName = oAttributeArea[x].AttName.oElement.innerHTML;
            var currAttValue = oAttributeArea[x].AttValue.oElement.value;
//			
            var newAttribute = selectedFile.currentDOM.createAttribute(currAttName);
            newAttribute.nodeValue = currAttValue;
            newElement.setAttributeNode(newAttribute);
        }
        newElement.setAttribute("HightLight", "true");
        oTreeContainer.loadTree();
        if (selectedFile.fileExtension.toUpperCase() == "XML")
        {
            //hightlightXMLNode();
        } else {
            //hightlightNode();
        }
        //CurrentPreviewElement.addElement(newElement);
    } catch (e) {
        throw new Error("changeCurrentDom fails: " + e.message);
    }
}
/*function changeCurrentDom_zhzh()//not posible to use with xml files because innerHTML transforms the nodeName to upperCase
 {
 try
 {
 var selectedNode = CurrentPreviewElement.element;
 CurrentPreviewElement.removeHightLight();
 CurrentTreeElement.reset();
 var sXML = oTextAreaContainer.oElement.value;
 var dataDocumentElement = selectedFile.currentDOM.documentElement;
 var allowInnerHTML = false;
 var hasInnerHTML = false;
 //
 if  (typeof(selectedNode.innerHTML)=="string") hasInnerHTML=true;
 var newTempChild = CreateDOMElements(selectedNode,null,document);
 if (hasInnerHTML)
 {
 if (sXML.trim())
 {
 selectedNode.innerHTML = "";
 selectedNode.innerHTML = sXML;
 newTempChild.innerHTML = sXML;;
 }else{
 removeChilds(selectedNode);
 }
 }
 var newChild = selectedNode; 
 var oAttributeArea = oNodeAttributes.oElement;//from layout2.js
 var attributesIndex = new Object();
 for (var x=0;x<oAttributeArea.childNodes.length;x++)
 {
 var currAttName = oAttributeArea.childNodes[x].firstChild.innerHTML;
 var currAttValue= oAttributeArea.childNodes[x].lastChild.value;
 //if exists then modify
 if (newChild.getAttribute(currAttName))
 {
 newChild.setAttribute(currAttName,currAttValue);
 }else{//if does not exists then create
 var newAttribute = selectedFile.currentDOM.createAttribute(currAttName);
 newAttribute.nodeValue = currAttValue;
 newChild.setAttributeNode(newAttribute);
 }
 attributesIndex[currAttName] = true; 
 }
 for (var x=0;x<newChild.attributes.length;x++)
 {
 var CurrentAttr = newChild.attributes[x];
 if (!(attributesIndex[CurrentAttr.nodeName]))
 {
 var removedAttribute = newChild.removeAttribute(CurrentAttr.nodeName);
 }
 }
 newChild.setAttribute("HightLight","true");
 oTreeContainer.loadTree();
 CurrentPreviewElement.addElement(newChild);
 }catch(e){
 window.alert("\nchangeCurrentDom(): Error name: "+e.name+", message:"+e.message+", Description:"+e.message);
 }
 }*/
/*function changeCurrentDom_____NNNNN()
 {
 try
 {
 CurrentPreviewElement.removeHightLight();
 CurrentTreeElement.reset();
 var sXML = oTextAreaContainer.oElement.value;
 var dataDocumentElement = selectedFile.currentDOM.documentElement;//so i can get an text/xhtml in order to text/xml.
 var oldChild = dataDocumentElement;
 var fileExtension = selectedFile.fileExtension;
 for(var x=0;x<ArrayCurrentNodeRef.length;x++)
 {
 if ((x+1)==ArrayCurrentNodeRef.length)//last child, the child to replace
 {
 if (currentNode==undefined)
 {
 var currentNode = dataDocumentElement;
 }
 oldChild = currentNode.childNodes[ArrayCurrentNodeRef[x]];
 }else
 {
 if (currentNode == undefined)
 {
 currentNode = dataDocumentElement.childNodes[ArrayCurrentNodeRef[x]];
 }else
 {
 currentNode = currentNode.childNodes[ArrayCurrentNodeRef[x]];
 }	
 }
 }
 if (currentNode==undefined)
 {
 var currentNode = dataDocumentElement.parentNode;
 }
 ///
 var allowInnerHTML = false;
 var hasInnerHTML = false;
 if  (typeof(oldChild.innerHTML)=="string") hasInnerHTML=true;
 if (((fileExtension.toUpperCase()=="HTML")||(fileExtension.toUpperCase()=="XHTML")||(fileExtension.toUpperCase()=="HTM"))&&(hasInnerHTML))
 {
 allowInnerHTML = true;
 }else if(fileExtension.toUpperCase()=="XML"){
 allowInnerHTML = true;
 }
 var newTempChild = CreateDOMElements(oldChild,null,document);
 if (allowInnerHTML)
 {
 if (sXML.trim())
 {
 newTempChild.innerHTML = sXML;
 }else{
 removeChilds(newTempChild);
 }
 }
 var newChild = selectedFile.currentDOM.importNode(newTempChild,true);
 var rempacedChild = currentNode.replaceChild(newChild,oldChild);
 var oAttributeArea = oNodeAttributes.oElement;//from layout2.js
 var attributesIndex = new Object();
 for (var x=0;x<oAttributeArea.childNodes.length;x++)
 {
 var currAttName = oAttributeArea.childNodes[x].firstChild.innerHTML;
 var currAttValue= oAttributeArea.childNodes[x].lastChild.value;
 //if exists then modify
 if (newChild.getAttribute(currAttName))
 {
 newChild.setAttribute(currAttName,currAttValue);
 }else{//if does not exists then create
 var newAttribute = selectedFile.currentDOM.createAttribute(currAttName);
 newAttribute.nodeValue = currAttValue;
 newChild.setAttributeNode(newAttribute);
 }
 attributesIndex[currAttName] = true; 
 }
 for (var x=0;x<newChild.attributes.length;x++)
 {
 var CurrentAttr = newChild.attributes[x];
 if (!(attributesIndex[CurrentAttr.nodeName]))
 {
 var removedAttribute = newChild.removeAttribute(CurrentAttr.nodeName);
 }
 }
 newChild.setAttribute("HightLight","true");
 oTreeContainer.loadTree();
 CurrentPreviewElement.addElement(newChild);
 }catch(e){
 window.alert("\nchangeCurrentDom(): Error name: "+e.name+", message:"+e.message+", Description:"+e.message);
 }
 }*/
/*function loadTree()
 {
 try
 {
 removeChilds(oTreeContainer);
 //enable the metas und script to the original values.
 selectedFile.setEnableMetas(true);
 selectedFile.setEnableScripts(true);
 var dataDocumentElement = selectedFile.currentDOM.documentElement;
 var NewElements = CreateTreeByDOMElement(dataDocumentElement);
 if (dataDocumentElement)
 {
 oTreeContainer.appendChild(NewElements);
 CurrentTreeElement.setdocumentElementName(dataDocumentElement.nodeName);
 CurrentTreeElement.highLight();
 if (CurrentTreeElement.element)
 {
 CurrentTreeElement.expand();
 
 }
 var expandTreeByLevel = new oLevel(dataDocumentElement,1);
 if (CurrentTreeElement.element)
 {
 oTreeContainer.scrollTop = CurrentTreeElement.element.offsetTop;
 }
 }
 //set the metas and the script acording to the user specifications.
 selectedFile.setEnableMetas(ENABLE_METAS);
 selectedFile.setEnableScripts(ENABLE_SCRIPTS);
 }catch(e){
 throw new Error("loadTree fails: "+e.message);
 }
 }
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
 if (expandButton.getAttribute("src")=="up.png")//if the element is not expanded, otherwise has been expandend bevor.
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
 }*/
/*function arrayLevelDefinition(level_in,aIndex)
 {
 try
 {
 //create index
 if (aIndex == undefined) var aIndex = new Array(1);//firstone is the root element
 var indexLastIndex = aIndex.length-1;
 aIndex[indexLastIndex] = new Array(1);
 level_in--;
 aIndex = arrayLevelDefinition(level_in,aIndex[indexLastIndex]);
 return aIndex;
 }catch(e){
 throw new Error("arrayLevelDefinition fails: "+e.message);
 }
 }*/
//not used
/*function WriteArea()
 {
 var newTextArea = document.createElement("textarea");
 newTextArea.rows="33";
 newTextArea.cols="50";
 document.getElementById("textAreaContainer").appendChild(newTextArea);
 document.getElementById("textAreaContainer").firstChild.value = document.getElementById("tree").innerHTML;
 }*/
/*function createTextArea()
 {
 try
 {
 //var selftHeight = getTextAreaHeight()-14;
 var selftHeight = getTextAreaHeight()-12;//2 border, 10 magin top and bottom
 var selftWidth = getTextAreaWidth()-12;// 2 border, 10 magin left and right
 removeChilds(oEditorContainer.nodeEditor.textEditor.oElement);
 var newTextArea = document.createElement("textarea");
 newTextArea.style.width = selftWidth.toString()+"px";
 newTextArea.rows="1";
 newTextArea.style.border = "1px solid #707070";
 newTextArea.style.margin = "5px 5px 5px 5px";
 newTextArea.style.height = selftHeight.toString()+"px";
 document.getElementById("textAreaContainer").appendChild(newTextArea);
 }catch(e){
 throw new Error("createTextArea fails: "+e.message);
 }
 }*/
/*function initTree()
 {
 DIVElementNodeId = 0;
 loadTree();
 if (CurrentTreeElement.element)
 {
 setSelectedDiv(CurrentTreeElement.element);
 }
 oTextAreaContainer.oElement.value="";
 //oCurrentEditor.drawElementInnerHTML();
 //createTextArea();
 }*/
/*function btnExpand(expandElement,oIMGself)
 {
 try
 {
 if (expandElement.fx==undefined)
 {
 setFxToNode(expandElement);
 }	
 expandElement.fx.expand(oIMGself.offsetHeight);			
 
 if (oIMGself.getAttribute("src")=="up.png")
 {
 oIMGself.setAttribute("src","down.png")
 }else{
 oIMGself.setAttribute("src","up.png")
 }
 }catch(e){
 throw new Error("btnExpand fails: "+e.message);
 }
 }*/
/*function expandTreeNode(ElementIn,imgElement)
 {
 try
 {
 if (ElementIn.fx==undefined)
 {
 setFxToNode(ElementIn);
 }	
 ElementIn.fx.expand();
 }catch(e){
 throw new Error("expandTreeNode fails: "+e.message);
 }
 }*/
/*function addTreeEffects(NodeToAdd_in)
 {
 try
 {
 if (NodeToAdd_in.nodeType==1)
 {
 var WBCMSClass = 0;
 for (var x=0;x<NodeToAdd_in.attributes.length;x++)
 {
 if ((NodeToAdd_in.attributes[x].nodeName.toUpperCase()=="CLASS")&&(NodeToAdd_in.attributes[x].nodeValue=="DIVElementNode"))
 {
 WBCMSClass++;
 }
 }
 if (WBCMSClass>0)
 {
 NodeToAdd_in.fx = new Fx(NodeToAdd_in);
 NodeToAdd_in.style.overflow = "hidden";
 NodeToAdd_in.style.height = "23px";
 }
 if (NodeToAdd_in.childNodes.length>0)
 {
 
 for (var x=0;x<NodeToAdd_in.childNodes.length;x++)
 {
 
 addTreeEffects(NodeToAdd_in.childNodes[x]);
 }
 }
 }
 }catch(e){
 throw new Error("addTreeEffects fails: "+e.message);
 }
 }*/
/*function setFxToNode(currentElement)
 {
 if (currentElement.nodeName.toUpperCase() !="UL")
 {
 return false;
 }
 if (currentElement.getAttribute("class"))
 {
 var thisClass = currentElement.getAttribute("class");
 }
 if (thisClass=="treeContainer")
 {
 if (currentElement)
 {
 if (currentElement.fx==undefined)
 {
 currentElement.fx = new Fx(currentElement);
 }
 if(currentElement.parentNode.childNodes.length>0)
 {
 setFxToNode(currentElement.parentNode);
 }
 }
 }
 }
 */
/*function editAtt(sRelatedNodeAttributes)
 {
 try
 {
 //window.alert(currentEditor.NodeArea.oElement);
 //window.alert(currentEditor.NodeArea.NodeAttributes.oElement.childNodes.length+".>from DOM"+document.getElementById("NodeAtributes").childNodes.length);
 //removeChilds(document.getElementById("NodeAtributes"));
 removeChilds(oNodeAttributes.oElement);
 
 
 var aRelatedNodeAttributes = sRelatedNodeAttributes.split("#;#");
 var content = "";
 if (aRelatedNodeAttributes.length>0)
 {
 //currentEditor.drawNodeArea();
 for (var x=0;x<aRelatedNodeAttributes.length;x++)
 {
 if (aRelatedNodeAttributes[x])
 {
 var AttName = "";
 var AttContent = "";
 var regAttName = /(^[\w-]*)/;//Attribute name
 var arrAttName = regAttName.exec(aRelatedNodeAttributes[x]);
 var regAttValue = /(?:=)(.*)/;//Attribute value
 var arrAttValue = regAttValue.exec(aRelatedNodeAttributes[x]);
 if (arrAttName)
 {
 AttName = arrAttName[0];
 }
 if (arrAttValue)
 {
 AttContent = arrAttValue[1];
 }
 //createAttTextArea(AttName,AttContent);
 oNodeAttributes.addContainer();
 var lastContainer = oNodeAttributes.LastContainer;
 lastContainer.AttName.oElement.innerHTML = AttName;
 lastContainer.AttTextArea.oElement.value = AttContent;
 }
 }
 }
 }catch(e){
 throw new Error("editAtt fails: "+e.message);
 }
 }*/
//not used
/*function createAttTextArea(AttName_in,AttContent_in)
 {
 var divContentWidth = getHTMLElementWidth(document.getElementById("divRight"))-12;
 var divContent = document.createElement("div");
 divContent.style.border="1px";
 divContent.style.borderStyle ="solid";
 divContent.style.borderColor ="#CCCCCC";
 divContent.style.width =divContentWidth.toString()+"px";
 divContent.style.margin ="0px 5px 0px 5px";
 divContent.style.padding ="0px 0px 5px 0px";
 divContent.setAttribute("class","attContainer");
 
 var appendDivAttribute= document.getElementById("NodeAtributes").appendChild(divContent);
 
 var spanButtons = document.createElement("span");
 spanButtons.setAttribute("class","floatRight");
 
 var btnDelete = document.createElement("button");
 btnDelete.innerHTML = "Remove";
 btnDelete.onclick = function(){
 var removedChild = appendDivAttribute.parentNode.removeChild(appendDivAttribute);
 var innerHTML = document.getElementById("textAreaContainer").firstChild.value;
 createTextArea();
 document.getElementById("textAreaContainer").firstChild.value = innerHTML;
 };
 
 var appendDelete = spanButtons.appendChild(btnDelete);
 
 var newTXTAreaWidth = getHTMLElementWidth(appendDivAttribute)-12;
 var newTextArea = document.createElement("textarea");
 newTextArea.style.width = newTXTAreaWidth.toString()+"px";
 newTextArea.rows="1";
 newTextArea.value += AttContent_in;
 newTextArea.style.border = "1px solid #707070";
 newTextArea.style.margin ="0px 5px 0 5px";
 
 var spanAttName = document.createElement("span");
 spanAttName.innerHTML = AttName_in;
 spanAttName.setAttribute("class","floatLeft");
 spanAttName.style.margin ="0px 5px 0px 5px";
 //spanAttName.style.float="left";
 
 var addedAttName = appendDivAttribute.appendChild(spanAttName);
 var addedButtons = appendDivAttribute.appendChild(spanButtons);
 var addedTextArea = appendDivAttribute.appendChild(newTextArea);
 }*/
//not used
/*function getTextAreaHeight()
 {
 try
 {
 var oRight = document.getElementById("divRight");
 var oRefSelNode = document.getElementById("refSelNode");
 var oAttArea = document.getElementById("attArea");
 var factor1 = getHTMLElementHeight(oRight);
 var factor2= getHTMLElementHeight(oRefSelNode);
 var factor3 = getHTMLElementHeight(oAttArea);
 var nOutputHeight =factor1-factor2-factor3;
 return nOutputHeight;
 }catch(e){
 throw new Error("getTextAreaHeight fails: "+e.message);
 }
 }*/
//not used
/*function getTextAreaWidth()
 {
 try
 {
 var oRight = document.getElementById("divRight");
 var factor1 = getHTMLElementWidth(oRight);
 return factor1;
 }catch(e){
 throw new Error("getTextAreaWidth fails: "+e.message);
 }
 }*/
/*
 function addAttribute()
 {
 try
 {
 var innerHTML = '<form id="formAddAttribute">'+
 '<div class="viewNodeName">'+
 '<div class="nodeLegend">Add New Attribute</div>'+
 '<input type="text" name ="NodeName" value=""/>'+
 '</div>'+
 '</form>';
 //var dialog = new dialogWindow(true,innerHTML,320,105,true,"");
 var top =bodyWidth/2;
 var left = bodyHeight/2;
 var dialog = new floatWindow(null,top,left,320,105);
 dialog.draw(innerHTML,null,true,true);
 dialog.doAction= function()
 {
 try
 {
 var oInput = this.getElementsByTagName('input')[0];
 if (oInput.value)
 {
 oEditorContainer.nodeEditor.addAttribute(oInput.value, "");
 //oNodeAttributes.addContainer();
 }
 }catch(e){
 window.alert("treeli.js::addAttribute()::dialog.windowContent.doAction fails. Error:"+e.message);
 }
 };
 }catch(e){
 throw new Error("treeli.js::addAttribute() fails: "+e.message);
 }
 }*/
/*function HighLightTreeFromDomElement(nodeIn)
 {
 var nodeIndex = getIndexFromNode(nodeIn);
 
 }*/
/*function getIndexFromNode(nodeIn,strIndex)
 {
 
 }*/
