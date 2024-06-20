+++
title = 'Workflow Course 2'
date = 2007-02-03T00:00:00+01:00
tags = ['workflow']
+++

Bueno, en la [**primera parte**](https://web.archive.org/web/20130623100537/http://www.ideseg.com/CursoDeWorkflowFoundation1.aspx) hemos visto en que consiste el motor de flujos de trabajo, poco a poco nos iremos introduciendo en los detalles, también hemos visto que un flujo de trabajo esta compuesto de actividades. Cuando ejecutamos un flujo de trabajo dentro del motor, la representación del mismo (**SequentialWorkflowActivity ó**  **StateMachineWorkflowActivity)** en ejecución es un **WorkflowInstance.**  

Esta instancia, se crea desde el motor, Runtime.CreateWorkflow(typeof(<nuestro flujo de trabajo>)) y como vimos existen distintas formas de cargar los flujos de trabajo dentro del mismo, (más adelante veremos como hacerlo de otras maneras).

A través de esta WorkflowInstance, podemos manejar las instancias de los flujos de trabajo, generalmente las iniciaremos nada más crearlas WorkflowInstance.Start(), como vimos en el ejemplo anterior usando el Id de la instancia (InstanceId), podemos controlar independientemente cada uno de los flujos de trabajo que esta ejecutando nuestro motor de flujos de trabajo.

Para ello disponemos de Start, que echará a andar el flujo de trabajo dentro del motor. Suspend, que detendrá su ejecución y que podremos continuar usando Resume.

Los métodos Load, Unload y TryUnload, podremos usarlos cuando nuestro motor tenga implementado un servicio de Persistencia. El servicio de persistencia, nos va ha permitir que nuestros flujos de trabajo se almacenen en un sistema de almacenamiento (ya se q queda redundante). Esto, podemos realizarlo de forma manual invocando Unload ó TryUnload pero será el propio motor quien se encargue de estas tareas cuando nuestro flujo de trabajo este inactivo a la espera de datos ó eventos para continuar.  Esto también lo veremos  más adelante (4º Asalto)

El método Terminate, terminará el flujo de trabajo, una vez terminado no podremos volver ha ejecutarlo. Cuando invocamos este método debemos pasar una cadena indicando un mensaje de error, este mensaje podremos recuperarlo en el evento WorkflowTerminated del motor usando WorkflowTerminatedEventArgs. Existe una actividad cuyo comportamiento es similar, llamada TerminateActivity, que que podremos usar dentro de nuestros flujos de trabajo para terminar un flujo de trabajo lanzando una excepción, esta actividad podría ser usada en el caso de que nuestro flujo de trabajo llegará a un punto en donde no puede continuar.

También podemos abortar el flujo de trabajo mediante Abort, que deshará todo lo que el flujo de trabajo ha realizado desde que este se guardo – persistió, (si se hizo).

Otra de las cosas que vimos en el ejemplo es el uso de GetWorkflowNextTimerExpiration, por medio del cual podemos ver cuando espera recibir nuestro flujo de trabajo un evento del servicio timer. En el ejemplo que suministre anteriormente teníamos un flujo de trabajo sencillo que incluía una actividad Delay, esta actividad DelayActivity detiene el flujo de trabajo durante el tiempo que le hayamos indicado por lo que establece un timer expiration. 
Tenemos un método similar que usaremos enseguida (6º Asalto) llamado, GetWorkflowQueueData, mediante el cual podemos ver que actividades están pendientes de recibir datos. También disponemos de dos métodos para encolar datos en un flujo de trabajo, es decir enviarle datos EnqueueItem y EnqueueItemOnIdle.

Una par de cosas más, GetWorkflowDefinition, nos devuelve la Actividad raíz de nuestro flujo de trabajo, esta actividad podemos castearla a SequentialWorkflowActivity, si la instancia es un flujo de trabajo secuencial, con lo cual obtendríamos una foto del flujo de trabajo. Cuando digo una foto es por que NO es el flujo de trabajo que se está ejecutando si no una imagen de las actividades que componen el flujo de trabajo. Esto puede ser interesante, para mostrar una representación de lo que contiene un flujo de trabajo o para realizar modificaciones dentro de nuestro flujo de trabajo. ApplyWorkflowChanges, se encargará de aplicar las modificaciones dentro de los flujos de trabajo.

Por último ReloadTrackingProfiles, volverá a cargar un perfil de rastreo o monitorización para una instancia determinada, lo veremos cuando veamos el servicio de seguimiento (Tracking).

![](/images/Sharepoint/wf_curso_5.gif)


**2do Asalto – Las primeras actividades**

Por el momento conocemos que es lo que hace DelayActivty, bien, animemos un poco esto con algunas nuevas actividades a la vez que vamos viendo otras cosas, veamos la actividad While, (WhileActivity) esta actividad nos permitirá controlar el flujo de nuestro flujo de trabajo (otra vez redun.). La actividad While es una actividad compuesta, dentro de esta actividad podemos ejecutar otra actividad. Si deseamos ejecutar más de una actividad dentro tendremos que usar una actividad llamada SequenceActivity, que es también  una actividad compuesta, en la que dentro podemos colocar una o más actividades.


La actividad WhileActivity, tiene una propiedad necesaria para su ejecución, esta es una condición que debemos establecer, condición que se evaluará desde que esta actividad comience y cada vez que se termine de ejecutar la actividad que se encuentra dentro, es similar al bucle while de cualquier lenguaje de programación, fijaros que en c#. c, pascal etc, podemos ejecutar un while sin poner {} ó begin, end; poniendo en su interior una sola sentencia, y que para ejecutar más de una tenemos que poner algo que indique que lo que viene a continuación es una secuencia, eso es lo que hace el SequenceActivity. Podemos establecer esta condición de dos maneras distintas, por código y usando una regla. Las reglas son también declarativas archivo .rules.


En la nueva y remodelada versión del programa (en la primera versión, pretendía que os centrarais en WF y no en el programa Winforms, a la vez que veíais como estaba estructurado el proyecto), tenemos un flujo de trabajo llamado WorkflowLongWhile, este flujo de trabajo tiene un bucle while y una actividad de código en su interior, CodeActivity.


La actividad CodeActivity lo que hace es ejecutar un trocito de código, el que nosotros queramos, que ha de establecerse en la propiedad ExecuteCode. En este caso lo que hacemos es incrementar el contador, en el ejemplo adjunto tenéis este flujo de trabajo en versión código y en versión declarativa. Abrid el archivo xoml y el rules para ver como son. De momento solo verlo, más adelante veremos como se ejecutan los archivos .xoml.

![](/images/Sharepoint/wf_curso_6a.gif)
 
Notar como a diferencia de los flujos de trabajo que usan un timer (Delay y Delay2) _LongWhile_ no se pone en estado idle, esto es debido a que en ningún momento se encuentra en inactividad, no espera a nada ni a nadie. Si le preguntamos por **GetWorkflowNextTimerExpiration,** veremos que devuelve **31/12/9999 23:59:59,**  eso es que no espera recibir un evento del timer nunca, o por lo menos antes de esa fecha ![:-)](/images/Sharepoint/icon_smile.gif) .  

