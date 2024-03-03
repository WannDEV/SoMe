import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());

// importer alle ruter
import router from "./src/routes/index.js";

app.use(cors({ origin: true, credentials: true }));

app.use(router);

const port = 2000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
