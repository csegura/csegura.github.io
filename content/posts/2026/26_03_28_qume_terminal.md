+++
title = 'Qume Terminal'
date = 2026-03-28
tags = ['retrocomputing', 'linux', 'qume', 'terminal']
+++

# Bringing a QVT terminal to life on Linux over USB serial

Vintage serial terminals are simple when everything matches, and maddening when one setting is off by a single bit. 

Recently, I got a Qume QVT-119 Plus terminal working as a serial console on Linux. The terminal is connected to a Raspberry Pi via a USB-to-serial adapter, and the Pi is running `agetty` to present a login prompt on the terminal.

Here are some notes on how the configuration works, why it works, and what each part of the setup is doing. This is a good example of how the terminal’s own settings and the Linux side have to be in sync for everything to work correctly.

I bought the terminal from a wallapop seller, and looks well, later I should check the keyboard (spacebar is a bit sticky).


| Aspect | Details |
|--------|---------|
| **Manufacturer** | Qume |
| **Model** | QVT-119 |
| **Introduced** | July 1985 |
| **Introductory Price** | $595 |
| **Interfaces** | RS-232C, 20 mA current loop, RS-422 |
| **Baud Rates** | 50, 75, 110, 134.5, 150, 300, 600, 1200, 1800, 2400, 3600, 4800, 7200, 9600, 19200, 38400 |
| **Display Size** | 14-inch |
| **Phosphors** | Green, amber |
| **Refresh Rates** | 60 Hz, 50 Hz |
| **Screen Modes** | 80x24, 132x24 |
| **Status Line** | Yes |
| **Emulation Personalities** | ADDS Viewpoint A2, Wyse WY-50 |

Mine is the amber one

