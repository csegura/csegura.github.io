+++
title = 'Sharepoint – csegWebContent webpart'
date = 2005-05-26T00:00:00+01:00
draft = false
tags = ['sharepoint', 'webpart']
+++

This weekend I have been working in some improvements of the page viewer webpart and this is the result

**New features**

- Control height of webpart  
- ICellConsummer Interface (to get an URL from another webpart)  
- AutoLoad if main page pass an URL in Load param

## Control height.

This webpart use all client height area by default less  115 pixels used by site header. You can adjust this in the cssWebContent properties.

## ICellConsummer Interface

The webpart is a cell consummer, this accept urls from anothers webparts

## AutoLoad

The webpart has a default url page, but if the main page is loaded with a param called Load, the argument is loaded into the webpart. (ex. Defaut.aspx?Load=http://www.google.com ) auto load the google web page.

![](/images/Sharepoint/o_csegWebContent.gif)

[csegWebContentWebPart.zip (8,69 KB)](https://web.archive.org/web/20130821122915/http://oldblog.ideseg.com/content//csegWebContentWebPart.zip)