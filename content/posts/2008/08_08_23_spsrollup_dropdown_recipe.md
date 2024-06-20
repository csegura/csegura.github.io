+++
title = 'SPSRollUp Dropdown Recipe'
date = 2008-08-23T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

In a blank page insert two SPSRollUp webparts.  

Edit the properties in the first webpart and select any list, in the fields property write “Title”

![](/images/Sharepoint/SPSRollUp_DropDown1.gif)

In the XSL paste the next snippet; This snippet fills a drop down box with the titles of all crawled data

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="<http://www.w3.org/1999/XSL/Transform>" 
                xmlns:sps="<http://schemas.spsprofessional.com/WebParts/SPSXSLT>" 
                exclude-result-prefixes="sps">
  <xsl:output method="html" />
  <xsl:param name="CurrentRow" />
  <xsl:template match="/">
    <script type="text/javascript">
function combo_onchange(oSelect)
{
 if(oSelect.selectedIndex != -1)
 {
  var selected = oSelect.options[oSelect.selectedIndex].value;
  <xsl:value-of select="sps:EventJS('Select','selected')" />
  }
}
    </script>
    Select a value
    <select id="a1" name="combo" onchange="javascript:combo_onchange(this);" class="ms-input">
    <option value="" />
    <xsl:for-each select="Rows/Row">
       <xsl:sort select="Title" />
       <xsl:element name="option">
         <xsl:attribute name="value">
            <xsl:value-of select="_RowNumber" />
         </xsl:attribute>
         <xsl:if test="_RowNumber=$CurrentRow">
            <xsl:attribute name="selected" />
         </xsl:if>
         <xsl:value-of select="Title" />
      </xsl:element>
    </xsl:for-each>
  </select>
 </xsl:template>
</xsl:stylesheet>
```

When a value is selected the JavaScript embedded in the XSL “combo\_onchange” send the selected value using the row provider interface.

Note: SPSRollUp send a full row of data, we can show only the title in the drop down box, but if we have more fields in the properties all fields are sent.

Apply changes in the first webpart; You should see the drop down box with the titles

![](/images/Sharepoint/SPSRollUp_DropDown2.gif)

In the second webpart use the same list and in the fields property write “Title,CreatedBy”, enable the Debug query and in the CAML query use the following query.

```xml
<Where>
  <Eq>
    <FieldRef Name="Title" />
    <Value Type="Text">[FromCombo:]</Value>
  </Eq>
</Where>
```

This query introduce a variable called “FromCombo”. “FromCombo” is the value that we need to perform the query. To get this value we need connect this webpart with a provider webpart.

First apply changes, you should see this

![](/images/Sharepoint/SPSRollUp_DropDown3.gif)

Note: We can give a default value to the variable “FromCombo” , to do it, put the default value after colons.

Now connect both webparts

![](/images/Sharepoint/SPSRollUp_DropDown4.gif)

![](/images/Sharepoint/SPSRollUp_DropDown5.gif)

You can connect each field in the provider row, with the desired value in the consumer webpart. Skip the \_RowNumber and connect the “Title” field with the “FromCombo” variable.

![](/images/Sharepoint/SPSRollUp_DropDown6.gif)

Finally you can view the result when you select a value in the drop down box.

![](/images/Sharepoint/SPSRollUp_DropDown7.gif)

