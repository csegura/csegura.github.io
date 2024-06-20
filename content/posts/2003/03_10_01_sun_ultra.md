+++
title = 'Sun Ultra'
date = 2003-10-01T00:00:00+01:00
tags = ['vintage', 'sun']
draft = false
+++

## Enredadndo con la Sun Ultra 1
 
Estas son algunas notas que he ido tomando mientras jugueteaba con una Sun Ultra 1 que adquirí recientemente en ebay por un módico precio (60€). La Ultra 1 será durante estos día mi juguetito (como yo lo llamo).  
  
**La Maquina.**  
  
![](/images/Enredadndo%20con%20la%20Sun%20Ultra%201%20-%20(code%20segment)/Sun_Ultra_1_frontal.jpg)

  
Bueno, por comprar barato, la maquina solo tiene 64Mb (veremos lo que da de si) y no tiene disco duro ni CDROM, con lo que tendré que volver a ebay para agenciarme un disco SCSI 3 con conector SCA.  

  

![](/images/Enredadndo%20con%20la%20Sun%20Ultra%201%20-%20(code%20segment)/Sun_Ultra_1_i2.jpg)
 
  
Para comprobar el estado le he conectado un cable serie (null MODEM) que me he tenido que hacer usando un cable serie normal y cambiando las conexiones de uno de los conectores de los pines 2 y 3 al 3 y 2, esto ha sido divertido ya que me di cuenta que debí dejar mi soldador a alguien y no me lo ha devuelto.  
  
(foto del cable)  
  
Una vez listo el cable, he conectado mi ordenador usando el hyperterminal (9660-N-8-1) como TTY de la Sun, para usar los comandos de OpenBoot y comprobar el estado de la misma.  
  
(pantallas del hyperterminal)  
  
