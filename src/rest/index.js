import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const router = express.Router();

function config(app, db, parser, port) {
  app.use(express.json());

  const swaggerOptions = {
    swaggerDefinition: {
      restapi: "3.0.0",
      info: {
        title: "SciText API",
        version: "1.0.0",
        description: "SciText REST API",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
    },
    apis: ["./src/**/*.js"],
  };
  const specs = swaggerJSDoc(swaggerOptions);

  router.use("/api/swagger", swaggerUI.serve, swaggerUI.setup(specs));

  /**
   * @swagger
   * /api/ping:
   *  get:
   *    description: ping
   *    responses:
   *      200:
   *        description: Returns pong message
   */
  router.get("/api/ping", (request, response) => {
    response.send("pong");
  });

  /**
   * @swagger
   * /api/paper:
   *   post:
   *     description: Get papers list
   *     consumes:
   *      - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         schema:
   *           type: object
   *           properties:
   *             searchQuery:
   *               type: string
   *     responses:
   *       200:
   *         description: Object with papers
   */
  router.post("/api/paper", async (request, response) => {
    const { searchQuery } = request.body;
    const papers = await (searchQuery
      ? db.getPapersByQuery(searchQuery)
      : db.getAllPapers());
    response.json({ papers });
  });
}

export default { config, router };
