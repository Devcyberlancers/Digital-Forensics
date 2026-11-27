const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_01"); } catch (error) {}

/* ============================================
   Machine 01: The Deleted Evidence — CTF Web App
   Application Logic
   ============================================ */

// ---- Data ----
const FLAG_HASHES = {
    F1: "cf6340108753e155fe782ed6427fceb6b119aba944488a02a67b9bf5641ef4ed",
    F2: "549ec5a429ab5ccb344a6e6c40832ba7432f7e3157168053eb9a42bb48e5cb24",
    F3: "99714ffb32534d1e33a8eb6687bb3963fe885b8ff2d0da4fe437fa7bd97a28ba",
    F4: "1b41b37e03b09d411f32db3e80d6afe08164fe65b799d169669bef8c447d14f0",
    F5: "8416437b7b786a4465051c3145dac272a8221993bfd850b0640b45f83d3c5c43",
    F6: "77c8a1642309f16f515b86226171547c7ba0826ef85b823eb50c849d1980f205",
    F7: "b16ba5d2d843d21bcadb34abc39b6e75a030632b6d1b968c3939a90790cc22ea",
    F8: "b9296cd1405c51d1368c3be539b1f2fd6a0b2eab1b44aeda5df8e1ec1540eb0e",
};

const FLAG_MAP = {
    F1: { q: "Q2", name: "Cleanup Intent", points: 5 },
    F2: { q: "Q4", name: "Strategy Correlation", points: 10 },
    F3: { q: "Q5", name: "Rate Card Impact", points: 10 },
    F4: { q: "Q6", name: "Metadata Attribution", points: 10 },
    F5: { q: "Q7", name: "Competitor Intel", points: 10 },
    F6: { q: "Q8", name: "Deletion Intent", points: 10 },
    F8: { q: "Q9", name: "Browser Transfer Trail", points: 15 },
    F7: { q: "Q10", name: "Capstone Conclusion", points: 15 },
};

