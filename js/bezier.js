/* c:\Projects\B-zierCurveLab\js\bezier.js */
const c = {
    'intro': { t: 3, n: 'core', b: ['Show Origins 👇', 'What is the Goal? 👇', 'Next: Core Principles →'] },
    'core': { t: 2, n: 'math', b: ['Show De Casteljau Demo 👇', 'Next: Math Expression →'] },
    'math': { t: 3, n: 'props', b: ['Unlock the Pattern 👇', 'Visualize the Weights 👇', 'Next: Practical Uses →'] },
    'props': { t: 2, n: 'gotcha', b: ['See it in Action 👇', 'Next: The Gotcha →'] },
    'gotcha': { t: 2, n: 'summary', b: ['See the Speed Difference 👇', 'Next: Summary →'] },
    'summary': { t: 1, n: 'refs', b: ['Next: References →'] },
    'refs': { t: 1, n: 'intro', b: ['Back to Start ↺'] }
};

const v = { 'intro': 1, 'core': 1, 'math': 1, 'props': 1, 'gotcha': 1, 'summary': 1, 'refs': 1 };

window.s = function(id) {
    document.querySelectorAll('.page-section').forEach(e => { e.style.display = 'none'; e.classList.remove('animate-fade-in'); });
    const tg = document.getElementById(id);
    if (tg) { tg.style.display = 'block'; void tg.offsetWidth; tg.classList.add('animate-fade-in'); }
    document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('nav-active'));
    const ab = document.getElementById('btn-' + id);
    if (ab) ab.classList.add('nav-active');
    if (c[id]) r(id);
    if (id === 'core') setTimeout(iL, 50);
    if (id === 'core' && v[id] >= 2) setTimeout(iC, 50);
    if (id === 'math' && v[id] >= 3) setTimeout(iB, 50);
    if (id === 'props' && v[id] >= 2) setTimeout(iP, 50);
    if (id === 'gotcha' && v[id] >= 2) setTimeout(iG, 50);
};

window.n = function(id) {
    const cf = c[id];
    let st = v[id];
    if (st >= cf.t) { window.s(cf.n); return; }
    st++;
    v[id] = st;
    const se = document.getElementById(`${id}-step-`);
    if (se) { se.style.display = 'block'; se.classList.add('animate-fade-in'); }
    const bn = document.getElementById(`btn--next`);
    if (bn) {
        bn.innerText = cf.b[st - 1];
        if (st === cf.t) { bn.classList.remove('bg-slate-800', 'hover:bg-slate-700'); bn.classList.add('bg-blue-600', 'hover:bg-blue-700'); }
    }
    if (id === 'core' && st === 2) setTimeout(iC, 50);
    if (id === 'math' && st === 3) setTimeout(iB, 50);
    if (id === 'props' && st === 2) setTimeout(iP, 50);
    if (id === 'gotcha' && st === 2) setTimeout(iG, 50);
};

function r(id) {
    const cf = c[id];
    v[id] = 1;
    for (let i = 2; i <= cf.t; i++) {
        const el = document.getElementById(`-step-`);
        if (el) { el.style.display = 'none'; el.classList.remove('animate-fade-in'); }
    }
    const bn = document.getElementById(`btn--next`);
    if (bn) {
        bn.innerText = cf.b[0];
        bn.classList.add('bg-slate-800', 'hover:bg-slate-700');
        bn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    }
}

function lrp(p0, p1, t) { return { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t }; }
function dPt(ctx, p, col, sz = 6) { ctx.beginPath(); ctx.arc(p.x, p.y, sz, 0, Math.PI*2); ctx.fillStyle = col; ctx.fill(); }
function dLn(ctx, p0, p1, col, wd = 1, dsh = []) { ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dsh); ctx.stroke(); ctx.setLineDash([]); }

function cDg(cvs, pts, cb) {
    let di = -1;
    const gmp = (e) => { const rc = cvs.getBoundingClientRect(); return { x: e.clientX - rc.left, y: e.clientY - rc.top }; };
    cvs.onmousedown = (e) => { const po = gmp(e); di = pts.findIndex(p => Math.hypot(p.x - po.x, p.y - po.y) < 20); };
    cvs.onmousemove = (e) => {
        const po = gmp(e);
        if (di > -1) { pts[di].x = Math.max(0, Math.min(cvs.width, po.x)); pts[di].y = Math.max(0, Math.min(cvs.height, po.y)); cb(); } 
        else { cvs.style.cursor = pts.some(p => Math.hypot(p.x - po.x, p.y - po.y) < 20) ? 'grab' : 'crosshair'; }
    };
    cvs.onmouseup = () => di = -1;
    cvs.onmouseleave = () => di = -1;
}

