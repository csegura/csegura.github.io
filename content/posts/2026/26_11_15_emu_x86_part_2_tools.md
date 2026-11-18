+++
title = 'emu_x86 Part 2: Disk Manager, Debugger, Network and Command Line'
date = 2026-11-15T12:01:00+01:00
tags = ['retrocomputing', 'emulation', 'emu_x86', 'webassembly', 'debugging']
description = "The tools around the emu_x86 emulator: a two-panel disk manager, a debugger, a network, a Linux window and emuctl for scripts and agents."
draft = false
+++

This continues [emu_x86 Part 1](/posts/2026/26_11_15_emu_x86_part_1_pc_in_the_browser/), which showed how to use the emulator page. An emulator alone is not enough to work with old software. You need to get files in and out of the disk images, to look inside a program that crashes, to put the PC on a network, and to run things without clicking. This part covers the tools I built for that. The disk manager, the network and `emuctl` need emu_x86 on your own computer: the online demo has none of them.

## The disk manager

A disk image is hard to handle from outside. So I wrote a second page, the **disk manager**: a file manager, like Windows Explorer, for the FAT12, FAT16 and FAT32 images and CD images in your `disks` folder. A big disk opens at once, because only the parts you look at are read.

![The disk manager with two panels, each showing a different disk image.](/images/emu_x86/manager.png)

**Look and take out.** The list shows the long name and the DOS name of every file. You can view a text file (with the DOS characters), a hex dump, a picture or a sound, and download a file, or a folder or a selection as a zip. **Search** finds names (`*.exe`) and text inside files, in the open folder or on the whole disk. A name search of a 1 GB disk takes under a second.

**Change a disk.** A disk is read only at first, so nothing changes by mistake. The switch **Allow changes** unlocks it, and the first time the manager makes a backup copy in `disks/backup/`. Then you can upload files and folders, make folders, rename, delete, copy, cut and paste, drag a file onto a folder, and change attributes and dates. When a name is taken, it asks: Replace, Skip or Keep both. A long operation shows a progress bar and a Cancel button, and what was done before Cancel stays done, with nothing half written.

**Two panels** show two disks side by side. F5 copies the selection to the other panel and F6 moves it. A move needs Allow changes on both disks, because it deletes the originals.

Three rules came from tests and reviews:

- **Nothing changes unless you allow it.** A change needs a token that exists only while the server runs.
- **A disk that is in use cannot be changed.** While the emulator page has a disk open, or an `emuctl` session uses it, the manager cannot change it, and a second page cannot save to it.
- **A move checks the copy before it deletes.** It copies the items, compares files, folders and bytes with what was read, and only then deletes the originals.

A test showed why this matters: `mdel ::/D1/*` deleted every file of a folder when the name came from the page. Now the name of an existing item is looked up on the disk first, and the program is given the name the disk holds, never the text the page sent.

**Make a new disk.** **New disk...** makes a floppy (160 KB to 2.88 MB) or a hard disk (1 to 2047 MB), formatted or empty.

![The New disk dialog.](/images/emu_x86/manager-new-disk.png)

A formatted hard disk gets a partition table and one FAT partition: FAT12 up to 16 MB and FAT16 above, up to 1875 MB, the largest that DOS 6 reads. An **Empty** disk is all zeros, for FDISK and FORMAT in DOS or for an installer that partitions it. A new disk does not boot by itself, because it has no DOS on it: start DOS from a floppy and run `SYS C:`.

**A disk that does not boot.** **Boot record...** says what the first sector of a hard disk holds and what is wrong with it.

![The boot record dialog, which says that the boot record is in order.](/images/emu_x86/boot-record.png)

It tells you whether the boot code and the signature are there and lists the partitions. With Allow changes on, **Repair** fixes the boot code, the active partition and the signature. It never changes the partitions themselves, so your files are safe, and a disk with its own boot manager (GRUB, Linux, FreeBSD) keeps its code unless you tick the box.

## The debugger

The debugger stops the PC and shows what it does, one instruction at a time. It opens in its own window from the **Debugger** button and works for real mode and protected mode, on both PCs.

![The debugger window, stopped in 32-bit protected mode code, with registers, a listing and the Explain tab.](/images/emu_x86/debugger.png)

The window has registers (you can change them while the PC is paused), on the 386 a CPU state grid and the stack, the listing of the code and a memory view. Four tabs on the right: **Explain** says what the selected instruction does, **Stops** holds breakpoints and the other ways to stop, **Symbols** loads map files, and **System** (386) shows the call stack, the descriptor tables and the page walk of an address.

You run and step with F5 (continue), F11 (step into), F10 (step over), Shift+F11 (step out) and F4 (run to cursor). Arrows in the listing show where jumps go, and a click on a jump target follows it. A click on a memory operand such as `[EBP-4]` shows that address in the memory view.

![The Stops tab with a breakpoint at 0000:7C00 and the condition AX == 4C00.](/images/emu_x86/debugger-stops.png)

The **Stops** tab has five ways to stop the PC:

