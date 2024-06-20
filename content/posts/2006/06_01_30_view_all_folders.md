+++
title = 'View all folders in Document Libraries'
date = 2006-01-27T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Some time ago I write a post with a little trick to add this “missed” option ["View all folders" in Document Libraries]. Now I have needed it in all my documents libraries and the best option is as always modify the list schema file.


Each list definition contains a schema.xml that defines the views, forms, toolbar, and special fields in a list definition. In my production server I have modified the DOCLIB template in “web server extensions\60\TEMPLATE\3082\STS\LISTS\DOCLIB”

![View all folders](/images/Sharepoint/ViewAllFolders.gif)


Using your favorite CAML Editor …. :-) adds the next code after first HTML Tag under Toolbar (relatedtasks) tag entry.


```xml
<HTML>
    <![CDATA[
     <script language="Javascript">
    function LayoutsLink(aspxFullUrl)
    {
       var rootFolder = GetUrlKeyValue("RootFolder");
       if (rootFolder != "")
           aspxFullUrl += "&RootFolder=" + rootFolder;
       window.location.href = aspxFullUrl;
    }
    </script>
    <tr> 
    <td style="padding-left: 2px;padding-bottom: 2px" width=100%&gt; 
    &lt;table border=0 cellpadding=0 cellspacing=0 width=100%&gt; 
    &lt;tr> 
    <td width=100% class="ms-unselectednav" colspan=2> 
    <table cellpadding=0 cellspacing=0 border=0> 
    <tr> 
    <td valign=top> 
    <img src="/_layouts/images/rect.gif">&nbsp; </td> 
    <td>
    <A ACCESSKEY="p" ID="diidFolderListButton" HREF="javascript:" onClick="javascript:LayoutsLink(']]>
</HTML>
 
<HTML>
   <![CDATA[/_layouts/<%=System.Threading.Thread.CurrentThread.CurrentUICulture.LCID%>/folders.aspx?List=]]>
</HTML>
 
<HTML>
   <![CDATA[');javascript:return false;">]]>
</HTML>
 
<HTML>Ver todas las carpetas</HTML>
 
<HTML>
   <![CDATA[</A></td> </tr> </table> </td> </tr> </table> </td> </tr>]]>
</HTML>
```

The final result is as shown in the image.

and the folder view 

![View all folders](/images/Sharepoint/ViewAllFolders1.gif)            