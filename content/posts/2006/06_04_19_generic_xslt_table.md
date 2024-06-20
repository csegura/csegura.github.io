+++
title = 'Generic XSLT Table'
date = 2006-04-19T00:00:00+01:00
tags = ['sharepoint']
+++

This is a small xml stylesheet to render a generic table with the data collected from csegRollUp, and it’s ideal for debug purposes.

```xml
<?xml version="1.0" encoding="utf-8"?>
 
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 
  <xsl:template match="Rows">
    <xsl:call-template name="Tabla"/>
  </xsl:template>
 
  <!– Tabla –>
  <xsl:template name="Tabla">
    <table width="100%" cellpading="1">
      <tbody>
      <xsl:call-template name="Cabeceras" />
      <xsl:for-each select=’Row’>
        <tr>
          <xsl:for-each select=".//*">
            <td class="ms-vb2">
              <xsl:value-of select="."/>
            </td>
          </xsl:for-each>
        </tr>
      </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
  
  <!– Cabeceras de la tabla –>
  <xsl:template name="Cabeceras">
    <tr>
      <xsl:for-each select="Row[1]/*">
        <th nowrap=""  class="ms-vh2">
          <xsl:value-of select="name()"/>
        </th>
      </xsl:for-each >
    </tr>
  </xsl:template>
  
</xsl:stylesheet> 
```
![](images/Sharepoint/GenericTable.gif)