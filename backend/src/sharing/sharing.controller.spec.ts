import { Test, TestingModule } from '@nestjs/testing';
import { SharingController } from './sharing.controller';
import { SharingService } from './sharing.service';
import { JwtGuard } from '../auth/jwt.guard';

describe('SharingController', () => {
  let controller: SharingController;
  let service: jest.Mocked<SharingService>;

  const userId = 'user-id-123';
  const photoId = 'photo-id-123';
  const albumId = 'album-id-123';
  const token = 'share-token-123';

  const mockShareLinkResponse = {
    token,
    url: `http://localhost:3000/share/${token}`,
    expiresAt: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharingController],
      providers: [
        {
          provide: SharingService,
          useValue: {
            getSharedResource: jest.fn(),
            createPhotoShareLink: jest.fn(),
            createAlbumShareLink: jest.fn(),
            revokeShareLink: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<SharingController>(SharingController);
    service = module.get(SharingService);

    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('getSharedResource', () => {
    it('devrait retourner une ressource partagée', async () => {
      const mockResource = { type: 'photo', resource: {} };
      service.getSharedResource.mockResolvedValue(mockResource as any);

      const result = await controller.getSharedResource(token);

      expect(service.getSharedResource).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockResource);
    });
  });

  describe('createPhotoShareLink', () => {
    it('devrait créer un lien de partage pour une photo', async () => {
      service.createPhotoShareLink.mockResolvedValue(mockShareLinkResponse);

      const result = await controller.createPhotoShareLink(
        { sub: userId, email: 'test@sovlens.com' },
        photoId,
        {},
      );

      expect(service.createPhotoShareLink).toHaveBeenCalledWith(
        userId,
        photoId,
        {},
      );
      expect(result).toEqual(mockShareLinkResponse);
    });
  });

  describe('createAlbumShareLink', () => {
    it('devrait créer un lien de partage pour un album', async () => {
      service.createAlbumShareLink.mockResolvedValue(mockShareLinkResponse);

      const result = await controller.createAlbumShareLink(
        { sub: userId, email: 'test@sovlens.com' },
        albumId,
        {},
      );

      expect(service.createAlbumShareLink).toHaveBeenCalledWith(
        userId,
        albumId,
        {},
      );
      expect(result).toEqual(mockShareLinkResponse);
    });
  });

  describe('revokeShareLink', () => {
    it('devrait révoquer un lien de partage', async () => {
      service.revokeShareLink.mockResolvedValue({
        message: 'Lien de partage révoqué',
      });

      const result = await controller.revokeShareLink(
        { sub: userId, email: 'test@sovlens.com' },
        token,
      );

      expect(service.revokeShareLink).toHaveBeenCalledWith(userId, token);
      expect(result).toEqual({ message: 'Lien de partage révoqué' });
    });
  });
});
