+++
title = 'The rmtdos Protocol: V1, My Improvements, and V2'
date = 2026-08-30T12:01:00+01:00
tags = ['retrocomputing', 'dos', 'networking', 'rmtdos', 'protocol']
description = "How the rmtdos protocol works, what was slow in the original V1 on an XT, the optimisations I made to it, and how the new V2 sends the screen."
draft = false
+++

This is a companion to the [article about rmtdos 0.2](/posts/2026/26_08_30_rmtdos_0_2_remote_dos_over_ethernet/), where I show what the fork adds. Here I go deeper into the protocol. I explain V1, the original one by Dennis Jenkins. Then I tell the improvements that I made to the V1 server on an XT and a 386. And at the end I describe V2, which replaces how the screen is sent.

## The frame

rmtdos does not use IP. Every packet is a raw Ethernet frame with the EtherType `80AB`, an rmtdos header of 12 bytes and a payload. All multi-byte numbers are big endian.

```
Ethernet header, 14 bytes:  destination MAC (6) | source MAC (6) | EtherType 80AB (2)
rmtdos header, 12 bytes:    signature 7B6E05B0h (4) | session_id (4) | payload_len (2) | pkt_type (2)
payload, 0 to 1,488 bytes:  depends on pkt_type
```

The signature is a fixed number that makes the receiver drop frames from another system that uses the same EtherType. The `session_id` is a random number that the client chooses, the server copies it into its replies, and the client ignores frames with another one. The largest Ethernet frame is 1,514 bytes, so the largest payload is 1,488. This number matters: a full 80x25 screen is 4,000 bytes, so it does **not** fit in one frame. It needs at least three.

## Protocol V1

The V1 packets are few:

| Type | Direction | Payload |
| --- | --- | --- |
| `PING` / `PONG` | both | any bytes, echoed |
| `STATUS_REQ` | client to server | empty |
| `STATUS_RESP` | server to client | video mode, page, rows, columns, cursor row and column |
| `SESSION_START` | client to server | empty |
| `VGA_TEXT` | server to client | a part of the screen |
| `INJECT_KEYSTROKE` | client to server | one or more keys, 4 bytes each |

**Finding the servers.** The client sends `STATUS_REQ` to the broadcast address every 2.5 seconds. Each server answers with its video mode and screen size, and the client uses the source address of each answer to build its list.

**Opening a session.** When you choose a server, the client sends `SESSION_START` and repeats it every 2 seconds. The server keeps a table of up to four sessions, a session being the pair (client MAC, session id). A new pair is added, a known pair only gets its time updated, and after about 10 seconds without a `SESSION_START` the session is removed. This is a **keepalive**. There is no "close" packet: when the client stops, the server stops sending 10 seconds later, and a lost keepalive does no harm because the next one comes 2 seconds later.

**Sending the screen.** The server cuts the screen into **groups of rows**, as many whole rows as fit in one frame. At 80 columns a row is 160 bytes, so nine rows fit, and an 80x25 screen has three groups of 9, 9 and 7 rows. The payload of `VGA_TEXT` is an 8-byte header (rows, columns, cursor row and column, an offset and a count) followed by the bytes of one group, copied from video memory. On each timer tick the server checksums each group, compares it with the checksum it sent last time, and sends the group if it differs or if the cursor moved. A screen that does not change costs only the checksums.

**Keys.** The client sends each key in BIOS format: scan code, ASCII value and the Shift/Ctrl/Alt flags. On the server the packet driver stores the frame in one of four receive buffers, and on the **next tick** the server calls the BIOS key injection (`INT 16h`, function `05h`) once for each key.

```
client                                    server (each 55 ms tick)
  | --- STATUS_REQ (broadcast) -------->   |
  | <-- STATUS_RESP ---------------------  |
  | --- SESSION_START ------------------>  |  all groups are "changed"
  | <-- VGA_TEXT group 0, 1, 2 ----------  |  the client has the whole screen
  | --- INJECT_KEYSTROKE "d" ----------->  |  next tick: INT 16h AH=05
  | <-- VGA_TEXT group with the "d" -----  |
  | <-- VGA_TEXT group 0 (cursor moved) -  |
```

