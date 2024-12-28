+++
title = 'SparcStation Afternoon'
date = 2024-12-28
tags = ['retrocomputing', 'Sun', 'sparcstation5']
+++


![](https://imgur.com/1XN3Rmt.png)

Some pictures about second attempt to install T2/Sde 24.12 on my Sun SparcStation 5.

![](https://imgur.com/d3wvGAv.png)
![](https://imgur.com/dyvty0t.png)
![](https://imgur.com/LTi6lBz.png)
![](https://imgur.com/As35aCD.png)
![](https://imgur.com/ExKFBlQ.png)
![](https://imgur.com/vPRXQcX.png)
![](https://imgur.com/5bQTlyr.png)

And the final result, the system crashed during the installation, with the whatchdog timer error.

![](https://imgur.com/lgr1lmu.png)


# A Technical Overview of the Sun SPARCstation 5

The Sun SPARCstation 5 (commonly referred to as the SS5) is a workstation computer introduced by Sun Microsystems in 1994. It was part of Sun's highly successful SPARCstation family, which became renowned for their use in engineering, scientific computing, and other technical fields. The SS5 was built around Sun’s proprietary SPARC architecture and remains a notable example of 1990s workstation technology.

The SPARCstation 5 is based on the SPARC (Scalable Processor Architecture) architecture, a RISC (Reduced Instruction Set Computer) design developed by Sun Microsystems. The SS5 uses the **MicroSPARC-II** processor, which integrates many of the system’s core components to reduce cost and size.

### Key Specifications:

- **Processor**: MicroSPARC-II
  - Clock Speeds: Available in 70 MHz, 85 MHz, or 110 MHz versions.
  - Architecture: SPARC v8 32-bit RISC.
- **Memory**:
  - Up to 256 MB of RAM using 72-pin SIMMs.
  - Minimum supported memory is 16 MB.
- **Storage**:
  - Internal SCSI hard drive (up to 2 GB typical, larger drives supported with upgrades).
  - SCSI-2 interface for peripherals.
- **Graphics**:
  - Onboard graphics supported via an 8-bit framebuffer.
  - Optional upgrade to 24-bit graphics using the Sun TurboGX framebuffer.
- **Networking**:
  - Integrated 10Base-T Ethernet (RJ45 connector).
  - Support for external AUI networking.
- **Expansion**:
  - Two SBus slots for additional peripherals such as framebuffers or specialized I/O cards.

## Operating Systems

The SPARCstation 5 (code name Aurora) was designed to run **SunOS** (Sun’s BSD-based operating system) or **Solaris**, Sun’s System V-based UNIX operating system. Common versions of Solaris used on the SS5 include Solaris 2.5.1, 2.6, and Solaris 7.

There is also a NextStep 3.3 version, and Linux support was available at one time (Debian released versions compatible with this machine in the past).

## Hardware Design

The SPARCstation 5 features a compact, low-profile pizza-box chassis. This design made it stackable and convenient for workstation setups where multiple machines might be used simultaneously.

### Front Panel and Indicators

The front panel includes the power switch, LED indicators, and access to the floppy drive (1.44 MB) and internal CD-ROM (on some models).

### Connectivity

The rear panel offers a range of I/O options:

- Serial Ports: Two RS-232 compatible ports (ttyA and ttyB).
- Parallel Port: One Centronics-compatible parallel port.
- Keyboard and Mouse: Uses Sun’s proprietary Mini-DIN connectors.
- Audio: Includes 3.5mm jacks for audio in, out, and microphone.

## Serial Console Access

The SPARCstation 5 provides a serial console for system management and troubleshooting. To use the serial console:

1. Connect a null-modem cable to the serial port (ttyA or ttyB).
2. Use a terminal emulator (e.g., `screen`, `minicom`) on a connected computer with the following settings:
   - Baud rate: 9600.
   - Data bits: 8.
   - Parity: None.
   - Stop bits: 1.
3. Power on the system, and you’ll see output from the OpenBoot PROM.

## OpenBoot PROM

The SPARCstation 5 features the OpenBoot PROM firmware, which provides system diagnostics and low-level configuration. The PROM prompt (`ok`) can be accessed by pressing **Stop + A** on the keyboard or sending a Break signal over the serial console.

### Common PROM Commands:

- `printenv`: Displays environment variables.
- `setenv`: Modifies environment variables (e.g., `setenv boot-device disk`).
- `probe-scsi`: Lists devices on the SCSI bus.
- `boot`: Boots the system.
- `reset`: Reboots the system.


## Maintenance Tips

- **Replacing NVRAM**: The NVRAM chip (used for storing system configuration and MAC address) often fails due to depleted internal batteries. Replacing or reprogramming the chip is a common repair task.
- **Cooling**: Ensure the system’s fan is operational to avoid overheating.
- **Upgrades**: Adding RAM or upgrading to a faster MicroSPARC-II CPU can improve performance.

## Conclusion

My dearest old system is still working, it's a hard machine, NVRAM chip fails some times but mine is still in good conditions.

The Sun SPARCstation 5 represents a pivotal moment in the development of RISC workstations. Its blend of performance, expandability, and software support made it a popular choice in the 1990s. Today, it serves as both a nostalgic piece of computing history and a practical platform for exploring UNIX and SPARC architecture.

Currently I have installed NetBSD 9.3