const QUESTIONS = [
    {
        id: "Q1", num: 1, difficulty: "easy", points: 5,
        title: "Evidence Integrity Verification",
        text: "Calculate the SHA-256 of pinnacle_ws047.img before opening it in Autopsy.\nCompare the full digest with Hashes/SHA256SUMS.txt.\nEnter the first 16 hexadecimal characters of the verified digest.",
        format: "<first_16_sha256_characters>",
        tool: "sha256sum / Get-FileHash",
        hasFlag: false,
        answer: "ba350d9d47d67964",
        altAnswers: [],
        hint: "Linux: sha256sum Evidence/Disk/pinnacle_ws047.img. PowerShell: Get-FileHash -Algorithm SHA256.",
        wtAnswer: "Observation: SHA-256 begins <code>ba350d9d47d67964</code>.<br>Interpretation: It matches the manifest.<br>Submit: <strong>ba350d9d47d67964</strong>.",
    },
    {
        id: "Q2", num: 2, difficulty: "easy", points: 5,
        title: "The Note She Forgot to Delete",
        text: "Add pinnacle_ws047.img to Autopsy as a Disk Image or VM File.\nLocate Riya’s desktop case_notes.txt and identify the cleanup statement and her reference to an external copy.\nUse the backup term and initials to form your answer.",
        format: "FLAG{cleanup_<backup_term>_<initials>}",
        tool: "Autopsy",
        hasFlag: true, flagKey: "F1",
        hint: "This file is allocated, not deleted. Look for the note on Riya's Desktop and pay attention to the cloud backup wording.",
        wtAnswer: "Observation: <code>case_notes.txt</code> mentions cleanup and cloud backup.<br>Interpretation: The note establishes intent and points to cloud-transfer artifacts.<br>Conclusion: derive the cleanup flag from cleanup intent, cloud backup, and R.S. initials. See the instructor answer key for the final string.",
    },
    {
        id: "Q3", num: 3, difficulty: "easy", points: 10,
        title: "Deleted Files Triage",
        text: "Find the deleted strategy document in Autopsy’s Deleted Files view.\nMatch it with the corresponding Recycle Bin metadata record.\nEnter its original full Windows path.",
        format: "<drive>:\\<folders>\\<filename.extension>",
        tool: "Autopsy Deleted Files + Recycle Bin metadata",
        hasFlag: false,
        answer: "d:\\projects\\clientcampaigns\\q3_campaign_strategy.docx",
        altAnswers: ["d:/projects/clientcampaigns/q3_campaign_strategy.docx"],
        hint: "Deleted Files proves deletion; the $I-style metadata under $Recycle.Bin preserves the original Windows path.",
        wtAnswer: "Observation: Deleted entry and $Recycle.Bin metadata refer to the same document.<br>Interpretation: The metadata preserves the original path.<br>Conclusion: <code>D:\\Projects\\ClientCampaigns\\Q3_Campaign_Strategy.docx</code>",
    },
    {
        id: "Q4", num: 4, difficulty: "medium", points: 10,
        title: "Recovering the Strategy Document",
        text: "Recover the deleted strategy document in Autopsy and match it with its Recycle Bin record.\nRead the recovered document to establish the budget and note why it is sensitive.\nUse the budget digits and matching Recycle Bin record ID.",
        format: "FLAG{strategy_<budget_digits>_<recycle_record_id>}",
        tool: "Autopsy Extract File(s) + LibreOffice",
        hasFlag: true, flagKey: "F2",
        hint: "Recover the deleted entry, inspect the budget table, then correlate it with the $IA1B2C3 Recycle Bin metadata record.",
        wtAnswer: "Observation: Budget is INR 1,20,00,000 and the metadata record is $IA1B2C3.docx.<br>Interpretation: Sensitive campaign strategy was deleted from the project path.<br>Conclusion: derive the strategy flag from the budget digits and Recycle Bin record id. See the instructor answer key for the final string.",
    },
    {
        id: "Q5", num: 5, difficulty: "medium", points: 10,
        title: "The Confidential Rate Card",
        text: "Recover the deleted rate-card PDF and match it with its Recycle Bin metadata.\nFind the YouTube Pre-roll CPM and record how the document is classified.\nUse the platform, CPM, and classification in the answer.",
        format: "FLAG{ratecard_<platform>_<cpm>_<classification>}",
        tool: "Autopsy + PDF Viewer",
        hasFlag: true, flagKey: "F3",
        hint: "Filter Deleted Files by PDF type, extract the candidate, then inspect both the pricing table and classification/footer area.",
        wtAnswer: "Observation: YouTube Pre-roll CPM is INR 210 and the document is confidential.<br>Interpretation: The artifact contains sensitive client pricing.<br>Conclusion: derive the rate-card flag from platform, CPM, and classification. See the instructor answer key for the final string.",
    },
    {
        id: "Q6", num: 6, difficulty: "medium", points: 10,
        title: "Recovered Image Metadata",
        text: "Recover the deleted campaign mockup and open its metadata with ExifTool.\nRecord the image dimensions and the artist or author listed in the file.\nUse the artist’s first name and the dimensions in your answer.",
        format: "FLAG{mockup_<width>x<height>_<artist_first_name>}",
        tool: "Autopsy + ExifTool",
        hasFlag: true, flagKey: "F4",
        hint: "After extraction, run exiftool against the recovered PNG. Use both dimensions and attribution metadata.",
        wtAnswer: "Observation: 1200 x 800 image, Artist Riya Sharma.<br>Interpretation: The mockup is attributable to Riya and belongs to the recovered campaign set.<br>Conclusion: derive the mockup flag from dimensions and artist first name. See the instructor answer key for the final string.",
    },
    {
        id: "Q7", num: 7, difficulty: "medium", points: 10,
        title: "Competitor Intelligence",
        text: "Recover the deleted competitor spreadsheet and count the competitors listed.\nIdentify the company with the highest estimated Q3 spend and record that amount.\nCompare the amount with the strategy document and use the company’s short name.",
        format: "FLAG{competitor_<count>_<top_company_shortname>_<budget_digits>}",
        tool: "Autopsy + LibreOffice Calc",
        hasFlag: true, flagKey: "F5",
        hint: "Inspect the workbook rows, compare Q3 estimated spend, and connect the highest value to the campaign strategy budget.",
        wtAnswer: "Observation: 5 competitors; BrandForce Digital is highest at INR 1,20,00,000.<br>Interpretation: Competitor intelligence aligns with the recovered strategy budget.<br>Conclusion: derive the competitor flag from count, top competitor short name, and budget digits. See the instructor answer key for the final string.",
    },
    {
        id: "Q8", num: 8, difficulty: "hard", points: 10,
        title: "Deletion Timeline and Intent",
        text: "Review all five Recycle Bin metadata records and establish the start and end of the deletion window.\nUse the deleted reminder to assess whether the cleanup was accidental, routine, or deliberate.\nRecord the number of files and both times to the second.",
        format: "FLAG{delete_<count>files_<start_hhmmss>_<end_hhmmss>_<behavior>}",
        tool: "Autopsy Recycle Bin correlation + file recovery",
        hasFlag: true, flagKey: "F6",
        hint: "The records span only two seconds. The fifth deleted artifact is a reminder that must be interpreted alongside the timestamps.",
        wtAnswer: "Observation: 5 files deleted from 21:15:32 to 21:15:34; reminder confirms cleanup intent.<br>Interpretation: The tight cluster supports batch deletion.<br>Conclusion: derive the deletion flag from file count, start time, end time, and behavior. See the instructor answer key for the final string.",
    },
    {
        id: "Q9", num: 9, difficulty: "hard", points: 15,
        title: "Browser Transfer Trail",
        text: "In Autopsy, identify the final file-transfer page visited before Gmail activity.\nIf parsed browser history is unavailable, open Chrome’s History database in the Application tab and inspect the urls table.\nConvert the matching last_visit_time to IST with the Chrome Timestamp Converter above the questions.",
        format: "FLAG{transfer_<service>_<hhmmss>_before_gmail}",
        tool: "Autopsy Chrome History Application tab",
        hasFlag: true, flagKey: "F8",
        hint: "In the History file, open Application > urls. Paste the WeTransfer last_visit_time into the Chrome Timestamp Converter above the questions.",
        wtAnswer: "Observation: The Chrome History Application table shows <code>https://wetransfer.com/uploads/new</code> with timestamp <code>13417971307000000</code>, which converts to 19:45:07 IST. Gmail appears later, and deletion occurs at 21:15.<br>Interpretation: The transfer activity supports the cloud-backup clue from Riya's note and prepares the timeline for Q10.<br>Conclusion: derive the transfer flag from service, local time, and before-gmail relationship. See the instructor answer key for the final string.",
    },
    {
        id: "Q10", num: 10, difficulty: "hard", points: 15,
        title: "Capstone Analyst Conclusion",
        text: "Compare the WINRAR.EXE Prefetch record with Chrome History, the recovered documents, and the Recycle Bin deletion window.\nIdentify the compression executable, transfer service, and deletion behavior.\nRecord a short conclusion in your notes before submitting the flag.",
        format: "FLAG{<compression_tool>_<transfer_service>_<deletion_behavior>_supported}",
        tool: "Autopsy timeline correlation",
        hasFlag: true, flagKey: "F7",
        hint: "Compare WINRAR's last-run time with Drive/WeTransfer visits, Gmail activity, and the 21:15 batch deletion window.",
        wtAnswer: "Observation: WINRAR at 19:08, transfer activity at 19:18-19:45, Gmail at 20:05, batch deletion at 21:15.<br>Interpretation: Multiple artifacts support deliberate transfer followed by cleanup.<br>Conclusion: derive the capstone flag from compression tool, transfer service, deletion behavior, and supported conclusion. See the instructor answer key for the final string.",
    },
];

