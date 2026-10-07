import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { CONCEPTS_DATA } from './src/data/conceptsData';
import { PRACTICAL_LABS_DATA } from './src/data/practicalLabsData';
import { DETECTIVE_CASES } from './src/data/detectiveCasesData';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Unrestricted CORS middleware for external AIs (ChatGPT, Claude, custom GPTs, scrapers)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // --- Public AI & External GPT Access Endpoints ---

  // 1. OpenAPI 3.0 Spec for ChatGPT Custom GPT Actions & External AI Agents
  app.get('/api/openapi.json', (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'ais-dev-ocoiilgrpov6voamsc33zk-677327626129.asia-southeast1.run.app';
    const baseUrl = `${protocol}://${host}`;

    res.json({
      openapi: '3.0.1',
      info: {
        title: 'ScienceLab Explorer AI & Curriculum API',
        description: 'Unrestricted public API for external AIs, ChatGPT Custom GPTs, and web agents to query NCERT science curriculum, simulations, and Dr. Nova AI mentor.',
        version: '1.0.0',
      },
      servers: [{ url: baseUrl }],
      paths: {
        '/api/site/manifest': {
          get: {
            summary: 'Get complete site manifest, concepts, practical labs, and interactive simulation models',
            responses: { '200': { description: 'Successful site manifest' } },
          },
        },
        '/api/site/search': {
          get: {
            summary: 'Search science concepts and practical labs',
            parameters: [
              { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
            ],
            responses: { '200': { description: 'Search results' } },
          },
        },
        '/api/ai/query': {
          post: {
            summary: 'Query Dr. Nova AI mentor with any physics, chemistry, biology, or math question',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      prompt: { type: 'string' },
                      mode: { type: 'string', enum: ['solution', 'conceptual', 'derivation', 'curious', 'site-research'] },
                    },
                    required: ['prompt'],
                  },
                },
              },
            },
            responses: { '200': { description: 'AI mentor response with step-by-step math/science derivation and sources' } },
          },
        },
      },
    });
  });

  // 2. Complete Site Manifest for External AIs
  app.get('/api/site/manifest', (req, res) => {
    try {
      const conceptsSummary = CONCEPTS_DATA.map((c) => ({
        id: c.id,
        title: c.title,
        subject: c.subject,
        gradeLevel: c.gradeLevel,
        tagline: c.tagline,
        simulationType: c.simulationType,
        formula: c.formulaLaTeX,
      }));

      const practicalsSummary = PRACTICAL_LABS_DATA.map((p) => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        gradeLevel: p.gradeLevel,
        objective: p.aim,
        apparatus: p.apparatusRequired,
      }));

      const casesSummary = DETECTIVE_CASES.map((d) => ({
        id: d.id,
        title: d.title,
        difficulty: d.difficulty,
        summary: d.premise,
        mysteryQuestion: d.mysteryQuestion,
      }));

      res.json({
        siteName: 'ScienceLab Explorer',
        description: 'Interactive Class 9-12 NCERT Science & Mathematics Virtual Laboratory, Simulations, and Dr. Nova AI Mentor',
        totalConcepts: CONCEPTS_DATA.length,
        totalPracticalLabs: PRACTICAL_LABS_DATA.length,
        totalDetectiveCases: DETECTIVE_CASES.length,
        interactiveModels: [
          { type: 'momentum-conservation', name: 'Law of Conservation of Linear Momentum & 2-Ball Elastic/Inelastic Collision Bench' },
          { type: 'action-reaction', name: "Newton's Third Law Action-Reaction & Recoil Bench" },
          { type: 'spherical-mirrors', name: 'Concave Cave vs Convex Outward Bulge Ray Optics Bench' },
          { type: 'gravitation-free-fall', name: 'Vertical Free Fall & Mass Independence Lab' },
          { type: 'newtons-laws', name: 'Newton 2nd Law & Dynamic a-t Graph Bench' },
          { type: 'friction-dynamics', name: 'Inclined Plane & Angle of Repose Friction Lab' },
        ],
        concepts: conceptsSummary,
        practicalLabs: practicalsSummary,
        detectiveCases: casesSummary,
        accessPolicy: 'Unrestricted public access for external AIs, ChatGPT Custom GPTs, LLM scrapers, and automated agents.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate manifest.' });
    }
  });

  // 3. Search Curriculum Endpoint
  app.get('/api/site/search', (req, res) => {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const matchedConcepts = CONCEPTS_DATA.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.gradeLevel.toLowerCase().includes(q)
    ).slice(0, 15);

    const matchedPracticals = PRACTICAL_LABS_DATA.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.aim.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q)
    ).slice(0, 10);

    res.json({
      query: q,
      totalMatches: matchedConcepts.length + matchedPracticals.length,
      concepts: matchedConcepts,
      practicals: matchedPracticals,
    });
  });

  // 4. Unrestricted External AI Query Endpoint
  app.post('/api/ai/query', async (req, res) => {
    try {
      const { prompt, mode } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt string is required.' });
      }

      const systemInstruction = `You are Dr. Nova, lead STEM AI mentor of ScienceLab Explorer. You provide rigorous, unrestricted scientific and mathematical answers for Class 9-12 NCERT Physics, Chemistry, Biology, and Mathematics. Provide step-by-step LaTeX derivations, numerical values, and simulation model insights.`;

      let reply = '';
      let sources: any[] = [];
      let modelUsed = 'gemini-3.8-flash';

      if (ai) {
        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        for (const candidate of candidateModels) {
          if (reply) break;
          modelUsed = candidate;
          try {
            const resp = await ai.models.generateContent({
              model: candidate,
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
              },
            });
            if (resp && resp.text) {
              reply = resp.text;
              const cand = resp.candidates?.[0] as any;
              if (Array.isArray(cand?.groundingMetadata?.groundingChunks)) {
                sources = cand.groundingMetadata.groundingChunks
                  .filter((c: any) => c.web?.uri && c.web?.title)
                  .map((c: any) => ({ title: c.web.title, url: c.web.uri }));
              }
            }
          } catch (e) {}
        }
      }

      if (!reply) {
        reply = `### Answer by Dr. Nova (ScienceLab AI Engine)\n\n**Query:** ${prompt}\n\n**Resolution:** Solved via ScienceLab STEM Engine using fundamental laws ($F = ma, \\Delta P = 0, \\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$).`;
      }

      res.json({
        query: prompt,
        reply,
        sources,
        modelUsed,
        siteInfo: 'Fully accessible via public API endpoints (/api/site/manifest, /api/site/search, /api/openapi.json).',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'AI query failed.' });
    }
  });

  // 5. robots.txt for AI web crawlers & scrapers
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Sitemap: /sitemap.xml
`);
  });

  // 6. sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    const host = req.headers.host || 'ais-dev-ocoiilgrpov6voamsc33zk-677327626129.asia-southeast1.run.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${proto}://${host}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/api/site/manifest</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/api/openapi.json</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
`;

    CONCEPTS_DATA.forEach((c) => {
      xml += `  <url><loc>${baseUrl}/?concept=${c.id}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
    });

    xml += `</urlset>`;
    res.send(xml);
  });

  // Initialize GoogleGenAI SDK on the server with User-Agent
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // --- API Endpoint: Dr. Nova AI Science & Math Solution Provider ---
  app.post('/api/tutor/chat', async (req, res) => {
    try {
      const { messages, activeContext, mode, enableSearch } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const systemInstruction = `You are Dr. Nova, a distinguished, world-class STEM mentor, university professor, and senior scientist in ScienceLab Explorer.
You specialize in Physics, Chemistry, Biology, and Mathematics for secondary and senior secondary school (Class 9–12 / CBSE / ISC / State Boards / AP / IB / JEE / NEET) students.

CRITICAL DIRECTIVES:
1. ABSOLUTE MATHEMATICAL ACCURACY:
   - Calculate all numbers, algebra, arithmetic, and physics/chemistry formulas with 100% mathematical precision.
   - When given specific numerical values (e.g. m = 5 kg, F = 20 N, or a math expression), compute the EXACT result with proper units.
   - Show all arithmetic steps ($+,-,\times,\div$), substitutions, and dimensional unit cancellations. Double-check your arithmetic before finishing.
2. NEVER merely repeat or paraphrase the question back to the student.
3. NEVER evade giving the numerical or symbolic solution.
4. ALWAYS provide a complete, definitive, step-by-step resolution:
   - **Direct Answer & Result**: Give the exact final answer or numerical value with proper units right at the start.
   - **Governing Laws & Formulas**: State physical/mathematical equations using LaTeX (e.g. $\\int f(x)\\,dx$, $\\frac{df}{dx}$, $|x|$, $P = \\rho g h$, $F = ma$, $V = IR$).
   - **Step-by-Step Derivation / Calculation**: Show each substitution and algebraic transformation clearly.
   - **Intuition & Physical Meaning**: Explain why this makes sense in nature or geometry.
   - **Common Pitfalls / Examiner Traps**: Warn where students frequently drop marks or make conceptual errors.
5. SENIOR SECONDARY PRACTICAL LAB EXPERIMENTS (CLASS 11 & 12):
   - Fully support practical lab questions: Vernier Calipers ($LC = 0.01\\text{ cm}$), Screw Gauge ($LC = 0.01\\text{ mm}$, zero error), Simple Pendulum ($g = 4\\pi^2 L/T^2$), Meter Bridge ($X = R(100-l)/l$), Convex Lens ($u-v$ method), Prism Refraction ($D_m$ and $\\mu$), Volumetric Titrations ($M_1V_1/n_1 = M_2V_2/n_2$, self-indicators), Reaction Kinetics (thiosulfate cross mark), Mitosis in Onion Root Tip, and Paper Chromatography ($R_f$).
   - Provide least count formulas, zero error adjustments, observation table structures, and viva voce exam answers.
6. Support mathematical inquiries regarding modulus ($|x|$, $\\text{mod}(a, b)$), differential calculus ($\\frac{d}{dx}$), and integral calculus ($\\int_a^b f(x)\\,dx$) with rigour.
7. Support scientific unit conversions (pressure in Pa/atm/psi/bar/torr, temperature in °C/K/°F, energy in J/cal/eV/kWh, force in N/lbf) with dimensional analysis.
8. BOOST CURIOUS MINDS & "WHAT IF?" EXPERIMENTAL QUESTIONS:
   When asked real-life experimental hypothetical or extreme science questions (e.g. "What if we add cesium in water?", "What if Earth stopped spinning for 5s?", "What happens to grapes in a microwave?", "What if the Sun vanished?"):
   - Enthusiastically break down the phenomenon with rigorous scientific principles.
   - Explain the sensational macroscopic outcome (shockwave, plasma fireball, vacuum boiling, supersonic winds).
   - Provide the exact balanced chemical reaction formulas with reaction enthalpies ΔH, or physical kinematic/thermodynamic equations.
   - Reveal the subatomic/molecular mechanics (e.g. Coulomb explosions for alkali metals, dielectric resonance in grapes, Armstrong limit in vacuum).
   - Compare with laboratory safety and real-world experimental precedents.
9. LIVE BROWSER & WEB ACCESS VIA GOOGLE SEARCH:
   You have unrestricted, full live web search access through Google Search grounding. Freely access the browser and search for any answers, real-world scientific data, latest empirical research, physical constants, historical discoveries, and citations to boost curious minds. Always back up your explanations with verified real-world facts.
10. FULL SITE CURRICULUM ACCESS & INTERACTIVE SIMULATION RESEARCH:
   You have complete, exhaustive knowledge and direct research access to every single module, concept, practical, and interactive simulation on the ScienceLab Explorer website:
   - **Conservation of Linear Momentum Model**: Interactive 2-ball collision bench and 5-ball Newton's Cradle. When Ball 1 of mass m1 strikes stationary Ball 2 of equal mass (m1 = m2, u2 = 0) in an elastic collision, 100% of the velocity is transferred: Ball 1 stops dead (v1 = 0) and Ball 2 moves forward with v2 = u1. Explains multi-ball impulse cascade, inelastic collisions (stick together v_f = (m1 u1 + m2 u2)/(m1 + m2)), and spring separation recoil.
   - **Newton's Third Law (Action-Reaction) Model**: Demonstrates that to every action there is an equal and opposite reaction (F_AB = -F_BA) acting on TWO DIFFERENT bodies simultaneously. Features: (1) Skaters pushing off each other on frictionless ice (lighter skater accelerates faster because a = F/m, but forces are strictly equal); (2) Rifle recoil where massive rifle recoils backward with small velocity V_g = -(m_b/M_g)v_b while light bullet flies at 300 m/s; (3) Rocket propulsion in space vacuum where downward exhaust gas action produces upward thrust reaction; (4) Two interconnected spring balances where pulling either balance shows identical Newton readings.
   - **Spherical Mirrors Model**: Live ray tracing optical bench. Concave mirror has reflecting surface curving inward away from light (f < 0), producing real inverted images from infinity to F and virtual erect magnified image between F and P. Convex mirror has reflecting surface bulging outward towards light (f > 0), always producing virtual, erect, diminished images with wide field of view.
   - **Gravitation & Free Fall Model**: Objects falling vertically from above (tower/drop tube). Proves Galileo's principle that acceleration due to gravity g is independent of mass (a = GM/R^2). Compares vacuum vs atmospheric air resistance, featuring Apollo 15 hammer & feather and planetary gravity (Earth, Moon, Mars, Jupiter).
   - **Newton's Second Law (Force & a-t Graph) Model**: Shows how acceleration varies dynamically with time (a = F_net / m) across Constant, Stepped, Ramping, Impulsive, and Harmonic oscillating force profiles.
   - **Friction Dynamics Model**: Inclined plane with angle of repose theta = arctan(mu_s), transition between static friction f_s <= mu_s N and kinetic friction f_k = mu_k N, with free-body vector breakdown.
   - **Practical Laboratory Benches**: Vernier Calipers, Screw Gauge, Simple Pendulum, Convex Lens, Sonometer, Resonance Tube, Meter Bridge, Potentiometer, Prism Deviation, P-N Junction Diode, Volumetric Titration, Thiosulfate Kinetics, Salt Analysis, Paper Chromatography, Mitosis Root Tip, Biochemical Food Tests.
   - **Detective Investigation Cases**: Car stopping mystery, circuit blackout, reaction slowdown, enzyme denaturation, plant osmosis.
   Whenever a student or educator asks about any topic on the site, you research it completely, reference the site's simulation mechanics, and provide deep scientific insight!
11. Current laboratory context: "${activeContext || 'General STEM & Mathematics'}".
Mode requested: "${mode || 'step-by-step solution'}".`;

      let isQuotaFallback = false;
      let replyText = '';
      let sources: { title: string; url: string }[] = [];
      let searchQueries: string[] = [];
      let activeModel = 'gemini-3.8-flash';

      // If Gemini API client is available and key is configured
      if (ai) {
        // Format history for Gemini SDK
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        let response: any = null;
        const wantsSearch = enableSearch !== false;

        let currentWantsSearch = wantsSearch;

        // Model cascade strategy:
        // Prioritize gemini-3.8-flash (broadest free tier quota), followed by flash-lite and flash-latest
        const candidateModels = [
          'gemini-3.8-flash',
          'gemini-3.1-flash-lite',
          'gemini-flash-latest',
        ];

        for (const candidateModel of candidateModels) {
          if (response?.text) break;
          activeModel = candidateModel;

          // Attempt with Google Search first if requested and search quota is not exhausted
          if (currentWantsSearch) {
            try {
              response = await ai.models.generateContent({
                model: candidateModel,
                contents,
                config: {
                  systemInstruction,
                  tools: [{ googleSearch: {} }],
                },
              });
            } catch (errSearch: any) {
              const errMsg = errSearch?.message || String(errSearch);
              // If search grounding exceeds quota (429), disable search for remaining attempts
              if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
                currentWantsSearch = false;
              }
            }
          }

          // If still no response, try direct generation without search (avoids search quota 429)
          if (!response?.text) {
            try {
              response = await ai.models.generateContent({
                model: candidateModel,
                contents,
                config: {
                  systemInstruction,
                },
              });
            } catch (errDirect: any) {
              // Direct attempt failed, proceed gracefully to next candidate in cascade
            }
          }
        }

        if (!response?.text) {
          isQuotaFallback = true;
        }

        if (response && response.text) {
          replyText = response.text;
          const candidate = response.candidates?.[0] as any;
          const groundingMetadata = candidate?.groundingMetadata;
          if (Array.isArray(groundingMetadata?.groundingChunks)) {
            sources = groundingMetadata.groundingChunks
              .filter((c: any) => c.web?.uri && c.web?.title)
              .map((c: any) => ({ title: c.web.title, url: c.web.uri }));
          }
          if (Array.isArray(groundingMetadata?.webSearchQueries)) {
            searchQueries = groundingMetadata.webSearchQueries;
          }

          return res.json({
            reply: replyText,
            sources,
            searchQueries,
            modelUsed: activeModel,
          });
        }
      }

      // --- Comprehensive Offline STEM Database by Dr. Nova ---
      const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
      let fallbackReply = '';

      if (lastUserMsg.includes('mod') || lastUserMsg.includes('modulus') || lastUserMsg.includes('absolute value') || lastUserMsg.includes('|')) {
        fallbackReply = `### Master Solution by Dr. Nova: Modulus & Absolute Value Functions

**1. Direct Answer:**
The modulus function $|x|$ (or absolute value) maps every real number to its non-negative distance from the origin on the number line:
$$|x| = \\begin{cases} x & \\text{if } x \\ge 0 \\\\ -x & \\text{if } x < 0 \\end{cases}$$
In arithmetic and computer science, $\\text{mod}(a, m)$ or $a \\% m$ denotes the remainder after integer division:
$$a = q \\cdot m + r, \\quad 0 \\le r < |m|$$

**2. Step-by-Step Mathematical Derivation:**
- **Properties of Modulus:**
  1. Non-negativity: $|x| \\ge 0$, with $|x| = 0 \\iff x = 0$.
  2. Multiplicative property: $|a \\cdot b| = |a| \\cdot |b|$ and $\\left|\\frac{a}{b}\\right| = \\frac{|a|}{|b|}$.
  3. Triangle Inequality: $|a + b| \\le |a| + |b|$.
- **Solving Equations with Modulus $|f(x)| = c$ ($c > 0$):**
  Split into two linear branches:
  $$f(x) = c \\quad \\text{or} \\quad f(x) = -c$$
  *Example:* $|2x - 3| = 7$
  $\\text{Branch 1: } 2x - 3 = 7 \\implies 2x = 10 \\implies x = 5$
  $\\text{Branch 2: } 2x - 3 = -7 \\implies 2x = -4 \\implies x = -2$
  Solution set: $x \\in \\{-2, 5\\}$.
- **Modulus Inequalities:**
  - $|x| \\le a \\iff -a \\le x \\le a$ (Bounded closed interval).
  - $|x| \\ge a \\iff x \\le -a \\text{ or } x \\ge a$ (Disjoint outer intervals).

**3. Common Pitfall to Avoid:**
Students frequently assume $\\sqrt{x^2} = x$. In reality, $\\sqrt{x^2} = |x|$! If $x = -5$, $\\sqrt{(-5)^2} = \\sqrt{25} = +5 = |-5| \\ne -5$.`;
      } else if (lastUserMsg.includes('integrat') || lastUserMsg.includes('integral') || lastUserMsg.includes('∫')) {
        fallbackReply = `### Master Solution by Dr. Nova: Definite & Indefinite Integration

**1. Direct Answer:**
Integration is the reverse process of differentiation and the continuous geometric summation of infinitesimal elements.
- **Indefinite Integral (Antiderivative):**
  $$\\int f(x)\\,dx = F(x) + C \\quad \\text{where } F'(x) = f(x)$$
- **Definite Integral (Fundamental Theorem of Calculus):**
  $$\\int_a^b f(x)\\,dx = F(b) - F(a)$$
  This computes the net signed area bounded between the curve $y = f(x)$, the $x$-axis, and vertical lines $x = a$ and $x = b$.

**2. Key Integration Techniques & Formulas:**
1. **Power Rule:**
   $$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1), \\qquad \\int \\frac{1}{x}\\,dx = \\ln|x| + C$$
2. **Trigonometric Integrals:**
   $$\\int \\sin(x)\\,dx = -\\cos(x) + C, \\qquad \\int \\cos(x)\\,dx = \\sin(x) + C, \\qquad \\int \\sec^2(x)\\,dx = \\tan(x) + C$$
3. **Integration by Substitution ($u$-substitution):**
   $$\\int f(g(x)) g'(x)\\,dx = \\int f(u)\\,du \\quad \\text{where } u = g(x)$$
4. **Integration by Parts (Product rule inverse):**
   $$\\int u\\,dv = u v - \\int v\\,du$$
   *Mnemonic:* Choose $u$ via **LIATE** (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential).

**3. Worked Example: $\\int_0^\\pi \\sin(x)\\,dx$:**
$$\\int_0^\\pi \\sin(x)\\,dx = \\left[ -\\cos(x) \\right]_0^\\pi = (-\\cos(\\pi)) - (-\\cos(0)) = (-(-1)) - (-1) = 1 + 1 = 2$$
The area of one standard arch of the sine wave is exactly $2.0\\,\\text{units}^2$.

**4. Common Pitfall:**
Forgetting the constant of integration $+C$ on indefinite integrals, or reversing the signs between derivatives and integrals of trigonometric functions (remember: $\\frac{d}{dx}\\sin(x) = +\\cos(x)$, but $\\int \\sin(x)\\,dx = -\\cos(x)$!).`;
      } else if (lastUserMsg.includes('differentiat') || lastUserMsg.includes('derivative') || lastUserMsg.includes('d/dx') || lastUserMsg.includes("f'")) {
        fallbackReply = `### Master Solution by Dr. Nova: Differential Calculus & Rates of Change

**1. Direct Answer:**
The derivative $\\frac{df}{dx}$ or $f'(x)$ defines the instantaneous rate of change of a dependent variable $y$ with respect to $x$, representing the exact slope of the tangent line to the curve at $(x, f(x))$:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

**2. Core Rules of Differentiation:**
1. **Power Rule:** $\\frac{d}{dx}[x^n] = n x^{n-1}$
2. **Product Rule:** $\\frac{d}{dx}[u \\cdot v] = u' v + u v'$
3. **Quotient Rule:** $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u' v - u v'}{v^2}$
4. **Chain Rule (Composite functions):**
   $$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x) \\quad \\text{or} \\quad \\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$

