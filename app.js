/* ============================================================================
 * When More Becomes Less — project page
 * D3 visualizations + interactivity
 * ========================================================================== */

const $   = (sel, root = document) => root.querySelector(sel);
const $$  = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const D = window.DATA;

const FAM_COLOR = {
  "ModernBERT": "var(--fam-ModernBERT)",
  "Qwen2.5":    "var(--fam-Qwen2-5)",
  "SmolLM2":    "var(--fam-SmolLM2)",
  "Phi-3.5":    "var(--fam-Phi-3-5)",
  "OLMo-2":     "var(--fam-OLMo-2)",
};

function fmt(v, d = 3) {
  if (v == null || !isFinite(v)) return "—";
  return v.toFixed(d);
}

// ========================================================================
// TOOLTIP (singleton)
// ========================================================================
const Tooltip = {
  el: null,
  ensure() {
    if (this.el) return this.el;
    const t = document.createElement("div");
    t.className = "tooltip";
    document.body.appendChild(t);
    this.el = t;
    return t;
  },
  show(html, ev) {
    const t = this.ensure();
    t.innerHTML = html;
    t.classList.add("show");
    this.move(ev);
  },
  move(ev) {
    if (!this.el) return;
    const x = ev.clientX, y = ev.clientY;
    const pad = 14;
    const w = this.el.offsetWidth, h = this.el.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = x + pad, top = y + pad;
    if (left + w + 8 > vw) left = x - w - pad;
    if (top + h + 8 > vh)  top = y - h - pad;
    this.el.style.left = `${left}px`;
    this.el.style.top  = `${top}px`;
  },
  hide() { if (this.el) this.el.classList.remove("show"); },
};

// ========================================================================
// TOP NAV + SCROLL PROGRESS
// ========================================================================
const Nav = {
  init() {
    const nav   = $("#topnav");
    const bar   = $("#scroll-progress");
    const links = $$(".navlinks a", nav);
    const ids   = links.map(a => a.getAttribute("href").slice(1));
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

    const onScroll = () => {
      const sy = window.scrollY;
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      const pct = doc > 0 ? Math.min(100, (sy / doc) * 100) : 0;
      if (bar) bar.style.width = pct + "%";
      if (nav) nav.classList.toggle("scrolled", sy > 30);

      // Active link by section in view
      const y = sy + 120;
      let activeIdx = -1;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= y) activeIdx = i;
      }
      links.forEach((a, i) => a.classList.toggle("active", i === activeIdx));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  },
};

// ========================================================================
// BIBTEX COPY BUTTON
// ========================================================================
const BibTeXCopy = {
  init() {
    const btn = $("#bib-copy");
    const txt = $("#bib-text");
    if (!btn || !txt) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(txt.textContent.trim());
        btn.classList.add("ok");
        const orig = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(() => { btn.classList.remove("ok"); btn.textContent = orig; }, 1500);
      } catch (e) {
        btn.textContent = "Copy failed";
      }
    });
  },
};

// ========================================================================
// HERO STATS
// ========================================================================
const Hero = {
  init() {
    if (!D) return;
    const h = D.headline;
    if ($("#hero-n-models")) $("#hero-n-models").textContent = h.n_models;
    if ($("#hero-n-mean"))   $("#hero-n-mean").textContent   = h.n_mean_inverted_before_30;
    if ($("#hero-n-multi"))  $("#hero-n-multi").textContent  = h.n_multilingual_positive;
    if ($("#weak-val"))   $("#weak-val").textContent   = fmt(h.min_drop, 3);
    if ($("#strong-val")) $("#strong-val").textContent = fmt(h.max_drop, 3);
  },
};

// ========================================================================
// HERO LEAK — mini live sweep of §02 curves above the fold
// ========================================================================
const HeroLeak = {
  rafId: null,
  paused: false,
  t0: 0,
  duration: 4200,        // ms for one full N-sweep
  pause: 900,            // ms paused at end before restart

  init() {
    const host = $("#hero-leak");
    if (!host || !D || !D.workedExample) return;

    const Ns   = D.Ns || [1, 3, 5, 10, 20, 30];
    const adj  = D.workedExample.adjacent;
    const disp = D.workedExample.displaced_F0;
    if (!adj || !disp) return;

    // Build a denser N grid by interpolating across the sparse Ns
    const dense = [];
    for (let i = 0; i < Ns.length - 1; i++) {
      const n0 = Ns[i], n1 = Ns[i + 1];
      const p0a = (adj.find(d => d.N === n0)  || {}).p ?? 0;
      const p1a = (adj.find(d => d.N === n1)  || {}).p ?? 0;
      const p0d = (disp.find(d => d.N === n0) || {}).p ?? 0;
      const p1d = (disp.find(d => d.N === n1) || {}).p ?? 0;
      const steps = (i === Ns.length - 2) ? 24 : 14;
      for (let k = 0; k < steps; k++) {
        const t = k / steps;
        dense.push({
          n: n0 + (n1 - n0) * t,
          adj:  p0a + (p1a - p0a) * t,
          disp: p0d + (p1d - p0d) * t,
        });
      }
    }
    const last = Ns[Ns.length - 1];
    const pLastA = (adj.find(d => d.N === last)  || {}).p ?? 0;
    const pLastD = (disp.find(d => d.N === last) || {}).p ?? 0;
    dense.push({ n: last, adj: pLastA, disp: pLastD });
    this.dense = dense;

    // Geometry — viewBox so SVG scales with container
    const W = 640, H = 180;
    const m = { top: 18, right: 110, bottom: 28, left: 14 };
    const cw = W - m.left - m.right;
    const ch = H - m.top - m.bottom;

    const allP = dense.flatMap(d => [d.adj, d.disp]);
    const pMax = Math.max(...allP, 0.45);
    const xOf = (n) => m.left + ((n - Ns[0]) / (Ns[Ns.length-1] - Ns[0])) * cw;
    const yOf = (p) => m.top  + ch - (p / pMax) * ch;

    this.xOf = xOf; this.yOf = yOf;
    this.W = W; this.H = H; this.m = m;

    // Build static SVG once
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Baseline x-axis line
    const axis = document.createElementNS(svgNS, "line");
    axis.setAttribute("class", "hl-axis");
    axis.setAttribute("x1", m.left);  axis.setAttribute("x2", m.left + cw);
    axis.setAttribute("y1", m.top + ch); axis.setAttribute("y2", m.top + ch);
    svg.appendChild(axis);

    // N ticks
    [1, 5, 10, 20, 30].forEach(n => {
      const tx = xOf(n);
      const t = document.createElementNS(svgNS, "text");
      t.setAttribute("class", "hl-tick");
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("x", tx); t.setAttribute("y", m.top + ch + 14);
      t.textContent = "N=" + n;
      svg.appendChild(t);
    });

    // Lines (paths) — start empty, grow as scrub advances
    const linePath = (cls) => {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("class", cls);
      svg.appendChild(p);
      return p;
    };
    this.pathAdj  = linePath("hl-line-adj");
    this.pathDisp = linePath("hl-line-disp");

    // Endpoint dots
    const dot = (cls) => {
      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("class", cls);
      c.setAttribute("r", 4);
      svg.appendChild(c);
      return c;
    };
    this.dotAdj  = dot("hl-dot-adj");
    this.dotDisp = dot("hl-dot-disp");

    // Scrub line
    const scrub = document.createElementNS(svgNS, "line");
    scrub.setAttribute("class", "hl-scrub");
    scrub.setAttribute("y1", m.top); scrub.setAttribute("y2", m.top + ch);
    svg.appendChild(scrub);
    this.scrub = scrub;

    // Right-side labels: P values + N readout
    const labAdj = document.createElementNS(svgNS, "text");
    labAdj.setAttribute("class", "hl-label-adj");
    labAdj.setAttribute("x", W - m.right + 14);
    labAdj.setAttribute("dy", "0.32em");
    svg.appendChild(labAdj);
    this.labAdj = labAdj;

    const labDisp = document.createElementNS(svgNS, "text");
    labDisp.setAttribute("class", "hl-label-disp");
    labDisp.setAttribute("x", W - m.right + 14);
    labDisp.setAttribute("dy", "0.32em");
    svg.appendChild(labDisp);
    this.labDisp = labDisp;

    const labN = document.createElementNS(svgNS, "text");
    labN.setAttribute("class", "hl-n-readout");
    labN.setAttribute("x", W - m.right + 14);
    labN.setAttribute("y", m.top - 4);
    svg.appendChild(labN);
    this.labN = labN;

    host.appendChild(svg);

    // Pause on tab hide
    document.addEventListener("visibilitychange", () => {
      this.paused = document.hidden;
      if (!this.paused) this.t0 = performance.now();
    });

    // Animate
    this.t0 = performance.now();
    const tick = (now) => {
      this.rafId = requestAnimationFrame(tick);
      if (this.paused) return;
      const cycle = this.duration + this.pause;
      const elapsed = (now - this.t0) % cycle;
      // Progress 0..1 across duration, then hold at 1 for pause
      const prog = elapsed < this.duration ? (elapsed / this.duration) : 1;
      this.render(prog);
    };
    this.rafId = requestAnimationFrame(tick);
  },

  render(prog) {
    const dense = this.dense;
    const idx = Math.max(0, Math.min(dense.length - 1, Math.floor(prog * (dense.length - 1))));
    const pt  = dense[idx];

    // Paths drawn up to current N
    const pieceAdj  = [];
    const pieceDisp = [];
    for (let i = 0; i <= idx; i++) {
      const d = dense[i];
      pieceAdj.push((i === 0 ? "M" : "L") + this.xOf(d.n) + " " + this.yOf(d.adj));
      pieceDisp.push((i === 0 ? "M" : "L") + this.xOf(d.n) + " " + this.yOf(d.disp));
    }
    this.pathAdj.setAttribute("d",  pieceAdj.join(" "));
    this.pathDisp.setAttribute("d", pieceDisp.join(" "));

    const x = this.xOf(pt.n), ya = this.yOf(pt.adj), yd = this.yOf(pt.disp);
    this.dotAdj.setAttribute("cx", x);  this.dotAdj.setAttribute("cy", ya);
    this.dotDisp.setAttribute("cx", x); this.dotDisp.setAttribute("cy", yd);

    this.scrub.setAttribute("x1", x); this.scrub.setAttribute("x2", x);

    // Labels — anchored to right gutter, y aligned to current dot
    this.labAdj.setAttribute("y",  ya);
    this.labDisp.setAttribute("y", yd);
    // Prevent label collision (min separation 14px)
    const yaShown = ya, ydShown = yd;
    if (Math.abs(ya - yd) < 14) {
      // push displaced down a bit if too close
      if (ya < yd) this.labDisp.setAttribute("y", ya + 14);
      else         this.labAdj.setAttribute("y",  yd + 14);
    }
    this.labAdj.textContent  = "adj  P=" + pt.adj.toFixed(3);
    this.labDisp.textContent = "disp P=" + pt.disp.toFixed(3);
    this.labN.textContent    = "N = " + Math.round(pt.n);
  },
};

