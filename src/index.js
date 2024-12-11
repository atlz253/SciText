import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import fileUpload from "express-fileupload";
import parser from "./parser/index.js";
import DB from "./db/index.js";

dotenv.config();

const db = new DB();

const app = express();
app.use(fileUpload());

const port = parseInt(process.env.PORT || "") || 3000;

app.get("/", (request, response) => {
  response.sendFile(path.resolve("./static/index.html"));
});

app.post("/paper", async (request, response) => {
  const file = request.files?.pdf;
  if (file) {
    // @ts-ignore
    const text = await parser.fromBuffer(file.data);
    response.send(text);
  } else {
    response.send("Error");
  }
});

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
