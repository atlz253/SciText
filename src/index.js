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
app.set("views", path.resolve("./src/view/views"));
app.set("view engine", "hbs");

const port = parseInt(process.env.PORT || "") || 3000;

app.get("/", (request, response) => {
  response.render("index.hbs");
});

app.get("/ping", (request, response) => {
  console.log(request.url);
  response.send("pong");
});

app.post("/paper", async (request, response) => {
  const file = request.files?.pdf;

  if (file) {
    // @ts-ignore
    const text = await parser.fromBuffer(file.data);
    // @ts-ignore
    const paper = await db.createPaper(file.name, text, file.md5);
    // @ts-ignore
    response.redirect(`/paper/${paper.id}`);
  } else {
    response.send("Error");
  }
});

app.get("/paper/:id", async (request, response) => {
  const paper = await db.getPaperByID(request.params.id);
  if (paper) {
    // @ts-ignore
    response.send(paper.text);
  } else {
    response.send("Paper not found");
  }
});

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
