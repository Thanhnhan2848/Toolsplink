(function(){
  if (document.getElementById("pji-floating-ui")) {
    const w = document.getElementById("pji-floating-ui").shadowRoot?.querySelector("#w");
    if (w) w.classList.toggle("a");
    return;
  }

  // Inject Anti-blur / Keep alive
  const s = document.createElement("script");
  s.textContent = `try{Object.defineProperty(document,"hidden",{get:()=>!1,configurable:!0}),Object.defineProperty(document,"visibilityState",{get:()=>"visible",configurable:!0}),document.hasFocus=()=>!1}catch(e){}window.addEventListener("visibilitychange",e=>e.stopImmediatePropagation(),!0),window.addEventListener("blur",e=>e.stopImmediatePropagation(),!0);window.__pji_anti_redirect=!1;const o=window.open;window.open=function(...a){return window.__pji_anti_redirect?null:o.apply(this,a)};`;
  (document.head || document.documentElement).appendChild(s);
  s.remove();

  const toggleAd = e => {
    let c = document.getElementById("pji_adblock_css");
    if (e) {
      if (!c) {
        c = document.createElement("style");
        c.id = "pji_adblock_css";
        c.textContent = `iframe[src*="doubleclick"],iframe[src*="adservice"],iframe[src*="popads"],iframe[src*="exoclick"],div[id^="google_ads"],div[class*="popunder"]{display:none!important}`;
        (document.head || document.documentElement).appendChild(c);
      }
    } else c && c.remove();
  };

  const LS = k => { try { return JSON.parse(localStorage.getItem("pji_" + k)); } catch { return null; } };
  const SS = (k, v) => { try { localStorage.setItem("pji_" + k, JSON.stringify(v)); } catch {} };

  const ui = document.createElement("div");
  ui.id = "pji-floating-ui";
  ui.style.cssText = "all:initial;position:fixed;top:20px;left:20px;z-index:2147483647;touch-action:none;";
  (document.body || document.documentElement).appendChild(ui);

  const pos = LS("Pos");
  if (pos) ui.style.cssText += `left:${pos.l}px;top:${pos.t}px;`;

  const shadow = ui.attachShadow({ mode: "closed" });
  const html = document.createElement("div");
  html.innerHTML = `
    <style>
      *{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif}
      #w{width:260px;background:#121216ee;backdrop-filter:blur(10px);border:1px solid #ffffff20;border-radius:12px;display:none;margin-top:8px;padding:10px}
      #w.a{display:block}
      #b{width:42px;height:42px;background:#121214;border:1px solid #ffffff30;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#10b981;font-weight:900;cursor:grab;box-shadow:0 4px 10px #0008}
      .h{display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid #ffffff10;color:#10b981;font-weight:900;font-size:13px}
      .c{background:none;border:none;color:#9ca3af;cursor:pointer;font-weight:700}
      .t{display:flex;justify-content:space-between;align-items:center;color:#eee;font-size:11px;margin-top:8px}
      .s{position:relative;width:32px;height:16px}
      .s input{opacity:0;width:0;height:0}
      .i{position:absolute;inset:0;background:#374151;border-radius:9px;cursor:pointer}
      .i:before{content:"";position:absolute;height:10px;width:10px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s}
      input:checked+.i{background:#10b981}
      input:checked+.i:before{transform:translateX(16px)}
    </style>
    <div id="b">PJI</div>
    <div id="w">
      <div class="h"><span>CREDIT • PJI</span><button class="c" id="x">✕</button></div>
      <div class="t"><span>Auto Scroll</span><label class="s"><input type="checkbox" id="c1"><span class="i"></span></label></div>
      <div class="t"><span>Khóa Chuyển Hướng</span><label class="s"><input type="checkbox" id="c2"><span class="i"></span></label></div>
      <div class="t"><span>Chặn quảng cáo</span><label class="s"><input type="checkbox" id="c3"><span class="i"></span></label></div>
      <div class="t"><span>Giữ tab hoạt động</span><label class="s"><input type="checkbox" id="c4"><span class="i"></span></label></div>
    </div>
  `;
  shadow.appendChild(html);

  const bubble = shadow.querySelector("#b"),
        wrapper = shadow.querySelector("#w"),
        btnClose = shadow.querySelector("#x"),
        c1 = shadow.querySelector("#c1"),
        c2 = shadow.querySelector("#c2"),
        c3 = shadow.querySelector("#c3"),
        c4 = shadow.querySelector("#c4");

  let isD = !1, moved = !1, sX = 0, sY = 0, iL = 0, iT = 0, sInt = null, sDir = 1;

  const onMove = e => {
    if (!isD) return;
    const t = e.touches ? e.touches[0] : e, dx = t.clientX - sX, dy = t.clientY - sY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = !0;
    ui.style.left = Math.max(6, Math.min(iL + dx, window.innerWidth - 50)) + "px";
    ui.style.top = Math.max(6, Math.min(iT + dy, window.innerHeight - 50)) + "px";
  };

  const onEnd = () => {
    if (!isD) return;
    isD = !1;
    SS("Pos", { l: parseInt(ui.style.left, 10), t: parseInt(ui.style.top, 10) });
  };

  const onStart = e => {
    if (["INPUT", "LABEL", "BUTTON"].includes(e.target.tagName)) return;
    isD = !0; moved = !1;
    const t = e.touches ? e.touches[0] : e;
    sX = t.clientX; sY = t.clientY;
    iL = parseInt(ui.style.left || "20", 10);
    iT = parseInt(ui.style.top || "20", 10);
    window.addEventListener("mousemove", onMove, { passive: !0 });
    window.addEventListener("mouseup", onEnd, { passive: !0 });
    window.addEventListener("touchmove", onMove, { passive: !0 });
    window.addEventListener("touchend", onEnd, { passive: !0 });
  };

  bubble.addEventListener("mousedown", onStart);
  bubble.addEventListener("touchstart", onStart);
  bubble.onclick = () => { if (!moved) wrapper.classList.toggle("a"); };
  btnClose.onclick = () => wrapper.classList.remove("a");

  const st = LS("Set") || {};
  if (st.s) { c2.checked = !0; window.__pji_anti_redirect = !0; }
  if (st.f) c4.checked = !0;
  if (st.a) { c3.checked = !0; toggleAd(!0); }

  c1.onchange = e => {
    if (e.target.checked) {
      sInt = setInterval(() => {
        const y = window.scrollY, m = document.body.scrollHeight - window.innerHeight;
        if (sDir === 1) {
          window.scrollBy({ top: 600, behavior: "smooth" });
          if (y >= m - 30) sDir = -1;
        } else {
          window.scrollBy({ top: -600, behavior: "smooth" });
          if (y <= 30) sDir = 1;
        }
      }, 300);
    } else clearInterval(sInt);
  };

  c2.onchange = e => {
    SS("Set", { ...LS("Set") || {}, s: e.target.checked });
    window.__pji_anti_redirect = e.target.checked;
  };

  c3.onchange = e => {
    SS("Set", { ...LS("Set") || {}, a: e.target.checked });
    toggleAd(e.target.checked);
  };

  c4.onchange = e => {
    SS("Set", { ...LS("Set") || {}, f: e.target.checked });
  };

  window.addEventListener("click", e => {
    if (!window.__pji_anti_redirect) return;
    let el = e.target;
    while (el && el !== document) {
      if (el.tagName === "A" || el.style?.cursor === "pointer") {
        const h = el.getAttribute?.("href");
        if (h && !h.startsWith("#") && !h.startsWith("javascript:")) {
          e.preventDefault();
          e.stopPropagation();
        }
        break;
      }
      el = el.parentNode;
    }
  }, !0);
})();
