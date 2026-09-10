"use client";

import { useEffect, useState } from "react";
import * as I from "./icons";

interface Prompt extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const KEY = "compound.installHint.dismissed";

export function InstallHint() {
  const [deferred, setDeferred] = useState<Prompt | null>(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === "1"; } catch { /* private mode */ }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari reports installed state on navigator
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone || dismissed) return;

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = isIos && !/crios|fxios/i.test(navigator.userAgent);
    if (isIos) { setIos(isSafari); setShow(true); return; }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as Prompt);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const close = () => {
    setShow(false);
    try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    close();
  };

  if (!show) return null;

  return (
    <div className="animate-fadeUp mb-4 rounded-xl bg-signal/[0.10] p-3.5 ring-1 ring-signal/30">
      <div className="flex items-start gap-2.5">
        <span className="mt-px grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-signal text-ink">
          <I.ILayers className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold leading-snug text-white">Keep this on your home screen</p>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-ink-300">
            {deferred
              ? "Installs as a standalone app — full screen, no browser chrome, and the three flows work without a signal."
              : ios
                ? "Tap Share, then Add to Home Screen. It opens full screen, and the three flows work without a signal."
                : "Open your browser menu and choose Add to Home Screen. It opens full screen, with no browser chrome."}
          </p>
          {deferred && (
            <button onClick={install}
              className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg bg-signal px-3 text-[12.5px] font-bold text-ink active:scale-[0.98]">
              Install
            </button>
          )}
        </div>
        <button onClick={close} aria-label="Dismiss"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink-500 active:bg-white/10">
          <I.IClose className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
