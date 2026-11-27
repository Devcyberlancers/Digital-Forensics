const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_07"); } catch (error) {}

// Student hardening v2
const STORAGE_KEY = "dfctf_machine07_v5";
const QUESTIONS = [
  {
    "id": "Q1",
    "title": "Hash the acquisition record",
    "difficulty": "easy",
    "points": 5,
    "tool": "sha256sum / Get-FileHash",
    "text": "Calculate the SHA-256 of Evidence/Acquisition/acquisition.json. Submit only the first 16 hexadecimal characters. See Terminal_Workflows.md, Q1, for the command.",
    "format": "<first_16_sha256_characters>",
    "hint": "Hash the file bytes, not copied text; the complete digest has 64 hexadecimal characters.",
    "hints": [
      "Hash the file bytes, not copied text; the complete digest has 64 hexadecimal characters."
    ],
    "steps": [],
    "isFlag": false,
    "flagName": null,
    "answerHash": "de8c9e9355ef85c74949bba73fd08ed40ea82a9fb79a2ef167fb64850bfce5c7"
  },
  {
    "id": "Q2",
    "title": "Count collection warnings",
    "difficulty": "easy",
    "points": 5,
    "tool": "Text editor or grep / Select-String",
    "text": "Open Evidence/Triage/collection.log. How many lines have severity WARN? Count WARN entries only.",
    "format": "<whole_number>",
    "hint": "Count matching log lines, not words in their descriptions.",
    "hints": [
      "Count matching log lines, not words in their descriptions."
    ],
    "steps": [],
    "isFlag": false,
    "flagName": null,
    "answerHash": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"
  },
  {
    "id": "Q3",
    "title": "Read the binary signature",
    "difficulty": "easy",
    "points": 5,
    "tool": "xxd / Format-Hex",
    "text": "Inspect the first two bytes of Evidence/Recovered/module_header.bin in a hex viewer or terminal. Submit those bytes as four hexadecimal characters without spaces. See Terminal_Workflows.md, Q3.",
    "format": "<four_hex_characters>",
    "hint": "Read the left-hand hexadecimal bytes, not the printable-text column.",
    "hints": [
      "Read the left-hand hexadecimal bytes, not the printable-text column."
    ],
    "steps": [],
    "isFlag": false,
    "flagName": null,
    "answerHash": "137910ec3f0a63cc9df18c11605899a28722f199a4755fd26e3fe56e5f39aa3b"
  },
  {
    "id": "Q4",
    "title": "Follow the surviving branch",
    "difficulty": "easy",
    "points": 5,
    "tool": "Process-tree reading",
    "text": "Open Evidence/ProcessTree/process_tree.txt. Which RUNNING process is directly underneath the exited Downloads launcher? Submit its PID only. Use this child PID for later questions.",
    "format": "<decimal_pid>",
    "hint": "Indentation shows parent-child relationships; the other running instance belongs to a different branch.",
    "hints": [
      "Indentation shows parent-child relationships; the other running instance belongs to a different branch."
    ],
    "steps": [],
    "isFlag": false,
    "flagName": null,
    "answerHash": "7790318535a041bca15b17426d06627a8ccde566a30556d200812c8ba7d790a3"
  },
  {
    "id": "Q5",
    "title": "Reassemble the loader command",
    "difficulty": "medium",
    "points": 8,
    "tool": "Terminal sorting + Base64 decoding",
    "text": "Evidence/Loader/command_fragments.csv contains shuffled Base64 pieces. Sort numerically by part, join data_b64 WITHOUT separators, and decode once. Terminal_Workflows.md, Q5, gives Windows and Kali commands. Confirm the decoded command matches the Q4 child in windows_cmdline.csv. Submit its module entry point (after !) and --session token, lowercased, in the flag.",
    "format": "FLAG{loader_<entrypoint>_<session_token>}",
    "hint": "Restore the fragment order before decoding; the entry point ends at the space before --session.",
    "hints": [
      "Restore the fragment order before decoding; the entry point ends at the space before --session."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Reassemble the loader command",
    "answerHash": "f67a1cd3d4c0f03cacf025894a3fc46525f2667b2a1ae33c312f6c91220d0b38"
  },
  {
    "id": "Q6",
    "title": "Calculate outbound socket traffic",
    "difficulty": "medium",
    "points": 8,
    "tool": "Terminal CSV filtering + aggregation",
    "text": "Identify the Q4 child’s ESTABLISHED remote endpoint in Evidence/Volatility/windows_netscan.csv. In Evidence/Network/socket_events.csv, sum bytes only for SEND rows matching that PID, remote IP and remote port. Use Terminal_Workflows.md, Q6, to filter and total the rows. Include the endpoint and total bytes; replace IP dots with underscores.",
    "format": "FLAG{socket_<ip_with_underscores>_<port>_<total_sent_bytes>}",
    "hint": "Exclude RECV rows, the launcher’s traffic and the child’s other remote address; add the remaining SEND byte counts.",
    "hints": [
      "Exclude RECV rows, the launcher’s traffic and the child’s other remote address; add the remaining SEND byte counts."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Calculate outbound socket traffic",
    "answerHash": "f2344789272aaa8a656b32a12a3a482afa664ea80809cc5cb0df5ecbc8c36d85"
  },
  {
    "id": "Q7",
    "title": "Locate the suspicious memory region",
    "difficulty": "medium",
    "points": 8,
    "tool": "malfind + VAD comparison",
    "text": "For the Q4 child PID, compare Evidence/Volatility/windows_malfind.csv and windows_vadinfo.csv. Which candidate VAD is private_memory=1, has no mapped file (-), and begins with MZ bytes (4D 5A)? Submit its start address, retaining 0x and all leading zeroes. These clues identify the candidate for this exercise; RWX alone does not prove injection.",
    "format": "FLAG{vad_<0x_start_address>}",
    "hint": "Match both PID and VAD start; exclude the JIT region and file-backed system DLLs.",
    "hints": [
      "Match both PID and VAD start; exclude the JIT region and file-backed system DLLs."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Locate the suspicious memory region",
    "answerHash": "29fb2ec1cdf939ad2a78399ccd744c6a1813d00a8ef34e3e3a34d7ec2a7dc8e8"
  },
  {
    "id": "Q8",
    "title": "Decode the selected region",
    "difficulty": "medium",
    "points": 8,
    "tool": "Dump selection + Base64 decoding",
    "text": "Use Evidence/Dumps/dump_index.csv to select the dump matching the PID from Q4 and address from Q7. Open Tools_Guide/decode_config.html in your browser and select that dump. What campaign is recorded? Replace the campaign hyphen with an underscore in the flag.",
    "format": "FLAG{campaign_<campaign_with_underscores>}",
    "hint": "Choose the matching .bin file in the offline decoder; it prints decoded JSON without executing the sample.",
    "hints": [
      "Choose the matching .bin file in the offline decoder; it prints decoded JSON without executing the sample."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Decode the selected region",
    "answerHash": "5ac742b75882f7f5b4df0d7f7f2ea166915621a016a7e1c302e3634be5b21ce0"
  },
  {
    "id": "Q9",
    "title": "Prove the beacon pattern",
    "difficulty": "hard",
    "points": 10,
    "tool": "Decoded configuration + DNS + terminal log analysis",
    "text": "Use Q8’s decoded server, port, uri and sleep_seconds, plus Q6’s endpoint and Q4’s child PID. In Evidence/Network/http_requests.csv, keep only that PID, hostname, resolved IP, port and URI with method POST and status 200; corroborate resolution in dns_cache.csv. Sort by time_utc and calculate BOTH gaps between the three matching requests. Only if both gaps equal the decoded sleep_seconds, submit hostname, verified interval and successful request count. Terminal_Workflows.md, Q9, provides a filtering/timing recipe.",
    "format": "FLAG{beacon_<hostname>_<interval_seconds>_<successful_count>}",
    "hint": "A successful GET, a failed POST and another process’s request are decoys; check both successive gaps, not just one.",
    "hints": [
      "A successful GET, a failed POST and another process’s request are decoys; check both successive gaps, not just one."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Prove the beacon pattern",
    "answerHash": "c2acf4dfde8db907996ba44600cc92045e6f3b4d21377136ab0a6ddfa0d8f42c"
  },
  {
    "id": "Q10",
    "title": "Close the process-to-network chain",
    "difficulty": "hard",
    "points": 10,
    "tool": "Earlier findings + thread-range analysis + timeline arithmetic",
    "text": "Build one closure flag using the child PID from Q4 (easy), session token from Q5 and sent-byte total from Q6 (medium). For your own timeline analysis, use Q7’s VAD bounds in windows_vadinfo.csv to select the child THREAD_START inside that region in Timeline/telemetry.csv; ignore the thread outside it. Then use the child’s PPID in windows_psscan.csv to locate its launcher PROCESS_CREATE in telemetry, and subtract that time from the first child CONNECT time, corroborated by netscan. Include the selected thread time as HHMMSS UTC and the whole-second interval. Terminal_Workflows.md, Q10, explains range/time calculations.",
    "format": "FLAG{closure_<childpid>_<session_token>_<sent_bytes>_<thread_hhmmss>_<elapsed_seconds>}",
    "hint": "Use Q4/Q5/Q6 directly; Q3 is a file signature, not a launcher identity. The thread address must fall inside the Q7 VAD, and elapsed time starts at launcher creation.",
    "hints": [
      "Use Q4/Q5/Q6 directly; Q3 is a file signature, not a launcher identity. The thread address must fall inside the Q7 VAD, and elapsed time starts at launcher creation."
    ],
    "steps": [],
    "isFlag": true,
    "flagName": "Close the process-to-network chain",
    "answerHash": "d3bf94b11a358a2ae817893080dea3c48dacaabdadb7396ba34213a8ef3d4fc7"
  }
];
let state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};
try{const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");state.started=!!s.started;state.startTime=s.startTime?new Date(s.startTime):null;if(!Number.isFinite(state.startTime?.getTime())||state.startTime>Date.now())state.startTime=null;state.score=s.score||0;state.answered=new Set(s.answered||[]);state.flags=new Set(s.flags||[]);}catch(e){}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify({started:state.started,startTime:state.startTime?state.startTime.toISOString():null,score:state.score,answered:[...state.answered],flags:[...state.flags]}));}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>switchSection(t.dataset.section)));
function switchSection(id){document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelector(`[data-section="${id}"]`)?.classList.add("active");updateEvidence();scrollTo({top:0,behavior:"smooth"});}
function startInvestigation(){if(!state.startTime)state.startTime=new Date();state.started=true;startTimer();save();switchSection("questions");toast("Investigation started. Open the evidence and begin analysis.");}
function startTimer(){if(state.timer)return;state.timer=setInterval(updateTimer,1000);updateTimer();}
function updateTimer(){if(!state.startTime){timerDisplay.textContent="00:00:00";return;}const s=Math.max(0,Math.floor((Date.now()-state.startTime)/1000));const h=String(Math.floor(s/3600)).padStart(2,"0"),m=String(Math.floor((s%3600)/60)).padStart(2,"0"),sec=String(s%60).padStart(2,"0");timerDisplay.textContent=`${h}:${m}:${sec}`;}
function resetMachine(){if(!confirm("Reset this attempt?"))return;if(state.timer)clearInterval(state.timer);state={started:false,startTime:null,timer:null,score:0,answered:new Set(),flags:new Set(),evidenceUnlocked:false,expandedQuestion:null};localStorage.removeItem(STORAGE_KEY);walkthroughLock.classList.remove("hidden");walkthroughContent.classList.add("hidden");renderQuestions();updateScore();updateTimer();updateEvidence();switchSection("briefing");}
function renderQuestions(){questionList.innerHTML="";QUESTIONS.forEach(q=>{const done=state.answered.has(q.id),expanded=state.expandedQuestion===q.id;const el=document.createElement('article');el.className='question '+(done?'done ':'')+(expanded?'expanded':'');el.innerHTML='<div class="qhead"><button class="question-toggle" aria-expanded="'+expanded+'" onclick="toggleQuestion(\''+q.id+'\')">'+q.id+' · '+escapeHtml(q.title)+' · '+q.points+' pts</button><span class="question-status '+(done?'is-correct':'is-pending')+'" role="img" aria-label="'+(done?'Answer accepted':'Not answered')+'"><span class="question-status-dot" aria-hidden="true"></span></span><small class="'+q.difficulty+'">'+q.difficulty+'</small></div><div class="qbody"><p>'+escapeHtml(q.text)+'</p><div class="answer-format"><strong>Answer format</strong><code>'+escapeHtml(q.format)+'</code></div><div class="qmeta">Tools: '+escapeHtml(q.tool)+'</div><label for="input-'+q.id+'">'+q.id+' answer</label><div class="answer-row"><input id="input-'+q.id+'" autocomplete="off" spellcheck="false" '+((ANSWER_ENTRY_PAUSED || done)?'disabled':'')+' placeholder="'+(done?'Correct answer recorded':'Answer entry is paused')+'"><button onclick="submitAnswer(\''+q.id+'\')" '+((ANSWER_ENTRY_PAUSED || done)?'disabled':'')+'>'+(done?'Correct':'Submit')+'</button></div>'+q.hints.map((h,i)=>'<details class="progressive-hint"><summary>Hint</summary><p>'+escapeHtml(h)+'</p></details>').join('')+'</div>';questionList.appendChild(el);});}
function toggleQuestion(id){state.expandedQuestion=state.expandedQuestion===id?null:id;renderQuestions();}
function toggleHint(e,id){e.stopPropagation();document.getElementById(`hint-${id}`).classList.toggle("visible");}
function normalizeAnswer(value){return String(value??'').toLowerCase().replace(/\s+/g,'');}
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
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.18+Math.random()*.55,t:Math.random()>.5?"PID":"VAD"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(216,180,254,.16)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{initBg();renderQuestions();updateScore();updateEvidence();if(state.started&&state.startTime)startTimer();});
