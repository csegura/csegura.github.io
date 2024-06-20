+++
title = 'Playing with csegScriptWebPart'
date = 2005-08-03T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++


SharePoint - Playing with csegScript
Some users of csegRollUp2 ask to me how to get the complete list of fields for a list, remember that you can use the internal names with csegRollUp. Now you can use csegScript to show all fields and types of any list.

Change the red code with the name of your list, and put the webpart in the site where the list is stored. 

Begin Script Code
```vb
imports Microsoft.SharePoint
imports Microsoft.SharePoint.Utilities
imports Microsoft.SharePoint.WebPartPages
imports Microsoft.SharePoint.WebControls
imports System.Web.UI
Module Script
   Public Sub Main()
      Dim site As SPSite = SPControl.GetContextSite(System.Web.HttpContext.Current)
      Dim allSites As SPWebCollection = site.AllWebs
      Dim subSite As SPWeb = allSites(0)
      Dim list as SPList = subSite.Lists("Anuncios")
      Dim field As SPField
      output.WriteLine("<table width='100%'><tr><td>Name</td><td>Description</td><td>InternalName</td><td>Type</td></tr>")
      For Each field in list.Fields
         output.WriteLine("<tr><td>"+SPEncode.HtmlEncode(field.Title)+"</td><td>"+SPEncode.HtmlEncode(field.Description)+"</td><td>"+SPEncode.HtmlEncode(field.InternalName)+"</td><td>"+SPEncode.HtmlEncode(field.TypeAsString)+"</td></tr>")
      Next field
      output.WriteLine("</table>")
   End Sub
End Module
```

End Script Code

Also, some users ask to me about remove the copyright in the bottom of webpart, I think that csegScript is a tool for developpers and is not thought, for end users.And in a future I will open the code.

Note: If you want to share your small tricks, suggest improvements with csegScript, csegRollUp or others webparts please uses the forum or comments. I always respond.

(the cut and paste code is in the forum :-) )