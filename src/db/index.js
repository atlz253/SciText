import { Sequelize } from "sequelize";

export default class DB {
  #sequelize;

  constructor() {
    this.#sequelize = new Sequelize(
      process.env.DB_NAME || "",
      process.env.DB_USERNAME || "",
      process.env.DB_PASSWORD || "",
      {
        host: "localhost",
        dialect: "postgres",
      }
    );

    try {
      this.#sequelize
        .authenticate()
        .then(() =>
          console.log("Connection has been established successfully.")
        );
    } catch (e) {
      console.error("Unable to connect to the database:", e);
    }
  }
}
