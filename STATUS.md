# Implementation status

## Architecture

- [x] Public connector repository created; Judge.Me core, production database, backups, judicial documents, and credentials remain excluded.
- [x] Per-device target architecture documented: Windows server uses its own SIWC connection; each Windows laptop uses its own SIWC connection; Android-local SIWC remains a target requiring technical validation.
- [x] Confirmed from the reviewed local @siwc/local API that it exposes sign-in, session/profile management, model discovery, and Responses streaming; it does not expose a credential/session export-import API.

## Windows companion

- [x] Electron companion scaffold and main-process SIWC integration added.
- [x] Windows safeStorage credential-encryption adapter added.
- [x] Isolated renderer and narrow IPC bridge scaffolded.
- [x] User reports that the companion launched locally and displayed a connected ChatGPT session and available models.
- [ ] Reconcile the user's successful local preload fix (CommonJS preload.cjs / preload.cts) with the public repository source.
- [ ] Pin and review a specific official DevKit release/commit and license; the user's local SDK checkout is not yet a pinned release.
- [ ] Validate credential encryption, decryption, OAuth callback, refresh, and disconnect on supported Windows versions.
- [ ] Package and test the companion on both the Windows server and a separate Windows laptop, using distinct local profiles and host identities.

## Judge.Me integration

- [ ] Implement explicit browser-to-local-companion pairing for the device currently using Judge.Me.
- [ ] Implement authenticated private server-to-companion task transport; the companion must make SIWC requests locally.
- [ ] Implement device/session binding, request expiry, replay protection, and strict per-user isolation.
- [ ] Implement per-operation consent showing the selected document/content and intended AI operation.
- [ ] Implement audit records for consent, device, operation, document references, and result.
- [ ] Implement server-side task state and result persistence without storing SIWC tokens.
- [ ] Test end-to-end using synthetic documents before any production judicial document is used.

## Android

- [ ] Verify whether OpenAI supports an Android-native SIWC runtime and document the supported integration path.
- [ ] Design an Android OS-backed credential store only after supported runtime/API compatibility is established.
- [ ] Implement Android-local connection and device pairing.
- [ ] Until then, Android must not silently use the server or laptop's ChatGPT connection.

## Current limitations

- No credentials have been transferred to the Judge.Me server.
- No browser-to-companion pairing or authenticated task transport is implemented.
- No Judge.Me AI endpoint or per-operation consent/audit flow is implemented.
- Android-native SIWC is not implemented or verified.
- The user's local successful login is a reported smoke test; it does not establish packaged release readiness or institutional authorization for judicial documents.

**Security boundary:** only connector code and documentation belong in this public repository. Never commit Judge.Me core source, production database, backups, judicial documents, local credential stores, tokens, or secrets.
