import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import request from 'supertest';
import { randomUUID } from 'crypto';
import { AppModule } from './../src/app.module';
import { DRIZZLE, DbClient } from '../src/db/drizzle.provider';
import { usersTable } from '../src/users/users.schema';
import { eq } from 'drizzle-orm';

describe('Killer Feature — bascule Cloud / Souverain (e2e)', () => {
  let app: NestFastifyApplication;
  let db: DbClient;
  let accessToken: string;

  const testEmail = `e2e-storage-${randomUUID()}@sovlens.test`;
  const testPassword = 'MotDePasse123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.register(fastifyCookie);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    db = moduleFixture.get<DbClient>(DRIZZLE);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await db.delete(usersTable).where(eq(usersTable.email, testEmail));
    await app.close();
  });

  it('GET /storage/config — mode cloud par défaut pour un nouvel utilisateur', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/config')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('cloud');
  });

  it('GET /storage/config — rejette une requête non authentifiée', async () => {
    const res = await request(app.getHttpServer()).get('/storage/config');
    expect(res.status).toBe(401);
  });

  it('PATCH /storage/config — refuse le mode souverain sans configuration existante', async () => {
    const res = await request(app.getHttpServer())
      .patch('/storage/config')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ mode: 'sovereign' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Aucune configuration souveraine');
  });

  it('PATCH /storage/config — active le mode souverain avec une configuration complète', async () => {
    const res = await request(app.getHttpServer())
      .patch('/storage/config')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mode: 'sovereign',
        endpoint: 'http://192.168.1.20:3900',
        bucket: 'sovlens-photos-e2e-test',
        accessKey: 'test-access-key',
        secretKey: 'test-secret-key',
      });

    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('sovereign');
    expect(res.body.endpoint).toBe('http://192.168.1.20:3900');
  });

  it('GET /storage/config — confirme la persistance du mode souverain', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/config')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('sovereign');
    expect(res.body.bucket).toBe('sovlens-photos-e2e-test');
  });

  it('PATCH /storage/config — permet de rebasculer en mode cloud', async () => {
    const res = await request(app.getHttpServer())
      .patch('/storage/config')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ mode: 'cloud' });

    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('cloud');
  });
});