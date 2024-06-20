+++
title = 'csegRollUp v3'
date = 2005-10-27T00:00:00+01:00
tags = ['sharepoint', 'webpart']
+++

## csegRollUp v3

- Include List Data flag, if you enable the checkbox the xml data will include the underscore data 

(_ListTitle, _ListUrl, _SiteTitle, _SiteUrl, _ItemId, _ItemUrl, _ItemEdit)

- Queries

    -  CAML Query you can use a caml query to search on each list.
    -  RowLimit – maximun number of rows to return
    -  Recursive - the query recursive be made (great for Document Libraries)
    -  DebugQuery – show the xml from the query


   Special values that you can use on queries:


    [Login] – the logged user
    [UserName] – the complete user name
    [UserID] – the user ID
    [Now] – the current date and time
    [Now+x] – the current date and time + x days
    [Now-x] – the current date and time  – x days


  example:

```xml
<query>
   <Where>
      <And>
         <Eq>
            <FieldRef Name=”Author” />
 
            <Value Type=”Text”>[UserName]</Value>
         </Eq>
 
           <Eq>
              <FieldRef Name=”Modified” />
              <Value Type=”DateTime”>[Now-30]</Value>
           </Eq>
        </And>
     </Where>
   
     <OrderBy>
        <FieldRef Name=”Modified” Ascending=”False” />
     </OrderBy>
</query>
```

(Note, you need put all fields thats are on query in the fields property).


- CellConsumer interface, you can use an special value in queries called [CellProvider] this value is replaced with the cell value provide from other webpart.


Sample (conected to a document library)


```xml
<Where>
    <Contains>
        <FieldRef Name=’FileRef’/>
        <Value Type=’Text’>[CellProvider]</Value>
    </Contains>
</Where>
```

- CellProvider interface, you can provide a value to another webpart, any value that you wants, when rendering the xsl, you can add a `__doPostBack(”,’Value’)` to provide values.

example:

```xml	
<a href=”javascript:__doPostBack(”,’{@Name}’)”>
  <xsl:value-of select=”_SiteTitle”/>
</a>
```

I have a Release Candidate version if somebody wants test it, please comment this post, thanks.