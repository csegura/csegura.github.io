+++
title = 'csEG Library'
date = 2006-03-01T00:00:00+01:00
tags = ['sharepoint']
+++

Estos días he estado trabajando en una nueva biblioteca de clases para SharePoint, bueno, en parte nueva y en parte adaptando a mis necesidades  algunas de las clases del SDK, (¡Que grande es la POO!). Aquí como siempre existirán discrepancias en cuanto al diseño, allí donde se reúnan programadores siempre habrá más puristas y otros más prácticos. Yo me decanto por los segundos. Con esto no quiero decir que estropee la magia de una clase introduciendo metodusHorribilis, pero sí que soy partidario de subclasear aquello que dispone de una interfaz poco agradable, creando una fachada más práctica y coherente con la aplicación que se está desarrollando, de este modo más adelante podremos intercambiar el subsistema haciendo unos pequeños cambios en nuestra subclase sin retocar nada más.


Bueno, dejándonos de teorías la cosa empezó con las interfaces de conexión de los WebParts. A mi juicio un claro ejemplo de interfaz poco agradable (probar a tener un interfaz ICellProvider y un ICellConsumer en el mismo WebPart), pero se le puede buscar la vuelta realizándolo con dos clases una CellConsumer y otra CellProvider, cada una con su correspondiente interfaz para después registrarlos en el EnsureInterfaces(), de este modo podemos usar tantos interfaces de conexión como deseemos en un mismo webpart.


Basándome en las clases auxiliares, un CellProvider siempre proveerá una celda y CellConsumer siempre consumirá una celda por lo tanto esas clases pueden quedar fijas e instanciarse con un  nombre de interfaz de conexión cuando se deseen usar.


Para mejorar la fachada que nos ofrece la clase WebPart, la idea es crear en nuestra subclase una tabla ó lista donde iremos añadiendo las distintas interfaces, también he incluido los métodos engorrosos que debemos usar siempre que usamos interfaces de conexión PartCommunicationConnect, PartCommunicationInit, PartCommunicationMain. De este modo si hemos añadido interfaces de conexión a nuestra clase ellos deberán actuar en consecuencia.


![](/images/Sharepoint/csegLibrary1.gif)



Básicamente añadir interfaces de conexión sería algo como esto


```csharp
public class csegTestLibrary : csegWebPart
{
    private const string defaultText = "";
    private string text = defaultText;

    private string sProvider = "Test Cell";
    private string sProvider2 = "Test Cell 2";
    // csegWebPart Connection interfaces
    WebPartCellConsumer cellConsumer;
    WebPartCellProvider cellProvider;
    WebPartCellProvider cellProvider2;
    
    #region WEBPART CONSTRUCTOR
    public csegTestLibrary()
    {
        cellConsumer = new WebPartCellConsumer("csegRollUpConsumer");
        cellProvider = new WebPartCellProvider("csegRollUpProvider");
        cellProvider2 = new WebPartCellProvider("csegRollUpProvider2");
        
        AddInterface(new WebPartConnectionInterface(
                "ICellConsumer",
                WebPart.UnlimitedConnections,                
                ConnectionRunAt.Server,                        
                cellConsumer,                                        
                "csegCellConsumer",                                                                
                "Get cell from",                                                                    
                "Consumes a cell"
            ));

        AddInterface(new WebPartConnectionInterface(
                "ICellProvider",
                WebPart.UnlimitedConnections,                
                ConnectionRunAt.Server,                        
                cellProvider,                                        
                "csegCellProvider",                                                                
                "Set cell from",                                                                    
                "Provide a cell"
            ));
        
        AddInterface(new WebPartConnectionInterface(
                "ICellProvider",
                WebPart.UnlimitedConnections,
                ConnectionRunAt.Server,
                cellProvider2,
                "csegCellProvider2",    
                "Set a second cell from",
                "Provide a second cell"
            ));        
    }
#endregion
```


Y para enviar y recibir las celdas bastaría con


```csharp
#region WEBPART INTERFACES
public override void InitConsumers()
{
    if (cellConsumer.IsConnected)
    {
        cellConsumer.FireInit("Celda", "CeldaNombre");
    }
}
public override void InitProviders()
{
    //Is it connected
    if (cellProvider.IsConnected)
    {
        cellProvider.Fire(sProvider);
    }
    //Is it connected
    if (cellProvider2.IsConnected)
    {
        cellProvider2.Fire(sProvider2);
    }
}
#endregion
```

Y el resultado

![](/images/Sharepoint/csegLibrary2.gif)


