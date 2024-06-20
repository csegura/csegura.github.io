+++
title = 'csegRollup hide expired items'
date = 2008-05-31T00:00:00+01:00
tags = ['sharepoint', 'webparts', 'spsrollup']
+++

You can add a simple CAML query in order to hide the expired elements.

Use:

```xml
<Where>
  <Geq>
    <FieldRef Name=”Expires” />
    <Value Type=”DateTime”>
      <Today />
    </Value>
  </Geq>
</Where>
```	

This query show only items which Expiration date is greater or equal than today date.

If you want use also the hour, you can use

```xml	
<Where> 
  <Geq> 
    <FieldRef Name=”Expires” /> 
    <Value Type=”DateTime” IncludeTimeValue=”TRUE”> 
      <Today /> 
    </Value> 
  </Geq> 
</Where>
```