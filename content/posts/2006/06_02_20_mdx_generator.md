+++
title = 'MDX Generator'
date = 2006-02-20T00:00:00+01:00
tags = ['mdx']
+++

Continuando con el trabajo que estaba realizando para mostrar información del Analisys Services en SharePoint, he realizado un pequeño programa en Excel para exportar las sentencias MDX (Nota: todavía no he visto el editor del SQL2005 y puede que este sea una maravilla, el del SQL2000 sin comentarios), con lo cual puedo usar Excel con una tabla dinámica para diseñar el informe y exportar este para usarlo con el webpart de OLAP que estaba realizando. Usando el contenido del un .dwp podríamos generar un webpart completo para importar en SharePoint.
Este ejemplo generará un archivo XML con la definición del informe con esta sintaxis.

```xml
<?xml version=”1.0″ encoding=”utf-8″?>
<informe>
  <nombre>Informe de Prueba</nombre>
  <descripcion>Informe de ventas de la base de datos FoodMart 2000</descripcion>
  <conexion>
   OLEDB;Provider=MSOLAP.2;Persist Security Info=True;Data Source=srvdatos;Initial Catalog=FoodMart 2000;
   Client Cache Size=25;Auto Synch Period=10000
  </conexion>
  <mdx>
    <![CDATA[
    SELECT NON EMPTY HIERARCHIZE({
    DrillDownLevel({
        [Product].[All Products]
      })
    })
    DIMENSION PROPERTIES PARENT_UNIQUE_NAME ON COLUMNS ,
              NON EMPTY HIERARCHIZE({
              DrillDownMember(
              {{
                DrillDownMember({DrillDownLevel({
                  [Customers].[All Customers]
                }
              )},
              {[Customers].[All Customers].[USA]})}}, 
              {[Customers].[All Customers].[USA].[CA]})})
              DIMENSION PROPERTIES PARENT_UNIQUE_NAME ON ROWS
              FROM [Warehouse and Sales] WHERE ([Measures].[Sales Count])
   ]]>
   </mdx>
</informe>
```

Pasos para hacer nuestro diseñador de informes.

![](/images/sharepoint/excel_tabla_dinamica.gif)


- Abrir excel
- Crear un informe de tabla dinámica usando el asistente de excel
- Configurar el informe a nuestro gusto
- Llamar a la macro de exportar informe (yo le he hecho un bonito formulario …)


```vba
Sub ExportaXML(sNombre As String, sDesc As String)
    Dim xmlDoc As DOMDocument
    Dim xmlNode As IXMLDOMNode
    Dim xmlAttribute As IXMLDOMAttribute
    Dim xmlInforme As IXMLDOMNode
    Dim xmlPi As IXMLDOMProcessingInstruction
    Set xmlDoc = New DOMDocument
    Dim xmlText As IXMLDOMText
    Dim sArchivo
    sArchivo = Application.GetSaveAsFilename(“”, “Archivo MDX,(*.xml)”, , “Archivo MDX en XML”)

    If sArchivo <> False Then
        Set xmlPi = xmlDoc.createProcessingInstruction(“xml”, “version=”“1.0″“”)
        Set xmlNode = xmlDoc.appendChild(xmlPi)
        Set xmlInforme = xmlDoc.createElement(“informe”)
        Set xmlNode = xmlDoc.appendChild(xmlInforme)
        Set xmlNode = xmlDoc.createElement(“nombre”)
        Set xmlText = xmlNode.appendChild(xmlDoc.createTextNode(sNombre))
        Set xmlNode = xmlInforme.appendChild(xmlNode)
        Set xmlNode = xmlDoc.createElement(“descripcion”)
        Set xmlText = xmlNode.appendChild(xmlDoc.createTextNode(sDesc))
        Set xmlNode = xmlInforme.appendChild(xmlNode)
        Set xmlNode = xmlDoc.createElement(“conexion”)
        Set xmlText = xmlNode.appendChild(xmlDoc.createTextNode(ActiveSheet.PivotTables(1).PivotCache.Connection))
        Set xmlNode = xmlInforme.appendChild(xmlNode)
        Set xmlNode = xmlDoc.createElement(“mdx”)
        Set xmlText = xmlNode.appendChild(xmlDoc.createTextNode(ActiveSheet.PivotTables(1).MDX))
        Set xmlNode = xmlInforme.appendChild(xmlNode)

        xmlDoc.Save (sArchivo)
    End If
End Sub
```

![](images/Sharepoint/excel_csegOLAP.gif)


