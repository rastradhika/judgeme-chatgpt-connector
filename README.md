# Judge.Me ChatGPT Connector (Windows-first, Android target)

A separate integration project for connecting Judge.Me to Sign in with ChatGPT (SIWC). This repository contains connector code and documentation only.

**Public repository boundary:** this repository must never contain Judge.Me core source, case data, judicial documents, database backups, or credentials. Those remain private on the user's Judge.Me server and devices.

## Intended architecture: one connection per device

Judge.Me's data remains centralized on the private Judge.Me server, while ChatGPT usage follows the device currently being used:

- **Windows server:** uses the SIWC connection stored locally on the server.
- **Windows laptop client:** uses a separate SIWC connection stored locally on that laptop.
- **Android phone:** target is a phone-local SIWC connection. This is not implemented or verified; Android support is a technical blocker until an officially supported runtime and secure credential storage approach are confirmed.

Each Windows installation runs its own companion, signs in independently, keeps its own host identity and OS-protected credentials, and makes its own Responses requests. Tokens are never copied to the Judge.Me server, browser, or another device.

The paired local companion receives only the task content the user explicitly approves, makes the request locally, and returns the result to the central Judge.Me application. There is no silent fallback to another device's ChatGPT connection.

## Current status

- Windows companion scaffold and SIWC SDK integration exist.
- User reports a successful local Windows launch and connected-session display. This is a local smoke test, not a packaged release validation.
- Public repository source has not yet been reconciled with all local Windows fixes.
- Device pairing, authenticated server/companion transport, per-operation document consent, audit trail, and Android-native SIWC are not implemented.

See docs/ARCHITECTURE.md and STATUS.md.

## Security rules

1. Never write access tokens, refresh tokens, credential files, environment files, case documents, or database files to Git.
2. Use only the official SIWC sign-in and SDK-supported request flow; do not invent token-transfer formats.
3. Keep credentials in local, user-controlled OS-protected storage. Never expose them to browser JavaScript, Judge.Me APIs, logs, or other devices.
4. A request must originate from the authenticated user's activity or an expressly authorized task. Never use one user's plan for another user's activity.
5. Require explicit per-operation consent before sending any case document or excerpt to the paired device-local companion.
6. Never silently fall back to another device's ChatGPT connection.
7. Test with synthetic documents first. Obtain applicable institutional authorization before processing judicial records externally.
8. Review and comply with the upstream DevKit license and current SIWC terms.

## Official references

- DevKit: https://github.com/openai/sign-in-with-chatgpt-devkit
- Cookbook: https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt
- Self-hosted VM guidance: https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms
- SIWC terms: https://openai.com/policies/sign-in-with-chatgpt-terms/
- DevKit security notes: https://github.com/openai/sign-in-with-chatgpt-devkit/blob/main/docs/security.md
