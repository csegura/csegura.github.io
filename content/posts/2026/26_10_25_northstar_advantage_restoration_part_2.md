+++
title = 'NorthStar Advantage Restoration Part 2'
date = 2026-10-25
tags = ['retrocomputing', 'restoration', 'northstar', 'floppy-disk']
draft = true
+++

## Looking more closely at the drives

This continues [NorthStar Advantage Restoration 1](/posts/2026/26_10_25_northstar_advantage_restoration_1_first_look_inside/), with a closer look at the drive hardware and how floppy disks mark sectors.

Many computers from the late 1970s and early 1980s used 5¼-inch floppy drives. The Tandon TM100-2A is one example. These drives can become difficult to use as they age. Their radial alignment—the position of the read/write head across the disk’s tracks—can shift. If it moves far enough, the drive may not read or write disks reliably.

The Tandon label identifies the drive in this photo as a TM100-2A. Tandon was an important maker of floppy drives during the early personal-computer era. The TM100-2A is a 5¼-inch drive, and the photograph shows its exposed mechanism, including a wheel marked for 50Hz and 60Hz operation. Its inspection labels and metal parts show age and grime, but I do not see obvious major damage. I am documenting the drive as part of this restoration; the photos do not show the results of any alignment or repair work.

![Open Tandon TM100-2A floppy drive with slotted wheel and inspection labels.](https://i.imgur.com/OWifgNP.jpeg)

## What is a sector?

Floppy disks store data in tracks and sectors. A track is a circular path on the disk. A sector is one part of a track and holds a small block of data. To read a particular block, the drive must first move its head to the correct track. Then it must wait until the correct sector passes under the head.

The head moves on a sled, guided by a mechanism in the drive. This lets it move across the disk to select a track. Selecting a sector is a separate problem: the drive needs to know where the disk is as it spins.

The disk rotates at a steady speed while the drive is in use. One way to mark sector positions is to punch holes near the disk’s outer edge. These holes are physical markers. A sensor in the drive detects each hole as it passes. The drive’s electronics can count the holes and work out which sector is under the head.

A separate hole near the disk’s inner edge often marks the start of the count. This is the index hole. It tells the drive where sector numbering begins for each turn.

Disks that use these physical holes are called **hard-sectored** disks. Here, “hard” means that the sector positions are marked by physical holes. It does not mean that the data is stored in a special kind of hard material. Nor is the sector number literally hard-coded into the disk. The holes give the drive a simple timing signal, and the drive’s controller keeps count.

## Shugart-style drives and hard-sector timing

Shugart Associates helped establish an important design for small floppy drives. Alan Shugart founded the company in 1973, and the company’s SA-400, released in 1976, helped make the 5¼-inch drive size popular. Shugart-style drives and interfaces mattered because other computer makers could use a common approach to connecting and controlling drives.

In the NorthStar Advantage setup I am discussing, the drives use a Shugart-style design with hard-sector timing. These are related ideas, but they are not the same thing. “Shugart-style” describes the drive and its control interface. “Hard-sector” describes how the disk marks the positions of its sectors.

That distinction is useful when looking at old drive electronics. A compatible interface can tell a controller to select a drive, move the head, or read data. The sector holes provide another signal: they tell the controller when each physical sector boundary passes. With that signal, simple controller software can count holes and wait for the requested sector.

The images here do not show a hard-sectored disk or its holes, so they cannot confirm the media format by themselves. The point is how the Advantage’s hard-sector arrangement works, not that every 5¼-inch drive in these photos must use hard-sectored disks.

## The drive electronics

This board is marked TANDON, so I can identify it as a Tandon floppy-drive circuit board. The exact drive model is not visible. Tandon made drives for computers during the period when 5¼-inch disks were becoming common. 

The board looks aged and has some dust, but no clear damage or repair is visible. I am recording its condition while inspecting the drive assembly.

![Vintage floppy-drive circuit board with components and wiring.](https://i.imgur.com/7OaA8kJ.jpeg)

![Close-up of a Tandon floppy-drive circuit board and metal mechanism.](https://i.imgur.com/vvGFQl3.jpeg)

![Dusty vintage electronics circuit board with chips and ribbon cables.](https://i.imgur.com/tJKrSKw.jpeg)

![Close-up of an aged circuit board with chips, connectors, and wires.](https://i.imgur.com/Ova9sv4.jpeg)

Case with removed drive assembly and exposed internal components.

![Open vintage computer hardware with circuit boards, transformer, and metal drive assembly on a workbench.](https://i.imgur.com/JNiW2Rh.jpeg)
