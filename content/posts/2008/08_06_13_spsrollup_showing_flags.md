+++
title = 'SPSRollUp showing flags'
date = 2008-06-13T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++


You can replace texts with custom images using the XSL. First you need load the desired images in the /_layouts/images of your server, after load you can use this images from XSL. Here is a little sample where the status of the tasks are replaced  with flag images.

![](/images/Sharepoint/SPSRollUp_PendingTasksImages.gif)


The XSL is the same used in the Task Status example, where we are add a <xsl:choose> in order to select the image:

```xml	
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                              xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  <xsl:output method="html" />
  <xsl:template match="/">
    <table width="100%">
      <tr>
        <th>Task</th>
        <th>Due date</th>
        <th>Status</th>
      </tr>
      <tbody>
        <xsl:for-each select="Rows/Row">
          <tr>
            <td>
              <a href="{_ItemUrl}">
                <xsl:value-of select="Title" />
              </a>
            </td>
            <td>
              <!-- Show the DueDate -->
              <p style="color:#ff0000;text-align:right">
                <xsl:value-of select="substring-before(DueDate,' ')" />
              </p>
            </td>
            <td class="ms-vb" width="5%" style="padding-bottom: 3px">
              <!-- Show the Image --> 
              <xsl:choose>
                <xsl:when test="Status='Completed'">
                  <img src="/_layouts/images/flag_green.png" />
                </xsl:when>
                <xsl:when test="Status='In Progress'">
                  <img src="/_layouts/images/flag_orange.png" />
                </xsl:when>
                <xsl:when test="Status='Deferred'">
                  <img src="/_layouts/images/flag_blue.png" />
                </xsl:when>
                <xsl:when test="Status='Not Started'">
                  <img src="/_layouts/images/flag_red.png" />
                </xsl:when>
                <xsl:otherwise>
                  <img src="/_layouts/images/flag_black.png" />
                </xsl:otherwise>
              </xsl:choose>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
```