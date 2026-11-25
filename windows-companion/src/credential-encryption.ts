import type { CredentialEncryption } from "@siwc/local";
import type { SafeStorage } from "electron";

/** Windows DPAPI-backed Electron safeStorage adapter. Keep in main process only. */
export function createWindowsCredentialEncryption(storage: Pick<SafeStorage,
  "isEncryptionAvailable" | "encryptString" | "decryptString">,
  isReady: () => boolean,
): CredentialEncryption {
  const available = () => process.platform === "win32" && isReady() && storage.isEncryptionAvailable();
  const requireAvailable = () => {
    if (!available()) throw new Error("Windows credential encryption is unavailable; refusing plaintext storage.");
  };
  return {
    id: "electron-safe-storage-windows-dpapi-v1",
    isAvailable: available,
    encrypt(plaintext) {
      requireAvailable();
      return storage.encryptString(plaintext);
    },
    decrypt(ciphertext) {
      requireAvailable();
      return storage.decryptString(Buffer.from(ciphertext));
    },
  };
}
