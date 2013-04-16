<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output
  method = "html" 
  doctype-public = "-//W3C//DTD HTML 4.01 Transitional//EN"
  doctype-system = "http://www.w3.org/TR/html4/loose.dtd" 
/>
<xsl:template match="/">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
<title>Untitled Document</title>
<style type="text/css">
	<![CDATA[
	li{
		list-style-position: outside;
		list-style-type: none;
		display: list-item;
	}
	span{
		font-weight:bold;
	}
	.nodeName{
		color:#CC0099;
	}
	.attValue{
		color:#0000FF;
	}
	a:hover{
	cursor:pointer; 
	cursor:hand;
	}
	.processingIntruction{
		color:#0066CC;
	}
	.comment{
		color:#686868;
	}
	]]>
</style>
<script type = "text/javascript">
<![CDATA[
	function expandElement(oSelf)
	{
		var currentElement = oSelf.parentNode;
		var texto = oSelf.innerHTML;
		if (texto=="+")
		{
			showChilds(currentElement);
			oSelf.innerHTML="-";
		}else{
			hideChilds(currentElement);
			oSelf.innerHTML="+";
		} 
	}
	function showChilds(element)
	{
		for (var x=0;x<element.childNodes.length;x++)
		{
			var currentElement = element.childNodes[x];
			//alert(currentElement.nodeName);
			if(currentElement.nodeName.toUpperCase()=="UL") currentElement.style.display = "block";
		}
	}
	function hideChilds(element)
	{
		for (var x=0;x<element.childNodes.length;x++)
		{
			var currentElement = element.childNodes[x];
			if(currentElement.nodeName.toUpperCase()=="UL") currentElement.style.display = "none";
		}
	}
]]>
</script>
</head>
<body>
		<xsl:apply-templates/>
</body>
</html>
</xsl:template>

<xsl:template match="node()">
		<xsl:variable name="content"><xsl:value-of select="translate(text(),' &#10;&#13;&#9;', '')"/></xsl:variable>
		<ul class="wbcmsXMLNode">
			<xsl:if test="$content=''"><a style="font-weight:bold;font-size:110%" onclick = "expandElement(this)">-</a></xsl:if>
			<xsl:text disable-output-escaping = "no">&lt;</xsl:text><span class="nodeName"><xsl:value-of select="name()" /></span>
			
			<xsl:variable name="parentChildNodes" select="../namespace::node()"/>
			
			<xsl:for-each select="namespace::node()">
				<xsl:variable name="currentURI" select="." />
				<xsl:variable name="currentQName" select="name()" />
				<xsl:if test='$currentURI != "http://www.w3.org/XML/1998/namespace"'>
					<xsl:variable name="parentNameSpace"><xsl:for-each select="$parentChildNodes"><xsl:if test='name() = $currentQName'>exist</xsl:if></xsl:for-each></xsl:variable>
					<!-- xsl:value-of select="$parentNameSpace" /-->
					<xsl:if test="$parentNameSpace!='exist'">
						<xsl:text disable-output-escaping = "no"> </xsl:text><span class="attName">
						<xsl:if test='name() = ""'>
							xmlsn
						</xsl:if>
						<xsl:if test='name() != ""'>
							xmlns:<xsl:value-of select="$currentQName" />
						</xsl:if>		
						</span>="<span class="attValue"><xsl:value-of select="." /></span>"
					</xsl:if>		
				</xsl:if>		
			</xsl:for-each>
			<xsl:apply-templates select="@*"/><xsl:text disable-output-escaping = "no">&gt;</xsl:text>
			<xsl:apply-templates/>
			<xsl:text disable-output-escaping = "no">&lt;</xsl:text><span class="nodeName"><xsl:value-of select="name()" /></span><xsl:text disable-output-escaping = "no">/&gt;</xsl:text>
		</ul>
</xsl:template>
<xsl:template match="@*">
	 <xsl:text disable-output-escaping = "no"> </xsl:text><span class="attName"><xsl:value-of select="name()" /></span>="<span class="attValue"><xsl:value-of select="." /></span>"
</xsl:template>
<xsl:template match="text()">
	<xsl:value-of select="normalize-space()" />
</xsl:template>
<xsl:template match="comment()">
	<ul class="comment">
		<xsl:text disable-output-escaping = "no">&lt;!-- </xsl:text>
		<xsl:value-of select="normalize-space()" />
		<xsl:text disable-output-escaping = "no"> --&gt;</xsl:text>
	</ul>
</xsl:template>
<xsl:template match="processing-instruction()">
	<ul class="processingIntruction">
	<xsl:text disable-output-escaping = "no">&lt;? </xsl:text>
	<xsl:value-of select="name()" />
	<xsl:value-of select="normalize-space()" />
	<xsl:text disable-output-escaping = "no"> &gt;</xsl:text>
	</ul>
</xsl:template>
<!-- xsl:variable name="targetNamespace" select="xsd:schema/@targetNamespace"/>
<xsl:for-each select="../../node()"><xsl:value-of select="name()"/></xsl:for-each>
<xsl:variable name="targetPrefix">
<xsl:for-each select="xsd:schema">
<xsl:for-each select="namespace::node()">
<xsl:if test=". = $targetNamespace">
<xsl:value-of select="name()"/>
</xsl:if>
</xsl:for-each>
</xsl:for-each>
</xsl:variable-->
</xsl:stylesheet>