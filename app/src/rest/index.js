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
    const file = request.files?.pdf;

    if (file) {
      const worker = parser.fromBuffer(file.data);
      worker.on("message", async ({ error, text }) => {
        if (error) {
          response.sendStatus(500);
        } else {
          // @ts-ignore
          const paper = await db.createPaper(file.name, text, file.md5);
          // @ts-ignore
          response.json({ id: paper.id });
        }
      });
    } else {
      const { searchQuery } = request.body;
      const papers = await (searchQuery
        ? db.getPapersByQuery(searchQuery)
        : db.getAllPapers());
      response.json({ papers });
    }
  });

  /**
   * @swagger
   * /api/paper/{id}:
   *  get:
   *    description: get paper by ID
   *    parameters:
   *      - name: id
   *        in: path
   *        required: true
   *        description: Paper ID
   *        type: number
   *    responses:
   *      200:
   *        description: Object with paper
   */
  router.get("/api/paper/:id", async (request, response) => {
    const paper = await db.getPaperByID(request.params.id);
    if (paper) {
      response.json({ paper });
    } else {
      response.sendStatus(404);
    }
  });
}

export default { config, router };
