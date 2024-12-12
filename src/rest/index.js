import express from "express";

const router = express.Router();

function config(app, db, parser) {
  router.get("/ping", (request, response) => {
    response.send("pong");
  });
}

export default { config, router };
