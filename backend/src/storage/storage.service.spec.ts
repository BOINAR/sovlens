import { Test, TestingModule } from '@nestjs/testing';
import {
  StorageService,
  CloudStorageProvider,
  SovereignStorageProvider,
} from './storage.service';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({ Body: 'mocked-stream' }),
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com'),
}));

describe('StorageService', () => {
  let service: StorageService;

  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      S3_ENDPOINT: 'http://localhost:3900',
      S3_REGION: 'garage',
      S3_ACCESS_KEY: 'test-key',
      S3_SECRET_KEY: 'test-secret',
      S3_BUCKET: 'test-bucket',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('getProvider — Strategy Pattern', () => {
    it('devrait retourner le CloudStorageProvider par défaut (pas de profil)', () => {
      const provider = service.getProvider('cloud', undefined);
      expect(provider).toBeInstanceOf(CloudStorageProvider);
    });

    it('devrait retourner le CloudStorageProvider si mode = cloud', () => {
      const provider = service.getProvider('cloud', undefined);
      expect(provider).toBeInstanceOf(CloudStorageProvider);
    });

    it('devrait retourner le SovereignStorageProvider si profil complet et mode = sovereign', () => {
      const provider = service.getProvider('sovereign', {
        endpoint: 'http://192.168.1.20:3900',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });
      expect(provider).toBeInstanceOf(SovereignStorageProvider);
    });

    it('devrait retourner le CloudStorageProvider si mode = sovereign mais profil incomplet', () => {
      const provider = service.getProvider('sovereign', {
        endpoint: 'http://192.168.1.20:3900',
        // accessKey manquant
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });
      expect(provider).toBeInstanceOf(CloudStorageProvider);
    });
  });

  describe('méthodes de commodité (délèguent au cloud par défaut)', () => {
    it('upload devrait déléguer au cloudProvider', async () => {
      const file = Buffer.from('test-data');
      const result = await service.upload(file, 'key.webp', 'image/webp');

      expect(result).toBe('key.webp');
    });

    it('delete devrait déléguer au cloudProvider', async () => {
      await expect(service.delete('key.webp')).resolves.toBeUndefined();
    });

    it('getSignedUrl devrait retourner une URL signée', async () => {
      const url = await service.getSignedUrl('key.webp');
      expect(url).toBe('https://signed-url.com');
    });

    it('getStream devrait retourner le stream', async () => {
      const stream = await service.getStream('key.webp');
      expect(stream).toBe('mocked-stream');
    });
  });
});

describe('CloudStorageProvider', () => {
  let provider: CloudStorageProvider;

  beforeEach(() => {
    process.env.S3_ENDPOINT = 'http://localhost:3900';
    process.env.S3_ACCESS_KEY = 'test-key';
    process.env.S3_SECRET_KEY = 'test-secret';
    process.env.S3_BUCKET = 'test-bucket';
    provider = new CloudStorageProvider();
    jest.clearAllMocks();
  });

  it('devrait uploader un fichier et retourner la clé', async () => {
    const file = Buffer.from('test-data');
    const result = await provider.upload(file, 'photo.webp', 'image/webp');
    expect(result).toBe('photo.webp');
  });

  it('devrait supprimer un fichier', async () => {
    await expect(provider.delete('photo.webp')).resolves.toBeUndefined();
  });

  it('devrait générer une URL signée', async () => {
    const url = await provider.getSignedUrl('photo.webp');
    expect(url).toBe('https://signed-url.com');
  });

  it('devrait retourner un stream', async () => {
    const stream = await provider.getStream('photo.webp');
    expect(stream).toBe('mocked-stream');
  });
});

describe('SovereignStorageProvider', () => {
  let provider: SovereignStorageProvider;

  beforeEach(() => {
    provider = new SovereignStorageProvider(
      'http://192.168.1.20:3900',
      'sovereign-key',
      'sovereign-secret',
      'sovlens-photos',
    );
    jest.clearAllMocks();
  });

  it('devrait uploader un fichier vers le stockage souverain', async () => {
    const file = Buffer.from('test-data');
    const result = await provider.upload(file, 'photo.webp', 'image/webp');
    expect(result).toBe('photo.webp');
  });

  it('devrait supprimer un fichier du stockage souverain', async () => {
    await expect(provider.delete('photo.webp')).resolves.toBeUndefined();
  });

  it('devrait générer une URL signée pour le stockage souverain', async () => {
    const url = await provider.getSignedUrl('photo.webp');
    expect(url).toBe('https://signed-url.com');
  });
});
