+++
title = 'Arduino LC24XX EPROM'
date = '2011-03-03T00:00:00+01:00'
tags = ['electronics', 'arduino', 'eprom']
+++

Código

El código que amplia la biblioteca Wire para usar EEPROMs 24lcXX
http://www.arduino.cc/playground/Code/I2CEEPROM

La biblioteca Wire
http://arduino.cc/en/Reference/Wire

```c	
#include <Wire.h>
void I2C_eeprom_write_byte( int deviceAddress, unsigned int address, byte data )
{
  int rdata = data;
  Wire.beginTransmission(deviceAddress);
  Wire.send((int)(address >> 8));    // MSB
  Wire.send((int)(address & 0xFF));  // LSB
  Wire.send(rdata);
  Wire.endTransmission();
  delay(10);
}
void I2C_eeprom_write_page( int deviceAddress, unsigned int addressPage, byte* data,  byte length )
{
  Wire.beginTransmission(deviceAddress);
  Wire.send((int)(addressPage >> 8));   // MSB
  Wire.send((int)(addressPage & 0xFF)); // LSB
  byte c;
  for ( c = 0; c < length; c++)
    Wire.send(data[c]);
  Wire.endTransmission();
}
byte I2C_eeprom_read_byte( int deviceAddress, unsigned int address )
{
  byte rdata = 0xFF;
  Wire.beginTransmission(deviceAddress);
  Wire.send((int)(address >> 8));   // MSB
  Wire.send((int)(address & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(deviceAddress,1);
  if (Wire.available()) rdata = Wire.receive();
  return rdata;
}
void I2C_eeprom_read_buffer( int deviceAddress, unsigned int address, byte *buffer, int length )
{
  Wire.beginTransmission(deviceAddress);
  Wire.send((int)(address >> 8));   // MSB
  Wire.send((int)(address & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(deviceAddress,length);
  int c = 0;
  for ( c = 0; c < length; c++ )
    if (Wire.available()) buffer[c] = Wire.receive();
}      
//*************************************************************************************************
static void DumpHex(int deviceAddress, unsigned long startAddress, unsigned long endAddress)
{
  int value;
  int lineCounter;
  char textBuffer[24];
  unsigned long address;
 
  lineCounter = 0;
  address = startAddress;
   
  while (address < endAddress)
  {
    sprintf(textBuffer, "0x%05X - ", address);
    Serial.print(textBuffer);
    sprintf(textBuffer, "0x%05X - ", address + (endAddress - startAddress));
    Serial.print(textBuffer);
    textBuffer[0] = 0;
   
    for (int dumpCounter=0; dumpCounter<16; dumpCounter++)
    {
      value = I2C_eeprom_read_byte(deviceAddress,address);
          
      Serial.print(value,HEX);
      Serial.print(" ");
     
      if ((value >= 0x20) && (value < 0x7f))
      {
        textBuffer[dumpCounter % 16] = value;
      }
      else
      {
        textBuffer[dumpCounter % 16] = '.';
      }
     
      address++;
    }
   
    textBuffer[16] = 0;   
    Serial.println(textBuffer); 
  }
}
void I2C_eeprom_delete(int deviceAddress, unsigned long startAddress, unsigned long endAddress)
{ 
  for(unsigned long address=startAddress; address < endAddress + 1; address++) {
    if (I2C_eeprom_read_byte(deviceAddress,address) != 0xFF)
    {
      Serial.println(address,HEX);
      I2C_eeprom_write_byte(deviceAddress,address,0xFF);
    }
  }
}
#define EEPROM_DEVICE  0x50
#define EEPROM_INIT    0x00000
#define EEPROM_END     0x08000
void setup()
{
 
  Wire.begin();
  Serial.begin(9600);
 
  long ms;
 
  Serial.println("Deleting..");
  ms = millis();
  I2C_eeprom_delete(EEPROM_DEVICE,EEPROM_INIT,EEPROM_END);
  Serial.print(millis()-ms);
  Serial.println("ms");
 
  Serial.println("---- Dump ---");
 
  DumpHex(EEPROM_DEVICE,EEPROM_INIT,EEPROM_INIT+0x0f); 
  DumpHex(EEPROM_DEVICE,EEPROM_END-0x0f,EEPROM_END); 
 
  Serial.println("---- Write at begin ---");
 
  DumpHex(EEPROM_DEVICE,EEPROM_INIT,EEPROM_INIT+0x0f); 
  Serial.println("Writing...");
  I2C_eeprom_write_byte(EEPROM_DEVICE,EEPROM_INIT,0xCC);
  I2C_eeprom_write_byte(EEPROM_DEVICE,EEPROM_INIT+0x0f,0xCC);
  DumpHex(EEPROM_DEVICE,EEPROM_INIT,EEPROM_INIT+0x0f);
  Serial.println("---- Writte at end ---");
  DumpHex(EEPROM_DEVICE,EEPROM_END-0x0F,EEPROM_END); 
  Serial.println("Writing...");
  I2C_eeprom_write_byte(EEPROM_DEVICE,EEPROM_END,0xCC);
  I2C_eeprom_write_byte(EEPROM_DEVICE,EEPROM_END-0x0f,0xCC);
  DumpHex(EEPROM_DEVICE,EEPROM_END-0x0f,EEPROM_END); 
 
  Serial.println("---- end ---");    
 
  //DumpHex(EEPROM_DEVICE,EEPROM_INIT,EEPROM_INIT+0x0f);
  //DumpHex(EEPROM_DEVICE,EEPROM_END-0x0f,EEPROM_END);   
}
void loop()
{
}
```

He añadido l2C_eeprom_delete para borrar la eeprom, . Tambien he añadido un delay(5) tras cada operación de escritura debido a que si no, no me escribia bien.

## Test

```shell
Deleting..
18443ms
0x0000 - 0x000F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
0x7FF0 - 0x7FFF - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
----
0x0000 - 0x000F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x0000 - 0x000F - CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF CC ................
----
0x7FF0 - 0x7FFF - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x7FF0 - 0x7FFF - CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF CC ................
----
```
## Tiempos

Test de lectura
Bytes     Delete      Fast Write      Read      Check      Delete2     

----------------------------------------------------------------------------------------------

64Bytes      37ms        28ms      37ms          64          28ms     

128Bytes    74ms        55ms      73ms        128          54ms     

256Bytes  148ms      109ms      147ms      256        109ms     

512Bytes  294ms      218ms      295ms      512        218ms

Delete - I2Ceeprom.Erase()

Fast Write - I2Ceeprom.write_bytes_fast()

Read - I2Ceeprom.read_bytes()

Check - suma de comprobación

Delete - usando I2Ceeprom.write_bytes_fast()

Test de velocidad con FastWrite
Bytes              Read            Write          Delete      FastWrite     Delete2     

-------------------------------------------------------------------------------------------------------------

64bytes         37ms        1377ms        1380ms        28ms         1360ms     

128bytes       74ms        2743ms        2743ms        56ms         2720ms     

256bytes     146ms        5475ms        5473ms      110ms         5460ms     

512bytes     294ms      10929ms      10934ms      219ms       10919ms     

1024bytes   587ms      21850ms      21856ms      435ms       21838ms     

2048bytes 1174ms      43694ms      43702ms      871ms       43674ms 

Read       -  usando read_bytes

Write       -   write_bytes

Delete     -  erase (debe ser similar a write)

FastWrite -  usando write_byte_fast

Delete2   -  erase debe ser igual a delete y a write