"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { PASSWORD_APPS, DEMO_PASSWORD, acceptsDemoCredentials, demoSessionKey, passwordApp, passwordModeEnabled, pocketAppHref, type PasswordAppId } from "@/lib/pocket-password";

export function PocketApps() {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<PasswordAppId>("rippling");
  const [enabled, setEnabled] = useState(false);
  const [opened, setOpened] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [task, setTask] = useState("");
  const app = passwordApp(selected);

  useEffect(() => {
    function readLocation() {
      const query = new URLSearchParams(window.location.search);
      const id = passwordApp(query.get("app")).id;
      setSelected(id);
      setEnabled(passwordModeEnabled(query.get("passwordMode")));
      setOpened(query.has("app") || passwordModeEnabled(query.get("passwordMode")));
      try { setSignedIn(sessionStorage.getItem(demoSessionKey(id)) === "1"); }
      catch { setSignedIn(false); }
      setError(""); setMessage(""); setTask(""); setShowPassword(false); setReady(true);
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, []);

  function choose(id: PasswordAppId, mode = enabled) {
    window.history.pushState(null, "", pocketAppHref(id, mode));
    setSelected(id); setEnabled(mode); setOpened(true); setError(""); setMessage(""); setTask(""); setShowPassword(false);
    try { setSignedIn(sessionStorage.getItem(demoSessionKey(id)) === "1"); }
    catch { setSignedIn(false); }
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (!acceptsDemoCredentials(selected, String(fields.get("username") ?? ""), String(fields.get("password") ?? ""))) {
      setError("Use the demo username and password shown below. Real accounts do not work here.");
      return;
    }
    // Store only a demo-state marker. Never retain or send the submitted credentials.
    try {
      sessionStorage.setItem(demoSessionKey(selected), "1");
      // A completed sign-in followed by navigation lets Chrome recognise the form.
      window.location.assign(pocketAppHref(selected, true));
    } catch {
      setSignedIn(true); setError("");
      setMessage("Signed in for this page only; this browser has blocked session storage.");
    }
  }

  function signOut() {
    try { sessionStorage.removeItem(demoSessionKey(selected)); } catch { /* Page-only demo still signs out. */ }
    setSignedIn(false); setShowPassword(false); setTask(""); setMessage(""); setError("");
  }

  async function copyBookmark() {
    try {
      await navigator.clipboard.writeText(new URL(pocketAppHref(selected, enabled), window.location.origin).href);
      setMessage("Bookmark link copied.");
    } catch { setMessage("Copy this page’s address from the address bar to save your bookmark."); }
  }

  return <section aria-label="Pocket apps" className="mb-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-semibold text-white">Your apps</h1><p className="mt-1 text-sm text-ink-400">A small employee workspace, ready to demo.</p></div>
      <button type="button" role="switch" aria-checked={enabled} disabled={!ready} onClick={() => choose(selected, !enabled)} className="flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal">
        <span className={`relative h-5 w-9 rounded-full ${enabled ? "bg-signal" : "bg-white/20"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full ${enabled ? "left-[18px] bg-ink" : "left-0.5 bg-white"}`} /></span>
        Password Mode
      </button>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Choose an app">
      {PASSWORD_APPS.map(item => <button key={item.id} type="button" aria-pressed={opened && selected === item.id} disabled={!ready} onClick={() => choose(item.id)} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-sm transition ${opened && selected === item.id ? "border-signal/60 bg-signal/[0.08] text-white" : "border-white/10 text-ink-300 hover:bg-white/5"}`}>
        <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl text-lg font-bold text-ink" style={{ backgroundColor: item.colour }}>{item.initial}</span>{item.name}
      </button>)}
    </div>
    {!opened && <p className="mt-3 text-xs leading-relaxed text-ink-400">Open an app, or turn on Password Mode to try saving and filling a demo login with Chrome.</p>}
    {ready && opened && <div className="mt-5 border-t border-white/10 pt-4">
      <div className="mb-4 flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-signal">Independent mock · {app.name}</span><button type="button" onClick={copyBookmark} className="min-h-10 text-xs text-ink-300 underline underline-offset-4">Copy bookmark</button></div>
      {enabled && !signedIn ? <>
        <h2 className="text-xl font-semibold text-white">Sign in to {app.name} demo</h2>
        <p className="mb-5 mt-1 text-sm leading-relaxed text-ink-400">Use the sample login below. This is a Compound prototype, not {app.name} authentication.</p>
        <form key={selected} method="post" onSubmit={signIn} autoComplete="on" aria-label={`${app.name} demo sign in`} className="space-y-4">
          <div><label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink-200">Username</label><input id="username" name="username" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required aria-describedby="demo-credentials" className="min-h-12 w-full rounded-lg border border-white/20 bg-ink px-3 text-base text-white focus:border-signal focus:outline-none" /></div>
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-200">Password</label><div className="flex rounded-lg border border-white/20 bg-ink focus-within:border-signal"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required aria-describedby="demo-credentials" className="min-h-12 min-w-0 flex-1 rounded-lg bg-transparent px-3 text-base text-white focus:outline-none" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="px-3 text-xs font-medium text-ink-300">{showPassword ? "Hide" : "Show"}</button></div></div>
          {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}
          <button type="submit" className="min-h-12 w-full rounded-lg bg-signal px-4 font-semibold text-ink hover:brightness-110">Sign in to demo</button>
        </form>
        <div id="demo-credentials" className="mt-4 rounded-lg bg-white/5 p-3 text-xs leading-relaxed text-ink-300"><p className="mb-2 font-semibold text-white">Sample login · no real credentials</p><p>Username: <code className="break-all select-all">{app.username}</code></p><p>Password: <code className="break-all select-all">{DEMO_PASSWORD}</code></p></div>
        <details className="mt-4 text-xs leading-relaxed text-ink-400"><summary className="cursor-pointer py-2 text-ink-200">Test Chrome Password Manager</summary><ol className="ml-4 list-decimal space-y-2"><li>Enter this sample login and sign in. Save it if Chrome offers.</li><li>Sign out of the demo, then reopen your bookmark. Choose the saved demo login.</li><li>Repeat in another Chrome profile to test its separate password store.</li></ol><p className="mt-3">All three demos share this Compound domain. Chrome may suggest the other demo usernames too. Save and autofill depend on your browser settings; nothing syncs passwords between profiles here.</p></details>
      </> : <>
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-white">Your {app.name} workspace</h2><p className="mt-1 text-sm text-ink-400">{app.summary}</p></div>{enabled && <button type="button" onClick={signOut} className="min-h-11 shrink-0 text-xs text-signal underline underline-offset-4">Sign out</button>}</div>
        <p className="mt-3 text-xs text-signal">{enabled ? "Demo signed in · Alex Morgan" : "Open demo · Password Mode is off"}</p>
        <div className="mt-4 space-y-2">{app.tasks.map(label => <button type="button" key={label} onClick={() => setTask(label)} className="flex min-h-12 w-full items-center justify-between rounded-lg bg-white/5 px-3 text-left text-sm text-white hover:bg-white/10">{label}<span aria-hidden>→</span></button>)}</div>
        {task && <p role="status" className="mt-3 rounded-lg border border-signal/20 p-3 text-sm text-ink-200">{task}: your demo request is ready. This sample doesn’t change any employee record.</p>}
        <Link href={`/companies/${selected}/app`} className="mt-4 inline-block py-2 text-xs text-signal underline underline-offset-4">Explore the {app.name} product study →</Link>
      </>}
      {message && <p role="status" className="mt-3 text-xs text-signal">{message}</p>}
    </div>}
  </section>;
}
