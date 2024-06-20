+++
title = 'Tree Explorer WebPart'
date = 2007-03-07T00:00:00+01:00
tags = ['sharepoint', 'webparts']
+++


Este es un pequeño webpart, a su vez un clásico pero muy útil webpart, que nos permitirá recorrer la estructura de carpetas de una biblioteca de documentos. Por supuesto es para WSS3 y MOSS 2007

![](/images/Sharepoint/TreeExplorer_v1.gif)

¿Por cierto alguien se ha fijado en este botón que ha desaparecido en WSS3 ?

WSS2

![](/images/Sharepoint/ListView_wss2_up.gif)

WSS3

![](/images/Sharepoint/ListView_wss3_noup2.gif)

La verdad es que aún siendo un simple history.back() era un botón muy útil.

![](/images/Sharepoint/save_16.gif) [IdeSeg.SharePoint.WebParts.TreeExplorer.zip (9,19 KB)](https://web.archive.org/web/20130623110633/http://oldblog.ideseg.com/content//IdeSeg.SharePoint.WebParts.TreeExplorer.zip)


Para instalarlo, descomprimir el zip

  

stsadm -o addwppack -filename IdeSeg.SharePoint.WebParts.TreeExplorer.cab -globalinstall  
iisreset  
  
