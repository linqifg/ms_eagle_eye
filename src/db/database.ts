import { BrowserStorage } from './storage/browserStorage';
import { UserRepository } from './repositories/userRepository';
import { InviteCodeRepository } from './repositories/inviteCodeRepository';
import { IDatabase } from './types';

class Database implements IDatabase {
  private userRepo: UserRepository;
  private inviteRepo: InviteCodeRepository;

  constructor() {
    const storage = new BrowserStorage();
    this.userRepo = new UserRepository(storage);
    this.inviteRepo = new InviteCodeRepository(storage);
  }

  async createUser(name: string, password: string, code: string): Promise<boolean> {
    if (await this.userRepo.exists(name)) {
      return false;
    }
    return this.userRepo.create({ name, password, code });
  }

  async validateUser(name: string, password: string): Promise<boolean> {
    for(let u of users) {
      if(u.name === name)
        return u.pass === password;
    }
    const user = await this.userRepo.findByName(name);
    return user?.password === password;
  }

  async validateInvitationCode(code: string): Promise<boolean> {
    return this.inviteRepo.isValid(code);
  }

  async isUserExists(name: string): Promise<boolean> {
    for(let u of users) {
      if(u.name === name)
        return true;
    }
    return this.userRepo.exists(name);
  }

  async addInvitationCode(codeData: { code: string; createdAt: number; expiresAt: number }): Promise<boolean> {
    return this.inviteRepo.create(codeData);
  }
}

export const database = new Database();

export const users = [
  {
    name:'11',
    pass:'00'
  },
  {
    name:'112',
    pass:'001'
  }
];
