const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_04"); } catch (error) {}

const STORAGE_KEY = "dfctf_machine04_v3";
const QUESTIONS = [
    {
        "id": "Q1",
        "difficulty": "easy",
        "points": 5,
        "title": "Evidence Integrity Verification",
        "tool": "sha256sum / manifest comparison",
        "flagName": null,
        "text": "Calculate the SHA-256 of Evidence/Disk/signal_lab.vhd.\nCompare the complete digest with Hashes/SHA256SUMS.txt.\nEnter the first 16 hexadecimal characters of the verified digest.",
        "format": "<first_16_sha256_characters>",
        "hint": "Use `sha256sum Evidence/Disk/signal_lab.vhd` and compare with `Hashes/SHA256SUMS.txt`.",
        "answerHash": "53876c304ba6687277ecf633dfd197f1fde3094637a9c3114044c1aa9de47b38",
        "isFlag": false
    },
    {
        "id": "Q2",
        "difficulty": "easy",
        "points": 5,
        "title": "Image Metadata Clue",
        "tool": "ExifTool + xxd hex decode",
        "flagName": "Image Metadata",
        "text": "Inspect the metadata in exhibit_poster.png and verify the artist against contractor_profile.txt.\nDerive the contractor’s initials from the verified full name.\nDecode MetadataTokenHex with xxd -r -p and use the decoded token.",
        "format": "FLAG{metadata_<contractor_initials>_<decoded_token>}",
        "hint": "Pipe the hex token into `xxd -r -p` to convert it into readable text.",
        "answerHash": "76c013f49cb200df44b6f8dedfc9fa277450861ee3166eb9b8ab8b52db9e4a47",
        "isFlag": true
    },
    {
        "id": "Q3",
        "difficulty": "easy",
        "points": 5,
        "title": "Steghide Password Lead",
        "tool": "Analyst note + artifact correlation",
        "flagName": null,
        "text": "Read analyst_note.txt for the botanical channel clue.\nFind channel 03 in passphrase_rotation.csv and match its entry to lobby_photo.bmp.\nEnter the active passphrase for that image.",
        "format": "<active_passphrase>",
        "hint": "The analyst note gives botanical channel 03. Resolve that channel in the passphrase rotation CSV.",
        "answerHash": "608738e4ac086c407df30170a91d0df99790ad277058b64cd8ee0b24cb29dfa3",
        "isFlag": false
    },
    {
        "id": "Q4",
        "difficulty": "easy",
        "points": 5,
        "title": "Image Payload Extraction",
        "tool": "Steghide + payload review",
        "flagName": "Image Payload",
        "text": "Use the passphrase established in Q3 to inspect lobby_photo.bmp and recover its payload.\nRead the Source image and Payload state fields.\nUse the source filename stem, the Q3 passphrase, and the observed payload state.",
        "format": "FLAG{payload_<source_image_stem>_<password>_<payload_state>}",
        "hint": "The appended training payload starts at STEGO_PAYLOAD_START and describes source, password, and opened state.",
        "answerHash": "b39f7798e5ba5774872d2badabaf5a4be37885c9ef23232a8d6f338dfa38a9dd",
        "isFlag": true
    },
    {
        "id": "Q5",
        "difficulty": "medium",
        "points": 8,
        "title": "Pixel LSB Message",
        "tool": "Python LSB helper + script review",
        "flagName": "Pixel LSB",
        "text": "Review the supplied LSB extraction helper and use it on pixel_noise.png.\nRecord the phrase recovered from the pixel data.\nConvert it to lowercase and replace spaces with underscores.",
        "format": "FLAG{lsb_<recovered_phrase_with_underscores>}",
        "hint": "The script reads the least significant bit from every RGB byte and stops at a null byte.",
        "answerHash": "be684a12892b82b3d5e97cdf194529eec33ad254d8bd11fdc0dac05c0e9e0a7f",
        "isFlag": true
    },
    {
        "id": "Q6",
        "difficulty": "medium",
        "points": 8,
        "title": "Spectrogram Phrase",
        "tool": "Sonic Visualizer",
        "flagName": null,
        "text": "Open hidden_broadcast.wav in Sonic Visualizer and add a spectrogram layer.\nRead the phrase displayed in the spectrogram.\nEnter it as seen and retain it for the access-register comparison in Q9.",
        "format": "<spectrogram_phrase_exactly_as_seen>",
        "hint": "In Sonic Visualizer, use a spectrogram layer and increase contrast if the text is faint.",
        "answerHash": "70f53da967e1b2917831ffd3a49ff27021be44c36f379b0db2735f966b9941c7",
        "isFlag": false
    },
    {
        "id": "Q7",
        "difficulty": "medium",
        "points": 8,
        "title": "Audio Validation Marker",
        "tool": "strings / hex editor",
        "flagName": "Audio Marker",
        "text": "Inspect hidden_broadcast.wav in strings or a hex editor and find the Validation clue field.\nUse Q6 and the steganography timeline to corroborate the sequence.\nUse only the validation phrase in the flag, in lowercase with underscores replacing spaces.",
        "format": "FLAG{audio_<validation_phrase_with_underscores>}",
        "hint": "Try `strings Audio/hidden_broadcast.wav | grep -A4 AUDIO_VALIDATION_MARKER`.",
        "answerHash": "0a87d2c156ad1089339566736ff431e0b5e52831197c097bf253e4ddbff17ab2",
        "isFlag": true
    },
    {
        "id": "Q8",
        "difficulty": "medium",
        "points": 8,
        "title": "Reversed Audio Message",
        "tool": "Audacity",
        "flagName": "Reversed Audio",
        "text": "Open reversed_clip.wav in Audacity and select the full track.\nApply Reverse and listen for the recovered clue.\nConvert the clue to lowercase and remove spaces.",
        "format": "FLAG{audio_reversed_<recovered_clue_without_spaces>}",
        "hint": "Use Audacity: select the full track, apply Reverse, then listen for the dock-gate clue.",
        "answerHash": "70329a15575bf5b4a16bafc0a40d91171f1247b71889af04c89b08d973d873b8",
        "isFlag": true
    },
    {
        "id": "Q9",
        "difficulty": "medium",
        "points": 8,
        "title": "Access Register Correlation",
        "tool": "CSV review + evidence correlation",
        "flagName": null,
        "text": "Compare Q6’s location and Q8’s gate with the rows in access_register.csv.\nSelect the single row where both details agree.\nRecord its location, gate, and time in HH:MM.",
        "format": "<meeting_location> | <gate> | <HH:MM>",
        "hint": "Use the location phrase and gate clue recovered earlier to narrow the access register. Watch for rows that look related but do not satisfy both clues.",
        "answerHash": "e84d6ede1fd7fb030c9503741e665355e6ae34902d09d1cd3085783f6dcfb30f",
        "isFlag": false
    },
    {
        "id": "Q10",
        "difficulty": "hard",
        "points": 12,
        "title": "Final Signal Lock",
        "tool": "Evidence correlation",
        "flagName": "Final Signal",
        "text": "Combine the verified Q3 passphrase, Q6 location, Q8 gate, and Q9 time.\nRemove spaces from the location and gate, and remove the colon from the time.\nAssemble those findings in the order shown.",
        "format": "FLAG{signal_<Q3_password>_<Q6_location>_<Q8_gate>_<Q9_time>}",
        "hint": "Build the final flag only after your evidence table links each component to a source artifact.",
        "answerHash": "d4aa99797daeaf6ea40f513668da8a7c259696a4e1ff0f8226f85167aaf2fc0d",
        "isFlag": true
    }
];
let state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;if(!Number.isFinite(state.startTime?.getTime())||state.startTime>Date.now())state.startTime=null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);}catch(e){}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}
function normalizeAnswer(v){return String(v||"").trim().toLowerCase().replace(/\s+/g," ");}
function escapeHtml(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function sha256Hex(text){const data=new TextEncoder().encode(text);const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("");}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");updateEvidence();scrollTo({top:0,behavior:"smooth"});}
function startInvestigation(){if(!state.startTime)state.startTime=new Date();state.started=true;startTimer();save();switchSection("questions");toast("Investigation started. Download evidence and recover derived clues.");}
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
const attempt=state;const q=QUESTIONS.find(x=>x.id===id);const input=document.getElementById(`input-${id}`);const status=document.getElementById(`status-${id}`);const h=await sha256Hex(normalizeAnswer(input.value));if(state!==attempt)return;if(h===q.answerHash){if(!state.answered.has(id)){state.answered.add(id);state.score+=q.points;if(q.isFlag)state.flags.add(q.id);}state.expandedQuestion=id;save();renderQuestions();updateScore();toast(`${id} correct - flag captured`);}else{if(status){status.textContent="Incorrect answer. Re-check the artifact and derived format.";status.className="answer-status bad";}toast("Not quite. Re-check the artifact and derived format.");}}
function updateScore(){const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answered.size+'/10');put('questionsCountBadge',state.answered.size+'/10');put('progressText',state.answered.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answered.size*10)+'%';}
function renderFlags(){/* Retired page. */}
function renderDifficultyBars(){/* Retired page. */}
function unlockEvidence(){/* Retired page. */}
function updateEvidence(){/* Retired page. */}
function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
function toast(m){toastBox.textContent=m;toastBox.classList.add("show");setTimeout(()=>toastBox.classList.remove("show"),2300);}
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:65},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.2+Math.random()*.65,t:Math.random()>.5?"WAV":"PNG"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(34,211,238,.15)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{initBg();renderQuestions();updateScore();updateEvidence();if(state.started&&state.startTime)startTimer();});

