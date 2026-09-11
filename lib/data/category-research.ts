/** Focused, dated research. Company IDs are shared with the landscape and finder. */
export type ResearchCategoryId = 'ai-inference' | 'developer-tools' | 'enterprise-ai';
export type ResearchSource = { title: string; url: string };
export type ResearchFact = { text: string; sources: ResearchSource[] };
export type ResearchMove = ResearchFact & { date: string; title: string; implication: string };
export type ResearchCompany = {
  id: string; name: string; product: string; categories: ResearchCategoryId[];
  group: string; accent: string; monogram: string; terms: string[];
  thesis: string; strengths: [string, string, string]; productSource: ResearchSource;
  productSources?: ResearchSource[];
  origin: ResearchFact; movement: ResearchMove; tradeoff: string; watch: string;
  related?: { id: string; label: string; href: string }[];
};
export type CategorySituation = {
  id: string; name: string; title: string; explanation: string;
  steps: [string, string, string]; check: string; companies: string[];
};
export type ResearchCategory = {
  id: ResearchCategoryId; name: string; shortName: string; question: string;
  thesis: string; boundary: string; groups: {id: string; name: string; detail: string}[];
  forces: {title: string; text: string}[]; situations: CategorySituation[];
};
export const RESEARCH_REVIEWED = '11 September 2026';
export const researchHref = (id: string, category?: ResearchCategoryId) => `/research/${id}${category ? `?category=${category}` : ''}`;
export const categoryHref = (id: ResearchCategoryId) => `/categories/${id}`;
export function researchContext(id: string, requested?: string | null): ResearchCategoryId {
  const company = researchCompany(id);
  return company?.categories.find(category => category === requested) ?? company?.categories[0] ?? 'ai-inference';
}
const s = (title: string, url: string): ResearchSource => ({ title, url });

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  {
    id: 'ai-inference', name: 'AI inference & model serving', shortName: 'Serving models',
    question: 'Who turns a model into a dependable service?',
    thesis: 'The contest is moving from cheap tokens to the cost of a useful result. Serving, customisation and the workload around the model increasingly belong in the same conversation.',
    boundary: 'Model labs create the intelligence. These companies make it run. An API, a custom serving stack and a GPU cluster leave very different amounts of work with the customer.',
    groups: [
      {id:'model-platform', name:'Model platforms', detail:'Start with a model API; move into dedicated capacity or training.'},
      {id:'runtime', name:'Custom serving & compute', detail:'Bring code, weights and a workload that needs its own runtime.'},
      {id:'silicon', name:'Silicon-led inference', detail:'A different hardware path to response speed and capacity.'},
      {id:'catalogue', name:'Model distribution', detail:'Turn a wide variety of research models into usable APIs.'},
    ],
    forces: [
      {title:'A token is an input cost.', text:'Count retries, tool calls and rejected outputs. A lower token price can still produce a more expensive completed task.'},
      {title:'Speed has several meanings.', text:'Time to first token, time to finish, throughput under load and cold starts answer different questions. Compare the same model and workload.'},
      {title:'Customisation changes the relationship.', text:'Weights may be portable while the training loop, serving configuration and evaluation history remain expensive to move.'},
    ],
    situations: [
      {id:'api', name:'Try an open model', title:'Start with the API. Keep the evaluation yours.', explanation:'For an uncertain workload, a managed model endpoint is a quick way to learn. Shared capacity and model lifecycle policies still shape the result.', steps:['Your task + evaluation set','Managed model endpoint','Measure useful completions'], check:'Replay representative prompts, including failures. Record quality, end-to-end latency and cost per accepted result.', companies:['fireworks','together-ai','replicate']},
      {id:'custom', name:'Serve my own model', title:'You are choosing an operating boundary.', explanation:'A tuned checkpoint is only one ingredient. Decide who owns the container, scaling, rollout and recovery when the new version fails.', steps:['Your weights + runtime needs','Dedicated model or container','Version, scale and recover'], check:'Deploy a previous version and roll back. Test burst traffic and a cold start before treating an endpoint as production-ready.', companies:['fireworks','baseten','modal','together-ai']},
      {id:'latency', name:'Make an agent faster', title:'Find the slow step before buying faster inference.', explanation:'Sequential tool calls, retrieval and network hops can dominate the wait. A faster decoder helps only the portion of the task it actually runs.', steps:['Trace a complete task','Separate model and tool time','Test speed at equal quality'], check:'Hold model quality and concurrency constant. Measure p95 task time, rather than comparing unrelated tokens-per-second claims.', companies:['groq','cerebras','fireworks']},
    ],
  },
  {
    id:'developer-tools', name:'Developer tools', shortName:'Building software',
    question:'Who owns the next handoff in software work?',
    thesis:'Writing code is becoming one step in a larger loop: understand, change, run, review, ship and learn. The durable advantage may sit at the handoffs between those steps.',
    boundary:'An editor, an autonomous coding environment, a deployment platform and an evaluation tool can work together. They are not interchangeable subscriptions.',
    groups:[
      {id:'coding',name:'Code & delegate',detail:'Work in a repository and turn an instruction into a reviewable change.'},
      {id:'shipping',name:'Build & ship',detail:'Connect code generation to running applications and deployment.'},
      {id:'quality',name:'Orchestrate & evaluate',detail:'Control state, inspect runs and decide whether a change helped.'},
    ],
    forces:[
      {title:'The handoff is the product.',text:'A generated patch still needs a working environment, evidence and a review. Watch how much context survives that transition.'},
      {title:'Distribution and model supply interact.',text:'The tool owns the workflow, but its model suppliers may be competitors. Ownership changes can alter the models users can access.'},
      {title:'Shipping creates a second feedback loop.',text:'Passing code tests and improving an AI feature are separate questions. Production traces must become repeatable evaluations.'},
    ],
    situations:[
      {id:'patch',name:'Change an existing codebase',title:'Ask for a reviewable change, with evidence.',explanation:'Repository context and a reproducible environment matter more than a polished first response. Specify the outcome and the check that would prove it.',steps:['Issue + repository context','Agent edits and runs checks','Human reviews the change'],check:'Use a real bug with a failing reproduction. Can another developer understand the patch and rerun the evidence?',companies:['cursor','github','cognition']},
      {id:'ship',name:'Take an idea live',title:'Follow the idea through deployment.',explanation:'A demo is useful when the route to a maintained application remains clear. Inspect secrets, data ownership, previews and rollback before broadening use.',steps:['Intent + working prototype','Preview with real constraints','Publish and retain a rollback'],check:'Change a data field after the first release. Test who can access it and how you recover the previous working version.',companies:['replit','vercel']},
      {id:'evaluate',name:'Improve an AI workflow',title:'Turn a failure into a repeatable test.',explanation:'Tracing shows what happened. Evaluation asks whether a proposed change fixes it without breaking other cases. Durable state makes the workflow recoverable.',steps:['Capture a failed run','Compare on a held-out dataset','Ship only the supported change'],check:'Keep one known failure and one regression case. Change the model or prompt and inspect both results, not only an average score.',companies:['langchain','braintrust']},
    ],
  },
  {
    id:'enterprise-ai',name:'Enterprise AI cloud',shortName:'Operating enterprise AI',
    question:'Where do data, models and authority meet?',
    thesis:'The enterprise platform competes to become the place where AI is permitted to act. Existing identity, data and operations often matter as much as the model catalogue.',
    boundary:'Hyperscalers supply a broad operating environment. Data platforms bring AI to an existing data estate. A GPU specialist supplies capacity; that alone is not enterprise governance.',
    groups:[
      {id:'hyperscaler',name:'Cloud control planes',detail:'Models and agents alongside identity, networks and cloud operations.'},
      {id:'data-platform',name:'Data platforms',detail:'Ground and evaluate AI using the data estate already in place.'},
      {id:'gpu-cloud',name:'GPU infrastructure',detail:'Dedicated accelerated capacity underneath models and applications.'},
    ],
    forces:[
      {title:'Data location is only the first stop.',text:'Storage, inference, logs and tool execution can happen in different places. Trace all four before calling a design local.'},
      {title:'Model choice is not platform portability.',text:'Changing a model endpoint can be easy while moving identity, agent state and operating controls remains difficult.'},
      {title:'Permission must follow the action.',text:'A governed model call does not automatically govern every tool the agent invokes. Check identity and audit coverage across the full run.'},
    ],
    situations:[
      {id:'estate',name:'Use our existing cloud',title:'Start where the operating controls already work.',explanation:'Cloud alignment can reduce duplicated identity and operations. Verify the exact agent features and deployment mode instead of assuming every catalogue item inherits identical controls.',steps:['Existing identity + networks','Model and agent runtime','Authorised tools + audit trail'],check:'Run one request with a deliberately denied permission. Check that the tool is blocked and the event is visible in the audit trail.',companies:['microsoft','google','aws']},
      {id:'data',name:'Work over our governed data',title:'Test access at the data boundary.',explanation:'A data platform can reduce copying and duplicate permissions. The important test is whether retrieval and generated answers respect each user’s access.',steps:['Governed tables and documents','Retrieval + model processing','Answer with attributable evidence'],check:'Ask the same question as two roles with different access. Then inspect where the model actually processed the request.',companies:['databricks','snowflake']},
      {id:'anz',name:'Keep processing in Australia',title:'Choose an exact route, not an APAC label.',explanation:'A Sydney account or an APAC facility does not establish Australian processing. Check the model, feature, inference profile, logs and fallback destinations.',steps:['Australian source data','Explicit allowed destinations','Verify inference, logs and tools'],check:'Record the exact model and deployment configuration. Read its current regional matrix; block an unsupported destination rather than silently falling back.',companies:['aws','snowflake','microsoft','google','coreweave']},
    ],
  },
];