function eBz(pts, t) {
    let tp = [...pts];
    while(tp.length > 1) {
        for(let i=0; i<tp.length-1; i++) tp[i] = lrp(tp[i], tp[i+1], t);
        tp.pop();
    }
    return tp[0];
}

let cx0, cv0, t0 = 0, aId0, dir0 = 1;
function iL() {
    cv0 = document.getElementById('c-lerp');
    if(!cv0) return;
    const rc = cv0.parentElement.getBoundingClientRect();
    cv0.width = rc.width; cv0.height = 96; // h-24 = 96px
    cx0 = cv0.getContext('2d');
    
    if(aId0) cancelAnimationFrame(aId0);
    function ani() {
        t0 += 0.005 * dir0;
        if(t0 >= 1) { t0 = 1; dir0 = -1; }
        if(t0 <= 0) { t0 = 0; dir0 = 1; }
        rL();
        aId0 = requestAnimationFrame(ani);
    }
    ani();
}

function rL() {
    if(!cx0) return;
    cx0.clearRect(0, 0, cv0.width, cv0.height);
    const w = cv0.width, h = cv0.height;
    const pA = {x: w*0.1, y: h/2};
    const pB = {x: w*0.9, y: h/2};
    
    // Draw Line
    dLn(cx0, pA, pB, '#cbd5e1', 4);
    // Draw Endpoints
    dPt(cx0, pA, '#334155', 8);
    dPt(cx0, pB, '#334155', 8);
    
    // Draw Interpolated Point
    const pT = lrp(pA, pB, t0);
    dPt(cx0, pT, '#2563eb', 10);
    
    // Text Labels
    cx0.font = "bold 14px monospace";
    cx0.fillStyle = "#334155";
    cx0.textAlign = "center";
    cx0.fillText("A", pA.x, pA.y + 25);
    cx0.fillText("B", pB.x, pB.y + 25);
    
    cx0.fillStyle = "#2563eb";
    cx0.fillText(`P (t=${t0.toFixed(2)})`, pT.x, pT.y - 15);
}

let deg = 3;
window.setDeg = function(d) {
    deg = d;
    document.getElementById('btn-deg-2').className = d === 2 ? 'px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold transition shadow' : 'px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold transition';
    document.getElementById('btn-deg-3').className = d === 3 ? 'px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold transition shadow' : 'px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold transition';
    iC(); 
};

let cx1, cv1, pt1 = [], t1 = 0, aId1, isPlay1 = true;
function iC() {
    cv1 = document.getElementById('c-casteljau');
    if(!cv1) return;
    const rc = cv1.parentElement.getBoundingClientRect();
    cv1.width = rc.width; cv1.height = rc.height;
    cx1 = cv1.getContext('2d');
    const w = cv1.width, h = cv1.height;
    
    if (deg === 2) {
        pt1 = [{x: w*0.1, y: h*0.8}, {x: w*0.5, y: h*0.1}, {x: w*0.9, y: h*0.8}];
    } else {
        pt1 = [{x: w*0.1, y: h*0.8}, {x: w*0.3, y: h*0.1}, {x: w*0.7, y: h*0.1}, {x: w*0.9, y: h*0.8}];
    }
    
    cDg(cv1, pt1, rC);
    
    const slider = document.getElementById('t-slider');
    const display = document.getElementById('t-display');
    const btnPlay = document.getElementById('btn-play');
    
    t1 = 0;
    isPlay1 = true;
    if (btnPlay) btnPlay.innerText = '⏸ Pause';
    
    if (slider) {
        slider.oninput = (e) => {
            isPlay1 = false;
            if (btnPlay) btnPlay.innerText = '▶ Play';
            t1 = e.target.value / 100;
            if (display) display.innerText = t1.toFixed(2);
            rC();
        };
    }
    
    if (btnPlay) {
        btnPlay.onclick = () => {
            isPlay1 = !isPlay1;
            btnPlay.innerText = isPlay1 ? '⏸ Pause' : '▶ Play';
        };
    }

    if(aId1) cancelAnimationFrame(aId1);
    function ani() {
        if (isPlay1) {
            t1 += 0.005;
            if(t1 > 1) t1 = 0;
            if(slider) slider.value = t1 * 100;
            if(display) display.innerText = t1.toFixed(2);
            rC();
        }
        aId1 = requestAnimationFrame(ani);
    }
    ani();
}

