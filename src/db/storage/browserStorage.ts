export class BrowserStorage {
  async readFile(key: string): Promise<any[]> {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return [];
    }
  }

  async writeFile(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      throw error;
    }
  }
}