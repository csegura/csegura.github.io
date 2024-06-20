+++
title = 'Multiple Providers'
date = 2006-04-05T00:00:00+01:00
tags = ['sharepoint']
+++

El otro día comentaba el problema que había tenido con los interfaces de conexión de los webparts. Tenía un webpart consumidor conectado con dos proveedores, la primera vez que uno de los webparts proveía un valor este era aceptado por el consumidor, pero desde el momento en que el consumidor aceptaba un valor desde el segundo webpart, ya nunca más volvía a aceptar valores del primero. Evidentemente el comportamiento cambiaba si se invertía el orden de conexión. Tras dedicarle un buen rato y reproducir el problema en su esencia usando tres webparts, caí en la cuenta de que un valor null o vació también es transmitido …. de modo que ese era el problema. Así que a revisar los PartComunicationMain()


```csharp	
/// <summary>
/// In this method, a part can fire any events that it requires to.
/// </summary>
public override void PartCommunicationMain()
{
    if (CellReady != null && sProviderValue != defaultText)
    {
       // send value 
    }
}
```

![](images/Sharepoint/multiplesproveedores.gif)