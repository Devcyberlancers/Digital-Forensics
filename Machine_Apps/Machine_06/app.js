const ANSWER_ENTRY_PAUSED = true;

// Remove answer text saved by older releases without clearing progress.
try { localStorage.removeItem("dfctf_recorded_answers_06"); } catch (error) {}

const QUESTIONS = [{"id": "Q1", "title": "Evidence Integrity", "difficulty": "easy", "points": 5, "text": "Calculate the SHA-256 of the supplied Evidence/Disk/packet_storm.vhd image.\nCompare the full digest with the supplied hash manifest.\nEnter the first 16 hexadecimal characters of the verified digest.",
    "format": "<first_16_sha256_characters>", "answerHash": "f2263ba37d54a3a295a19536c7e726b868adbe28e9e9277cda3d52810b33a189"}, {"id": "Q2", "title": "Aurora Victim And Server", "difficulty": "easy", "points": 5, "text": "Open aurora.pcapng and find the first decoded HTTP request between the internal hosts.\nUse the direction of the request to identify the client and server.\nRead the HTTP method and request URI from packet details.",
    "format": "<client_ip> | <server_ip> | <method> | <request_uri>", "answerHash": "dbde0067479e43816cead9f538b6b3d2bb1a3e9dcf7c617acb5b08420fc5047e"}, {"id": "Q3", "title": "Aurora Redirect", "difficulty": "easy", "points": 5, "text": "Return to Aurora’s first HTTP request and find its corresponding response.\nRead the status code and Location header in the decoded HTTP fields.\nConfirm the server address using the response’s source IP.",
    "format": "<status_code> | <Location_uri> | <server_ip>", "answerHash": "ce18b7ca1785eb96060358f352280c6550b57f4a0cb9706ba2a19c47957c682e"}, {"id": "Q4", "title": "Aurora Non-HTTP Channel", "difficulty": "easy", "points": 5, "text": "Open Statistics > Conversations in aurora.pcapng and find the TCP services used by the same two hosts.\nSelect the service other than the earlier web conversation.\nRecord both ports in server/client order and the protocol label Wireshark displays.",
    "format": "<server_port> | <client_port> | <Wireshark_protocol_label>", "answerHash": "d90c8f0c12c792ba19002d596d5de3669a4e670e6e433bfe200a36b96f8483e7"}, {"id": "Q5", "title": "Blaster Command Shell", "difficulty": "medium", "points": 8, "text": "Open blaster.pcap and locate its TCP conversation in Statistics > Conversations.\nUse the service and ephemeral ports to identify the server and client.\nFollow the captured stream and transcribe the observed command as evidence.",
    "format": "<client_ip> | <server_ip> | <server_port> | <full_command>", "answerHash": "576d238aec97362ae10fe78ac1d6be29fdb4c748749658626fd7ca93d7620ff7"}, {"id": "Q6", "title": "DoS SYN Flood", "difficulty": "medium", "points": 8, "text": "Open dosattack.pcap and test whether the repeated traffic consists of SYN packets without ACK set.\nUse the filtered packet count and destination to identify the volume and target.\nInspect the capture for the number of observed ACK responses.",
    "format": "<SYN_only_packet_count> | <target_ip> | <observed_ACK_response_count>", "answerHash": "fe7e6a123b7bdbd216027bc4b501f219c4c667e6c29e9b569701d47df643e5ac"}, {"id": "Q7", "title": "EvilProgram Infected Host", "difficulty": "medium", "points": 8, "text": "Start with DNS in evilprogram.pcap and find which client queried the suspicious update domain.\nNarrow the HTTP view to that host and confirm the executable download request.\nRecord the client IP, queried domain, and request URI.",
    "format": "<client_ip> | <queried_domain> | <download_uri>", "answerHash": "87ff28a0e1497758bfa71cdc2cf33ce2e2f88eb054df6635eb03475911386209"}, {"id": "Q8", "title": "Suspicious Download", "difficulty": "medium", "points": 8, "text": "Find the executable download request in evilprogram.pcap and expand its HTTP fields.\nRead the method and Host header from the request.\nRecord the request URI from that same packet.",
    "format": "<method> | <Host_header> | <request_uri>", "answerHash": "d5ec88df7b765545040cf4a197e0d635e5cf2067186dc14db3705c3003ecf777"}, {"id": "Q9", "title": "Suspicious DNS Domain", "difficulty": "medium", "points": 8, "text": "Find the DNS transaction for the suspicious update domain in evilprogram.pcap.\nMatch the query with its response and expand the answer record.\nRecord the queried name and the IPv4 address in the answer.",
    "format": "<queried_domain> | <resolved_ipv4>", "answerHash": "b899722df18b9fa4366c54df9c61a4a90522d7017c40cfb9ad68fe34c175d475"}, {"id": "Q10", "title": "Packet Storm Timeline Capstone", "difficulty": "hard", "points": 12, "text": "Assemble a six-step timeline using your Aurora, Blaster, DoS, and EvilProgram findings.\nCross-check the redirect status, both service ports, SYN count, suspicious domain, and downloaded filename against your evidence notes.\nEnter the six observations in the stated order.",
    "format": "<redirect_status> | <Aurora_server_port> | <Blaster_server_port> | <SYN_only_count> | <suspicious_domain> | <downloaded_filename>", "answerHash": "58489890a23a7a0df52b9260efb6cd54c4b49225fd0be3b9589c3c9601c30f5c"}];

