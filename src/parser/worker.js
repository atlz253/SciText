import { PdfReader } from "pdfreader";
import threads from "node:worker_threads";

threads.parentPort?.once("message", (buffer) => {
  const chunks = [];
  new PdfReader().parseBuffer(buffer, (err, item) => {
    if (err) threads.parentPort?.postMessage({ error: "parse error" });
    else if (!item) {
      console.log("message");
      threads.parentPort?.postMessage({ text: chunks.join(" ") });
    }
    else if (item.text) chunks.push(item.text);
  });
});
