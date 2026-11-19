+++
title = 'emu_x86 Part 3: Inside the Emulator'
date = 2026-11-16T12:01:00+01:00
tags = ['retrocomputing', 'emulation', 'emu_x86', 'webassembly', 'x86']
series = 'emu_x86'
image = "/images/emu_x86/debugger.png"
description = "How emu_x86 is built: one portable C core, the 8088 and 386 CPUs, how they were tested, SeaBIOS, disks, speed, and the bugs that real systems found."
draft = false
+++

This is the last of three articles about **emu_x86**. [Part 1](/posts/2026/26_11_15_emu_x86_part_1_pc_in_the_browser/) shows how to use it and [Part 2](/posts/2026/26_11_15_emu_x86_part_2_tools/) covers the tools. Here I describe how it works inside, and the bugs that taught me the most.

## The two PCs

| | IBM PC/XT | 386 PC |
| --- | --- | --- |
| CPU | Intel 8088, 4.77 MHz | 386 (also 486, Pentium or Pentium II) |
| Firmware | GLaBIOS | SeaBIOS and SeaVGABIOS |
| Video | MDA and CGA | VGA with VESA modes up to 1600x1200 |
| Sound | PC speaker | PC speaker, Sound Blaster 16 with FM |
| Disks | Floppies, a hard disk, a CD-ROM | Floppies, an IDE hard disk, a bootable CD-ROM |
| Network | NE1000 | RTL8029 or NE2000 |
| RAM | 640 KB | 16 MB by default, up to 512 MB in the page |

## One core, two hosts

The emulator core is portable C with no calls to the operating system. That is what lets the same code run in two places: in the browser, compiled to WebAssembly with Emscripten, with a page of plain HTML and ES modules around it, and on Linux, as command line programs and a native SDL2 window.

The command line build matters more than it seems. All the tests run there with no browser, and it is the base of `emuctl`, the scripting tool of Part 2.

## Starting with the XT

