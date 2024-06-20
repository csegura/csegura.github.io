+++
title = 'Unit Testing'
date = 2007-08-29T00:00:00+02:00
tags = ['tests']
+++


Estos días mi querido amigo Gustavo, ha estado pasando un infierno tratando de mejorar el proceso de realizar pruebas unitarias con SharePoint.  
  
Desde mi punto de vista las pruebas con objetos Mock funcionan (luego veremos cómo), pero creo que no siempre son lo más adecuado y esto hay que tenerlo muy en cuenta.  
  
Cuando desarrollamos pruebas unitarias tratamos de ver si existen diferencias entre el comportamiento esperado y el comportamiento observado. Cuando la realización de estas pruebas se convirtió en algo complejo, por la dependencia de nuestro código con sistemas externos surgieron distintas técnicas que nos permiten substituir estos sistemas e independizar nuestras pruebas.  
  
Con estas técnicas, entre las cuales están los objetos Mock, el código que escribimos para realizar la prueba, interactúa con impostores, falsificaciones, espías, objetos simulados etc… Es decir con fantasmas.  
  
Fantasmas, “ectoplasmas” que aparentan ser lo que no son; objetos de verdad. Pero que nos permiten entre otras cosas que nuestra prueba no se detenga por depender de un subsistema externo y muchas veces ajeno a nosotros.  
  
De modo que en la mayoría de los casos, estamos dando por sentado como se comportará ese subsistema, comportamiento esperado. Al predeterminar esto estamos dando por hecho que dicho subsistema funcionará correctamente ó incorrectamente si queremos comprobar que nuestro código sabe responder a las fallas del subsistema, con lo que el subsistema real queda fuera del ámbito de nuestra prueba. Resumiendo, independizamos nuestras pruebas.  
  
Veamos ahora un ejemplo conocido:

```csharp
public static class Tools
{
    public static string GetCurrentUserName(HttpContext myContext)
    {
        SPWeb myWeb = SPControl.GetContextWeb(myContext);
        SPUser myUser = myWeb.CurrentUser;
        return myUser.LoginName;
    }
}
```
Si, es enrevesado ya que estamos usando el contexto de la aplicación web (cosa que deberíamos evitar siempre que podamos, pero eso es otra historia)  
  
Volviendo al código si lo que estamos haciendo es una aplicación ASP.Net que debe interactuar con SharePoint (el subsistema) y queremos realizar una prueba unitaria de este código podemos hacerlo usando objetos Mock.  
  
De este modo nuestra prueba funcionará correctamente sin la necesidad de disponer de una instalación de SharePoint.  
  
Yo personalmente uso [TypeMock](https://web.archive.org/web/20130623133619/http://www.typemock.com/), que me parece sin lugar a dudas el más completo y con el que menos cuesta (en términos de líneas) realizar los test.  
  
Ejemplo

```csharp
[Test]
public void GetCurrentUserNameTest()
{
    string expectedUserName = “Sample User”;
    MockManager.Init();

    // Hacemos un Mock de SPUser
    // Usando MockManager.MockObject nos permitira crear un objeto sin
    // llamar a su constructor para recuperar la instancia inmediatamente
    MockObject mockSPUser = MockManager.MockObject(typeof (SPUser));

    // Fijamos el valor que será devuelto cuando se solicite el valor de la 
    // propiedad LoginName
   mockSPUser.ExpectGet(“LoginName”, expectedUserName);

    // Devolvemos la instancia para poder usarla
    SPUser spUser = mockSPUser.Object as SPUser;

    // Hacemos un Mock de SPWeb
    MockObject mockSPWeb = MockManager.MockObject(typeof (SPWeb));

    // Fijamos el valor que será devuelto cuando se solicite el valor de la
    // propiedad CurrentUser que es el objeto SPUser que creamos anteriormente            

    mockSPWeb.ExpectGet(“CurrentUser”, spUser);

    // Devolvemos la instancia para poder usarla
    SPWeb spWeb = mockSPWeb.Object as SPWeb;

    // Hacemos un Mock de SPControl
    // En esta ocasion no vamos a instanciarlo ahora, se instanciará automaticamente 
    // cuando se solicite
    Mock mockSPControl = MockManager.Mock(typeof (SPControl));

    // En cualquier caso el método GetContextWeb, devolverá el objeto SPWeb
    mockSPControl.AlwaysReturn(“GetContextWeb”, spWeb);

    // Tomamos el nombre del usuario
    // Incluso podemos pasarle null (este no es el test de parametros/excepciones)
    string userName = Tools.GetCurrentUserName(null);

    // Comprobamos que el valor esperado es el valor que hemos obtenido
    Assert.AreEqual(expectedUserName, userName, “Correct!!!”);

    // Verificamos la prueba
    MockManager.Verify();
}
```

El código de la prueba nos permite verificar que el método GetCurrentUserName funciona correctamente. Es más no necesitamos depender de SharePoint para probar nuestro código. Ya somos independientes del Subsistema.  
  
Pero si analizamos la prueba, lo único que hemos hecho es prefijar el comportamiento de cada uno de los objetos que usa nuestro método, que como dice un gran amigo, es como decirle al ordenador: Cuándo te pregunte como me llamo, di que me llamo PEPE, y preguntarle ¿Cómo me llamo? a lo cual responderá PEPE, y diremos BIEN, aunque yo me llame JUAN.  
  
Pero eso sí, el maremágnum de pruebas correrá feliz por los mundos de yupi.  
  
Otro tema a tener en cuenta, es, si es necesaria la prueba y cuando debemos realizar este tipo de pruebas ¿Qué estamos probando aquí?, no estamos haciendo un test de excepciones, ni un test de carga, ni un test de delegación etc., ni siquiera una prueba de integración, lo único que estamos haciendo es comprobar que el subsistema de SharePoint, responderá como nosotros esperamos que lo haga. (Cosa que los programadores de SharePoint hacemos habitualmente) De modo que garantizar que SharePoint funciona correctamente no es nuestra tarea. Para nosotros lo importante es el hecho de que interactuamos con un sistema externo y el ámbito de nuestras pruebas debería ser nuestro propio código.  
  
Puede parecer complicado pero yo creo que hay que poner límites a las pruebas, de modo que probaría a ver si estoy controlando todas las excepciones que debería, a la hora de tratar con el subsistema y a asegurarme que los datos que le estoy pasando o que estoy recibiendo de él son los correctos.  
  
Por otro lado cuando desarrollamos en el interior del subsistema (WebParts, Eventos, Workflows, etc.) las cosas pueden cambiar…  