+++
title = 'BBC Disk field notes'
date = 2025-05-03
tags = ['retrocomputing', 'bbc', 'acorn', 'disk']
+++

I recentrly bought a broken BBC Diskdrive and a Watford DFS disk controller card, to try to repair it. The disk drive is a dual 5.25" disk drive, and the controller card is a Watford Electronics DFS (Dual Disk Filing System) card version 1.54T.

![BBC Disk Drive](https://imgur.com/gallery/bbc-watford-disk-levRCxl#sO43fiz)


The unit comes with two different disk drives, a Mitsubishi MF503A and a Mitsubishi M4853-342MG. Each drive has a switch on the front panel to select between single-density (40 tracks) and double-density (80 tracks) operation. 

Each drive’s track density is 96 tracks-per-inch (for 80-track mode), but they are also switchable to emulate 48 TPI 40-track operation for compatibility. The rotational speed is fixed at 300 RPM for double-density operation, which is standard for 5.25″ DD. At this speed, one revolution takes 200 ms, and at the double-density data rate of 250 kb/s, roughly 5 KB of data can be read per rotation (enough for up to 18 × 256-byte sectors). In single-density FM mode (used by the original Acorn DFS), the data rate is half (125 kb/s), and the standard format is 10 × 256-byte sectors. 

![Disk 0](https://imgur.com/gallery/bbc-watford-disk-levRCxl#MlnR1M1)
![Disk 1](https://imgur.com/gallery/bbc-watford-disk-levRCxl#PUh14l1)

![Disks models](https://imgur.com/gallery/bbc-watford-disk-levRCxl#V0Jhnlu)

![Disk0a](https://imgur.com/gallery/bbc-watford-disk-levRCxl#2dyQ2RI)
![Disk1a](https://imgur.com/gallery/bbc-watford-disk-levRCxl#tfmsOKY)


Mitsubishi drives were considered high-speed for their era – reading Watford’s documentation notes that these half-height drives offer faster access than older full-height units, and the BBC Micro can optimize for their speed via configuration links or FX commands. 

## Installation

I've luckily found a service manual for the Watford DFS card, ufff, I've been about to put the card. 

#### Modifications for issue 1, 2 and 3 boards
Locate the track running between pin 9 of IC 27 and the right hand pad of link S9 and carefully cut it. Next using a pair of wire cutters, cut the leg of pin 9 of IC 27 as near to the circuit board as possible and bend the leg up. Using a thin piece of connecting wire link the leg of pin 9 to the right hand pad of link S9. This operation is required to generate the non maskable interrupts to operate the DFS. Proceed to the paragraph entitled 'Fitting for all issue boards'

#### Modifications for issue 4 and 7 boards
Locate link S9 (south of the printed Acorn logo) and see if there is a wire link joining the two pads. If the wire link is present this needs to be cut. Do not use any form of blade as you are almost certain to damage the surrounding tracks, use a pair of wire cutters. H there is no link present then no further action is required and you may proceed to the next stage.

#### Fitting for all iSBue boards
After performing the modifications (if necessary) to link S9 the next step is to fit the parts comprising of the 1.54T DDFS kit. 

Las step add the ROM

![Controller Card](https://imgur.com/gallery/bbc-watford-disk-levRCxl#extsWcn)

## Drive Hardware and 40/80-Track Compatibility

A great feature of this dual-drive system is the 40/80 track selector on each drive. Each Mitsubishi drive has a toggle switch that flips between “80-track” mode and “40-track” mode. In 40-track mode, the drive will double-step the head movements – effectively skipping every other physical track – so that it can correctly read disks that were formatted in older 40-track drives (which have wider track spacing).

Under Acorn’s original DFS and WD1770 chip, doesn’t inherently know about 80-track drives, I suppouse that I must manually toggle the drive’s 40/80 switch

## Controller

I've been reading that watford DDFS uses MFM (250kbits/s), which allows it to store more data on each disk compared to the original Acorn DFS that used FM encoding. The DDFS system is designed to work with the WD1770 floppy disk controller, which is more efficient than the older Intel 8271 controller used in the original BBC Micro systems.

## Commands

| Command   | Description                         | Example                                                          |
| --------- | ----------------------------------- | ---------------------------------------------------------------- |
| `*LOAD`   | Loads a file into memory            | `*LOAD CODE`                                                     |
| `*SAVE`   | Saves memory to a file              | `*SAVE CODE 3000 4000`                                           |
| `*RUN`    | Loads and executes a file           | `*RUN GAME`                                                      |
| `*EXEC`   | Executes a file as a command script | `*EXEC MENU`                                                     |
| `*DELETE` | Deletes a file                      | `*DELETE OLDGAME`                                                |
| `*RENAME` | Renames a file                      | `*RENAME GAME1 GAME2`                                            |
| `*COPY`   | Copies a file or group of files     | `*COPY :0.$.PROG :1.$.PROG`<br>`*COPY $.F* :1.$.F*` (wildcards!) |
| `*BACKUP` | Copies all files or entire disk     | `*BACKUP 0 1` copies all from drive 0 to 1                       |

| Command   | Description                 | Example                       |
| --------- | --------------------------- | ----------------------------- |
| `*FORM40` | Format as 40-track disk     | `*FORM40 0` (formats drive 0) |
| `*FORM80` | Format as 80-track disk     | `*FORM80 1` (formats drive 1) |
| `*VERIFY` | Checks disk for read errors | `*VERIFY 0`                   |
| `*INFO`   | Shows info about a file     | `*INFO GAME`                  |


| Command | Description                            | Example                |
| ------- | -------------------------------------- | ---------------------- |
| `*CAT`  | Lists files on the disk                | `*CAT 0` lists drive 0 |
| `*DIR`  | Changes directory (if supported)       | `*DIR $.LEVEL1`        |
| `*CDIR` | Creates a new directory (if supported) | `*CDIR LEVEL1`         |

| Command       | Description                            | Example                                    |
| ------------- | -------------------------------------- | ------------------------------------------ |
| `*FX`         | Controls system settings (BBC OS call) | `*FX 3,1` to turn off Escape key           |
| `*OPT`        | Sets DFS options like booting          | `*OPT 4,3` enables autoboot from disk      |
| `*I AM`       | Sets user name (if networking)         | `*I AM JANE`                               |
| `*KEY`        | Sets function key macros               | `*KEY 1 *RUN MENU`                         |
| `*EXEC !BOOT` | Executes the disk’s boot file          | `*EXEC !BOOT` (common on disks with menus) |
