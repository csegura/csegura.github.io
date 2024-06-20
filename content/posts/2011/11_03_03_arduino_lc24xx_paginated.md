+++
title = 'Arduino LC24XX EPROM (paginated)'
date = '2011-03-03T00:00:00+01:00'
tags = ['electronics', 'arduino', 'eprom']
+++

Habia algunas cosas que no me cuadraban ...

Lógico.

Con la biblioteca actual Wire y las funciones I2C_eeprom de (http://www.arduino.cc/playground/Code/I2CEEPROM) .. me he dado cuenta de que las direciones van en un entero (int) que en arduino, son 2 Bytes (16 bits) y con eso no podemos escribir más alla de los 64k, de modo que he cambiaod el código para usar un sistema de páginación.

Por ejemplo con 4 24lc256 tendriamos 4 páginas de 32k lo resumo en estas dos funciones

```c	
int deviceCalc(unsigned long address)
{
  return address >> 15 | 0x50;  
}
int addressCalc(unsigned long address)
{
  return address & 0x7FFF;
}
```	

la primera calcularía la página para un 25lc256, como las páginas son de 32k se usan solo 15bits que es el desplazamiento que se debe usar para calcular el dispositivo (página) en el que se encuentra la dirección pasada. Como se ve la dirección ahora va en un unsigned long 4 Bytes (32bits)

La segunda calcula la dirección base para lo cual en el caso de 32k le aplicamos las mascara 0x7FFF
Finalmente mi código queda así.

```c
#include "wire.h"
struct EepromAddress {
  unsigned int device;
  unsigned int address;
};
EepromAddress I2C_get_eeprom_address(unsigned long address)
{
  EepromAddress eepromAddress;
 
  eepromAddress.device= address >> 15 | 0x50;
  eepromAddress.address = address & 0x7FFF;
 
  return eepromAddress;
}
void I2C_eeprom_write_byte(unsigned long address, byte data )
{
  int rdata = data;
 
  EepromAddress eepromAddress = I2C_get_eeprom_address(address);
 
  Wire.beginTransmission(eepromAddress.device);
 
  Wire.send((int)(eepromAddress.address >> 8));   
  Wire.send((int)(eepromAddress.address & 0xFF)); 
  Wire.send(rdata);
  Wire.endTransmission();
  delay(20);
}
void I2C_EEPROM::write_bytes(unsigned long address, byte* data,  int length )
{
  for(unsigned long counter=0; counter <= length; counter++)
  { 
      I2Ceeprom.write_byte(address+counter,data[counter]);  
  }
}
byte I2C_eeprom_read_byte(unsigned long address)
{
  byte rdata = 0xFF;
  EepromAddress eepromAddress = I2C_get_eeprom_address(address);
 
  Wire.beginTransmission(eepromAddress.device);
  Wire.send((int)(eepromAddress.address >> 8));  
  Wire.send((int)(eepromAddress.address & 0xFF));
  Wire.endTransmission();
  Wire.requestFrom(eepromAddress.page,1);
  if (Wire.available())
    rdata = Wire.receive();
  return rdata;
}
void I2C_eeprom_read_bytes(unsigned long address, byte *buffer, int length )
{
  for(unsigned long counter=0; counter <= length; counter++)
  {
    buffer[counter] = read_byte(address+counter);
  } 
}      
```