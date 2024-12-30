import { database } from './database';

interface InvitationCode {
  code: string;
  createdAt: number;
  expiresAt: number;
}

export async function generateInvitationCode(): Promise<string> {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const now = Date.now();
  
  const invitationCode: InvitationCode = {
    code,
    createdAt: now,
    expiresAt: now + (7 * 24 * 60 * 60 * 1000) // 7 days expiration
  };

  await database.addInvitationCode(invitationCode);
  return code;
}