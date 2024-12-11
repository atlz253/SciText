import express from "express";
import { Sequelize } from "sequelize";

const app = express();
const port = 3000;

const sequelize = new Sequelize("scitext", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (e) {
  console.error("Unable to connect to the database:", e);
}

app.get("/", (request, response) => {
  response.send("Hello world!");
});

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
