+++
title = 'Virtualizando'
date = 2007-05-20T00:00:00+02:00
tags = ['vmware']
+++

No me he podido aguantar, el viernes pasado mientras explicaba cómo realizar una extranet con SharePoint, estábamos trabajando con todos los equipos de producción virtualizados con [**VMWare ESX**](https://web.archive.org/web/20130623103246/http://www.vmware.com/products/vi/esx/).  
  
Realmente me quede impresionado con el rendimiento, y las capacidades del ESX. Así que ayer sábado mientras ordenaba mi despacho, me baje el ESX y la licencia de demo de la página de [**VMWare**](https://web.archive.org/web/20130623103246/http://www.vmware.com/).  
  
Lo instalé en apenas 15 minutos en un HP Proliant ML350 g4p con un Xeon a 3Ghz, 2Gb de Ram, y 3x72Gb en RAID 5, es un servidor que utilizo para pruebas y en donde tenía ahora algunas máquinas virtuales con VMWare Server.  

![](/images/Sharepoint/vmware_esx_6.gif)

Las máquinas virtuales que tenía las convertí con el [**VMWare converter**](https://web.archive.org/web/20130623103246/http://www.vmware.com/products/converter/), una vez convertidas las pasa él solito al ESX. Pasé las 4 máquinas virtuales, de mi banco de pruebas, las cuales no suelo ejecutar a la vez porque el  rendimiento es penoso.  
  
- Isrv – Active directory + sql server 2005  
- Imoss – Microsoft Office SharePoint Server 2007  
- Icrm – Microsoft CRM  
- Imail – Microsoft Exchange  
  
Y ya que estábamos, también pase algunas de mis máquinas que tengo en Microsoft Virtual Server, más que nada por ver el impacto que tenía una posible conversión.  
  
![](/images/Sharepoint/vmware_esx_9.gif)  
  
La conversión le ha costado desde 45 minutos a una hora y media, dependiendo de la máquina y del  tamaño de los discos.

![](/images/Sharepoint/vmware_esx_2.gif)

Una vez realizada he metido las 4 primeras, les he asignado un pool  garantizando 500mhz y 512mb de ram, y las he arrancado todas.  
  
Después de trastear un buen rato, me he quedado impresionado con el rendimiento.  
  
De modo que he añadido el resto de las máquinas que he pasado desde el Virtual Server y en este momento tengo 6 máquinas  funcionando con un rendimiento un poco justo pero funcionando.

![](/images/Sharepoint/vmware_esx_7.gif)

Evidentemente  un segundo procesador ayudaría y desde luego más RAM. Entre las grandes ventajas de EXS es que el automáticamente redistribuye los recursos del host (RAM y CPU) entre las distintas máquinas virtuales.

![](/images/Sharepoint/vmware_esx_10.gif)

![](/images/Sharepoint/vmware_esx_11.gif)

Me queda por probar las copias de seguridad de las máquinas virtuales, que me gustaría hacer esta semana, porque visto el precio que tiene la licencia es probable que finalmente adquiera uno para el datacenter del trabajo.