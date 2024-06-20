+++
title = 'Using MSBee'
date = 2006-01-13T00:00:00+01:00
tags = ['sharepoint', 'msbee']
+++

First I want to give thanks to Josh Ledgard to allow to me test the first CTP of  MSBee. With MSBee you can build .NET 1.1 projects using Visual Studio 2005. MSBee is designed to use MSBuild and use a property to set the target framework. MSBee map assembly references from .NET 2.0 assemblies to their .NET 1.1 equivalents.

Installation and usage

This first release install unzipping four files in the MSBuild directory. These files contans the NET 1.1 target files and the small msbee.dll. After install you only need open a Visual Studio 2003 project with Visual Studio 2005, locate the project file (.csproj) and insert a line under

```xml
<Import Project=”$(MSBuildBinPath)\Microsoft.CSharp.targets” />
```	    

thats contains the new targets if MSBuild use EverettBuild = true (Everett was the code name of 1.1 framework)

```xml
<Import Project=”$(MSBuildExtensionsPath)\Microsoft.Public.CSharp.targets” Condition=” ‘$(BuildingInsideVisualStudio)’ == ” AND ‘$(EverettBuild)’ == ‘true’ ” />
```

Then you can call to MSBuild from a Visual Studio 2005 command prompt using


msbuild <your project here>.csproj /t:Rebuild /p:EverettBuild=true


I have added a new External Tool to run this command line from IDE  called MBSee (MSBuild 1.1) using
```
Command: C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\msbuild.exe
Arguments: $(ProjectFileName) /t:Rebuild /p:EverettBuild=true
Initial Directory:  $(ProjectDir)
```
Building my first webpart with Visual Studio 2005


Less than one minute to import the Visual Studio 2003 project in Visual Studio 2005 and modify the project line. Then Tools->MSBee MSBuild 1.1 and all is right. Usually I have a child project with the setup installation, I needed make it again.


![](/images/Sharepoint/MSBee1.gif)


Only a small inconvenience because the MSBee at moment doesn´t work with some additional tasks like Assembly Linking, to solve this I have needed to sign the assembly manually using the strong name utuility.

MSBee is an indispensable tool.