+++
title = 'csegPSSearch webpart'
date = 2005-05-09T00:00:00+01:00
tags = ['sharepoint', 'webpart']
draft = false
+++

## Sharepoint – csegPSSearch webpart


csegPSSearch is a webpart to include custom web sharepoint queries in your portal in a easy way. First, you need to be familiarized with the PSSearch syntax ([Sharepoint query syntax](https://web.archive.org/web/20160423181639/http://www.microsoft.com/downloads/details.aspx?FamilyID=D6A10783-A4E4-4463-8444-F88BE48760B3&displaylang=en))

## properties
 
- _PSSearch Query_: Your custom query.  
- _XSL_: The xsl to render the results.  
- _MaxRows:_ Maximun number of rows to return by the query.  
- _DebugXML_: If checked show the xml results.  
- _DebugQuery:_ Show the query.

The query has an special value %TEXT% that it can be replaced if the webpart is connected to another webpart with a cell provider interface. Included with this webpart there is a simple webpart with a input box provider interface called csegInputBoxProvider. You can connect both webparts to make your custom queries.

Finally the xml results are transformated by the xsl to show the final result.


## sample

```sql	
SELECT "DAV:href", "DAV:displayname", "urn:schemas-microsoft-com:office:office#Author"  
FROM  (TABLE Portal\_Content..Scope()       UNION ALL TABLE Non\_Portal\_Content..Scope())  
WHERE ("urn:schemas.microsoft.com:sharepoint:portal:isdocument" = 1 )       
    AND ("DAV:creationdate" > DateAdd(Day,-1,GetGMTDate()))       
    AND CONTAINS("dav:href","%TEXT%")
```
  

```xml
<xml version\="1.0" encoding\="utf-8"?> 
<xsl:stylesheet version\="1.0" xmlns:xsl\="http://www.w3.org/1999/XSL/Transform"\> 
<xsl:output method\="html"/> 
 
<xsl:template match\="/"\> 
   <table class\="ms-summarycustombody"\> 
      <tr\><td\><ul\> 
         <xsl:for–each select\="NewDataSet/Table"\> 
               <xsl:sort select\="dav\_x003A\_displayname"/>1
                    <img src\="/\_layouts/images/square.gif"/><xsl:text\> 
                    <xsl:text\>
                    <a href\="{dav\_x003A\_href}"\>
                     <xsl:value–of select\="DAV\_x003A\_displayname"/>
                     <a\> by <xsl:value–of select\="urn\_x003A\_schemas-microsoft-com\_x003A\_office\_x003A\_office\_x0023\_Author"/><br/>
          <xsl:for–each\>
          <ul\><td\><tr\>
       <table\>
</xsl:template\>
</xsl:stylesheet\> 
```
  
![](/images/Sharepoint/o_csegPSSearch.gif)