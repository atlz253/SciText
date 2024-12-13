import fs from "node:fs";
import axios from "axios";
import path from "node:path";
import FormData from "form-data";
import threads from "node:worker_threads";

threads.parentPort?.on("message", async ({ filePath }) => {
  const file = fs.createReadStream(filePath);
  const form = new FormData();
  form.append("pdf", file, path.basename(filePath));

  try {
    const response = await axios.post("http://localhost:3000/api/paper", form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log(response.data);
    threads.parentPort?.postMessage({ success: true, data: response.data });
  } catch (error) {
    threads.parentPort?.postMessage({ success: false });
  }
});
