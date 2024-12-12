import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const router = express.Router();

function config(app, db, parser, port) {
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
   * @openapi
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
}

export default { config, router };
