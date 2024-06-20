+++
title = 'Querying an exchange server'
date = 2006-01-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

We can use asynchronous data retrieval, inside of a WebContent webpart, this is a little sample of how to do it.

Part 1


Querying an exchange server and retry results inside of sharepoint webpart, this first sample use the Search web dav method using XMLHTTP request (Exchange Store WebDAV Protocol), query the last five elements from user inbox and gets the date received, the sender name and the subject.

```sql
SELECT "urn:schemas:httpmail:datereceived", 
       "urn:schemas:httpmail:sendername", 
       "urn:schemas:httpmail:subject" 
FROM scope(‘shallow traversal of ‘)

WHERE "DAV:ishidden"=False AND "DAV:isfolder"=False
```

![](/images/Sharepoint/webcontent-exchange-query.gif)

In the code, replace the sUser, sExchangeServer and sFolder vars, add a web content webpart and paste the code inside.

```html
<script language=javascript>
 
var sUser = "USERNAME";
var sExchangeServer = "http://SERVER";
var sFolder = "FOLDER";
 
var xmlHttpReq;
 
function getMessages()
{
   var sURL = sExchangeServer + "/exchange/" + sUser + "/" + sFolder;
    
    if (sUser!="" && sURL!="")
    {
      xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");  
    
      xmlHttpReq.open("SEARCH", sURL, true);
      xmlHttpReq.setRequestHeader("Content-type:", "text/xml");
      xmlHttpReq.setRequestHeader("Depth", "1″);
     
      xmlHttpReq.onReadyStateChange = checkState;
     
      // Our webDav query
      var sDavQuery = ‘SELECT "urn:schemas:httpmail:datereceived", ‘ +
                              ‘"urn:schemas:httpmail:sendername", ‘ +
                              ‘"urn:schemas:httpmail:subject" ‘ +
                           ‘ FROM scope(\’shallow traversal of "‘ + sURL + ‘"\’ )’ +
                           ‘ WHERE "DAV:ishidden"=False AND "DAV:isfolder"=False ‘;
 
      // The request package                           
      var sSearchRequest = "<?xml version=’1.0′ ?>" +
                           "<a:searchrequest xmlns:a=’DAV:’><a:sql>" + 
                                 sDavQuery +     
                           "</a:sql></a:searchrequest>";
      
      // Max results
      xmlHttpReq.SetRequestHeader("Range", "rows=0-4″);
    
      xmlHttpReq.Send(sSearchRequest);
    }
}
 
function checkState()
{
  if (xmlHttpReq.readyState == 4)
  { 
     var xml = xmlHttpReq.responseXML.documentElement;
    
     // Parse xml – table to present results 
     var xmlResults = xml.getElementsByTagName(‘a:prop’);
        
     var domTableResults = document.createElement(‘TABLE’);
        
     domTableResults.setAttribute(‘cellPadding’,5);
        
     var tmp = document.createElement(‘TBODY’);
        
     domTableResults.appendChild(tmp);
     var domTableRow = document.createElement(‘TR’);
     domTableRow.setAttribute(‘class’,‘ms-TPHeader;’);
        
     // Table header
     for (j=0;j<xmlResults[0].childNodes.length;j++)
     {
        if (xmlResults[0].childNodes[j].nodeType != 1) 
            continue;
        
        var container = document.createElement(‘TH’);
        var theData = document.createTextNode(xmlResults[0].childNodes[j].nodeName);
        
        container.appendChild(theData);
        domTableRow.appendChild(container);
     }
    
     tmp.appendChild(domTableRow);
        
     // Table rows
     for (i=0;i<xmlResults.length;i++)
     {
        var domTableRow = document.createElement(‘TR’);
        domTableRow.setAttribute(‘class’,‘ms-WPBody;’);
            
        for (j=0;j<xmlResults[i].childNodes.length;j++)
        {
            if (xmlResults[i].childNodes[j].nodeType != 1) 
            continue;
            
          var container = document.createElement(‘TD’);
          var theData = document.createTextNode(xmlResults[i].childNodes[j].firstChild.nodeValue);
                
          container.appendChild(theData);
          domTableRow.appendChild(container);
        }
            
        tmp.appendChild(domTableRow);
     }
    
     document.getElementById(‘divOutput’).appendChild(domTableResults);
  }
}
getMessages();
</script>
<div id='divOutput'></div>
```