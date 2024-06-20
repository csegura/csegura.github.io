+++
title = 'Fonera ser2net'
date = 2011-02-03T00:00:00+01:00
tags = ['electronics', 'fonera', 'serial']
+++

He tenido muchos problemas y no he conseguido hacer funcionar el ipkg correctamente en la fonera, creo que es un problema de rutas .. al final he hecho una serie de inventos.

cada vez que me ejecuto el "ipkg update" me dan estos errores

```shell	
ERROR: File not found: //usr/local/lib/ipkg/lists/whiterussian
       You probably want to run `ipkg update'
ERROR: File not found: //usr/local/lib/ipkg/lists/non-free
       You probably want to run `ipkg update'
ERROR: File not found: //usr/local/lib/ipkg/lists/backports
       You probably want to run `ipkg update'
```

en mi ddwrt no hay /usr/local/lib y  no puedo crearlo

he hecho un `mount /jffs/usr/local /usr/local` después el ipkg cuando llama al wget me da otro error ...

```shell
wget: unrecognized option `--passive-ftp'
ipkg_download: ERROR: Failed to retrieve http://downloads.openwrt.org/kamikaze/7.09/packages/mips/ser2net_2.3-1_mips.ipk, returning
```

finalmente

```shell
wget http://downloads.openwrt.org/kamikaze/7.09/packages/mips/ser2net_2.3-1_mips.ipk
ipkg install ser2net_2.3-1_mips.ipk
```

y parece que se ha instalado ...

```shell
ser2net -C "3001:raw:600:/dev/tts/0:115200 NONE 1STOPBIT 8DATABITS -LOCAL -RTSCTS"
stty -F /dev/tts/0 9600
```

Enlaces

http://linux.die.net/man/8/ser2net