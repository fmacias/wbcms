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

try
{
    function XMLHttpHeader(name_in, value_in)
    {
        this.name = name_in;
        this.value = value_in;
    }
    var textXmlHeader = {name: "Content-type", value: "text/xml"};
    var textHTMLHeader = {name: "Content-type", value: "text/html"};
    var textPlain = {name: "Content-type", value: "text/plain"};
    var XMLCharSetUTF8 = {name: "charset", value: "UTF-8"};
    var XMLCharSetISO88591 = {name: "charset", value: "ISO-8859-1"};
    var formHeader = {name: "Content-type", value: "application/x-www-form-urlencoded"};
    var ConnectionHeader = {name: "Connection", value: "close"};
    var noCache = {name: "Cache-Control", value: "no-cache, must-revalidate"};
//var noCache = {name:"Cache-Control",value:"no-cache"};
    var pragmaNoCache = {name: "Pragma", value: "no-cache"};

    var defaultResponse;
    function AJAXResponse()
    {
        this.reply =
                {
                    XML: null,
                    Text: null,
                    InfoContainer: null,
                    onReply: function() {
                    }//polimorphic function to define on the instance of this class.
                };
        /*this.XML = new Object();
         this.Text = new String();
         this.InfoContainer = null;*/
        this.replySetXML = function(XMLDomIn)
        {
            try
            {
                this.reply.XML = XMLDomIn;
            } catch (e) {
                throw new Error("\nAJAXResponse.setXML fails. Error " + e.message);
            }
        },
                this.replySetText = function(TextIn)
        {
            try {
                this.reply.Text = TextIn;
            } catch (e) {
                throw new Error("\nAJAXResponse.setText fails. Error " + e.message);
            }
        },
                this.replyOnUnset = function()
        {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Request State: Unset<br />";
            } catch (e) {
                throw new Error("\nAJAXResponse.onUnset fails. Error " + e.message);
            }
        };
        this.replyOnOpened = function() {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Request State: Opened<br />";
            } catch (e) {
                throw new Error("\nAJAXResponse.onOpened fails. Error " + e.message);
            }
        };
        this.replyOnHeadersRecived = function()
        {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Request State: Headers Recived<br />";
            } catch (e) {
                throw new Error("\nAJAXResponse.onHeadersRecived fails. Error " + e.message);
            }
        };
        this.replyOnLoading = function() {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Request State: on Loading<br />";
            } catch (e) {
                throw new Error("\nAJAXResponse.onHeadersRecived fails. Error " + e.message);
            }
        };
        this.replyOnDone = function() {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Request State: Request Finisched<br />";
                this.replyUnsetInfoContainer();
            } catch (e) {
                throw new Error("\nAJAXResponse.onDone fails. Error " + e.message);
            }
        };
        this.replySetStatus = function(sStatus) {
            try
            {
                this.replySetInfoContainer();
                this.reply.InfoContainer.innerHTML += "Requested File: " + this.FileName + ", Method: " + this.Method + ", Data:" + this.Data + ", Status:" + sStatus;
                this.replyUnsetInfoContainer();
            } catch (e) {
                throw new Error("\nAJAXResponse.setStatus fails. Error " + e.message);
            }
        };
        this.replySetInfoContainer = function()
        {
            try
            {
                if (this.reply.InfoContainer == null)
                {
                    var infoContainer = createHTMLElement("div", null, null, null, "onInteractive", "position:absolute;bottom:0;background:white;border:1px solid black;width:99%;z-index:99;height:200px;overflow:scroll", null);
                    this.reply.InfoContainer = document.body.appendChild(infoContainer);
                }
            } catch (e) {
                throw new Error("\nAJAXResponse.replySetInfoContainer fails. Error " + e.message);
            }
        };
        this.replyUnsetInfoContainer = function()
        {
            try
            {
                if (this.reply.InfoContainer)
                {
                    var removedElement = document.body.removeChild(this.reply.InfoContainer);
                    this.reply.InfoContainer = null;
                }
            } catch (e) {
                throw new Error("\nAJAXResponse.replyUnsetInfoContainer fails. Error " + e.message);
            }
        };
    }
