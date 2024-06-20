+++
title = 'Arduino LC24XX EPROM (paginated 2)'
date = '2011-03-04T00:00:00+01:00'
tags = ['electronics', 'arduino', 'eprom']
+++
Finalmente he hecho una biblioteca I2C_eeprom.
Hay una parte que merece una explicación es el hecho de que estas memorias EEPROM tienen un modo de escritura más rápida (Page Write), en este modo podemos escribir 64bytes de golpe con lo que el proceso de escritura es considerablemente más rápido.
Este modo viene explicado en el datasheet de estas eeproms.
La cosa es que cuando he ido a implementarlo he tenido bastantes problemas.
Lo que he estado programando usa la biblioteca Wire, que a su vez usa unas funciones definidas en Wire\Utility\Twi.h (Two Wire Interface??)
Bien, tanto Wire como Twi usan un buffer interno de 32bytes, y el 24lc256 usa páginas internas de 64bytes, de modo que hay que ajustar estas dos bibliotecas para poder usar el método write_bytes_fast otra cosa importante es que este método no es capaz de saltar de dispositivo, así que estamos limitados a 32k, más que suficiente.
La segunda cosa es que los bloques de 64 bytes deben escribirse completamente, es decir que en cada operación no se pueden escribir ni más ni menos y deben escribirse en su sitio. En 32k hay 512 páginas de 64bytes.
Nota: para usar fast hay que modificar el tamaño del buffer en wire.h y twi.h pero en ambas hay que usar un buffer de 66Bytes, esto es debido a que el direccionamiento 
previo son dos Bytes.
```c	
#define BUFFER_LENGTH 66  // en Wire.h
#ifndef TWI_BUFFER_LENGTH
  #define TWI_BUFFER_LENGTH 66 // en twi.h
#endif
```
Nota2: el método read_bytes_fast solo sirve para leer 64bytes, habría que modificarlo para leer bloques de 64bytes.
Un ejemplo del código en Ejemplo I2C_EEPROM.H
I2C_eeprom.h
```c
#ifndef I2C_EEPROM_H
#define I2C_EEPROM_H
#include <..\Wire\Wire.h>
#include "WProgram.h"
struct EepromAddress {
  int device;
  unsigned int address;
};
//typedef unsigned char byte;
class I2C_EEPROM
{
    public:
        I2C_EEPROM();
       
        void write_byte(unsigned long address, byte data );
        void write_bytes(unsigned long address, byte* data,  int length );
        void write_bytes_fast(unsigned long address, byte* data,  int length );
       
        byte read_byte(unsigned long address);
        void read_bytes(unsigned long address, byte *buffer, int length );
        void read_bytes_fast(unsigned long address, byte *buffer, int length );
       
        //void erase(unsigned long startAddress, unsigned long endAddress);
        void erase(unsigned long startAddress, unsigned long length);
       
    private:
                       
        EepromAddress get_address(unsigned long address);
};
extern I2C_EEPROM I2Ceeprom;
#endif
```
I2C_eeprom.cpp
```c
#include "I2C_eeprom.h"
#include "WProgram.h"
#define EEPROM_SIZE_OF_PAGE 64
I2C_EEPROM::I2C_EEPROM()
{  
    Wire.begin();
}
EepromAddress I2C_EEPROM::get_address(unsigned long address)
{
  EepromAddress eepromAddress;
 
  eepromAddress.device = address >> 15 | 0x50;
  eepromAddress.address = address & 0x7FFF;
 
  return eepromAddress;
}
void I2C_EEPROM::write_byte(unsigned long address, byte data)
{
  EepromAddress eepromAddress = get_address(address);
 
  Wire.beginTransmission(eepromAddress.device);
 
  Wire.send((int)(eepromAddress.address >> 8));   
  Wire.send((int)(eepromAddress.address & 0xFF)); 
  Wire.send(data);
  Wire.endTransmission();
 
  delay(20);
}
void I2C_EEPROM::write_bytes(unsigned long address, byte* data, int length)
{
  for(unsigned long counter=0; counter <= length; counter++)
  { 
      I2Ceeprom.write_byte(address+counter,data[counter]);  
  }
}
void I2C_EEPROM::write_bytes_fast(unsigned long address, byte* data, int length)
{
  if ((length % EEPROM_SIZE_OF_PAGE) != 0)
    return;
  int pos = 0;
 
  EepromAddress eepromAddress;
 
  eepromAddress = get_address(address);
  
  int device = eepromAddress.device;
 
  int insidePageInit = eepromAddress.address / EEPROM_SIZE_OF_PAGE;  
  int insidePageInitAddress = insidePageInit * EEPROM_SIZE_OF_PAGE;
  int insidePageInitPos = eepromAddress.address - insidePageInitAddress;
   
  int sizeOfPageToWrite;
 
  if ((length % EEPROM_SIZE_OF_PAGE) == 0) {
    sizeOfPageToWrite = EEPROM_SIZE_OF_PAGE;
  } else if (length > EEPROM_SIZE_OF_PAGE) {
    sizeOfPageToWrite = EEPROM_SIZE_OF_PAGE;
  } else
    sizeOfPageToWrite = length % EEPROM_SIZE_OF_PAGE;
  do {
 
    // locate the inside page
    Wire.beginTransmission(device);
 
    Wire.send((int)(insidePageInitAddress >> 8));   // MSB
    Wire.send((int)(insidePageInitAddress & 0xFF)); // LSB
   
   
    for(int counter=0; counter < insidePageInitPos; counter++)
    {
        Wire.send(0);
    }
   
    // write in the page
    for(int counter=insidePageInitPos; counter < sizeOfPageToWrite; counter++)
    {           
        Wire.send(data[pos++]);
        length--;
    }
   
    for(int counter=0; counter < EEPROM_SIZE_OF_PAGE-sizeOfPageToWrite; counter++)
    {
        Wire.send(0);
    }   
   
    // end of page write
    Wire.endTransmission();
    delay(20);
   
    // calc the next page
    insidePageInit++;
    insidePageInitAddress = insidePageInit * EEPROM_SIZE_OF_PAGE;
    insidePageInitPos = 0;
    sizeOfPageToWrite = (length % EEPROM_SIZE_OF_PAGE) == 0 ?
                            EEPROM_SIZE_OF_PAGE
                            : (length % EEPROM_SIZE_OF_PAGE);         
  } while(length);  
}
byte I2C_EEPROM::read_byte(unsigned long address)
{
  byte rdata = 0xFF;
  EepromAddress eepromAddress = get_address(address);
 
  Wire.beginTransmission(eepromAddress.device);
  Wire.send((int)(eepromAddress.address >> 8));  
  Wire.send((int)(eepromAddress.address & 0xFF));
  Wire.endTransmission();
  Wire.requestFrom(eepromAddress.device,1);
  if (Wire.available())
    rdata = Wire.receive();
  return rdata;
}
void I2C_EEPROM::read_bytes(unsigned long address, byte *buffer, int length )
{
  for(unsigned long counter=0; counter <= length; counter++)
  {
    buffer[counter] = read_byte(address+counter);
  } 
}      
void I2C_EEPROM::read_bytes_fast(unsigned long address, byte *buffer, int length )
{
 EepromAddress eepromAddress = get_address(address);
 
  Wire.beginTransmission(eepromAddress.device);
 
  Wire.send((int)(eepromAddress.address >> 8));  
  Wire.send((int)(eepromAddress.address & 0xFF));
  Wire.endTransmission();
 
  Wire.requestFrom(eepromAddress.device,length);
  delay(5);
 
  int c;
 
  for ( c = 0; c < length; c++ )
    if (Wire.available())
      buffer[c] = Wire.receive();
}
void I2C_EEPROM::erase(unsigned long startAddress, unsigned long length)
{ 
  for(unsigned long counter=0; counter <= length; counter++)
  {
    if (I2Ceeprom.read_byte(startAddress+counter) != 0xFF)
    {
      I2Ceeprom.write_byte(startAddress+counter,0xFF);
    }   
  }
}
I2C_EEPROM I2Ceeprom = I2C_EEPROM();
```

