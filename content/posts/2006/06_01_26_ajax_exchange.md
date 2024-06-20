+++
title = 'Querying an exchange server 2'
date = 2006-01-27T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Part 2


Changing the dav web query, you can get more data (see urn:content-classes:message and Default Exchange Store Namespaces for other namespaces) now to complete the sample the new query is


```sql
SELECT "urn:schemas:httpmail:datereceived", 
       "DAV:href", 
       "urn:schemas:httpmail:sendername", 
       "urn:schemas:httpmail:subject" 
FROM scope('shallow traversal of ')
WHERE "DAV:ishidden"=False AND "DAV:isfolder"=False
```


And to watch the xml results obtained by the query we can modify the checkState function. 

```javascript
function checkState()
{
  if (xmlHttpReq.readyState == 4)
  {
    divOutput.innerText = xmlHttpReq.ResponseXML.xml;
  }
}
```

Better than parse DOM to get the results I prefer use XSL, now I can copy the XML results in my favorite XSLT editor and map the data. After I can add the xsl to the page and transform the xml usig it. The final result is as shown in the image.

![](/images/Sharepoint/webcontent-exchange-query2.gif)


```html
<script language=javascript>
var sUser = "USERNAME";
var sExchangeServer = "http://SERVER";
var sFolder = "FOLDER";
 
var xmlHttpReq;
 
function getMessages()
{
    …..
     
        var sDavQuery = 'SELECT  "urn:schemas:httpmail:datereceived", ' +
                              '"urn:schemas:httpmail:sendername", ' +
                              '"DAV:href", ' +
                              '"urn:schemas:httpmail:subject" ' +
                            ' FROM scope(\'shallow traversal of "' + sURL + '"\' )' +
                           ' WHERE "DAV:ishidden"=False AND "DAV:isfolder"=False ';
                           
    …..
}
 
 
function checkState()
{
  if (xmlHttpReq.readyState == 4)
  {
    var xml = xmlHttpReq.ResponseXML;
    divOutput.innerHTML = xml.transformNode(xslTemplate.documentElement);        
  }
}
getMessages();
 
</script>
<div id='divOutput'></div>
 
<xml id='xslTemplate'>
 
   <xsl:template xmlns:xsl='uri:xsl' xmlns:a='DAV:' xmlns:d='urn:schemas:httpmail:'>
      <table>
      
          <tr class="ms-TPHeader">
            <td> Date </td>
            <td> From </td>
            <td> Subject </td>
          </tr>
          
         <xsl:for-each select='a:multistatus/a:response/a:propstat/a:prop'>
            <tr class="ms-WPBody">
               <td>
                  <xsl:value-of select='d:datereceived' />
               </td>
               <td>
                  <xsl:value-of select='d:sendername' />
               </td>
               <td>
                  <a>
                     <xsl:attribute name='href'>
                     <xsl:value-of select='a:href' />
 
                     /?Cmd=open</xsl:attribute>
 
                     <xsl:attribute name='target'>_blank</xsl:attribute>
 
                     <xsl:value-of select='d:subject' />
                  </a>
               </td>
            </tr>
         </xsl:for-each>
      </table>
   </xsl:template>
 
</xml>
```