+++
title = 'Caml Editor'
date = 2005-12-01T00:00:00+01:00
tags = ['sharepoint', 'caml']
+++

Para la mayoría de los que trabajamos con SharePoint, el personalizar listas, sitios o áreas usando CAML, seré suave, es un INFIERNO, pero para bien o para mal vamos a tener que convivir con el.

No quiero entrar en detalles acerca de lo bueno o malo, de lo dificultoso o no que pueda llegar a ser, por que como ya he dicho antes hay que convivir con el. Así que he pensado en ser más tolerante y tratar de solucionar los problemas en la medida de lo posible.

Por lo general uso un pequeño truco desde hace tiempo (Todd Bleeker lo comento la semana pasada yo pensaba que era algo de dominio publico)  para pulir las listas antes de integrarlas en SharePoint. Básicamente yo edito la lista en SharePoint, personalizo los campos y las vistas (cosas que son incomodas léase INFERNALES en CAML), después guardo la lista como una plantilla, la paso a mi ordenador, renombro la plantilla como .CAB, descomprimo el archivo con lo que obtengo (manifest.xml, x0000000.000) y edito el archivo manifest.xml

El archivo manifest.xml contiene la definición de la lista en nuestro querido CAML, con un editor de XML y con paciencia edito la barra de botones u otras cosas que necesite cambiar.

Una vez realizados los cambios comprimo de nuevo todos los archivos y los subo al portal, para finalmente crear una lista usando la plantilla modificada.

Ayer por la tarde pensé en como podría automatizar un poco el proceso, pensé en escribir un pequeño notepad que automáticamente realizara el proceso de extracción, edición del manifest.xml y compresión.

Durante la primera media hora me dedique a buscar una biblioteca ó componente que me permitiese trabajar con archivos “.cab” desde Windows Forms. No hubo éxito. (Si alguien conoce alguna que por favor me lo indique).

Visto que no podía subsanar el problema pensé en ejecutar el proceso “cabarc.exe”  y listo.

Bien, en unos minutos abría el archivo “.stp”, extraía los archivos y estaba editando el manifest.xml. Y LLEGO LA IDEA.

Editar un archivo .xml sencillo no es un problema, pero cuando se trata de un CAML, es un autentico caos. ¿Cómo podría editar el archivo de manera más amigable?

Dos horas después tenía un pequeño editor de XML, conectado a un TextBox, y ahora se veía un poquito mejor.

Después cambie el editor por un fabuloso ICSharp.Code.TextEditor hummm resalta la sintaxis, después un control para previsualizar nodos del XML en HTML en un navegador y ver el código que se va a generar… y entonces eran las 3 de la mañana.

Una horita más y otra vez gracias al CAML Schema de Carsten Keutmann, podía validar cada sección que iba editando … buff es hora de irse a la cama.

La cosa es que como nadie se decide por el momento a hacer nada, he pensado en crear un workspace en gotdotnet.com (workspaces.gotdotnet.com/SharePointListTemplateEditor)

El código, sucio, sucio, sucio, como generalmente comienzan este tipo de herramientas, pero ya es hora de ir pensando en hacer algo ¿NO? 

Ale unas pantallitas para animar al personal a que se una al proyecto.

![](/images/Sharepoint/CAML-ListTemplateEditor-3.gif)

![](/images/Sharepoint/CAML-ListTemplateEditor-4.gif)

![](/images/Sharepoint/CAML-ListTemplateEditor-5.gif)

![](/images/Sharepoint/CAML-ListTemplateEditor-3b.gif)

![](/images/Sharepoint/CAML-ListTemplateEditor-5b.gif)