+++
title = 'ajax searches'
date = 2006-04-28T00:00:00+01:00
tags = ['sharepoint']
+++

This is other sample of how I am using Ajax in my SharePoint environment (see Using Ajax to query Exchange Server Part 1 and Part 2) , now I’m using it to improve my searches in SPS.

![](images/Sharepoint/ajax_search.gif)

First I have added a new page to make the searches, this new page runs under SPS context and it is stored under Layouts directory. This is very basic search page that look at the "DAV:displayname" field to locate files that contains a keyword in the name. This page use a query string to get the keyword and the results are written in HTML. (You can use other queries here).
 

csegAjaxSearch.aspx

```
<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,

Microsoft.SharePoint,Version=11.0.0.0, Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"

Assembly="Microsoft.SharePoint, Version=11.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePointPortal" Namespace="Microsoft.SharePoint.Portal"

Assembly="Microsoft.SharePoint.Portal, Version=11.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Import Namespace="Microsoft.SharePoint.Utilities" %> 
<%@ Import Namespace="Microsoft.SharePoint.Portal" %>
<%@ Import Namespace="Microsoft.SharePoint.Portal.Topology" %>
<%@ Import Namespace="Microsoft.SharePoint.Portal.Search" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Text" %>
 
<%
    TopologyManager topology = new TopologyManager();
    PortalSite portal = topology.PortalSites[new Uri("<USE YOUR SERVER HERE>")];
    PortalContext context = PortalApplication.GetContext(portal);
    QueryProvider qp = new QueryProvider(context.SearchApplicationName);
 
    string keyword = Request["k"];
    
    if(keyword!=null && keyword.Trim()!="")
    {
        string queryTemplate = "SELECT \"DAV:href\", " +
                               "\"DAV:displayname\", " +
                               "\"urn:schemas.microsoft.com:fulltextqueryinfo:description\", " +
                               "\"urn:schemas-microsoft-com:office:office#ows_SiteName\" " +
                               "FROM ( TABLE Portal_Content..Scope() " +
                               "UNION ALL TABLE Non_Portal_Content..Scope() ) " +
                               "WHERE CONTAINS(\"DAV:displayname\", ‘\"*" + 
                               keyword.Replace("‘", """).Replace("\"", "\"\"") + "*\"‘) ";
        Response.Write(queryTemplate);
        
        DataSet ds = qp.Execute(queryTemplate);
 
        StringBuilder sb = new StringBuilder();
    
        if(ds != null)
        {
           sb.Append("<UL>");
           foreach(DataRow dr in ds.Tables[0].Rows)
           {
              sb.AppendFormat("<LI><A href=’{0}’>{1}</A><BR/>{2}<BR/>{3}<BR/></LI>",
                 SPEncode.HtmlEncode(dr["DAV:href"].ToString()),
                 SPEncode.HtmlEncode(dr["DAV:displayname"].ToString()),
                 SPEncode.HtmlEncode(dr["urn:schemas.microsoft.com:fulltextqueryinfo:description"].ToString()),
                 SPEncode.HtmlEncode(dr["urn:schemas-microsoft-com:office:office#ows_SiteName"].ToString()));
           }
           sb.Append("</UL>");
        }
        else
        {
           sb.Append("<P>No results</P>");
        }
      
        Response.Write(sb.ToString());
    }
%>   
```

In a new area of my SPS server I have added a Html Form webpart, that use ajax to return the results. Here is the code.


```html
<script language="javascript">
var xmlHttpReq;
 
function initHttpRequest()
{
    try 
    {
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch(ex)
    {
        xmlHttpReq = null;
    }    
}
 
function sendQuery(keywords)
{
    var serverUrl = "http://YOUR SERVER/_layouts/csegAjaxSearch.aspx?k=" + keywords;
    
    initHttpRequest();
   
    if (xmlHttpReq != null)
    {
        xmlHttpReq.onreadystatechange = checkState;
        xmlHttpReq.open("GET", serverUrl, true);
        xmlHttpReq.send(null);
    }    
}
 
function checkState()
{
    // Load completed
    if (xmlHttpReq.readyState == 4)  
    {
        // Status OK
        if (xmlHttpReq.status == 200)
        {
            document.getElementById("Results").innerHTML = xmlHttpReq.responseText;
        }
        // Error
        else
        {
           document.getElementById("Results").innerHTML = "<b>There is an error in the service</b>";
        }
    }
}
</script>
 
<form name="form">
  <input name="keyword" onKeyUp="sendQuery(this.value)" style="WIDTH:500px" autocomplete="off">
  <div align="left" id="Results" style="width:100%"></div>
</form>
```