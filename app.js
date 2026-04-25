
// ─── STATE ────────────────────────────────────────────────────
let appData = null;
let user = {
  name: "Peziarah",
  points: 0,
  level: 1,
  completed: [],
  badges: [],
  reflections: {},
  reflectionAnalysis: {}, 
  quizAttempts: {},       
  morality: {             
    iman: 0,
    ketaatan: 0,
    kasih: 0
  },
  decisionHistory: [],
  combo: 0,
  maxCombo: 0,
  learningInsight: null,
  pretestDone: false,
  pretestScore: 0,
  posttestDone: false,
  posttestScore: 0
};
let currentIdx = 0;
let quizAnswered = false;
let quizRetry = false;
let currentStep = "story"; 

let userPath = localStorage.getItem("mj_path") || "default";
let quizTimerInterval = null;
let decisionTimerInterval = null;

let tts = {
  utterance: null,
  isSpeaking: false,
  isPaused: false
};

// 🔥 Mapping Pedagogis (Capaian Pembelajaran & Taksonomi Bloom)
const pedagogicalMapping = {
  1: { cp: "Mengenal sifat empati Yesus", bloom: "C2 - Pemahaman" },
  2: { cp: "Merespons panggilan ketaatan", bloom: "C3 - Aplikasi" },
  3: { cp: "Mengelola ketakutan dengan iman", bloom: "C4 - Analisis" },
  4: { cp: "Menjaga fokus iman dalam krisis", bloom: "C4 - Analisis" },
  5: { cp: "Menyadari dampak kemurahan hati", bloom: "C3 - Aplikasi" },
  6: { cp: "Membangun persahabatan kristiani", bloom: "C3 - Aplikasi" },
  7: { cp: "Berani mendekat dalam kelemahan", bloom: "C4 - Analisis" },
  8: { cp: "Menumbuhkan sikap syukur sejati", bloom: "C3 - Aplikasi" },
  9: { cp: "Percaya pada kuasa pembebasan", bloom: "C2 - Pemahaman" },
  10: { cp: "Menjaga harapan dalam keputusasaan", bloom: "C4 - Analisis" },
  11: { cp: "Mengembangkan kepekaan sosial", bloom: "C3 - Aplikasi" },
  12: { cp: "Menemukan terang di tengah kegelapan", bloom: "C4 - Analisis" },
  13: { cp: "Memahami otoritas firman Tuhan", bloom: "C2 - Pemahaman" },
  14: { cp: "Belajar berbagi dalam kekurangan", bloom: "C3 - Aplikasi" },
  15: { cp: "Sabar dalam proses Tuhan", bloom: "C2 - Pemahaman" },
  16: { cp: "Percaya Yesus adalah kebangkitan", bloom: "C4 - Analisis" },
  17: { cp: "Menghasilkan buah iman yang nyata", bloom: "C3 - Aplikasi" },
  18: { cp: "Mempercayai pemeliharaan tak terduga", bloom: "C2 - Pemahaman" },
  19: { cp: "Pentingnya kembali untuk bersyukur", bloom: "C2 - Pemahaman" },
  20: { cp: "Bangkit dari kelumpuhan harapan", bloom: "C4 - Analisis" },
  21: { cp: "Mengutamakan kasih di atas aturan", bloom: "C4 - Analisis" },
  22: { cp: "Menjaga integritas dan kebenaran", bloom: "C4 - Analisis" },
  23: { cp: "Bertekun dalam seruan doa", bloom: "C3 - Aplikasi" },
  24: { cp: "Mengimani kebangkitan sebagai inti injil", bloom: "C2 - Pemahaman" }
};

function getBloomColor(bloomLvl) {
  if (!bloomLvl) return { bg: "var(--surface2)", text: "var(--muted)" };
  if (bloomLvl.includes("C1")) return { bg: "#e0f2fe", text: "#2563eb" }; // Blue
  if (bloomLvl.includes("C2")) return { bg: "#dcfce7", text: "#16a34a" }; // Green
  if (bloomLvl.includes("C3")) return { bg: "#fef9c3", text: "#d97706" }; // Yellow/Orange
  if (bloomLvl.includes("C4")) return { bg: "#fee2e2", text: "#dc2626" }; // Red
  return { bg: "var(--surface2)", text: "var(--muted)" };
}

// ─── UI COMPONENTS (CUSTOM ALERTS) ────────────────────────────
window.showCustomAlert = function(title, message, icon = 'info', type = 'primary') {
  const overlay = document.createElement("div");
  overlay.style.cssText = "display:flex; position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(8px); z-index:99999; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;";
  
  let iconColor = 'var(--primary)';
  let bgIcon = 'var(--primary-light)';
  let btnColor = 'var(--primary)';
  
  if(type === 'error') {
      iconColor = 'var(--error)';
      bgIcon = 'var(--error-light)';
      btnColor = 'var(--error)';
  } else if (type === 'warning') {
      iconColor = 'var(--accent)';
      bgIcon = 'var(--accent-light)';
      btnColor = 'var(--accent)';
  }

  overlay.innerHTML = `
    <div class="card p-6 fade-up" style="max-width:90%; width:380px; background:var(--surface); border-radius:24px; box-shadow:var(--shadow-lg); text-align:center;">
      <div style="width:60px; height:60px; border-radius:50%; background:${bgIcon}; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <span class="material-symbols-outlined" style="color:${iconColor}; font-size:32px; font-variation-settings:'FILL' 1;">${icon}</span>
      </div>
      <h3 class="font-sans font-bold" style="font-size:1.25rem; color:var(--on-bg); margin-bottom:8px;">${title}</h3>
      <p class="font-sans text-sm" style="color:var(--muted); line-height:1.6; margin-bottom:24px; white-space:pre-line;">${message}</p>
      <button id="btn-close-alert" class="btn-primary" style="width:100%; justify-content:center; background:${btnColor}; border-color:${btnColor};">
        Mengerti
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.style.opacity = "1";
  
  overlay.querySelector("#btn-close-alert").onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
  };
};

window.showCustomConfirm = function(title, message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.style.cssText = "display:flex; position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(8px); z-index:99999; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;";
  
  overlay.innerHTML = `
    <div class="card p-6 fade-up" style="max-width:90%; width:380px; background:var(--surface); border-radius:24px; box-shadow:var(--shadow-lg); text-align:center;">
      <div style="width:60px; height:60px; border-radius:50%; background:var(--error-light); display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
        <span class="material-symbols-outlined" style="color:var(--error); font-size:32px; font-variation-settings:'FILL' 1;">warning</span>
      </div>
      <h3 class="font-sans font-bold" style="font-size:1.25rem; color:var(--on-bg); margin-bottom:8px;">${title}</h3>
      <p class="font-sans text-sm" style="color:var(--muted); line-height:1.6; margin-bottom:24px;">${message}</p>
      <div style="display:flex; gap:12px;">
        <button id="btn-cancel-confirm" class="btn-outline" style="flex:1; justify-content:center; border-color:var(--muted); color:var(--muted);">Batal</button>
        <button id="btn-ok-confirm" class="btn-primary" style="flex:1; justify-content:center; background:var(--error); border-color:var(--error);">Ya, Lanjutkan</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  void overlay.offsetWidth;
  overlay.style.opacity = "1";
  
  const close = () => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector("#btn-cancel-confirm").onclick = close;
  overlay.querySelector("#btn-ok-confirm").onclick = () => {
      close();
      onConfirm();
  };
};

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("mj_theme") || "light");
  loadUser();
  loadData();
});

async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    appData = await response.json();
    
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) loadingOverlay.style.display = "none";
    
    if (typeof localStorage === 'undefined' || !localStorage.getItem("mj_user")) {
      showScreen("screen-onboarding");
    } else {
      showScreen("screen-home");
      initApp();
      if (typeof ensureTestFields === "function") ensureTestFields();
      if (!user.pretestDone && typeof startPretest === "function") {
        startPretest();
      }
    }
  } catch (e) {
    console.error("Kesalahan saat memuat data aplikasi:", e);
    showCustomAlert("Gagal Memuat Data", "Gagal memuat data.json. Pastikan Anda menjalankan aplikasi ini menggunakan Local Server (seperti Live Server di VSCode), bukan diklik langsung dari folder.", "cloud_off", "error");
  }
}

function initApp() {
  updateHomeScreen();
  renderJourneyMap();
  renderBadges();
  updateProfile();
}

// ─── PERSISTENCE ──────────────────────────────────────────────
function saveUser() { 
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("mj_user", JSON.stringify(user)); 
    }
  } catch (e) {
    console.error("Gagal menyimpan data ke localStorage", e);
  }
}

