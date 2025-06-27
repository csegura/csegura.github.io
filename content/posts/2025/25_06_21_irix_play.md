+++
title = 'IRIX Services'
date = 2025-06-21
tags = ['retrocomputing', 'irix', 'sgi']
+++

Recently the hard disk of my SGI O2 has failed, and I have been trying to recover the data from it. A long history of trying to recover the data, but finally I have been able to recover it. In the next days I have to explain how to use reanimatot to do a fresh install of IRIX.

Today I'm triying to recompile Vim 8.1 as I had before. While the system is working, I'm using telnet to connect to the O2 and run the commands. I want to enable SSH so I have been exploring the system services.

First ensure you are running almost tcsh if don't want suffer.

```sh
setenv TERM xterm
/bin/tcsh
```

## Checking Services

```sh
/sbin/chkconfig
/sbin/chkconfig service_name on
```

In my case I'm using neko_sshd, but you can use sshd too. For neko_sshd, you can use the following command to enable it:

`sudo chkconfig neko_sshd on` and edit the `/usr/nekoware/etc/sshd_config` 

add a sshd group and user account:

```sh
/usr/sysadm/privbin/addGroup -g sshd
/usr/sysadm/privbin/addUserAccount -l sshd -u 2222 -g 22 -S /bin/false -H /var/empty
passwd -l sshd
```

also you can add a user account for yourself editing `/etc/group` and `/etc/passwd` files.


## Generata the SSH host keys:

```sh
# Generate RSA key (highly recommended for compatibility)
ssh-keygen -t rsa -f /usr/nekoware/etc/ssh_host_rsa_key -N ""

# Generate DSA key (older, but some older clients might still use it)
ssh-keygen -t dsa -f /usr/nekoware/etc/ssh_host_dsa_key -N ""
```

## Check the SSHD configuration file

Under `/usr/nekoware/etc/sshd_config`, ensure the following lines are present:

We have generated only rsa and dsa keys, so we will comment the ecdsa key line:

```sh
# HostKey for protocol version 1
#HostKey /usr/nekoware/etc/ssh_host_key
# HostKeys for protocol version 2
HostKey /usr/nekoware/etc/ssh_host_rsa_key
HostKey /usr/nekoware/etc/ssh_host_dsa_key
#HostKey /usr/nekoware/etc/ssh_host_ecdsa_key
```

## Start Service

```sh
/etc/init.d/neko_sshd start 
```

hide sshd from login screen modify '/var/sysadm/config`

## Linux

`ssh -oHostKeyAlgorithms=+ssh-dss user@192.168.1.100` then add  `+ssh-dss` to your `~/.ssh/config` file.

If you see 

```sh
Unable to negotiate with 192.168.1.100 port 22: no matching key exchange method found. Their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1
```

I added the following to my ~/.ssh/config file to connect to my IRIX O2:

```sh
Host moose 192.168.1.100
    HostName 192.168.1.100
    User user
    HostKeyAlgorithms +ssh-rsa
    KexAlgorithms +diffie-hellman-group1-sha1
```


# IRIX Services Overview

## System Accounting & Auditing
- acct (off): The system accounting daemon. If enabled, it collects statistics on process usage, user activity, and resource consumption. This is typically used for system administration, capacity planning, or billing in multi-user environments.
- audit (off): The system auditing daemon. When on, it logs security-relevant events (e.g., login attempts, file access, privilege changes) for security monitoring and forensics.