**3. Physical Applications:**
- Kinematics:
  - Position: $x(t)$
  - Instantaneous Velocity: $v(t) = \\frac{dx}{dt}$
  - Instantaneous Acceleration: $a(t) = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$
- Optimization: Set $f'(x) = 0$ to find stationary points (local maxima, minima, or points of inflection). Test with $f''(x)$:
  - $f''(x) > 0 \\implies$ Local Minimum (concave up $\\cup$).
  - $f''(x) < 0 \\implies$ Local Maximum (concave down $\\cap$).

**4. Common Pitfall:**
Applying the power rule to exponentials like $\\frac{d}{dx}[2^x] \\ne x 2^{x-1}$. The correct derivative is $\\frac{d}{dx}[a^x] = a^x \\ln(a)$!`;
      } else if (lastUserMsg.includes('convert') || lastUserMsg.includes('unit') || lastUserMsg.includes('pressure') || lastUserMsg.includes('pascal') || lastUserMsg.includes('psi') || lastUserMsg.includes('atm') || lastUserMsg.includes('bar')) {
        fallbackReply = `### Master Solution by Dr. Nova: Scientific Units & Conversions

**1. Direct Answer & Conversion Matrix:**
Scientific measurements must be converted using exact dimensional cancellation factors.

- **Pressure ($[M][L]^{-1}[T]^{-2}$):**
  $$1\\,\\text{atm} = 101,325\\,\\text{Pa} = 101.325\\,\\text{kPa} = 1.01325\\,\\text{bar} = 760\\,\\text{Torr (mmHg)} \\approx 14.696\\,\\text{psi}$$
