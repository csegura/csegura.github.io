+++
title = 'XSL Namespaces'
date = 2005-11-29T00:00:00+01:00
tags = ['sharepoint', 'xlst']
+++

With csegRollUp v3 you can use both namespaces in the xml stylesheet.

This example use msxsl namespace with a c# script function to transform a date in a month name:


```xml
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
     xmlns:msxsl="urn:schemas-microsoft-com:xslt"
     xmlns:utils="urn:script-items">
 
<msxsl:script language="C#" implements-prefix="utils">
     <![CDATA[
     public string GetMonth(string sDate)
     {      
        if (sDate.Length > 0)
            {
           string[] monthNames = {null , "January" , "February" , "March" , "April", "May",
                      "June", "July", "August", "September", "October",
                      "November", "December"};
 
           DateTime d = DateTime.Parse(sDate);
           return monthNames[d.Month];
        }
        else 
            return "(Empty)";
     }
     ]]>
</msxsl:script>
 
<xsl:output method="html" encoding="utf-8" />
 
<xsl:template match="/Rows/Row">
    <li/><b><xsl:value-of select="Title" /></b> – <xsl:value-of select="utils:GetMonth(Fecha)" /><br/>
</xsl:template>
 
</xsl:stylesheet> 
```

Link with more info XSLT Stylesheet Scripting using <msxsl:script>


This example use exslt distinct function to show only rows with distinct values

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:set="http://exslt.org/sets" exclude-result-prefixes="set">
    <xsl:output method="html" encoding="utf-8" />
    <xsl:template match="/">
         <xsl:for-each select="set:distinct(Row/Estado)">
            <xsl:value-of select="." /><br/>   
         </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
```

You can find more information about exslt in exslt.org and Mvp-xml