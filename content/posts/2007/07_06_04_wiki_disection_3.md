+++
title = 'Wiki Disection 3'
date = 2007-06-04T00:00:00+02:00
tags = ['sharepoint', 'wiki']
+++

En esta parte veremos cómo trabaja el campo especial **WikiField**, antes de nada recordaros un webpart, que escribí el año pasado y pasó sin pena ni gloria, pero resolvía el problema de los Wikis en WSS2.  

[csegMiniWiki](https://web.archive.org/web/20130623174220/http://www.ideseg.com/CategoryView,category,csegMiniWiki.aspx)

![](/images/Sharepoint/csegMiniWiki_1.gif)

Bueno, resulta que el **WikiField** realiza (CASI) las mismas tareas que hacía yo en el webpart que es traducir las etiquetas marcadas entre corchetes por los vínculos correspondientes.

**El problema de las búsquedas**

Cuando escribí el webpart [**csegMiniWiki,**](https://web.archive.org/web/20130623174220/http://www.ideseg.com/CategoryView,category,csegMiniWiki.aspx) el único problema que tenía eran las búsquedas. Esto es debido a que al albergar el contenido del Wiki en elementos de la lista, cuando se buscaba cierto texto, el enlace de los resultados era al elemento correspondiente de la lista, en vez de la página en donde aparecía el texto renderizado y con la traducción de vínculos correspondiente; con lo que veíamos la fuente de la página wiki.

Este problema, lo han resuelto en el Wiki de MOSS dando a cada entrada una página, la plantilla que vimos anteriormente y que es copiada para cada entrada. De este modo MOSS indexa la página con el contenido correspondiente. Y la lista que mantiene los datos a su vez no es indexada.

Sin embargo, (y no es, porque yo lo hiciera) me encontraba más cómodo con mi Wiki.

**WikiField**

Ya lo hemos visto con anterioridad, y está definido en **fieldswss.xml**
    
```xml
<!– Wiki Fields –>
<Field ID="{C33527B4-D920-4587-B791-45024D00068A}"
    Name="WikiField"
    DisplayName="$Resources:core,WikiField;"
    StaticName="WikiField"
    SourceID="http://schemas.microsoft.com/sharepoint/v3″
    Group="_Hidden"
    Type="Note"
    RichText="TRUE"
    RichTextMode="FullHtml"
    IsolateStyles="TRUE"
    RestrictedMode="FALSE"
    NumLines="30″
    DisplaySize="110″
    UnlimitedLengthInDocumentLibrary="TRUE"
    WikiLinking="TRUE"
    Sortable="FALSE"
    Sealed="TRUE" 
    AllowDeletion="TRUE" />
<!– End Wiki Fields –>
```  

**WikiField**, es un campo de tipo “Note", control **NoteField**, e internamente usa **SPFieldMultiLineText**, como sabéis los campos tienen un tipo interno que alberga la lógica del campo, en este caso **SPFieldMultiLineText** y un control que sirve de fachada para manipularlo, **NoteField** en este caso.

![](/images/Sharepoint/sp1wiki_6.gif)

De modo que el trabajo se realiza en la clase **SPFieldMultiLineText**, que hereda de **SPField**

![](/images/Sharepoint/sp1wiki_7.gif)

Todos los campos de sharepoint heredan de **SPField**, dentro de **SPField**, hay un conjunto de métodos virtuales que son sobrescritos para cada implementación, los que nos interesan ahora son :

  
```csharp
// Devuelve el valor del campo
public virtual object GetFieldValue(string value)
{
    return value;
}
// Devuelve el valor del campo en formato Html
public virtual string GetFieldValueAsHtml(object value)
{
    return SPHttpUtility.HtmlEncode(this.GetFieldValueAsText(value));
}
// Devuelve el valor del campo como texto
public virtual string GetFieldValueAsText(object value)
{
    if (value != null)
    {
        return value.ToString();
    }
    return string.Empty;
}
// Devuelve el valor del campo en formato para usarse en los formularios nuevo y de edición
public virtual string GetFieldValueForEdit(object value)
{
    return this.GetFieldValueAsText(value);
}
```  

Si vemos el diagrama de la clase **SPFieldMultiLineText**, veremos como estos son sobrescritos para el campo mistilínea, en concreto **GetFieldValueAsHtml**, es el encargado de procesar los enlaces para los campos **WikiField** (aquellos que establecen la propiedad **WikiLinking** en True, ver el XML de la definición del campo), este tratamiento se realiza en el método **ProcessWikiLinks,** que gracias a dios es público de modo que podremos sobrescribirlo ![:-)](/images/Sharepoint/icon_smile.gif) .

  

  

Y digo esto, por que cuando se procesan los enlaces del Wiki, aquellos que no se encuentran definidos automáticamente son enlazados a **\_layouts/CreateWebPage.aspx  ![:-(](/images/Sharepoint/icon_sad.gif)**  