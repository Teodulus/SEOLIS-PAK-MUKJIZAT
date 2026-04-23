/* ================================================================
   MIRACLE JOURNEY v2 — app.js
   Implementasi 20 Perbaikan Lengkap
   ================================================================ */

// ─── STATE ────────────────────────────────────────────────────
let appData = null;
let user = {
  name: "Peziarah",
  points: 0,
  level: 1,
  completed: [],
  badges: [],
  reflections: {},
  quizAttempts: {}   // id -> attempts (for retry system)
};
let currentIdx = 0;
let quizAnswered = false;
let quizRetry = false;
let currentStep = "story"; // 🔥 TAMBAHKAN DI SINI

let tts = {
  utterance: null,
  isSpeaking: false,
  isPaused: false
};
// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("mj_theme") || "light");
  loadUser();
  loadData();
});

function loadData() {
  fetch("data.json")
    .then(r => {
      if (!r.ok) throw new Error("fetch failed");
      return r.json();
    })
    .then(data => {
      appData = data;
      document.getElementById("loading-overlay").style.display = "none";
      if (!localStorage.getItem("mj_user")) {
        showScreen("screen-onboarding");
      } else {
        showScreen("screen-home");
        initApp();
      }
    })
    .catch(() => {
      document.getElementById("loading-overlay").innerHTML =
        `<div style="text-align:center;padding:24px">
          <span class="material-symbols-outlined" style="font-size:48px;color:var(--error)">error</span>
          <p class="font-sans text-sm mt-3" style="color:var(--muted)">Gagal memuat data.<br/>Pastikan file data.json ada di folder yang sama.</p>
         </div>`;
    });
}

function initApp() {
  updateHomeScreen();
  renderJourneyMap();
  renderBadges();
  updateProfile();
}

// ─── PERSISTENCE ──────────────────────────────────────────────
function saveUser() { localStorage.setItem("mj_user", JSON.stringify(user)); }
function loadUser() {
  const s = localStorage.getItem("mj_user");
  if (s) { 
    try { 
      user = JSON.parse(s); 
      // 🔥 PERBAIKAN: Jika poin terlanjur NaN, kembalikan ke 0
      if (isNaN(user.points) || user.points == null) {
        user.points = 0;
      }
    } catch(e) {} 
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
  localStorage.setItem("mj_theme", t);
}

// ─── ONBOARDING ───────────────────────────────────────────────
function completeOnboarding() {
  const v = document.getElementById("ob-name").value.trim();
  if (!v) { alert("Masukkan namamu dulu ya!"); return; }
  user.name = v;
  saveUser();
  initApp(); // Ini akan menjalankan updateHomeScreen dan kutipan
  showScreen("screen-home");
}

// ─── SCREEN NAVIGATION ────────────────────────────────────────
function showScreen(id) {
  stopTTS(); // 🔥 ini wajib
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) { el.classList.add("active"); el.scrollTop = 0; window.scrollTo(0, 0); }
  if (id === "screen-home") updateHomeScreen();
  if (id === "screen-journey") renderJourneyMap();
  if (id === "screen-badges") renderBadges();
  if (id === "screen-profile") updateProfile();
}

