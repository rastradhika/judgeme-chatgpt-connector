# Architecture: per-device ChatGPT runtime, centralized Judge.Me data

## Product requirement

Judge.Me uses the ChatGPT connection belonging to the device currently being used:

- Opening Judge.Me on the Windows server uses the SIWC connection stored on that server.
- Opening Judge.Me on a Windows laptop uses the SIWC connection stored on that laptop.
- Opening Judge.Me on an Android phone should use a connection stored and controlled on that phone, but Android support is a technical gate and is not yet implemented or verified.

The Judge.Me server remains the single source of truth for cases, schedules, documents, drafts, and audit records. ChatGPT credentials are not centralized on the Judge.Me server.

## Device-local runtimes

### Windows server and Windows laptop

Each Windows device runs its own installed Judge.Me SIWC companion:

- Each installation completes its own official SIWC sign-in.
- Each installation has its own persistent host ID and local account profile.
- Each installation stores its own credentials using Windows-protected storage through Electron safeStorage.
- Each installation makes its own supported Responses requests through the official @siwc/local SDK.
- Access tokens, refresh tokens, ID tokens, and credential files never enter browser JavaScript, Judge.Me APIs, logs, or another device.

The same connector application may be installed on both Windows devices, but their local data directories and credentials must remain separate.

### Android

The target experience is a Judge.Me Android client that uses a ChatGPT connection local to that phone. This is not implemented.

The currently reviewed SIWC DevKit describes a local Node.js SDK and a macOS example; it does not establish a supported Android-native runtime or Android credential-storage adapter. Do not put SIWC credentials in a PWA, browser storage, WebView, or Judge.Me server as a workaround. Android implementation remains blocked until a supported integration/runtime and secure OS-backed storage approach are verified.

Until then, the Android client must clearly report that device-local SIWC is not yet available. It must not silently fall back to the server's or laptop's ChatGPT account.

## Request flow

1. The user opens Judge.Me on a device and authenticates to the private Judge.Me server.
2. The browser associates with the SIWC companion installed on that same device. Pairing must be explicit, short-lived, device-specific, and authenticated.
3. The user initiates an AI operation in Judge.Me and reviews the exact document/content and purpose to be sent.
4. After explicit per-operation consent, the Judge.Me server sends only that approved task payload to the paired device-local companion over a private, authenticated channel.
5. The companion makes the ChatGPT request locally through its own SIWC SDK instance. The companion never returns credentials to Judge.Me.
6. The companion returns the generated result and non-secret status metadata to Judge.Me.
7. Judge.Me stores the result and audit metadata centrally. It does not store SIWC tokens.

The local companion should establish an outbound authenticated connection to the Judge.Me server (for example, a Tailscale-reachable HTTPS/WebSocket channel). The server must not expose a public unauthenticated AI relay.

## Device routing and isolation

- Pair each browser session with one explicitly selected local companion/device.
- A request may be processed only by the companion paired with the active user session.
- Never route one user's request through another user's ChatGPT connection.
- Never pool, transfer, proxy, or share SIWC credentials or plan usage between devices or users.
- Do not silently fall back to another device when the selected device is offline or disconnected.
- Require re-pairing after device identity changes, companion reinstall, or credential reset.
- Validate origin, user session, device identity, request ID, expiry, replay protection, and payload size on every task.
- The companion must display or confirm the operation and must not accept arbitrary general-purpose API requests from the network.

## Data protection and judicial-document consent

- The server remains private and is accessed through the user's private network.
- Only the document or excerpts expressly selected for the current operation may be sent to the paired device.
- Show the document name, intended operation, and destination before sending.
- Record user, device, timestamp, document identifiers, operation, consent decision, and result reference in the Judge.Me audit trail. Do not record tokens or unnecessary document contents in logs.
- Keep synthetic-document tests separate from production case data.
- Obtain applicable institutional authorization and review privacy, confidentiality, and records-handling requirements before sending judicial material to an external AI service.

## Current implementation boundary

The Windows companion source uses @siwc/local, Electron IPC, and a Windows safeStorage encryption adapter. The user has reported that a local Windows build launched and showed a connected ChatGPT session with model availability. This is a user-reported local smoke test, not an independently verified release test. The corresponding local changes (including the CommonJS preload adjustment) must be reconciled with the public repository before a release.

Not implemented: browser-to-companion pairing, authenticated server/companion transport, task queue, AI task endpoints, per-operation consent UI, audit trail, packaging/signing, and Android-native SIWC.

## Official references

- SIWC DevKit: https://github.com/openai/sign-in-with-chatgpt-devkit
- SIWC open-source app cookbook: https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt
- Self-hosted VM guidance: https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms
- SIWC terms: https://openai.com/policies/sign-in-with-chatgpt-terms/
- DevKit security notes: https://github.com/openai/sign-in-with-chatgpt-devkit/blob/main/docs/security.md
