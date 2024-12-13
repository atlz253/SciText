import os from "node:os";
import fs from "node:fs";
import axios from "axios";
import path from "node:path";
import FormData from "form-data";
import { fileURLToPath } from "url";
import { program } from "commander";
import threads from "node:worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program.requiredOption("--input <path>", "input directory with PDFs").option(
  "--threads-count <count>",
  "benchmark threads count",
  // @ts-ignore
  Math.ceil(os.cpus().length / 2)
);
program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error(`${options.input} not exist!`);
  process.exit(-1);
}

function uploadFileWithPath(filePath) {
  const file = fs.createReadStream(filePath);
  const form = new FormData();
  form.append("pdf", file, path.basename(filePath));

  return axios.post("http://localhost:3000/api/paper", form, {
    headers: {
      ...form.getHeaders(),
    },
  });
}

const fileNames = await fs.promises.readdir(options.input);
const fileUploaderWorkersCount = Math.min(
  options.threadsCount,
  fileNames.length
);
const fileUploaderWorkers = [];

fileNames.reverse();

for (let i = 0; i < fileUploaderWorkersCount; i++) {
  fileUploaderWorkers.push(
    new threads.Worker(path.resolve(__dirname, "./workers/fileUploader.js"))
  );
}

function delegateFileUpload(worker) {
  const fileName = fileNames.pop();
  if (fileName) {
    worker.postMessage({
      filePath: path.resolve(options.input, fileName),
    });
  }
}

for (const worker of fileUploaderWorkers) {
  delegateFileUpload(worker);
  worker.on("message", () => {
    if (fileNames.length === 0) {
      worker.terminate();
    } else {
      delegateFileUpload(worker);
    }
  });
}
