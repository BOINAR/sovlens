
## Monitoring multi-site (VPS + Homelab)

Prometheus est centralisé sur le VPS et scrape :
- les services locaux (backend, node-exporter, cAdvisor, Garage cloud) via le réseau overlay Swarm
- Garage homelab, accessible uniquement via un tunnel Tailscale ponctuel

**Choix de sécurité** : le VPS n'est volontairement pas rattaché en permanence au tailnet du homelab.
Cela évite qu'une compromission de l'infrastructure publique (VPS) donne un accès réseau direct et
permanent à l'infrastructure privée (homelab). Le statut `garage-homelab` dans Grafana reste donc à
`down` par défaut, et ne passe à `up` que lors d'une connexion Tailscale explicite — cohérent avec le
principe de souveraineté du projet : l'infrastructure personnelle de l'utilisateur n'est jamais exposée
en continu.
