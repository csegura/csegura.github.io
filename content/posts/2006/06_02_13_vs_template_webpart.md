+++
title = 'VS Template WebPart'
date = 2006-02-13T00:00:00+01:00
tags = ['']
+++

Days ago I wrote about how to use msbee to do webparts with Visual Studio 2005, now the toolkit guys have a beta version, I have spent the weekend doing some tests with this beta release and now I’m doing my webparts using Visual Studio 2005. In the beginning I was using the external tools menu to launch the msbuild process with apropiate targets, and later launching other tool with the sign assembly process, finally I have modified the .csproj file because at the moment for SharePoint 2003 I only need use the Net 1.1 framework. Also I added at the Postbuild event the sign assembly process.

![](/images/Sharepoint/VS2005Template.gif)

In order to use this template you need install MsBee and the .Net 1.1 Framework.


SharePoint_2003_VS2005_WebPart_Template.vsi V2 corrected version (537,63 KB)


Notes:

1.- Thanks to Remco Ploeg - by detect the sign problem.
2.- V2 Corrected .dwp generation and manifest.xml


—— Operación Generar iniciada: proyecto: WebPartTemplate2, configuración: Debug Any CPU ——

```shell	
C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322\Csc.exe /noconfig /warn:4 /define:TRACE;DEBUG /reference:SharePointLibraries\Microsoft.SharePoint.dll
/reference:C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322\System.dll
/reference:C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322\System.Web.dll
/reference:C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322\System.Xml.dll
/debug+ /debug:full /optimize-
/out:obj\FX1_1\Debug\WebPartTemplate2.dll
/target:library Properties\AssemblyInfo.cs WebPart1.cs
```

```shell
WebPartTemplate2 -> C:\DEV\SharePoint2003a\WebPartTemplate\WebPartTemplate2\WebPartTemplate2\bin\FX1_1\Debug\WebPartTemplate2.dll


"C:\Archivos de programa\Microsoft.NET\SDK\v1.1\bin\sn.exe” -R
C:\DEV\SharePoint2003a\WebPartTemplate\WebPartTemplate2\WebPartTemplate2\bin\FX1_1\Debug\WebPartTemplate2.dll C:\DEV\SharePoint2003a\WebPartTemplate\WebPartTemplate2\WebPartTemplate2\Key.snk


Microsoft (R) .NET Framework Strong Name Utility Version 1.1.4322.573


Copyright (C) Microsoft Corporation 1998-2002. All rights reserved.


Assembly ‘C:\DEV\SharePoint2003a\WebPartTemplate\WebPartTemplate2\WebPartTemplate2\bin\FX1_1\Debug\WebPartTemplate2.dll’
successfully re-signed


========== Generar: 1 correctos o actualizados, 0 incorrectos, 0 omitidos ==========
```

Now I’m removing Visual Studio 2003 from my laptop :-)