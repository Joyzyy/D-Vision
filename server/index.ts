import express, { urlencoded } from "express";
import { setup } from "./setup";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    // allow all origins
    origin: "*",
  })
);

setup(app);

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});
