+++
title = 'Wiki Disection 2'
date = 2007-06-04T00:00:00+02:00
tags = ['sharepoint', 'wiki']
+++

Continuando con el Wiki, hemos visto como esta construido básicamente y donde oculta el secreto de las páginas que se generan, ahora bien

**¿Podemos cambiar el diseño?**

Una vez que hemos visto como esta construido, podemos de tratar de realizar una solución que implemente un comportamiento similar. Para ello deberemos hacer algunas cosas, como crear nuestra propia página de de entrada, y configurar una lista (biblioteca de documentos) para que realice el mismo comportamiento que el Wiki, eso es que llame a nuestra página personalizada para crear nuevas páginas.

Para crear la página de entrada podemos partir de la que trae SharePoint, **CreateWebPage.aspx** e implementar nuestra propia solución para que en vez de usar la plantilla del wiki por defecto **Wkpstd.aspx,** podamos utilizar la nuestra. A modo de ejemplo yo he creado una solución un poco más genérica que la que viene por defecto. En este caso, he llamado a la solución **CustomTemplate**, y lo único que hace es añadir al **layouts** una nueva página llamada **CreateCustomPage.aspx** que será la encargada de crear nuevas páginas para nuestro Wiki.

A diferencia de la **CreateWebPage.aspx** que copia la plantilla **Wkpstd.apsx** para cada una de las entradas, esta nueva página **CreateCustomPage.aspx** buscará una página llamada **template.aspx** que deberá existir en la biblioteca de documentos, para usarla como plantilla. Esto nos va a permitir tener en cada uno de nuestros wikis, una plantilla personalizada, como es lógico la solución podría extenderse incluso para tener más de una plantilla e incluso, decidir que plantilla es la que se quiere aplicar a las páginas que creemos.

Como he comentado anteriormente, podemos partir del código suministrado por **CreateWebPage.aspx**  y lo único que debemos hacer es modificar el Submit, para que copie nuestra plantilla

```csharp
protected void SubmitBtn_Click(object sender, EventArgs e)
{
    string fileName;
    bool flag;
 
    Page.Validate();
 
    if (Page.IsValid)
    {
          fileName = Name.Text.Trim();
        
          if (fileName == null || fileName.Length == 0)
          {
              Error.Text = SPHttpUtility.HtmlEncode(SPResource.GetString("CreateWebPageInvalidTitle", new object[0]));
          }
          else
          {
              fileName = fileName + ".aspx";
              string listGuid = Request.QueryString.Get("List");
              try
              {
                  Guid guid;
   
                  guid = new Guid(listGuid);
   
                  SPList list = spWeb.Lists[guid];
   
                  if (list != null)
                  {
                      // Check if already exist the file                                               
                      string newFileUrl = list.RootFolder.Url + "/" + fileName;
                      if (spWeb.GetFile(newFileUrl).Exists)
                      {
                          Error.Text = SPHttpUtility.HtmlEncode(SPResource.GetString("CreateWebPageDuplicateTitle", new object[0]));
                      }
                      else
                      {                        
                          
                          // Get the template file
                          SPFile srcFile = list.RootFolder.Files["template.aspx"];
                          byte[] binFile = srcFile.OpenBinary();
   
                          // Create the new file based in the template
                          SPListItem item = list.RootFolder.Files.Add(fileName, binFile, false).Item;
   
                          // Save field values
                          foreach (BaseFieldControl baseField in SPContext.Current.FormContext.FieldControlCollection)
                          {
                              item[baseField.Field.InternalName] = baseField.Value;
                          }
                          item.UpdateOverwriteVersion();
                          SPUtility.Redirect(item.Url, SPRedirectFlags.UseSource | SPRedirectFlags.Static, Context);
                      }
                  }
                  else
                  {
                      Error.Text = SPHttpUtility.HtmlEncode(SPResource.GetString("CreateWebPageInvalidList", new object[0]));
                  }
              }
              catch (Exception ex)
              {
                  // There is a template file ?
                  Error.Text = SPHttpUtility.HtmlEncode(ex.ToString());
              }
          }
      }
  }
```

Una vez que tenemos nuestra solución para crear páginas, lo que debemos hacer es crear nuestra propia biblioteca de documentos para almacenar las páginas de nuestro wiki. Para que esta biblioteca de documentos pueda usar nuestra página personalizada para crear contenido **CreateCustomPage.aspx**, tendremos que crear un tipo de contenido y asignarle nuestra página.
 
