+++
title = 'Nvidia Drivers on Ubuntu 20.04 (work notes)'
date = 2022-09-24T05:17:17+01:00
draft = false
tags = ['nvidia', 'ubuntu']
+++

# Install nvidia drivers ubuntu 20.04 / 22.04

hypervisor.cpuid.v0 -> FALSE in vmware

```sh
sudo apt install build-essential  libglvnd-dev
```

First Disable nouveau & enable unsuported GPU’s for open source drivers:
1. Go to: /etc/modprobe.d/
2. Make a file: blacklist-nvidia-nouveau.conf
3. Put this in the file:
```sh
blacklist nouveau
options nouveau modeset=0
```
4. Make a other “nvidia.conf” file and put this in the file: options nvidia 
```sh
NVreg_OpenRmEnableUnsupportedGpus=1
```
5. Updat kernel init ram fs: 
```sh
sudo update-initramfs -u
```
6. Uninstall intel microcode
```sh
sudo dpkg -l | grep intel
sudo apt purge intel-microcode
sudo update-grub
```
9. Reboot
10. Go to the Nvidia site to the page to download the driver that you want.
```sh
mkdir tmp & cd tmp
wget https://es.download.nvidia.com/XFree86/Linux-x86_64/515.76/NVIDIA-Linux-x86_64-515.76.run
```  
11. Copy the URL of the download butten and past it behind wget to download it to the current folder
12. Sudo chmod 700 the file
```sh
sudo chmod 700 NVIDIA*
```
14. Run the install file: sudo .\filename.run -m=kernel-open
15. After the instalation reboot the server
16. Test with nvidia-smi

```sh
sudo apt install nvidia-driver-470-server
sudo apt install nvidia-utils-470-server

sudo lshw -C display

  *-display
       description: VGA compatible controller
       product: SVGA II Adapter
       vendor: VMware
       physical id: f
       bus info: pci@0000:00:0f.0
       version: 00
       width: 32 bits
       clock: 33MHz
       capabilities: vga_controller bus_master cap_list rom
       configuration: driver=vmwgfx latency=64
       resources: irq:16 ioport:1070(size=16) memory:e8000000-efffffff memory:fe000000-fe7fffff memory:c0000-dffff
  *-display UNCLAIMED
       description: VGA compatible controller
       product: NVIDIA Corporation
       vendor: NVIDIA Corporation
       physical id: 0
       bus info: pci@0000:0b:00.0
       version: a1
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress vga_controller cap_list
       configuration: latency=64
       resources: memory:fc000000-fcffffff memory:d0000000-dfffffff memory:e4000000-e5ffffff ioport:5000(size=128)

```

List Drivers

```sh
 sudo apt search nvidia-driver
Ordenando... Hecho
Buscar en todo el texto... Hecho
nvidia-384/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-390

nvidia-384-dev/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-390

nvidia-driver-390/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  NVIDIA driver metapackage

nvidia-driver-418/focal 430.50-0ubuntu3 amd64
  Transitional package for nvidia-driver-430

nvidia-driver-418-server/focal-updates,focal-security 418.226.00-0ubuntu0.20.04.2 amd64
  NVIDIA Server Driver metapackage

nvidia-driver-430/focal-updates,focal-security 440.100-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-440

nvidia-driver-435/focal-updates 455.45.01-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-455

nvidia-driver-440/focal-updates,focal-security 450.119.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-450

nvidia-driver-440-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-450-server

nvidia-driver-450/focal-updates,focal-security 460.91.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-460

nvidia-driver-450-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver metapackage

nvidia-driver-455/focal-updates,focal-security 460.91.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-460

nvidia-driver-460/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-470

nvidia-driver-460-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-470-server

nvidia-driver-465/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-470

nvidia-driver-470/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA driver metapackage

nvidia-driver-470-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver metapackage

nvidia-driver-495/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-driver-510

nvidia-driver-510/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA driver metapackage

nvidia-driver-510-server/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver metapackage

nvidia-driver-515/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA driver metapackage

nvidia-driver-515-server/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver metapackage

nvidia-headless-390/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-418-server/focal-updates,focal-security 418.226.00-0ubuntu0.20.04.2 amd64
  NVIDIA headless metapackage

nvidia-headless-450-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-470/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-470-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-510/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-510-server/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-515/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-515-server/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage

nvidia-headless-no-dkms-390/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-418-server/focal-updates,focal-security 418.226.00-0ubuntu0.20.04.2 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-450-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-470/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-470-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-510/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-510-server/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-515/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

nvidia-headless-no-dkms-515-server/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA headless metapackage - no DKMS

xserver-xorg-video-nvidia-390/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-418-server/focal-updates,focal-security 418.226.00-0ubuntu0.20.04.2 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-450-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-470/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-470-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-510/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-510-server/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-515/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

xserver-xorg-video-nvidia-515-server/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA binary Xorg driver

```

