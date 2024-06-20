+++
title = 'Workflow Course 3'
date = 2007-02-04T00:00:00+01:00
tags = ['workflow']
+++


Cuando hablo de Workflow Foundation, siempre hay una parte en la que alguien me pregunta, ¿Cómo encajo todo esto en mi forma de trabajar?, bien, WF lo que nos permite es modelar procesos (pueden ser de negocio o de lo que sea).  
   
Generalmente, y desde que adoptamos los modelos de n-capas, usamos una capa para albergar lo que denominamos lógica del negocio, (yo la llamo la capa lógica, a secas) y en esa capa implementamos los distintos procesos que nuestra aplicación va a realizar. En esta capa tenemos un nivel de abstracción elevado, ya que no trabajamos directamente con los datos, si no que usamos entidades que mapean los datos. A pesar de trabajar con este nivel de abstracción, en nuestro código debemos implementar gran cantidad de servicios, como: excepciones, estados, eventos, comunicaciones, transacciones. WF, lo que nos brinda es otro nivel más de abstracción mediante el cual vamos a poder centrarnos en la resolución de los problemas, liberándonos de gran parte de la carga.  
  
¿Vamos a diseñarlo todo con flujos de trabajo?, no, claro que no. Pero hay gran cantidad de procesos que vamos a poder modelar mediante flujos de trabajo. WF, nos va a permitir implementar esos modelos, de modo que parte de esa lógica quede también desacoplada.

**3er ASALTO – Comunicaciones**

Después de esta pequeña introducción vamos a ver como se comunican los flujos de trabajo con el mundo exterior. Anteriormente vimos como un flujo de trabajo puede recibir parámetros, evidentemente estos han de conocerse con antelación y las cosas no siempre son así. Para poder comunicarnos con los flujos de trabajos debemos en primer lugar añadirle un servicio de intercambio de datos a nuestro motor (Runtime). Este servicio que va a ser el primero que veamos es el **ExternalDataExchangeService**.

WF nos ofrece unos servicios básicos con los que podemos empezar a trabajar, es decir nos ofrece implementaciones ya preparadas. Además esta capa se servicios que podemos conectar y desconectar del Runtime a nuestro antojo, no ofrece la posibilidad de personalizar éstos servicios, bastará con que heredemos de cualquiera de las clases padre de las implementaciones disponibles y sobrescribamos aquello que deseamos personalizar. El esquema de la capa de servicios es el siguiente: Todos los servicios se basan en la clase abstracta **WorkflowRuntimeService**,  Tracking, CommitWorkBatch, Loader, Persistence, Scheduler y ExternalDataExchange. Estos a excepción del **ExternalDataExchangeService**, son a su vez clases abstractas con al menos una implementación lista para usar.

![](/images/Sharepoint/wf_curso_10.gif)

```cs
[ExternalDataExchange]
public interface ICalculator
{
    int Add(int numberA, int numberB);
    int Subtract(int numberA, int numberB);
    int Multiply(int numberA, int numberB);
    int Divide(int numberA, int numberB);
    void DisplayResult(int result);
}

ExternalDataExchangeService dataExchangeService;
dataExchangeService = new ExternalDataExchangeService();
workflowRuntime.AddService(dataExchangeService);

CalculatorService calculatorService;
calculatorService = new CalculatorService();
dataExchangeService.AddService(calculatorService);
```


El servicio ExternalDataExchangeService, nos va a permitir comunicarnos con los flujos de trabajo que viven en el interior del motor. Lo primero que debemos hacer es definir el interface que tendrá nuestro servicio, para comenzar vamos a usar una actividad en nuestros flujos de trabajo que se llama CallExternalMethod, esta actividad nos va a permitir comunicarnos desde dentro de un flujo de trabajo con el mundo exterior.

Dicho interface, define los métodos a los que se podrá invocar desde dentro del flujo de trabajo, este interface tiene que estar decorado con el atributo [ExternalDataExchange]. A la izquierda tenéis un ejemplo del interface que usaremos, sobran las explicaciones sobre lo que hace. Y obviamente, debemos implementar este interface. El código esta en el proyecto adjunto.

Por último, solo nos queda añadir el servicio de intercambio de datos al Runtime, son tres líneas. Recordar que cuando vimos la clase WorkflowRuntime, no solo podíamos añadir  si no que también podíamos quitar servicios. Una vez que hemos añadido el servicio, lo que necesitamos es añadir al Servicio de interambio de datos, nuestro propio servicio que implementa el interface que hemos definido.

