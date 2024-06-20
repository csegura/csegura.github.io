+++
title = 'Yet Another Caml Query Tool'
date = 2007-06-19T00:00:00+02:00
tags = ['sharepoint', 'caml', 'tools']
+++


Some time ago, I thought write a small tool in order to do **CAML** queries in plain text, as in SQL “_**where**_” clause. I have the idea forgotten, I missed myself in the daily work. Yesterday doing a little modification in a program I remembered this, of course while I was writting a complex **CAML** query.

I named it “Yet Another CAML Query Tool” aka (**YACAML-QT**).

By moment it’s a little toy, you can write your queries as in a “**_where_**” clause, using the same syntax that you’d write in a SQL Sentence. It’s is more easy!!!

![](/images/Sharepoint/YACAML_QT__5B1_5D.gif)

**Updated**  
Use “**\=null**” as CAML **_IsNull_** operator and “**<>null**” as **_IsNotNull_** also you can use dates enclosed into sharp characters #01/01/1990# the sql **Like** operator is replaced by CAML **_Contains_** and the at “@” operator for the CAML **_BeginsWith._** Also support parentheses for operator precedence.

**TODO**: a pretty interface ![:-)](/images/Sharepoint/icon_smile.gif)

![](/images/Sharepoint/YACAML_QT__5B2_5D.gif)

![](/images/Sharepoint/save_16.gif) [**YACAMLQT.zip**](https://web.archive.org/web/20130623174220/http://oldblog.ideseg.com/content//YACAMLQT.zip)