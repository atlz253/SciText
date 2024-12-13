import fs from "node:fs";
import PDFDocument from "pdfkit";
import { faker } from "@faker-js/faker";
import { program } from "commander";

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

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream("output.pdf"));

doc.text(faker.lorem.paragraphs(10000, "\n\n"), 100, 100);

doc.end();
