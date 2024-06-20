+++
title = 'YACAMLQT (Yet another CAML query tool) Redux (2)'
date = '2009-04-22T00:00:00+02:00'
tags = ['sharepoint', 'caml', 'caml.net', 'yacamlqt']
+++


Bueno, esta es la última entrega a partir de hoy el proyecto se encuentra en CodePlex (yacamlqt.codeplex.com).

En esta última parte solo unas pequeñas notas para el usuario final.

Bien, para usar YACAMLQT, dentro de tus proyectos, solo hay que referenciar la dll (IdeSeg.SharePoint.Caml.QueryParser.dll)  y el uso sería el siguiente:



```csharp
try
{
    var parser = new NParser(textTSql, new ASTNodeCAMLFactory());
    var generator = new CodeGenerator(parser.Parse());
    generator.Generate();
    return _formatTools.FormatXml(generator.Code);
}
catch (ParserException ex)
{
      _view.Status = ex.Message;
  }
  catch (ScannerException ex)
  {
      _view.Status = ex.Message;
  }
```	

Instanciamos el Parser (NParser), le pasamos la consulta en TSQL (textSql) y la factoría correspondiente a lo que queremos generar, por el momento solo está disponible la de CAML, en breve completaré la de CAML.Net; Por último inyectamos el Parser en el Generador de código, llamamos al método Generate y recogemos la consulta en CAML en generator.Code.

![YACAMLQT](/images/Sharepoint/YACAMLQT_Sample_Gui.gif)


Las posibles excepciones tanto del Parser como del generador de código se pueden atrapar con ParserException y ScannerException.



En el proyecto se incluye un pequeño subproyecto con una interfaz WinForms (no es que se me de especialmente bien)





Parte 2 http://www.ideseg.com/YACAMLQTYetAnotherCAMLQueryToolRedux2.aspx
Parte 1 http://www.ideseg.com/YACAMLQTYetAnotherCAMLQueryToolRedux1.aspx