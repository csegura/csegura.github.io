+++
title = 'Loading pages in an iframe'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Uno de los problemas con los que me he encontrado cuando se cargan documentos html en una biblioteca de documentos es que cuando Sharepoint indexa el contenido de dichos documentos, al cárgalos  se pierde toda la estética del portal, esto también ocurre cuando abrimos los documentos desde una biblioteca de documentos.

![](https://web.archive.org/web/20080216182515im_/http://www.ideseg.com/content/binary/r_SharepointIFrameContent.jpg)

Por lo general estos documentos los cargamos dentro de un webpart de contenido para que el usuario pueda navegar por estas páginas de manera que lo ideal sería que el documento se visualizará en el site del cual proviene.

Si os fijáis en el MSDN ([msdn.microsoft.com](https://web.archive.org/web/20080216182515/http://www.ideseg.com/ct.ashx?id=de5abd87-c81e-4e29-9537-f96ff8fac420&url=http%3a%2f%2fmsdn.microsoft.com%2f)) ellos utilizan un truco para que indexar páginas asp que después se visualizan dentro de un frame con el contexto del MSDN.

Lo primero que he hecho es un pequeño script que debo añadir a todas las páginas .html

```js
<script type="text/javascript">
   if (self == top) {     
        topUrl = 'sites/pruebas';     
        posUrl = location.href.lastIndexOf(topUrl);
        qs = location.href.lastIndexOf('?');  
        if (qs < 0) {         
            qs = location.href.length;     
        }     
        newUrl = location.href.substring(posUrl+1+topUrl.length,qs);
         window.location.href = topUrl+'/default.aspx?Load='+encodeURI(newUrl);   
    }   
</script>`
```

El script comprueba si el documento es el principal en la página en cuyo caso lo que hace es redirigirse automáticamente a su destino, la página principal del Site. Para que este sepa que página debe cargar se lleva como parámetro el nombre del archivo y su camino dentro del sitio. 

Generalmente estas páginas provienen de una plantilla .dwt con lo que podéis actualizar la plantilla.

topUrl, contiene la dirección del site donde se quiere visualizar la página.

Después hay que modificar el default.aspx del site de manera que cargue la página que se ha seleccionado.

En vez de usar un webpart de contenido he usado directamente un iframe, también podéis usar  un webpart de contenido que acepte querystrings como este de [Mad Nissen](https://web.archive.org/web/20080216182515/http://www.ideseg.com/ct.ashx?id=de5abd87-c81e-4e29-9537-f96ff8fac420&url=http%3a%2f%2fweblogs.asp.net%2fmnissen%2farticles%2f147457.aspx) con unos retoques.

```html
<iframe frameBorder="0" onload=”iframeOnLoad();” id="miIframe" name="miIframe" width="100%" height="100%" src=" " />
```

En el src del iframe deberemos poner el documento .html que se cargará por defecto.

Por último este pequeño script en el default.aspx (yo lo he puesto antes de la etiqueta )

```js
<script type="text/javascript">
   function iframeOnLoad()   {
         var params = window.location.search.substring(1).split("=");
         if (params[1]!=null && document.getElementById("miIframe").src != params[1]) {   
             document.getElementById("miIframe").src = params[1];     
        }   
    }   
<script>
```

Este script recoge el querystring y carga en el iframe la página que le hemos pasado.

Ahora solo queda probar a buscar un documento desde el portal principal pinchar sobre el y ver que pasa