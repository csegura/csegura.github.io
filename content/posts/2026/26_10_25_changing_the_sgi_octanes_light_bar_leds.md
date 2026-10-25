+++
title = 'Changing the SGI Octane’s Light-Bar LEDs'
date = 2026-10-25
tags = ['retrocomputing', 'sgi', 'electronics', 'led', 'repair']
draft = true
+++

## A small change to an SGI workstation

I changed the indicator LEDs in my SGI Octane’s light bar. I chose blue LEDs and added two resistors to keep their current within a safe range.

The light bar is a narrow assembly in the front of the case. Its lights make the computer’s status visible from the outside. I wanted to replace the dead lights and give them a blue glow.

## Opening the light bar

I opened the white plastic light-bar housing and removed its circuit board. A circuit board is a flat support that holds electronic parts and connects them with copper paths. This board has four white caps over the light positions. The caps help cover or diffuse the light.

![Disassembled white computer light-bar housing with green circuit board and four caps.](https://i.imgur.com/EwHw2Bu.jpeg)

The housing is marked “013-0918-001 REV C.” The board reads “94V-0 034-0949-001,” with other small codes nearby. The parts look intact, but lights don´t work as intended.

![Two small indicator-light components resting on blue-gray fabric.](https://i.imgur.com/1MRk1uI.jpeg)


Here is a closer look at the board, with its copper paths, solder pads, and metal leads. Solder is a metal used to make electrical connections between components and a board.

![Close-up of a marked green circuit board with protruding metal leads.](https://i.imgur.com/kkcnlHP.jpeg)

The board has a rough-looking edge and some residue near its solder points. I do not see clear evidence of major damage. The labels and markings are useful clues, but they do not identify the board’s maker.

## Choosing a resistor for the blue LEDs

An LED is a light-emitting diode: an electronic part that gives off light when current flows through it in the correct direction. LEDs have a positive and a negative lead, so polarity matters. The positive lead on the Radio Shack LEDs I used is longer. I kept track of that when fitting them.

The blue LED I chose is rated at 3.7 volts, 20 milliamps.

The light-bar board supplies 5.14 volts at the place where I planned to connect the LEDs. That is higher than the blue LED’s 3.7-volt rating. A resistor limits current, helping prevent the LED from receiving too much. Too much current can shorten its life, sometimes to only a few hours.

I calculated the minimum resistance using the supply voltage, the LED voltage, and the target current:

(5.14 - 3.7) / 0.02 = 72 ohms

The result is 72 ohms. I used an 82-ohm resistor to leave some margin below the LED’s 20-milliamp limit. In this calculation, the expected current is about 17.6 milliamps: (5.14 - 3.7) / 82. Actual current can vary with the LED and circuit, so this is an estimate rather than a precise measurement.

## Testing before fitting the board

Before fitting the LEDs, I tested them on a solderless breadboard. The photo shows blue and amber LEDs lit, along with resistors and jumper wires. I was indecisive about the color choice and wanted to see how each would look in practice before committing to the final selection.

![Blue and amber LEDs glowing in a breadboard test circuit.](https://i.imgur.com/Fp8OfnQ.jpeg)

The temporary circuit let me compare the LEDs and see how they looked with resistors. The blue and amber lights are bright in the dim photo, but the camera cannot show how they look in normal room light. I chose blue for the Octane. I wanted it to be bright enough for my desk at home, and I expect it will also work in most offices.

Finally I added a 220-ohm resistor to the temporary circuit to see how it affected the LED brightness. The LED became noticeably dimmer, confirming that the resistor value has a significant impact on the light output.

## Soldering the replacement LEDs

The next photo shows two blue LEDs fitted at the board positions marked DS1 and DS2. These markings identify the LED locations on the board. The blue LED lenses are rounded, and their leads extend above the board.

![Two blue LEDs soldered to a board labeled DS1 and DS2.](https://i.imgur.com/4kgB3rW.jpeg)

The solder joints look uneven, but I do not see an obvious break in the board. The image does not clearly show the resistors, so I cannot confirm their positions from this view. The board appears to be the Octane light-bar board based on the project context, though no SGI name is visible on it.

I added two resistors for the two LEDs. Each resistor limits the current through its LED. The close-up shows blue-bodied, banded resistors beside the LEDs. The bands are used to mark a resistor’s value, but I cannot read them clearly in the photo. <!-- TODO: confirm the resistor values visible on the finished board -->

![Two blue LEDs and resistors soldered to a narrow circuit board.](https://i.imgur.com/4Y3psvV.jpeg)

This is a simple circuit change, but the details matter. The LEDs must face the correct way, and the resistors must be in the circuit so the LEDs do not draw excessive current. I used 82-ohm resistors because that gave me a balance between safe current and useful brightness. I also wanted the light to suit a desktop environment, rather than be as bright as possible.

## Fitting the light bar back into the Octane

The last photo shows two blue LEDs inside the opened white light-bar housing on the Octane’s front panel. The housing sits below the black ventilation grille. There is some dust and wear around the surrounding metal, but no obvious major damage.

![Two blue LEDs fitted inside an opened white light bar on a gray computer case.](https://i.imgur.com/8PRSSzJ.jpeg)

 The completed assembly looks like a practical update to a small part of the workstation. I chose the blue LEDs for their appearance, but the resistor choice was also important. Without suitable current limiting, the LEDs could be damaged quickly.

![Final](https://imgur.com/gallery/changing-dead-leds-on-sgi-octane-01ZpxjS#ogAfJ1F)