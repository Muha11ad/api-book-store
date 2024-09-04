export interface IHandleFiles {
	customReadFile<T>(fileName: string): Promise<T[]>;
	customWriteFile<T>(fileName: string, data: T[]): Promise<void>;
  }
  