+++
title = 'csegRollUp aggregate in calendar view'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

First, thanks to all by the comments about RollUp webpart.

Now, do you need a Calendar view with your RollUp events, tasks or any list???

Are you ready?.

You can use the Sharepoint calendar whith csegRollUp it’s easy and you can view the Month view, weekly view or day view whit your aggregated data.
 

Just, a sample of XSL to render.

```xml
<?xml version=’1.0′ encoding=’utf-8′?\>  
<xsl:stylesheet version=“1.0″ xmlns:xsl=“http://www.w3.org/1999/XSL/Transform”\>  
<xsl:output method=“html”/\>  
<xsl:template match=“/”\>  
       <SCRIPT\>  
       var dopt = new DateOptions;       
       dopt.chDateSep = “/”;
       dopt.chTimeSep = “:”;
       dopt.SetTimeFormat(1);
       dopt.SetDateOrder(1);
       dopt.SetDOW(0);
       dopt.webTZOffsetMin = -60;       
       var cal = new Calendar(null, null, dopt);
       var rgIcons = new Array;    
       rgIcons\[0\] = “\\u003cIMG border=0 width=16 height=16 title=\\u0022\\u0022 SRC=\\u0022/\_layouts/images/blank.gif\\u0022\\u003e”;    
       rgIcons\[1\] = “\\u003cIMG alt=\\u0022\\u0022 border=0 width=16 height=16 SRC=\\u0022http://srvsp/\_layouts/images/blank.gif\\u0022″;
       <xsl:for-each select=“Rows/Row”\>  
             <xsl:variable name=‘datetime’ select=‘Caduca’ /\>  
             <xsl:variable name=‘year’  select=‘substring( $datetime, 7 , 4 )’ /\>  
             <xsl:variable name=‘month’ select=‘substring( $datetime, 4 , 2 )’ /\>  
             <xsl:variable name=‘day’   select=‘substring( $datetime, 1 , 2 )’ /\>  
             <xsl:variable name=‘hour’  select=‘substring( $datetime, 1 , 1 )’ /\>  
             <xsl:variable name=‘minute’ select=‘substring( $datetime, 4 , 2 )’ /\>  
             <xsl:variable name=‘second’ select=‘substring( $datetime, 7 , 2 )’ /\>  
             <xsl:variable name=‘spdate’ select=“concat($year, ‘-’, $month, ‘-’, $day, ‘T0′, $hour, ‘:’, $minute, ‘:’, $second, ‘Z’ )” /\>
             cal.AddFullEvent(“<xsl:value-of select=‘$spdate’ /\>“,  
                              ”<xsl:value-of select=‘$spdate’/\>“,                                          
                              ”<xsl:value-of select=“Texto”/\>“,
                              ”<xsl:value-of select=“Título”/\>“,
                              ”<xsl:value-of select=“\_ItemUrl”/\>“,
                              rgIcons);          
        </xsl:for-each\>  
        cal.BuildUI();        
    </SCRIPT\>     
    </xsl:template\>  
</xsl:stylesheet\>
```

## Result Screenshots  

![](/images/Sharepoint/o_csegRollUp-cal1.gif) 

![](/images/Sharepoint/o_csegRollUp-cal2.gif)

You can use DateOptions CalendarPeriod to set the default view, modify the xsl with :

 
```
dopt.CalendarPeriod = “month” / “week” / “day”
```

The ows.js CalAddFullEvent format is :

``` 
CalAddFullEvent(stDateStart, stDateEnd, stLocation, stDesc, stTitle, stURL, rgIcons)
```