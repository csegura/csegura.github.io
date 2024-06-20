+++
title = 'csegSearch 1.1'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Buff, finally csegSearch 1.1

Thanks to Henrik, Raphael, André, Klaus and Mario for your comments.

![](/images/Sharepoint/csegSearchResults.gif)

## Fixed/Improvements

- Add support to display custom attributes in results view.  
- Fix the query string parameters  
- Fix empty Hilight color  
- Hilight keywords in document title and author  
- Parser optimization and autofix 

## Operation

Webpart will transform the keywords into sharepoint joining  the words with the nexus AND as in google.  Internally csegSearch uses a parser engine that tries to correct the syntax of queries.

  
- Supports  **AND**, **OR** and **NOT** operators (also short form &,| and !)  
- Supports  **NEAR** operator  
- Supports  Wildcars and brackets  
- Supports Special keywords (site, file, status, author)  
- Hilights results (now client mode via javascript, support wildcards)  
- Extend results easily (add custom)  
- Go to folder button


## Special keywords

They are added to the main query using **AND** operator. And always are considered using the nexus **OR** among them. Special keywords only works with simple queries.

site, author, status, file  
  
Both accept wildcards ej: site:Demo\*, file:\*.doc

## Custom properties

![](/images/Sharepoint/csegSearchResults-properties.gif)


_Show Query_: If checked show the current query (debug purposes)_._
_Show keywords:_ If checked show the keywords after parser it.
_Extend Results:_ To show others attributes in your query results you need edit this property.

```
<Title>;<Search Attribute>,<Tile>;<Search Attribute> …
```
  
Example: Modified;DAV:getlastmodified,Description2;urn:schemas.microsoft.com:fulltextqueryinfo

 
_Query where part_: Where part used in queries, you can modify it to use a custom where part.
_Colorize color_: Name of the color to hilights results (red, blue etc…) if empty not colorize.
_Go to folder text_: Query results show a new button under documents to go to the folder of document this is the text of button, if empty this button is not showed.
_Search text_: If show keywords is enabled this is the text before keywords.

Download [csegSearchWebPart.zip (12,07 KB)](https://web.archive.org/web/20120604065318/http://oldblog.ideseg.com/content//csegSearchWebPart.zip)

