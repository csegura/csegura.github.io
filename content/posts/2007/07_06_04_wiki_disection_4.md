+++
title = 'Wiki Disection 4'
date = 2007-06-04T00:00:00+02:00
tags = ['sharepoint', 'wiki']
+++

En está última parte de **Destripando el Wiki**, veremos como crear un campo personalizado para cambiar el comportamiento por defecto del **SPFieldMultiLineText** el usado por **WikiField,** de modo que podremos cambiar el comportamiento a la hora de visualizar los enlaces a entradas que no están definidas para que estas sean redirigidas a nuestra página **CustomCreatePage.aspx**.

Como comentaba en anteriores posts, hemos visto que el wiki es una biblioteca de documentos que almacena páginas basadas en un tipo de contenido llamado Página Wiki que hereda de documento. Cuando se crea una nueva página la plantilla llamada **wkpstd.aspx** se copia en la biblioteca de documentos. Vimos que podemos crear nuestra propia página **CreateCustomPage.aspx,** para recrear el mismo comportamiento, utilizando nuestras propias plantillas y que esto funcionaba correctamente. Pero el problema llega cuando el campo **WikiField** se renderiza, ya que mantiene un enlace a **CreateWebPage.aspx**.

Antes de continuar, creo que es evidente que los errores de diseño en la solución **Wiki** de Sharepoint son más que notables. Para empezar, han limitado la plantilla incrustando el nombre de la misma en el código de **CreateWebPage.aspx,** limitando los usos del Wiki. Por otro lado, el campo **WikiField**, es el campo **SPFieldMultiLine**, al cual han añadido el método **ProcessWikiLinks** para realizar la conversión de los enlaces, cuando este debía ser una clase heredada del mismo. Por último, el control a través del cual se renderiza **WikiField**, es **RichTextField**, el cual hereda de **NoteField**, y que debía haber sido también una clase heredada con el fin de que cada una se dedicara a lo suyo y no mezclar distintas funcionalidades aunque sean parecidas en la misma clase, lo cual nos permitiría a los desarrolladores una comprensión mejor del funcionamiento sin tener que buscar donde han ido haciendo los trucos, y nos facilitaría la tarea a la hora de extender SharePoint. Como si no fuera lo suficientemente grande el SDK, como para añadir unas cuantas clases más.

En primer lugar tendremos que crear nuestro propio campo personalizado, yo lo he llamado **Wiki** que a su vez hereda de **SPFieldMultiLineText,**  y he sobreescrito **GetFieldValueAsHtml**, para reemplazar la página por defecto por la nuestra.

```csharp	
public class Wiki : SPFieldMultiLineText
   {
    #region SPField Constructors
    public Wiki(SPFieldCollection fields, string fieldName)
        : base(fields, fieldName)
    {           
    }
    
    public Wiki(SPFieldCollection fields, string typeName, string displayName)
        : base(fields, typeName, displayName)
    {        
    }
    #endregion
    
    public new string GetFieldValueAsHtml(object value, SPListItem item)
    {            
        string html = base.GetFieldValueAsHtml(value, item);
        return html.Replace("CreateWebPage", "CreateCustomPage");
    }
  
    public override BaseFieldControl FieldRenderingControl
    {
        get
        {
            BaseFieldControl fieldControl = new WikiField();
            fieldControl.FieldName = InternalName;
            return fieldControl;
        }
    }
```

Para subsanar el segundo problema, necesitamos crear también un control que llame a nuestro **GetFieldValueAsHtml**, para lo cual he heredado de **NoteField,** y sobrescrito el método de **RenderFieldForDisplay**

```csharp  
public class WikiField : NoteField
{
    protected override void RenderFieldForDisplay(HtmlTextWriter output)
    {
        Wiki field = (Wiki) Field;
        if (field != null)
        {
            if (field.WikiLinking)
              {
                  output.Write("<div class=\"ms-wikicontent\">");
                  output.Write(field.GetFieldValueAsHtml(ItemFieldValue, ListItem));
                  output.Write("<p></p></div>");
                  return;
              }
          }
          else
          {
              return;
          }
          base.RenderFieldForDisplay(output);
      }
  } 
```

Y la definición del nuevo campo **Wiki**

