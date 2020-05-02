# JustFeast
Shopping cart using NodeJS, Express and PostgreSQL

## Project Title: 
JustFeast Booking System

## Description: 
Created a shopping cart application using PostgreSQL for database, Express as server, EJS-engine for the front-end and NodeJS for server communication.

## Tools: 
HTML, CSS, .EJS , PostgresSQL, Express, NodeJS

## Configuration
- **Platform:** node v12.13.1
- **Framework**: express
- **Database**: postgreSQL 

**DB Schema design - ERD** -
![alt text](/public/ERD-JustFeastBooking.png)

## How to run the program


- Fork/Clone repository
- Installer NodeJs
- Installer PostgreSQL 

### DB-config
**pgAdmin**
- Efter installation søg efter applikaitonen 'pgAdmin' og åbn den. pgAdmin er et GUI  for PostgreSQL, der automatisk installeres med postgreSQL (Gør det lettere at håndtere vores DB)
- Opret en bruger på pgAdmin. Hvis ikke du har gjort før skal du skrive et kodeord. Husk dette. 
- Opret en ny rolle: 

Create => Login/Gruop Role => sæt 'Name'= testUser, 'password'=password og sæt 'Privileges' til ' superuser' og 'can login'.
Brug oplyysninger fra host details i server/db/db.js filen som ses nedenfor:

```javaScript
{
    host: "localhost",
    port: 5433,
    user: "testUser",
    database: "testdb",
    password: "password",
}
```
- Opret database på PgAdmin:

Create => Database => Under 'General' sæt 'Database'= testdb , sæt 'Owner'= testUser (den bruger, der matcher 'host'-credentials)
- Vær opmærksom på, at porten i denne fil er sat til 5433, hvor default normalt er 5432. Enten ændre den i server/db/db.js og app.js eller sæt porten til 5433 når du opretter databasen.

Når databasen er oprettet i pgAdmin kommer den til at se sådan ud i SQL:

```SQL
CREATE DATABASE testdb
    WITH
    OWNER = testUser
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
   ```

**nodeJS**

Kør følgende kode i nodeJS terminalen
- Installer node dependencies - `npm install`
- Opsæt databasens tabeller - `node dbSetup.js` (Kører dbSetup.js filen)
- Til sidst kør `npm start` for at starte appen.
- Naviger til `http://localhost:3000` i browser.


