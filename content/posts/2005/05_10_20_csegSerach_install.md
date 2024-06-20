+++
title = 'csegSearch Install'
date = 2005-10-20T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

1.- Load your search.aspx with http://server/search.aspx&Mode=Edit?PageView=Shared


2.- Enter in design mode using “Modify Shared Page” menu


3.- Select the csegSearch Webpart and put it on page

![](/images/Sharepoint/csegSearchInstall-1.gif)

4.- Go to the original “Search Results” webpart and modify properties, at the end there is a property called ResultListID, it has a list name, remember the name.

![](/images/Sharepoint/csegSearchInstall-2.gif)


5.- Now delete the original “Search Results”


6.- Edit the csegSearch properties and locate the ResultListID, write the same name that the old webpart.


7.- Add your extended rsults and the colorize color.


8.- Apply changes.


Try to search anything…