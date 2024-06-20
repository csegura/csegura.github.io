+++
title = 'Unit Testing 2'
date = 2007-09-03T00:00:00+02:00
tags = ['tests']
+++

Como comentaba hace unos días, realizar pruebas unitarias usando mocks, no se siempre la mejor solución, personalmente, creo que no se debe abusar de ellos y usarlos para todo.

A continuación os cuento, como realizo mis pruebas unitarias cuando programo para SharePoint, seguramente no sean lo más idóneo del mundo, pero como dije en su día, no considero esto una ciencia sino más bien, un arte en donde cada uno utiliza aquello con lo que obtiene los mejores resultados, en cuanto a calidad. Siempre mantengo en mente el principio de que no deben llevar más trabajo que la realización del código.

El SDK de SharePoint, como comenté con anterioridad, es un framework con lo cual debemos dar por hecho algunas cosas, tenemos que tener claro que Microsoft, tomo ciertas decisiones en su diseño que por ende, nosotros no podemos cambiar.

SharePoint consta de un complejo modelo de objetos, en tres capas. De modo que cada vez que manipulamos estos, de forma transparente vamos cambiando la base de datos donde estos son persistidos. Esta cuestión es importante ya que es como si trabajásemos contra una base de datos y todos los que han realizado pruebas unitarias con bases de datos, saben la complejidad añadida que esto conlleva. Al margen de la discusión ya conocida sobre si las pruebas unitarias deben o no deben usar la base de datos como apunto Rodrigo.

Yo soy de la opinión de que mientras se pueda (por que se conoce) que base de datos se va a usar y podemos recrear un modelo de los datos sin un gran esfuerzo, es la mejor opción.

En SharePoint, aplico el mismo principio. Por diseño, la base de datos esta de manera subyacente así que la mejor manera de probar las cosas es usándola.

Mis pruebas con las Webparts

Las Webparts son un elemento dentro de SharePoint que nos permite interactuar con el usuario, a través del interface de usuario. En esta nueva versión como sabéis son los nativos de ASP.Net.

Como tales elementos, debemos confiar en que el comportamiento que tienen es el esperado, y me centro en realizar pruebas de la lógica subyacente, aquello que se encargará de producir los resultados en función de las entradas que reciba.

Veamos un simple ejemplo con un webpart que muestra el número de elementos que cumplen una condición en una lista.

```csharp	
private string _list = string.Empty;
private string _message = string.Empty;
private string _query = string.Empty;

#region WEBPART PROPERTIES
[Personalizable(PersonalizationScope.Shared),
 WebBrowsable,
 Category("Settings"),
 WebDisplayName("List Name")]
public string List
{
…

}

[Personalizable(PersonalizationScope.Shared),
 WebBrowsable,
 Category("Settings"),
 WebDisplayName("CAML Query")]
public string Query
{
…

}

[Personalizable(PersonalizationScope.Shared),
 WebBrowsable,
 Category("Settings"),
 WebDisplayName("Mesaage")]
public string Message
{
…
}
#endregion

protected override void Render(HtmlTextWriter output)
{
    try
    {
        SPWeb web = SPControl.GetContextWeb(Context);
        SPList list = web.Lists[List];
        SPQuery query = new SPQuery();
        query.Query = Query;
        SPListItemCollection items = list.GetItems(query);
        output.Write("<div>{0}<b>{1}</b></div>", Message, CountListItems(web, List, Query));
    }
    catch (Exception ex)
    {
        output.Write(String.Format("<div>{0}: {1}</div>", ex.GetType(), ex.Message));
    }
}
```

Bien, aquí algunas buenas prácticas que suelo recomendar. Siempre que podamos debemos independizar nuestra lógica del componente, esto lo podemos hacer bien separando nuestro código en nuevos métodos:

```csharp
protected override void Render(HtmlTextWriter output)
{
    SPWeb web = SPControl.GetContextWeb(Context);
    try
    {
        output.Write("<div>{0}<b>{1}</b></div>", Message, CountListItems(web, List, Query));
    }
    catch (Exception ex)
    {
        output.Write(String.Format("<div>{0}: {1}</div>", ex.GetType(), ex.Message));
    }
}

private int CountListItems(SPWeb web, string listName, string queryFiler)
{
    SPList list = web.Lists[listName];
    SPQuery query = new SPQuery();
    query.Query = queryFiler;
    SPListItemCollection items = list.GetItems(query);

   return items.Count;
}
```

O lo que es mejor, aplicando los principios de delegación o composición para extraer las responsabilidades y la lógica a una nueva clase.

```csharp
protected override void Render(HtmlTextWriter output)
{
    SPWeb web = SPControl.GetContextWeb(Context);
    ListItemCounter listCounter = new ListItemCounter(web);
    try
    {
        output.Write("<div>{0}<b>{1}</b></div>", Message, listCounter.CountListItems(List,Query));
    }
    catch (Exception ex)
    {
        output.Write(String.Format("<div>{0}: {1}</div>", ex.GetType(), ex.Message));
    }
}

…

internal class ListItemCounter
{
    private readonly SPWeb _web;

    public ListItemCounter(SPWeb web)
    {
        _web = web;
    }

    public int CountListItems(string listName, string queryFiler)
    {
        SPList list = _web.Lists[listName];
        SPQuery query = new SPQuery();
        query.Query = queryFiler;
        SPListItemCollection items = list.GetItems(query);

        return items.Count;
    }
}
```

Esto es importante ya que de este modo nuestro código quedará aislado de algunos de los elementos que el componente Webpart lleva implícitos, como el contexto en el cual la aplicación ASP.Net se está ejecutando; que entre otras cosas da bastante guerra ya que es complicado de reproducir. Y como consecuencia será más sencillo poder realizar las pruebas como veremos.