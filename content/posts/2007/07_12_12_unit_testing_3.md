+++
title = 'Unit Testing 3'
date = 2007-12-12T00:00:00+02:00
tags = ['sharepoint', 'unit testing']
+++

Alguien me ha recordado que empecé a escribir sobre el tema de las pruebas unitarias y finalmente no termine… o por lo menos no conté algunas de las prácticas que uso… cierto.

**[Parte 1](https://web.archive.org/web/20130623113708/http://www.ideseg.com/SharePointPruebasUnitarias1.aspx)** – **[Parte 2](https://web.archive.org/web/20130623113708/http://www.ideseg.com/SharePointPruebasUnitarias2.aspx)**

Básicamente la técnica que uso habitualmente consiste en aprovisionar un sitio de forma automática. Y ¿Cómo se aprovisiona un sitio automáticamente?,  pues de la manera más sencilla posible. Usando Plantillas.

**Provisión – Escenario de Pruebas**

De modo que tengo distintas plantillas pre cargadas con listas, bibliotecas  de documentos, páginas etc… algunas incluyendo contenido, archivos, elementos de las listas y un montón de cosas.

Es sencillísimo crear estos escenarios y pueden ser simples, incluyendo uno ó unos pocos elementos ó complejos incluyendo una jerarquía de de sitios, en cuyo caso crearemos una plantilla por cada sitio para más tarde reconstruir una jerarquía de sitios determinada.

Después usamos un ayudante en nuestras pruebas para aprovisionar nuestros sitios, un ejemplo de un aprovisionador de sitios  básico sería algo como esto, he recortado algunas cosas …

```cs
public class SPProvisioningHelper
{        
    private const string DefaultWebName = "TestSite";
    private readonly Dictionary<string, SPWeb> _webs;

    private SPSite _site;
    private string _urlTestSite;
    
    public SPProvisioningHelper()
    {
        _webs = new Dictionary<string, SPWeb>();
        UrlTestSite = "http://enjendro/unittests/";
    }

    // Url del sitio de pruebas
    public string UrlTestSite
    {
        get { return _urlTestSite; }
        set { _urlTestSite = value; }
    }

    // Coleccion de sitios sobre la que estamos trabajando
    public SPSite Site
    {
        get { return _site; }
    }

    // Una web determianda
    public SPWeb GetWeb(string name)
    {
        return _webs[name];
    }

    // Provisiona una web vacia colgada de parentUrl
    // Pruebas rápidas y de creación de elementos
    public void WebProvisioning(string parentUrl)
    {
        _webs.Add(DefaultWebName, CreateWeb(DefaultWebName, parentUrl, string.Empty));
    }

    // Crea una web
    public void WebProvisioning(string name, string parentUrl)
    {
        _webs.Add(name, CreateWeb(name, parentUrl, string.Empty));
    }

    // Crea una web basada en una plantilla
    public void WebProvisioning(string name, string parentUrl, string template)
    {
        _webs.Add(name, CreateWeb(name, parentUrl, template));
    }

    // Crea las webs (hace el trabajo duro)         
    private SPWeb CreateWeb(string title, string parentUrl, string template)
    {
        Trace.WriteLine(string.Format("Creating test web {0} at {1}", title, parentUrl));

        _site = new SPSite(UrlTestSite + parentUrl);
        SPWeb web = _site.OpenWeb();
        SPWeb newWeb;

        // Stop
        if (web == null)
        {
            throw new SPException(string.Format("Can´t open SharePoint Site in: {0}", _site.Url));
        }

        // Si existe lo borramos 
        if (web.Webs[title].Exists)
        {
            RecursiveDeleteWebs(web.Webs[title]);
            web.Webs[title].Delete();
        }

        // Web vacio
        if (template.Equals(string.Empty))
        {
            newWeb = web.Webs.Add(title);
        }
        else
        {
            // web basado en plantilla personalizada
            try 
            {
                SPWebTemplateCollection webTemplateCollection;
                webTemplateCollection = _site.GetCustomWebTemplates((uint) web.Locale.LCID);

                SPWebTemplate webTemplate = webTemplateCollection[template];

                newWeb = web.Webs.Add(title,
                                      title,
                                      string.Empty,
                                      (uint) web.Locale.LCID,
                                      webTemplate,
                                      true,
                                      false);
            }
            // web basado en plantilla no personalizada
            catch (ArgumentException)
            {                    
                newWeb = web.Webs.Add(title,
                                      title,
                                      string.Empty,
                                      (uint) web.Locale.LCID,
                                      template,
                                      true,
                                      false);
            }
        }

        Trace.WriteLine(string.Format("Created web {0} at {1}", newWeb.Title, newWeb.Url));

        return newWeb;
    }

    // Limpieza
    public void Clean()
    {
        DeleteWebs();
        // Disposes 
    }

    // Elimina las webs
    private void DeleteWebs()
    {
        foreach (SPWeb web in _webs.Values)
        {              
            RecursiveDeleteWebs(web);           
        }
    }

    // Elimina todo recursivamente
    private void RecursiveDeleteWebs(SPWeb parentWeb)
    {
      // ...
    }    
}  
```

**Pruebas**

Después en nuestras pruebas podemos inicializar los distintos escenarios, veamos un ejemplo usando el  
aprovisionador anterior

```cs
[TestFixture]
public class Tests
{
    // El ayudante
    private SPProvisioningHelper provisioningHelper;

    [TestFixtureSetUp]
    public void Setup()
    {
        // Incializamos el ayudante
        provisioningHelper = new SPProvisioningHelper();
        
        // Ejemplos

        // Aprovisionamos p1 desde una plantilla nuestra
        provisioningHelper.WebProvisioning("p1", "P1", "Plantilla1.stp");

        // jerarquia
        provisioningHelper.WebProvisioning("p1", string.Empty);

        // p1/p1a -> sitio de grupo
        provisioningHelper.WebProvisioning("p1a", "p1", "STS");

        // p1/p1b -> un blog
        provisioningHelper.WebProvisioning("p1b", "p1", "Blog");
        
        // p1/p1a/p1a1 -> un wiki
        provisioningHelper.WebProvisioning("p1a1", "p1/p1a", "Wiki");
        
        // p1/p1a/p1a1/p1a11 -> sitio en blanco
        provisioningHelper.WebProvisioning("p1a11", "p1/p1a/p1a1");
                    
    }

    // Una prueba simple

    [Test]
    public void GetCurrentUserName()
    {
        string expectedUser = WindowsIdentity.GetCurrent().Name;

        SPUser user = provisioningHelper.GetWeb("p1").CurrentUser;

        string userName = user.LoginName;

        Trace.WriteLine(string.Format("Expected: {0} User: {1}", expectedUser, userName));
        Assert.IsTrue(expectedUser.Equals(userName,StringComparison.OrdinalIgnoreCase));            
    }

    // Limpieza        
    [TestFixtureTearDown]
    public void TearDown()
    {
        provisioningHelper.Clean();
    }
}   
```

Esto es básicamente, desde luego como ocurre con todos los sistemas que deben  
ser aprovisionados, estos llevan su tiempo, en cualquier caso tampoco me parece  
tanto y además hay unos estupendos quad core relativamente baratos así que no es  
escusa para no tener una máquina de pruebas.