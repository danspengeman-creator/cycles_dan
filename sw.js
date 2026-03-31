const CACHE = "mlg-v1";

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

// Listen for schedule messages from the app
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SCHEDULE") {
    scheduleNotification(e.data.payload);
  }
});

function scheduleNotification(payload) {
  const now = Date.now();
  const target = payload.fireAt; // Unix ms timestamp for 6am today or tomorrow
  const delay = Math.max(0, target - now);

  // Clear any existing timer by storing in a global (persists within SW lifecycle)
  if (self._notifTimer) clearTimeout(self._notifTimer);

  self._notifTimer = setTimeout(() => {
    if (!payload.message) return;
    self.registration.showNotification(payload.title, {
      body: payload.message,
      icon: "/icon.png",
      badge: "/icon.png",
      tag: "mlg-daily",
      renotify: true,
      vibrate: [200, 100, 200]
    });
  }, delay);
}