![](/images/Sharepoint/sp1wiki_5.gif)

Podemos aprovechar este tipo de contenido para albergar más columnas que luego formen parte de la plantilla, imágenes, y otros cosas. Por último el campo **WikiField**, El campo **WikiField,** es básicamente el contenido de nuestra página, y es un campo especial de SharePoint,  que debemos respetar ya que tiene un comportamiento particular, tanto para la entrada de datos como a la hora de renderizarse, ya que trata realiza un tratamiento especial para los los vínculos. Aquí tenemos otro problema ya que tanto la definición del tipo de contenido para los Wikis así como la definición del campo **WikiField** esta oculta.

De modo que no podemos implementarla directamente y deberemos crear nuestro propio tipo de contenido, para ello, podemos copiar la definición que vimos anteriormente e implementarlo como una característica de modo que podamos asignarlo a cualquier biblioteca de documentos.

**feature.xml**   
```xml
<?xml version="1.0″ encoding="utf-8″ ?>
<Feature  Id="6D145000-D35F-43af-83A2-797A263A3ABC"
          Title="Custom Wiki Content Type"
          Description="Wiki content type to use templates"
          Version="12.0.0.0″
          Scope="Site"
          xmlns="http://schemas.microsoft.com/sharepoint/">
    <ElementManifests>
        <ElementManifest Location="elements.xml" />
      </ElementManifests>
</Feature>
```  
**elements.xml**  

```xml  
<?xml version="1.0″ encoding="utf-8″ ?>
 <Elements xmlns="http://schemas.microsoft.com/sharepoint/">
 <ContentType ID="0x010100f7c73f52e54d0bbdf1e83273d6db6800″         
         Name="Template based Wiki"      
         Description="Template based wiki"
     Group="IdeSeg"
         Version="0″>
         <FieldRefs>         
             <RemoveFieldRef ID="{fa564e0f-0c70-4ab9-b863-0177e6ddd247}" Name="Title" />
               <FieldRef ID="{c33527b4-d920-4587-b791-45024d00068a}" Name="WikiField" />
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
   </Elements>
```  

Finalmente solo nos queda hacer las modificaciones pertinentes en la plantilla de las páginas Wiki e introducirlas en nuestra biblioteca de documentos como template.aspx. En el ejemplo inferior, he añadido el creador de la entrada del Wiki.

```xml  
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <SharePoint:FormField FieldName="WikiField" ControlMode="Display" runat="server"/>
    <TABLE class="ms-formtable" border=0 cellpadding=0 id="formTbl" cellspacing=0 width=100%>
            <SharePoint:ListFieldIterator
                        ControlMode="Display"
                        TemplateName="WideFieldListIterator"
                        ExcludeFields="FileLeafRef;#WikiField"
                        runat="server"/>
    </TABLE>
      <WebPartPages:WebPartZone runat="server" FrameType="None" ID="Bottom" Title="loc:Bottom">
      <ZoneTemplate></ZoneTemplate>
      </WebPartPages:WebPartZone>
      <!– BEGIN CUSTOM –>
      <table border=0 cellpadding=2 cellspacing=0 width=100%>
          <tr>
              <td class="ms-descriptiontext" ID=onetidinfoblock2>
                  <SharePoint:FormattedString FormatText="<%$Resources:wss,form_createdby%>" runat="server">
                      <SharePoint:FormField ControlMode="Display" FieldName="Created" runat="server"/>
                      <SharePoint:FormField ControlMode="Display" FieldName="Author" runat="server"/>
                  </SharePoint:FormattedString>
              </td>
          </tr>
      </table>
      <!– END CUSTOM –>
      <table border=0 cellpadding=2 cellspacing=0 width=100%>
          <tr>
              <td class="ms-descriptiontext" ID=onetidinfoblock2>
                  <SharePoint:FormattedString FormatText="<%$Resources:wss,form_modifiedby%>" runat="server">
                      <SharePoint:FormField ControlMode="Display" FieldName="Modified" runat="server"/>
                      <SharePoint:FormField ControlMode="Display" FieldName="Editor" runat="server"/>
                  </SharePoint:FormattedString>
              </td>
          </tr>
      </table>
</asp:Content>
```