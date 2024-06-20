+++
title = 'Workflow Course 1'
date = 2007-02-01T00:00:00+01:00
tags = ['workflow']
+++

Tenía que impartir un curso de **Workflow Foundation** que finalmente no voy a dar, ya que estoy muy liado con otros temas. Ayer por la noche pensé que era una pena desaprovechar todo este trabajo, más aún porque estaba deseando montar un curso distinto, me explico:


El curso iba a consistir de 10 clases de una hora y media de duración (usease 15 horas) que no es mucho. De modo que tenía pensado lo siguiente. Una introducción de 45 minutos explicando cosas y mostrando un ejemplo práctico, ejemplo que previamente habría diseñado para la ocasión. Los 45 minutos restantes iban a ser para (30 min) que la gente trabajara con el código del ejemplo y lo enredara (mientras yo les explicaba el código). Por último, entre todos (siguiendo unas directrices 15min) iríamos añadiéndole funcionalidad al código, para ir viendo cada cosa en profundidad en la siguiente clase.

Bueno, finalmente esto no ha podido ser así, pero no voy a dejar ese trabajo muerto de risa en alguno de mis discos duros … de modo que lo voy a ir poniendo en el blog a ver qué pasa. El curso no está terminado del todo así que en función de la aceptación que tenga lo terminaré. Por favor poner los comentarios en ideseg.com …

**1er Asalto – Introducción a Windows Workflow Foundation  
  
Material necesario:**
  
