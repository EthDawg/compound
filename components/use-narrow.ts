"use client";

import { useEffect, useState } from "react";

/** True on phone-width viewports. Starts false so SSR and first paint agree. */
export function useNarrow(bp = 720) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [bp]);
  return narrow;
}
