# Judge.Me ChatGPT Connector (Windows-first, Android-ready)

A separate public integration project for connecting Judge.Me to Sign in with ChatGPT. This repository contains connector code and documentation only.

**Public repository boundary:** this repository must never contain Judge.Me core source, case data, judicial documents, database backups, or credentials. Those remain private on the user's Judge.Me server.

## Architecture

- **Windows workstation:** user-controlled sign-in through OpenAI's official Sign in with ChatGPT DevKit (`@siwc/local`).
- **Judge.Me server:** remains the private application host. A protected credential-transfer path must be implemented only according to the official self-hosted VM guidance and validated against a pinned SDK release.
- **Android:** accesses Judge.Me through its responsive web interface/PWA. It does not receive ChatGPT OAuth tokens; AI requests remain server-side.

## Current status

The repository includes architecture and Windows companion scaffolding. The OAuth flow, credential transfer, server endpoints, and AI processing integration are not yet complete. No ChatGPT account is connected and no document has been sent to an external AI service.

## Security rules

1. Never write access tokens, refresh tokens, credential files, `.env` files, case documents, or database files to Git.
2. Do not implement OAuth/token exchange or invent credential formats. Use the official SDK.
3. Keep credentials out of browser JavaScript and Android clients.
4. Require explicit user consent before sending any case document to an external AI service.
5. Test with synthetic documents first. Obtain applicable institutional authorization before processing judicial records externally.
6. Review and comply with the upstream DevKit license; this repository references the SDK and does not vendor it.

## Official references

- DevKit: https://github.com/openai/sign-in-with-chatgpt-devkit
- Cookbook: https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt
- Self-hosted VM guidance: https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms
- DevKit security notes: https://github.com/openai/sign-in-with-chatgpt-devkit/blob/main/docs/security.md

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [STATUS.md](STATUS.md) for implementation notes.
