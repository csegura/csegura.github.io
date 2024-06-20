+++
title = 'Polar RS300X GUI'
date = 2010-01-10T00:00:00+01:00
tags = ['c#', 'polar', 'rs300x', 'gui']
+++

Estas navidades el Olentzero, Santa Claus, Papa Noel ó uno mismo, vaya ud. a saber … me dejo un pulsometro Polar RS300x, uno de esos aparatitos que te miden las pulsaciones (para evitar que a los que nos vamos haciendo mayores nos dé un chunguito)

La verdad es que no está nada mal, viene con el transmisor WearLink que es la cinta que te atas en el pecho que se encarga de enviar la frecuencia cardiaca al reloj, con un sensor S1 que es un podómetro que te pones en la zapatilla y una vez calibrado, mide la distancia y la velocidad, y finalmente con el FlowLink que es un dispositivo USB a través del cual puedes enviar la información a una web para (www.polarpersonaltrainer.com) para mantener un histórico de las sesiones de entrenamiento.

![](/images/Sharepoint/RS300X_blk_front_240x298.jpg-550x0.jpg)
FlowLink_front_115x115.jpg-550x0
![](/images/Sharepoint/FlowLink_front_115x115.jpg-550x0.jpg)
s1_115x115.jpg-550x0
![](/images/Sharepoint/s1_115x115.jpg-550x0.jpg)
wearlink+_31coded_front_115x115.jpg-550x0
![](/images/Sharepoint/wearlink+_31coded_front_115x115.jpg-550x0.jpg)

El domingo día 3 calibre el sensor S1 recorriendo una distancia de 1km y después probé por los alrededores de mi casa a correr una distancia conocida y me quede impresionado, tan solo medio metro de diferencia. Una maravilla.

El lunes día 4 realice una sesión de entrenamiento y después subí los datos la web, usando el FlowLink y el software de sincronización que viene con el aparato.

Bueno, no es que este mal del todo, pero no se puede decir que la web sea una pasada. La cosa es que me pico el gusanito ese “f-geek” (freak-geek) que llevo dentro ..

De modo que me puse a buscar todo tipo de información acerca de cómo sacar los datos del dichoso relojito … y no encontré absolutamente nada (y mira que ha sido fácil)

Revisando el software de sincronización di con unas .dlls curiosas .. Polar.Transport.dll y Polar.Monitor.dll … que curiosamente están en .Net … también hay una biblioteca de más bajo nivel llamada libpolar.dll a la que las otras dos hacen refencia (Interop) ..

Bueno tras una revisión con el reflector encontré muchas, muchas cosas interesantes .. lo mejor es que me podía conectar al relojito y obtener los datos de las sesiones, de modo que en un primer paso realice un sencillo programita para exportar los datos a XML

Que bonito … en poco más de una hora tenía los datos …




Básicamente basta con crear un proyecto en VS y referenciar Polar.Monitor.dll (como internamente usa libpolar.dll) debéis aseguraros que libpolar.dll está también localizable.

Pero para no perder detalle aquí os dejo un video de cómo hacerlo…



La cosa es que me he liado un poco (¿Cómo no?) y me he metido a hacer un GUI que por el momento tiene este aspecto.

Permite ver un resumen de las sesiones

![](/images/Sharepoint/Polar1.png-550x0.png)


Permite analizar cada sesión (yo le he activado el modo Auto Lap, de modo que el pulsometro toma datos a cada KM) me muestra el tiempo empleado, la velocidad, la FC Max, y la FC Media. Además emparejo cada dato de FC con la Zona de trabajo.



En el gráfico, se puede ver la FC , la FC Max (puntitos rojos) y ambas dentro de sus zonas correspondientes. En el gráfico de velocidad, se puede ver la velocidad en Km/h y en min/km además la vuelta más rápida queda en verde y la más lenta en rojo.



Por último el gráfico de las Zonas, con el tiempo empleado en cada una de ellas en la sesión de entrenamiento.

![](/images/Sharepoint/Polar3.png-550x0.png)

Os dejo otro bonito video del programita … (que me he emocionaooo …)



Ya sabes si eres un f-geek de los ordenadores que además te gusta el running el Rs300x es una magnifica opción

355 Comments