// ---- State ----
const STORAGE_KEY = "dfctf_m01_state_v7";

let state = {
    started: false,
    startTime: null,
    timerInterval: null,
    score: 0,
    answeredQuestions: new Set(),
    foundFlags: new Set(),
    expandedQuestion: null,
    evidenceUnlocked: false,
};

// Try restore from localStorage
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        state.score = parsed.score || 0;
        state.answeredQuestions = new Set(parsed.answeredQuestions || []);
        state.foundFlags = new Set(parsed.foundFlags || []);
        state.started = parsed.started || false;
        state.startTime = parsed.startTime ? new Date(parsed.startTime) : null;
    }
} catch (e) { /* ignore */ }

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            score: state.score,
            answeredQuestions: [...state.answeredQuestions],
            foundFlags: [...state.foundFlags],
            started: state.started,
            startTime: state.startTime?.toISOString(),
        }));
    } catch (e) { /* ignore */ }
}

// ---- Particles ----
function initParticles() {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let matrixDrops = [];
    const PARTICLE_COUNT = 72;
    const colors = [
        [239, 29, 49],
        [255, 235, 238],
        [245, 158, 11],
        [185, 28, 28],
    ];
    const glyphs = "01HEXDELNTFSHASH";

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const columnWidth = 24;
        const columns = Math.ceil(canvas.width / columnWidth);
        matrixDrops = Array.from({ length: columns }, (_, index) => ({
            x: index * columnWidth,
            y: Math.random() * canvas.height,
            speed: 0.35 + Math.random() * 0.9,
            alpha: 0.08 + Math.random() * 0.14,
            columnWidth,
        }));
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "12px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        matrixDrops.forEach((drop) => {
            for (let i = 0; i < 7; i++) {
                const y = drop.y - i * 18;
                if (y < -20 || y > canvas.height + 20) continue;
                const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
                const alpha = Math.max(0, drop.alpha - i * 0.015);
                const isLead = i === 0;
                ctx.fillStyle = isLead
                    ? `rgba(255, 241, 242, ${Math.min(0.34, alpha + 0.12)})`
                    : `rgba(248, 113, 113, ${alpha})`;
                ctx.fillText(ch, drop.x, y);
            }
            drop.y += drop.speed;
            if (drop.y > canvas.height + 130) {
                drop.y = -Math.random() * 260;
                drop.speed = 0.35 + Math.random() * 0.9;
                drop.alpha = 0.08 + Math.random() * 0.14;
            }
        });

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            const [r, g, b] = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(p.x - 5, p.y);
            ctx.lineTo(p.x + 5, p.y);
            ctx.moveTo(p.x, p.y - 5);
            ctx.lineTo(p.x, p.y + 5);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.24})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const [r, g, b] = particles[i].color;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ---- Navigation ----
