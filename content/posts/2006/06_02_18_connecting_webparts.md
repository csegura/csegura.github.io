+++
title = 'Connecting WebParts'
date = 2006-02-18T00:00:00+01:00
tags = ['']
+++

He estado pensando en las nuevas características que tendrá la versión 3.5 del csegRollUp (como siempre, si alguien tiene sugerencias que las diga)  por el momento dejo unas pequeñas pistas aquí. He estado trabajando con unas bibliotecas de documentos que contiene un meta dato llamado estado, la idea era mostrar los últimos archivos modificados por cada usuario dentro de un estado en particular, bien para esto basta con hacer una vista de la biblioteca de documentos y mostrar la vista organizada en categorías (cada estado una categoría). Esto esta muy bien pero en ocasiones el diseño ha de ser más funcional y esto es lo que ha salido usando el csegRollUp.
El primer csegRollUp va a mostrar un menú con los distintos estados, seleccionando uno de los estados se mostrarán en un segundo csegRollUp los documentos que tienen  dicho estado.


Para el primer csegRollUp se puede usar un pequeño truco si lo que queremos es hacer una transformación XSLT, que es poner un guión en el nombre de la lista y otro en el nombre de los campos, después podemos nuestro XSLT, (esto se podría hacer con un webpart de contendo, pero lo interesante aquí es aprovechar el interface cell provider de csegRollUp)

```xml	
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method ="html"/>
  <xsl:template match="/">
    <a href="javascript:__doPostBack('','Estado A')">Ver los del estado A</a>
    <br/>
    <a href="javascript:__doPostBack('','Estado B')">Ver los del estado B</a>
    <br/>
  </xsl:template>
</xsl:stylesheet>
```

Este xslt pasará el estado a un segundo csegRollUp, donde mostraremos los documentos en función del estado, para ello en el segundo:


Lista: Nustra biblioteca favorita
Campos: FileRef,LinkFilename,EncodedAbsUrl,Modified,DocIcon,Author,Estado


XSLT

```xml
<?xml version='1.0′ encoding='utf-8′?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" />
  <xsl:template match="/">
    <table class="ms-summarycustombody">
      <tbody>
        <xsl:for-each select="Rows/Row">
          <xsl:sort select="Modified" order="descending"/>
          <tr>
            <td width="24px">
              <img src="/_layouts/images/ic{DocIcon}.gif" alt="{FileRef}"/>
            </td>
            <td width="100%">
              <xsl:value-of select="LinkFilename" />
              <br/>
              <font color="#999999">
                (<xsl:value-of select="substring-before(Modified,' ‘)" />)
              </font>
            </td>
            <td width="24px">
              <a href="{substring-before(FileRef,LinkFilename)}">
                <img border="0" src="/_layouts/images/folder.gif" alt="Ir a la carpeta"/>
              </a>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
```


Y por último lo más importante la CAML query que recogerá el valor pasado.

```xml
<Where>
  <And>
    <Eq>
      <FieldRef Name="Author" />
      <Value Type='Text'>[UserName]</Value>
    </Eq>
    <Eq>
      <FieldRef Name="Estado" />
      <Value Type='Text'>[CellProvider]</Value>
    </Eq>
  </And>
</Where>
```

El resultado tras conectar los dos webparts:

![](/images/Sharepoint/Conectando_csegRollUp.gif)