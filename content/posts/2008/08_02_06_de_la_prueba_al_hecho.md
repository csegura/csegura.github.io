+++
title = 'De la prueba al hecho xUnit'
date = 2008-02-06T00:00:00+01:00
tags = ['testing']
+++

James W. Newkirk, uno de los co-autores de NUnit, trabaja desde el año pasado junto con Brad Wilson en un framework para realizar “pruebas” llamado xUnit.

Lo he seguido con cariño y finalmente lo he adoptado para un nuevo proyecto en el que estoy trabajando, dejando mi querido MbUnit.

El cambio de NUnit a MbUnit, lo hice debido a que este último incorporaba RowTests, posibilitando el ejecutar un mismo test usando distintos valores, lo cual acortaba el número de pruebas a escribir sustancialmente.

xUnit va más allá, según explica James, entre las lecciones aprendidas con NUnit, una de las más importantes fue el hecho de mantener el código de las pruebas tan simple como fuera posible, eliminando las duplicidades.

Se han eliminado atributos como [TestFixture] para indicar que se trata de una clase que contiene tests, y el [Setup] y [TearDown] quedan enmascarados en el código de la clase, de manera que el atributo [Setup] equivaldría al  constructor y si la clase implementa IDisposable el método Dispose hará las funciones del atributo [TearDown].

Obviare aquí la discusión sobre el uso de estos dos atributos…  Más, [TestFixtureSetup] y [TestFixtureTearDown] también desaparecen, como alternativa, nuestra clase pude implementar el interface ITestFixture.

Otro de los atributos que desaparece es [ExpectedException] volviendo al clásico estilo de JUnit aprovechando los delegados anónimos de c# 2.0, esto como sabéis podía llevar a error en algunas de las pruebas debido a que otro método distinto al probado lanzara la excepción. La lectura del test no deja lugar a dudas sobre lo que se está probando.

`Assert.Throw(typeof(ArgumentNullException), delegate { clase.Metodo(null); });`

ó

`Assert.Throw<ArgumentNullException>(delegate { clase.Metodo(null); });`

Desaparece también [Test], que pasa a llamarse [Fact], este pequeño matiz  puede desconcertar, pero el HECHO, es que viene de la propia naturaleza de xUnit que tiene el propósito de ser usado más como herramienta para el desarrollo dirigido por pruebas a ser otra de las herramientas de pruebas. Si no dando por HECHO un comportamiento que debe cumplirse.

En cuanto a las aserciones, puede que sean un conjunto más reducido (o priori menos expresivo) que en otros frameworks, pero hace un uso intenso de los genéricos dotándoles de la expresividad necesaria para que la lectura de las mismas no sea un problema. A mi desde luego me encanta.

Hasta aquí xUnit, no es más que otro framework de pruebas con las peculiaridades que hemos visto, sencillo y simple.

Y de esa naturaleza, surgen las Extensiones (más para el que quiera más)  Y YO QUERIA MÁS.

Las extensiones de xUnit, son una pasada. Añaden una serie de atributos al framework que para mí las hacen indispensables.

El atributo [Theory], nos permite hacer pruebas dirigidas por datos, similar en parte al atributo [RowTest] de MbUnit. Los datos pueden escribirse en línea [InlineData], venir de una hoja de cálculo [ExcelData], de una fuente OleDb [OleDbData] o de Sql server [SqlServerData], y usando [PropertyData] podremos hacer que los datos provengan de una propiedad de nuestra clase. (yo creo que ya no puedo vivir sin esto)

Otro de los atributos incluidos en las extensiones es [AutoRollback], que es exactamente igual al [RollBack] de MbUnit, mete todo en una transacción y deshace los cambios al terminar la prueba, con lo cual la base de datos se queda como estaba.

El atributo, [FreezeClock], nos permitirá bloquear el reloj para poder realizar pruebas que utilizan la hora del sistema. No lo he probado pero se me ocurren algunas cosas interesantes a probar con WF. 

Con [AssumeIdentity] podemos cambiar la identidad del usuario que está ejecutando el ensamblado (con esto estoy jugando … )

Y por último un par más como [Trace] que añade una entrada en DebugView o cualquier otro listener, y [RunWithNUnit] que nos permitirá ejecutar pruebas también con NUnit.

Todavía tengo que probar algunas de las cosas que trae, pero por el momento se queda. Además incluye un plugin para el Resharpher.

Más:

http://www.codeplex.com/xunit
http://www.codeplex.com/xunitext/Release/ProjectReleases.aspx?ReleaseId=8103

James ha escrito tres libros, yo tengo un par Test-Driven Development in Microsoft .NET (Microsoft Professional) y Extreme Programming in Practice, recomiendo el primero.

Y el año pasado publico Visual Studio Team System: Better Software Development for Agile Teams (Microsoft .Net Development).