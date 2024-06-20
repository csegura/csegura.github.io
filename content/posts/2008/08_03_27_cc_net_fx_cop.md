+++
title = 'cc.net fx cop'
date = 2008-03-27T00:00:00+01:00
tags = ['']
+++

Dentro del proceso de integración continua que uso, los proyectos que no tienen un archivo FxCop, los proceso usando una plantilla a la que añado mediante una tarea en el MsBuild, los targets necesarios para después poder ver si hay algo muy cantoso …

La cosa es que en el resto de proyectos mantengo un archivo FxCop, en el que voy excluyendo algunas de esas cosas cantosas tras revisar el código.  El problema viene cuando en el build server, se ejecuta el FxCop, y genera el informe, ya que en este informe aparecen todas las incidencias, incluidas las que yo he excluido. (grrr)

De modo que he decidido acabar de una vez con el problemilla.. lo que hago ahora es procesar el informe de FxCop con el XSL (que os dejo abajo) para que cuando el CC, haga el merge, solo estén las activas.


```xml
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="xml" indent="yes"/>
 
    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
 
  <xsl:template match="//Message">
    <xsl:if test="self::node()/@Status=’Active’">
      <xsl:copy-of select="self::node()" />
    </xsl:if>
  </xsl:template>
 
</xsl:stylesheet>
```


Para procesar el XML, podéis usar la tarea XSLT del Community.Tasks, para MSBuild.


```xml
<Exec Command="$(FxCopExe) /project:$(FxCopProject)/out:$(ArtifactPath)\$(FxCopReport)temp" />          
<Xslt Inputs="$(ArtifactPath)\$(FxCopReport)temp"        
      Xsl="$(FxCopActive)"
      Output="$(ArtifactPath)\$(FxCopReport)" />
```

Y listo ..