+++
title = 'SPSRollUp Change Grid Pager'
date = 2009-03-12T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

This is a small xslt snippet to change the pager style, that looks as below. This pager has buttons for first and last page, for previous and next pages and you can establish the desired number of page buttons.

![](/images/Sharepoint/SPSRollUpPagerStyle.gif)

The pager template is divided  in small templates for each button, also added a variable to calc the last page. You can change the PageSize and the MaxPageLinks xslt variables.

```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  
  <xsl:param name="CurrentPage" />
  
  <!-- Customize PageSize & MaxPageLinks -->
  <xsl:variable name="RecordCount" select="count(/Rows/Row)" />
  <xsl:variable name="PageSize" select="10" />
  <xsl:variable name="MaxPagesLinks" select="3" />
  <xsl:variable name="LastPage" select="ceiling($RecordCount div $PageSize)" />
  
  <!-- Main Template -->
  <xsl:template match="/Rows">
    
    <!-- Debug Use 
    <br/>Current Page: <xsl:value-of select="$CurrentPage" />
    <br/>Record Count: <xsl:value-of select="$RecordCount" />
    <br/>Page size: <xsl:value-of select="$PageSize" />   
    <br/>Last Page: <xsl:value-of select="$LastPage" />   
    <br/>
     -->
        
    <!-- Main table -->
    <table width="100%" 
           class="ms-listviewtable" 
           cellspacing="0" 
           cellpadding="1" 
           border="0" 
           style="border-style: none; width: 100%; border-collapse: collapse;">
      <tbody>
        <xsl:call-template name="DrawHeader" />
        <xsl:for-each select="/Rows/Row">
          <xsl:call-template name="DrawRow" />
        </xsl:for-each>
      </tbody>
    </table>

    <!-- Pages Toolbar -->
    <xsl:call-template name="DrawPagesToolbar" />
  </xsl:template>

  <!-- TableHeader Template -->
  <xsl:template name="DrawHeader">
    <tr class="ms-viewheadertr" valign="top">
      <th class="ms-vh2-nofilter ms-vh2-gridview" nowrap="">
        Row
      </th>
      <xsl:for-each select="Row[1]/*">
        <xsl:if test="name()!='_RowNumber'">
          <th class="ms-vh2-nofilter ms-vh2-gridview" nowrap="">        
            <xsl:value-of select="sps:XmlDecode(name())" />        
          </th>
        </xsl:if>
      </xsl:for-each>
    </tr>
  </xsl:template>

  <!-- TableRow Template -->
  <xsl:template name="DrawRow">
    <xsl:choose>
      <!—- LINE INDENTED FOR DISPLAY  --> 
      <xsl:when test="(position() &gt;= 1 + ($CurrentPage - 1) * $PageSize) and 
                      (position() &lt; (1 + $CurrentPage * $PageSize))">
        <tr class="" >
          <!-- Icon to send the row -->
          <td class="ms-vb-title">            
            <a href="{sps:Event('Select',_RowNumber)}">
              <img src="/_layouts/images/exptitem.gif" border="0" />
            </a>
          </td>
          <!-- All columns except _RowNumber -->
          <xsl:for-each select="node()">
            <xsl:if test="name()!='_RowNumber'">
              <td class="ms-vb2">
                <xsl:value-of select="." disable-output-escaping="yes" />
              </td>
            </xsl:if>
          </xsl:for-each>
        </tr>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
  <!-- Pages Template -->
  <xsl:template name="DrawPagesToolbar">
    <div class="ms-menutoolbar">
      <div class="pagn"> 
        <!-- First and previous page -->
        <xsl:call-template name="DrawFirstPageButton" />
        <xsl:call-template name="DrawPreviousPageButton" />
        <xsl:call-template name="DrawSeparatorButton" />
        <!-- Draw buttons for pages -->
        <xsl:for-each select="Row[((position() - 1) mod $PageSize = 0)]">
            <xsl:choose>

              <!-- LINE INDENTED FOR DISPLAY --> 
              <xsl:when test="(position() &gt; ($CurrentPage - ceiling($MaxPagesLinks div 2)) or 
                              position() &gt; (last() - $MaxPagesLinks)) and ((position() &lt; 
                              $CurrentPage + $MaxPagesLinks div 2)
                              or (position() &lt; 1 + $MaxPagesLinks))">
                <xsl:if test="position()=$CurrentPage">
                  <xsl:call-template name="DrawSelectedPageButton" />
                </xsl:if>
                <xsl:if test="position()!=$CurrentPage">
                  <xsl:call-template name="DrawPageButton" />
                </xsl:if>
              </xsl:when>
            </xsl:choose>
        </xsl:for-each>
        <!-- Next and last page -->
        <xsl:call-template name="DrawSeparatorButton" />
        <xsl:call-template name="DrawNextPageButton" />
        <xsl:call-template name="DrawLastPageButton" />       
      </div>
    </div>
  </xsl:template>

  <!-- Pager Button Templates -->
  
  <xsl:template name="DrawSeparatorButton">
    <span class="pagnSep">|</span>
  </xsl:template>

  <xsl:template name="DrawFirstPageButton">
    <span class="pagnPrev">
      <xsl:if test="position()=1">     
        <a href="{sps:Event('Page',position())}" class="pagnPrev">|« </a>
      </xsl:if>
    </span>
  </xsl:template>
  
  <xsl:template name="DrawNextPageButton">
    <span class="pagnPrev">
      <xsl:if test="$CurrentPage &lt; $LastPage">
        <a href="{sps:Event('Page',$CurrentPage + 1)}" class="pagnPrev">next »</a>
      </xsl:if>
    </span>
  </xsl:template>

  <xsl:template name="DrawPreviousPageButton">
    <span class="pagnPrev">
      <xsl:if test="$CurrentPage &gt; 2 or $CurrentPage = 2">        
        <a href="{sps:Event('Page',$CurrentPage - 1)}" class="pagnPrev">« prevoius</a>
      </xsl:if>
    </span>
  </xsl:template>

  <xsl:template name="DrawLastPageButton">
    <span class="pagnPrev">      
        <a href="{sps:Event('Page',$LastPage)}" class="pagnPrev"> »|</a>      
    </span>
  </xsl:template>

  <xsl:template name="DrawSelectedPageButton">
    <span class="pagnCur">             
          <xsl:value-of select="position()"/>        
    </span>
  </xsl:template>

  <xsl:template name="DrawPageButton">
    <span class="pagnLink">
      <a href="{sps:Event('Page',position())}" class="pagnLink">
        <strong>
          <xsl:value-of select="position()"/>
        </strong>
      </a>
    </span>
  </xsl:template>
  
</xsl:stylesheet>
```	

Use the next styles, remember that you can add this to the SPSRollUp.css located in 12 hive, under \LAYOUTS\SPSRollUp directory.

```css	
div.pagn, div.pagnBtm {
  padding: 8px 0; 
  display: inline;
  float: left;
  font-size: 93%;
  text-align: center;
  width: 100%;
}


div.pagn .pagnCur
{
  font-weight: bold;
  padding: 0 5px;
}

div.pagn .pagnDisabled {
  color: #999;
  padding: 0px 5px;
  white-space: nowrap;
}

div.pagn .pagnMore, div.pagn .pagnSep {
  padding: 0 2px;
}

div.pagn a, div.pagn a:visited {
  text-decoration: none;
  padding: 6px;
  color: #055d90;
  white-space: nowrap;
}

div.pagn a:hover, div.pagn a:active {
  padding: 5px;
  border: 1px solid #055d90;
  text-decoration: none;
  color: #055d90;
  white-space: nowrap;
  background: #fff;
}
```	