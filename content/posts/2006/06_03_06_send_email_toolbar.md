+++
title = 'Send Email Toolbar'
date = 2006-03-06T00:00:00+01:00
tags = ['sharepoint']
+++

Hace ya algún tiempo  Mark Bower, explicaba como personalizar el menú de opciones con un bonito ejemplo para enviar el enlace de un documento por correo electrónico. Este fin de semana he tratado de mejorarlo, ya que enviar un enlace está muy bien cuando se envían correos a personas de la misma empresa, evitando duplicar información. Sin embargo si queremos enviar dicho documento a una persona del exterior, tenemos que salvar primero el documento en el escritorio para después adjuntarlo a un mensaje.


Basándome el código de Mark, lo que he hecho ha sido añadir una función en javascript que llama vía activex a outlook, crea un nuevo mensaje,  y le añade el documento seleccionado. Hay que tener en cuenta que para usar este control el sitio debe ser seguro (Herramientas->Opciones de Internet->Seguridad->Sitios->Sitios de confianza) de lo contrario el nos dará el error "Error El servidor de Automatización no puede crear el objeto".


```javascript	
// SendByMail
// Send the file as attachment
function SendMessage(URL)
{
  try 
  {
     var outlook = new ActiveXObject("Outlook.Application");
     var msg = outlook.CreateItem(0);
        
     var atach = msg.Attachments(); 
     
     msg.display();     
     atach.Add(URL);                       
  }
  catch(e)
  {
     alert(“Error “+e.description); 
  }
}
```