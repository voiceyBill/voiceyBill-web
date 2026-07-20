# DNS for AI Discovery (DNS-AID)

VoiceyBill publishes [DNS-AID](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
records so AI agents can discover our entrypoints directly from DNS, without
first fetching a web page. Discovery uses ServiceMode
[SVCB/HTTPS](https://www.rfc-editor.org/rfc/rfc9460) records under the
`_agents` namespace.

> **Why this isn't a code change.** DNS-AID is validated over DNS
> (the checker uses DNS-over-HTTPS) — there is no `/.well-known/` HTTP fallback.
> The records below therefore live in DNS, not in the app. This file and
> [`dns/dns-aid.zone`](../dns/dns-aid.zone) are the version-controlled source of
> truth; publishing them is a one-time change in Cloudflare + Namecheap.

## Hosting layout

- **Registrar:** Namecheap (holds the domain + the DS record for DNSSEC)
- **Authoritative DNS:** Cloudflare (`donovan.ns.cloudflare.com`, `pearl.ns.cloudflare.com`)
- **App:** Vercel

Because DNS is delegated to Cloudflare, the SVCB/HTTPS records are created in
**Cloudflare**. Only the DNSSEC **DS record** goes to **Namecheap**.

## Records to publish

| Name | Type | Priority | Target | Params |
|------|------|----------|--------|--------|
| `_index._agents` | HTTPS | 1 | `voiceybill.com` | `alpn="h2,http/1.1" port=443` |
| `_mcp._agents` | SVCB | 1 | `voiceybill.com` | `alpn="h2" port=443 mandatory=alpn,port` |
| `_a2a._agents` | SVCB | 1 | `voiceybill-server.vercel.app` | `alpn="a2a" port=443 mandatory=alpn,port` |

Full BIND zone snippet: [`dns/dns-aid.zone`](../dns/dns-aid.zone) (Cloudflare can
import it via **DNS → Records → Import and Export → Import DNS records**).

## Step 1 — Add the records in Cloudflare

For each row above: **DNS → Records → Add record**, choose the **Type** (`HTTPS`
or `SVCB`), set **Name** (e.g. `_index._agents`), **Priority** `1`, **Target**
as listed, and the **Value/params** string as listed. Leave proxy status DNS-only
(grey cloud) — SVCB/HTTPS records are not proxied.

## Step 2 — Enable DNSSEC

1. In **Cloudflare → DNS → Settings → DNSSEC**, click **Enable DNSSEC**.
   Cloudflare shows a **DS record** (Key Tag, Algorithm, Digest Type, Digest).
2. In **Namecheap → Domain List → voiceybill.com → Advanced DNS → DNSSEC**,
   add a DS record and paste the four values from Cloudflare.
3. Wait for propagation; Cloudflare's DNSSEC status flips to **Active** once the
   DS is seen at the registry.

## Step 3 — Verify

```bash
# SVCB/HTTPS records resolve
dig +short HTTPS _index._agents.voiceybill.com
dig +short SVCB  _mcp._agents.voiceybill.com
dig +short SVCB  _a2a._agents.voiceybill.com

# DNSSEC returns authenticated data (look for the "ad" flag)
dig +dnssec _index._agents.voiceybill.com HTTPS | grep -E "flags:|RRSIG"
```

Then re-run the readiness check at
<https://isitagentready.com/voiceybill.com> — the DNS-AID check should pass.
