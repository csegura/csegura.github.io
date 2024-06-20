+++
title = 'Fonera Kamikaze'
date = 2011-02-02T00:00:00+01:00
tags = ['electronics', 'fonera', 'kamikaze']
+++

Notas de la instalación

descargar de http://downloads.openwrt.org/kamikaze/8.09/atheros/

* openwrt-atheros-vmlinux.lzma
* openwrt-atheros-root.squashfs

entrar por serie al redBoot

```shell
RedBoot(tm) bootstrap and debug environment [ROMRAM]
Non-certified release, version V1.00 - built 10:37:27, Dec 12 2006
Copyright (C) 2000, 2001, 2002, 2003, 2004 Red Hat, Inc.
Board: FON1
RAM: 0x80000000-0x81000000, [0x80040aa0-0x80fe1000] available
FLASH: 0xa8000000 - 0xa87f0000, 128 blocks of 0x00010000 bytes each.
== Executing boot script in 5.000 seconds - enter ^C to abort
^C
RedBoot> ip_address -l 192.168.1.254/24 -h 192.168.1.5
IP: 192.168.1.254/255.255.255.0, Gateway: 0.0.0.0
Default server: 192.168.1.5
RedBoot> fis init
About to initialize [format] FLASH image system - continue (y/n)? y

*** Initialize FLASH Image System
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .

RedBoot> load -r -b %{FREEMEMLO} openwrt-atheros-vmlinux.lzma
Using default protocol (TFTP)
Raw file loaded 0x80040c00-0x80100bff, assumed entry at 0x80040c00
RedBoot> fis create -e 0x80041000 -r 0x80041000 vmlinux
... Erase from 0xa8030000-0xa80f0000: ............
... Program from 0x80040c00-0x80100c00 at 0xa8030000: ............
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .
RedBoot> load -r -b %{FREEMEMLO} openwrt-atheros-root.squashfs
Using default protocol (TFTP)
Raw file loaded 0x80040c00-0x801e0bff, assumed entry at 0x80040c00
RedBoot> fis free
  0xA80F0000 .. 0xA87E0000
RedBoot> fis create -l 0x6f0000 rootfs
... Erase from 0xa80f0000-0xa87e0000: ..........................................................................
... Program from 0x80040c00-0x801e0c00 at 0xa80f0000: ..........................
... Erase from 0xa87e0000-0xa87f0000: .
... Program from 0x80ff0000-0x81000000 at 0xa87e0000: .
RedBoot> fconfig
Run script at boot: true
Boot script:
.. fis load -l linux
.. exec
Enter script, terminate with empty line

>> fis load -l vmlinux
>> exec
>>

Boot script timeout (1000ms resolution): 5
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
RedBoot>
```

Nota*

```shell
0xA87E0000 - 0xA80F0000 = 0x6F0000

network config
config 'interface' 'loopback'
        option 'ifname' 'lo'
        option 'proto' 'static'
        option 'ipaddr' '127.0.0.1'
        option 'netmask' '255.0.0.0'
config 'interface' 'lan'
        option 'type' 'bridge'
        option 'defaultroute' '0'
        option 'peerdns' '0'
        option 'dns' '194.179.1.100'
        option 'proto' 'static'
        option 'netmask' '255.255.255.0'
        option 'ifname' 'eth0'
        option 'ipaddr' '192.168.1.1'
        option 'gateway' '192.168.1.5'
config 'interface' 'wan'
        option 'defaultroute' '0'
        option 'peerdns' '0'
        option 'proto' 'static'
        option 'ifname' 'at0'
        option 'ipaddr' '192.168.2.200'
        option 'gateway' '192.168.2.3'
        option 'dns' '192.179.1.100'
        option 'netmask' '255.255.255.0'
```

wan esta en modo cliente de la wifi de casa, la ip es estatica por que tengo el dhcp deshabilitado

la lan la dejo accesible para cuando me conecte desde el cable

```shell
config 'wifi-device' 'wifi0'
        option 'type' 'atheros'
        option 'channel' 'auto'
        option 'disabled' '0'
        option 'diversity' '0'
config 'wifi-iface'
        option 'device' 'wifi0'
        option 'mode' 'sta'
        option 'network' 'wan'
        option 'ssid' 'miwifi'
        option 'encryption' 'psk2'
        option 'key' 'laclavedecasa'
```

para usar psk2 he tenido que instalar el wpa_supplicant

y tambien configurarlo en /tmp/run

porúltimo en el firewall aceptar conexiones por la WAN.

por último he instalado :

 * ser2net, para el arduino
 * el editor nano (sigo siendo alergico del vi)
 * curl
 * bash
 * netcat