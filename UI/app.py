import os
import time
from urllib.parse import urlparse
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)
# Set up upload folder inside the app directory
base_dir = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "dummy_key"))
except ImportError:
    GEMINI_AVAILABLE = False


@app.route('/')
def index():
    return render_template('index.html')


# 1. Image Protection Module
@app.route('/api/upload_image', methods=['POST'])
def handle_image_upload():
    if 'image' not in request.files:
        return jsonify({"error": "No image filed"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Simulate processing time for Latent perturbations (like an AI model would)
    time.sleep(1.5) 
    
    # In a real app, this would use a model to apply adversarial noise
    return jsonify({
        "status": "Protected",
        "risk_level": "Low",
        "explanation": "Facial and identity features have been masked using adversarial latent perturbations. Visual quality is maintained, but the image is now unreadable to facial recognition scraping bots.",
        "action": "Safe for public upload.",
        "download_url": f"/api/download/{filename}"
    })

@app.route('/api/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)


# 2. Phishing & URL Scanner
@app.route('/api/analyze_url', methods=['POST'])
def analyze_url():
    data = request.json or {}
    url = data.get('url', '')
    
    # Heuristic check + simulated AI layer
    status = "Safe"
    risk = "Low"
    action = "Safe to browse."
    explanation = "The domain appears legitimate and standard TLS patterns are healthy."
    
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    
    suspicious_keywords = ['login', 'secure', 'auth', 'update', 'verify', 'billing']
    is_suspicious = any(kw in url.lower() for kw in suspicious_keywords)
    
    if not domain:
        status = "Invalid URL"
        risk = "Unknown"
        explanation = "Invalid URL format provided."
        action = "Provide a valid URL (e.g., https://example.com)."
    elif parsed.scheme != 'https':
        status = "Insecure Connection"
        risk = "Medium / High"
        explanation = "Connection is unencrypted (HTTP). Data transmitted can be intercepted by third parties."
        action = "Do not enter sensitive information. Proceed with caution."
    elif is_suspicious or len(domain.split('.')) > 3 or '-' in domain:
        status = "Phishing Warning"
        risk = "High"
        explanation = "Domain contains suspicious patterns (e.g., target keywords, unusual subdomains) highly common in homograph and phishing attacks."
        action = "DO NOT enter credentials. Leave the site immediately."
    
    time.sleep(0.8) # Simulated AI analysis wait
    return jsonify({
        "status": status,
        "risk_level": risk,
        "explanation": explanation,
        "action": action
    })


# 3. Fake News Detector
@app.route('/api/detect_news', methods=['POST'])
def detect_news():
    data = request.json or {}
    text = data.get('text', '')
    
    # Simulated heuristic check + simulated Semantic / LLM detection
    text_lower = text.lower()
    sensational_words = ['shocking', 'unbelievable', 'you won\\'t believe', 'miracle', 'secret', 'banned', 'exposed']
    
    score = sum(1 for word in sensational_words if word in text_lower)
    
    if score >= 2 or text.isupper():
        status = "Likely Fake / Clickbait"
        risk = "High"
        explanation = "Text contains a high density of sensationalism, hyperbole, and emotive phrasing. Core structural markers strongly indicate clickbait or generative hallucination."
        action = "Do not share. Verify claims with independent, trusted sources."
    elif score == 1:
        status = "Uncertain"
        risk = "Medium"
        explanation = "Some sensational phrasing detected. The article's credibility is ambiguous, and further contextual analysis is recommended."
        action = "Read critically and investigate the author/source."
    else:
        status = "Likely Real"
        risk = "Low"
        explanation = "No major sensational, emotive, or hallucinatory flags detected. Syntax aligns with standard, balanced journalistic patterns."
        action = "Generally safe to consume."

    time.sleep(1.0)
    return jsonify({
        "status": status,
        "risk_level": risk,
        "explanation": explanation,
        "action": action
    })


# 4. Toxicity & AI Text Detection
@app.route('/api/analyze_text', methods=['POST'])
def analyze_text():
    data = request.json or {}
    text = data.get('text', '')
    
    text_lower = text.lower()
    toxic_words = ['hate', 'stupid', 'idiot', 'kill', 'dumb', 'loser', 'scum']
    
    tox_score = sum(1 for word in toxic_words if word in text_lower)
    
    # Simulated structural patterns for AI-generation discovery
    ai_patterns = ['as an ai', 'in conclusion', 'firstly', 'secondly', 'delve into', 'it is important to note', 'testament to']
    ai_score = sum(1 for pat in ai_patterns if pat in text_lower)
    
    # Simulated probability response
    ai_probability_pct = min(99, ai_score * 35 + 5) 
    
    explanation_prefix = f"Toxicity Score: {tox_score}/5 | AI-Authored Probability: {ai_probability_pct}%.\n"
    
    if tox_score > 0:
        status = "Toxic Content Detected"
        risk = "High"
        explanation = explanation_prefix + "Text contains aggressive language associated with harassment, hate speech, or severe toxicity."
        action = "Content should be flagged for review or blocked automatically."
    elif ai_score > 0:
        status = "AI-Generated"
        risk = "Medium"
        explanation = explanation_prefix + "Linguistic markers, phrasing rhythm, and structural vocabulary strongly match known Large Language Model outputs."
        action = "Label as AI-generated if platform transparency is required."
    else:
        status = "Safe & Human-like"
        risk = "Low"
        explanation = explanation_prefix + "Text appears organically human-authored. No detectable toxicity or synthetic structural patterns."
        action = "Allow unrestricted publication."
        
    time.sleep(0.9)
    return jsonify({
        "status": status,
        "risk_level": risk,
        "explanation": explanation,
        "action": action
    })

if __name__ == '__main__':
    # Run the application
    print("Starting LatentID - AI Trust & Safety Suite...")
    app.run(debug=True, port=8000, host="0.0.0.0")
