import fs from "node:fs";
import PDFDocument from "pdfkit";
import { faker } from "@faker-js/faker";

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream("output.pdf"));

doc.text(faker.lorem.paragraphs(10000, "\n\n"), 100, 100);

doc.end();
