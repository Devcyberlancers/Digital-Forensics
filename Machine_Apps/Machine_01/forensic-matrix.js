/* Decorative, case-specific background. No evidence or answer values. */
(() => {
  'use strict';
  const cases = {
    '01': ['EVIDENCE', 'RECOVER', 'DELETED'],
    '02': ['PHISHING', 'EMAIL', 'HEADER'],
    '03': ['USB', 'DEVICE', 'COPY'],
    '04': ['SIGNAL', 'AUDIO', 'IMAGE'],
    '05': ['REGISTRY', 'STARTUP', 'KEY'],
    '06': ['PACKET', 'NETWORK', 'PCAP'],
    '07': ['MEMORY', 'PROCESS', 'TRACE'],
    '08': ['CARVING', 'RECOVER', 'DISK'],
    '09': ['CALL', 'DEVICE', 'RECORD'],
    '10': ['VAULT', 'ARCHIVE', 'TRANSFER']
  };
  const id = document.body.dataset.machine || '01';
  const words = cases[id];
  if (!words || document.querySelector('.forensic-matrix')) return;
  const layer = document.createElement('div');
  layer.className = 'forensic-matrix';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 24; i++) {
    const column = document.createElement('span');
    column.className = 'forensic-matrix-column';
    column.style.setProperty('--column', i);
    column.style.setProperty('--delay', (-i * 1.71) + 's');
    column.style.setProperty('--duration', (22 + (i % 6) * 3) + 's');
    for (let j = 0; j < 12; j++) {
      const word = document.createElement('span');
      word.textContent = words[(i + j) % words.length];
      column.appendChild(word);
    }
    layer.appendChild(column);
  }
  document.body.insertBefore(layer, document.body.firstChild);
})();
