// Example posts. Add/modify as needed.
const blogPosts = [
  {
    id: 'opening-doors-free-coaching',
    date: '2025-02-15',
    category: 'community',
    title: 'Opening Doors: 30+ Free Coaching Calls for Aspiring AI Professionals',
    emoji: '🤝',
    summary: 'Over 30 free 15‑minute coaching calls for students and fresh grads worldwide—focused, practical guidance without paywalls.',
    tags: ['Career','Mentorship','Coaching','Community','AI','Education'],
    metrics: { calls: '30+', duration: '15 min', cadence: 'Mon/Fri' },
    content: `
      <p>Six months ago, after many messages asking for career advice from my path through Apple, TikTok, Meta, Uber, and McKinsey, I realized individual replies weren’t scalable. The solution was simple: open my calendar and offer free 15‑minute coaching slots on Monday and Friday mornings and evenings (GMT).</p>

      <h3>Challenge</h3>
      <p>Capable candidates—especially from underrepresented socioeconomic backgrounds—often lack informal networks and actionable guidance. Paid “AI coaching” services are expensive and frequently low‑quality.</p>

      <h3>Solution</h3>
      <p>I ran free, bookable coaching calls (15 minutes each) for students and recent graduates worldwide, prioritizing those without access to established networks.</p>

      <h3>What We Covered</h3>
      <ul>
        <li><strong>CV diagnostics</strong>: why applications stall and immediate fixes</li>
        <li><strong>Role navigation</strong>: ML Engineer vs Data Scientist vs Research Scientist</li>
        <li><strong>Project prioritization</strong>: which projects to highlight for target roles</li>
        <li><strong>Interview preparation</strong>: patterns unique to ML/DS interviews</li>
        <li><strong>Academia vs industry</strong>: trade‑offs and long‑term implications</li>
      </ul>

      <h3>Results</h3>
      <ul>
        <li>Over <strong>30 coaching calls</strong> delivered</li>
        <li>Participants reported <strong>interviews</strong> and <strong>job offers</strong> following CV and positioning changes</li>
        <li>Confidence gains—clearer roadmaps and next steps</li>
      </ul>

      <h3>Why Free Matters</h3>
      <p>I took a clear stance against paywalled advice. Career guidance should not be a luxury good; those who need it most can rarely afford it.</p>

      <h3>Moving Forward</h3>
      <p>While I can’t sustain this intensity indefinitely, the recurring patterns now inform broader, open resources and guides tackling the most common challenges.</p>

      <h3>Call to Peers</h3>
      <p>If you’re in a senior role, consider opening even a small portion of your calendar for free coaching. A few hours per month across our field could meaningfully diversify who gets in—and who thrives.</p>

      <hr />
      <p><a href="programs.html">Explore our Programs</a> · <a href="contact.html">Have questions? Reach out</a></p>
    `,
    links: [
      { text: 'Explore Programs', url: 'programs.html', type: 'demo' },
      { text: 'Contact', url: 'contact.html', type: 'demo' }
    ]
  },
  {
    id: 'adaptive-entropy-gated-contrastive-fusion',
    date: '2025-05-25',
    category: 'papers',
    title: 'Adaptive Entropy‑Gated Contrastive Fusion (AECF): Robust, Calibrated Multimodal Inference with Missing Inputs',
    emoji: '🧩',
    summary: 'AECF is a light‑weight fusion layer that adapts entropy per instance, enforces monotone calibration across modality subsets, and yields big masked‑input gains with frozen backbones.',
    tags: ['Multimodal','Fusion','Calibration','Robustness','Entropy','Contrastive','AECF'],
    metrics: { datasets: 'AV‑MNIST, MS‑COCO', ece: '↓ up to 2×', overhead: '<1%' },
    content: `
      <h3>Challenge</h3>
      <p>Real‑world multimodal systems routinely face missing‑input scenarios (e.g., a robot loses audio; a clinical record omits labs at inference). Standard fusion layers typically preserve either <em>robustness</em> or <em>calibration</em>—but rarely both.</p>

      <h3>Solution: AECF</h3>
      <p><strong>Adaptive Entropy‑Gated Contrastive Fusion (AECF)</strong> is a single, light‑weight layer that:</p>
      <ul>
        <li>(i) adapts its entropy coefficient <em>per instance</em>,</li>
        <li>(ii) enforces <strong>monotone calibration</strong> across all modality subsets, and</li>
        <li>(iii) drives a curriculum mask directly from <em>training‑time entropy</em>.</li>
      </ul>

      <h3>Results</h3>
      <ul>
        <li>On <strong>AV‑MNIST</strong> and <strong>MS‑COCO</strong>, AECF improves masked‑input <strong>mAP by +18 pp</strong> at a <strong>50% drop</strong> rate,</li>
        <li>while reducing <strong>ECE</strong> by up to <strong>2&times;</strong>,</li>
        <li>with &lt;1% runtime overhead.</li>
      </ul>

      <h3>Compatibility</h3>
      <p>All backbones remain <em>frozen</em>, making AECF an easy drop‑in layer for robust, calibrated multimodal inference under missing inputs.</p>

      <h3>Notes</h3>
      <p>We analyze per‑subset calibration guarantees and show instance‑wise entropy gating yields both resilience to missing modalities and improved uncertainty estimates.</p>
    `,
    links: [
      { text: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2505.15417', type: 'paper' }
    ]
  },
  {
    id: 'llms-bayesian-in-expectation',
    date: '2025-07-20',
    category: 'papers',
    title: 'LLMs are Bayesian, in Expectation, not in Realization',
    emoji: '📄',
    summary: 'Announcing our preprint: transformers achieve near‑Bayesian risk on average, optimal chain‑of‑thought grows with sqrt(n), and external CoT is fundamental.',
    tags: ['Theory','Bayesian','LLM','Transformers','ChainOfThought','Research'],
    metrics: { result_rate: 'near-optimal (n^-1/2)', cot_scaling: 'sqrt(n)' },
    content: `
      <p>After a lot of money wasted on API calls, I am proud to announce our new preprint: <strong>LLMs are BAYESIAN (in Expectation, not Realisation)</strong>.</p>

      <h3>Key Takeaways</h3>
      <ol>
        <li><strong>Transformers are Bayesian — but only on average.</strong> They can violate martingale rules (prompt token exchangeability) by design. We prove the gap shrinks as log(n)/n, and in expectation, models hit near‑optimal risk (n^-1/2). Practical tip: average predictions over shuffled prompts to reduce variance without retraining.</li>
        <li><strong>Cut chain‑of‑thought tokens, cut costs.</strong> Our closed‑form result shows optimal CoT length grows only with sqrt(n), not linearly. Many users overspend on tokens by 80–90%. Shorter, principled chains retain performance efficiently.</li>
        <li><strong>G&ouml;del, incompleteness, and why CoT is essential.</strong> No finite transformer computes everything internally; with an <em>external</em> chain‑of‑thought sized to task complexity, anything computable becomes reachable. CoT prompting is a fundamental ingredient for next‑gen LLMs.</li>
      </ol>

      <h3>Acknowledgments</h3>
      <p>Huge thanks to the team helping with empirical validation and coding: Zein Khamis, Sarah Rashidi. Grateful to Mark Antonio and Moustapha Awada, Ph.D., for collaborating on LLM theory and checking the many proofs.</p>

      <h3>Call for Feedback</h3>
      <p>Would love feedback from others working at the theory‑practice boundary. Please read the preprint and share thoughts.</p>
    `,
    links: [
      { text: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2507.11768', type: 'paper' }
    ]
  },
  {
    id: 'ai-career-guidance-ucl-2024',
    date: '2024-11-20',
    category: 'community',
    title: 'Bridging Academia and Industry: AI Career Guidance at UCL',
    emoji: '🎓',
    summary: 'Sharing practical AI career strategies with UCL students across disciplines—internships secured, successful transitions into AI roles, and clearer roadmaps from campus to industry.',
    tags: ['University','UCL','Education','AI','MachineLearning','Career','Mentorship','Workshops'],
    metrics: { attendees: '—', internships: 'many', transitions: 'several' },
    content: `
      <p>In November 2024, I shared AI career advice with students at UCL, one of the UK’s leading universities. The room brought together computer science, engineering, humanities, and social sciences—each with unique perspectives and questions about entering the AI field.</p>

      <figure>
        <img src="assets/AI_UCL.jpg" alt="AI career guidance seminar at UCL" style="width:100%;border-radius:12px;" />
        <figcaption>UCL seminar: interdisciplinary perspectives on AI careers.</figcaption>
      </figure>

      <h3>Challenge</h3>
      <p>Students from non‑traditional backgrounds often feel shut out of AI. They lack a clear path to showcase strengths, earn internships, and translate academic work into industry‑ready impact.</p>

      <h3>Solution</h3>
      <p>A practical, strategy‑first seminar bridging academia and industry. We tailored guidance to stages from first‑year exploration to final‑year job searches, with concrete steps and examples.</p>

      <h3>Results</h3>
      <ul>
        <li><strong>Competitive internships secured</strong> at startups and established companies</li>
        <li><strong>Successful transitions</strong> into AI roles from non‑CS disciplines</li>
        <li><strong>Confidence and clarity</strong>—students left with realistic roadmaps</li>
      </ul>

      <h3>Key Topics We Explored</h3>
      <ul>
        <li><strong>Leveraging academic projects</strong>: turn coursework/research into portfolio pieces</li>
        <li><strong>The internship strategy</strong>: target roles aligned to goals; stand‑out applications</li>
        <li><strong>Building while studying</strong>: contribute to open source alongside coursework</li>
        <li><strong>The non‑linear path</strong>: realistic timelines for non‑CS backgrounds</li>
      </ul>

      <h3>Breaking Down Barriers</h3>
      <p>We addressed imposter syndrome head‑on, showing how diverse perspectives—ethics, linguistics, psychology, economics—are strengths that the AI field needs.</p>

      <h3>The Academic Advantage</h3>
      <p>University access to research, networks, compute, and freedom to experiment is a real advantage. We focused on how to leverage it effectively.</p>

      <h3>Resources That Keep Giving</h3>
      <p>All materials remain freely available online and are designed to complement studies—templates, project ideas, and step‑by‑step guides.</p>

      <h3>Reflection</h3>
      <p>The next generation of AI innovators won’t come from CS alone—they’ll emerge from philosophy, linguistics, psychology, and beyond. Many students who doubted their place in AI left with internships, roles, and renewed confidence.</p>

      <hr />
      <p><a href="programs.html">Explore our Programs</a> · <a href="contact.html">Have questions? Reach out</a></p>
    `,
    links: [
      { text: 'Explore Programs', url: 'programs.html', type: 'demo' },
      { text: 'Contact', url: 'contact.html', type: 'demo' }
    ]
  },
  {
    id: 'ai-education-lebanon-2024',
    date: '2024-12-10',
    category: 'community',
    title: 'AI Education for Underrepresented Students in Lebanon',
    emoji: '🇱🇧',
    summary: 'A December 2024 seminar in Lebanon helped students from underrepresented backgrounds secure job offers, master’s admissions, referrals, and even co‑authorships on NeurIPS‑aimed papers.',
    tags: ['Community','Education','Lebanon','AI','MachineLearning','Workshops','Career','Mentorship'],
    metrics: { participants: '30', job_offers: 'several', masters_offers: 'multiple', coauthors: '2' },
    content: `
      <p>In December 2024, I conducted an AI careers seminar in Lebanon specifically designed for students from underrepresented backgrounds. What transpired far exceeded expectations and reinforced a simple truth: talent exists everywhere; opportunity unlocks it.</p>

      <figure>
        <img src="assets/AI_Leb_1.jpg" alt="AI seminar with students in Lebanon" style="width:100%;border-radius:12px;" />
        <figcaption>Lebanon seminar: shared learning, shared goals.</figcaption>
      </figure>

      <h3>Challenge</h3>
      <p>Economic and social barriers often limit access to tech careers. Without networks or funding, many capable students lack clear paths into AI and modern ML practice.</p>

      <h3>Solution</h3>
      <p>A public, free seminar focused on practical, actionable steps into AI careers—paired with an open set of resources so learning continues beyond the room.</p>
      <ul>
        <li>CV tailoring for each role (no generic spray‑and‑pray)</li>
        <li>Meaningful GitHub contributions that signal real impact</li>
        <li>Clear pathways for entry, regardless of current background</li>
      </ul>

      <h3>Results</h3>
      <ul>
        <li><strong>Job offers secured:</strong> Several participants broke into AI roles</li>
        <li><strong>Academic advancement:</strong> Multiple master’s offers</li>
        <li><strong>Networks expanded:</strong> Referrals and mentorship connections</li>
        <li><strong>Research excellence:</strong> Two students now co‑authors on papers in preparation for NeurIPS</li>
      </ul>

      <figure>
        <img src="assets/AI_Leb_2.jpg" alt="Hands-on guidance during the Lebanon seminar" style="width:100%;border-radius:12px;" />
        <figcaption>Hands‑on guidance: practical steps, real outcomes.</figcaption>
      </figure>

      <h3>Why This Matters</h3>
      <p>These outcomes represent turning points in real lives. In regions where barriers to tech are structural, free, high‑quality AI education is a form of social justice—and a way to bring vital perspectives into the field.</p>

      <h3>Open Access</h3>
      <p>All materials remain freely available online, ensuring that knowledge continues to benefit anyone who needs it—attendees and beyond.</p>

      <hr />
      <p><a href="programs.html">Explore our Programs</a> · <a href="contact.html">Have questions? Reach out</a></p>
    `,
    links: [
      { text: 'Explore Programs', url: 'programs.html', type: 'demo' },
      { text: 'Contact', url: 'contact.html', type: 'demo' }
    ]
  },
  {
    id: 'democratizing-ai-careers-seminar',
    date: '2025-08-29',
    category: 'community',
    title: 'Democratizing AI Careers: Reflections on Our Recent Public Seminar',
    emoji: '🎤',
    summary: 'Highlights from our London AI careers seminar—40+ attendees, an open e-learning platform, and practical paths into AI for all backgrounds.',
    tags: ['Career','Community','Mentorship','AI','MachineLearning','Workshops'],
    metrics: { attendees: '40+', city: 'London' },
    content: `
      <p>Two months ago, I had the privilege of hosting an AI careers seminar in London that reinforced my belief in making machine learning education accessible to everyone. With over 40 attendees from diverse backgrounds, the event exceeded my expectations and sparked meaningful conversations about breaking into the AI field.</p>

      <figure>
        <img src="assets/AIGroupPhoto.jpg" alt="Group photo from the AI careers seminar" style="width:100%;border-radius:12px;" />
        <figcaption>Community at the center: a full room of curious minds.</figcaption>
      </figure>

      <h3>Challenge</h3>
      <p>AI career advice is scattered, inequitable, and often locked behind paywalls or networks. Many aspiring practitioners don't know where to start or how to demonstrate real capability.</p>

      <h3>Solution</h3>
      <p>We hosted a public seminar and launched an open e‑learning platform (3,000+ LOC) so attendees could continue learning beyond the event—structured pathways, resources, and practical guidance available to all.</p>

      <figure>
        <img src="assets/AI1.jpg" alt="Seminar slide: AI careers roadmap" style="width:100%;border-radius:12px;" />
        <figcaption>Roadmap: skills, projects, and portfolio building.</figcaption>
      </figure>

      <h3>Results</h3>
      <ul>
        <li>40+ attendees across backgrounds; ongoing engagement post‑event</li>
        <li>Reusable platform to guide CVs, projects, and contributions</li>
        <li>Growing community—mentorship and peer accountability</li>
      </ul>

      <h3>Key Takeaways</h3>
      <p><strong>The CV optimization trap</strong>: The spray‑and‑pray approach of generic resumes doesn’t work; tailoring matters.</p>
      <p><strong>Meaningful GitHub contributions</strong>: Target issues that create real value; quality over volume.</p>
      <p><strong>On‑ramps for all backgrounds</strong>: Practical, staged pathways for beginners and transitioners alike.</p>

      <figure>
        <img src="assets/AI2.jpg" alt="Interactive Q&A during the AI seminar" style="width:100%;border-radius:12px;" />
        <figcaption>Interactive Q&A: career paths, skills, and strategy.</figcaption>
      </figure>

      <h3>Open Access for All</h3>
      <p>All materials remain freely available. Machine learning shouldn’t be a lever reserved for the well‑connected—diverse perspectives strengthen the field.</p>

      <h3>Thank You</h3>
      <p>To every attendee: your questions, insights, and enthusiasm made the event special.</p>

      <h3>Moving Forward</h3>
      <p>The conversation continues. Explore resources, join our programs, and reach out with questions.</p>

      <hr />
      <p><em>Interested in the materials?</em> <a href="#" target="_blank" rel="noopener">Link to resources</a> · <a href="programs.html">Explore our Programs</a> · <a href="contact.html">Have questions? Reach out</a>.</p>
    `,
    links: [
      { text: 'Explore Programs', url: 'programs.html', type: 'demo' },
      { text: 'Contact', url: 'contact.html', type: 'demo' }
    ]
  },
  {
    id: 'near-zero-hallucination-linkedin',
    date: '2025-08-29',
    category: 'research',
    title: 'Achieving Near-Zero Hallucination in AI: A Practical Approach to Trustworthy Language Models',
    emoji: '🎯',
    summary: 'We\'ve developed a framework that achieves 0% hallucination rate on our benchmark—evidence-grounded answers, calibrated confidence, and graceful refusal when unsure.',
    tags: ['AI', 'MachineLearning', 'ResponsibleAI', 'NLP', 'TechInnovation', 'OpenSource'],
    metrics: { accuracy: '80.5%', improvement: '54%', citations: '82%', refusal_rate: '24%' },
    content: `
      <h3>Challenge</h3>
      <p>LLMs can produce confident but incorrect outputs (hallucinations), making them risky in settings where factual accuracy is required.</p>

      <h3>Solution</h3>
      <p>We trained models and tooling to:</p>
      <ul>
        <li>✅ Provide <strong>evidence-grounded answers</strong> with explicit citations</li>
        <li>✅ Express <strong>calibrated confidence levels</strong> (0–1 scale)</li>
        <li>✅ Know when to say <em>“I don't know”</em> when evidence is insufficient</li>
      </ul>

      <h3>Results</h3>
      <ul>
        <li>📈 <strong>54% improvement</strong> in accuracy (80.5% exact match vs 52.3% baseline)</li>
        <li>🎯 <strong>0% hallucination rate</strong> through calibrated refusal</li>
        <li>🔍 <strong>82% citation correctness</strong> (models show their work)</li>
        <li>🛡️ <strong>24% refusal rate</strong> when evidence is lacking (better safe than sorry!)</li>
      </ul>

      <h3>Details</h3>
      <p><strong>What Makes This Different:</strong> Instead of hiding uncertainty in fluent prose, we enforce <strong>structured JSON outputs</strong> that create accountability. When the model isn't sure, it explicitly refuses rather than making things up.</p>

      <p><strong>Interesting Finding:</strong> Under noisy/cluttered contexts, the model maintains answer quality but sometimes cites the wrong sources—identifying the next challenge to solve!</p>

      <h4>Open Resources</h4>
      <ul>
        <li>• Training code & configs</li>
        <li>• 1,198 preference pairs for reproduction</li>
        <li>• DeBERTa reward model (97.4% accuracy)</li>
        <li>• Complete evaluation framework</li>
      </ul>

      <p>This work represents a practical step toward AI systems that are not just powerful, but genuinely <strong>trustworthy</strong> for real-world applications where factual accuracy is non‑negotiable.</p>

      <p><strong>What strategies is your team using to improve AI reliability?</strong> Would love to hear about different approaches to this critical challenge!</p>

      <p>#AI #MachineLearning #ResponsibleAI #NLP #TechInnovation #OpenSource</p>
    `,
    links: [
      { text: 'Data (Hugging Face)', url: 'https://huggingface.co/datasets/leochl/gemma2-citation-preferences', type: 'data' },
      { text: 'GitHub Repository', url: 'https://github.com/leochlon/factuality-slice', type: 'code' },
      { text: 'Paper (Technical Report)', url: 'https://github.com/leochlon/factuality-slice/blob/main/Technical%20Report.pdf', type: 'paper' }
    ]
  },
  {
    id: 'super-enhancer-pipeline',
    date: '2025-08-29',
    category: 'research',
    title: 'Computational Pipeline for Precision Oncology via Super‑Enhancer Addiction',
    emoji: '🧬',
    summary: 'Open-source bioinformatics pipeline to identify therapeutic vulnerabilities by analyzing super‑enhancer addiction patterns and predicting repurposable drugs.',
    tags: ['Bioinformatics','PrecisionMedicine','DrugDiscovery','ComputationalBiology','CancerResearch','OpenScience','SuperEnhancers','Genomics'],
    metrics: { cancers_supported: '4+', reproducibility: 'Configurable', integration: 'TCGA/CLUE' },
    content: `
      <h3>Challenge</h3>
      <p>Oncology needs practical ways to uncover therapeutic vulnerabilities that go beyond mutations—capturing regulatory dependencies that tumors develop.</p>

      <h3>Solution</h3>
      <p>An open bioinformatics pipeline that identifies <em>super‑enhancer</em> addiction and predicts repurposable drugs by integrating multi‑omic signals:</p>
      <ul>
        <li>Calls super‑enhancers from H3K27ac ChIP‑seq with stitching</li>
        <li>Maps variants within regulatory regions using <em>gnomAD</em></li>
        <li>Computes <strong>addiction scores</strong> to quantify enhancer dependence</li>
        <li>Links enhancer activity to downstream gene expression signatures</li>
        <li>Queries <strong>CLUE</strong> to find FDA‑approved drugs reversing signatures</li>
      </ul>

      <h3>Results</h3>
      <ul>
        <li>Supports multiple cancers (ovarian, breast, lung, prostate)</li>
        <li>Integrations: cBioPortal (TCGA), optional AlphaGenome</li>
        <li>Runs locally or in the cloud; fully reproducible and configurable</li>
      </ul>

      <p>The pipeline addresses a key oncology challenge: identifying which patients might benefit from specific therapies based on the tumor <em>regulatory</em> landscape, not just mutations.</p>
      <p><em>Code available on GitHub (by request only).</em> Built with Python (pandas, numpy, statsmodels) for robust statistical analysis.</p>
      <p>#Bioinformatics #PrecisionMedicine #DrugDiscovery #ComputationalBiology #CancerResearch #OpenScience #SuperEnhancers #Genomics</p>
    `,
    links: [
      { text: 'Request GitHub Access', url: 'mailto:info@hassanalabs.org?subject=Super-Enhancer%20Pipeline%20Access', type: 'code' },
      { text: 'cBioPortal (TCGA)', url: 'https://www.cbioportal.org/', type: 'demo' },
      { text: 'CLUE Connectivity Map', url: 'https://clue.io', type: 'demo' }
    ]
  },
  {
    id: 'ml-workshops-gulf',
    date: '2024-09-03',
    category: 'community',
    title: 'ML Workshops for Gulf Women',
    emoji: '👩‍🏫',
    summary: 'Hands-on ML sessions tailored for newcomers with a focus on practical skills and mentorship.',
    tags: ['Community', 'Workshops'],
    metrics: { participants: '60+', sessions: '12', mentors: '6' },
    content: `
      <h3>Challenge</h3>
      <p>Beginners often lack accessible, supportive on‑ramps to ML—especially women in regions with fewer local opportunities.</p>
      <h3>Solution</h3>
      <p>A hands‑on curriculum with mentorship and practical projects tailored to true beginners.</p>
      <h3>Results</h3>
      <ul>
        <li>Participants: 60+</li>
        <li>Sessions: 12</li>
        <li>Mentors: 6</li>
      </ul>
    `,
    links: [
      { text: 'Slides', url: '#', type: 'slides' },
      { text: 'Video Recap', url: '#', type: 'video' }
    ]
  },
  {
    id: 'paper-invite',
    date: '2024-05-20',
    category: 'community',
    title: 'Call for Contributions: Inclusive AI Research',
    emoji: '🧪',
    summary: 'Inviting underrepresented researchers to collaborate on open AI safety benchmarks.',
    tags: ['Paper', 'OpenScience'],
    metrics: { submissions: '18', collaborators: '10' },
    content: `
      <h3>Challenge</h3>
      <p>Factuality and robustness benchmarks often lack diverse perspectives and open participation.</p>
      <h3>Solution</h3>
      <p>We’re inviting underrepresented researchers to co‑author an open benchmark effort.</p>
      <h3>Results</h3>
      <ul>
        <li>Submissions to date: 18</li>
        <li>Collaborators engaged: 10</li>
      </ul>
    `,
    links: [ { text: 'Submission Guide', url: '#', type: 'paper' } ]
  }
];

// Expose to BlogSystem (non-module environment)
window.blogPosts = blogPosts;
