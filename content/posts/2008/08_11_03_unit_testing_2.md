+++
title = 'Sharepoint Unit Testing'
date = 2008-11-03T00:00:00+01:00
tags = ['sharepoint', 'unit testing']
+++

Como sabéis tanto Gustavo como yo llevamos tiempo realizando pruebas sobre lo que programamos en SharePoint, ambos estamos usando TypeMock como framework para
nuestros objetos Mocks que son imprescindibles a la hora de realizar pruebas para SharePoint.

Durante los últimos meses hemos posteado sobre el tema, hemos iniciado un proyecto en CodePlex con un conjunto de clases envoltorio que pueden ayudarnos a
la hora de realizar las pruebas con TypeMock y que está a un tris de quedarse obsoleto.

Antes de continuar me gustaría hacer una pequeña recapitulación sobre algunos puntos y características que nos ofrece TypeMock a la hora de realizar pruebas
para SharePoint.

Veamos un sencillo ejemplo, para probar el código siguiente:

```csharp
   public Guid SampleGetSiteID()
   {
        Guid siteID = Guid.Empty;
    
        using(SPSite site = new SPSite("http://moss"))
        {
            siteID = site.ID;
        }           
    
       return siteID;
  }
```
En este código estamos usando un objeto SPSite que no podemos sustituir a priori de modo que de cara a probar esto es un problema.

TypeMock, lo resuelve permitiéndonos crear simulaciones de clases de objetos antes de que estas se usen, después TypeMock, sustituirá la instancia real con
una instancia de la clase simulada que hemos creado.

Para probar el código anterior podemos hacer lo siguiente:

```csharp
[TestMethod]
public void SampleGetSiteID_ReflectiveMock()
{
   MockManager.ClearAll();
   MockManager.Init();
 
   Guid expectedId = Guid.NewGuid(); 
 
   Mock<SPSite> mockFutureInstanceOfSPSite = MockManager.Mock<SPSite>(Constructor.Mocked);
     mockFutureInstanceOfSPSite.ExpectGetAlways("ID", expectedId);
   
     Samples target = new Samples();
     Guid resultId = target.SampleGetSiteID();
   
     Assert.AreEqual(resultId, expectedId);
  }
```	
`Mock<SPSite> mockFutureInstanceOfSPSite = MockManager.Mock<SPSite>(Constructor.Mocked)` se encarga de mockear (simular) la clase SPSite al usar `Mock<SPSite>` estamos
definiendo una clase simulada que será reemplazada en el momento de su uso (nos estamos anticipamos).

Vemos también como hemos fijado la propiedad mockFutureInstanceOfSPSite.ID por medio de mockFutureInstanceOfSPSite.ExpectGetAlways(“ID”, expectedId); para que devuelva expectedId.

