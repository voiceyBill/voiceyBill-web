# DNS for AI Discovery (DNS-AID) — Setup Guide

This file documents the DNS-AID records that should be configured in your DNS provider for `voiceybill.com`.

## Required DNS Records

DNS-AID uses SVCB/HTTPS resource records to advertise agent-compatible endpoints.

### Agent Discovery Index

```dns
; Advertise the agent skills index endpoint
_index._agents.voiceybill.com. 3600 IN HTTPS 1 . alpn="h2,h3" endpoint="/.well-known/agent-skills/index.json"

; Advertise the A2A (Agent-to-Agent) endpoint
_a2a._agents.voiceybill.com.   3600 IN HTTPS 1 . alpn="h2,h3" endpoint="/.well-known/mcp/server-card.json"

; Advertise the API catalog
_api._agents.voiceybill.com.   3600 IN HTTPS 1 . alpn="h2,h3" endpoint="/.well-known/api-catalog"
```

### Alternative TXT Records (if SVCB/HTTPS not supported)

```dns
_index._agents.voiceybill.com. 3600 IN TXT "v=aid1; endpoint=https://voiceybill.com/.well-known/agent-skills/index.json"
_a2a._agents.voiceybill.com.   3600 IN TXT "v=aid1; endpoint=https://voiceybill.com/.well-known/mcp/server-card.json"
_api._agents.voiceybill.com.   3600 IN TXT "v=aid1; endpoint=https://voiceybill.com/.well-known/api-catalog"
```

## DNSSEC

Sign the public discovery zone with DNSSEC so validating resolvers return authenticated data. This is typically configured in your DNS provider's dashboard (Cloudflare, Vercel DNS, Route53, etc.).

### Vercel DNS

If using Vercel DNS, DNSSEC is enabled automatically for domains managed by Vercel.

### Cloudflare

1. Navigate to DNS → Settings
2. Enable DNSSEC
3. Add the DS record to your domain registrar

## Verification

After configuring DNS records, verify with:

```bash
dig _index._agents.voiceybill.com HTTPS +short
dig _a2a._agents.voiceybill.com HTTPS +short

# Verify DNSSEC
dig _index._agents.voiceybill.com HTTPS +dnssec
```

## References

- [DNS-AID Draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
- [RFC 9460 — SVCB and HTTPS Resource Records](https://www.rfc-editor.org/rfc/rfc9460)