## What was slow on an XT

V1 is simple and works well on a fast PC. On an IBM PC/XT (an 8088 at 4.77 MHz with an 8-bit card) it has problems:

1. A small change sends a large packet: one new character sends its whole group, about 1,474 bytes on the wire for 2 bytes of data.
2. A cursor move sends group 0, so typing a character sends two groups, about 2,950 bytes.
3. A scroll changes every row, so the server sends the whole screen, about 4,100 bytes, on every tick.
4. A lost packet is never repaired: there are no sequence numbers and the client cannot ask again.
5. Keys wait for the tick, up to 55 ms, and a burst of key packets can fill the four receive buffers.

The cost of the first three is **CPU time**, not network capacity. A 10 Mbit/s network carries 4 KB in about 3 ms. But the packet driver of an 8-bit NE1000 moves each byte to the card with a loop of 30 to 40 cycles, and the server does it **inside the timer interrupt**. While it sends, the DOS program does not run. With a scrolling screen, the DOS program kept 21% of the CPU.

## What I improved in V1

Before V2, I worked on the V1 server itself. This started in February 2026, with a port of the server from the BCC compiler to Open Watcom, and then each problem I met became a fix.

**The server that nobody could see (8086).** On an XT, the server did not answer the probes of the client. The timer handler ran my code **before** it passed the interrupt on to the BIOS, so the end-of-interrupt signal was not sent to the interrupt controller during my code. That blocked every hardware interrupt, including the network card. On a slow machine the packet driver needs the card's interrupts to finish a send, so there was a silent deadlock. The fix is a handler that **chains first**: it calls the BIOS handler (which sends the signal), and then runs my processing with interrupts enabled.

**A wasted `memset`.** Releasing a packet buffer cleared its whole data area. Removing it saves about 12,000 cycles for each packet on an 8086.

**A cheaper checksum.** The loop that sums the screen used `mov bx,[si] / add si,2 / loop`, about 46 cycles for each word. With `lodsw / dec cx / jnz` it is about 29, which saves about 34,000 cycles in a full scan of the screen.

**Per-group checksums.** The first version summed the whole screen on every tick. With a checksum for each of the three groups, a tick sums only about 360 words, instead of 2,000.

**A bug the optimisation caused.** Typing a space over a space changes nothing in video memory, so the checksum matched, the packet was skipped, and the cursor position, which travels in the same packet, never arrived. The server now remembers the last cursor position it sent and sends when it changes.

**Copy only what changed.** I tried one function that copies the screen and sums it in one pass. It looked faster, but on the 8086 it copied video memory on every tick, about 39 cycles for each word. Two passes win: first the checksum (about 10 cycles per word), then a `rep movsw` copy of only the dirty groups (about 1.3 cycles per word). A static screen dropped from about 16 ms to about 4 ms in the interrupt.

**Less stack.** On a 386, a version of the handler pushed nine registers on the caller's stack, which added memory traffic and used the stack of programs that have little of it. The registers are now saved on a private stack, and only one stays on the caller's, which brings its use from 24 bytes to 8.

These fixes helped, but they cannot change the protocol: a scroll still sent the whole screen. That is why V2 exists.

## Protocol V2

V2 keeps the frame layout, the search for servers, `PING`/`PONG` and the key packet. It changes the session start and how the screen is sent. There are three new packets:

| Type | Direction | Payload |
| --- | --- | --- |
| `V2_SESSION_START` | client to server | 1 byte: the version, 2. Sent every 2 s. |
| `V2_SCREEN` | server to client | the changes of the screen |
| `V2_RESYNC` | client to server | empty: "send me the whole screen" |

The payload of `V2_SCREEN` is an 8-byte header and a list of operations:

```
seq 2 | text_rows 1 | text_cols 1 | cursor_row 1 | cursor_col 1 | flags 1 | op_count 1
ROWS   01h, first_row, count, data     put `count` rows from `first_row`
SCROLL 02h, lines                      move all rows up by `lines`
```

