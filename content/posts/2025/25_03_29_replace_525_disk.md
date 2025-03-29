+++
title = 'Replacing the 5.25" Disk Drive'
date = 2025-03-29
tags = ['retrocomputing', 'pc', 'disk']
+++

## Replacing the 5.25" Disk Drive

I have a 5.25" disk drive that is not working properly. I have tried to clean the heads, but it is still not working. I have decided to replace it with a new one. I have found a new 5.25" disk drive on Wallapop, and I have bought it. The new disk drive is a Panasonic JU-475-5, also I found the complete service manual for it.

The installation is quite simple, just remove the old disk drive and install the new one. The disk drive is connected to the disk controller card, and it is powered by the power supply of the computer.

[New disk](https://imgur.com/jbhfXNr)

[Old Ibm disk](https://imgur.com/b5BE9XC)

[Compare](https://imgur.com/jbhfXNr)

## Disks

I don´t have many 5.25" disks, but I have some. Muy surprise is that most of them aren´t working. I have tried to recover the data from them, but I have only been able to recover some of them. 

I have used ImageDisk format to try to recover old DS/DD disks, that were unreadable.

A standard 360KB 5.25-inch double-sided, double-density (DSDD) floppy disk in MS-DOS has the following typical parameters:

- Capacity (Formatted): 368,640 bytes (360 KB)
- Sides (Heads): **2** (numbered 0 and 1)
- Tracks (Cylinders): **40** (numbered 0 to 39). Each track on both sides forms a cylinder.   
- Sectors per Track: **9** (numbered 1 to 9)   
- Bytes per Sector (Block Size): **512** bytes
- Total Sectors: 2 sides * 40 tracks/side * 9 sectors/track = 720 sectors
- Interleave Factor: Typically 1:1. This means that sequential logical sectors are also physically sequential on the track. Older systems with slower controllers might have used a higher interleave (e.g., 2:1 or 3:1) to give the controller time to process data between reading sectors. However, for most standard PC systems with 360K drives, 1:1 was common.
- Data Encoding: Modified Frequency Modulation (MFM)

[ImageDisk](https://imgur.com/x9THyng)

Early Floppy Disks used FM (Frequency Modulation): The very first floppy disk systems used FM encoding, often referred to as "single density." FM encoding was simpler to implement but less efficient in terms of storage capacity.   

In the other hand MFM for Higher Density, have more capacity: To increase storage capacity, a more efficient encoding scheme called Modified Frequency Modulation (MFM) was developed. MFM allowed for roughly twice the storage capacity compared to FM on the same physical media. This is why MFM disks were often called "double density."   

360KB was "Double Density": The 360KB 5.25-inch floppy disk format was a "double density" format, and therefore it utilized MFM encoding.   

Later Higher Density Formats: Even higher density floppy disk formats (like 1.2MB 5.25-inch and 1.44MB 3.5-inch) also continued to use MFM encoding.

After format with ImageDisk, I have been able to recover some of the disks, but not all of them. To use the disks, I have to format them again with msdos, and then I can use 
them.

```
format b: /f:360
```

[Formated](https://imgur.com/XjLvrcT)
