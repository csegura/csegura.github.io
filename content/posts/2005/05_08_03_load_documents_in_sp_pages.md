+++
title = 'Load documents in SharePoint pages'
date = 2005-08-03T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

SharePoint - Loading html documents inside of sharepoint pages
One of the problems that I have been is when I have html documents in a document library and show this in a webpart page with the webcontent webpart. (I’m using the csegContent webpart that gets a querystring)

Sharepoint index them and after when you search, the query results show a link to them but when you load the document the context is missing, you have a window with the complete page without menu, quicklaunch etc…

![](/images/Sharepoint/iframeload.gif)

To solve this problem, you need add a small piece of code (javascript) in your html documents.

```html
<script type="text/javascript">
if (self == top) {
  topUrl = 'sites/pruebas';
  posUrl = location.href.lastIndexOf(topUrl);
  qs = location.href.lastIndexOf('?');
  if (qs < 0) {
      qs = location.href.length;
  }
  newUrl = location.href.substring(posUrl+1+topUrl.length,qs);
  window.location.href = topUrl+’/default.aspx?Load='+encodeURI(newUrl);
} 
</script>
```

This script checks if the page is the main in the page, if this is true, the document navigate to the correct context.

The topUrl variable has the site where the page is stored.
In the window.location.href you can put the name of the sharepoint page with the query string.

Also you can do it with a iframe using a second script stored in the sharepoint page (example in default.aspx)

First put an iframe in your webpart page.

```html
<iframe frameBorder="0" onload=”iframeOnLoad();” id="miIframe" name="miIframe" width="100%" height="100%" src=" ">
</iframe>
```

And this script in the same page.

```html
<script type="text/javascript">
function iframeOnLoad()
{
  var params = window.location.search.substring(1).split("=");
  if (params[1]!=null && document.getElementById("miIframe").src != params[1]) {
     document.getElementById("miIframe").src = params[1];
  }
} 
<script>
```

This second script gets the query string on the main page and load the content in the iframe.
Now try to search the .html and see that happend.