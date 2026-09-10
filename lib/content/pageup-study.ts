import type { CompanyStudy } from "../companies";
import { PAGEUP } from "../vendors/talent-skins";
import { TALENT_NAVIGATION } from "./talent-navigation";

const S = {
  about: "https://www.pageuppeople.com/about-us/",
  ats: "https://www.pageuppeople.com/products/application-tracking-system/",
  clinch: "https://www.pageuppeople.com/news/pageup-acquires-clinch-talent-recruitment-marketing-innovator/amp/",
  marketing: "https://www.pageuppeople.com/products/recruitment-marketing/",
  earcu: "https://www.pageuppeople.com/news/pageup-acquires-earcu/amp/",
  pathmotion: "https://www.pageuppeople.com/news/pageup-acquires-pathmotion/",
  eqt: "https://www.pageuppeople.com/news/pageup-group-and-eqt/",
  brand: "https://www.pageuppeople.com/news/pageup-unifies-brands-to-strengthen-market-leadership-and-enhance-customer-experience/",
  paige: "https://www.pageuppeople.com/news/pageup-launches-paige/",
  workday: "https://www.pageuppeople.com/news/pageup-clinch-completes-workday-design-approved-badge-integration/?noamp=mobile",
  sapia: "https://www.pageuppeople.com/news/pageup-and-sapia-ai-embed-intelligent-ai-interviewing-directly-into-enterprise-hiring-workflows/",
};
export const PAGEUP_STUDY: CompanyStudy = {
  id: "pageup", name: "PageUp", archetype: "Talent acquisition platform", skin: PAGEUP,
  brand: { chrome: "#14244B", ink: "#FFFFFF", highlight: "#A9C9FF" },
  appScreens: ["", "recruitment", "talent", "paige"], workflowScreen: "recruitment",
  backstage: {
    navigation: TALENT_NAVIGATION,
    headline: "Own the hiring journey. Make the context useful.",
    thesis: "PageUp's centre of gravity is the hiring decision: the candidate relationship before it, the committee and approvals around it, and the evidence behind it. The interesting company-building question is whether acquired recruiting depth can become a coherent journey without flattening the institutional complexity that customers bought it to handle.",
    object: "Candidate + hiring process", question: "What is stopping this hiring decision from moving?",
    sequence: ["Attract and retain candidate interest", "Move an application through the configured process", "Bring the evidence into the review", "Let the accountable person decide"],
    premises: [
      { title: "Make complex hiring move", body: "Recruiters, hiring managers and selection committees need different views of the same decision. PageUp's strength is coordinating those responsibilities, not merely filling a candidate board. The demo begins where an institutional hire often stalls: an incomplete review.", screen: "recruitment" },
      { title: "Keep the interest you already earned", body: "Clinch adds careers content, CRM and nurture before the application. PathMotion adds employee voices. Together they make previous attention reusable: a relationship to develop, rather than a vacancy that starts sourcing from zero.", screen: "talent" },
      { title: "Ask across the record; inspect the evidence", body: "Paige's June 2026 general release brings conversational reasoning across hiring information with source links. Its useful unit is an answer a recruiter can inspect. The decision still needs a person; the assistant should reduce the hunt for context.", screen: "paige" },
    ],
    choices: [
      { choice: "Preserve configurable hiring depth", gain: "Complex employers can express real committees, approvals and candidate stages instead of working around a generic funnel.", cost: "Configuration becomes part of the customer's operating model. An elegant assistant cannot compensate for an ambiguous review owner." },
      { choice: "Buy reach and specialist capability", gain: "Clinch, eArcu and PathMotion broaden the journey, geography and sources of candidate evidence.", cost: "One brand must earn coherence across distinct products. A shared commercial story is not proof of a common data model." },
      { choice: "Complement the incumbent as well as replace it", gain: "Clinch can improve recruitment marketing alongside an existing ATS; its Workday integration makes that route tangible.", cost: "PageUp does not control the entire downstream process in those accounts. Handoff quality is part of the product's value." },
    ],
    proof: [
      { metric: "Time lost between reviewers", test: "Follow the same requisition across recruiter, panel and hiring manager. Separate useful deliberation from ownerless waiting.", failure: "Applications move faster, but the committee still coordinates its decision in email." },
      { metric: "Qualified applications from existing relationships", test: "Compare a nurtured talent segment with a suitable baseline. Count completed, qualified applications and recruiter effort, not just opens.", failure: "Campaign engagement rises while useful applications and consent quality do not." },
      { metric: "Evidence retrieval without decision laundering", test: "Ask Paige a question whose answer is incomplete. Inspect citations, missing evidence and role visibility before making a decision.", failure: "A fluent answer obscures what is unknown or makes a hiring judgement appear settled." },
    ],
    sources: [
      { title: "Current ATS product and workbench", url: S.ats, supports: "PageUp ATS and PageUp Europe ATS; jobs, applications, selection committees, interviews and offers. Public screenshots informed the app anatomy." },
      { title: "Recruitment marketing", url: S.marketing, supports: "Careers content, CRM, nurture and an ATS-agnostic route to market." },
      { title: "Clinch acquisition · November 2019", url: S.clinch, supports: "Added proactive recruitment marketing, candidate relationship management and analytics." },
      { title: "eArcu acquisition · November 2021", url: S.earcu, supports: "European reach and a distinct talent acquisition suite." },
      { title: "PathMotion acquisition · November 2021", url: S.pathmotion, supports: "Employee-generated content and candidate conversations." },
      { title: "EQT acquisition and CEO transition · October 2024", url: S.eqt, supports: "Battery ownership exit, Mark Rice's retirement and Eric Lochner's arrival; stated international growth and AI priorities." },
      { title: "Brand consolidation · May 2025", url: S.brand, supports: "Unified PageUp, eArcu and Clinch identity; does not establish a single codebase." },
      { title: "Paige general availability · June 2026", url: S.paige, supports: "Cross-record reasoning, citations and retained human decision-making. Vendor pilot performance claims are not used as demonstrated outcomes." },
      { title: "Clinch / Workday integration · February 2026", url: S.workday, supports: "Workday Design Approved integration: evidence for a complement-the-incumbent strategy." },
      { title: "Sapia.ai integration · August 2026", url: S.sapia, supports: "Interview outcomes enter hiring workflows; available to joint customers. Partnership, not acquisition." },
      { title: "Company origin and current leadership", url: S.about, supports: "1997 origins and Eric Lochner listed as CEO at the research date." },
    ],
  },
  strategy: {
    contrast: "Rippling follows consequences outward from the employee. PageUp follows context toward a hiring decision. Depth in that journey can be valuable even when somebody else owns the HR system.",
    flywheel: { title: "The next vacancy should inherit the last one's work.", body: "The compounding opportunity is reusable candidate relationships and institutional context. This is our reading of the product, not a measured growth mechanism.", steps: ["Earn attention", "Retain the relationship", "Learn from hiring", "Reuse the context"], constraint: "It only compounds if candidate consent, fresh evidence and product handoffs survive the journey." },
    moments: [
      { date: "1997", title: "A recruiting problem becomes a company", fact: "PageUp traces its origin to a couple struggling to hire for their software business.", consequence: "The hiring process remains the organising object even as the offering broadens into talent management.", source: S.about },
      { date: "2019", title: "Clinch moves the starting line", fact: "The recruitment marketing business joins PageUp.", consequence: "The product can own candidate interest before a formal application, not only process the people who apply.", source: S.clinch },
      { date: "2021", title: "eArcu and PathMotion add different kinds of depth", fact: "eArcu joins in November, followed by employee-content platform PathMotion.", consequence: "European hiring workflows and employee credibility are distinct assets. Neither acquisition is just more feature count.", source: S.earcu, sources: [S.pathmotion] },
      { date: "2024", title: "EQT ownership; Eric Lochner succeeds Mark Rice", fact: "The October announcement couples a new majority owner with a CEO transition and international growth ambitions.", consequence: "The next challenge is making a specialist portfolio easier to understand, sell and develop together.", source: S.eqt },
      { date: "2025 → 2026", title: "A shared brand, then a shared way to ask", fact: "Brand consolidation in May 2025 precedes Paige's general availability on 30 June 2026.", consequence: "AI becomes a way to make accumulated context accessible. It does not establish that every underlying product has merged.", source: S.paige, sources: [S.brand] },
    ],
    leadership: {
      title: "The Lochner / EQT chapter: make the portfolio add up.",
      fact: "Following the October 2024 EQT acquisition, Eric Lochner succeeded Mark Rice and remains listed as CEO. EQT's acquisition announcement prioritised international expansion, targeted acquisitions and AI; the 2025 brand consolidation and 2026 Paige release are observable developments in that direction.",
      reading: "The strategic shift is from explaining a collection of recruiting capabilities to demonstrating a joined-up hiring journey. Lochner's HR technology background makes the emphasis intelligible; it does not prove that any one executive caused every release. The difficult work is operational coherence beneath a simpler story.",
      watch: "Ask for one candidate journey across careers content, application, assessment and review. Watch where identity, permissions or context must be re-established. That is a sharper leadership execution test than counting launches.",
      sources: [S.eqt, S.about, S.brand],
    },
    essays: [
      { slug: "complexity", title: "The complexity is part of what the customer bought.", standfirst: "A hiring system is also a compact with the people who must trust its decisions.", paragraphs: [
        "Institutional recruiting has several legitimate definitions of done. The recruiter needs a viable shortlist, the committee needs defensible comparisons, and the hiring manager needs permission to proceed. Reducing all of that to a single pipeline can hide the very obligations the system exists to coordinate.",
        "This gives PageUp a particular kind of depth: it can reflect how an organisation hires. That fit can make replacement difficult, but it also makes administration and process ownership expensive. Configurability is valuable only while someone can explain why a step exists and who is responsible for it.",
        "Paige is strategically interesting in that light. An assistant embedded in the process can help people find the context they need without learning every navigation path. The harder question is whether it exposes a broken process or simply makes that process more tolerable. Faster navigation and better operating design are separate achievements.",
      ], test: "Introduce a missing panel review. Can the system explain the next owner and supporting evidence, without pretending the decision is complete?", sources: [S.ats, S.paige] },
      { slug: "relationship", title: "The candidate relationship can outlive the requisition.", standfirst: "Clinch changes the economics of starting again.", paragraphs: [
        "An ATS begins naturally with a job and its applicants. Recruitment marketing begins earlier: someone visits a careers page, reads an employee story, or shows interest without applying. Clinch and PathMotion let those signals become a relationship an employer can cultivate, subject to consent and relevance.",
        "The economic argument is reuse. If each vacancy discards previous attention, every hiring cycle must buy or earn its audience again. If the relationship remains useful, an employer can return to a pool of people who already understand the work. A larger pool by itself proves very little; freshness and willingness matter more than database size.",
        "There is also a route-to-market advantage. Clinch can sit beside another ATS, as its Workday integration demonstrates. PageUp can gain a foothold by improving attraction and nurture without asking the buyer to replace its institutional system. That lowers the scope of the initial decision while making the integration boundary commercially important.",
      ], test: "Measure qualified, completed applications from a consenting existing segment, including the effort to keep that segment current.", sources: [S.marketing, S.pathmotion, S.workday] },
      { slug: "coherence", title: "One brand is a promise. Coherence is the delivery.", standfirst: "Acquired depth becomes a platform only where the customer can actually use it together.", paragraphs: [
        "The portfolio has a logic: Clinch for attraction, eArcu for another hiring platform and regional reach, PathMotion for employee evidence. EQT ownership and the Lochner era add an explicit growth and simplification agenda. But the current ATS page still distinguishes PageUp ATS from PageUp Europe ATS, and Clinch can remain standalone.",
        "That boundary should make the analysis more interesting, not less. A portfolio can serve different buying contexts well without being one monolithic application. What matters is whether a customer buying the joined journey inherits less re-entry, better context and an intelligible support model.",
        "The August 2026 Sapia.ai integration adds interview information to that context for joint customers. It is a partnership rather than an acquisition. Paige's ability to work with evidence makes the connection useful, but a fluent answer is not evidence that all sources are present, equally reliable or appropriate for the decision.",
      ], test: "Trace a cited answer back to the original record, then remove a source. The uncertainty should become visible before anyone acts.", sources: [S.earcu, S.brand, S.ats, S.sapia] },
    ],
    watch: { title: "From navigating software to reasoning over hiring", shipped: "Paige reached general availability in June 2026. An August Sapia.ai integration adds structured interview context for joint customers.", next: "Watch whether answers reduce reviewer handoffs and preserve source-level visibility across the portfolio.", boundary: "An integration is not an acquisition; a shared brand is not proof of one application; AI assistance does not certify a hiring decision.", source: S.sapia },
  },
};
