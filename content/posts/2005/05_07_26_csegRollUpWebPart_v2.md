+++
title = 'csegRollUp webpart v2'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++


First, once again many thanks to all you for your kind commentaries about csegRollUp.  

Sorry for being so late but I have had a lot of work last days, and nights are so short…

## Fixes

For users with problems in sites with ports diferents to 80, I must say that all tests of this new version have been done with a server installed in the port 1000 and all them have run correctly.

For users with problems as “not in the configuration database”  they are using only wss sites, now csegRollUp runs correctly.

**Remember that the field and list separator is comma ‘,’**

## Installation

First is very important **uninstall** the previous version:

``` 
stsadm -o deletewppack -filename csegRollUp.cab
```

and them install the new one.


## New Features

A new functionality has been added. To use it, please, indicate the name of the lists you want to rollup List,List2,List3 (**a “coma” after every list**) and choose the option “Lists in all subsites”.  
  
The webpart will search these lists in all the subsites of a lower level, and show the results.
  

![](/images/Sharepoint/o_csegRollUp2.jpg)
  

[csegRollUp2.zip (8,03 KB)](https://web.archive.org/web/20160423172711/http://oldblog.ideseg.com/content//csegRollUp2.zip)