import { User } from '../types';

export class MockStorage {
  private users: User[] = [];
  private inviteCodes: { code: string; used: boolean; expiresAt: Date }[] = [];

  async findUserByName(name: string) {
    console.log('Mock: Finding user by name:', name);
    return this.users.find(u => u.name === name);
  }

  async createUser(name: string, password: string, code: string) {
    console.log('Mock: Creating user:', { name, code });
    if (this.users.some(u => u.name === name)) {
      return false;
    }
    this.users.push({ name, password, invite_code: code });
    return true;
  }

  async validateInviteCode(code: string) {
    console.log('Mock: Validating invite code:', code);
    const inviteCode = this.inviteCodes.find(ic => ic.code === code);
    return inviteCode && !inviteCode.used && inviteCode.expiresAt > new Date();
  }

  async markInviteCodeAsUsed(code: string) {
    console.log('Mock: Marking invite code as used:', code);
    const inviteCode = this.inviteCodes.find(ic => ic.code === code);
    if (inviteCode) {
      inviteCode.used = true;
      return true;
    }
    return false;
  }

  async createInviteCode(code: string, expiresAt: Date) {
    console.log('Mock: Creating invite code:', { code, expiresAt });
    this.inviteCodes.push({ code, used: false, expiresAt });
    return true;
  }
}