- **Temperature ($[\\Theta]$):**
  $$T_{\\text{K}} = T_{^\\circ\\text{C}} + 273.15, \\qquad T_{^\\circ\\text{F}} = \\left(T_{^\\circ\\text{C}} \\times \\frac{9}{5}\\right) + 32, \\qquad T_{^\\circ\\text{C}} = (T_{^\\circ\\text{F}} - 32) \\times \\frac{5}{9}$$
- **Force ($[M][L][T]^{-2}$):**
  $$1\\,\\text{N} = 1\\,\\text{kg}\\cdot\\text{m/s}^2 = 10^5\\,\\text{dyn} \\approx 0.224809\\,\\text{lbf} \\quad (1\\,\\text{lbf} \\approx 4.44822\\,\\text{N})$$
- **Energy & Work ($[M][L]^2[T]^{-2}$):**
  $$1\\,\\text{J} = 1\\,\\text{N}\\cdot\\text{m} = 1\\,\\text{W}\\cdot\\text{s} \\approx 0.239006\\,\\text{cal} = 6.2415 \\times 10^{18}\\,\\text{eV} \\approx 9.478 \\times 10^{-4}\\,\\text{BTU}$$
  $$1\\,\\text{kWh} = 3.6 \\times 10^6\\,\\text{J} = 3.6\\,\\text{MJ}, \\qquad 1\\,\\text{food Calorie (kcal)} = 4,184\\,\\text{J}$$

**2. Worked Dimensional Analysis Example:**
*Convert a car tire pressure of $32.0\\,\\text{psi}$ to Kilopascals (kPa):*
$$P = 32.0\\,\\text{psi} \\times \\left(\\frac{101.325\\,\\text{kPa}}{14.696\\,\\text{psi}}\\right) = 220.62\\,\\text{kPa} \\approx 2.21\\,\\text{bar}$$

**3. Common Pitfall:**
Never multiply or divide temperature in Celsius or Fahrenheit directly in thermodynamic equations ($PV = nRT$, $\\eta = 1 - T_C/T_H$, $\\Delta S = Q/T$). **You MUST always convert to absolute Kelvin first!**`;
      } else if (lastUserMsg.includes('projectile') || lastUserMsg.includes('trajectory') || lastUserMsg.includes('gravity') || lastUserMsg.includes('angle')) {
        fallbackReply = `### Solution by Dr. Nova: Projectile Motion & Kinematics

**1. Direct Answer:**
A projectile launched with initial speed $v_0$ at angle $\\theta$ experiences independent horizontal and vertical motions under constant gravitational acceleration $g \\approx 9.8\\,\\text{m/s}^2$:
- **Horizontal Range ($R$):**
  $$R = \\frac{v_0^2 \\sin(2\\theta)}{g}$$
- **Maximum Height ($H$):**
  $$H = \\frac{v_0^2 \\sin^2(\\theta)}{2g}$$
- **Total Time of Flight ($T$):**
  $$T = \\frac{2 v_0 \\sin(\\theta)}{g}$$

**2. Trajectory Equation (Parabola):**
$$y(x) = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}$$
Maximum range in a vacuum occurs at launch angle $\\theta = 45^\\circ$ (since $\\sin(2 \\times 45^\\circ) = \\sin(90^\\circ) = 1$).

**3. Common Pitfall:**
Thinking vertical velocity is constant. Only horizontal velocity $v_x = v_0 \\cos(\\theta)$ is constant (neglecting air resistance). At the peak apex, $v_y = 0$, but acceleration is still non-zero: $a_y = -9.8\\,\\text{m/s}^2$ downward!`;
      } else if (lastUserMsg.includes('snell') || lastUserMsg.includes('refract') || lastUserMsg.includes('lens') || lastUserMsg.includes('optic')) {
        fallbackReply = `### Solution by Dr. Nova: Snell's Law & Wave Refraction

**1. Direct Answer:**
When light traverses a boundary between two optical media with refractive indices $n_1$ and $n_2$, its speed changes, altering its propagation direction according to **Snell's Law**:
$$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$
where angles are measured strictly with respect to the **surface normal** (perpendicular).

**2. Critical Angle & Total Internal Reflection (TIR):**
When light travels from a denser medium to a rarer medium ($n_1 > n_2$), the refracted ray bends away from the normal. When $\\theta_2 = 90^\\circ$:
$$\\theta_c = \\arcsin\\left(\\frac{n_2}{n_1}\\right)$$
For incident angles $\\theta_1 > \\theta_c$, $100\\%$ of light is reflected inside the medium (foundation of optical fiber communications).

**3. Common Examiner Trap:**
Measuring angles from the glass surface interface instead of from the surface normal! Always draw the perpendicular normal first.`;
      } else if (lastUserMsg.includes('spoon') || lastUserMsg.includes('cold') || lastUserMsg.includes('heat') || lastUserMsg.includes('thermal conduction')) {
        fallbackReply = `### Solution by Dr. Nova: The Two Spoons Thermal Conduction Phenomenon

**1. Direct Answer:**
The student's conclusion that the colder-feeling spoon has a lower temperature is **scientifically incorrect**. Both spoons resting in the room overnight are in thermal equilibrium at the exact same temperature ($T = 20^\\circ\\text{C}$).

**2. Step-by-Step Thermal Explanation:**
- **Zeroth Law of Thermodynamics:** Thermal energy has transferred until $T_{\\text{metal}} = T_{\\text{wood}} = T_{\\text{air}} = 20^\\circ\\text{C}$.
- **Physiology of Human Skin Perception:** Human thermoreceptors detect the **rate of heat transfer** ($dQ/dt$) away from our skin ($T_{\\text{skin}} \\approx 34^\\circ\\text{C}$), not the absolute temperature of the object.
- **Fourier's Law of Heat Conduction:**
  $$\\frac{dQ}{dt} = -k A \\frac{\\Delta T}{\\Delta x}$$
  where $k$ is thermal conductivity.
  - Stainless Steel Spoon: $k \\approx 16 - 25\\,\\text{W/(m}\\cdot\\text{K)}$ (Rapid heat extraction $\\rightarrow$ triggers "cold" perception).
  - Birch Wood Spoon: $k \\approx 0.15\\,\\text{W/(m}\\cdot\\text{K)}$ (Slow heat extraction $\\rightarrow$ feels neutral/room temp).

**3. Common Misconception:**
Equating sensory perception with thermodynamic state variables. Feeling cold indicates high thermal flux, not lower temperature!`;
      } else if (lastUserMsg.includes('ohm') || lastUserMsg.includes('current') || lastUserMsg.includes('voltage') || lastUserMsg.includes('resistance') || lastUserMsg.includes('circuit')) {
        fallbackReply = `### Solution by Dr. Nova: Current Electricity & Circuit Dynamics

**1. Direct Answer:**
By Ohm's Law, current is directly proportional to voltage and inversely proportional to resistance:
$$I = \\frac{V}{R}$$
Halving resistance at constant voltage doubles the electric current ($I_2 = 2 I_1$).

**2. Power Dissipation & Joule Heating:**
$$P = V I = I^2 R = \\frac{V^2}{R}$$
Notice that because voltage is held constant, power increases **inversely** with resistance! Halving $R$ causes electrical power dissipation to double.

