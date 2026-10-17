// Logika Aplikasi Utama Termux Tools Hub
// Mengelola Katalog, Filter & Search, Modal Detail, Script Builder, dan Favorit

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi Terminal Simulator
  TermuxSimulator.init();

  // State Management
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    selectedDifficulty: 'all',
    onlyFavorites: false,
    favorites: JSON.parse(localStorage.getItem('termux_favs') || '[]'),
    selectedScriptTools: new Set(['termux-essential', 'neofetch', 'micro-editor', 'yt-dlp'])
  };

  // DOM Elements
  const catalogGrid = document.getElementById('tools-grid');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const categoryFiltersContainer = document.getElementById('category-filters');
  const difficultyFilter = document.getElementById('difficulty-filter');
  const favToggleBtn = document.getElementById('fav-toggle-btn');
  const favCountBadge = document.getElementById('fav-count-badge');
  const resultsCountEl = document.getElementById('results-count');
  const modalOverlay = document.getElementById('tool-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const scriptToolsContainer = document.getElementById('script-tools-selection');
  const scriptOutputArea = document.getElementById('script-output');
  const copyScriptBtn = document.getElementById('copy-script-btn');
  const downloadScriptBtn = document.getElementById('download-script-btn');
  const guidesContainer = document.getElementById('guides-accordion');

  // Inisialisasi Tampilan
  initCategoryPills();
  initBackgroundCanvas();
  renderTools();
  renderGuides();
  renderPowerShellSection();
  initScriptBuilder();
  updateFavoritesBadge();

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      }
      renderTools();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderTools();
      searchInput.focus();
    });
  }

  if (difficultyFilter) {
    difficultyFilter.addEventListener('change', (e) => {
      state.selectedDifficulty = e.target.value;
      renderTools();
    });
  }

  if (favToggleBtn) {
    favToggleBtn.addEventListener('click', () => {
      state.onlyFavorites = !state.onlyFavorites;
      favToggleBtn.classList.toggle('active', state.onlyFavorites);
      renderTools();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Tombol Cepat di Simulator
  document.querySelectorAll('.term-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        TermuxSimulator.runCommand(cmd);
      }
    });
  });

  // ===================== FUNGSI KATALOG & FILTER =====================
  function initCategoryPills() {
    if (!categoryFiltersContainer) return;

    // Hitung jumlah item per kategori
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = TERMUX_TOOLS.length;
      } else {
        cat.count = TERMUX_TOOLS.filter(t => t.category === cat.id).length;
      }
    });

    categoryFiltersContainer.innerHTML = CATEGORIES.map(cat => `
      <button class="cat-pill ${cat.id === state.selectedCategory ? 'active' : ''}" data-cat="${cat.id}">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
        <span class="cat-badge">${cat.count}</span>
      </button>
    `).join('');

    categoryFiltersContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFiltersContainer.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedCategory = btn.getAttribute('data-cat');
        renderTools();
      });
    });
  }

  function getFilteredTools() {
    return TERMUX_TOOLS.filter(tool => {
      // Filter Kategori
      if (state.selectedCategory !== 'all' && tool.category !== state.selectedCategory) {
        return false;
      }
      // Filter Kesulitan
      if (state.selectedDifficulty !== 'all' && tool.difficulty !== state.selectedDifficulty) {
        return false;
      }
      // Filter Favorit
      if (state.onlyFavorites && !state.favorites.includes(tool.id)) {
        return false;
      }
      // Filter Pencarian
      if (state.searchQuery) {
        const query = state.searchQuery;
        const matchName = tool.name.toLowerCase().includes(query);
        const matchDesc = tool.shortDesc.toLowerCase().includes(query) || tool.longDesc.toLowerCase().includes(query);
        const matchTags = tool.tags.some(t => t.toLowerCase().includes(query));
        const matchCmd = tool.quickCommand.toLowerCase().includes(query);
        return matchName || matchDesc || matchTags || matchCmd;
      }
      return true;
    });
  }

  function renderTools() {
    if (!catalogGrid) return;

    const filtered = getFilteredTools();

    if (resultsCountEl) {
      resultsCountEl.textContent = `${filtered.length} Tools Ditemukan`;
    }

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-radar fa-beat-fade empty-icon"></i>
          <h3>Tidak ada tool yang cocok</h3>
          <p>Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua Kategori".</p>
          <button class="cyber-btn primary-glow" id="reset-filter-btn">
            <i class="fa-solid fa-rotate-left"></i> Reset Filter
          </button>
        </div>
      `;
      document.getElementById('reset-filter-btn')?.addEventListener('click', resetFilters);
      return;
    }

    catalogGrid.innerHTML = filtered.map(tool => {
      const isFav = state.favorites.includes(tool.id);
      const categoryObj = CATEGORIES.find(c => c.id === tool.category) || { name: 'Umum', icon: 'fa-box' };

      return `
        <div class="tool-card" data-id="${tool.id}">
          <div class="tool-card-glow"></div>
          
          <div class="tool-card-header">
            <div class="tool-icon-wrapper">
              <i class="fa-solid ${tool.icon} tool-header-icon"></i>
            </div>
            <div class="tool-meta-badges">
              <span class="badge-pill badge-cat">
                <i class="fa-solid ${categoryObj.icon}"></i> ${categoryObj.name}
              </span>
              <span class="badge-pill badge-difficulty diff-${tool.difficultyColor}">
                ${tool.difficulty}
              </span>
            </div>
            <button class="fav-star-btn ${isFav ? 'is-fav' : ''}" data-id="${tool.id}" title="${isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}">
              <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
            </button>
          </div>

          <h3 class="tool-title">${tool.name}</h3>
          <p class="tool-desc">${tool.shortDesc}</p>

          <div class="tool-tags">
            ${tool.tags.map(t => `<span class="tag-chip">#${t}</span>`).join('')}
          </div>

          <div class="tool-quick-code-box">
            <div class="code-header">
              <span>Perintah Cepat</span>
              <button class="mini-copy-btn" data-code="${escapeAttribute(tool.quickCommand)}" title="Salin Perintah">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
            <code class="code-snippet">${escapeHtml(tool.quickCommand)}</code>
          </div>

          <div class="tool-card-actions">
            <button class="card-btn details-btn" data-id="${tool.id}">
              <i class="fa-solid fa-book-open"></i> Panduan Lengkap
            </button>
            <button class="card-btn test-btn" data-id="${tool.id}" title="Uji perintah ini di simulator terminal">
              <i class="fa-solid fa-play"></i> Uji Terminal
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Pasang Event Listeners pada kartu
    attachCardEvents();
  }

  function attachCardEvents() {
    // Tombol Panduan Lengkap (Buka Modal)
    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const tool = TERMUX_TOOLS.find(t => t.id === id);
        if (tool) openModal(tool);
      });
    });

    // Tombol Uji Terminal
    document.querySelectorAll('.test-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const tool = TERMUX_TOOLS.find(t => t.id === id);
        if (tool) {
          // Pilih perintah yang cocok untuk diuji
          let testCmd = tool.quickCommand.split('&&')[0].trim();
          if (testCmd.includes('termux-setup-storage')) testCmd = 'termux-setup-storage';
          if (tool.id === 'cmatrix') testCmd = 'cmatrix';
          if (tool.id === 'neofetch') testCmd = 'neofetch';
          if (tool.id === 'sl-train') testCmd = 'sl';
          if (tool.id === 'nmap') testCmd = 'nmap -F scanme.nmap.org';
          if (tool.id === 'sherlock') testCmd = 'sherlock termux_pro';
          if (tool.id === 'sqlmap') testCmd = 'sqlmap -u "http://testphp.vulnweb.com/listproducts.php?cat=1"';
          
          showToast(`Mengalihkan perintah "${testCmd}" ke Terminal Simulator...`);
          TermuxSimulator.runCommand(testCmd);
        }
      });
    });

    // Tombol Salin Cepat
    document.querySelectorAll('.mini-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = btn.getAttribute('data-code');
        copyToClipboard(code);
        btn.innerHTML = '<i class="fa-solid fa-check text-green"></i>';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 1500);
      });
    });

    // Tombol Favorit
    document.querySelectorAll('.fav-star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleFavorite(id);
      });
    });
  }

  function toggleFavorite(id) {
    if (state.favorites.includes(id)) {
      state.favorites = state.favorites.filter(item => item !== id);
      showToast('Dihapus dari daftar favorit');
    } else {
      state.favorites.push(id);
      showToast('Disimpan ke daftar favorit ⭐');
    }
    localStorage.setItem('termux_favs', JSON.stringify(state.favorites));
    updateFavoritesBadge();
    renderTools();
  }

  function updateFavoritesBadge() {
    if (favCountBadge) {
      favCountBadge.textContent = state.favorites.length;
    }
  }

  function resetFilters() {
    state.selectedCategory = 'all';
    state.searchQuery = '';
    state.selectedDifficulty = 'all';
    state.onlyFavorites = false;
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (difficultyFilter) difficultyFilter.value = 'all';
    if (favToggleBtn) favToggleBtn.classList.remove('active');
    initCategoryPills();
    renderTools();
  }

  // ===================== MODAL DETAIL TOOL =====================
  function openModal(tool) {
    if (!modalOverlay) return;

    const modalContent = document.getElementById('modal-dynamic-content');
    const categoryObj = CATEGORIES.find(c => c.id === tool.category) || { name: 'Umum', icon: 'fa-box' };

    // Kumpulkan semua perintah step
    const allCommands = tool.steps.map(s => s.cmd).join(' && ');

    modalContent.innerHTML = `
      <div class="modal-header-hero">
        <div class="modal-header-left">
          <div class="modal-tool-icon">
            <i class="fa-solid ${tool.icon}"></i>
          </div>
          <div>
            <div class="modal-badges-row">
              <span class="badge-pill badge-cat"><i class="fa-solid ${categoryObj.icon}"></i> ${categoryObj.name}</span>
              <span class="badge-pill badge-difficulty diff-${tool.difficultyColor}">${tool.difficulty}</span>
              <span class="badge-pill badge-root ${tool.rootRequired ? 'badge-danger' : 'badge-safe'}">
                <i class="fa-solid ${tool.rootRequired ? 'fa-lock' : 'fa-lock-open'}"></i>
                ${tool.rootRequired ? 'Butuh Root' : 'Tanpa Root (No Root)'}
              </span>
            </div>
            <h2 class="modal-title">${tool.name}</h2>
          </div>
        </div>
      </div>

      <div class="modal-body-scroll">
        <p class="modal-long-desc">${tool.longDesc}</p>

        <div class="all-cmd-banner">
          <div>
            <div class="all-cmd-title"><i class="fa-solid fa-bolt text-yellow"></i> Eksekusi Cepat (One-Liner):</div>
            <code class="all-cmd-code">${escapeHtml(tool.quickCommand)}</code>
          </div>
          <button class="cyber-btn primary-glow copy-all-btn" data-code="${escapeAttribute(tool.quickCommand)}">
            <i class="fa-regular fa-copy"></i> Salin Perintah
          </button>
        </div>

        <div class="modal-section-title">
          <i class="fa-solid fa-list-check text-cyan"></i> Langkah Instalasi Terperinci
        </div>

        <div class="modal-steps-list">
          ${tool.steps.map((step, idx) => `
            <div class="modal-step-item">
              <div class="step-num">${idx + 1}</div>
              <div class="step-content">
                <h4 class="step-title">${step.title}</h4>
                <div class="step-code-block">
                  <code>${escapeHtml(step.cmd)}</code>
                  <button class="step-copy-btn" data-code="${escapeAttribute(step.cmd)}" title="Salin langkah ini">
                    <i class="fa-regular fa-copy"></i>
                  </button>
                </div>
                ${step.note ? `<div class="step-note"><i class="fa-solid fa-circle-info"></i> ${step.note}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        ${tool.examples && tool.examples.length > 0 ? `
          <div class="modal-section-title">
            <i class="fa-solid fa-terminal text-green"></i> Contoh Penggunaan Nyata (Real Cases)
          </div>
          <div class="modal-examples-list">
            ${tool.examples.map(ex => `
              <div class="example-item">
                <div class="example-title">${ex.title}</div>
                <div class="step-code-block">
                  <code>${escapeHtml(ex.cmd)}</code>
                  <button class="step-copy-btn" data-code="${escapeAttribute(ex.cmd)}" title="Salin contoh">
                    <i class="fa-regular fa-copy"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${tool.tips ? `
          <div class="modal-tip-box">
            <i class="fa-solid fa-lightbulb text-yellow"></i>
            <div>
              <strong>Tips & Trik Ahli:</strong>
              <p>${tool.tips}</p>
            </div>
          </div>
        ` : ''}

        <div class="modal-footer-actions">
          <button class="cyber-btn secondary-btn modal-test-terminal-btn" data-cmd="${escapeAttribute(tool.quickCommand.split('&&')[0].trim())}">
            <i class="fa-solid fa-play"></i> Buka & Uji di Terminal Simulator
          </button>
        </div>
      </div>
    `;

    // Pasang listener tombol salin dalam modal
    modalContent.querySelectorAll('.copy-all-btn, .step-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        copyToClipboard(code);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 1500);
      });
    });

    // Pasang listener uji di terminal dari modal
    modalContent.querySelector('.modal-test-terminal-btn')?.addEventListener('click', (e) => {
      const cmd = e.currentTarget.getAttribute('data-cmd');
      closeModal();
      showToast(`Membuka "${cmd}" di simulator...`);
      TermuxSimulator.runCommand(cmd);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===================== SCRIPT BUILDER =====================
  function initScriptBuilder() {
    if (!scriptToolsContainer) return;

    scriptToolsContainer.innerHTML = TERMUX_TOOLS.map(tool => {
      const isChecked = state.selectedScriptTools.has(tool.id);
      return `
        <label class="script-tool-checkbox-item ${isChecked ? 'selected' : ''}">
          <input type="checkbox" value="${tool.id}" ${isChecked ? 'checked' : ''}>
          <span class="custom-check"><i class="fa-solid fa-check"></i></span>
          <span class="tool-name-label">${tool.name}</span>
        </label>
      `;
    }).join('');

    scriptToolsContainer.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.addEventListener('change', (e) => {
        const id = e.target.value;
        const parent = e.target.closest('.script-tool-checkbox-item');
        if (e.target.checked) {
          state.selectedScriptTools.add(id);
          parent.classList.add('selected');
        } else {
          state.selectedScriptTools.delete(id);
          parent.classList.remove('selected');
        }
        generateScript();
      });
    });

    // Opsi tambahan script
    document.getElementById('opt-pkg-update')?.addEventListener('change', generateScript);
    document.getElementById('opt-setup-storage')?.addEventListener('change', generateScript);
    document.getElementById('opt-install-git-python')?.addEventListener('change', generateScript);

    // Tombol Select All / Deselect All
    document.getElementById('select-all-script-btn')?.addEventListener('click', () => {
      TERMUX_TOOLS.forEach(t => state.selectedScriptTools.add(t.id));
      scriptToolsContainer.querySelectorAll('input').forEach(i => i.checked = true);
      scriptToolsContainer.querySelectorAll('.script-tool-checkbox-item').forEach(i => i.classList.add('selected'));
      generateScript();
    });

    document.getElementById('deselect-all-script-btn')?.addEventListener('click', () => {
      state.selectedScriptTools.clear();
      scriptToolsContainer.querySelectorAll('input').forEach(i => i.checked = false);
      scriptToolsContainer.querySelectorAll('.script-tool-checkbox-item').forEach(i => i.classList.remove('selected'));
      generateScript();
    });

    // Tombol Salin Skrip
    if (copyScriptBtn) {
      copyScriptBtn.addEventListener('click', () => {
        if (!scriptOutputArea) return;
        copyToClipboard(scriptOutputArea.value);
        copyScriptBtn.innerHTML = '<i class="fa-solid fa-check"></i> Skrip Tersalin!';
        setTimeout(() => {
          copyScriptBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Salin Seluruh Skrip';
        }, 1800);
      });
    }

    // Tombol Unduh File .sh
    if (downloadScriptBtn) {
      downloadScriptBtn.addEventListener('click', () => {
        if (!scriptOutputArea) return;
        downloadBashFile('setup-termux-tools.sh', scriptOutputArea.value);
      });
    }

    generateScript();
  }

  function generateScript() {
    if (!scriptOutputArea) return;

    const optUpdate = document.getElementById('opt-pkg-update')?.checked ?? true;
    const optStorage = document.getElementById('opt-setup-storage')?.checked ?? true;
    const optGitPy = document.getElementById('opt-install-git-python')?.checked ?? true;

    let scriptLines = [
      '#!/data/data/com.termux/files/usr/bin/bash',
      '# =========================================================',
      '# Otomatisasi Instalasi Tools Termux - TermuxToolsHub.id',
      '# Dihasilkan pada: ' + new Date().toLocaleString('id-ID'),
      '# =========================================================\n',
      'set -e',
      'echo -e "\\e[1;36m[+] Memulai instalasi paket pilihan Termux...\\e[0m"\n'
    ];

    if (optUpdate) {
      scriptLines.push('# 1. Pembaruan Paket Inti & Mirror');
      scriptLines.push('echo -e "\\e[1;33m[*] Memperbarui repositori paket...\\e[0m"');
      scriptLines.push('pkg update -y && pkg upgrade -y\n');
    }

    if (optStorage) {
      scriptLines.push('# 2. Akses Memori Internal');
      scriptLines.push('echo -e "\\e[1;33m[*] Meminta izin akses penyimpanan (/sdcard)...\\e[0m"');
      scriptLines.push('termux-setup-storage\n');
    }

    if (optGitPy) {
      scriptLines.push('# 3. Instalasi Lingkungan Dasar (Git, Python, Wget, Curl)');
      scriptLines.push('pkg install git curl wget python python-pip clang make -y\n');
    }

    scriptLines.push('# 4. Instalasi Tools yang Anda Pilih:');

    const selectedList = TERMUX_TOOLS.filter(t => state.selectedScriptTools.has(t.id));

    if (selectedList.length === 0) {
      scriptLines.push('# (Belum ada tool yang dipilih. Centang tool di panel kiri!)\n');
    } else {
      selectedList.forEach(tool => {
        scriptLines.push(`echo -e "\\e[1;32m[+] Memasang: ${tool.name}...\\e[0m"`);
        scriptLines.push(tool.quickCommand);
      });
    }

    scriptLines.push('\necho -e "\\e[1;32m[✓] SEMUA PROSES INSTALASI SELESAI DENGAN SUKSES!\\e[0m"');
    scriptLines.push('echo -e "\\e[1;36mKetik \'ls\' atau jalankan tool yang baru Anda pasang. Selamat belajar!\\e[0m"');

    scriptOutputArea.value = scriptLines.join('\n');
  }

  function downloadBashFile(filename, content) {
    const blob = new Blob([content], { type: 'text/x-sh;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(`File "${filename}" berhasil diunduh! Pindahkan ke Termux dan jalankan: bash ${filename}`);
  }

  // ===================== PANDUAN & TROUBLESHOOTING =====================
  function renderGuides() {
    if (!guidesContainer) return;

    guidesContainer.innerHTML = TERMUX_GUIDES.map((guide, idx) => `
      <div class="accordion-item ${idx === 0 ? 'active' : ''}">
        <button class="accordion-header">
          <div class="accordion-title-box">
            <i class="fa-solid ${guide.icon} accordion-icon"></i>
            <div>
              <span class="guide-tag">${guide.category}</span>
              <h3 class="guide-heading">${guide.title}</h3>
            </div>
          </div>
          <i class="fa-solid fa-chevron-down accordion-arrow"></i>
        </button>
        <div class="accordion-content">
          <div class="accordion-body-inner">
            ${guide.content}
          </div>
        </div>
      </div>
    `).join('');

    guidesContainer.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
      });
    });
  }

  // ===================== POWERSHELL & WINDOWS TERMINAL =====================
  function renderPowerShellSection() {
    const psPillsContainer = document.getElementById('ps-category-pills');
    const psGrid = document.getElementById('ps-tools-grid');
    const compTableBody = document.getElementById('comparison-table-body');
    const psSearchInput = document.getElementById('ps-search-input');

    if (!psGrid || typeof POWERSHELL_DATA === 'undefined') return;

    let selectedPsCategory = 'all-ps';
    let psSearchQuery = '';

    // Render comparison table
    if (compTableBody && POWERSHELL_DATA.comparisonTable) {
      compTableBody.innerHTML = POWERSHELL_DATA.comparisonTable.map(row => `
        <tr>
          <td><code class="termux-code">${escapeHtml(row.termux)}</code></td>
          <td><code class="ps-code">${escapeHtml(row.ps)}</code></td>
          <td class="table-desc">${escapeHtml(row.desc)}</td>
        </tr>
      `).join('');
    }

    // Render Category Pills
    if (psPillsContainer && POWERSHELL_DATA.categories) {
      psPillsContainer.innerHTML = POWERSHELL_DATA.categories.map(cat => `
        <button class="cat-pill ${cat.id === selectedPsCategory ? 'active' : ''}" data-pscat="${cat.id}">
          <i class="fa-solid ${cat.icon}"></i>
          <span>${cat.name}</span>
        </button>
      `).join('');

      psPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          psPillsContainer.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedPsCategory = btn.getAttribute('data-pscat');
          renderPsCards();
        });
      });
    }

    // Search Listener
    if (psSearchInput) {
      psSearchInput.addEventListener('input', (e) => {
        psSearchQuery = e.target.value.toLowerCase().trim();
        renderPsCards();
      });
    }

    function renderPsCards() {
      const filtered = POWERSHELL_DATA.commands.filter(cmd => {
        if (selectedPsCategory !== 'all-ps' && cmd.category !== selectedPsCategory) {
          return false;
        }
        if (psSearchQuery) {
          const matchName = cmd.name.toLowerCase().includes(psSearchQuery);
          const matchDesc = cmd.shortDesc.toLowerCase().includes(psSearchQuery);
          const matchCmd = cmd.quickCommand.toLowerCase().includes(psSearchQuery);
          return matchName || matchDesc || matchCmd;
        }
        return true;
      });

      if (filtered.length === 0) {
        psGrid.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-terminal empty-icon text-cyan"></i>
            <h3>Tidak ada perintah PowerShell yang cocok</h3>
            <p>Coba gunakan kata kunci pencarian lain.</p>
          </div>
        `;
        return;
      }

      psGrid.innerHTML = filtered.map(item => `
        <div class="tool-card ps-card">
          <div class="tool-card-glow ps-glow"></div>
          
          <div class="tool-card-header">
            <div class="tool-icon-wrapper ps-icon-box">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="tool-meta-badges">
              <span class="badge-pill badge-cat">
                <i class="fa-brands fa-windows"></i> PowerShell
              </span>
              <span class="badge-pill badge-difficulty diff-blue">${item.difficulty}</span>
            </div>
          </div>

          <h3 class="tool-title">${item.name}</h3>
          <p class="tool-desc">${item.shortDesc}</p>

          <div class="tool-quick-code-box ps-code-box">
            <div class="code-header">
              <span>Cmdlet / Perintah Utama</span>
              <button class="mini-copy-btn" data-code="${escapeAttribute(item.quickCommand)}" title="Salin Perintah">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
            <code class="code-snippet ps-code-snippet">${escapeHtml(item.quickCommand)}</code>
          </div>

          ${item.equivalentTermux ? `
            <div class="ps-equiv-box">
              <span class="equiv-label"><i class="fa-solid fa-code-compare"></i> Padanan di Termux:</span>
              <code>${escapeHtml(item.equivalentTermux)}</code>
            </div>
          ` : ''}

          <div class="tool-card-actions ps-actions">
            <button class="card-btn test-btn ps-test-btn" data-cmd="${escapeAttribute(item.quickCommand)}" title="Uji perintah ini di simulator PowerShell">
              <i class="fa-solid fa-play"></i> Uji di PowerShell
            </button>
          </div>
        </div>
      `).join('');

      // Pasang Event Listeners
      psGrid.querySelectorAll('.mini-copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyToClipboard(btn.getAttribute('data-code'));
        });
      });

      psGrid.querySelectorAll('.ps-test-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-cmd');
          showToast(`Mengalihkan perintah ke Simulator Windows PowerShell...`);
          TermuxSimulator.runCommand(cmd, 'powershell');
        });
      });
    }

    renderPsCards();
  }

  // ===================== CANVAS LATAR BELAKANG SIBER =====================
  function initBackgroundCanvas() {
    const canvas = document.getElementById('cyber-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 255, 136, 0.25)' : 'rgba(0, 240, 255, 0.25)'
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }

  // ===================== HELPER UTILITIES =====================
  function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Berhasil disalin ke clipboard! Siap dipaste ke Termux.');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Berhasil disalin ke clipboard!');
    } catch (e) {
      showToast('Gagal menyalin otomatis, silakan salin manual.');
    }
    document.body.removeChild(ta);
  }

  function showToast(message) {
    let toast = document.getElementById('cyber-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cyber-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <span>${message}</span>`;
    toast.className = 'show';
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
      toast.className = '';
    }, 2800);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttribute(str) {
    return str.replace(/"/g, '&quot;');
  }
});
