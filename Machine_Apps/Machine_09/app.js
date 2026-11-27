const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_09"); } catch (error) {}

// Student hardening v2
const STORAGE_KEY = "dfctf_machine09_artifacts_v4";
const QUESTIONS = [
  {
    "title": "Verify the evidence database",
    "difficulty": "easy",
    "tool": "Existing SHA-256 utility or included File Inspector",
    "text": "Calculate the SHA-256 of Evidence/Case_Review.sqlite with the File Inspector or your existing hash utility.\nCompare the complete value with its entry in Hashes/SHA256SUMS.txt.\nIf they match, submit the first 16 hash characters.",
    "format": "<first16_sha256>",
    "hint": "Choose SHA-256 and hash the extracted database file, not the ZIP or a CSV export.",
    "id": "Q1",
    "points": 5,
    "isFlag": false,
    "flagName": null,
    "answerHash": "19c00384197060412be276f77f8695f8e41305904187236ca70c362b3a9cf9be"
  },
  {
    "title": "Identify the acquired handset",
    "difficulty": "easy",
    "tool": "Existing DB Browser or Local CSV Reader",
    "text": "Inspect acquisition_register in Case_Review.sqlite, or load Evidence/Tables/acquisition_register.csv in the Local CSV Reader.\nFind the handset recorded as exhibit EV09-H01.\nWhat is its IMEI? Keep all digits exactly as recorded.",
    "format": "<15_digit_imei>",
    "hint": "Filter exhibit to EV09-H01; do not use the second handset or the workstation record.",
    "id": "Q2",
    "points": 5,
    "isFlag": false,
    "flagName": null,
    "answerHash": "3ed4a4685e6405b95492004c0acfb1e762ce1342439e20b5826441b2e5bcf2ca"
  },
  {
    "title": "Check the workstation clock",
    "difficulty": "easy",
    "tool": "Existing DB Browser or Local CSV Reader",
    "text": "In the clock_checks table or Evidence/Tables/clock_checks.csv, find the WS-09 calibration valid on 9 June 2026 at 19:00 UTC.\nWhat is its signed offset_seconds value?\nSubmit the number without a plus sign; the field definition explains how to correct it.",
    "format": "<signed_seconds>",
    "hint": "Read the validity dates before choosing between the two WS-09 calibrations.",
    "id": "Q3",
    "points": 5,
    "isFlag": false,
    "flagName": null,
    "answerHash": "69f59c273b6e669ac32a6dd5e1b2cb63333d8b004f9696447aee2d422ce63763"
  },
  {
    "title": "Establish the document size",
    "difficulty": "easy",
    "tool": "Existing browser - Local CSV Reader",
    "text": "Open the Local CSV Reader from this question and load Evidence/Tables/document_register.csv.\nLocate document DOC-41, the dispatch schedule requested for review.\nWhat is its byte_length? Submit digits only, without a separator or unit.",
    "format": "<bytes>",
    "hint": "Use the document_id rather than picking another record with the same size.",
    "id": "Q4",
    "points": 5,
    "isFlag": false,
    "flagName": null,
    "answerHash": "d12f874987021cd333ba1cff4973abf657227b5742f9dfbf73a1aa09b29aba55"
  },
  {
    "title": "Reconstruct the handset contact",
    "difficulty": "medium",
    "tool": "Firefox acquisition report; text viewer; Calculator (DB Browser optional)",
    "text": "Open Evidence/Phone/acquisition_report.html in Firefox; its source calllog.db is included for independent review.\nSelect the Q2 handset and compare outgoing, positive-duration calls on 9 June from 19:00 up to but excluding 20:00 UTC.\nMatch the strongest peer by total seconds to Evidence/Phone/contacts.vcf.\nSubmit the contact name with underscores and the total connected seconds.",
    "format": "FLAG{contact_<first_last>_<total_seconds>}",
    "hint": "The readable view preserves the raw call dates in UTC. Compare duration rather than frequency, then corroborate the number with the vCard.",
    "id": "Q5",
    "points": 8,
    "isFlag": true,
    "flagName": null,
    "answerHash": "65137098735cf930d918c8bae29fcf9fc63586500d246dabba4a1b91106a8fca"
  },
  {
    "title": "Resolve the entrance from the voice message",
    "difficulty": "medium",
    "tool": "Default browser/audio player; built-in PDF viewer",
    "text": "Listen to Evidence/Phone/VM_1952.wav, the saved follow-up message from the Q5 contact.\nDistinguish the entrance actually used from the cancelled location and wrong vehicle gate.\nCheck Evidence/Maps/entrance_plan.pdf and submit the area_code with the entrance ID.",
    "format": "<area_code>_<entrance_id>",
    "hint": "The speaker corrects an earlier instruction. Match the pedestrian entrance to the plan rather than accepting the first location mentioned.",
    "id": "Q6",
    "points": 8,
    "isFlag": false,
    "flagName": null,
    "answerHash": "20126895187eeebd1edd4e9cb7ec5bd495079693ea6044ab0518e95f064469b0"
  },
  {
    "title": "Recover and authenticate the deleted dispatch PDF",
    "difficulty": "medium",
    "tool": "Default archive manager; browser PDF viewer; included File Inspector",
    "text": "Extract Evidence/Recovery/recycle_export.zip into a Working folder using the archive manager.\nAuthenticate the recovered $R PDF against DOC-41\u2019s complete content_sha256 and Q4 size from document_register.\nOpen only the matching PDF and report its dispatch reference; $I files are metadata, not document content.",
    "format": "<dispatch_reference>",
    "hint": "Two candidates share the same size. Use Open File Inspector to hash each $R file; a plausible filename or visible title alone is not authentication.",
    "id": "Q7",
    "points": 8,
    "isFlag": false,
    "flagName": null,
    "answerHash": "79d78ed2bda19cc0b5d25350f70de120467bb747371b83272cc81e38bf902f3a"
  },
  {
    "title": "Unlock and validate the handoff receipt",
    "difficulty": "medium",
    "tool": "Default archive manager; text viewer or browser",
    "text": "Read Evidence/Recovery/handoff_password_note.txt and unlock handoff.zip using facts from Q5, Q6 and Q7.\nCheck handoff.eml, then authenticate the document hash in journal_receipt.xml against the Q7 PDF.\nSubmit receipt_ref for its FILE_DELETE record in the original file generation; reject CLOSE-only and reused-generation records.",
    "format": "<receipt_reference>",
    "hint": "The ZIP password uses the dispatch reference, the last four digits of the established peer number, and the actual entrance ID, all lowercase.",
    "id": "Q8",
    "points": 8,
    "isFlag": false,
    "flagName": null,
    "answerHash": "7a2ceaa9316dad1cf89be7d9f64b04cb956f2711bef4044dbb604d81747adc24"
  },
  {
    "title": "Establish a corroborated shared-access window",
    "difficulty": "hard",
    "tool": "DB Browser for SQLite or Local CSV Reader; Calculator; browser map",
    "text": "Link the Q2 handset owner and Q5 contact to badges valid on 9 June using acquisition_register, peer_directory and badge_assignments.\nUse GRANTED access_events, correct ACCESS-E timestamps with clock_checks, and find their overlapping visit in Q6\u2019s area_code (not the entrance ID) via site_zones.\nSubmit the area_code and shared UTC window in HHMM; a voice message and common-area access do not prove a face-to-face meeting.",
    "format": "FLAG{overlap_<area_code>_<start_HHMM>_<end_HHMM>}",
    "hint": "Reject expired badges and denied entries. Correct both visits first, then choose the later entry and earlier exit.",
    "id": "Q9",
    "points": 10,
    "isFlag": true,
    "flagName": null,
    "answerHash": "81ab8bcba2f99e682023d1cefdd017df573d96418acb9446cb4f3d763bed2e8f"
  },
  {
    "title": "Measure the post-call deletion gap",
    "difficulty": "hard",
    "tool": "Firefox acquisition report; Local CSV Reader; Calculator (DB Browser optional)",
    "text": "Find the final connected outgoing call to the Q5 contact in the Q2 handset report/log during 19:00\u201320:00 UTC; check its start and duration against the FINAL network record.\nUse the Q7 document hash to establish its file identity, then correct the Q8 receipt deletion time with the Q3 workstation offset.\nMeasure deletion UTC minus call-end UTC and combine the frn, sequence and gap; do not use the Q9 access-window boundary.",
    "format": "FLAG{closure_<frn>_<sequence>_<gap_seconds>}",
    "hint": "The handset log is an independent check on an obsolete network revision. Add call duration before correcting and comparing the deletion timestamp.",
    "id": "Q10",
    "points": 10,
    "isFlag": true,
    "flagName": null,
    "answerHash": "ba68f82d8251a5af42982bd0a107a4a3314de863b44d7eb6c1233d2087c32aff"
  }
];
let state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);}catch(e){}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}catch(error){/* The live timer still works if browser storage is unavailable. */}}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");updateEvidence();scrollTo({top:0,behavior:"smooth"});}
function startInvestigation(){startTimer();switchSection('questions');toast('Investigation started. Open the evidence and begin analysis.');}
function startTimer(){const now=Date.now(),start=state.startTime?new Date(state.startTime).getTime():NaN;if(!Number.isFinite(start)||start>now)state.startTime=new Date(now);state.started=true;if(state.timer==null)state.timer=setInterval(updateTimer,1000);updateTimer();save();}
function updateTimer(){const display=document.getElementById('timerDisplay')||document.getElementById('timer');if(!display)return;const start=state.startTime?new Date(state.startTime).getTime():NaN;const elapsed=Number.isFinite(start)?Math.max(0,Math.floor((Date.now()-start)/1000)):0;display.textContent=[Math.floor(elapsed/3600),Math.floor(elapsed/60)%60,elapsed%60].map(value=>String(value).padStart(2,'0')).join(':');}
function resetMachine(){if(!confirm('Reset this attempt?'))return;if(state.timer!=null)clearInterval(state.timer);state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};try{localStorage.removeItem(STORAGE_KEY);}catch(error){}walkthroughLock.classList.remove('hidden');walkthroughContent.classList.add('hidden');renderQuestions();updateScore();updateEvidence();switchSection('briefing');updateTimer();}
function renderQuestions(){questionList.innerHTML="";QUESTIONS.forEach(q=>{const done=state.answered.has(q.id),expanded=state.expandedQuestion===q.id;const el=document.createElement("article");el.className=`question ${done?'done':''} ${expanded?'expanded':''}`;el.innerHTML=`<div class="qhead"><button class="question-toggle" type="button" aria-expanded="${expanded}" aria-controls="body-${q.id}" onclick="toggleQuestion('${q.id}')">${q.id} · ${escapeHtml(q.title)} · ${q.points} pts</button><span class="question-status ${done?'is-correct':'is-pending'}" aria-label="${done?'Answer accepted':'Not answered'}"><span class="question-status-dot" aria-hidden="true"></span></span><small class="${q.difficulty}">${q.difficulty}</small></div><div class="qbody" id="body-${q.id}"><p>${escapeHtml(q.text).replace(/\n/g,'<br>')}</p><div class="answer-format"><strong>Answer format</strong><code>${escapeHtml(q.format)}</code></div><div class="qmeta">Tool to be used: <strong>${escapeHtml(q.tool)}</strong>${["Q2","Q3","Q4","Q9","Q10"].includes(q.id)?'<br><a href="csv-reader.html" target="_blank" rel="noopener">Open Local CSV Reader ↗</a>':["Q1","Q7"].includes(q.id)?'<br><a href="file-inspector.html" target="_blank" rel="noopener">Open File Inspector ↗</a>':""}</div><div class="answer-row"><label class="case-reader-text" for="input-${q.id}">${q.id} answer</label><input id="input-${q.id}" ${(ANSWER_ENTRY_PAUSED || done)?'disabled':''} placeholder="Answer entry is paused" autocomplete="off" onkeydown="if(event.key==='Enter')submitAnswer('${q.id}')"><button onclick="submitAnswer('${q.id}')" ${(ANSWER_ENTRY_PAUSED || done)?'disabled':''}>${done?'Correct':'Submit'}</button></div><details class="progressive-hint"><summary>Hint</summary><p>${escapeHtml(q.hint)}</p></details></div>`;questionList.appendChild(el);});}
function toggleQuestion(id){state.expandedQuestion=state.expandedQuestion===id?null:id;renderQuestions();}
function toggleHint(e,id){e.stopPropagation();document.getElementById(`hint-${id}`).classList.toggle("visible");}
function normalizeAnswer(value){return String(value||" ").toLowerCase().replace(/\s+/g,"");}
function escapeHtml(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
async function submitAnswer(id){
    if (ANSWER_ENTRY_PAUSED) return;
const attempt=state;const q=QUESTIONS.find(x=>x.id===id);if(!q||state.answered.has(id))return;const v=normalizeAnswer(document.getElementById('input-'+id).value);if(!v){toast('Enter an answer first.');return;}try{const bytes=new TextEncoder().encode(v);const result=await crypto.subtle.digest('SHA-256',bytes);if(state!==attempt)return;const hash=[...new Uint8Array(result)].map(b=>b.toString(16).padStart(2,'0')).join('');if(hash!==q.answerHash){toast('Not quite. Check the evidence again.');return;}if(state.answered.has(id))return;state.answered.add(id);state.score+=q.points;if(q.isFlag)state.flags.add(q.id);save();renderQuestions();updateScore();toast(id+' correct');}catch(e){toast('Answer checking requires a browser with Web Crypto. Try a current browser or localhost.');}}
function updateScore(){const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',state.score);put('questionsBadge',state.answered.size+'/10');put('questionsCountBadge',state.answered.size+'/10');put('progressText',state.answered.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(state.answered.size*10)+'%';}
function renderFlags(){/* Retired page. */}
function renderDifficultyBars(){/* Retired page. */}
function unlockEvidence(){/* Retired page. */}
function updateEvidence(){/* Retired page. */}
function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
function toast(m){toastBox.textContent=m;toastBox.classList.add("show");setTimeout(()=>toastBox.classList.remove("show"),2300);}
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.18+Math.random()*.55,t:Math.random()>.5?"IMEI":"CELL"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(244,114,182,.16)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{if(state.started)startTimer();else updateTimer();initBg();renderQuestions();updateScore();updateEvidence();});
/* Reliable elapsed timer */
document.addEventListener("visibilitychange",updateTimer);
if(typeof window!=="undefined"){window.addEventListener("focus",updateTimer);window.addEventListener("pageshow",updateTimer);}
