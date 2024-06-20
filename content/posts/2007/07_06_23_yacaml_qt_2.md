+++
title = 'Yet Another Caml Query Tool 2'
date = 2007-06-23T00:00:00+02:00
tags = ['sharepoint', 'caml', 'tools']
+++

Continuing with the YACAMLQT, I have finished the first version. Now the “toy” tool supports, “group by” and “order by”, and some expression errors are now fixed. In order to not increase the complexity of the lexer part, the clause “group by” must be write like “groupby” and the “order by” clause as “orderby”.

To support this new clauses the first expression must begin with a “where” clause. The syntax is:

\[**WHERE** boolean\_expression\] \[**GROUPBY** field\_list\] \[**ORDERBY** field\_list\]

A **CAML** complex query written in sql mode can look as:

**WHERE** ((Column1 = “Value1″) **AND** (Column2 = “Value2″)) **OR** ((Column3 = 10)  
**AND** (Column3 <> NULL)) **GROUPBY** Column1 **ORDERBY** Column1, Column2 **ASC**, Column3 **DESC**

Also, you can use ==  for equal and != for not equal  and && for and, or, || for or (it’s a c# goodie)

The CAML result code

```xml
<Query>
  <Where>
    <Or>
      <And>
        <Eq>
          <FieldRef Name="Column1" />
          <Value Type="Text">Value1</Value>
        </Eq>
        <Eq>
          <FieldRef Name="Column2" />
          <Value Type="Text">Value2</Value>
        </Eq>
      </And>
      <And>
        <Eq>
          <FieldRef Name="Column3" />
          <Value Type="Integer">10</Value>
        </Eq>
        <IsNotNull>
          <FieldRef Name="Column3" />
        </IsNotNull>
      </And>
    </Or>
  </Where>
  <GroupBy>
    <FieldRef Name="Column1" />
  </GroupBy>
  <OrderBy>
    <FieldRef Name="Column1" />
    <FieldRef Name="Column2" Ascending="True" />
    <FieldRef Name="Column3" Ascending="False" />
  </OrderBy>
</Query>
```

Also you can add the assembly (**IdeSeg.SharePoint.Caml.QueryParse)** in your projects

```csharp
using IdeSeg.SharePoint.Caml.ParseQuery;
 
string query = "where Campo1=10 && campo2=\"Test\" and campo3=#01/01/2007# order Campo3";
try
{
    string xmlQuery = CAMLParser.Query(query);        
}
catch (ParserException ex)
{
    statusError = ex.Message;
}       
```

Internally the code use a Parser to generate an AST and a Lexer to scan the query, they do the hard work you can see the UML class diagrams below: 

![](/images/Sharepoint/YACAMLQT2_1.gif)

![](/images/Sharepoint/YACAMLQT2_1a.gif)

Finally in the winforms application there is also a c# generator to do copy and paste. **Enjoy!!!!!**

![](/images/Sharepoint/YACAMLQT2_2.gif)

![](/images/Sharepoint/save_16.gif) [**YACAMLQT.zip  
**](https://web.archive.org/web/20130623174220/http://oldblog.ideseg.com/content//YACAMLQT.zip)