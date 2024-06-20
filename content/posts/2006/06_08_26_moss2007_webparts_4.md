+++
title = 'MOSS 2007 WebParts 4'
date = 2006-08-26T00:00:00+01:00
tags = ['sharepoint']
+++

Otra de las mejoras importantes al usar las WebParts de ASP.Net 2.0 es la comunicación entre webparts, ya que ahora pasa a ser un proceso mucho menos tedioso que con las webparts de WSS2.

¿Qué necesitamos?

Lo primero que necesitamos es ver que información es la que queremos intercambiar entre las dos webparts, con las webparts de ASP Net 2.0 no tenemos las limitaciones que teníamos antes con la obligación de seleccionar uno de los interfaces que WSS2 nos proponía. Ahora disponemos de libertad para intercambiar información.

No obstante hay pre-definidos tres Interfaces, IWebPartField, IWebPartRow e IWebPartTable, pero no hay obligación de usarlos.

La información que van a intercambiar dos webparts, se conoce como “Contrato de comunicación” que representaremos con un Interface.

Por ejemplo para emular el conocido ICellProvider y el ICellConsumer de WSS2 y el IWebPartField que nos propone ASP.Net 2.0 bastará con intercambiar una cadena de texto, de manera que nuestro interface de comunicación será:

```csharp
public interface IMensaje
{
    string Mensaje { get; }
}
```

Cada uno de los webparts que usaremos Proveedor y Consumidor usarán este Interface, el proveedor deberá implementarlo y el consumidor lo utilizará internamente usando una instancia del mismo. 


El webpart proveedor

```csharp
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace MiWebPart
{
    public class Proveedor : WebPart, IMensaje
    {
        private TextBox entrada;
        private Button accion;

        // Creamos los controles        
        protected override void CreateChildControls()
        {
            entrada = new TextBox();
            Controls.Add(entrada);
            accion = new Button();
            accion.Text = “Proveer”;
            Controls.Add(accion);
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            entrada.RenderControl(writer);
            accion.RenderControl(writer);
        }

        [ConnectionProvider("Mensaje")]
        public IMensaje ProveerMensaje()
        {
            return this;
        }


        // Enviamos el contenido del TextBox
        public string Mensaje
        {
            get
            {
                return entrada.Text;
            }
        }
    }
}
```

Comparado con las webparts de WSS2 ya veis que diferencia, hay que destacar el método ProveerMensaje() que está decorado con el atributo [ConnectionProvider("Mensaje")] en donde Mensaje es el tipo de información que intercambia este WebPart. ProveerMensaje devuelve una referencia a si mismo como el interface del mensaje que esta implementando (precioso…)


El webpart consumidor

```csharp
using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace MiWebPart
{

    public class Consumidor : WebPart
    {
        private IMensaje mensaje;
        private Label label;

        [ConnectionConsumer("Mensaje")]
        public void ConsumirMensaje(IMensaje imensaje )
        {
            mensaje = imensaje;
        }

        protected override void CreateChildControls()
        {
            label = new Label();
            Controls.Add(label);
        }

        protected override void OnPreRender(EventArgs e)
        {
            if (mensaje != null)
            {
                label.Text = mensaje.Mensaje;
            }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            label.RenderControl(writer);
        }
    }
}
```



Este webpart, solo necesita instanciar el interface “private IMensaje mensaje” y definir un método que lo consuma, este método que irá decorado con el atributo [ConnectionConsumer("Mensaje")], debe ser publico, no devolver nada y tomar como argumento un interface definido. (brillante…)

El resultado


Por último comentar, que existe la posibilidad de que dos webparts con distintos interfaces compartan información, para ello se pueden usar objetos de transformación, clases que derivaremos de WebPartTransformer.

![](images/Sharepoint/moss2007wp7.gif)