ExternalDataExchangeService, a diferencia del resto de servicios, se ha diseñado como un contenedor de, podríamos llamar sub-servicios. Estos serán todos aquellos que necesitemos para intercambiar datos. Este contenedor también es conectable y des conectable, de modo que podemos añadir y quitar servicios a nuestro antojo.

Veamos como se conectar nuestro servicio, al servicio de intercambio de datos. Ops otras tres lineas …
  
Bien, ahora pasamos al diseñador de flujos de trabajo en donde, como he dicho utilizaremos la actividad **CallEnternalMethodActivity** para invocar cualquiera de los métodos que hemos definido en la interface, esto es importante ya que para el diseño del flujo de trabajo, solo nos es necesario contar con el interface. Este interface, puede estar (como es el caso del ejemplo) dentro de nuestro ensamblado con los flujos de trabajo, o en otro sitio, en cuyo caso deberemos añadirlo como una referencia. Lo mismo ocurre con la implementación del interface.
 

De modo que colocamos la actividad en el diseñador y lo primero que nos aparece como siempre es el símbolo de advertencia, indicando que  debemos completar el tipo de interface y el método dentro de este interface al que queremos llamar. Disponemos de un asistente para esto.


![](/images/Sharepoint/wf_curso_11.gif)  
![](/images/Sharepoint/wf_curso_12.gif)  
 

Una vez que seleccionemos el interface y el método al que queremos llamar, las propiedades cambiarán presentándonos los parámetros que requiere dicho método así como el tipo que devuelve. Los primeros aparecerán incluso con el mismo nombre que figura en el interface, el resultado aparecerá como (**ReturnValue**). Bien, disponemos de otro asistente para enlazar tanto los parámetros como el valor devuelto con propiedades de nuestro flujo de trabajo. (obviamente debemos crear las propiedades dentro de la clase que contiene el flujo de trabajo).  

![](/images/Sharepoint/wf_curso_13.gif)    
![](/images/Sharepoint/wf_curso_15.gif)    
![](/images/Sharepoint/wf_curso_14.gif)


Una vez realizado esto, ya tenemos un flujo de trabajo que se comunicará con el exterior, de modo que podemos usarlo para recuperar valores desde el flujo de trabajo ó para realizar tareas en el exterior. En el ejemplo del día, tenéis un nuevo flujo de trabajo llamado _CallExternalMethod (WorkflowCallExternalMethod.cs)_, con este ejemplo. La entrada de valores para realizar la suma se hace mediante los parámetros, al igual que hacíamos en el ejemplo anterior. Cuando veáis este ejemplo por favor volver a ver el flujo de trabajo _SumNumbers (WorkflowSumNumbers.cs)._

Bien, antes he mencionado que los parámetros como es lógico debemos conocerlos de antemano. Que ocurre si necesitamos datos dentro de nuestro flujo de trabajo una vez iniciado, ó si necesitamos que pasen cosas en el exterior para que nuestro flujo de trabajo pueda continuar. Esto es lo que vamos a ver ahora, y para ello vamos ha usar la actividad **HandleExternalEvent.** Por si alguien no lo ha pillado, si necesitamos datos debemos pedirlos (10 INPUT A), esto es lo que haremos con esta actividad.

  
Pero antes debemos introducir algunos cambios en el interface de comunicaciones.


```cs
[ExternalDataExchange]
public interface IMessenger
{
    event EventHandler<MessageServiceEventArgs> MessageService;
}

[Serializable]
public class MessageServiceEventArgs : ExternalDataEventArgs
{
    private string message;
    public MessageServiceEventArgs(Guid instanceId, string mensaje) : base(instanceId)
    {
        this.message = mensaje;
        WaitForIdle = true;
    }
    public string Message
    {
        get { return message; }
        set { message = value; }
    }
}
```

Lo primero es que debemos definir el evento que haremos llegar desde el exterior a nuestro flujo de trabajo, así como los argumentos que le serán pasados. La clase con los argumentos, debe ser serializable, es importante y hay que tenerlo en cuenta cuando estemos pasando objetos como argumentos a nuestros flujos de trabajo, ya que estos objetos deberán ser también serializables  (esto tiene q ver con la persistencia, lo veremos). Otra cosa importante es que el primer parámetro debe ser de tipo Guid, ya que cuando lancemos el evento, debemos indicarle a que instancia del flujo de trabajo va dirigido.


