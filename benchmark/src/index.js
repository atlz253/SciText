import fs from "node:fs";
import axios from "axios";
import path from "node:path";
import FormData from "form-data";
import { program } from "commander";

program.requiredOption("--input <path>", "Input directory with PDFs");
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

for (const fileName of fileNames) {
  const filePath = path.resolve(options.input, fileName);
  console.log((await uploadFileWithPath(filePath)).data);
}
