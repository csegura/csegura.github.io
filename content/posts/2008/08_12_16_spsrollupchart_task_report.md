+++
title = 'SPSRollUp Chart Task Report'
date = 2008-12-16T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

Using the previous sample, you can connect the crawled lists with a **SPSRollUpChart** to show a resume graph with the status of all tasks.

Our goal is show a chart with the status of all tasks in a specified task list. First create a SPSRollUp to select the lists as [**this**](https://web.archive.org/web/20130904001354/http://www.spsprofessional.com/post/SPSRollUp-Select-Distinct-Crawled-Lists.aspx)

Add a **SPSRollUpChart** webpart an fill the properties with the same lists and in the fields property write “Status”, because we want get the status of the tasks.

In the CAML query we need write the filter to get the list data using ContentTypeId

```xml
<Where>
  <BeginsWith>
    <FieldRef Name="ContentTypeId" />
    <Value Type="Text">[ct:]</Value>
  </BeginsWith>
</Where>
```

In the SPSRollUpChart XSL we need a chart definition, in this case we want a “Pie Chart” that show the percent of tasks ‘In Progress’, ‘Completed’ and ‘Not Started’

This XSLT count the number of tasks by status.

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:msxsl="urn:schemas-microsoft-com:xslt" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT" 
                exclude-result-prefixes="msxsl sps">

  <xsl:output method="xml" indent="yes" />

  <!-- Process Graph -->
  <xsl:template match="@* | node()">
    <xsl:apply-templates />
  </xsl:template>




  <!-- Pie Chart -->
  <xsl:template match="Rows">
    <graph caption="Tasks Status" 
           decimalPrecision="0" 
           showPercentageValues="1" 
           showNames="1" 
           showValues="1" 
           showPercentageInLabel="1" 
           pieYScale="45" 
           pieBorderAlpha="100" 
           pieRadius="100" 
           animation="1" 
           pieFillAlpha="95" 
           pieBorderColor="FFFFFF">
      <xsl:if test="count(//Status[text()='In Progress'])&gt;0">
        <set name="In Progress" 
             value="{count(//Status[text()='In Progress'])}" 
             color="{sps:GetFcColor()}" />
      </xsl:if>
      <xsl:if test="count(//Status[text()='Completed'])&gt;0">
        <set name="Completed" 
             value="{count(//Status[text()='Completed'])}" 
             color="{sps:GetFcColor()}" />
      </xsl:if>
      <xsl:if test="count(//Status[text()='Not Started'])&gt;0">
        <set name="Not Started" 
             value="{count(//Status[text()='Not Started'])}" 
             color="{sps:GetFcColor()}" />
      </xsl:if>
    </graph>
  </xsl:template>
</xsl:stylesheet>
```

Note that we are checking before write the “set” element if the count return a value greater than zero, we don´t want see any 0%.

Finally we need connect both webparts as in the other example.

![](/images/Sharepoint/SPSRollUpChartTasksStatusPieChart.gif)