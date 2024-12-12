import hbs from "hbs";
import path from "node:path";
import express from "express";

const router = express.Router();

function config(app, db, parser) {
  app.set("views", path.resolve("./src/view/views"));
  app.set("view engine", "hbs");

  hbs.registerHelper("localeTime", (date) => date.toLocaleString());

  router.get("/", async (request, response) => {
    const papers = await db.getAllPapers();
    response.render("index.hbs", { papers });
  });

  router.get("/paper/:id", async (request, response) => {
    const paper = await db.getPaperByID(request.params.id);
    if (paper) {
      // @ts-ignore
      response.render("paper.hbs", { paper });
    } else {
      response.send("Paper not found");
    }
  });

  router.post("/paper", async (request, response) => {
    const file = request.files?.pdf;

    if (file) {
      // @ts-ignore
      const text = await parser.fromBuffer(file.data);
      // @ts-ignore
      const paper = await db.createPaper(file.name, text, file.md5);
      // @ts-ignore
      response.redirect(`/paper/${paper.id}`);
    } else {
      response.sendStatus(500);
    }
  });
}

export default { config, router };
