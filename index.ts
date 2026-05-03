import { Command } from "commander";
import fs from "fs";
import translate from "translate";

const program = new Command();

program
  .name("mslate")
  .description("For translating mtool json files")
  .version("1.0.0");

program.option("-i, --input <file>", "Input mtool json file")
  .option("-s, --source <language>", "Source language code (e.g., en)")
  .option("-t, --target <language>", "Target language code (e.g., es)")
  .option("-o, --output <file>", "Output mtool json file");

program.parse(process.argv);

const options = program.opts();

if (!options.input || !options.source || !options.target || !options.output) {
  console.error("All options are required: --input, --source, --target, --output");
  process.exit(1);
}

const inputJson = JSON.parse(fs.readFileSync(options.input, "utf-8"));

translate.engine = "google";

let results: { [key: string]: string } = {};

const totalKeys = Object.keys(inputJson).length;

console.log(`Translating ${totalKeys} keys from ${options.source} to ${options.target}...`);

for (const key in inputJson) {
  translate(inputJson[key], {
    from: options.source,
    to: options.target,
  }).then((translated) => {
    results[key] = translated;
    console.log(`Translated: "${inputJson[key]}" -> "${translated}"`);
  })
}

fs.writeFileSync(options.output, JSON.stringify(results, null, 2), "utf-8");

console.log(`Translation completed. Output saved to ${options.output}`);