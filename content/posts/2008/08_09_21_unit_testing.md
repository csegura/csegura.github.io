+++
title = 'Unit Testing'
date = 2008-09-21T00:00:00+01:00
tags = ['sharepoint', 'c#', 'unit testing']
+++

Aquí continúa el drama de Unit Test para SharePoint. Esta vez hemos reunido esfuerzos entre nosotros, Carlos Segura (http://www.ideseg.com ) y Gustavo Velez (http://www.gavd.net ), para intentar sacar algo en claro. Programadores del mundo de SharePoint, uníos! …

Unit Test, SharePoint y que es lo importante:

Testeo Unitario es una técnica de programación que permite asegurar que lo que se ha programado hoy cumple las condiciones exigidas, y que las seguirá cumpliendo en el futuro, cuando se hagan modificaciones en el código fuente. Existe numerosa información al respecto, tanto en libros de texto como en internet, así que no repetiremos las bases de la técnica; en resumen, es deseable que se
cumplan algunas condiciones:

- El código de Pruebas Unitarias debe ser independiente de cualquier FrameWork que se esté utilizando para garantizar que no hay dependencias, es decir, circunstancias que no se puedan repetir en el futuro. En nuestro caso, no se desea tener que utilizar una instancia de SharePoint para ejecutar el testeo, pues es prácticamente imposible crear dentro de algunos meses/años un sistema de SharePoint que sea exactamente igual al utilizado originalmente

- El código de Pruebas debe ser fácil y rápido de escribir. El (valioso) tiempo de programación se debe utilizar para programar la funcionalidad, no para programar el sistema de pruebas

- El código de prueba tiene que ser igual para todos los desarrolladores en el equipo de desarrollo. Esto tiene que ver con el primer punto: si no existen dependencias (configuraciones, por ejemplo) con el FrameWork utilizado, no hay riesgos de que dos desarrolladores obtengan diferentes resultados. O que el sistema de compilación automática produzca resultados impredecibles (Night Build, Continuous Build, Regretion e Integration Test)

Unit Test es comúnmente utilizado en desarrollo de software, y existen varias herramientas que lo facilitan. Visual Studio (versión profesional y superior) provee todas las herramientas necesarias para generar Unit Test con un clic; si no se dispone de una de estas versiones de Visual Studio, existen herramientas gratuitas que pueden hacer el mismo trabajo (NUnit, http://www.nunit.org/, xUnit, http://www.codeplex.com/xunit y TestDriven, http://www.testdriven.net/ por ejemplo).

Cuando se desean hacer Pruebas Unitarias para SharePoint es necesario utilizar técnicas suplementarias que permitan crear “imágenes fantasmas” de sus clases. Esto se puede conseguir de diferentes formas, por medio de Mocking o Stubbing, por ejemplo

•  http://geeks.ms/blogs/gvelez/archive/2007/08/04/mocks-mocking-mockers-y-sharepoint.aspx
•  http://geeks.ms/blogs/gvelez/archive/2007/08/12/stubs-stubbing-stubbers-y-sharepoint.aspx
•  http://www.ideseg.com/SharePointPruebasUnitarias1.aspx

Otras técnicas, como la utilización de Plantillas o Copias de Seguridad son utilizables, pero no cumplen las condiciones ideales indicadas al principio.

Mocking es una técnica que permite crear objetos “falsos” de un determinado FrameWork, y luego “convencer” al código a probar que tiene que usar los objetos falsos, y no los que obtendrán del FrameWork en su trabajo real. Esta técnica permite cumplir todas las condiciones indicadas. Desafortunadamente, por la forma de programación de SharePoint no es posible usar Mockers tradicionales.

La nueva versión de TypeMock (versión 5.0, http://www.typemock.com ) permite crear objetos mock que funcionan bajo estas condiciones, haciéndolo ideal para crear Unit Test para SharePoint. Desafortunadamente, TypeMock es una herramienta comercial, pero se puede bajar del sitio indicado una versión de prueba completamente funcional por 30 días.

Otra de las motivaciones para usar TypeMock, es que el equipo de SharePoint Guidance está usando TypeMock en sus ejemplos; el porqué es simple, a pesar de que existen otras alternativas en el mercado, y algunas de uso libre, ninguna de ellas es capaz de mockear clases selladas o clases que no tienen un constructor público. La API de SharePoint cuenta con innumerables clases y una gran parte de ellas están selladas y carecen de constructores públicos por lo que TypeMock es la única alternativa por el momento.

Mockeando a SharePoint

1 – El caso más sencillo: mockear a SPSIte y SPWeb. El método a probar tiene la siguiente forma:

```cs
public static string TestMock_01()
{
    String strReturn = String.Empty;

    try
    {
        using(SPSite mySite = new SPSite("http://MiServidor"))
        {
            using(SPWeb myWeb = mySite.OpenWeb())
            {
                strReturn = myWeb.MasterUrl;
            }
        }
    }
    catch (System.Exception ex)
    {
        strReturn = ex.ToString();
    }
    return strReturn;
}
```         
Y el método de Pruebas Unitarias con TypeMock seria:
```cs
public void TestMethod1()
{
    using (RecordExpectations recorder = RecorderManager.StartRecording())
    {
        SPSite mySiteMocked = new SPSite("");
        SPWeb myWebMocked = RecorderManager.CreateMockedObject<SPWeb>();
        recorder.ExpectAndReturn(mySiteMocked.OpenWeb(), myWebMocked);
        recorder.ExpectAndReturn(myWebMocked.MasterUrl, "abcd.master").RepeatAlways();
    }

    string expected = "abcd.master";
    string actual;
    actual = Program.TestMock_01();
    Assert.AreEqual(expected, actual);
}
```

Bajo el estamento “using” se crean objetos SPSite y SPWeb “falsos”. Todos los objetos creados bajo el “recorder” serán después utilizados como objetos de trabajo en la función a testear, en lugar de los objetos “reales” obtenidos del FrameWork de SharePoint. Esto permite garantizar que en el ejemplo, no importa qué tipo de configuración tenga la instalación actual de SharePoint, siempre se le va a “hacer creer” al método a testear que la página maestra del Web se llama “abcd.master”.

Luego de crear los objetos mockeados, se inician las variables a esperar (expected), se ejecuta el método a probar y el resultado se compara con lo esperado.

2 – Yendo algo más lejos: mockeando colecciones. Cuando se desea utilizar la misma sintaxis para crear objetos mockeados de colecciones se encuentran diferentes dificultades.  En las colecciones de SharePoint se ha mantenido el diseño existente en versiones anteriores por lo que funcionan como lo hacían en Net 1.1: una clase que implementa IEnumerable  y una clase anidada que implementa IEnumerator; para poder recorrer colecciones de objetos mockeados se debe reproducir este comportamiento y lo que a priori puede parecer fácil en realidad no lo es…

En primer lugar se debe mantener una colección de objetos paralela a través del cual podamos devolver un enumerador; se puede ver un ejemplo de esta técnica en (http://dotnetforum.dk/blogs/mac/archive/2007/12/21/first-steps-with-typemock-and-the-sharepoint-api.aspx), lo cual nos obliga en cierta manera a crear métodos para reproducir las colecciones de objetos de SharePoint.

En parte motivados por esto y por la necesidad de poder realizar los tests de la manera más sencilla posible hemos creado un conjunto de clases envoltorio que nos permitirán extender los objetos a mockear de SharePoint de una manera más elegante.

Por ejemplo, para el siguiente método a probar, en el que se necesita recorrer la colección de Listas en el Web de más alto nivel:

```cs
public static string TestMock_02()
{
    string strReturn = String.Empty;

    try
    {
        using (SPSite mySite = new SPSite("http://MiServidor"))
        {
            using (SPWeb myWeb = mySite.OpenWeb())
            {
                int intTeller = 0;
                foreach (SPList oneList in myWeb.Lists)
                {
                    Debug.WriteLine(oneList.Title);
                    intTeller++;
                }

                strReturn = intTeller.ToString();
            }
        }
    }
    catch (Exception ex)
    {
        strReturn = ex.ToString();
    }

    return strReturn;
}
```

Se puede utilizar un método de prueba con la siguiente sintaxis:

```cs
[TestMethod]
public void TestMethod2()
{
    MockSPSite mockSite = new MockSPSite("TestSite");          // 1
    MockSPWeb mockWeb = new MockSPWeb("TestWeb");  // 2

    MockSPList mockList0 = new MockSPList("MyList0");         // 3
    MockSPList mockList1 = new MockSPList("MyList1");      
    MockSPList mockList2 = new MockSPList("MyList2");
    mockWeb.Lists = new MockSPListCollection(new[]             // 4
        {
            mockList0,
            mockList1,
            mockList2
        });

    mockSite.ExpectGetAlways("RootWeb", mockWeb.GetInstance());  //5

    SPWeb WebMocked = mockWeb.GetInstance();    // 6

    using (RecordExpectations recorder = RecorderManager.StartRecording())    // 7
    {
        SPSite SiteMocked = new SPSite("");    // 8
        recorder.ExpectAndReturn(SiteMocked.OpenWeb(), WebMocked);    // 9
    }

    string expected = "3";    // 10
    string actual;
    actual = Program.TestMock_02();
    Assert.AreEqual(expected, actual);
}
```

Aquí se pueden distinguir tres zonas con código:

- En la primera parte, líneas 1 a 7 se crean todos los objetos “falsos” necesarios. Líneas 1 y 2 crean objetos del tipo SPSite y SPWeb. Las líneas bajo el numero 3 crean tres Listas mockeadas y en la línea 4 se agregan las Listas a la Colección de Listas del objeto SPWeb mockeado. En la línea 5 se agrega a su vez el objeto SPWeb como la Web de nivel superior del objeto SPSite mockeado y finalmente, en la línea 6 se crea un objeto del tipo SPWeb nuevo basado en el objeto SPWeb mockeado. Esto es necesario para el código en la segunda zona, que no permite utilizar objetos mockeados directamente

- En la segunda zona, líneas 7 a 9, se crean los objetos que se le van a entregar a la clase a testear por medio de un “recorder” de TypeMock. En la línea 8 se crea un objeto SPSite que va a substituir el SPSite en la clase a testear, y en la línea 9 se le asigna el valor del objeto SPWeb mockeado  con las Listas creadas en la primera parte.

- La tercera zona, desde la línea 10, incluyen el código para los valores esperados y los valores que regresan del método a testear y los comparan en la aserción.
La primera parte del código utiliza las clases envoltorio comentadas anteriormente (MockSPSite, MockSPWeb, etc). Estas clases tienen la forma:

```cs
namespace SPTypeMock.Core
{
    public class MockSPSite : MockSP<SPSite>
    {
        public MockSPSite(string url) : base(true)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentNullException("url");
            }
 
            Mock.ExpectGetAlways("Url", url);
        }
    }
}
```	

Estas clases sirven para simplificar la creación de los objetos mockeados, y no son más que herencias de tipos definidos (SPSite en este caso), con algunos constructores específicos y métodos para conectar sus colecciones de objetos. Las clases de envoltura permiten reutilizar el código una y otra vez, sin que la escritura de las pruebas signifique el tener que escribir mas código que el código a testear (una de las condiciones señaladas al principio).

Todas estas clases se encuentran en la biblioteca SPTypeMock que podéis encontrar en CodePlex

SPTypeMock usa dos clases, la primera es MockSP<T> que es una clase abstracta desde la cual mockearemos los objetos de SharePoint, la única peculiaridad de esta clase está en el constructor, que  tiene un parámetro bolean, que se encarga de añadir la propiedad ID de la clase; las clases de SharePoint tienen un ID, en la mayoría de ellas  es un Guid, pero en otras como SPListItem es un int.

La propiedad Mock de esta clase nos da acceso al objeto mock que se encuentra en el interior, debemos usar esta propiedad para establecer las expectativas.

El método GetInstance, se encarga de devolvernos una instancia real del objeto mockeado.

La segunda clase es `MockSPCollection<TCollection,TItem>` que es otra clase abstracta desde la cual heredaremos las colecciones de SharePoint. MockSPCollection, hereda a  su vez de `List<TItem>` de modo que así conseguimos tener la colección paralela necesaria para trabajar con las colecciones de SharePoint.

Disponemos de dos constructores uno que se encargará de crear colecciones vacías y otro al que podemos pasarle una lista de elementos que formarán parte de la colección. Al obtener una instancia de la colección por medio de GetInstance(), establecemos que la interfaz IEnumerable será obtenida de la lista; también aquí nos encargamos de mockear el index por defecto que será a través de un int.

Si las colecciones que deseamos usar tienen otros índices como SPListCollection, que tiene un índice por título de la lista y otro por Guid, podemos sobrescribir el método CustomIndex en las clases heredadas implementando dicha funcionalidad.

No todo es perfecto…

No todo ha sido solucionado, algunos problemas quedan aún por resolver:

- La instalación de TypeMock no permite seleccionar un directorio de instalación, lo que limita la utilización de programas de compilación automático, como Cruise Control por ejemplo

- Los objetos mockeados creados en las dos primeras zonas de la clase de prueba son creados en un Thread diferente al utilizado por SharePoint al crear los objetos en el método a testear. Esto tiene como consecuencia que si se desea destruir los objetos al final del método a probar (por medio de un “using” para el SPSite y/o el SPWeb, o por medio de un “Dispose()” al final del método), SharePoint producirá un error en sus logs indicando “ERROR: request not found in the TrackedRequests. We might be creating and closing webs on different threads”

- Es necesario crear aun muchas más clases de envoltorio