| Stop | When the PC stops |
| --- | --- |
| Breakpoints | at an address, if the condition is true, with an optional skip count |
| Break when | as soon as a condition becomes true, wherever the PC is |
| Watch memory | after an instruction writes a byte, word, dword, qword or range (on the 386 also reads, or both) |
| Catch (386) | at an exception, an interrupt, a mode or task switch or a triple fault |
| Port break | after an `IN` or `OUT` on a port |

Conditions use registers, memory and numbers, for example `AX == 4C00`, `w[DS:SI] == 1234` or `[0040:0017] & 3` (a Shift key is down). The Symbols tab reads map files from Borland, Microsoft or Watcom (16 or 32 bit) and Linux `System.map` files, so the listing shows the names of your routines, and conditions and Go to accept them.

The engine is in C, so the tests and the browser use the same code. A design point worth telling: an x86 instruction cannot be decoded backwards, so the lines before an address are found by decoding forward from several bytes earlier and keeping the start on which most attempts agree.

## The network

The PC can reach the Internet: a DOS web browser, FTP, `ping`, or Windows 95 with its network. Press **Network** in the PC panel and load a packet driver in the PC. The PC gets its address by DHCP: `10.0.2.15`, with the gateway at `10.0.2.2` and DNS at `10.0.2.3`.

| PC | Card | Settings |
| --- | --- | --- |
| XT | NE1000 | I/O 300h, IRQ 3 |
| 386, PCI RTL8029 (default) | a PCI card | the BIOS sets it; Linux, FreeBSD and Windows 95 OSR2 find it by themselves |
| 386, ISA NE2000 | an NE2000 | I/O 300h, IRQ 3, for DOS packet drivers and Windows set up for an NE2000 |

For DOS and Windows 95 I choose the ISA NE2000 card, because the PCI card is the default now. In DOS I use a packet driver and [mTCP](https://www.brutman.com/mTCP/):

```
NE2000 0x60 3 0x300
DHCP
PING 1.1.1.1
HTGET http://info.cern.ch/
```

mTCP has no HTTPS, so try plain `http://` sites. The PC runs programs that I may not trust, so it is kept away from my own computer: it reaches public Internet addresses only, not my computer or my local network, and nothing from outside reaches the PC unless I forward a port. To open a web server that runs in the PC, for example, I start the server with a forward of port 8080 to port 80 of the PC. There is no IPv6.

## A Linux window

The same PC can run in a window of a Linux desktop, like DOSBox or QEMU, with screen, keyboard, mouse, sound, disks and network, and no browser or server. It is built with SDL2.

| The setup dialog | The window, with the configuration box |
| --- | --- |
| ![The setup dialog of the Linux window.](/images/emu_x86/native-setup.png) | ![FreeDOS in the Linux window, with the configuration box on top.](/images/emu_x86/native-window.png) |

`--setup` opens a dialog where you choose the machine, the CPU, the memory and the disks, and save them in an `.ini` file for the next time. Several images for one drive can be separated by `;`, and Host+1, 2 and 3 then step through them, as if you changed floppies. In the window the right Ctrl key is the **Host** key, and the PC never sees it: Host+H lists all the keys, Host+I shows the configuration (the box in the picture), Host+F is full screen, Host+V pastes, Host+C copies the text screen, and Host+S saves a screenshot. An `.ini` file from someone else can ask for risky settings, such as writing to the disk files or using the network. Then the dialog opens first, names them and lets you decide.

## emuctl: a PC for scripts and agents

The last tool is a command line, `emuctl`. It starts a PC in the background and answers commands, so a script (or an AI agent) can use it as a test machine. The PC is frozen between commands and advances only when a command asks for it. A run is then repeatable, and a script never races the machine.

The commands cover what you do with a keyboard and a screen:

- `type` and `key` send input, and `exec` types a command at the prompt, runs until the prompt is back and prints what the command wrote;
- `put`, `get` and `ls` move files in and out, through a small exchange disk that appears as drive B:;
- there are breakpoints, watches and a trace, as in the window, and `exec --debug` stops a DOS program at its first instruction;
- a map file from Borland TLINK or Microsoft LINK lets you stop a C program at a function name;
- COM1 can be a serial console, which is how a Linux shell is driven.

Typing is harder than it looks. The PC receives key positions, and the keyboard layout that DOS loaded decides what they mean. My MS-DOS image uses a layout that is neither US nor the standard Spanish one, so `emuctl calibrate` types probes at a prompt, reads back what every key gives, plain, with Shift and with AltGr, and uses the result. A character that the layout cannot produce is reported, never dropped.

There is one bug I like here. A test put two files in a row on the exchange disk, and the second one disappeared. DOS does not check for a changed floppy within two seconds of its last access, so it trusted its cached FAT and wrote it back over the new file. Now every change waits for 2.1 seconds of emulated time. It produced no error at all, which is why I keep a review step for silent failures.

Next: [Part 3, inside the emulator](/posts/2026/26_11_16_emu_x86_part_3_inside_the_emulator/).