// ─── RANK HELPER ──────────────────────────────────────────────
function getRank() {
  if (!appData) return appData?.ranks?.[0] || { id:"pengikut", label:"Pengikut" };
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

// ─── JOURNEY MAP ──────────────────────────────────────────────
function renderJourneyMap() {
  const container = document.getElementById("journey-list");
  if (!container || !appData) return;

  const miracles = appData.miracles;
  let html = "";
  let lastPhase = "";

  miracles.forEach((m, i) => {
    const isDone = user.completed.includes(m.id);
    const isUnlocked = m.level <= user.level;
    const isCurrent = m.level === user.level && !isDone;

    // Phase header
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

    // Difficulty display
    const diffMap = { mudah: {label:"Mudah", icon:"●", cls:"diff-mudah"}, sedang:{label:"Sedang",icon:"●●",cls:"diff-sedang"}, sulit:{label:"Sulit",icon:"●●●",cls:"diff-sulit"} };
    const diff = diffMap[m.difficulty] || diffMap.mudah;

    // Status chip
    let chip = "";
    if (isDone) chip = `<span style="background:var(--success-light);color:var(--success);padding:3px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;">✓ Selesai</span>`;
    else if (isCurrent) chip = `<span style="background:var(--primary-light);color:var(--primary);padding:3px 10px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;animation:pulseGold 2s infinite">Sedang Berjalan</span>`;
    else if (!isUnlocked) chip = `<span class="material-symbols-outlined" style="font-size:18px;color:var(--muted)">lock</span>`;

    // Card style
    let cardStyle = `background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;`;
    if (isCurrent) cardStyle += `border-color:var(--primary);box-shadow:0 4px 20px rgba(26,86,219,0.15);`;
    if (!isUnlocked) cardStyle += `opacity:0.5;filter:grayscale(40%);`;

    const interactive = isUnlocked ? `onclick="startMiracle(${i})" style="${cardStyle}cursor:pointer;"` : `style="${cardStyle}cursor:default;"`;

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
        <p class="font-sans" style="color:var(--muted);font-size:0.8rem;margin-bottom:10px;">${m.subtitle}</p>
        <p class="font-sans text-xs" style="color:var(--muted);opacity:0.7">${m.verse}</p>
        ${isDone ? `<div class="progress-bar" style="margin-top:10px;"><div class="progress-fill" style="width:100%"></div></div>` : ""}
        ${isCurrent ? `<button style="margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.85rem;cursor:pointer;">Lanjutkan Perjalanan →</button>` : ""}
      </div>`;
  });

  container.innerHTML = html;
}

// ─── START MIRACLE ────────────────────────────────────────────
function startMiracle(idx) {
  currentIdx = idx;
  quizAnswered = false;
  quizRetry = false;
  renderStory();
  showScreen("screen-story");
}

// ─── STORY ────────────────────────────────────────────────────
function renderStory() {
  const m = appData.miracles[currentIdx];
if (!m) {
  alert("Data tidak ditemukan");
  return;
}
  if (!appData || !appData.miracles[currentIdx]) {
  alert("Data tidak ditemukan");
  return;
}
renderDots(0);


  const phase = appData.phases.find(p => p.id === m.phase);
  const diffMap = { mudah:{label:"Mudah",cls:"diff-mudah"}, sedang:{label:"Sedang",cls:"diff-sedang"}, sulit:{label:"Sulit",cls:"diff-sulit"} };
  const diff = diffMap[m.difficulty] || diffMap.mudah;

  set("story-verse", m.verse);
  set("story-title", m.title);
  set("story-subtitle", m.subtitle);
  set("story-makna", m.makna_inti);

  // Phase tag
  const ptag = document.getElementById("story-phase-tag");
  if (ptag) {
    ptag.textContent = phase?.name || m.phase;
    ptag.className = `font-sans text-xs font-bold px-3 py-1 rounded-full phase-${m.phase}`;
  }

  // Difficulty
  const dtag = document.getElementById("story-diff");
  if (dtag) {
    dtag.textContent = `● ${diff.label}`;
    dtag.className = `font-sans text-xs px-2 py-1 rounded-full ${diff.cls}`;
    dtag.style.background = "var(--surface2)";
  }

  // Story text (multiple paragraphs)
  const textEl = document.getElementById("story-text");
  if (textEl && m.story_parts) {
    textEl.innerHTML = m.story_parts.map(p => `<p>${p}</p>`).join("");
  }

  // Hero background
  const heroBg = document.getElementById("story-hero-bg");
  const phaseColors = { kana: "linear-gradient(135deg,#1a56db,#3b82f6)", galilea: "linear-gradient(135deg,#0369a1,#0891b2)", yerusalem: "linear-gradient(135deg,#7c3aed,#a855f7)" };
  if (heroBg) heroBg.style.cssText = `position:absolute;inset:0;${phaseColors[m.phase] || phaseColors.kana ? 'background:'+phaseColors[m.phase]+';' : ''}`;

  // Hero icon
  const iconEl = document.getElementById("story-icon");
  if (iconEl) iconEl.textContent = m.icon || "auto_stories";

  // Image handling
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

  // Progress dots
  const dotsEl = document.getElementById("story-dots");
  if (dotsEl) {
    dotsEl.innerHTML = ["Cerita","Pilihan","Kuis","Refleksi"].map((l,i) =>
      `<div title="${l}" style="width:${i===0?'28px':'8px'};height:8px;border-radius:99px;background:${i===0?'var(--primary)':'var(--surface3)'};transition:all 0.3s;"></div>`
    ).join("");
  }
}



function goToDecision() {
  renderDecision();
  showScreen("screen-decision");
  updateDots(1);
}

// ─── DECISION ─────────────────────────────────────────────────
function renderDecision() {
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


  // Membungkus opsi dengan index aslinya, lalu diacak
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

  // Points for decision
if (opt.correct) {
  user.points += opt.points;
} else {
  user.points += Math.floor(opt.points * 0.3); // penalti
}

  // Feedback
  const fb = document.getElementById("decision-feedback");
  const fbi = document.getElementById("dec-feedback-icon");
  const fbt = document.getElementById("dec-feedback-title");
  const fbx = document.getElementById("dec-feedback-text");

  if (fb) fb.style.display = "block";
  if (fbt) fbt.textContent = opt.correct ? "✓ Pilihan yang bijak!" : "Hmm, pikirkanlah lebih dalam...";
  if (fbx) fbx.textContent = opt.feedback;
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

// ─── QUIZ ─────────────────────────────────────────────────────
function renderQuiz() {
  const m = appData.miracles[currentIdx];
  const q = m.quiz;

  set("quiz-chapter", `Mukjizat ${currentIdx + 1}: ${m.title}`);
  set("quiz-question", q.question);

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

  // Memaksa opsi selalu diacak setiap kali kuis dimuat, bukan hanya saat retry
  let opts = shuffleArray([...q.options]);

if (quizAnswered) return;
quizAnswered = true;

  optEl.innerHTML = opts.map((opt, i) => `
    <button onclick="checkAnswer('${escStr(opt)}')" id="qa-${i}" class="option-card">
      <div style="width:32px;height:32px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.8rem;color:var(--muted)">${String.fromCharCode(65+i)}</div>
      <p class="font-sans font-semibold text-sm leading-snug" style="color:var(--on-bg)">${opt}</p>
    </button>
  `).join("");

  renderDots(2);
}

function checkAnswer(selected) {
  const m = appData.miracles[currentIdx];
  const isCorrect = selected === m.quiz.answer;
  const attempts = (user.quizAttempts[m.id] || 0) + 1;
  user.quizAttempts[m.id] = attempts;

  // Points: correct first try = full, correct retry = partial
  if (isCorrect) {
    const pts = quizRetry ? m.quiz.points_partial : m.quiz.points_correct;
    user.points += pts;
  } else {
    // Wrong: give partial points (poin parsial saat salah)
    user.points += m.quiz.points_partial;
  }

  // Style buttons
  const optEl = document.getElementById("quiz-options");
  if (optEl) {
    const btns = optEl.querySelectorAll(".option-card");
    btns.forEach(btn => {
      const txt = btn.querySelector("p").textContent;
      btn.onclick = null;
      if (txt === m.quiz.answer) btn.className = "option-card opt-correct";
      else if (txt === selected && !isCorrect) btn.className = "option-card opt-wrong";
      else btn.className = "option-card opt-disabled";
    });
  }

  // Show insight
  const insightEl = document.getElementById("quiz-insight");
  set("quiz-insight-text", m.quiz.insight);
  if (insightEl) insightEl.style.display = "block";

  // Show retry or continue
  const retryWrap = document.getElementById("quiz-retry-wrap");
  const contBtn = document.getElementById("quiz-continue");

  if (!isCorrect && !quizRetry) {
    // Wrong first attempt — offer retry
    if (retryWrap) retryWrap.style.display = "block";
    if (contBtn) contBtn.disabled = false; // still can continue
  } else {
    if (retryWrap) retryWrap.style.display = "none";
    if (contBtn) contBtn.disabled = false;
  }

  quizAnswered = true;
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

function handleQuizAnswer(isCorrect, m) {
  const attempts = user.quizAttempts[m.id] || 0;

  const correctPoints = Number(m.quiz?.points_correct) || 0;
  const partialPoints = Number(m.quiz?.points_partial) || 0;

  let points = 0;

  if (isCorrect) {
    if (attempts === 0) {
      points = correctPoints;
    } else {
      points = Math.floor(correctPoints * 0.5);
    }
  } else {
    points = partialPoints;
  }

  user.points = Number(user.points) || 0;
  user.points += points;

  user.quizAttempts[m.id] = attempts + 1;

  // 🔥 TARUH DI SINI
  console.log("QUIZ:", m.quiz);
  console.log("CORRECT:", m.quiz?.points_correct);
  console.log("POINTS:", points);

  saveUser();

  return points;
}

// ─── REFLECTION ───────────────────────────────────────────────
// CARI FUNGSI INI DI APP.JS DAN TIMPA DENGAN KODE BERIKUT:
function renderReflection() {
  const m = appData.miracles[currentIdx];
  const r = m.reflection;

  set("ref-points", `+${m.reflection.points} Poin`);
  set("ref-badge", m.reward);
  set("ref-closing", m.episode_closing);
  set("ref-prompt", r.prompt);

  const inputEl = document.getElementById("ref-input");
  const saveBtn = document.getElementById("btn-save-reflection");
  const noteEl = document.getElementById("ref-char-note"); // Ambil elemen catatan kita

  if (inputEl) {
    // Set teks lama jika sudah pernah diisi
    inputEl.value = user.reflections[m.id] || "";
    inputEl.placeholder = r.starter || "Mulai dengan menulis...";
    
    // Fungsi untuk mengecek dan mengupdate tampilan
    const checkLength = () => {
      const len = inputEl.value.trim().length;
      
      // Update status tombol
      if (saveBtn) saveBtn.disabled = len < 10;
      
      // Update teks catatan
      if (noteEl) {
        if (len === 0) {
          noteEl.textContent = "Minimal 10 karakter untuk menyimpan.";
          noteEl.style.color = "var(--muted)"; // Warna abu-abu bawaan
        } else if (len < 10) {
          noteEl.textContent = `Ketik ${10 - len} karakter lagi...`;
          noteEl.style.color = "var(--accent)"; // Warna kuning/orange peringatan
        } else {
          noteEl.textContent = "✓ Teks sudah cukup, silakan simpan!";
          noteEl.style.color = "var(--success)"; // Warna hijau sukses
        }


        renderDots(3);
      }
    };

    // Panggil saat halaman pertama kali dimuat
    checkLength();

    // Panggil setiap kali user mengetik sesuatu
    inputEl.oninput = () => {
      checkLength();
    };
  }

  const fbEl = document.getElementById("ref-feedback");
  if (fbEl) fbEl.classList.add("hidden");
}

function saveReflection() {
  const m = appData.miracles[currentIdx];
  const inputEl = document.getElementById("ref-input");
  const text = inputEl ? inputEl.value.trim() : "";

  user.reflections[m.id] = text;
function showSummary(m) {
  alert(`Hari ini kamu belajar:
- ${m.makna_inti}
- Menerapkan iman dalam situasi nyata
- Merefleksikan pengalaman pribadi`);
}
  // Feedback message
  const fbEl = document.getElementById("ref-feedback");
  if (fbEl && text.length > 10) {
    fbEl.textContent = "✓ " + m.reflection.feedback_positive;
    fbEl.classList.remove("hidden");
    user.points += m.reflection.points;
  }

  showReward();
}

// ─── REWARD ───────────────────────────────────────────────────
// CARI FUNGSI INI DI APP.JS DAN TIMPA DENGAN KODE BERIKUT:
function showReward() {
  const m = appData.miracles[currentIdx];
  const alreadyDone = user.completed.includes(m.id);

  // 🔥 PERBAIKAN: Buat nilai fallback (bonus 50 poin) jika m.points tidak ada
  const completionBonus = m.points || 50; 

  if (!alreadyDone) {
    user.completed.push(m.id);
    user.points += completionBonus; // 🔥 PERBAIKAN: Tambahkan bonus yang valid
    user.badges.push(m.reward);
    // Level up
    const next = m.level + 1;
    if (next > user.level) user.level = next;
  }

  saveUser();

  // Render reward
  const total = appData.miracles.length;
  const pct = Math.round((user.completed.length / total) * 100);

  set("reward-miracle-name", m.title);
  
  // 🔥 PERBAIKAN: Gunakan completionBonus di UI agar tidak "undefined"
  set("reward-pts-display", alreadyDone ? "Sudah Dikerjakan" : `+${completionBonus}`);
  set("reward-badge", m.reward);
  set("reward-msg", m.reward_message);
  set("reward-total-pts", `Total: ${user.points.toLocaleString("id-ID")} poin`);

  const fillEl = document.getElementById("reward-total-fill");
  if (fillEl) setTimeout(() => { fillEl.style.width = pct + "%"; }, 200);

  // Emoji per category
  const emojiMap = { alam:"🌊", penyembuhan:"✨", eksorsisme:"⚡", kebangkitan:"🌅" };
  const emoji = emojiMap[m.category] || "🎉";
  set("reward-emoji", emoji);

  // Level up notice
  const luEl = document.getElementById("reward-levelup");
  const luText = document.getElementById("reward-levelup-text");
  const nextIdx = currentIdx + 1;
  if (!alreadyDone && luEl && nextIdx < appData.miracles.length) {
    luEl.style.display = "flex";
    if (luText) luText.textContent = `"${appData.miracles[nextIdx].title}" kini tersedia!`;
  } else if (luEl) {
    luEl.style.display = "none";
  }

  // Emotional feedback messages
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

  showScreen("screen-reward");
}


// ─── BADGES ───────────────────────────────────────────────────
function renderBadges() {
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
  const v = document.getElementById("prof-name-input")?.value.trim();
  if (!v) return;
  user.name = v;
  saveUser();
  updateHomeScreen();
  updateProfile();
}

function resetAll() {
  const confirmReset = confirm("Yakin mau reset semua progress?");
  if (!confirmReset) return;

  // hapus semua data
  localStorage.removeItem("mj_user");

  // reset state
  user = {
    name: "Peziarah",
    points: 0,
    level: 1,
    completed: [],
    badges: [],
    reflections: {},
    quizAttempts: {}
  };

  // reset index
  currentIdx = 0;

  // stop audio kalau ada
  stopTTS();

  // balik ke onboarding
  showScreen("screen-onboarding");
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

    showLevelUp();     // 🔥 popup keren
    saveUser();        // 🔥 simpan data
    updateHomeScreen(); // 🔥 update UI
  }
}

function completeMiracle(m) {
  if (!user.completed.includes(m.id)) {
    user.completed.push(m.id);
  }

  checkLevelUp(); // 🔥 penting
  saveUser();
}

function speakText(text) {
  // Hentikan suara sebelumnya
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Bahasa Indonesia
  utterance.lang = "id-ID";

  // Pengaturan suara
  utterance.rate = 0.95;   // kecepatan
  utterance.pitch = 1;     // nada
  utterance.volume = 1;    // volume

  speechSynthesis.speak(utterance);
}

function playStoryAudio() {
  const title = document.getElementById("story-title")?.innerText || "";
  const subtitle = document.getElementById("story-subtitle")?.innerText || "";
  const verse = document.getElementById("story-verse")?.innerText || "";
  const story = document.getElementById("story-text")?.innerText || "";
  const makna = document.getElementById("story-makna")?.innerText || "";

  const fullText = `
  ${title}...

  ${subtitle}...

  Diambil dari ${verse}...

  ${story}...

  Makna inti dari peristiwa ini adalah...

  ${makna}
  `;

  speakText(fullText);
}
function stopAudio() {
  speechSynthesis.cancel();
}



function speakText(text) {
  stopTTS(); // penting!

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  u.rate = 0.95;
  u.pitch = 1;

  u.onstart = () => {
    tts.isSpeaking = true;
  };

  u.onend = () => {
    tts.isSpeaking = false;
  };

  speechSynthesis.speak(u);
  tts.utterance = u;
}

function pauseTTS() {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    tts.isPaused = true;
  }
}

function resumeTTS() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    tts.isPaused = false;
  }
}

function stopTTS() {
  speechSynthesis.cancel();
  tts.isSpeaking = false;
}

function toggleTTS() {
  const m = appData.miracles[currentIdx]; // Mendeklarasikan variabel 'm'
  const text = getFullStoryText(m); // Memanggil fungsi teks

  if (!tts.isSpeaking) {
    playTTS(text);
  } else if (tts.isPaused) {
    resumeTTS();
  } else {
    pauseTTS();
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





/* === PERBAIKAN TOTAL BAGIAN TTS DAN HELPER === */

function getFullStoryText(m) {
  if (!m) return "";
  return `
    ${m.title}.
    ${m.subtitle}.
    ${m.story_parts.join(" ")}.
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
  const el = document.querySelectorAll(".story-dots"); // Menggunakan class agar semua dot terupdate
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

  // --- LOGIKA 15 KUTIPAN ACAK ---
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

  // Pilih satu kutipan secara acak
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const reflectionEl = document.getElementById("home-reflection-text");
  if (reflectionEl) {
    reflectionEl.innerText = randomQuote;
  }
}

// ─── GLOSARIUM ────────────────────────────────────────────────

function openGlosarium() {
  renderGlosarium();
  showScreen('screen-glosarium');
}

function renderGlosarium() {
  const container = document.getElementById("glosarium-list");
  if (!container || !appData || !appData.glossary) return;

  // Mengurutkan glosarium secara alfabetis agar rapi
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