[http://sunsolve.sun.com/handbook\_pub/General/OBP.html](https://web.archive.org/web/20160423181307/http://sunsolve.sun.com/handbook_pub/General/OBP.html)  
  
He estado jugueteando durante un rato con esto. Necesito ese disco con urgencia.  
  
**Sesión 2**  
  
He tenido que esperar a que llegará el disco unos días con lo cual no he podido jugar con la maquina. El disco 12€ + 5€ de portes.  
  
Instalación sin problemas, arranque del sistema sin problemas.  
  
Bueno ya tengo la maquinita con el disco, ahora tendré que instalarle algo para ver como va, en la página de Sun está el Solaris 9 gratis, así que me bajo 5 imágenes ISO que le lleva todo el día.  
  
Para instalarlos me he agenciado un CDROM SCSI, que me ha dejado un amigo, es un HP 9200 una regrabadora SCSI de Hewlett Packard, a la cual le pongo el ID 6 (necesario para el boot). Todo listo, mi cable serie, el disco, el cd, las imágenes que he volcado en varios CDs, ale vamos a instalar.  
  
**boot cdrom  
Disc does not contain an executable file**  
  
Tras varios intentos y pruebas me doy por vencido algo pasa aquí que de lo que no me estoy percatando, cojo el mejor manual del mundo “GOOGLE” y tras empaparme acerca del tema llego a la conclusión de que el CDROM no es compatible con las máquinas Sun (ya que este tiene los sectores de 2048bytes en vez de los 512bytes que usan las máquinas de Sun)  
  
Mi gozo en un pozo. ¿Qué alternativas tengo? Arrancar desde red. Esto puede ser muy interesante.  
  
Bien, me paso a mi máquina linux para configurarla como servidor de arranque, lo primero RARP, desastre el último kernel no lo incluye (al parecer alguien decidió quitarlo)  
  
Humm, esto se complica … encuentro unas instrucciones de cómo hacerlo con una Redhat 7.3 (buff donde estará aquella cajita tan graciosa yo compré una 7.3) nada.  
  
[http://www.znark.com/tech/netbootsparc.html](https://web.archive.org/web/20160423181307/http://www.znark.com/tech/netbootsparc.html)  
  
¿Y si instalo un solaris 9 para Intel en VMWare y lo utilizo como servidor de arranque para la Ultra? No se hable más a descargar las imágenes ISO x86 de Solaris….  
  
**Una noche más tarde  
**  
Jejeje, risa de listillo, Solaris 9 instalado es un poco cutre por que VMWare no soporta las X en una resolución aceptable joer… no ya esta  
  
[http://chitchat.at.infoseek.co.jp/vmware/solsvga.html](https://web.archive.org/web/20160423181307/http://chitchat.at.infoseek.co.jp/vmware/solsvga.html)  
  
Hay un tío que ha portado el driver de las X, ahhh esto es otra cosita…. A trabajar.  
  
Estos de sun lo tienn bien montado, en el disco 1 de la instalación de Solaris para Sparc, hay un par de utilidades que parece ser que lo hacen todo…  
  
**add\_install\_client** y **setup\_install\_server** ellos solitos copian la imanen del boot en un directorio tftp para poder arrancar, la renombran y añaden el arranque en /etc/bootparams  
  
Perfecto, además no pienso perder el tiempo en copiar el CD, creo un vinculo y a correr

  

[](http://www.sun.com/solutions/blueprints/0301/BuildBoot.pdf)


  
```sh  
#!/bin/sh  
  
PATH=/bin:/usr/sbin:/usr/ucb  
  
if \[ \`whoami\` != “root” \]; then  
echo “”  
echo “Must be root to run…Exiting.”  
echo “”  
exit  
fi  
  
if \[ $# != 1 \]; then  
echo “”  
echo “Usage: mount\_solaris\_cd.sh \[filename\]”  
echo “”  
exit  
fi  
  
PWD=\`pwd\`  
FILE=$1  
  
dd if=${PWD}/${FILE} of=${PWD}/vtoc bs=512 count=1 > /dev/null 2>&1  
OD=\`od -D -j 452 -N 8 < ${PWD}/vtoc\`  
CYLSTART=\`echo ${OD}|awk ‘{print $2}’\`  
COUNT=\`echo ${OD}|awk ‘{print $3}’\`  
SKIP=\`echo ${CYLSTART}\*640|bc\`  
NAME=\`echo ${FILE}|cut -d’.’ -f1\`  
dd if=${PWD}/${FILE} of=${PWD}/${NAME}-s1.iso bs=512 skip=${SKIP} count=${COUNT} > /dev/null 2>&1  
  
for share in s0 s1  
do  
if \[ ! -d /mnt/${share} \];then  
mkdir /mnt/${share}  
fi  
done  
lofiadm -a ${PWD}/${FILE} > /dev/null  
lofiadm -a ${PWD}/${NAME}-s1.iso > /dev/null  
mount -F hsfs -o ro /dev/lofi/1 /mnt/s0  
mount -F ufs -o ro /dev/lofi/2 /mnt/s1
```  
  

Para realizar una instalación desde la red necesitamos tener RARPD, TFTPD, BOOTPARAMD y NFSD instalados en una máquina, descargar las imagenes ISO de Suse Sparc 7.3 basta con el disco 1.  
  
Durante el proceso de arranque la máquina sun busca una dirección IP usando RARP, en la máquina que hace de servidor para la instalación tenemos que añadir en el /etc/ethers la dirección MAC del adaptador de la Sun con la IP que queremos asignarle, para ver la dirección MAC de la Sun basta con arrancar  
  
Sun Ultra 1 SBus (UltraSPARC 143MHz), No Keyboard  
OpenBoot 3.1, 64 MB memory installed, Serial #8796431.  
Ethernet address 8:0:20:86:39:f, Host ID: 8086390f.  
  
Añadimos o creamos el archivo /etc/ethers  

```    
#cat >> /etc/ethers  
8:0:20:86:39:f 192.168.99.112  
  
#cat >> /etc/hosts  
192.168.99.112 Ultra1  
  
#cat /etc/hosts  
192.168.99.111 slim  
192.168.99.112 Ultra1  
```  

Inicializamos el demonio rarpd si no esta iniciado  
  
#/etc/init.d/rarpd start  
  
Ahora tenemos que copiar la imagen del kernel en el directorio raiz del tftp que generalmente es /tftpboot hay que tener en cuenta que hay que asociar la IP que le hemos dado a la máquina con la imagen del kernel así como la imagen que necesitamos  
(tftp32.img parar sun4m o tftp64.img para sun4u).  
  
Para la Ultra-1 usaremos el tftp64.img  
  
```  
#ln -sf /cdrom/tftp/tftp64.img \`perl -e ‘printf(“%02X%02X%02X%02X\\n”,192,168,99,112);’\`  
```  

Con lo que tendremos un archivo llamado C0A86370 que es un vinculo a /cdrom/tftp/tftp64.img, de esta forma al arrancar la máquina adquirira la IP 192.168.99.112 según rarp y cargará el kernel mediante tftp.  
  
Ahora necesitamos un sistema de archivos que la máquina Sun pueda montar tras arrancar el kernel, para lo cual usamos nfs  
  
```  
#cat >> /etc/exports  
/cdrom (ro,no\_root\_squash)  
#/etc/init.d/nfs start
```  
  
Usaremos bootparams en /etc/bootparams para indicar el sistema de archivos que debe tomar la máquina al arrancar  

```  
#cat >> /etc/bootparams  
Ultra1 root=slim:/cdrom/boot  
```  

Por último arrancamos desde la red  
  
Sun Ultra 1 SBus (UltraSPARC 143MHz), No Keyboard  
OpenBoot 3.1, 64 MB memory installed, Serial #8796431.  
Ethernet address 8:0:20:86:39:f, Host ID: 8086390f.  
  
Ok boot net  
  
Y todo como la seda…

  

![](/images/Enredadndo%20con%20la%20Sun%20Ultra%201%20-%20(code%20segment)/terra_term_suse_73.gif)