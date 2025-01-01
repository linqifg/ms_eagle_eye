import React, { useState } from 'react';
import { generateInvitationCode } from '../../db/invitationCodeManager';

export function GenerateInviteCode() {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateCode = async () => {
    try {
      const newCode = await generateInvitationCode();
      setCode(newCode);
      setError('');
    } catch (err) {
      setError('Failed to generate invitation code');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerateCode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Invitation Code
      </button>
      
      {code && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <p className="text-green-700">New invitation code: <strong>{code}</strong></p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}