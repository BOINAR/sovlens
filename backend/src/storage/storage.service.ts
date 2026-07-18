import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface IStorageProvider {
  upload(file: Buffer, key: string, mimeType: string): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string): Promise<string>;
  getStream(key: string): Promise<unknown>;
}

// ─── Cloud Provider ───────────────────────────────────────────────────────────

export class CloudStorageProvider implements IStorageProvider {
  private client: S3Client;
  private publicClient: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.S3_CLOUD_ENDPOINT,
      region: process.env.S3_CLOUD_REGION ?? 'garage',
      credentials: {
        accessKeyId: process.env.S3_CLOUD_ACCESS_KEY!,
        secretAccessKey: process.env.S3_CLOUD_SECRET_KEY!,
      },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.publicClient = new S3Client({
      endpoint:
        process.env.S3_CLOUD_PUBLIC_ENDPOINT ?? process.env.S3_CLOUD_ENDPOINT,
      region: process.env.S3_CLOUD_REGION ?? 'garage',
      credentials: {
        accessKeyId: process.env.S3_CLOUD_ACCESS_KEY!,
        secretAccessKey: process.env.S3_CLOUD_SECRET_KEY!,
      },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.bucket = process.env.S3_CLOUD_BUCKET!;
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
    return key;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.publicClient, command, {
      expiresIn: 3600,
      signableHeaders: new Set(['host']),
    });
  }

  async getStream(key: string): Promise<unknown> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const response = await this.client.send(command);
    return response.Body;
  }
}

// ─── Sovereign Provider ───────────────────────────────────────────────────────

export class SovereignStorageProvider implements IStorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor(
    endpoint: string,
    accessKey: string,
    secretKey: string,
    bucket: string,
  ) {
    this.client = new S3Client({
      endpoint,
      region: 'garage',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.bucket = bucket;
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
    return key;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, {
      expiresIn: 3600,
      signableHeaders: new Set(['host']),
    });
  }

  async getStream(key: string): Promise<unknown> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const response = await this.client.send(command);
    return response.Body;
  }
}

// ─── Storage Service (Strategy Router) ───────────────────────────────────────

@Injectable()
export class StorageService {
  private cloudProvider: CloudStorageProvider;

  constructor() {
    this.cloudProvider = new CloudStorageProvider();
  }

  getProvider(
    mode: string,
    storageProfile?: {
      endpoint?: string | null;
      accessKey?: string | null;
      secretKey?: string | null;
      bucket?: string | null;
    },
  ): IStorageProvider {
    if (
      mode === 'sovereign' &&
      storageProfile?.endpoint &&
      storageProfile.accessKey &&
      storageProfile.secretKey &&
      storageProfile.bucket
    ) {
      return new SovereignStorageProvider(
        storageProfile.endpoint,
        storageProfile.accessKey,
        storageProfile.secretKey,
        storageProfile.bucket,
      );
    }
    return this.cloudProvider;
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<string> {
    return this.cloudProvider.upload(file, key, mimeType);
  }

  async delete(key: string): Promise<void> {
    return this.cloudProvider.delete(key);
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.cloudProvider.getSignedUrl(key);
  }

  async getStream(key: string): Promise<unknown> {
    return this.cloudProvider.getStream(key);
  }
}