import { ONBOARD } from "@/lib/content/pocket";
import { PocketFlow } from "@/components/pocket-flow";
import { InstallHint } from "@/components/install-hint";
import { PocketApps } from "@/components/pocket-apps";

export default function PocketOnboard() {
  return (
    <>
      <InstallHint />
      <PocketApps />
      <PocketFlow
        id="onboard"
        title="Onboard"
        sub="One write. Every product downstream of it already correct. Pick a jurisdiction — the third one is the interesting one."
        variants={ONBOARD}
        verb="Hire them"
        tone="go"
        pickLabel="Where are they starting?"
      />
    </>
  );
}
