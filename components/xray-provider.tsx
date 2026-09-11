"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface Ctx { on: boolean; toggle: () => void; set: (v: boolean) => void; count: number; bump: () => void }
const XRayCtx = createContext<Ctx>({ on: false, toggle: () => {}, set: () => {}, count: 0, bump: () => {} });

export function XRayProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const [count, setCount] = useState(0);
  const toggle = useCallback(() => setOn((v) => !v), []);
  const bump = useCallback(() => setCount((c) => c + 1), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (document.querySelector("dialog[open]") || t?.isContentEditable) return;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if ((e.key === "x" || e.key === "X") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOn((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("xr-on", on);
  }, [on]);

  return <XRayCtx.Provider value={{ on, toggle, set: setOn, count, bump }}>{children}</XRayCtx.Provider>;
}

export const useXRay = () => useContext(XRayCtx);
