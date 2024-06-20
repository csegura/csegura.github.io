+++
title = 'YACAMLQT (Yet another CAML query tool) Redux (1)'
date = '2009-04-21T00:00:00+02:00'
tags = ['sharepoint', 'caml', 'caml.net', 'yacamlqt']
+++

Hace un mes, John Holliday, me pidió a ver si podíamos integrar su CAML.net con mi YACAMLQT, a la vez que ampliar mi herramienta para soportar otro tipo de consultas como adds y updates.

YACAMLQT, es una utilidad que convierte una sentencia SQL en CAML, el lenguaje de consulta de Sharepoint. (Véase YACAMLQT, YACAMLQT2 y YACAMLQT-CAML.Net)

Estos días entre rato bueno y rato malo, he reescrito totalmente el código de YACAMLQT, para hacerlo más sencillo (por supuesto usando TDD), en principio el objetivo ha sido emular el antiguo YACAMLQT, pero dotándolo de un diseño más sencillo y ampliable.

YACAMLQT, es un programa que convierte una sintaxis tipo SQL en CAML (el lenguaje de consulta de SharePoint).

Es decir esto:

```sql
WHERE ((Column1 = “Value1″) AND (Column2 = “Value2″)) OR ((Column3 = 10)
AND (Column3 <> NULL)) GROUPBY Column1 ORDERBY Column1, Column2 ASC, Column3 DESC
```

En esto:


```xml
<Query>
  <Where>
    <Or>
      <And>
        <Eq>
          <FieldRef Name="Column1" />
          <Value Type="Text">Value1</Value>
        </Eq>
        <Eq>
          <FieldRef Name="Column2" />
          <Value Type="Text">Value2</Value>
        </Eq>
      </And>
      <And>
        <Eq>
          <FieldRef Name="Column3" />
          <Value Type="Integer">10</Value>
        </Eq>
        <IsNotNull>
          <FieldRef Name="Column3" />
        </IsNotNull>
      </And>
    </Or>
  </Where>
  <GroupBy>
    <FieldRef Name="Column1" />
  </GroupBy>
  <OrderBy>
    <FieldRef Name="Column1" />
    <FieldRef Name="Column2" Ascending="True" />
    <FieldRef Name="Column3" Ascending="False" />
  </OrderBy>
</Query>
```

El proyecto completo lo subiré a CodePlex en unos días, con su código fuente que poco a poco y con ayuda espero ir ampliando.

Por si alguien quiere echar una mano en el proyecto, voy a contar alguno de los entresijos del diseño de la aplicación.

Lo primero que he diseñado es el analizador morfológico (lexer) que se encarga de identificar dentro de un string, las distintas unidades sintácticas (tokens) con las que construiremos un analizador sintáctico y semántico (parser) con el cual construiremos un árbol sintáctico (AST) que por último recorreremos para transformar el SQL en CAML u otra variante como CAML.Net.

El lexer, está compuesto por una clase base, ScannerBase que contiene las partes más básicas del lexer, he extraído esta clase base una vez que tenía el analizador morfológico completo ya que de esta manera podemos realizar otro tipo de analizadores.

![YACAMLQT](/images/Sharepoint/yacamlqt_lexer.gif)

Las funciones básicas como comerse los espacios (EatSpaces()), detectar si es el final de línea (EndOfLine()) , saltar caracteres (SkipChar()) son parte de ScannerBase. Lo más importante de esta clase es la propiedad CurrentChar que devuelve el último carácter leído y el método GetCharMoveNext(), que obtiene un carácter y se mueve a la siguiente posición.

Para los que habéis usado el unix flex, GetCharMoveNext() es similar a input().

Esta clase ScannerBase utiliza internamente una clase ScannerState que mantiene el estado para poder releer un token ó unidad sintáctica.

Los tokens en el caso de YACAMLQT, consisten en las palabras reservadas propias de SQL, así como los distintos operadores, los campos y los valores (cadena, fecha, lógico y numérico).

A diferencia del unix flex, esto no se trata de un unput(), ya que mediante este volveríamos al carácter anterior. En este caso, como lo importante del analizador es obtener una unidad sintáctica, o token, lo que he hecho es implementar un método llamado BackToken() que lo que hace es posicionar el lexer justo al comienzo del último token obtenido, de modo que GetToken() volverá a devolvernos el mismo token.

La clase Scanner, hereda como es de suponer de ScannerBase, e implementa GetToken(), el responsable de de devolver un token, y CheckCorrectBracketsAndQuotes() que es el responsable de comprobar que los paréntesis y las comillas están correctamente.

Dentro de la clase Scanner, el método GetToken() es el responsable de identificar cada uno de los tokens, para lo cual he realizado un método para identificar cada uno de los distintos tokens. GetToken() usa los métodos ScanDate(), ScanString(), ScanOperator(), ScanNumber() y ScanReservedWordOrSymbol().

ScanOperator() y ScanReservedWordOrSymbol() usan un diccionario para identificar los distintos operadores y palabras reservadas. En el caso de ScanReservedWordOrSymbol(), si el token leído no se encuentra en el diccionario de palabras reservadas estaremos identificando un símbolo ó identificador.

Para terminar con esta primera parte, y siguiendo el principio de responsabilidad única, se ha implementado la clase Token como un contenedor y TokenFactory como una factória encargada de crear los distintos tipos de tokens ó unidades sintácticas. La clase Scanner es la que usa la factória para crear los distintos Tokens.

![YACAMLQT](/images/Sharepoint/yacamlqt_token.gif)

La clase Token, puede contener los distintos tipos de tokens, en principio todos aunque pueden ser de diferentes tipos, mantendrán su valor como un string. El resto de propiedades para identificar el tipo de token (TType) ó el tipo de valor (ValueType) son una enumeración.