//AJAXResponse.prototype.onReply = function(){};//polimorfic function which behavior depends of the instance
//
    function AJAXTransport(bAsync)
    {
        this.contructor = function(bAsync)
        {
            try
            {
                this.FileName = "";
                this.XMLHttpRequest = getXMLHttpRequest();
                this.Method = "GET";
                this.Data = null;
                this.requestHeaders = new Array();
                this.Async = true;
                if (bAsync != undefined)
                {
                    if (bAsync == true)
                    {
                        this.Async = true;
                    } else {
                        this.Async = false;
                    }
                }
            } catch (e) {
                throw new Error("\nAJAXTransport.contructor fails. Error " + e.message);
            }
        };
        this.setDefault = function()
        {
            try
            {
                this.FileName = "";
                this.XMLHttpRequest = null;
                this.Method = "GET";
                this.Data = null;
                this.requestHeaders = new Array();
                this.Async = true;
            } catch (e) {
                throw new Error("\nAJAXTransport.setDefault fails. Error " + e.message);
            }
        };
        this.AJAXSend = function(sFileNameIn)//rename to send
        {
            try
            {
                this.FileName = sFileNameIn;
                //this.XMLHttpRequest.onreadystatechange = this.handler;
                var oSelf = this;
                this.XMLHttpRequest.onreadystatechange = function()
                {
                    try
                    {
                        oSelf.handler();
                    } catch (e) {
                        window.alert("\nAJAXTransport.AJAXSend.XMLHttpRequest.onreadystatechange() fails. Error " + e.message);
                    }
                };
//at today is not standard
//				if (this.XMLHttpRequest.overrideMimeType)
//				{
//					this.overrideMimeType('text/html');
//					this.overrideMimeType('text/xml');
//				}
                this.XMLHttpRequest.open(this.Method, this.FileName, this.Async);
                for (var x = 0; x < this.requestHeaders.length; x++)
                {
                    var headerName = this.requestHeaders[x].name;
                    var headerValue = this.requestHeaders[x].value;
                    this.XMLHttpRequest.setRequestHeader(headerName, headerValue);
                }
                this.XMLHttpRequest.send(this.Data);
            } catch (error)
            {
                this.replyUnsetInfoContainer();
                window.alert("\nAJAXTransport.AJAXSend fails. Error " + error.message);
            }
        };
        this.handler = function()
        {
            try
            {
                var bDone = false;
                var XMLHttp = this.XMLHttpRequest;
                switch (XMLHttp.readyState)
                {
                    case 0://unset
                        this.replyOnUnset();
                        //XMLHttp.reply.onUnset();
                        break;
                    case 1://opened
                        this.replyOnOpened();
                        //XMLHttp.reply.onOpened();
                        break;
                    case 2://headers recived
                        this.replyOnHeadersRecived();
                        //XMLHttp.reply.onHeadersRecived();
                        break;
                    case 3://loading
                        this.replyOnLoading();
                        //XMLHttp.reply.onLoading();
                        break;
                    case 4://done
                        //this.reply.onInteractive();
                        this.replyOnDone();
                        //XMLHttp.reply.onDone();
                        if (XMLHttp.status == 200)
                        {
                            // so far so good
                            if (XMLHttp.responseXML != null)
                            {
                                bDone = true;
                                var XMLOk = true;
                                if (XMLHttp.responseXML.childNodes.length == 0)//Valid for IExplorer
                                {
                                    XMLOk = false;
                                } else if (XMLHttp.responseXML.documentElement)//Firefox
                                {
                                    if (XMLHttp.responseXML.documentElement.nodeName.toUpperCase() == "PARSERERROR")//Firefox
                                    {
                                        XMLOk = false;
                                    }
                                }
                                if (XMLOk)
                                {
                                    this.replySetXML(XMLHttp.responseXML);
                                    //XMLHttp.reply.setXML(XMLHttp.responseXML);
                                }
                            }
                            if (XMLHttp.responseText != null)
                            {
                                bDone = true;
                                this.replySetText(XMLHttp.responseText);
                                //XMLHttp.reply.setText(XMLHttp.responseText);
                            }
                            if (bDone)
                            {
                                this.reply.onReply();
                                //XMLHttp.reply.onReply();	
                            }
                            this.setDefault();
                            this.replyUnsetInfoContainer();
                        } else {
                            //// fetched the wrong page or network error...
                            throw new Error("\nAJAXTransport.handler(): status =" + XMLHttp.status + ", Description: " + XMLHttp.responseText);
                            //this.replySetStatus(XMLHttp.status);
                            //throw new Error("Fetched the wrong page or network error. Status: "+XMLHttp.status);
                        }
                        break;
                    default:
                        this.replyOnDone();
                        //XMLHttp.reply.onDone();
                        break;
                }
            } catch (e)
            {
                this.replyOnDone();
                throw new Error("\nAJAXTransport.handler fails. Error " + e.message + ", Requested File: " + this.FileName + ", Async: " + this.Async + ", Data:" + this.Data);
            }
        };
        this.request = function(sFileNameIn, aHeaders)//Get either  a DOMDocument, text or both. requests by default, it mean the reply will contain either a text/xml or text, deppending of the response of the server.
        {
            try
            {
                if (aHeaders == undefined)
                {
                    aHeaders = new Array();
                }
                if (aHeaders.length == 0)
                {
                    aHeaders.push(textXmlHeader);
                    aHeaders.push(XMLCharSetUTF8);
                }
                if (aHeaders)
                {
                    for (var x = 0; x < aHeaders.length; x++)
                    {
                        this.requestHeaders.push(aHeaders[x]);
                    }
                }
                this.doRequest(sFileNameIn);
            } catch (e)
            {
                throw new Error("\nAJAXTransport.request fails. Error " + e.message);
            }
        };
        this.requestSendDOM = function(XMLDOMDocumentIn, sFileNameIn, aHeadersIn)
        {
            try
            {
                this.Data = XMLDOMDocumentIn;
                this.Method = "POST";
                if (aHeadersIn)
                {
                    for (var x = 0; x < aHeadersIn.length; x++)
                    {
                        this.requestHeaders.push(aHeadersIn[x]);
                    }
                }
                this.doRequest(sFileNameIn);
            } catch (e)
            {
                throw new Error("\nAJAXTransport.requestSendDOM fails. Error " + e.message);
            }
        };
        this.requestSendForm = function(paramList, sFileNameIn, aHeadersIn)
        {
            try
            {
                this.Data = paramList;
                this.Method = "POST";
                this.requestHeaders.push(formHeader);
                if (aHeadersIn)
                {
                    for (var x = 0; x < aHeadersIn.length; x++)
                    {
                        this.requestHeaders.push(aHeadersIn[x]);
                    }
                }
                this.doRequest(sFileNameIn);
            } catch (e)
            {
                throw new Error("\nAJAXTransport.requestSendForm fails. Error " + e.message);
            }
        };
        this.doRequest = function(sFileNameIn)
        {
            try
            {
                this.AJAXSend(sFileNameIn);
            } catch (e)
            {
                throw new Error("doRequest fails:  ERror: " + e.message);
                //this.setDefault();
            }
        };
        this.FileName = new String();
        this.XMLHttpRequest = null;
        this.Method = "GET";//GET, POST, ....
        this.Data = null; //Variant value, either null, or DOMDocument, or string
        this.requestHeaders = new Array();
        this.Async = true;
        try
        {
            this.contructor(bAsync);
        } catch (e)
        {
            this.setDefault();
            window.alert("WAjax2.js. AJAXTransport could not be initialized: Error: " + e.message);
        }
    }
    AJAXTransport.prototype = new AJAXResponse();

    function getXMLHttpRequest()
    {
        try
        {
            var xmlHttp = null;
            if (window.XMLHttpRequest)
            {
                xmlHttp = new window.XMLHttpRequest;
                return xmlHttp;
            } else
            {
                try
                {
                    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    return xmlHttp;
                } catch (ex)
                {
                    throw new Error("\ngetXMLHttpRequest fails. You internet Explorer does not suppor the ActiveXObject [MSXML2.XMLHTTP.3.0] or Active X Objects are disabled in your browser!");
                }
            }
        } catch (e) {
            throw new Error("\nWAjax2.js getXMLHttpRequest fails: Message: " + e.message);
        }
    }
} catch (error) {
    window.alert(error.message);
}
