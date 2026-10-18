// Types générés à partir de openapi.yaml — garder synchronisé avec le backend

export type StorageMode = 'cloud' | 'sovereign';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

// Réponse de /auth/login et /auth/refresh — le refresh token est en cookie httpOnly
export interface AuthResponse {
  accessToken: string;
}

export interface MessageResponse {
  message: string;
}

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  objectKey: string;
  url: string;
  size: number;
  storageMode: StorageMode;
  createdAt: string;
}

export interface Album {
  id: string;
  name: string;
  photos: Photo[];
  createdAt: string;
}

export interface ShareLink {
  token: string;
  url: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface ShareLinkSummary {
  token: string;
  url: string;
  type: 'photo' | 'album';
  name: string;
  storageMode: StorageMode | null;
  status: 'active' | 'expired';
  expiresAt: string | null;
  createdAt: string;
}

export interface SharedResource {
  type: 'photo' | 'album';
  resource: Photo | Album;
}

export interface StorageConfig {
  mode: StorageMode;
  endpoint?: string | null;
  bucket?: string | null;
}

export interface UpdateStorageConfigRequest {
  mode: StorageMode;
  endpoint?: string | null;
  accessKey?: string | null;
  secretKey?: string | null;
  bucket?: string | null;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string;
  error?: string;
}

export class ApiError extends Error {
  statusCode: number;
  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
  }
}