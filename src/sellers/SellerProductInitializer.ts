import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { Product } from '../controllers/types/Product';

type ParserFunction = (products: unknown[]) => Product[];

type SellerProductInitializerParams = {
  sellerName: string;
  parser: ParserFunction;
}

export class SellerProductInitializer implements SellerProductInitializerParams {
  readonly sellerName: string;
  readonly parser: ParserFunction;

  constructor(params: SellerProductInitializerParams) {
    this.sellerName = params.sellerName;
    this.parser = params.parser;
  }

  getMostRecentCsvFileName(): string | undefined {
    const dirPath = path.resolve(__dirname, `${this.sellerName}/data`);
    const fileNames = fs.readdirSync(dirPath);
    let mostRecentStamp: string | undefined;
    let mostRecentFileName: string | undefined;

    for (const fileName of fileNames) {
      const fileNameParts = fileName.split('-');
      const stamp = fileNameParts[fileNameParts.length - 1];
      if (!mostRecentStamp || stamp > mostRecentStamp) {
        mostRecentStamp  = stamp;
        mostRecentFileName = fileName;
      }
    }
    return mostRecentFileName;
  }

  async parseCsv(fileName: string) {
    try {
      const records = [];
      const stream = fs.createReadStream(fileName);
      const parser = stream.pipe(parse({ delimiter: '-', columns: true }));
      for await (const record of parser) {
        records.push(record);
      }
      return records;
    } catch (error) {
      console.log(`failed to parse csv: ${fileName}`);
      throw error;
    }
  }


  async run() {
    const mostRecentCsv = this.getMostRecentCsvFileName();
    const filePath = path.resolve(__dirname, `sellers/${this.sellerName}/${mostRecentCsv}`);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  }
}