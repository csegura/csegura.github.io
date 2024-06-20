+++
title = 'Format vs Concat'
date = 2008-05-14T00:00:00+01:00
tags = ['c#']
+++

Esto post es para recordar simplemente que concatenar cadenas con String.Format es una mala práctica y para eso tenemos ese gran olvidado que es String.Concat.

Y como muestra un ejemplo…

![](/images/Sharepoint/FormatVsConcat.gif)

```csharp
public void Format()
{
    for (int i = 0; i < 1000; i++)
    {
        String.Format("{0},{1}", "Test", "Test");
    }
}
 
public void Concat()
{
    for (int i = 0; i < 1000; i++)
    {
        String.Concat("Test",",", "Test");
    }
}
```