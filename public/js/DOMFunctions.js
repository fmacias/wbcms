//The behavior of the DOMNode and these Attributes may differ from one User-Agent to another, so that the Method
//node.appendChild() does funny things in the user-agents which it belongs to, and also the behavior is different.
//Because of that, I create the Nodes for my own according a given XMLNode from a text/xml DOMDocument to solve this problem. 
//meaning: on geting the xml file with XMLHttpRequest I have to set the mime type to text/xml, otherwhise Firefox
//the object XMLHttpRequest respond only with the Text of the XML, but not the DOM, also the behavior of Explorer
//is not ok, for that reason I create a new DOMHtmlElement for each DOMXMLElement I want to use with appendChild.
try
{
    document.DOMLoaded = function() {
    };
    function CreateDOMElements(Node_in, NodeToAdd, DOMDocument)
    {
        try
        {
            var NewNode;
            if (Node_in.nodeType)
            {
                var args = CreateDOMElements.arguments;
                //is one Element
                if (Node_in.nodeType == 1)
                {
                    //Get create a node with the given name nodeName 
                    NewNode = DOMDocument.createElement(Node_in.nodeName);
                    //create its attributes
                    var CurrentAttributes = Node_in.attributes;
                    if (CurrentAttributes.length > 0)
                    {
                        for (var k = 0; k < Node_in.attributes.length; k++)
                        {
                            var CurrentAttr = Node_in.attributes[k];
                            var SelfElement = CreateDOMElements(CurrentAttr, NewNode, DOMDocument);
                        }
                    }
                    if ((args[1] == undefined) || (args[1] == null))
                    {
                        var NodeToAdd = NewNode;
                    } else
                    {
                        NodeToAdd = AppendChild(NodeToAdd, NewNode);
                    }
                    var LastNode = NodeToAdd;
                    if (NodeToAdd.childNodes.length > 0)
                    {
                        var LastNodeIndex = NodeToAdd.childNodes.length - 1;
                        LastNode = NodeToAdd.childNodes[LastNodeIndex];
                    }
                    for (var x = 0; x < Node_in.childNodes.length; x++)
                    {
                        NodeToAdd = CreateDOMElements(Node_in.childNodes[x], LastNode, DOMDocument);
                        NodeToAdd = LastNode;
                    }
                    /*if ((Node_in.childNodes.length==0)&&(Node_in.nodeName.toUpperCase()=="SCRIPT"))
                     {
                     //the script element of a XML Shema text/html must alway be close
                     //with the End-Target Element, it means </script>. in that case
                     //i set the Element with a blank.
                     var oBlank = DOMDocument.createTextNode(" ");
                     NodeToAdd = CreateDOMElements(oBlank,LastNode,DOMDocument);
                     NodeToAdd = LastNode;
                     }*/
                } else if (Node_in.nodeType == 2)//Attribute
                {
                    //	window.alert("add ATtribute:"+Node_in.nodeName);
                    var attribute = DOMDocument.createAttribute(Node_in.nodeName);
                    attribute.value = Node_in.nodeValue;
                    if (NodeToAdd == null)
                    {
                        return attribute;
                    } else {
                        NodeToAdd = AppendChild(NodeToAdd, attribute);

                        if ((NodeToAdd.getAttribute(Node_in.nodeName) == null) || (NodeToAdd.getAttribute(Node_in.nodeName) == "")) {
                            NodeToAdd.setAttribute(Node_in.nodeName, " ");
                        }
                    }
                } else if (Node_in.nodeType == 3)//Text node
                {
                    var TextNode = DOMDocument.createTextNode(Node_in.nodeValue);
                    if (NodeToAdd == null)
                    {
                        return TextNode;
                    } else {
                        NodeToAdd = AppendChild(NodeToAdd, TextNode);
                    }
                } else if (Node_in.nodeType == 8)//Comment Node
                {
                    var commentNode = document.createComment(Node_in.nodeValue);
                    if (NodeToAdd == null)
                    {
                        return commentNode;
                    }
                    NodeToAdd = AppendChild(NodeToAdd, commentNode);
                } else if (Node_in.nodeType == 4)//CDATA Section
                {
                    try {
                        var CDATASection = DOMDocument.createCDATASection(Node_in.nodeValue);
                        NodeToAdd = AppendChild(NodeToAdd, CDATASection);
                    } catch (e) {
                        var TextNode = DOMDocument.createTextNode("<![CDATA[" + Node_in.nodeValue + "]]>");
                        if (NodeToAdd == null)
                        {
                            return TextNode;
                        } else {
                            NodeToAdd = AppendChild(NodeToAdd, TextNode);
                        }
                    }
                }
            }
            if (NodeToAdd)
            {
                return NodeToAdd;
            } else {
                return false;
            }
        } catch (e)
        {
            throw new Error("\nCreateDOMElements; Error name: " + e.message);
        }
    }
    function DOMElementToString(Node_in, mimeType, bInnerContent, tabs)
    {
        //fileExtion html or xml
        try
        {
            if (Node_in.nodeType)
            {
                var args = DOMElementToString.arguments;
                if ((args[2] == undefined) || (args[2] == null))
                {
                    var bInnerContent = false;
                }
                if ((args[3] == undefined) || (args[3] == null))
                {
                    tabs = "";
                } else {
                    tabs += "\t";
                }
                if (Node_in.nodeType == 1)//is one Element
                {
                    var nodeName = Node_in.nodeName;
                    //innerString +="<"+nodeName;
                    var CurrentAttributes = Node_in.attributes;
                    var sNodeAttributes = "";
                    if (CurrentAttributes.length > 0)
                    {
                        for (var k = 0; k < Node_in.attributes.length; k++)
                        {
                            var CurrentAttr = Node_in.attributes[k];
                            var currentAttString = DOMElementToString(CurrentAttr, mimeType, false, tabs);//return
                            sNodeAttributes += currentAttString;
                        }
                    }
                    var currentInnerString = "";
                    for (var x = 0; x < Node_in.childNodes.length; x++)
                    {
                        currentInnerString += DOMElementToString(Node_in.childNodes[x], mimeType, false, tabs);
                    }
                    var sOpenNode = "";
                    var sInnerNode = "";
                    var sCloseNode = "";
                    var innerString = "";
                    if (bInnerContent)
                    {
                        if (currentInnerString)
                            sInnerNode = "\n" + currentInnerString + "\n";
                        innerString = sInnerNode;
                    } else
                    {
                        sOpenNode = tabs + "<" + nodeName + sNodeAttributes;
                        if (currentInnerString)
                            sInnerNode = "\n" + currentInnerString + "\n";
                        if (sInnerNode)
                        {
                            sOpenNode += ">";
                            sCloseNode = tabs + "</" + nodeName + ">\n";
                        } else
                        {
                            sInnerNode = "";
                            ///text/html
                            if (mimeType == "text/html")
                            {
                                //if noSGML close with >
                                if (IsSGML(nodeName))
                                {
                                    sCloseNode = ">\n";
                                } else
                                {
                                    //else close with empty tag
                                    sOpenNode += ">";
                                    sCloseNode = "</" + nodeName + ">\n";
                                }
                            } else if (mimeType == "application/xhtml+xml")
                            {
                                if ((nodeName.toUpperCase() == "SCRIPT") || (nodeName.toUpperCase() == "OBJECT") || (nodeName.toUpperCase() == "STYLE") || (nodeName.toUpperCase() == "TITLE"))
                                {
                                    sOpenNode += ">";
                                    sCloseNode = "</" + nodeName + ">\n";
                                } else
                                {
                                    sCloseNode = " />\n";
                                }
                            }
                        }
                    }
                    var innerString = sOpenNode + sInnerNode + sCloseNode;
                    if (innerString == null)
                        innerString = "";
                    return innerString;
                } else if (Node_in.nodeType == 2)//Attribute
                {
                    var currentAttName = Node_in.nodeName;
                    var currentAttValue = Node_in.nodeValue;
                    var AttStrin = ' ' + currentAttName + '="' + currentAttValue + '" ';
                    return AttStrin;
                } else if (Node_in.nodeType == 3)//Text node
                {
                    var currentTextContent = Node_in.nodeValue;
                    var textContent = currentTextContent.rltrimFeedChar();
                    return tabs + textContent;
                } else if (Node_in.nodeType == 8)//Comment Node
                {
                    var currentComment = "<!-- " + Node_in.nodeValue + " -->";
                    return tabs + currentComment;
                } else if (Node_in.nodeType == 4)//CDATA Section
                {
                    var currentCDATA = tabs + "<![CDATA[\n" + tabs + "\t" + Node_in.nodeValue + "\n" + tabs + "]]>";
                    return currentCDATA;
                }
            }
        } catch (e)
        {
            throw new Error("\nDOMFunctions.js -> DOMElementToString; Error: " + e.message);
        }
    }
    function IsSGML(nodeName)
    {
        //area,base,basefont,br,col,frame,hr,img,input,isindex,link,param,html,head,meta,link
        try
        {
            var curNodeName = nodeName.toUpperCase();
            if ((curNodeName == "META") ||
                    (curNodeName == "LINK") ||
                    (curNodeName == "BASE") ||
                    (curNodeName == "ISINDEX") ||
                    (curNodeName == "AREA") ||
                    (curNodeName == "BASEFONT") ||
                    (curNodeName == "BR") ||
                    (curNodeName == "COL") ||
                    (curNodeName == "FRAME") ||
                    (curNodeName == "HR") ||
                    (curNodeName == "IMG") ||
                    (curNodeName == "INPUT") ||
                    (curNodeName == "ISINDEX") ||
                    (curNodeName == "LINK") ||
                    (curNodeName == "PARAM") ||
                    (curNodeName == "META") ||
                    (curNodeName == "LINK"))
            {
                return true;
            }
            /*}
             }*/
            return false;
        } catch (e) {
            throw new Error("DOMFunctions.js ->IsSGML. Error: " + e.message);
        }
    }
    function AppendChild(NodeToAdd, newChild)
    {
        try
        {
            if (NodeToAdd)
            {
                if (newChild.nodeType == 2)//if it is an attribute
                {
                    NodeToAdd.setAttributeNode(newChild);
                } else {
                    NodeToAdd.appendChild(newChild);
                }
                return NodeToAdd;
            } else {
                return false;
            }
        } catch (e)
        {
            throw new ("\nDOMFunctions.js ->AppendChild; Error: " + e.message);
        }
    }
    function removeChilds(CurrentDOMElement)
    {
        try
        {
            for (var x = 0; CurrentDOMElement.childNodes.length; x++)
            {
                var CurrentOldChild = CurrentDOMElement.childNodes[x];
                var removedChild = CurrentDOMElement.removeChild(CurrentOldChild);
                x--;
            }
        } catch (e)
        {
            throw new ("\nDOMFunctions.js ->AppendChild; Error: " + e.message);
        }
    }
    function createHTMLElement(sNodeNameIn, sNodeText, sClassNameIn, sElementId, sInnerHTMLIn, sStyleIn, sAttributesIn, sNodeValue)
    {
        try
        {
            if (sNodeNameIn)
            {
                var currentHTMLElement = document.createElement(sNodeNameIn);

                if (sNodeText)
                {
                    var TextNode = document.createTextNode(sNodeText);
                    AppendChild(currentHTMLElement, TextNode);
                }
                if (sClassNameIn)
                {
                    var sCurrentClass = document.createAttribute("class");
                    sCurrentClass.value = sClassNameIn;
                    AppendChild(currentHTMLElement, sCurrentClass);
                }
                if (sElementId)
                {
                    var sCurrentId = document.createAttribute("id");
                    sCurrentId.value = sElementId;
                    AppendChild(currentHTMLElement, sCurrentId);
                }
                if (sInnerHTMLIn)
                {
                    currentHTMLElement.innerHTML = sInnerHTMLIn;
                }

                if (sStyleIn)
                {
                    var aStyle = sStyleIn.split(";");
                    for (var x = 0; x < aStyle.length; x++)
                    {
                        var aCurrentProperty = aStyle[x].split(":");
                        if (aCurrentProperty[0])
                        {
                            var StylePropName = aCurrentProperty[0];
                            var re = /(\-\w)/g;
                            var matched = StylePropName.match(re);
                            if (matched)
                            {
                                for (var y = 0; y < matched.length; y++)
                                {
                                    //window.alert(StylePropName+" "+matched[y]);
                                    //window.alert(StylePropName+ "->length: "+matched[y].length+" "+matched[y][0]+" "+ matched[y][1]+" "+matched[y]);
                                    var upperChar = matched[y].split("-")[1].toUpperCase();
                                    //window.alert(upperChar);
                                    StylePropName = StylePropName.replace(/-\w/, upperChar);
                                }
                            }
                            if (aCurrentProperty[0])
                            {
                                try
                                {
                                    currentHTMLElement.style[StylePropName] = aCurrentProperty[1];
                                } catch (e) {
                                    throw new Error("Error on setting style property: " + StylePropName);
                                }
                            }
                        }
                    }
                }
                if (sAttributesIn)
                {
                    var aAttributes = sAttributesIn.split(",");
                    for (var x = 0; x < aAttributes.length; x++)
                    {
                        var aCurrentAttribute = aAttributes[x].split("=");
                        currentHTMLElement.setAttribute(aCurrentAttribute[0], aCurrentAttribute[1]);
                    }
                }
                if (sNodeValue)
                {
                    currentHTMLElement.value = sNodeValue;
                }
                return currentHTMLElement;
            } else {
                throw new Error("parameter de entrada sNodeNameIn es obligatorio");
            }
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->createHTMLElement: Error: " + e.message);

        }
    }
    function getMaxWidthOfNodeList(nodeRoot, previousWidth, currentWidth)
    {
        try
        {
            if (previousWidth == undefined)
            {
                var previousWidth = nodeRoot.offsetWidth;
            }
            if (currentWidth == undefined)
            {
                var currentWidth = previousWidth;
            }
            if (previousWidth < currentWidth)
            {
                currentWidth = previousWidth;
            }
            for (var x = 0; x < nodeRoot.childNodes.length; x++)
            {
                if (nodeRoot.childNodes[x].nodeType == 1)
                {
                    getMaxWidthOfNodeList(nodeRoot.childNodes[x], previousWidth, nodeRoot.childNodes[x].offsetWidth);
                }
            }
            return currentWidth;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getMaxWidthOfNodeList: Error: " + e.message);
        }
    }
    function getDOMFromString(sXML_in)
    {
        try
        {
            if (window.DOMParser)
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(sXML_in, "application/xml");
                if (xmlDoc.documentElement.nodeName.toUpperCase() == "PARSERERROR")
                {
                    throw new Error(xmlDoc.documentElement.textContent);
                }
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(sXML_in);//what is it? 
            }
            return xmlDoc;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getDOMFromString: Error: " + e.message);
        }
    }
    function getHTMLElementLeft(thisNode, left)
    {
        try
        {
            if (left == undefined)
            {
                var left = 0;
            }
            if (thisNode.nodeType == 1)
            {
                left += thisNode.offsetLeft;
                if (thisNode.offsetParent)
                        //if (thisNode.parentNode)
                        {
                            left = getHTMLElementLeft(thisNode.offsetParent, left);
                        }
            }
            return left;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getHTMLElementLeft: Error: " + e.message);
        }
    }
    function getHTMLElementTop(thisNode, Top)
    {
        try
        {
            if (Top == undefined)
            {
                var Top = 0;
            }
            if (thisNode.nodeType == 1)
            {
                Top += thisNode.offsetTop;
                //if (thisNode.parentNode)
                if (thisNode.offsetParent)
                {
                    Top = getHTMLElementTop(thisNode.offsetParent, Top);
                }
            }
            return Top;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getHTMLElementTop: Error: " + e.message);
        }
    }
    function getHTMLElementWidth(thisNode, Width)
    {
        try
        {
            if (Width == undefined)
            {
                var Width = 0;
            }
            if (thisNode.nodeType == 1)
            {
                Width += thisNode.offsetWidth;

            }
            return Width;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getHTMLElementTop: Error: " + e.message);
        }
    }
    function getHTMLElementHeight(thisNode, Height)
    {
        try
        {
            if (Height == undefined)
            {
                var Height = 0;
            }
            if (thisNode.nodeType == 1)
            {
                Height += thisNode.offsetHeight;

            }
            return Height;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getHTMLElementHeight: Error: " + e.message);
        }
    }
    /**
     * rename to on windowLoaded: at this point of view its posible to access to 
     * the script element belong to the window object but not to the element 
     * related with the body.
     * @returns {undefined}
     */
    function onDOMLoaded()
    {
        document.DOMLoaded();
    }
    if (window.addEventListener)
    {
        window.addEventListener("load", onDOMLoaded, false);
    } else if (window.attachEvent)
    {
        window.attachEvent("onload", onDOMLoaded);
    }
    function getEmptyXMLDOM()
    {
        try
        {
            var DOMDocument;
            if (document.implementation.createDocument)
            {
                DOMDocument = document.implementation.createDocument('', '', null);
            } else
            { //IE
                var DOMDocument = IEDomDocument();
            }
            return DOMDocument;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->getEmptyXMLDOM: Error: " + e.message);
        }
    }
    /**
     * 
     * @param {type} txt
     * @returns {ActiveXObject}
     */
    function loadXMLString(txt)
    {
        try
        {
            if (window.DOMParser)
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(txt);
            }
            return xmlDoc;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->loadXMLString: Error: " + e.message);
        }
    }
    function IEDomDocument()
    {
        try {
            var progIDs = ['Mxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.5.0', 'Msxml2.DOMDocument.4.0', 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument', 'Microsoft.XMLDOM'];
            for (var i = 0; i < progIDs.length; i++) {
                try {
                    var xmlDOM = new ActiveXObject(progIDs[i]);
                    xmlDOM.async = false;
                    xmlDOM.validateOnParse = false;
                    xmlDOM.resolveExternals = false;
                    return xmlDOM;
                }
                catch (ex) {
                    if (i >= progIDs.length)
                    {
                        throw new Error("Function: IEDomDocument. DOM Not supported!");
                    }
                }
            }
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->IEDomDocument: Error: " + e.message);
        }
    }
    function isChildOfBody(selfNode, HTMLDOMDocument)
    {
        try
        {
            var nodeName = (selfNode.nodeName) ? selfNode.nodeName : "";
            var bIsChild = false;
            if (selfNode.parentNode == null)
            {
                bIsChild = false;
            } else
            {
                if (nodeName.toUpperCase() == "BODY")
                {
                    bIsChild = true;
                } else {
                    bIsChild = isChildOfBody(selfNode.parentNode);
                }
            }
            return bIsChild;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isChildOfBody: Error: " + e.message);
        }
    }
    function isChildOfHead(selfNode, HTMLDOMDocument)
    {
        try
        {
            var nodeName = (selfNode.nodeName) ? selfNode.nodeName : "";
            var bIsChild = false;
            if (selfNode.parentNode == null)
            {
                bIsChild = false;
            } else
            {
                if (nodeName.toUpperCase() == "HEAD")
                {
                    bIsChild = true;
                } else
                {
                    bIsChild = isChildOfHead(selfNode.parentNode);
                }
            }
            return bIsChild;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isChildOfBody: Error: " + e.message);
        }
    }
    function isDocumentElement(selfNode, HTMLDOMDocument)
    {
        try
        {
            if ((selfNode.nodeName == HTMLDOMDocument.documentElement.nodeName) &&
                    (selfNode.nodeValue == HTMLDOMDocument.documentElement.nodeValue) &&
                    (selfNode.nodeType == HTMLDOMDocument.documentElement.nodeType) &&
                    (selfNode.childNodes.length == HTMLDOMDocument.documentElement.childNodes.length))
            {
                return true;
            } else {
                return false;
            }
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isDocumentElement: Error: " + e.message);
        }
    }
    function isChildOfDocumentElement(selfNode, HTMLDOMDocument)
    {
        try
        {
            if (selfNode.parentNode == null)
            {
                return false;
            }
            if (isDocumentElement(selfNode.parentNode, HTMLDOMDocument))
            {
                return true;
            }
            return false;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isChildOfDocumentElement: Error: " + e.message);
        }
    }
    function fireEvent(element, event)
    {
        try
        {
            if (document.createEventObject) {
                // dispatch for IE
                var evt = document.createEventObject();
                return element.fireEvent('on' + event, evt);
            }
            else {
                // dispatch for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true); // event type,bubbling,cancelable
                return !element.dispatchEvent(evt);
            }
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->fireEvent: Error: " + e.message);
        }
    }
    function DOMElementToSend(Node_in, mimeType, bInnerContent, tabs)
    {
        try
        {
            if (Node_in.nodeType)
            {
                var args = DOMElementToSend.arguments;
                if ((args[2] == undefined) || (args[2] == null))
                {
                    var bInnerContent = false;
                }
                if ((args[3] == undefined) || (args[3] == null))
                {
                    tabs = "";
                } else {
                    tabs += "\t";
                }
                if (Node_in.nodeType == 1)//is one Element
                {
                    var nodeName = Node_in.nodeName;
                    //innerString +="<"+nodeName;
                    var CurrentAttributes = Node_in.attributes;
                    var sNodeAttributes = "";
                    if (CurrentAttributes.length > 0)
                    {
                        for (var k = 0; k < Node_in.attributes.length; k++)
                        {
                            var CurrentAttr = Node_in.attributes[k];
                            var currentAttString = DOMElementToSend(CurrentAttr, mimeType, false, tabs);//return
                            sNodeAttributes += currentAttString;
                        }
                    }
                    var currentInnerString = "";
                    for (var x = 0; x < Node_in.childNodes.length; x++)
                    {
                        currentInnerString += DOMElementToSend(Node_in.childNodes[x], mimeType, false, tabs);
                    }
                    var sOpenNode = null;
                    var sInnerNode = null;
                    var sCloseNode = null;
                    var innerString = "";
                    if (bInnerContent)
                    {
                        if (currentInnerString)
                            sInnerNode = "\n" + currentInnerString + "\n";
                        innerString = sInnerNode;
                    } else
                    {
                        sOpenNode = tabs + "<" + nodeName + sNodeAttributes;
                        if (currentInnerString)
                            sInnerNode = "\n" + currentInnerString + "\n";
                        if (sInnerNode)
                        {
                            sOpenNode += ">";
                            sCloseNode = tabs + "</" + nodeName + ">\n";
                        } else
                        {
                            sInnerNode = "";
                            if (
                                    (
                                            (nodeName.toUpperCase() == "SCRIPT") ||
                                            (nodeName.toUpperCase() == "OBJECT") ||
                                            (nodeName.toUpperCase() == "STYLE") ||
                                            (nodeName.toUpperCase() == "TITLE")
                                            ) &&
                                    (
                                            (mimeType == "text/html") || (mimeType == "application/xhtml+xml")
                                            )
                                    )
                            {
                                sOpenNode += ">";
                                sCloseNode = "</" + nodeName + ">\n";
                            }
                            else if (mimeType == "text/html")
                            {
                                if (IsSGML(nodeName, Node_in))
                                {
                                    sCloseNode = ">\n";
                                } else
                                {
                                    sCloseNode = " />\n";
                                }
                            } else if (mimeType == "application/xhtml+xml")
                            {
                                sCloseNode = " />\n";
                            }
                        }
                        var innerString = sOpenNode + sInnerNode + sCloseNode;
                    }
                    if (innerString == null)
                        innerString = "";
                    return innerString;
                } else if (Node_in.nodeType == 2)//Attribute
                {
                    var currentAttName = Node_in.nodeName;
                    var currentAttValue = Node_in.nodeValue;
                    var AttStrin = ' ' + currentAttName + '=' + currentAttValue + ' ';
                    return AttStrin;
                } else if (Node_in.nodeType == 3)//Text node
                {
                    var currentTextContent = Node_in.nodeValue;
                    var textContent = currentTextContent;
                    return tabs + textContent;
                } else if (Node_in.nodeType == 8)//Comment Node
                {
                    var currentComment = "<!-- " + Node_in.nodeValue + " -->";
                    return tabs + currentComment;
                } else if (Node_in.nodeType == 4)//CDATA Section
                {
                    var currentCDATA = tabs + "<![CDATA[\n" + tabs + "\t" + Node_in.nodeValue + "\n" + tabs + "]]>";
                    return currentCDATA;
                }
            }
        } catch (e)
        {
            throw new Error("\nDOMFunctions.js -> DOMElementToString; Error: " + e.message);
        }
    }
    function getHTMLTextNodesString(HTMLElement)
    {
        try
        {
            var textString = "";
            for (var x = 0; x < HTMLElement.childNodes.length; x++)
            {
                var curNode = HTMLElement.childNodes[x];
                if (curNode.nodeType == 3)
                {
                    textString += curNode.nodeValue;
                }
            }
            return textString;
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isChildOfBody: Error: " + e.message);
        }
    }
    function remplaceNodeText(HTMLElement__, textString, DOMDoc)
    {
        try
        {
            for (var x = 0; x < HTMLElement__.childNodes.length; x++)
            {
                var curNode = HTMLElement__.childNodes[x];
                if (curNode.nodeType == 3)
                {
                    HTMLElement__.removeChild(curNode);
                }
            }
            var TextNode = DOMDoc.createTextNode(textString);
            var appendedChild = HTMLElement__.appendChild(TextNode);
        } catch (e)
        {
            throw new Error("\ngDOMFunctions.js->isChildOfBody: Error: " + e.message);
        }
    }
} catch (e) {
    window.alert("DOM Functions:" + e.message)
}
function HTMLSelectAddLast(oHTMLSelectElement, oHTMLOptionElement)
{
    try
    {
        try
        {
            oHTMLSelectElement.add(oHTMLOptionElement, null);
        } catch (e)
        {
            oHTMLSelectElement.add(oHTMLOptionElement);
        }
    } catch (e)
    {
        throw new Error("DOMFunctions.js-> htmlSelectAddLast fails: Error: " + e.message);
    }
}