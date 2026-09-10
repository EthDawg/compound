import Link from "next/link";
import { AGENT_REQUIREMENTS, ACTION_CLASSES, AGENT_INVERSION } from "@/lib/content/agentic";
import { BHeader, Pill } from "@/components/backstage-ui";
import { AgentConsole } from "@/components/agent-console";
import * as I from "@/components/icons";

const STATUS = { Shipped: "live", Partial: "signal", "Open problem": "dim" } as const;
const TONE = { good: "moss", warn: "signal", bad: "clay" } as const;

export default function Agentic() {
  return (
    <div>
      <BHeader
        eyebrow="The agentic turn"
        title="Everyone will have the same models. Not everyone will have the graph."
        deck="Every company in software is currently explaining why its existing strategy was secretly an AI strategy all along. Most of those explanations are retrofitted. Here is the claim, stated narrowly enough to be wrong."
      />

      {/* The inversion */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/[0.08]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{AGENT_INVERSION.before.label}</div>
          <p className="mt-2 text-[15px] leading-[1.6] text-ink-400">{AGENT_INVERSION.before.body}</p>
        </div>
        <div className="rounded-xl bg-signal/[0.07] p-5 ring-1 ring-signal/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-signal">{AGENT_INVERSION.after.label}</div>
          <p className="mt-2 text-[15px] leading-[1.6] text-white">{AGENT_INVERSION.after.body}</p>
        </div>
      </section>

      <p className="prose-measure mt-6 text-[16px] leading-[1.7] text-ink-200">
        The distinction that matters is not intelligence. An assistant reads and summarises; an agent changes
        something. Building an assistant over business data is now close to trivial and will not be differentiated by
        the end of any given quarter. Building an agent that can move someone from Hardware to Engineering is a
        question of whether anything underneath can absorb the consequences.
      </p>

      {/* Live console */}
      <section className="mt-8">
        <h2 className="font-serif-display text-[25px] text-white">What permission-correct actually looks like</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          The question is never &ldquo;can this user see this document&rdquo;. It is whether they can see this field, of
          this person, as of this date, given their span of control and their entity. That is a query, and it has to run
          on the way in.
        </p>
        <div className="mt-5"><AgentConsole /></div>
      </section>

      {/* Requirements */}
      <section className="mt-10">
        <h2 className="font-serif-display text-[25px] text-white">Six things an agent needs. Only the first gets discussed.</h2>
        <div className="mt-5 space-y-3">
          {AGENT_REQUIREMENTS.map((r) => (
            <article key={r.id} className="rounded-xl bg-white/[0.04] ring-1 ring-white/10">
              <header className="flex flex-wrap items-center gap-2.5 border-b border-white/10 px-5 py-3.5">
                <span className="num font-serif-display text-[17px] text-signal">{r.n}</span>
                <h3 className="text-[15.5px] font-semibold text-white">{r.name}</h3>
                <span className="ml-auto"><Pill tone={STATUS[r.status]}>{r.status}</Pill></span>
              </header>
              <p className="px-5 py-3.5 text-[14px] leading-[1.65] text-ink-300">{r.what}</p>
              <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.06] sm:grid-cols-2">
                <div className="bg-ink px-5 py-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">In a point solution</div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-400">{r.pointSolution}</p>
                </div>
                <div className="bg-signal/[0.05] px-5 py-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-signal">On one graph</div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-200">{r.compound}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Action classes */}
      <section className="mt-10">
        <h2 className="font-serif-display text-[25px] text-white">What an agent is allowed to do</h2>
        <p className="prose-measure mt-2 text-[15px] leading-[1.6] text-ink-400">
          Classified by how expensive the action is to undo. This lives in the system, not in a prompt and not in a
          policy document — because a prompt is a request and a constraint is a fact.
        </p>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {ACTION_CLASSES.map((c) => (
            <div key={c.klass} className={`rounded-xl p-5 ring-1 ${
              c.tone === "good" ? "bg-moss/[0.07] ring-moss/25" : c.tone === "warn" ? "bg-signal/[0.06] ring-signal/25" : "bg-clay/[0.07] ring-clay/25"
            }`}>
              <h3 className={`text-[14.5px] font-semibold ${
                c.tone === "good" ? "text-moss" : c.tone === "warn" ? "text-signal" : "text-clay"
              }`}>{c.klass}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-200">{c.rule}</p>
              <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                {c.examples.map((e) => (
                  <li key={e} className="flex gap-2 text-[13px] leading-[1.5] text-ink-400">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />{e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* The seam inversion */}
      <section className="mt-10 rounded-xl bg-white/[0.04] p-6 ring-1 ring-white/10">
        <h2 className="font-serif-display text-[25px] text-white">The part I did not expect</h2>
        <p className="prose-measure mt-3 text-[15.5px] leading-[1.7] text-ink-200">
          When two systems disagree about who someone&rsquo;s manager is, a human notices. Not immediately — an approval
          routes to the wrong person, somebody says &ldquo;why am I getting this&rdquo;, and the discrepancy surfaces
          through friction. The friction is irritating and it is also the error-correction mechanism.
        </p>
        <p className="prose-measure mt-3 text-[15.5px] leading-[1.7] text-ink-200">
          An agent does not notice. It reads one of the two systems, gets an answer, and acts on it with complete
          confidence. There is no puzzled human to generate the friction. The inconsistency that used to produce a
          mildly annoying email now produces a confidently wrong action, at machine speed, at volume.
        </p>
        <blockquote className="prose-measure mt-5 border-l-2 border-signal py-1 pl-5">
          <p className="font-serif-display text-[20px] leading-[1.45] text-signal">
            The integration layer that was a productivity tax for ten years becomes a correctness problem the moment
            you put an agent on top of it.
          </p>
        </blockquote>
      </section>

      {/* Honest costs */}
      <section className="mt-8 rounded-xl bg-clay/[0.07] p-6 ring-1 ring-clay/25">
        <div className="text-[11px] font-bold uppercase tracking-wider text-clay">What this costs us right now</div>
        <ul className="prose-measure mt-3 space-y-2.5">
          {[
            "We are slower. A permission-checked query against a live graph costs more than a similarity search over a pre-computed index. We lose demos on responsiveness.",
            "We ship fewer assistant features per quarter than competitors treating this as a retrieval problem, and that gap is visible in comparison grids.",
            "Permission-scoped, effective-dated retrieval over unstructured content is an open problem in our system. It is being worked. It may take another year.",
            "The risk that actually matters is not competitive. When the record is only read by humans, a stale field is an annoyance. When it is the substrate for autonomous action, it is an incident whose blast radius scales with how much you have automated.",
          ].map((x) => (
            <li key={x} className="flex gap-3 text-[14.5px] leading-[1.65] text-ink-200">
              <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-clay" />{x}
            </li>
          ))}
        </ul>
        <p className="prose-measure mt-4 border-t border-clay/20 pt-4 text-[14.5px] leading-[1.65] text-ink-300">
          That trade looks obviously correct to me and it will look wrong for four to six quarters, which is the shape
          of every other decision in this manual.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/backstage/manual/the-graph-was-always-the-point"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-signal px-4 text-[13px] font-semibold text-ink transition hover:bg-signal-300">
          Read the full essay <I.IArrow className="h-3.5 w-3.5" />
        </Link>
        <Link href="/backstage/decisions#D-014"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-4 text-[13px] font-semibold text-white transition hover:bg-white/15">
          The decision this forced (D-014)
        </Link>
      </div>
    </div>
  );
}
