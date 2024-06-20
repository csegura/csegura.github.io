+++
title = 'Servo calibration'
date = 2011-11-01T00:00:00+01:00
tags = ['electronics', 'arduino', 'servo']
+++

Este experimento es para tratar de calibrar los servos que se van a usar como motores.

Este paso es importante ya que hay que encontrar el punto en el que el servo queda detenido.

Material -Un servo de rotación continua

Conexiones - Usar para el servo una salida con PWM

```c	
#include <Servo.h>
#define SERVO_PIN  6

Servo servo;
int velocity;
void setup()
{

    Serial.begin(9600);
    Serial.flush();

    // Initialize
    velocity = 0;

    servo.attach(SERVO_PIN);
}

void loop()
{
    // commands
    if ( Serial.available()) {
      char ch = Serial.read();
      switch(ch) {
        case 's':
          servo.write(0);
          servo.write(velocity);
          break;

        case 'a':
          velocity += 10;
          break;      
        case 'd':
          velocity -= 10;
          break; 
        case 'z':
          velocity += 1;
          break;      
        case 'x':
          velocity -= 1;
          break;   
        case 'f':
          servo.detach();
          servo.attach(SERVO_PIN);
          break;
        case 'q':
          velocity = 0;
          servo.write(velocity);
          break;
        case 'w':
          velocity = 90;
          servo.write(velocity);
          break;
        case 'e':
          velocity = 180;
          servo.write(velocity);
          break; 
      }
       Serial.print("> ");
       Serial.print(ch);
       Serial.print(" ");
       Serial.print(velocity);
       Serial.print(" ");
       Serial.print(servo.readMicroseconds());
       Serial.println();
  }
}

Resultados

Servo A

Stop 86 (momento en que el servo deja de meter ruidito)

Servo B

Stop 83