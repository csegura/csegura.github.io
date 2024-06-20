+++
title = 'SPSRollUp 2.0 Beta'
date = 2008-07-03T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

We are developing an application for a customer using SPSRollUp (Beta 2), our customer want a site with some features that seem like BaseCamp site, BaseCamp is a well know Project Management web application.

Using SPSRollUp our customer can aggregate data from sub-projects and show all tasks status in an only view. But he want a special view that he likes specially, this view show pending tasks whit delayed days and coming tasks with the remaining days.

These views shows as:

![](/images/SharePoint/SPSRollUp_TaskCamp1.gif)
![](/images/SharePoint/SPSRollUp_TaskCamp2.gif)

To do it we are using two SPSRollUp webparts, the first one for the Late view, the CAML query is:

```xml
<Where>
  <And>
    <Lt>
      <FieldRef Name="DueDate" />
      <Value Type="DateTime">
        <Today />
      </Value>
    </Lt>
    <Neq>
      <FieldRef Name="Status" />
      <Value Type="Choice">Completed</Value>
    </Neq>
  </And>
</Where>
```	

This query show tasks not completed and with due date lower than today. (Coming tasks query is similar, with due date greater than today)

The next XML is for the late view, note the new SPS function DateDiff() (included in 2.0 Beta)

```xml	
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  <xsl:output method="html" indent="yes" />
  <!-- Header -->
  <xsl:template match="Rows">
    <h1 style="font-size:1em;background-color:#CC0000;border-bottom:1px 
               solid #CC0000;color:#FFFFFF;margin:0pt 0pt 4pt">Late</h1>
    <!-- Draw Rows -->
    <xsl:for-each select="Row">
      <!-- Sort dates (important)Tip: Use ISO dates to sort dates in XML -->
      <xsl:sort select="DueDate" order="descending" />
      <xsl:call-template name="DrawRow" />
    </xsl:for-each>
  </xsl:template>
  <!-- Row Table Template -->
  <xsl:template name="DrawRow">
    <div style="border-bottom:1px solid #E0E0E0;padding:4px 0pt 4px 3px;">
      <div style="color:#CC0000;font-family:verdana;font-size:10px;padding:0pt 0pt 3px;">
        <strong>
          <xsl:value-of select="sps:DateDiff('d',DueDate,sps:TodayIso())" /> days ago 
        </strong> 
        (<xsl:value-of select="sps:FormatDateTime(DueDate,'dddd, dd MMM')" />)</div>
      <div style="font-weight:bold;padding:0pt 5pt 6px;">
        <xsl:value-of select="Title" />
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>
```	