En el momento en que se ejecuta la prueba TypeMock se encargará de sustituir la solicitud new SPSite(“http://wsses”) con nuestro mockFutureInstanceOfSPSite. Y
cuando se solicite la propiedad ID del SPSite se devolverá el valor que hemos establecido para la propiedad “ID” en la expectativa.

Esta propiedad se establece de forma reflectiva (TypeMock usa reflexión para establecer este valor), de esta forma también podemos crear simulaciones de
clases de objetos que tienen constructores privados así como establecer campos “privados ó internos” de la clase que estamos mockeando (simulando); De esta
característica surge el nombre de “Reflective Mocks”

Pero aún hay más, en este caso hemos creado la simulación, y le hemos establecido una expectativa, esto es que lo que esperamos realmente es que exista una llamada a la propiedad ID del SPSite.

Para comprobar que esa expectativa se ha cumplido, es decir que realmente se ha hecho la solicitud, podemos añadir el atributo [VerifyMocks] a nuestra prueba o
bien añadir MockManager.Verify() al finalizar la prueba.

Con esto TypeMock, comprobara que efectivamente se ha hecho la llamada. 

Para verlo funcionar podemos establecer:

`mockFutureInstanceOfSPSite.ExpectGet(“HostName”, “MyHost”);`

Y como resultado TypeMock

```
Test method TestProject1.TestSamples2.SampleGetSiteID_ReflectiveMock threw
exception: TypeMock.VerifyException:
TypeMock Verification: Method Microsoft.SharePoint.SPSite.get_HostName() has 1
more expected calls
```

De modo que podemos verificar que nuestro método no ha llamado a HostName comoesperábamos.

No se vayan todavía aún hay más

TypeMock tiene una particularidad que creo que ya he comentado en más de una ocasión que es la de poder simular clases de objetos que tienen un constructor privado. Y esto lo hace excepcional. Sobre todo para SharePoint.

## Natural Mocks

Por medio de los “Natural Mocks” podemos definir un conjunto de expectaciones, grabarlas y después comprobar si se han llevado a cabo. (Si, esto ya se podía hacer antes) El detalle aquí es que a la hora de fijar las expectativas estas se definen de manera natural pero solo dentro de un Recorder, que será el encargado
de grabar dichas expectativas.

Vemos como sería la misma prueba usando Natural Mocks

```csharp
[TestMethod] 
public void SampleGetSiteID_NaturalMock()
{
    MockManager.ClearAll();
    MockManager.Init();
 
    Guid expectedId = Guid.NewGuid();
 
    using (RecordExpectations recorder = RecorderManager.StartRecording())
      {
          SPSite mockFutureInstanceOfSPSite = new SPSite(string.Empty);
          recorder.ExpectAndReturn(mockFutureInstanceOfSPSite.ID, expectedId); 
      }
   
      Samples target = new Samples();
      Guid resultId = target.SampleGetSiteID();
   
      Assert.AreEqual(resultId, expectedId);
  }
```	

Como puede apreciarse ahora las expectativas las fijamos sobre el recorder y la sintaxis es natural, ya no necesitamos fijar las expectativas de las llamadas a
propiedades ó métodos usando strings, podemos usar directamente las propiedades aprovechando el intellisense y la corrección de errores;

El otro cambio es que estamos creando una instancia natural de SPSite dentro del recorder; TypeMock la usará luego para la sustitución. Como es obvio, es más
Natural.

Como inconveniente, en los mocks naturales no podemos fijar expectativas para los campos “privados o internos”.

Bien, hemos empezado con algo que a parecía complejo por el hecho de tener que sustituir un objeto (SPSite) que se encuentra dentro de un método (SampleGetSiteID)
y hemos visto como TypeMock nos permite realizar esa sustitución.

Evidentemente el método (SampleGetSiteID) está fuertemente acoplado a la API de SharePoint, cosa que debemos evitar en la medida de lo posible. Como es lógico esto se ha hecho con el propósito de ejemplo.

Ahora veremos cómo podemos usar las instancias de los objetos simulados en nuestras pruebas.

El código a probar sería el siguiente:

```csharp
public int SampleGetWebsInSite(SPSite site)
{
    int countWebsInSite;
 
    using (SPWeb web = site.OpenWeb())
    {
        countWebsInSite = web.Webs.Count;
    }
            
      return countWebsInSite;
  }  
```

En este caso nuestro método necesita un SPSite de modo que para probarlo necesitaremos una instancia de SPSite; Pero SPSite es un objeto un poquito raro,
y requiere de una conexión real y de toda la infraestructura de SharePoint para poder instanciarse.

En este caso podemos usar las instancias de los objetos mockeados.

Primero veamos cómo hacerlo usando “Reflective Mocks“

```csharp
[TestMethod]
public void SampleGetWebsInSite_Test_Reflective()
{
    MockManager.ClearAll();
    MockManager.Init();
 
    MockObject<SPSite> mockSPSite = MockManager.MockObject<SPSite>(Constructor.Mocked);
    MockObject<SPWeb> mockSPWeb = MockManager.MockObject<SPWeb>(Constructor.Mocked);
    MockObject<SPWebCollection> mockSPWebCollection = MockManager.MockObject<SPWebCollection>(Constructor.Mocked);
   
      SPWeb webInstance = mockSPWeb.MockedInstance;
      SPWebCollection webCollectionInstance = mockSPWebCollection.MockedInstance;
   
      mockSPSite.ExpectAndReturn("OpenWeb", webInstance);
      mockSPWeb.ExpectGet("Webs", webCollectionInstance);
      mockSPWebCollection.ExpectGet("Count", 5);
   
      Samples target = new Samples();
      int websInSite = target.SampleGetWebsInSite(mockSPSite.MockedInstance);
   
      Assert.AreEqual(websInSite, 5);
      MockManager.Verify();
  }
```

En este caso, lo que hacemos es crear un MockObject de SPSite, un MockObject de SPWeb, cuya instancia real (mockFutureInstanceOfSPWebCollection.MockedInstance)
devolveremos cuando se solicite OpenWeb, un MockObject de SPWebCollection, cuya instancia devolveremos cuando se solicite la colección de webs dentro del sitio
y finalmente establecemos el número de elementos que la colección falsificada debe devolver que es 5.

Como es lógico y se aprecia en el código anterior, podemos ver que el orden a la hora de crear los distintos elementos es muy importante para que todo encaje
perfectamente.

Una cosa más, fijaros que estamos usando `MockObject<SPSite>` en vez de `Mock<SPSite>` esto es debido a que no necesitamos crear el objeto con anterioridad, si no que
lo vamos a usar directamente en la llamada a nuestro método.

`target.SampleGetWebsInSite(mockSPSite.MockedInstance);`

Bien, ahora veremos cómo podemos realizar la misma prueba usando

Natural Mocks

```csharp
[TestMethod]
public void SampleGetWebsInSite_Test_NaturalMock()
{
    MockManager.ClearAll();
    MockManager.Init();
 
    SPWeb web = MockManager.MockObject<SPWeb>().MockedInstance;
    SPWebCollection webs = MockManager.MockObject<SPWebCollection>().MockedInstance;
 
      using (RecordExpectations recorder = RecorderManager.StartRecording())
      {
          SPSite site = new SPSite("");
   
          recorder.ExpectAndReturn(site.OpenWeb(), web);
          recorder.ExpectAndReturn(web.Webs, webs);
          recorder.ExpectAndReturn(webs.Count, 5); 
      }
   
      Samples target = new Samples();
      int websInSite = target.SampleGetWebsInSite(new SPSite(""));
   
      Assert.AreEqual(websInSite, 5);
      MockManager.Verify();
  }
```

Lo primero, es que es menos farragoso, lo que hacemos es crear las falsificaciones para las clases SPWeb y SPWebCollection, ambas las usaremos
luego.

Dentro del recorder creamos un objeto SPSite, esto falsificara el primer uso que se haga de SPSite y fijaremos las expectativas devolviendo las instancias reales
de las falsificaciones. (Nótese la llamada a MockedInstance)

`SPWeb web = MockManager.MockObject<SPWeb>().MockedInstance;`

web es una instancia de SPWeb, que se ha creado a partir de la falsificación de SPWeb.

Bien, en el momento de crear nuestra prueba estamos llamando a target.SampleGetWebsInSite creando un nuevo SPSite (new SPSite(“”) ) ¿fallara?,
NO, no falla, como he dicho antes, TypeMock devolverá una instancia de SPSite que es lo que le hemos dicho dentro del recorder y en cada solicitud
site.OpenWeb(), Webs y Count devolverá los valores que hemos fijado en las expectativas del recorder.

Bueno, esto es solo una pequeña introducción al tipo de cosas que nos deja hacer TypeMock, como framework de pruebas para SharePoint, hay mucho, mucho más que
encontraréis en los manuales de TypeMock.

Bien, en este punto ambos, Gustavo y yo nos encontramos con el problema de recorrer las colecciones de objetos como Webs, Lists, Users etc… de
SharePoint;

Esto origino el proyecto de SPTypeMock con las clases envoltorio que nos ayudaban con el tema de las colecciones pero como he dicho antes esto está a
puntito de quedarse obsoleto…

Continuara…