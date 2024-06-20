+++
title = 'SPSRollUp Select Distinct Crawled Lists'
date = 2008-12-15T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

This is a small sample to show all crawled lists, only the lists names without any other data.

Suppose that you want get all lists crawled under a specific site, send the list to another SPSRollUp webpart to show the lists items.

In this example we will use any site and we wish get all tasks related lists.

In the SPSRollUp properties, type "Tasks" in the lists properties and put "Title" in the fields property (we are not going to use the "Title" field but we need it, SPSRollUp must have almost one field in order to run the rollup)

In order to get the List name, and Site Name, we need select the “Include List Data”

Finally we need the XSL,

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:msxsl="urn:schemas-microsoft-com:xslt" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT" 
                exclude-result-prefixes="msxsl sps">
  <xsl:output method="html" indent="yes" />
  <xsl:param name="CurrentRow" />
  <!-- Select distinct Sites and Lists -->
  <xsl:key name="sites-lists" match="Row" use="concat(_SiteTitle,_ListTitle)" />
  <xsl:template match="Rows">
    <table>
      <!-- Show Lists and Sites -->
      <xsl:for-each 
         select="Row[count(. | key('sites-lists', concat(_SiteTitle,_ListTitle))[1]) = 1]">
        <xsl:sort select="_SiteTitle" />
        <xsl:sort select="_ListTitle" />
        <tr class="{sps:iif(_RowNumber=$CurrentRow,'ms-selectednav','')}">
          <td>
            <a href="{sps:Event('Select',_RowNumber)}">
              <img src="/_layouts/images/exptitem.gif" border="0" />
            </a>
          </td>
          <td>
            <xsl:value-of select="_SiteTitle" /> ( <xsl:value-of select="_ListTitle" /> )</td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
```

The result looks as

![](/images/Sharepoint/SPSRollUpSelectDistinct.gif)

As you can view there is a small icon to send the desired row to another webpart.

In order to get all items from any of this lists we need get the ContentTypeId and send the value to the other webpart, to do it, we need add the ContentTypeId to the fields property in our SPSRollUp.

After, in the consumer webpart we need setup the properties using the same lists that in the provider webpart,  for this example we use the fields “Title,StartDate,DueDate” and also we need add a CAML query to get the data that matches with the ContentTypeId.

```xml
<Where>
  <BeginsWith>
    <FieldRef Name="ContentTypeId" />
    <Value Type="Text">[ct:]</Value>
  </BeginsWith>
</Where>
```

Now we need connect both webparts, to send the selected ContentTypeId to the consumer webpart

![](/images/Sharepoint/SPSRollUpSelectDistinctConnect.gif)

Link the fields

![](/images/Sharepoint/SPSRollUpSelectDistinctConnect2.gif)

At last to show the result, we can use a simple XSLT to show the data

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" />
  <!-- Main Template -->
  <xsl:template match="Rows">
    <table>
      <tbody>
        <xsl:for-each select="Row">
          <xsl:call-template name="TableRow" />
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
  <!-- TableRow Template -->
  <xsl:template name="TableRow">
    <tr>
      <td>
        <xsl:value-of select="Title" />
      </td>
      <td>
        <xsl:value-of select="StartDate" />
      </td>
      <td align="right">
        <xsl:value-of select="PercentComplete" />
      </td>
    </tr>
  </xsl:template>
</xsl:stylesheet>
```

Finally this is the result

![](/images/Sharepoint/SPSRollUpSelectDistinctFinal.gif)

```xml	
<Where>
  <BeginsWith>
    <FieldRef Name="ContentTypeId" />
    <Value Type="Text">[ct:]</Value>
  </BeginsWith>
</Where>
```
