+++
title = 'Workflow Course 4'
date = 2007-02-04T00:00:00+01:00
tags = ['workflow']
+++

Muchos de los procesos con los que trabajamos habitualmente, requieren de datos o eventos que llegan desde el exterior. Anteriormente, vimos como WF puede comunicarse con el mundo exterior, para recibir esos datos o eventos usando el servicio de intercambio de datos.

En ocasiones, al igual que sucede en el mundo real, debemos esperar a que se produzcan esos datos o eventos para poder continuar realizando un trabajo. Este hecho hace que nuestros flujos de trabajo queden inactivos (Idle) mientras esperan esos datos.

Que se produzcan estos hechos para continuar el trabajo, puede llevar horas, días o incluso meses, de modo que nuestros flujos de trabajo se mantendrían dentro del motor de flujos de trabajo, consumiendo recursos de la aplicación que alberga el motor de WF, y a su vez quedarían expuestos a posibles pérdidas si durante el tiempo de espera el sistema se viene abajo.

Con el fin de subsanar esto WF, nos provee de un servicio de Persistencia, a través del cual nuestros flujos de trabajo, podrán ser guardados en un sistema de almacenamiento hasta el momento en que se produzcan los datos o eventos necesarios para continuar.

**4º ASALTO – El servicio de persistencia**

Desde el momento que se crea una instancia del flujo de trabajo del motor de WF, este queda en memoria. Hemos vistos a través de los ejemplos anteriores como los flujos de trabajo entran en inactividad cuando esperan datos externos o un evento que proviene del servicio de timer. También, hemos visto como se establece un horario en que deberían llegar esos datos y como este puede ser indeterminado cuando se establece como 31/12/2999.

Si deseamos persistir, nuestros flujos de trabajo, lo que hemos de hacer es proveer a nuestro motor de flujos de trabajo de un servicio de persistencia, esto es una operación muy similar a la que realizamos anteriormente con el servicio de intercambio de datos.

Cuando nuestro motor de flujos de trabajo cuenta con un servicio de persistencia, podremos descargar los flujos de trabajo en el sistema de almacenamiento mediante dicho servicio.

La clase base de los servicios de persistencia es la clase abstracta **WorkflowPersistenceService**, como vimos en el 3er Asalto, que a su vez hereda de **WorkflowRuntimeService** y WF nos ofrece una implementación de este servicio en la clase **SqlWorkflowPersistenceService**, que se encargará de almacenar los flujos de trabajo en un repositorio de SQL server.

Para poder usar **SqlWorkflowPersistenceService**, debemos crear una bbdd SQL Server con la estructura que se encuentra en C:\\WINDOWS\\Microsoft.NET\\Framework\\v3.0\\Windows Workflow Foundation\\SQL\\ES\\SqlPersistenceService\_Schema.sql y la lógica (procedimientos almacenados) que se encuentra en el mismo directorio en el archivo SqlPersistenceService\_Logic.sql

