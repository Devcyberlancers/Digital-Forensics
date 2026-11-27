'use strict';
const cases = [
  {id:'01',name:'The Deleted Evidence',caseId:'PC-DFIR-2026-0042',topic:'DISK FORENSICS',desc:'Recover deleted files and reconstruct the traces left on a workstation.',group:'disk',color:'#fb7185',keywords:'disk deleted recovery autopsy filesystem'},
  {id:'02',name:'The Phishing Trail',caseId:'APX-DFIR-2026-0108',topic:'EMAIL FORENSICS',desc:'Trace a deceptive message through browser, PowerShell and network artifacts.',group:'network',color:'#22d3ee',keywords:'email phishing powershell browser'},
  {id:'03',name:'The USB Drop',caseId:'ORB-DFIR-2026-0217',topic:'REMOVABLE MEDIA',desc:'Follow a USB device through file copies, shortcuts and access traces.',group:'disk',color:'#a78bfa',keywords:'usb media device copies shellbags'},
  {id:'04',name:'Signal in the Noise',caseId:'SIG-DFIR-2026-0404',topic:'MEDIA FORENSICS',desc:'Uncover concealed clues across images, metadata and audio.',group:'other',color:'#2dd4a0',keywords:'audio image steganography metadata spectrogram'},
  {id:'05',name:'Registry Shadows',caseId:'REG-DFIR-2026-0512',topic:'REGISTRY FORENSICS',desc:'Investigate persistence, removable media and a damaged payload.',group:'disk',color:'#a3e635',keywords:'registry startup persistence usbstor'},
  {id:'06',name:'Packet Storm',caseId:'NET-DFIR-2026-0611',topic:'NETWORK FORENSICS',desc:'Investigate HTTP, DNS, TCP streams and traffic anomalies in Wireshark.',group:'network',color:'#829bff',keywords:'pcap wireshark network packets dns http'},
  {id:'07',name:'Memory Mirage',caseId:'MEM-DFIR-2026-0707',topic:'MEMORY FORENSICS',desc:'Correlate process, memory-region and network traces from an acquired export.',group:'other',color:'#d8b4fe',keywords:'memory volatility process network'},
  {id:'08',name:'Carved Echoes',caseId:'FTK-DFIR-2026-0808',topic:'FILE RECOVERY',desc:'Recover deleted objects and authenticate evidence from a USB image.',group:'disk',color:'#fb923c',keywords:'carving recovery deleted files slack usb'},
  {id:'09',name:'Call Shadows',caseId:'CDR-DFIR-2026-0909',topic:'MOBILE FORENSICS',desc:'Correlate call records, access observations and document history.',group:'other',color:'#f472b6',keywords:'mobile calls phone records timeline'},
  {id:'10',name:'Vault Breach',caseId:'VLT-DFIR-2026-1010',topic:'INTRUSION ANALYSIS',desc:'Follow a protected archive through a remote session and staged transfer.',group:'network',color:'#facc15',keywords:'vault encrypted archive intrusion packets'}
];
const grid=document.getElementById('case-grid');
const search=document.getElementById('search');
const count=document.getElementById('shown-count');
const empty=document.getElementById('empty');
const status=document.getElementById('search-status');
const guide=document.getElementById('guide-dialog');
let selected='all';
function render(){
  const term=search.value.trim().toLowerCase().replace(/\s+/g,' ');
  const numberMatch=term.match(/^(?:(?:machine|case|m)[\s-]*)?0*(\d{1,2})$/);
  const visible=cases.filter(c=>{
    if(selected!=='all'&&selected!==c.group)return false;
    if(numberMatch)return Number(c.id)===Number(numberMatch[1]);
    const searchable=[c.id,Number(c.id),`machine ${c.id}`,`machine ${Number(c.id)}`,c.name,c.caseId,c.topic,c.desc,c.keywords].join(' ').toLowerCase();
    return term.split(' ').every(word=>searchable.includes(word));
  });
  count.textContent=visible.length; empty.hidden=visible.length!==0;
  status.textContent=term||selected!=='all'?`${visible.length} ${visible.length===1?'case':'cases'} found${term?' for “'+search.value.trim()+'”':''}.`:'';
  grid.replaceChildren();
  for(const c of visible){
    const card=document.createElement('article'); card.className='case-card'; card.dataset.machine=c.id; card.style.setProperty('--case-color',c.color);
    card.innerHTML=`<div class="case-art" aria-hidden="true"><img src="Machine_Apps/Machine_${c.id}/forensic-hero.png" alt="" loading="lazy"></div><div class="case-content"><div class="case-top"><span class="machine-id">MACHINE ${c.id}</span><span class="case-topic">${c.topic}</span></div><h3>${c.name}</h3><p class="case-id">${c.caseId}</p><p class="case-desc">${c.desc}</p><div class="case-actions"><a class="case-open" href="Machine_Apps/Machine_${c.id}/index.html">Open investigation</a><a class="case-download" href="Evidence_Bundles/Machine_${c.id}_Student_Evidence_Files.zip" download aria-label="Download evidence for ${c.name}">Download evidence</a></div></div>`;
    grid.appendChild(card);
  }
}
search.addEventListener('input',()=>{
  selected='all';
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter==='all';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  render();
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  selected=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  render();
}));
document.querySelectorAll('[data-open-guide]').forEach(button=>button.addEventListener('click',()=>guide.showModal()));
const matrix=document.getElementById('matrix');
const words=['0101','EVIDENCE','1010','ARTIFACT','0011','ANALYZE','1100','FORENSICS'];
for(let i=0;i<22;i++){
  const column=document.createElement('div');column.className='matrix-column';
  column.style.setProperty('--col',i);column.style.setProperty('--speed',`${24+(i%7)*3}s`);column.style.setProperty('--delay',`${-i*2.7}s`);
  for(let j=0;j<14;j++){const word=document.createElement('span');word.textContent=words[(i*3+j)%words.length];column.appendChild(word);}
  matrix.appendChild(column);
}
render();
