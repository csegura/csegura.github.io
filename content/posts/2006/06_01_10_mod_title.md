+++
title = 'Modify title'
date = 2006-01-10T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Lo primero advierto que esta practica no esta del todo recomendada. Pero seguro que en más de una ocasión os habéis encontrado con el problema que supone tener el campo Título pre-configurado por SharePoint, (por lo menos deja cambiarle el nombre) pero no deja de ser una limitación en muchos casos que el tipo predeterminado sea un campo alfanumérico de 255 caracteres.

La definición en CAML del campo Título es la siguiente:

```xml	
<Field Type="Text" DisplayName="Título" MaxLength="255" Name="Title" ColName="nvarchar1" />
```

Algunas veces he editado este campo usando CAML y he cambiado el tipo (yo por el momento no he tenido problemas al hacerlo pero como he dicho al principio es una practica que no se aconseja). Hoy trasteando he recordado que alguien (no recuerdo quien si no lo pondría) había realizado un webpart para resetear el campo Título,  de manera que después se le pudiera cambiar el tipo. De modo que he echado mano de mi webpart csegScript, y en unos minutos he dado con el código.

```vb	
imports Microsoft.SharePoint 
imports Microsoft.SharePoint.Utilities 
imports Microsoft.SharePoint.WebPartPages 
imports Microsoft.SharePoint.WebControls 
imports System.Web.UI 
imports System 
 
Module Script 
Public Sub Main() 
 
Dim site As SPSite = SPControl.GetContextSite(System.Web.HttpContext.Current) 
Dim allSites As SPWebCollection = site.AllWebs 
Dim subSite As SPWeb = allSites(0) 
 
    if (Param1<>"") and (Param2<>"") then 
    
        Dim list as SPList = subSite.Lists(Param1) 
        Dim field As SPField = list.Fields(Param2) 
        
        output.WriteLine("<br>Current SchemaXml:" + SPEncode.HtmlEncode(field.SchemaXml)) 
        
        Dim schemaXML As String = "<Field Type=""Text""  DisplayName=""" & field.Title & 
                        """ MaxLength=""255"" Name=""" & field.InternalName  & """ ColName=""nvarchar2"" />" 
        
        output.WriteLine("<pre>" & SPEncode.HtmlEncode(schemaXML) & "</pre>") 
        output.flush() 
        
        try 
        
            field.SchemaXml = schemaXML 
            ‘field.Update() 
            output.WriteLine("<font color=red>Ok</font>") 
        
        catch ex As Exception 
        
            output.WriteLine("<font color=red>Error</font>") 
            output.WriteLine(ex.Message) 
        
        end try 
        
        output.WriteLine("<table width=’100%’><tr><td>Name</td><td>Description</td><td>InternalName</td><td>Type</td></tr>") 
        
        output.WriteLine("<tr><td>"+
            SPEncode.HtmlEncode(field.Title)+"</td><td>"+
            SPEncode.HtmlEncode(field.Description)+"</td><td>"+
            SPEncode.HtmlEncode(field.InternalName)+"</td><td>"+
            SPEncode.HtmlEncode(field.TypeAsString)+"</td></tr>") 
        
        output.WriteLine("</table>") 
    
    End If 
 
End Sub 
End Module
```
Este script requiere el nombre de la lista como Param1 y el nombre del campo a resetear como Param2.

Después de ejecutar el script y entrar a modificar la configuración de la lista y el campo, podeís cambiarle el tipo.


 