document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        const section = tab.dataset.section;
        switchSection(section);
    });
});

function switchSection(sectionId) {
    document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add("active");
    document.getElementById(sectionId)?.classList.add("active");
    if (sectionId === "evidence") updateEvidenceAccess();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function canAccessEvidenceExplorer() {
    return state.evidenceUnlocked;
}

function updateEvidenceAccess() {/* Retired page. */}

function unlockEvidenceExplorer() {/* Retired page. */}

// ---- Evidence Tabs ----
document.querySelectorAll(".ev-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".ev-tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".ev-panel").forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`evpanel-${tab.dataset.evtab}`)?.classList.add("active");
    });
});

// ---- Timer ----
function startTimer() {
    if (state.timerInterval) return;
    if (!state.startTime || !Number.isFinite(new Date(state.startTime).getTime()) || new Date(state.startTime) > Date.now()) state.startTime = new Date();
    state.started = true;
    state.timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    saveState();
}

function updateTimer() {
    if (!state.startTime) {
        document.getElementById("timerDisplay").textContent = "00:00:00";
        const el = document.getElementById("elapsedTime");
        if (el) el.textContent = "00:00";
        return;
    }
    const elapsed = Math.max(0,Math.floor((Date.now() - new Date(state.startTime)) / 1000));
    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    document.getElementById("timerDisplay").textContent = `${h}:${m}:${s}`;
    const el = document.getElementById("elapsedTime");
    if (el) el.textContent = `${h}:${m}`;
}

function startInvestigation() {
    startTimer();
    switchSection("questions");
    showToast("Investigation started. Add pinnacle_ws047.img to Autopsy as Disk Image or VM File, then submit findings here.", "info");
}

function resetMachine() {
    const confirmed = confirm("Reset this machine attempt? This clears the timer, score, submitted answers, and temporary unlocks in this browser.");
    if (!confirmed) return;

    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }

    state = {
        started: false,
        startTime: null,
        timerInterval: null,
        score: 0,
        answeredQuestions: new Set(),
        foundFlags: new Set(),
        expandedQuestion: null,
        evidenceUnlocked: false,
    };

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }

    const walkthroughLock = document.getElementById("walkthroughLock");
    const walkthroughContent = document.getElementById("walkthroughContent");
    if (walkthroughLock) walkthroughLock.style.display = "block";
    if (walkthroughContent) walkthroughContent.style.display = "none";

    updateTimer();
    renderQuestions();
    updateScoreboard();
    updateEvidenceAccess();
    switchSection("briefing");
    showToast("Machine reset. Start Investigation begins a fresh attempt.", "info");
}

