const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_08"); } catch (error) {}

// Student hardening v2
const STORAGE_KEY = "dfctf_machine08_balanced_v3";
const QUESTIONS = [
  {
    "id": "Q1",
    "title": "Check that the disk image is unchanged",
    "difficulty": "easy",
    "points": 5,
    "tool": "SHA-256 utility + text viewer",
    "text": "The evidence file is Evidence/Disk/evidence_usb.img. Calculate its SHA-256 hash.\nCompare the full hash with the image entry in Hashes/SHA256SUMS.txt.\nIf they match, submit the first 16 characters of the image hash. Do not hash the ZIP.",
    "format": "<first16_sha256>",
    "hint": "Use sha256sum on the IMG. Copy characters 1–16 from its hash, not from its filename.",
    "isFlag": false,
    "flagName": null,
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py."
    ],
    "procedure": [
      "Calculate the image SHA-256 and compare it with the manifest."
    ],
    "check": "Submit a 16-character hash prefix.",
    "answerHash": "0fb910df5ee5675b3edda33945c978651a7cd493761d7a64fb78449c312e29f2"
  },
  {
    "id": "Q2",
    "title": "Find where the FAT16 partition starts",
    "difficulty": "easy",
    "points": 5,
    "tool": "Sleuth Kit mmls",
    "text": "Run mmls on Evidence/Disk/evidence_usb.img to view its partition table.\nFind the FAT16 row and read the number in its Start column.\nSubmit that sector number. You will use it after -o in later Sleuth Kit commands.",
    "format": "<start_sector>",
    "hint": "Select the FAT16 partition, rather than a metadata or unallocated-space row. Keep the value in sectors.",
    "isFlag": false,
    "flagName": null,
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py."
    ],
    "procedure": [
      "Read the Start sector for the FAT16 partition, excluding metadata and unallocated rows."
    ],
    "check": "Submit a sector number, not a byte offset.",
    "answerHash": "bfa0ec8bdf2946547879d50a68687ea32e2fa628db187357415858b633d194d9"
  },
  {
    "id": "Q3",
    "title": "Find the deleted invoice file entry",
    "difficulty": "easy",
    "points": 5,
    "tool": "Sleuth Kit fls",
    "text": "Use fls to list files inside the image, with the partition start from Q2 after -o.\nLook in DOCS for the deleted CSV invoice. An asterisk (*) marks a deleted entry.\nSubmit the number before its filename and colon: this is its metadata address, used by icat.\nRead the number from the listing; you do not need to calculate it or submit the filename.",
    "format": "<metadata_address>",
    "hint": "Use fls -r -p to include subfolders and paths. The deleted CSV may have its first filename character replaced by _.",
    "isFlag": false,
    "flagName": null,
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py."
    ],
    "procedure": [
      "List the image filesystem and locate the deleted CSV in DOCS."
    ],
    "check": "Do not submit the allocated INV_041.CSV address or a byte offset.",
    "answerHash": "0cce0bd361c46fcde41daebc801da75e21320763dc2b1a5a62d9b28e7c3e1d10"
  },
  {
    "id": "Q4",
    "title": "Find the number of bytes in one cluster",
    "difficulty": "easy",
    "points": 5,
    "tool": "Sleuth Kit fsstat",
    "text": "Run fsstat on the image, using the partition start from Q2 after -o.\nFind the field labelled Cluster Size. A cluster is the unit used to allocate file space.\nSubmit its size in bytes, not the Sector Size. Keep it for the unused-space check in Q8.",
    "format": "<cluster_size_bytes>",
    "hint": "Read the Cluster Size field directly from fsstat; no conversion or arithmetic is needed.",
    "isFlag": false,
    "flagName": null,
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py."
    ],
    "procedure": [
      "Read Cluster Size in fsstat output, or cluster_bytes in the recovery utility output."
    ],
    "check": "Cluster size is different from sector size.",
    "answerHash": "e39eef82f61b21e2e7f762fcc4307358f165757f2e77ec855d6992f7e0191932"
  },
  {
    "id": "Q5",
    "title": "Sleuth Kit: recover and total the invoice",
    "difficulty": "medium",
    "points": 8,
    "tool": "Sleuth Kit icat + sha256sum + CSV viewer/calculator",
    "text": "Use icat -r with the Q3 file address to save the deleted invoice as Working/invoice.csv.\nExport LOGS/LEDGER.CSV too; compare the recovered invoice’s full SHA-256 with its ledger record.\nOpen the invoice. For each of its three rows, multiply quantity by unit_price, then add the results.\nSubmit the invoice_id shown in the file and your total, removing the hyphen from invoice_id.",
    "format": "FLAG{invoice_<invoice_without_hyphen>_<total>}",
    "hint": "Use fls to find the ledger’s own file address. If the hashes match, a calculator is enough for the three item rows.",
    "isFlag": true,
    "flagName": "Recover and validate the invoice",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Export the deleted invoice and allocated ledger to Working.",
      "Match the full invoice hash with the ledger, then sum quantity × unit_price for its data rows."
    ],
    "check": "The recovered invoice must match the ledger; a matching filename alone is insufficient.",
    "answerHash": "62b8576e423cad5063f0f556b3ac578ad8d0ae96976af454bd63b58250e8b2a3"
  },
  {
    "id": "Q6",
    "title": "Find the dispatch bay and photograph time",
    "difficulty": "medium",
    "points": 8,
    "tool": "Supplied carve_lab.py + image viewer",
    "text": "Use carve_lab.py scan/carve to recover a JPEG from unallocated space: disk space not assigned to a file.\nOpen the recovered picture and confirm that its invoice number matches the invoice recovered in Q5.\nRead the bay printed in the picture; use jpeg-info to read DateTimeOriginal and its UTC offset.\nSubmit the bay and UTC time as HHMMSS (hours, minutes, seconds, without colons).",
    "format": "FLAG{photo_<bay>_<hhmmss>}",
    "hint": "The bay is visible in the picture; the time is in EXIF metadata. Reject a broken image or one for a different invoice.",
    "isFlag": true,
    "flagName": "Recover the dispatch photograph",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Scan JPEG candidates and carve a complete candidate from a free region.",
      "Open the image to check the invoice and bay; inspect EXIF for its UTC time."
    ],
    "check": "Reject the allocated image and malformed signature; the carved image must open.",
    "answerHash": "fdce04eaa89f82eea152848bf4369ba3396ed8d00510bd1054dc79045bb012fa"
  },
  {
    "id": "Q7",
    "title": "Autopsy: choose the correct release document",
    "difficulty": "medium",
    "points": 8,
    "tool": "Autopsy + supplied carve_lab.py + PDF viewer",
    "text": "In Autopsy, add the IMG, browse DOCS and export its existing PDF; open it to read its invoice and status.\nUse carve_lab.py scan/carve to recover a complete PDF from unallocated space, then open that PDF too.\nChoose the APPROVED document whose invoice matches Q5 and whose bay matches the Q6 photograph.\nSubmit that document’s invoice identifier and release authorization, removing their hyphens.",
    "format": "FLAG{release_<invoice_without_hyphen>_<authorization_without_hyphen>}",
    "hint": "Compare both PDFs, not just their filenames. The existing DOCS PDF is a comparison record; check invoice, bay and approval status.",
    "isFlag": true,
    "flagName": "Recover the approved release",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Recover and open a complete PDF candidate.",
      "Check APPROVED status and both earlier identifiers before reading its release authorization."
    ],
    "check": "Reject the cancelled allocated document and the incomplete PDF header.",
    "answerHash": "e98d18463b1f9e489c02c7b4975e28a3b274a93958fb69dea2d8bea52ff3cdf5"
  },
  {
    "id": "Q8",
    "title": "Read the key hidden after the session log",
    "difficulty": "medium",
    "points": 8,
    "tool": "Supplied carve_lab.py + strings + wc",
    "text": "Use carve_lab.py list to find LOGS/SESSION.LOG and note its entry_offset.\nUse the helper’s slack command with that offset to save the unused bytes after the log’s end.\nRead the saved slack with strings to find xor_byte, then use wc -c to count the saved bytes.\nSubmit the two hexadecimal key digits and the byte count; keep the key for Q9.",
    "format": "FLAG{slack_<two_hex_key_digits>_<slack_bytes>}",
    "hint": "File slack is unused space at the end of the last cluster. Use entry_offset from the helper, not the fls file address.",
    "isFlag": true,
    "flagName": "Inspect the session log slack",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Read the log size and follow its chain with carve_lab.py list/chain.",
      "Extract its slack, read xor_byte and count the extracted bytes."
    ],
    "check": "Use the final allocated cluster; do not assume adjacent clusters.",
    "answerHash": "ec96b1cd4772b6d869f62880cad0f4b1c59426c0ee57355339efa45fc22ab04f"
  },
  {
    "id": "Q9",
    "title": "Recover the ZIP and read its encoded message",
    "difficulty": "hard",
    "points": 10,
    "tool": "Supplied carve_lab.py + unzip + sha256sum + text viewer",
    "text": "Recover the complete ZIP with carve_lab.py scan/carve; match its SHA-256 with BUNDLE-042 in the Q5 ledger.\nExtract the ZIP, then use the helper’s xor command and Q8 key to decode handoff.xor into handoff.json.\nCompare the decoded hash and byte count with manifest.json; check that invoice_id matches Q5.\nRead stage_id and fragment_tag from the verified JSON and submit them, removing the stage_id hyphen.",
    "format": "FLAG{decode_<stage_without_hyphen>_<fragment_tag>}",
    "hint": "The manifest lists decoded_sha256 and decoded_length. Compare them with sha256sum and wc -c before trusting the message.",
    "isFlag": true,
    "flagName": "Authenticate and decode the archive",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Carve the complete ZIP and verify its ledger digest and archive CRCs.",
      "Extract and XOR-decode the member using Q8.",
      "Verify the decoded hash, length and invoice before reading stage_id and fragment_tag."
    ],
    "check": "A successful unzip alone does not authenticate the recovered archive.",
    "answerHash": "7dbd80b2732826d1d9ec2cdbc4785cc122daba63f4076596408b2c81e9e13c94"
  },
  {
    "id": "Q10",
    "title": "Use the audit log to explain the transfer",
    "difficulty": "hard",
    "points": 10,
    "tool": "Sleuth Kit icat + CSV viewer + calculator",
    "text": "Export LOGS/AUDIT.CSV. Keep rows matching the Q9 stage_id and ZIP hash, with status OK.\nFor those rows, add bytes only where action is SEND; compare the sum with the ZIP’s file size.\nCalculate seconds from the matching STAGE time to the last matching SEND time; ignore failed or unrelated rows.\nSubmit Q5 invoice, Q6 bay, Q9 stage, SEND byte sum and elapsed seconds; remove identifier hyphens.",
    "format": "FLAG{closure_<invoice>_<bay>_<stage>_<sent_bytes>_<elapsed_seconds>}",
    "hint": "A CSV viewer and calculator are enough. Start at STAGE, end at the final successful SEND, and use the exact ZIP hash.",
    "isFlag": true,
    "flagName": "Reconstruct the transfer timeline",
    "preparation": [
      "Start in the folder containing Evidence and carve_lab.py; create Working before exporting."
    ],
    "procedure": [
      "Export the audit and filter by the Q9 stage and exact ZIP digest.",
      "Sum successful SEND bytes and compare with ZIP length.",
      "Calculate final SEND time minus successful STAGE time; check the photo and DELETE ordering."
    ],
    "check": "The closure connects Q5 invoice, Q6 bay and Q9 stage with independent audit analysis.",
    "answerHash": "d3635dbd3e2a5be2186739350c883a612bb0d36f993efcf58dc29041ba69da0c"
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
function renderQuestions(){questionList.innerHTML="";QUESTIONS.forEach(q=>{const done=state.answered.has(q.id),expanded=state.expandedQuestion===q.id;const el=document.createElement('article');el.className='question '+(done?'done ':'')+(expanded?'expanded':'');el.innerHTML='<div class="qhead"><button class="question-toggle" aria-expanded="'+expanded+'" onclick="toggleQuestion(\''+q.id+'\')">'+q.id+' · '+escapeHtml(q.title)+' · '+q.points+' pts</button><span class="question-status '+(done?'is-correct':'is-pending')+'" role="img" aria-label="'+(done?'Answer accepted':'Not answered')+'"><span class="question-status-dot" aria-hidden="true"></span></span><small class="'+q.difficulty+'">'+q.difficulty+'</small></div><div class="qbody"><p>'+escapeHtml(q.text).replace(/\n/g,'<br>')+'</p><div class="answer-format"><strong>Answer format</strong><code>'+escapeHtml(q.format)+'</code></div><div class="qmeta">Tool to be used: '+escapeHtml(q.tool)+'</div><label for="input-'+q.id+'">'+q.id+' answer</label><div class="answer-row"><input id="input-'+q.id+'" autocomplete="off" spellcheck="false" '+((ANSWER_ENTRY_PAUSED || done)?'disabled':'')+' placeholder="'+(done?'Correct answer recorded':'Answer entry is paused')+'"><button onclick="submitAnswer(\''+q.id+'\')" '+((ANSWER_ENTRY_PAUSED || done)?'disabled':'')+'>'+(done?'Correct':'Submit')+'</button></div>'+[q.hint].map((h,i)=>'<details class="progressive-hint"><summary>Hint</summary><p>'+escapeHtml(h)+'</p></details>').join('')+'</div>';questionList.appendChild(el);});}
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
function initBg(){const c=document.getElementById("bg"),x=c.getContext("2d");let p=[];function r(){c.width=innerWidth;c.height=innerHeight;p=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.18+Math.random()*.55,t:Math.random()>.5?"IMG":"CARV"}));}r();addEventListener("resize",r);function d(){x.clearRect(0,0,c.width,c.height);x.font="12px monospace";p.forEach(o=>{x.fillStyle="rgba(251,146,60,.16)";x.fillText(o.t,o.x,o.y);o.x+=o.v;if(o.x>c.width+50){o.x=-50;o.y=Math.random()*c.height;}});requestAnimationFrame(d);}d();}
document.addEventListener("DOMContentLoaded",()=>{initBg();renderQuestions();updateScore();updateEvidence();if(state.started&&state.startTime)startTimer();});
