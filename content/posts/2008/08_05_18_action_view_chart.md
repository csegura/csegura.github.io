+++
title = 'ActionView Chart'
date = 2008-05-18T00:00:00+01:00
tags = ['sharepoint', 'webparts', 'spsprofessional']
+++

- XML Configuration

```xml 
<?xml version="1.0" encoding="utf-16"?>
<SPSActionViewConfig>
  <DataBase 
    ConnectionString="Data Source=W2K3;Initial Catalog=Northwind; .." />
  <Query SelectCommand=
        "SELECT CategoryID, CategoryName, SUM(ProductSales) AS Total
         FROM   [Sales by Category]
         GROUP BY CategoryName, CategoryID" />
</SPSActionViewConfig>
```

- XSLT

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:msxsl="urn:schemas-microsoft-com:xslt" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT" 
                exclude-result-prefixes="msxsl sps">
  <xsl:output method="xml" indent="yes" />
  <xsl:template match="@* | node()">
    <!-- Graph -->
    <graph caption="Title" 
           xAxisName="Products" 
           yAxisName="Sales" 
           decimalPrecision="0" 
           formatNumberScale="0">
      <xsl:apply-templates />
    </graph>
  </xsl:template>
  <!-- Each row -->
  <xsl:template match="Row">
    <!-- Put here your fields -->
    <set name="{CategoryName}" value="{Total}" color="{sps:GetFcColor()}" />
  </xsl:template>
</xsl:stylesheet>
```

![](/images/Sharepoint/ActionViewChartAlpha2.gif)
 
 