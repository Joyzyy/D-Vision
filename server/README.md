# D/VISION Server

This is the server for the **attendance app**.

### Prerequisites

Before you can run this project, you will need to have the following software installed on your machine:

- [Node.js](https://nodejs.org/en/)
- [Prisma](https://www.prisma.io/)

You will also need to create a `.env` file in the root directory of the project with the following contents:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST/DB_NAME"
```

Replace `USER`, `PASSWORD`, `HOST`, and `DB_NAME` with the appropriate values for your database provider.

**WARNING: If you're not using MySQL as your database provider, you will need to change the `prisma/schema.prisma` file to match your database provider.**

Example if you're using PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

And your .env file should look like this:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB_NAME"
```

### Installing dependencies

To install the dependencies, run the following command from the root directory of the project:

```bash
npm install
```

You will also need to install ts-node globally:

```bash
npm install -g ts-node
```

#### Usage

To generate the Prisma client, run the following command:

```bash
npx prisma generate
```

##### Example of query using Prisma client

```typescript
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

(async() {
  const events = await client.event.findMany();
  console.log(events);
})();
```

To start the server, run the following command:

```bash
npm run dev
```

### Database tables specifications

| Table name        | Columns          | Description                                                          |
| ----------------- | ---------------- | -------------------------------------------------------------------- |
| event             | id               | Unique identifier for the event                                      |
|                   | name             | Name of the event                                                    |
|                   | start_time       | Start time of the event                                              |
|                   | end_time         | End time of the event                                                |
|                   | access_code      | Access code for the event                                            |
|                   | access_code_type | Type of access code (text, QR code, or both)                         |
|                   | state            | State of the event (OPEN or CLOSED)                                  |
| event_group       | id               | Unique identifier for the event group                                |
|                   | name             | Name of the event group                                              |
|                   | start_time       | Start time of the event group                                        |
|                   | end_time         | End time of the event group                                          |
|                   | state            | State of the event group (OPEN or CLOSED)                            |
| event_group_event | id               | Unique identifier for the event group event relationship             |
|                   | event_id         | Foreign key to the event table                                       |
|                   | event_group_id   | Foreign key to the event group table                                 |
| user              | id               | Unique identifier for the user                                       |
|                   | name             | Name of the user                                                     |
|                   | role             | Role of the user. Could be either 'participant' or 'event ogranizer' |
|                   | email            | Email address of the user                                            |
| attendance        | id               | Unique identifier for the attendance record                          |
|                   | event_id         | Foreign key to the event table or to the event group table           |
|                   | participant_id   | Foreign key to the user table                                        |
|                   | attendance_time  | Time at which the participant confirmed their attendance             |
