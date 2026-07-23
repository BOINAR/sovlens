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

describe('Auth (e2e)', () => {
  let app: NestFastifyApplication;
  let db: DbClient;

  const testEmail = `e2e-auth-${randomUUID()}@sovlens.test`;
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
  });

  afterAll(async () => {
    await db.delete(usersTable).where(eq(usersTable.email, testEmail));
    await app.close();
  });

  it('POST /auth/register — crée un compte utilisateur', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /auth/register — refuse un email déjà utilisé', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('POST /auth/login — refuse un mauvais mot de passe', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: 'MauvaisMotDePasse' });

    expect(res.status).toBe(401);
  });

  it("POST /auth/login — connecte l'utilisateur et pose le cookie refresh_token", async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies.some((c) => c.startsWith('refresh_token='))).toBe(true);
  });

  it('Parcours complet : login -> refresh -> logout', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    const cookies = loginRes.headers['set-cookie'] as unknown as string[];
    const refreshCookie = cookies.find((c) => c.startsWith('refresh_token='));
    expect(refreshCookie).toBeDefined();

    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', refreshCookie!);

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');

    const newCookies = refreshRes.headers['set-cookie'] as unknown as string[];
    const newRefreshCookie = newCookies.find((c) =>
      c.startsWith('refresh_token='),
    );
    expect(newRefreshCookie).toBeDefined();
    expect(newRefreshCookie).not.toEqual(refreshCookie);

    const logoutRes = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', newRefreshCookie!);

    expect(logoutRes.status).toBe(200);
  });

  it('POST /auth/refresh — rejette une requête sans cookie', async () => {
    const res = await request(app.getHttpServer()).post('/auth/refresh');
    expect(res.status).toBe(401);
  });
});
