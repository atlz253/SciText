import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import fileUpload from "express-fileupload";
import parser from "./parser/index.js";
import DB from "./db/index.js";

dotenv.config();

const db = new DB();
await db.config();

const app = express();
app.use(fileUpload());

const port = parseInt(process.env.PORT || "") || 3000;

app.get("/", (request, response) => {
  response.sendFile(path.resolve("./static/index.html"));
});

app.post("/paper", async (request, response) => {
  const file = request.files?.pdf;
  console.log(file);

  if (file) {
    // @ts-ignore
    const text = await parser.fromBuffer(file.data);
    // @ts-ignore
    db.createPaper(file.name, text, file.md5);
    response.send(text);
  } else {
    response.send("Error");
  }
});

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
