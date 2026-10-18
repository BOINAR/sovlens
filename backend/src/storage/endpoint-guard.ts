import { BadRequestException } from '@nestjs/common';
import * as dns from 'dns';
import * as http from 'http';
import * as https from 'https';
import { BlockList, isIP, LookupFunction } from 'net';

// Protection SSRF pour les endpoints S3 souverains saisis par les utilisateurs :
// le backend ne doit pas pouvoir être utilisé pour joindre le réseau interne
// (services Swarm, loopback, métadonnées cloud, LAN, Tailscale).

const blockedRanges = new BlockList();
[
  ['0.0.0.0', 8],
  ['10.0.0.0', 8], // overlay Swarm
  ['100.64.0.0', 10], // CGNAT / Tailscale
  ['127.0.0.0', 8],
  ['169.254.0.0', 16], // link-local, métadonnées cloud
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
].forEach(([net, prefix]) =>
  blockedRanges.addSubnet(net as string, prefix as number, 'ipv4'),
);
blockedRanges.addAddress('::', 'ipv6');
blockedRanges.addAddress('::1', 'ipv6');
blockedRanges.addSubnet('fc00::', 7, 'ipv6');
blockedRanges.addSubnet('fe80::', 10, 'ipv6');

const ENDPOINT_NOT_ALLOWED = 'Endpoint de stockage souverain non autorisé';

// Hôtes privés explicitement autorisés (ex. Garage du homelab via Tailscale) :
// SOVEREIGN_ENDPOINT_ALLOWED_HOSTS=192.168.1.20,garage.mondomaine.lan
function allowedHosts(): Set<string> {
  return new Set(
    (process.env.SOVEREIGN_ENDPOINT_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  );
}

function stripBrackets(host: string) {
  return host.replace(/^\[|\]$/g, '');
}

export function isHostAllowlisted(host: string): boolean {
  return allowedHosts().has(stripBrackets(host).toLowerCase());
}

export function isAddressBlocked(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return true;
  return blockedRanges.check(address, family === 6 ? 'ipv6' : 'ipv4');
}

// Validation à l'enregistrement de la configuration
export async function assertSovereignEndpointAllowed(
  endpoint: string,
): Promise<void> {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new BadRequestException('URL invalide');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException("L'endpoint doit être en http ou https");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new BadRequestException(
      "L'endpoint ne doit contenir ni identifiants, ni paramètres, ni ancre",
    );
  }
  if (url.pathname !== '/') {
    throw new BadRequestException("L'endpoint ne doit pas contenir de chemin");
  }

  const host = stripBrackets(url.hostname);
  if (isHostAllowlisted(host)) return;

  let addresses: string[];
  if (isIP(host)) {
    addresses = [host];
  } else {
    try {
      const results = await dns.promises.lookup(host, { all: true });
      addresses = results.map((r) => r.address);
    } catch {
      throw new BadRequestException("Impossible de résoudre l'endpoint");
    }
  }

  if (addresses.length === 0 || addresses.some(isAddressBlocked)) {
    throw new BadRequestException(ENDPOINT_NOT_ALLOWED);
  }
}

// Vérification au moment de la requête : couvre les configurations déjà
// enregistrées et le DNS rebinding (le nom est re-résolu à chaque connexion)
export function assertEndpointHostUsable(endpoint: string): void {
  const host = stripBrackets(new URL(endpoint).hostname);
  if (isIP(host) && !isHostAllowlisted(host) && isAddressBlocked(host)) {
    throw new BadRequestException(ENDPOINT_NOT_ALLOWED);
  }
}

const safeLookup: LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, results) => {
    if (err) return callback(err, '', 4);

    const list = results;
    if (
      !isHostAllowlisted(hostname) &&
      list.some((r) => isAddressBlocked(r.address))
    ) {
      return callback(
        Object.assign(new Error(ENDPOINT_NOT_ALLOWED), { code: 'EBLOCKED' }),
        '',
        4,
      );
    }

    if (options.all) return callback(null, list);
    return callback(null, list[0].address, list[0].family);
  });
};

// Agents HTTP utilisés par le client S3 souverain
export const guardedHttpAgent = new http.Agent({
  keepAlive: true,
  lookup: safeLookup,
});
export const guardedHttpsAgent = new https.Agent({
  keepAlive: true,
  lookup: safeLookup,
});
