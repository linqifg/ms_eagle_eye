import { User } from '../models';
import { BrowserStorage } from '../storage/browserStorage';

export class UserRepository {
  private storage: BrowserStorage;
  private readonly storageKey = 'users';

  constructor(storage: BrowserStorage) {
    this.storage = storage;
  }

  async findByName(name: string): Promise<User | undefined> {
    const users = await this.storage.readFile(this.storageKey);
    return users.find((u: User) => u.name === name);
  }

  async exists(name: string): Promise<boolean> {
    const users = await this.storage.readFile(this.storageKey);
    return users.some((u: User) => u.name === name);
  }

  async create(user: User): Promise<boolean> {
    try {
      const users = await this.storage.readFile(this.storageKey);
      users.push(user);
      await this.storage.writeFile(this.storageKey, users);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }
}