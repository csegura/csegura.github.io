+++
title = 'Google Sharepoint'
date = 2005-11-07T00:00:00+01:00
tags = ['sharepoint']
+++

Al igual que otros usuarios de SharePoint, en su día me encontré con la limitación que tienen las búsquedas de SharePoint. Por ello desarrolle el csegSearchWebPart, añadiendo funcionalidad extra a las búsquedas del portal.

Como referencia tome Google, ya que es considerado "el mejor buscador del mundo".

Estos días he pensando en ello, y he llegado algunas conclusiones interesantes.

Goggle tiene tres grandes rasgos que otros buscadores no tienen:

- Cantidad de documentos indexados. (8.000 millones)
- Flexibilidad en las búsquedas.
- Motor de indexación / búsqueda distribuido.

Y un gran característica que lo diferencia de los demás buscadores

- Sistema de puntuación de páginas (PageRank)

Sin duda esta diferencia es por la que es considerado el mejor buscador del mundo.

Ahora bien, mi pregunta es la siguiente ¿es efectivo un sistema como PageRank para buscar documentos en la empresa? Personalmente creo que no, ya que la documentación almacenada carece de la estructura de vínculos de la cual esta dotada Internet.

Entonces, suprimiendo esa característica de Google y comparándolo con el motor de búsqueda de SharePoint ¿Qué tenemos?

| Google | SharePoint
8.000 millones de urls | Los documentos de la empresa (los documentos que me interesan)
Flexibilidad en las búsquedas | Flexibilidad con csegSearch
Motor de indexación / búsqueda distribuido | Motor de indexación / búsqueda distribuido

Bueno, tengo un mini google …

Bien, después de esta pequeña reflexión, y de comprobar que tenemos un buscador tan bueno, ¿Por qué siempre encontrar lo que queremos nos lleva tanto tiempo?, ¿cuantas veces cambiamos por termino medio las palabras de búsqueda para dar con lo que queremos?, en mi caso lo he comprobado y lo he medido (soy un tío raro que le voy hacer) como termino medio en Google modifico 3,5 veces los términos de la búsqueda hasta dar con el resultado que deseo y generalmente desecho los resultados que figuran a partir de la tercera pantalla, como tengo configurado Google para mostrar 25 resultados por hoja, a partir del resultado 75 desecho toda la información que Google me devuelve. (¿Será por los 8.000 millones de páginas?)

Los resultados que nos son devueltos en ambos buscadores  son aquellos que cumplen los criterios de búsqueda que hemos especificado, el modo más usado, el de teclear una frase o conjunto de palabras, nos devuelve todas aquellas páginas que contienen dichos términos. Bien, los dos hacen lo que le pedimos.

Entonces si no encontramos lo que buscamos, es debido a que no hemos introducido todos términos, es decir, no hemos refinado lo suficiente la búsqueda y debido a la generalidad de los términos hemos encontrado más de lo que queríamos, así que refinamos una y otra vez, añadiendo frases exactas, palabras sueltas o eliminando algún término.

Este procedimiento simple de refinamiento nos permite concretar más los resultados, pero en el ámbito empresarial es un poco más complejo. Me explicaré. Por lo general algunos de los términos pueden ser muy frecuentes ya que la terminología empleada en una empresa no suele ser muy amplia piense en un simple "Informe de Ventas" ó en un "Plan de Marketing".

SharePoint cuenta con un sistema llamado "Probabilistic relevance scoring" (Okapi), puntuación de relevancia por probabilidades, de manera que aunque un documento contenga las mismas palabras que otro, uno aparecerá en primer lugar y otro en segundo lugar, en función del número de veces que aparece un término y el lugar en el que aparece.

