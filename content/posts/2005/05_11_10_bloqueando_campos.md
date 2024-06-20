+++
title = 'Bloqueando campos'
date = 2005-11-10T00:00:00+01:00
tags = ['sharepoint']
+++

Hace unos días necesitaba bloquear un campo en una lista de sharepoint, esto se puede hacer modificando las páginas newform.aspx y editform.aspx y añadiendo un pequeño script.

```html
<script defer>
    // tomar el campo y bloquearlo
    var fld_anotacion = frm.FieldPost(frm.FindField("Anotaci_x00f3_n"));
    fld_anotacion.readOnly = true;
    // poner el foco en el campo descripcion
    frm.FindField("Descripci_x00f3_n").FieldFocus();
</script>
```

En este caso en concreto, el campo bloqueado se rellena desde un nuevo formulario (una copia de editform.aspx que he modificado para albergar una nueva zona de webparts y dentro de esta he añadido un data viewer webpart) este formulario se utiliza para rellenar el campo que con los formularios iniciales se encuentra bloqueado.


He modificado el xslt del data viewer webpart de manera que cuando se hace click sobre uno de los enlaces el valor pasa al formulario.

```html	
<a href="javascript:Anotacion(‘{@Valor}’)">
  <xsl:value-of disable-output-escaping="yes" select="ddwrt:AutoNewLine(string(@Valor))"/>
</a>
```

El xslt usa la función "Anotacion" que es la que se encarga de pasar el valor seleccionado al formulario.

```html	
  <script>
  function Anotacion(valor)
  {
    var frm = this.frm
    var fld_anotacion = frm.FieldPost(frm.FindField("Anotaci_x00f3_n"));
   
    fld_anotacion.readOnly = false;
   
    if ((valor != null))
      {
        fld_anotacion.value = unescape(valor);
      }
     
      fld_anotacion.readOnly = true;
     
      frm.FindField("Descripci_x00f3_n").FieldFocus();
    }
    </script>
```

Recuperamos el campo, lo desbloqueamos (en este también esta bloqueado para evitar que se rellene a mano)  y si el valor no es nulo lo coloca en el formulario.