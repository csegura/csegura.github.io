+++
title = 'Rollup a sorted table'
date = 2008-05-28T00:00:00+01:00
tags = ['sharepoint', 'webparts', 'rollup']
+++

This is a small trick to show the entries classic list in months and years that can be found in blogs.

![](/images/Sharepoint/SPSRollUp_Tip1.gif)

To produce a data input such as this one we must count the number of entries occurred in a given month and year.

This is a complex result from the point of view of an XSLT transformation, but here we will see how we can use JavaScript alongside with our transformation to produce the necessary results.

Basically what we are going to do is to make a simple query on a list and let JavaScript do the hard work.

We are going to use a list containing a type date field.

In SPSRollUp webpart properties, we will point out the list and the date field from which we want to extract the data.

And in the XSL we will add the following code that it will be in charge of adding elements to an array and counting their appearances. Later this array will put itself in order and finally it will show itself.

The XML code is as follows.

```xml	
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:sps="http://schemas.spsprofessional.com/WebParts/SPSXSLT" 
                exclude-result-prefixes="sps">
  <xsl:output method="html" indent="yes" />
  <!-- Main Template -->
  <xsl:template match="Rows">
    <script>
    <![CDATA[
    // Month Year Array
    var MY = new Array();
    // Month Names
    var monthNames=new Array("January",
                             "February",
                             "March",
                             "April",
                             "May",
                             "June",
                             "July",
                             "August",
                             "September",
                             "October",
                             "November",
                             "December");
    var sYear;
    var sMonth;
    ]]>
    <xsl:for-each select="Row">
      MYAdd(<xsl:value-of 
                 select="sps:FormatDateTime(Created,'yyyy')" />,<xsl:value-of 
                 select="sps:FormatDateTime(Created,'MM')" />);
    </xsl:for-each>
    <![CDATA[
    // Sort the array
    MY.sort(sortYear);

    // Render
    for(var y=0;y<MY.length;y++)
    {
      sYear = MY[y][0]; 
      for(var m=11;m>=0;m--)
      {
        sMonth = monthNames[m];
        if (MY[y][1][m]!=null)
          document.writeln(sMonth+" "+sYear+" ("+MY[y][1][m]+")<br/>");
      }
    }

    // MYAdd<
    // MY - Array of years
    //    - each element contains the year and 
    //      an array of Months (counters)
    function MYAdd(year, month)
    {
      var iY = searchYear(year);
      
      if (iY >= 0)
      {
         if (MY[iY][1][month-1] != null)
         {
             MY[iY][1][month-1] += 1;
         }
         else
         {
             MY[iY][1][month-1] = 1;
         }      
      }
      else
      {
        MY.push(new Array(year,new Array(12)));   
        MY[MY.length-1][1][month-1] = 1;    
      }
    }

    // Search a year in the array
    function searchYear(year)
    {
       for(var y=0;y<MY.length;y++)
       {
          if (MY[y][0]==year)
          {
            return y;
          }
       }
       return -1;
    }

    // Sort the years in array 
    function sortYear(a, b)
    {   
       return b[0]-a[0];
    }
    ]]>
    </script>
  </xsl:template>
</xsl:stylesheet>
```	