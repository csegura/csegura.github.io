+++
title = 'csegRollUp DropDownList'
date = 2008-05-29T00:00:00+01:00
tags = ['sharepoint', 'webparts', 'spsprofessional']
+++

In this sample we load a DropDown list with values from a list and we will use the selected value to filter another SPSRollUp.

Select a List and a Site from which we load data, and fill the SPSRollUp properties.

Use the next XSL to render the DropDown list, (we are using the field Title in the example)

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT" 
                exclude-result-prefixes="sps">
  <xsl:output method="html" />

  <xsl:param name="CurrentRow" />
  
  <xsl:template match="/">
    <![CDATA[
    <script type="text/javascript">
      function combo_onchange(oSelect)
      {
      if(oSelect.selectedIndex != -1)
      {
      var selected = oSelect.options[oSelect.selectedIndex].value;
      ]]><xsl:value-of select="sps:EventJS('Select','selected')" /><![CDATA[
      }
      }
    </script>
     ]]>
    Select a value
    <select id="a1" name="combo" onchange="javascript:combo_onchange(this);" class="ms-input">
      <option value="" />
      <xsl:for-each select="Rows/Row">
        <xsl:sort select="Title" />
        <xsl:element name="option">
          <xsl:attribute name="value">
            <xsl:value-of select="_RowNumber"/>
          </xsl:attribute>
          <xsl:if test="_RowNumber=$CurrentRow">
            <xsl:attribute name ="selected" />
          </xsl:if>
          <xsl:value-of select="Title" />
        </xsl:element>
      </xsl:for-each>
    </select>
  </xsl:template>
</xsl:stylesheet>
```	

This XSL render the DropDown list, generating an option for each row returned in XML. When you select an option the javascript onchange event, send all row values using the provider interface.

Note: To send the values we are using a built-in function called EventJS from sps namespace; you can use this sample in other scenarios to send values using the provider interface.

There are two functions to send the values EventJS and Event, you must use EventJS from inside JavaScript. (see other functions in SPS Namespace functions)

As you know, the provider interface of SPSRollUp sends a complete row of values that contains all fields indicated in the properties. The second parameter of Event or EventJS is the row number (_RowNumber) which values are send via provider interface.

Then you can consume these values in other webpart using the CAML Query property.