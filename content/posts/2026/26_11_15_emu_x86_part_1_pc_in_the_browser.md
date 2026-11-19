+++
title = 'emu_x86 Part 1: A PC in Your Browser'
date = 2026-11-15T12:00:00+01:00
tags = ['retrocomputing', 'emulation', 'emu_x86', 'webassembly', 'dos']
series = 'emu_x86'
description = "emu_x86 emulates an IBM PC/XT and a 386 PC in a web page. How to try it, load disks, save your work and use the keyboard, mouse and sound."
draft = false
+++

I have just finished a new project: **emu_x86**, an emulator of two classic PCs: an **IBM PC/XT** (Intel 8088) and a **386 PC** (it can also be a 486, a Pentium or a Pentium II). The same C code runs in a web page, compiled to WebAssembly, and on Linux. So you can open a link and have a DOS computer on the screen. Nothing is installed on your computer.

This is the first of three articles. This one is for the person who wants to use it. [Part 2](/posts/2026/26_11_15_emu_x86_part_2_tools/) covers the tools around the emulator (disk manager, debugger, network, Linux window and a command line for scripts). [Part 3](/posts/2026/26_11_16_emu_x86_part_3_inside_the_emulator/) is about how it works inside.

## Try it

Open the **[live demo](https://emux86.romheat.net/?machine=386&hdd=https://blog.romheat.net/emu_x86-disks/freedos-hd.img.gz)**.

1. Wait while the disk downloads (about 8 MB). A box over the screen shows how much has arrived.
2. The 386 PC boots FreeDOS and shows `C:\>`.
3. Click the screen. The light in the **Keyboard** panel comes on: your keys now go to the PC.
4. Type `DIR` and press Enter.

![The 386 PC in the browser, booted from a FreeDOS hard disk.](/images/emu_x86/page-386.png)

They boot MS-DOS, FreeDOS, Windows 3.1, Windows 3.11, Windows 95 and old versions of Linux and FreeBSD from ordinary disk images. MS-DOS and Windows are not part of the project: you bring your own disks. Free FreeDOS images for both PCs are in a [separate repository](https://github.com/csegura/emu_x86-disks).

## The page

- **The top bar** has the controls you use while the PC runs: the screen size, **Power**, **Pause**, **Reset**, **Ctrl+Alt+Del**, **Screenshot**, **Copy**, **Paste** and **Full screen**.
- **The screen** is on the left. Click it to type into the PC.
- **The side column** has three panels: **PC** (the machine, the sound, network and mouse buttons, and links to the debugger and the disk manager), **Disks**, and **Keyboard**.

The page follows the light or dark theme of your system.

## Choose the machine

The **PC** panel shows the machine in one line, such as `AT 386 · Pentium II · 64 MB · PCI RTL8029 · Maximum`. **Change** opens the settings:

![The PC panel with its settings open.](/images/emu_x86/pc-panel.png)

| Setting | Choices | Notes |
| --- | --- | --- |
| Machine | IBM PC/XT (8088), AT 386 (SeaBIOS) | The XT runs DOS and programs for the first PCs. The 386 also runs Windows and Linux. |
| CPU | 386, 486, Pentium, Pentium II | 386 PC only. Linux 6 and FreeBSD 14 need the Pentium II. Some old DOS programs want the 386. |
| RAM | 16 to 512 MB (`?ram=` in the address takes 4 to 1024) | 386 PC only. Windows 95 wants 64 MB, Linux 6 and FreeBSD 256 MB. |
| Card | PCI RTL8029, ISA NE2000 | 386 PC only. |
| Speed | 4.77 MHz (real) on the XT or 33 MHz (real) on the 386, 2x, 5x, 10x, Maximum | The first choice is the speed of the real machine. Maximum runs as fast as your computer can. |

![The XT booted from the FreeDOS floppy.](/images/emu_x86/page-xt.png)

The XT above runs the FreeDOS boot floppy from drive A:.

## Disks

![The Disks panel with FreeDOS in C:.](/images/emu_x86/disks-panel.png)

Each drive has a line in the **Disks** panel: floppies A: and B:, the hard disk C:, and the CD-ROM or a second hard disk D:. **Mount** puts a disk in the drive: **Load file…** takes an image from your computer (**Load ISO…** on the CD-ROM line), and there are also images from the server (when you run it yourself) or from a web address. An image whose name ends in `.gz` is unpacked in the browser, which makes a smaller download.

- A floppy image can be 160 KB up to 2.88 MB. A hard disk image is a complete disk with a partition table, as DOS makes it.
- A disk from your computer stays in your browser, also after a reload, until you eject it. A hard disk over 256 MB is not kept.
- **Save** downloads the changed image. The PC works on a copy, so nothing changes on your computer until you save.
- **Add** puts files on the disk. On C: and D: the PC restarts so that DOS sees them. On A: and B: it keeps running. Long names are kept for Windows 95 and Linux, and DOS sees a short name.
- The 386 PC has room for the CD-ROM *or* a second hard disk, not both. The **Secondary IDE slot** chooses.

**CD-ROM.** Mount an ISO image on the CD-ROM line. On the 386 any ATAPI CD driver works (FreeDOS has UDVD2), and you can tick **Boot from the CD first**. On the XT no normal CD driver runs on an 8088, so emu_x86 has its own, `EMUCD.SYS`. The CD-ROM reads data discs and does not play audio.

## Keyboard, mouse and sound

- **Keyboard.** Click the screen to give the keys to the PC, and click outside to take them back. The page sends the position of each key, as a real keyboard does, so the PC uses the layout that DOS loaded. With a Spanish keyboard, run `KEYB SP` in DOS.
- **Paste** types the text of your clipboard into the PC. It presses keys, so set the paste layout (US or Spanish) to the one that DOS uses. A character with no key in that layout is skipped, and the page says so.
- **Copy:** hold Shift and drag on the screen to select text, then press Copy or Ctrl+Shift+C. This works in text modes. In graphics modes, such as Windows, use **Screenshot**.
- **Mouse.** Press **Mouse**, then click the screen. DOS needs a mouse driver (CTMOUSE in FreeDOS). Press Esc to get the pointer back.
- **Sound.** The PC speaker, and on the 386 a Sound Blaster 16 with FM music. Browsers start sound only after a click on the page.

## Link to a ready PC

You can add settings to the address of the page, which is handy for bookmarks and links, as in the demo above.

| Add | Does |
| --- | --- |
| `?machine=386` | the 386 PC (`xt` for the XT) |
| `&cpu=686` | the chip: `386`, `486`, `586` (Pentium), `686` (Pentium II) |
| `&ram=256` | the memory of the 386 PC in MB |
| `&hdd=...` | a hard disk in C:, a server image or a full web address |
| `&a=...`, `&b=...`, `&cd=...` | floppies and a CD image |

## Online or on your own computer

The online page has no server behind it. For some things you need to run emu_x86 on your own computer, where a small Python server (it listens on your computer only) adds:

- **Save to server**, which writes your changes back to the image file in your `disks` folder. It sends only the chunks that changed, so it is quick on a big disk, and it makes one backup of the original the first time;
- the **disk manager** (see Part 2);
- the **network**, so a DOS web browser or an FTP client in the PC reaches the Internet.

The source code is not public yet, so for now the online demo is the way to try it.

## Limits

The FM music is close to, but not the same as, a real Sound Blaster, and the Sound Blaster does not record. The CD-ROM reads data discs only. A hard disk of 256 MB or less runs from memory. A bigger one is read from its file when the PC needs it, which can be slower.

Next: [Part 2, the tools](/posts/2026/26_11_15_emu_x86_part_2_tools/).
