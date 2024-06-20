+++
title = 'cssegScriptWebPart'
date = 2005-08-03T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Imagine test your webparts without compile, imagine an VBA for sharepoint, that was what I imagined yesterday and this is here... I have desire to say Yeahhhhh  
  
**Screenshoots** (better an image than thousand words)

csegScript showing code

![](/images/Sharepoint/csegScript1.gif)

## Properties  
  
**Show Code** – Show the code with line numbers to identificate errors  
**Run Code** – The code is executed when you applies changes  
**Script References** – Write here the references of the project (.dll files)  
  
If the file is in windows\\system or in the assembly the path is not necesary so if you need a .dll (as Microsoft.SharePoint.dll) you need include the full path in the server, separe each reference with semicolon  
  
**Script Code** – Visual Basic .NET based code, (Visual studio for applications code)  
  
Separate lines with “\\\\” double backslash, internally they are replaced by carriage returns.

csegScript properties  

![](/images/Sharepoint/csegScript2.gif)

  
  
## Sample script code

This sample code shows all lists in the current site and in subsites with a link to the default list view. (the source is included in the zip file)

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
     Dim subSite As SPWeb
     For Each subSite In allSites
        Dim allSiteLists As SPListCollection = subSite.Lists
        Dim subSiteList As SPList
        For Each subSiteList In  allSiteLists
           output.WriteLine("<IMG SRC='"+subSiteList.ImageUrl+"'></IMG>" & " " &                          
           SPEncode.HtmlEncode(subSite.Name) & " :: " &                          
           "<A HREF='" + subSiteList.DefaultViewUrl & "'>" &                          
           SPEncode.HtmlEncode(subSiteList.Title) &                          
           "</A><BR>")
        Next subSiteList
     Next subSite
  End Sub
  End Module
```

## Special keys
  
output (internally is an HtmlTextWriter object) that you can use in the script code.  
  
`Sample: output.WriteLine(“Hello Sharepoint Developpers”)`  
  
this is a reference to the webpart (internally is a WebPart object)  
  
`Sample: output.WriteLine(_this.Title)`   
 

## Usage in six steps…

1.- Unmark “Run Script”  and mark “Show Script Source”  
2.- Put your code in the properties window, after each line put \\\\ instead of newline.  
3.- Add your system references in the Script References, separated by semicolon (remenber the full path if they are not in assembly)  
4.- Apply changes  
5.- If there are errors you can view the error description, line number and line text, solve the problems and apply changes.  

![](/images/Sharepoint/csegScript4.gif)

  
6.- When all is correct mark “Run Script” and VOILA….

![](/images/Sharepoint/csegScript3.gif)

[Download csegScriptWebPart.zip (7,91 KB)](https://web.archive.org/web/20080216190300/http://www.ideseg.com/ct.ashx?id=d18ae936-4279-4c38-ac71-4c8556089480&url=http%3a%2f%2fwww.ideseg.com%2fcontent%2fbinary%2fcsegScriptWebPart.zip)