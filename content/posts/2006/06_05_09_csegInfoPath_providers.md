+++
title = 'csegInfoPath providers'
date = 2006-05-09T00:00:00+01:00
tags = ['sharepoint']
+++

You can use now the row provider to select the infopath form (rememeber that the view need contains the ID field).
The problems rendering fields with special characters is now solved.
Also I added a cell consumer interface to get the ID from other webpart as csegRollUp 

![](/images/Sharepoint/csegInfoPathViewerF2.gif)


In the properties you need add the XSL (see previous version) and the name of the form library.


![](/images/Sharepoint/csegInfoPathViewerF1.gif)

If you can´t display the infopath form, check if  you can get the XML from the server using the form Url. Some users are using a WSS environment where they don´t use DNS to resolve the url where WSS is located, they are using an entry in the hosts file. In this case the server can´t resolve the Url where the form is located. To solve this issue you can add the host name in the hosts file of your server.

csegInfoPathViewer12.zip (15,11 KB)