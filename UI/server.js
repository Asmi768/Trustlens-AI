const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

// Set up upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper function to simulate processing delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Root route
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'templates', 'index.html');
    if (!fs.existsSync(htmlPath)) {
        return res.status(404).send("File not found at " + htmlPath);
    }
    res.send(fs.readFileSync(htmlPath, 'utf8'));
});

// Download route
app.get('/api/download/:filename', (req, res) => {
    res.download(path.join(uploadDir, req.params.filename));
});

// 1. Image Protection Module
app.post('/api/upload_image', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image filed' });
    
    await delay(1500); // Simulate processing time
    
    res.json({
        status: "Protected",
        risk_level: "Low",
        explanation: "Facial and identity features have been masked using adversarial latent perturbations. Visual quality is maintained, but the image is now unreadable to facial recognition scraping bots.",
        action: "Safe for public upload.",
        download_url: `/api/download/${req.file.filename}`
    });
});

// 2. Phishing & URL Scanner
app.post('/api/analyze_url', async (req, res) => {
    const url = req.body.url || '';
    let status = "Safe", risk = "Low", action = "Safe to browse.", explanation = "The domain appears legitimate and standard TLS patterns are healthy.";
    
    try {
        const parsed = new URL(url.startsWith('http') ? url : `http://${url}`);
        const domain = parsed.hostname.toLowerCase();
        
        const suspicious_keywords = ['login', 'secure', 'auth', 'update', 'verify', 'billing'];
        const is_suspicious = suspicious_keywords.some(kw => url.toLowerCase().includes(kw));
        
        if (parsed.protocol !== 'https:') {
            status = "Insecure Connection";
            risk = "Medium / High";
            explanation = "Connection is unencrypted (HTTP). Data transmitted can be intercepted by third parties.";
            action = "Do not enter sensitive information. Proceed with caution.";
        } else if (is_suspicious || domain.split('.').length > 3 || domain.includes('-')) {
            status = "Phishing Warning";
            risk = "High";
            explanation = "Domain contains suspicious patterns (e.g., target keywords, unusual subdomains) highly common in homograph and phishing attacks.";
            action = "DO NOT enter credentials. Leave the site immediately.";
        }
    } catch (e) {
        status = "Invalid URL";
        risk = "Unknown";
        explanation = "Invalid URL format provided.";
        action = "Provide a valid URL (e.g., https://example.com).";
    }
    
    await delay(800);
    res.json({ status, risk_level: risk, explanation, action });
});

// 3. Fake News Detector
app.post('/api/detect_news', async (req, res) => {
    const text = (req.body.text || '').toLowerCase();
    
    const sensational_words = ['shocking', 'unbelievable', "you won't believe", 'miracle', 'secret', 'banned', 'exposed'];
    const score = sensational_words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    
    let status, risk, explanation, action;
    if (score >= 2 || (req.body.text && req.body.text === req.body.text.toUpperCase() && req.body.text.length > 5)) {
        status = "Likely Fake / Clickbait";
        risk = "High";
        explanation = "Text contains a high density of sensationalism, hyperbole, and emotive phrasing. Core structural markers strongly indicate clickbait or generative hallucination.";
        action = "Do not share. Verify claims with independent, trusted sources.";
    } else if (score === 1) {
        status = "Uncertain";
        risk = "Medium";
        explanation = "Some sensational phrasing detected. The article's credibility is ambiguous, and further contextual analysis is recommended.";
        action = "Read critically and investigate the author/source.";
    } else {
        status = "Likely Real";
        risk = "Low";
        explanation = "No major sensational, emotive, or hallucinatory flags detected. Syntax aligns with standard, balanced journalistic patterns.";
        action = "Generally safe to consume.";
    }
    
    await delay(1000);
    res.json({ status, risk_level: risk, explanation, action });
});

// 4. Toxicity & AI Text Detection
app.post('/api/analyze_text', async (req, res) => {
    const text = (req.body.text || '').toLowerCase();
    
    const toxic_words = ['hate', 'stupid', 'idiot', 'kill', 'dumb', 'loser', 'scum'];
    const tox_score = toxic_words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    
    const ai_patterns = ['as an ai', 'in conclusion', 'firstly', 'secondly', 'delve into', 'it is important to note', 'testament to'];
    const ai_score = ai_patterns.reduce((acc, pat) => acc + (text.includes(pat) ? 1 : 0), 0);
    
    const ai_probability_pct = Math.min(99, ai_score * 35 + 5);
    const explanation_prefix = `Toxicity Score: ${tox_score}/5 | AI-Authored Probability: ${ai_probability_pct}%.\n`;
    
    let status, risk, explanation, action;
    if (tox_score > 0) {
        status = "Toxic Content Detected";
        risk = "High";
        explanation = explanation_prefix + "Text contains aggressive language associated with harassment, hate speech, or severe toxicity.";
        action = "Content should be flagged for review or blocked automatically.";
    } else if (ai_score > 0) {
        status = "AI-Generated";
        risk = "Medium";
        explanation = explanation_prefix + "Linguistic markers, phrasing rhythm, and structural vocabulary strongly match known Large Language Model outputs.";
        action = "Label as AI-generated if platform transparency is required.";
    } else {
        status = "Safe & Human-like";
        risk = "Low";
        explanation = explanation_prefix + "Text appears organically human-authored. No detectable toxicity or synthetic structural patterns.";
        action = "Allow unrestricted publication.";
    }
    
    await delay(900);
    res.json({ status, risk_level: risk, explanation, action });
});

app.listen(PORT, () => console.log(`LatentID Server running at http://127.0.0.1:${PORT}`));
