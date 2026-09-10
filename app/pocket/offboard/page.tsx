import { OFFBOARD } from "@/lib/content/pocket";
import { PocketFlow } from "@/components/pocket-flow";

export default function Page() {
  return (
    <PocketFlow
      id="offboard"
      title="Offboard"
      sub="Everything reversible happens in under half a minute. Everything irreversible still stops and waits for a person — and that limit is in the system, not in a policy."
      variants={OFFBOARD}
      verb="Begin offboarding"
      tone="stop"
      pickLabel="What kind of departure?"
    />
  );
}
