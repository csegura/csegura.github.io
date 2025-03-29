+++
title = 'Replacing the 5.25" Disk Drive'
date = 2025-03-29
tags = ['retrocomputing', 'pc', 'disk']
+++

## Replacing the 5.25" Disk Drive

I have a 5.25" disk drive that is not working properly. I have tried to clean the heads, but it is still not working. I have decided to replace it with a new one. I have found a new 5.25" disk drive on Wallapop (like ebay here in Spain), and I have bought it. Most of units are used, and untested, so I have been careful selecting the one I want to buy. Seller says that the disk drive is untested but was retired working. It's no the first time I buy untested hardware, so the seller seems quite honest, and I trusted her.

The new disk drive is a Panasonic JU-475-5, (1.2Mb) also had founded the complete service manual for it just in case. 

![New disk](https://imgur.com/jbhfXNr.jpg)

The installation is quite simple, just remove the old disk drive and install the new one. The disk drive is connected to the disk controller card, and it is powered by the power supply of the computer.

![Old Ibm disk](https://imgur.com/b5BE9XC.jpg)

![Compare](https://imgur.com/jbhfXNr.jpg)

## DS/DD Disks

I don´t have many 5.25" disks, but I have some. Muy surprise is that most of them aren´t working. I have tried to recover the data from them, but I have only been able to recover some of them. 

I have used ImageDisk format to try to recover old DS/DD disks, that were unreadable.

A standard 360KB 5.25-inch double-sided, double-density (DSDD) floppy disk in MS-DOS has the following typical parameters:

- Capacity (Formatted): 368,640 bytes (360 KB)
- Sides (Heads): **2** (numbered 0 and 1)
- Tracks (Cylinders): **40** (numbered 0 to 39). Each track on both sides forms a cylinder.   
- Sectors per Track: **9** (numbered 1 to 9)   
- Bytes per Sector (Block Size): **512** bytes
- Total Sectors: **2** sides * **40** tracks/side * **9** sectors/track = **720** sectors (**720** * **512** = **368,640** bytes)
- Interleave Factor: Typically 1:1. This means that sequential logical sectors are also physically sequential on the track. Older systems with slower controllers might have used a higher interleave (e.g., 2:1 or 3:1) to give the controller time to process data between reading sectors. However, for most standard PC systems with 360K drives, 1:1 was common.
- Data Encoding: Modified Frequency Modulation (MFM)

![ImageDisk](https://imgur.com/x9THyng.jpg)

Early Floppy Disks used FM (Frequency Modulation): The very first floppy disk systems used FM encoding, often referred to as "single density." FM encoding was simpler to implement but less efficient in terms of storage capacity.   

In the other hand MFM for Higher Density, have more capacity: To increase storage capacity, a more efficient encoding scheme called Modified Frequency Modulation (MFM) was developed. MFM allowed for roughly twice the storage capacity compared to FM on the same physical media. This is why MFM disks were often called "double density."   

360KB was "Double Density": The 360KB 5.25-inch floppy disk format was a "double density" format, and therefore it utilized MFM encoding.   

Later Higher Density Formats: Even higher density floppy disk formats (like 1.2MB 5.25-inch and 1.44MB 3.5-inch) also continued to use MFM encoding.

After format with ImageDisk, I have been able to recover some of the disks, but not all of them. To use the disks, I have to format them again with msdos, and then I can use 
them.

```
format b: /f:360
```

![Formated](https://imgur.com/XjLvrcT.jpg)


## DS/HD Disks

First I tried Norton Disk Doctor, but it was unable to recover the data from the disks. I have tried to format the disks, but it was impossible. I remember that I had used a program called "Disk Doctor" to recover the data from the disks many years ago. But no luck.


{{< youtube m-sVWOMBiGo >}} 

soooo IMD again,

- Sides (Heads): 2
- Tracks (Cylinders): 80
- Sectors per Track: 15
- Bytes per Sector (Block Size): 512
- Interleave: 1:1
- Capacity: 1,228,800 bytes (1.2MB)

![RecoverHD](https://imgur.com/CAAHU80.jpg)

I tried the same process with the DS/HD disks, but I was unable to recover the disk. So I have to use other program called "Omnidisk" 

{{< youtube kJJQvsD2Qds >}} 

```
DRIVE 1
SAMPLE 
FORMAT
```

Finally 

![Finally](https://imgur.com/JcUB8sq.jpg)


## Parameters

| Parameter             | 160 KB           | 180 KB           | 320 KB           | 360 KB           | 720 KB          | 1.2 MB           | 1.44 MB          | 2.88 MB          |
|                       | (5.25" SS SD)    | (5.25" SS SD)    | (5.25" DS SD)    | (5.25" DS DD)    | (3.5" DS DD)    | (5.25" DS HD)    | (3.5" DS HD)     | (3.5" DS ED)     |
|-----------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|------------------|
| Cylinders             | 40               | 40               | 40               | 40               | 80               | 80               | 80               | 80               |
| Tracks per Cylinder   | 1                | 1                | 2                | 2                | 2                | 2                | 2                | 2                |
| Double-Sided          | False            | False            | True             | True             | True             | True             | True             | True             |
| Sector Size           | 512              | 512              | 512              | 512              | 512              | 512              | 512              | 512              |
| Sectors per Track     | 8                | 9                | 8                | 9                | 9                | 15               | 18               | 36               |
| Total Size (Bytes)    | 163840           | 184320           | 327680           | 368640           | 737280           | 1228800          | 1474560          | 2949120          |
| Interleave            | 1:1 (typical)    | 1:1              | 1:1              | 1:1              | 1:1              | 1:1              | 1:1              | 1:1              |



## Sources

- [ImageDisk](http://dunfield.classiccmp.org/img/) - disk image software
   - [Manual](https://oldcomputers-ddns.org/public/pub/manuals/imd.pdf)
- [TestFDC](http://dunfield.classiccmp.org/img42841/testfdc.zip) - Test floppy controller
- [OmniDisk](http://www.shlock.co.uk/Utils/OmniDisk/OmniDisk.htm) 
