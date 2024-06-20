+++
title = 'Workflow Scheduler Service'
date = 2007-01-12T00:00:00+01:00
tags = ['navarradotnet', 'wtf']
+++


Una de las coas que más me cuesta explicar cuando hablo de Windows Workflow Foundation, es el dichoso AutoResetEvent.

El AutoResetEvent, es una variable que nos ayudará en la sincronización de los distintos hilos de proceso (threads), no es más que un simple mutex (exclusión mutua), ó semáforo, que nos va a permitir es proteger ciertos datos compartidos cuando se llevan a cabo escrituras, previniendo las condiciones de carrera.

Para entender bien este concepto, revisemos como son programadas las distintas instancias de los flujos de trabajo en el runtime.
El runtime de Workflow Foundation, tiene un servicio de temporización (scheduler) que nos va a permitir ejecutar las distintas instancias que se lleven a cabo de manera Asíncrona (por defecto) ó Síncrona (utilizando el servicio manual).

El DefaultWorkflowSchedulerService, que es el servicio por defecto, crea y maneja los hilos de ejecución de forma asíncrona sobre el runtime. Conforme se van creando instancias de los flujos de trabajos, estas se almacenan en una cola que mantiene este servicio, más tarde cuando la instancia se ejecuta, este servicio solicitará un nuevo hilo (al .Net CLR) para ejecutar dicha instancia.

Otro importante aspecto es que nosotros podemos establecer el número máximo de hilos (MaxSimultaneousWorkflows)  que queremos que mantenga en uso este servicio, por defecto son 5. Si queremos establecerlo en 2:


```csharp
DefaultWorkflowSchedulerService defaultWorkflowSchedulerService = new DefaultWorkflowSchedulerService(2);
workflowRuntime.AddService(defaultWorkflowSchedulerService);
```

De modo que el resto de instancias, tendrán que esperar a que se libere alguno de los hilos antes de empezar a funcionar.

Este hecho es el que nos obliga en cierta medida a lanzar el AutoResetEvent.Set() para indicar que ese hilo ha quedado liberado.

Cuando digo en cierta manera, lo digo porque generalmente se han de dar dos casos, el primero que necesitemos acceder al mismo objeto o recurso en el mismo hilo, o que necesitemos manejar eventos. 

AutoResetEvent, pone en el estado de no-señlizado automáticamente después de que un hilo haya sido liberado. Si tenemos distintos hilos que intentan acceder a un recurso y no queremos que lo hagan a la vez para que no se prodúzcanlos casos de exclusión, estos se quedarán esperando a que termine el que esta accediendo que estará señalizado, en ese momento el estado del hilo pasará a no-señalizado, permitiendo el acceso a el siguiente hilo.

Por otro lado disponemos también de un servicio manual como he comentado antes, este servicio es ManualWorkflowSchedulerService,  será el runtime quien cederá a la instancia un hilo para su ejecución,  de modo que la instancia se ejecutará sobre un único hilo (en modo síncrono) bloqueando la ejecución del host, mientras la instancia del flujo de trabajo este activa.

Para hacer esto, tendremos que arrancar cada una de las instancias manualmente, usando RunWorkflow y pasándole el Id de la instancia.


```csharp	
ManualWorkflowSchedulerService manualWorkflowSchedulerService = new ManualWorkflowSchedulerService(false);
workflowRuntime.AddService(manualWorkflowSchedulerService);
instance1.Start();
manualWorkflowSchedulerService.RunWorkflow(instance1.InstanceId);
``` 
Hace algún tiempo leí (no he conseguido encontrar la referencia) que el uso manual, tendría sentido cuando el host funcione sobre ASP.NET o Servicios Web.