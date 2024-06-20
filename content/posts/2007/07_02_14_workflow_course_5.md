+++
title = 'Workflow Course 5'
date = 2007-02-14T00:00:00+01:00
tags = ['workflow']
+++

**5o Asalto – El servicio de planificación de tareas & Hosting in ASP.Net**

El servicio de planificación de tareas (**WorkflowSchedulerService**)  es el encargado de ejecutar los distintos flujos de trabajo dentro del motor, estos pueden ser manejados de forma asíncrona, usando el servicio que WF nos proveed por defecto (**DefaultWorkflowSchedulerService**) o de manera síncrona, usando un servicio manual (**ManualWorkflowSchedulerService**).

Al igual que el resto de servicios, también podemos crear nuestro propio servicio de planificación heredando de **WorkflowSchedulerService**.

Es importante recalcar que el motor de WF no crea hilos de trabajo de su propiedad. Los hilos sobre los cuales se ejecutan las instancias de los flujos de trabajo, son hilos de la aplicación que hospeda el motor.  De modo que cada instancia (aunque esta sea del mismo flujo de trabajo) puede estar ejecutándose sobre diferentes hilos. Y como no, el encargado de gestionar esos hilos es **WorkflowSchedulerService**.

El servicio por defecto **DefaultWorkflowSechedulerService**,  no hemos de indicarlo ya que si el motor se inicia sin que nosotros añadamos un servicio de programación manual ó personalizado, usará este servicio.  Este servicio gestiona los hilos de ejecución de manera asíncrona de modo que podemos tener múltiples instancias de los flujos de trabajo en la cola de ejecución. 

Por el contrario, el servicio manual que nos provee WF, **ManualWorkflowSchedulerService**, usa una gestión síncrona,  de modo que las instancias de los flujos de trabajo serán ejecutadas sobre el mismo hilo de la aplicación huésped, bloqueando su ejecución hasta que la instancia quede inactiva.

No pensaba realizar ningún ejemplo en **asp.net**, pero me pico el otro día un par de mails, que recibí, de modo que me dieron las tantas otra vez. Nada mejor que un ejemplo para ver estas cosas.

En el ejemplo que he preparado (advertencia, es necesario que tengáis instalado **[AJAX 1.0](https://web.archive.org/web/20130623100537/http://ajax.asp.net/)**) se puede apreciar como en un principio usando el **DefaultWorkflowSchedulerService**, se asignan más hilos que con el servicio manual, y como al usar el servicio manual **ManualWorkflowSchedulerService**, la ejecución de la aplicación queda detenida hasta que el flujo de trabajo queda inactivo.

Para activar el servicio manual, solo hay que quitar los comentarios tanto en el _global.asax,_ como en el _default.aspx.cs_.

![](/images/Sharepoint/wf_curso_25.gif)