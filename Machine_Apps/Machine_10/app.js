const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_10"); } catch (error) {}

// Vault Breach v2: current evidence and independent attempt namespace.
const STORAGE_KEY="dfctf_machine10_rebuilt_v2";
const QUESTIONS=[
  {
    "id": "Q1",
    "title": "Verify the acquired browser database",
    "difficulty": "easy",
    "points": 5,
    "tool": "Included File Inspector or existing SHA-256 utility",
    "text": "Hash Evidence/Browser/History and compare its complete SHA-256 with Hashes/SHA256SUMS.txt.\nAfter the full values match, submit the first 16 hexadecimal characters.",
    "format": "<first16_sha256>",
    "hint": "History has no filename extension; do not hash history_report.html or the evidence ZIP.",
    "isFlag": false,
    "flagName": null,
    "helpers": [
      {
        "url": "file-inspector.html",
        "name": "File Inspector"
      }
    ],
    "answerHash": "eb4cb0fac6d150b656cd634ee4030e717c1c7c029ea41128ca8ba9442813b5f8"
  },
  {
    "id": "Q2",
    "title": "Recover the completed download ticket",
    "difficulty": "easy",
    "points": 5,
    "tool": "Firefox acquisition report; DB Browser optional",
    "text": "Open Evidence/Browser/history_report.html, exported from the acquired History database.\nFor release_bundle.zip, identify the COMPLETE download on 10 October and read its tab_url.\nWhat release ticket was used for that completed attempt?",
    "format": "<ticket_id>",
    "hint": "The earlier cancelled attempt has the same target filename. Read the ticket parameter of the completed row.",
    "isFlag": false,
    "flagName": null,
    "helpers": [],
    "answerHash": "eb1334a9ba519c52961cd2a58429b0d81619c1bee19fe9f12ce9ee927745ca4f"
  },
  {
    "id": "Q3",
    "title": "Read the approved release code",
    "difficulty": "easy",
    "points": 5,
    "tool": "Browser PDF viewer",
    "text": "Open Evidence/Documents/release_board.pdf and review the decision for 10 October.\nWhat release code belongs to the approved revision, rather than the superseded one?",
    "format": "<release_code>",
    "hint": "Use the Approved release field; keep the release code separate from the revision number.",
    "isFlag": false,
    "flagName": null,
    "helpers": [],
    "answerHash": "84ed276ded4ac274397b9c4004ff99859302f60ec44d492b56268518cea9415b"
  },
  {
    "id": "Q4",
    "title": "Match the current mail handoff",
    "difficulty": "easy",
    "points": 5,
    "tool": "Existing plain text editor or mail viewer",
    "text": "Open the .eml files in Evidence/Mail with a plain text editor so all headers are visible.\nSelect the message matching both the Q2 ticket and Q3 release code.\nWhat is its X-Release-Nonce header value?",
    "format": "<four_digits>",
    "hint": "Custom headers may be hidden in a mail app. Use Open With > Text Editor and read above the blank line in the matching message.",
    "isFlag": false,
    "flagName": null,
    "helpers": [],
    "answerHash": "2790e3f70d0addbe518875959da35896d0654041845942a83fd1974d43c07318"
  },
  {
    "id": "Q5",
    "title": "Unlock and authenticate commercial terms",
    "difficulty": "medium",
    "points": 8,
    "tool": "Archive Manager; File Inspector; browser PDF viewer",
    "text": "Use the current handoff recipe and Q2-Q4 facts to extract Evidence/Vault/release_bundle.zip into Working.\nRead release_manifest.json and authenticate its APPROVED PDF using the complete SHA-256.\nSubmit that PDF’s project code and contract ceiling in INR, without commas.",
    "format": "FLAG{vault_<project_code>_<ceiling_inr>}",
    "hint": "Build the lowercase hyphenated password from release code, numeric ticket suffix and nonce; then reject the superseded PDF.",
    "isFlag": true,
    "flagName": null,
    "helpers": [
      {
        "url": "file-inspector.html",
        "name": "File Inspector"
      }
    ],
    "answerHash": "2f53edf7217a90dc72edf2b395363c9336932aa9bbc7c9f8f03b5c69345e7db5"
  },
  {
    "id": "Q6",
    "title": "Trace the successful attack session",
    "difficulty": "medium",
    "points": 8,
    "tool": "Wireshark or included Packet Reader",
    "text": "Open Evidence/Network/edge_capture.pcap and locate /api/login exchanges.\nIn Wireshark use Find Packet > Packet list > String, or search the path in Packet Reader.\nCompare the paired responses to find repeated rejected svc_portal logins followed by authentication.\nSubmit the session value issued in that successful response's Set-Cookie header.",
    "format": "<session_value>",
    "hint": "Use plain-text String search rather than entering POST /api/login as a display filter. Follow the candidate TCP stream; a 200 response must belong to svc_portal, not another account.",
    "isFlag": false,
    "flagName": null,
    "helpers": [
      {
        "url": "packet-reader.html",
        "name": "Packet Reader"
      }
    ],
    "answerHash": "c84b1f62fa2c70214a99d283513709aecbe90070f41e061b63afcfa25e49527c"
  },
  {
    "id": "Q7",
    "title": "Reconstruct the staging command",
    "difficulty": "medium",
    "points": 8,
    "tool": "Archive Manager; included Event Viewer and Base64 decoder",
    "text": "Extract Evidence/Server/app01_triage.tar into Working and inspect var/log/portal/audit.jsonl.\nTrace the Q6 session through REQUEST_ACCEPTED to its PROCESS_START on boot BOOT-1010-A.\nDecode that event’s command_b64 as text and submit the output archive basename; never execute the command.",
    "format": "<archive_basename>",
    "hint": "Match session, job, parent PID and boot together. A reused PID from another boot is a different process.",
    "isFlag": false,
    "flagName": null,
    "helpers": [
      {
        "url": "event-viewer.html",
        "name": "Event Viewer and decoder"
      }
    ],
    "answerHash": "8a8e2da94b2ad2dc25374246c97d9b8e504b7b01c099a0b2c42ea78f2677ab9d"
  },
  {
    "id": "Q8",
    "title": "Recover the staged network object",
    "difficulty": "medium",
    "points": 8,
    "tool": "Wireshark/Packet Reader; Archive Manager; File Inspector",
    "text": "Recover the successful PCAP download for the Q7 job carried by the Q6 session.\nSave its HTTP response body with Export Objects > HTTP or Packet Reader's Save body.\nExtract the TGZ and compare its PDF's full SHA-256 with the APPROVED entry from Q5.\nSubmit the first 16 SHA-256 characters of the original saved TGZ, not the PDF.",
    "format": "<first16_tgz_sha256>",
    "hint": "Use the matching job and cookie, not filename alone. The HTTP export dialog's Text Filter only narrows its object list; TCP Stream Save As may include headers.",
    "isFlag": false,
    "flagName": null,
    "helpers": [
      {
        "url": "packet-reader.html",
        "name": "Packet Reader"
      },
      {
        "url": "file-inspector.html",
        "name": "File Inspector"
      }
    ],
    "answerHash": "c3cb8c3206baa959fde20344ecd0d155e535436a4546af06cd68283f2c282639"
  },
  {
    "id": "Q9",
    "title": "Prove which external transfer was accepted",
    "difficulty": "hard",
    "points": 10,
    "tool": "Packet Reader or Wireshark; File Inspector; Event Viewer",
    "text": "Find the external /ingest POST whose complete body matches the Q8 .tgz SHA-256.\nCorroborate its request_id and accepted response with Evidence/Server/egress_receipts.jsonl.\nExclude the incomplete failure, duplicate retry and other-content success; submit the accepted object ID and destination IP.",
    "format": "FLAG{exfil_<object_id>_<destination_ip>}",
    "hint": "Export and hash POST request bodies, then pair each with its response. A 201 for another hash and a 409 for the right hash do not establish a new acceptance.",
    "isFlag": true,
    "flagName": null,
    "helpers": [
      {
        "url": "packet-reader.html",
        "name": "Packet Reader"
      },
      {
        "url": "file-inspector.html",
        "name": "File Inspector"
      },
      {
        "url": "event-viewer.html",
        "name": "Event Viewer and decoder"
      }
    ],
    "answerHash": "44514fa10eabd2d5fc0b490815465b849728466d2ba1301ee76026d713e29083"
  },
  {
    "id": "Q10",
    "title": "Close the corrected staging-to-acceptance timeline",
    "difficulty": "hard",
    "points": 10,
    "tool": "Event Viewer; existing calculator; Packet Reader",
    "text": "Match the Q8 archive hash to the completed FILE_CLOSE_WRITE for the Q7 job and retain its file generation.\nCorrect that APP01 time and the Q9 accepted EDGE01 receipt using Evidence/Clock/calibration.json for 10 October.\nMeasure accepted UTC minus completed-staging UTC; corroborate acceptance with capture UTC.\nSubmit the job ID, original generation and positive gap in seconds.",
    "format": "FLAG{closure_<job_id>_<generation>_<gap_seconds>}",
    "hint": "Use observed minus signed offset for each source. Read-close is not staging completion, and a reused pathname/inode with another generation is another object.",
    "isFlag": true,
    "flagName": null,
    "helpers": [
      {
        "url": "event-viewer.html",
        "name": "Event Viewer and decoder"
      },
      {
        "url": "packet-reader.html",
        "name": "Packet Reader"
      }
    ],
    "answerHash": "49534da0655eb6f7b5ca41700c31778717e700914d66f16ecc9407a664bc2243"
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
function renderQuestions(){questionList.innerHTML='';
QUESTIONS.forEach(q=>{
 const done=state.answered.has(q.id),expanded=state.expandedQuestion===q.id;
 const el=document.createElement('article');
 el.className='question '+(done?'done ':'')+(expanded?'expanded':'');
 el.innerHTML=`<div class="qhead"><button class="question-toggle" type="button" aria-expanded="${expanded}" aria-controls="body-${q.id}" onclick="toggleQuestion('${q.id}')">${q.id} · ${escapeHtml(q.title)} · ${q.points} pts</button><span class="question-status ${done?'is-correct':'is-pending'}" aria-label="${done?'Answer accepted':'Not answered'}"><span class="question-status-dot" aria-hidden="true"></span></span><small class="${q.difficulty}">${q.difficulty}</small></div><div class="qbody" id="body-${q.id}"><p>${escapeHtml(q.text).replace(/\n/g,'<br>')}</p><div class="answer-format"><strong>Answer format</strong><code>${escapeHtml(q.format)}</code></div><div class="qmeta">Tool to be used: <strong>${escapeHtml(q.tool)}</strong>${q.helpers.map(h=>'<br><a href="'+h.url+'" target="_blank" rel="noopener">Open '+escapeHtml(h.name)+' ↗</a>').join('')}</div><div class="answer-row"><label class="case-reader-text" for="input-${q.id}">${q.id} answer</label><input id="input-${q.id}" ${(ANSWER_ENTRY_PAUSED || done)?'disabled':''} placeholder="Answer entry is paused" autocomplete="off" onkeydown="if(event.key==='Enter')submitAnswer('${q.id}')"><button onclick="submitAnswer('${q.id}')" ${(ANSWER_ENTRY_PAUSED || done)?'disabled':''}>${done?'Correct':'Submit'}</button></div><details class="progressive-hint"><summary>Hint</summary><p>${escapeHtml(q.hint)}</p></details></div>`;
 questionList.appendChild(el);
});
}
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
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.18+Math.random()*.55,t:Math.random()>.5?"VAULT":"AUDIT"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(250,204,21,.14)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{if(state.started)startTimer();else updateTimer();initBg();renderQuestions();updateScore();updateEvidence();});
/* Reliable elapsed timer */
document.addEventListener("visibilitychange",updateTimer);
if(typeof window!=="undefined"){window.addEventListener("focus",updateTimer);window.addEventListener("pageshow",updateTimer);}
