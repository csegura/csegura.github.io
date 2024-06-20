+++
title = 'MOSS 2007 WebParts 1'
date = 2006-08-23T00:00:00+01:00
tags = ['sharepoint']
+++

Como ya sabéis Windows SharePoints Services 3.0 está construido sobre ASP.Net 2.0, esto nos brinda la posibilidad de crear webparts que podríamos llamar nativas de ASP.Net 2.0 dentro de WSS3, estas webparts nativas vendrían derivados de System.Web.UI.WebControls.WebParts.WebPart.

Para mantener la compatibilidad (como prometieron) con desarrollos anteriores y para no perder la funcionalidad de ASP.Net 2.0 la antigua API Microsoft.SharePoint.WebPartPages.WebPart  que hemos venido usando con WSS2 deriva ahora de System.Web.UI.WebControls.WebParts.WebPart.

De manera que ahora disponemos de dos alternativas a la hora de desarrollar para WSS3 siempre moviéndonos en ASP.Net 2.0.


Según la versión preliminar del SDK, se nos recomienda usar la forma nativa a excepción de:

• Conexiones de webparts entre páginas
• Conexiones entre webparts que están fuera de una zona de webparts
• Conexiones en el lado del cliente
• Datos cacheados en la base de datos de contenido

Estas características solo están disponibles en las webparts heredadas de Microsoft.SharePoint.WebPartPages.WebPart 

Bueno, esto es un gran avance ya que el código para nuestro primer WebPart nativo de WSS3 queda reducido a:

```csharp
using System.Web.UI;
using System.Web.UI.WebControls.WebParts;

namespace MiWebPart
{
    public class MiPrimerWebPart : WebPart
    {
        protected override void RenderContents(HtmlTextWriter writer)
        {
            writer.Write(“Hola Mundillo!!”);
            base.RenderContents(writer);
        }
    }
}
```

Usando VS2005 podemos crear un nuevo proyecto “Librería de clases”,  añadimos la referencia a System.Web y creamos nuestro primer webpart.

Al igual que con las WebParts de WSS2 deberemos firmar nuestro ensamblado (esto es mucho más fácil con VS2005) basta con decir en las propiedades del proyecto que queremos firmar el ensamblado con una nueva clave, y esta se creará automáticamente.

Generamos la solución y tenemos nuestro MiWebPart.dll

En este primer ejemplo vamos ha instalarlo en el Global Assembly Cache, de modo que tendremos que copiar la dll en el servidor c:\windows\assembly.

Una vez copiado podemos pinchar sobre la dll y ver las propiedades para obtener el PublickKeyToken que necesitaremos para registrar el control en nuestro servidor como un control seguro.

![](/images/Sharepoint/moss2007wp1.gif)


Para ello debemos modificar el archivo web.config para añadir en la sección <SafeControls> la siguiente línea.

```
<SafeControl Assembly=”MiWebPart, Version=1.0.0.0, Culture=neutral, PublicKeyToken=d196fc71b3d34a48″ 
Namespace=”MiWebPart” TypeName=”*” Safe=”True” />
```
Una vez registrado el control deberemos reiniciar el servidor IISRESET para que este este accessible.

En WSS3 una vez que la dll está registrada en el web.config será detectada. De modo que ahora solo nos queda añadirla a nuestra galería de webparts.  (Site Settings -> Galleries -> Web Parts, si no aparece pulsamos sobre New y la añadimos a la galeria)  


Después ya podemos ponerla donde queramos.

![](/images/Sharepoint/moss2007wp2.gif)