-   [Microsoft .NET Framework 3.0 Redistributable Package](https://web.archive.org/web/20130623100537/http://www.microsoft.com/downloads/details.aspx?familyid=10CC340B-F857-4A14-83F5-25634C3BF043&displaylang=en)  
    
-   [Visual Studio 2005 extensions for .NET Framework 3.0 (Windows Workflow Foundation)](https://web.archive.org/web/20130623100537/http://www.microsoft.com/downloads/details.aspx?familyid=5D61409E-1FA3-48CF-8023-E8F38E709BA6&displaylang=en)


Windows Workflow Foundation es un framework a través del cual vamos  a poder crear nuestros propios motores de flujos de trabajo.

Este framework, está compuesto  por los siguientes elementos:  
  
-  Un conjunto básico de actividades (primitivas) con las cuales vamos a poder modelar nuestros flujos de trabajo.  
-  Un motor de flujos de trabajo que será el encargado de ejecutar los flujos de trabajo.  
-  Un conjunto de servicios con los que podemos añadir funcionalidad a nuestro motor de flujos de trabajo.  


Comencemos por el motor de flujos de trabajo.

Este motor es una clase llamada WorkflowRuntime, de la cual solo podremos tener una instancia por aplication domain, (por aplicación). Esta aplicación será la encargada de albergar nuestro motor de flujos de trabajo, y puede ser cualquiera de las aplicaciones que desarrollamos con Visual Studio, una aplicación Winforms, una aplicación ASP:Net, un servicio web ó una aplicación de consola.

Esta clase, tiene tres constructores, el primero sin parámetros y los otros dos, nos permiten pasarle datos que podemos albergar en un archivo de configuración.

La instancia de esta clase será nuestro motor de flujos de trabajo. Esta clase, implementa los interfaces IDisposable y el IServiceProvider. El primero es debido a que internamente el motor se encargará de liberar los recursos usados (método Dispose), de modo que poco nos tiene que importar, solo saber que el los gestionará. El segundo, es que implementa un proveedor de servicios de manera que pasará ciertos objetos a otras clases (método GetService).
Estos servicios son los que he mencionado anteriormente, servicios a través de los cuales podemos añadir funcionalidad a nuestro motor de flujos de trabajo.

Para manejar estos servicios en el motor de flujos de trabajo, tenemos cuatro métodos, AddService – para añadir un servicio, GetAllServices – que nos devolverá una colección con los servicios que estamos usando, GetService – que nos devolverá un servicio especifico y RemoveService – mediante el cual podemos eliminar un servicio.

Para manejar flujos de trabajo dentro del motor, tenemos CreateWorkflow que creará un nueva instancia de un flujo de trabajo para ejecutarse dentro del motor. Tenemos dos maneras básicas de crear flujos de trabajo, leyéndolas desde un archivo xoml, o indicando el tipo. GetLoadedWorkflows - que nos devolverá una colección con los flujos de trabajo que se encuentran cargados en el motor y GetWorkflow que nos devolverá un flujo de trabajo usando el Id de la instancia.

Por  último (ya veis que se trata de una complicadísima clase) tenemos dos métodos uno para arrancar el motor StartRuntime, el cual no es necesario usar si arrancamos una instancia dentro (es una obviedad, pero al iniciarse, la propiedad IsStarted se pondra en true) y StopRuntime que detendrá el motor.

El resto de la clase son eventos que se dispararán en función de las cosas que vayan ocurriendo en el motor. Start y Stopped, si se arranca o detiene el motor de flujos de trabajo, y todos los demás a excepción de ServicesExceptionNotHandled que se disparará cuando ocurra una excepción no manejada en alguno de los servicios, nos dan información sobre lo que ocurre en las distintas instancias de flujos de trabajo que se están ejecutando en el motror.

Cada uno de estos, se corresponde con el estado en que puede encontrarse una instancia, flujo de trabajo dentro del motor. Aborted, Completed, Created, Idled, Loaded, Persisted, Resumed, Started, Suspended, Terminated y Unloaded.

![](/images/Sharepoint/wf_curso_1.gif)
  
Bien, por el momento parece que no esto no es complicado, solo necesitamos instanciar esta clase para tener un motor de flujos de trabajo. Pero esto sería como un coche sin pasajeros (flujos de trabajo). Podemos arrancarlo, pararlo pero no hace nada más.

Los flujos de trabajo están compuestos por actividades, WF, nos facilita el trabajo dándonos un conjunto básico de actividades que son las que podemos ver a la izquierda en Visual Studio (panel de herramientas). Una vez agrupadas estas actividades formarán parte de una clase que a su vez heredará de uno de los tipos posibles de flujos de trabajo.

Si estamos creando un flujo de trabajo secuencial, heredará de SequentialWorkflowActivity, aquí un inciso sobre como está mostrada la estructura de clases, un SequentialWorkflowActivity hereda de SequenceActivity que es un conjunto de actividades secuenciales, SequencyActivity hereda de CompositeActivity que representa todas las actividades compuestas y que a su vez hereda de Activity que es una actividad simple.


Si por el contrario estamos creando un flujo de trabajo de máquina de estados, se heredará de StateMachineWorkflowActivity, que representa un flujo de trabajo basado en estados y a su vez hereda de StateActivity que representa un estado. Podéis ver la estructura de clases en el diagrama de la derecha..


Por el momento basta con esto, lo que nos interesa en este momento es que un flujo de trabajo es un conjunto de actividades y en este caso vamos a realizar un flujo de trabajo secuencial, con lo que arrastraremos una actividad en nuestro flujo de trabajo.


Si observamos el diseñador de flujos de trabajo, lo que ocurre es similar a lo que pasa con ASP.Net o WinForms, lo que hace VS es mantener una clase parcial, compuesta por dos archivos, en el primero tendremos nuestro código limpio y en el segundo lo que el diseñador vaya generando.


Si miramos, lo que hay en el archivo del diseñador (vista de código) lo que hace es crear un atributo con cada actividad del tipo correspondiente a la actividad que hemos arrastrado. En el método Initialize, lo que hace es ir añadiendo la actividad a una colección de Activities. Esta colección viene de la clase CompositeActivity. Ya que una actividad compuesta, esta basada en una colección de actividades.


Bien, nuestro primer flujo de trabajo va ha ser de lo más sencillo, simplemente vamos a añadir a nuestro flujo de trabajo una actividad, una actividad DelayActivity que es un temporizador. Este detendrá la continuación del flujo de trabajo, en el ejemplo esta puesto en 45 segundos.

Como os he dicho es un curso muy sencillo así que por el momento solo hay que abrir el proyecto adjunto y estudiarlo.

![](/images/Sharepoint/wf_curso_2.gif)

![](/images/Sharepoint/wf_curso_3.gif)


 
**Aplicación de ejemplo – 1**
  

La Aplicación de ejemplo es una simple aplicación WinForms, que nos va a permitir lanzar flujos de trabajo dentro de un motor (_Run Workflow)_, estos se irán ejecutando he iremos viendo su estado a través de los eventos recibidos en el motor de flujos de trabajo (_Engine Status_).



![](/images/Sharepoint/wf_curso_4.gif)

  

También disponemos de una vista con las instancias de los flujos de trabajo (_Loaded Workflows_) que se están ejecutando dentro del motor. A la izquierda podemos enviar acciones a esos flujos de trabajo (_Suspend, Resume, Terminate, Abort, Unload_) para ir viendo que ocurre. El botón _Unload_, está desactivado (lo usaremos más adelante, ya que necesitamos tener el servicio de persistencia activado para poder descargar los flujos de trabajo).

También he añadido un botón para ver en que estado se encuentra un flujo de trabajo, este nos informará del cuando le va ha llegar al flujo de trabajo un evento de tipo timer.

**Código del ejemplo – 1** 

El código esta compuesto por dos proyectos, uno la aplicación Winforms con el Motor de flujo de trabajo y el otro es una biblioteca de flujos de trabajo, con el flujo de trabajo que hemos visto antes.

- Lanzar flujos de trabajo dentro del motor y ver que pasa  
- Usar las acciones sobre las instancias de los flujos de trabajo  
- Arrancar y parar el motor (con flujos de trabajo en ejecución)  
- Probar a crear otros flujos de trabajos (ej. dos o tres delays) e ir ejecutándolos dentro del motor