// ========================================================================
// 01 · INTERACTIVE PROBE STEPPER
// ========================================================================
const Schematic = {
  N: 5,                  // current selected N
  prevN: 5,              // for "fresh" highlight
  Ns: [1, 3, 5, 10, 20, 30],
  target: "cat",         // concrete visual placeholder; actual numbers are word-mean over 256 nouns
  sweepGen: 0,           // generation counter to cancel running autosweep

  init() {
    const stage = $("#schematic-stage");
    if (!stage) return;
    const cards = $("#schematic-cards");
    if (!cards) return;
    cards.innerHTML = `
      <div class="probe-card adj" id="probe-adj">
        <div class="ptitle">Adjacent probe</div>
        <div class="pdesc">The mask sits right after the repeated word.</div>
        <div class="pcontent"></div>
        <div class="pbar">
          <span class="pbar-label">P(cat)</span>
          <div class="pbar-track"><div class="pbar-fill"></div></div>
          <span class="pbar-val">—</span>
        </div>
      </div>
      <div class="probe-card disp" id="probe-disp">
        <div class="ptitle">Displaced probe</div>
        <div class="pdesc">Same prefix; the mask sits one clause later.</div>
        <div class="pcontent"></div>
        <div class="pbar">
          <span class="pbar-label">P(cat)</span>
          <div class="pbar-track"><div class="pbar-fill"></div></div>
          <span class="pbar-val">—</span>
        </div>
      </div>
    `;

    // Wire N buttons — user click cancels any running autosweep
    $$("#schematic-n .btn-mini").forEach(btn => {
      btn.addEventListener("click", () => {
        this.sweepGen++;        // invalidate any running autosweep
        this.setN(+btn.dataset.n);
      });
    });

    // ← → keys when stage in view
    let inView = false;
    const io = new IntersectionObserver(es => {
      for (const e of es) inView = e.isIntersecting;
    }, { threshold: 0.35 });
    io.observe(stage);
    window.addEventListener("keydown", ev => {
      if (!inView) return;
      if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
      this.sweepGen++;
      const i = this.Ns.indexOf(this.N);
      const ni = ev.key === "ArrowRight"
        ? Math.min(this.Ns.length - 1, i + 1)
        : Math.max(0, i - 1);
      if (ni !== i) this.setN(this.Ns[ni]);
      ev.preventDefault();
    });

    // Autoplay one slow sweep when first scrolled into view (only once)
    let autoplayed = false;
    const auto = new IntersectionObserver(es => {
      for (const e of es) {
        if (e.isIntersecting && !autoplayed) {
          autoplayed = true;
          auto.disconnect();
          this.autosweep();
          break;
        }
      }
    }, { threshold: 0.4 });
    auto.observe(stage);

    this.render();
  },

  setN(n) {
    if (n === this.N) return;
    this.prevN = this.N;
    this.N = n;
    this.render();
  },

  async autosweep() {
    const myGen = ++this.sweepGen;
    const cancelled = () => myGen !== this.sweepGen;
    const steps = [1, 3, 5, 10, 20, 30];   // monotonic sweep, settle at 30
    for (const n of steps) {
      if (cancelled()) return;
      this.setN(n);
      await sleep(900);
    }
  },

  render() {
    // Active N button
    $$("#schematic-n .btn-mini").forEach(b => {
      b.classList.toggle("active", +b.dataset.n === this.N);
    });
    const readout = $("#schematic-readout");
    if (readout) readout.textContent = `N = ${this.N}`;

    // Build prompt strings
    const tgt = this.target;
    const n   = this.N;
    const grew = n > this.prevN;
    const newCount = grew ? (n - this.prevN) : 0;
    const oldCount = n - newCount;

    // Inject target tokens with a "fresh" highlight class on the new ones
    let tgtHtml = "";
    for (let i = 0; i < n; i++) {
      const fresh = i >= oldCount && grew;
      tgtHtml += `<span class="target${fresh ? " fresh" : ""}">${tgt}</span>${i === n - 1 ? "" : " "}`;
    }

    const adjContent = $("#probe-adj .pcontent");
    const dispContent = $("#probe-disp .pcontent");
    if (adjContent)  adjContent.innerHTML  =
      `${tgtHtml} <span class="slot">[ MASK ]</span><span class="prefix"> .</span>`;
    if (dispContent) dispContent.innerHTML =
      `${tgtHtml}<span class="prefix"> . </span>` +
      `<span class="frame">The word I keep thinking about is </span>` +
      `<span class="slot">[ MASK ]</span><span class="prefix"> .</span>`;

    // Update probability bars (word-mean from D.workedExample)
    const adjP  = (D.workedExample.adjacent.find(d => d.N === n)        || {}).p ?? 0;
    const dispP = (D.workedExample.displaced_F0.find(d => d.N === n)    || {}).p ?? 0;
    // Shared scale: pin to the panel max so users see the size relationship
    const allPs = [
      ...D.workedExample.adjacent.map(d => d.p),
      ...D.workedExample.displaced_F0.map(d => d.p),
    ];
    const maxP = Math.max(...allPs);
    const adjPct  = Math.max(0, Math.min(100, (adjP  / maxP) * 100));
    const dispPct = Math.max(0, Math.min(100, (dispP / maxP) * 100));

    const adjFill  = $("#probe-adj .pbar-fill");
    const adjVal   = $("#probe-adj .pbar-val");
    const dispFill = $("#probe-disp .pbar-fill");
    const dispVal  = $("#probe-disp .pbar-val");
    if (adjFill)  adjFill.style.width  = adjPct  + "%";
    if (adjVal)   adjVal.textContent   = fmt(adjP, 3);
    if (dispFill) dispFill.style.width = dispPct + "%";
    if (dispVal)  dispVal.textContent  = fmt(dispP, 3);
  },
};

