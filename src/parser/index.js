import path from "node:path";
import threads from "node:worker_threads";

class PDFTextParser {
  fromBuffer(buffer) {
    const worker = new threads.Worker(path.resolve("./src/parser/worker.js"));
    worker.postMessage(buffer);
    return worker;
  }
}

const parser = new PDFTextParser();

export default parser;
