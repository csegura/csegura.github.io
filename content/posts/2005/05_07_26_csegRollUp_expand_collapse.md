+++
title = 'csegRollUp expand collapse'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++


Some people ask me about samples of transformations, XSL to use with the csegRollUp webpart. First of all, I adopted XSL because it is the best way to customize any webpart.  
 

I’m using mainly XMLSpy in work, but those days in my laptop I’m using too a freeware application to edit XSL called "cooktop" written by Victor Pavlov, it is a xsl, xpath and dtd editor, you can use the XML debug output from csegRollUp and test your XSL.  

If you want share your csegRollUp XSL files, please send me a mail to include it in the csegRollUp weekly sample contest.  

**Of course this week I win.**

```xml	
1: <?xml version=’1.0′ encoding=‘utf-8′?>
2: <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
3:    <xsl:output method="html" />
4:  
5:    <xsl:key name="group-by-site" match="Row" use="_SiteTitle" />
6:  
7:    <xsl:template match="Rows">
8:       <table class="ms-summarycustombody" width="100%">
9:          <tbody>
10:             <xsl:for-each select="Row[count(. | key('group-by-site', _SiteTitle)[1]) = 1]">
11:                <xsl:sort select="_SiteTitle" />
12:  
13:                <tr id="group0">
14:                   <td class="ms-gb" colspan="2">
15:                      <span class="ms-announcementtitle">
16:                         <a href="javascript:" onclick="javascript:ExpGroupBy(this);return false;">
17:                            <img src="/_layouts/images/plus.gif" border="0" />
18:                         </a>
19:  
20:                         <a href="{_SiteUrl}">
21:                            <xsl:value-of select="_SiteTitle" />
22:                         </a>
23:                      </span>
24:                   </td>
25:                </tr>
26:  
27:                <xsl:for-each select="key(‘group-by-site’, _SiteTitle)">
28:                   <tr style="display:none">
29:                      <td class="ms-vb" width="50%" style="padding-bottom: 3px">
30:                         <span class="ms-announcementtitle">
31:                            <a href="{_ItemUrl}">
32:                               <xsl:value-of select="Título" />
33:                            </a>
34:                         </span>
35:                      </td>
36:  
37:                      <td class="ms-vb" width="50%">
38:                         <p align="right">
39:                         (
40:                         <xsl:value-of select="Caduca" />  
41:                         )</p>
42:                      </td>
43:                   </tr>
44:  
45:                   <tr style="display:none">
46:                      <td class="ms-vb" colSpan="2">
47:                         <xsl:value-of select="Texto" disable-output-escaping="yes" />
48:                      </td>
49:                   </tr>
50:                </xsl:for-each>
51:             </xsl:for-each>
52:          </tbody>
53:       </table>
54:    </xsl:template>
55: </xsl:stylesheet>  
```

**Result**


![](/images/Sharepoint/o_csegRollUp-ExCol.jpg)