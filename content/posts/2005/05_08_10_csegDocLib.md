+++
title = 'csegDocLib'
date = 2005-08-10T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

## Introducing csegDocLibTools

The past week, looking how to show the missing folder view in document libraries, I had a good idea about how to improve my documents libraries, in this moment I had a clear idea over three things:  
  
**First** I needed Copy and Paste documents in the library, because this is an essential feature to organize the library. There is a good solution to do from Syntergy, they have a cut and pase webpart.  
  
**Second**, I needed a folder explorer view, to navigate and view the folder hierarchy (too many years seeing it). There are some free solutions the [Renaud Comte treeview webpart](https://web.archive.org/web/20130405074618/http://blog.spsclerics.com/archive/2005/08/09/9449.aspx) is a great solution.

**Third**, I need a simple interface and installation to add this to a document library that it already exists and integrated with the cut and paste options.

This weekend and some nights this week, I have a new webpart “**csegDocLibTools**”.


## Cut and Paste features

This first feature, is needed, of course documents and folders with your structure and with your metadata. Also I need copy and paste from a document library to another document library (in the same site). By example copy final documents to a new library.

![](/images/SharePoint/csegDocLibCutAndPasteIdea.gif)
![](/images/SharePoint/csegDocLibCutAndPasteFinal.gif)

## Explorer view

I need a better explorer view than “folders.aspx”  (that in addition this link not exist in document libraries). But an explorer view from root folder in document libraries with many folders can be slow and large to show. And if my explorer view is in a diferent page I lose the context about what I am doing.

![](/images/SharePoint/csegDocLibTreeIdea.gif)
![](/images/SharePoint/csegDocLibTreeFinal1.gif)

## Interface & Installation  

The interface as it is seen, is important when I think in a new application I always use pencil and paper to draw my screens think in the possible problems etc… It is easy to do in the house kitchen.

Them I think in problems as  If I have a context menu with cut and paste, and I copy a file go to an empty folder and oops how I can paste this if I don´t have a context menu… (thanks to [Mark Kruger](https://web.archive.org/web/20130405074618/http://www.sharepointblogs.com/mkruger) by your first discarded solution, now your sugerence is the final solution)

Some decissions about design are personal decissions, but always we can discuss them. (Everything except the small context menu inside of the document library toolbar that it is fantastic).


![](/images/Sharepoint/csegDocLibToolBarFinal.gif)


About of installation, it would be easy, and what better than a invisible webpart that you can put it in the page.