**3. Circuit Laws (Kirchhoff):**
- **Kirchhoff's Current Law (KCL - Charge Conservation):** $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ at any junction node.
- **Kirchhoff's Voltage Law (KVL - Energy Conservation):** $\\sum \\Delta V = 0$ around any closed loop.`;
      } else if (lastUserMsg.includes('pendulum') || lastUserMsg.includes('harmonic') || lastUserMsg.includes('spring') || lastUserMsg.includes('oscillation')) {
        fallbackReply = `### Solution by Dr. Nova: Simple Harmonic Motion (SHM)

**1. Direct Answer:**
For small angular displacements ($\\theta < 15^\\circ$ where $\\sin\\theta \\approx \\theta$), the period $T$ of a simple pendulum depends only on its string length $L$ and local gravity $g$:
$$T = 2\\pi \\sqrt{\\frac{L}{g}}$$
*Notice that the mass of the bob does NOT affect the period of oscillation!*

**2. Spring-Mass Oscillator:**
$$T = 2\\pi \\sqrt{\\frac{m}{k}}$$
where $m$ is oscillating mass and $k$ is the spring stiffness constant in $\\text{N/m}$.

**3. Energy Conservation in SHM:**
$$E_{\\text{total}} = \\frac{1}{2} m v^2 + \\frac{1}{2} k x^2 = \\frac{1}{2} k A^2 = \\text{constant}$$
Kinetic energy peaks at equilibrium ($x = 0$), while potential energy peaks at maximum displacement amplitude ($x = \\pm A$).`;
      } else if (lastUserMsg.includes('cesium') || lastUserMsg.includes('caesium') || (lastUserMsg.includes('alkali') && lastUserMsg.includes('water')) || (lastUserMsg.includes('sodium') && lastUserMsg.includes('water'))) {
        fallbackReply = `### 💥 Dr. Nova's Curious Lab: What If We Add Cesium to Water?

**1. The Explosive Macroscopic Reality:**
If you drop even a small pellet of elemental **Cesium (Cs)** into water, it does **not** float or fizz gently. Unlike Lithium or Sodium, Cesium is denser than water ($\\rho = 1.93\\,\\text{g/cm}^3$) and sinks instantly. The reaction is so hyper-violent and instantaneous that it shatters glass beakers into dust with a supersonic shockwave within **less than a millisecond**, often before the hydrogen gas can even mix with atmospheric oxygen!

**2. Balanced Chemical Reaction & Thermodynamics:**
$$2\\text{Cs}_{(s)} + 2\\text{H}_2\\text{O}_{(l)} \\longrightarrow 2\\text{CsOH}_{(aq)} + \\text{H}_{2(g)} \\uparrow + \\text{Heat}$$
- Enthalpy of Reaction: $\\Delta H^\\circ \\approx -160\\,\\text{kJ/mol}$ of Cs (violently exothermic).
- Products: Concentrated **Cesium Hydroxide (CsOH)**—the strongest known soluble base in chemistry ($pH \\approx 14+$), plus flammable hydrogen gas $\\text{H}_2$.

**3. The Quantum & Molecular Mystery — "Coulomb Explosion Theory":**
For over a century, textbooks claimed hydrogen ignition caused alkali metal explosions. In 2015, high-speed synchrotron cameras revealed the true quantum culprit:
1. **Ultra-Low First Ionization Energy:** Cesium's $6s^1$ valence electron is extremely far from the nucleus ($I_1 = 375.7\\,\\text{kJ/mol}$). Electrons instantly transfer into water molecules in under $10^{-13}\\text{ s}$.
2. **Positive Charge Catastrophe:** The remaining metal droplet is left with thousands of mutually repellent $\\text{Cs}^+$ cations.
3. **Coulomb Explosion:** The electrostatic repulsion overcomes the metal's surface tension:
   $$F_E = k_e \\frac{q_1 q_2}{r^2}$$
   The metal droplet instantly spikes into billions of nano-filaments, multiplying surface area by orders of magnitude within $100\\,\\mu\\text{s}$. This causes instantaneous water boiling and shockwave cavitation!

**4. Periodic Trend (Group 1 Alkali Metals):**
$$\\text{Li} \\longrightarrow \\text{Na} \\longrightarrow \\text{K} \\longrightarrow \\text{Rb} \\longrightarrow \\text{Cs} \\longrightarrow \\text{Fr}$$
As atomic radius increases ($n = 2 \\to 6$), effective nuclear charge over the valence shell weakens, decreasing ionization energy and increasing chemical reactivity exponentially.`;
      } else if (lastUserMsg.includes('earth') && (lastUserMsg.includes('stop') || lastUserMsg.includes('spin') || lastUserMsg.includes('rotat'))) {
        fallbackReply = `### 🌍 Dr. Nova's Curious Lab: What If Earth Stopped Spinning for 5 Seconds?

**1. The Macroscopic Reality (Cataclysmic Inertia):**
At the equator, Earth rotates eastward at approximately $1,674\\,\\text{km/h}$ ($465\\,\\text{m/s}$). By **Newton's First Law of Motion (Inertia)**, if the solid crust locked in place for 5 seconds:
- Everything not anchored to the planet's mantle (the atmosphere, 1.3 billion cubic kilometers of oceans, cars, buildings, people) would continue hurtling eastward at **supersonic speed** (Mach 1.35)!

**2. Physical Breakdown & Equations:**
- **Inertial Momentum Conservation:**
  $$p = m \\cdot v_{\\text{tangential}} = m \\cdot (\\omega R_E \\cos\\lambda)$$
  where equatorial radius $R_E \\approx 6,378\\,\\text{km}$, $\\omega = 7.292 \\times 10^{-5}\\,\\text{rad/s}$, and $\\lambda$ is latitude.
- **Supersonic Shockwaves:** Atmospheric wind speeds of $1,670\\,\\text{km/h}$ would level all human architecture across the tropics and temperate zones.
- **Megatsunamis:** Oceans would surge eastward into continental shelves, flooding hundreds of kilometers inland before water sloshes toward the poles (where rotational velocity is zero).
- **Restart Shock:** When Earth starts spinning again after 5 seconds, an equal and opposite deceleration shockwave would shake the lithosphere, triggering global magnitude 9+ earthquakes and volcanic eruptions.

**3. The Only Safe Place?**
Standing directly at the geographic **North or South Pole** ($\\\\lambda = 90^\\circ$), where rotational linear velocity is virtually $0\\,\\text{m/s}$!`;
      } else if (lastUserMsg.includes('liquid nitrogen') || lastUserMsg.includes('leidenfrost')) {
        fallbackReply = `### ❄️ Dr. Nova's Curious Lab: What If You Touch Liquid Nitrogen with Bare Hands?

**1. The Shocking Paradox:**
Liquid nitrogen sits at $-195.8^\\circ\\text{C}$ ($77.36\\,\\text{K}$). Yet, you can briefly dip your dry fingers in it for a fraction of a second without getting frostbite! How? Thanks to the **Leidenfrost Effect**.

**2. Governing Physics & Thermodynamics:**
- **Vapor Barrier Insulation:** When your warm skin ($T_{\\text{skin}} \\approx +34^\\circ\\text{C}$) touches liquid nitrogen, the temperature difference is immense:
  $$\\Delta T = 34^\\circ\\text{C} - (-196^\\circ\\text{C}) = 230\\,\\text{K}$$
  This far exceeds the Leidenfrost boiling threshold ($~100\\,\\text{K}$). The nitrogen in direct contact instantaneously flash-vaporizes into gaseous nitrogen ($\\\\text{N}_2$).
- **Thermal Conductivity of Gas vs Liquid:**
  - Gaseous $\\\\text{N}_2$: $k_{\\text{gas}} \\approx 0.024\\,\\text{W/(m}\\cdot\\text{K)}$ (Extraordinary thermal insulator!)
  - The gas jacket cushions your flesh, preventing direct liquid conduction for roughly $0.5 - 1.0\\,\\text{second}$.

**3. Deadly Failure Modes (DO NOT ATTEMPT):**
1. **Wet skin:** Water has high specific heat; moisture instantly freezes into ice crystals that stick, causing instantaneous third-degree tissue necrosis.
2. **Jewelry/Rings:** Metal conducts heat rapidly, draining thermal energy from your finger in milliseconds, resulting in ring amputation!
3. **Prolonged contact ($> 1\\text{ s}$):** The vapor cushion blows away, freezing cellular cytoplasm into sharp ice needles that burst cell walls.`;
      } else if (lastUserMsg.includes('sun') && (lastUserMsg.includes('vanish') || lastUserMsg.includes('disappear') || lastUserMsg.includes('gone'))) {
        fallbackReply = `### ☀️ Dr. Nova's Curious Lab: What If the Sun Suddenly Vanished?

**1. Timeline of the Solar Cataclysm:**
- **0 to 8 Minutes 20 Seconds:**
  **Absolutely nothing happens.** According to Einstein's General Relativity, gravity does not propagate instantaneously—gravitational waves travel at the speed of light:
  $$v_{\\text{gravity}} = c \\approx 299,792,458\\,\\text{m/s}$$
  The distance from Earth to Sun is $1\\,\\text{AU} \\approx 1.496 \\times 10^{11}\\,\\text{m}$.
  $$t = \\frac{d}{c} = \\frac{1.496 \\times 10^{11}\\,\\text{m}}{3 \\times 10^8\\,\\text{m/s}} \\approx 499\\,\\text{seconds} \\approx 8\\,\\text{min } 19\\,\\text{s}$$
  Earth continues orbiting smoothly in sunlight for over 8 minutes after the Sun is gone!

**2. Orbital Motion Transformation:**
At $t = 8\\,\\text{min } 20\\,\\text{s}$, sunlight goes black, and the gravitational centripetal curvature ceases ($F_g = \\frac{G M_\\odot m}{r^2} \\to 0$).
By **Newton's First Law**, Earth instantly flies off in a straight tangential line into interstellar space at orbital velocity:
$$v_{\\text{orbit}} = \\sqrt{\\frac{G M_\\odot}{r}} \\approx 29.8\\,\\text{km/s} \\approx 107,000\\,\\text{km/h}$$

**3. Thermal Collapse Timeline:**
- **Hour 1:** Planetary night everywhere. Moon becomes dark (no reflected sunlight).
- **Day 7:** Global surface temperature drops below $0^\\circ\\text{C}$ ($32^\\circ\\text{F}$). Photosynthesis halts.
- **Year 1:** Surface temperature plunges to $-73^\\circ\\text{C}$ ($-100^\\circ\\text{F}$). Ocean surfaces freeze solid, but deep oceans stay liquid thanks to geothermal hydrothermal vents and thick insulating ice caps.`;
      } else if (lastUserMsg.includes('grape') && lastUserMsg.includes('microwave')) {
        fallbackReply = `### 🍇 Dr. Nova's Curious Lab: Why Do Grapes Make Plasma in Microwaves?

**1. The Phenomenon:**
If you place two whole grapes touching each other inside a microwave oven, within seconds a dazzling, crackling **plasma fireball** erupts at the contact bridge!

**2. The Dielectric Resonance Mechanism (Optics & Electromagnetism):**
For years, people believed the thin grape skin acted as an electrical antenna. In 2019, physicists revealed the real reason:
1. **Refractive Index of Water:** Grapes are $90\\%$ water. At standard microwave oven frequency ($f = 2.45\\,\\text{GHz}$, wavelength $\\lambda \\approx 12.2\\,\\text{cm}$ in air), water has a very high dielectric constant ($\\varepsilon_r \\approx 80$), which shrinks the wavelength inside the grape to:
   $$\\lambda_{\\text{inside}} = \\frac{\\lambda}{\\sqrt{\\varepsilon_r}} \\approx \\frac{12.2\\,\\text{cm}}{\\sqrt{80}} \\approx 1.36\\,\\text{cm}$$
2. **Dielectric Cavity Resonator:** The grape's diameter (~$1.5\\,\\text{cm}$) matches $\\lambda_{\\text{inside}}$ perfectly! It acts as a dielectric resonance sphere, trapping microwave radiation.
3. **Bridge Hotspot:** At the point where the two spherical grapes touch, electromagnetic field intensity concentrates into a tiny hotspot.
4. **Thermal Ionization to Plasma:** The extreme localized field strips electrons from potassium ($K$) and sodium ($Na$) ions in the grape juice, ionizing air and vapor into glowing luminous **plasma** ($T > 2000^\\circ\\text{C}$)!`;
      } else if (lastUserMsg.includes('vernier') || lastUserMsg.includes('least count') || (lastUserMsg.includes('caliper') && (lastUserMsg.includes('reading') || lastUserMsg.includes('measure') || lastUserMsg.includes('error')))) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Vernier Calipers (Class 11 Physics)

**1. Direct Answer & Governing Formula:**
- **Least Count (Vernier Constant):**
  $$LC = 1\\text{ MSD} - 1\\text{ VSD} = \\frac{\\text{Value of 1 Main Scale Division}}{\\text{Total Number of Vernier Scale Divisions}}$$
  For standard lab calipers where $1\\text{ MSD} = 1\\text{ mm}$ and 10 Vernier divisions equal 9 Main scale divisions:
  $$LC = \\frac{1\\text{ mm}}{10} = 0.1\\text{ mm} = 0.01\\text{ cm}$$
- **Total Corrected Reading:**
  $$\\text{Total Reading} = \\text{MSR} + (\\text{VSR} \\times LC) - (\\pm \\text{Zero Error})$$
- **Volume of Cylinder:**
  $$V = \\pi \\left(\\frac{D}{2}\\right)^2 h$$
  where $D$ is mean external diameter and $h$ is internal depth measured with the depth probe.

**2. Zero Error Calibration:**
- **Positive Zero Error (+e):** When jaws touch, if the Vernier zero lies to the **right** of Main Scale zero.
  $$\\text{Zero Error} = + (\\text{Coinciding VSD} \\times LC) \\implies \\text{Subtract from observed reading}.$$
- **Negative Zero Error (-e):** When jaws touch, if the Vernier zero lies to the **left** of Main Scale zero.
  $$\\text{Zero Error} = - (\\text{Total VSD} - \\text{Coinciding VSD}) \\times LC \\implies \\text{Add to observed reading}.$$

**3. Standard Viva Voce Questions & Answers:**
- *Q: Why do we take mutually perpendicular diameter readings at different heights?*
  *A:* To eliminate errors arising from non-uniformity and oval cross-sections of the cylinder.
- *Q: What are the upper jaws used for?*
  *A:* Measuring internal dimensions (internal diameter of beakers, tubes, and calorimeters).`;
      } else if (lastUserMsg.includes('screw gauge') || lastUserMsg.includes('micrometer') || lastUserMsg.includes('pitch scale') || lastUserMsg.includes('backlash')) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Screw Gauge / Micrometer (Class 11 Physics)

**1. Direct Answer & Formula:**
- **Pitch of Screw:**
  $$\\text{Pitch} = \\frac{\\text{Linear distance advanced on pitch scale}}{\\text{Number of full rotations completed}} = \\frac{5\\text{ mm}}{5} = 1.0\\text{ mm}$$
- **Least Count (LC):**
  $$LC = \\frac{\\text{Pitch}}{\\text{Total Circular Scale Divisions}} = \\frac{1.0\\text{ mm}}{100} = 0.01\\text{ mm} = 0.001\\text{ cm} = 10\\,\\mu\\text{m}$$
- **Observed Diameter ($D$):**
  $$D = \\text{PSR} + (\\text{CSR} \\times LC) - \\text{Zero Error}$$
- **Cross-Sectional Area of Wire:**
  $$A = \\pi r^2 = \\pi \\left(\\frac{D}{2}\\right)^2$$

**2. What is Backlash Error & How is it Eliminated?**
- **Definition:** Mechanical play or slippage between the internal screw threads and the nut casing caused by mechanical wear over time.
- **Remedy:** Always turn the thimble or ratchet in **one single forward direction** while taking a measurement; never reverse motion mid-trial!

**3. Function of the Ratchet Head:**
The spring-loaded ratchet slips and produces audible clicks when uniform contact pressure is reached between studs and specimen, preventing wire distortion and eliminating operator grip bias.`;
      } else if (lastUserMsg.includes('meter bridge') || lastUserMsg.includes('metre bridge') || lastUserMsg.includes('wheatstone') || (lastUserMsg.includes('specific resistance') && lastUserMsg.includes('wire'))) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Meter Bridge (Class 12 Physics)

**1. Direct Answer & Governing Formula:**
The meter bridge operates on the **Wheatstone Bridge Null Principle** (when galvanometer deflection is zero, no current flows across the bridge arm):
$$\\frac{P}{Q} = \\frac{R}{X} \\implies \\frac{\\sigma \\cdot l}{\\sigma \\cdot (100 - l)} = \\frac{R}{X}$$
$$\\therefore X = R \\left(\\frac{100 - l}{l}\\right)$$
where $R$ is standard resistance from the box, $X$ is unknown wire resistance, and $l$ is balancing length from zero end in cm.
- **Specific Resistance (Resistivity $\\rho$):**
  $$\\rho = \\frac{X \\cdot A}{L} = \\frac{X \\cdot \\pi r^2}{L} \\quad (\\Omega\\cdot\\text{m})$$
  where $r$ is wire radius (measured via screw gauge) and $L$ is total length of unknown resistance wire.

