+++
title = 'SPQuery and Recurrence'
date = 2005-11-02T00:00:00+01:00
tags = ['sharepoint']
+++

This last long weekend I’m playing with spqery to show recurrent events from one of my lists after spent too many hours and the only think I have got are frustrations.

The query.ViewAttributes, with RecurrenceRowset=’TRUE’ or with ModerationType=’Moderator’ modifiers are ignored totally.

My sample query for recurrence without results :  (RecurrenceRowset=’TRUE’)


```xml
<Where>
  <DateRangesOverlap>
    <FieldRef Name=”EventDate” />
    <FieldRef Name=”EndDate” />
    <FieldRef Name=”RecurrenceID” />
    <Value Type=”DateTime”>
      <Now />
    </Value>
  </DateRangesOverlap>
</Where>
``

Today trying get the pending documents: (ModerationType=’Moderator’)

```xml	
<Where>
  <Eq>
    <FieldRef Name=”_ModerationStatus” />
    <Value Type=”Integer”>0</Value>
  </Eq>
</Where>
```

After read the wsssdk, there is only a example with “ModerationType” is in “SPModerationInformation” class


```csharp
  if (!docLibrary.IsCatalog && docLibrary.EnableModeration == true)
  {
     SPQuery allItemsQuery = new SPQuery();
   
     allItemsQuery.ViewAttributes = “ModerationType=’Moderator’”;
   
     SPListItemCollection docLibItems = docLibrary.GetItems(allItemsQuery);
   
     foreach (SPListItem docLibItem in docLibItems)
       {
           if (docLibItem.ModerationInformation.Status == SPModerationStatusType.Pending)
           {
               Response.Write(site.Url + “/” + docLibItem.File.Url);
           }
       }
    }
```

In the sdk help the entry “View Element” dont refer to ModerationType, but this has at least reference to “RecurrentRowset“. At the moment I think that the two cases require hand prog, the first one using a parser to get data from “RecurrenceData” and the second one at is said the sdk example.

Update: Thanks to Stephen Muller tip in “Using the _ModerationStatus field in CAML” of course for Spanish is Aprobado, Pendiente and Denegado.