function rC() {
    cx1.clearRect(0, 0, cv1.width, cv1.height);
    for(let i=0; i<pt1.length-1; i++) dLn(cx1, pt1[i], pt1[i+1], '#cbd5e1', 2, [5,5]);
    pt1.forEach(p => dPt(cx1, p, '#334155', 8));
    const cols = ['#93c5fd', '#34d399', '#f87171'];
    let ly = [pt1], cr = pt1;
    while(cr.length > 1) {
        let nx = [];
        for(let i=0; i<cr.length-1; i++) nx.push(lrp(cr[i], cr[i+1], t1));
        ly.push(nx); cr = nx;
    }
    for(let L=1; L<ly.length; L++) {
        const col = cols[L-1];
        for(let i=0; i<ly[L].length-1; i++) dLn(cx1, ly[L][i], ly[L][i+1], col, 2);
        ly[L].forEach(p => dPt(cx1, p, col, L === ly.length-1 ? 8 : 5));
    }
    cx1.beginPath();
    for(let i=0; i<=t1; i+=0.01) {
        let p = eBz(pt1, i);
        if(i===0) cx1.moveTo(p.x, p.y); else cx1.lineTo(p.x, p.y);
    }
    cx1.strokeStyle = '#2563eb'; cx1.lineWidth = 4; cx1.stroke();
}

let chB;
function iB() {
    const cv = document.getElementById('c-bernstein');
    if(!cv) return; 
    const ctx = cv.getContext('2d');
    if(chB) chB.destroy();
    const ls = Array.from({length: 101}, (_,i) => (i/100).toFixed(2));
    const b0 = ls.map(t => Math.pow(1-t, 3));
    const b1 = ls.map(t => 3 * Math.pow(1-t, 2) * t);
    const b2 = ls.map(t => 3 * (1-t) * Math.pow(t, 2));
    const b3 = ls.map(t => Math.pow(t, 3));
    chB = new Chart(ctx, {
        type: 'line', data: { labels: ls, datasets: [ { data: b0, borderColor: '#ef4444', pointRadius: 0, tension: 0.4 }, { data: b1, borderColor: '#10b981', pointRadius: 0, tension: 0.4 }, { data: b2, borderColor: '#10b981', pointRadius: 0, tension: 0.4 }, { data: b3, borderColor: '#3b82f6', pointRadius: 0, tension: 0.4 } ] }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { display: false }, y: { min: 0, max: 1 } }, plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { duration: 0 } }
    });
}

let cx2, cv2, pt2 = [];
function iP() {
    cv2 = document.getElementById('c-props');
    if(!cv2) return; 
    const rc = cv2.parentElement.getBoundingClientRect();
    cv2.width = rc.width; cv2.height = rc.height;
    cx2 = cv2.getContext('2d');
    const w = cv2.width, h = cv2.height;
    pt2 = [{x: w*0.2, y: h*0.8}, {x: w*0.4, y: h*0.1}, {x: w*0.8, y: h*0.9}, {x: w*0.9, y: h*0.2}];
    cDg(cv2, pt2, rP);
    rP();
}

function sQ(a, b, c) {
    if(Math.abs(a) < 1e-6) return b !== 0 ? [-c/b] : [];
    const d = b*b - 4*a*c;
    if(d < 0) return [];
    if(d === 0) return [-b/(2*a)];
    return [(-b + Math.sqrt(d))/(2*a), (-b - Math.sqrt(d))/(2*a)];
}

