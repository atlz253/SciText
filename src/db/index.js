import { DataTypes, Model, Sequelize } from "sequelize";

class Paper extends Model {}

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
        logging: false,
      }
    );
  }

  async config() {
    Paper.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        text: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
          defaultValue: "",
        },
        md5: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize: this.#sequelize }
    );

    await this.#sequelize.sync();
  }

  createPaper(title, text, md5) {
    return Paper.create({ title, text, md5 });
  }

  getPaperByID(id) {
    return Paper.findOne({
      where: {
        id,
      },
    });
  }

  getAllPapers() {
    return Paper.findAll({
      attributes: ["id", "title", "createdAt"],
    });
  }
}