I began with the IBM PC/XT because MS-DOS 1.x to 6.x runs on it and it has the smallest scope. For the 8088 I did not write a new core. I took the one from [VirtualXT](https://codeberg.org/virtualxt/virtualxt), which already passes the full SingleStepTests suite for the 8088, and kept it unchanged. The rest is the chipset around it: the interrupt controller, the timer, the DMA controller, the keyboard, the floppy controller, and MDA and CGA video.

Getting the chips to talk to a real BIOS took small details. GLaBIOS checks the DMA counter at the end of the memory test and reports an error if the refresh requests of the timer did not arrive. It also reads only one of the four interrupts that a floppy reset leaves, so the stale ones answered its first recalibrate and failed the self test. None of this is in a data book. The BIOS found it.

GLaBIOS handles only 360K and 1.2M floppies and leaves the hard disk to a controller ROM. So the XT gets a small option ROM that replaces INT 13h with a stub: the stub writes the registers to a port, and C code does the read or write. That gives the PC any floppy size from 160K to 2.88M, and one hard disk.

## The 386 core

For the 386 there was no core to borrow: VirtualXT has no 386 mode, and the other cores I know are GPL, which would change the licence of the project. So the 386 core is new. It supports real mode, protected mode, V86 mode, paging (also PAE on the Pentium II model) and a 387 FPU. It is an interpreter. Each segment register keeps a descriptor cache, and a fault leaves the state of the first byte of the instruction.

How do you know a CPU core is right? Two sources:

- The **SingleStepTests** data for the 80386 gives the result of each instruction on a real 386EX. I took undefined behaviour from this data and not from the manuals, for example the flags after a shift.
- The SingleStepTests have no protected mode. For that, small test programs print their exception frames and registers, and a script compares the output with `qemu-system-i386`. The programs avoid the few things where QEMU differs from the real chip.

![The emu_x86 debugger stopped in 32-bit protected mode code, with the CPU state of the 386 core: registers, control registers and segment descriptors.](/images/emu_x86/debugger.png)

The 486, Pentium and Pentium II models are one core with a switch. An instruction from a later chip raises an invalid opcode error on an earlier model, so a program that detects the CPU sees the right one. The Pentium II model also runs **MMX, SSE and SSE2**, about a thousand lines of C in their own file. The floating point of SSE uses the host's `float` and `double`. The rounding control of the MXCSR register is honoured by the conversions to integers, but the exception flags are only kept, not raised, and denormals are not flushed. That is enough for operating systems, which set the default masked state. MMX registers are kept apart from the x87 ones, so a program that mixes MMX and x87 data in one register is not modelled. The core has test programs for MMX and SSE2, and CPUID reports these features only on the Pentium II model.

## Making a PC that SeaBIOS accepts

For the 386 PC I use SeaBIOS, the BIOS of QEMU. This decided the shape of the hardware. SeaBIOS finds the disks and the video ROM only through PCI, and it decides that it runs on QEMU from the id of the host bridge. So the 386 PC is a QEMU look-alike: a 440FX host bridge, a PIIX3 ISA bridge with an IDE function, and a standard VGA with the Bochs VESA extensions.

One detail cost me some time: SeaBIOS prints nothing until the port 402h answers E9h on a read. Until I found that, it looked like a hang.

Other small facts came the same way. The CPU keeps the segment limit on a real-mode segment load, because HIMEM uses "unreal mode" and looped for ever without it. SeaBIOS uses the BSWAP instruction in its CD code. BSWAP is a 486 instruction, and the CD boot crashed on the 386. Accepting BSWAP in the CPU would let the 386 run code that a real 386 cannot, so I patched SeaBIOS to swap bytes in C instead.

## What runs on it

The list grew by testing real systems:

- **MS-DOS 6.22** boots in about 30 seconds in the browser. EMM386 gives expanded memory, and programs built with DJGPP and Watcom run under it.
- **Windows 3.11** installs from an ISO image on a new disk, after MS-DOS 6.22 was installed from its setup floppies. It runs in standard and 386 enhanced mode, with DOS boxes and the mouse. This test found two faults in the core: a streamed disk write that stayed busy, and the 16-bit TSS that Windows loads in standard mode.
- **Linux 2.2.16** (Slackware 7.1) boots to a shell. Linux drives the floppy controller itself and polls the disk change line, which read as "changed" all the time, so it never loaded the root disk.
- **FreeBSD** boots as well, after the IDE bus master registers were added. Its disk driver resets a channel through them and panicked without.

Each of these runs found a bug that no unit test had found, which is the reason I keep trying bigger systems.

## How the hard disk works

A hard disk is a raw image: a partition table and one or more FAT volumes, exactly what DOS expects on a real disk. Nothing in the file is specific to the emulator.

DOS and the BIOS address a disk by cylinder, head and sector, so the emulator must report the geometry that the partition table was made with. It takes the heads and the sectors per track from the end of the first partition. A 512 MB test image has 32 heads and 63 sectors, so a fixed geometry of 16 heads would read the wrong sectors. The limit of 1024 cylinders is 504 MB at 16 heads, which is why the disks that the disk manager makes with a plain table stop there, and a bigger blank disk gets a BIOS translation so that FDISK can use all of it.

In the page, disks up to 256 MB are copied into WebAssembly memory and kept in the browser. A bigger 386 disk is **streamed**: the IDE controller keeps a cache of 64 KB chunks and stays busy while the page reads a missing chunk from the file or from a web address with range requests. A 1 GB disk then needs only a few requests. CD images are always streamed. The page writes the file of a server disk only when you press **Save to server**, and then it sends just the chunks that changed.

## Sound, speed and the debugger

The PC speaker is sampled into 22050 Hz frames, so both tones and programs that toggle the speaker bit themselves can be heard. The 386 adds a Sound Blaster 16, with FM synthesis written from the YM3812 data sheet. It is not bit exact.

The core is an interpreter. It runs about 20 million instructions per second on a native build and about 15 million in the page. The emulated 386 is set to 10 million per second, so a guest is not slow, but it is not fast either. Three things keep the interpreter fast: instruction bytes come from a cached code page, a data access inside one page is made in place through a map of 16 KB blocks, and the interrupt line is a field that the machine sets when something can change it, not a callback polled at every instruction. The profile of a long Linux boot shows that the next big step for speed is a cache of decoded instructions.

## A bug from the keyboard

The most instructive bug was the Spanish keyboard on the 386. `KEYB SP` loaded the wrong table: the minus key gave an apostrophe. The same disk in QEMU worked, so the fault was mine. KEYB stores a flag in one byte of the BIOS data area (`40:96`): it was 10h in QEMU and 00h in my emulator, and a watch on that byte showed the order of the events.

There were two faults, and each one hid the other:

1. The 8042 keyboard controller sent its replies with no delay, so the INT 9 handler of KEYB was entered again while it still held the first byte. The bytes were used in the wrong order and the keyboard ID was lost.
2. Bit 4 of port 61h, the refresh bit, changed on every read. KEYB waits for about 995 changes, which is 15 ms on a real PC, and here it ended in under a millisecond.

Both were fixed by timing: replies now wait one byte time, and the refresh bit follows the clock. This is typical of the project. The bugs are not in the instructions, which the test suites cover, but in the timing and the small hardware details that real software relies on.

## Limits and where it stands

The XT has MDA and CGA only. The 386 core has no NX bit and no APIC. The CD-ROM reads data discs only, with no audio. The network has no IPv6. The source code is not public yet. You can try the emulator in the browser at [emux86.romheat.net](https://emux86.romheat.net/?machine=386&hdd=https://blog.romheat.net/emu_x86-disks/freedos-hd.img.gz), and the free FreeDOS images are in the [emu_x86-disks](https://github.com/csegura/emu_x86-disks) repository.
