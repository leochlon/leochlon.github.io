// Example posts. Add/modify as needed.
const blogPosts = [
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
      <p><strong>Excited to share our latest work</strong> on making AI systems more reliable and factual! We've developed a framework that achieves <strong>0% hallucination rate</strong> on our benchmark, a critical step toward trustworthy AI deployment.</p>

      <p><strong>The Challenge:</strong> Large language models often generate plausible-sounding but incorrect information, making them risky for production use where accuracy matters.</p>

      <p><strong>Our Solution:</strong> We trained models to:</p>
      <ul>
        <li>✅ Provide <strong>evidence-grounded answers</strong> with explicit citations</li>
        <li>✅ Express <strong>calibrated confidence levels</strong> (0–1 scale)</li>
        <li>✅ Know when to say <em>“I don't know”</em> when evidence is insufficient</li>
      </ul>

      <p><strong>Key Results:</strong></p>
      <ul>
        <li>📈 <strong>54% improvement</strong> in accuracy (80.5% exact match vs 52.3% baseline)</li>
        <li>🎯 <strong>0% hallucination rate</strong> through calibrated refusal</li>
        <li>🔍 <strong>82% citation correctness</strong> (models show their work)</li>
        <li>🛡️ <strong>24% refusal rate</strong> when evidence is lacking (better safe than sorry!)</li>
      </ul>

      <p><strong>What Makes This Different:</strong> Instead of hiding uncertainty in fluent prose, we enforce <strong>structured JSON outputs</strong> that create accountability. When the model isn't sure, it explicitly refuses rather than making things up.</p>

      <p><strong>Interesting Finding:</strong> Under noisy/cluttered contexts, the model maintains answer quality but sometimes cites the wrong sources—identifying the next challenge to solve!</p>

      <p><strong>We\'ve open-sourced everything:</strong></p>
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
      <p><strong>Excited to share our new computational pipeline for precision oncology drug discovery!</strong></p>
      <p>We developed an open bioinformatics pipeline that identifies therapeutic vulnerabilities in cancer by analyzing <em>super‑enhancer</em> addiction patterns. The pipeline integrates multiple genomic layers to predict which existing drugs might be repurposed for specific cancer types.</p>
      <p><strong>How it works:</strong></p>
      <ul>
        <li>Identifies super‑enhancers from H3K27ac ChIP‑seq data using a stitching algorithm</li>
        <li>Maps genetic variants within these regulatory regions using <em>gnomAD</em> population data</li>
        <li>Calculates <strong>addiction scores</strong> quantifying dependence on specific enhancers</li>
        <li>Generates expression signatures linking enhancer activity to downstream gene regulation</li>
        <li>Queries the <strong>CLUE connectivity map</strong> to identify FDA‑approved drugs that reverse cancer‑specific signatures</li>
      </ul>
      <p><strong>Key features:</strong></p>
      <ul>
        <li>Supports multiple cancer types (ovarian, breast, lung, prostate)</li>
        <li>Integrates with cBioPortal for TCGA expression data</li>
        <li>Optional AlphaGenome integration for variant impact prediction</li>
        <li>Cloud‑based or local CLUE analysis</li>
        <li>Fully reproducible with configurable parameters</li>
      </ul>
      <p>The pipeline addresses a key oncology challenge: identifying which patients might benefit from specific therapies based on the tumor <em>regulatory</em> landscape, not just mutations. By focusing on super‑enhancers—regions cancer cells become <em>addicted</em> to—we can uncover novel therapeutic strategies.</p>
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
    id: 'zero-hallucination-ai',
    date: '2025-01-15',
    category: 'research',
    title: 'Achieving Near-Zero Hallucination in AI',
    emoji: '🎯',
    summary: "We've developed a framework that achieves 0% hallucination rate on our benchmark...",
    tags: ['AI', 'MachineLearning', 'NLP'],
    metrics: { accuracy: '80.5%', improvement: '54%', citations: '82%' },
    content: `
      <p>In this post we introduce our verification-driven decoding framework. It couples retrieval with lightweight reasoning checks. The full paper is under review; preprint coming soon.</p>
      <ul><li>Retrieval consistency checks</li><li>Reasoning graph pruning</li><li>Self-critique with external tools</li></ul>
    `,
    links: [
      { text: 'GitHub Repository', url: 'https://github.com/leochlon/factuality-slice', type: 'code' },
      { text: 'Read Paper', url: '#', type: 'paper' },
      { text: 'Demo', url: '#', type: 'demo' }
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
    content: `<p>We delivered a series of workshops across the Gulf focused on accessible ML education. Curricula and materials will be open-sourced.</p>`,
    links: [
      { text: 'Slides', url: '#', type: 'slides' },
      { text: 'Video Recap', url: '#', type: 'video' }
    ]
  },
  {
    id: 'paper-invite',
    date: '2024-05-20',
    category: 'papers',
    title: 'Call for Contributions: Inclusive AI Research',
    emoji: '🧪',
    summary: 'Inviting underrepresented researchers to collaborate on open AI safety benchmarks.',
    tags: ['Paper', 'OpenScience'],
    metrics: { submissions: '18', collaborators: '10' },
    content: `<p>We are assembling a diverse author group for an open benchmark focused on factuality and robustness.</p>`,
    links: [ { text: 'Submission Guide', url: '#', type: 'paper' } ]
  }
];

// Expose to BlogSystem (non-module environment)
window.blogPosts = blogPosts;
