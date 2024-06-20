+++
title = 'csegRollUp v3 out'
date = 2005-11-21T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Finally csegRollUp v3 is here, first I want to give to thanks to all beta testers and and special thanks to Florian Rossmark and Dor Rotman.

![](/images/Sharepoint/csegRollUp-v3-properties.gif)

- Lists – As in previous versions, List of comma delimited values that signify the sites and lists
Format: /site/subsite:ListName, /site/subsite/subsite:ListName

- Fields – As in previous versions, List of comma delimited values with the field names
Format: Title,Text,Comment,User

- Include List Data  (new) – If enabled the result xml data contains special fields

```xml
<_ListTitle/>   <!– List Title –>
<_ListUrl/>     <!– Url to default view –>
<_SiteTitle/>   <!– Site title –>
<_SiteUrl/>     <!– Url to site –>
<_ItemID/>      <!– Item ID –>
<_ItemUrl/>     <!– Url to list item view –>
```

- List in all subsites – If enabled the webpart will search these lists in all the subsites of a lower level, and show the results
- XSL – XSL to render the result (new this release supports exslt extensions)

- Debug XML – If checked you can view the collected xml data.
- Fix Lookups (new) - If enabled lookup fields thats contains key;#data are replaced only by data.
- CAML Query (new) – The caml query to retrieve items on each list.

Special values that you can use on queries:
    [Login] – the logged user
    [UserName] – the complete user name
    [UserID] – the user ID
    [Now] – the current date and time
    [Now+x] – the current date and time + x days
    [Now-x] – the current date and time  – x days
    [CellProvider] – the cell provide from other webpart


- CAML Query Row Limit (new) – The limit for the number of items returned in the query.
- Query recursive (new) – If enabled the makes the query recursive (search in subfoldes for documents libraries)
- Query Moderator (new) – If enabled you can check approval status.
- Debug query (new) – If checked you can view the result query.


Also I want to say that the offers that I had for my webparts, they have not been the sufficiently good thing. The license usage is as always free for no commercial usage. Contact with me first for other usages.