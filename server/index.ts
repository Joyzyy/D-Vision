import express from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.get("/", async (req: Request, res: Response) => {
  try {
    await prisma.$connect();
    await prisma.users
      .findMany()
      .then((users) => {
        res.status(200).json({ users });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});
