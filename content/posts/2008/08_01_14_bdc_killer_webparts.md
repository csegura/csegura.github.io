+++
title = 'BDC Killer WebParts'
date = 2008-01-14T00:00:00+01:00
tags = ['sharepoint', 'webparts','bdc']
+++


Data integration from an outside source into SharePoint, was one of the most wished characteristics that the SharePoint 2003 users were waiting for.

When Microsoft announced the **Business Data Catalog**, in Microsoft Office SharePoint 2007 we all were expecting the possibility of modifying our data, but it never happened, and by the moment the BDC remains as read-only.

On the other hand, the complexity of defining the BDC interface has always been an important barrier, so that a certain number of applications have arose to help us to define these interfaces.

  
-   [BDC Metaman](https://web.archive.org/web/20130623130533/http://www.bdcmetaman.com/) from [Lightning Tools Ltd](https://web.archive.org/web/20130623130533/http://www.lightningtools.com/)  
    
-   [MOSS BDC Design Studio](https://web.archive.org/web/20130623130533/http://www.simego.com/MOSS_BDC_Design_Studio.aspx) from Simego  
    
-   and finally Microsoft published an utility in the SDK of MOSS, namely the BDC editor


[SPSProfessional](https://web.archive.org/web/20130623130533/http://www.spsprofessional.com/) it’s working on a set of WebParts  with which we can edit data bases ( for the present only SQL 2005) in just a few minutes. Furthermore these WebParts are working in both **MOSS 2007** and **WSS3**. They are namely **ActionDataBase** WebParts …


**Let us take a quick view**

Trough a little win form application **ActionDataBase Generator**, and introducing a simple Select query of SQL the necessary XML to configurate the **ActionDataBaseGrid** is generated to recover data from SQL Server and show them into SharePoint.

  
We can define a simple data view as it in less than one minute.

![](/images/Sharepoint/ADB_Grid.gif)


Using the same utility we can get further, there _**where BDC is not able to arrive**_. So simple as indicating a table and the ActionDataBase Generator will generate XML to form another of its powerful WebParts, the **ActionDataBaseEditor**. A fully CRUD WebPart for our table.

Through it we could edit online our database.

![](/images/Sharepoint/ADEditor2.gif)


Don´t frighten, it takes just a couple of minutes.

And the ActionDataBase WebParts has other greats features as:
  
-   Fully customizable Tool Bar  
-   Lookup fields  
-   Date and DateTime fields controls      
-   Fields validations (Required, Range, Regular Expression, Comparison)  
-   Rich Text format fields  
-   Filter data

**So simple, so marvellous.**

You can read more on [http://www.spsprofessional.com/](https://web.archive.org/web/20130623130533/http://www.spsprofessional.com/)