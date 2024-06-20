+++
title = 'Talking SOAP Sharepoint'
date = 2005-05-10T00:00:00+01:00
tags = ['sharepoint']
draft = false
+++

Outlook integration with Sharepoint, is not bad, but it could be better. Sharepoint Event and Contact lists has a decent integration in Sharepoint, but when I create a new customized list, I don´t have any link to Outlook.  
  
Thinking about this, I need to be able to pass data of my customized forms in outlook to sharepoint and viceversa.  
  
Working arround the problem, I have created a Outlook form with such fields that one of my sharepoint list, now the problem is how to send this form data from Outlook to Sharepoint. After creating the form the only thing that it knew clearly it was that it had to use the Web services of sharepoint to send the data.  
  
Outlook uses vbscript, and it did not know like implementing a call to the web services from vbscript, so a long time ago I wrote an application in asp that called to a web service and I use soap to communicate with the service, I have thought that there would not be much difference between that code and what it wanted to do.  
  
SOAP is Short for Simple Object Access Protocol, a lightweight XML-based messaging protocol used to encode the information in Web service request and response messages.  
  
So that to test some I have written two shell scrips.  
  
GetListItems.vbs is a script that returns all items in a lists  

```vbs	
Set connector \= CreateObject(“MSOSOAP.HttpConnector30″)  
connector.Property(“EndPointURL”) \= Wscript.Arguments(0)  
connector.Property(“SoapAction”) \= “http://schemas.microsoft.com/sharepoint/soap/GetListItems”  
connector.Connect  
 
Set serializer \= CreateObject(“MSOSoap.SoapSerializer30″)  
 
With serializer  
    .Init(connector.InputStream)  
    .startEnvelope()  
    .startBody()  
    .StartElement “GetListItems”, “http://schemas.microsoft.com/sharepoint/soap/”  
    .StartElement “listName”, “http://schemas.microsoft.com/sharepoint/soap/”  
    .WriteString(Wscript.Arguments(1))  
    .EndElement()  
    .EndElement()  
    .endBody()  
    .endEnvelope()  
End With  
 
connector.EndMessage()  
 
Set reader \= CreateObject(“MSOSOAP.SoapReader30″)  
reader.Load(connector.OutputStream)  
Wscript.echo reader.Body.xml   
```	

Usagee: cscript GetListItems.vbs “http://your server/site/\_vti\_bin/lists.asm“ “ListName”  
 
UpdateListItems.vbs is a script that update a list with fixed values, you can use this code to put in a form in Outlook to send form data to sharepoint. Only you need put your form data in sBath string.  

```vbs	
sBatch \= ““ & \_  
“Nuevo“ & \_  
“Software“ & \_  
“My Comment“ & \_  
“”  
 
Set connector \= CreateObject(“MSOSOAP.HttpConnector30″)  
connector.Property(“EndPointURL”) \= “/\_vti\_bin/lists.asmx”  
connector.Property(“SoapAction”) \=“http://schemas.microsoft.com/sharepoint/soap/UpdateListItems”  
connector.Connect  
 
Set serializer \= CreateObject(“MSOSoap.SoapSerializer30″)  
with serializer  
    .Init(connector.InputStream)  
    .startEnvelope()  
    .startBody()  
    .StartElement “UpdateListItems”, “http://schemas.microsoft.com/sharepoint/soap/”  
    .StartElement “listName”, “http://schemas.microsoft.com/sharepoint/soap/”  
    .WriteString(“ “)  
    .EndElement()  
    .StartElement “updates”, “http://schemas.microsoft.com/sharepoint/soap/”  
    .WriteXML(sBatch)  
    .EndElement()  
    .EndElement()  
    .endBody()  
    .endEnvelope()  
End With  
connector.EndMessage()  
Set reader \= CreateObject(“MSOSOAP.SoapReader30″)  
reader.Load(connector.OutputStream)  
Wscript.echo reader.Body.xml
``` 

Now I can use XPath to cross the data and pass them to outlook. I’m writing an application to sincronize any list from sharepoint to outlook.