+++
title = 'Action Database Connected Chart'
date = 2008-05-19T00:00:00+01:00
tags = ['sharepoint', 'webparts', 'spsprofessional']
+++

An ActionGrid connected to an ActionViewChart to show in graph form all products and your quantity ordered by a customer

![](/images/Sharepoint/ActionViewChartAlpha3.gif)

ActionViewChart XML Configuration

```xml	
<?xml version="1.0" encoding="utf-16"?>
<SPSActionViewConfig>
  <DataBase ConnectionString=" ... " />
  <Query SelectCommand="SELECT SUM([Order Details].Quantity) AS Quantity, 
                               Products.ProductName
                        FROM   [Order Details] 
                        INNER JOIN Orders 
                              ON [Order Details].OrderID = Orders.OrderID 
                        INNER JOIN Products 
                              ON [Order Details].ProductID = Products.ProductID
                        WHERE Orders.CustomerID=@CustomerID  
                        GROUP BY Products.ProductName" />
  <Filter>
    <Param Name="CustomerID" Type="NChar" Default="" />
  </Filter>
</SPSActionViewConfig>
```

ActionViewChart XSLT

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl=http://www.w3.org/1999/XSL/Transform 
                xmlns:msxsl="urn:schemas-microsoft-com:xslt" 
                xmlns:sps=http://schemas.spsprofessional.com/WebParts/SPSXSLT 
                exclude-result-prefixes="msxsl sps">
  <xsl:output method="xml" indent="yes" />
  <xsl:template match="@* | node()">
    <!-- Graph -->
    <graph caption="Title" 
           xAxisName="Products" 
           yAxisName="Quantity" 
           decimalPrecision="0" 
           formatNumberScale="0">
      <xsl:apply-templates />
    </graph>
  </xsl:template>
  <!-- Each row -->
  <xsl:template match="Row">
    <!-- Put here your fields -->
    <set name="{ProductName}" value="{Quantity}" color="{sps:GetFcColor()}" />
  </xsl:template>
</xsl:stylesheet>
```