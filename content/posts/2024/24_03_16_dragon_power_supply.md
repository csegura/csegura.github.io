+++
title = 'Fixing Dragon 32 Power supply'
date = 2024-03-16
tags = ['retrocomputing', 'dragon', 'electronics', 'hardware']
+++

This morning the Dragon 32 power supply broke. I have a Dragon 32 that I bought one time ago. But when I tried to turn it on, it didn't work. I checked the power circuit inside of the Dragon 32 and found that the regulator was broken.

It was a LM340T 7812, 12v regulator, so I replaced it with a new one. But when I tried to turn it on, it didn't work. 

![PS Dragon 32](https://i.imgur.com/Po0bQ0U.jpg)

And LM7905CT 5v regulator was broken too. So I replaced it with a new one. But when I tried to turn it on, it didn't work.

Then I checked the power supply and found that it has two fuses (inside of yellow pipes) 

![PS Dragon 32](https://i.imgur.com/sXOYMZY.jpg)
![PS Dragon 32](https://i.imgur.com/CscXpye.jpg)

The power supply schematic is:

![PS Schema](https://i.imgur.com/wFs5ybp.png)

Power supply connector is a db9 female connector

![PS Conector](https://i.imgur.com/d6YyZ8o.jpg)

After replace the fuses, the Dragon 32 worked fine. I was happy to have a working power supply for my Dragon 32.
