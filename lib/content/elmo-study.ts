import type { CompanyStudy } from "../companies";
import { ELMO } from "../vendors/talent-skins";
import { TALENT_NAVIGATION } from "./talent-navigation";
const S = {
  history: "https://www.annualreports.com/HostedData/AnnualReportArchive/e/ASX_ELO_2021.pdf",
  pivot: "https://elmosoftware.com.au/resources/newsroom/elmo-acquires-pivot-software",
  breathe: "https://elmosoftware.com.au/resources/newsroom/elmo-acquires-uk-hr-platform-breathe",
  k1: "https://2023.k1im.com/",
  sale: "https://k1.com/k1-investment-management-exits-portfolio-company-webexpenses/",
  lyons: "https://elmosoftware.com.au/resources/newsroom/elmo-software-announces-joseph-lyons-as-new-ceo",
  president: "https://elmosoftware.com.au/resources/video/customer-fireside-chat-how-ai-is-changing-workforce-design",
  rotageek: "https://elmosoftware.com.au/resources/newsroom/elmo-group-acquires-ai-workforce-leader-rotageek",
  brand: "https://elmosoftware.com.au/resources/newsroom/elmo-repositioning-as-the-complete-ai-workforce-platform",
  releases: "https://elmosoftware.com.au/resources/blog/new-releases-in-elmo-q1-fy27",
  career: "https://elmosoftware.com.au/solutions/career-development",
  pay: "https://elmosoftware.com.au/solutions/performance-to-remuneration",
  payroll: "https://elmosoftware.com.au/products/payroll",
  ai: "https://elmosoftware.com.au/ai-at-elmo",
};
export const ELMO_STUDY: CompanyStudy = {
  id: "elmo", name: "ELMO Software", archetype: "Connected workforce suite", skin: ELMO,
  brand: { chrome: "#092E48", ink: "#FFFFFF", highlight: "#F4CB54" },
  appScreens: ["", "people", "learning", "remuneration", "integrations"], workflowScreen: "people",
  backstage: {
    navigation: TALENT_NAVIGATION,
    headline: "Turn HR depth into workforce decisions.",
    thesis: "ELMO's story is the accumulated depth of learning, talent and people operations becoming a connected decision system. Its current bet is that an ANZ HR team should be able to see a capability gap, develop the person and make a defensible reward decision in context. The platform promise has to earn its way through a history of modules, acquisitions and ongoing modernisation.",
    object: "Person + role + capability", question: "What does this team need to become capable of?",
    sequence: ["Define what the role requires", "Assess the person against the requirement", "Connect development and performance", "Review the next workforce decision"],
    premises: [
      { title: "Turn capability gaps into development", body: "A role sets the target; an assessment exposes the gap; a learning plan supplies the action. ELMO's learning heritage matters because workforce intelligence is useful only when there is a practical way to develop the people already here.", screen: "people" },
      { title: "Connect performance to defensible pay", body: "Performance, salary bands, budget and approval context belong in the same review. Pivot's remuneration heritage explains why this is a decision workspace rather than a percentage field on an employee profile.", screen: "remuneration" },
      { title: "Connect the HR core to the right payroll", body: "The current payroll proposition explicitly includes provider choice, mapped ownership and conflict review. The valuable promise is a reliable handoff from people operations to pay, with someone accountable for each field.", screen: "integrations" },
    ],
    choices: [
      { choice: "Build depth around the HR team's decisions", gain: "Learning, performance and remuneration can reinforce one another inside a familiar people-management workflow.", cost: "Data completeness and assessment quality become limiting factors. A polished capability chart can still contain weak managerial judgement." },
      { choice: "Unify a portfolio while preserving segment fit", gain: "Specialist acquisitions add depth; Breathe and Rotageek let the wider group serve different UK needs.", cost: "Group ownership is not native functionality. Product boundaries, availability and the support journey still need to be explained." },
      { choice: "Connect to payroll providers", gain: "Customers can choose a payroll fit while keeping an HR centre of gravity.", cost: "Ownership, effective dates and conflicting changes require explicit integration design. A connection indicator cannot substitute for reconciliation." },
    ],
    proof: [
      { metric: "Development closes the assessed gap", test: "Track a capability from role target to assessment, assigned learning and later reassessment. Keep assignment and demonstrated proficiency distinct.", failure: "Completed courses automatically become evidence of readiness without an assessment." },
      { metric: "Pay decisions stay within explainable constraints", test: "Propose a change above the scenario's salary band or budget. Check the manager can see the exception and route it with a reason.", failure: "The worksheet is reconciled outside the system before it can be approved." },
      { metric: "Conflicts are resolved by ownership", test: "Change the same mapped field in HR and payroll with different dates. Inspect detection, responsible owner and the audit trail.", failure: "Last write wins without an explanation of which value should govern." },
    ],
    sources: [
      { title: "Career development and capability workflow", url: S.career, supports: "Framework, assessment and learning-plan product model. Demonstrated proficiencies remain distinct from course completion." },
      { title: "Performance to remuneration", url: S.pay, supports: "Performance context, salary bands, budget modelling and review guardrails." },
      { title: "Payroll provider model", url: S.payroll, supports: "Curated providers, integrations, mapped-field ownership, conflict detection and audit trail." },
      { title: "ELMO FY2021 annual report", url: S.history, supports: "Company-authored historical learning foundation and acquisition chronology, hosted by AnnualReports." },
      { title: "Pivot acquisition · February 2018", url: S.pivot, supports: "Remuneration depth added alongside performance and rewards." },
      { title: "Breathe acquisition · October 2020", url: S.breathe, supports: "UK small-business expansion; a distinct product, not proof of a universal ELMO module." },
      { title: "K1 2023 review", url: S.k1, supports: "ELMO take-private completed in February 2023." },
      { title: "Webexpenses divestiture · November 2023", url: S.sale, supports: "Sold to Tenzing. Webexpenses belongs in the history, not the current owned-product list." },
      { title: "Joseph Lyons appointed · January 2024", url: S.lyons, supports: "CEO appointment after Xero APAC and REA leadership roles." },
      { title: "Joseph Lyons in 2026 official material", url: S.president, supports: "Styled President in current-era material; no unsupported successor or title-change date is inferred." },
      { title: "Rotageek acquisition · June 2025", url: S.rotageek, supports: "UK scheduling capability alongside the group's other businesses." },
      { title: "Workforce platform repositioning · June 2026", url: S.brand, supports: "Documented shift from modular presentation toward a connected AI workforce platform." },
      { title: "Q1 FY27 product update · July 2026", url: S.releases, supports: "Live Insights, My Profile/My Team and appraisal changes; separately described modernisation and forthcoming features." },
      { title: "Current AI product explanation", url: S.ai, supports: "Capability framework concepts. Public capability UI uses navy navigation, gold selection and a proficiency details drawer." },
    ],
  },
  strategy: {
    contrast: "Rippling asks what changes around an employee. ELMO asks how the workforce becomes more capable and how HR can act on that knowledge. Its learning and remuneration depth matter more to this story than IT provisioning.",
    flywheel: { title: "An assessment should create the next useful action.", body: "The opportunity is to reuse role, capability and performance context across development and reward. The link becomes valuable when managers make better decisions, not simply when more modules share a login.", steps: ["Set the role target", "Assess the gap", "Develop and review", "Inform the next decision"], constraint: "Learning assigned is not capability gained. Assessment quality and workflow ownership constrain the whole loop." },
    moments: [
      { date: "2002 →", title: "Learning and talent provide the foundation", fact: "ELMO began in 2002. Its company history records early learning and course-building capabilities before broader HR expansion.", consequence: "The current focus on workforce capability has a product lineage, rather than being an AI story attached to a payroll engine.", source: S.history },
      { date: "2016–2020", title: "Acquire specific kinds of HR depth", fact: "Learning-content acquisitions, HROnboard and Pivot broaden content, lifecycle workflows and remuneration.", consequence: "The useful connection is assessment to development to reward. The portfolio also inherits the work of making those experiences coherent.", source: S.pivot, sources: [S.history] },
      { date: "2020–2023", title: "Expand the portfolio, then redraw its edge", fact: "Breathe joins in 2020; K1 takes ELMO private in February 2023; Webexpenses is sold to Tenzing in November 2023.", consequence: "Ownership history must not be mistaken for today's product map. Breathe remains a sister business; Webexpenses is divested.", source: S.sale, sources: [S.breathe, S.k1] },
      { date: "2024–2025", title: "A new leadership era and a wider UK group", fact: "Joseph Lyons is appointed in January 2024. The group acquires Rotageek in June 2025.", consequence: "Commercial execution and portfolio scope expand, while a UK scheduling acquisition does not automatically become a native ANZ module.", source: S.rotageek, sources: [S.lyons] },
      { date: "2026", title: "The connected workforce platform becomes the proposition", fact: "June repositioning is followed by a July update documenting both released interfaces and further modernisation work.", consequence: "The analytical question moves from how many HR modules ELMO sells to how consistently it connects workforce decisions.", source: S.brand, sources: [S.releases] },
    ],
    leadership: {
      title: "The Lyons era: from module breadth to a connected proposition.",
      fact: "Joseph Lyons was appointed CEO in January 2024 after leading Xero in APAC and holding commercial leadership roles at REA. ELMO's April 2026 materials style him President. Public titles are not fully consistent; they do not establish a successor or an exact title-change date.",
      reading: "The observable shift is the June 2026 workforce-platform repositioning, alongside practical modernisation of team, profile, learning and performance experiences. Read this as a documented leadership-era direction, not proof that a new label has already resolved every product boundary.",
      watch: "Follow a manager from a capability gap through development and reward. If the experience still depends on rekeying and external spreadsheets, the commercial story is ahead of the product. Watch completed connections rather than announced modules.",
      sources: [S.lyons, S.president, S.brand, S.releases],
    },
    essays: [
      { slug: "capability", title: "A learning catalogue is not a workforce plan.", standfirst: "The value is in the distance between what the role needs and what the person can demonstrate.", paragraphs: [
        "A catalogue is a supply of training. A capability framework is a statement about the work an organisation needs to perform. Linking a person to a role, a role to a target and a target to an assessment creates a reason to assign development. Without that chain, course completion is activity looking for an outcome.",
        "ELMO's learning and content heritage gives it a plausible path from diagnosis to action. Career Development describes a framework, assessment and learning workflow; its current AI positioning extends the idea toward generating frameworks from position information. The defensible value is not the speed of generating labels. It is whether the labels help a manager make a useful development decision.",
        "There is an important measurement trap. An assigned course does not remove a capability gap, and a completed course does not by itself demonstrate proficiency. The app study keeps the target and assessment unchanged when learning is assigned. That is a small interface choice with a large analytical consequence: the system cannot manufacture readiness by completing its own tasks.",
      ], test: "After development, require new evidence and reassessment. If readiness improved only because a course status changed, the loop is measuring itself.", sources: [S.career, S.ai, S.history] },
      { slug: "reward", title: "The pay review is where context has to survive.", standfirst: "Pivot's contribution is more than a remuneration tab.", paragraphs: [
        "A manager may believe a strong performer deserves a larger increase. Finance may have a fixed pool, and HR may need to consider salary bands and consistency. A useful remuneration workspace holds these constraints together while the change is still a proposal.",
        "The Pivot acquisition provides a concrete origin for ELMO's remuneration depth. Linking performance to reward means a manager can reason from an assessment within budget and policy context. It does not mean a performance rating should automatically dictate pay. Review is necessary precisely because the relationship is a judgement, not a formula.",
        "This also sharpens the product's value test. If managers still export everything to negotiate a budget, the platform is storing the result rather than supporting the decision. A well-designed exception route preserves the reason for departing from a guardrail without making the guardrail meaningless. The prototype makes that trade visible using explicitly fictional bands and budgets.",
      ], test: "Increase a proposal beyond its band. The interface should show what changed, the budget consequence and who must review the exception.", sources: [S.pivot, S.pay] },
      { slug: "connected", title: "Connected does not have to mean owned.", standfirst: "A clearer perimeter can be a stronger platform story than an exaggerated one.", paragraphs: [
        "ELMO's current payroll page describes a provider network and integration controls, including mapped ownership and conflict detection. That is different from claiming every payroll calculation runs on one native engine. For an HR-centred buyer, provider choice can be a feature if the handoff is reliable.",
        "The wider corporate history needs the same precision. Breathe opened a distinct UK small-business segment; Rotageek adds scheduling capability to the group; Webexpenses was sold. None of those facts establishes that an ANZ ELMO user sees all three inside one application. The group can gain scope while the customer still needs a clear product and responsibility boundary.",
        "The 2026 repositioning makes coherence the promise. July's product update also documents work still underway. That is the honest tension to study: acquired and established depth becoming easier to use together. A conflict dashboard with named field ownership tells us more about that progress than an undifferentiated claim of seamless integration.",
      ], test: "Create a disagreement across HR and payroll. Can the customer identify the authoritative field, effective date, resolver and final receipt?", sources: [S.payroll, S.breathe, S.rotageek, S.sale, S.releases] },
    ],
    watch: { title: "Workforce intelligence, with the release boundary visible", shipped: "July 2026 materials identify Insights, refreshed My Profile/My Team and appraisal experiences as live.", next: "Salary Intelligence, Capability Forecast and Career Explorer feature in the quarter's release work; modernised contracts and other surfaces are still described as forthcoming.", boundary: "The study uses current capability, learning and remuneration concepts. It does not present every announced feature as universally available or treat AI output as verified workforce truth.", source: S.releases },
  },
};
