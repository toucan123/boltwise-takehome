import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';
import { Product } from '../controllers/types/Product';
import { TypeboxValidator } from '../utils/TypeboxValidator';
import { TSchema, Static } from '@sinclair/typebox';
import { productController } from '../controllers/ProductController';

const fileNamePattern = /^(.+)-(\d{8})\.csv$/;

type ParserFunction<ProductSchema extends TSchema> = (
  products: Static<ProductSchema>
) => Product[];

type SellerProductInitializerParams<ProductSchema extends TSchema> = {
  sellerName: string;
  parser: ParserFunction<ProductSchema>;
  validator: TypeboxValidator<ProductSchema>
}

export class SellerProductInitializer<ProductSchema extends TSchema> {
  readonly sellerName: string;
  readonly parser: ParserFunction<ProductSchema>;
  readonly validator: TypeboxValidator<ProductSchema>;

  constructor(params: SellerProductInitializerParams<ProductSchema>) {
    this.sellerName = params.sellerName;
    this.parser = params.parser;
    this.validator = params.validator;
  }

  getMostRecentCsvFileInfo(): { stamp: string, filename: string } | undefined {
    const dirPath = path.resolve(__dirname, `${this.sellerName}/data`);
    const fileNames = fs.readdirSync(dirPath);

    let mostRecentStamp: string | undefined;
    let mostRecentFileName: string | undefined;

    for (const fileName of fileNames) {
      const matches = fileName.match(fileNamePattern);
      const stamp = matches && matches[2];
      if (stamp && (!mostRecentStamp || stamp > mostRecentStamp)) {
        mostRecentStamp = stamp;
        mostRecentFileName = fileName;
      }
    }
    return mostRecentStamp && mostRecentFileName 
      ? {
        stamp: mostRecentStamp,
        filename: mostRecentFileName,
      }
      : undefined;
  }

  async parseCsv(fileName: string): Promise<unknown[]> {
    const records = [];
    const filePath = path.resolve(__dirname, `${this.sellerName}/data/${fileName}`)
    try {
      const stream = fs.createReadStream(filePath);
      const parser = stream.pipe(parse({ delimiter: ',', columns: true }));
      for await (const record of parser) {
        records.push(record);
      }
    } catch (error) {
      console.log(`failed to parse csv: ${filePath} ${JSON.stringify(error)}]`);
    }
    return records;
  }

  parseProducts(data: unknown[]): Product[] {
    const products = this.validator.validate(data);
    return this.parser(products);
  }

  async run(): Promise<void> {
    const csvInfo = this.getMostRecentCsvFileInfo();
    const records = csvInfo
      ? await this.parseCsv(csvInfo.filename)
      : [];

    const products = this.parseProducts(records);

    if (!products.length || !csvInfo) {
      console.log(`Failed to find products for seller: ${this.sellerName} file: ${csvInfo?.filename}`);
    } else {
      await productController.saveProductsBatch(products, csvInfo.stamp);
    }
  }
}