// ========================================================================
// 02 · WORKED EXAMPLE CURVES (Qwen2.5-1.5B adjacent vs displaced)
// ========================================================================
const Curves = {
  playGen: 0,
  scrubN: 5,

  init() {
    const container = $("#curves-chart");
    if (!container) return;
    this.draw();
    const btn = $("#curves-play");
    if (btn) btn.addEventListener("click", () => this.play());

    // Scrubber
    const scr = $("#curves-scrub");
    if (scr) {
      scr.addEventListener("input", () => {
        const Ns = D.Ns;                // [1,3,5,10,20,30]
        const idx = +scr.value;
        this.scrubN = Ns[idx];
        this.updateScrub();
      });
    }

    // Auto-play once when the section comes into view
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) { this.play(); obs.disconnect(); break; }
      }
    }, { threshold: 0.35 });
    obs.observe(container);
  },

  updateScrub() {
    if (!this._cache) return;
    const Ns = D.Ns;
    const adj  = D.workedExample.adjacent;
    const disp = D.workedExample.displaced_F0;
    const adjP  = (adj.find(d => d.N === this.scrubN)        || {}).p;
    const dispP = (disp.find(d => d.N === this.scrubN)       || {}).p;
    const xPx = this._cache.x(this.scrubN);
    const adjYPx  = this._cache.y(adjP);
    const dispYPx = this._cache.y(dispP);

    // Update vertical scrub line
    const line = this._cache.scrubLine;
    line.attr("x1", xPx).attr("x2", xPx).attr("opacity", 1);

    // Update marker dots
    this._cache.scrubAdjDot.attr("cx", xPx).attr("cy", adjYPx).attr("opacity", 1);
    this._cache.scrubDispDot.attr("cx", xPx).attr("cy", dispYPx).attr("opacity", 1);

    // Update labels
    const labelOff = xPx > this._cache.w - 80 ? -10 : 10;
    const anchor   = xPx > this._cache.w - 80 ? "end" : "start";
    this._cache.scrubAdjLabel
      .attr("x", xPx + labelOff).attr("y", adjYPx - 10)
      .attr("text-anchor", anchor)
      .text(`adj P = ${fmt(adjP, 3)}`)
      .attr("opacity", 1);
    this._cache.scrubDispLabel
      .attr("x", xPx + labelOff).attr("y", dispYPx + 18)
      .attr("text-anchor", anchor)
      .text(`disp P = ${fmt(dispP, 3)}`)
      .attr("opacity", 1);

    // Update readout
    const out = $("#curves-scrub-readout");
    if (out) out.textContent = `N = ${this.scrubN}`;
  },

  draw() {
    const container = $("#curves-chart");
    if (!container) return;
    const W = Math.max(620, container.getBoundingClientRect().width);
    const H = 380;
    const margin = { top: 30, right: 110, bottom: 50, left: 70 };
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const adj  = D.workedExample.adjacent;
    const disp = D.workedExample.displaced_F0;
    const Ns   = D.Ns;

    const x = d3.scaleLog().domain([1, 30]).range([0, w]);
    const yMax = d3.max([...adj, ...disp], d => d.p) * 1.12;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    // Grid
    g.append("g").attr("class", "grid")
     .call(d3.axisLeft(y).tickSize(-w).tickFormat(""));

    // Axes
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues(Ns).tickFormat(d3.format("d")));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2f")));

    g.append("text").attr("class", "axis-label")
      .attr("x", w / 2).attr("y", h + 38).attr("text-anchor", "middle")
      .text("N (target copies)");
    g.append("text").attr("class", "axis-label")
      .attr("transform", `rotate(-90) translate(${-h/2},-46)`)
      .attr("text-anchor", "middle")
      .text("P(target)  ·  word mean");

    // Line generators
    const line = d3.line()
      .x(d => x(d.N)).y(d => y(d.p))
      .curve(d3.curveMonotoneX);

    // Adjacent line (green, up)
    const adjPath = g.append("path")
      .attr("class", "curve curve-adj")
      .attr("stroke", "var(--up)")
      .datum(adj).attr("d", line);

    // Displaced line (red, falling)
    const dispPath = g.append("path")
      .attr("class", "curve curve-disp")
      .attr("stroke", "var(--down)")
      .datum(disp).attr("d", line);

    // Dots
    const adjDots = g.append("g").attr("class", "dots-adj");
    adjDots.selectAll("circle").data(adj).enter().append("circle")
      .attr("cx", d => x(d.N)).attr("cy", d => y(d.p)).attr("r", 4.5)
      .attr("fill", "var(--up)").attr("stroke", "white").attr("stroke-width", 1.5);

    const dispDots = g.append("g").attr("class", "dots-disp");
    dispDots.selectAll("circle").data(disp).enter().append("circle")
      .attr("cx", d => x(d.N)).attr("cy", d => y(d.p)).attr("r", 4.5)
      .attr("fill", "var(--down)").attr("stroke", "white").attr("stroke-width", 1.5);

    // Legend (right of plot)
    const lgX = w + 18;
    const legend = g.append("g").attr("transform", `translate(${lgX}, 0)`);
    legend.append("circle").attr("cx", 8).attr("cy", 8).attr("r", 6).attr("fill", "var(--up)");
    legend.append("text").attr("x", 22).attr("y", 12)
      .style("font-family", "var(--font-mono)").style("font-size", "11px")
      .style("fill", "var(--text)").text("Adjacent");
    legend.append("text").attr("x", 22).attr("y", 28)
      .style("font-family", "var(--font-mono)").style("font-size", "10.5px")
      .style("fill", "var(--text-mute)").text("priming saturates");

    legend.append("circle").attr("cx", 8).attr("cy", 58).attr("r", 6).attr("fill", "var(--down)");
    legend.append("text").attr("x", 22).attr("y", 62)
      .style("font-family", "var(--font-mono)").style("font-size", "11px")
      .style("fill", "var(--text)").text("Displaced");
    legend.append("text").attr("x", 22).attr("y", 78)
      .style("font-family", "var(--font-mono)").style("font-size", "10.5px")
      .style("fill", "var(--text-mute)").text("rises, then falls");

    // Annotate peak/N=30 on displaced
    const peakN = D.workedExample.peak_N_disp;
    const peakP = D.workedExample.peak_P_disp;
    const p30   = D.workedExample.p_at_30_disp;

    const peakMark = g.append("g").attr("class", "peak-mark");
    peakMark.append("line")
      .attr("x1", x(peakN)).attr("x2", x(peakN))
      .attr("y1", y(peakP) + 8).attr("y2", y(peakP) + 32)
      .attr("stroke", "var(--down)").attr("stroke-width", 1.5);
    peakMark.append("text")
      .attr("x", x(peakN)).attr("y", y(peakP) + 50)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "10.5px")
      .style("fill", "var(--down)")
      .text(`peak P = ${fmt(peakP, 3)}`);

    const dropMark = g.append("g").attr("class", "drop-mark");
    dropMark.append("text")
      .attr("x", x(30) - 6).attr("y", y(p30) - 10)
      .attr("text-anchor", "end")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "10.5px")
      .style("fill", "var(--down)")
      .text(`N=30: ${fmt(p30, 3)}`);

    // Scrub line + markers + labels (initially hidden)
    const scrubLine = g.append("line")
      .attr("class", "scrub-line")
      .attr("y1", 0).attr("y2", h)
      .attr("stroke", "var(--accent)")
      .attr("stroke-width", 1.4)
      .attr("stroke-dasharray", "3,4")
      .attr("opacity", 0);
    const scrubAdjDot = g.append("circle")
      .attr("class", "scrub-dot")
      .attr("r", 6.5)
      .attr("fill", "var(--up)")
      .attr("stroke", "var(--bg-elevated)").attr("stroke-width", 2)
      .attr("opacity", 0);
    const scrubDispDot = g.append("circle")
      .attr("class", "scrub-dot")
      .attr("r", 6.5)
      .attr("fill", "var(--down)")
      .attr("stroke", "var(--bg-elevated)").attr("stroke-width", 2)
      .attr("opacity", 0);
    const scrubAdjLabel = g.append("text")
      .attr("class", "scrub-label-svg")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "11px")
      .style("fill", "var(--up)")
      .style("font-weight", "500")
      .attr("opacity", 0);
    const scrubDispLabel = g.append("text")
      .attr("class", "scrub-label-svg")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "11px")
      .style("fill", "var(--down)")
      .style("font-weight", "500")
      .attr("opacity", 0);

    // Cache for animation replay + scrub updates
    this._cache = {
      adjPath, dispPath, adjDots, dispDots, peakMark, dropMark,
      x, y, w, h,
      scrubLine, scrubAdjDot, scrubDispDot, scrubAdjLabel, scrubDispLabel,
    };

    // Initialize scrub display at the default position
    this.updateScrub();
  },

  async play() {
    const c = this._cache;
    if (!c) { this.draw(); return; }
    const myGen = ++this.playGen;
    const cancelled = () => myGen !== this.playGen;

    // Reset
    const dashAdj  = c.adjPath.node().getTotalLength();
    const dashDisp = c.dispPath.node().getTotalLength();
    c.adjPath
      .attr("stroke-dasharray", `${dashAdj} ${dashAdj}`)
      .attr("stroke-dashoffset", dashAdj);
    c.dispPath
      .attr("stroke-dasharray", `${dashDisp} ${dashDisp}`)
      .attr("stroke-dashoffset", dashDisp);
    c.adjDots.selectAll("circle").attr("opacity", 0);
    c.dispDots.selectAll("circle").attr("opacity", 0);
    c.peakMark.attr("opacity", 0);
    c.dropMark.attr("opacity", 0);
    // Hide scrub during animation
    c.scrubLine.attr("opacity", 0);
    c.scrubAdjDot.attr("opacity", 0);
    c.scrubDispDot.attr("opacity", 0);
    c.scrubAdjLabel.attr("opacity", 0);
    c.scrubDispLabel.attr("opacity", 0);

    await sleep(150);
    if (cancelled()) return;

    // Adjacent draws first
    c.adjPath.transition().duration(1100).ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);
    c.adjDots.selectAll("circle")
      .transition().delay((d, i) => 80 + i * 130).duration(280)
      .attr("opacity", 1);

    await sleep(1200);
    if (cancelled()) return;

    // Displaced draws second
    c.dispPath.transition().duration(1300).ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);
    c.dispDots.selectAll("circle")
      .transition().delay((d, i) => 80 + i * 140).duration(280)
      .attr("opacity", 1);

    await sleep(1400);
    if (cancelled()) return;

    c.peakMark.transition().duration(500).attr("opacity", 1);
    c.dropMark.transition().duration(500).delay(150).attr("opacity", 1);

    // After 800ms, restore scrub
    await sleep(900);
    if (cancelled()) return;
    this.updateScrub();
  },
};

