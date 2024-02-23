import express from "express";
import cors from "cors";
const app = express();

app.use(cors({ origin: true, credentials: true }));

const port = 2000;
app.listen(port, () =>
  winston.info(`Server running on http://localhost:${port}`)
);