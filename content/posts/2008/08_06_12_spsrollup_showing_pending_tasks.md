+++
title = 'SPSRollUp showing pending tasks'
date = 2008-06-12T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

This is only a sample to show how we can use SPSRollUp to show the pending tasks from a list.

![](/images/SharePoint/SPSRollUp_PendingTasks.gif)
 

Select a Task list in the SPSRollUp properties, and select fields Title,DueDate and Status, check the include list data to get the url where you can edit the task item.

Below there are some CAML queries that you can use to filter the results and show only the pending tasks or the tasks for the current logged user.

The XSL 

```xml	 
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT">
  <xsl:output method="html" />
  <xsl:template match="/">
    <table class="ms-summarycustombody">
      <tr>
        <th>Task</th>
        <th>Due date</th>
        <th>Status</th>
      </tr>
      <xsl:for-each select="Rows/Row">
        <tr>
          <td>
            <!-- Link to task -->
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
          <td>
            <!-- Current status -->
            <xsl:value-of select="Status" />
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
```	

In order to hide Completed tasks, you must filter with the next CAML query

```xml	
<Where>
  <Neq>
    <FieldRef Name="Status" />
    <Value Type="Lookup">Completed</Value>
  </Neq>
</Where>
```	

If you want show only the tasks for the current user you can add the next CAML query

```xml	
<Where>
  <And>
   <Neq>
    <FieldRef Name="Status" />
    <Value Type="Lookup">Completed</Value>
  </Neq>
  <Or>
    <Eq>
      <FieldRef Name="AssignedTo" LookupId="TRUE"/>
      <Value Type="int">
        <UserID />
      </Value>
    </Eq>
    <Membership Type="CurrentUserGroups">
      <FieldRef Name="AssignedTo"/>
    </Membership>
  </Or>
  </And>
</Where>
```