## Networking Services
- appletalk (off): AppleTalk networking protocol support. Used for communication with Apple Macintosh computers. IRIX systems can act as AppleTalk file servers or print servers.
- autoconfig_ipaddress (off): Likely related to automatic IP address configuration, perhaps via DHCP or similar mechanisms.
- autofs (on): The automounter daemon. This service automatically mounts and unmounts remote file systems (like NFS shares) or local devices (like CD-ROMs) on demand, making them available when accessed and unmounting them when no longer in use. This saves resources and simplifies administration.
- automount (off): Similar to autofs, but sometimes an older or alternative automounting service. autofs is generally preferred.
- cesag (off): Could be related to a specific SGI or third-party service; less common in generic Unix.
- gated (off): The gated routing daemon. This service dynamically manages routing tables using various routing protocols (e.g., RIP, OSPF, BGP). If your IRIX system is acting as a router or participating in complex routing, this would be on.
- ipaliases (off): Enables the configuration of multiple IP addresses on a single network interface (IP aliasing). Useful for hosting multiple virtual hosts on a single server.
- isdnd (off): ISDN (Integrated Services Digital Network) daemon. Provides support for ISDN connections, which were a common digital telephony and data networking standard before widespread broadband.
- ldap (off): Lightweight Directory Access Protocol daemon. Used for accessing and managing distributed directory information services, often for user authentication or centralizing system configuration.
- mldaemon (off): Multilink PPP daemon. Used for aggregating multiple PPP links (e.g., ISDN channels) into a single logical connection for increased bandwidth.
- mrouted (off): Multicast routing daemon. Enables IP multicasting, which allows a single data stream to be sent to multiple recipients simultaneously.
- named (off): The DNS (Domain Name System) server daemon (BIND). If on, your IRIX system would be functioning as a DNS server, resolving domain names to IP addresses and vice-versa.
- network (on): A fundamental service that initializes the system's network interfaces, configures IP addresses, and sets up basic network connectivity. This is essential for any network communication.
- nfs (on): The Network File System (NFS) client service. This allows your IRIX system to mount and access shared filesystems from other NFS servers across the network.
- nfsd (on): The NFS server daemon. This allows your IRIX system to share its own file systems with other clients on the network. Together with nfs, it forms the core of NFS functionality.
- nds (off): Novell Directory Services (NDS) client/server. Used for integration with Novell's directory service, often seen in environments with Novell NetWare.
- ns_admin (off): Likely related to the Netscape Administration Server for managing Netscape web servers.
- ns_fasttrack (off): Likely the Netscape FastTrack web server.
nsd (on): The Name Switch Daemon. This daemon provides a unified interface for resolving various types of names (e.g., hostnames, user accounts, group names) using different underlying naming services (like DNS, NIS, or local files like /etc/hosts).
- proclaim_relayagent (off): Part of SGI's Proclaim (or Indigo Magic Desktop) environment, likely related to multimedia streaming or conferencing.
- proclaim_server (off): The server component for SGI's Proclaim.
- rarpd (off): Reverse Address Resolution Protocol daemon. Used for mapping hardware addresses (MAC addresses) to IP addresses, typically on diskless workstations.
- routed (off): The routing daemon. An older routing protocol daemon (often RIP) that dynamically updates routing tables. gated is a more advanced alternative.
- rsvpd (off): Resource Reservation Protocol daemon. Used for reserving network bandwidth for specific applications or services.
- rtmond (on): The Routing Table Monitor daemon. Monitors changes in the kernel's routing table and can react to them, potentially updating dynamic routes or other network configurations.
- rwhod (off): Remote Who daemon. Part of the r-commands suite, it broadcasts information about logged-in users, which can be a security risk and is rarely used on modern systems.
- sendmail (off): The Sendmail Mail Transfer Agent (MTA). If on, your system would be running a mail server, sending and receiving emails.
- sendmail_cf (off): Related to Sendmail's configuration files.
- snetd (on): SGI Network Services daemon. This is likely an SGI-specific daemon providing various network-related utilities or management features unique to IRIX.
- sshd (off): The Secure Shell (SSH) daemon. If on, it allows secure remote login and file transfer (SFTP/SCP) over an encrypted connection. Crucial for secure remote administration.
- tfxd (off): TrustFarm daemon (TFX). A security component related to trust management.
- timed (off): Time Synchronization daemon. An older protocol for synchronizing system clocks across a network. ntpd (NTP daemon) is the modern replacement.
- timeslave (off): Related to timed, operating as a time slave to a master time server.

## Desktop & User Interface Services
- desktop (on): Components related to the Common Desktop Environment (CDE) or a similar graphical desktop environment. This brings up the graphical user interface.
- dtlogin (off): The CDE graphical login manager. If on, it provides a graphical login screen for users.
- fontserver (off): Provides fonts to X Window System applications. If on, it centralizes font management.
- noiconlogin (off): Likely disables graphical icon-based logins, forcing text or traditional graphical logins.
- soundscheme (on): Manages audio event schemes within the desktop environment, playing sounds for system events (e.g., login, error).
- visuallogin (on): Related to the graphical login process, potentially enabling specific visual themes or elements.
- windowsystem (on): The X Window System itself. This is the foundational graphical environment that desktop, xdm, and other graphical applications rely on.
- xdm (on): The X Display Manager. This manages graphical login sessions and typically presents the login screen where users enter their username and password for a graphical session.

## File System & Storage Services
- array (off): Might be related to disk arrays (RAID) or specific storage management features.
- grio (off): Guaranteed-Rate I/O. An SGI technology for ensuring real-time performance for multimedia data streams by guaranteeing bandwidth to storage.
- grio2 (off): A newer version or extension of GRIO.
- lockd (on): The Network Lock Manager (NLM) daemon. Works with NFS to provide file locking across the network, preventing multiple clients from writing to the same part of a file simultaneously.
- lp (off): The line printer (printing) daemon. If on, it manages print queues and sends print jobs to printers.
- mediad (on): The media daemon. Responsible for auto-detection, mounting, and management of removable media devices like CD-ROM drives, tape drives, or other external storage.
- nostickytmp (off): A flag related to the /tmp directory. If "sticky" bit is removed, users can delete other users' files in /tmp (which is generally undesirable for security). Keeping it off usually means sticky bit is on.
- savecore (on): Manages the saving of system crash dumps (core dumps). After a system crash, this daemon writes the memory contents to a disk file for later analysis, crucial for debugging kernel panics.
- vswap (on): Related to virtual memory swapping. Ensures that the system's swap space (disk area used as extended RAM) is properly initialized and managed.
- xlv (off): XLV (Extensible Volume Manager). SGI's logical volume manager for creating and managing flexible disk volumes, similar to LVM in Linux.
Security & Authentication
- pam (off): Pluggable Authentication Modules. A framework that allows system administrators to choose how applications authenticate users (e.g., using local passwords, LDAP, NIS).
privileges (on): Likely refers to the management of system privileges or capabilities. This ensures that processes operate with the correct security permissions, especially for sensitive operations.

