# Architecture and implementation boundary

## Windows workstation companion

- Runs under the user's Windows account.
- Uses the official `@siwc/local` SDK for account sign-in, profile selection, model discovery, and supported Responses requests.
- The user completes browser authentication and explicitly grants plan-use permission.
- Source credentials remain protected by the official SDK/OS storage mechanism.

## Judge.Me server (Windows 11)

- Continues to own the Judge.Me database, documents, SIPP connector, and business logic.
- Must not expose OAuth credentials to the web frontend.
- May perform AI requests only after a supported, reviewed self-hosted VM credential-transfer method is implemented and verified.
- Requires explicit per-operation consent before external transmission of case materials.

## Android client

- Responsive Judge.Me web UI / future PWA, reachable through the user's private network (for example, Tailscale).
- Authenticates to Judge.Me, not directly to the server-side ChatGPT credential store.
- Sends AI work to Judge.Me backend; receives draft output and status only.

## Data flow (target)

1. User signs into ChatGPT on the Windows workstation using the official SDK.
2. User explicitly authorizes plan usage.
3. A user-initiated, SDK-supported protected transfer is performed to the self-hosted VM only if the current OpenAI guidance and SDK support it.
4. Judge.Me server validates connection state and explicit document-sharing consent.
5. Server sends eligible requests using the official SDK/runtime and stores resulting drafts/audit metadata in Judge.Me.
6. Windows and Android clients receive application data, never ChatGPT tokens.

## Hard blockers before implementation

- Pin and review a specific official DevKit release/commit and its license.
- Validate Windows support of the SDK and credential storage. The upstream example currently documents a macOS sample app; do not assume its sample is Windows-compatible.
- Validate self-hosted VM transfer, refresh, logout/revocation, host identity, and security boundaries. OpenAI's guidance notes limitations for transferred sessions; expose those limitations to the user.
- Confirm whether the private, self-hosted Judge.Me connector satisfies the current OpenAI open-source app requirements. Do not make the repository public or copy licensed DevKit code without explicit approval and license review.
- Add integration tests with synthetic data before connecting production Judge.Me.

## Not implemented

OAuth, callback server, SDK calls, token/credential transfer, AI endpoints, audit trail, and Android UI are not implemented by the current scaffold.