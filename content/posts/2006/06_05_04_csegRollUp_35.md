+++
title = 'csegRollUp 3.5'
date = 2006-05-04T00:00:00+01:00
tags = ['sharepoint']
+++

Important NOTE: Only works in WSS2 and SPS2003

Finally is here, many thanks to the people who have tested this version.

From the forums:

"I had rolled back to 3.1a with 22 individual imported spreadsheet lists rolling up to 22 individual web part pages; with 3 additional web part pages rolling up some specified fields from all 22 lists."

ALL 25 Rollups where present, accounted for and functioning as expected under 3.5 FINAL’s smooth control. Very, Very Smooth Transition

Now can rollup with 3.5 Final for the first time again. This is truly a powerful and extremely useful enhancement to SharePoint. Thank You.

There is no new great improvements by compatibility reasons with previous versions, but there are some important changes.

- Now you can use fields that are not in all lists, you can use deferent lists and rollup if this contains the same specified fields.

- There are two new variables for use in the queries

[Now] – Replace with the current date-time in iso 8601 format
[SNow] – Replace with the current date-time in short format

- Now you can use the [CellProvider] variable in the TOP list in properties

- Improved speed

- Now a consumer rollup can get values from multiple cell providers.

- There is a new property called “Retain Values” in order to retain the provider values if other webpart init a postback event

- The multipage interface now uses a postback event better than a query string, now you can put two csegRollUps with multipage on the same web page. Use __doPostBack(”,’Page:X’) where X is the page number.  (the previous system continues working)

- You can select if you want use the MVP.XML for XSLT processing or use the internal NET processor.

csegRollUp35.zip