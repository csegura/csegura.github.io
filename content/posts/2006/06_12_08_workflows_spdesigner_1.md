+++
title = 'Workflows SPDesigner 1'
date = 2006-12-08T00:00:00+01:00
tags = ['sharepoint', 'workflow']
+++

Sin duda una de las mejores cosas de MOSS 2007 es el nuevo SPD, y dentro de este, el diseñador de flujos de trabajo, que nos permite de forma ágil y sencilla diseñar nuestros flujos de trabajo.

Aunque como he comentado en otras ocasiones, si deseamos realizar flujos de trabajo más complejos, o máquinas de estados debemos usar Visual Studio.

SPD, solo nos permite realizar workflows secuenciales con las actividades que vienen predeterminadas. Sin embargo existe la posibilidad de ampliar las actividades básicas que nos encontramos dentro de SPD, con lo cual podemos extender la funcionalidad de nuestros workflows sin llegar a realizarlos completamente en Visual Studio.

De manera predeterminada, SharePoint Designer incluye 22 acciones.

![](/images/Sharepoint/SWA_[7].gif)

Estas acciones se encuentran definidas en el archivo WSS.ACTIONS, que se encuentra en “C:\Archivos de programa\Archivos comunes\Microsoft Shared\web server extensions\12\TEMPLATE\3082\Workflow”.

En este archivo se encuentran definidas tanto las condiciones como las acciones que figuran dentro de SPD.

```xml
<Condition Name=”Creado en un intervalo de fechas determinado”
           FunctionName=”CreatedInRange”
           ClassName=”Microsoft.SharePoint.WorkflowActions.Helper”
           Assembly=”Microsoft.SharePoint.WorkflowActions, 
                  Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c”
           AppliesTo=”list”
           UsesCurrentItem=”true”>
  <RuleDesigner Sentence=”creado entre %1 y %2″>
    <FieldBind Id=”1″ Field=”_1_” Text=”fecha” DesignerType=”Date”/>
    <FieldBind Id=”2″ Field=”_2_” Text=”fecha” DesignerType=”Date”/>
  </RuleDesigner>
  <Parameters>
    <Parameter Name=”_1_” Type=”System.DateTime, mscorlib” Direction=”In”/>
    <Parameter Name=”_2_” Type=”System.DateTime, mscorlib” Direction=”In”/>
  </Parameters>
</Condition>
```

En donde podemos ver el ensamblado que se ocupa de manejar la condición, a que elementos se aplica y si es posible usar el ítem actual del workflow.

Dentro de la condición tenemos la regla para el diseñador, con el texto que va a aparecer, cada regla usa una serie de campos los tags FieldBind, que se enlazan con los parámetros necesarios en el ensamblado.

Cada tag FieldBind tiene un identificador ID que se corresponde con la posición del campo dentro de la sentencia ID=1 será %1 en la sentencia.

También podemos ver atributos como Text que será el texto por defecto y el tipo de campo DesignerType.

Después tenemos la sección de Parameters con los distintos parámetros que se pasarán al ensamblado. El atributo Name ha de corresponderse con el atributo Field del tag FieldBind, y tenemos la dirección del parámetro In para entradas y Out para las salidas.