// ---- Questions ----

function escapeQuestion(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

function questionDetails(question, tools, inputId) {
    const prompt = question.text.split("\n").map(escapeQuestion).join("<br>");
    return '<p class="investigation-prompt">' + prompt + '</p>'
        + '<div class="answer-format" id="format-' + question.id + '"><strong>Answer format</strong><code>'
        + escapeQuestion(question.format) + '</code></div>'
        + '<p class="investigation-tools">Tools: ' + escapeQuestion(tools) + '</p>'
        + '<label class="investigation-answer-label" for="' + inputId + '">' + question.id + ' answer</label>';
}

function questionHint(hint) {
    return '<details class="progressive-hint"><summary>Hint</summary><div>' + hint + '</div></details>';
}

function renderQuestions() {
    const list = document.getElementById("questionsList");
    list.innerHTML = "";

    QUESTIONS.forEach((q) => {
        const isAnswered = state.answeredQuestions.has(q.id);
        const card = document.createElement("div");
        card.className = `question-card investigation-question ${isAnswered ? "answered" : ""} ${state.expandedQuestion === q.id ? "expanded" : ""}`;
        card.id = `qcard-${q.id}`;

        card.innerHTML = `
            <div class="q-header">
                <button type="button" class="question-toggle" aria-expanded="${state.expandedQuestion === q.id}"
                    aria-controls="body-${q.id}" onclick="toggleQuestion('${q.id}')">${q.id} · ${escapeQuestion(q.title)} · ${q.points} pts</button>
                <small class="question-difficulty ${q.difficulty}">${q.difficulty}</small>
                <span class="question-status" role="img" aria-label="${isAnswered ? 'Answer accepted' : 'Not answered'}"><span class="question-status-dot" aria-hidden="true"></span></span>
            </div>
            <div class="q-body" id="body-${q.id}">
                ${questionDetails(q, q.tool, 'input-' + q.id)}
                ${q.hasFlag ? `
                    <div class="q-input-group">
                        <input type="text" class="q-input ${isAnswered ? "correct" : ""}" id="input-${q.id}" 
                               aria-describedby="format-${q.id}" placeholder="Answer entry is paused" value="${isAnswered ? "Captured" : ""}"
                               ${(ANSWER_ENTRY_PAUSED || isAnswered )? "disabled" : ""} onkeydown="if(event.key==='Enter')submitFlag('${q.id}','${q.flagKey}')">
                        <button class="btn-submit" onclick="submitFlag('${q.id}','${q.flagKey}')" ${(ANSWER_ENTRY_PAUSED || isAnswered )? "disabled" : ""}>
                            ${isAnswered ? "✓ Correct" : "Submit Flag"}
                        </button>
                    </div>
                ` : `
                    <div class="q-input-group">
                        <input type="text" class="q-input ${isAnswered ? "correct" : ""}" id="input-${q.id}"
                               aria-describedby="format-${q.id}" placeholder="Answer entry is paused"
                               ${(ANSWER_ENTRY_PAUSED || isAnswered )? "disabled" : ""} onkeydown="if(event.key==='Enter')submitAnswer('${q.id}')">
                        <button class="btn-submit" onclick="submitAnswer('${q.id}')" ${(ANSWER_ENTRY_PAUSED || isAnswered )? "disabled" : ""}>
                            ${isAnswered ? "✓ Correct" : "Submit Answer"}
                        </button>
                    </div>
                `}
                <div class="q-feedback" id="feedback-${q.id}"></div>
                ${questionHint(q.hint)}
            </div>
        `;
        list.appendChild(card);
    });
}

function toggleQuestion(qId) {

    const card = document.getElementById(`qcard-${qId}`);
    if (state.expandedQuestion === qId) {
        card.classList.remove("expanded");
        card.querySelector(".question-toggle").setAttribute("aria-expanded", "false");
        state.expandedQuestion = null;
    } else {
        document.querySelectorAll(".question-card").forEach((item) => {
            item.classList.remove("expanded");
            item.querySelector(".question-toggle").setAttribute("aria-expanded", "false");
        });
        card.classList.add("expanded");
        card.querySelector(".question-toggle").setAttribute("aria-expanded", "true");
        state.expandedQuestion = qId;
    }
}

function toggleHint(qId) {
    const hint = document.getElementById(`hint-${qId}`);
    hint.classList.toggle("visible");
}

function normalizeFlag(value) {
    return value.trim().toLowerCase();
}

async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function submitFlag(qId, flagKey) {
    if (ANSWER_ENTRY_PAUSED) return;

    const input = document.getElementById(`input-${qId}`);
    const feedback = document.getElementById(`feedback-${qId}`);
    const attempt = state;
    const valueHash = await sha256Hex(normalizeFlag(input.value));
    if (state !== attempt || state.answeredQuestions.has(qId)) return;

    if (valueHash === FLAG_HASHES[flagKey]) {
        input.classList.add("correct");
        input.classList.remove("incorrect");
        input.value = "Captured";
        input.disabled = true;
        feedback.textContent = "✓ Flag accepted! Well done.";
        feedback.className = "q-feedback correct";
        state.answeredQuestions.add(qId);
        state.foundFlags.add(flagKey);
        const q = QUESTIONS.find((q) => q.id === qId);
        state.score += q.points;
        updateScoreboard();
        saveState();
        showToast("Flag captured!", "success");
        document.querySelector(`#qcard-${qId} .btn-submit`).disabled = true;
        document.querySelector(`#qcard-${qId} .btn-submit`).textContent = "✓ Correct";
        document.getElementById(`qcard-${qId}`).classList.add("answered");
        document.querySelector(`#qcard-${qId} .question-status`).setAttribute("aria-label", "Answer accepted");
    } else {
        input.classList.add("incorrect");
        feedback.textContent = "✗ Incorrect flag. Check the format: FLAG{...}";
        feedback.className = "q-feedback incorrect";
        showToast("Incorrect flag. Try again!", "error");
        setTimeout(() => input.classList.remove("incorrect"), 1500);
    }
}

function submitAnswer(qId) {
    if (ANSWER_ENTRY_PAUSED) return;

    const input = document.getElementById(`input-${qId}`);
    const feedback = document.getElementById(`feedback-${qId}`);
    const value = input.value.trim().toLowerCase();
    const q = QUESTIONS.find((q) => q.id === qId);
    const correctAnswers = [q.answer, ...(q.altAnswers || [])].map((a) => a.toLowerCase());

    if (value && correctAnswers.includes(value)) {
        input.classList.add("correct");
        input.value = "";
        input.disabled = true;
        feedback.textContent = "✓ Correct! Great analysis.";
        feedback.className = "q-feedback correct";
        state.answeredQuestions.add(qId);
        state.score += q.points;
        updateScoreboard();
        saveState();
        showToast(`✓ Question ${q.num} answered correctly!`, "success");
        document.querySelector(`#qcard-${qId} .btn-submit`).disabled = true;
        document.querySelector(`#qcard-${qId} .btn-submit`).textContent = "✓ Correct";
        document.getElementById(`qcard-${qId}`).classList.add("answered");
        document.querySelector(`#qcard-${qId} .question-status`).setAttribute("aria-label", "Answer accepted");
    } else {
        input.classList.add("incorrect");
        feedback.textContent = "✗ Not quite. Check your findings and try again.";
        feedback.className = "q-feedback incorrect";
        showToast("Incorrect answer. Try again!", "error");
        setTimeout(() => input.classList.remove("incorrect"), 1500);
    }
}

// ---- Scoreboard ----
function updateScoreboard() {const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answeredQuestions.size+'/10');put('questionsCountBadge',state.answeredQuestions.size+'/10');put('progressText',state.answeredQuestions.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answeredQuestions.size*10)+'%';}