// ========================================================================
// 03 · PER-MODEL CURVE PICKER
// ========================================================================
const Picker = {
  init() {
    const sel = $("#picker-model");
    if (!sel) return;

    // Build dropdown sorted by drop magnitude (largest first)
    const forest = D.forest.slice().sort((a, b) => b.drop - a.drop);
    forest.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = `${r.label}   (drop ${fmt(r.drop, 3)})`;
      sel.appendChild(opt);
    });
    sel.value = "Qwen2.5-1.5B";

    sel.addEventListener("change", () => this.draw(sel.value));
    this.draw(sel.value);

    // ← → keyboard navigation when the picker section is in view
    const pickerStage = $("#picker-stage");
    if (pickerStage) {
      pickerStage.tabIndex = 0;
      let inView = false;
      const io = new IntersectionObserver(es => {
        for (const e of es) inView = e.isIntersecting;
      }, { threshold: 0.4 });
      io.observe(pickerStage);
      window.addEventListener("keydown", ev => {
        if (!inView) return;
        if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
        const opts = Array.from(sel.options);
        const cur  = opts.findIndex(o => o.value === sel.value);
        const nx   = ev.key === "ArrowRight"
                    ? Math.min(opts.length - 1, cur + 1)
                    : Math.max(0, cur - 1);
        if (nx !== cur) {
          sel.value = opts[nx].value;
          this.draw(sel.value);
        }
        ev.preventDefault();
      });
    }
  },

  draw(modelId) {
    const container = $("#picker-chart");
    if (!container) return;
    const W = Math.max(620, container.getBoundingClientRect().width);
    const H = 320;
    const margin = { top: 24, right: 36, bottom: 50, left: 70 };
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const series = D.perModelCurves[modelId]?.F0 || [];
    const forestRow = D.forest.find(r => r.id === modelId);
    const fam = forestRow?.family || "Qwen2.5";

    const x = d3.scaleLog().domain([1, 30]).range([0, w]);
    const yMax = d3.max(series, d => d.p) * 1.15 || 0.001;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(""));

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues(D.Ns).tickFormat(d3.format("d")));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".3f")));

    g.append("text").attr("class", "axis-label")
      .attr("x", w / 2).attr("y", h + 38).attr("text-anchor", "middle")
      .text("N (target copies)");
    g.append("text").attr("class", "axis-label")
      .attr("transform", `rotate(-90) translate(${-h/2},-50)`)
      .attr("text-anchor", "middle")
      .text("P(target)  ·  word mean");

    const line = d3.line().x(d => x(d.N)).y(d => y(d.p)).curve(d3.curveMonotoneX);

    g.append("path").attr("class", "curve").datum(series)
      .attr("stroke", FAM_COLOR[fam] || "var(--accent)")
      .attr("d", line);

    g.append("g").selectAll("circle").data(series).enter().append("circle")
      .attr("cx", d => x(d.N)).attr("cy", d => y(d.p)).attr("r", 4.5)
      .attr("fill", FAM_COLOR[fam] || "var(--accent)")
      .attr("stroke", "white").attr("stroke-width", 1.5);

    // Mark peak with dashed reference line
    if (forestRow) {
      const peakX = x(forestRow.peak_N);
      const peakY = y(forestRow.peak_P);
      g.append("line")
        .attr("x1", peakX).attr("x2", peakX)
        .attr("y1", peakY).attr("y2", h)
        .attr("stroke", "var(--line-strong)")
        .attr("stroke-dasharray", "2,4");
    }

    // Update meta below
    if (forestRow) {
      $("#picker-peak-n").textContent = `N = ${forestRow.peak_N}`;
      $("#picker-peak-p").textContent = fmt(forestRow.peak_P, 3);
      $("#picker-p30").textContent    = fmt(forestRow.p_at_30, 3);
      $("#picker-drop").textContent   = `${fmt(forestRow.drop, 3)}  ` +
        `[${fmt(forestRow.ci_lo, 3)}, ${fmt(forestRow.ci_hi, 3)}]`;
    }
  },
};

