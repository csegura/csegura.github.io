+++
title = 'ISA-PicoMem'
date = 2024-06-05
tags = ['retrocomputing', 'ibmxt', 'hardware', 'electronics', 'isapicomem']
+++

I'm restoring this wonderful IBM XT 5150, machine powered up, but there wasn't os. Floppy drive was`t working, I tried to boot from a 720k floppy disk, but it was impossible. So looking for a solution, I found a ISA-PicoMem (https://github.com/FreddyVRetro/ISA-PicoMEM/tree/main) card, a wonderful card that allows you to boot from a SD card, add memory, and is able to connect to a network using wifi and ne2000 drivers, of course you need install mTCP.

I ordered it on march 2024, and it arrived on may 2024. It was a great solution for my problem. I'm very happy with it.

![ISA-PicoMem](https://imgur.com/ofRBe7F.jpg)

![ISA-PicoMem](https://imgur.com/s1e85DD.jpg)

Finally, I could boot from an image using the card, after that I tried to format the hard drive and the surprise is that it was working

[IBM Low level format](https://minuszerodegrees.net/ibm_xebec/ibm_xebec_llf_debug.htm)

{{< youtube Z7FveCJFdrc >}}


```sh
b>debug
-a 100
```

```asm
mov ax,705
mov cx,1
mov dx,80
int 13h
int 3   
-g=100
-f cs:1000 1200 0
-a 100
mov ah,0
mov dl,80
int 13h
mov ax,301
mov bx,1000
mov cx,1
mov dx,80
int 13h
int 3
-g=100
```
![Format1](https://i.imgur.com/XJqf66p.jpg)
![Format2](https://i.imgur.com/Xo4Ho5H.jpg)

## mTCP

![TCPIP](https://i.imgur.com/XkLLI3S.jpg)





