+++
title = 'MOSS 2007 WebParts 3'
date = 2006-08-25T00:00:00+01:00
tags = ['sharepoint']
+++

Siguiendo con lo expuesto anteriormente, lo primero es revisar el formato en que se exportan las webparts basadas en Asp.Net 2.0. Una vez exportado nuestro webpart lo primero que vemos es que la extensión a cambiado, de .dwp (las webparts de WSS2) a .webpart


También podemos observar que el espacio de nombres corresponde con la v3 <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">, esto solo ocurre con las webparts nativas ya que por compatibilidad las webparts que usen la api Microsoft.SharePoint.WebPart, mantendrán el formato .dwp

```xml	
<webParts>
  <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">
    <metaData>
      <type name="MiWebPart.MiPrimerWebPart, MiWebPart, Version=1.0.0.0, Culture=neutral, PublicKeyToken=d196fc71b3d34a48" />
      <importErrorMessage>Error importando el webpart</importErrorMessage>
    </metaData>
    <data>
      <properties>
        <property name="AllowClose" type="bool">True</property>
        <property name="Width" type="unit" />
        <property name="AllowMinimize" type="bool">True</property>
        <property name="MensajeVisible" type="bool">False</property>
        <property name="AllowConnect" type="bool">True</property>
        <property name="ChromeType" type="chrometype">Default</property>
        <property name="TitleIconImageUrl" type="string" />
        <property name="Description" type="string">Mi descripción</property>
        <property name="Hidden" type="bool">False</property>
        <property name="TitleUrl" type="string" />
        <property name="AllowEdit" type="bool">True</property>
        <property name="Height" type="unit" />
        <property name="HelpUrl" type="string" />
        <property name="Title" type="string">Mi Primer WebPart</property>
        <property name="CatalogIconImageUrl" type="string" />
        <property name="Direction" type="direction">NotSet</property>
        <property name="ChromeState" type="chromestate">Normal</property>
        <property name="AllowZoneChange" type="bool">True</property>
        <property name="AllowHide" type="bool">True</property>
        <property name="HelpMode" type="helpmode">Navigate</property>
        <property name="ExportMode" type="exportmode">All</property>
      </properties>
    </data>
  </webPart>
</webParts>
```
 
Era importante revisar este nuevo formato, por que es el que tendremos que usar si queremos instalar nuestro webpart desde un archivo .CAB como hacíamos en la versión 2 y usar el STSADM. 

Nuestro .webpart que forma parte del proyecto contendrá como mínimo lo siguiente:

```xml	
<?xml version="1.0" encoding="utf-8"?>
<webParts>
  <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">
    <metaData>
      <type name="MiWebPart.MiPrimerWebPart, MiWebPart, Version=1.0.0.0, Culture=neutral, PublicKeyToken=d196fc71b3d34a48" />
      <importErrorMessage>Error importando el webpart</importErrorMessage>
    </metaData>
    <data>
      <properties>
        <property name="Title" type="string">Mi Primer WebPart</property>
        <property name="Description" type="string">Mi descripción</property>
      </properties>
    </data>
  </webPart>
</webParts>
```
 


Para poder instalar nuestro archivo .CAB, debemos crear un manifiesto, este manifiesto por el momento es el mismo que se venia usando con la versión 2 y desconozco si realizarán un nuevo formato para esta nueva versión. Bien, entonces nuestro manifiesto será el siguiente:

```xml
<?xml version="1.0"?>
<WebPartManifest xmlns="http://schemas.microsoft.com/WebPart/v2/Manifest">
  <Assemblies>
    <Assembly FileName="MiWebPart.dll">     
      <SafeControls>
        <SafeControl
          Namespace="MiWebPart"
          TypeName="*"
        />
      </SafeControls>
    </Assembly>
  </Assemblies>
  <DwpFiles>
    <DwpFile FileName="MiPrimerWebPart.webpart"/>
  </DwpFiles>
</WebPartManifest>
```

La única diferencia con los manifiestos que veníamos haciendo es que en vez de especificar un archivo .dwp ahora especificamos un archivo .webpart

Por último nos queda crear un nuevo proyecto de instalación .CAB, y unirlo a nuestro proyecto del webpart.

![](/images/Sharepoint/moss2007wp6.gif)
