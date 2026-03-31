You are a senior full-stack software engineer, cybersecurity analyst, and product designer with 25+ years of experience building premium-grade AI platforms.

Your task is to generate a COMPLETE, production-quality prototype web application called:

“LatentID – AI Trust & Safety Suite”

This is NOT a basic demo. It must feel like a high-end, Apple-level product with clean architecture, elegant UI, and real-world usability.

---

🎯 PRODUCT VISION

LatentID is an AI-powered cybersecurity and digital trust platform that helps users detect, prevent, and understand modern AI-driven threats.

It should be usable by:

- General users
- Developers
- Students

The experience must feel:

- Premium
- Minimal
- Futuristic
- Trustworthy

---

🧩 CORE MODULES (ALL MUST EXIST)

1. 🖼️ Image Protection (LatentID Core)

- Upload image (drag & drop + click)
- Preview instantly
- Apply “AI Protection” (simulate adversarial perturbation)
- Maintain visual quality
- Show processing stages:
  - Analyzing image
  - Detecting identity features
  - Applying latent protection
  - Finalizing output
- Show before/after comparison
- Allow download (no compression loss)

---

2. 🔗 Phishing & URL Scanner

- Input: URL
- Output:
  - Safe / Suspicious / Dangerous
  - Reason (rule-based + AI explanation)
- Include:
  - Domain pattern checks
  - HTTPS check
  - Suspicious keywords
- Add QR Code scanning support (simulate or basic decode)

---

3. 📰 Fake News Detector

- Input: text or news URL
- Output:
  - Likely Real / Fake / Uncertain
- Use:
  - AI summarization (Gemini API)
  - Heuristic checks (sensational words, source credibility)

---

4. 💬 Toxicity & AI Text Detection

- Input: text
- Output:
  - Toxicity score
  - AI-generated probability
- Use:
  - Keyword heuristics + Gemini explanation

---

5. 🧠 Unified AI Explanation Engine

Every module must provide:

- Clear explanation
- Risk level
- Suggested action

---

🎨 UI / UX REQUIREMENTS

Design must feel like:

- Apple + Glassmorphism + AI research lab

Visual Style:

- Soft gradients (silver, off-white, light gray)
- Frosted glass cards
- Subtle shadows
- Rounded corners (16px+)
- No harsh blacks

Layout:

- Hero section: “LatentID”
- Modular cards for each tool
- Smooth scrolling single-page app

Animations:

- Fade-in
- Soft slide transitions
- Hover elevation
- Progress loaders

---

📱 RESPONSIVENESS

- Mobile-first
- Fully responsive
- Touch-friendly UI

---

⚙️ TECH STACK

Frontend:

- HTML5
- CSS3 (Flexbox/Grid)
- Vanilla JS (or minimal framework)

Backend:

- Python (Flask)

AI Integration:

- Gemini API (for explanations, summaries)

---

🔧 FUNCTIONAL REQUIREMENTS

- Real file upload handling
- Real-time preview
- Simulated but believable AI processing
- Clean modular backend routes:
  - /upload_image
  - /analyze_url
  - /analyze_text
  - /detect_news

---

🧪 IMPLEMENTATION STRATEGY

IMPORTANT:

- Do NOT overcomplicate ML models
- Use:
  - Rule-based detection
  - Lightweight processing
  - Gemini API for intelligence layer

The system should FEEL intelligent, even if partially simulated.

---

💎 OUTPUT EXPECTATION

Generate:

1. Complete Flask backend
2. Clean frontend UI
3. All modules working end-to-end
4. Beautiful styling (glassmorphism)
5. Download functionality
6. Modular, readable code

---

🚫 CONSTRAINTS

- No login system
- No heavy frameworks
- Keep performance smooth
- Avoid unnecessary complexity

---

🎯 FINAL GOAL

The final product should look like:
“A premium AI cybersecurity product that could realistically be turned into a startup.”

NOT a hackathon toy.

---

Now generate the FULL working code
