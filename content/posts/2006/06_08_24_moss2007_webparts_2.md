+++
title = 'MOSS 2007 WebParts 2'
date = 2006-08-24T00:00:00+01:00
tags = ['sharepoint']
+++

Continuando con el post anterior, usando las características de las WebParts de ASP Net 2.0,  podemos añadir propiedades a nuestras webparts para que se muestren en el area de edición.


```csharp
using System.Web.UI;
using System.Web.UI.WebControls.WebParts;
namespace MiWebPart
{
    public class MiPrimerWebPart : WebPart
    {
        private bool bMensajeVisible = true;

        [Personalizable(PersonalizationScope.Shared),
         WebBrowsable,
         WebDisplayName("Ver 2º Mensaje"),
         WebDescription("Activar desactivar el 2º mensaje")]
        public bool MensajeVisible
        {
            get { return bMensajeVisible; }
            set { bMensajeVisible = value; }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            writer.Write(“Hola Mundillo!!”);

            if (bMensajeVisible)
            {
                writer.Write(“<br><b>Hola Mundillo!! Otra vez</b>”);
            }

            base.RenderContents(writer);
        }
    }
}
```

Para ello basta con decorar las propiedades con los atributos necesarios. En este caso el atributo Personalizable indica que el valor de la propiedad se guardará cuando este se modifique, para que una propiedad pueda marcarse con el atributo Personalizable debe cumplir lo siguiente:

• La propiedad debe ser pública y debe tener descriptores de acceso get y set.
• La propiedad debe ser una propiedad de lectura y escritura.
• La propiedad debe estar sin parámetros.
• La propiedad no se puede indizar.

Este atributo define también si la personalización será compartida o individual. (PersonalizationScope.Shared, PersonalizationScope.User)


El atributo WebBrowsable indica si la propiedad designada se mostrará en el editor de propiedades.
El atributo WebDisplayName define el nombre que aparecerá junto a la propiedad.
Y por último el atributo WebDescription  contiene la descripción de la propiedad.


Una vez marcada la propiedad con sus atributos correspondientes podremos editarlos cuando modifiquemos las propiedades del webpart.

![](/images/Sharepoint/moss2007wp3.gif)



Finalmente, para poder hacer nuestro webpart exportable, debemos indicarlo explícitamente, de manera que podemos crear un constructor e indicarlo allí.

```csharp	
 public MiPrimerWebPart()
 {
     ExportMode = WebPartExportMode.All;
 }
```

![](/images/Sharepoint/moss2007wp4.gif)



Parte 1 – Introducción a las webparts basadas en ASP.Net 2.0 para WSS3
Parte 2 – Propiedades personalizadas y exportación.
Parte 3 – Creando un archivo CAB para instalar nuestro webpart (descarga del proyecto completo)
Parte 4 – Comunicación de WebParts


 