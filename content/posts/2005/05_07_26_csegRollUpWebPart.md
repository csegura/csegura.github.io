+++
title = 'csegRollUp webpart'
date = 2005-07-26T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++


This is my new webpart, that I have worked in order to solve a common problem. The Rollup for Sharepoint lists.

With this webpart you can rollup any list in any site, you can get data from different lists (Tasks, Announcements, your customs lists)

The Webpart check the security so that if a user does not have access to a site or a list these data will not appear.

Webpart gathers data from the specified lists and join it in a common xml that later will render it using xsl.

**Webpart properties**
 
- Lists
- List of comma delimited values that signify the sites and lists  
- Format: /site/subsite:ListName, /site/subsite/subsite:ListName
- Fields
- List of comma delimited values with the field names  
- Format: Title,Text,Comment,User  
- All the fields must exist in all the lists. You can put different lists but the fields must exist. 
- XSL
- XSL to render the result
- Debug XML - If checked you can view the collected xml data
  

![](/images/Sharepoint/o_csegRollUp-1.gif)
  

## Sample XML

```  
<?xml version="1.0" encoding="utf-8" ?\>  
<Rows\>  
   <Row\>  
     <\_ListTitle/\>  
     <\_ListUrl/\>     <!– Url to default view –\>  
     <\_SiteTitle/\>  
     <\_SiteUrl/\>     <!– Url to site –\>  
     <\_ItemID/\>  
     <\_ItemUrl/\>     <!– Url to list item view –\>  
     <Field/\>        <!– Each one of the specified fields –\>   
   </Row\>  
</Rows\>
```

## XML debug output

![](/images/Sharepoint/o_csegRollUp-2a.gif)

## Results once applied the xsl


![](/images/Sharepoint/o_csegRollUp-3.gif)

## The XSL used in the sample  


```
<?xml version='1.0' encoding='utf-8'?\>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"\>
	<xsl:output method="html"/\>
    <xsl:template match="/"\>
        <table class="ms-summarycustombody"\>
            <tbody\>
                <xsl:for-each select="Rows/Row"\>
                    <xsl:sort select="\_SiteTitle"/\>
                        <tr\>
                <td class="ms-vb" width="50%" style="padding-bottom: 3px"\>
                    <span class="ms-announcementtitle"\>
                        <a href="{\_ItemUrl}"\>
                            <xsl:value-of select="Título"/\>
                            </a\>
                        </span\>
                    </td\>
                <td width="50%"\>
                    <p align="right"\>
                        <a href="{\_SiteUrl}"\>
                            <xsl:value-of select="\_SiteTitle"/\>
                            </a\> (                     
                            <xsl:value-of select="Caduca"/\>)                    
                            </p\>
                        </td\>
                    </tr\>
                    <tr\>
                        <td class="ms-vb" colSpan="2"\>
                            <xsl:value-of select="Texto" disable-output-escaping="yes"/\>
                        </td\>
                    </tr\>
                </xsl:for-each\>
            </tbody\>
        </table\>
    </xsl:template\>
</xsl:stylesheet\>
```                        
  

**[UPDATED New Version 2](https://web.archive.org/web/20130908221053/http://www.ideseg.com/SharePointCsegRollUpVersion2.aspx)**