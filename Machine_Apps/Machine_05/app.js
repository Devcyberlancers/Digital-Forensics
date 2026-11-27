const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_05"); } catch (error) {}

const STORAGE_KEY = "dfctf_machine05_v3";
const QUESTIONS = [
    {
        "id": "Q1",
        "difficulty": "easy",
        "points": 5,
        "title": "Evidence Integrity Verification",
        "tool": "sha256sum",
        "hint": "Hash the .img file, then compare the full result with Hashes/SHA256SUMS.txt.",
        "text": "Calculate the SHA-256 of Evidence/Disk/registry_ws512.img.\nCompare the complete result with the matching entry in Hashes/SHA256SUMS.txt.\nEnter the first 16 hexadecimal characters of the verified digest.",
        "format": "<first_16_sha256_characters>",
        "answerHash": "5d7e08fd1a12eebbfc8424b9da54d6e74be9417e420c3139d10fd4b7fe72c70a"
    },
    {
        "id": "Q2",
        "difficulty": "easy",
        "points": 5,
        "title": "Partition Start Sector",
        "tool": "Sleuth Kit mmls",
        "hint": "Run mmls against the disk image and inspect the Start column.",
        "text": "Use mmls to inspect the disk image’s partition table.\nIdentify the active FAT partition and read its Start column.\nRecord that sector for the later Sleuth Kit commands.",
        "format": "<start_sector>",
        "answerHash": "bfa0ec8bdf2946547879d50a68687ea32e2fa628db187357415858b633d194d9"
    },
    {
        "id": "Q3",
        "difficulty": "easy",
        "points": 5,
        "title": "Suspicious Startup Artifact",
        "tool": "Sleuth Kit fls",
        "hint": "Recursively enumerate the partition and preserve full paths with `-p`. The metadata address appears before the filename.",
        "text": "Use fls with the partition offset identified in Q2 to list the filesystem.\nFind the executable-looking file in the user’s autostart directory.\nRecord its filename, parent path, and metadata address.",
        "format": "<filename> | <parent_path> | <metadata_address>",
        "answerHash": "7503ba6a5bf399e3bd5a0d7135e5da9e6a094be57d24e433d060bfd0eaf35906"
    },
    {
        "id": "Q4",
        "difficulty": "easy",
        "points": 5,
        "title": "Filesystem Timestamp",
        "tool": "Sleuth Kit istat",
        "hint": "Use the metadata address shown by fls as the final argument to istat.",
        "text": "Run istat on the metadata address from Q3 using the partition offset.\nIdentify the artifact’s creation timestamp in the filesystem metadata.\nPair it with the same metadata address and the full path from Q3.",
        "format": "YYYY-MM-DD HH:MM:SS | <metadata_address> | <full_path>",
        "answerHash": "17d4ae94f173e624249cce25535be82f4768ab77f6930a23b009e7b6f7ee7505"
    },
    {
        "id": "Q5",
        "difficulty": "medium",
        "points": 8,
        "title": "Startup Directory Validation",
        "tool": "Sleuth Kit icat",
        "hint": "A second file in the same autostart directory records the artifact name, directory context, review status, and local timestamp.",
        "text": "Extract the validation record from the autostart directory identified in Q3.\nUse it to determine the artifact basename and local time for the flag.\nStrip the extension and separators from the basename and write the time as HHMMSS.",
        "format": "FLAG{startup_<artifactbase_normalized>_<hhmmss>}",
        "answerHash": "0f478432ad0a09ccf1071111ac5815da5e48d92fbbb1fdad794bff4430190d20",
        "flagName": "Startup Validation",
        "isFlag": true
    },
    {
        "id": "Q6",
        "difficulty": "medium",
        "points": 8,
        "title": "Registry Run Key",
        "tool": "Sleuth Kit icat + registry export analysis",
        "hint": "Find the user Run key export, then compare the value name with the file path it launches.",
        "text": "Recover the user’s Run key export and identify the relevant value name and target.\nCompare the target’s basename with the Startup artifact.\nRemove spaces, separators, and extensions from the value name and basename.",
        "format": "FLAG{runkey_<valuename_normalized>_<artifactbase_normalized>}",
        "answerHash": "85cd796b73a3e4877b5536d269ec618cbaeacc5790d86c7e5b87ced6f1bb67d5",
        "flagName": "Run Key",
        "isFlag": true
    },
    {
        "id": "Q7",
        "difficulty": "medium",
        "points": 8,
        "title": "RecentDocs Payload Trail",
        "tool": "Sleuth Kit icat + registry export analysis",
        "hint": "Use the MRUList order to decide which entry was most recent; then connect that entry to the Startup payload from earlier questions.",
        "text": "Recover the RecentDocs export and inspect the MRUList.\nFind the token for the most recently used renamed payload and correlate it with the Startup basename.\nRemove separators and extensions from both names.",
        "format": "FLAG{recentdocs_mru_<mru_token>_<renamedpayload_normalized>_<artifactbase_normalized>}",
        "answerHash": "976b87ec7e76dad21c4148bcde350b1bfb5b681ace6d1a9f762d979be25d52f0",
        "flagName": "RecentDocs",
        "isFlag": true
    },
    {
        "id": "Q8",
        "difficulty": "medium",
        "points": 8,
        "title": "USB Registry Correlation",
        "tool": "Sleuth Kit icat + USBSTOR analysis",
        "hint": "In USBSTOR, the key path exposes vendor/product and the values include install and last-connected times.",
        "text": "Recover the USBSTOR export and identify the vendor and product family.\nCompare LastConnected with the RecentDocs and Startup activity to establish their order.\nRemove separators from the vendor/product token and use the LastConnected time as HHMMSS.",
        "format": "FLAG{usb_<vendorproduct_normalized>_<hhmmss>}",
        "answerHash": "88e2ac9af53ceba31169e83397bc3b4b7928e3f7de2d84e715468f7e92d310b6",
        "flagName": "USBSTOR",
        "isFlag": true
    },
    {
        "id": "Q9",
        "difficulty": "hard",
        "points": 10,
        "title": "Extract and Repair the Payload",
        "tool": "Sleuth Kit icat + hex editor",
        "hint": "Extract invoice_cache.bin. Its first four bytes were replaced with zeros; identify the expected archive signature.",
        "text": "Extract the suspicious Startup file from Q3 and inspect its first bytes.\nRepair the damaged archive header on a working copy and use the recovered note to verify the result.\nRecord the expected header token, normalized payload family, and repair status.",
        "format": "FLAG{zip_<header_token>_<payloadfamily_normalized>_<repair_status>}",
        "answerHash": "236f9a96dbdc206b177c883eb454e5fb890ea2c755cc743d2f4f9dd94993b56d",
        "flagName": "Header Repair",
        "isFlag": true
    },
    {
        "id": "Q10",
        "difficulty": "hard",
        "points": 10,
        "title": "Deleted Case Closure",
        "tool": "Sleuth Kit fls/icat + timeline correlation",
        "hint": "Include deleted entries in your fls review and inspect CaseArtifacts.",
        "text": "Search the deleted entries for the closure note and use it to cross-check the Run key, Startup artifact, USB time, and header findings.\nRemove spaces, separators, and extensions inside each component.\nKeep underscores between the flag components and write the USB time as HHMMSS.",
        "format": "FLAG{registry_<persistence>_<artifactbase_normalized>_<usbtime_hhmmss>_<header_token>}",
        "answerHash": "71168f91c51c8e32dd70b5ab0ee86b88f51a63c318d559af5af69bbbba4b6efd",
        "flagName": "Case Closed",
        "isFlag": true
    }
];
let state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;if(!Number.isFinite(state.startTime?.getTime())||state.startTime>Date.now())state.startTime=null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);}catch(e){}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");updateEvidence();scrollTo({top:0,behavior:"smooth"});}
function startInvestigation(){if(!state.startTime)state.startTime=new Date();state.started=true;startTimer();save();switchSection("questions");toast("Investigation started. Analyze the disk image with Sleuth Kit, then recover the registry and hex artifacts.");}
function startTimer(){if(state.timer)return;state.timer=setInterval(updateTimer,1000);updateTimer();}
function updateTimer(){if(!state.startTime){timerDisplay.textContent="00:00:00";return;}const s=Math.max(0,Math.floor((Date.now()-state.startTime)/1000));const h=String(Math.floor(s/3600)).padStart(2,"0"),m=String(Math.floor((s%3600)/60)).padStart(2,"0"),sec=String(s%60).padStart(2,"0");timerDisplay.textContent=`${h}:${m}:${sec}`;}
function resetMachine(){if(!confirm("Reset this attempt?"))return;if(state.timer)clearInterval(state.timer);state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};localStorage.removeItem(STORAGE_KEY);walkthroughLock.classList.remove("hidden");walkthroughContent.classList.add("hidden");renderQuestions();updateScore();updateTimer();updateEvidence();switchSection("briefing");}

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
        const feedback = "";
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
            ${feedback}
            ${questionHint(escapeQuestion(question.hint))}
        </div>`;
        questionList.appendChild(article);
    }
}

function toggleQuestion(id){state.expandedQuestion=state.expandedQuestion===id?null:id;renderQuestions();}
function toggleHint(e,id){e.stopPropagation();document.getElementById(`hint-${id}`).classList.toggle("visible");}
function normalizeAnswer(v){return v.trim().toLowerCase().replace(/\s+/g," ");}
function escapeHtml(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function sha256Text(v){const data=new TextEncoder().encode(normalizeAnswer(v));const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
async function submitAnswer(id){
    if (ANSWER_ENTRY_PAUSED) return;
const attempt=state;const q=QUESTIONS.find(x=>x.id===id);const input=document.getElementById(`input-${id}`);const h=await sha256Text(input.value);if(state!==attempt)return;if(h===q.answerHash){if(!state.answered.has(id)){state.answered.add(id);state.score+=q.points;if(q.isFlag)state.flags.add(q.id);}save();renderQuestions();updateScore();toast("Correct flag captured. Score updated.");}else toast("Not quite. Check the artifact again.");}
function updateScore(){const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answered.size+'/10');put('questionsCountBadge',state.answered.size+'/10');put('progressText',state.answered.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answered.size*10)+'%';}
function renderFlags(){/* Retired page. */}
function renderDifficultyBars(){/* Retired page. */}
function unlockEvidence(){/* Retired page. */}
function updateEvidence(){/* Retired page. */}
function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
function toast(m){toastBox.textContent=m;toastBox.classList.add("show");setTimeout(()=>toastBox.classList.remove("show"),2300);}
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.18+Math.random()*.55,t:Math.random()>.5?"0x4B":"REG"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(132,204,22,.16)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{initBg();renderQuestions();updateScore();updateEvidence();if(state.started&&state.startTime)startTimer();});

