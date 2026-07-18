import { apiClient, setAccessToken } from './client';
import { Album, AuthResponse, Photo, ShareLink, ShareLinkSummary, SharedResource, StorageConfig, UpdateStorageConfigRequest, User } from './types';

export const authApi = {
  async register(email: string, password: string) {
    const res = await apiClient.post<AuthResponse>('/auth/register', { email, password }, { skipAuthRetry: true });
    setAccessToken(res.accessToken);
    return res;
  },
  async login(email: string, password: string) {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password }, { skipAuthRetry: true });
    setAccessToken(res.accessToken);
    return res;
  },
  async logout() {
    try {
      await apiClient.post<void>('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },
  forgotPassword(email: string) {
    return apiClient.post<void>('/auth/forgot-password', { email }, { skipAuthRetry: true });
  },
  resetPassword(token: string, password: string) {
    return apiClient.post<void>('/auth/reset-password', { token, password }, { skipAuthRetry: true });
  },
};

export const usersApi = {
  me: () => apiClient.get<User>('/users/me'),
  updatePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch<void>('/users/me/password', { currentPassword, newPassword }),
};

export const photosApi = {
  list: () => apiClient.get<Photo[]>('/photos'),
  get: (id: string) => apiClient.get<Photo>(`/photos/${id}`),
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.postForm<Photo>('/photos/upload', form);
  },
  remove: (id: string) => apiClient.delete<void>(`/photos/${id}`),
  downloadBlob: (id: string) => apiClient.get<Blob>(`/photos/${id}/download`),
};

export const albumsApi = {
  list: () => apiClient.get<Album[]>('/albums'),
  get: (id: string) => apiClient.get<Album>(`/albums/${id}`),
  create: (name: string) => apiClient.post<Album>('/albums', { name }),
  update: (id: string, name: string) => apiClient.patch<Album>(`/albums/${id}`, { name }),
  remove: (id: string) => apiClient.delete<void>(`/albums/${id}`),
  addPhoto: (albumId: string, photoId: string) => apiClient.post<Album>(`/albums/${albumId}/photos`, { photoId }),
  removePhoto: (albumId: string, photoId: string) => apiClient.delete<void>(`/albums/${albumId}/photos/${photoId}`),
};

export const sharingApi = {
  sharePhoto: (photoId: string, expiresAt?: string | null) =>
    apiClient.post<ShareLink>(`/sharing/photos/${photoId}`, expiresAt !== undefined ? { expiresAt } : undefined),
  shareAlbum: (albumId: string, expiresAt?: string | null) =>
    apiClient.post<ShareLink>(`/sharing/albums/${albumId}`, expiresAt !== undefined ? { expiresAt } : undefined),
  getShared: (token: string) => apiClient.public<SharedResource>(`/shared/${token}`),
  listMine: () => apiClient.get<ShareLinkSummary[]>('/sharing'),
  revoke: (token: string) => apiClient.delete<void>(`/sharing/${token}`),
};

export const storageApi = {
  getConfig: () => apiClient.get<StorageConfig>('/storage/config'),
  updateConfig: (config: UpdateStorageConfigRequest) => apiClient.patch<StorageConfig>('/storage/config', config),
};