## Ejemplo completo

```c
#include <Wire.h>
#include "I2C_eeprom.h"
//***********************************************************************
static void DumpHex(unsigned long startAddress, unsigned long endAddress)
{
  unsigned char value;
  int lineCounter;
  char textBuffer[24];
  unsigned long address = startAddress;
 
  lineCounter = 0;
  
  while (address < endAddress)
  {
    sprintf(textBuffer, "0x%05lX - ", address);
    Serial.print(textBuffer);
    sprintf(textBuffer, "0x%05lX - ", address + 0x0f);
    Serial.print(textBuffer);
    textBuffer[0] = 0;
  
    for (int dumpCounter=0; dumpCounter<16; dumpCounter++)
    {
      value = I2Ceeprom.read_byte(address);
         
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
void Erase(unsigned long startAddress, unsigned long length)
{
  for(unsigned long counter=0; counter <= length; counter++)
  {
    if (I2Ceeprom.read_byte(startAddress+counter) != 0xFF)
    {
      Serial.println(startAddress+counter,HEX);
      I2Ceeprom.write_byte(startAddress+counter,0xFF);
    }   
  }
}
#define EEPROM_INIT    0x00000
#define EEPROM_END     0x1ffff
#define TEST_ADDR      0x10C00
void setup()
{
 
  //Wire.begin();
  Serial.begin(9600);
 
  Serial.println((int)(0xA0 | (TEST_ADDR >> 14) & 0xFE),HEX);
  Serial.println((int)(0xA0 | (TEST_ADDR >> 14) & 0xFE),BIN);
 
  long ms;
 
  Serial.println("Deleting entire eeprom.");
  ms = millis(); 
  I2Ceeprom.erase(EEPROM_INIT,EEPROM_END);
  Serial.print(millis()-ms);
  Serial.println("ms");
  
  Serial.println("---- Write at begin ---");
 
  DumpHex(EEPROM_INIT,EEPROM_INIT+0x0f); 
 
  Serial.println("Writing...");
  I2Ceeprom.write_byte(EEPROM_INIT,0xCC);
 
  DumpHex(EEPROM_INIT,EEPROM_INIT+0x0f);
  Serial.println("---- Write at end ---");
  DumpHex(EEPROM_END-0x0F,EEPROM_END); 
  Serial.println("Writing...");
  I2Ceeprom.write_byte(EEPROM_END,0xCC);
  I2Ceeprom.write_byte(EEPROM_END-0x0f,0xCC);
  DumpHex(EEPROM_END-0x0F,EEPROM_END); 
  Serial.println("---- Write on device 2 ---");
  DumpHex(0x8000,0x8000+0x0F); 
  Serial.println("Writing...");
  I2Ceeprom.write_byte(0x8000,0xCC);
  I2Ceeprom.write_byte(0x8001,0xCC);
  DumpHex(0x8000,0x8000+0x0F); 
  Serial.println("---- Write on device 3 ---");
  DumpHex(0x10000,0x10000+0x0F); 
  Serial.println("Writing...");
  I2Ceeprom.write_byte(0x10000,0xCC);
  I2Ceeprom.write_byte(0x10001,0xCC);
  DumpHex(0x10000,0x10000+0x0F); 
  Serial.println("---- Write on device 4 ---");
  DumpHex(0x18000,0x18000+0x0F); 
  Serial.println("Writing...");
  I2Ceeprom.write_byte(0x18000,0xCC);
  I2Ceeprom.write_byte(0x18001,0xCC);
  DumpHex(0x18000,0x18000+0x0F); 
 
  Serial.println("---- Test Write Bytes ---");
  I2Ceeprom.erase(TEST_ADDR,0x2D);
 
  I2Ceeprom.write_byte(TEST_ADDR,0xCC);
 
  DumpHex(TEST_ADDR,TEST_ADDR+0x2D); 
 
  char *test = "Some text to write in the eeprom yeahhh";
 
  Serial.println("Writting...");
  Serial.print(strlen(test));
  Serial.println(" bytes.");
   
  I2Ceeprom.write_bytes(TEST_ADDR,(byte *)test,strlen(test));
  DumpHex(TEST_ADDR,TEST_ADDR+0x2D); 
 
  Serial.println("---- Test Read Bytes ---");
 
  char buffer[50];
 
  I2Ceeprom.read_bytes(TEST_ADDR,(byte *)buffer,strlen(test));
 
  buffer[strlen(test)+1]=0;
 
  Serial.print("Buffer=");
  Serial.println(buffer);
  Serial.println("---- Test Erase ---");
  I2Ceeprom.erase(TEST_ADDR,0x2D);
 
  DumpHex(TEST_ADDR,TEST_ADDR+0x2D); 
 
  Serial.println("---- end ---");    
 
}
void loop()
{
}
```
Resultado

