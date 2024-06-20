+++
title = 'csegRollUp to support pages'
date = 2005-08-03T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

Yesterday looking a XML editor to edit complex xml files that I have in a Project that E&Y did in my company, I downloaded a trial version from  [Stylus Studio **XML** IDE](https://web.archive.org/web/20080613230259/http://www.ideseg.com/ct.ashx?id=d0576f81-0201-43f7-a89b-a56738e28f14&url=http%3a%2f%2fwww.stylusstudio.com%2findex.html) and I’m really surprised.  We could make a hard work in minutes. (Edit the data in a grid, sort the grid by levels and sublevels  etc...)  
  
Normally I dont need tools like this for my diary work but I am considering this for my personal use (home edition is only 49$.)  
  
Later in house, I was testing the Stylus Studio WYSIWYG, with an xsl that I was using with the csegRollUp webart, and in the midnight I added a new feature to csegRollUp webpart and also fixed a little problem.  
  
The new feature is that you can use two params in the xslt file to make the webpart pageable.

```xml
<font face="Lucida Console">
	<span class="lnum">
		<font color="#606060" size="2">4:  </font>
	</span>
	<font size="2">
		<span class="kwrd">
			<font color="#0000ff">&lt;</font>
		</span>
		<span class="html">
			<font color="#800000">xsl:param</font>
		</span>
		<span class="attr">
			<font color="#ff0000">name</font>
		</span>
		<span class="kwrd">
			<font color="#0000ff">="CurrentPage"</font>
		</span>
	</font>
	<span class="kwrd">
		<font color="#0000ff" size="2">/&gt;
			<br>
			</font>
		</span>
	</font>
	<font face="Lucida Console">
		<span class="lnum">
			<font color="#606060" size="2">5:  </font>
		</span>
		<font size="2">
			<span class="kwrd">
				<font color="#0000ff">&lt;</font>
			</span>
			<span class="html">
				<font color="#800000">xsl:param</font>
			</span>
			<span class="attr">
				<font color="#ff0000">name</font>
			</span>
			<span class="kwrd">
				<font color="#0000ff">="RecordCount"</font>
			</span>
		</font>
		<span class="kwrd">
			<font color="#0000ff" size="2">/&gt;</font>
		</span>
	</font>
```

Then you can write a simple xsl with Previous and Next Page, that shows like this...

![](/images/Sharepoint/csegRollUp-pageable1.gif)

The querystring parameter is always "page" and at the moment you can use only a pageable csegRollUp per page.

I fixup an error when a list field has a null value the xml generated omit the label now the label is generated.

Now included in the zip file there are some xslt samples (see previous posts), and a new one called page-sample.xsl this is  the one of the top image (this sample use the contacts lists)

[Download csegRollUp2.zip (11,28 KB)](https://web.archive.org/web/20080613230259/http://www.ideseg.com/ct.ashx?id=d0576f81-0201-43f7-a89b-a56738e28f14&url=http%3a%2f%2fwww.ideseg.com%2fcontent%2fbinary%2fcsegRollUp2.zip)