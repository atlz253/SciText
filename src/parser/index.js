import path from "node:path";
import threads from "node:worker_threads";

class PDFTextParser {
  fromBuffer(buffer, handler) {
    const worker = new threads.Worker(path.resolve("./src/parser/worker.js"));

    worker.postMessage(buffer);

    worker.on("message", ({ error, text }) => handler(error, text));
  }
}

const parser = new PDFTextParser();

export default parser;
