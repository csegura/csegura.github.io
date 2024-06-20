+++
title = 'CAS Policies'
date = 2008-07-23T00:00:00+01:00
tags = ['c#', 'security']
+++

Muchos de los desarrolladores de SharePoint, terminan optando por desplegar sus aplicaciones en el GAC, para evitar problemas de seguridad. Esta no es la manera más correcta y cada vez más administradores de sistemas, exigen que las soluciones se desplieguen en los directorios de aplicación.

Los ensamblados que se ejecutan desde el GAC, se ejecutan bajo total confianza (Full Trust) y están disponibles para todos los servidores virtuales y todas las aplicaciones, lo cual termina siendo menos seguro si desconocemos la procedencia del ensamblado, cosa que ocurre con frecuencia.

La seguridad de acceso al código nos permite restringir los tipos de recursos a los cuales puede acceder el código así como las operaciones privilegiadas que este puede realizar.

ASP.Net incluye cinco niveles de seguridad Full, High, Medium, Low, and Minimal. (Completo, alto, medio, bajo y mínimo) estos niveles de seguridad los establecemos en el web.config de nuestra aplicación web, bajo la etiqueta de SecurityPolicy. (Las declaraciones de dichas políticas pueden verse en C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\CONFIG)

SharePoint, añade dos políticas de seguridad personalizadas, WSS_Medium y WSS_Minimal, (minima confianza, confianza media) cuyos archivos de política pueden verse en C:\Program Files\Common Files\Microsoft Shared\web server extensions\12\CONFIG)

En el caso de WSS y MOSS, nuestro web.config comienza en WSS_Minimal y conforme vamos desplegando soluciones que incluyen políticas de acceso personalizadas este archivo pasa a ser WSS_Custom.

Básicamente las diferencias establecidas entre los modelos WSS_Minimal y WSS_Medium es que WSS_Minimal, no concede los permisos (DnsPermission, EnvironmentPermission, FileIOPermission, IsolatedStorageFilePermission, PrintingPermission, SharePointPermission, SmtpPermission, SqlClientPermission y UIPermission)

Es decir, que con el modelo WSS_Minimal, no podemos realizar ninguna operación de archivo, (leer/escribir), no podemos acceder a las variables de entrono o acceder a datos … incluido el usar el modelo de objetos de SharePoint. Vamos, en una palabra otorgamos la mínima confianza.

Recursos y permisos asociados 

Secure Resource	Requires Permission

Secure Resource Requires Permission Data access **SqlClientPermission**  
**OleDbPermission**  
**OraclePermission**

Directory services **DirectoryServicesPermission** 
DNS databases **DnsPermission** 
Event log **EventLogPermission** 
Environment variables **EnvironmentPermission** 
File system **FileIOPermission** 
Isolated storage **IsolatedStoragePermission** 
Message queues **MessageQueuePermission** 
Performance counters **PerformanceCounterPermission** 
Printers **PrinterPermission** 
Registry **RegistryPermission** 
Sockets **SocketPermission** 
Web services (and other HTTP Internet resources) **WebPermission** 
SharePoint Object Model **SharePointPermission**


Evidentemente para muchos lo más fácil es indicar en el ensamblado DeploymentTarget=”GlobalAssemblyCache” con lo cual nuestro ensamblado ira a parar al GAC obteniendo confianza total.

Para hacer un despliegue correcto y seguro, lo que debemos hacer es desplegar nuestro ensamblado en el directorio bin de la aplicación web, DeploymentTarget=”WebApplication” y crear nuestra política de seguridad de código.

En el mismo archivo de solución, podemos indicar nuestra CAS :

```xml
<CodeAccessSecurity>
    <PolicyItem>
      <PermissionSet class="NamedPermissionSet" 
                     version="1" 
	             Description="Permisos para nuestro ensamblado">
        <IPermission class="AspNetHostingPermission" 
                     version="1" 
	             Level="Minimal" />
        <IPermission class="SecurityPermission" 
                     version="1" 
	  	     Flags="Execution" />
        <IPermission class="Microsoft.SharePoint.Security.SharePointPermission,
	  Microsoft.SharePoint.Security, Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"
                     version="1" 
                     ObjectModel="True" 
                     Impersonate="True"  
                     Unrestricted="True" />
        <IPermission class="System.Security.Permissions.SecurityPermission, 
	  mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" 
                     version="1" 
                     Flags="ControlThread, Execution" />
    </PermissionSet>
    <Assemblies>
       <Assembly Name="IdeSeg.SharePoint.WebParts.dll"  />
    </Assemblies>
  </PolicyItem>
</CodeAccessSecurity>
```

Donde establecemos la política de seguridad de acceso, estableciendo nuestro conjunto personalizado de permisos. Después debemos hacer el despliegue con 
`STSADM -deploysolution solution -allowCasPolicies`