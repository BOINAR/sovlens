import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Chiffrement au repos des secrets stockés en base (identifiants S3 souverains).
// AES-256-GCM, clé de 32 octets en base64 dans STORAGE_ENCRYPTION_KEY.
// Format stocké : enc:v1:<iv>:<tag>:<texte chiffré> (base64)

const PREFIX = 'enc:v1:';

function getKey(): Buffer | null {
  const raw = process.env.STORAGE_ENCRYPTION_KEY;
  if (!raw) return null;

  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error(
      'STORAGE_ENCRYPTION_KEY doit contenir 32 octets encodés en base64 (openssl rand -base64 32)',
    );
  }
  return key;
}

export function isEncryptionConfigured(): boolean {
  return getKey() !== null;
}

export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

export function encryptSecret<T extends string | null | undefined>(
  value: T,
): T | string {
  const key = getKey();
  if (!key || value == null || isEncrypted(value)) return value;

  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

// Les valeurs non préfixées (enregistrées avant le chiffrement) sont rendues telles quelles
export function decryptSecret<T extends string | null | undefined>(
  value: T,
): T | string {
  if (!isEncrypted(value)) return value;

  const key = getKey();
  if (!key) {
    throw new Error(
      'Secret chiffré en base mais STORAGE_ENCRYPTION_KEY est absente',
    );
  }

  const [iv, tag, data] = (value as string).slice(PREFIX.length).split(':');
  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
