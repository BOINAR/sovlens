import { Test, TestingModule } from '@nestjs/testing';
import { StorageConfigService } from './storage-config.service';
import { StorageConfigRepository } from './storage-config.repository';

describe('StorageConfigService', () => {
  let service: StorageConfigService;
  let storageConfigRepository: jest.Mocked<StorageConfigRepository>;

  const userId = 'user-id-123';

  const mockProfile = {
    id: 'profile-id-123',
    userId,
    mode: 'sovereign' as const,
    endpoint: 'http://192.168.1.20:3900',
    accessKey: 'access-key',
    secretKey: 'secret-key',
    bucket: 'sovlens-photos',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageConfigService,
        {
          provide: StorageConfigRepository,
          useValue: {
            findByUserId: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StorageConfigService>(StorageConfigService);
    storageConfigRepository = module.get(StorageConfigRepository);

    jest.clearAllMocks();
  });

  describe('getConfig', () => {
    it('devrait retourner le mode cloud par défaut si aucun profil n\'existe', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);

      const result = await service.getConfig(userId);

      expect(result).toEqual({ mode: 'cloud', endpoint: null, bucket: null });
    });

    it('devrait retourner la configuration sans exposer les credentials', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(mockProfile);

      const result = await service.getConfig(userId);

      expect(result).toEqual({
        mode: 'sovereign',
        endpoint: mockProfile.endpoint,
        bucket: mockProfile.bucket,
      });
      expect(result).not.toHaveProperty('accessKey');
      expect(result).not.toHaveProperty('secretKey');
    });
  });

  describe('updateConfig', () => {
    it('devrait mettre à jour la configuration en mode souverain', async () => {
      storageConfigRepository.upsert.mockResolvedValue(mockProfile);

      const result = await service.updateConfig(userId, {
        mode: 'sovereign',
        endpoint: 'http://192.168.1.20:3900',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });

      expect(storageConfigRepository.upsert).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({ mode: 'sovereign' }),
      );
      expect(result).not.toHaveProperty('secretKey');
    });

    it('devrait basculer vers le mode cloud', async () => {
      storageConfigRepository.upsert.mockResolvedValue({
        ...mockProfile,
        mode: 'cloud',
        endpoint: null,
        bucket: null,
      });

      const result = await service.updateConfig(userId, { mode: 'cloud' });

      expect(result.mode).toBe('cloud');
    });
  });
});