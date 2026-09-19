// ============================================================
// APP LOGIC
// ============================================================
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const screens = {
    landing: $("#screen-landing"),
    form: $("#screen-form"),
    quiz: $("#screen-quiz"),
    result: $("#screen-result"),
    panitiaLogin: $("#screen-panitia-login"),
    dashboard: $("#screen-dashboard"),
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => (el.hidden = true));
    screens[name].hidden = false;
    screens[name].classList.remove("screen");
    void screens[name].offsetWidth; // restart entrance animation
    screens[name].classList.add("screen");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  // ---------------- Theme toggle ----------------
  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("binaTalenta.theme"); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    $("#btn-theme").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDarkNow = current ? current === "dark" : prefersDark;
      const next = isDarkNow ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("binaTalenta.theme", next); } catch (e) {}
    });
  })();

  // ---------------- Nav ----------------
  $("#btn-logo").addEventListener("click", () => showScreen("landing"));
  $$("[data-back]").forEach((btn) =>
    btn.addEventListener("click", () => showScreen(btn.dataset.back))
  );
  $("#btn-panitia-entry").addEventListener("click", () => showScreen("panitiaLogin"));

  // ---------------- State ----------------
  const state = {
    testType: "pre", // 'pre' | 'post'
    participant: null, // { nama, nim, prodi, wa }
    questions: [],
    index: 0,
    answers: [], // selected option index per question, -1 if unanswered
    startedAt: 0,
    timerHandle: null,
  };

  function formatDuration(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // ---------------- Randomize question order & option order ----------------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Setiap peserta mendapat SUBSET soal (CONFIG.QUESTIONS_PER_PARTICIPANT
   *  dari total bank) DAN urutan pilihan jawaban yang diacak ulang —
   *  supaya peserta yang duduk berdekatan tidak bisa saling mencontek,
   *  dan tidak semua orang mengerjakan soal yang identik. */
  function prepareQuestions(bank) {
    const count = Math.min(CONFIG.QUESTIONS_PER_PARTICIPANT || bank.length, bank.length);
    return shuffle(bank)
      .slice(0, count)
      .map((q) => {
        const order = shuffle(q.options.map((_, i) => i));
        return {
          text: q.text,
          options: order.map((i) => q.options[i]),
          correct: order.indexOf(q.correct),
        };
      });
  }

  // ---------------- Landing -> pick test ----------------
  function startFlow(type) {
    state.testType = type;
    $("#form-mode-pill").textContent = type === "pre" ? "Pre-Test" : "Post-Test";
    $("#identity-form").reset();
    showScreen("form");
    $("#f-nama").focus();
  }
  $("#card-pre").addEventListener("click", () => startFlow("pre"));
  $("#card-post").addEventListener("click", () => {
    if (!postTestEnabled) return;
    startFlow("post");
  });

  // ---------------- Post-Test lock (dikontrol panitia) ----------------
  let postTestEnabled = true;

  function applyPostTestLockUI() {
    $("#card-post").classList.toggle("is-locked", !postTestEnabled);
    $("#post-test-cta").hidden = !postTestEnabled;
    $("#post-test-locked").hidden = postTestEnabled;
  }

  async function refreshPostTestLock() {
    const res = await Api.fetchPostTestStatus();
    postTestEnabled = res.enabled;
    applyPostTestLockUI();
  }
  refreshPostTestLock();

  // ---------------- Identity form ----------------
  $("#identity-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#f-nama").value.trim();
    const email = $("#f-email").value.trim();
    const nim = $("#f-nim").value.trim();
    const prodi = $("#f-prodi").value.trim();
    const wa = $("#f-wa").value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nama || !emailValid || !nim || !prodi) {
      if (!emailValid && email) $("#f-email").setCustomValidity("Format email tidak valid.");
      else $("#f-email").setCustomValidity("");
      $("#identity-form").reportValidity();
      return;
    }
    $("#f-email").setCustomValidity("");

    state.participant = { nama, email, nim, prodi, wa };
    state.questions = prepareQuestions(QUESTION_BANK[state.testType]);
    state.index = 0;
    state.answers = new Array(state.questions.length).fill(-1);
    state.startedAt = Date.now();

    $("#q-total").textContent = state.questions.length;
    buildProgress();
    renderQuestion();
    startTimer();
    showScreen("quiz");
  });

  // ---------------- Quiz ----------------
  function buildProgress() {
    const track = $("#quiz-progress");
    track.innerHTML = "";
    state.questions.forEach(() => {
      const seg = document.createElement("div");
      seg.className = "quiz-progress-seg";
      track.appendChild(seg);
    });
    track.setAttribute("aria-valuemax", state.questions.length);
  }

  function updateProgress() {
    const segs = $$(".quiz-progress-seg");
    segs.forEach((seg, i) => {
      seg.classList.toggle("is-done", i < state.index);
      seg.classList.toggle("is-current", i === state.index);
    });
    $("#quiz-progress").setAttribute("aria-valuenow", state.index);
  }

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    state.timerHandle = setInterval(updateTimerDisplay, 1000);
  }
  function stopTimer() {
    if (state.timerHandle) clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
  function updateTimerDisplay() {
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    $("#q-timer").textContent = formatDuration(elapsed);
  }

  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  function renderQuestion() {
    const q = state.questions[state.index];
    $("#q-current").textContent = state.index + 1;
    $("#q-tag").textContent =
      state.testType === "pre" ? "Pre-Test · Bina Talenta" : "Post-Test · Bina Talenta";
    $("#q-text").textContent = q.text;
    updateProgress();

    const optionsEl = $("#q-options");
    optionsEl.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      if (state.answers[state.index] === i) btn.classList.add("is-selected");
      btn.innerHTML = `<span class="option-letter">${LETTERS[i]}</span><span>${opt}</span>`;
      btn.addEventListener("click", () => selectAnswer(i));
      optionsEl.appendChild(btn);
    });

    const isLast = state.index === state.questions.length - 1;
    $("#btn-next-label").textContent = isLast ? "Lihat Hasil" : "Lanjut";
    const answered = state.answers[state.index] !== -1;
    $("#btn-next").disabled = !answered;
    $("#quiz-hint").textContent = answered
      ? "Mantap, siap lanjut?"
      : "Pilih salah satu jawaban di atas.";
  }

  function selectAnswer(i) {
    state.answers[state.index] = i;
    $$(".option").forEach((el, idx) => el.classList.toggle("is-selected", idx === i));
    $("#btn-next").disabled = false;
    $("#quiz-hint").textContent = "Mantap, siap lanjut?";
  }

  $("#btn-next").addEventListener("click", () => {
    const isLast = state.index === state.questions.length - 1;
    if (isLast) {
      finishQuiz();
    } else {
      state.index += 1;
      renderQuestion();
    }
  });

  // ---------------- Result ----------------
  function computeScore() {
    let correct = 0;
    state.questions.forEach((q, i) => {
      if (state.answers[i] === q.correct) correct += 1;
    });
    return { correct, total: state.questions.length };
  }

  function tierFor(pct) {
    if (pct >= 90) return { label: "Talenta Emas", className: "gold" };
    if (pct >= 75) return { label: "Talenta Unggul", className: "teal" };
    if (pct >= 50) return { label: "Talenta Berkembang", className: "coral" };
    return { label: "Talenta Pemula", className: "mint" };
  }

  function messageFor(pct) {
    if (pct >= 90) return "Luar biasa! Pemahamanmu sudah sangat matang. 🌟";
    if (pct >= 75) return "Kerja bagus! Tinggal sedikit lagi menuju sempurna. 💪";
    if (pct >= 50) return "Progres yang solid, terus semangat belajar! 🌱";
    return "Ini baru awal — sesi hari ini akan membantumu berkembang. 🚀";
  }

  async function finishQuiz() {
    stopTimer();
    const elapsedSec = Math.floor((Date.now() - state.startedAt) / 1000);
    const { correct, total } = computeScore();
    const pct = Math.round((correct / total) * 100);
    const tier = tierFor(pct);

    $("#result-mode-pill").textContent = state.testType === "pre" ? "Pre-Test" : "Post-Test";
    $("#stat-correct").textContent = `${correct}/${total}`;
    $("#stat-time").textContent = formatDuration(elapsedSec);
    $("#stat-name").textContent = state.participant.nama.split(" ")[0];
    $("#score-badge").textContent = tier.label;
    $("#result-message").textContent = messageFor(pct);
    $("#score-percent").textContent = "0%";

    const ring = $("#score-ring-fill");
    const circumference = 540.3;
    ring.style.stroke = `var(--${tier.className})`;
    ring.style.strokeDashoffset = circumference;

    showScreen("result");

    // animate ring + count-up on next frame so transition triggers
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ring.style.strokeDashoffset = String(circumference - (circumference * pct) / 100);
        animateCountUp($("#score-percent"), pct);
      });
    });

    if (pct >= 50 && !reduceMotion) fireConfetti(pct >= 90 ? 220 : 120);

    $("#result-sync").textContent = "Menyimpan hasil…";
    const entry = {
      nama: state.participant.nama,
      email: state.participant.email,
      nim: state.participant.nim,
      prodi: state.participant.prodi,
      wa: state.participant.wa || "",
      tipe: state.testType,
      skor: correct,
      total,
      persentase: pct,
      durasiDetik: elapsedSec,
      waktu: new Date().toISOString(),
    };
    const res = await Api.submitResult(entry);
    $("#result-sync").textContent = res.ok
      ? "Hasil tersimpan untuk panitia. ✅"
      : "Hasil tersimpan di perangkat ini (koneksi ke server bermasalah).";
  }

  function animateCountUp(el, target) {
    if (reduceMotion) {
      el.textContent = `${target}%`;
      return;
    }
    const duration = 1000;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(target * eased)}%`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  $("#btn-result-home").addEventListener("click", () => showScreen("landing"));

  // ---------------- Confetti ----------------
  const confettiCanvas = $("#confetti");
  const ctx = confettiCanvas.getContext("2d");
  let confettiParticles = [];
  let confettiRAF = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  const CONFETTI_COLORS = ["#EFA332", "#0E5C68", "#E4573F", "#2E9E6E", "#FBF6EA"];

  function fireConfetti(count) {
    resizeConfetti();
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.3,
        vx: (Math.random() - 0.5) * 3.2,
        vy: 2 + Math.random() * 3.4,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 0,
        maxLife: 160 + Math.random() * 60,
      });
    }
    if (!confettiRAF) confettiRAF = requestAnimationFrame(confettiLoop);
  }

  function confettiLoop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.rot += p.vr;
      p.life += 1;
      const fade = Math.max(0, 1 - p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      ctx.restore();
    });
    confettiParticles = confettiParticles.filter((p) => p.life < p.maxLife && p.y < confettiCanvas.height + 40);
    if (confettiParticles.length > 0) {
      confettiRAF = requestAnimationFrame(confettiLoop);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiRAF = null;
    }
  }

  // ---------------- Panitia login ----------------
  let panitiaPassword = "";

  $("#panitia-login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = $("#f-panitia-code").value;
    $("#panitia-error").hidden = true;

    if (code !== CONFIG.PANITIA_PASSWORD) {
      $("#panitia-error").hidden = false;
      const card = $(".screen-panitia-login .panel-narrow");
      if (card && !reduceMotion) {
        card.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
          { duration: 320, easing: "cubic-bezier(0.32,0.72,0,1)" }
        );
      }
      return;
    }
    panitiaPassword = code;
    await loadDashboard();
    showScreen("dashboard");
  });

  $("#btn-dash-logout").addEventListener("click", () => {
    panitiaPassword = "";
    dashData = [];
    showScreen("landing");
  });

  // ---------------- Dashboard ----------------
  let dashData = [];
  let dashFilter = "all";
  let dashSort = "time-desc";

  async function loadDashboard() {
    $("#dash-tbody").innerHTML = `<tr class="dash-empty-row"><td colspan="6">Memuat data…</td></tr>`;
    $("#dash-source").textContent = Api.isRemote() ? "🟢 Google Sheets" : "🟡 Mode lokal (perangkat ini)";

    const res = await Api.fetchResults(panitiaPassword);
    if (!res.ok) {
      $("#dash-tbody").innerHTML = `<tr class="dash-empty-row"><td colspan="6">Gagal memuat data. Periksa koneksi atau API_URL di config.js.</td></tr>`;
      dashData = [];
      renderDashTiles();
      return;
    }
    dashData = res.data || [];
    postTestEnabled = res.postTestEnabled !== false;
    applyPostTestLockUI();
    setToggleUI(postTestEnabled, false);
    renderDashboard();
  }

  $("#btn-dash-refresh").addEventListener("click", loadDashboard);

  // ---------------- Toggle akses Post-Test (panitia) ----------------
  const toggleBtn = $("#btn-posttest-toggle");
  function setToggleUI(enabled, busy) {
    toggleBtn.setAttribute("aria-checked", String(enabled));
    toggleBtn.disabled = Boolean(busy);
    $("#posttest-toggle-sub").textContent = busy
      ? "Menyimpan…"
      : enabled
      ? "Peserta bisa mulai Post-Test sekarang."
      : "Post-Test terkunci untuk peserta sampai kamu buka.";
  }
  toggleBtn.addEventListener("click", async () => {
    const next = toggleBtn.getAttribute("aria-checked") !== "true";
    setToggleUI(next, true);
    const res = await Api.setPostTestEnabled(panitiaPassword, next);
    if (!res.ok) {
      setToggleUI(!next, false); // gagal, kembalikan ke keadaan semula
      return;
    }
    postTestEnabled = res.enabled;
    applyPostTestLockUI();
    setToggleUI(postTestEnabled, false);
  });

  $("#dash-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".segmented-btn");
    if (!btn) return;
    dashFilter = btn.dataset.filter;
    $$(".segmented-btn", $("#dash-filter")).forEach((b) => b.classList.toggle("is-active", b === btn));
    renderDashboard();
  });
  $("#dash-search").addEventListener("input", renderDashboard);
  $("#dash-sort").addEventListener("change", (e) => {
    dashSort = e.target.value;
    renderDashboard();
  });

  function avg(list) {
    if (!list.length) return null;
    return list.reduce((a, b) => a + Number(b.persentase || 0), 0) / list.length;
  }

  function renderDashTiles() {
    const pre = dashData.filter((d) => d.tipe === "pre");
    const post = dashData.filter((d) => d.tipe === "post");
    const avgPre = avg(pre);
    const avgPost = avg(post);

    $("#tile-total").textContent = dashData.length;
    $("#tile-avg-pre").textContent = avgPre === null ? "—" : `${avgPre.toFixed(0)}%`;
    $("#tile-avg-post").textContent = avgPost === null ? "—" : `${avgPost.toFixed(0)}%`;
    if (avgPre === null || avgPost === null) {
      $("#tile-delta").textContent = "—";
    } else {
      const delta = avgPost - avgPre;
      $("#tile-delta").textContent = `${delta >= 0 ? "+" : ""}${delta.toFixed(0)}%`;
    }
  }

  function getFilteredSorted() {
    let list = dashData.slice();
    if (dashFilter !== "all") list = list.filter((d) => d.tipe === dashFilter);
    const q = $("#dash-search").value.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) => (d.nama || "").toLowerCase().includes(q) || String(d.nim || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (dashSort === "time-desc") return new Date(b.waktu) - new Date(a.waktu);
      if (dashSort === "time-asc") return new Date(a.waktu) - new Date(b.waktu);
      if (dashSort === "score-desc") return Number(b.persentase) - Number(a.persentase);
      if (dashSort === "score-asc") return Number(a.persentase) - Number(b.persentase);
      return 0;
    });
    return list;
  }

  // ---------------- Leaderboard (skor 100%, tercepat, tanpa duplikat) ----------------
  let leaderboardFilter = "pre";
  const MEDALS = ["🥇", "🥈", "🥉"];

  $("#leaderboard-filter").addEventListener("click", (e) => {
    const btn = e.target.closest(".segmented-btn");
    if (!btn) return;
    leaderboardFilter = btn.dataset.lbFilter;
    $$(".segmented-btn", $("#leaderboard-filter")).forEach((b) => b.classList.toggle("is-active", b === btn));
    renderLeaderboard();
  });

  function renderLeaderboard() {
    const perfect = dashData.filter((d) => d.tipe === leaderboardFilter && Number(d.persentase) === 100);

    // satu peserta (per NIM) dihitung sekali — ambil attempt tercepatnya
    const bestByNim = new Map();
    perfect.forEach((d) => {
      const key = String(d.nim || d.email || d.nama);
      const existing = bestByNim.get(key);
      if (!existing || Number(d.durasiDetik) < Number(existing.durasiDetik)) {
        bestByNim.set(key, d);
      }
    });

    const ranked = Array.from(bestByNim.values())
      .sort((a, b) => Number(a.durasiDetik) - Number(b.durasiDetik))
      .slice(0, 3);

    const listEl = $("#leaderboard-list");
    if (!ranked.length) {
      listEl.innerHTML = `<p class="leaderboard-empty">Belum ada peserta dengan skor 100% di ${leaderboardFilter === "pre" ? "Pre-Test" : "Post-Test"}.</p>`;
      return;
    }
    listEl.innerHTML = ranked
      .map((d, i) => `
        <div class="leaderboard-item leaderboard-item--${i + 1}">
          <span class="leaderboard-rank">${MEDALS[i]}</span>
          <span class="leaderboard-main">
            <span class="leaderboard-name">${escapeHtml(d.nama)}</span><br>
            <span class="leaderboard-nim">${escapeHtml(d.nim)}</span>
          </span>
          <span class="leaderboard-time">${formatDuration(Number(d.durasiDetik) || 0)}</span>
        </div>`)
      .join("");
  }

  function renderDashboard() {
    renderDashTiles();
    renderLeaderboard();
    const list = getFilteredSorted();
    const tbody = $("#dash-tbody");
    if (!list.length) {
      tbody.innerHTML = `<tr class="dash-empty-row"><td colspan="6">Belum ada data yang cocok.</td></tr>`;
      return;
    }
    tbody.innerHTML = list
      .map((d) => {
        const time = d.waktu ? new Date(d.waktu) : null;
        const timeStr = time && !isNaN(time)
          ? time.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
          : "—";
        return `<tr>
          <td class="name-cell">${escapeHtml(d.nama)}</td>
          <td>${escapeHtml(d.nim)}</td>
          <td>${escapeHtml(d.prodi)}</td>
          <td><span class="type-badge ${d.tipe}">${d.tipe === "pre" ? "Pre-Test" : "Post-Test"}</span></td>
          <td>${d.skor}/${d.total} · ${d.persentase}%</td>
          <td>${timeStr}</td>
        </tr>`;
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  $("#btn-dash-export").addEventListener("click", () => {
    const list = getFilteredSorted();
    const header = ["Nama", "Email", "NIM", "Prodi", "WhatsApp", "Tipe", "Skor", "Total", "Persentase", "DurasiDetik", "Waktu"];
    const rows = list.map((d) => [d.nama, d.email || "", d.nim, d.prodi, d.wa || "", d.tipe, d.skor, d.total, d.persentase, d.durasiDetik, d.waktu]);
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${CONFIG.EVENT_NAME.replace(/\s+/g, "-")}-rekap-skor.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();