```cs
public class MessengerService : IMessenger
{
    public void SendMessage(MessengerEventArgs args)
    {
        EventHandler<MessengerEventArgs> eventHandler = MessageService;
        if (eventHandler != null)
            eventHandler(null, args);
    }

    public event EventHandler<MessengerEventArgs> MessageService;
}
```

Por último al igual que hemos hecho anteriormente debemos implementar la clase que llevará a cabo las acciones. Nota, no esta reñido el hecho de que un mismo interface de comunicaciones tengamos eventos y métodos, esto lo he hecho así para clarificar.

**HandleExternalEvent,** se configura en el editor exactamente igual que como hemos hecho con **CallExternalMethod.** Se enlaza el tipo de interface y el evento en este caso que esperamos. Para recoger los datos una vez llegue el evento, debemos rellenar la propiedad (**Invoked**) de la actividad en el diseñador de VS, con el método de nuestro flujo de trabajo que será invocado cuando llegue el evento. En este método lo que haremos será castear el tipo para recoger los argumentos que nos han sido pasados.

```cs
 private void ExternalMessenger_Invoked(object sender, ExternalDataEventArgs e)
 {
    message = ((MessengerEventArgs)e).Message;
 }
```

Este flujo de trabajo se llama en el ejemplo adjunto _HandleExternalEvent_ (_WorkflowHandleExternalEvent.cs_). Una par de cosas más para terminar esta parte. La primera, como hacemos llegar el mensaje a nuestro flujo de trabajo, bien, para esto hemos de llamar al método _SendMessage_ de  nuestro servicio _MessengerService_. Durante la llamada hemos de pasarle el **intanceId** del flujo de trabajo al que queremos enviar el mensaje así como el mensaje que queremos pasarle. Para ello, en el código adjunto y lo que hago es solicitar al Runtime el servicio y a través de este enviar el mensaje.

```cs
MessengerService messengerService = (MessengerService) WorkflowEngine.GetRunTime().GetService(typeof(MessengerService));
messengerService.SendMessage(new MessengerEventArgs(GetSelectedWorkflowInstance().InstanceId, “This is a sample message”));
```

Obviamente, podemos hacer esto de diversas maneras en función de como se haya implementado el motor y como se hayan añadido los servicios.

La última cosa, es que mientras el flujo de trabajo, está esperando la llegada del evento, este se pone en Idle (inactivo), podemos comprobar el timer que tomará el valor **31/12/9999 23:59:59,** es decir que no espera ningún mensaje del timer, sin embargo el flujo de trabajo se encuentra esperando, inactivo, bien, podemos comprobar mediante **GetWorkflowQueueData**, que es lo que espera recibir este evento en su cola de datos. He añadido esta funcionalidad para que veáis claramente que es lo que pasa. Ver _GetNextEvent()_ en el código. Para enviarle un mensaje, podéis hacerlo con el menu contextual seleccionando la instancia que espera recibir un mensaje.

**Aplicación de ejemplo – 3**

Nueva remodelación, hay más cosas. Espero seguir manteniendo vuestra atención sobre WF y no sobre el programa Winforms, si no es así lo decís. En el menú contextual he añadido una opción que nos mostrará el diagrama del flujo de trabajo. El código para elaborar el diagrama viene en uno de los ejemplos del SDK, lo he añadido y retocado para que veáis lo fácil que resulta añadirlo a nuestras aplicaciones.  
  
Revisar _WorkflowEngine.cs_ para ver como he añadido los servicios al motor. Bueno, solo deciros que hay mucho más, probar a elaborar vuestros propios flujos de trabajo, ahora tenéis muchas piezas para ensayar, os sugiero algunos ejercicios simples:

- Probar la actividad **IfElse** mandando el tipo de operación a realizar Suma, Resta, etc … realizar la operación en función de este.  
- Pasar el resultado del ejemplo _WorkflowSumNumbers.cs_ como entrada a otro flujo de trabajo.  
- Ver que pasa cuando se ejecutan muchos flujos de trabajo. ¿se mantiene la precisión del timer? ¿cómo se carga la CPU?


![](/images/Sharepoint/wf_curso_16.gif)  

![](/images/Sharepoint/wf_curso_18.gif)


Espero vuestros comentarios…