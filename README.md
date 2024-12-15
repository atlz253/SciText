# SciText

Application mockup and tools for testing monolithic, microservice and serverless architectures.

## Install requirements

Run the command: `npm ci`.

## Application mockup

The essence of the application is the ability to upload PDF files to the system, after which the text content is extracted and saved. Saved content can be accessed via HTTP and REST API.

The application files are located in the `app` directory.

Postgresql is required for the application to work, the connection data must be specified in `./app/.env`

To launch the application, enter the command: `npm run app:start`.

## PDF generator

The PDF generator allows you to quickly create input data for testing the application.

The generator files are located in the `pdf-generator` directory.

Example of a generator start command: `npm run pdfgen:start -- --count 1000 --min-paragraphs 20 --max-paragraphs 100 --seed 27`.

To display the available parameters, enter: `npm run pdfgen:start -- --help`.

## Benchmark

__(Work in progress)__

Benchmark sends requests to the application and measures fault tolerance and performance indicators.

Example of a benchmark start command: `npm run benchmark:start -- --input D:\Desktop\SciText\output\pdf-generator\1734122073079`.

To display the available parameters, enter: `npm run benchmark:start -- --help`.
