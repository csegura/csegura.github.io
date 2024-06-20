+++
title = 'Fonera Serial'
date = 2011-02-02T00:00:00+01:00
tags = ['electronics', 'fonera', 'serial']
+++

Borrar la nvram

`mtd -r erase nvram`

Configuración
Wan - disabled
STP - enabled

Configurar el wireles con el mismo ssid que el router de casa
En security asignar los permisos
En el setup básico darle una IP de las de casa

## Recovery

Como la fonera esta estropeada he tenido que hacer un recovery ..

Para empezar la he conectado al arduino, así puedo usar el terminal (terraterm) para acceder al RedBoot

He descargado el TFTPD de (http://tftpd32.jounin.net/tftpd32_download.html)

He descargado tambien las últimas imagenes del ddwrt (http://www.dd-wrt.com/site/support/router-database)

Voy a necesitar el linux.bin ( DD-WRT v24-sp2 (10/10/09) std)

Me asigno la IP 192.168.1.254 y como servidor por defecto el 192.168.1.5

```shell	
RedBoot> ip_address -l 192.168.1.254/24 -h 192.168.1.5
IP: 192.168.1.254/255.255.255.0, Gateway: 0.0.0.0
Default server: 192.168.1.5
```

Inicializamos

```shell	
RedBoot> fis init
About to initialize [format] FLASH image system - continue (y/n)? y

*** Initialize FLASH Image System
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .
```

## Configuramos el TFTPD

![](/images/Electronics/fonera_client.jpg)

## Cargamos el DDWRT

```shell	
RedBoot> load -r -v -b 0x80041000 linux.bin
Using default protocol (TFTP)
\
Raw file loaded 0x80041000-0x806abfff, assumed entry at 0x80041000
RedBoot>
Creamos el sistema
RedBoot> fis create linux
... Erase from 0xa8030000-0xa869b000: ........................................................................................
... Program from 0x80041000-0x806ac000 at 0xa8030000: ........................................................................................
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .
RedBoot>
```

Configuramos el script de carga, la ip

```shell
RedBoot> fconfig
Run script at boot: true
Boot script:
.. fis load -l vmlinux.bin.l7
.. exec
Enter script, terminate with empty line
>> fis load -l linux
>> exec
>>
Boot script timeout (1000ms resolution): 10
Use BOOTP for network configuration: false
Gateway IP address:
Local IP address: 192.168.1.1
Local IP address mask: 255.255.255.0
Default server IP address: 192.168.1.254
Console baud rate: 9600
GDB connection port: 9000
Force console for special debug messages: false
Network debug at boot time: false
Update RedBoot non-volatile configuration - continue (y/n)? y
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .
```

Listo.