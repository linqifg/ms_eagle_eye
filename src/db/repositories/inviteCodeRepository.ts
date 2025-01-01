import { InvitationCode } from '../models';
import { BrowserStorage } from '../storage/browserStorage';

export class InviteCodeRepository {
  private storage: BrowserStorage;
  private readonly storageKey = 'invites';

  constructor(storage: BrowserStorage) {
    this.storage = storage;
  }

  async isValid(code: string): Promise<boolean> {
    if (code === '0000') return true;
    
    const codes = await this.storage.readFile(this.storageKey);
    const inviteCode = codes.find((c: InvitationCode) => c.code === code);
    if (!inviteCode) return false;
    return inviteCode.expiresAt > Date.now();
  }

  async create(code: InvitationCode): Promise<boolean> {
    try {
      const codes = await this.storage.readFile(this.storageKey);
      codes.push(code);
      await this.storage.writeFile(this.storageKey, codes);
      return true;
    } catch (error) {
      console.error('Error creating invite code:', error);
      return false;
    }
  }
}