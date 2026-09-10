"use client";

import { useEffect, useState } from "react";

/** True on phone-width viewports. Starts false so SSR and first paint agree. */
export function useNarrow(bp = 720) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    // A zero-width viewport means the frame is not being painted, not that it is a phone.
    const on = () => setNarrow(window.innerWidth > 0 && window.innerWidth <= bp);
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [bp]);
  return narrow;
}
