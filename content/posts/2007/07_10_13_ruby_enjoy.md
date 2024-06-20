+++
title = 'Ruby, enjoy!'
date = 2007-10-13T00:00:00+02:00
tags = ['ruby']
+++


Hace un par de días me trajeron una nueva blackberry, [la curve](https://web.archive.org/web/20130623135522/http://www.blackberrycurve.com/). Ya sabéis lo que adoro yo estos cacharritos, la curve esta fenomenal, tiene cámara de fotos y gps y es mucho más pequeñita y manejable que la que tenía antes.  Ahora a su lado parece un ladrillo.  
  
La cosa es que llevaba tiempo pensando en hacer algún tipo de aplicación para la blackberry con java, pero lo de siempre… falta de tiempo.  
  
Ayer por la tarde, recordé un proyecto en el que estaba trabajando Miguel Jimenez y me entonces fue cuando me vino la idea a la cabeza…  
  
Ruby+BlackBerry … guauuuuu para qué diantres voy a andar dándole ahora a java (no lo descarto dentro de un par de días … ) si me puedo hacer una aplicación para lo que quiero en Ruby…  
  
Así que ayer por la noche me puse manos a la obra, la idea consistía en tener un pupurry de cosas:  
  
• Blog  
• Galería de fotos  
• Ubicaciones GPS  
  
De modo que pensé, bueno si un blog se hace en 15 minutos (url video) esto se debe hacer en unos…. Digamos 45 ¿no?  
  
Bueno, teniendo en cuenta que el diseño para la black es casi nulo, estoy seguro que un profesional de ruby se lo hubiera currado en una hora, a mí me ha costado algo más, pero bueno, todavía estoy aprendiendo… pero no le he dedicado más de 10 horitas  
  
Estoy encantado con el resultado. Os cuento lo que he hecho, básicamente he hecho un blog tipo al del video, por cada post puedo tener tantos comentarios como quiera y tantas fotos como quiera, las fotos se pueden subir desde el teléfono o cualquier sitio, automáticamente se generan dos miniaturas (necesario para cuando se buscan imágenes por gprs) un thumb de 100×100 y una imagen al 50%, también guardo la foto original obviamente.  

  

![](/images/Sharepoint/csegXBrain7.gif)

  

  
Después puedo localizar las fotos por entradas del blog (que serían como categorías y albunes de una galería de fotos) o por fecha.  
  
Posiblemente mañana le añada unos tags lo cual me ahorrará el trabajo de localización de imágenes.  
  
Desde luego el andamiaje que genera ruby es ideal para aplicaciones en dispositivos móviles dado lo básicas que son, aún así yo he cambiado las vistas una pizca, para sobre todo adaptar los enlaces al uso que le voy a dar. (las fotos son del explorer yo me he preocupado de que se vea bien en la black que es lo que voy a usar básicamente)  
  

  

![](/images/Sharepoint/csegXBrain6.gif)

  

  
En cuanto a las ubicaciones del GPS, lo que he hecho es dejar un campo en cada entrada del blog, para almacenar la ubicación que nos da el gps. La black cuando copiamos la ubicación del gps, lo que hace es generar un enlace a una página, [http://maps.blackberry.com/?lat=42.82735&lon=-1.66602&z=0](https://web.archive.org/web/20130623135522/http://maps.blackberry.com/?lat=42.82735&lon=-1.66602&z=0) esta url, solo funciona desde la blackberry, con lo cual si la copiamos en un mensaje y se la enviamos a alguien no podrá visualizar el mapa.  
  

  

![](/images/Sharepoint/csegXBrain%25204.gif)

  

Yo lo que he tratado de hacer es mostrar la imagen de google maps, cuando se consulte la url guardada, pero desde el navegador de la black, es imposible acceder a google maps. De modo que guardo el enlace del mapa de la black, pero a su vez genero otro enlace correspondiente al mapa de google. Para esto he usado la api de google, (ya que en un futuro quiero hacer más cosas con esto). Y así desde casa, puedo ver la ubicación en el mapa de google.

  

![](/images/Sharepoint/csegXBrain%25205.gif)

  

  
  
**Recursos**  
• [Ruby](https://web.archive.org/web/20130623135522/http://www.ruby-lang.org/) + [Rails](https://web.archive.org/web/20130623135522/http://www.rubyonrails.org/)  
• [Attachment\_fu](https://web.archive.org/web/20130623135522/http://clarkware.com/cgi/blosxom/2007/02/24#FileUploadFu)  
• [RMagick  
](https://web.archive.org/web/20130623135522/http://rmagick.rubyforge.org/)• [YM4R  
](https://web.archive.org/web/20130623135522/http://thepochisuperstarmegashow.com/ProjectsDoc/ym4r_gm-doc/)• [Google maps tutorial](https://web.archive.org/web/20130623135522/http://www.econym.demon.co.uk/googlemaps/)  
• [Google Maps API](https://web.archive.org/web/20130623135522/http://www.google.com/apis/maps/documentation)  
• [Cartographer  
](https://web.archive.org/web/20130623135522/http://cartographer.rubyforge.org/)• [Basic Rails, Geocoding, and Google Maps howto  
](https://web.archive.org/web/20130623135522/http://earthcode.com/blog/2006/04/rails_geocoding_and_google_map.html)