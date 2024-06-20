+++
title = 'YACAMLQT (Yet another CAML query tool) Redux (2)'
date = '2009-04-22T00:00:00+02:00'
tags = ['sharepoint', 'caml', 'caml.net', 'yacamlqt']
+++

Habíamos visto la parte relacionada con el Lexer el analizador morfológico. Como es obvio detrás debe haber un analizador sintáctico y semántico el [Parser](https://web.archive.org/web/20130904001414/http://en.wikipedia.org/wiki/Parsing).

El analizador sintáctico y semántico (**NParser**) se ha implementado siguiendo el patrón interpeter, (_seguramente sea uno de los que menos se ven_), el objetivo es obtener los distintos Tokens desde el Scanner y montar un árbol sintáctico ([AST](https://web.archive.org/web/20130904001414/http://en.wikipedia.org/wiki/Abstract_syntax_tree)) este árbol contiene Nodos (**ASTNodeBase**) y estos nodos representan de manera abstracta y simplificada la estructura sintáctica de la consulta en SQL.

(diagrama NParser)

![](/images/Sharepoint/yacamlqt_nparser.gif)

A la clase **NParser** se le puede inyectar una factoria (**ASTNodeFactoryBase**) en función del código que queramos generar, por el momento solo esta implementado el CAML, pero se puede extender sencillamente para generar [CAML.Net](https://web.archive.org/web/20130904001414/http://www.codeplex.com/camldotnet).

Partiendo de un nodo abstracto (**ASTNodeBase**) podemos definir las distintas unidades sintácticas, por medio de la herencia. Estos nodos abstractos (heredados de **ASTNodeBase** ) conforman las distintas expresiones que se usan en el analizador sintáctico y semántico (**NParser**), para ello se ha definido una clase para cada uno de los Tokens a modo de plantilla (template),  y estas clases son a su vez son las distintas expresiones abstractas, que se usan en  el patrón interpreter implementado en el parser. (**NParser**).

Todos estos nodos que forman las expresiones abstractas al fin al cabo son plantillas (templates), y podrían a su vez ser clases abstractas, yo opte por una implementarlas como clases normales. Ya que algunos de los nodos son terminales y otros intermedios y no tienen por qué ser heredados, de este modo la factoria base (**ASTNodeFactoryBase**) usa miembros virtuales parar crear dichos nodos.

(diagrama parcial de ASTNodeBase)

![](/images/Sharepoint/yacamlqt_ast.gif)

Para crear todos estas expresiones abstractas existe una factoría abstracta (**ASTNodeFactoryBase** ) a través de la cual creamos los distintos nodos. Como puede verse, para añadir una variante como [CAML.Net](https://web.archive.org/web/20130904001414/http://www.codeplex.com/camldotnet), solamente hay que añadir las expresiones abstractas heredando de las ya existentes e implementando **PreCode()** y **PostCode()**.

Todos estos nodos que forman las expresiones abstractas al fin al cabo son plantillas (templates), y podrían a su vez ser clases abstractas, yo opte por una implementarlas como clases normales, debido a que algunos de los nodos son terminales y otros intermedios y no tienen por qué ser heredados, de este modo la factoria base (**ASTNodeFactoryBase**) usa miembros virtuales parar crear dichos nodos terminales e intermedios.

Después para poder inyectar en el parser dichas expresiones debemos crear una nueva factoría heredada de la factoría base (ASTNodeFactoryBase).

(diagrama ASTNodeFactoryBase)

![](/images/Sharepoint/yacamlqt_nodefactory.gif)

Para generar CAML lo que he hecho es heredar de cada plantilla ó expresión abstracta definida, una nueva clase que redefine los métodos virtuales **PreCode()** y **PostCode()** que son los encargados de sustituir cada nodo del árbol sintáctico en CAML.

Y crear una factoría (**ASTNodeCAMLFactory**) que se encarga de crear las expresiones.