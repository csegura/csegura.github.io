+++
title = 'Remote WebParts Install'
date = 2006-02-23T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++

El otro día chateando con Gustavo sobre su post (Un VisualStudio 2005 señor? No gracias, déme un 2003, por favor) hablamos sobre la instalación de los webparts en las maquinas de pruebas. Yo le comente que lo que hacía era copiar el archivo CAB en la máquina remota y ejecutar el stsadm y el RecycleAppPool usando un enlace de terminal server. (archivo .rdp), esto lo tengo en un batch, y necesito un archivo RDP para cada webpart (ya que el nombre del archivo CAB va dentro del RDP). Luego en el Visual Studio tengo un enlace en las herramientas externas que lanza los comandos.

Desde el día en que estuvimos hablando he mejorado el proceso de instalación, ahora tengo un pequeño archivo batch que se encarga de todo. Como pieza clave utilizo el PsExec de SysInternals que me permite ejecutar comandos remotos.


RemoteInstallWebPart.CMD

```shell
@echo off
rem %1 – cab file
rem %2 – server machine | IP
rem %3 – path 

rem ===== Copy the webpart
copy /y %1 \\%2\c$\%3

rem ===== Copy the RecycleApp
copy /y MyRecycleAppPools.vbs \\%2\c$\%3

rem ===== Put your server STSADM path
set r_path=c:\archiv~1\archiv~1\micros~1\webser~1\60\bin

psexec \\%2 %r_path%\stsadm -o addwppack -filename c:\%3\%1 -globalinstall -force

if errorlevel 0 goto Recycle
goto stsadmError

:Recycle
psexec \\%2 cmd /c c:\%3\MyRecycleAppPools.vbs

if errorlevel 1 goto recycleError
goto end

:stsadmError
echo Error en STSADM

goto end

:recycleError
echo Error en RecycleAppPool

goto end
:end

set r_path=
```

MyRecycleAppPools.vbs

```vbs	
Set locator = CreateObject(“WbemScripting.SWbemLocator”)
Set Service = locator.connectserver(strServer, “root/MicrosoftIISv2″)
Set APCollection = Service.InstancesOf(“IISApplicationPool”)
For Each APInstance In APCollection
    APInstance.Recycle
Next
```

Ahra invocando este archivo de comandos se instalan las webparts en un segundo. El archivo MyRecycleAppPools.vbs es una modificación del original al que le he eliminado el msgbox para que no salte el mensaje final.


Ej: `RemoteInstallWebPart.cmd   MiWebPart.cab 192.168.99.200`  webparts


Como dice mi buen amigo “Escriba un comentario que me haga reir…”