// ========================================================================
// 04 · FOREST PLOT
// ========================================================================
const Forest = {
  filterFamily: "all",
  filterObj:    "all",

  init() {
    this.draw();
    // Wire filter chips
    $$("#forest-filter-family .chip").forEach(c => {
      c.addEventListener("click", () => {
        $$("#forest-filter-family .chip").forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        this.filterFamily = c.dataset.fam;
        this.applyFilter();
      });
    });
    $$("#forest-filter-obj .chip").forEach(c => {
      c.addEventListener("click", () => {
        $$("#forest-filter-obj .chip").forEach(x => x.classList.remove("active"));
        c.classList.add("active");
        this.filterObj = c.dataset.obj;
        this.applyFilter();
      });
    });
  },

  applyFilter() {
    const matches = r =>
      (this.filterFamily === "all" || r.family === this.filterFamily) &&
      (this.filterObj    === "all" || r.objective === this.filterObj);
    d3.selectAll("#forest-chart circle.pt, #forest-chart line.ci")
      .transition().duration(220)
      .attr("opacity", function (d) {
        return matches(d) ? (d3.select(this).classed("ci") ? 0.55 : 1) : 0.10;
      });
    d3.selectAll("#forest-chart text.modelname, #forest-chart text.dropval")
      .transition().duration(220)
      .style("opacity", d => matches(d) ? 1 : 0.18);
  },

  draw() {
    const container = $("#forest-chart");
    if (!container) return;

    const W = Math.max(680, container.getBoundingClientRect().width);
    const margin = { top: 22, right: 50, bottom: 50, left: 170 };
    const rowH = 32;
    const h = D.forest.length * rowH;
    const w = W - margin.left - margin.right;
    const H = h + margin.top + margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xMin = Math.min(0, d3.min(D.forest, r => r.ci_lo) - 0.04);
    const xMax = d3.max(D.forest, r => r.ci_hi) + 0.04;
    const x = d3.scaleLinear().domain([xMin, xMax]).range([0, w]);
    const y = d3.scaleBand().domain(D.forest.map(r => r.id))
                .range([0, h]).padding(0.25);

    // Grid + zero line
    g.append("g").attr("class", "grid")
      .call(d3.axisTop(x).tickSize(-h).tickFormat("").ticks(8));
    g.append("line").attr("class", "zero-ref")
      .attr("x1", x(0)).attr("x2", x(0))
      .attr("y1", 0).attr("y2", h);

    // CI bars
    g.selectAll("line.ci").data(D.forest).enter().append("line")
      .attr("class", "ci")
      .attr("x1", r => x(r.ci_lo)).attr("x2", r => x(r.ci_hi))
      .attr("y1", r => y(r.id) + y.bandwidth() / 2)
      .attr("y2", r => y(r.id) + y.bandwidth() / 2)
      .attr("stroke", r => FAM_COLOR[r.family] || "var(--accent)")
      .attr("stroke-width", 2.4)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.55);

    // Point dots
    g.selectAll("circle.pt").data(D.forest).enter().append("circle")
      .attr("class", "pt hover-target")
      .attr("cx", r => x(r.drop))
      .attr("cy", r => y(r.id) + y.bandwidth() / 2)
      .attr("r", 7)
      .attr("fill", r => r.objective === "MLM" ? "white" : (FAM_COLOR[r.family] || "var(--accent)"))
      .attr("stroke", r => FAM_COLOR[r.family] || "var(--accent)")
      .attr("stroke-width", 2.4)
      .on("pointerenter", function (ev, r) {
        d3.select(this).attr("r", 9);
        const html = `
          <div class="tt-title">${r.label}</div>
          <div class="tt-row"><span class="tt-k">family</span><span class="tt-v">${r.family} (${r.objective})</span></div>
          <div class="tt-row"><span class="tt-k">params</span><span class="tt-v">${r.params_B}B</span></div>
          <div class="tt-row"><span class="tt-k">peak N</span><span class="tt-v">${r.peak_N}</span></div>
          <div class="tt-row"><span class="tt-k">peak P</span><span class="tt-v">${fmt(r.peak_P, 3)}</span></div>
          <div class="tt-row"><span class="tt-k">P at N=30</span><span class="tt-v">${fmt(r.p_at_30, 3)}</span></div>
          <div class="tt-row"><span class="tt-k">per-word drop</span><span class="tt-v">${fmt(r.drop, 3)}</span></div>
          <div class="tt-row"><span class="tt-k">95% CI</span><span class="tt-v">[${fmt(r.ci_lo, 3)}, ${fmt(r.ci_hi, 3)}]</span></div>
          <div class="tt-row"><span class="tt-k">n words</span><span class="tt-v">${r.n_words}</span></div>
          <div class="tt-row" style="margin-top:6px;color:var(--accent-soft)"><span class="tt-k">↩ click</span><span class="tt-v">jump to curve</span></div>
        `;
        Tooltip.show(html, ev);
      })
      .on("pointermove", ev => Tooltip.move(ev))
      .on("pointerleave", function () {
        d3.select(this).attr("r", 7);
        Tooltip.hide();
      })
      .on("click", (ev, r) => {
        const sel = $("#picker-model");
        if (!sel) return;
        sel.value = r.id;
        // Trigger change event so Picker redraws + briefly pulses
        sel.dispatchEvent(new Event("change"));
        const pat = $("#pattern");
        if (pat) pat.scrollIntoView({ behavior: "smooth", block: "start" });
        // Visual pulse on the picker stage
        const stage = $("#picker-stage");
        if (stage) {
          stage.classList.add("flash");
          setTimeout(() => stage.classList.remove("flash"), 1200);
        }
      });

    // Model labels on the left
    g.selectAll("text.modelname").data(D.forest).enter().append("text")
      .attr("class", "modelname")
      .attr("x", -14).attr("y", r => y(r.id) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .style("font-family", "var(--font-mono)").style("font-size", "12px")
      .style("fill", "var(--text)").text(r => r.label);

    // Drop values on the right
    g.selectAll("text.dropval").data(D.forest).enter().append("text")
      .attr("class", "dropval")
      .attr("x", w + 8).attr("y", r => y(r.id) + y.bandwidth() / 2 + 4)
      .style("font-family", "var(--font-mono)").style("font-size", "11px")
      .style("fill", "var(--text-soft)")
      .text(r => fmt(r.drop, 3));

    // X axis
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.format(".1f")));
    g.append("text").attr("class", "axis-label")
      .attr("x", w / 2).attr("y", h + 38).attr("text-anchor", "middle")
      .text("per-word drop  ·  (peak − P(N=30)) / peak");
  },
};