function loadUser() {
  try {
    if (typeof localStorage === 'undefined') return;
    const s = localStorage.getItem("mj_user");
    if (s) {
      const parsedUser = JSON.parse(s);
      if (parsedUser && typeof parsedUser === "object") {
        user = { ...user, ...parsedUser };
        // Fallbacks
        if (isNaN(user.points) || user.points == null) user.points = 0;
        if (!Array.isArray(user.completed)) user.completed = [];
        if (!Array.isArray(user.badges)) user.badges = [];
        if (!Array.isArray(user.decisionHistory)) user.decisionHistory = [];
        if (!user.reflections || typeof user.reflections !== "object") user.reflections = {};
        if (!user.reflectionAnalysis || typeof user.reflectionAnalysis !== "object") user.reflectionAnalysis = {}; 
        if (!user.quizAttempts || typeof user.quizAttempts !== "object") user.quizAttempts = {};
        if (!user.morality || typeof user.morality !== "object") {
          user.morality = { iman: 0, ketaatan: 0, kasih: 0 };
        }
        if (typeof user.combo === 'undefined') user.combo = 0;
        if (typeof user.maxCombo === 'undefined') user.maxCombo = 0;
      }
    }
  } catch (e) {
    console.error("Data localStorage rusak.", e);
  }
}

// ─── THEME ────────────────────────────────────────────────────
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  applyTheme(next);
}
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("mj_theme", t); } catch (e) {}
}

// ─── ONBOARDING ───────────────────────────────────────────────
function completeOnboarding() {
  const v = document.getElementById("ob-name").value.trim();
  if (!v || v.length === 0) { 
    showCustomAlert("Oops!", "Nama tidak boleh kosong. Masukkan namamu dulu ya!", "warning", "warning"); 
    return; 
  }
  user.name = v;
  saveUser();
  
  if (typeof ensureTestFields === "function") ensureTestFields();
  if (typeof startPretest === "function") {
    startPretest();
  } else {
    initApp(); 
    showScreen("screen-home");
  }
}

// ─── SCREEN NAVIGATION ────────────────────────────────────────
function showScreen(id) {
  stopTTS(); 
  
  if (id !== 'screen-quiz' && typeof quizTimerInterval !== 'undefined' && quizTimerInterval) {
    clearInterval(quizTimerInterval);
  }
  if (id !== 'screen-decision' && typeof decisionTimerInterval !== 'undefined' && decisionTimerInterval) {
    clearInterval(decisionTimerInterval);
  }
  
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) { el.classList.add("active"); el.scrollTop = 0; window.scrollTo(0, 0); }
  
  if (id === "screen-home") updateHomeScreen();
  if (id === "screen-journey") renderJourneyMap();
  if (id === "screen-badges") renderBadges();
  if (id === "screen-profile") updateProfile();
}

function getRank() {
  if (!appData) return { id:"pengikut", label:"Pengikut" };
  const ranks = appData.ranks;
  let rank = ranks[0];
  for (const r of ranks) { if (user.points >= r.minPoints) rank = r; }
  return rank;
}

