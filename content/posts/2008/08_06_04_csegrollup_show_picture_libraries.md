+++
title = 'csegRollup Show Picture Libraries'
date = 2008-06-04T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

With SPSRollUp you can also aggregate content from Picture Libraries, this is a little sample that shows you how to do it.

Select the desired lists that you want to aggregate and add the fields in the fields list, the most important field here is the EncodedAbsThumbnailUrl, this field contains the Url where the thumbnail image is stored. Other fields that we are using in the example are Title, Description and Keywords.

The result shows as

![](/images/Sharepoint/SPSRollUpTipImages.gif)

The XSL that we are using

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl=http://www.w3.org/1999/XSL/Transform" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  <xsl:output method="html" indent="yes" />
  <!-- Main Template -->
  <xsl:template match="Rows">
    <table width="100%" 
           class="ms-listviewtable" 
           cellspacing="0" 
           cellpadding="1" 
           border="0" 
           style="border-style: none; width: 100%; border-collapse: collapse;">
      <tbody>
        <!-- Draw header -->
        <xsl:call-template name="DrawHeader" />
        <!-- Draw Rows -->
        <xsl:for-each select="Row">
          <xsl:call-template name="DrawRow" />
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
  <!-- Row Table Template -->
  <xsl:template name="DrawRow">
    <tr>
      <!-- First column Thumbnail -->
      <td>
        <a href="{sps:Event('Send',_RowNumber)}">
          <img src="{EncodedAbsThumbnailUrl}" border="0" />
        </a>
      </td>
      <!-- Second column Title and Description --> 
      <td valign="top">
        <b>
          <xsl:value-of select="Title" />
        </b>
        <br />
        <xsl:value-of select="Description" />
        <br />
        <font size="1" color="blue">
          <xsl:value-of select="Keywords" />
        </font>
      </td>
    </tr>
  </xsl:template>
  <!-- Header Table Template -->
  <xsl:template name="DrawHeader">
    <tr class="ms-viewheadertr" valign="top">
      <th class="ms-vh2-nofilter ms-vh2-gridview" nowrap="">
        Thumbnail
      </th>
      <th class="ms-vh2-nofilter ms-vh2-gridview" nowrap="">
        Text
      </th>
    </tr>
  </xsl:template>
</xsl:stylesheet>
```	

And finally if you want you can filter this by keyword. Add a the next CAML query to SPSRollUp

```xml
<Where>
  <Contains>
    <FieldRef Name="Keyword" />
    <Value Type="Text">[Keys:]</>
  </Contains>
</Where>
```

Add a Form Web part, and connect the from webpart with the SPSRollUp webpart.