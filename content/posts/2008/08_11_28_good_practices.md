+++
title = 'Good Practices'
date = 2008-11-28T00:00:00+01:00
tags = ['misc']
+++

Cenando

El otro día paso Unai por Pamplona y estuvimos cenando y departiendo sobre todas esas cosas frikis que nos gustan. Una suerte para los que habéis podido asistir a los cursos que ha impartido de Entity Framework  y WCF.

Durante la cena, [[degustábamos unos “Penne Arrabiata” (no seáis mal pensados, que son macarrones con tomate un poco picante) y un “Ochoa Tempranillo” (recomendado)]], hablamos de; libros, de código, de más código, de bugs, de depuración, de tecnología, del bien y del mal (lo típico), no sé si ayer hablamos de sexo (no me acuerdo, pero con el frio que hacía es posible que no :-) .

Bueno, la cosa es que le comenté algunas de las cositas del Api de SharePoint.

¿Buenas Prácticas?

Como ya he contado en alguna ocasión, las colecciones de SharePoint, son a la antigua usanza (Net 1.0), es decir que implementan IEnumerable, en una clase contenida, esto lo hacen en una clase abstracta SPBaseCollection del cual heredan el resto de colecciones de SP.

Bien, hasta el momento no hay mucho problema, es un tema de diseño, necesario para implementar las serializaciones de los objetos además de la persistencia que realiza sharepoint via COM.

Si realicemos una consulta usando SPQuery, (SPQuery nos permite recuperar elementos de una lista usando CAML, que es un meta-lenguaje basado en XML que tiene SharePoint para muchas cosas, entre ellas recuperar elementos de las listas)

```xml
<Where>
  <Geq>
    <FieldRef Name=”ID” />
    <Value Type=”Integer”>10</Value>
  </Geq>
</Where>
```

Nos devolverá todos los elementos de una lista donde el ID sea mayor que 10.

Para poder ejecutar una consulta CAML sobre una lista tenemos una clase llamada SPQuery a través de la cual montamos la consulta.

```csharp
SPQuery query = new SPQuery
                {
                   Query = “CONSULTITA EN CAML”
                };
```

Para recuperar una colección de Items que cumplen esta consulta basta con indicar a la lista los items que queremos pasandole un SPQuery:
SPListItemCollection ítems = lista.GetItems(query);

Bien, como muchos ya sabéis que no es muy buena práctica devolver null, para no tener que comprobar si ítems es null antes de acceder, de modo que lo correcto es devolver una colección vacía (en este caso, como veremos luego tiene otro fundamento).

GetItems internamente nos devuelve una nueva colección

```csharp
public SPListItemCollection GetItems(SPQuery query)
{
    return new SPListItemCollection(this, query);
}
```

Pero qué pasa si la consulta está mal formada ó es incompleta.  Lo que cabe de esperar es:

1.- Que nos devuelva una excepción en el momento de crear SPQuery (cosa que no hace)
2.- Que nos ofrezca una propiedad o algo para comprobar si la consulta es correcta (cosa que no hace)
3.- Que nos devuelva una colección vacía (cosa que hace peligrosamente a medias)

¿Por qué lo hace a medias? Porque aparentemente nos devuelve una colección vacía, es decir si la consulta está mal, ítems no es null. Pero OJO no es una colección valida.

```csharp
SPQuery query = new SPQuery
                {
                        Query = “MI mala CAML Query”
                };

SPListItemCollection items = list.GetItems(query);

if (items!= null)
{
    Debug.WriteLine(“Soy una colección no nula. Parece que valgo…”);
    // Ahora reviento
    foreach (SPListItem item in items)
    {

    }
}
```
Las colecciones de este tipo en SharePoint, son de carga retardada de modo que la colección se carga cuando realmente vamos a usarla (Lazy-Load / Proxy), en ese momento se hace una petición SPRequest que es al que se encarga de recuperar el contenido y obtener la colección de elementos. (fundamento)

En ese momento se usa la consulta SPQuery que le hemos pasado para recuperar los datos, y al tratar de cargarla, como la consulta está mal formada, da una excepción (no advertida ni documentada), y la colección sigue siendo una colección hasta que usemos alguna de sus propiedades o tratemos de recorrerla. Es decir no es una colección vacia, si no una colección donde todo se ha quedado mal inicializado si intentas un items.Count antes de recorrer la colección tambien dará una excepción ya esta va a producirse de igual manera al cargar los datos.

De modo que la buena práctica se convierte en mala práctica ya que se pasa de hacer una comprobación de null antes, a tener que hacer un Try/Catch en el momento de recorrer la colección (como decimos por aquí, cojonudo).

Como alternativa, se puede implementar un método por ejemplo, vía extensión;  para comprobar que la consulta es valida y en caso de no serla que nos devuelva una colección bien formada cuando menos. Otra alternativa podría ser otro método como EnsureCollection, a través del cual podamos recuperar la excepción si nos interesa comunicar que la consulta esta mál formada.

La cosa sería algo así:

```csharp
public static SPListItemCollection TryGetItems(this SPList list, SPQuery query)
{

    SPListItemCollection items; 

    try
    {
        items = list.GetItems(query);
        int count = items.Count;
    }
    catch(SPException ex)
    {
        query.Query = string.Empty;
        items = list.GetItems(query);
    }

    return items;
}
```

JA, pero ahí no termina la cosa …  los señores de SharePoint son unos fenómenos optimizando y lo que hacen SPQuery internamente es generar una Vista (propiedad ViewXml de SPQuery), para optimizar el rendimiento, esta vista en Xml, se genera reuniendo todas las propiedades de SPQuery, y se genera siempre y cuando no se ha generado antes (optimización)

De modo, que si cambiamos la propiedad Query de SPQuery, la consulta interna ViewXml no cambia (ya se genero antes), manteniendo la última consulta generada, para lo cual debemos limpiar ViewXml.

```csharp
query.Query = string.Empty;
query.ViewXml = string.Empty;

items = list.GetItems(query); 
```

¿Por qué que les habría costado implementar un flag de suciedad y reconstruir la ViewXml cada vez que el objeto este sucio? ¿por qué no documentarlo?

En fin, la cena estuvo genial.