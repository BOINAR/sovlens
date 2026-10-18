import { BadRequestException } from '@nestjs/common';
import {
  assertEndpointHostUsable,
  assertSovereignEndpointAllowed,
  isAddressBlocked,
} from './endpoint-guard';

describe('endpoint-guard', () => {
  const env = process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS;

  afterEach(() => {
    process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS = env;
  });

  describe('isAddressBlocked', () => {
    it.each([
      '127.0.0.1',
      '10.0.1.5',
      '172.20.0.3',
      '192.168.1.20',
      '169.254.169.254',
      '100.101.102.103',
      '::1',
      'fd00::1',
      '::ffff:10.0.0.1',
    ])('bloque %s', (ip) => {
      expect(isAddressBlocked(ip)).toBe(true);
    });

    it.each(['8.8.8.8', '194.163.177.96', '2606:4700:4700::1111'])(
      'autorise %s',
      (ip) => {
        expect(isAddressBlocked(ip)).toBe(false);
      },
    );
  });

  describe('assertSovereignEndpointAllowed', () => {
    it('refuse une IP interne non autorisée', async () => {
      process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS = '';
      await expect(
        assertSovereignEndpointAllowed('http://10.0.1.5:3903'),
      ).rejects.toThrow(BadRequestException);
    });

    it("accepte une IP privée présente dans l'allowlist", async () => {
      process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS = '192.168.1.20';
      await expect(
        assertSovereignEndpointAllowed('http://192.168.1.20:3900'),
      ).resolves.toBeUndefined();
    });

    it.each([
      'ftp://8.8.8.8',
      'http://user:pass@8.8.8.8',
      'http://8.8.8.8/chemin',
      'http://8.8.8.8/?x=1',
    ])('refuse %s', async (url) => {
      await expect(assertSovereignEndpointAllowed(url)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('accepte une IP publique', async () => {
      await expect(
        assertSovereignEndpointAllowed('https://8.8.8.8'),
      ).resolves.toBeUndefined();
    });
  });

  describe('assertEndpointHostUsable', () => {
    it('refuse une IP littérale interne', () => {
      process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS = '';
      expect(() => assertEndpointHostUsable('http://127.0.0.1:9000')).toThrow(
        BadRequestException,
      );
    });

    it('laisse passer un nom DNS (vérifié à la connexion)', () => {
      expect(() =>
        assertEndpointHostUsable('https://s3.example.com'),
      ).not.toThrow();
    });
  });
});
