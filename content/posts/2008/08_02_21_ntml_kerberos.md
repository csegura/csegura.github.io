+++
title = 'NTML y Kerberos'
date = 2008-02-21T00:00:00+01:00
tags = ['sharepoint']
+++

En todas las instalaciones hay un punto crítico, esa pregunta que no tenemos muy clara  y que en ocasiones va acompañada de un texto recomendando una de las opciones, por si no sabemos muy bien qué es lo que estamos haciendo. MOSS no es una excepción.

La pregunta en cuestión llega cuando tenemos que decidir sobre la seguridad, la instalación de MOSS nos da a elegir entre sí usaremos NTLM ó Kerberos.

Como todos sabemos y Microsoft dice NTLM funciona para casi todo. De modo que suele ser la opción preferida de todos.  No hay que configurar nada y funciona. (http://support.microsoft.com/kb/832769)

Kerberos por el contrario es un sistema de autentificación un poco más complejo, pero  también más seguro y más rápido (motivos por los cuales ya de por sí, debería ser la opción predilecta de todos)

Kerberos, es más rápido por que guarda en una cache (vales) la información del cliente después de que este se ha autentificado en el sistema, de modo que no tiene que estar comprobando las credenciales una y otra vez.

Otra de las características importantes de Kerberos es la Delegación, La delegación nos permite pasar las credenciales del cliente desde nuestro servidor front-end (SharePoint)  a nuestros servidores back-end (SQL Server etc..).

Cuando usamos NTLM, y deseamos acceder a recursos que están fuera de nuestro alcance, podemos suplantar al cliente (impersonate)  y usar la cuenta de suplantación para realizar las tareas necesarias.

¿Pero qué ocurre cuando tratamos de usar recursos que no están en la misma máquina que nuestro servidor web?, entonces la suplantación no es suficiente. Y se produce el efecto llamado Double-Hop (http://support.microsoft.com/default.aspx?scid=kb;en-us;329986)

Imaginemos que hemos realizado una solución para SharePoint que usa un servicio web o una conexión a un servidor SQL que se encuentra en una máquina distinta, y deseamos acceder usando la seguridad integrada (Integrated Security=SSPI) .

Al realizar la conexión nuestro servidor web debe ponerse en contacto con nuestro servidor SQL y este no es capaz de autentificar al usuario.

De modo que recibiremos un mensaje como:

Login failed for user ‘NT AUTHORITY\ANONYMOUS LOGON’.


Como mencionaba anteriormente, esto es debido a que la suplantación no es válida, necesitamos algo más; Delegación.

Y esa delegación aunque cueste un poquito más configurarla es la que nos ofrece Kerberos.

Este escenario se produce en multitud de instalaciones de MOSS en donde usamos servicios de Excel, para recuperar datos de los servicios de análisis de SQL.