// ========================================================================
// 05 · ABLATION
// ========================================================================
const Ablation = {
  metric: "p_target",

  init() {
    const container = $("#ablation-chart");
    if (!container) return;
    const toggle = $("#abl-metric-toggle");
    if (toggle) {
      $$("button", toggle).forEach(btn => {
        btn.addEventListener("click", () => {
          $$("button", toggle).forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.metric = btn.dataset.metric;
          this.draw();
        });
      });
    }
    this.draw();
  },

  draw() {
    const container = $("#ablation-chart");
    if (!container) return;
    const W = Math.max(680, container.getBoundingClientRect().width);
    const margin = { top: 22, right: 28, bottom: 90, left: 64 };

    const models = D.ablation.models;
    const conds  = D.ablation.conditions;
    const dataMap = this.metric === "p_target" ? D.ablation.p_target : D.ablation.p_synonyms;

    const groupH = 230;
    const groupW = (W - margin.left - margin.right - 24 * (models.length - 1)) / models.length;
    const H = groupH + margin.top + margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Y scale shared across the four models
    let yMax = 0;
    for (const m of models) {
      for (const c of conds) {
        const v = dataMap[m]?.[c.code];
        if (v != null && v > yMax) yMax = v;
      }
    }
    yMax = yMax * 1.1 || 0.05;
    const yShared = d3.scaleLinear().domain([0, yMax]).range([groupH, 0]);

    models.forEach((mid, i) => {
      const xOff = margin.left + i * (groupW + 24);
      const g = svg.append("g").attr("transform", `translate(${xOff},${margin.top})`);

      // Title
      g.append("text")
        .attr("x", groupW / 2).attr("y", -6)
        .attr("text-anchor", "middle")
        .style("font-family", "var(--font-mono)").style("font-size", "12px")
        .style("fill", "var(--text)").text(mid);

      const x = d3.scaleBand().domain(conds.map(c => c.code))
                  .range([0, groupW]).padding(0.18);

      // Bars
      const bars = g.selectAll("rect.bar").data(conds).enter().append("rect")
        .attr("class", "bar hover-target")
        .attr("x", c => x(c.code))
        .attr("y", c => yShared(dataMap[mid]?.[c.code] ?? 0))
        .attr("width", x.bandwidth())
        .attr("height", c => groupH - yShared(dataMap[mid]?.[c.code] ?? 0))
        .attr("fill", c => {
          if (c.code === "full_repeat_N30")           return "var(--accent)";
          if (c.code === "truncate_to_N3")            return "var(--accent-soft)";
          if (c.code === "unique_semantic_filler")    return "var(--up)";
          return "var(--line-strong)";
        })
        .attr("opacity", 0.9)
        .on("pointerenter", function (ev, c) {
          d3.select(this).attr("opacity", 1);
          const pt  = D.ablation.p_target[mid]?.[c.code];
          const syn = D.ablation.p_synonyms[mid]?.[c.code];
          const html = `
            <div class="tt-title">${mid} · ${c.label}</div>
            <div class="tt-row"><span class="tt-k">P(target)</span><span class="tt-v">${fmt(pt, 3)}</span></div>
            <div class="tt-row"><span class="tt-k">Σ P(synonyms)</span><span class="tt-v">${fmt(syn, 3)}</span></div>
          `;
          Tooltip.show(html, ev);
        })
        .on("pointermove", ev => Tooltip.move(ev))
        .on("pointerleave", function () {
          d3.select(this).attr("opacity", 0.9);
          Tooltip.hide();
        });

      // Value labels
      g.selectAll("text.val").data(conds).enter().append("text")
        .attr("class", "val")
        .attr("x", c => x(c.code) + x.bandwidth() / 2)
        .attr("y", c => yShared(dataMap[mid]?.[c.code] ?? 0) - 4)
        .attr("text-anchor", "middle")
        .style("font-family", "var(--font-mono)").style("font-size", "10px")
        .style("fill", "var(--text-soft)")
        .text(c => {
          const v = dataMap[mid]?.[c.code];
          return v != null ? fmt(v, 3) : "—";
        });

      // X tick labels (rotated)
      g.append("g").attr("class", "axis")
        .attr("transform", `translate(0,${groupH})`)
        .call(d3.axisBottom(x).tickFormat(code => conds.find(c => c.code === code).label))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-32)")
        .attr("dx", "-6")
        .attr("dy", "0.8em")
        .style("font-size", "10.5px");

      // Y axis only on first
      if (i === 0) {
        g.append("g").attr("class", "axis")
          .call(d3.axisLeft(yShared).ticks(5).tickFormat(d3.format(".2f")));
        g.append("text").attr("class", "axis-label")
          .attr("transform", `rotate(-90) translate(${-groupH/2},-44)`)
          .attr("text-anchor", "middle")
          .text(this.metric === "p_target" ? "P(target)" : "Σ P(synonyms)");
      }
    });
  },
};

// ========================================================================
// 06 · MULTILINGUAL HEATMAP
// ========================================================================
const Multiling = {
  frame: "F0",

  // Per-language prompt templates. F0–F2 are hand-translated to idiomatic
  // equivalents (paper Appendix B); the word shown is a representative
  // single-token noun (each cell actually averages over 28–49 nouns).
  LANG: {
    English: {
      word: "cat",
      F0: "The word I keep thinking about is",
      F1: "The topic was",
      F2: "I want to mention",
    },
    Spanish: {
      word: "gato",
      F0: "La palabra en la que sigo pensando es",
      F1: "El tema era",
      F2: "Quiero mencionar",
    },
    German: {
      word: "Buch",
      F0: "Das Wort, an das ich immer wieder denke, ist",
      F1: "Das Thema war",
      F2: "Ich möchte erwähnen",
    },
    French: {
      word: "chat",
      F0: "Le mot auquel je pense sans cesse est",
      F1: "Le sujet était",
      F2: "Je veux mentionner",
    },
    Chinese: {
      word: "猫",
      F0: "我一直在想的那个词是",
      F1: "主题是",
      F2: "我想提一下",
    },
  },

  buildPrompts(lang, frame) {
    const cfg = this.LANG[lang] || this.LANG.English;
    const w = cfg.word;
    const N = 5;
    const block = Array(N).fill(`<span class="tgt">${w}</span>`).join(" ");
    const mask = `<span class="mask">[MASK]</span>`;
    const adj  = `${block} ${mask} .`;
    const frameText = cfg[frame] || cfg.F0;
    const sep = (lang === "Chinese") ? "。" : " . ";
    const disp = `${block}${sep}${frameText} ${mask} .`;
    return { adj, disp };
  },

  openDrilldown(c) {
    const modal = $("#drilldown");
    if (!modal) return;
    const { adj, disp } = this.buildPrompts(c.lang, c.frame);
    $("#drill-eyebrow").textContent = `${c.lang.toUpperCase()} · ${c.frame}`;
    $("#drill-title").textContent   = c.model;
    $("#drill-frame-id").textContent = c.frame;
    $("#drill-prompt-adj").innerHTML  = adj;
    $("#drill-prompt-disp").innerHTML = disp;
    const stats = $("#drill-stats");
    stats.innerHTML = `
      <div class="ds-row"><span class="ds-k">peak N</span><span class="ds-v">${c.peak_N}</span></div>
      <div class="ds-row"><span class="ds-k">peak P</span><span class="ds-v">${fmt(c.peak_P, 3)}</span></div>
      <div class="ds-row"><span class="ds-k">P at N=30</span><span class="ds-v">${fmt(c.p_at_30, 3)}</span></div>
      <div class="ds-row"><span class="ds-k">per-word drop</span><span class="ds-v">${fmt(c.drop, 3)}</span></div>
      <div class="ds-row"><span class="ds-k">95% CI</span><span class="ds-v">[${fmt(c.ci_lo, 3)}, ${fmt(c.ci_hi, 3)}]</span></div>
      <div class="ds-row"><span class="ds-k">n words</span><span class="ds-v">${c.n_words}</span></div>
    `;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  },

  closeDrilldown() {
    const modal = $("#drilldown");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  },

  init() {
    const container = $("#multiling-chart");
    if (!container) return;
    const toggle = $("#frame-toggle");
    if (toggle) {
      $$("button", toggle).forEach(btn => {
        btn.addEventListener("click", () => {
          $$("button", toggle).forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.frame = btn.dataset.frame;
          this.draw();
        });
      });
    }
    this.draw();

    // Wire dismiss handlers once
    const modal = $("#drilldown");
    if (modal) {
      const closeBtn = $("#drill-close");
      if (closeBtn) closeBtn.addEventListener("click", () => this.closeDrilldown());
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeDrilldown();
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) this.closeDrilldown();
      });
    }
  },

  draw() {
    const container = $("#multiling-chart");
    if (!container) return;
    const W = Math.max(640, container.getBoundingClientRect().width);
    const margin = { top: 36, right: 70, bottom: 40, left: 120 };

    const models = D.multilingual.models;
    const langs  = D.multilingual.langs;

    const cellW = (W - margin.left - margin.right) / langs.length;
    const cellH = 64;
    const h = models.length * cellH;
    const w = langs.length * cellW;
    const H = h + margin.top + margin.bottom;

    const cellMap = {};
    for (const c of D.multilingual.cells) {
      if (c.frame !== this.frame) continue;
      cellMap[`${c.model}|${c.lang}`] = c;
    }

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const color = d3.scaleSequential(d3.interpolateRgbBasis([
      "#f4e7d4",  // near-zero (warm cream)
      "#a8d4c4",  // mild positive
      "#5d9d83",  // mid positive
      "#2e5d4a",  // strong positive
    ])).domain([0, 0.9]);

    // Column labels
    g.selectAll("text.col").data(langs).enter().append("text")
      .attr("class", "col")
      .attr("x", (d, i) => i * cellW + cellW / 2)
      .attr("y", -14)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)").style("font-size", "12px")
      .style("fill", "var(--text)").text(d => d);

    // Row labels
    g.selectAll("text.row").data(models).enter().append("text")
      .attr("class", "row")
      .attr("x", -14).attr("y", (d, i) => i * cellH + cellH / 2 + 4)
      .attr("text-anchor", "end")
      .style("font-family", "var(--font-mono)").style("font-size", "12px")
      .style("fill", "var(--text)").text(d => d);

    // Cells
    for (let i = 0; i < models.length; i++) {
      for (let j = 0; j < langs.length; j++) {
        const m = models[i], l = langs[j];
        const c = cellMap[`${m}|${l}`];
        const gx = j * cellW, gy = i * cellH;
        const cell = g.append("g").attr("transform", `translate(${gx},${gy})`);
        if (!c) {
          // Excluded (e.g., XLM-R Chinese)
          cell.append("rect")
            .attr("width", cellW - 2).attr("height", cellH - 2)
            .attr("fill", "var(--bg-warm)")
            .attr("stroke", "var(--line)")
            .attr("stroke-dasharray", "3,3");
          cell.append("text")
            .attr("x", cellW/2).attr("y", cellH/2 + 4)
            .attr("text-anchor", "middle")
            .style("font-family", "var(--font-mono)").style("font-size", "10px")
            .style("fill", "var(--text-faint)").text("excluded");
          continue;
        }
        const self = this;
        cell.append("rect")
          .attr("class", "hover-target")
          .attr("width", cellW - 2).attr("height", cellH - 2)
          .attr("fill", color(c.drop))
          .attr("stroke", "var(--bg-card)").attr("stroke-width", 1.5)
          .on("click", () => self.openDrilldown(c))
          .on("pointerenter", function (ev) {
            d3.select(container).selectAll("rect")
              .attr("stroke", "var(--bg-card)").attr("stroke-width", 1.5);
            d3.select(this).attr("stroke", "var(--text)").attr("stroke-width", 2);
            const html = `
              <div class="tt-title">${c.model} · ${c.lang} · ${c.frame}</div>
              <div class="tt-row"><span class="tt-k">peak N</span><span class="tt-v">${c.peak_N}</span></div>
              <div class="tt-row"><span class="tt-k">peak P</span><span class="tt-v">${fmt(c.peak_P, 3)}</span></div>
              <div class="tt-row"><span class="tt-k">P at N=30</span><span class="tt-v">${fmt(c.p_at_30, 3)}</span></div>
              <div class="tt-row"><span class="tt-k">drop</span><span class="tt-v">${fmt(c.drop, 3)}</span></div>
              <div class="tt-row"><span class="tt-k">95% CI</span><span class="tt-v">[${fmt(c.ci_lo, 3)}, ${fmt(c.ci_hi, 3)}]</span></div>
              <div class="tt-row"><span class="tt-k">n words</span><span class="tt-v">${c.n_words}</span></div>
            `;
            Tooltip.show(html, ev);
          })
          .on("pointermove", ev => Tooltip.move(ev))
          .on("pointerleave", function (ev) {
            if (ev.pointerType !== "touch") {
              d3.select(this).attr("stroke", "var(--bg-card)").attr("stroke-width", 1.5);
            }
            Tooltip.hide();
          });
        cell.append("text")
          .attr("x", cellW / 2).attr("y", cellH / 2 - 4)
          .attr("text-anchor", "middle")
          .style("font-family", "var(--font-mono)").style("font-size", "13px")
          .style("font-weight", "500")
          .style("fill", c.drop > 0.55 ? "white" : "var(--text)")
          .text(fmt(c.drop, 3));
        cell.append("text")
          .attr("x", cellW / 2).attr("y", cellH / 2 + 14)
          .attr("text-anchor", "middle")
          .style("font-family", "var(--font-mono)").style("font-size", "9.5px")
          .style("fill", c.drop > 0.55 ? "rgba(255,255,255,0.78)" : "var(--text-mute)")
          .text(`peak N=${c.peak_N}`);
      }
    }
  },
};

