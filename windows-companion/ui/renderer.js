const api = window.judgeMeChatGPT;
const statusNode = document.getElementById("status");
function render(s) {
  const connected = s.session && s.session.status === "connected";
  statusNode.textContent = connected
    ? "Terhubung. Izin penggunaan paket ChatGPT: " + (s.session.sharing ? "aktif" : "tidak aktif") + ". Model tersedia: " + s.modelCount + ". Profil tersimpan: " + s.profiles.length + "."
    : "Belum terhubung. Status: " + ((s.session && s.session.status) || "tidak diketahui") + ".";
  ["connect","disconnect","refresh"].forEach(id => document.getElementById(id).disabled = !!s.busy);
}
document.getElementById("connect").addEventListener("click", async () => {
  statusNode.textContent = "Membuka proses login ChatGPT…";
  try { await api.signIn(); render(await api.getState()); } catch(e) { statusNode.textContent = e.message; }
});
document.getElementById("disconnect").addEventListener("click", async () => {
  if (!confirm("Putuskan koneksi ChatGPT dari komponen Judge.Me?")) return;
  try { await api.disconnect(); render(await api.getState()); } catch(e) { statusNode.textContent = e.message; }
});
document.getElementById("refresh").addEventListener("click", async () => render(await api.refresh()));
document.getElementById("usage").addEventListener("click", () => api.openUsage());
api.onState(render);
api.getState().then(render).catch(e => statusNode.textContent = e.message);
