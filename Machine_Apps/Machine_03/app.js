const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_03"); } catch (error) {}

const STORAGE_KEY = "dfctf_machine03_v2";
const QUESTIONS = [
    {
        "id": "Q1",
        "difficulty": "easy",
        "points": 5,
        "title": "Evidence Integrity Verification",
        "tool": "PowerShell Get-FileHash (Windows) / sha256sum (Linux)",
        "flagName": null,
        "text": "Calculate the SHA-256 of usb_ws221.vhd.\nCompare it with Hashes/SHA256SUMS.txt.\nEnter the first 16 characters.",
        "format": "<first_16_sha256_characters>",
        "hint": "Hash the VHD evidence image and compare the full value with the manifest.",
        "answerHash": "dd792bfff80977cc0247446232570befd3148c9c2e9c611cbc3d30d5fcf65905",
        "isFlag": false
    },
    {
        "id": "Q2",
        "difficulty": "easy",
        "points": 5,
        "title": "USB Device Attribution",
        "tool": "USBRip + USBSTOR",
        "flagName": "USB Attribution",
        "text": "Open the USBRip report and the USBSTOR export.\nWhat are the vendor, product family, and Volume Label?\nDrop the product version. Remove spaces and punctuation from each value.",
        "format": "FLAG{usb_<vendor>_<product_family_without_version>_<volume_label>}",
        "hint": "Use USBRip first, then confirm the same values in USBSTOR_Device_History.txt.",
        "answerHash": "689a162ebda8d4d7e41e3a8e4a546f70af9b1da1a948ac7b424f976b594c4a0c",
        "isFlag": true
    },
    {
        "id": "Q3",
        "difficulty": "easy",
        "points": 5,
        "title": "Serial Corroboration",
        "tool": "USBRip + USBSTOR",
        "flagName": "Serial Corroboration",
        "text": "Find the serial in the USBRip report and the USBSTOR export.\nWhat serial number appears in both?\nKeep every letter and digit.",
        "format": "FLAG{serial_<matching_serial>_confirmed}",
        "hint": "The serial appears in both the USBRip report and the USBSTOR export.",
        "answerHash": "39eaaea7df8ee4890a49ec462ec85af666427ba0b2bd3fc765ab852df7b0f5c2",
        "isFlag": true
    },
    {
        "id": "Q4",
        "difficulty": "easy",
        "points": 5,
        "title": "Copy Activity",
        "tool": "CSV review",
        "flagName": "Copy Activity",
        "text": "Open copy_activity_log.csv and count the rows marked copied.\nInclude the archive copy. Skip the archive-created row.\nEnter the count, category, and Volume Label from Q2. Strip separators from each value.",
        "format": "FLAG{copied_<number_of_copied_rows>_<category>_<Q2_volume_label>}",
        "hint": "Count copied rows, not the archive-created row.",
        "answerHash": "6b25f23b291c73bcbd534bd7d901ecc3db687f04c5a54a9e345420b7e136db2b",
        "isFlag": true
    },
    {
        "id": "Q5",
        "difficulty": "medium",
        "points": 8,
        "title": "Recent File Shortcut Trail",
        "tool": "Autopsy (Text tab)",
        "flagName": "LNK Trail",
        "text": "Find the earliest copied file in copy_activity_log.csv.\nOpen its matching Recent shortcut in Autopsy’s Text tab.\nEnter the Target Path’s drive letter and filename stem with separators removed.\nRead Accessed inside the shortcut and enter the time as HHMM.",
        "format": "FLAG{lnk_<target_drive_letter>_<target_filename_without_extension>_<accessed_HHMM>}",
        "hint": "Use Client_Master_Agreement.lnk and its accessed timestamp.",
        "answerHash": "83fbd5bab19e3764c9c3b0d2b952b9bfaf01631746efc66196fc8e76cd5cf483",
        "isFlag": true
    },
    {
        "id": "Q6",
        "difficulty": "medium",
        "points": 8,
        "title": "Shellbag Folder Access",
        "tool": "Shellbag export",
        "flagName": "ShellBag Access",
        "text": "Open ShellBags_USB_Folders.txt and find the deepest Opened Folder.\nDrop the drive and USB root. Join the remaining folder names with underscores.\nRemove punctuation within folder names. Use Last Explorer View Time as HHMM.",
        "format": "FLAG{shellbag_<remaining_folder_levels_joined_with_underscores>_<view_HHMM>}",
        "hint": "The deepest folder is the most specific opened USB path.",
        "answerHash": "b4f7f66e33042944dd6e7df7c0c30f061607fe3ceac5f1e3f6f7a80a1dde1c70",
        "isFlag": true
    },
    {
        "id": "Q7",
        "difficulty": "medium",
        "points": 8,
        "title": "Connection Window",
        "tool": "USBRip + USBSTOR",
        "flagName": "Connection Window",
        "text": "Find the Q3 serial in usbrip_history.json.\nRead Connected and Disconnected for that session.\nEnter both times in HHMM, dropping seconds.",
        "format": "FLAG{usb_window_<connected_HHMM>_<disconnected_HHMM>}",
        "hint": "Use first connected and last removal/disconnected times.",
        "answerHash": "ac7dff11975baa0abbabc7bef59fb37c1fd299e50161d8929c2522e8ba110667",
        "isFlag": true
    },
    {
        "id": "Q8",
        "difficulty": "medium",
        "points": 8,
        "title": "Archive Staging",
        "tool": "Copy log + 7Z Prefetch-style record",
        "flagName": "Archive Staging",
        "text": "Find the archive-created row in copy_activity_log.csv.\nMatch its archive and time to the tool’s Prefetch-style record.\nFrom the archive name, remove the extension, trailing Archive, and separators.\nUse the creation time as HHMM and the tool name without .EXE.",
        "format": "FLAG{archive_<archive_name_token>_<created_HHMM>_<executable_stem>}",
        "hint": "The archive-created row and 7Z record support the same timestamp and archive.",
        "answerHash": "f8c18705624476bcdae0ba1d20deecde11ed7c02a7c2155141810f7b46b1b485",
        "isFlag": true
    },
    {
        "id": "Q9",
        "difficulty": "medium",
        "points": 8,
        "title": "USB IOC Summary",
        "tool": "IOC correlation",
        "flagName": "USB IOC",
        "text": "Use the vendor and Volume Label from Q2 and the serial from Q3.\nCheck that the deepest copy destination ends in the same folder as Q6.\nUse only that final folder name. Remove separators inside each value.",
        "format": "FLAG{ioc_<Q2_vendor>_<Q3_serial>_<Q2_volume_label>_<deepest_folder_name_only>}",
        "hint": "Use the IOC summary only after validating values against primary artifacts.",
        "answerHash": "55b3318632893ff71aa7cae5fba5c826879ef2fe0b5c94e33f53df0ffb47c4a5",
        "isFlag": true
    },
    {
        "id": "Q10",
        "difficulty": "hard",
        "points": 12,
        "title": "USB Timeline Capstone",
        "tool": "Timeline correlation",
        "flagName": "Timeline Complete",
        "text": "Enter six times in this order: connect, archive creation, first copy,\nshortcut access, folder view, and USB removal.\nUse Q7, Q8, Q4, Q5, Q6, and Q7 respectively.\nUse the recorded local time as HHMM and drop seconds.",
        "format": "FLAG{usbtrail_<Q7_connected_HHMM>_<Q8_created_HHMM>_<Q4_first_copy_HHMM>_<Q5_accessed_HHMM>_<Q6_view_HHMM>_<Q7_disconnected_HHMM>}",
        "hint": "The final flag is a timeline synthesis, not a copied value from timeline_seed.csv.",
        "answerHash": "6614b3ae7ff9cfe07d64a4b386b9fc60289314911db62a4e26d3ed0fd2b8bb62",
        "isFlag": true
    }
];
let state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;if(!Number.isFinite(state.startTime?.getTime())||state.startTime>Date.now())state.startTime=null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);}catch(e){}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}
function normalizeAnswer(v){return String(v||"").trim().toLowerCase().replace(/\s+/g," ");}
function escapeHtml(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function sha256Hex(text){const data=new TextEncoder().encode(normalizeAnswer(text));const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");updateEvidence();scrollTo({top:0,behavior:"smooth"});}
function startInvestigation(){if(!state.startTime)state.startTime=new Date();state.started=true;startTimer();save();switchSection("questions");toast("Investigation started. Download evidence and derive answers from USB artifacts.");}
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
        const feedback = '<div role="status" class="answer-status' + (answered ? ' ok' : '') + '" id="status-' + question.id + '">'
            + (answered ? 'Correct flag captured. Score updated.' : '') + '</div>';
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
async function submitAnswer(id){
    if (ANSWER_ENTRY_PAUSED) return;
const attempt=state;const q=QUESTIONS.find(x=>x.id===id);const input=document.getElementById(`input-${id}`);const status=document.getElementById(`status-${id}`);const h=await sha256Hex(input.value);if(state!==attempt)return;if(h===q.answerHash){if(!state.answered.has(id)){state.answered.add(id);state.score+=q.points;if(q.isFlag)state.flags.add(q.id);}save();renderQuestions();updateScore();toast("Correct flag captured. Score updated.");}else{if(status){status.textContent="Incorrect answer. Re-check the artifact and derived format.";status.className="answer-status bad";}toast("Incorrect. Re-check the evidence and derived format.");}}
function updateScore(){const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answered.size+'/10');put('questionsCountBadge',state.answered.size+'/10');put('progressText',state.answered.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answered.size*10)+'%';}
function renderFlags(){/* Retired page. */}
function renderDifficultyBars(){/* Retired page. */}
function unlockEvidence(){/* Retired page. */}
function updateEvidence(){/* Retired page. */}
function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
function toast(m){toastBox.textContent=m;toastBox.classList.add("show");setTimeout(()=>toastBox.classList.remove("show"),2300);}
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:55},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.25+Math.random()*.65}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(167,139,250,.16)";x.fillText(Math.random()>.5?"USB":"LNK",o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{initBg();renderQuestions();updateScore();updateEvidence();if(state.started&&state.startTime)startTimer();});

