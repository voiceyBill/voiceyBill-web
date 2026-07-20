# Auth.md

## Overview

VoiceyBill uses JWT-based authentication for API access. This document provides agent registration and authentication instructions per the [Auth.md specification](https://workos.com/auth-md).

## Agent Registration

Agents can register programmatically via the signup endpoint.

### Registration Endpoint

```
POST https://voiceybill-server.vercel.app/api/auth/signup
Content-Type: application/json
```

```json
{
  "name": "Agent Name",
  "email": "agent@example.com",
  "password": "secure-password"
}
```

### Response

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "email": "agent@example.com",
    "name": "Agent Name"
  }
}
```

## Authentication

### Login Endpoint

```
POST https://voiceybill-server.vercel.app/api/auth/login
Content-Type: application/json
```

```json
{
  "email": "agent@example.com",
  "password": "secure-password"
}
```

### Google OAuth

```
POST https://voiceybill-server.vercel.app/api/auth/google
Content-Type: application/json
```

## Using the Token

Include the JWT in the `Authorization` header for all authenticated requests:

```
Authorization: Bearer <token>
```

## Token Lifetime

Tokens are valid for **7 days** (604800 seconds) after issuance.

## Supported Identity Types

| Type | Method |
|------|--------|
| Email/Password | `POST /api/auth/signup` then `POST /api/auth/login` |
| Google OAuth 2.0 | `POST /api/auth/google` |

## Supported Credential Types

- **Bearer Token** (JWT) — returned on successful authentication

## Discovery Metadata

- **OAuth Protected Resource**: `/.well-known/oauth-protected-resource`
- **OAuth Authorization Server**: `/.well-known/oauth-authorization-server`
- **OpenID Configuration**: `/.well-known/openid-configuration`

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Login | 5 attempts per minute per IP |
| Signup | 3 attempts per minute per IP |

## Scopes

| Scope | Description |
|-------|-------------|
| `transactions` | Create, read, update, delete financial transactions |
| `analytics` | Query spending analytics and trends |
| `budgets` | Manage budgets by category |
| `reports` | Generate and schedule financial reports |
| `voice` | Voice-based transaction input |
| `receipts` | AI-powered receipt scanning |