The cursor is in the header of every packet, and FFh as the row means "hidden". A packet with no operations is only a cursor move, 8 bytes of payload. A scroll of one line is a `SCROLL 1` and one `ROWS` with the new bottom row: 173 bytes of payload, 199 on the wire, where V1 sent about 4,100.

**What the server does on each tick.** It reads the video state, makes a checksum of **each row** and compares it with the checksum of the row as the client has it. To find a scroll, it takes the first changed row and looks for its new checksum lower in the list of sent rows. It tries at most four distances, and keeps a scroll only if it explains more rows than "nothing moved", so blank or repeated rows are not taken for a scroll. Then it sends the changed rows as runs and the cursor if it moved. On every fourth scan it also marks one more row in turn, so a full 80x25 screen is sent again in about 5.5 seconds. That is the self-repair: a lost last packet, or a checksum collision, is corrected after a few seconds without any request. After one second without a change the server scans only every fourth tick, and a key or a cursor move brings it back to every tick. All sessions get the same packets, so the server scans and encodes once for all of them.

**Keys.** The key packet is the same, but the server writes the keys **directly into the BIOS keyboard buffer** when the frame arrives, not through `INT 16h` on the next tick. If the 15-key buffer is full, the keys wait in a queue of 32.

**What the client does.** It sends `V2_SESSION_START` every 2 seconds and asks for the whole screen with `V2_RESYNC`, repeated every second until a packet with the "full" flag arrives. For each `V2_SCREEN` it checks that `seq` is the number it expects, and if not, a packet was lost and it sends `V2_RESYNC`. The decoder checks the whole packet before it changes the screen, so a damaged packet changes nothing.

```
client                                   server
  | --- SESSION_START (version 2) ----->  |
  | --- RESYNC ------------------------>  |
  | <-- SCREEN seq 0, FULL, rows 0..8 ---  |
  | <-- SCREEN seq 1, rows 9..17 --------  |
  | <-- SCREEN seq 2, rows 18..24 -------  |  the whole screen
  | --- INJECT_KEYSTROKE "d" ----------->  |  into the BIOS buffer now
  | <-- SCREEN seq 3, cursor, row 24 ----  |
  |      ... seq 6 arrives, 5 is lost ...  |
  | --- RESYNC ------------------------->  |
  | <-- SCREEN seq 7, FULL ... ----------  |  repaired
```

## The numbers

First, the bytes on the wire for an 80x25 screen, by calculation:

| Event | V1 | V2 |
| --- | --- | --- |
| The cursor moves | 1,474 | 34 |
| One character typed | 2,948 | 197 |
| The screen scrolls one line | 4,102 | 199 |
| The whole screen (connect, resync) | 4,102 | 4,111 |
| The screen does not change, 1 s | 0 | about 250 |

The whole screen costs the same, and V2 gains on everything else. The cost of V2 is the last row: the refresh rows. Then the measured results on emulated PCs (an XT and a 386), as in the [article about the fork](/posts/2026/26_08_30_rmtdos_0_2_remote_dos_over_ethernet/): on the XT, a scrolling screen leaves the DOS program 55% of the CPU instead of 21%, and typing a command sends 77% fewer bytes. On the 386 the server costs only 1% to 2% of the CPU in both versions. These numbers come from the emulator and not from real hardware.

## Why V2 does not speak V1

I decided this on purpose. The server is a TSR, so every byte stays in memory, and `rmtdos.com` is already 2 KB larger (19,646 bytes against 17,558) with V2. Keeping the V1 screen code would cost about 0.5 KB more, as an estimate, for every user. And two versions at once would remove the gain: the server does one scan for all sessions, and with a V1 client connected it would have to run the V1 path as well, the very path that took the XT to 21%. The DOS client, `rmtcli.com`, is a COM program in one 64 KB segment and was never released with V1. I know of no other implementation, and both ends are built and released together, so the rule is simple: use a server and clients of the same version. If compatibility is ever needed, the version byte of `V2_SESSION_START` gives a clean way to add it without changing any packet format.
