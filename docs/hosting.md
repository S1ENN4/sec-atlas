# Hosting notes

How sec/atlas is served today, why it can time out on some networks, and the options to make it sturdier.

## Today

- Static export (`output: "export"`) built by Coolify from this repository on every push to `main`, served by nginx in a container (`Dockerfile`, `nginx.conf`), behind Coolify's Traefik with automatic TLS.
- Public hostname: `atlas.rinngs.com`, an A record pointing at the public IP of the host.
- The host is a machine on a residential connection that also runs Coolify. The Coolify panel is reachable only over Tailscale (never through the public hostname).
- Deploys: GitHub webhook (push) to Coolify. The container is replaced only if the build and the health check pass.

## Why the site can time out on some networks

The DNS and the server are fine (the site answers from other networks and the scheduled probe watches it). A timeout on a single network, typically a company network, almost always comes from that network:

1. A web filter or proxy that blocks new or uncategorised domains, or residential IP ranges. This is the most common cause.
2. UDP 443 (HTTP/3, QUIC) dropped by a firewall. The server advertises `h3`; browsers normally fall back to TCP, but some networks stall first.
3. A VPN or a Tailscale exit node that changes the route or the DNS.

Diagnose from the affected machine:

```bash
nslookup atlas.rinngs.com
curl -v --max-time 10 https://atlas.rinngs.com/en
```

- DNS fails or returns another address: filtered DNS.
- DNS fine, `curl` hangs on connect: the address or port is blocked.
- `curl` works but the browser does not: QUIC or a proxy setting.

## Options to make it sturdier

1. **Put a CDN in front (recommended).** Add the domain to Cloudflare (free plan), proxy the record, set SSL mode to "Full (strict)". Visitors then connect to Cloudflare addresses, which most company filters allow, and the home IP stops being exposed. The origin keeps working unchanged. Optionally restrict the origin's firewall to Cloudflare's IP ranges.
2. **Move the origin to a small VPS** (any provider) with a datacenter IP: reinstall Coolify there, point DNS at it, keep the repository and the webhook the same. Removes the dependency on the home connection and its power or internet outages.
3. **Both.** A VPS origin behind Cloudflare is the most resilient and still cheap.

None of this needs a code change: the site is plain static files.

## Operations

- **Uptime:** `.github/workflows/uptime.yml` probes five URLs every 30 minutes and opens, updates or closes an issue labelled `uptime`.
- **Webhook secret rotation:** generate a new secret, set it in the Coolify application's webhook settings and in the GitHub repository webhook (Settings, Webhooks), then redeliver the latest delivery to confirm a 200. Do it whenever someone who knew it leaves.
- **Rollback:** redeploy the previous commit from the Coolify panel, or revert on `main` (every push to `main` deploys).
- **Build gates:** the build runs content validation and the size budget, and CI also runs the unit tests, the link checker and the end-to-end and accessibility tests, so a broken page never reaches the container swap.
