+++
title = 'csegRollUp v3 rc1'
date = 2005-11-12T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

I am finishing csegRollUp v3, at the moment some examples…. 

1.- Using csegRollUp cell consumer interface.

Show all documents inside of a document library where Title contains data provider from other webpart.

![](/images/Sharepoint/csegRollUp-v3rc1-consumer.gif)


Lists: Shared Documents
Fields: ID, LinkFilename,EncodedAbsUrl,Modified,DocIcon,FileRef,Author,Title

CAML query

```xml	
<Where>
   <Contains>
      <FieldRef Name='Title' />
      <Value Type='Text'>[CellProvider]</Value>
   </Contains>
</Where>
```

Recursive: enabled


XSLT

```xml	
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="html" />
   <xsl:template match="/">
      <table class="ms-summarycustombody">
         <tbody>
            <xsl:for-each select="Rows/Row">
               <xsl:sort select="Modified" order="descending" />
               <tr>
                    <td>
                       <img src="/_layouts/images/ic{DocIcon}.gif" />
                    </td>
   
                    <td width="75%">
                       <a href="{EncodedAbsUrl}">
                          <xsl:value-of select="LinkFilename" />
                       </a>
                    </td>
                 </tr>
              </xsl:for-each>
           </tbody>
        </table>
     </xsl:template>
  </xsl:stylesheet>
```

2.- Using csegRollUp cell provider interface


With the same data, the XSL contains a __doPostBack used to provide a cell value.

![](/images/Sharepoint/csegRollUp-v3rc1-provider.gif)

XSLT

```xml
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="html" />
   <xsl:template match="/">
      <table class="ms-summarycustombody">
         <tbody>
            <xsl:for-each select="Rows/Row">
               <xsl:sort select="Modified" order="descending" />
               <tr>
                    <td>
                       <img src="/_layouts/images/ic{DocIcon}.gif" />
                    </td>
                    <td width="75%">
                       <a href="javascript:__doPostBack(",'{LinkFilename}')">
                          <xsl:value-of select="LinkFilename" />
                       </a>
                    </td>
                 </tr>
              </xsl:for-each>
           </tbody>
        </table>
     </xsl:template>
  </xsl:stylesheet>
```

3.- Finally csegRollUp as provider and consumer and csegRollUp as consumer the BIG ONE…


The first webpart for text entry, the second one locate documents thats contains the text entry in the title. The last webpart shows information about of file clicked in webpart 2.

![](/images/Sharepoint/csegRollUp-v3rc1-consumer-provider.gif)


XSL from webpart 2 (csegRollUp v3 RC1 as Consumer and Provider)


```xml	
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="html" />
   <xsl:template match="/">
      <table class="ms-summarycustombody">
         <tbody>
            <xsl:for-each select="Rows/Row">
               <xsl:sort select="Modified" order="descending" />
               <tr>
                    <td>
                       <img src="/_layouts/images/ic{DocIcon}.gif" />
                    </td>
                    <td width="75%">
                       <a href="javascript:__doPostBack(",'{ID}')">
                          <xsl:value-of select="LinkFilename" />
                       </a>
                    </td>
                 </tr>
              </xsl:for-each>
           </tbody>
        </table>
     </xsl:template>
  </xsl:stylesheet>
```

CAML Query in webpart 3 (csegRollUp v3 RC1 as Consumer)


```xml
<Where>
   <Eq>
      <FieldRef Name="ID" />
      <Value Type='Numeric'>[CellProvider]</Value>
   </Eq>
</Where>
```

XSL in webpart 3


```xml
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="html" />
   <xsl:template match="/">
      <xsl:for-each select="Rows/Row">File Details 
      <table class="ms-summarycustombody">
         <tbody>
            <tr>
               <td>Icon</td>
                 <td>
                    <img src="/_layouts/images/ic{DocIcon}.gif" />
                 </td>
              </tr>
              <tr>
                 <td>File Name</td>
                 <td>
                    <xsl:value-of select="LinkFilename" />
                 </td>
              </tr>
              <tr>
                 <td>Author</td>
                 <td>
                    <xsl:value-of select="Author" />
                 </td>
              </tr>
              <tr>
                 <td>Modified</td>
                 <td>
                    <xsl:value-of select="Modified" />
                 </td>
              </tr>
           </tbody>
        </table>
        </xsl:for-each>
     </xsl:template>
  </xsl:stylesheet>
``` 

4.- Using csegRollUp as ComboBox Provider


This is great … Render a combo with data from tasks list and provide the selected to another webpart

![](/images/Sharepoint/csegRollUp-v3rc1-combo-provider.gif)



List: Tasks


Fields: ID, Title


XSLT


```xml	
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>
<xsl:template match="/">
       <SCRIPT>
       function combo_onchange(oSelect) {  
              if(oSelect.selectedIndex != -1)  
            __doPostBack(",oSelect.options[oSelect.selectedIndex].text);  
       }  
         </SCRIPT>
         <select name="combo" onchange="javascript:combo_onchange(this)">
          <xsl:for-each select="Rows/Row">
               <option value="{ID}"><xsl:value-of select="Title"/></option>    
          </xsl:for-each>
          </select>
       </xsl:template>
  </xsl:stylesheet>
```

Today it is the first birthday of my daughter. Happy Birthday Patricia.