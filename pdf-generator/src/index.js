import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { program } from "commander";
import { faker } from "@faker-js/faker";
import threads from "node:worker_threads";

if (threads.isMainThread) {
  const workerThreads = [];
  const workerThreadsCount = os.cpus().length;
  const baseOutputDirectory = "./output/pdf-generator";
  const outputDirectory = path.resolve(
    baseOutputDirectory,
    new Date().getTime().toString()
  );
  const __filename = fileURLToPath(import.meta.url);

  program
    .option("--seed <seed>", "random generation seed")
    // @ts-ignore
    .option("--count <count>", "pdf files count", 1)
    // @ts-ignore
    .option("--min-paragraphs <count>", "min paragraphs in pdf file", 10)
    // @ts-ignore
    .option("--max-paragraphs <count>", "max paragraphs in pdf file", 100);
  program.parse(process.argv);
  const options = program.opts();

  fs.mkdirSync(outputDirectory, { recursive: true });

  for (let i = 0; i < workerThreadsCount; i++)
    workerThreads.push(new threads.Worker(__filename));

  let readyDocsCount = 0;

  function delegatePDFGeneration(worker) {
    worker.postMessage({
      outputDirectory,
      fileName: `${readyDocsCount}.pdf`,
      minParagraphs: options.minParagraphs,
      maxParagraphs: options.maxParagraphs,
    });
    readyDocsCount++;
  }

  for (const worker of workerThreads) {
    delegatePDFGeneration(worker);
    worker.on("message", ({ done }) => {
      if (readyDocsCount >= options.count) {
        worker.terminate();
      } else if (done) {
        delegatePDFGeneration(worker);
      }
    });
  }
} else {
  threads.parentPort?.on(
    "message",
    ({ outputDirectory, fileName, minParagraphs, maxParagraphs }) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(
        path.resolve(outputDirectory, fileName)
      );
      doc.pipe(stream);
      doc.text(
        faker.lorem.paragraphs(
          { min: minParagraphs, max: maxParagraphs },
          "\n\n"
        )
      );
      doc.end();
      stream.on("close", () => {
        threads.parentPort?.postMessage({ done: true });
      });
    }
  );
}
