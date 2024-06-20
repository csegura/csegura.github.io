+++
title = 'SPSRollUp Task Diffs'
date = 2008-12-15T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

It’s another SPSRollUp Sample that show data from a tasks list in subsites. This view permits expand and collapse data and show the startdate, the duedate and the days from startdate to duedate.

In the SPSRollUp Properties, select the necesary tasks lists, use the fields, Title,StartDate,DueDate and select the ‘Use ISO dates’. In the XSL use the code below

![](/images/Sharepoint/SPSRollUp_TasksExpandDiff.gif)

This example use the DateDiff function from the SPSRollUp Namespace.

```xml 
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:msxsl="urn:schemas-microsoft-com:xslt"
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT"
                exclude-result-prefixes="msxsl sps">
  <xsl:output method="html" />

  <!-- Group by Lists -->
  <xsl:key name="KGroup" match="Row" use="_ListTitle" />
 
  <xsl:template match="Rows">

    <table width="100%">
      <!-- Select distinct for Lists -->
      <xsl:for-each select="Row[count(. | key('KGroup', _ListTitle)[1]) = 1]">
        <xsl:sort select="_SiteTitle" />

        <!-- Collapsable Header -->
        <xsl:call-template name="CollapsableHeader">
          <xsl:with-param name="Title" select="_ListTitle" />
        </xsl:call-template>
        
        <!-- Details -->
        <xsl:for-each select="key('KGroup', _ListTitle)">
          <tr>
            <td> 
              <!-- Empty Column -->
            </td>
            <td>
              <xsl:value-of select="Title"/>
            </td>
            <td>
              <xsl:value-of select="sps:FormatDateTime(StartDate,'m')" />
            </td>
            <td>
              <xsl:value-of select="sps:FormatDateTime(DueDate,'m')" />
            </td>
            <td>
              <xsl:choose>
                <xsl:when test="DueDate!=''">
                  <xsl:value-of select="sps:DateDiff('D',DueDate,StartDate)" />
                </xsl:when>
              </xsl:choose>
            </td>
          </tr>                
        </xsl:for-each>
      </xsl:for-each>

    </table>
  </xsl:template> 

  <xsl:template name="CollapsableHeader">
    <xsl:param name="Title" />
    <tr id="group0" >
      <td class="ms-gb" colspan="2">
        <span class="ms-announcementtitle">
          <a href="javascript:" onclick="javascript:ExpGroupBy(this);return false;">
            <xsl:element name ="img">
              <xsl:attribute name ="src">/_layouts/images/minus.gif</xsl:attribute>
              <xsl:attribute name ="border">0</xsl:attribute>
            </xsl:element >
          </a>
          <![CDATA[ ]]>
          <xsl:value-of select="$Title" />
        </span>
      </td>
      <td class="ms-gb">StartDate</td>
      <td class="ms-gb">DueDate</td>
      <td class="ms-gb">Diff</td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
```

If you want change the style and show first the panel collapsed you can change the style in the details row, to do the first load hidden.

And use this snippet to show the expandable header instead (the only difference here is the icon that show a plus)

```xml
 <!-- Details -->
 <xsl:for-each select="key('KGroup', _ListTitle)">
    <tr style="display:none;">

  <xsl:template name="ExpandableHeader">
    <xsl:param name="Title" />
    <tr id="group0" >
      <td class="ms-gb" colspan="2">
        <span class="ms-announcementtitle">
          <a href="javascript:" onclick="javascript:ExpGroupBy(this);return false;">
            <xsl:element name ="img">
              <xsl:attribute name ="src">/_layouts/images/plus.gif</xsl:attribute>
              <xsl:attribute name ="border">0</xsl:attribute>
            </xsl:element >
          </a>
          <![CDATA[ ]]>
          <xsl:value-of select="$Title" />
        </span>
      </td>
      <td class="ms-gb">StartDate</td>
      <td class="ms-gb">DueDate</td>
      <td class="ms-gb">Diff</td>
    </tr>
  </xsl:template>
```