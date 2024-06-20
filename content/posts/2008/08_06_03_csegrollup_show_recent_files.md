+++
title = 'csegRollUp show recent modified files'
date = 2008-06-03T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

A common recurrence task in SharePoint is to locate the last modified files. SPSRollUp can help to you in this task.

You can use SPSRollUp to retrieve items from a document library as it is shown in the image.

![](/images/Sharepoint/SPSRollUpRecentModifiedFiles.gif)

You are supposed to select in the lists the document libraries in which you want crawl the results, and, in the fields you must select:

**FileRef**: That is the file name with full path.
**LinkFileName**: That is the file name, without path.
**EncodedAbsUrl**: That is the full path of the file, without file name.
**Modified**: The date and time when the document was modified.
**Created**: The date and time when the document was created.

The view has three columns, the first column contains the document icon, we will use the sps:DocToIcon function from SPS Namespace functions, the second column contains the name of the file, the new icon if the document is new (we will use here the sps:IfNew function) and in a second line the date when the document was modified, finally in the third column we have a folder icon to go to the folder where is located the document.

The xsl used is:

```xml
<?xml version='1.0' encoding='utf-8'?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  
  <xsl:output method="html" />    
  
  <xsl:template match="/">
    <table class="ms-summarycustombody">
      <tbody>
        <xsl:for-each select="Rows/Row">
          <xsl:sort select="Modified" order="descending"/>
          <tr>
            <td width="24px">
              <!-- Use MapToIcon to show the file icon -->
              <img src="_layouts/images/{sps:MapToIcon(FileRef,'')}" alt="{FileRef}"/>
            </td>
            <td width="100%">
              <xsl:value-of select="LinkFilename" />
              <!-- Use IfNew to show the new file icon -->
              <xsl:if test="sps:IfNew(substring-before(Created,' '))">
                <img src="_layouts/1033/images/new.gif" alt="New" />
              </xsl:if>
                <br/>
              <!-- Show the modified date -->
              <font color="#999999">
                (<xsl:value-of select="substring-before(Modified,' ')" />)
              </font>
            </td>
            <!-- Go to Folder -->
            <td width="24px">
              <a href="{substring-before(FileRef,LinkFilename)}">
                <img border="0" src="/_layouts/images/folder.gif" alt="Go to Folder"/>
              </a>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
```	

Finally if you want show only the files for the current logged user you can add the next CAML query.

```xml
<Where>
   <Eq>
     <FieldRef Name="Author"/>
     <Value Type="Integer"><UserID/></Value>
   </Eq>
</Where>
```