![qume 119](https://i.imgur.com/zxUZ32r.jpg)


I connected it to a Raspberry Pi via a USB-to-serial adapter, and configured the terminal and Linux side to match each other. The terminal is set to emulate a Wyse 50, and Linux is using `agetty` with the `wy50` terminal type. The serial settings are 38400 baud, 8 data bits, no parity, 1 stop bit (38400 8N1), and CR/LF translations are disabled.

It's require a null modem cable, because the terminal is DTE and the USB serial adapter is also DTE, so a straight-through cable would not work. A null modem cable crosses the transmit and receive lines, allowing the two DTE devices to communicate properly.

![Connection](https://i.imgur.com/DfscHyA.jpg)

Here is the terminal configuration I used

```text
terminal configuration:
set 1  FDX | CONV | 80 COL | EM WYSE50 | KB ON | BCOPY | MON OFF | GRAPH OFF
set 2  JUMP | REPEAT ON | CLICK ON | MARGIN BELL OFF | EDM US / CR
set 3  LINE WRAP ON | CR = CR | SCROLL ON | XON & DTR | LIMITED X MIT OFF
set 4  EIA=HOST | 8BITS | BIT8 0 | PAR OFF | PAR ODD | STOP 1 | RX 38.4 | TX 38.4
set 6  SPLIT MODE ON | STD VID | RET ENTER CR/CR | PROT=REV | DISPLAY PE ON
set 7  CURSOR BLICK STEADY | TIME 5 | KB SP | STATUS ON | FREQ 60 | RS232
set 8  STD | CLOCK OFF | ALARM OFF
set 9  SCREEN SIZE 24 | PAGE ATTR | CHAR ISO7
```

**`EM WYSE50`**

That means the terminal is pretending to be a **Wyse 50**. On the Linux side, the matching choice is exactly what you used: `wy50` as the terminal type in `agetty`. That is the reason programs like `vi`, `less`, `mc`, `top`, or `htop` have a chance to behave correctly. Linux has a `wy50` terminfo entry, and that entry describes an 80-column, 24-line terminal with the escape sequences expected for that personality. 

The next important block is the electrical/serial one:

**`8BITS | PAR OFF | STOP 1 | RX 38.4 | TX 38.4 | RS232`**

That is the classic **38400 8N1** serial framing: 38,400 bps, 8 data bits, no parity, 1 stop bit. In Linux terms, `cs8` means 8-bit characters, `-parenb` disables parity, and `-cstopb` means one stop bit rather than two. Those are exactly the same choices you set with `stty`.

A small odd-looking detail is this line:

**`PAR OFF | PAR ODD`**

That usually means the menu is showing both the **parity enable state** and the **parity flavor**. If parity is off, the odd/even choice is effectively dormant. In other words, **`PAR OFF` wins**, and `PAR ODD` is just the remembered subtype that would apply only if parity were enabled. That interpretation also matches your Linux side, where `-parenb` disables parity entirely.

**`CHAR ISO7`**

`CHAR ISO7` belongs to the **display/character interpretation layer**: it tells the terminal which character repertoire to use once bytes arrive. So it is completely possible, and often correct, to run the wire as **8-bit clean** while still using a **7-bit character set personality** on the screen. That is what you are doing here: the terminal is receiving 8-bit bytes, but it is treating them as ISO-646 (7-bit ASCII) characters. That is a common setup for serial terminals, and it matches the `wy50` terminfo entry, which also assumes a 7-bit character set. 

## Raspberry Pi 

Raspberry side, I have a systemd service that starts `agetty` on the USB serial port with the correct settings:

First I set the serial port settings with `stty`:

```bash
sudo stty -F /dev/ttyUSB0 38400 cs8 -parenb -cstopb -ixon -ixoff -icrnl -inlcr -igncr -opost
```


- `38400 cs8 -parenb -cstopb` sets the port to 38400 baud, 8 data bits, no parity, 1 stop bit, which matches the terminal’s own serial settings.

- `-ixon -ixoff` tells Linux **not** to interpret XON/XOFF flow control in software. In the `stty` documentation, `ixon` enables XON/XOFF flow control and `ixoff` enables sending start/stop characters; disabling both makes the host treat the line as ordinary data instead of control-by-byte.

- `-icrnl -inlcr -igncr` disables carriage-return/newline translations on input, and `-opost` disables output post-processing. That matters on old terminals because automatic CR/LF rewriting is a common source of double-spacing, missing carriage returns, or strange cursor movement. The `stty` and `termios` documentation both show these flags as part of the path toward a raw, translation-free connection.

One thing that may look contradictory is that the terminal menu says **`XON & DTR`**, while Linux has `-ixon -ixoff`. In practice, that is not unusual. The terminal may be *capable* of software flow control or may advertise a combined host-flow-control mode, but the link can still work fine with Linux treating the line as a plain local serial connection. In your case, the evidence is simple: the line works reliably as configured, so the working behavior is more important than the label.


## `agetty` 

```ini
[Service]
Environment=LANG=C
ExecStart=-/sbin/agetty -L -8 38400 %I wy50
Type=idle
Restart=always
UtmpIdentifier=%I
TTYPath=/dev/%I
TTYReset=yes
TTYVHangup=yes
KillMode=process
IgnoreSIGPIPE=no
SendSIGHUP=yes
```

`agetty` is the program that opens a tty, prompts for a login name, and then invokes `/bin/login`. It is specifically meant for local and serial login lines. It can also adapt tty settings when reading the login name, and it supports both parity-handling and 8-bit-clean serial lines. 

Important here is ExecStart, which is the command line that starts the getty process.


```bash
/sbin/agetty -L -8 38400 %I wy50
```

- `-L` means **local line**. In `agetty`, that forces the line to behave as a local connection and not require carrier detect. That is often exactly what you want for a directly attached terminal on a USB-to-serial adapter, because many such setups do not present proper modem-control signaling. 

- `-8` tells `agetty` to assume the tty is **8-bit clean** and to disable parity detection. That matches your terminal’s `8BITS` and `PAR OFF` settings. `38400` sets the login speed. And the final `wy50` is the value that becomes the session’s `TERM`, inherited by `login` and the shell. 


## What the systemd service is doing

Systemd service `serial-getty@ttyUSB0.service`, is the standard systemd pattern for serial login prompts. Systemd’s getty generator exists specifically to start `serial-getty@.service` on serial-capable consoles. 

The `[Unit]` (not here) section is mostly about dependency logic. `BindsTo=dev-%i.device` makes the service strongly tied to the device unit, so if the USB serial adapter disappears, the service goes away with it. `After=dev-%i.device` means systemd waits until that device exists before trying to start the login prompt. `Before=` and `Conflicts=` are standard systemd ordering and exclusion controls: `Before=` defines startup order, while `Conflicts=` means two units should not be active together. The `[Install]` section is not used at runtime; it is used by `systemctl enable` to hook the unit into a target, which is what `WantedBy=getty.target` is doing here. 

In the `[Service]` section, `Type=idle` is there mostly for presentation. Systemd says `idle` delays the actual execution until active jobs have been dispatched, which helps avoid ugly interleaving with boot messages on the console. `Restart=always` means the getty will be started again whether it exits cleanly or not, which is exactly what you want for a login prompt that should always come back after logout. 

`TTYPath=/dev/%I` tells systemd which tty this service owns. `TTYReset=yes` resets the terminal before and after execution, and `TTYVHangup=yes` disconnects other clients that may still have the tty open. Those settings are useful with serial terminals because they help you return to a clean prompt after logouts, crashes, or half-broken sessions. 

`KillMode=process` and `SendSIGHUP=yes` control shutdown behavior. Systemd documents `KillMode=process` as killing only the main process, and `SendSIGHUP=yes` as sending SIGHUP to remaining processes after the main kill signal, which is useful for shells and shell-like programs because it tells them the connection has gone away. 

## Reading your terminal menu, one block at a time

A few of these abbreviations are vendor-specific, and I could not find the exact setup manual page for these exact labels, so this section is partly interpretation from standard terminal terminology and from your working behavior.

**Set 1** is the identity block. `FDX` means full duplex, which is what a normal UNIX login wants. `80 COL` matches the standard `wy50` layout. `EM WYSE50` is the big one. `KB ON` is keyboard enabled. `GRAPH OFF` likely means special graphics mode is disabled, which is fine for plain text UNIX use.

**Set 2** looks like usability behavior. `JUMP` probably means jump scrolling rather than smoother line-by-line scrolling. `REPEAT ON` is key repeat. `CLICK ON` is keyboard click. `MARGIN BELL OFF` disables the warning beep near the right margin. `EDM US / CR` looks like an editing or keyboard-country/return behavior setting.

**Set 3** is screen and flow behavior. `LINE WRAP ON` is what most shells expect. `CR = CR` suggests carriage return is being handled literally. `SCROLL ON` is obvious. `XON & DTR` is the only line that looks looser than your Linux side, but clearly it is not preventing operation.

**Set 4** is the real serial layer. `EIA=HOST` means the serial interface is attached to the host connection. `8BITS`, `PAR OFF`, `STOP 1`, `RX 38.4`, `TX 38.4`, and `RS232` are the settings that absolutely must match Linux, and they do.

**Set 6–9** are mostly presentation and local terminal features. `SPLIT MODE ON` and `STATUS ON` fit the published QVT-119 Plus feature set, which includes split-screen/status-line style capabilities. `SCREEN SIZE 24` and your `wy50` terminal type are also consistent with the standard 80x24 expectation. 

## Why this is a good configuration

The reason this setup feels “right” is that it follows an old but very reliable rule:

**wire format on the serial side, terminal personality on the application side**

On the wire, I'm using a plain, conservative serial link: **38400 8N1, no translations, no output processing**. In the session, I'm advertising a known terminal personality: **Wyse 50**. That keeps the serial driver honest and gives programs a real terminal description to work with. `agetty` is doing exactly what it was designed to do on such lines, and Linux has a real `wy50` terminal description in `terminfo`. 