Bien, si tenéis dudas sobre lo comentado (ojo hay mucho todavía) podéis ponerlas en los comentarios. Antes de terminar con esta parte vamos a ver como podemos pasar datos a nuestros flujos de trabajo. Los flujos de trabajo nos sirven para modelar la lógica de nuestros procesos (si puedo colgaré el video del [frito de gamba](https://web.archive.org/web/20130623100537/http://geeks.ms/blogs/dsalgado/archive/2007/01/26/24-grados-en-24-horas.aspx)), y la mayoría de estos requieren de datos para poder hacer el trabajo, existen distintas formas de hacer llegar esta información a a nuestros flujos de trabajo, en esta parte veremos como pasar parámetros.

Para pasar un parámetro a un flujo de trabajo primero necesitamos definir una propiedad pública dentro de la clase que contiene nuestro flujo de trabajo, este propiedad será la receptora. Para hacerle llegar el parámetro, debemos  invocar el método del runtime CreateWorkflow, pasándole un diccionario que contendrá los parámetros que deseemos.  **Runtime.CreateWorkflow(typeof(<nuestro flujo de trabajo>),<Diccionario de parámetros>)** 

En el ejemplo adjunto tenemos un flujo de trabajo llamado _SumNumbers_ que realizará una simple suma con dos números. Podéis rellenar estos en la pestaña de parámetros (_Number A, Number B_). Cuando este flujo de trabajo termine, presentará en el log el resultado. Este resultado debemos recogerlo en el evento del runtime **Completed**, así que mirar como ha cambiado.

**Aplicación de ejemplo – 2**

Si, un poco más bonita (ira mejorando mucho), el código esta organizado, espero que no tengáis problemas con mi spanglish (yo sufro de esto, codifico en ingles con comentarios en castellano, en fin nadie es perfecto) bueno cosas para ir jugando, podéis usar el ejemplo de sumar dos números con otras actividades, como por ejemplo IfElse. La idea del código era que los alumnos jugaran con el, así que cualquier sugerencia al respecto, experimento o BUG por favor comentarlo.  
  
La lista con las instancias ahora monitoriza el estado en tiempo real (hablaremos de esto) y para realizar acciones sobre las instancias (flujos de trabajo), hay un menu contextual.

![](/images/Sharepoint/wf_curso_7.gif)

![](/images/Sharepoint/save_16.gif) [**Código del 2do ASALTO -**](https://web.archive.org/web/20130623100537/http://oldblog.ideseg.com/content//WinHostWorkflow_2.zip) [**WinHostWorkflow\_2.zip (39,56 KB)**](https://web.archive.org/web/20130623100537/http://oldblog.ideseg.com/content//WinHostWorkflow_2.zip)

