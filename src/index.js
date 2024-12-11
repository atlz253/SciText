import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import path from "node:path";
import fileUpload from "express-fileupload";
import parser from "./parser/index.js";

dotenv.config();

const app = express();
app.use(fileUpload());

const port = parseInt(process.env.PORT || "") || 3000;

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USERNAME || "",
  process.env.DB_PASSWORD || "",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (e) {
  console.error("Unable to connect to the database:", e);
}

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