const normalise = value => value.trim().toLowerCase().replace(/\s+/g, " ");
const hash = async value => {
  const bytes = new TextEncoder().encode(normalise(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

const TOOL_LABELS = {
  Q1: "SHA-256 integrity verification",
  Q2: "Wireshark HTTP analysis",
  Q3: "Wireshark HTTP request / response analysis",
  Q4: "Wireshark TCP Conversations",
  Q5: "Wireshark Follow TCP Stream",
  Q6: "Wireshark TCP flag analysis",
  Q7: "Wireshark DNS and HTTP correlation",
  Q8: "Wireshark HTTP analysis",
  Q9: "Wireshark DNS analysis",
  Q10: "Wireshark correlation timeline"
};
const HINTS = {
  Q1: "Calculate the image hash yourself and compare it with the manifest.",
  Q2: "Start with the first decoded HTTP request in aurora.pcapng.",
  Q3: "Inspect the response paired with Aurora's first request.",
  Q4: "Use Conversations to discover the second TCP service before filtering it.",
  Q5: "Use the single TCP Conversation, then follow that selected stream.",
  Q6: "Test the SYN-only hypothesis, then count the filtered packets.",
  Q7: "Begin with DNS, identify a candidate host, then correlate that host with HTTP.",
  Q8: "Look for an HTTP request whose URI ends in an executable extension.",
  Q9: "Inspect the DNS query and its corresponding answer record.",
  Q10: "Use your recorded observations from the preceding questions in the stated order."
};

let score = 0;
let done = new Set();
let expanded = null;
let timerId = null;
let startTime = null;
const STORAGE_KEY = "dfctf_machine06_attempt_v1";
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  startTime = Number.isFinite(saved.startTime) && saved.startTime <= Date.now() ? saved.startTime : null;
  done = new Set(QUESTIONS.filter(question => saved.answered?.includes(question.id)).map(question => question.id));
  score = QUESTIONS.reduce((total, question) => total + (done.has(question.id) ? question.points : 0), 0);
} catch (error) { /* Keep the in-memory attempt if browser storage is unavailable. */ }
function saveAttempt() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({startTime, answered: [...done]})); } catch (error) {}
}

function toast(message) {
  toastBox.textContent = message;
  toastBox.className = "show";
  setTimeout(() => { toastBox.className = ""; }, 2300);
}

function updateScore() {const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};put('scoreDisplay',score);put('questionsBadge',done.size+'/10');put('questionsCountBadge',done.size+'/10');put('progressText',done.size+' / 10 completed');const bar=document.getElementById('progressBar');if(bar)bar.style.width=(done.size*10)+'%';}


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

