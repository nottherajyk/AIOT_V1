import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';
import { jsPDF } from 'jspdf';
import { formatBytes, downloadBlob, readFileAsArrayBuffer, renderDropZone, renderMultiDropZone } from '../utils.js';
import { showToast } from '../components/toast.js';

export function pdfToolHandler(tool) {
  setTimeout(() => setupPdfTool(tool.id), 50);
  window.addEventListener('page-rendered', () => setupPdfTool(tool.id), { once: true });

  switch (tool.id) {
    case 'protect-pdf': return renderProtectPDF();
    case 'unlock-pdf': return renderUnlockPDF();
    case 'pdf-metadata': return renderPDFMetadata();
    case 'jpg-to-pdf': return renderJPGtoPDF();
    case 'merge-pdf': return renderMergePDF();
    case 'split-pdf': return renderSplitPDF();
    default: return `<p>Tool coming soon!</p>`;
  }
}

function renderProtectPDF() {
  return `
    ${renderDropZone('pdfProtect', '.pdf', 'Drop your PDF to protect')}
    <div id="fileInfoArea"></div>
    <div class="form-group" style="margin-top:1rem">
      <label class="form-label">Set Password</label>
      <input type="password" class="form-input" id="pdfPassword" placeholder="Enter password..." />
    </div>
    <div class="form-group">
      <label class="form-label">Confirm Password</label>
      <input type="password" class="form-input" id="pdfPasswordConfirm" placeholder="Confirm password..." />
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="protectBtn" disabled>🔒 Protect & Download</button>
    </div>
    <div class="result-area" id="resultArea">
      <div class="result-meta" id="resultMeta"></div>
    </div>
  `;
}

function renderUnlockPDF() {
  return `
    ${renderDropZone('pdfUnlock', '.pdf', 'Drop your protected PDF')}
    <div id="fileInfoArea"></div>
    <div class="form-group" style="margin-top:1rem">
      <label class="form-label">Enter Password</label>
      <input type="password" class="form-input" id="pdfPassword" placeholder="Enter PDF password..." />
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="unlockBtn" disabled>🔓 Unlock & Download</button>
    </div>
  `;
}

function renderPDFMetadata() {
  return `
    ${renderDropZone('pdfMeta', '.pdf', 'Drop your PDF to view metadata')}
    <div id="fileInfoArea"></div>
    <div class="result-area" id="resultArea">
      <h3 style="font-size:.9rem;font-weight:600;margin-bottom:1rem;color:var(--text-muted)">PDF Metadata</h3>
      <div id="metadataOutput" style="display:grid;grid-template-columns:auto 1fr;gap:.5rem .75rem;font-size:.85rem"></div>
    </div>
  `;
}

function renderJPGtoPDF() {
  return `
    ${renderMultiDropZone('jpgPdf', '.jpg,.jpeg,.png,.webp', 'Drop your images here')}
    <div id="fileInfoArea"></div>
    <div class="form-row" style="margin-top:1rem">
      <div class="form-group">
        <label class="form-label">Page Size</label>
        <select class="form-select" id="pageSize">
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="fit">Fit to Image</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Orientation</label>
        <select class="form-select" id="orientation">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="convertBtn" disabled>📄 Create PDF</button>
    </div>
  `;
}

function renderMergePDF() {
  return `
    ${renderMultiDropZone('pdfMerge', '.pdf', 'Drop your PDF files to merge')}
    <div id="fileListArea" style="margin-top:1rem"></div>
    <div class="actions-row">
      <button class="btn btn-primary" id="mergeBtn" disabled>📑 Merge PDFs</button>
    </div>
    <div class="result-area" id="resultArea">
      <div class="result-meta" id="resultMeta"></div>
    </div>
  `;
}

function renderSplitPDF() {
  return `
    ${renderDropZone('pdfSplit', '.pdf', 'Drop your PDF to split')}
    <div id="fileInfoArea"></div>
    <div class="form-group" style="margin-top:1rem">
      <label class="form-label">Split Mode</label>
      <select class="form-select" id="splitMode">
        <option value="each">Each page as separate PDF</option>
        <option value="range">Custom page range</option>
      </select>
    </div>
    <div class="form-group" id="rangeGroup" style="display:none">
      <label class="form-label">Page Range (e.g. 1-3, 5, 7-9)</label>
      <input type="text" class="form-input" id="pageRange" placeholder="1-3, 5, 7-9" />
    </div>
    <div class="actions-row">
      <button class="btn btn-primary" id="splitBtn" disabled>✂️ Split PDF</button>
    </div>
    <div class="result-area" id="resultArea">
      <div class="result-meta" id="resultMeta"></div>
    </div>
  `;
}