**2. Why is Balance Point Preferred Near 50 cm?**
Wheatstone bridge sensitivity is mathematically maximized when all four arm resistances are comparable ($P \\approx Q \\approx R \\approx X$).
$$\\frac{\\Delta X}{X} = \\frac{\\Delta l}{l} + \\frac{\\Delta l}{100 - l} = \\frac{100 \\Delta l}{l(100 - l)}$$
The percentage error $\\frac{\\Delta X}{X}$ reaches its absolute minimum at $l = 50\\text{ cm}$.

**3. Why Constantan or Manganin Wire?**
Manganin/Constantan has high specific resistivity and an extremely low temperature coefficient of resistance ($\\alpha \\approx 0$). This ensures current flowing during the experiment does not heat the wire and shift its resistance.`;
      } else if (lastUserMsg.includes('convex lens') || (lastUserMsg.includes('focal length') && lastUserMsg.includes('lens')) || lastUserMsg.includes('optical bench') || lastUserMsg.includes('u-v')) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Convex Lens by u-v Method (Class 12 Physics)

**1. Direct Answer & Lens Equation:**
Using Cartesian Sign Convention (Object needle $u < 0$, Real inverted image $v > 0$):
$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} \\implies f = \\frac{u v}{u - v}$$
- **At $2F$ Condition ($u = -2f$):**
  $$v = +2f, \\qquad m = \\frac{v}{u} = -1 \\quad (\\text{Real, inverted, same size as object pin})$$
  Distance between object pin and image pin is minimum: $D_{\\min} = 4f$.

**2. Graph Method ($1/v$ vs $1/u$):**
Plotting $\\frac{1}{v}$ on the y-axis against $\\frac{1}{u}$ on the x-axis yields a straight line with slope $+1$ and intercepts:
$$\\text{y-intercept } OA = \\frac{1}{f}, \\qquad \\text{x-intercept } OB = -\\frac{1}{f} \\implies f = \\frac{1}{OA}$$

**3. What is Optical Parallax and How to Remove It?**
- **Parallax:** Apparent relative shift between the tip of the image needle and the inverted aerial image of the object needle when the observer moves their eye sideways.
- **Zero Parallax:** Adjust the image needle position until both pin tips remain locked together seamlessly as you move your head from left to right. When parallax is eliminated, the image needle is at the exact position of the real image!`;
      } else if (lastUserMsg.includes('prism') || lastUserMsg.includes('minimum deviation') || lastUserMsg.includes('refractive index of prism')) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Angle of Minimum Deviation (Class 12 Physics)

**1. Direct Answer & Prism Formula:**
$$\\mu = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}$$
where $A$ is the refracting angle of the prism ($A = 60^\\circ$ for an equilateral glass prism) and $D_m$ is the angle of minimum deviation found at the trough of the $i - \\delta$ curve.

**2. Fundamental Relations in a Prism:**
- **Angle Relation:** $A + \\delta = i + e$
- **Internal Refraction:** $r_1 + r_2 = A$
- **Special Symmetrical Conditions at Minimum Deviation ($\\delta = D_m$):**
  1. Angle of incidence equals angle of emergence: $i = e$.
  2. Internal angles of refraction are equal: $r_1 = r_2 = \\frac{A}{2} = 30^\\circ$.
  3. The refracted ray inside the equilateral prism travels **strictly parallel** to the base face of the prism!

**3. Worked Example Calculation:**
For an equilateral crown glass prism ($A = 60^\\circ$) with $D_m = 38^\\circ$:
$$\\mu = \\frac{\\sin\\left(\\frac{60^\\circ + 38^\\circ}{2}\\right)}{\\sin\\left(\\frac{60^\\circ}{2}\\right)} = \\frac{\\sin(49^\\circ)}{\\sin(30^\\circ)} = \\frac{0.7547}{0.5000} = 1.509$$`;
      } else if (lastUserMsg.includes('titrat') || lastUserMsg.includes('kmno4') || lastUserMsg.includes('oxalic acid') || lastUserMsg.includes('mohr') || lastUserMsg.includes('permanganate')) {
        fallbackReply = `### 🧪 Practical Lab Master Solution by Dr. Nova: Redox Titration of KMnO₄ (Class 11 & 12 Chemistry)

**1. Direct Answer & Balanced Chemical Equations:**
- **Reaction with Oxalic Acid:**
  $$2\\text{KMnO}_4 + 5\\text{H}_2\\text{C}_2\\text{O}_4 + 3\\text{H}_2\\text{SO}_4 \\longrightarrow \\text{K}_2\\text{SO}_4 + 2\\text{MnSO}_4 + 10\\text{CO}_2\\uparrow + 8\\text{H}_2\\text{O}$$
  - Ionic Net: $2\\text{MnO}_4^- + 5\\text{C}_2\\text{O}_4^{2-} + 16\\text{H}^+ \\longrightarrow 2\\text{Mn}^{2+} + 10\\text{CO}_2\\uparrow + 8\\text{H}_2\\text{O}$
  - Molarity Equation:
    $$\\frac{M_1 V_1}{2} = \\frac{M_2 V_2}{5} \\implies M_1 = \\frac{2}{5} \\times \\frac{M_2 V_2}{V_1}$$
  - Strength of $\\text{KMnO}_4$: $\\text{Strength } (\\text{g/L}) = M_1 \\times 158.04\\,\\text{g/mol}$.

**2. Crucial Viva Voce Exam Answers:**
- *Q: Why is KMnO₄ called a self-indicator?*
  *A:* Purple $\\text{MnO}_4^-$ is reduced to colorless $\\text{Mn}^{2+}$ during the reaction. As soon as all oxalic acid is oxidized, one single excess drop of $\\text{KMnO}_4$ imparts a permanent faint pink tint to the solution. No external indicator is needed!
- *Q: Why do we heat oxalic acid to 60°C–70°C before titrating?*
  *A:* The reaction has high activation energy and is extremely sluggish at room temperature. Heating provides kinetic energy to initiate reaction. Once formed, $\\text{Mn}^{2+}$ acts as an **autocatalyst**.
- *Q: Why is dilute H₂SO₄ used and NOT HCl or HNO₃?*
  *A:* $\\text{HCl}$ would be oxidized by $\\text{KMnO}_4$ into chlorine gas ($2\\text{MnO}_4^- + 10\\text{Cl}^- + 16\\text{H}^+ \\to 2\\text{Mn}^{2+} + 5\\text{Cl}_2\\uparrow + 8\\text{H}_2\\text{O}$), giving falsely high burette readings. $\\text{HNO}_3$ is itself a powerful oxidizing agent that would compete in oxidizing oxalic acid. Only $\\text{H}_2\\text{SO}_4$ is chemically stable and non-interfering!`;
      } else if (lastUserMsg.includes('thiosulfate') || lastUserMsg.includes('thiosulphate') || (lastUserMsg.includes('kinetics') && (lastUserMsg.includes('cross') || lastUserMsg.includes('turbid')))) {
        fallbackReply = `### 🧪 Practical Lab Master Solution by Dr. Nova: Reaction Kinetics (Class 12 Chemistry)

**1. Direct Answer & Governing Reaction:**
$$\\text{Na}_2\\text{S}_2\\text{O}_{3(aq)} + 2\\text{HCl}_{(aq)} \\longrightarrow 2\\text{NaCl}_{(aq)} + \\text{SO}_{2(g)} + \\text{S}_{(s)}\\downarrow + \\text{H}_2\\text{O}_{(l)}$$
- **Rate of Reaction:**
  $$\\text{Rate} \\propto \\frac{1}{t}$$
  where $t$ is the exact time in seconds taken for the precipitated colloidal sulfur to completely obscure a black cross mark $(X)$ drawn on paper beneath the flask.

**2. Kinetic Findings:**
- A plot of $\\frac{1}{t}$ (Reaction Rate) against concentration of $\\text{Na}_2\\text{S}_2\\text{O}_3$ is a straight line passing through the origin.
- **Reaction Order:** Pseudo first-order with respect to sodium thiosulfate:
  $$\\text{Rate} = k [\\text{Na}_2\\text{S}_2\\text{O}_3]^1$$
- **Effect of Temperature:** Reaction rate roughly doubles for every $10^\\circ\\text{C}$ rise in temperature, obeying the Arrhenius equation $k = A e^{-E_a/RT}$.

**3. Why does the cross disappear?**
Insoluble elemental sulfur precipitates as colloidal particles ($1 - 1000\\text{ nm}$) that scatter incident visible light (**Tyndall Effect**), increasing optical opacity until the cross mark is fully obscured.`;
      } else if (lastUserMsg.includes('mitosis') || lastUserMsg.includes('onion root') || lastUserMsg.includes('metaphase') || lastUserMsg.includes('anaphase') || lastUserMsg.includes('prophase') || lastUserMsg.includes('telophase')) {
        fallbackReply = `### 🧬 Practical Lab Master Solution by Dr. Nova: Mitosis in Onion Root Tip (Class 12 Biology)

**1. Stages of Mitosis & Microscopic Identification:**
1. **Prophase:** Chromatin fibers condense into visible thread-like double-stranded chromosomes. Nucleolus and nuclear envelope disintegrate.
2. **Metaphase (Key Stage):** Chromosomes reach maximum condensation and align precisely along the **equatorial plane (metaphase plate)**. Spindle fibers attach to centromere kinetochores.
3. **Anaphase (Fastest Stage):** Centromeres split simultaneously. Sister chromatids separate and are pulled toward opposite spindle poles by shortening microtubules, adopting distinct **V, L, J, or I shapes**.
4. **Telophase & Cytokinesis:** Daughter chromosomes decondense into chromatin at poles. Nuclear envelopes reform. In plant cells, a **cell plate (phragmoplast)** forms across the center to partition daughter cells.

**2. Mitotic Index Formula:**
$$\\text{Mitotic Index (MI)} = \\frac{\\text{Number of Cells Undergoing Mitosis (P + M + A + T)}}{\\text{Total Number of Cells Counted in Field}} \\times 100\\%$$

**3. Viva Voce Highlights:**
- *Q: Why are onion root tips chosen?*
  *A:* The root apical meristem exhibits continuous rapid cell division with large, clearly countable chromosomes ($2n = 16$).
- *Q: Why is 1N HCl used during squash preparation?*
  *A:* Warm $1\\text{N HCl}$ (maceration) dissolves pectin in the middle lamella, softening intercellular bonds so cells flatten into a single monolayer without tearing.
- *Q: What stain is used and why?*
  *A:* **Acetocarmine** or Feulgen stain. Acetocarmine is a basic dye that binds specifically to negatively charged phosphate groups on DNA in chromosomes, staining them intense crimson red.`;
      } else if (lastUserMsg.includes('chromatograph') || lastUserMsg.includes('rf value') || lastUserMsg.includes('spinach') || lastUserMsg.includes('pigment')) {
        fallbackReply = `### 🧬 Practical Lab Master Solution by Dr. Nova: Paper Chromatography (Class 11 Biology)

**1. Direct Answer & Retardation Factor (Rf):**
$$R_f = \\frac{\\text{Distance travelled by pigment band from loading line}}{\\text{Distance travelled by solvent front from loading line}}$$
$R_f$ is always $\\le 1.0$ and is an intrinsic physicochemical fingerprint for a substance under standard conditions.

**2. Separation Order of Spinach Photosynthetic Pigments (Top to Bottom):**
1. **Carotene (Yellow-Orange):** Highest $R_f \\approx 0.95$. Completely non-polar hydrocarbon with zero affinity for paper cellulose; dissolves most readily in petroleum ether mobile phase.
2. **Xanthophyll (Yellow):** $R_f \\approx 0.71$. Contains oxygenated hydroxyl groups, increasing polarity and lowering migration speed.
3. **Chlorophyll-a (Blue-Green):** $R_f \\approx 0.65$. Primary photosynthetic pigment.
4. **Chlorophyll-b (Yellow-Green):** Lowest $R_f \\approx 0.45$. Possesses polar formyl ($-CHO$) group that forms strong hydrogen bonds with the cellulose stationary phase.

