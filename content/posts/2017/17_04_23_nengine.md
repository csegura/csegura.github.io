+++
title = 'NEngine - SQL Authentication using JWT Tokens'
date = 2017-04-23T00:00:00+02:00
tags = ['sql', 'jwt', 'nengine']
+++

NEngine is a skeleton project that I use to start new projects where I need to use SQL Server for the database and JWT tokens for authentication. The project is available on [GitHub](https://github.com/csegura/nengine)

It is necessary to have a SQL Server database with stored procedures to authenticate the user and generate the JWT token. The stored procedures are:

```json
{
  "CHECK_EMAIL": "DATABASE.dbo.checkEmail @email = @email",
  "SAVE_USER": "DATABASE.dbo.saveUser @email = @email, @password = @password",
  "LIST_USERS": "DATABASE.dbo.listUsers",
  "CHECK_PASSWORD": "DATABASE.dbo.checkPassword @email = @email, @password = @password",
  "CHECK_PASSWORD1": "DATABASE.dbo.checkPassword"
}
```
## Stored Procedures

```sql
USE [DemoDB]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[checkEmail] (@email VARCHAR(50))
AS
BEGIN
	SELECT * from DemoUser WHERE email = @email	
END

ALTER PROCEDURE [dbo].[checkPassword] (@email NVARCHAR(50), @password NVARCHAR(60))
AS
BEGIN
 SELECT email, password from DemoUser WHERE email = @email	AND password = @password
 --IF @@ROWCOUNT = 0 BEGIN
 --	select 'none' as email, 'none' as password   
 --END 
END

ALTER PROCEDURE [dbo].[saveUser] (@email VARCHAR(50), @password VARCHAR(10))
AS
BEGIN
	INSERT INTO DemoUser(email, password) VALUES (@email, @password)
END

ALTER PROCEDURE [dbo].[listUsers]
AS
BEGIN
	SELECT * from DemoUser 
END
```