export const RESEARCH_COMPANIES: ResearchCompany[] = [
  {
    id:'fireworks',name:'Fireworks AI',product:'Serverless · Deployments · Training',categories:['ai-inference'],group:'model-platform',accent:'#823EE5',monogram:'F',terms:['Fireworks','Lin Qiao','PyTorch','LoRA','fine tuning','reinforcement learning'],
    thesis:'The useful unit is becoming the specialised model in production: train it, serve it and use the result to improve it.',
    strengths:['An API for supported open models without first operating a GPU deployment.','Dedicated deployments for custom models and explicit capacity choices.','Training connected to serving, including supervised and reinforcement-learning workflows.'],
    productSource:s('Fireworks · product documentation','https://docs.fireworks.ai/'),
    origin:{text:'CEO and co-founder Lin Qiao previously led PyTorch at Meta. The founding team also includes PyTorch systems engineers and a former Google Vertex AI lead: a systems lineage behind the model API.',sources:[s('Fireworks · founding team','https://fireworks.ai/team')]},
    movement:{date:'31 Aug 2026',title:'Training becomes a larger part of the product.',text:'Fireworks announced general availability of its Training API and Fireworks Lab. The API connects a customer-controlled training loop to managed training and rollout infrastructure.',implication:'Compound’s reading: serving efficiency can feed model improvement, rather than remaining a commodity endpoint.',sources:[s('Fireworks · Training API launch','https://fireworks.ai/blog/train-past-the-frontier-training-api-now-generally-available')]},
    tradeoff:'API compatibility does not make model behaviour or operational configuration portable. Dedicated capacity also introduces utilisation and cold-start decisions.',
    watch:'Whether task-specific quality improvements survive a held-out evaluation, and how easily a tuned model can be moved or rolled back.',
    related:[{id:'cursor',label:'Follow the coding workflow',href:'/research/cursor'},{id:'vercel',label:'Follow application delivery',href:'/research/vercel'}],
  },
  {
    id:'together-ai',name:'Together AI',product:'Inference · Fine-tuning · GPU clusters',categories:['ai-inference'],group:'model-platform',accent:'#225DD8',monogram:'T',terms:['Together','Vipul Ved Prakash','Ce Zhang','Tri Dao','FlashAttention','GPU clusters'],
    thesis:'Keep a team on one platform as it moves from calling open models to customising them and operating larger compute jobs.',
    strengths:['Open-model inference through a compatible API.','Fine-tune on your data and deploy the resulting model.','GPU clusters for training and large batch workloads alongside managed inference.'],
    productSource:s('Together · platform overview','https://docs.together.ai/intro'),
    origin:{text:'Together names Vipul Ved Prakash as founder and CEO, Ce Zhang as founder and CTO, and Tri Dao as founder and chief scientist. Systems research is part of the founding team, alongside the commercial platform.',sources:[s('Together · team','https://www.together.ai/about-us')]},
    movement:{date:'Sep 2026 · product snapshot',title:'The scope reaches beyond a model catalogue.',text:'Current documentation covers dedicated model and container inference, GPU clusters, fine-tuning and code execution.',implication:'Compound’s reading: breadth can reduce platform handoffs, but the customer still chooses how much infrastructure to operate.',sources:[s('Together · current documentation','https://docs.together.ai/intro')]},
    tradeoff:'Serverless inference, dedicated containers and GPU clusters have different capacity and operational commitments. A broad catalogue does not make every path equally managed.',
    watch:'Whether the move from prototype API usage to sustained custom workloads remains straightforward to operate and evaluate.',
  },
  {
    id:'baseten',name:'Baseten',product:'Model APIs · Truss · Chains',categories:['ai-inference'],group:'runtime',accent:'#125B4B',monogram:'B',terms:['Truss','Chains','Tuhin Srivastava','custom containers'],
    thesis:'Own the deployment workflow around a model, especially when the application needs more than a single text endpoint.',
    strengths:['Package model dependencies, hardware and prediction code with Truss.','Publish versioned deployments with autoscaling and observability.','Compose steps with different hardware and scaling needs through Chains.'],
    productSource:s('Baseten · model development','https://docs.baseten.co/development/model/overview'),
    origin:{text:'Baseten says it was founded in 2019 to solve the difficulty of taking models into production. That origin explains the emphasis on packaging, deployment and operating workflows.',sources:[s('Baseten · company origin','https://www.baseten.co/blog/announcing-baseten-75m-series-c/')]},
    movement:{date:'Sep 2026 · product snapshot',title:'Both a quick API and a custom runtime.',text:'Baseten distinguishes hosted Model APIs from dedicated deployments of your own model. Development deployments and immutable production deployments follow different operating rules.',implication:'Compound’s reading: the deeper relationship is with the team responsible for model delivery, not only the developer trying an API.',sources:[s('Baseten · deployment workflow','https://docs.baseten.co/development/model/overview')]},
    tradeoff:'Runtime control brings configuration choices. A custom deployment needs version discipline and realistic load tests even when the infrastructure is managed.',
    watch:'How well multi-step models can be deployed, observed and rolled back as one application.',
  },
  {
    id:'modal',name:'Modal',product:'Functions · Sandboxes · GPU compute',categories:['ai-inference','developer-tools'],group:'runtime',accent:'#386845',monogram:'M',terms:['Erik Bernhardsson','Python','sandbox','serverless GPU'],
    thesis:'Make the whole AI workload elastic: not just the model call, but the code, batch processing and execution environment around it.',
    strengths:['Define container environments and GPU requirements in code.','Scale inference and parallel batch work through managed functions.','Run generated code in separate sandboxes.'],
    productSource:s('Modal · introduction','https://modal.com/docs/guide'),
    origin:{text:'Founder Erik Bernhardsson’s earlier work at Spotify and Better informed the problem Modal set out to solve: data teams stitching together too many infrastructure tools.',sources:[s('Modal · founding rationale','https://modal.com/blog/general-availability-and-series-a-press-release')]},
    movement:{date:'21 May 2026',title:'An AI runtime with more than one workload.',text:'Modal’s Series C announcement places elastic inference, agent runtimes, reinforcement learning and large batch jobs within the same platform strategy.',implication:'Compound’s reading: code execution is becoming as important to the infrastructure story as model hosting.',sources:[s('Modal · platform direction','https://modal.com/blog/modal-series-c')]},
    tradeoff:'A flexible runtime leaves application logic with your team. Region selection, cold starts, retries and data movement still need deliberate design.',
    watch:'Whether one operating model really works across inference, long jobs and short-lived agent sandboxes.',
  },
  {
    id:'groq',name:'Groq',product:'GroqCloud inference',categories:['ai-inference'],group:'silicon',accent:'#B54927',monogram:'g',terms:['GroqCloud','LPU','Jonathan Ross','Simon Edwards','Adam Winter','NVIDIA'],
    thesis:'Response speed is the wedge; the current company is increasingly a cloud operator with a broader hardware relationship.',
    strengths:['A hosted inference API built around low-latency workloads.','Experience operating its LPU-based inference systems.','A developing NVIDIA infrastructure path alongside that installed base.'],
    productSource:s('Groq · NVIDIA cloud partnership','https://groq.com/newsroom/groq-becomes-an-nvidia-cloud-partner'),
    origin:{text:'In December 2025, Groq licensed inference technology to NVIDIA non-exclusively. Founder Jonathan Ross and other staff moved to NVIDIA; Groq said it would remain independent, with Simon Edwards becoming CEO.',sources:[s('Groq · licensing and people movement','https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale')]},
    movement:{date:'12 Aug 2026',title:'The old “GPU challenger” label is incomplete.',text:'Groq joined NVIDIA’s Cloud Partner programme. The announcement names Adam Winter as CEO and describes future NVIDIA capacity within its data centres.',implication:'Compound’s reading: distinguish technology licensing, leadership movement and cloud operation. These are not evidence that NVIDIA acquired Groq itself.',sources:[s('Groq · current direction and leadership','https://groq.com/newsroom/groq-becomes-an-nvidia-cloud-partner')]},
    tradeoff:'A speed claim only helps if the required model, context and tool behaviour are supported at your concurrency. Future capacity is not present availability.',
    watch:'Which new NVIDIA-backed services actually become available, and what changes for existing GroqCloud workloads.',
  },
  {
    id:'cerebras',name:'Cerebras',product:'Wafer-scale systems · Inference cloud',categories:['ai-inference'],group:'silicon',accent:'#A45324',monogram:'C',terms:['Wafer-Scale Engine','Andrew Feldman','AMD','fast inference'],
    thesis:'A different chip architecture becomes commercially interesting when applications can consume it as a service.',
    strengths:['Wafer-scale hardware designed around AI computation.','A model inference API that reduces the integration work of trying that hardware.','A path from specialised systems into large inference supply relationships.'],
    productSource:s('Cerebras · inference platform','https://www.cerebras.ai/inference'),
    origin:{text:'Cerebras built its strategy around a wafer-scale processor. Its January 2026 OpenAI partnership announcement connects that hardware lineage to a staged cloud inference deployment.',sources:[s('Cerebras · hardware to inference relationship','https://www.cerebras.ai/blog/openai-partners-with-cerebras-to-bring-high-speed-inference-to-the-mainstream')]},
    movement:{date:'23 Jul 2026',title:'Different chips for different stages.',text:'AMD and Cerebras announced a disaggregated inference partnership combining AMD Helios systems with the Cerebras Wafer-Scale Engine.',implication:'Compound’s reading: the competitive unit can be a combined serving system, rather than a single chip winning every part of inference.',sources:[s('Cerebras / AMD · announced technical partnership','https://investors.cerebras.ai/news-releases/news-release-details/amd-and-cerebras-announce-industry-leading-ultra-low-latency-and')]},
    tradeoff:'Architecture-level speed does not establish application-level quality, region availability or capacity for your contract. Treat announced integrations as a direction until delivered.',
    watch:'Which workloads reach general availability on the combined system and how performance holds at the required model quality and load.',
  },
  {
    id:'replicate',name:'Replicate',product:'Model catalogue · Cog · Prediction API',categories:['ai-inference'],group:'catalogue',accent:'#292929',monogram:'r',terms:['Cog','Cloudflare','Ben Firshman','Andreas Jansson','image models'],
    thesis:'Make unfamiliar models approachable, then connect them to the infrastructure needed for an actual application.',
    strengths:['Explore models through a shared catalogue and API.','Package models with the open-source Cog tool.','Use consistent prediction primitives across varied model types.'],
    productSource:s('Replicate · product and platform direction','https://replicate.com/blog/replicate-cloudflare/'),
    origin:{text:'Ben Firshman and Andreas Jansson describe starting Replicate in 2019 to get research models into developers’ hands without requiring them to operate the underlying ML stack.',sources:[s('Replicate founders · origin','https://blog.cloudflare.com/why-replicate-joining-cloudflare/')]},
    movement:{date:'1 Dec 2025',title:'Cloudflare adds the application surroundings.',text:'The founders confirmed that Replicate had officially become part of Cloudflare. Their stated direction connects model execution to Workers, storage and networking.',implication:'Compound’s reading: ownership can shorten the path from a model demo to an application. It does not mean every proposed integration is already shipped.',sources:[s('Cloudflare · acquisition completion','https://blog.cloudflare.com/why-replicate-joining-cloudflare/')]},
    tradeoff:'A broad catalogue means differing model licences, schemas and operating characteristics. A common API does not erase those boundaries.',
    watch:'Which Cloudflare integrations become usable while Replicate retains its distinct developer experience.',
  },
  {
    id:'cursor',name:'Cursor',product:'Coding agent · Cloud agents · Review',categories:['developer-tools'],group:'coding',accent:'#292D34',monogram:'↗',terms:['Anysphere','Composer','SpaceX','Grok','Graphite','AI editor'],
    thesis:'The developer workflow is a distribution channel for models—and now part of a model-and-compute owner.',
    strengths:['Codebase understanding, planning and changes in one working context.','Cloud agents for delegated repository work.','Review and integration surfaces around the resulting change.'],
    productSource:s('Cursor · current product documentation','https://cursor.com/docs'),
    origin:{text:'Cursor, made by Anysphere, moved from code completion toward delegated software work. On 14 August 2026 it confirmed that SpaceX had completed its acquisition, following an April model-training partnership.',sources:[s('Cursor · completed SpaceX acquisition','https://cursor.com/blog/joining-spacex')]},
    movement:{date:'28 Aug 2026',title:'Ownership now changes model supply.',text:'OpenAI announced it intends to wind down its model contract with Cursor, with a proposed shutoff on 12 November 2026. This is a planned change, not a claim that access has already ended.',implication:'Compound’s reading: evaluate the workflow and the continuity of its model supply together. An old “model-neutral editor” description misses a material dependency.',sources:[s('OpenAI · planned Cursor contract wind-down','https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/')]},
    tradeoff:'A familiar editor can hide changing commercial dependencies. Re-test critical work when the model mix changes.',
    watch:'The November transition, available model choices and whether workflow quality survives any supplier change.',
    related:[{id:'anthropic',label:'Claude Code · inside the workflow',href:'/companies/anthropic/app/code'},{id:'openai',label:'OpenAI · company context',href:'/companies/openai/backstage'}],
  },
  {
    id:'github',name:'GitHub',product:'Repositories · Copilot cloud agent',categories:['developer-tools'],group:'coding',accent:'#24292F',monogram:'GH',terms:['Copilot','GitHub Actions','Thomas Dohmke','Microsoft','pull requests'],
    thesis:'The repository already holds the issue, checks and review. GitHub can make the agent another participant in that existing process.',
    strengths:['Delegate repository research, planning or code changes to Copilot cloud agent.','Run work in an ephemeral environment backed by GitHub Actions.','Bring the resulting pull request into the existing human review process.'],
    productSource:s('GitHub · coding agent','https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent'),
    origin:{text:'GitHub’s strategic asset is the development system around the code: repository context, collaboration and review. Its company leadership sits within the wider Microsoft relationship.',sources:[s('GitHub · company direction','https://github.blog/news-insights/company-news/goodbye-github/')]},
    movement:{date:'Aug 2025',title:'A leadership transition inside Microsoft.',text:'Thomas Dohmke announced he would leave the CEO role to become a founder again, remaining through the end of 2025 for the transition.',implication:'Compound’s reading: track where product decisions sit after the transition; the departure announcement does not identify a successor CEO.',sources:[s('Dohmke · departure announcement','https://github.blog/news-insights/company-news/goodbye-github/')]},
    tradeoff:'An agent-generated pull request is still a proposed change. Repository permissions, environment setup and review quality determine what it can safely accomplish.',
    watch:'Whether delegated work reduces review burden as well as authoring time.',
  },
  {
    id:'cognition',name:'Cognition',product:'Devin Cloud · Devin Desktop',categories:['developer-tools'],group:'coding',accent:'#2E5292',monogram:'D',terms:['Devin','Windsurf','Codeium','Devin Desktop','Scott Wu','Jeff Wang','agentic IDE'],
    thesis:'Bring interactive coding and delegated engineering closer together, with the work environment as the connective tissue.',
    strengths:['Manage local and cloud agents, pull requests and context in the Agent Command Center.','Use a full IDE when work needs direct inspection or a final edit.','Bring ACP-compatible agents into the same desktop surface.'],
    productSource:s('Cognition · Devin Desktop','https://cognition.com/blog/introducing-devin-desktop'),
    origin:{text:'Scott Wu’s July 2025 announcement described an agreement to acquire Windsurf’s product, IP, brand and business. It is specific about which assets and people were joining; a company name alone would obscure that history.',sources:[s('Cognition · acquisition announcement','https://cognition.com/blog/windsurf')]},
    movement:{date:'2 Jun 2026',title:'Windsurf becomes the foundation of Devin Desktop.',text:'Scott Wu and Jeff Wang introduced Devin Desktop as the next generation of Windsurf, with an agent-management surface inside the full IDE.',implication:'Compound’s reading: the acquired editor is now part of an explicit handoff between local work, cloud agents and human review.',sources:[s('Cognition · Devin Desktop launch','https://cognition.com/blog/introducing-devin-desktop')]},
    tradeoff:'Longer-running autonomy depends on repository setup, recoverable state and a reviewable result. Brand consolidation is not evidence of a seamless workflow.',
    watch:'How much context and control survive when a developer hands work to an agent and takes it back.',
  },
  {
    id:'replit',name:'Replit',product:'Agent · Workspace · Publishing',categories:['developer-tools'],group:'shipping',accent:'#A8421F',monogram:'R',terms:['Replit Agent','app builder','checkpoints','deployments'],
    thesis:'Compress the distance between describing an application and operating its first usable version.',
    strengths:['Use natural-language instructions to build and change an application.','Keep the code and running project in a shared workspace.','Use checkpoints and publishing as part of the development workflow.'],
    productSource:s('Replit · Agent overview','https://docs.replit.com/features/agent/overview'),
    origin:{text:'Replit’s Agent works inside the existing Replit project environment. The platform relationship extends beyond code generation into the place the application runs and is published.',sources:[s('Replit · project and agent workflow','https://docs.replit.com/features/agent/overview')]},
    movement:{date:'Sep 2026 · product snapshot',title:'The loop extends beyond the first build.',text:'Current Agent documentation describes planning, iterative changes and project checkpoints within the application-building workflow.',implication:'Compound’s reading: the quality test is the second and third change to a live application, not just an impressive initial generation.',sources:[s('Replit · current Agent documentation','https://docs.replit.com/features/agent/overview')]},
    tradeoff:'A short path to publishing can make ownership of data, access and ongoing operations easy to overlook. Test those choices with a real change.',
    watch:'Whether non-specialists can maintain and recover the application after the initial prototype.',
  },
  {
    id:'vercel',name:'Vercel',product:'Deployment platform · v0 · AI SDK',categories:['developer-tools'],group:'shipping',accent:'#171717',monogram:'▲',terms:['v0','Next.js','AI SDK','AI Gateway','Guillermo Rauch'],
    thesis:'Connect the act of building an AI application to its runtime, distribution and continuing operation.',
    strengths:['AI SDK gives TypeScript applications common model, tool and streaming primitives.','v0 provides an application-generation surface.','The deployment platform gives the resulting application a path into previews and production.'],
    productSource:s('Vercel · AI SDK and application workflow','https://vercel.com/docs/ai-sdk'),
    productSources:[s('v0 · deployment workflow','https://v0.app/docs/deployments')],
    origin:{text:'Vercel’s position grows from its web application and deployment ecosystem. The AI SDK connects that developer base to model providers without requiring each integration to start from scratch.',sources:[s('Vercel · AI SDK','https://vercel.com/docs/ai-sdk')]},
    movement:{date:'31 Aug 2026 · supplier account',title:'The application platform also customises models.',text:'Fireworks describes Vercel using reinforcement fine-tuning and speculative decoding for v0’s auto-fixer. This is a supplier-published account of a specific workload.',implication:'Compound’s reading: a developer platform can become a specialised-model customer as well as a distributor of general models.',sources:[s('Fireworks · Vercel workload account','https://fireworks.ai/blog/train-past-the-frontier-training-api-now-generally-available')]},
    tradeoff:'A portable SDK and a hosted application platform are different commitments. Inspect runtime, storage and deployment dependencies separately.',
    watch:'Whether the feedback from deployed applications materially improves generation and repair, rather than simply increasing model usage.',
    related:[{id:'fireworks',label:'Where the specialised model is trained and served',href:'/research/fireworks'}],
  },
  {
    id:'langchain',name:'LangChain',product:'LangGraph · LangSmith · Frameworks',categories:['developer-tools'],group:'quality',accent:'#255A59',monogram:'L',terms:['LangGraph','LangSmith','Harrison Chase','Ankush Gola','durable execution','evaluation'],
    thesis:'Own the state and feedback around an agent so the model can change without rebuilding the entire operating loop.',
    strengths:['LangChain provides model and tool abstractions.','LangGraph supplies persistence, durable execution and human intervention in workflows.','LangSmith covers tracing, evaluation and deployment across frameworks.'],
    productSource:s('LangChain · framework and runtime boundaries','https://docs.langchain.com/oss/python/langgraph/overview'),
    origin:{text:'Harrison Chase and Ankush Gola founded the company in early 2023. Its open-source framework distribution grew into a broader agent tooling platform.',sources:[s('LangChain · company history','https://www.langchain.com/about')]},
    movement:{date:'Sep 2026 · product snapshot',title:'Framework, runtime and platform are distinct.',text:'Current documentation explicitly separates LangChain, LangGraph and LangSmith, and positions Deep Agents as a harness on top of LangGraph.',implication:'Compound’s reading: decide which layer you need. Adopting an open framework is not the same decision as purchasing the hosted platform.',sources:[s('LangChain · current architecture','https://docs.langchain.com/oss/python/langgraph/overview')]},
    tradeoff:'Framework structure cannot supply missing task definitions or good evaluations. Extra abstraction is valuable only when it removes real operating work.',
    watch:'Whether traces become better tests and whether workflows recover correctly after interrupted execution.',
  },
  {
    id:'braintrust',name:'Braintrust',product:'Agent tracing · Evaluation',categories:['developer-tools'],group:'quality',accent:'#6650B5',monogram:'B',terms:['AI evaluations','evals','traces','observability','Ankur Goyal','Impira'],
    thesis:'Make quality improvement a repeatable engineering process rather than a succession of convincing demos.',
    strengths:['Instrument agent runs and inspect what happened.','Evaluate changes against datasets and scoring criteria.','Use production patterns to identify the next improvement.'],
    productSource:s('Braintrust · platform documentation','https://www.braintrust.dev/docs'),
    origin:{text:'Ankur Goyal introduced Braintrust in September 2023 after building AI products at Impira and Figma. His founding account frames the problem as knowing which examples improve or regress when an AI system changes.',sources:[s('Braintrust · founder’s launch account','https://www.braintrust.dev/blog/reliable-ai')]},
    movement:{date:'Sep 2026 · product snapshot',title:'From passive traces toward active diagnosis.',text:'Braintrust’s current positioning emphasises applying intelligence to agent traces to surface patterns, alongside tools to understand and improve the agent.',implication:'Compound’s reading: the useful outcome is a better next experiment. Automatically identifying a pattern does not establish its cause.',sources:[s('Braintrust · active observability','https://www.braintrust.dev/docs')]},
    tradeoff:'An evaluation only measures what its data and scoring rules capture. A rising average can conceal a serious regression in an important user journey.',
    watch:'How easily a production failure becomes a retained test and a verified improvement.',
  },
  {
    id:'microsoft',name:'Microsoft',product:'Microsoft Foundry',categories:['enterprise-ai'],group:'hyperscaler',accent:'#1767A7',monogram:'M',terms:['Azure','Microsoft Foundry','Azure AI Foundry','Azure AI Studio','Entra','Agent Service'],
    thesis:'Make agents another governed Azure resource, using the identity and operating relationships the enterprise already has.',
    strengths:['A catalogue of Microsoft and third-party models.','Managed prompt agents or hosted agents running customer code.','Shared access control, networking, policies and observability around those resources.'],
    productSource:s('Microsoft · what Foundry is','https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry'),
    origin:{text:'Microsoft’s own migration table traces Azure AI Studio and Azure AI Foundry into Microsoft Foundry. The change also consolidates resources, clients and agent concepts; it is more than a new label.',sources:[s('Microsoft · Foundry evolution','https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry')]},
    movement:{date:'27 Aug 2026 · documentation update',title:'One management surface, with feature-level limits.',text:'Current guidance directs new investment toward Foundry projects in the new portal. Some observability and enterprise capabilities remain in preview.',implication:'Compound’s reading: check the chosen deployment and feature status. “Available in Foundry” is not a blanket production-readiness statement.',sources:[s('Microsoft · current Foundry guidance','https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry')]},
    tradeoff:'Model breadth can coexist with deep Azure dependence in identity, state and operations. Check which controls cover external tools.',
    watch:'Whether the unified resource model simplifies operating a real agent across permissions, tracing and upgrades.',
  },
  {
    id:'google',name:'Google',product:'Gemini Enterprise Agent Platform',categories:['enterprise-ai'],group:'hyperscaler',accent:'#356BB3',monogram:'G',terms:['Google Cloud','Vertex AI','Gemini Enterprise','Agent Development Kit','ADK','Model Garden'],
    thesis:'Combine model development, an agent runtime and an enterprise distribution surface inside the Google Cloud relationship.',
    strengths:['Access to Google and third-party models through Model Garden.','Agent building and execution with state, memory and runtime services.','Agent identity, registry and gateway capabilities for enterprise operation.'],
    productSource:s('Google Cloud · Agent Platform','https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform'),
    origin:{text:'Google describes Gemini Enterprise Agent Platform as the evolution of Vertex AI, carrying forward model selection, model building and agent development.',sources:[s('Google Cloud · Vertex AI lineage','https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform')]},
    movement:{date:'22 Apr 2026',title:'Vertex AI’s roadmap moves into Agent Platform.',text:'Google announced that future Vertex AI services and roadmap evolution would be delivered through Agent Platform rather than a standalone Vertex AI service.',implication:'Compound’s reading: older product names remain useful search terms, while migration and feature parity become part of the buying question.',sources:[s('Google Cloud · roadmap announcement','https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform')]},
    tradeoff:'The model catalogue, agent runtime and employee-facing Gemini app are related surfaces with different responsibilities. Confirm exact region and feature support.',
    watch:'How existing Vertex AI workloads transition and whether agent identity governs the full tool chain.',
  },
  {
    id:'aws',name:'AWS',product:'Bedrock · SageMaker · AgentCore',categories:['enterprise-ai'],group:'hyperscaler',accent:'#975B20',monogram:'aws',terms:['Amazon Web Services','Amazon Bedrock','SageMaker','AgentCore','cross-region inference'],
    thesis:'Give an existing AWS estate paths from managed model calls to custom ML and governed agent operation.',
    strengths:['Bedrock supplies managed models and application primitives.','SageMaker supports the custom ML development path.','Unified Studio brings selected data and AI capabilities into a shared project environment.'],
    productSource:s('AWS · Unified Studio scope','https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-sagemaker-unified-studio-generally-available/'),
    origin:{text:'Bedrock and SageMaker serve different needs. The March 2025 launch of SageMaker Unified Studio brought selected Bedrock capabilities together with existing analytics and ML tools.',sources:[s('AWS · Unified Studio launch','https://aws.amazon.com/about-aws/whats-new/2025/03/amazon-sagemaker-unified-studio-generally-available/')]},
    movement:{date:'Sep 2026 · operating distinction',title:'The inference profile controls where work can go.',text:'Bedrock distinguishes geographic from global cross-region inference. Profiles define both the model and the regions to which requests can be routed.',implication:'Compound’s reading: an Australian source region is insufficient evidence of Australian processing. Read the destination list for the exact profile.',sources:[s('AWS · cross-region inference rules','https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html')]},
    tradeoff:'A shared console does not collapse every service boundary. Models, regions, agent services and capacity modes need separate checks.',
    watch:'Which regional model and agent features are available for the actual workload, including fallback routing.',
  },
  {
    id:'databricks',name:'Databricks',product:'Agent Bricks · Model Serving · Unity Catalog',categories:['enterprise-ai','ai-inference'],group:'data-platform',accent:'#B43E2E',monogram:'D',terms:['Mosaic AI','MosaicML','Neon','Lakebase','Unity Catalog','MLflow','Agent Bricks'],
    thesis:'Make the governed data estate the foundation for training, grounding, evaluating and operating AI.',
    strengths:['Prepare data and connect retrieval to its source.','Serve and evaluate agents, generative models and classical ML.','Apply governance and lineage through the existing data platform.'],
    productSource:s('Databricks · AI platform','https://www.databricks.com/product/artificial-intelligence'),
    origin:{text:'The MosaicML acquisition completed in July 2023, adding model-training capability to Databricks’ data platform. The deal connected a model-systems team to an established enterprise data relationship.',sources:[s('Databricks · MosaicML completion announcement','https://www.prnewswire.com/news-releases/databricks-completes-acquisition-of-mosaicml-301881059.html')]},
    movement:{date:'14 May 2025 · announced',title:'The platform also wants application state.',text:'Neon’s founders announced a new chapter with Databricks, connecting serverless Postgres to the broader platform direction.',implication:'Compound’s reading: agents need transactional state as well as analytics and models. That widens the platform’s claim on the application stack.',sources:[s('Neon founders · Databricks announcement','https://neon.com/blog/neon-and-databricks')]},
    tradeoff:'The strongest fit depends on where the useful data and operating skills already sit. A data-platform footprint is not proof that every inference feature runs in that region.',
    watch:'Whether governance and evaluation stay coherent as agents combine lakehouse data, transactional state and outside model endpoints.',
  },
  {
    id:'snowflake',name:'Snowflake',product:'Cortex AI · Agents · Search',categories:['enterprise-ai'],group:'data-platform',accent:'#2476A0',monogram:'S',terms:['Cortex','Neeva','Sridhar Ramaswamy','AI_COMPLETE','AI SQL','data cloud'],
    thesis:'Bring AI to the people and permissions already working with enterprise data, starting with familiar SQL and governed access.',
    strengths:['Invoke AI functions from SQL and Python over enterprise content.','Use task-specific extraction, classification and embedding functions.','Control function access through Snowflake privileges and roles.'],
    productSource:s('Snowflake · Cortex AI functions','https://docs.snowflake.com/en/user-guide/snowflake-cortex/aisql'),
    origin:{text:'Neeva co-founder Sridhar Ramaswamy joined Snowflake through its 2023 acquisition, led the launch of Cortex, and became CEO in February 2024. Acquired capability also changed company leadership.',sources:[s('Snowflake · leadership and Neeva lineage','https://www.snowflake.com/en/news/press-releases/sridhar-ramaswamy-named-chief-executive-officer-of-snowflake/')]},
    movement:{date:'Sep 2026 · regional snapshot',title:'Account location and model location remain distinct.',text:'Cortex publishes function-by-function and model-by-model regional availability, including a native Sydney subset and separate cross-region guidance.',implication:'Compound’s reading: check the exact model and feature. Neither “Snowflake is in Australia” nor “Cortex is available” establishes local processing for every request.',sources:[s('Snowflake · model and regional availability','https://docs.snowflake.com/en/user-guide/snowflake-cortex/aisql-regional-availability')]},
    tradeoff:'Convenient SQL access can obscure inference routing and consumption. Inspect both the data permission and the model execution path.',
    watch:'Regional support for the models customers actually choose, and whether AI makes governed data easier to use without weakening its access boundaries.',
  },
  {
    id:'coreweave',name:'CoreWeave',product:'GPU cloud · Kubernetes · Weights & Biases',categories:['enterprise-ai'],group:'gpu-cloud',accent:'#344E73',monogram:'CW',terms:['Weights & Biases','W&B','Michael Intrator','GPU cloud','Indonesia'],
    thesis:'Move from supplying accelerated capacity toward owning more of the model-development and operating workflow.',
    strengths:['Purpose-built accelerated compute for training and inference.','Cloud infrastructure and orchestration around GPU workloads.','Weights & Biases adds model development, tracking and evaluation tooling.'],
    productSource:s('CoreWeave · platform documentation','https://docs.coreweave.com/'),
    origin:{text:'CoreWeave completed its acquisition of Weights & Biases on 5 May 2025. The announcement names Michael Intrator as CoreWeave CEO and Lukas Biewald as the acquired company’s co-founder.',sources:[s('CoreWeave · completed Weights & Biases acquisition','https://investors.coreweave.com/news/news-details/2025/CoreWeave-Completes-Acquisition-of-Weights--Biases/default.aspx')]},
    movement:{date:'Aug 2026 · announced',title:'APAC expansion is a plan with a location.',text:'CoreWeave announced its first move into Asia-Pacific through a Greater Jakarta development in Indonesia. The release describes future capacity, not Australian hosting.',implication:'Compound’s reading: distinguish a planned regional expansion from capacity that an ANZ buyer can use today.',sources:[s('CoreWeave · Indonesia expansion announcement','https://investors.coreweave.com/news/news-details/2026/CoreWeave-Expands-Cloud-AI-Platform-to-Indonesia-Marking-First-Move-Into-Asia-Pacific-Region/default.aspx')]},
    tradeoff:'GPU capacity and ML tooling do not automatically provide the identity, data governance and operating model of an enterprise application platform.',
    watch:'Delivery of announced capacity and whether the acquired developer tools remain useful across infrastructure providers.',
  },
];

export const researchCompany = (id: string) => RESEARCH_COMPANIES.find(c => c.id === id);
export const researchCategory = (id: string) => RESEARCH_CATEGORIES.find(c => c.id === id);
export const companiesInResearch = (id: ResearchCategoryId) => RESEARCH_COMPANIES.filter(c => c.categories.includes(id));
