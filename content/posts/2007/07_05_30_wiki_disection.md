+++
title = 'Wiki Disection'
date = 2007-05-30T00:00:00+02:00
tags = ['sharepoint', 'wiki']
+++

Mucha gente me ha preguntado sobre la posibilidad de realizar cambios en el diseño del Wiki de SharePoint. (¿Será porque en una de mis demos enseño un Fantástico Wiki?), bueno, la respuesta es… que no se puede cambiar grrrr y explicaré  porque no.  
  
**¿Cómo está construido el Wiki de SharePoint?  
**  
El wiki de sharepoint, es una biblioteca de documentos que maneja un tipo de contenido oculto WikiDocument.  

  

![](/images/Sharepoint/sp1wiki_1.gif)

  

La definición XML

```xml
<ContentType ID="0×010108"
          Name="$Resources:WikiDocument"
          Group="_Hidden"
          Description="$Resources:WikiDesc"
          Version="0">
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
    <DocumentTemplate TargetName="/_layouts/CreateWebPage.aspx" />
</ContentType>
```
Cuando creamos una nueva página lo que hace sharepoint es pedirnos que rellenemos los campos a través del formulario **/\_layouts/createwebpage.aspx**, está página nos pedirá que introduzcamos los campos Título, que asignará al documento y Contenido (WikiField) que será el contenido de nuestra nueva página.  

![](/images/Sharepoint/sp1wiki_3.gif)

Además si hemos añadido campos personalizados a la biblioteca de documentos, también nos pedirá que rellenemos estos.  
El meollo de **CreateWebPage.aspx** se encuentra en la parte en que se crea el formulario:  

```html	
<TABLE class="ms-formtable" style="margin-top: 8px;" border=0 cellpadding=0 cellspacing=0 id="formTbl" width=100%>
    <TR>
        <TD valign="top" class="ms-formbody" width="625px">
                <b>
                <label for="<%=Name.ClientID%>">
                <SharePoint:FieldLabel FieldName="FileLeafRef" ControlMode="New" runat="server"/>
                </label>
                </b>&nbsp;
                <asp:TextBox id="Name" name="Name" runat="server" /> 
                    <SPAN class="ms-authoringcontrols"></SPAN>
                    <wssawc:UrlNameValidator ID="CusValSiteName" ControlToValidate="Name" runat="server"/>
                    <br />
                    <span class="ms-formvalidation">
                    <asp:Label id="Error" name="Error" runat="server" />
                    </span>
            </TD>
        </TR>
    <SharePoint:ListFieldIterator TemplateName="WideFieldListIterator" 
        ExcludeFields="FileLeafRef" ControlMode="New" runat="server"/>
</TABLE> 
```
  
Por un lado va el título, que es el nombre del documento (línea 9), con su validador que se encargará de comprobar que no exista ya un documento en la biblioteca con el mismo nombre (línea 11)  y después el resto de los campos que se renderiza mediante el control de Sharepoint ListFieldIterator (líneas 18 y 19)

En el momento en el que hacemos el submit de es este formulario, sharepoint copiará la plantilla contenida en **C:\\…\\ Microsoft Shared\\web server extensions\\12\\TEMPLATE\\DocumentTemplates** llamada **wkpstd.aspx** en la biblioteca de documentos asignandole como nombre el que hemos especificado, de modo que todas las páginas de nuestro wiki en realiadad son la misma ya que el contenido se aloja en la lista.

**Wkpstd.aspx** es la plantilla a través de la cual visualizamos las páginas Wiki.

  A priori, para cambiar el diseño de nuestro Wiki, bastaría con modificar el diseño de esta página, pero el problema es que cambiarían todos los wikis de nuestro portal.  
Si vemos como está construido **wkpstd.aspx** veremos que es una simple página que nos muestra el contenido de los datos de la lista, la parte interesante se encuentra dentro del PlaceHolderMain  

```html	
 <asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
      <SharePoint:FormField FieldName="WikiField" ControlMode="Display" runat="server"/>
      <TABLE class="ms-formtable" border=0 cellpadding=0 id="formTbl" cellspacing=0 width=100%>
              <SharePoint:ListFieldIterator
                          ControlMode="Display"
                          TemplateName="WideFieldListIterator"
                          ExcludeFields="FileLeafRef;#WikiField"
                          runat="server"/>
      </TABLE>
        <WebPartPages:WebPartZone runat="server" FrameType="None" ID="Bottom" Title="loc:Bottom" />
        <table border=0 cellpadding=2 cellspacing=0 width=100%&gt;
            &lt;tr>
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
En donde se renderiza el campo WikiField primero y después el resto de los campos a excepción del nombre y del propio WikiField. (el truki del WikiField lo coemntamos más tarde)

  Aquí podemos trastear para ver como los cambios hechos en esta página afectan al diseño de la página Wiki. (Guardar siempre una copia de la página original)
