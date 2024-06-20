+++
title = 'Multiple Templates'
date = 2005-11-24T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

I have a site with some document libraries to store documentation based in multiple templates, to save each template in the correct folder, I have created a custom list thats contains the name of the template, the template and the folder where documents created with this tempalte must be stored.

Name – text – Template name

Template – hyperlink – The link to the template file

Folder – text – Folder where  the document must be stored (site based path)

In the site main page I have a custom view (frontpage data viewer) of the list, that I have modified to open the template with a link and at the same time redirect this to the correct folder. The result is impressive. Now I can use so many templates and libraries as I want. The modified part of dvwp

```html
<TD Class="{$IDARYQJD}">
 <xsl:variable name="Field" select="@Template"/>
 <xsl:choose>
    <xsl:when test="substring-before(@Template, ', ')=">
       <xsl:value-of select="substring-after(@Template, ', ')"/>
    </xsl:when>
    <xsl:otherwise>
       <A HREF="{@Folder}" onclick="OpenTemplateInFolder('{substring-before(@Template, ', ')}’,'{@Folder}’);">
          <xsl:choose>
             <xsl:when test="substring-after(@Template, ', ')=">
                <xsl:value-of disable-output-escaping="no" select="substring-before(@Template, ', ')"/>
             </xsl:when>
             <xsl:otherwise>
                <xsl:value-of select="substring-after(@Template, ', ')"/>
             </xsl:otherwise>
          </xsl:choose>
       </A>
    </xsl:otherwise>
 </xsl:choose>
</TD>
```

At the end of page I have introduced this small script thats get the template full path and the save path, I’m getting the path of site from context (ctx) and using the createNewDocumentWithProgId from ows.js.


```html
<script>
function OpenTemplateInFolder(sTemplateWithFullPath,sSavePath)
{
    sTemplate = unescapeProperly(sTemplateWithFullPath);
    sSave = unescapeProperlyInternal(ctx.HttpRoot+'/’+sSavePath);
    createNewDocumentWithProgID(sTemplate, sSave, 'SharePoint.OpenDocuments’, false);
}
</script>
```