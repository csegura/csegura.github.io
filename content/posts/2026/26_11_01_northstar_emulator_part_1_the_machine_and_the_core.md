+++
title = 'NorthStar Advantage Emulator Part 1: The Machine and the Core'
date = 2026-11-01
tags = ['retrocomputing', 'emulation', 'northstar', 'z80', 'cpm']
description = "emu_ns emulates the North Star Advantage, a Z80 computer with CP/M. One portable core runs in a browser, on Linux and on an ESP32."
draft = false
+++

After the [restoration of my real NorthStar Advantage](/posts/2026/26_10_25_northstar_advantage_restoration_1_first_look_inside/), I wanted to be able to run its software without the machine on the table. So I built an emulator: **emu_ns**. It emulates the North Star Advantage, a Z80 computer with CP/M and NSDOS. The screen, the keyboard, the disks, the debugger and a serial terminal are web pages, so there is nothing to install on the client.

You can try it now: **[CP/M BASIC starts from a floppy](https://emuns.romheat.net/?a=CPMBASIC_120.NSI)**, and there is a [version with the 30 MB hard disk](https://emuns.romheat.net/?a=CPMBASIC_120.NSI&hd=MS30D-30MB.NHD) (the image is 34 MB, so it takes a moment). Click the screen and press Enter at the `LOAD SYSTEM` prompt.

![The emulator page, after CP/M booted from a floppy. The directory of drive A is on the screen.](/images/northstar_emulator/page.png)

This is the first of three articles. This one is about the machine and the core of the emulator. [Part 2](/posts/2026/26_11_07_northstar_emulator_part_2_disks_and_cpm/) covers disks and CP/M, and [Part 3](/posts/2026/26_11_08_northstar_emulator_part_3_debugger_and_esp32/) covers the debugger, the serial terminal and the ESP32 board.

## Where it comes from

emu_ns derives from **NSAE** by Sage I. Hendricks (MIT licence), an emulator of the Advantage for the desktop. I kept its Z80 core and its idea of the machine, and rebuilt the rest around a design with one goal: the same core has to run in three places.

- **In the browser**, with WebAssembly and no server;
- **on Linux**, where it is tested, and where the program also serves the pages;
- **on an ESP32**, a small board that serves the pages over Wi-Fi and reads the disk images from an SD card.

The project started as a plan to port NSAE to the ESP32 in eleven steps, each one built and tested on the PC with gcc before it went to the board. That rule shaped the code. The core has no operating system calls, and the parts that touch the outside world (files, the web server, the clock) sit behind small interfaces that Linux and the ESP32 fill in their own way. The emulator is free software under the GPL version 3. The North Star disk images are not part of the code: they live in a separate repository.

## The machine

The Advantage puts the computer, the screen, the keyboard and two floppy drives in one case. The processor is a Z80. Its screen is a 640 by 240 graphics display, which the software also uses as a text screen of 80 columns by 24 rows, each character in a cell of 8 by 10 pixels. It runs CP/M 2.2 with graphics extensions, and North Star's own NSDOS. It has slots for boards, and I added the ones that matter: a hard disk board in slot 6 and a serial board in slot 1. Both are off unless you ask for them, because a board in a slot changes what the slot ID ports return, and some software behaves differently.

## Is it right? Compare with the reference

An emulator that boots one disk can still be wrong in a hundred places. So I built a **golden harness**: a headless copy of NSAE that prints every port access, and I made the same scenario run in both programs and compared them.

- The boot of the PROM is 1.2 million port accesses over 600 frames. The traces match, except for the values that come from the floppy controller, which was a stub at that point.
- With the floppy controller done, four boot images (CP/M BASIC, DOS G BASIC, the diagnostic diskette and ADV2PC) give a port trace and a RAM dump after 2400 frames that are byte-identical to the reference.
- The write path is checked with a real guest: a CP/M session saves a file to drive A, and the resulting 358,400-byte image is byte-identical to the one the reference makes.
- The picture is checked against a second, independent renderer of the RAM dump.

The reference is not always right, and then I deviate on purpose and say so in the tests. Three examples:

- The reference never sets the **parity error flag**. The Advantage has a parity bit for each byte of main RAM, and the diagnostic diskettes of revision 2.2.0 test it at boot. Without a model of it, they stop at "Parity Circuit Failed". The emulator now tracks which bytes were written, and a read of a byte that was never written sets the flag. It costs 8 KB and about 2% of the speed, and a build can switch it off.
- The reference has **one head position for both floppy drives**. The CP/M BIOS remembers each drive's track and does not step a drive again when it selects it, so a copy from drive A to drive B wrote B's sectors at A's head position, onto the wrong tracks. I found it when a copy from A to B read back wrong and a copy inside A did not. Each drive has its own head now.
- The Z80 core had a bug in the undocumented instructions `DD CB d op` and `FD CB d op` with a register as target. The program counter moved on by 2 where the real CPU moves by 4, so the next bytes ran as code. It is fixed and tested.

## Screen, keyboard and sound in a web page

The screen is a bitmap of 640 by 240 pixels, one bit each. The emulator sends a changed picture as the changed rows only, 80 bytes each, and a client that falls behind skips pictures and gets a full one when it catches up. The web server is written by hand, about 400 lines for HTTP files, the WebSocket handshake and the framing. It serves only plain file names from its own folder, and it listens on `127.0.0.1` unless you ask otherwise.

The keyboard has two modes. The default types **by character**: each key types what is printed on it, so a Spanish keyboard works and Shift+2 gives `"`. The other mode sends the key position of an Advantage keyboard, which is a US layout. Only ASCII exists on the Advantage, so a character such as `ñ` is not sent, and the page says so. The Advantage has no cursor keys of its own: its cursors are the numeric keypad, so the arrow keys of the PC send those keypad codes.

Sound is the speaker toggled by the program. The reference puts every toggle at the start of the frame, which loses the pitch of anything faster than the frame rate. The emulator time-stamps each toggle with the cycle inside the frame, and the browser averages the level over each sample so that fast toggles do not alias. I checked it by capturing what the page schedules: the boot beep is 1920 Hz for half a second.

## What comes next

The next article is about disks: the two floppy image formats, mount modes that never lose a disk, the hard disk board, an inspector that reads the images from the command line, and a hard disk full of CP/M software. The source code is not public yet.
