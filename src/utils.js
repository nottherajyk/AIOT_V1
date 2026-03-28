export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function downloadBlob(blob, filename) {
  // Use file-saver if available, otherwise manual approach with delayed revoke
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // Delay cleanup so the browser has time to start the download with the correct filename
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadDataURL(dataURL, filename) {
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 1000);
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

export function renderDropZone(id, accept, label = 'Drop your file here or click to browse') {
  return `
    <div class="drop-zone" id="${id}">
      <div class="drop-zone-icon">📁</div>
      <h3>${label}</h3>
      <p>Supports ${accept.toUpperCase()} files</p>
      <input type="file" accept="${accept}" id="${id}Input" />
    </div>`;
}

export function renderMultiDropZone(id, accept, label = 'Drop your files here or click to browse') {
  return `
    <div class="drop-zone" id="${id}">
      <div class="drop-zone-icon">📁</div>
      <h3>${label}</h3>
      <p>Supports ${accept.toUpperCase()} files — Multiple files allowed</p>
      <input type="file" accept="${accept}" id="${id}Input" multiple />
    </div>`;
}

export function setupDropZone(zoneId, inputId, onFile) {
  window.addEventListener('page-rendered', () => {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    if (!zone || !input) return;

    ['dragover', 'dragenter'].forEach(e => zone.addEventListener(e, (ev) => { ev.preventDefault(); zone.classList.add('drag-over'); }));
    ['dragleave', 'drop'].forEach(e => zone.addEventListener(e, () => zone.classList.remove('drag-over')));
    zone.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files.length) onFile(e.dataTransfer.files); });
    input.addEventListener('change', () => { if (input.files.length) onFile(input.files); });
  });
}
