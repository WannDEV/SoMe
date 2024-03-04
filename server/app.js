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

// Allow requests blocked by cors (By default, cors blocks requests which contains cookes and etc)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

// importer alle ruter
import router from "./src/routes/index.js";

app.use(router);

const port = 2000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
