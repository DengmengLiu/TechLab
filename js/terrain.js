(function() {
    
    // --- Global Configuration for Steps ---
    // Defines total steps for each section and where it links next
    const stepConfig = {
        'pure-random': { 
            total: 3, 
            nextSection: 'smoothing', 
            buttonTexts: ['Next: What Happens? 👇', 'Next Page →'] 
        },
        'smoothing': { 
            total: 3, 
            nextSection: 'value-noise', 
            buttonTexts: ['Show Result 👇', 'Next Page →'] 
        },
        'value-noise': { 
            total: 3, 
            nextSection: 'perlin-transition', 
            buttonTexts: ['See Visualization 👇', 'Find a Better Solution →'] 
        },
        'perlin-transition': { 
            total: 3, 
            nextSection: 'fbm-intro', 
            buttonTexts: ['See the Result 👇', 'Enter FBM →'] 
        },
        'fbm-intro': { 
            total: 2, 
            nextSection: 'fbm-mixer', 
            buttonTexts: ['Let\'s Tune It →'] 
        }
    };

    // Tracks current step for each section (default is 1)
    const currentSteps = {
        'pure-random': 1,
        'smoothing': 1,
        'value-noise': 1,
        'perlin-transition': 1,
        'fbm-intro': 1
    };

    // --- Global Navigation & Interaction Functions ---
    
    window.switchSection = function(id) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.add('hidden');
            sec.classList.remove('animate-fade-in'); 
        });

        // Show target section
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
            void target.offsetWidth; 
            target.classList.add('animate-fade-in');
        }

        // Update sidebar
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('nav-active'));
        const activeBtn = document.getElementById('btn-' + id);
        if (activeBtn) activeBtn.classList.add('nav-active');

        // Reset steps for this section if it has steps
        if (stepConfig[id]) {
            resetSteps(id);
        }

        // Render Canvas Logic
        if (id === 'pure-random') requestAnimationFrame(() => drawStatic('canvas-pure-random'));
        if (id === 'smoothing') requestAnimationFrame(() => drawSmooth('canvas-smoothing'));
        if (id === 'perlin-transition') requestAnimationFrame(() => renderPerlinSingle('canvas-perlin-single'));
        if (id === 'fbm-intro') requestAnimationFrame(() => renderFBMCompareRefs());
    };

    // Generic Step Handler
    window.handleNextStep = function(sectionId) {
        const config = stepConfig[sectionId];
        let step = currentSteps[sectionId];

        // If we are at the last step, go to next section
        if (step >= config.total) {
            window.switchSection(config.nextSection);
            return;
        }

        // Increment step
        step++;
        currentSteps[sectionId] = step;

        // Reveal the element for this step
        // We use 'display: none' via inline style for hiding, so removing it reveals
        const stepEl = document.getElementById(sectionId === 'pure-random' ? `pr-step-${step}` : 
                                               sectionId === 'smoothing' ? `sm-step-${step}` :
                                               sectionId === 'value-noise' ? `vn-step-${step}` :
                                               sectionId === 'perlin-transition' ? `pt-step-${step}` :
                                               sectionId === 'fbm-intro' ? `fbm-step-${step}` : null);
        
        if (stepEl) {
            stepEl.style.display = ''; 
            stepEl.classList.add('animate-fade-in');
        }

        // Update Button Text
        const btn = document.getElementById(`btn-${sectionId}-next`);
        if (btn) {
            // Logic to pick button text based on remaining steps
            // If it's the last step now visible, show the "Next Page" text (last in array)
            // Otherwise show intermediate text (first in array or specific index if we expanded array)
            if (step === config.total) {
                btn.innerText = config.buttonTexts[config.buttonTexts.length - 1];
                btn.classList.remove('bg-stone-800', 'hover:bg-stone-700');
                btn.classList.add('bg-orange-600', 'hover:bg-orange-700');
            } else {
                // Keep default style or intermediate text
                btn.innerText = config.buttonTexts[0]; 
            }
        }
    };

    function resetSteps(sectionId) {
        const config = stepConfig[sectionId];
        currentSteps[sectionId] = 1;

        // Hide all steps > 1
        for (let i = 2; i <= config.total; i++) {
            const elId = sectionId === 'pure-random' ? `pr-step-${i}` : 
                         sectionId === 'smoothing' ? `sm-step-${i}` :
                         sectionId === 'value-noise' ? `vn-step-${i}` :
                         sectionId === 'perlin-transition' ? `pt-step-${i}` :
                         sectionId === 'fbm-intro' ? `fbm-step-${i}` : null;
            const el = document.getElementById(elId);
            if (el) {
                el.style.display = 'none';
                el.classList.remove('animate-fade-in');
            }
        }

        // Reset Button
        const btn = document.getElementById(`btn-${sectionId}-next`);
        if (btn) {
            btn.innerText = config.buttonTexts[0];
            btn.classList.add('bg-stone-800', 'hover:bg-stone-700');
            btn.classList.remove('bg-orange-600', 'hover:bg-orange-700');
        }
    }


    // --- Drawing & Algorithm Core ---

    window.drawStatic = function(canvasId) {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        const imgData = ctx.createImageData(w, h);
        const buffer = new Uint32Array(imgData.data.buffer);
        for(let i=0; i<buffer.length; i++) {
            const val = Math.random() * 255;
            buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
        }
        ctx.putImageData(imgData, 0, 0);
    };

    window.drawSmooth = function(canvasId) {
        const canvas = document.getElementById(canvasId);
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        const scale = 20; 
        const sw = w/scale, sh = h/scale;
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = sw; smallCanvas.height = sh;
        const sCtx = smallCanvas.getContext('2d');
        const sImg = sCtx.createImageData(sw, sh);
        const sBuf = new Uint32Array(sImg.data.buffer);
        for(let i=0; i<sBuf.length; i++) {
            const val = Math.random() * 255;
            sBuf[i] = (255 << 24) | (val << 16) | (val << 8) | val;
        }
        sCtx.putImageData(sImg, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(smallCanvas, 0, 0, w, h);
    };

    const perm = new Uint8Array(512);
    const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54, 65,25,63,161,1,216,80,73,209,76,132,187,208, 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    for(let i=0; i<256; i++) perm[i] = perm[i+256] = p[i];

    function fade(t) { return t*t*t*(t*(t*6-15)+10); }
    function lerp(t, a, b) { return a + t*(b-a); }
    function grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h<8 ? x : y, v = h<4 ? y : h==12||h==14 ? x : z;
        return ((h&1)==0?u:-u) + ((h&2)==0?v:-v);
    }
    function noise(x, y, z) {
        const X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = fade(x), v = fade(y), w = fade(z);
        const A = perm[X]+Y, AA = perm[A]+Z, AB = perm[A+1]+Z, B = perm[X+1]+Y, BA = perm[B]+Z, BB = perm[B+1]+Z;
        return lerp(w, lerp(v, lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x-1, y, z)), lerp(u, grad(perm[AB], x, y-1, z), grad(perm[BB], x-1, y-1, z))), lerp(v, lerp(u, grad(perm[AA+1], x, y, z-1), grad(perm[BA+1], x-1, y, z-1)), lerp(u, grad(perm[AB+1], x, y-1, z-1), grad(perm[BB+1], x-1, y-1, z-1))));
    }

    function fbm(x, y, octaves) {
        let t = 0, amp = 1, freq = 1, max = 0;
        for(let i=0; i<octaves; i++) {
            t += noise(x*freq, y*freq, 0) * amp;
            max += amp; amp *= 0.5; freq *= 2;
        }
        return (t/max) + 0.5;
    }

    window.renderPerlinSingle = function(canvasId) {
        const cvs = document.getElementById(canvasId);
        if(!cvs) return;
        const ctx = cvs.getContext('2d');
        const img = ctx.createImageData(300, 300);
        const buf = new Uint32Array(img.data.buffer);
        const scale = 0.02;
        for(let y=0; y<300; y++) {
            for(let x=0; x<300; x++) {
                let v = (noise(x*scale, y*scale, 0) + 1)/2; 
                v = Math.max(0, Math.min(1, v));
                const val = Math.floor(v*255);
                buf[y*300+x] = (255<<24)|(val<<16)|(val<<8)|val;
            }
        }
        ctx.putImageData(img, 0, 0);
    };

    window.renderFBMCompareRefs = function() {
        const c1 = document.getElementById('canvas-no-fbm-ref');
        const c2 = document.getElementById('canvas-with-fbm-ref');
        if(!c1 || !c2) return;
        
        c1.width = 300; c1.height = 300;
        c2.width = 300; c2.height = 300;
        const ctx1 = c1.getContext('2d');
        const ctx2 = c2.getContext('2d');
        const b1 = new Uint32Array(ctx1.createImageData(300,300).data.buffer);
        const b2 = new Uint32Array(ctx2.createImageData(300,300).data.buffer);
        const scale = 0.02;

        for(let y=0; y<300; y++) {
            for(let x=0; x<300; x++) {
                const idx = y*300+x;
                let v1 = (noise(x*scale, y*scale, 0)+1)/2;
                v1 = Math.max(0, Math.min(1, v1));
                const val1 = Math.floor(v1*255);
                b1[idx] = (255<<24)|(val1<<16)|(val1<<8)|val1;

                let v2 = fbm(x*scale, y*scale, 6);
                v2 = Math.pow(v2, 1.2); 
                v2 = Math.max(0, Math.min(1, v2));
                const val2 = Math.floor(v2*255);
                b2[idx] = (255<<24)|(val2<<16)|(val2<<8)|val2;
            }
        }
        const i1 = ctx1.createImageData(300,300); i1.data.set(new Uint8ClampedArray(b1.buffer)); ctx1.putImageData(i1, 0, 0);
        const i2 = ctx2.createImageData(300,300); i2.data.set(new Uint8ClampedArray(b2.buffer)); ctx2.putImageData(i2, 0, 0);
    };

    // D. FBM Mixer Chart (Chart.js)
    const fbmCtx = document.getElementById('fbm-chart').getContext('2d');
    const labels = Array.from({length: 200}, (_, i) => i);
    function genWave(amp, freq, phase = 0) { return labels.map(x => Math.sin((x * freq * 0.1) + phase) * amp); }
    const bassInput = document.getElementById('bass-range');
    const midInput = document.getElementById('mid-range');
    const trebleInput = document.getElementById('treble-range');
    
    const fbmChart = new Chart(fbmCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Composite Terrain', data: [], borderColor: '#ea580c', borderWidth: 3, pointRadius: 0, tension: 0.4, fill: true, backgroundColor: 'rgba(234, 88, 12, 0.1)' },
                { label: 'Bass', data: [], borderColor: '#44403c', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, tension: 0.4 },
                { label: 'Mids', data: [], borderColor: '#0d9488', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, tension: 0.4 },
                { label: 'Treble', data: [], borderColor: '#ca8a04', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, tension: 0.4 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' }, scales: { x: { display: false }, y: { display: true, min: -200, max: 200, grid: { color: '#e7e5e4' } } }, plugins: { legend: { position: 'top' }, tooltip: { enabled: false } }, animation: { duration: 0 } }
    });

    function updateChart() {
        const b = parseInt(bassInput.value), m = parseInt(midInput.value), t = parseInt(trebleInput.value);
        const bd = genWave(b, 0.5), md = genWave(m, 2.0), td = genWave(t, 5.0);
        const sd = labels.map((_, i) => bd[i] + md[i] + td[i]);
        fbmChart.data.datasets[0].data = sd; 
        fbmChart.data.datasets[1].data = bd; 
        fbmChart.data.datasets[2].data = md; 
        fbmChart.data.datasets[3].data = td;
        fbmChart.update();
    }
    
    bassInput.addEventListener('input', updateChart);
    midInput.addEventListener('input', updateChart);
    trebleInput.addEventListener('input', updateChart);
    updateChart(); 

})();