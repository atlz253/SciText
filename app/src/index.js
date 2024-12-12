import dotenv from "dotenv";
import express from "express";
import DB from "./db/index.js";
import view from "./view/index.js";
import rest from "./rest/index.js";
import parser from "./parser/index.js";
import fileUpload from "express-fileupload";

dotenv.config();

const db = new DB();
await db.config();

const app = express();
app.use(fileUpload());

view.config(app, db, parser);
app.use("/", view.router);

const port = process.env.PORT || 3000;

rest.config(app, db, parser, port);
app.use("/", rest.router);

app.listen(port, () => console.log(`Available on: http://localhost:${port}`));
