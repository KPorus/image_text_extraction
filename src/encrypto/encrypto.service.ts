import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

@Injectable()
export class EncryptoService {
  constructor(private readonly config: ConfigService) {}
  private readonly SECRET_KEY = this.config.get<string>('SECRET_KEY');

  // Encrypts a given text
  encrypt(text: string): string {
    const iv = randomBytes(16);
    const key = scryptSync(this.SECRET_KEY, 'salt', 32);
    try {
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const encryptedData = Buffer.concat([
        cipher.update(text),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encryptedData.toString('hex')}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt the text');
    }
  }

  // Decrypts a given encrypted text
  decrypt(encryptedText: string): string {
    try {
      const [ivHex, authTagHex, encryptedDataHex] = encryptedText.split(':');
      if (!ivHex || !authTagHex || !encryptedDataHex) {
        throw new Error('Invalid encrypted text format');
      }

      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encryptedData = Buffer.from(encryptedDataHex, 'hex');

      const key = scryptSync(this.SECRET_KEY, 'salt', 32);
      const decipher = createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag); // Set the authentication tag

      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);
      return decrypted.toString();
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt the text');
    }
  }
}