// ========================================================================
// 07 · ATTENTION BUDGET
// ========================================================================
const Attention = {
  metric: "total_block",

  init() {
    const container = $("#attention-chart");
    if (!container) return;
    const toggle = $("#attn-metric-toggle");
    if (toggle) {
      $$("button", toggle).forEach(btn => {
        btn.addEventListener("click", () => {
          $$("button", toggle).forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.metric = btn.dataset.attn;
          this.draw();
        });
      });
    }
    this.draw();
  },

  draw() {
    const container = $("#attention-chart");
    if (!container) return;
    // Update stage hint
    const hint = $("#attn-hint");
    if (hint) hint.textContent = this.metric === "per_token"
      ? "solid: per-token attn · dashed: 1/N reference"
      : "block budget grows in CLMs; flat in MLM";
    const W = Math.max(680, container.getBoundingClientRect().width);
    const H = 380;
    const margin = { top: 30, right: 160, bottom: 60, left: 70 };
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const Ns = D.attention.Ns;
    const models = Object.keys(D.attention.byModel);

    const x = d3.scaleLog().domain([3, 30]).range([0, w]);
    let yMax = 0;
    for (const m of models) {
      const v = D.attention.byModel[m][this.metric];
      const mm = d3.max(v);
      if (mm > yMax) yMax = mm;
    }
    yMax = yMax * 1.1 || 0.01;
    const y = d3.scaleLinear().domain([0, yMax]).range([h, 0]);

    g.append("g").attr("class", "grid").call(d3.axisLeft(y).tickSize(-w).tickFormat(""));

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues(Ns).tickFormat(d3.format("d")));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(6).tickFormat(d3.format(".2f")));

    g.append("text").attr("class", "axis-label")
      .attr("x", w / 2).attr("y", h + 38).attr("text-anchor", "middle")
      .text("N (target copies)");
    g.append("text").attr("class", "axis-label")
      .attr("transform", `rotate(-90) translate(${-h/2},-50)`)
      .attr("text-anchor", "middle")
      .text(this.metric === "total_block"
        ? "Total attention assigned to the block"
        : "Per-target-token attention");

    const line = d3.line().x((d, i) => x(Ns[i])).y(d => y(d)).curve(d3.curveMonotoneX);

    const colorOf = m => {
      const fam = D.attention.byModel[m].objective === "MLM"
        ? "var(--fam-ModernBERT)"
        : (m.startsWith("Qwen") ? "var(--fam-Qwen2-5)" : "var(--fam-OLMo-2)");
      return fam;
    };

    // For per-token view: overlay each model's 1/N reference (thin dashed)
    if (this.metric === "per_token") {
      models.forEach(m => {
        const refArr = D.attention.byModel[m].ref_1_over_N;
        g.append("path")
          .attr("class", "ref-line")
          .attr("stroke", colorOf(m))
          .attr("stroke-width", 1.1)
          .attr("stroke-dasharray", "2,4")
          .attr("opacity", 0.55)
          .attr("fill", "none")
          .datum(refArr).attr("d", line);
      });
    }

    // Plot lines
    models.forEach(m => {
      const arr = D.attention.byModel[m][this.metric];
      g.append("path").attr("class", "curve")
        .attr("stroke", colorOf(m))
        .attr("stroke-width", D.attention.byModel[m].objective === "MLM" ? 3.4 : 2.4)
        .attr("stroke-dasharray", D.attention.byModel[m].objective === "MLM" ? "6,4" : null)
        .datum(arr).attr("d", line);

      g.append("g").selectAll("circle").data(arr).enter().append("circle")
        .attr("class", "hover-target")
        .attr("cx", (d, i) => x(Ns[i])).attr("cy", d => y(d)).attr("r", 4)
        .attr("fill", colorOf(m)).attr("stroke", "white").attr("stroke-width", 1.5)
        .on("pointerenter", function (ev, d) {
          const i = arr.indexOf(d);
          d3.select(this).attr("r", 7);
          const row = D.attention.byModel[m];
          const html = `
            <div class="tt-title">${m} · N=${Ns[i]}</div>
            <div class="tt-row"><span class="tt-k">total block</span><span class="tt-v">${fmt(row.total_block[i], 3)}</span></div>
            <div class="tt-row"><span class="tt-k">per-token</span><span class="tt-v">${fmt(row.per_token[i], 3)}</span></div>
            <div class="tt-row"><span class="tt-k">1/N reference</span><span class="tt-v">${fmt(row.ref_1_over_N[i], 3)}</span></div>
            <div class="tt-row"><span class="tt-k">objective</span><span class="tt-v">${row.objective}</span></div>
          `;
          Tooltip.show(html, ev);
        })
        .on("pointermove", ev => Tooltip.move(ev))
        .on("pointerleave", function () {
          d3.select(this).attr("r", 4);
          Tooltip.hide();
        });
    });

    // End labels — collect, sort by y, push apart if too close
    const labels = models.map(m => {
      const arr = D.attention.byModel[m][this.metric];
      return { m, lastVal: arr[arr.length - 1], yPx: y(arr[arr.length - 1]) };
    }).sort((a, b) => a.yPx - b.yPx);
    const minGap = 14;
    for (let i = 1; i < labels.length; i++) {
      if (labels[i].yPx - labels[i - 1].yPx < minGap) {
        labels[i].yPx = labels[i - 1].yPx + minGap;
      }
    }
    labels.forEach(L => {
      g.append("text")
        .attr("x", x(Ns[Ns.length - 1]) + 12)
        .attr("y", L.yPx + 4)
        .style("font-family", "var(--font-mono)").style("font-size", "11px")
        .style("fill", colorOf(L.m))
        .text(L.m);
    });
  },
};