```sh
sudo apt install nvidia-headless-515-server
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
Leyendo la información de estado... Hecho
Se instalarán los siguientes paquetes adicionales:
  binutils binutils-common binutils-x86-64-linux-gnu build-essential cpp cpp-9 dctrl-tools dkms dpkg-dev
  fakeroot g++ g++-9 gcc gcc-9 gcc-9-base libalgorithm-diff-perl libalgorithm-diff-xs-perl
  libalgorithm-merge-perl libasan5 libatomic1 libbinutils libc-dev-bin libc6-dev libcc1-0 libcrypt-dev
  libctf-nobfd0 libctf0 libdpkg-perl libfakeroot libfile-fcntllock-perl libgcc-9-dev libgomp1 libisl22
  libitm1 liblsan0 libmpc3 libnvidia-cfg1-515-server libnvidia-compute-515-server libpciaccess0
  libquadmath0 libstdc++-9-dev libtsan0 libubsan1 linux-libc-dev make manpages-dev
  nvidia-compute-utils-515-server nvidia-dkms-515-server nvidia-headless-no-dkms-515-server
  nvidia-kernel-common-515-server nvidia-kernel-source-515-server
Paquetes sugeridos:
  binutils-doc cpp-doc gcc-9-locales debtags menu debian-keyring g++-multilib g++-9-multilib gcc-9-doc
  gcc-multilib autoconf automake libtool flex bison gdb gcc-doc gcc-9-multilib glibc-doc bzr
  libstdc++-9-doc make-doc
Se instalarán los siguientes paquetes NUEVOS:
  binutils binutils-common binutils-x86-64-linux-gnu build-essential cpp cpp-9 dctrl-tools dkms dpkg-dev
  fakeroot g++ g++-9 gcc gcc-9 gcc-9-base libalgorithm-diff-perl libalgorithm-diff-xs-perl
  libalgorithm-merge-perl libasan5 libatomic1 libbinutils libc-dev-bin libc6-dev libcc1-0 libcrypt-dev
  libctf-nobfd0 libctf0 libdpkg-perl libfakeroot libfile-fcntllock-perl libgcc-9-dev libgomp1 libisl22
  libitm1 liblsan0 libmpc3 libnvidia-cfg1-515-server libnvidia-compute-515-server libpciaccess0
  libquadmath0 libstdc++-9-dev libtsan0 libubsan1 linux-libc-dev make manpages-dev
  nvidia-compute-utils-515-server nvidia-dkms-515-server nvidia-headless-515-server
  nvidia-headless-no-dkms-515-server nvidia-kernel-common-515-server nvidia-kernel-source-515-server
0 actualizados, 52 nuevos se instalarán, 0 para eliminar y 9 no actualizados.
Se necesita descargar 147 MB de archivos.
Se utilizarán 486 MB de espacio de disco adicional después de esta operación.
¿Desea continuar? [S/n]
Des:1 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 gcc-9-base amd64 9.4.0-1ubuntu1~20.04.1 [19,4 kB]
Des:2 http://es.archive.ubuntu.com/ubuntu focal/main amd64 libisl22 amd64 0.22.1-1 [592 kB]
Des:3 http://es.archive.ubuntu.com/ubuntu focal/main amd64 libmpc3 amd64 1.1.0-1 [40,8 kB]
Des:4 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 cpp-9 amd64 9.4.0-1ubuntu1~20.04.1 [7.500 kB]
Des:5 http://es.archive.ubuntu.com/ubuntu focal/main amd64 cpp amd64 4:9.3.0-1ubuntu2 [27,6 kB]
Des:6 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libcc1-0 amd64 10.3.0-1ubuntu1~20.04 [48,8 kB]
Des:7 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 binutils-common amd64 2.34-6ubuntu1.3 [207 kB]
Des:8 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libbinutils amd64 2.34-6ubuntu1.3 [474 kB]
Des:9 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libctf-nobfd0 amd64 2.34-6ubuntu1.3 [47,4 kB]
Des:10 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libctf0 amd64 2.34-6ubuntu1.3 [46,6 kB]
Des:11 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 binutils-x86-64-linux-gnu amd64 2.34-6ubuntu1.3 [1.613 kB]
Des:12 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 binutils amd64 2.34-6ubuntu1.3 [3.380 B]
Des:13 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libgomp1 amd64 10.3.0-1ubuntu1~20.04 [102 kB]
Des:14 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libitm1 amd64 10.3.0-1ubuntu1~20.04 [26,2 kB]
Des:15 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libatomic1 amd64 10.3.0-1ubuntu1~20.04 [9.284 B]
Des:16 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libasan5 amd64 9.4.0-1ubuntu1~20.04.1 [2.751 kB]
Des:17 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 liblsan0 amd64 10.3.0-1ubuntu1~20.04 [835 kB]
Des:18 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libtsan0 amd64 10.3.0-1ubuntu1~20.04 [2.009 kB]
Des:19 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libubsan1 amd64 10.3.0-1ubuntu1~20.04 [784 kB]
Des:20 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libquadmath0 amd64 10.3.0-1ubuntu1~20.04 [146 kB]
Des:21 http://es.archive.ubuntu.com/ubuntu focal-updates/main amd64 libgcc-9-dev amd64 9.4.0-1ubuntu1~20.04.1Loading new nvidia-srv-515.65.01 DKMS files...
Building for 5.4.0-126-generic
Building for architecture x86_64
Building initial module for 5.4.0-126-generic
Done.

nvidia.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/5.4.0-126-generic/updates/dkms/

nvidia-modeset.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/5.4.0-126-generic/updates/dkms/

nvidia-drm.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/5.4.0-126-generic/updates/dkms/

nvidia-uvm.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/5.4.0-126-generic/updates/dkms/

nvidia-peermem.ko:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/5.4.0-126-generic/updates/dkms/

depmod........

DKMS: install completed.
Configurando nvidia-headless-515-server (515.65.01-0ubuntu0.20.04.1) ...
Procesando disparadores para man-db (2.9.1-1) ...
Procesando disparadores para libc-bin (2.31-0ubuntu9.9) ...
Procesando disparadores para initramfs-tools (0.136ubuntu6.7) ...
update-initramfs: Generating /boot/initrd.img-5.4.0-126-generic
```

