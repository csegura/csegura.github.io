+++
title = 'Menus de contexto personalizados'
date = 2005-12-12T00:00:00+01:00
tags = ['sharepoint']
+++

Hoy modificando un site (en el que tenía colocada la vista con las plantillas múltiples) he pensado en añadir un pequeño menú para modificar directamente las plantillas de la biblioteca de documentos en vez de crear un nuevo documento usando la plantilla. Finalmente lo he implementado usando el editor de de HTML e introduciendo un menú contextual en cada elemento para poder modificar cada plantilla.

Como estos días alguien me había comentado que tenia problemas al usar el ctx.HttpRoot, pongo el código de ejemplo aquí sobre como montar el  ContextInfo para los menús.



```js
<script>
    CTX = new ContextInfo();
    CTX.listBaseType = -1;
    CTX.Sample_Context = "CTX";
    CTX.Sample_Page = "";
    CTX.HttpPath = ""; 
    CTX.imagesPath = "/_layouts/images/";
    CTX.ctxId = 999;
 
  function Custom_AddListMenuItems(m, ctx)
  {
     CAMOpt(m, "Editar Plantilla", "EditarPlantilla()", "");
     CAMSep(m);
     return true;
  }
   
  function EditarPlantilla()
  {
       alert(currentItemID);
  }
</script>
```

El Html usado para montar el menú

```html	
<table height="100%" 
       cellspacing="0" 
       class="ms-unselectedtitle"
       onmouseover="OnItem(this)" 
       CTXName="CTX" 
       ItemId="1" 
       MsoPnlId="data">
    <tr>
        <td width="100%" class="ms-vb">
              TEST
          </td>
          <td>
              <img src="http://srvsp/_layouts/images/blank.gif" 
              width="13" style="visibility: hidden" alt="" />
          </td>
      </tr>
  </table>
```

![](/images/Sharepoint/MenuContexto1.gif)

Para añadir una segunda fila (como en el ejemplo superior) hay que duplicar la tabla.


En el script currentItemId coniene el ItemId de la tabla, si por el contario como ha sido mi caso queremos pasar datos desde el elemento seleccionado al script, basta con añadir un nuevo atributo a la hora de crear la tabla por ejemplo:

```html	
<table height="100%" 
       cellspacing="0" 
       class="ms-unselectedtitle" 
       onmouseover="OnItem(this)" 
       MisDatos="DATOS DE PRUEBA"
       CTXName="CTX" 
       ItemId="1" 
       MsoPnlId="data">
```

Y después en el script basta con  usar itemTable.MisDatos


```js
function EditarPlantilla()
{
     alert(itemTable.MisDatos);
}
```