// ========================================================================
// 08 · BOUNDARY — depth vs drop scatter
// ========================================================================
const Boundary = {
  init() { this.draw(); },

  draw() {
    const container = $("#boundary-chart");
    if (!container) return;
    const W = Math.max(700, container.getBoundingClientRect().width);
    const H = 430;
    const margin = { top: 30, right: 40, bottom: 60, left: 70 };
    const w = W - margin.left - margin.right;
    const h = H - margin.top - margin.bottom;

    d3.select(container).selectAll("*").remove();
    const svg = d3.select(container).append("svg")
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Build point set: family-coloured
    const pts = [];
    D.boundary.smollm2.forEach(r => pts.push({...r, fam: "SmolLM2"}));
    D.boundary.bert_turc.forEach(r => pts.push({...r, fam: "BERT"}));

    // Parse params string to numeric (M)
    const paramsM = s => {
      const v = parseFloat(s);
      return s.endsWith("B") ? v * 1000 : v;   // → M
    };
    pts.forEach(p => p.params_M = paramsM(p.params));

    const x = d3.scaleLog().domain([1.8, 36]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 0.6]).range([h, 0]);
    const r = d3.scaleSqrt()
      .domain([d3.min(pts, p => p.params_M), d3.max(pts, p => p.params_M)])
      .range([7, 26]);

    const color = fam => fam === "SmolLM2" ? "var(--fam-SmolLM2)" : "var(--fam-ModernBERT)";

    // Grid
    g.append("g").attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(""));

    // X axis
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(x).tickValues([2, 4, 8, 16, 24, 32]).tickFormat(d3.format("d")));
    g.append("text").attr("class", "axis-label")
      .attr("x", w / 2).attr("y", h + 40).attr("text-anchor", "middle")
      .text("layers (log scale)");

    // Y axis
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(7).tickFormat(d3.format(".2f")));
    g.append("text").attr("class", "axis-label")
      .attr("transform", `rotate(-90) translate(${-h/2},-46)`)
      .attr("text-anchor", "middle")
      .text("per-word drop");

    // Same-family connecting lines
    ["SmolLM2", "BERT"].forEach(fam => {
      const famPts = pts.filter(p => p.fam === fam).sort((a, b) => a.layers - b.layers);
      const line = d3.line().x(d => x(d.layers)).y(d => y(d.drop));
      g.append("path")
        .attr("d", line(famPts))
        .attr("fill", "none")
        .attr("stroke", color(fam))
        .attr("stroke-width", 1.4)
        .attr("stroke-dasharray", "3,4")
        .attr("opacity", 0.55);
    });

    // Points
    pts.forEach(p => {
      const gp = g.append("g").attr("transform", `translate(${x(p.layers)},${y(p.drop)})`);
      gp.append("circle")
        .attr("class", "hover-target")
        .attr("r", r(p.params_M))
        .attr("fill", color(p.fam))
        .attr("opacity", 0.78)
        .attr("stroke", "var(--bg-elevated)")
        .attr("stroke-width", 2);

      // Label outside the circle to the right
      const labelX = r(p.params_M) + 8;
      gp.append("text")
        .attr("x", labelX).attr("y", -2)
        .style("font-family", "var(--font-mono)").style("font-size", "11.5px")
        .style("font-weight", "500")
        .style("fill", "var(--text)").text(p.id);
      gp.append("text")
        .attr("x", labelX).attr("y", 12)
        .style("font-family", "var(--font-mono)").style("font-size", "10px")
        .style("fill", "var(--text-mute)")
        .text(`${p.layers} layers · ${p.params}`);
    });

    // Legend
    const lg = svg.append("g").attr("transform", `translate(${margin.left + 12}, ${margin.top + 8})`);
    [
      { fam: "SmolLM2",     label: "SmolLM2 family" },
      { fam: "BERT",        label: "BERT-tiny/mini/small (Turc et al.)" },
    ].forEach((it, i) => {
      lg.append("circle").attr("cx", 7).attr("cy", i * 20 + 7).attr("r", 6)
        .attr("fill", color(it.fam)).attr("opacity", 0.78);
      lg.append("text").attr("x", 20).attr("y", i * 20 + 11)
        .style("font-family", "var(--font-mono)").style("font-size", "11px")
        .style("fill", "var(--text-soft)").text(it.label);
    });

    // Annotation: the 2→4 layer jump
    const tiny = pts.find(p => p.id === "BERT-tiny");
    const mini = pts.find(p => p.id === "BERT-mini");
    if (tiny && mini) {
      const ax1 = x(tiny.layers), ay1 = y(tiny.drop);
      const ax2 = x(mini.layers), ay2 = y(mini.drop);
      const midX = (ax1 + ax2) / 2;
      const midY = (ay1 + ay2) / 2;
      g.append("text")
        .attr("x", midX + 14).attr("y", midY)
        .style("font-family", "var(--font-display)")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .style("fill", "var(--accent)")
        .text("2 → 4 layers");
      g.append("text")
        .attr("x", midX + 14).attr("y", midY + 16)
        .style("font-family", "var(--font-display)")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .style("fill", "var(--text-mute)")
        .text("inverted-U appears");
    }
  },
};

// ========================================================================
// REVEAL ON SCROLL
// ========================================================================
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => obs.observe(el));
}

// ========================================================================
// RESIZE
// ========================================================================
let resizeTimer = null;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if ($("#curves-chart"))    Curves.draw();
    if ($("#picker-chart"))    Picker.draw($("#picker-model")?.value || "Qwen2.5-1.5B");
    if ($("#forest-chart"))    Forest.draw();
    if ($("#ablation-chart"))  Ablation.draw();
    if ($("#multiling-chart")) Multiling.draw();
    if ($("#attention-chart")) Attention.draw();
    if ($("#boundary-chart"))  Boundary.draw();
  }, 220);
}

// ========================================================================
// BOOT
// ========================================================================
function boot() {
  if (!D) {
    console.error("[boot] window.DATA not loaded — check data.js");
    return;
  }
  const safe = (label, fn) => {
    try { fn(); } catch (e) { console.error(`[boot] ${label} failed:`, e); }
  };
  safe("Nav",         () => Nav.init());
  safe("Hero",        () => Hero.init());
  safe("HeroLeak",    () => HeroLeak.init());
  safe("Schematic",   () => Schematic.init());
  safe("Curves",      () => Curves.init());
  safe("Picker",      () => Picker.init());
  safe("Forest",      () => Forest.init());
  safe("Ablation",    () => Ablation.init());
  safe("Multiling",   () => Multiling.init());
  safe("Attention",   () => Attention.init());
  safe("Boundary",    () => Boundary.init());
  safe("BibTeXCopy",  () => BibTeXCopy.init());
  safe("Reveal",      () => initReveal());
  window.addEventListener("resize", onResize);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