## Monitoring & Performance
- pmcd (off): Performance Metrics Collection Daemon (PCP). Part of SGI's Performance Co-Pilot (PCP) suite, which collects and archives system performance metrics.
- pmie (off): Performance Metrics Inference Engine (PCP). Used for real-time analysis and alarming based on performance metrics collected by pmcd.
- sar (off): System Activity Reporter. Collects and reports system activity information (CPU usage, memory, I/O, etc.) for performance analysis.
Web & Application Servers (Neko/SGI specific)
- sgi_apache (on): SGI's customized Apache HTTP Server. This means your system is configured to act as a web server, serving web pages or applications over HTTP. This is a significant service for any web-facing system.
- neko_apache (off): Another Apache web server instance, possibly from a different package or configuration, but currently disabled.
- neko_apache2 (off): A second Neko-packaged Apache, likely Apache 2.x.
- neko_clamd (off): ClamAV antivirus daemon (from the Neko package).
- neko_cups (off): CUPS (Common Unix Printing System) from the Neko package. A modern printing system.
- neko_cyrus_imapd (off): Cyrus IMAP server, for email retrieval (IMAP).
- neko_ldap (off): LDAP server from the Neko package.
- neko_mysql4 (off): MySQL database server version 4.x from the Neko package.
- neko_mysql5 (off): MySQL database server version 5.x from the Neko package.
- neko_pgsql (off): PostgreSQL database server from the Neko package.
- neko_proftpd (off): ProFTPD (FTP server) from the Neko package.
- neko_samba (off): Samba server from the Neko package, for Windows file and print sharing.
- neko_snmptrapd (off): SNMP trap daemon from the Neko package, for receiving SNMP traps (alerts) from network devices.
- neko_spamd (off): SpamAssassin daemon from the Neko package, for filtering spam email.
- neko_sshd (off): SSH daemon from the Neko package.
- webface (off): A web-based administration interface (SGI's WebFace).
- webface_apache (off): Apache server specifically for WebFace.

## Other / Less Common
- cluster (off): Support for high-availability or high-performance computing clusters.
- proxymngr (off): Proxy manager, likely for a caching or forwarding proxy server.
- quickpage (off): Could be a paging system or quick notification service.
- ts (off): Terminal Server or Time Server.


## My Services 

```
chkconfig sgi_apache off 
chkconfig webface_apache off 
chkconfig appletalk off
chkconfig timed off 
chkconfig timeslave off 
chkconfig esp off
chkconfig ipaliases off
chkconfig ypmaster off
chkconfig yp off
chkconfig sendmail off
chkconfig sendmail_cf off
chkconfig webface off
chkconfig named off
chkconfig rsvpd off
chkconfig privileges off
```

```
        Flag                 State               
        ====                 =====               

        autofs               on
        desktop              on
        lockd                on
        mediad               on
        neko_sshd            on
        network              on
        nfs                  on
        nfsd                 on
        nsd                  on
        rtmond               on
        savecore             on
        snetd                on
        soundscheme          on
        verbose              on
        visuallogin          on
        vswap                on
        windowsystem         on
        xdm                  on
        acct                 off
        appletalk            off
        array                off
        audit                off
        autoconfig_ipaddress off
        automount            off
        cesag                off
        cluster              off
        dtlogin              off
        esp                  off
        fcagent              off
        fontserver           off
        gated                off
        grio                 off
        grio2                off
        ipaliases            off
        isdnd                off
        ldap                 off
        lp                   off
        mldaemon             off
        mrouted              off
        named                off
        nds                  off
        neko_apache          off
        neko_apache2         off
        neko_clamd           off
        neko_cups            off
        neko_cyrus_imapd     off
        neko_ldap            off
        neko_mysql4          off
        neko_mysql5          off
        neko_pgsql           off
        neko_proftpd         off
        neko_samba           off
        neko_snmptrapd       off
        neko_spamd           off
        noiconlogin          off
        nostickytmp          off
        ns_admin             off
        ns_fasttrack         off
        pam                  off
        pmcd                 off
        pmie                 off
        privileges           off
        proclaim_relayagent  off
        proclaim_server      off
        proxymngr            off
        quickpage            off
        rarpd                off
        routed               off
        rsvpd                off
        rwhod                off
        sar                  off
        sendmail             off
        sendmail_cf          off
        sesdaemon            off
        sgi_apache           off
        sshd                 off
        tfxd                 off
        timed                off
        timeslave            off
        ts                   off
        webface              off
        webface_apache       off
        xlv                  off
        yp                   off
        ypmaster             off
        ypserv               off
```

