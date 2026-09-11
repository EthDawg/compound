"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== 'production') {
      // An older worker may still control a development origin after a restart.
      navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.filter(registration => {
        const script = registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? registration.installing?.scriptURL;
        return script && new URL(script).origin === window.location.origin && new URL(script).pathname === '/sw.js';
      }).map(registration => registration.unregister()))).catch(() => undefined);
      return;
    }
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;
    const t = setTimeout(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  return null;
}
