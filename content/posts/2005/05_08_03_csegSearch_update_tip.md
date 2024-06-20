+++
title = 'csegSearch update and TIP'
date = 2005-08-03T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Some users have reported some small errors with csegSearch, and some doubts,

- the colorize results only runs in the first set of results (**fixed**)   
- some extended results are in incorrect site (**fixed**)

Try this new version (with care this is not the 1.2 final), first uninstall previous version

[csegSearchWebPart12.zip (11,45 KB)](https://web.archive.org/web/20080214110229/http://www.ideseg.com/ct.ashx?id=0ce0b11d-750b-4580-9842-25cd57e07251&url=http%3a%2f%2fwww.ideseg.com%2fcontent%2fbinary%2fcsegSearchWebPart12.zip)

_stsadm –o deletewppack –name csegSearchWebPart.cab  
iisreset_

_Stsadm –a addwppack –filename csegSearchWebPart.cab \[-globalinstall –force\]  
iisreset_

Plase use the forums to comment bugs and the doubts in [foros.ideseg.com](https://web.archive.org/web/20080214110229/http://www.ideseg.com/ct.ashx?id=0ce0b11d-750b-4580-9842-25cd57e07251&url=http%3a%2f%2fforos.ideseg.com)

**TIPO: To add a custom property (metadata) in the csegSearchResults**

1.- In “Site Configuration” go to "Manage Properties of Crawled Content", locate the value-type properties in the urn:schemas-microsoft-com:office:office namespace, select the desired custom metadata (ows\_METADATA) and check the option, "Included in the Advanced Search options", which exposes the meta property to the Sharepoint Search Service.

2.- Edit the Search.aspx with Search.aspx?Mode=Edit&PageView=Shared

3.- Export the csegSearch webpart

4.- Edit the .dwp file (add your custom metadata to the <QueryTemplateSelectPart>) This is the select part in the query

“urn:schemas-microsoft-com:office:office:ows\_METADATA”

5.- Import the .dwp and put in the Search.aspx page

6.- Then in extended results put

MyMetadata; urn:schemas-microsoft-com:office:office:ows\_METADATA