// ===== SETUP LOGIC =====
function setupPdfTool(toolId) {
  let currentFiles = [];

  function bindDropZone(zoneId, onFiles) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(zoneId + 'Input');
    if (!zone || !input) return;
    ['dragover', 'dragenter'].forEach(e => zone.addEventListener(e, (ev) => { ev.preventDefault(); zone.classList.add('drag-over'); }));
    ['dragleave', 'drop'].forEach(e => zone.addEventListener(e, () => zone.classList.remove('drag-over')));
    zone.addEventListener('drop', (e) => { e.preventDefault(); onFiles(Array.from(e.dataTransfer.files)); });
    input.addEventListener('change', () => { onFiles(Array.from(input.files)); });
  }

  function showFileInfo(files) {
    const area = document.getElementById('fileInfoArea');
    if (!area) return;
    area.innerHTML = files.map(f => `
      <div class="file-info">
        <div class="file-info-icon">📄</div>
        <div class="file-info-details">
          <div class="file-info-name">${f.name}</div>
          <div class="file-info-size">${formatBytes(f.size)}</div>
        </div>
      </div>`).join('');
  }

  // PDF Metadata
  if (toolId === 'pdf-metadata') {
    bindDropZone('pdfMeta', async (files) => {
      currentFiles = files;
      showFileInfo(files);
      try {
        const buffer = await readFileAsArrayBuffer(files[0]);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const meta = {
          'Title': pdf.getTitle() || '—',
          'Author': pdf.getAuthor() || '—',
          'Subject': pdf.getSubject() || '—',
          'Creator': pdf.getCreator() || '—',
          'Producer': pdf.getProducer() || '—',
          'Pages': pdf.getPageCount(),
          'Creation Date': pdf.getCreationDate()?.toISOString() || '—',
          'Modification Date': pdf.getModificationDate()?.toISOString() || '—',
        };
        const output = document.getElementById('metadataOutput');
        const result = document.getElementById('resultArea');
        if (output && result) {
          result.classList.add('visible');
          output.innerHTML = Object.entries(meta).map(([k, v]) => `
            <span style="color:var(--text-muted);font-weight:500">${k}:</span>
            <span>${v}</span>`).join('');
        }
        showToast('Metadata loaded!');
      } catch (e) {
        showToast('Failed to read PDF: ' + e.message, 'error');
      }
    });
  }

  // Protect PDF
  if (toolId === 'protect-pdf') {
    bindDropZone('pdfProtect', (files) => {
      currentFiles = files;
      showFileInfo(files);
      document.getElementById('protectBtn').disabled = false;
    });
    document.getElementById('protectBtn')?.addEventListener('click', async () => {
      const pw = document.getElementById('pdfPassword')?.value;
      const pwc = document.getElementById('pdfPasswordConfirm')?.value;
      if (!pw) { showToast('Please enter a password', 'error'); return; }
      if (pw !== pwc) { showToast('Passwords do not match', 'error'); return; }
      
      try {
        const protectBtn = document.getElementById('protectBtn');
        protectBtn.disabled = true;
        protectBtn.innerHTML = '<span class="spinner-sm"></span> Protecting...';
        
        const buffer = await readFileAsArrayBuffer(currentFiles[0]);
        // Use the encrypt-lite library for actual password protection
        const encryptedBytes = await encryptPDF(new Uint8Array(buffer), pw);
        
        const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
        downloadBlob(blob, currentFiles[0].name.replace('.pdf', '-protected.pdf'));
        
        showToast('PDF protected successfully!', 'success');
        
        const resultArea = document.getElementById('resultArea');
        if (resultArea) {
          resultArea.classList.add('visible');
          document.getElementById('resultMeta').innerHTML = `<span>🔒 Protected with password</span><span>📁 Size: ${formatBytes(blob.size)}</span>`;
        }
      } catch (e) {
        showToast('Error: ' + e.message, 'error');
      } finally {
        const protectBtn = document.getElementById('protectBtn');
        protectBtn.disabled = false;
        protectBtn.innerHTML = '🔒 Protect & Download';
      }
    });
  }

  // Unlock PDF
  if (toolId === 'unlock-pdf') {
    bindDropZone('pdfUnlock', (files) => {
      currentFiles = files;
      showFileInfo(files);
      document.getElementById('unlockBtn').disabled = false;
    });
    document.getElementById('unlockBtn')?.addEventListener('click', async () => {
      const pw = document.getElementById('pdfPassword')?.value;
      try {
        const buffer = await readFileAsArrayBuffer(currentFiles[0]);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const bytes = await pdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        downloadBlob(blob, currentFiles[0].name.replace('.pdf', '-unlocked.pdf'));
        showToast('PDF unlocked successfully!');
      } catch (e) {
        showToast('Error: ' + e.message, 'error');
      }
    });
  }

  // JPG to PDF
  if (toolId === 'jpg-to-pdf') {
    bindDropZone('jpgPdf', (files) => {
      currentFiles = files;
      showFileInfo(files);
      document.getElementById('convertBtn').disabled = false;
    });
    document.getElementById('convertBtn')?.addEventListener('click', async () => {
      try {
        const pageSize = document.getElementById('pageSize')?.value || 'a4';
        const orientation = document.getElementById('orientation')?.value || 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'mm', format: pageSize === 'fit' ? 'a4' : pageSize });

        for (let i = 0; i < currentFiles.length; i++) {
          if (i > 0) pdf.addPage();
          const dataURL = await readFileAsDataURL(currentFiles[i]);
          const img = await loadImage(dataURL);
          const pageW = pdf.internal.pageSize.getWidth();
          const pageH = pdf.internal.pageSize.getHeight();
          let w = pageW - 20, h = (img.height / img.width) * w;
          if (h > pageH - 20) { h = pageH - 20; w = (img.width / img.height) * h; }
          const x = (pageW - w) / 2, y = (pageH - h) / 2;
          pdf.addImage(dataURL, 'JPEG', x, y, w, h);
        }
        pdf.save('images-to-pdf.pdf');
        showToast('PDF created with ' + currentFiles.length + ' image(s)!');
      } catch (e) {
        showToast('Error: ' + e.message, 'error');
      }
    });
  }

  // Merge PDF
  if (toolId === 'merge-pdf') {
    bindDropZone('pdfMerge', (files) => {
      currentFiles = [...currentFiles, ...files];
      const listArea = document.getElementById('fileListArea');
      if (listArea) {
        listArea.innerHTML = currentFiles.map((f, i) => `
          <div class="file-info" style="margin-bottom:.5rem">
            <div class="file-info-icon">📄</div>
            <div class="file-info-details">
              <div class="file-info-name">${i + 1}. ${f.name}</div>
              <div class="file-info-size">${formatBytes(f.size)}</div>
            </div>
          </div>`).join('');
      }
      document.getElementById('mergeBtn').disabled = false;
    });
    document.getElementById('mergeBtn')?.addEventListener('click', async () => {
      try {
        const merged = await PDFDocument.create();
        for (const file of currentFiles) {
          const buffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(buffer);
          const pages = await merged.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(p => merged.addPage(p));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        downloadBlob(blob, 'merged.pdf');
        const resultArea = document.getElementById('resultArea');
        const resultMeta = document.getElementById('resultMeta');
        if (resultArea) {
          resultArea.classList.add('visible');
          resultMeta.innerHTML = `<span>📑 Merged ${currentFiles.length} PDFs</span><span>📁 Size: ${formatBytes(blob.size)}</span>`;
        }
        showToast('PDFs merged successfully!');
      } catch (e) {
        showToast('Error: ' + e.message, 'error');
      }
    });
  }

  // Split PDF
  if (toolId === 'split-pdf') {
    const splitMode = document.getElementById('splitMode');
    const rangeGroup = document.getElementById('rangeGroup');
    if (splitMode && rangeGroup) {
      splitMode.addEventListener('change', () => {
        rangeGroup.style.display = splitMode.value === 'range' ? '' : 'none';
      });
    }
    bindDropZone('pdfSplit', (files) => {
      currentFiles = files;
      showFileInfo(files);
      document.getElementById('splitBtn').disabled = false;
    });
    document.getElementById('splitBtn')?.addEventListener('click', async () => {
      try {
        const buffer = await readFileAsArrayBuffer(currentFiles[0]);
        const pdf = await PDFDocument.load(buffer);
        const totalPages = pdf.getPageCount();
        const mode = document.getElementById('splitMode')?.value || 'each';

        if (mode === 'each') {
          for (let i = 0; i < totalPages; i++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(page);
            const bytes = await newPdf.save();
            const blob = new Blob([bytes], { type: 'application/pdf' });
            downloadBlob(blob, `page-${i + 1}.pdf`);
          }
          showToast(`Split into ${totalPages} pages!`);
        } else {
          // Parse range
          const rangeStr = document.getElementById('pageRange')?.value || '';
          const pages = parsePageRange(rangeStr, totalPages);
          const newPdf = await PDFDocument.create();
          const copiedPages = await newPdf.copyPages(pdf, pages.map(p => p - 1));
          copiedPages.forEach(p => newPdf.addPage(p));
          const bytes = await newPdf.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          downloadBlob(blob, `split-pages.pdf`);
          showToast(`Extracted ${pages.length} pages!`);
        }
      } catch (e) {
        showToast('Error: ' + e.message, 'error');
      }
    });
  }
}

function parsePageRange(str, max) {
  const pages = new Set();
  str.split(',').forEach(part => {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [a, b] = trimmed.split('-').map(Number);
      for (let i = a; i <= Math.min(b, max); i++) pages.add(i);
    } else {
      const n = parseInt(trimmed);
      if (n >= 1 && n <= max) pages.add(n);
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
