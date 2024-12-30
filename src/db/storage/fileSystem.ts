import fs from 'fs';
import path from 'path';

export class FileSystemStorage {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.initializeDataDirectory();
  }

  private initializeDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
  }

  async readFile(filename: string): Promise<any> {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      await this.writeFile(filename, []);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async writeFile(filename: string, data: any): Promise<void> {
    const filePath = path.join(this.dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}