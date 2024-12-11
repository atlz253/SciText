import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const app = express();
const port = 3000;

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
  response.send("Hello world!");
});

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
