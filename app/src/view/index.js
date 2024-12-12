import hbs from "hbs";
import path from "node:path";
import express from "express";

const router = express.Router();

function config(app, db, parser) {
  app.set("views", path.resolve("./src/view/views"));
  app.set("view engine", "hbs");

  hbs.registerHelper("localeTime", (date) => date.toLocaleString());

  router.get("/", async (request, response) => {
    const searchQuery = request.query.q || "";
    const papers = await (searchQuery
      ? db.getPapersByQuery(searchQuery)
      : db.getAllPapers());
    response.render("index.hbs", { papers, searchQuery });
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
      const worker = parser.fromBuffer(file.data);
      worker.on("message", async ({ error, text }) => {
        if (error) {
          response.sendStatus(500);
        } else {
          // @ts-ignore
          const paper = await db.createPaper(file.name, text, file.md5);
          // @ts-ignore
          response.redirect(`/paper/${paper.id}`);
        }
      });
      response.on("close", () => worker.terminate());
    } else {
      response.sendStatus(500);
    }
  });
}

export default { config, router };
