+++
title = 'Sharepoint Access Data'
date = 2005-12-28T00:00:00+01:00
tags = ['sharepoint', 'access']
+++

Continuando con el trabajo que estaba realizando en Access necesitaba poder acceder a las listas de SharePoint e ir agregando el contenido a una tabla de SQL Server.

Como comentaba en el post anterior, por el momento estaba manteniendo una lista de sitios en una tabla de Access, recorriendo dicha tabla cargaba las listas en el SQL Server. Ahora necesito recabar información de los sub-sitios que se encuentran por debajo, con lo cual necesito recuperar las direcciones de dichos sitios para poder cargar los datos en el SQL Server.

Para ello he usado el Web Services Toolkit del office 2003 (se puede descargar aquí), este kit es un complemento que nos ayudará a crear una clase Proxy para acceder a los servicios web.

En este caso voy a usar el servicio webs.asmx para recuperar las sub-webs he modificado el código generado por Web Services Toolkit, dejando el constructor vacio y pasando el código del constructor a un método llamado Connect que usaré para conectarme al sitio.


```vba
'*****************************************************************
'Esta clase fue creada por Web Services Toolkit
' de Microsoft Office 2003
'*****************************************************************
 
Private Const c_SERVICE As String = "Webs"
Private Const c_PORT As String = "WebsSoap"
Private Const c_SERVICE_NAMESPACE As String = "http://schemas.microsoft.com/sharepoint/soap/"
 
Private sc_Webs As SoapClient30
Private WSDL_URL As String
 
Private Sub Class_Initialize()
End Sub
 
Public Sub Connect(url As String)
    Dim str_WSML As String
    str_WSML = ""
 
    Set sc_Webs = New SoapClient30
    
    WSDL_URL = url + "\_vti_bin\webs.asmx?wsdl"
    
    sc_Webs.MSSoapInit2 WSDL_URL, str_WSML, c_SERVICE, c_PORT, c_SERVICE_NAMESPACE
    sc_Webs.ConnectorProperty("ProxyServer") = "<CURRENT_USER>"
    sc_Webs.ConnectorProperty("EnableAutoProxy") = True
End Sub
 
Private Sub Class_Terminate()
    ‘Intercepción de errores
    On Error GoTo Class_TerminateTrap
 
    Set sc_Webs = Nothing
Exit Sub
Class_TerminateTrap:
    WebsErrorHandler ("Class_Terminate")
End Sub
 
Private Sub WebsErrorHandler(str_Function As String)
    ‘Error SOAP
    If sc_Webs.FaultCode <> "" Then
        Err.Raise vbObjectError, str_Function, sc_Webs.FaultString
    ‘Error no SOAP
    Else
        Err.Raise Err.Number, str_Function, Err.Description
    End If
End Sub
 
Public Function wsm_WebUrlFromPageUrl(ByVal str_pageUrl As String) As String
    ‘Intercepción de errores
    On Error GoTo wsm_WebUrlFromPageUrlTrap
 
    wsm_WebUrlFromPageUrl = sc_Webs.WebUrlFromPageUrl(str_pageUrl)
Exit Function
wsm_WebUrlFromPageUrlTrap:
    WebsErrorHandler "wsm_WebUrlFromPageUrl"
End Function
 
Public Function wsm_GetAllSubWebCollection() As MSXML2.IXMLDOMNodeList
    ‘Intercepción de errores
    On Error GoTo wsm_GetAllSubWebCollectionTrap
 
    Set wsm_GetAllSubWebCollection = sc_Webs.GetAllSubWebCollection()
Exit Function
wsm_GetAllSubWebCollectionTrap:
    WebsErrorHandler "wsm_GetAllSubWebCollection"
End Function
 
Public Function wsm_GetListTemplates() As MSXML2.IXMLDOMNodeList
    ‘Intercepción de errores
    On Error GoTo wsm_GetListTemplatesTrap
 
    Set wsm_GetListTemplates = sc_Webs.GetListTemplates()
Exit Function
wsm_GetListTemplatesTrap:
    WebsErrorHandler "wsm_GetListTemplates"
End Function
 
Public Function wsm_GetWeb(ByVal str_webUrl As String) As MSXML2.IXMLDOMNodeList
    ‘Intercepción de errores
    On Error GoTo wsm_GetWebTrap
 
    Set wsm_GetWeb = sc_Webs.GetWeb(str_webUrl)
Exit Function
wsm_GetWebTrap:
    WebsErrorHandler "wsm_GetWeb"
End Function
 
Public Function wsm_GetWebCollection() As MSXML2.IXMLDOMNodeList
    ‘Intercepción de errores
    On Error GoTo wsm_GetWebCollectionTrap
 
    Set wsm_GetWebCollection = sc_Webs.GetWebCollection()
Exit Function
wsm_GetWebCollectionTrap:
    WebsErrorHandler "wsm_GetWebCollection"
End Function
```

Ahora puedo conectarme a un sitio y recuperar la lista de webs de dicho sitio.

Para clarificar un poco la respuesta del servicio he pasado la respuesta a un array de dos dimensiones conteniendo el nombre y la dirección del sitio.

```vba
Sub Test()
    Dim websService As New clsws_Webs
    Dim resultNodeList As IXMLDOMNodeList
    
    websService.Connect "HTTP://SRVTEST/SITES/CSEGROLLUP"
    
    Set resultNodeList = websService.wsm_GetWebCollection
    Debug.Print resultNodeList.Item(0).XML
    
    Dim aWebs() As String
    
    ProcesaRespuesta resultNodeList, aWebs
    
    For i = 0 To UBound(aWebs)
        Debug.Print aWebs(i, 0)
        Debug.Print aWebs(i, 1)
    Next i
End Sub
 
Sub ProcesaRespuesta(resultWebCollection As IXMLDOMNodeList, ByRef aWebs() As String)
    Dim i As Integer
    Dim webs As IXMLDOMNode
    Dim web As IXMLDOMNode
    
    Set webs = resultWebCollection.Item(0)
    
    ReDim aWebs(webs.childNodes.length, 1)
    
    For i = 0 To webs.childNodes.length – 1
        Set web = webs.childNodes.Item(i)
        aWebs(i, 0) = web.Attributes.getNamedItem("Title").Text
        aWebs(i, 1) = web.Attributes.getNamedItem("Url").Text
    Next
    
End Sub
```

Ahora un poquito de recursiviad y voila …