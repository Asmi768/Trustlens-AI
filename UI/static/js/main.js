// LatentID Main Application Logic
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Unified Tool Result Renderer
     * Takes backend response and renders an elegant intelligence analysis
     */
    const showResult = (elementId, data) => {
        const el = document.getElementById(elementId);
        el.style.display = 'block';
        
        // Map Risk Levels to visual semantics
        let typeClass = 'safe';
        let riskStr = data.risk_level ? data.risk_level.toLowerCase() : '';
        let statusStr = data.status ? data.status.toLowerCase() : '';

        if (riskStr.includes('medium') || riskStr.includes('uncertain')) typeClass = 'warning';
        if (riskStr.includes('high') || statusStr.includes('fake') || statusStr.includes('phish') || statusStr.includes('toxic')) typeClass = 'danger';
        
        el.className = `result-box ${typeClass}`;
        
        // Structured HTML block matching the Unified AI Explanation Engine UI
        el.innerHTML = `
            <div class="result-item"><span class="result-label">Status:</span> 
                <span class="result-val" style="color:var(--text-dark); font-weight:500;">${data.status}</span>
            </div>
            <div class="result-item"><span class="result-label">Risk Level:</span> 
                <span class="result-val">${data.risk_level}</span>
            </div>
            <div class="result-item"><span class="result-label">Explanation:</span> 
                <span class="result-val">${data.explanation.replace(/\\n/g, '<br>')}</span>
            </div>
            <div class="result-item" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.05);">
                <span class="result-label">AI Recommendation:</span> 
                <span class="result-val" style="font-weight:600; color:var(--text-dark);">${data.action}</span>
            </div>
        `;

        // If it's a file download response (Image Protection)
        if (data.download_url) {
            el.innerHTML += `
            <div class="result-item" style="margin-top:16px;">
                <a href="${data.download_url}" download class="primary-btn" style="display:block; text-align:center; text-decoration:none;">
                    Download Protected File
                </a>
            </div>`;
        }
    };

    /**
     * Module 1: Image Protection Logic
     */
    const uploadArea = document.getElementById('image-upload-area');
    const imageInput = document.getElementById('image-input');
    const previewArea = document.getElementById('image-preview-area');
    const previewImg = document.getElementById('image-preview');
    const btnProtect = document.getElementById('btn-protect');
    const processingOverlay = document.getElementById('image-processing');
    const processingText = document.getElementById('processing-text');
    let selectedFile = null;

    // Trigger file selection via custom button/area
    uploadArea.addEventListener('click', () => imageInput.click());
    
    // Drag and Drop styling
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--acc-blue)';
        uploadArea.style.background = 'rgba(255,255,255,0.9)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'rgba(0,0,0,0.15)';
        uploadArea.style.background = 'rgba(255,255,255,0.4)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0,0,0,0.15)';
        uploadArea.style.background = 'rgba(255,255,255,0.4)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageSelection(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImageSelection(e.target.files[0]);
        }
    });

    function handleImageSelection(file) {
        if (!file.type.startsWith('image/')) {
            alert("Please select a valid image file.");
            return;
        }
        selectedFile = file;
        
        // Show local preview smoothly
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadArea.style.display = 'none';
            previewArea.style.display = 'block';
            btnProtect.disabled = false;
            document.getElementById('image-result').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Protection Trigger
    btnProtect.addEventListener('click', async () => {
        if (!selectedFile) return;
        
        btnProtect.disabled = true;
        processingOverlay.classList.add('active');
        
        // UX Phase: Simulate deep analysis processing stages visually
        const stages = [
            "Analyzing image tensors...", 
            "Detecting precise identity features...", 
            "Injecting latent adversarial noise...", 
            "Finalizing safe output..."
        ];
        
        let abortWait = false;
        const seqPromise = (async () => {
            for(let i=0; i<stages.length; i++) {
                if(abortWait) break;
                processingText.textContent = stages[i];
                await new Promise(r => setTimeout(r, 600)); // Delay for visuals
            }
        })();

        // Network Request
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await fetch('/api/upload_image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            abortWait = true; 
            await seqPromise; // sync the sequence visually

            processingOverlay.classList.remove('active');
            btnProtect.disabled = false;
            
            if (data.error) {
                alert("Error: " + data.error);
                return;
            }
            showResult('image-result', data);
        } catch (err) {
            console.error(err);
            abortWait = true;
            processingOverlay.classList.remove('active');
            btnProtect.disabled = false;
            alert("Connection error occurred.");
        }
    });


    /**
     * Module 2: Phishing & URL Scanner
     */
    const btnScanUrl = document.getElementById('btn-scan-url');
    btnScanUrl.addEventListener('click', async () => {
        const url = document.getElementById('url-input').value.trim();
        if(!url) return;
        
        btnScanUrl.textContent = "Analyzing Topology...";
        btnScanUrl.disabled = true;

        try {
            const res = await fetch('/api/analyze_url', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url})
            });
            const data = await res.json();
            showResult('url-result', data);
        } catch (err) {
            console.error(err);
        }
        
        btnScanUrl.textContent = "Analyze URL";
        btnScanUrl.disabled = false;
    });


    /**
     * Module 3: Fake News Detector
     */
    const btnDetectNews = document.getElementById('btn-detect-news');
    btnDetectNews.addEventListener('click', async () => {
        const text = document.getElementById('news-input').value.trim();
        if(!text) return;
        
        btnDetectNews.textContent = "Running Semantic Analysis...";
        btnDetectNews.disabled = true;

        try {
            const res = await fetch('/api/detect_news', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text})
            });
            const data = await res.json();
            showResult('news-result', data);
        } catch (err) {
            console.error(err);
        }
        
        btnDetectNews.textContent = "Verify Authenticity";
        btnDetectNews.disabled = false;
    });


    /**
     * Module 4: Toxicity & AI Text Detection
     */
    const btnAnalyzeText = document.getElementById('btn-analyze-text');
    btnAnalyzeText.addEventListener('click', async () => {
        const text = document.getElementById('toxicity-input').value.trim();
        if(!text) return;

        btnAnalyzeText.textContent = "Processing Text Sequences...";
        btnAnalyzeText.disabled = true;

        try {
            const res = await fetch('/api/analyze_text', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text})
            });
            const data = await res.json();
            showResult('text-result', data);
        } catch (err) {
            console.error(err);
        }
        
        btnAnalyzeText.textContent = "Analyze Content";
        btnAnalyzeText.disabled = false;
    });

});