Podéis encontrar más detalles en el blog de [Juan Carlos González](https://web.archive.org/web/20130623100537/http://geeks.ms/blogs/ciin/archive/2007/02/05/comenzando-con-wf-paso-de-datos-y-runtime-services.aspx)


Una vez creada la base de datos, lo que debemos hacer es dotar a nuestro motor de flujos de trabajo del servicio de persistencia.

```cs
persistenceService =
    new MySqlWorkflowPersistenceService(
                    Settings.Default.WorkflowDemoConnectionString,
                    UnloadOnIdle,
                    new TimeSpan(0, 1, 0),
                    new TimeSpan(0, 0, 10));
workflowRuntime.AddService(persistenceService);  
```

En el constructor de **SqlPersistenceService**, debemos pasar la cadena de conexión a la base de datos donde se almacenarán los flujos de trabajo así como un flag indicando si los flujos de trabajo se descargarán automáticamente cuando se encuentren en inactividad.

En caso afirmativo, WF descargará los flujos de trabajo automáticamente:  

- Cuando se encuentren inactivos  
- Tras terminar una actividad marcada como PersistOnClosed  
- Antes de que el flujo de trabajo termine  
- Antes de que el flujo de trabajo se complete  

En caso contrario, la responsabilidad pasará a ser de nuestro programa y deberemos cargar y descargar los flujos de trabajo manualmente, llamando a **WorkflowInstance.Load()**, **WorkflowInstance.Unload()** y **WorkflowInstance.TryUnload().**

De los otros dos parámetros del constructor, el primero nos permite indicar el tiempo que un flujo de trabajo almacenado por este motor mantendrá bloqueado dicho flujo de trabajo. Esto es para ser usado en caso de que distintos motores de flujos de trabajo compartan el mismo sistema de almacenamiento. El segundo, es el tiempo que se tardará en revisar los flujos de trabajo que han sido cargados desde la base de datos.

La mejor forma de ver cómo funciona el servicio de persistencia, es a través de la aplicación que estamos usando de ejemplo, la he actualizado incluyendo el servicio de persistencia, que podremos activar y desactivar a nuestro antojo. También hay una nueva pestaña en donde podemos monitorizar que es lo que ocurre en la base de datos donde se están almacenando los flujos de trabajo.


![](/images/Sharepoint/wf_curso_21.gif)  

![](/images/Sharepoint/wf_curso_22.gif)

Podéis hacer pruebas a tirar la aplicación mientras hay flujos de trabajo persistidos y a volverla a ejecutar y activar el servicio de persistencia, veréis como los flujos de trabajo que quedaban pendientes se completan.  (Para ello debéis arrancar el motor manualmente tras activar el servicio de persistencia). La mejor forma de ver cómo funciona el servicio de persistencia, es a través del ejemplo adjunto.


Para ver cómo trabaja **SqlPersistenceService**, lo que he hecho es crear una subclase espejo que irá dejando rastro de cómo son llamados lo métodos de **SqlPersistenceService**, podéis ver esta información en VS a través de la vista output.  

```
PersistenceService – Start
The thread 0xac4 has exited with code 0 (0×0).
PersistenceService – OnStarted
Created
Started
+PersistenceService – SaveWorkflowInstanceState WorkflowDelay Executing
-PersistenceService – SaveWorkflowInstanceState WorkflowDelay Executing
Idled
+PersistenceService – LoadWorkflowInstanteState 0fc8af43-ceb5-4f31-be58-c844e019531d
-PersistenceService – LoadWorkflowInstanteState 0fc8af43-ceb5-4f31-be58-c844e019531d
Loaded
Persisted
Unloaded
+PersistenceService – SaveWorkflowInstanceState WorkflowDelay Closed
-PersistenceService – SaveWorkflowInstanceState WorkflowDelay Closed
Persisted
+PersistenceService – LoadWorkflowInstanteState 0fc8af43-ceb5-4f31-be58-c844e019531d
+PersistenceService – LoadWorkflowInstanteState 0fc8af43-ceb5-4f31-be58-c844e019531d
Completed
```

Como ya comente con anterioridad, podemos crear nuestro propio servicio de persistencia, heredando de **WorkflowPersistenceService**. (En los ejemplos del WF hay un servicio personalizado que guarda los flujos de trabajo en archivos binarios FilePersistenceService.cs)

Básicamente hay que sobrescribir cuatro métodos de la clase WorkflowPersistenceService estos son:  

**SaveWorkflowInstanceState** – Encargado de slavar la instancia del flujo de trabajo en el sistema de almacenamiento.  
**SaveCompletedContextActivity** – Salva el estado ámbito (actividades) completado.  
**LoadWorkflowInstanceState** – Carga desde el sistema de almacenamiento a memorial instancia del flujo de trabajo.  
**LoadCompletedContextActivity** - Carga el ámbito  (actividades) completado

Por el momento, “jugar” con este servicio del que volveremos hablar más adelante.  
 

 **![](/images/Sharepoint/save_16.gif)**[WinHostWorkflow\_4.zip (474,63 KB)](https://web.archive.org/web/20130623100537/http://oldblog.ideseg.com/content//WinHostWorkflow_4.zip)