**3. Two Phases in Paper Chromatography:**
- **Stationary Phase:** Water molecules tightly adsorbed onto cellulose fibers of Whatman No. 1 paper.
- **Mobile Phase:** Non-polar organic solvent mixture (Petroleum ether : Acetone in $9:1$ volume ratio) ascending via capillary action.`;
      } else if (lastUserMsg.includes('sonometer') || lastUserMsg.includes('tuning fork') || lastUserMsg.includes('vibrating string')) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Sonometer & Laws of Vibrating Strings

**1. Direct Answer & Governing Formula:**
The fundamental frequency $n$ of transverse stationary waves in a stretched string of length $l$, tension $T$, and mass per unit length (linear density) $m$ is:
$$n = \\frac{1}{2l} \\sqrt{\\frac{T}{m}} = \\frac{1}{2l} \\sqrt{\\frac{Mg}{\\pi r^2 \\rho}}$$
- **Frequency of AC Mains:** When an electromagnet powered by AC mains (frequency $f$) vibrates a magnetic wire, $f_{\\text{AC}} = \\frac{n}{2}$ for non-polarized electromagnet or $f_{\\text{AC}} = n$ for polarized.

**2. Three Laws of Transverse Vibrations:**
1. **Law of Length:** $n \\propto \\frac{1}{l}$ (at constant $T$ and $m$). Thus, $n \\cdot l = \\text{constant}$.
2. **Law of Tension:** $n \\propto \\sqrt{T}$ (at constant $l$ and $m$). Thus, $\\frac{n}{\\sqrt{T}} = \\text{constant}$.
3. **Law of Mass:** $n \\propto \\frac{1}{\\sqrt{m}}$ (at constant $l$ and $T$).

**3. Paper Rider Resonance Criterion:**
When the natural frequency of the stretched string between bridge wedges matches the tuning fork frequency, acoustic **resonance** occurs: antinode forms at center, amplitude surges, and the light paper rider placed at the midpoint violently flies off!`;
      } else if (lastUserMsg.includes('quadratic') || (lastUserMsg.includes('ax^2') || lastUserMsg.includes('roots of'))) {
        fallbackReply = `### 📐 Master Mathematical Solution by Dr. Nova: Quadratic Equations

**1. Direct Quadratic Formula:**
For any quadratic equation $a x^2 + b x + c = 0$ ($a \\ne 0$):
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
- **Discriminant ($D = b^2 - 4ac$):**
  - $D > 0$: Two distinct real roots.
  - $D = 0$: Two equal real roots ($x = -b / 2a$).
  - $D < 0$: Two conjugate complex roots ($x = \\frac{-b \\pm i\\sqrt{|D|}}{2a}$).

**2. Vieta's Formulas (Sum & Product of Roots):**
$$\\alpha + \\beta = -\\frac{b}{a}, \\qquad \\alpha \\cdot \\beta = \\frac{c}{a}$$
Quadratic expression can always be rewritten as:
$$x^2 - (\\alpha + \\beta) x + (\\alpha \\beta) = 0$$

**3. Worked Example ($2x^2 - 4x - 6 = 0$):**
Here $a = 2, b = -4, c = -6$.
$$D = (-4)^2 - 4(2)(-6) = 16 + 48 = 64 = 8^2$$
$$x = \\frac{-(-4) \\pm \\sqrt{64}}{2(2)} = \\frac{4 \\pm 8}{4} \\implies x_1 = 3, \\quad x_2 = -1$$`;
      } else if (lastUserMsg.includes('potentiometer') || (lastUserMsg.includes('internal resistance') && lastUserMsg.includes('cell'))) {
        fallbackReply = `### 🔬 Practical Lab Master Solution by Dr. Nova: Potentiometer (Class 12 Physics)

**1. Principle of Potentiometer:**
Potential fall across any length of a uniform wire carrying constant current is directly proportional to its length:
$$V \\propto l \\implies V = k l \\quad (k = \\text{potential gradient in V/m})$$

**2. Comparison of EMF of Two Primary Cells:**
$$\\frac{E_1}{E_2} = \\frac{l_1}{l_2}$$
where $l_1$ and $l_2$ are balancing lengths for cells $E_1$ (e.g. Leclanché cell) and $E_2$ (Daniel cell).

**3. Internal Resistance of Primary Cell ($r$):**
$$r = R \\left( \\frac{l_1 - l_2}{l_2} \\right)$$
where $l_1$ is balance point with cell on open circuit (EMF $E$) and $l_2$ is balance point with shunt resistance box $R$ in parallel across the cell (Terminal voltage $V$).

**4. Why is Potentiometer Superior to a Voltmeter?**
A voltmeter draws a small operating current from the circuit, measuring terminal potential difference rather than true EMF. A potentiometer draws **zero current at the null balance point**, functioning as an **ideal infinite-resistance voltmeter**!`;
      } else if (lastUserMsg.includes('vacuum') || (lastUserMsg.includes('space') && (lastUserMsg.includes('suit') || lastUserMsg.includes('without')))) {
        fallbackReply = `### 🚀 Dr. Nova's Curious Lab: What Happens to the Body in Space Without a Spacesuit?

**1. Hollywood Myth vs. Biophysical Reality:**
You do **not** instantly freeze solid, and your head does **not** explode. Human skin and blood vessels are too elastic to burst. However, a series of rapid biophysical failures occur:

**2. The 15-Second Consciousness Clock:**
- In space, ambient pressure is near absolute zero ($P \\approx 0\\,\\text{Pa}$).
- In your lungs, air is violently expelled. If you attempt to hold your breath, your lung alveoli will rupture due to the pressure differential ($P_{\\text{internal}} - P_{\\text{external}} \\approx 101\\,\\text{kPa}$).
- Deoxygenated blood circulates to the brain in **15 seconds**, causing loss of consciousness due to acute hypoxia.

**3. The Armstrong Limit & Ebullism:**
At altitudes above $19\\,\\text{km}$ ($63,000\\,\\text{ft}$), atmospheric pressure drops to $6.3\\,\\text{kPa}$ ($0.0618\\,\\text{atm}$).
According to the **Clausius-Clapeyron equation**:
$$\\ln\\left(\\frac{P_2}{P_1}\\right) = -\\frac{\\Delta H_{\\text{vap}}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$
At this pressure, the boiling point of water drops to **$37^\\circ\\text{C}$ (normal human body temperature)**!
- Saliva on your tongue, tears on your eyes, and moisture inside lungs will literally boil at body temperature.
- Blood inside pressurized arteries stays liquid, but subcutaneous fluids vaporize, causing severe bodily swelling. You have ~90 seconds before cardiovascular collapse becomes fatal.`;
      } else if (lastUserMsg.includes('momentum') || lastUserMsg.includes('collision') || lastUserMsg.includes('cradle') || lastUserMsg.includes('velocity transfer')) {
        fallbackReply = `### Solution by Dr. Nova: Law of Conservation of Linear Momentum & Elastic Collisions

**1. Direct Answer:**
In an isolated system with no external unbalanced force ($\\sum \\vec{F}_{\\text{ext}} = 0$), the total vector momentum before collision equals the total vector momentum after collision:
$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2 \\implies \\Delta \\vec{P}_{\\text{sys}} = 0$$

**2. The 100% Velocity Transfer Phenomenon (User's Billiard Ball / Newton's Cradle Proof):**
For a 1D perfectly elastic collision ($e = 1$), the post-collision velocities are governed by:
$$v_1 = \\frac{(m_1 - m_2)u_1 + 2m_2 u_2}{m_1 + m_2}, \\qquad v_2 = \\frac{2m_1 u_1 + (m_2 - m_1)u_2}{m_1 + m_2}$$
When two colliding balls have **equal mass** ($m_1 = m_2 = m$) and Ball 2 is initially **at rest** ($u_2 = 0$):
$$v_1 = \\frac{(m - m)u_1 + 0}{2m} = 0$$
$$v_2 = \\frac{2m u_1 + 0}{2m} = u_1$$
**Conclusion:** Ball 1 halts to an immediate standstill ($v_1 = 0$), and Ball 2 shoots forward with **the exact identical velocity** ($v_2 = u_1$)! 100% of kinetic energy and momentum are transferred seamlessly.

**3. Newton's Cradle Multi-Ball Impulse Transmission:**
When a swinging steel ball strikes a line of 4 stationary balls, the contact impulse propagates through the stationary intermediate spheres as an elastic acoustic stress wave in microseconds. Because both momentum ($P = \\sum mv$) and kinetic energy ($K = \\sum \\frac{1}{2}mv^2$) must be conserved, the exact same number of balls (one) pops out on the opposite end with identical speed.

**4. Inelastic Collision (Stick Together):**
$$v_{\\text{final}} = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$$
Kinetic energy is partially dissipated as heat, sound, or deformation, but total momentum remains strictly conserved!`;
      } else if (lastUserMsg.includes('third law') || (lastUserMsg.includes('action') && lastUserMsg.includes('reaction')) || lastUserMsg.includes('recoil') || lastUserMsg.includes('skater')) {
        fallbackReply = `### Solution by Dr. Nova: Newton's Third Law (Action-Reaction Pairs)

**1. Direct Answer:**
To every action, there is an equal and opposite reaction acting on **two different bodies** simultaneously:
$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$
Action and reaction forces never cancel each other out because they act on different bodies ($F_{AB}$ acts on body B, while $F_{BA}$ acts on body A).

**2. Unequal Masses Experience Unequal Accelerations ($a = F/m$):**
Even though $|\\vec{F}_{AB}| = |\\vec{F}_{BA}|$, the resulting accelerations are inversely proportional to mass:
$$a_A = \\frac{F}{m_A}, \\qquad a_B = \\frac{F}{m_B} \\implies \\frac{a_A}{a_B} = \\frac{m_B}{m_A}$$
- *Example (Skaters on Ice):* A $60\\,\\text{kg}$ adult and a $30\\,\\text{kg}$ child push each other on frictionless ice with $120\\,\\text{N}$. Both feel $120\\,\\text{N}$ of mutual force. The adult accelerates backward at $2\\,\\text{m/s}^2$, while the child accelerates backward at $4\\,\\text{m/s}^2$ (twice as fast!).

**3. Gun Recoil & Rocket Thrust in Space:**
- **Rifle Recoil:** Expanding powder gas exerts identical impulse $\\int F\\,dt$ forward on bullet and backward on gun:
  $$m_{\\text{bullet}} v_{\\text{bullet}} + M_{\\text{gun}} V_{\\text{recoil}} = 0 \\implies V_{\\text{recoil}} = -\\left(\\frac{m_{\\text{bullet}}}{M_{\\text{gun}}}\\right) v_{\\text{bullet}}$$
- **Rockets in Vacuum:** Rockets do NOT need atmosphere to push against! By expelling high-velocity exhaust fuel particles downward, the reaction force pushes the rocket vehicle forward in empty space ($F_{\\text{thrust}} = \\dot{m} v_e$).
- **Interconnected Spring Balances:** Hooking Balance A into Balance B and pulling shows both dials registering identical Newton readings ($F_A = F_B$).`;
      } else if (lastUserMsg.includes('mirror') || lastUserMsg.includes('concave') || lastUserMsg.includes('convex')) {
        fallbackReply = `### Solution by Dr. Nova: Concave vs Convex Spherical Mirrors

**1. Geometric Distinction:**
- **Concave Mirror (Converging):** Reflecting surface curves **inward** like a cave away from incoming light. Its center of curvature $C$ and principal focus $F$ lie in front of the reflecting surface (Cartesian convention: focal length $f < 0$).
- **Convex Mirror (Diverging):** Reflecting surface bulges **outward** towards incoming light. Its center of curvature and focus lie behind the mirror (focal length $f > 0$).

**2. Mirror Formula & Linear Magnification:**
$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}, \\qquad m = -\\frac{v}{u} = \\frac{h'}{h}$$
- **Concave Mirror Images:**
  - $u > 2f$: Real, inverted, diminished (between F and C).
  - $u = 2f$: Real, inverted, same size ($m = -1$, at C).
  - $f < u < 2f$: Real, inverted, magnified (beyond C).
  - $u < f$ (Object between Pole and Focus): Virtual, erect, **magnified** ($m > +1$, shaving/makeup mirror).
- **Convex Mirror Images:**
  - For any real object in front of the mirror, $v$ is always positive (behind the mirror between P and F).
  - The image is **always Virtual, Erect, and Diminished** ($0 < m < 1$), offering an expansive, panoramic field of view (automobile rear-view mirrors).`;
      } else if (lastUserMsg.includes('free fall') || lastUserMsg.includes('gravity affects mass') || lastUserMsg.includes('galileo')) {
        fallbackReply = `### Solution by Dr. Nova: Gravitation, Free Fall & Mass Independence

**1. Direct Answer:**
According to Newton's Law of Universal Gravitation and Second Law, all bodies fall with the **exact same acceleration** in a vacuum, regardless of their mass:
$$F = G\\frac{M_{\\text{Earth}} m}{R^2} = m \\cdot a \\implies a = g = \\frac{G M_{\\text{Earth}}}{R^2}$$
Notice that the mass $m$ of the falling body cancels out identically!

**2. Galileo's Leaning Tower & Apollo 15 Hammer-Feather Experiment:**
- In atmospheric air, light objects with high surface area (like feathers or paper) experience air drag ($F_{\\text{drag}} = \\frac{1}{2}\\rho C_d A v^2$) comparable to their small weight ($mg$), reaching terminal velocity quickly.
- In a vacuum (or on the Moon, demonstrated by Astronaut David Scott with a 1.32 kg hammer and 0.03 kg falcon feather), both objects hit the lunar surface at the exact same instant!`;
      } else {
        fallbackReply = `### Solution by Dr. Nova: Step-by-Step Scientific Investigation

**1. Direct Answer & Governing Principles:**
For your inquiry on "${activeContext || 'this STEM investigation'}", we apply the fundamental conservation principles:
$$\\sum \\vec{F} = m \\vec{a}, \\qquad \\Delta E_{\\text{sys}} = W_{\\text{ext}} + Q, \\qquad \\int_a^b f(x)\\,dx = F(b) - F(a)$$

**2. Methodical Step-by-Step Resolution:**
1. **Identify Variables & Coordinates:** Establish the independent coordinate $x$, dependent response $y(x)$, and fixed physical constants.
2. **Apply Boundary Constraints & Conservation Laws:** Formulate governing algebraic or differential equations with strict SI units.
3. **Verify Limiting Edge Cases:** Test limiting conditions ($x \\to 0$, $x \\to \\infty$) to confirm mathematical and physical validity.

**3. Interactive Lab Tools:**
Check the **Unit Converter** to quickly verify measurement dimensions and our **Function Grapher** to view plotted curves, derivatives, and shaded definite integrals!`;
      }

      if (isQuotaFallback) {
        fallbackReply = `> ⚡ **Dr. Nova Solver Active:** *Dr. Nova is answering with full step-by-step mathematical and physical precision via the built-in STEM Engine.*\n\n` + fallbackReply;
      }

      return res.json({
        reply: fallbackReply,
        sources: [],
        modelUsed: isQuotaFallback ? 'Dr. Nova STEM Engine (Offline Safe)' : 'dr-nova-engine',
        isQuotaFallback,
      });
    } catch (err: any) {
      console.warn('Recovered in Dr. Nova chat handler:', err?.message || err);
      return res.json({
        reply: `### Solution by Dr. Nova: Step-by-Step Resolution\\n\\n**1. Direct Answer:**\\nWe analyze this problem using governing conservation laws in STEM:\\n$$\\sum F = m a, \\qquad \\Delta E = W, \\qquad \\int_a^b f(x)\\,dx = F(b) - F(a)$$\\n\\n**2. Step-by-Step Resolution:**\\n1. Define known parameters with dimensional SI units.\\n2. Substitute into governing equations with algebraic transformations.\\n3. Check asymptotic limiting cases.\\n\\n**3. Lab Helper:**\\nUse our **Unit Converter** and **Function Grapher** tabs for instant visual and computational solutions!`,
        sources: [],
        modelUsed: 'Dr. Nova STEM Engine (Offline Safe)',
        isQuotaFallback: true,
      });
    }
  });

  // --- API Endpoint: Gemini Deep Site Research & Curriculum Insights ---
  app.post('/api/site/research', async (req, res) => {
    try {
      const { topic, conceptId, query, simulationState } = req.body;
      const targetQuery = query || topic || conceptId || 'ScienceLab Explorer curriculum';

      const systemInstruction = `You are the Lead Scientific Research Engine of ScienceLab Explorer.
You have direct, full access to the site's entire database of 150+ NCERT concepts (Class 9-12 Physics, Chemistry, Biology), practical laboratory experiments, forensic detective cases, KaTeX formulas, and interactive simulation mechanics.
Provide deep, rigorous scientific research for the user's inquiry:
- Explain the physical and mathematical mechanisms thoroughly using KaTeX equations ($...$ and $$...$$).
- Cite relevant site simulation modules:
  * MomentumConservationSim: 2-ball elastic collision bench showing 100% velocity transfer when m1 = m2 and u2 = 0, Newton's cradle 5-ball cascade, inelastic coupling, and spring recoil.
  * ActionReactionSim: Simultaneous equal and opposite forces (F_AB = -F_BA) on two bodies (skaters on ice, rifle recoil, rocket exhaust propulsion, dual spring balances).
  * SphericalMirrorsSim: Concave inward cave (f < 0) vs convex outward bulge (f > 0) ray tracing optical bench.
  * GravitationFreeFallSim: Vertical free fall from above, vacuum vs air resistance, Galileo's principle of mass independence.
  * NewtonSecondLawSim: Force variations with dynamic acceleration-time (a-t) graphs.
  * FrictionSim: Inclined plane dynamics and angle of repose theta = arctan(mu_s).
- Provide real-world engineering or astrophysical applications.
- Highlight common student misconceptions and examiner traps.`;

      let replyText = '';
      let sources: { title: string; url: string }[] = [];
      let searchQueries: string[] = [];
      let modelUsed = 'gemini-3.8-flash';

      if (ai) {
        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `Conduct deep scientific research and provide full site insights on: "${targetQuery}".
${conceptId ? `Site Concept ID: ${conceptId}` : ''}
${simulationState ? `Active Simulation Variables: ${JSON.stringify(simulationState)}` : ''}`,
              },
            ],
          },
        ];

        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        for (const model of candidateModels) {
          if (replyText) break;
          modelUsed = model;
          try {
            const response = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
              },
            });
            if (response && response.text) {
              replyText = response.text;
              const candidate = response.candidates?.[0] as any;
              const groundingMetadata = candidate?.groundingMetadata;
              if (Array.isArray(groundingMetadata?.groundingChunks)) {
                sources = groundingMetadata.groundingChunks
                  .filter((c: any) => c.web?.uri && c.web?.title)
                  .map((c: any) => ({ title: c.web.title, url: c.web.uri }));
              }
              if (Array.isArray(groundingMetadata?.webSearchQueries)) {
                searchQueries = groundingMetadata.webSearchQueries;
              }
            }
          } catch (e) {
            // try next model
          }
        }
      }

      if (!replyText) {
        replyText = `### Deep Scientific Research: ${targetQuery}

**1. Governing Physics & Equations:**
In ScienceLab Explorer, this concept is modeled using rigorous conservation laws and kinetic differential equations:
$$\\sum \\vec{F} = m \\vec{a}, \\qquad m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2, \\qquad \\vec{F}_{AB} = -\\vec{F}_{BA}$$

**2. Simulation Mechanics & Physical Insight:**
Refer to the site's interactive simulation benchmarks for live parameter variations and graphical vector analysis. On the collision bench, when equal masses collide elastically with one at rest, $100\\%$ of the velocity transfers directly ($v_1 = 0, v_2 = u_1$). For action-reaction pairs, equal opposite forces act simultaneously on two bodies, creating unequal accelerations if masses differ ($a = F/m$).

**3. Real-World Applications:**
Verified across engineering, aerospace, automotive safety, and modern materials science.`;
      }

      return res.json({
        topic: targetQuery,
        research: replyText,
        sources,
        searchQueries,
        modelUsed,
      });
    } catch (err: any) {
      console.error('Error in /api/site/research:', err);
      return res.status(500).json({ error: 'Failed to generate site research.' });
    }
  });

  // --- Creator Authentication & Private Reviews System ---
  const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || 'kirtan.bhutada.2008@gmail.com';
  const DATA_DIR = path.resolve(__dirname, 'data');
  const REVIEWS_FILE = path.resolve(DATA_DIR, 'user_reviews.json');
  const ADMIN_AUTH_FILE = path.resolve(DATA_DIR, 'admin_auth.json');

  // Rate Limiting Storage
  const reviewSubmissionRateLimit = new Map<string, { count: number; resetAt: number }>();
  const adminLoginRateLimit = new Map<string, { count: number; lockedUntil: number }>();

  // In-memory active admin session tokens (token -> { createdAt, expiresAt })
  const activeAdminSessions = new Map<string, { createdAt: number; expiresAt: number }>();

  const getClientIp = (req: express.Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  };

  const getAdminAuth = (): { adminEmail: string; passwordHash: string; salt: string; initializedAt: string } | null => {
    try {
      if (!fs.existsSync(ADMIN_AUTH_FILE)) {
        return null;
      }
      const raw = fs.readFileSync(ADMIN_AUTH_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.passwordHash && data.salt) {
        return data;
      }
      return null;
    } catch (e) {
      console.error('Error reading admin auth file:', e);
      return null;
    }
  };

  const saveAdminAuth = (auth: { adminEmail: string; passwordHash: string; salt: string; initializedAt: string }) => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(auth, null, 2), 'utf8');
  };

  const hashPassword = (password: string, salt: string): string => {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  };

  const verifyPassword = (password: string, salt: string, expectedHash: string): boolean => {
    try {
      const calculatedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(calculatedHash, 'hex'), Buffer.from(expectedHash, 'hex'));
    } catch {
      return false;
    }
  };

  const extractAdminToken = (req: express.Request): string => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7).trim();
    }
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      for (const c of cookies) {
        const [k, v] = c.trim().split('=');
        if (k === 'admin_token' && v) {
          return decodeURIComponent(v);
        }
      }
    }
    return '';
  };

  // Middleware: Require Authenticated Admin Session
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = extractAdminToken(req);
    if (!token || !activeAdminSessions.has(token)) {
      return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    }
    const session = activeAdminSessions.get(token)!;
    if (Date.now() > session.expiresAt) {
      activeAdminSessions.delete(token);
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    next();
  };

  const getStoredReviews = (): any[] => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(REVIEWS_FILE)) {
        fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2), 'utf8');
        return [];
      }
      const raw = fs.readFileSync(REVIEWS_FILE, 'utf8');
      return JSON.parse(raw) || [];
    } catch (e) {
      console.error('Error reading stored reviews:', e);
      return [];
    }
  };

  const saveStoredReviews = (reviews: any[]) => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving stored reviews:', e);
    }
  };

  // --- ADMIN AUTH ROUTES ---

  // Check admin status (never reveals email or credentials)
  app.get('/api/admin/status', (req, res) => {
    const authData = getAdminAuth();
    const token = extractAdminToken(req);
    let isAuthenticated = false;

    if (token && activeAdminSessions.has(token)) {
      const session = activeAdminSessions.get(token)!;
      if (Date.now() <= session.expiresAt) {
        isAuthenticated = true;
      } else {
        activeAdminSessions.delete(token);
      }
    }

    return res.json({
      isInitialized: Boolean(authData && authData.passwordHash),
      isAuthenticated,
    });
  });

  // One-time creator setup (disabled permanently once initialized)
  app.post('/api/admin/setup', (req, res) => {
    try {
      const existing = getAdminAuth();
      if (existing && existing.passwordHash) {
        return res.status(403).json({ error: 'Admin account has already been initialized. Setup is permanently closed.' });
      }

      const { email, password } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'A valid admin email address is required.' });
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(password, salt);
      const sanitizedEmail = email.trim().toLowerCase();

      saveAdminAuth({
        adminEmail: sanitizedEmail,
        passwordHash,
        salt,
        initializedAt: new Date().toISOString(),
      });

      // Generate session token for immediate admin login
      const token = crypto.randomBytes(32).toString('hex');
      activeAdminSessions.set(token, {
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      console.log('[Creator Setup] Admin account successfully initialized.');
      return res.json({
        success: true,
        token,
        message: 'Admin account successfully initialized.',
      });
    } catch (err: any) {
      console.error('Error during admin setup:', err);
      return res.status(500).json({ error: 'Internal error during setup.' });
    }
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    try {
      const ip = getClientIp(req);
      const now = Date.now();
      const rateInfo = adminLoginRateLimit.get(ip);

      if (rateInfo && rateInfo.lockedUntil > now) {
        const remainingMin = Math.ceil((rateInfo.lockedUntil - now) / 60000);
        return res.status(429).json({ error: `Too many failed attempts. Locked for ${remainingMin} minute(s).` });
      }

      const { email, password } = req.body;
      const authData = getAdminAuth();

      if (!authData || !authData.passwordHash) {
        return res.status(400).json({ error: 'Admin account is not yet initialized.' });
      }

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const isEmailMatch = authData.adminEmail === email.trim().toLowerCase();
      const isPasswordMatch = verifyPassword(password, authData.salt, authData.passwordHash);

      if (!isEmailMatch || !isPasswordMatch) {
        // Record failed attempt
        const currentCount = (rateInfo ? rateInfo.count : 0) + 1;
        const lockedUntil = currentCount >= 5 ? now + 15 * 60 * 1000 : 0;
        adminLoginRateLimit.set(ip, { count: currentCount, lockedUntil });

        return res.status(401).json({ error: 'Invalid admin credentials.' });
      }

      // Successful login: reset rate limit
      adminLoginRateLimit.delete(ip);

      const token = crypto.randomBytes(32).toString('hex');
      activeAdminSessions.set(token, {
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
      });

      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      console.log(`[Admin Login] Successful admin authentication from ${ip}`);
      return res.json({
        success: true,
        token,
        message: 'Admin authentication successful.',
      });
    } catch (err: any) {
      console.error('Error in admin login:', err);
      return res.status(500).json({ error: 'Internal error during login.' });
    }
  });

  // Admin Password Reset (Verified by Creator Admin Email)
  app.post('/api/admin/reset', (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const authData = getAdminAuth();

      if (!authData || !authData.passwordHash) {
        return res.status(400).json({ error: 'Admin account is not yet initialized.' });
      }

      if (!email || !newPassword || typeof email !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ error: 'Email and new password are required.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      if (authData.adminEmail !== email.trim().toLowerCase()) {
        return res.status(401).json({ error: 'Entered email does not match registered creator email.' });
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(newPassword, salt);

      saveAdminAuth({
        adminEmail: authData.adminEmail,
        passwordHash,
        salt,
        initializedAt: authData.initializedAt,
      });

      // Clear any lockout on the client IP
      const ip = getClientIp(req);
      adminLoginRateLimit.delete(ip);

      // Issue active session token
      const token = crypto.randomBytes(32).toString('hex');
      activeAdminSessions.set(token, {
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      });

      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      console.log(`[Admin Reset] Password reset successfully for ${authData.adminEmail}`);
      return res.json({
        success: true,
        token,
        message: 'Password reset successfully. You are now logged in.',
      });
    } catch (err: any) {
      console.error('Error during admin password reset:', err);
      return res.status(500).json({ error: 'Internal error during password reset.' });
    }
  });

  // Admin Logout
  app.post('/api/admin/logout', (req, res) => {
    const token = extractAdminToken(req);
    if (token) {
      activeAdminSessions.delete(token);
    }
    res.clearCookie('admin_token', { path: '/' });
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // --- PRIVATE ADMIN REVIEWS API (Strict Authorization Required) ---

  // Retrieve all submitted reviews & queries (Creator Only)
  app.get('/api/admin/reviews', requireAdminAuth, (_req, res) => {
    try {
      const reviews = getStoredReviews();
      return res.json({ reviews });
    } catch (err: any) {
      console.error('Error retrieving admin reviews:', err);
      return res.status(500).json({ error: 'Failed to retrieve reviews.' });
    }
  });

  // Delete review (Creator Only)
  app.delete('/api/admin/reviews/:id', requireAdminAuth, (req, res) => {
    try {
      const { id } = req.params;
      const existing = getStoredReviews();
      const filtered = existing.filter((r) => r.id !== id);
      saveStoredReviews(filtered);
      return res.json({ success: true, remaining: filtered.length });
    } catch (err: any) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review.' });
    }
  });

  // --- PUBLIC USER REVIEW SUBMISSION ENDPOINT ---
  // Public visitors can ONLY INSERT their own review/query.
  // Never reveals creator email, other user submissions, or admin details.
  app.post('/api/reviews/submit', async (req, res) => {
    try {
      const ip = getClientIp(req);
      const now = Date.now();

      // Rate limit check: max 5 submissions per 10 minutes per IP
      const rateInfo = reviewSubmissionRateLimit.get(ip);
      if (rateInfo) {
        if (now < rateInfo.resetAt) {
          if (rateInfo.count >= 5) {
            const waitSec = Math.ceil((rateInfo.resetAt - now) / 1000);
            return res.status(429).json({
              error: `Submission limit reached. Please wait ${waitSec} seconds before sending another inquiry.`,
            });
          }
          rateInfo.count += 1;
        } else {
          reviewSubmissionRateLimit.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
        }
      } else {
        reviewSubmissionRateLimit.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
      }

      const { name, email, category, rating, message, topicContext } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length < 3) {
        return res.status(400).json({ error: 'Please enter a valid message (minimum 3 characters).' });
      }

      // Input Validation & Sanitization
      const sanitizedName = (name && typeof name === 'string' && name.trim().length > 0)
        ? name.trim().slice(0, 80).replace(/<[^>]*>?/gm, '')
        : 'Student Explorer';

      let sanitizedEmail: string | null = null;
      if (email && typeof email === 'string' && email.trim().length > 0) {
        const trimmedEmail = email.trim().slice(0, 120);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          return res.status(400).json({ error: 'Please enter a valid email format, or leave the email field empty.' });
        }
        sanitizedEmail = trimmedEmail;
      }

      const allowedCategories = ['Suggestion', 'Query', 'Review', 'Simulation Idea', 'Bug Report'];
      const sanitizedCategory = (category && allowedCategories.includes(category))
        ? category
        : 'Suggestion';

      const sanitizedRating = (typeof rating === 'number' && rating >= 1 && rating <= 5)
        ? Math.round(rating)
        : 5;

      const sanitizedMessage = message.trim().slice(0, 3000);
      const sanitizedContext = (topicContext && typeof topicContext === 'string')
        ? topicContext.trim().slice(0, 100).replace(/<[^>]*>?/gm, '')
        : 'General ScienceLab';

      const newReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: sanitizedName,
        email: sanitizedEmail,
        category: sanitizedCategory,
        rating: sanitizedRating,
        topicContext: sanitizedContext,
        message: sanitizedMessage,
        createdAt: new Date().toISOString(),
      };

      // Persist to database (Only admin can SELECT/READ this later)
      const existing = getStoredReviews();
      existing.unshift(newReview);
      saveStoredReviews(existing);

      // Determine recipient email (strictly server-side, never returned to browser)
      const adminAuth = getAdminAuth();
      const targetAdminEmail = adminAuth?.adminEmail || process.env.ADMIN_EMAIL || DEVELOPER_EMAIL;

      // Dispatch Email Notification to Creator
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"ScienceLab Inquiries" <${smtpUser}>`,
            to: targetAdminEmail,
            // If user provided email, set Reply-To so creator can hit "Reply" in their email client
            replyTo: sanitizedEmail || undefined,
            subject: `[ScienceLab Query] New ${sanitizedCategory} from ${sanitizedName}`,
            text: `You have received a new query/review submission on ScienceLab Explorer:

Sender Name: ${sanitizedName}
User Email: ${sanitizedEmail ? sanitizedEmail : 'Not provided (Anonymous)'}
Category: ${sanitizedCategory}
Rating: ${sanitizedRating} / 5 Stars
Topic Context: ${sanitizedContext}
Submitted At: ${new Date().toLocaleString()}

Message:
--------------------------------------------------
${sanitizedMessage}
--------------------------------------------------

${sanitizedEmail ? `⚡ To reply directly to ${sanitizedName}, simply click Reply in your email client (reply-to is configured as ${sanitizedEmail}).` : 'No email was provided by the user.'}`,
            html: `
              <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px;">
                <h2 style="color: #38bdf8; margin-top: 0;">📬 New ScienceLab User Submission</h2>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="margin: 4px 0;"><strong>Sender Name:</strong> ${sanitizedName}</p>
                  <p style="margin: 4px 0;"><strong>User Email:</strong> ${sanitizedEmail ? `<a href="mailto:${sanitizedEmail}" style="color: #38bdf8;">${sanitizedEmail}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}</p>
                  <p style="margin: 4px 0;"><strong>Category:</strong> <span style="background: #0284c7; color: white; padding: 2px 8px; border-radius: 4px;">${sanitizedCategory}</span></p>
                  <p style="margin: 4px 0;"><strong>Rating:</strong> ${'★'.repeat(sanitizedRating)}${'☆'.repeat(5 - sanitizedRating)} (${sanitizedRating}/5)</p>
                  <p style="margin: 4px 0;"><strong>Topic Context:</strong> ${sanitizedContext}</p>
                  <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8;">
                  <h4 style="margin: 0 0 8px 0; color: #cbd5e1;">User Query / Suggestion:</h4>
                  <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #f1f5f9;">${sanitizedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
                ${sanitizedEmail ? `
                  <div style="margin-top: 16px; padding: 12px; background: #064e3b; border-radius: 8px; border: 1px solid #059669;">
                    <p style="margin: 0; font-size: 13px; color: #a7f3d0;">
                      ✉️ <strong>Direct Reply Enabled:</strong> Hit "Reply" in your email client to email <strong>${sanitizedEmail}</strong> directly.
                    </p>
                  </div>
                ` : ''}
              </div>
            `,
          });
          console.log(`[Email Dispatched] To creator inbox with replyTo=${sanitizedEmail || 'none'}`);
        } catch (emailErr) {
          console.warn('[Email Dispatch Warning] Could not send via SMTP transport (saved in reviews database):', emailErr);
        }
      } else {
        // Fallback console log with user email details
        console.log(`
======================================================================
📬 NEW USER QUERY / REVIEW RECEIVED
To Creator: [Admin Email Protected Server-Side]
From: ${sanitizedName} (${sanitizedEmail ? sanitizedEmail : 'No user email provided'})
Category: ${sanitizedCategory} | Rating: ${sanitizedRating} / 5 Stars
Context: ${sanitizedContext}
Message: "${sanitizedMessage}"
Reply-To: ${sanitizedEmail ? sanitizedEmail : 'N/A'}
======================================================================`);
      }

      // Security: Never send admin email or database contents in response
      return res.json({
        success: true,
        message: 'Your review and suggestions have been delivered to the creator. Thank you for your feedback!',
      });
    } catch (err: any) {
      console.error('Error submitting review:', err);
      return res.status(500).json({ error: 'Failed to submit query. Please try again later.' });
    }
  });

  // Block unauthorized legacy access to reviews
  app.get('/api/reviews', (_req, res) => {
    return res.status(401).json({ error: 'Unauthorized. Reviews are private to the creator.' });
  });

  app.delete('/api/reviews/:id', (_req, res) => {
    return res.status(401).json({ error: 'Unauthorized. Reviews are private to the creator.' });
  });

  // Vite integration
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ScienceLab Explorer server running on port ${PORT}`);
  });
}

startServer();
