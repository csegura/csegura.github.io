+++
title = 'View Folders in document libraries'
date = 2007-03-06T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++


Si recordáis en WSS2 teníamos una opción para ver las carpetas de una biblioteca de imágenes, que por alguna misteriosa razón, no se encontraba disponible en las bibliotecas de documentos.  
  
En su día, con un simple truco, podíamos tener esta opción en las bibliotecas de documentos. ([http://www.ideseg.com/SharePointViewAllFoldersInDocumentLibraries.aspx](https://web.archive.org/web/20130623110633/http://www.ideseg.com/SharePointViewAllFoldersInDocumentLibraries.aspx)) he recordado esto esta mañana cuando me he dado cuenta de que esta opción ya no está disponible ni en las bibliotecas de imágenes ni en las bibliotecas de documentos.  
  
Ahora bien, en la carpeta (\_layouts) sigue estando el archivo folders.aspx, por lo que bastaría otro simple truco (ahora una FEATURE) para devolver esa útil vista.  

  
```html
<span class="kwrd">&lt;?</span><span class="html">xml</span> <span class="attr">version</span><span class="kwrd">=”1.0″</span> <span class="attr">encoding</span><span class="kwrd">=”utf-8″</span> ?<span class="kwrd">&gt;</span>
<span class="kwrd">&lt;</span><span class="html">Feature</span> <span class="attr">Id</span><span class="kwrd">=”5A7074FE-C628-47eb-B905-94BF8DFD4ED4″</span>
    <span class="attr">     Title</span><span class="kwrd">=”Vista de explorador”</span>
    <span class="attr">     Description</span><span class="kwrd">=”Permite navegar sobre una biblioteca de documentos”</span>
    <span class="attr">     Version</span><span class="kwrd">=”1.0.0.0″</span>
         <span class="attr">Scope</span><span class="kwrd">=”Web”</span> 
         <span class="attr">Hidden</span><span class="kwrd">=”FALSE”</span>
    <span class="attr">     ImageUrl</span><span class="kwrd">=”actionssettings.gif”</span>
      <span class="attr">   xmlns</span><span class="kwrd">=”http://schemas.microsoft.com/sharepoint/”</span><span class="kwrd">&gt;</span>
  <span class="kwrd">&lt;</span><span class="html">ElementManifests</span><span class="kwrd">&gt;</span>
    <span class="kwrd">&lt;</span><span class="html">ElementManifest</span> <span class="attr">Location</span><span class="kwrd">=”TreeExplorer.xml”</span> <span class="kwrd">/&gt;</span>
  <span class="kwrd">&lt;/</span><span class="html">ElementManifests</span><span class="kwrd">&gt;</span>
<span class="kwrd">&lt;/</span><span class="html">Feature</span><span class="kwrd">&gt;</span>
``` 

Y el TreeExplorer.xml

  
```html
<span class="kwrd">&lt;</span><span class="html">Elements</span> <span class="attr">xmlns</span><span class="kwrd">=”http://schemas.microsoft.com/sharepoint/”</span><span class="kwrd">&gt;</span>
  <span class="kwrd">&lt;</span><span class="html">CustomAction</span>
    <span class="attr">Title</span><span class="kwrd">=”Explorardor”</span>
    <span class="attr">RegistrationType</span><span class="kwrd">=”List”</span>
    <span class="attr">RegistrationId</span><span class="kwrd">=”101″</span>
    <span class="attr">GroupId</span><span class="kwrd">=”ActionsMenu”</span>
    <span class="attr">Location</span><span class="kwrd">=”Microsoft.SharePoint.StandardMenu”</span>
    <span class="attr">Id</span><span class="kwrd">=”IdeSeg_TreeExplorer”</span>
    <span class="attr">ImageUrl</span><span class="kwrd">=”_layouts/images/GORTL.GIF”</span><span class="kwrd">&gt;</span>
    <span class="kwrd">&lt;</span><span class="html">UrlAction</span> <span class="attr">Url</span><span class="kwrd">=”/_layouts/folders.aspx?List={ListId}”</span> <span class="kwrd">/&gt;</span>
  <span class="kwrd">&lt;/</span><span class="html">CustomAction</span><span class="kwrd">&gt;</span>
<span class="kwrd">&lt;/</span><span class="html">Elements</span><span class="kwrd">&gt;</span>
```
  
Esto nos añadirá una opción bajo el menú de acciones de una biblioteca de documentos para poder recuperar esa vista.

![](/images/Sharepoint/FoldersASPX.gif)

  

No es lo más bobnito del mundo, pero ayuda …