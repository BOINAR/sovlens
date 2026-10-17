# Monitoring

Stack Prometheus + Grafana déployée sur le VPS par le job `deploy-monitoring` du pipeline, sur le réseau overlay `sovlens_sovlens-net` partagé avec la stack applicative.

## Services

| Service | Rôle |
|---|---|
| Prometheus | Collecte des métriques, rétention 15 jours |
| Grafana | Tableaux de bord, exposé sur `sovlens-grafana.stellodev.com` via Caddy |
| node-exporter | Métriques système du VPS |
| cAdvisor | Métriques des conteneurs |

## Cibles Prometheus

| Job | Cible |
|---|---|
| `sovlens-backend` | `backend:4000/metrics` |
| `node-exporter` | `node-exporter:9100` |
| `cadvisor` | `cadvisor:8080` |
| `garage-vps` | `garage:3903/metrics` |
| `garage-homelab` | `192.168.1.20:3903/metrics`, via Tailscale, authentifié par token |

Le VPS rejoint le homelab par Tailscale. Les ACL limitent son accès à `192.168.1.20` sur les ports 3900 (S3) et 3903 (admin et métriques), et rien d'autre.

## Secrets

Le mot de passe admin de Grafana et le token de métriques du homelab sont des Docker secrets créés par le pipeline depuis les GitHub Secrets. Voir [`documentation/architecture/secrets.md`](../documentation/architecture/secrets.md).

## Tableaux de bord

Provisionnés depuis `grafana/provisioning/` : `sovlens-overview.json` et `sovlens-monitoring.json`.