function showLevelUp() {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="
      position:fixed;
      top:40%;
      left:50%;
      transform:translate(-50%,-50%);
      background:linear-gradient(135deg,#1a56db,#7c3aed);
      color:white;
      padding:24px;
      border-radius:16px;
      font-weight:bold;
      z-index:9999;
      box-shadow:0 20px 50px rgba(0,0,0,0.3);
      text-align:center;
    ">
      🎉 LEVEL UP!<br/>Level ${user.level}
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ─── OBJECTIVES HELPER (TUJUAN PEMBELAJARAN) ───────────────────
function renderObjectives() {
  const container = document.getElementById("journey-list");
  if (!container || !appData || !appData.global_objectives) return;

  if (document.getElementById("objectives-card")) return;

  const objs = appData.global_objectives;
  const html = `
    <div id="objectives-card" class="card p-5 mb-6 fade-up" style="background:var(--surface); border:1px solid var(--border); border-radius:20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-light); display:flex; align-items:center; justify-content:center;">
          <span class="material-symbols-outlined" style="font-size:20px; color:var(--primary)">flag</span>
        </div>
        <h3 class="font-sans font-bold" style="color:var(--on-bg); font-size:1.05rem;">Tujuan Pembelajaran</h3>
      </div>
      <ul style="padding-left: 24px; margin: 0; color: var(--muted); font-size: 0.85rem; line-height: 1.6;" class="font-sans list-disc">
        ${objs.map(o => `<li style="margin-bottom: 6px;">${o}</li>`).join("")}
      </ul>
    </div>
  `;
  container.insertAdjacentHTML('beforebegin', html);
}

// ─── USER SPIRITUAL PROFILE ────────────────────────
function renderSpiritualProfile() {
  const container = document.getElementById("journey-list");
  if (!container) return;

  let type = "Pencari Terang";
  let desc = "Perjalanan spiritualmu baru saja dimulai. Setiap pilihanmu ke depan akan membentuk karaktermu.";
  let icon = "explore";
  let color = "var(--muted)";
  let bg = "var(--surface2)";
  
  const historyLen = user.decisionHistory ? user.decisionHistory.length : 0;
  if (historyLen > 0) {
     desc = `Profil perjalananmu dibentuk oleh ${historyLen} pilihan bermakna yang telah kamu ambil. Setiap langkah meninggalkan jejak.`;
  }

  const m = user.morality;
  if (m && (m.iman > 0 || m.ketaatan > 0 || m.kasih > 0)) {
    const max = Math.max(m.iman, m.ketaatan, m.kasih);
    
    if (max === m.kasih) {
      type = "Hati Berbelas Kasih";
      desc += " Kamu memancarkan kasih Kristus melalui kepedulian nyata terhadap sesama, seringkali menempatkan orang lain di atas egomu sendiri.";
      icon = "volunteer_activism";
      color = "#e11d48"; // Rose
      bg = "#ffe4e6";
    } else if (max === m.ketaatan) {
      type = "Hamba yang Taat";
      desc += " Kamu memilih untuk selalu taat dan setia pada proses-Nya, berserah meski jalan di depan terasa berat dan penuh ketidakpastian.";
      icon = "verified_user";
      color = "#059669"; // Emerald
      bg = "#d1fae5";
    } else {
      type = "Pilar Iman";
      desc += " Kamu memiliki keyakinan yang sangat kokoh melampaui apa yang terlihat oleh mata. Imanmulah yang sering menggerakkan mukjizat dalam perjalananmu.";
      icon = "shield_moon";
      color = "#2563eb"; // Blue
      bg = "#dbeafe";
    }
  }

  let profileCard = document.getElementById("spiritual-profile-card");
  
  const htmlContent = `
    <div style="display:flex; align-items:center; gap:16px;">
      <div style="width:48px; height:48px; border-radius:50%; background:${bg}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
        <span class="material-symbols-outlined" style="color:${color}; font-size:24px; font-variation-settings:'FILL' 1;">${icon}</span>
      </div>
      <div>
        <p class="font-sans text-xs font-bold" style="color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">Identitas Perjalanan</p>
        <h3 class="font-sans font-bold" style="color:var(--on-bg); font-size:1.1rem; margin:0;">${type}</h3>
      </div>
    </div>
    <p class="font-sans text-sm" style="color:var(--muted); line-height:1.5; margin-top:12px; margin-bottom:0;">${desc}</p>
    <div style="display:flex; gap:12px; margin-top:16px; border-top:1px solid var(--border); padding-top:12px;">
        <div style="flex:1; text-align:center;">
            <p style="font-size:0.7rem; color:var(--muted); font-weight:bold; text-transform:uppercase;">Iman</p>
            <p style="font-size:1.1rem; font-weight:900; color:var(--on-bg);">${m.iman}</p>
        </div>
        <div style="flex:1; text-align:center; border-left:1px solid var(--border); border-right:1px solid var(--border);">
            <p style="font-size:0.7rem; color:var(--muted); font-weight:bold; text-transform:uppercase;">Taat</p>
            <p style="font-size:1.1rem; font-weight:900; color:var(--on-bg);">${m.ketaatan}</p>
        </div>
        <div style="flex:1; text-align:center;">
            <p style="font-size:0.7rem; color:var(--muted); font-weight:bold; text-transform:uppercase;">Kasih</p>
            <p style="font-size:1.1rem; font-weight:900; color:var(--on-bg);">${m.kasih}</p>
        </div>
    </div>
  `;

  if (!profileCard) {
    profileCard = document.createElement("div");
    profileCard.id = "spiritual-profile-card";
    profileCard.className = "card p-5 mb-4 fade-up";
    profileCard.style.cssText = "background:var(--surface); border:1px solid var(--border); border-radius:20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);";
    
    const objCard = document.getElementById("objectives-card");
    if (objCard) {
      objCard.parentNode.insertBefore(profileCard, objCard);
    } else {
      container.parentNode.insertBefore(profileCard, container);
    }
  }
  
  profileCard.innerHTML = htmlContent;
}

// ─── JOURNEY MAP ──────────────────────────────────────────────
function renderJourneyMap() {
  try {
    const container = document.getElementById("journey-list");
    if (!container || !appData) return;

    const miracles = appData.miracles;
    let html = "";
    let lastPhase = "";

    miracles.forEach((m, i) => {
      const isDone = user.completed.includes(m.id);
      const isUnlocked = m.level <= user.level;
      const isCurrent = m.level === user.level && !isDone;
      const cpLabel = pedagogicalMapping[m.id] ? pedagogicalMapping[m.id].cp : "";

      if (m.phase !== lastPhase) {
        const phase = appData.phases.find(p => p.id === m.phase);
        html += `
          <div class="fade-up" style="margin-bottom:4px;margin-top:${lastPhase ? '12px' : '0'}">
            <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface2);border-radius:12px;margin-bottom:8px;">
              <span class="material-symbols-outlined" style="font-size:18px;color:var(--primary);font-variation-settings:'FILL' 1">${phase?.icon || 'explore'}</span>
              <div>
                <p class="font-sans text-xs font-bold" style="color:var(--primary)">${phase?.name || m.phase}</p>
                <p class="font-sans text-xs" style="color:var(--muted)">${phase?.subtitle || ''}</p>
              </div>
            </div>
          </div>`;
        lastPhase = m.phase;
      }

      const diffMap = { mudah: {label:"Mudah", icon:"●", cls:"diff-mudah"}, sedang:{label:"Sedang",icon:"●●",cls:"diff-sedang"}, sulit:{label:"Sulit",icon:"●●●",cls:"diff-sulit"} };
      const diff = diffMap[m.difficulty] || diffMap.mudah;

      let chip = "";
      if (isDone) chip = `<span style="background:var(--success-light);color:var(--success);padding:3px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;">✓ Selesai</span>`;
      else if (isCurrent) chip = `<span style="background:var(--primary-light);color:var(--primary);padding:3px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;animation:pulseGold 2s infinite">Sedang Berjalan</span>`;
      else if (!isUnlocked) chip = `<span class="material-symbols-outlined" style="font-size:18px;color:var(--muted)">lock</span>`;

      let cardStyle = `background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;`;
      if (isCurrent) cardStyle += `border-color:var(--primary);box-shadow:0 4px 20px rgba(26,86,219,0.15);`;
      if (!isUnlocked) cardStyle += `opacity:0.5;filter:grayscale(40%);`;

      const interactive = isUnlocked ? `onclick="startMiracle(${i})" style="${cardStyle}cursor:pointer;"` : `style="${cardStyle}cursor:default;"`;

      let cpVisual = "";
      if (cpLabel) {
        cpVisual = `<div style="display:inline-flex; align-items:center; gap:4px; background:var(--surface3); padding:4px 8px; border-radius:6px; margin-top:8px;">
                      <span class="material-symbols-outlined" style="font-size:12px; color:var(--muted);">target</span>
                      <span style="font-size:0.7rem; color:var(--muted); font-weight:600;">${cpLabel}</span>
                    </div>`;
      }

      html += `
        <div ${interactive} class="fade-up" style="transition:transform 0.2s,box-shadow 0.2s;" onmouseover="if(${isUnlocked})this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${isDone?'var(--success-light)':isCurrent?'var(--primary)':'var(--surface2)'}">
                <span class="material-symbols-outlined" style="font-size:20px;color:${isDone?'var(--success)':isCurrent?'white':'var(--muted)'};font-variation-settings:'FILL' 1">${m.icon || 'auto_stories'}</span>
              </div>
              <div>
                <p class="font-sans text-xs font-semibold ${diff.cls}">${diff.icon} ${diff.label}</p>
              </div>
            </div>
            ${chip}
          </div>
          <h3 class="font-sans font-bold" style="color:var(--on-bg);font-size:0.95rem;margin-bottom:2px;">${m.title}</h3>
          <p class="font-sans" style="color:var(--muted);font-size:0.8rem;margin-bottom:6px;">${m.subtitle}</p>
          <p class="font-sans text-xs" style="color:var(--muted);opacity:0.7">${m.verse}</p>
          ${cpVisual}
          ${isDone ? `<div class="progress-bar" style="margin-top:10px;"><div class="progress-fill" style="width:100%"></div></div>` : ""}
          ${isCurrent ? `<button style="margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer;">Lanjutkan Perjalanan →</button>` : ""}
        </div>`;
    });

    container.innerHTML = html;
  } catch (e) {
    console.error("Gagal merender daftar perjalanan", e);
  }
}

// ─── START MIRACLE ────────────────────────────────────────────
function startMiracle(idx) {
  currentIdx = idx;
  quizAnswered = false;
  quizRetry = false;
  renderStory();
  showScreen("screen-story");
}

// ─── STORY ───────────────────────────────────────────
function renderStory() {
  try {
    const m = appData.miracles[currentIdx];
    if (!m) return;
    
    renderDots(0);

    const phase = appData.phases.find(p => p.id === m.phase);
    const diffMap = { mudah:{label:"Mudah",cls:"diff-mudah"}, sedang:{label:"Sedang",cls:"diff-sedang"}, sulit:{label:"Sulit",cls:"diff-sulit"} };
    const diff = diffMap[m.difficulty] || diffMap.mudah;

    set("story-verse", m.verse);
    set("story-title", m.title);
    set("story-subtitle", m.subtitle);
    set("story-makna", m.makna_inti);

    const ptag = document.getElementById("story-phase-tag");
    if (ptag) {
      ptag.textContent = phase?.name || m.phase;
      ptag.className = `font-sans text-xs font-bold px-3 py-1 rounded-full phase-${m.phase}`;
    }

    const dtag = document.getElementById("story-diff");
    if (dtag) {
      dtag.textContent = `● ${diff.label}`;
      dtag.className = `font-sans text-xs px-2 py-1 rounded-full ${diff.cls}`;
      dtag.style.background = "var(--surface2)";
    }

    // Ambil branch cerita
    let partsToRender = m.story_parts;
    if (m.story_parts_variations && m.story_parts_variations[userPath]) {
      partsToRender = m.story_parts_variations[userPath];
    }

    // Gabungkan semua paragraf secara langsung
    const textEl = document.getElementById("story-text");
    if (textEl && partsToRender) {
      // Pastikan opacity 1 agar terbaca (reset style jika ada efek pudar sebelumnya)
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
      
      textEl.innerHTML = partsToRender.map(p => {
        const textStr = typeof p === 'string' ? p : p.text;
        return `<p>${textStr}</p>`;
      }).join("");
    }

    const heroBg = document.getElementById("story-hero-bg");
    const phaseColors = { kana: "linear-gradient(135deg,#1a56db,#3b82f6)", galilea: "linear-gradient(135deg,#0369a1,#0891b2)", yerusalem: "linear-gradient(135deg,#7c3aed,#a855f7)" };
    if (heroBg) heroBg.style.cssText = `position:absolute;inset:0;${phaseColors[m.phase] || phaseColors.kana ? 'background:'+phaseColors[m.phase]+';' : ''}`;

    const iconEl = document.getElementById("story-icon");
    if (iconEl) iconEl.textContent = m.icon || "auto_stories";

    // Gunakan image base / fallback di bagian atas cerita (Hero Image style)
    const imgEl = document.getElementById("story-img");
    const imgExtra = document.getElementById("story-image-extra");
    const placeholder = document.getElementById("story-image-placeholder");

    if (imgEl && m.image && m.image.trim() !== "") {
      imgEl.style.opacity = "0";
      imgEl.src = m.image;
      imgEl.onload = () => { imgEl.style.opacity = "1"; iconEl.style.display = "none"; };
      imgEl.onerror = () => { imgEl.style.opacity = "0"; iconEl.style.display = ""; };
    }

    if (imgExtra && placeholder) {
      if (m.image && m.image.trim() !== "") {
        imgExtra.src = m.image;
        imgExtra.style.display = "block";
        placeholder.style.display = "none";
      } else {
        imgExtra.style.display = "none";
        placeholder.style.display = "flex";
      }
    }

    const dotsEl = document.getElementById("story-dots");
    if (dotsEl) {
      dotsEl.innerHTML = ["Cerita","Pilihan","Kuis","Refleksi"].map((l,i) =>
        `<div title="${l}" style="width:${i===0?'28px':'8px'};height:8px;border-radius:99px;background:${i===0?'var(--primary)':'var(--surface3)'};transition:all 0.3s;"></div>`
      ).join("");
    }
    
    // Pastikan tombol menampilkan tulisan asli
    const btns = document.querySelectorAll('button');
    btns.forEach(b => {
       const onclickAttr = b.getAttribute('onclick');
       if (onclickAttr && onclickAttr.includes('goToDecision()')) {
          b.innerHTML = `Lanjutkan <span class="material-symbols-outlined">arrow_forward</span>`;
       }
    });

  } catch (e) {
    console.error("Gagal merender cerita", e);
  }
}

function goToDecision() {
  renderDecision();
  showScreen("screen-decision");
  updateDots(1);
}

// ─── DECISION ─────────────────────────────────────────────────
function renderDecision() {
  try {
    const m = appData.miracles[currentIdx];
    const dec = m.decision;

    set("decision-scenario", `📖 ${dec.scenario}`);
    set("decision-question", dec.question);

    const feedbackEl = document.getElementById("decision-feedback");
    const continueBtn = document.getElementById("dec-continue");
    if (feedbackEl) feedbackEl.style.display = "none";
    if (continueBtn) continueBtn.disabled = true;

    const optEl = document.getElementById("decision-options");
    if (!optEl) return;

    const icons = ["directions_run","waving_hand","rowing","lightbulb","explore"];

    let shuffledDecisions = dec.options.map((opt, idx) => ({ ...opt, originalIdx: idx }));
    shuffledDecisions = shuffleArray(shuffledDecisions);

    optEl.innerHTML = shuffledDecisions.map((opt, i) => `
      <button onclick="chooseDecision(${opt.originalIdx})" id="dec-opt-${opt.originalIdx}" class="option-card">
        <div style="width:44px;height:44px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span class="material-symbols-outlined" style="font-size:20px;color:var(--muted)">${icons[i] || 'circle'}</span>
        </div>
        <div style="flex:1">
          <p class="font-sans font-semibold text-sm leading-snug" style="color:var(--on-bg)">${opt.text}</p>
        </div>
      </button>
    `).join("");

    renderDots(1);
  } catch (e) {
    console.error("Gagal merender Keputusan", e);
  }
}

function applyDecisionImpact(option) {
  if (!user.morality) user.morality = { iman: 0, ketaatan: 0, kasih: 0 };
  
  let impactText = "";
  if (option.correct) {
    user.morality.iman += 2;
    user.morality.ketaatan += 1;
    impactText = "📈 Iman (+2) | Ketaatan (+1)";
  } else {
    user.morality.kasih += 1;
    impactText = "💖 Kasih (+1)";
  }
  
  saveUser();
  return impactText;
}

function chooseDecision(idx) {
  const m = appData.miracles[currentIdx];
  const opt = m.decision.options[idx];

  m.decision.options.forEach((_, i) => {
    const btn = document.getElementById(`dec-opt-${i}`);
    if (!btn) return;
    btn.onclick = null;
    if (i === idx) {
      btn.className = opt.correct ? "option-card opt-correct" : "option-card opt-wrong";
    } else {
      btn.className = "option-card opt-disabled";
    }
  });

  showSmartFeedback(opt.correct);

  if (opt.correct) {
    user.points += opt.points;
    if (opt.next_path_if_correct) {
      userPath = opt.next_path_if_correct;
      try { localStorage.setItem("mj_path", userPath); } catch(e){}
    }
  } else {
    user.points += Math.floor(opt.points * 0.3); 
    if (opt.next_path_if_wrong) {
      userPath = opt.next_path_if_wrong;
      try { localStorage.setItem("mj_path", userPath); } catch(e){}
    }
  }

  // Konsekuensi Jangka Panjang: Simpan History Pilihan
  if(!user.decisionHistory) user.decisionHistory = [];
  user.decisionHistory.push({
    miracleId: m.id,
    chosenOption: opt.text,
    wasCorrect: opt.correct,
    timestamp: new Date().toISOString()
  });

  const impactTxt = applyDecisionImpact(opt);

  let emotionMsg = opt.feedback_emotion || (opt.correct 
    ? "Langkah yang luar biasa! Pilihanmu selaras dengan kehendak-Nya." 
    : "Sebuah proses pembelajaran. Teruslah bertumbuh dalam kasih-Nya.");

  let displayFeedback = opt.feedback;

  const fb = document.getElementById("decision-feedback");
  const fbi = document.getElementById("dec-feedback-icon");
  const fbt = document.getElementById("dec-feedback-title");
  const fbx = document.getElementById("dec-feedback-text");

  if (fb) fb.style.display = "block";
  if (fbt) fbt.textContent = opt.correct ? "✓ Pilihan yang bijak!" : "Hmm, pikirkanlah lebih dalam...";
  
  if (fbx) {
     fbx.innerHTML = `
       <div style="color:var(--on-bg); margin-bottom:12px; line-height:1.5;">${displayFeedback}</div>
       <div style="background:var(--surface); border:1px solid var(--border); padding:12px 16px; border-radius:12px; margin-top:12px; text-align:left;">
         <div style="font-size:0.75rem; font-weight:800; color:var(--primary); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Dampak Pilihan</div>
         <div style="font-size:0.9rem; font-weight:bold; color:var(--on-bg); margin-bottom:8px;">${impactTxt}</div>
         <div style="font-size:0.8rem; color:var(--muted); font-style:italic; border-left:3px solid var(--primary); padding-left:8px;">"${emotionMsg}"</div>
       </div>
     `;
  }
  
  if (fbi) {
    fbi.style.background = opt.correct ? "var(--success-light)" : "var(--error-light)";
    fbi.querySelector("span").style.color = opt.correct ? "var(--success)" : "var(--error)";
    fbi.querySelector("span").textContent = opt.correct ? "check_circle" : "info";
  }

  const cont = document.getElementById("dec-continue");
  if (cont) cont.disabled = false;
  saveUser();
}

function goToQuiz() {
  quizAnswered = false;
  quizRetry = false;
  renderQuiz();
  showScreen("screen-quiz");
  updateDots(2);
}

// ─── QUIZ (Timed: 45s) ─────────────────────────────────────────
function renderQuiz() {
  try {
    const m = appData.miracles[currentIdx];
    const q = m.quiz;

    set("quiz-chapter", `Mukjizat ${currentIdx + 1}: ${m.title}`);
    
    let bloomLevel = "C1 - Mengingat";
    if (pedagogicalMapping[m.id] && pedagogicalMapping[m.id].bloom) {
       bloomLevel = pedagogicalMapping[m.id].bloom;
    }
    const bloomColor = getBloomColor(bloomLevel);

    set("quiz-question", `${q.question}<br><div class="font-sans text-xs font-semibold px-3 py-1 mt-3 mx-auto" style="display:inline-flex; align-items:center; gap:4px; background:${bloomColor.bg}; color:${bloomColor.text}; border-radius:99px;"><span class="material-symbols-outlined" style="font-size:14px;">psychology</span> ${bloomLevel}</div>`);

    const insightEl = document.getElementById("quiz-insight");
    const contBtn = document.getElementById("quiz-continue");
    const retryInfo = document.getElementById("quiz-retry-info");
    const retryWrap = document.getElementById("quiz-retry-wrap");

    if (insightEl) insightEl.style.display = "none";
    if (contBtn) contBtn.disabled = true;
    if (retryInfo) retryInfo.style.display = quizRetry ? "flex" : "none";
    if (retryWrap) retryWrap.style.display = "none";

    const optEl = document.getElementById("quiz-options");
    if (!optEl) return;

    let opts = shuffleArray([...q.options]);

    const oldComboBox = document.getElementById("quiz-combo-ui");
    if (oldComboBox) oldComboBox.remove();

    if (user.combo >= 2) {
      const comboUI = document.createElement("div");
      comboUI.id = "quiz-combo-ui";
      comboUI.innerHTML = `<div class="font-sans font-bold text-sm mb-3" style="color:#d97706; display:flex; align-items:center; gap:4px; justify-content:center;"><span class="material-symbols-outlined" style="font-size:16px;">local_fire_department</span> Combo x${user.combo} Berjalan! Lanjutkan!</div>`;
      optEl.parentNode.insertBefore(comboUI, optEl);
    }

    const oldTimer = document.getElementById("quiz-timer-ui");
    if (oldTimer) oldTimer.remove();

    const timerUI = document.createElement("div");
    timerUI.id = "quiz-timer-ui";
    timerUI.className = "fade-up";
    timerUI.innerHTML = `
      <div style="width:100%; background:var(--surface2); height:6px; border-radius:99px; margin-bottom:8px; overflow:hidden;">
        <div id="quiz-timer-fill" style="width:100%; height:100%; background:var(--accent); transition:width 1s linear;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <p class="font-sans text-xs font-bold text-gray-500" id="quiz-timer-text">⏳ 45 Detik Tersisa</p>
      </div>
    `;
    optEl.parentNode.insertBefore(timerUI, optEl);

    clearInterval(quizTimerInterval);
    let timeLeft = 45;
    const fillStart = document.getElementById("quiz-timer-fill");
    if (fillStart) fillStart.style.width = "100%";

    quizTimerInterval = setInterval(() => {
      timeLeft--;
      const fill = document.getElementById("quiz-timer-fill");
      const text = document.getElementById("quiz-timer-text");
      if(fill) fill.style.width = ((timeLeft / 45) * 100) + "%";
      if(text) text.innerText = `⏳ ${timeLeft} Detik Tersisa`;

      if(timeLeft <= 0) {
          clearInterval(quizTimerInterval);
          quizTimerInterval = null;
          checkAnswer(null, true); 
      }
    }, 1000);

    optEl.innerHTML = opts.map((opt, i) => `
      <button onclick="checkAnswer('${escStr(opt)}')" id="qa-${i}" class="option-card">
        <div style="width:32px;height:32px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.8rem;color:var(--muted)">${String.fromCharCode(65+i)}</div>
        <p class="font-sans font-semibold text-sm leading-snug" style="color:var(--on-bg)">${opt}</p>
      </button>
    `).join("");

    renderDots(2);
  } catch (e) {
    console.error("Gagal merender kuis", e);
  }
}

// Combo Lanjutan
function updateCombo(isCorrect) {
  if (isCorrect && !quizRetry) { 
    user.combo = (user.combo || 0) + 1;
    if (user.combo > (user.maxCombo || 0)) {
       user.maxCombo = user.combo;
    }
    
    if (user.combo > 0 && user.combo % 3 === 0) {
       user.points += 15; 
       showCustomAlert("Streak Bonus! 🔥", `Hebat! Kamu telah menjawab ${user.combo} kuis berturut-turut tanpa salah. Kamu mendapat bonus +15 Poin!`, "local_fire_department", "warning");
    }
  } else {
    user.combo = 0;
  }
  saveUser();
}

function checkAnswer(selected, isTimeout = false) {
  if (quizAnswered) return;
  quizAnswered = true;

  clearInterval(quizTimerInterval);
  quizTimerInterval = null;
  const timerFill = document.getElementById("quiz-timer-fill");
  if (timerFill) timerFill.style.background = "var(--muted)";

  const m = appData.miracles[currentIdx];
  const isCorrect = !isTimeout && (selected === m.quiz.answer);
  
  if (isTimeout) {
    showCustomAlert("Waktu Habis", "Waktu pengerjaan kuis telah habis. Mari kita pelajari pembahasannya.", "timer_off", "warning");
  } else {
    showSmartFeedback(isCorrect);
  }

  updateCombo(isCorrect);

  const attempts = (user.quizAttempts[m.id] || 0) + 1;
  user.quizAttempts[m.id] = attempts;

  if (isCorrect) {
    user.points += quizRetry ? m.quiz.points_partial : m.quiz.points_correct;
  } else {
    user.points += m.quiz.points_partial;
  }

  const optEl = document.getElementById("quiz-options");
  if (optEl) {
    const btns = optEl.querySelectorAll(".option-card");
    btns.forEach(btn => {
      const txt = btn.querySelector("p").textContent;
      btn.onclick = null;
      if (txt === m.quiz.answer) {
        btn.className = "option-card opt-correct"; 
      } else if (txt === selected && !isCorrect) {
        btn.className = "option-card opt-wrong";
      } else {
        btn.className = "option-card opt-disabled";
      }
    });
  }

  const insightEl = document.getElementById("quiz-insight");
  set("quiz-insight-text", m.quiz.insight);
  if (insightEl) insightEl.style.display = "block";

  const retryWrap = document.getElementById("quiz-retry-wrap");
  const contBtn = document.getElementById("quiz-continue");

  if (!isCorrect && !quizRetry) {
    if (retryWrap) retryWrap.style.display = "block";
    if (contBtn) contBtn.disabled = false; 
  } else {
    if (retryWrap) retryWrap.style.display = "none";
    if (contBtn) contBtn.disabled = false;
  }

  saveUser();
}

function retryQuiz() {
  quizRetry = true;
  quizAnswered = false;
  renderQuiz();
}

function goToReflection() {
  renderReflection();
  showScreen("screen-reflection");
  updateDots(3);
}

// ─── REFLECTION ───────────────────────────────────────────────

function showSummary(m, callback) {
  let modalOverlay = document.getElementById("modal-summary");

  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "modal-summary";
    modalOverlay.style.cssText = "display:flex; position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(8px); z-index:99999; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s ease;";
    modalOverlay.innerHTML = `
      <div class="card p-6 fade-up" style="max-width:90%; width:420px; background:var(--surface); border-radius:24px; box-shadow:var(--shadow-lg); text-align:left;">
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
          <div style="width:50px; height:50px; border-radius:50%; background:var(--primary-light); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <span class="material-symbols-outlined" style="color:var(--primary); font-size:26px; font-variation-settings:'FILL' 1;">menu_book</span>
          </div>
          <div>
            <h3 class="font-sans font-bold" style="font-size:1.15rem; color:var(--on-bg); margin:0;">Ringkasan Belajar</h3>
            <p class="font-sans text-xs" style="color:var(--muted); margin:4px 0 0 0; line-height:1.2;">Pelajaran Berharga Hari Ini</p>
          </div>
        </div>
        
        <div style="background:var(--surface2); padding:16px 20px; border-radius:16px; margin-bottom:24px; border:1px solid var(--border);">
          <ul style="margin:0; padding-left:16px; color:var(--on-surface); font-size:0.9rem; line-height:1.6; display:flex; flex-direction:column; gap:10px; font-family:'Plus Jakarta Sans', sans-serif;">
            <li style="list-style-type:disc;"><strong style="color:var(--primary);">Makna Inti:</strong> <span id="summary-makna-inti"></span></li>
            <li style="list-style-type:disc;">Menerapkan iman dalam situasi nyata</li>
            <li style="list-style-type:disc;">Merefleksikan pengalaman secara pribadi</li>
          </ul>
        </div>
        
        <button id="btn-close-summary" class="btn-primary" style="width:100%; justify-content:center;">
          Lanjutkan Perjalanan <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  } else {
    modalOverlay.style.display = "flex";
  }

  const maknaText = document.getElementById("summary-makna-inti");
  const btnClose = document.getElementById("btn-close-summary");

  if (maknaText) maknaText.textContent = m.makna_inti;

  void modalOverlay.offsetWidth;
  modalOverlay.style.opacity = "1";

  btnClose.onclick = () => {
    modalOverlay.style.opacity = "0";
    setTimeout(() => {
      modalOverlay.style.display = "none";
      if(callback) callback();
    }, 300); 
  };
}

function analyzeReflection(text) {
  const lowerText = text.toLowerCase();
  let category = "general";
  
  if (lowerText.includes("takut") || lowerText.includes("ragu") || lowerText.includes("khawatir") || lowerText.includes("cemas") || lowerText.includes("lemah")) {
    category = "struggle";
  } else if (lowerText.includes("percaya") || lowerText.includes("iman") || lowerText.includes("yakin") || lowerText.includes("berserah") || lowerText.includes("taat")) {
    category = "faith";
  } else if (lowerText.includes("bingung") || lowerText.includes("mencari") || lowerText.includes("bertanya") || lowerText.includes("belum paham") || lowerText.includes("penasaran")) {
    category = "seeking";
  }

  const feedbacks = {
    struggle: [
      "Ketakutan dan keraguan adalah hal yang manusiawi. Ingatlah bahwa Yesus selalu berjalan bersamamu di tengah badai.",
      "Tidak apa-apa merasa takut. Justru dalam kelemahan kitalah kuasa Tuhan menjadi sempurna.",
      "Keraguanmu adalah batu loncatan menuju iman yang lebih dalam. Teruslah melangkah walau perlahan."
    ],
    faith: [
      "Imanmu sungguh menginspirasi! Teruslah pelihara kepercayaan ini sebagai pelita dalam keseharianmu.",
      "Luar biasa! Keyakinanmu adalah fondasi yang kokoh. Sebarkanlah semangat percaya ini kepada sekitarmu.",
      "Sangat memberkati melihat imanmu bertumbuh lewat refleksi ini. Tuhan memberkati setiap langkah teguhmu."
    ],
    seeking: [
      "Kebingungan adalah awal dari pencarian makna yang sejati. Teruslah bertanya, Roh Kudus akan menuntunmu.",
      "Mencari jawaban adalah tanda jiwa yang hidup. Tuhan senantiasa membimbing mereka yang mencari-Nya dengan tulus.",
      "Jangan lelah mencari arti di balik setiap kejadian. Teruslah mengetuk, maka pintu hikmat akan dibukakan."
    ],
    general: [
      "Refleksi yang sangat bermakna. Langkah kecilmu hari ini adalah benih dari perubahan besar di esok hari.",
      "Terima kasih sudah berbagi isi hatimu. Setiap kejujuran di hadapan-Nya adalah doa yang sangat indah.",
      "Luar biasa. Renunganmu menunjukkan kedewasaan dan kesediaan untuk terus dibentuk oleh kasih-Nya."
    ]
  };

  const selectedFeedbacks = feedbacks[category];
  const randomFeedback = selectedFeedbacks[Math.floor(Math.random() * selectedFeedbacks.length)];

  return { category: category, feedback: randomFeedback };
}

function renderReflection() {
  try {
    const m = appData.miracles[currentIdx];
    const r = m.reflection;

    set("ref-points", `+${m.reflection.points} Poin`);
    set("ref-badge", m.reward);
    set("ref-closing", m.episode_closing);
    
    set("ref-prompt", r.prompt + "<br><br><b style='font-size:0.85rem; color:var(--primary);'>Silakan lengkapi jurnal refleksimu di bawah ini:</b>");

    const inputContainer = document.getElementById("ref-input")?.parentElement;
    const origInput = document.getElementById("ref-input");
    const saveBtn = document.getElementById("btn-save-reflection");
    const noteEl = document.getElementById("ref-char-note");

    if (origInput && inputContainer) {
      origInput.style.display = "none";

      if (!document.getElementById("advanced-reflection")) {
        const advHtml = `
          <div id="advanced-reflection" style="display:flex; flex-direction:column; gap:12px; width:100%; margin-top:10px; text-align:left;">
            <div>
              <label class="font-sans text-xs font-bold" style="color:var(--primary)">1. Perasaan</label>
              <textarea id="ref-perasaan" class="w-full p-3 rounded-xl border mt-1 font-sans" style="background:var(--surface); border-color:var(--border); font-size:0.85rem; outline:none;" rows="2" placeholder="Apa yang kamu rasakan? (Misal: Saya merasa kagum karena...)"></textarea>
            </div>
            <div>
              <label class="font-sans text-xs font-bold" style="color:var(--primary)">2. Makna</label>
              <textarea id="ref-makna" class="w-full p-3 rounded-xl border mt-1 font-sans" style="background:var(--surface); border-color:var(--border); font-size:0.85rem; outline:none;" rows="2" placeholder="Apa makna terdalamnya? (Misal: Kisah ini mengajarkan saya bahwa...)"></textarea>
            </div>
            <div>
              <label class="font-sans text-xs font-bold" style="color:var(--primary)">3. Aksi Nyata</label>
              <textarea id="ref-aksi" class="w-full p-3 rounded-xl border mt-1 font-sans" style="background:var(--surface); border-color:var(--border); font-size:0.85rem; outline:none;" rows="2" placeholder="Apa tindakan nyata yang akan kamu ambil? (Misal: Hari ini saya akan...)"></textarea>
            </div>
          </div>
        `;
        origInput.insertAdjacentHTML('afterend', advHtml);
      }

      const saved = user.reflections[m.id];
      if (saved && typeof saved === 'object') {
         document.getElementById("ref-perasaan").value = saved.perasaan || "";
         document.getElementById("ref-makna").value = saved.makna || "";
         document.getElementById("ref-aksi").value = saved.aksi || "";
      } else if (typeof saved === 'string') {
         document.getElementById("ref-perasaan").value = saved;
         document.getElementById("ref-makna").value = "";
         document.getElementById("ref-aksi").value = "";
      } else {
         document.getElementById("ref-perasaan").value = "";
         document.getElementById("ref-makna").value = "";
         document.getElementById("ref-aksi").value = "";
      }

      const checkLength = () => {
        const l1 = document.getElementById("ref-perasaan").value.trim().length;
        const l2 = document.getElementById("ref-makna").value.trim().length;
        const l3 = document.getElementById("ref-aksi").value.trim().length;
        const isComplete = l1 >= 5 && l2 >= 5 && l3 >= 5;

        if (saveBtn) saveBtn.disabled = !isComplete;

        if (noteEl) {
          if (!isComplete) {
            noteEl.textContent = "Isi ketiga kolom (min. 5 karakter/kolom) untuk menyimpan.";
            noteEl.style.color = "var(--accent)";
          } else {
            noteEl.textContent = "✓ Sempurna! Refleksi yang sangat mendalam.";
            noteEl.style.color = "var(--success)";
          }
        }
        renderDots(3);
      };

      document.getElementById("ref-perasaan").oninput = checkLength;
      document.getElementById("ref-makna").oninput = checkLength;
      document.getElementById("ref-aksi").oninput = checkLength;
      
      checkLength();
    }

    const fbEl = document.getElementById("ref-feedback");
    if (fbEl) fbEl.classList.add("hidden");
  } catch (e) {
    console.error("Gagal merender formulir refleksi", e);
  }
}

function saveReflection() {
  const m = appData.miracles[currentIdx];
  let textObj = { perasaan: "", makna: "", aksi: "" };
  
  const refPerasaan = document.getElementById("ref-perasaan");
  if (refPerasaan) {
     textObj.perasaan = refPerasaan.value.trim();
     textObj.makna = document.getElementById("ref-makna").value.trim();
     textObj.aksi = document.getElementById("ref-aksi").value.trim();
  } else {
     const inputEl = document.getElementById("ref-input");
     textObj.perasaan = inputEl ? inputEl.value.trim() : "";
  }

  user.reflections[m.id] = textObj;

  const combinedText = `${textObj.perasaan} ${textObj.makna} ${textObj.aksi}`;
  const analysisResult = analyzeReflection(combinedText);
  
  if (!user.reflectionAnalysis) user.reflectionAnalysis = {};
  user.reflectionAnalysis[m.id] = analysisResult;

  const fbEl = document.getElementById("ref-feedback");
  if (fbEl && textObj.perasaan.length >= 5) {
    fbEl.textContent = "✓ " + m.reflection.feedback_positive;
    fbEl.classList.remove("hidden");
    user.points += m.reflection.points;
  }

  showSummary(m, () => {
    showReward();
  });
}

// ─── REWARD ───────────────────────────────────────────────────
function showReward() {
  const m = appData.miracles[currentIdx];
  const alreadyDone = user.completed.includes(m.id);

  const completionBonus = m.points || 50; 

  if (!alreadyDone) {
    user.completed.push(m.id);
    user.points += completionBonus; 
    user.badges.push(m.reward);
    const next = m.level + 1;
    if (next > user.level) user.level = next;
  }

  saveUser();

  const total = appData.miracles.length;
  const pct = Math.round((user.completed.length / total) * 100);

  set("reward-miracle-name", m.title);
  set("reward-pts-display", alreadyDone ? "Sudah Dikerjakan" : `+${completionBonus}`);
  set("reward-badge", m.reward);
  set("reward-msg", m.reward_message);
  set("reward-total-pts", `Total: ${user.points.toLocaleString("id-ID")} poin`);

  const fillEl = document.getElementById("reward-total-fill");
  if (fillEl) setTimeout(() => { fillEl.style.width = pct + "%"; }, 200);

  const emojiMap = { alam:"🌊", penyembuhan:"✨", eksorsisme:"⚡", kebangkitan:"🌅" };
  const emoji = emojiMap[m.category] || "🎉";
  set("reward-emoji", emoji);

  const luEl = document.getElementById("reward-levelup");
  const luText = document.getElementById("reward-levelup-text");
  const nextIdx = currentIdx + 1;
  if (!alreadyDone && luEl && nextIdx < appData.miracles.length) {
    luEl.style.display = "flex";
    if (luText) luText.textContent = `"${appData.miracles[nextIdx].title}" kini tersedia!`;
  } else if (luEl) {
    luEl.style.display = "none";
  }

  const emotionMap = {
    "Iman": "Imanmu bertumbuh 🌱",
    "Ketaatan": "Kamu belajar untuk taat sebelum paham 💛",
    "Damai": "Kamu belajar menemukan damai di tengah badai 🌈",
    "Keberanian": "Kamu belajar bahwa iman bukan absennya ketakutan ⚡",
    "Kemurahan": "Hatimu semakin terbuka untuk berbagi 🎁",
    "Persahabatan": "Kamu mengenal arti membawa seseorang kepada Yesus 🤝",
    "Pemulihan": "Kamu belajar bahwa sentuhan iman membawa pemulihan ✨",
    "Syukur": "Kamu menemukan bahwa syukur membuka pintu yang lebih dalam 🙏",
    "Kebebasan": "Kamu tahu bahwa tidak ada belenggu yang terlalu kuat bagi Yesus 🕊️",
    "Harapan": "Kamu belajar bahwa Yesus tidak mengenal kata terlambat 🌅",
    "Kepekaan": "Hatimu semakin peka terhadap kebutuhan orang lain 💙",
    "Terang": "Kamu menemukan bahwa Yesus adalah Terang di gelap terdalam 💡",
    "Kehidupan Kekal": "Kamu berjumpa dengan Akulah Kebangkitan dan Hidup 🌟",
    "Pengampunan": "Kamu belajar kasih yang melampaui pengkhianatan ❤️",
    "Kebangkitan": "Kamu menemukan bahwa kubur itu kosong — dan Yesus hidup! ✝️"
  };
  const emotionMsg = emotionMap[m.reward] || "Perjalananmu terus bertumbuh 🌱";
  set("reward-emotion-text", emotionMsg);

  const refSummaryEl = document.getElementById("reward-reflection-summary");
  const rewardCard = document.querySelector("#screen-reward .card");
  
  if (!refSummaryEl && rewardCard) {
     const summaryHtml = `
       <div id="reward-reflection-summary" class="fade-up" style="margin-top:20px; margin-bottom:15px; text-align:left; background:var(--surface2); border: 1px solid var(--border); padding:16px; border-radius:16px; font-size:0.85rem; color:var(--on-bg);">
         <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
           <span class="material-symbols-outlined" style="color:var(--primary); font-size:20px;">edit_note</span>
           <h4 style="font-weight:bold; color:var(--primary); font-size:0.95rem; margin:0;">Jurnal Refleksimu</h4>
         </div>
         <p style="margin-bottom:8px;"><strong style="color:var(--on-bg);">Perasaan:</strong><br/> <span id="reward-ref-perasaan" style="color:var(--muted); font-style:italic;"></span></p>
         <p style="margin-bottom:8px;"><strong style="color:var(--on-bg);">Makna:</strong><br/> <span id="reward-ref-makna" style="color:var(--muted); font-style:italic;"></span></p>
         <p><strong style="color:var(--on-bg);">Aksi Nyata:</strong><br/> <span id="reward-ref-aksi" style="color:var(--muted); font-style:italic;"></span></p>
         <div id="reward-ai-feedback"></div>
       </div>
     `;
     const btn = rewardCard.querySelector("button");
     if(btn) btn.insertAdjacentHTML('beforebegin', summaryHtml);
  }

  if (document.getElementById("reward-reflection-summary")) {
     const savedRef = user.reflections[m.id];
     const savedAnalysis = (user.reflectionAnalysis && user.reflectionAnalysis[m.id]) ? user.reflectionAnalysis[m.id] : null;
     const aiFeedbackContainer = document.getElementById("reward-ai-feedback");
     
     if (savedAnalysis && aiFeedbackContainer) {
        aiFeedbackContainer.innerHTML = `
         <div style="margin-top:16px; padding:12px; background:var(--primary-light); border-left:4px solid var(--primary); border-radius:8px;">
           <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
             <span class="material-symbols-outlined" style="color:var(--primary); font-size:16px;">auto_awesome</span>
             <span style="font-weight:bold; color:var(--primary); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">✨ Tanggapan</span>
           </div>
           <p style="font-size:0.85rem; color:var(--on-bg); margin:0;">"${savedAnalysis.feedback}"</p>
         </div>
        `;
     } else if (aiFeedbackContainer) {
        aiFeedbackContainer.innerHTML = "";
     }

     if(savedRef && typeof savedRef === 'object') {
        document.getElementById("reward-ref-perasaan").textContent = `"${savedRef.perasaan}"`;
        document.getElementById("reward-ref-makna").textContent = `"${savedRef.makna}"`;
        document.getElementById("reward-ref-aksi").textContent = `"${savedRef.aksi}"`;
        document.getElementById("reward-reflection-summary").style.display = "block";
     } else if (savedRef && typeof savedRef === 'string') {
        document.getElementById("reward-ref-perasaan").textContent = `"${savedRef}"`;
        document.getElementById("reward-ref-makna").textContent = "-";
        document.getElementById("reward-ref-aksi").textContent = "-";
        document.getElementById("reward-reflection-summary").style.display = "block";
     } else {
        document.getElementById("reward-reflection-summary").style.display = "none";
     }
  }

  showScreen("screen-reward");
}

// ─── BADGES ───────────────────────────────────────────────────
function renderBadges() {
  try {
    const container = document.getElementById("badges-grid");
    if (!container || !appData) return;

    container.innerHTML = appData.miracles.map(m => {
      const earned = user.completed.includes(m.id);
      const phaseColors = { kana:"#1a56db", galilea:"#0891b2", yerusalem:"#7c3aed" };
      const color = phaseColors[m.phase] || "#1a56db";

      return `
        <div class="card p-4 text-center" style="${!earned?'opacity:0.45;filter:grayscale(60%);':''}">
          <div style="width:52px;height:52px;border-radius:50%;background:${earned?`${color}20`:'var(--surface2)'};display:flex;align-items:center;justify-content:center;margin:0 auto 10px;${earned?`animation:pulseGold 3s infinite;`:''}">
            <span class="material-symbols-outlined" style="font-size:24px;color:${earned?color:'var(--muted)'};font-variation-settings:'FILL' 1">${earned?'workspace_premium':'lock'}</span>
          </div>
          <p class="font-sans font-bold text-sm" style="color:var(--on-bg);margin-bottom:2px">${m.reward}</p>
          <p class="font-sans text-xs" style="color:var(--muted);line-height:1.3">${m.title}</p>
          ${earned
            ? `<span style="display:inline-block;margin-top:6px;background:var(--success-light);color:var(--success);padding:2px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;">✓ Diperoleh</span>`
            : `<span style="display:inline-block;margin-top:6px;background:var(--surface2);color:var(--muted);padding:2px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;">Level ${m.level}</span>`
          }
        </div>`;
    }).join("");
  } catch (e) {
    console.error("Gagal merender medali (badges)", e);
  }
}

// ─── PROFILE ──────────────────────────────────────────────────
function updateProfile() {
  const rank = getRank();
  set("prof-name", user.name);
  set("prof-pts", user.points.toLocaleString("id-ID"));
  set("prof-done", user.completed.length);
  set("prof-badges", user.badges.length);

  const rankEl = document.getElementById("prof-rank");
  if (rankEl) { rankEl.textContent = rank.label; rankEl.className = `rank-badge rank-${rank.id}`; }

  const input = document.getElementById("prof-name-input");
  if (input) input.value = user.name;
}

function updateName() {
  const input = document.getElementById("prof-name-input");
  const v = input?.value.trim();
  if (!v || v.length === 0) {
    showCustomAlert("Oops!", "Nama tidak boleh kosong!", "warning", "warning");
    if (input) input.value = user.name; 
    return;
  }
  user.name = v;
  saveUser();
  updateHomeScreen();
  updateProfile();
}

function resetAll() {
  showCustomConfirm("Reset Progress?", "Yakin mau reset semua progress? Data yang dihapus tidak bisa dikembalikan.", () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("mj_user");
        localStorage.removeItem("mj_path"); 
      }
    } catch (e) {}

    user = {
      name: "Peziarah",
      points: 0,
      level: 1,
      completed: [],
      badges: [],
      reflections: {},
      reflectionAnalysis: {}, 
      quizAttempts: {},
      decisionHistory: [],
      combo: 0,
      maxCombo: 0,
      morality: { iman: 0, ketaatan: 0, kasih: 0 }, 
      pretestDone: false,
      pretestScore: 0,
      posttestDone: false,
      posttestScore: 0
    };

    currentIdx = 0;
    userPath = "default";

    stopTTS();
    showScreen("screen-onboarding");
  });
}

// ─── HELPERS ──────────────────────────────────────────────────
function set(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function escStr(s) {
  return (s || "").replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkLevelUp() {
  const nextLevel = user.level + 1;
  const nextExists = appData.miracles.some(m => m.level === nextLevel);

  if (nextExists) {
    user.level = nextLevel;
    showLevelUp();     
    saveUser();        
    updateHomeScreen(); 
  }
}

function completeMiracle(m) {
  if (!user.completed.includes(m.id)) {
    user.completed.push(m.id);
  }
  checkLevelUp(); 
  saveUser();
}

function getFullStoryText(m) {
  if (!m) return "";
  
  let partsToSpeak = m.story_parts;
  if (m.story_parts_variations && m.story_parts_variations[userPath]) {
    partsToSpeak = m.story_parts_variations[userPath];
  }

  let partsToSpeakText = partsToSpeak.map(p => typeof p === 'string' ? p : p.text);
  const cleanParts = partsToSpeakText.map(p => p.replace(/<[^>]+>/g, ''));

  return `
    ${m.title}.
    ${m.subtitle}.
    ${cleanParts.join(" ")}.
    Makna inti.
    ${m.makna_inti}
  `;
}

function updateTTSButton() {
  const btn = document.getElementById("btn-tts");
  if (!btn) return;

  if (!tts.isSpeaking) {
    btn.innerText = "▶️ Dengarkan Cerita";
  } else if (tts.isPaused) {
    btn.innerText = "▶️ Lanjutkan";
  } else {
    btn.innerText = "⏸️ Pause";
  }
}

function playTTS(text) {
  stopTTS();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  u.rate = 0.95;

  u.onstart = () => {
    tts.isSpeaking = true;
    tts.isPaused = false;
    updateTTSButton();
  };

  u.onend = () => {
    tts.isSpeaking = false;
    tts.isPaused = false;
    updateTTSButton();
  };

  speechSynthesis.speak(u);
  tts.utterance = u;
}

function pauseTTS() {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    tts.isPaused = true;
    updateTTSButton();
  }
}

function resumeTTS() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    tts.isPaused = false;
    updateTTSButton();
  }
}

function stopTTS() {
  speechSynthesis.cancel();
  tts.isSpeaking = false;
  tts.isPaused = false;
  updateTTSButton();
}

function toggleTTS() {
  const m = appData.miracles[currentIdx];
  if (!m) return;

  const text = getFullStoryText(m);

  if (!tts.isSpeaking) {
    playTTS(text);
  } else if (tts.isPaused) {
    resumeTTS();
  } else {
    pauseTTS();
  }
}

function renderDots(stepIndex) {
  const labels = ["Cerita", "Pilihan", "Kuis", "Refleksi"];
  const el = document.querySelectorAll(".story-dots"); 
  if (!el) return;

  el.forEach(container => {
    container.innerHTML = labels.map((_, i) => `
      <div style="
        width:${i === stepIndex ? '28px' : '8px'};
        height:8px;
        border-radius:99px;
        background:${i === stepIndex ? 'var(--primary)' : 'var(--surface3)'};
        transition:all 0.3s;
      "></div>
    `).join("");
  });
}

function updateDots(stepIndex) {
  renderDots(stepIndex);
}

function updateHomeScreen() {
  const total = appData?.miracles?.length || 16;
  const done = user.completed.length;
  const pct = Math.round((done / total) * 100);
  const rank = getRank();

  set("home-greeting", `Halo, ${user.name}!`);
  set("home-level", `Level ${user.level}`);
  set("home-rank-badge", rank.label);

  const rb = document.getElementById("home-rank-badge");
  if (rb) rb.className = `rank-badge rank-${rank.id}`;

  set("home-pct", pct + "%");
  set("home-points", user.points.toLocaleString("id-ID"));
  set("home-completed", done);
  set("home-progress-label", `${done} / ${total} Mukjizat Selesai`);

  const bar = document.getElementById("home-progress-fill");
  if (bar) setTimeout(() => { bar.style.width = pct + "%"; }, 100);

  renderObjectives();
  renderSpiritualProfile();

  const quotes = [
    "Iman adalah mengambil langkah pertama meskipun kamu tidak melihat seluruh tangga. | Martin Luther King Jr.",
    "Mukjizat bukan hanya terjadi pada kita, tapi melalui kita. | Anonim",
    "Jangan takut, percaya saja. | Yesus (Markus 5:36)",
    "Ketaatan yang sederhana adalah pintu bagi mukjizat yang luar biasa. | SOMIRACLE",
    "Ketika kamu bersyukur, kamu mulai melihat mukjizat di sekelilingmu. | Anonim",
    "Doa tidak selalu mengubah situasi, tapi doa selalu mengubah kita. | C.S. Lewis",
    "Harapan adalah sauh bagi jiwa yang tetap teguh dalam badai. | Ibrani 6:19",
    "Apa yang bagi manusia mustahil, bagi Allah segalanya mungkin. | Lukas 18:27",
    "Mukjizat terbesar adalah perubahan hati yang belajar untuk mengasihi. | St. Agustinus",
    "Tuhan tidak memanggil orang yang mampu, Dia memampukan orang yang terpanggil. | Rick Warren",
    "Jangan biarkan ketakutanmu mengatur masa depanmu, biarkan imanmu yang memimpin. | Anonim",
    "Setiap matahari terbit adalah bukti mukjizat kesetiaan Tuhan yang baru. | Ratapan 3:22-23",
    "Iman bukan berarti Tuhan melakukan apa yang kita mau, tapi Tuhan melakukan apa yang benar. | Max Lucado",
    "Kadang mukjizat itu bukan terhentinya badai, tapi ketenangan di dalam badai. | Anonim",
    "Berjalan di atas air butuh keberanian untuk tetap menatap Sang Guru, bukan ombaknya. | Refleksi Petrus"
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const reflectionEl = document.getElementById("home-reflection-text");
  if (reflectionEl) {
    reflectionEl.innerText = randomQuote;
  }
}

function openGlosarium() {
  renderGlosarium();
  showScreen('screen-glosarium')
}

function renderGlosarium() {
  const container = document.getElementById("glosarium-list");
  if (!container || !appData || !appData.glossary) return;

  const sortedGlossary = [...appData.glossary].sort((a, b) => a.term.localeCompare(b.term));

  container.innerHTML = sortedGlossary.map(item => `
    <div class="card p-4 flex justify-between items-center fade-up" onclick="showGlossaryTerm('${escStr(item.term)}', '${escStr(item.definition)}')" style="cursor:pointer; margin-bottom: 8px;">
      <div style="flex: 1; padding-right: 12px;">
        <h3 class="font-sans font-bold text-base" style="color:var(--primary)">${item.term}</h3>
        <p class="font-sans text-xs" style="color:var(--muted); margin-top:4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
          ${item.definition}
        </p>
      </div>
      <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center;">
        <span class="material-symbols-outlined" style="color:var(--primary); font-size: 18px;">chevron_right</span>
      </div>
    </div>
  `).join("");
}

function showGlossaryTerm(term, desc) {
  const modal = document.getElementById("modal-glossary");
  const title = document.getElementById("glos-title");
  const descEl = document.getElementById("glos-desc");

  if (title) title.textContent = term;
  if (descEl) descEl.textContent = desc;
  if (modal) modal.classList.add("active");
}

function closeGlossary(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const modal = document.getElementById("modal-glossary");
  if (modal) modal.classList.remove("active");
}

function showSmartFeedback(isCorrect) {
  const correctMsgs = [
    "Luar biasa! Pilihan yang sangat tepat. 🌟",
    "Hebat! Kamu memahami maknanya. ✨",
    "Tepat sekali! Pertahankan iman dan hikmatmu. 🕊️"
  ];
  
  const wrongMsgs = [
    "Setiap kesalahan adalah awal dari pembelajaran baru. Mari refleksikan. 🌱",
    "Belum tepat, tapi dari sini kita belajar sesuatu yang berharga. 💡",
    "Jangan menyerah, renungkan sejenak hikmat di baliknya. 🌿"
  ];

  const msg = isCorrect
    ? correctMsgs[Math.floor(Math.random() * correctMsgs.length)]
    : wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];

  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%) translateY(-50px)";
  
  if (isCorrect) {
    toast.style.background = "linear-gradient(135deg, var(--success), #059669)";
    toast.style.color = "white";
  } else {
    toast.style.background = "linear-gradient(135deg, var(--accent), #d97706)";
    toast.style.color = "white";
  }
  
  toast.style.padding = "14px 24px";
  toast.style.borderRadius = "50px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
  toast.style.fontWeight = "700";
  toast.style.fontSize = "0.9rem";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  toast.style.textAlign = "center";
  toast.style.minWidth = "280px";
  toast.innerText = msg;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(0)";
    toast.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(-50px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// --- ASSESSMENT LOGIC (PRE-TEST & POST-TEST) ---
let currentTestType = "pre"; // "pre" atau "post"
let currentTestIdx = 0;
let testScore = 0;
let tempAnswers = [];

function startPretest() {
    currentTestType = "pre";
    prepareTest();
}

function startPosttest() {
    currentTestType = "post";
    prepareTest();
}

function prepareTest() {
    currentTestIdx = 0;
    testScore = 0;
    tempAnswers = [];
    
    // Update Header UI
    const headerTitle = document.getElementById("test-header-title");
    if (headerTitle) headerTitle.innerText = currentTestType === "pre" ? "Pre-Test" : "Post-Test";
    
    showScreen("screen-test");
    renderTestQuestion();
}

function renderTestQuestion() {
    const questions = appData.assessment_questions;
    if (!questions) return;

    const q = questions[currentTestIdx];
    
    // Update Progress
    const progress = document.getElementById("test-progress");
    if (progress) progress.innerText = `Pertanyaan ${currentTestIdx + 1} / ${questions.length}`;
    
    // Set Question
    const qText = document.getElementById("test-question");
    if (qText) qText.innerText = q.question;
    
    // Set Options
    const optContainer = document.getElementById("test-options");
    if (optContainer) {
        optContainer.innerHTML = q.options.map((opt, i) => `
            <button onclick="handleTestAnswer('${opt.replace(/'/g, "\\'")}')" class="option-card">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:0.8rem;color:var(--muted)">${String.fromCharCode(65+i)}</div>
                <p class="font-sans font-semibold text-sm" style="color:var(--on-bg)">${opt}</p>
            </button>
        `).join("");
    }
}

function handleTestAnswer(selected) {
    const questions = appData.assessment_questions;
    const correct = questions[currentTestIdx].answer;
    
    if (selected === correct) {
        testScore++;
    }
    
    if (currentTestIdx < questions.length - 1) {
        currentTestIdx++;
        renderTestQuestion();
    } else {
        finishTest();
    }
}

function finishTest() {
    const questions = appData.assessment_questions;
    const finalScore = Math.round((testScore / questions.length) * 100);
    
    if (currentTestType === "pre") {
        user.pretestDone = true;
        user.pretestScore = finalScore;
        
        document.getElementById("test-result-title").innerText = "Hasil Pre-Test";
        document.getElementById("test-comparison").classList.add("hidden");
    } else {
        user.posttestDone = true;
        user.posttestScore = finalScore;
        
        document.getElementById("test-result-title").innerText = "Hasil Post-Test";
        
        // Tampilkan Perbandingan
        const comp = document.getElementById("test-comparison");
        if (comp) {
            comp.classList.remove("hidden");
            const improvement = finalScore - user.pretestScore;
            comp.innerText = improvement >= 0 
                ? `Peningkatan: +${improvement}% dari Pre-Test` 
                : `Penurunan: ${improvement}% dari Pre-Test`;
        }
    }
    
    document.getElementById("test-score-display").innerText = finalScore;
    saveUser();
    showScreen("screen-test-result");
}

// Fungsi tombol lanjut di layar hasil tes
function finishAssessment() {
    if (currentTestType === "pre") {
        showScreen("screen-home");
        showCustomAlert("Perjalanan Dimulai", "Terima kasih telah menyelesaikan Pre-Test. Sekarang mari jelajahi mukjizat Yesus!", "explore");
    } else {
        showScreen("screen-home");
    }
}
// Fungsi untuk mengecek apakah sudah tamat saat di layar Reward
function finishRewardScreen() {
    // Mengecek apakah ini mukjizat terakhir (ke-24) dan user belum pernah post-test
    if (currentIdx === appData.miracles.length - 1 && !user.posttestDone) {
        showCustomAlert(
            "Perjalanan Selesai!", 
            "Selamat! Anda telah menyelesaikan semua perjalanan mukjizat. Sekarang, mari kita lihat seberapa jauh pemahaman Anda berkembang melalui Post-Test.", 
            "workspace_premium"
        );
        
        // Menunggu 3.5 detik agar user bisa membaca alert, lalu otomatis masuk Post-Test
        setTimeout(() => {
            const closeBtn = document.querySelector("#btn-close-alert");
            if (closeBtn) closeBtn.click(); // Menutup alert otomatis
            startPosttest(); // Memulai Post-Test
        }, 3500);
        
    } else {
        // Jika belum tamat (mukjizat 1-23), kembali ke Peta Perjalanan seperti biasa
        showScreen('screen-journey');
    }
}
