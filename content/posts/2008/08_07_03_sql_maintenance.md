+++
title = 'SQL Maintenance - Sharepoint'
date = 2008-07-03T00:00:00+01:00
tags = ['sharepoint', 'sql', 'maintenance']
+++

Hace algún tiempo comente un plan de mantenimiento para las bases de datos de SharePoint 2003, básicamente para SharePoint 2007 los pasos son los mismos, solo que las bases de datos a tener en cuenta son otras.

Tanto en MOSS como en WSS encontraremos las siguientes bases de datos:

WSS_Content_GUID

Esta base de datos contiene los datos de una aplicación web y las colecciones de sitios de dicha aplicación web. Todos los datos de las listas y los documentos de los sitios son almacenados en esta base de datos, en función del movimiento de esta deberemos de tener un plan de mantenimiento para la misma. Importante.

WSS_Search_MACHINENAME

Esta base de datos contiene todos los metadatos necesarios para realizar búsquedas en SharePoint.

SharePoint_Config

Almacena la información y configuración de todos los servidores que forman una granja, los roles, y la configuración de las distintas aplicaciones web que forman parte de la granja.

SharePoint_AdminContent_GUID

Esta base de datos es la correspondiente a la aplicación web de la administración central de SharePoint.

En MOSS encontraremos además:

SharedServices_DB

En esta base de datos se almacena la información de configuración de los servicios compartidos.

SharedServices_Content

En esta base de datos se almacena la información de la aplicación web para administrar los servicios compartidos.

SharedServices_Search_DB

Por último, en esta base de datos se almacena la información de los metadatos y seguridad usada por los orígenes de búsqueda que se establecen mediante los servicios compartidos.

Lo que queda claro es que las bases de datos de contenido de las aplicaciones web, son las que debemos vigilar más. El mantener esta en un estado saludable afectará directamente al rendimiento de nuestra instalación.

Si hablamos de un plan de contingencias, como es lógico deberemos contemplar absolutamente todas las bases de datos.