+++
title = 'SharePoint on PocketPC'
date = 2005-04-27T00:00:00+01:00
tags = ['sharepoint', 'pocketpc']
draft = false
+++

## Sharepoint – PocketPc sharepoint list Explorer

I am doing a Pocket PC application to show in the today screen the list content of some lists of my sharepoint server and update it each x minuts.  
  
Before beginning the development I have made a small example that is interesting similarity to me to place here with the source code since it can be interesant for other developers.
 
This simple application, needs the user credentials and the direction of the web service to use, shows all lists available and later it shows the content of the list selected in a datagrid.

![](/images/Sharepoint/r_ppc-le-login.gif)   
![](/images/Sharepoint/r_ppc-le-lists.gif)

![](/images/Sharepoint/r_ppc-le-data.gif) 
![](/images/Sharepoint/r_ppc-le-debug.gif)

  
The debug screen show the web service response. In the sample screenshots I’m using the Ian Morrish [wss demo site](https://web.archive.org/web/20160423192342/http://www.wssdemo.com/) (it’s a public site) and no need credentials.

  
[ppc-sp.zip (52,98 KB)](https://web.archive.org/web/20160423192342/http://oldblog.ideseg.com/content//ppc-sp.zip)  
  
Update Opps:   
– Missing ListExplorer.resx (fixed)  
– Now, is not necessary to add /\_ vti\_bin/lists.asmx