```sh 
Deleting entire eeprom.
75205ms
---- Write at begin ---
0x00000 - 0x0000F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x00000 - 0x0000F - CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
---- Write at end ---
0x1FFF0 - 0x1FFFF - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x1FFF0 - 0x1FFFF - CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF CC ................
---- Write on device 2 ---
0x08000 - 0x0800F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x08000 - 0x0800F - CC CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
---- Write on device 3 ---
0x10000 - 0x1000F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x10000 - 0x1000F - CC CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
---- Write on device 4 ---
0x18000 - 0x1800F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writing...
0x18000 - 0x1800F - CC CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
---- Test Write Bytes ---
0x10C00 - 0x10C0F - CC FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
0x10C10 - 0x10C1F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
0x10C20 - 0x10C2F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
Writting...
39 bytes.
0x10C00 - 0x10C0F - 53 6F 6D 65 20 74 65 78 74 20 74 6F 20 77 72 69 Some text to wri
0x10C10 - 0x10C1F - 74 65 20 69 6E 20 74 68 65 20 65 65 70 72 6F 6D te in the eeprom
0x10C20 - 0x10C2F - 20 79 65 61 68 68 68 0 FF FF FF FF FF FF FF FF  yeahhh.........
---- Test Read Bytes ---
Buffer=Some text to write in the eeprom yeahhh
---- Test Erase ---
0x10C00 - 0x10C0F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
0x10C10 - 0x10C1F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
0x10C20 - 0x10C2F - FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF ................
---- end ---
```	