const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_02"); } catch (error) {}

const STORAGE_KEY = "dfctf_machine02_state_hash_v1";
const QUESTIONS = [
  {
    "id": "Q1",
    "difficulty": "easy",
    "points": 5,
    "title": "Evidence Integrity Verification",
    "text": "Hash Evidence/acquisition.json with SHA-256.\nCompare the full digest with Hashes/SHA256SUMS.txt.\nUse the first 16 hexadecimal characters.",
    "format": "<first_16_sha256_characters>",
    "tool": "PowerShell Get-FileHash or sha256sum",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "7b248a0a625009f8b2a706d368939ed1639136d9b6b927f1d5c8beebd442084d",
    "flag": false
  },
  {
    "id": "Q2",
    "difficulty": "easy",
    "points": 5,
    "title": "Lookalike Sender Triage",
    "text": "Compare the message headers with the vendor allowlist.\nIdentify the lookalike domain and SPF, DKIM and DMARC results.",
    "format": "FLAG{<lookalike_domain_root>_spf<result>_dkim<result>_dmarc<result>}",
    "tool": "Autopsy / email header viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "59ff3656c9d960afe6c8a7e6ea1409249eff86c875ae5c6c72ed5d90c9a35e46",
    "flag": true
  },
  {
    "id": "Q3",
    "difficulty": "easy",
    "points": 5,
    "title": "Fake PDF Attachment",
    "text": "Compare the message, browser record and Endpoint/shortcut_metadata.txt.\nIdentify the displayed basename, real extension and target executable.",
    "format": "FLAG{<displayed_basename>_<real_extension>_<target_executable>}",
    "tool": "Autopsy / shortcut and browser artifact viewers",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "d26fcf993de8cb2426754ddc389030823ecaeb4a07cb5d5cf8d62ce20beb5915",
    "flag": true
  },
  {
    "id": "Q4",
    "difficulty": "easy",
    "points": 5,
    "title": "PowerShell Command",
    "text": "Open Endpoint/retrieval_event.txt.\nIdentify the process family, reported retrieval method, script basename and source domain.",
    "format": "FLAG{powershell_<retrieval_method>_<script_basename>_<hosting_domain_root>}",
    "tool": "Autopsy / text viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "8662f782cbe50883d325fb165726736db39b3c9a2e476af6263566a4f2bafd9c",
    "flag": true
  },
  {
    "id": "Q5",
    "difficulty": "medium",
    "points": 8,
    "title": "Downloaded Script",
    "text": "Open Endpoint/script_behavior.txt.\nIdentify the observed script basename, source domain and staging folder.",
    "format": "FLAG{<script_basename>_<hosting_domain_root>_<staging_folder>}",
    "tool": "Text viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "1bea8566e23b8417eac9a2f735c3d20db9b8c41d91183c065d555593beba0fd8",
    "flag": true
  },
  {
    "id": "Q6",
    "difficulty": "medium",
    "points": 8,
    "title": "Uploaded Archive",
    "text": "Find the matching outbound archive transfer in the proxy CSV.\nRecord its HTTP method, archive basename, destination domain and time.",
    "format": "FLAG{<http_method>_<archive_basename>_<destination_domain_root>_<hhmmss>}",
    "tool": "Text viewer / CSV viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "36cb2b8d40633689b5b2987a8ef36bd0e5df4473319478aa6aa92580807611ba",
    "flag": true
  },
  {
    "id": "Q7",
    "difficulty": "medium",
    "points": 8,
    "title": "Browser Download Evidence",
    "text": "Inspect Downloads.json and the Chrome History file.\nCorrelate the browser, source domain, shortcut extension and script basename.",
    "format": "FLAG{<browser>_<hosting_domain_root>_<shortcut_extension>_<script_basename>}",
    "tool": "Chrome artifact viewer / SQLite viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "17638421704b296c3f2861eb24c2c31add235ee2c9b9d06bff94931e01662166",
    "flag": true
  },
  {
    "id": "Q8",
    "difficulty": "medium",
    "points": 8,
    "title": "Persistence Task",
    "text": "Open Endpoint/task_metadata.txt.\nRecord the task name, repeat interval and referenced script basename.",
    "format": "FLAG{task_<task_name>_<interval>_<script_basename>}",
    "tool": "XML viewer / text viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "090dcd6ee741f28efbabec278e06d0dcda9bcb87b3cf76f57961faa3d9ab7ac6",
    "flag": true
  },
  {
    "id": "Q9",
    "difficulty": "medium",
    "points": 8,
    "title": "IOC Collection",
    "text": "Cross-check message headers, DNS, endpoint and proxy evidence.\nIdentify the sender, payload and upload domains and the originating IP.",
    "format": "FLAG{ioc_<sender_domain_root>_<payload_domain_root>_<upload_domain_root>_<originating_ip_digits>}",
    "tool": "Email header viewer / text viewer / CSV viewer",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "2a5ef8d7bd165e6340eff8f866da3c32029da7423ad91dcbf8984c6ba9cc30e8",
    "flag": true
  },
  {
    "id": "Q10",
    "difficulty": "hard",
    "points": 12,
    "title": "Attack Timeline Capstone",
    "text": "Order message delivery, shortcut activity, script retrieval, task activity and archive upload.\nRead the source records and express each time as HHMM.",
    "format": "FLAG{trail_<email_hhmm>_<shortcut_hhmm>_<script_hhmm>_<task_hhmm>_<upload_hhmm>}",
    "tool": "Timeline CSV / artifact viewers",
    "hint": "Use the named evidence record and the answer format above.",
    "answerHash": "fcf6be3ae3266862e10dda4239e9fbadecc04e3e6b82b4941ee41d51d4c23194",
    "flag": true
  }
];
let state = {started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),expandedQuestion:null,evidenceUnlocked:false};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;if(!Number.isFinite(state.startTime?.getTime())||state.startTime>Date.now())state.startTime=null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);if(Object.hasOwn(s,"submittedAnswers"))save();}catch(e){}
function normalizeAnswer(v){return String(v||"").trim().toLowerCase().replace(/\s+/g," ");}
function escapeHtml(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function sha256Hex(v){const data=new TextEncoder().encode(normalizeAnswer(v));const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function startInvestigation(){if(!state.startTime)state.startTime=new Date();state.started=true;startTimer();save();switchSection("questions");toast("Investigation started. Download evidence and begin triage.");}
function startTimer(){if(state.timer)return;state.timer=setInterval(updateTimer,1000);updateTimer();}
function updateTimer(){if(!state.startTime){timer.textContent="00:00:00";return;}const s=Math.max(0,Math.floor((Date.now()-state.startTime)/1000));timer.textContent=`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}
function resetMachine(){if(!confirm("Reset this attempt?"))return;if(state.timer)clearInterval(state.timer);state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),expandedQuestion:null,evidenceUnlocked:false};localStorage.removeItem(STORAGE_KEY);renderQuestions();updateScore();updateTimer();switchSection("briefing");}

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
    questionList.innerHTML = "";
    for (const question of QUESTIONS) {
        const answered = state.answered.has(question.id);
        const open = state.expandedQuestion === question.id;
        const article = document.createElement("article");
        article.className = "question investigation-question" + (answered ? " done" : "") + (open ? " expanded" : "");
        const inputId = 'input-' + question.id;
        const disabled = (ANSWER_ENTRY_PAUSED || answered )? 'disabled' : '';
        article.innerHTML = `<div class="qhead">
            <button type="button" class="question-toggle" aria-expanded="${open}" aria-controls="body-${question.id}"
                onclick="toggleQuestion('${question.id}')">${question.id} · ${escapeQuestion(question.title)} · ${question.points} pts</button>
            <span class="question-status ${answered ? 'is-correct' : 'is-pending'}" role="img" aria-label="${answered ? 'Answer accepted' : 'Not answered'}">
                <span class="question-status-dot" aria-hidden="true"></span>
            </span>
            <small class="question-difficulty ${question.difficulty}">${question.difficulty}</small>
        </div>
        <div class="qbody" id="body-${question.id}">
            ${questionDetails(question, question.tool, inputId)}
            <div class="answer-row">
                <input id="${inputId}" aria-describedby="format-${question.id}" placeholder="Answer entry is paused" ${disabled}
                    onkeydown="if (event.key === 'Enter' && !event.repeat) submitAnswer('${question.id}')">
                <button type="button" onclick="submitAnswer('${question.id}')" ${disabled}>${answered ? 'Correct' : 'Submit'}</button>
            </div>
            ${questionHint(escapeQuestion(question.hint))}
        </div>`;
        questionList.appendChild(article);
    }
}

function toggleQuestion(id){state.expandedQuestion=state.expandedQuestion===id?null:id;renderQuestions();}
async function submitAnswer(id){
    if (ANSWER_ENTRY_PAUSED) return;
const attempt=state;const q=QUESTIONS.find(x=>x.id===id);const value=document.getElementById(`input-${id}`).value;const digest=await sha256Hex(value);if(state!==attempt)return;if(digest===q.answerHash){if(!state.answered.has(id)){state.answered.add(id);state.score+=q.points;if(q.flag)state.flags.add(id);}save();renderQuestions();updateScore();toast("Correct flag captured. Score updated.");}else toast("Incorrect. Recheck the evidence and derived format.");}
function updateScore(){const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answered.size+'/10');put('questionsCountBadge',state.answered.size+'/10');put('progressText',state.answered.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answered.size*10)+'%';}
function renderFlags(){/* Retired page. */}
function unlockEvidence(){/* Retired page. */}
function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
function toast(msg){toastBox.textContent=msg;toastBox.classList.add("show");setTimeout(()=>toastBox.classList.remove("show"),2400);}
function initBackground(){const c=document.getElementById("bg"),x=c.getContext("2d");let bits=[];function resize(){c.width=innerWidth;c.height=innerHeight;bits=Array.from({length:75},()=>({x:Math.random()*c.width,y:Math.random()*c.height,v:.25+Math.random()*.65,t:Math.random()>.5?"MAIL":"URL"}));}resize();addEventListener("resize",resize);function draw(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";bits.forEach(p=>{x.fillStyle="rgba(34,211,238,.16)";x.fillText(p.t,p.x,p.y);p.x+=p.v;if(p.x>c.width+40){p.x=-40;p.y=Math.random()*c.height;}});requestAnimationFrame(draw);}draw();}
document.addEventListener("DOMContentLoaded",()=>{initBackground();renderQuestions();updateScore();if(state.started&&state.startTime)startTimer();});