function rP() {
    cx2.clearRect(0, 0, cv2.width, cv2.height);
    for(let i=0; i<3; i++) dLn(cx2, pt2[i], pt2[i+1], '#e2e8f0', 2, [5,5]);
    cx2.beginPath();
    for(let i=0; i<=1.01; i+=0.02) {
        let p = eBz(pt2, Math.min(1, i));
        if(i===0) cx2.moveTo(p.x, p.y); else cx2.lineTo(p.x, p.y);
    }
    cx2.strokeStyle = '#334155'; cx2.lineWidth = 4; cx2.stroke();
    pt2.forEach(p => dPt(cx2, p, '#334155', 6));

    const [p0, p1, p2, p3] = pt2;
    const gC = (v0, v1, v2, v3) => ({ A: 3*(-v0 + 3*v1 - 3*v2 + v3), B: 6*(v0 - 2*v1 + v2), C: 3*(v1 - v0) });
    const cX = gC(p0.x, p1.x, p2.x, p3.x);
    const cY = gC(p0.y, p1.y, p2.y, p3.y);
    
    const tx = sQ(cX.A, cX.B, cX.C).filter(t => t > 0 && t < 1);
    const ty = sQ(cY.A, cY.B, cY.C).filter(t => t > 0 && t < 1);
    
    let ex = [0, 1, ...tx, ...ty];
    let mx = Infinity, mX = -Infinity, my = Infinity, mY = -Infinity;
    ex.forEach(t => {
        const p = eBz(pt2, t);
        mx = Math.min(mx, p.x); mX = Math.max(mX, p.x);
        my = Math.min(my, p.y); mY = Math.max(mY, p.y);
    });

    cx2.strokeStyle = 'rgba(239, 68, 68, 0.5)'; cx2.lineWidth = 2;
    cx2.strokeRect(mx, my, mX - mx, mY - my);
    
    tx.forEach(t => dPt(cx2, eBz(pt2, t), '#ef4444', 5));
    ty.forEach(t => dPt(cx2, eBz(pt2, t), '#ef4444', 5));

    const t0 = 0.5;
    const pt = eBz(pt2, t0);
    const dx = cX.A*t0*t0 + cX.B*t0 + cX.C;
    const dy = cY.A*t0*t0 + cY.B*t0 + cY.C;
    const ln = Math.hypot(dx, dy) || 1;
    const sc = 50;
    dLn(cx2, pt, {x: pt.x + (dx/ln)*sc, y: pt.y + (dy/ln)*sc}, '#2563eb', 4);
    dLn(cx2, pt, {x: pt.x - (dy/ln)*sc, y: pt.y + (dx/ln)*sc}, '#10b981', 4);
}

let cx3, cv3, pt3 = [], t3 = 0, aId3, lut = [], tL = 0;
function iG() {
    cv3 = document.getElementById('c-gotcha');
    if(!cv3) return;
    const rc = cv3.parentElement.getBoundingClientRect();
    cv3.width = rc.width; cv3.height = rc.height;
    cx3 = cv3.getContext('2d');
    const w = cv3.width, h = cv3.height;
    
    // Modified control points to create a tall, narrow spike for extreme acceleration
    pt3 = [{x: w*0.1, y: h*0.85}, {x: w*0.48, y: -h*0.2}, {x: w*0.52, y: -h*0.2}, {x: w*0.9, y: h*0.85}];

    lut = []; tL = 0;
    let pr = eBz(pt3, 0);
    lut.push({ t: 0, ln: 0 });
    for(let i=1; i<=100; i++) {
        let t = i / 100;
        let p = eBz(pt3, t);
        tL += Math.hypot(p.x - pr.x, p.y - pr.y);
        lut.push({ t, ln: tL });
        pr = p;
    }

    if(aId3) cancelAnimationFrame(aId3);
    function ani() {
        t3 += 0.005;
        if(t3 > 1) t3 = 0;
        rG();
        aId3 = requestAnimationFrame(ani);
    }
    ani();
}

function mD(td) {
    for(let i=0; i<lut.length-1; i++) {
        if(lut[i].ln <= td && lut[i+1].ln >= td) {
            let r = (td - lut[i].ln) / (lut[i+1].ln - lut[i].ln);
            return lut[i].t + r * (lut[i+1].t - lut[i].t);
        }
    }
    return 1;
}

function rG() {
    cx3.clearRect(0, 0, cv3.width, cv3.height);
    cx3.beginPath();
    for(let i=0; i<=1.01; i+=0.02) {
        let p = eBz(pt3, Math.min(1, i));
        if(i===0) cx3.moveTo(p.x, p.y); else cx3.lineTo(p.x, p.y);
    }
    cx3.strokeStyle = '#e2e8f0'; cx3.lineWidth = 6; cx3.stroke();
    let pR = eBz(pt3, t3);
    dPt(cx3, {x: pR.x, y: pR.y - 15}, '#ef4444', 8);
    let tD = t3 * tL;
    let aT = mD(tD);
    let pG = eBz(pt3, aT);
    dPt(cx3, {x: pG.x, y: pG.y + 15}, '#10b981', 8);
}