function render() {
    questionList.innerHTML = "";
    for (const question of QUESTIONS) {
        const answered = done.has(question.id);
        const open = expanded === question.id;
        const article = document.createElement("article");
        article.className = "question investigation-question" + (answered ? " done" : "") + (open ? " expanded" : "");
        const inputId = 'i_' + question.id;
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
            ${questionDetails(question, TOOL_LABELS[question.id], inputId)}
            <div class="answer-row">
                <input id="${inputId}" aria-describedby="format-${question.id}" placeholder="Answer entry is paused" ${disabled}
                    onkeydown="if (event.key === 'Enter' && !event.repeat) submitAnswer('${question.id}')">
                <button type="button" onclick="submitAnswer('${question.id}')" ${disabled}>${answered ? 'Correct' : 'Submit'}</button>
            </div>
            ${feedback}
            ${questionHint(escapeQuestion(HINTS[question.id]))}
        </div>`;
        questionList.appendChild(article);
    }
}

function toggleQuestion(id) {
  expanded = expanded === id ? null : id;
  render();
}

function showHint(event, id) {
  event.stopPropagation();
  document.getElementById("h_" + id).classList.toggle("visible");
}

async function submitAnswer(id) {
    if (ANSWER_ENTRY_PAUSED) return;

  const question = QUESTIONS.find(item => item.id === id);
  const attempt = done;
  const digest = await hash(document.getElementById("i_" + id).value);
  if (done !== attempt) return;
  if (digest === question.answerHash) {
    if (!done.has(id)) {
      done.add(id);
      score += question.points;
    }
    saveAttempt();
    updateScore();
    render();
    toast("Correct flag captured. Score updated.");
  } else {
    toast("Not quite. Check the packets again.");
  }
}

function switchSection(id) {
  document.querySelectorAll(".section").forEach(section => section.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelector('[data-section="' + id + '"]').classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateTimer() {
  const seconds = startTime ? Math.max(0,Math.floor((Date.now() - startTime) / 1000)) : 0;
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
  const remaining = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = hours + ":" + minutes + ":" + remaining;
  
}

function startInvestigation() {
  if (!startTime) startTime = Date.now();
  if (!timerId) timerId = setInterval(updateTimer, 1000);
  updateTimer();
  saveAttempt();
  switchSection("questions");
  toast("Investigation started. Open the PCAPs in Wireshark.");
}

function resetMachine() {
  if (!confirm("Reset this attempt?")) return;
  score = 0;
  done = new Set();
  expanded = null;
  startTime = null;
  clearInterval(timerId);
  timerId = null;
  updateTimer();
  updateScore();
  render();
  try { localStorage.removeItem(STORAGE_KEY); } catch (error) {}
  switchSection("briefing");
  toast("Investigation reset.");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab").forEach(tab => { tab.onclick = () => switchSection(tab.dataset.section); });
  const evidenceLock = document.getElementById("evidenceLock");
  const evidenceContent = document.getElementById("evidenceContent");
  if (evidenceLock) evidenceLock.remove();
  if (evidenceContent) evidenceContent.classList.remove("hidden");
    const list = document.getElementById("questionList");
  if (list) list.insertAdjacentHTML("beforebegin", "<div class=steps><h2>Wireshark Field Checklist</h2><p><strong>Conversations</strong> shows host and port pairs. A changing high port is usually the client side; a stable lower port is usually the service side. Select a relevant flow before using Follow TCP Stream.</p><p><strong>http</strong> isolates decoded requests and responses; use it to inspect method, URI, status, Location, and Host. <strong>dns</strong> isolates name lookups and answers; use it to connect a domain to a client and resolved address. <strong>ip.addr == candidate_ip</strong> follows a host you have already identified. <strong>tcp.port == N</strong> investigates a service discovered in Conversations. <strong>tcp.flags.syn == 1 && tcp.flags.ack == 0</strong> tests a SYN-only hypothesis.</p><p>Filters narrow an investigative question; they are not answers. See Guides/wireshark_field_checklist.md for the full reference.</p><h2>Cybersecurity Port Quick Reference</h2><table class=info-table><tr><th>Port</th><th>Service</th><th>Why investigate it</th></tr><tr><td>20/21</td><td>FTP</td><td>Clear-text file transfer and credentials.</td></tr><tr><td>22</td><td>SSH</td><td>Remote administration and lateral movement.</td></tr><tr><td>23</td><td>Telnet</td><td>Legacy clear-text remote access.</td></tr><tr><td>25</td><td>SMTP</td><td>Email delivery and phishing evidence.</td></tr><tr><td>53</td><td>DNS</td><td>Maps domains to IPs and can reveal suspicious infrastructure.</td></tr><tr><td>80/443</td><td>HTTP/HTTPS</td><td>Web requests, downloads, headers, and encrypted-web metadata.</td></tr><tr><td>135/139/445</td><td>Windows RPC/SMB</td><td>Windows service and file-share activity.</td></tr><tr><td>3389</td><td>RDP</td><td>Remote desktop access.</td></tr><tr><td>4321</td><td>Custom / unassigned</td><td>Investigate after discovery because it is not decoded as a normal application protocol here.</td></tr><tr><td>4444</td><td>Common test / C2 convention</td><td>Not proof of malware; confirm the selected stream before concluding.</td></tr></table></div>");
  render();
  updateScore();
  if (startTime !== null) timerId = setInterval(updateTimer, 1000);
  updateTimer();
});

function unlockWalkthrough(){return window.WalkthroughGate.unlock();}