Peso | Medida | Motivo
Frecuencia en los documentos | El número de documentos que contienen un determinado termino sobre el total de documentos. | Es más probable que se busquen términos ya refinados, es decir que figuran en menos documentos.
Frecuencia del Termino | El número de apariciones de un término dentro del documento. | El documento que contiene más veces el término es más importante que en el que aparece menos veces.
Tamaño del documento. | El tamaño del documento. | Un término que aparece el mismo número de veces en un documento grande y en uno pequeño, hace suponer que es más importante para el documento pequeño.
Posición del Termino | La posición del término en el documento, por ejemplo si el término está en el título. | Si un termino figura en el título es que es importante por lo tanto aparecerá en el ranking antes de que lo haga el que no lo tiene.


Sin duda parece lógico. Examinando el webpart de los resultados de la búsqueda podemos observar el sistema de puntuación

```cs
"DAV:contentclass":0,
"urn:schemas.microsoft.com:fulltextqueryinfo:description":0,
"urn:schemas.microsoft.com:fulltextqueryinfo:sourcegroup":0,
"urn:schemas.microsoft.com:fulltextqueryinfo:cataloggroup":0,
"urn:schemas-microsoft-com:office:office#Keywords":1.0,
"urn:schemas-microsoft-com:office:office#Title":0.9,
"DAV:displayname":0.9,
"urn:schemas-microsoft-com:publishing:Category":0.8,
"urn:schemas-microsoft-com:office:office#Subject":0.8,
"urn:schemas-microsoft-com:office:office#Author":0.7,
"urn:schemas-microsoft-com:office:office#Description":0.5,
"urn:schemas-microsoft-com:sharepoint:portal:profile:PreferredName":0.2,
"urn:schemas-microsoft-com:publishing:HomeBestBetKeywords":0.0,
contents:0.1,*:0.05
```

Por si alguien no se ha fijado hay que tener en cuenta que a excepción del "DAV:displayname", el resto de datos puntuados forman parte del esquema "urn:schemas-microsoft-com:office:office#", como la gran mayoría no rellena estas propiedades en sus documento de office, estas generalmente son ignoradas.

¿A donde nos lleva todo esto?

Bueno, tanto PageRank como Okapi, son sistemas validos, cada uno en su ámbito, (he omitido aquí algunas cosas que tiene también SharePoint como los metadatos de los que hablaré otro día).

Esto nos lleva a la idea que he tenido en mente durante la última semana, ¿Cuál sería la manera más adecuada de recuperar información empresarial?.

Para ello he ideado un programa llamado "SiPaBu", SIstema PAranoico de BUsqueda que realiza sucesivas búsquedas sobre SharePoint a través del servicio de búsqueda (osease usando "search.asmx"), el programa con la ayuda del parser que escribí para csegSearch, busca los términos que le pedimos limitando la búsqueda a 10 resultados (cuestión de pruebas), para cada uno de los resultados mostrados busca a su vez 10 resultados usando el nombre del archivo encontrado en primera instancia ó la descripción del mismo.

El programa se ejecuta en un bucle hasta que encuentra el documento que le hemos pedido, en caso de no encontrarlo, nos muestra los resultados que ha encontrado y nos pide que le indiquemos si el documento que buscamos se encuentra entre los resultados mostrados, si no es así, nos pide que le indiquemos que términos añadir a la búsqueda.

![](/images/Sharepoint/SiPaBu.gig)

Existen también otras posibilidades de búsqueda como :

- "generalizarla por fechas", generalizar es decir cambiar los nexos "and" por "near" y acotar los resultados usando las fechas en que se produjo el primer documento. Por que es lógico pensar que puede haber documentos donde se hable de esos mismos términos en unas fechas determinadas.
- "generalizarla por autor", igual que la anterior, usando el autor del primer documento, La persona que escribió el primer documento pude referirse a ese mismo tema en otros.
- "generalizarla por sitio", usando el sitio

Etc…

Por el momento es sorprendente el resultado, y aún tengo que pulir muchas cosas, es un experimento,  pero seguro que existen patrones que permitan mejorar los resultados de las búsquedas. Ale otro entretenimiento más.