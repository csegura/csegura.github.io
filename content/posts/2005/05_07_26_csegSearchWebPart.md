+++
title = 'csegSearchWebPart'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++


# csegSearch – Adds google type searches to your Sharepoint site – boolean searches

This webpart allows to make searches **GOOGLE**  type in sharepoint.  
  
In the first place I would like to thank  Mattiew Cosier since to a large extent I have been inspired by his work. And Gustavo to test the webpart in your systems.  
  
This webpart is a subclass of the webpart included in sharepoint called SearchResults. Baically, csegSearch   transforms the keywords and  gives them the correct syntax to be used with the predicate CONTAINS of the Sharepoint searches..  
  
Being a subclass of SearchResults we can interchange them and  continue using the adavanced searches and the management searches.  
  
![](/images/Sharepoint/r_csegSearch1.jpg)

 
## Installation
  
This webpart settles like a normal webpart..  

```  
Stsadm -o addwppack -filename csegSearchWebPart.cab \[ -globalinstall -force \]**  
```

Once installed we need to modify the search.aspx page and to change webpart SearchResults by csegSearch ([see installation video](https://web.archive.org/web/20130803202430/http://www.ideseg.com/files/csegSearchInstall.wmv))  
  
In the properties of csegSearch, we will change the name of the list by “sch” in order to use advanced search management (sort and group)  
  

![](/images/Sharepoint/o_csegSearch.jpg)

  
## Operation

Webpart will transform the keywords into sharepoint joining  the words with the nexus AND as in google.  Internally csegSearch uses a parser engine that tries to correct the syntax of queries.  
  
- Supports  **AND**, **OR** and **NOT** operators (also short form &,| and !)
- Supports  **NEAR** operator
- Supports  Wildcars and brackets
- Supports Special keywords (site and file)
- Hilights results.

  

## Special keywords

They are added to the main query using **AND** operator. And always are considered using the nexus **OR** among them. Special keywords only works with simple queries.


    site:    file:

    Both accept wildcards ej: site:Demo\*, file:\*.doc

## Custom properties

_Debug query_: If checked show the current query_._
_Debug keywords:_ If checked show the keywords after parser it.
_Query where part_: Where part used in queries, you can modify it to use a custom where part.
_Open links in a new window_: If checked when click a result its show in a new window.
_Colorize color_: Name of the color to hilights results (red, blue etc…) if empty not colorize.
_Go to folder text_: Query results show a new button under documents to go to the folder of document this is the text of button, if empty this button is not showed.

Sample Queries


| Input Keywords | Result Query  |
| ---------------|---------------|
| red car | “red” AND “car” |
| “red car” | “red car” |
| red car big | “red” AND “car” AND “big” |
| red car or big | “red” AND “car” OR “big” |
| red (car or moto) | “red” AND (“car” OR “moto”) |
| red car not big | (“red” AND “car”) AND NOT “big” |
| red and and car | “red” AND “car” |
| red car or not big |  “red” AND “car” OR “big” |
| red car site:Demo* site:Test* file:doc | “red” AND “car” AND (Site contains Demo* OR Site contains Test*) AND file contains doc |
 

I wait for your commentaries and suggestions for future versions
First, once again many thanks to all you for your kind commentaries about csegRollUp.  

Sorry for being so late but I have had a lot of work last days, and nights are so short…

## Fixes

For users with problems in sites with ports diferents to 80, I must say that all tests of this new version have been done with a server installed in the port 1000 and all them have run correctly.

For users with problems as “not in the configuration database”  they are using only wss sites, now csegRollUp runs correctly.

**Remember that the field and list separator is comma ‘,’**

