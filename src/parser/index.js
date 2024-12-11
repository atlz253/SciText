import { PdfReader } from "pdfreader";

class PDFTextParser {
  fromBuffer(buffer) {
    let result = "";
    return new Promise((resolve, reject) => {
      new PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) reject("error: " + err);
        else if (!item) resolve(result);
        else if (item.text) result += " " + item.text;
      });
    });
  }
}

const parser = new PDFTextParser();

export default parser;
