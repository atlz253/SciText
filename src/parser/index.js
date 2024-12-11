import { PdfReader } from "pdfreader";

function parsePDFTextFromBuffer(buffer) {
  let result = "";
  return new Promise((resolve, reject) => {
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject("error: " + err);
      else if (!item) resolve(result);
      else if (item.text) result += " " + item.text;
    });
  });
}

export default {
  parsePDFTextFromBuffer,
};
