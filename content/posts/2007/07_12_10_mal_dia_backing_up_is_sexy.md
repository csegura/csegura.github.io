+++
title = 'Mal día: Backing up is sexy'
date = 2007-12-10T00:00:00+01:00
tags = ['misc', 'backup']
+++


Buff, un mes sin escribir nada. La verdad es que le mes pasado ha sido terriblemente duro, en cuanto a trabajo se refiere, además de las dos semanas que me he pasado por el sur de España Sevilla, Córdoba, Málaga y  por Madrid, después a mi regreso me he encontrado con algún que otro desastre y un montón de trabajo acumulado.

**Mal día….**

El caso es que el viernes por la noche mientras realizaba copias de seguridad de mi portátil, (je, hace un par de días volví a ver el episodio de “Sexo en New York” -Sex and the city- [My Motherboard My shelf](https://web.archive.org/web/20130623113708/http://www.hbo.com/city/episode/season4/episode56.shtml))

![](/images/Sharepoint/SexInTheCity56.gif)

“Always backup and keep it remote – no matter how lucky you feel! And yes – backing up is sexy!”

Me he desesperado con Windows Vista, y la velocidad de copiado de archivos en red. (Y eso que tengo el SP1 RC)

Tras pasar un buen rato el sábado por la mañana buscando por internet, me he encontrado con algunas cosas interesantes como

[http://www.technoblogo.com/2007/02/12/Windows+Vista+Tip+3++Slow+Network+Issues.aspx](https://web.archive.org/web/20130623113708/http://www.technoblogo.com/2007/02/12/Windows+Vista+Tip+3++Slow+Network+Issues.aspx)  
[http://support.microsoft.com/default.aspx/kb/931770/en-us](https://web.archive.org/web/20130623113708/http://support.microsoft.com/default.aspx/kb/931770/en-us)

y otras poco mil entradas que he probado sin mucho éxito…

Después he tratado de activar el 802.11 n que tiene el [Linksys RT300N](https://web.archive.org/web/20130623113708/http://www-es.linksys.com/servlet/Satellite?c=L_Product_C2&childpagename=ES%2FLayout&cid=1150491128056&pagename=Linksys%2FCommon%2FVisitorWrapper&lid=2805691630B06) que uso en casa, ya que no me había dado cuenta que el portátil que uso ahora ([Compaq 8510p](https://web.archive.org/web/20130623113708/http://h10010.www1.hp.com/wwpc/es/es/sm/WF05a/21955-283387-283387-283387-12434564-80117287.html)) lleva una tarjeta de red 802.11 n la [Intel 4965AGN](https://web.archive.org/web/20130623113708/http://www.intel.com/network/connectivity/products/wireless/wireless_n/overview.htm) , esto ha sido el colmo.

Tras perder tres horas no ha habido manera de que detecte el protocolo N (de las **Narices**) he actualizado firmwares, drivers he cambiado prácticamente todo lo cambiable y probado todo lo probado sin fortuna alguna… incluido el cambio de seguridad WPA2-AES que parece ser es necesario para que se detecte el N, (tras el cual dos de los equipos de casa han dejado de funcionar tienen todavía el XP, lo que me ha llevado a instalar el [KB893357](https://web.archive.org/web/20130623113708/http://www.microsoft.com/downloads/details.aspx?FamilyID=662bb74d-e7c1-48d6-95ee-1459234f4483&displayLang=es), que activa la compatibilidad WPA2, já, pues en mis equipos las tarjetas deben ser muy viejas por qué no lo soportan. )

En ese momento he recordado ese extracto que suele leer [Chema Alonso](https://web.archive.org/web/20130623113708/http://elladodelmal.blogspot.com/), sobre la configuración de una tarjeta Wifi en Linux, y me he empezado a partir de risa, de pura desesperación .. Así que he optado por abrir unas cervezas .. y hacer de esto una experiencia cuando menos amena …

Finalmente he optado por soltar el disco (es un [IOMEGA home network](https://web.archive.org/web/20130623113708/http://www.iomega-europe.com/item?SID=b5b6bc955340dfea005f59d097e17eabf7f:4715&sku=204133457) con Ethernet, que tengo conectado al router) y conectarlo por USB a mi portátil, que poco glamur …

De modo que he empezado a copiar los archivos, pero cuando han llegado la Maquinas virtuales …. me he topado con la limitación de copiar archivos de más de 4Gb (fat32) … a ver que alguien me lo explique, hasta ahora copiando archivos por red SMB no había tenido problemas para copiar archivos de más de 4Gb  – No lo entiendo –

De modo que ni corto ni perezoso, decido hacer un convert a NTFS, por si acaso [miro en la web de IOMEGA](https://web.archive.org/web/20130623113708/https://iomega-na-en.custhelp.com/cgi-bin/iomega_na_en.cfg/php/enduser/std_adp.php?p_faqid=110&p_sid=RpZTvBPi&p_lva=&p_sp=&p_li=), no vaya a ser que no sea adecuado…

Las recomendaciones típicas de que si pasas a NTFS no podrás volver a FAT32 etc … que no podré usarlo con Linux, Windows 98 o Mac  etc…  
De modo que adelante .. (Le llevo casi una hora .. ya que tenía el 50% ocupado) y después lo deje copiando archivos mientras veía una peli.

Más tarde, lo desconecte del USB, lo volví a conectar a la LAN y descanse feliz a pensando de que mis datos estaban a salvo …

**“– backing up is sexy!” yeahhh**

Bueno, resulta que más tarde he tratado de conectarme por SMB para buscar unos documentos que tenia archivados y HORROR … mi disco ha desaparecido … intento entrar en la parte de administración y ohhh sorpresa … no entra…  
   
Tal vez se les haya pasado algún tipo de recomendación en las instrucciones a los señores de IOMEGA.

Bueno, por el momento no he tenido tiempo para ver qué diablos ha pasado exactamente de modo que ya os contaré como termina la historia, por el momento sospecho que el software del firmware no reconoce NTFS. En cualquier caso, podrian publicar el firmware como hacen los señores de Linksys …. 

Ah no estoy excesivamente preocupado ya que de las cosas importantes guardo siempre una copia ó dos en CD ó DVD.

Pero si me he sentido un poco identificado con Carrie …

![](/images/Sharepoint/MacDeath.gif)

Desde luego un mal día … **but remember “– backing up is sexy!”**