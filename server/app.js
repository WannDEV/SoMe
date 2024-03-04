import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

// importer alle ruter
import router from "./src/routes/index.js";

app.use(router);

const port = 2000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