function renderFlagTracker() {/* Retired page. */}

// ---- Walkthrough ----
function unlockWalkthrough() {return window.WalkthroughGate.unlock();}

// ---- File Preview ----
const FILE_PREVIEWS = {
    docx: {
        title: "📄 Q3_Campaign_Strategy.docx — Recovered",
        content: `<h3 style="color:var(--danger);text-align:center">PINNACLE CORP — CONFIDENTIAL</h3>
<h4 style="text-align:center">Q3 2026 Campaign Strategy</h4>
<p style="color:var(--text-muted);text-align:center">Prepared by: Riya Sharma (PC-1847) | February 28, 2026</p>
<hr style="border-color:var(--border)">
<h4>1. Overview</h4>
<p>Pinnacle Corp's Q3 2026 campaign will target the 18-34 demographic through social media influencer partnerships and programmatic display advertising across Tier-1 and Tier-2 cities.</p>
<h4>2. Budget Allocation</h4>
<table class="data-table" style="margin:0.5rem 0">
<tr><td>Social Media Advertising</td><td>₹45,00,000</td></tr>
<tr><td>Display Ads (Programmatic)</td><td>₹28,00,000</td></tr>
<tr><td>Influencer Partnerships</td><td>₹32,00,000</td></tr>
<tr><td>Content Production</td><td>₹15,00,000</td></tr>
<tr style="font-weight:bold"><td>TOTAL</td><td>₹1,20,00,000</td></tr>
</table>
<hr style="border-color:var(--border)">
<p style="text-align:center;color:var(--text-muted);font-size:0.75rem;margin-top:1rem"><span class="flag-highlight">Derive from total budget + matching Recycle Bin record</span></p>`,
    },
    pdf: {
        title: "📕 Client_MediaBuy_Rates_2026.pdf — Recovered",
        content: `<h3 style="color:var(--danger);text-align:center">STRICTLY CONFIDENTIAL</h3>
<h4 style="text-align:center">Client Media Buy Rate Card - 2026</h4>
<table class="data-table" style="margin:1rem 0">
<thead><tr><th>Platform</th><th>CPM (₹)</th><th>CPC (₹)</th><th>Min Spend (₹)</th></tr></thead>
<tbody>
<tr><td>Meta (FB/Instagram)</td><td>120</td><td>8.50</td><td>50,000</td></tr>
<tr><td>Google Display</td><td>95</td><td>6.20</td><td>75,000</td></tr>
<tr><td>Instagram Reels</td><td>180</td><td>12.00</td><td>1,00,000</td></tr>
<tr style="background:var(--warning-bg)"><td><strong>YouTube Pre-roll</strong></td><td><strong>210</strong></td><td>15.00</td><td>1,50,000</td></tr>
<tr><td>LinkedIn</td><td>320</td><td>28.00</td><td>2,00,000</td></tr>
<tr><td>Programmatic (DV360)</td><td>85</td><td>5.80</td><td>3,00,000</td></tr>
</tbody></table>
<p style="text-align:center;color:var(--text-muted);font-size:0.7rem;margin-top:1rem">Pinnacle Corp | Internal Use Only<br><span class="flag-highlight">Classification: CONFIDENTIAL | Key row: YouTube Pre-roll</span></p>`,
    },
    png: {
        title: "🖼️ campaign_mockup_v3.png — Recovered + EXIF",
        content: `<div style="background:var(--bg-elevated);padding:1rem;border-radius:8px;text-align:center;margin-bottom:1rem">
<p style="font-size:3rem">🖼️</p>
<p>campaign_mockup_v3.png</p>
<p style="color:var(--text-muted);font-size:0.8rem">1200 × 800 pixels | PNG</p>
</div>
<h4>EXIF Metadata (exiftool output):</h4>
<pre style="background:var(--bg-primary);padding:1rem;border-radius:8px;font-family:var(--font-mono);font-size:0.8rem;color:#c9d1d9">
File Name         : campaign_mockup_v3.png
File Size         : 142 KB
Image Width       : 1200
Image Height      : 800
Bit Depth         : 8
Color Type        : RGB
Artist            : Riya Sharma
Copyright         : Pinnacle Corp 2026
Comment           : <span class="flag-highlight">Derive from dimensions plus Artist metadata</span>
</pre>`,
    },
    xlsx: {
        title: "📊 Competitor_Analysis.xlsx — Recovered",
        content: `<table class="data-table">
<thead><tr><th>Competitor</th><th>Q2 Spend (₹)</th><th>Q3 Est (₹)</th><th>Strategy</th><th style="color:var(--success)">Analyst Note</th></tr></thead>
<tbody>
<tr><td>AdVantage Media</td><td>85,00,000</td><td>92,00,000</td><td>Social + OOH</td><td></td></tr>
<tr style="background:var(--warning-bg)"><td><strong>BrandForce Digital</strong></td><td>1,10,00,000</td><td><strong>1,20,00,000</strong></td><td>Influencer-heavy</td><td></td></tr>
<tr><td>MediaPulse Inc</td><td>65,00,000</td><td>70,00,000</td><td>Programmatic + AI</td><td></td></tr>
<tr><td>CampaignPro</td><td>45,00,000</td><td>55,00,000</td><td>Performance marketing</td><td></td></tr>
<tr><td>NexaReach</td><td>95,00,000</td><td>1,05,00,000</td><td>Video-first</td><td></td></tr>
</tbody></table>
<p style="margin-top:0.5rem;font-size:0.82rem;color:var(--text-muted)">5 competitors total | BrandForce Digital = highest Q3 at ₹1,20,00,000</p>`,
    },
    flagtxt: {
        title: "📝 flag_reminder.txt — Recovered from Recycle Bin",
        content: `<pre style="background:var(--bg-primary);padding:1rem;border-radius:8px;font-family:var(--font-mono);font-size:0.85rem;color:#c9d1d9">Reminder to self:
- Delete all campaign files before leaving
- Make sure cloud upload completed successfully
- Clear browser history
- Empty the Recycle Bin
- Don't forget to remove the WinRAR archive too

This note should be deleted along with everything else.

<span class="flag-highlight">Analyst clue: count files, compare deletion window, classify behavior.</span></pre>`,
    },
    casenotes: {
        title: "📝 case_notes.txt — Live File on Desktop",
        content: `<p style="color:var(--warning);font-size:0.82rem;margin-bottom:0.5rem">⚠️ This file was NOT deleted — Riya forgot to remove it.</p>
<pre style="background:var(--bg-primary);padding:1rem;border-radius:8px;font-family:var(--font-mono);font-size:0.85rem;color:#c9d1d9">Personal Notes — March 14, 2026
================================

Morning:
- Submitted my resignation. Anand didn't even try to talk me out of it.
- 4 years of work and a PIP is all I get? Unbelievable.

Evening (after everyone left):
- Need to make sure everything is cleaned up before I leave.
  The cloud backup should be enough. — R.S.
- Uploaded the important files to my personal drive just in case.
- Compressed the ClientCampaigns folder before uploading.
- Anand won't find anything useful on this machine after I'm done.

<span class="flag-highlight">Derived answer clue: cleanup + cloud backup + R.S.</span></pre>`,
    },
};

