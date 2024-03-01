import express from "express";
import cors from "cors";
const app = express();

// importer alle ruter
import router from "./src/routes/index.js";

app.use(cors({ origin: true, credentials: true }));

app.use(router);

const port = 2000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
