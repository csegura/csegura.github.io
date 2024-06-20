+++
title = 'Cseg InfoPath Viewer'
date = 2006-04-07T00:00:00+01:00
tags = ['sharepoint']
+++

Finally I have a first version (0.99) of my InfoPath viewer, first I want give thanks to my friend Gustavo, for testing the preliminary version and to make as always good suggestions.


## Installation


`stsadm -o addwppack -filename csegInfopathWebPart.cab -globalinstall  (use -force if you have installed the preliminary version)`


Use

a) Create a view in your Form Library webpart containing the identifier of the list (the ID field).
b) Create a new webpart page, and insert the FormLibrary webpart and csegInfoPath webpart.
c) In the FormLibrary webpart select the view that contains the ID field, you need this view to connect with csegRollUp.
d) In the FormLibrary webpart menu select, “Conections” -> “Send row to” -> “csegInfoPathViewer” when prompt for field use the ID field.
e) Now fill the csegInfoPathViewer properties, you need specify the form library list name in the “List Name” field and put the XSL in the field XSL. (You can extract it from the infopath solution file, rename it as a .cab file and extract the xsl, then copy the content into the xsl property)
f) Now select an item and you can view the form in the csegInfoPathViewer.

![](/images/Sharepoint/csegInfoPathViewer.jpg)