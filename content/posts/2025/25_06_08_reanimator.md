+++
title = 'SGI Reanimator'
date = 2025-06-08
tags = ['retrocomputing', 'irix', 'sgi', 'reanimator']
+++



SGI reanimator is a tool for restoring and managing SGI IRIX systems. It provides all necessary tools to install IRIX. (bootp, tftd end the CD images, yeras ago I did it tio install linux on a sun sparcstation ultra and it was a pain to get it working, so this is a great tool)

[SGI Reanimator](https://github.com/Linux-RISC/Reanimator)

```sh
# hinv
Autoload=Yes
console=g
diskless=0
dbaud=9600
volume=80
sgilogo=y
autopower=n
monitor=h
netaddr=192.168.1.105
eaddr=08:00:69:0b:83:e1 
boottune=1
ConsoleOut=video
ConsoleIn=keyboard
SystemPartition=xio(0)pci(15)scsi(0)disk(1)rdisk(0)partition(8)
OSLoadPartition=xio(0)pci(15)scsi(0)disk(1)rdisk(0)partition(0)
OSLoadFilename=/unix 
OSLoader=sash
gfx=alive
Kernname=ide 
```

I've modified my reanimator config to use the following settings to use it from my home network:

```sh
# 192.168.9.101       rbpi 
# 192.168.9.1         IRIS    
# 192.168.9.2         IRIS2
192.168.1.199       rbpi
192.168.1.240       IRIX
192.168.1.242       IRIX2
```

Set the ip address of the IRIS to `setenv addr 192.168.1.101` 

## Select the boot image

Here is the table formatted in Markdown:

| System | sash- / fx-Version | IRIX Version |
|---|---|---|
| Personal Iris 4D/2x | sash.IP6\<br\>fx.IP6 | 4.0.1 or 5.3 |
| Personal Iris 4D/3x | sash.IP12\<br\>fx.IP12 | 4.0.1 or 5.3 |
| Professional Iris 4D/120 | sash.IP5\<br\>fx.IP5 | |
| Professional Iris 4D/210 | sash.IP9\<br\>fx.IP9 | |
| Professional Iris 4D/2x0\<br\>Professional Iris 4D/3x0\<br\>Professional Iris 4D/4x0 | sash.IP7\<br\>fx.IP7 | |
| Crimson | sash.IP17\<br\>fx.IP17 | |
| Indigo R3000 | sash.IP12\<br\>fx.IP12 | |
| Onyx/Challenge R4000\<br\>Indigo R4000\<br\>Indigo² R4000\<br\>Indy | sashARCS\<br\>fx.ARCS | 5.3 or 6.5 |
| O2 | sashARCS\<br\>fx.ARCS | 5.3 or 6.5 |
| Onyx/Challenge R8000\<br\>Onyx/Challenge R10K\<br\>Indigo² R8000\<br\>Indigo² R10K\<br\>Onyx2\<br\>Origin\<br\>Octane\<br\>Fuel | sash.64\<br\>fx.64 | 6.5 |


For the O2 select fx.ARCS and for the Octane select sash.64 (this is for Petrosky)

```sh
bootp():IRIX/6.5.30/disc1/stand/fx.ARCS -x 
```

## Partitioning

```sh
SGI Version 6.5 ARCS 
fx: "device-name" = "dksc(0,1,)"
fx: ctrl# = (0)
fx: drive# = (1)
...opening disk(0,1,0)
```

```sh
c  create
a  all
sy sync
..
```

![1](https://imgur.com/gGn7yY9.jpeg)

Reboot the computer and go to `Install System Software`

## Installing the Software

![2](https://imgur.com/n1ILUGn.jpeg)

![3](https://imgur.com/tgICVd2.jpeg)

![4](https://imgur.com/cnp9A8U.jpeg)

![5](https://imgur.com/zODHHy9.jpeg)


![6](https://imgur.com/tHKaqNz.jpeg)


![7](https://imgur.com/jdwRNhs.jpeg)

![8](https://imgur.com/qSDPUb1.jpeg)

![9](https://imgur.com/6IvZB2R.jpeg)

