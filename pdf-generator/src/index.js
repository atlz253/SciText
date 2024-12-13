import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { program } from "commander";
import { faker } from "@faker-js/faker";

const baseOutputDirectory = "./output/pdf-generator";
const outputDirectory = path.resolve(
  baseOutputDirectory,
  new Date().getTime().toString()
);

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

async function generatePDF(fileName) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(
      path.resolve(outputDirectory, fileName)
    );
    doc.pipe(stream);
    doc.text(
      faker.lorem.paragraphs(
        { min: options.minParagraphs, max: options.maxParagraphs },
        "\n\n"
      )
    );
    doc.end();
    stream.on("close", () => resolve(null));
  });
}

for (let i = 0; i < options.count; i++) {
  await generatePDF(`${i}.pdf`);
}
