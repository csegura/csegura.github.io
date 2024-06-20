+++
title = 'Fonera Serial'
date = 2011-02-01T00:00:00+01:00
tags = ['electronics', 'fonera', 'serial']
+++

Material - Un router la fonera.

![](/images/Electronics/Fonera_serial1.jpg)

![](/images/Electronics/Fonera_serial2.jpg)

![](/images/Electronics/Fonera_serial3.jpg)


Código
Una vez establecidas las conexiones usando el terminal pordemos acceder al puerto serie de la fonera via el arduino.

He instalado el openWrt Instalando openWrt Kamikaze (me ha gustado más que el ddwrt) ademas me deja casi 4Mb libres en la memoria de la fonera y he instalado algunos paquetes que me han interesado.

Aunque he estado enredando con el el ser2net (ser2net) al final he optado por el netcat, me explico.

con netcat se puede crear un servidor y emular lo que hace el ser2net ..  básicamente

`netcat -l -p 5000 < /dev/ttyS0 > /dev/ttyS0`

haría poco  más o menos lo que el ser2net, buff el tiempo que llevaba sin tocar nade de *ix

bueno lo que se me ha ocurrido es meter un script entre medio de modo que desde el arduino puedo enviar comandos simples que son procesados por el script, el script está escrito en bash, (con el ash no me aclaraba) de modo que puedo enviar desde el arduino comandos más avanzados por ejemplo TW:mensaje para actualizar el twitter

`serial.println("TW:mensaje para twitter");`

en la fonera se ejecuta esto como un demonio* 

`netcat -v -t -l -p 5000 < /dev/ttyS0 | tee /dev/ttyS0 | ./simple.sh`

el script simple.sh  (básico)

```bash
#!/bin/bash
function twitter_update {
 curl -u apololem:nonenone -s -n -d "status=$param" $1 &>/dev/null
}
while read inputline
do
  cmd="$(echo $inputline | cut -d: -f1)"
  param="$(echo $inputline | cut -d: -f2)"
  echo "$inputline" >&2
  echo "CMD = $cmd -- PARAM = $param" >&2
  if [ "$cmd" = "TW" ]; then
     twitter_update http://twitter.com/statuses/update.xml
  else
     echo "$inputline"
  fi
done
```

voila .. se pueden hacer millones de cosas .. mi cabeza es un hervidero no hay limites ...

A diferencia de los módulos wifi, nosotros tenemos que escribir las comunicaciones a pelo, de esta manera usando bash, perl o python lo que se quiera poner, podemos tener un avanzado sistema de comunicaciones con nuestro arduino.