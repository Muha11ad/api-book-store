import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { ILogger } from "../../logger/logger.interface";
import { IHandleFiles } from "./files.handle.interface";

@injectable()
export class HandleFiles implements IHandleFiles {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	public async customReadFile<T>(fileName: string): Promise<T[]> {
		try {
			const filePath = join(
				process.cwd(),
				"src",
				"db",
				`${fileName}.data.json`
			);
			const data = await readFile(filePath, "utf8");
			return JSON.parse(data) as T[];
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(`Error reading file: ${error.message}`);
				throw new Error(`Error reading file: ${error.message}`);
			} else {
				console.error(`Unexpected error reading file ${fileName}`);
				throw new Error(`Unexpected error reading file ${fileName}`);
			}
		}
	}

	public async customWriteFile<T>(fileName: string, data: T[]): Promise<void> {
		try {
			const filePath = join(
				process.cwd(),
				"src",
				"db",
				`${fileName}.data.json`
			);
			await writeFile(filePath, JSON.stringify(data));
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.logger.error(`Error writing file: ${error.message}`);
				throw new Error(`Error writing file: ${error.message}`);
			} else {
				console.error(`Unexpected error writing file ${fileName}`);
				throw new Error(`Unexpected error writing file ${fileName}`);
			}
		}
	}
}
