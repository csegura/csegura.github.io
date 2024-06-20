+++
title = 'Shared Services'
date = 2006-11-28T00:00:00+01:00
tags = ['sharepoint']
+++

Los proveedores de servicios compartidos (SSPs), son una de las nuevas características de MOSS 2007 que reemplaza la infraestructura de Servicios compartidos de Sharepoint 2003. Los SSPs son un conjunto de servicios que pueden ser compartidos en diferentes portales y sitios. Estos servicios son el Catalogo de datos profesionales, los servicios de Excel, las búsquedas, los perfiles de usuarios, las audiencias, y los sitios personales.

De esta manera en MOSS 2007 podemos crear tantos SSPs como necesitemos en función del contenido que nuestros portales y sitios van a ofrecer a los usuarios, de modo que podríamos tener audiencias distintas en distintos portales, ú ofrecer distintos catálogos de datos empresariales en distintos sitios e incluso indexar fuentes de contenido distintas en cada uno de ellos de manera que los resultados de las búsquedas de cada sitio pueden ser distintas.

Una aplicación web de MOSS 2007 debe estar asociada a uno de estos SSPs. Cuando se despliega sharepoint sobre una granja de servidores, se deben crear y configurar los SSPs que se deseen usar. Cada aplicación web solo puede tener un SSP, y cada colección de sitios dentro de una aplicación web usará el mismo SSP.

Y como no, esta es una de las primeras tareas a realizar tras la instalación de MOSS 2007, y hay que tener en cuenta algunas cosas:

Cada proveedor de servicios puede usar una o dos aplicaciones web, en el caso de que se desee separar la ubicación de los sitios personales (recomendado si se desean realizar copias de seguridad independientes de los sitios personales).

Lo más importante a tener en cuenta es que si estamos preparando una granja de servidores, la aplicación web ha de correr con una cuenta que no sea el servicio de red. Esto es debido a que se debe establecer una comunicación entre las distintas aplicaciones que comparten el SSP.

Lo ideal es crear una cuenta especifica para las aplicaciones web, e ir creando estas aplicaciones (así como el directorio de sitios, importante, antes de crear los servicios compartidos)


1.- Las aplicaciones web, yo he creado dos (una para el portal y otra para los sitios de usuarios)

![](/images/Sharepoint/SSP_[1].gif)


2.- Aplicación creada, importante como he mencionado crear la colección de sitios tras finalizar

![](/images/Sharepoint/SSP_[2].gif)


3.- Creamos el SSP con las dos aplicaciones

![](/images/Sharepoint/SSP_[6].gif)


4.- Completado

![](/images/Sharepoint/SSP_[8].gif)


Otra cosa a tener en cuenta es el número de Proveedores de servicios que deseamos usar, el criterio más importante a la hora de decidir esto, será el nivel de aislamiento que deseemos obtener, podríamos separar el contenido, intranet, extranet, por usuarios, ámbitos de búsqueda distintos, audiencias etc..


![](/images/Sharepoint/SSP_[11].gif)
