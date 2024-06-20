+++
title = 'Arduino car'
date = 2011-11-01T00:00:00+01:00
tags = ['electronics', 'arduino', 'car']
+++

I have been working on a project that involves controlling a car with an Arduino board. The car is made of a chassis, two motors, and a battery. The motors are connected to the Arduino board through a motor driver, which allows the Arduino to control the speed and direction of the motors using a wii nunchuck as a remote control. 

```c
#include <math.h>
#include "Wire.h"
#include "WiiChuck.h"
#include <Servo.h>
#include <RHMotor.h>

WiiChuck chuck = WiiChuck();

int joyX = 0;
int joyY = 0;

#define MOVING_MARGIN  50
#define ROTATE_MARGIN  50

int left_motor_pin = 7;
int right_motor_pin = 6;

RHMotor motor(left_motor_pin, right_motor_pin);

void setup()
{

  Serial.begin(9600);
  Serial.flush();

  Serial.println("Initialize chuck engine.");

  chuck.begin(1000);
  chuck.update();

  delay(1000);

  Serial.println("Completed.");
  Serial.println("Initialize motor engine.");

  motor.start(300);

  delay(1000);
  motor.stop();

  Serial.println("Completed.");
}

void loop()
{

  chuck.update();

  joyX = chuck.readJoyX();
  joyY = chuck.readJoyY();
  //Serial.print(joyX);
  //Serial.print(" ");
  //Serial.print(joyY);
  //Serial.println();

  if (millis()%1000 == 0)
    Serial.print(".");

  if (chuck.zPress() == 1) {
      Serial.println("Z Pressed");
      motor.stop();
  }

  if (joyY > MOVING_MARGIN)     {
    Serial.println("Fwd");
    motor.forward();
  } else if (joyY < 0-MOVING_MARGIN) {
    Serial.println("Bwd");
    motor.backward();
  }

  if (joyX > ROTATE_MARGIN){
    Serial.println("Right");
    motor.right(300);
  } else if (joyX < 0-ROTATE_MARGIN) {     
    Serial.println("Left");      
    motor.left(300);
  }

  if (chuck.cPress()) {
    int left = motor.getLeftServo().readMicroseconds();
    int right = motor.getRightServo().readMicroseconds();
    Serial.print(left);
    Serial.print(" ");
    Serial.println(right);
  }

  joyX = 0;
  joyY = 0;

  delay(20);
}
```

This is a sort video of the car in action:


{{< youtube XcwoJ0LBoUE >}} 