```sh
■ sudo apt search nvidia-utils
Ordenando... Hecho
Buscar en todo el texto... Hecho
nvidia-utils-390/focal-updates,focal-security 390.154-0ubuntu0.20.04.1 amd64
  NVIDIA driver support binaries

nvidia-utils-418/focal 430.50-0ubuntu3 amd64
  Transitional package for nvidia-utils-430

nvidia-utils-418-server/focal-updates,focal-security 418.226.00-0ubuntu0.20.04.2 amd64
  NVIDIA Server Driver support binaries

nvidia-utils-430/focal-updates,focal-security 440.100-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-440

nvidia-utils-435/focal-updates 455.45.01-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-455

nvidia-utils-440/focal-updates,focal-security 450.119.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-450

nvidia-utils-440-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-450-server

nvidia-utils-450/focal-updates,focal-security 460.91.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-460

nvidia-utils-450-server/focal-updates,focal-security 450.203.03-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver support binaries
nvidia-utils-460-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-470-server

nvidia-utils-465/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-470

nvidia-utils-470/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA driver support binaries

nvidia-utils-470-server/focal-updates,focal-security 470.141.03-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver support binaries

nvidia-utils-495/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  Transitional package for nvidia-utils-510

nvidia-utils-510/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA driver support binaries

nvidia-utils-510-server/focal-updates,focal-security 510.85.02-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver support binaries

nvidia-utils-515/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA driver support binaries

nvidia-utils-515-server/focal-updates,focal-security 515.65.01-0ubuntu0.20.04.1 amd64
  NVIDIA Server Driver support binaries


romheat@kim | ~
■ sudo apt install nvidia-utils-515-server
Leyendo lista de paquetes... Hecho
Creando árbol de dependencias
Leyendo la información de estado... Hecho
Paquetes sugeridos:
  nvidia-driver-515-server
Se instalarán los siguientes paquetes NUEVOS:
  nvidia-utils-515-server
0 actualizados, 1 nuevos se instalarán, 0 para eliminar y 9 no actualizados.
Se necesita descargar 336 kB de archivos.
Se utilizarán 1.047 kB de espacio de disco adicional después de esta operación.
Des:1 http://es.archive.ubuntu.com/ubuntu focal-updates/restricted amd64 nvidia-utils-515-server amd64 515.65.01-0ubuntu0.20.04.1 [336 kB]
Descargados 336 kB en 11s (31,8 kB/s)
Seleccionando el paquete nvidia-utils-515-server previamente no seleccionado.
(Leyendo la base de datos ... 80209 ficheros o directorios instalados actualmente.)
Preparando para desempaquetar .../nvidia-utils-515-server_515.65.01-0ubuntu0.20.04.1_amd64.deb ...
Desempaquetando nvidia-utils-515-server (515.65.01-0ubuntu0.20.04.1) ...
Configurando nvidia-utils-515-server (515.65.01-0ubuntu0.20.04.1) ...
Procesando disparadores para man-db (2.9.1-1) ...
´´´
