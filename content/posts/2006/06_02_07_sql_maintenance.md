+++
title = 'SQL Maintenance'
date = 2006-02-07T00:00:00+01:00
tags = ['']
+++

Hoy tocaba mantenimiento del Servidor SQL, revisión de espacio, compactación de bases de datos etc… (cosas del primer martes de cada mes) en fin una vez más nuestro portal crece desmesuradamente sobre todo el log de transacciones (como ocurre con todas las bbdd que se usan) así que como hoy no tenia nada más interesante que contar aquí quedan algunas de las tsqls que forman parte del pan de mantenimiento (yo prefiero hacerlo a mano, usando un PA en vez de usar el asistente programado, manias)


Comenzamos comprobando nuestras bases de datos con un checkdb

```sql	
EXEC sp_MSforeachdb @command1="print '?’ DBCC CHECKDB ('?’)"
```

Si no hay errores (es lo normal) pero alguna vez algún indice

```sql	
EXEC sp_fixindex 'bbdd’, 'tabla', num_index
```

ó 

```sql
EXEC sp_MSforeachtable @command1="print '?' DBCC DBREINDEX ('?')"
```

y un DBCC SHOWCONTIG ayudan


continuamos comprobando los logs de transacciones:

```sql	
DBCC SQLPERF (LOGSPACE)
```

A la bbdd  SITE del portal siempre le toca compactar ….

```sql
BACKUP LOG PortalGr1_SITE WITH TRUNCATE_ONLY
DBCC SHRINKFILE('PortalGr1_SITE_logs', 1)
```

Y por último si es el caso reconstruyo los indices de algunas de las bbdd de más uso

```sql
USE bbdd
EXEC sp_MSforeachtable @command1="print '?' DBCC DBREINDEX ('?')"
```

Y listo… Conviene tener en cuenta estas cosas.