```xml	
<FieldType>
       <Field Name="TypeName">Wiki</Field>
       <Field Name="ParentType">Note</Field>        
       <Field Name="TypeDisplayName">
           WikiField 
       </Field>
       <Field Name="TypeShortDescription">
           WikiField supports custom page
       </Field>
        <Field Name="UserCreatable">FALSE</Field>
        <Field Name="ShowInListCreate">FALSE</Field>
        <Field Name="ShowInSurveyCreate">FALSE</Field>
        <Field Name="ShowInDocumentLibraryCreate">FALSE</Field>
        <Field Name="ShowInColumnTemplateCreate">FALSE</Field>
        <Field Name="Sortable">FALSE</Field>
        <Field Name="Filterable">FALSE</Field>
        <Field Name="FieldTypeClass">IdeSeg.SharePoint.CustomFields.Wiki.Wiki
    IdeSeg.SharePoint.CustomFields,Version=1.0.0.0
    Culture=neutral, PublicKeyToken=…</Field>
</FieldType>      
```
  
Bien, por último solo nos quedaría crear nuestro propio tipo de contenido para poder adjuntarlo a la biblioteca de documentos, como es lógico podríamos crear una definición de lista con el tipo de contenido, pero por abreviar, yo solo he creado el tipo de contenido que después podemos añadir a una biblioteca de documentos.

**feature.xml**

```xml
<Feature Id="1d9a8ea3-0b7d-42cf-8c64-78df773b7e41″ 
    Title="IdeSeg Wiki" 
    Description="Wiki with custom templates" 
    Version="1.0.0.0″ 
    Scope="Site" 
    xmlns="http://schemas.microsoft.com/sharepoint/">
  <ElementManifests>
    <ElementManifest Location="fields.xml" />
    <ElementManifest Location="ctypes.xml" />    
    </ElementManifests>
  </Feature>  
```

**fields.xml**

```xml	
<?xml version="1.0″ encoding="utf-8″?>
<!–
–>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <Field ID="{f1d10620-1f85-460b-8132-7c57cd6eABCD}" 
     Name="WikiFld"
     DisplayName="Contenido"
     StaticName="WikiField"
     Group="_IdeSeg"
       Hidden="TRUE"
       Type="Wiki"
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
       AllowDeletion="TRUE">
      </Field>
  </Elements>
```  

**ctypes.xml**

```xml	
<?xml version="1.0″ encoding="utf-8″?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <ContentType ID="0x0101005ADDEAA7312EE967BFC3076B9699C3D4″
    Name="IdeSeg Wiki" 
    Group="_IdeSeg" 
    Description="IdeSeg Wiki with custom templates"     
    Version="1″>
    <FieldRefs>
      <RemoveFieldRef ID="{fa564e0f-0c70-4ab9-b863-0177e6ddd247}" Name="Title" />
        <FieldRef ID="{f1d10620-1f85-460b-8132-7c57cd6eABCD}" Name="WikiField" />
      </FieldRefs>
      <XmlDocuments>
              <XmlDocument NamespaceURI="http://schemas.microsoft.com/sharepoint/v3/contenttype/forms">
                  <FormTemplates xmlns="http://schemas.microsoft.com/sharepoint/v3/contenttype/forms">
                      <Display>DocumentLibraryForm</Display>
                      <Edit>WikiEditForm</Edit>
                      <New>WikiEditForm</New>
                  </FormTemplates>
              </XmlDocument>
          </XmlDocuments>
          <DocumentTemplate TargetName="/_layouts/CreateCustomPage.aspx" />
    </ContentType>
  </Element>
 ``` 

![](/images/Sharepoint/sp1wiki_8.gif)

  

He recibido algunos comentarios acerca de el nombre del post "**Destripando**", puede que se deba al carácter latino, pero no. En un principio pensé en llamarle **Anatomía del Wiki**, que sonaba más **científico**, al igual que **Disección del Wiki**; **Funcionamiento interno del Wiki**, sonaba muy clásico y **Autopsia del Wiki** es para los cadáveres  y moss todavía esta calentito. Destripando el wiki, tiene un sabor más de carnicero, por que lo que estamos haciendo con el wiki, ya que su diseño es de casquería,  **Destripando el Wiki**, era el título correcto.

  