```xml
<Action Name=”Establecer estado de aprobación del contenido”
  ClassName=”Microsoft.SharePoint.WorkflowActions.SetModerationStatusActivity”
  Assembly=”Microsoft.SharePoint.WorkflowActions, Version=12.0.0.0, 
  Culture=neutral, PublicKeyToken=71e9bce111e9429c”
  AppliesTo=”list”
  ListModeration=”true”
  Category=”Acciones principales”
  UsesCurrentItem=”true”>
  <RuleDesigner Sentence=”Establecer estado de aprobación del contenido en %1 con %2″>
    <FieldBind Field=”ModerationStatus” DesignerType=”Dropdown” Id=”1″ Text=”este estado”>
      <Option Name=”Aprobado” Value=”Approved”/>
      <Option Name=”Rechazado” Value=”Denied”/>
      <Option Name=”Pendiente” Value=”Pending”/>
    </FieldBind>
    <FieldBind Field=”Comments” Text=”comentarios” Id=”2″ DesignerType=”TextArea” />
  </RuleDesigner>
  <Parameters>
    <Parameter Name=”ModerationStatus”  Type=”System.String, mscorlib” Direction=”In” />
    <Parameter Name=”Comments” Type=”System.String, mscorlib” Direction=”Optional” />
    <Parameter Name=”__Context” 
      Type=”Microsoft.SharePoint.WorkflowActions.WorkflowContext, Microsoft.SharePoint.WorkflowActions” />
    <Parameter Name=”__ListId” Type=”System.String, mscorlib” Direction=”In” />
    <Parameter Name=”__ListItem” Type=”System.Int32, mscorlib” Direction=”In” />
  </Parameters>
</Action>
```

A continuación vamos a ver como se ven las acciones en este mismo archivo, son muy similares a las condiciones.

La primera parte incluye el ensamblado que se ocupará de manejar  la acción.    

La segunda, las reglas para el diseñador. En este caso los campos que usa son un combobox (DesignerType=”Dropdown”) y una línea de texto (DesignerType=”TextArea”)

La tercera parte la de los parámetros además de utilizar los dos primeros campos definidos en la regla del diseñador, podemos ver que usa tres parámetros adicionales que son:

__Context : que es el contexto del flujo de trabajo.
__ListId: el id de la lista con la que estamos trabajando
__ListItem:  el ítem actual

Con estos tres campos (que están preestablecidos, de modo que podemos usarlos siempre que queramos) tenemos control  tanto sobre la lista como sobre el flujo de trabajo que se está llevando a cabo.


No existe un archivo XSD, para este tipo de archivos, por el momento.

Without a doubts one of the best things of MOSS 2007  is the new SharePoint Designer, and within him, the workflow designer, that  allows us speedy  and simple form to design  workflows. 

As I have commented in other occasions, if we wish to make more complex workflows, or state machines, we need to use Visual Studio.  

SharePoint Designer, allows us to make sequential workflows with predetermined activities. Nevertheless, the possibility to extend the basic activities exists  and we can extend the functionality of ours workflows without  to write them completely in Visual Studio.
 
Out-the-box, SharePoint Designer includes 22 actions.
 
## Translated

Those actions are defined in the file WSS.ACTIONS, that resides in the directory “C:\Program Files\Common files\Microsoft Shared \web server extensions\12\1033\TEMPLAT\Workflow”. 
 
In this file, the conditions and the actions that appear within SharePoint Designer are defined.

(code)

Herein,  we can see the assembled dll that handles the condition, to which elements  he is applied, and if it is possible to use the present item in the workflow.

Within the condition we have the rule for the designer, with the text that is going to appear; each rule uses a series of fields tags FieldBind, that connects with the necessary parameters in the assembled file.

Each tag FieldBind has an identifier that  corresponds with the position of the field within sentence ID=1, and that will be %1 in the sentence attribute as well.
Also we can see attributes like Text, that will be the text by defect, and the DesignerType, that is the type of field.

After that, we have the section of Parameters with the different parameters that will go to the assembled file. The Name attribute has to correspond with the Field attribute of tag FieldBind, and the direction of the parameter needs to be In for input and Out for output.
 
(code)

Now, we are going to see how the actions look in the same file; they are very similar to the conditions.  


The first part includes the assembled one that will take care to handle the action.
The second one, are the rules for the designer. In this case the fields that has been used are a combobox (DesignerType= ” Dropdown “) and a line of text (DesignerType= ” TextArea “)
The third part of the parameters, besides to use both fields defined in the rule of the designer, uses three additional parameters that are:

__Context: that it is the context of the WorkFlow.
 __ListId: you go of the list with which we are working
__ListItem:  the present item

With these three fields (that they are pre-established, so that we can use them whenever we want) we have as much control on the list as on the job stream that is being carried out.


At the moment A file XSD for this type of archives does not exist.