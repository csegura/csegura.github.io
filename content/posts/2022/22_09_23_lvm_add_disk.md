+++
title = 'LVM Add Disk (work notes)'
date = 2012-09-23T00:00:00+01:00
draft = false
tags = ['lvm', 'disk', 'debian']
+++

# Introduction & Explanation (pasted)

Why LVM?

The reason why we love LVM is because when you need to increase the space it’s really easy. If you have vanilla EXT4 and you want to enlarge it, then you need to work out extents and at this point we feel it’s too complicated and technical. See here if you simply want to add a new EXT4 disk without LVM.

Below are the commands used to get the whole operation going.

If you can follow the commands you can do a TL;DR and get into the fast lane with adding new disks to Debian based distributions.

An actual breakdown is roughly as follows.

What they never explain to you are all the layers.

Here is a quick overview:

First you create a hardware disk if you’re using virtualisation.
If you have a box, you add a new hard drive with a Philips screwdriver.

– Then you create a partition table.
– Then you create a physical volume.
– Then you create a volume group
– Then you create a logical volume
– Then you make a file system, taking a note of the UUID
– Then you create a mount point
– Then you mount the drive
– Then you update the operating system to tell it about the new drive. This is done in /etc/fstab.

Did you get that? Can you repeat it?

Here is shortened way of explaining all the layers:

add hardware->sudo->fdisk->pvcreate->vgcreate->lvcreate->mfks->mkdir->mount->fstab

Now you are in the fast lane.

TL;DR commands used
``` sh
sudo -i
fdisk -l
fdisk /dev/sdc
   n [New partition]
   p [Primary partition]
   1
   default
   default
   w [Write changes]
pvcreate /dev/sdb1
vgcreate backup-vg /dev/sdb1
lvcreate -n lv_backup2 -l 100%FREE backup-vg
mkfs.ext4 /dev/backup-vg/lv_backup2
echo UUID=e6f1b700-1c3f-4f69-bc53-f0f3d6f36495 /mnt/backup2 ext4 defaults 0 2 >> /etc/fstab
mkdir /mnt/backup2
mount /mnt/backup2/
df -h
```
Here is an actual operation in progress, with the full output. Some irrelevant command outputs were removed:

```sh
$ sudo -i
[sudo] password for root-user:

FDISK 1

root@backup:~# fdisk -l

Disk /dev/sda: 2.95 TiB, 3221225472000 bytes, 6291456000 sectors
Disk model: QEMU HARDDISK 
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: AEDA4C48-8271-4F7A-9137-C9071ECB7D23

Device Start End Sectors Size Type
/dev/sda1 2048 4095 2048 1M BIOS boot
/dev/sda2 4096 2101247 2097152 1G Linux filesystem
/dev/sda3 2101248 6289062500 6286961253 2.9T Linux filesystem

Disk /dev/mapper/ubuntu--vg-ubuntu--lv: 2.95 TiB, 3218922799104 bytes, 6286958592 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

--- HERE IS THE NEW DISK ---

Disk /dev/sdb: 1 TiB, 1099511627776 bytes, 2147483648 sectors
Disk model: QEMU HARDDISK 
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
FDISK 2
root@backup:~# fdisk /dev/sdb

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0x90d7397a.

Command (m for help): n
Partition type
p primary (0 primary, 0 extended, 4 free)
e extended (container for logical partitions)
Select (default p):

Using default response p.
Partition number (1-4, default 1): 
First sector (2048-2147483647, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-2147483647, default 2147483647):

Created a new partition 1 of type 'Linux' and of size 1024 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.

PVCreate

root@backup:~# pvcreate /dev/sdb1
Physical volume "/dev/sdb1" successfully created.

VGCreate

root@backup:~# vgcreate backup-vg /dev/sdb1
Volume group "backup-vg" successfully created


LVCreate

root@backup:~# lvcreate -n lv_backup2 -l 100%FREE backup-vg
Logical volume "lv_backup2" created.

MKFS

root@backup:~# mkfs.ext4 /dev/backup-vg/lv_backup2
mke2fs 1.45.5 (07-Jan-2020)
Discarding device blocks: done 
Creating filesystem with 268434432 4k blocks and 67108864 inodes
Filesystem UUID: e6f1b700-1c3f-4f69-bc53-f0f3d6f36495
Superblock backups stored on blocks: 
32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
102400000, 214990848

Allocating group tables: done 
Writing inode tables: done 
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done

UUID

blkid
/dev/sda2: UUID="b570bb79-6498-4c95-b4cd-efc5338b815a" TYPE="ext4" PARTUUID="efa1aa79-9832-4b37-bf15-c722e30d495f"
/dev/sda3: UUID="1dMW6T-uAyN-aEpi-yZ53-q1Mt-bUkr-X66Duy" TYPE="LVM2_member" PARTUUID="4356c489-9e15-4df9-a207-135ec5f42b7e"
/dev/mapper/ubuntu--vg-ubuntu--lv: UUID="593de967-c297-4594-9e01-842506ffeb8f" TYPE="ext4"
/dev/loop0: TYPE="squashfs"
/dev/loop1: TYPE="squashfs"
/dev/loop2: TYPE="squashfs"
/dev/loop3: TYPE="squashfs"
/dev/loop4: TYPE="squashfs"
/dev/sda1: PARTUUID="f56abe26-0f3e-4a17-a5b0-d6e1257bf4c1"
/dev/sdb1: UUID="Bk1JcP-D6WY-ty6r-4oSD-IhJS-BREV-3Zasjc" TYPE="LVM2_member" PARTUUID="cee8ec6c-01"
/dev/mapper/data--vg-lv_data: UUID="71bde629-efbe-4004-bde8-84f63970c274" TYPE="ext4"

71bde629-efbe-4004-bde8-84f63970c274

APPEND TO FSTAB

sudo -i

(Do this manually to be safe, and do not use the echo command. Read this sentence carefully.)
root@backup:~# echo UUID=71bde629-efbe-4004-bde8-84f63970c274 /mnt/backup2 ext4 defaults 0 2 >> /etc/fstab

MKDIR

root@backup:~# mkdir /mnt/backup/

MOUNT

root@backup:~# mount /mnt/backup2/
DF (to check new space)
root@backup:~# df -h
Filesystem Size Used Avail Use% Mounted on
...
/dev/mapper/ubuntu--vg-ubuntu--lv 2.9T 2.4T 422G 86% /
.../dev/sda2 976M 298M 611M 33% /boot

/dev/mapper/backup--vg--lv_backup2 1007G 77M 956G 1% /mnt/backup2
```