function showFilePreview(type) {
    const data = FILE_PREVIEWS[type];
    if (!data) return;
    document.getElementById("modalTitle").textContent = data.title;
    document.getElementById("modalBody").innerHTML = data.content;
    document.getElementById("overlay").classList.add("active");
    document.getElementById("previewModal").classList.add("active");
}

function closePreview() {
    document.getElementById("overlay").classList.remove("active");
    document.getElementById("previewModal").classList.remove("active");
}

// ---- Toast ----
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function convertChromeTimestamp() {
    const input = document.getElementById("chromeTimeInput");
    const output = document.getElementById("chromeTimeOutput");
    if (!input || !output) return;

    const raw = input.value.trim();
    const chromeTime = Number(raw);
    if (!raw || !Number.isFinite(chromeTime)) {
        output.textContent = "Enter a numeric Chrome timestamp.";
        return;
    }

    const unixMs = chromeTime / 1000 - 11644473600000;
    const istMs = unixMs + 5.5 * 60 * 60 * 1000;
    const dt = new Date(istMs);
    const pad = (value) => String(value).padStart(2, "0");
    const formatted = `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} ${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())}`;
    output.textContent = `IST: ${formatted}`;
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    renderQuestions();
    renderFlagTracker();
    updateScoreboard();
    updateEvidenceAccess();
    convertChromeTimestamp();
    if (state.started && state.startTime) startTimer();
});

