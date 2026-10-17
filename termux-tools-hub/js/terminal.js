// Simulator Terminal Interaktif (Termux Android & Windows PowerShell)
// Mensimulasikan lingkungan command-line secara realistis dengan toggle mode

const TermuxSimulator = (() => {
  let terminalBody;
  let cmdInput;
  let commandHistory = [];
  let historyIndex = -1;
  let isRunningProcess = false;
  let activeAnimationInterval = null;

  // Mode: 'termux' atau 'powershell'
  let currentMode = 'termux';

  const CONFIG = {
    termux: {
      user: 'u0_a234@localhost',
      dir: '~',
      symbol: '$',
      title: 'termux-session-1 (bash 5.2)',
      placeholder: 'Ketik perintah (contoh: help, neofetch, nmap, cmatrix, sherlock, curl wttr.in)...',
      welcome: () => {
        println('<span class="t-cyan">Selamat datang di Simulator Interaktif Termux Web!</span>');
        println('<span class="t-dim">Lingkungan terminal virtual Android Linux untuk mencoba perintah tanpa merusak ponsel Anda.</span>');
        println('<span class="t-yellow">Ketik </span><span class="t-green t-bold">help</span><span class="t-yellow"> untuk melihat daftar perintah simulasi, atau klik tombol cepat di bawah.</span>');
        println('');
      }
    },
    powershell: {
      user: 'Windows PowerShell',
      dir: 'PS C:\\Users\\Administrator',
      symbol: '>',
      title: 'Windows PowerShell 7.4 (x64)',
      placeholder: 'Ketik perintah PowerShell (contoh: Get-Process, winget, Test-NetConnection, wsl, help)...',
      welcome: () => {
        println('<span class="t-blue t-bold">Windows PowerShell</span>');
        println('<span class="t-dim">Copyright (C) Microsoft Corporation. All rights reserved.</span>');
        println('<span class="t-dim">Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows</span>');
        println('');
        println('<span class="t-yellow">Ketik </span><span class="t-cyan t-bold">help</span><span class="t-yellow"> untuk melihat daftar cmdlet PowerShell yang dapat disimulasikan.</span>');
        println('');
      }
    }
  };

  function init() {
    terminalBody = document.getElementById('terminal-screen');
    cmdInput = document.getElementById('term-input');

    if (!terminalBody || !cmdInput) return;

    // Setup input listener
    cmdInput.addEventListener('keydown', handleKeyDown);

    // Focus input when clicking anywhere on the terminal window
    document.getElementById('terminal-wrapper')?.addEventListener('click', () => {
      cmdInput.focus();
    });

    // Setup Termux Extra Keys Bar
    setupExtraKeys();

    // Setup Mode Switcher (Termux vs PowerShell)
    setupModeSwitcher();

    // Welcome message
    CONFIG[currentMode].welcome();
  }

  function setupModeSwitcher() {
    const buttons = document.querySelectorAll('.term-mode-tab');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetMode = btn.getAttribute('data-mode');
        if (targetMode && targetMode !== currentMode) {
          switchMode(targetMode);
        }
      });
    });
  }

  function switchMode(newMode) {
    if (!CONFIG[newMode]) return;
    currentMode = newMode;

    // Update UI tabs
    document.querySelectorAll('.term-mode-tab').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === currentMode);
    });

    // Update Terminal Title & Frame Style
    const titleEl = document.getElementById('term-title-text');
    const termFrame = document.getElementById('terminal-wrapper');
    const userPromptEl = document.getElementById('term-prompt-user');
    const dirPromptEl = document.getElementById('term-prompt-dir');
    const symbolPromptEl = document.getElementById('term-prompt-symbol');

    if (titleEl) titleEl.textContent = CONFIG[currentMode].title;
    if (cmdInput) cmdInput.placeholder = CONFIG[currentMode].placeholder;

    if (termFrame) {
      if (currentMode === 'powershell') {
        termFrame.classList.add('mode-powershell');
      } else {
        termFrame.classList.remove('mode-powershell');
      }
    }

    if (userPromptEl && dirPromptEl && symbolPromptEl) {
      if (currentMode === 'powershell') {
        userPromptEl.textContent = '';
        userPromptEl.style.display = 'none';
        dirPromptEl.textContent = CONFIG.powershell.dir;
        symbolPromptEl.textContent = CONFIG.powershell.symbol;
      } else {
        userPromptEl.textContent = CONFIG.termux.user;
        userPromptEl.style.display = 'inline';
        dirPromptEl.textContent = CONFIG.termux.dir;
        symbolPromptEl.textContent = CONFIG.termux.symbol;
      }
    }

    // Update preset buttons visibility
    const termuxPresets = document.getElementById('termux-presets');
    const psPresets = document.getElementById('ps-presets');
    if (termuxPresets) termuxPresets.style.display = currentMode === 'termux' ? 'flex' : 'none';
    if (psPresets) psPresets.style.display = currentMode === 'powershell' ? 'flex' : 'none';

    // Clear and print new welcome
    terminalBody.innerHTML = '';
    CONFIG[currentMode].welcome();
    cmdInput.value = '';
    cmdInput.focus();
  }

  function setupExtraKeys() {
    const keys = document.querySelectorAll('.t-key-btn');
    keys.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-key');
        handleVirtualKey(key);
      });
    });
  }

  function handleVirtualKey(key) {
    if (!cmdInput) return;

    switch (key) {
      case 'ESC':
        cmdInput.value = '';
        break;
      case 'TAB':
        handleTabComplete();
        break;
      case 'CTRL_C':
        cancelCurrentProcess();
        break;
      case 'UP':
        navigateHistory(-1);
        break;
      case 'DOWN':
        navigateHistory(1);
        break;
      case 'ENTER':
        submitCommand();
        break;
      default:
        cmdInput.value += key;
        cmdInput.focus();
    }
  }

  function cancelCurrentProcess() {
    if (activeAnimationInterval) {
      clearInterval(activeAnimationInterval);
      activeAnimationInterval = null;
    }
    isRunningProcess = false;
    println('^C', 't-red');
    printPromptLine();
    cmdInput.value = '';
    cmdInput.disabled = false;
    cmdInput.focus();
    scrollToBottom();
  }

  function handleKeyDown(e) {
    if (isRunningProcess) {
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        cancelCurrentProcess();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      submitCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      cancelCurrentProcess();
    }
  }

  function navigateHistory(direction) {
    if (commandHistory.length === 0) return;

    historyIndex += direction;
    if (historyIndex < 0) {
      historyIndex = 0;
    } else if (historyIndex >= commandHistory.length) {
      historyIndex = commandHistory.length;
      cmdInput.value = '';
      return;
    }

    cmdInput.value = commandHistory[historyIndex] || '';
  }

  function handleTabComplete() {
    const current = cmdInput.value.trim();
    if (!current) return;

    const termuxSuggestions = [
      'help', 'clear', 'pkg update', 'pkg upgrade', 'pkg install',
      'neofetch', 'fastfetch', 'cmatrix', 'sl', 'nmap', 'sherlock',
      'sqlmap', 'whoami', 'pwd', 'ls', 'date', 'uname -a',
      'termux-setup-storage', 'curl wttr.in', 'figlet'
    ];

    const psSuggestions = [
      'help', 'Clear-Host', 'cls', 'Get-Process', 'Stop-Process',
      'winget search', 'winget install', 'winget upgrade --all',
      'Test-NetConnection', 'Get-NetTCPConnection', 'Get-Service',
      'Invoke-RestMethod', 'Invoke-WebRequest', 'Set-ExecutionPolicy',
      'wsl --install', 'wsl -l -v', 'Get-ChildItem', 'dir'
    ];

    const pool = currentMode === 'powershell' ? psSuggestions : termuxSuggestions;
    const match = pool.find(s => s.toLowerCase().startsWith(current.toLowerCase()));
    if (match) {
      cmdInput.value = match;
    }
  }

  function submitCommand() {
    const rawCmd = cmdInput.value.trim();
    printPromptLine(rawCmd);

    if (rawCmd) {
      commandHistory.push(rawCmd);
      historyIndex = commandHistory.length;
    }

    cmdInput.value = '';

    if (!rawCmd) {
      scrollToBottom();
      return;
    }

    if (currentMode === 'powershell') {
      executePowerShellCommand(rawCmd);
    } else {
      executeTermuxCommand(rawCmd);
    }
  }

  function printPromptLine(commandText = '') {
    const line = document.createElement('div');
    line.className = 'term-line prompt-line';
    
    if (currentMode === 'powershell') {
      line.innerHTML = `<span class="prompt-ps-dir">${CONFIG.powershell.dir}</span><span class="prompt-ps-symbol">&gt;</span> <span class="cmd-text">${escapeHtml(commandText)}</span>`;
    } else {
      line.innerHTML = `<span class="prompt-user">${CONFIG.termux.user}</span>:<span class="prompt-dir">${CONFIG.termux.dir}</span><span class="prompt-symbol">${CONFIG.termux.symbol}</span> <span class="cmd-text">${escapeHtml(commandText)}</span>`;
    }

    terminalBody.appendChild(line);
    scrollToBottom();
  }

  function println(html, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = html;
    terminalBody.appendChild(line);
    scrollToBottom();
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ===================== EKSEKUSI PERINTAH POWERSHELL =====================
  function executePowerShellCommand(fullCmd) {
    const trimmed = fullCmd.trim();
    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls' || lower === 'clear-host') {
      terminalBody.innerHTML = '';
      return;
    }

    if (lower === 'help' || lower === 'get-help') {
      showPowerShellHelp();
      return;
    }

    if (lower.startsWith('get-process') || lower === 'ps' || lower === 'gps') {
      simulatePsGetProcess();
      return;
    }

    if (lower.startsWith('winget')) {
      simulateWinget(trimmed);
      return;
    }

    if (lower.startsWith('test-netconnection') || lower.startsWith('tnc')) {
      simulateTestNetConnection(trimmed);
      return;
    }

    if (lower.startsWith('get-nettcpconnection') || lower === 'netstat') {
      simulateGetNetTcpConnection();
      return;
    }

    if (lower.startsWith('wsl')) {
      simulateWsl(trimmed);
      return;
    }

    if (lower.startsWith('invoke-restmethod') || lower.startsWith('irm') || lower.startsWith('curl')) {
      simulateInvokeRestMethod(trimmed);
      return;
    }

    if (lower.startsWith('get-service') || lower === 'gsv') {
      simulateGetService();
      return;
    }

    if (lower.startsWith('get-childitem') || lower === 'dir' || lower === 'ls') {
      simulateGetChildItem();
      return;
    }

    if (lower === 'whoami') {
      println('DESKTOP-WIN11\\Administrator', 't-cyan');
      return;
    }

    if (lower === 'get-date') {
      println(new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' }), 't-yellow');
      return;
    }

    if (lower.startsWith('set-executionpolicy')) {
      println('<span class="t-green">Execution Policy updated successfully to RemoteSigned for CurrentUser.</span>');
      return;
    }

    // Default PowerShell fallback
    println(`<span class="t-red">The term '${escapeHtml(fullCmd)}' is not recognized as a name of a cmdlet, function, script file, or executable program.</span><br><span class="t-dim">Check the spelling of the name, or type <span class="t-cyan">help</span> for a list of available PowerShell commands.</span>`);
  }

  function showPowerShellHelp() {
    const html = `
<span class="t-blue t-bold">=== DAFTAR CMDLET & PERINTAH SIMULASI POWERSHELL ===</span>
<span class="t-cyan">Get-Process</span>                   : Melihat proses aplikasi & penggunaan CPU/RAM
<span class="t-cyan">winget search / install / upgrade</span> : Manajemen paket & instalasi software Windows otomatis
<span class="t-cyan">Test-NetConnection &lt;host&gt; -Port &lt;p&gt;</span>: Ping & deteksi port jaringan (pengganti telnet)
<span class="t-cyan">Get-NetTCPConnection</span>          : Audit port LISTENING & koneksi TCP aktif
<span class="t-cyan">wsl / wsl --install</span>           : Menjalankan Linux Ubuntu/Kali native di dalam Windows
<span class="t-cyan">Invoke-RestMethod &lt;URL&gt;</span>       : Request web REST API / HTTP di PowerShell
<span class="t-cyan">Get-Service</span>                   : Daftar status layanan Windows (Running / Stopped)
<span class="t-cyan">Get-ChildItem (dir / ls)</span>      : Melihat isi folder & file direktori Windows
<span class="t-cyan">Set-ExecutionPolicy</span>           : Mengaktifkan izin eksekusi script .ps1
<span class="t-cyan">Clear-Host (cls / clear)</span>      : Membersihkan layar PowerShell
<span class="t-dim">Ketik salah satu perintah di atas atau klik tombol cepat di bawah untuk mencobanya!</span>
`;
    println(html);
  }

  function simulatePsGetProcess() {
    const header = `
<pre class="t-blue">
 NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName
 ------    -----      -----     ------      --  -- -----------
     34    42.15      98.40      14.32    4820   1 chrome
     12    18.50      45.20       8.15    8912   1 code (VS Code)
     18    32.10      78.50      11.02    1204   1 powershell
      8     6.20      18.90       0.45    5128   1 explorer
     45    65.80     142.10      22.40    3300   1 node
      5     2.10       8.50       0.05    7140   1 conhost
</pre>
`;
    println(header);
  }

  function simulateWinget(cmd) {
    isRunningProcess = true;
    cmdInput.disabled = true;

    println('<span class="t-cyan">Windows Package Manager v1.7.10861</span>');
    println('<span class="t-dim">Copyright (c) Microsoft Corporation. All rights reserved.</span>');

    if (cmd.includes('upgrade')) {
      println('<span class="t-yellow">Mencari pembaruan semua aplikasi yang terpasang...</span>');
      setTimeout(() => {
        println('<span class="t-green">Semua paket telah diperbarui ke versi paling stabil. (No updates found)</span>');
        isRunningProcess = false;
        cmdInput.disabled = false;
        cmdInput.focus();
        scrollToBottom();
      }, 900);
      return;
    }

    const appName = cmd.split(' ').slice(2).join(' ') || 'Git.Git';
    println(`<span class="t-yellow">Menemukan paket: ${escapeHtml(appName)}</span>`);
    println('<span class="t-dim">Mengunduh installer dari sumber terverifikasi Microsoft Store / GitHub...</span>');

    setTimeout(() => {
      println('<pre class="t-green">[████████████████████████████████] 100% (Verifikasi hash SHA256 sukses)</pre>');
      println(`<span class="t-green">Instalasi ${escapeHtml(appName)} berhasil tanpa perlu membuka dialog wizard!</span>`);
      isRunningProcess = false;
      cmdInput.disabled = false;
      cmdInput.focus();
      scrollToBottom();
    }, 1200);
  }

  function simulateTestNetConnection(cmd) {
    isRunningProcess = true;
    cmdInput.disabled = true;

    println('<span class="t-dim">Memulai pengujian koneksi jaringan...</span>');

    setTimeout(() => {
      const output = `
<pre class="t-cyan">
ComputerName     : google.com
RemoteAddress    : 142.250.190.46
RemotePort       : 443
InterfaceAlias   : Wi-Fi
SourceAddress    : 192.168.1.105
TcpTestSucceeded : <span class="t-green t-bold">True</span> (Port Terbuka & Terhubung Sukses)
</pre>
`;
      println(output);
      isRunningProcess = false;
      cmdInput.disabled = false;
      cmdInput.focus();
      scrollToBottom();
    }, 800);
  }

  function simulateGetNetTcpConnection() {
    const netstatArt = `
<pre class="t-cyan">
LocalAddress    LocalPort  RemoteAddress   RemotePort  State       OwningProcess
------------    ---------  -------------   ----------  -----       -------------
0.0.0.0         8080       0.0.0.0         0           Listen      6240 (python)
0.0.0.0         135        0.0.0.0         0           Listen      920 (svchost)
127.0.0.1       3306       0.0.0.0         0           Listen      1840 (mysqld)
192.168.1.105   54320      142.250.190.46  443         Established 4820 (chrome)
</pre>
`;
    println(netstatArt);
  }

  function simulateWsl(cmd) {
    if (cmd.includes('--install')) {
      println('<span class="t-cyan">Memasang Windows Subsystem for Linux (WSL)...</span>');
      println('<span class="t-green">[✓] Mengunduh kernel Linux resmi Microsoft</span>');
      println('<span class="t-green">[✓] Menginstal distribusi Ubuntu... Selesai!</span>');
      println('<span class="t-yellow">Ketik \'wsl\' untuk langsung beralih ke terminal Ubuntu Linux.</span>');
    } else {
      println('<span class="t-green">root@WINDOWS-PC:/mnt/c/Users/Administrator# </span><span class="t-white">uname -a</span>');
      println('<span class="t-dim">Linux WINDOWS-PC 5.15.153.1-microsoft-standard-WSL2 #1 SMP x86_64 GNU/Linux</span>');
      println('<span class="t-yellow">Anda sekarang berada di lingkungan Linux asli di dalam Windows!</span>');
    }
  }

  function simulateInvokeRestMethod(cmd) {
    println('<span class="t-dim">Mengirimkan HTTP GET request...</span>');
    setTimeout(() => {
      const jsonRes = `
<pre class="t-green">
{
  "name": "termux-app",
  "full_name": "termux/termux-app",
  "license": "GPL-3.0",
  "status": 200,
  "features": ["terminal-emulator", "pkg-manager", "proot-linux"]
}
</pre>
`;
      println(jsonRes);
    }, 600);
  }

  function simulateGetService() {
    const srv = `
<pre class="t-dim">
Status   Name               DisplayName
------   ----               -----------
<span class="t-green">Running</span>  wuauserv           Windows Update
<span class="t-green">Running</span>  Spooler            Print Spooler
<span class="t-green">Running</span>  WinDefend          Microsoft Defender Antivirus Service
<span class="t-yellow">Stopped</span>  BluetoothUserService Bluetooth User Support Service
</pre>
`;
    println(srv);
  }

  function simulateGetChildItem() {
    const out = `
<pre class="t-dim">
    Directory: C:\\Users\\Administrator

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/17/2026   6:15 AM                <span class="t-blue">Desktop</span>
d-----        10/17/2026   6:18 AM                <span class="t-blue">Documents</span>
d-----        10/17/2026   6:25 AM                <span class="t-blue">Downloads</span>
d-----        10/17/2026   6:30 AM                <span class="t-blue">termux-tools-hub</span>
-a----        10/17/2026   6:32 AM           2048 script.ps1
</pre>
`;
    println(out);
  }

  // ===================== EKSEKUSI PERINTAH TERMUX =====================
  function executeTermuxCommand(fullCmd) {
    const parts = fullCmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (mainCmd) {
      case 'clear':
      case 'cls':
        terminalBody.innerHTML = '';
        break;

      case 'help':
        showHelp();
        break;

      case 'whoami':
        println('u0_a234', 't-green');
        break;

      case 'pwd':
        println('/data/data/com.termux/files/home', 't-cyan');
        break;

      case 'date':
        println(new Date().toString(), 't-yellow');
        break;

      case 'uname':
        if (args.includes('-a')) {
          println('Linux localhost 5.15.110-android-arm64 #1 SMP PREEMPT aarch64 Android Termux', 't-cyan');
        } else {
          println('Linux');
        }
        break;

      case 'ls':
        println('<span class="t-blue t-bold">storage/</span>  <span class="t-green">my_script.py</span>  <span class="t-cyan">downloads/</span>  <span class="t-white">README.md</span>');
        break;

      case 'cat':
        if (args[0] === 'README.md') {
          println('<span class="t-yellow"># Termux Tools Hub</span><br>Koleksi tools ethical hacking dan utilitas Linux terbaik di Android.');
        } else if (args[0]) {
          println(`<span class="t-dim">Isi file ${escapeHtml(args[0])}:</span><br>print("Halo dari Termux Android!")`);
        } else {
          println('Usage: cat [nama_file]', 't-dim');
        }
        break;

      case 'termux-setup-storage':
        simulateStorageSetup();
        break;

      case 'pkg':
      case 'apt':
        handlePkgCommand(args);
        break;

      case 'neofetch':
      case 'fastfetch':
        simulateNeofetch();
        break;

      case 'cmatrix':
        simulateCmatrix();
        break;

      case 'sl':
        simulateSL();
        break;

      case 'nmap':
        simulateNmap(args);
        break;

      case 'sherlock':
        simulateSherlock(args);
        break;

      case 'sqlmap':
        simulateSqlmap(args);
        break;

      case 'curl':
        if (args.some(a => a.includes('wttr.in'))) {
          simulateWeather();
        } else {
          println('<span class="t-yellow">HTTP/1.1 200 OK</span><br>Data response received from ' + escapeHtml(args.join(' ')));
        }
        break;

      case 'figlet':
        simulateFiglet(args.join(' ') || 'TERMUX');
        break;

      default:
        println(`<span class="t-red">Perintah tidak ditemukan:</span> <strong>${escapeHtml(mainCmd)}</strong>. Ketik <span class="t-green">help</span> untuk daftar perintah simulasi.`, 't-warning');
    }
  }

  function showHelp() {
    const helpHtml = `
<span class="t-cyan t-bold">=== DAFTAR PERINTAH SIMULASI TERMUX ===</span>
<span class="t-green">pkg update</span> / <span class="t-green">pkg upgrade</span> : Simulasi update repositori Termux
<span class="t-green">pkg install [nama_tool]</span>   : Simulasi instalasi paket (nmap, python, git, dll)
<span class="t-green">termux-setup-storage</span>      : Simulasi perizinan memori internal (/sdcard)
<span class="t-green">neofetch</span> / <span class="t-green">fastfetch</span>      : Tampilkan logo Android & info sistem ASCII
<span class="t-green">cmatrix</span>                   : Animasi hujan kode The Matrix
<span class="t-green">sl</span>                        : Animasi lokomotif uap melintas di terminal
<span class="t-green">nmap -F scanme.nmap.org</span>   : Simulasi audit port scanner
<span class="t-green">sherlock [username]</span>       : Simulasi pencarian akun media sosial
<span class="t-green">sqlmap [url]</span>              : Simulasi uji celah SQL injection
<span class="t-green">curl wttr.in</span>              : Cek cuaca dengan seni ASCII
<span class="t-green">figlet [teks]</span>             : Bikin teks banner ASCII besar
<span class="t-green">whoami</span>, <span class="t-green">pwd</span>, <span class="t-green">ls</span>, <span class="t-green">date</span>, <span class="t-green">clear</span> : Perintah dasar terminal Linux
<span class="t-dim">Tips: Anda juga bisa beralih ke tab "Windows PowerShell" di atas untuk mencoba terminal Windows!</span>
`;
    println(helpHtml);
  }

  function simulateStorageSetup() {
    println('<span class="t-yellow">[~] Meminta izin akses penyimpanan Android...</span>');
    setTimeout(() => {
      println('<span class="t-green">[✓] Izin penyimpanan diberikan oleh pengguna!</span>');
      println('<span class="t-cyan">[✓] Pintasan direktori berhasil dibuat: ~/storage/shared -> /sdcard</span>');
      scrollToBottom();
    }, 600);
  }

  function handlePkgCommand(args) {
    const sub = args[0] || '';
    const pkgName = args[1] || '';

    if (sub === 'update' || sub === 'upgrade') {
      isRunningProcess = true;
      cmdInput.disabled = true;
      println('<span class="t-yellow">Membaca daftar paket...</span>');
      
      const steps = [
        'Hit:1 https://packages.termux.dev/apt/termux-main stable InRelease',
        'Hit:2 https://packages.termux.dev/apt/termux-root root InRelease',
        'Hit:3 https://packages.termux.dev/apt/termux-x11 x11 InRelease',
        'Membaca informasi status... Selesai',
        '<span class="t-green">Semua paket sudah dalam versi termutakhir (All packages up to date).</span>'
      ];

      let idx = 0;
      activeAnimationInterval = setInterval(() => {
        if (idx < steps.length) {
          println(steps[idx]);
          idx++;
        } else {
          clearInterval(activeAnimationInterval);
          activeAnimationInterval = null;
          isRunningProcess = false;
          cmdInput.disabled = false;
          cmdInput.focus();
        }
      }, 350);

    } else if (sub === 'install') {
      if (!pkgName) {
        println('Usage: pkg install [nama_paket]', 't-dim');
        return;
      }
      isRunningProcess = true;
      cmdInput.disabled = true;
      println(`<span class="t-yellow">Menghitung dependensi untuk ${escapeHtml(pkgName)}...</span>`);
      setTimeout(() => {
        println(`Mengunduh ${escapeHtml(pkgName)}_arm64.deb [4.2 MB]...`);
        println(`Mempersiapkan pembongkaran paket ${escapeHtml(pkgName)}...`);
        println(`<span class="t-green">[✓] Paket ${escapeHtml(pkgName)} berhasil terpasang dan siap digunakan!</span>`);
        isRunningProcess = false;
        cmdInput.disabled = false;
        cmdInput.focus();
        scrollToBottom();
      }, 900);
    } else {
      println(`pkg: perintah '${escapeHtml(sub)}' tidak dikenali. Coba 'pkg update' atau 'pkg install'.`, 't-red');
    }
  }

  function simulateNeofetch() {
    const asciiArt = `
<pre class="t-green">
         -o          o-       <span class="t-cyan t-bold">u0_a234@localhost</span>
          +hydNNNNdyh+        -----------------
        +mMMMMMMMMMMMMm+      <span class="t-white">OS:</span> Android 14 aarch64
      \`dMMm:NMMMMMMN:mMMd\`    <span class="t-white">Host:</span> Termux Virtual Terminal
      hMMMMMMMMMMMMMMMMMMh    <span class="t-white">Kernel:</span> 5.15.110-android
  ..  yyyyyyyyyyyyyyyyyyyy  .. <span class="t-white">Uptime:</span> 3 days, 7 hours
.mMMm\`MMMMMMMMMMMMMMMMMM\`mMMm. <span class="t-white">Packages:</span> 342 (dpkg)
:MMMM-MMMMMMMMMMMMMMMMMM-MMMM: <span class="t-white">Shell:</span> bash 5.2.26
:MMMM-MMMMMMMMMMMMMMMMMM-MMMM: <span class="t-white">Terminal:</span> Termux (F-Droid)
:MMMM-MMMMMMMMMMMMMMMMMM-MMMM: <span class="t-white">CPU:</span> Snapdragon 8 Gen 2 (8)
:MMMM-MMMMMMMMMMMMMMMMMM-MMMM: <span class="t-white">Memory:</span> 3420MiB / 7800MiB
</pre>
`;
    println(asciiArt);
  }

  function simulateCmatrix() {
    isRunningProcess = true;
    cmdInput.disabled = true;
    println('<span class="t-dim">[Tekan CTRL+C atau tombol virtual CTRL+C untuk berhenti]</span>');

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789$+-*/=%';
    let count = 0;

    activeAnimationInterval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 48; i++) {
        if (Math.random() > 0.45) {
          line += chars[Math.floor(Math.random() * chars.length)] + ' ';
        } else {
          line += '  ';
        }
      }
      println(`<span class="t-green">${line}</span>`);
      count++;
      if (count > 25) {
        clearInterval(activeAnimationInterval);
        activeAnimationInterval = null;
        isRunningProcess = false;
        cmdInput.disabled = false;
        cmdInput.focus();
        println('<span class="t-dim">[Selesai 25 baris cmatrix]</span>');
      }
    }, 120);
  }

  function simulateSL() {
    isRunningProcess = true;
    cmdInput.disabled = true;
    const trainArt = `
<pre class="t-white">
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ _____ \\   (|  |      ===|
   /     |  |   H  |  |     |   |     (|  |         |
  |      |  |   H  |__--------------------------------
  | ________|___H__/__|_____/[][]~\\_______|
  |/ |   |_____ =====   /|_________|       |
</pre>
<span class="t-cyan">Choo-choo! Lokomotif uap melintas di Termux! 🚂</span>
`;
    println(trainArt);
    setTimeout(() => {
      isRunningProcess = false;
      cmdInput.disabled = false;
      cmdInput.focus();
    }, 800);
  }

  function simulateNmap(args) {
    isRunningProcess = true;
    cmdInput.disabled = true;
    println('<span class="t-dim">Starting Nmap 7.94 ( https://nmap.org ) at ' + new Date().toLocaleTimeString() + '</span>');
    println('<span class="t-yellow">Scanning scanme.nmap.org (45.33.32.156) [1000 ports]...</span>');

    setTimeout(() => {
      const output = `
<pre class="t-cyan">
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.042s latency).
Not shown: 996 closed tcp ports (reset)

PORT      STATE SERVICE    VERSION
22/tcp    <span class="t-green">open</span>  ssh        OpenSSH 6.6.1p1 Ubuntu
80/tcp    <span class="t-green">open</span>  http       Apache httpd 2.4.7 ((Ubuntu))
9929/tcp  <span class="t-green">open</span>  nping-echo Nping echo
31337/tcp <span class="t-green">open</span>  Elite

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds.
</pre>
`;
      println(output);
      isRunningProcess = false;
      cmdInput.disabled = false;
      cmdInput.focus();
      scrollToBottom();
    }, 1200);
  }

  function simulateSherlock(args) {
    const targetUser = args[0] || 'target_user';
    isRunningProcess = true;
    cmdInput.disabled = true;

    println(`<span class="t-yellow">[*] Memeriksa username "${escapeHtml(targetUser)}" di 400+ platform online...</span>`);

    const targets = [
      { site: 'GitHub', url: `https://github.com/${targetUser}` },
      { site: 'Instagram', url: `https://instagram.com/${targetUser}` },
      { site: 'Twitter / X', url: `https://twitter.com/${targetUser}` },
      { site: 'Telegram', url: `https://t.me/${targetUser}` },
      { site: 'Reddit', url: `https://www.reddit.com/user/${targetUser}` }
    ];

    let idx = 0;
    activeAnimationInterval = setInterval(() => {
      if (idx < targets.length) {
        const item = targets[idx];
        println(`<span class="t-green t-bold">[+] Found:</span> <span class="t-cyan">${item.site}:</span> <a href="${item.url}" target="_blank" class="t-white glow-link">${item.url}</a>`);
        idx++;
      } else {
        clearInterval(activeAnimationInterval);
        activeAnimationInterval = null;
        println(`<br><span class="t-yellow">[*] Pencarian selesai! Menemukan ${targets.length} platform cocok.</span>`);
        isRunningProcess = false;
        cmdInput.disabled = false;
        cmdInput.focus();
        scrollToBottom();
      }
    }, 400);
  }

  function simulateSqlmap(args) {
    isRunningProcess = true;
    cmdInput.disabled = true;

    println('<span class="t-red">    ___</span>');
    println('<span class="t-red">   __H__</span>');
    println('<span class="t-red"> ___ ___[,]_____ ___ ___  {1.8#stable}</span>');
    println('<span class="t-red">|_ -| . [)]     | .\'| . |</span>');
    println('<span class="t-red">|___|_  [)]_|_|_|__,|  _| http://sqlmap.org</span>');
    println('<span class="t-red">      |_|V...       |_|</span>');
    println('');
    println('<span class="t-cyan">[*] testing connection to the target URL</span>');

    setTimeout(() => {
      println('<span class="t-yellow">[INFO] testing if the target URL content is stable</span>');
      println('<span class="t-green">[+] target URL appears to be UNION query SQL injectable</span>');
      println('<span class="t-green">[+] back-end DBMS: MySQL >= 8.0</span>');
      println('<span class="t-cyan">[INFO] fetched 3 databases: [information_schema, shop_db, users_vault]</span>');
      isRunningProcess = false;
      cmdInput.disabled = false;
      cmdInput.focus();
      scrollToBottom();
    }, 1200);
  }

  function simulateWeather() {
    const weatherArt = `
<pre class="t-cyan">
    \\  /       Cerah Berawan / DKI Jakarta
  _ /""\\ _     Suhu: +31°C | Terasa Seperti: +35°C
    \\__/       Angin: 14 km/jam Tenggara
    /  \\       Kelembapan: 72% | UV Index: 8 (Tinggi)
</pre>
`;
    println(weatherArt);
  }

  function simulateFiglet(text) {
    const banner = `
<pre class="t-green t-bold">
  _____                                
 |_   _|__ _ __ _ __ ___  _   ___  __  
   | |/ _ \\ '__| '_ \` _ \\| | | \\ \\/ /  
   | |  __/ |  | | | | | | |_| |>  <   
   |_|\\___|_|  |_| |_| |_|\\__,_/_/\\_\\  
   >>> ${escapeHtml(text)} <<<
</pre>
`;
    println(banner);
  }

  // Public API to run a command programmatically from the UI
  function runCommand(commandString, targetMode = 'termux') {
    const termSection = document.getElementById('simulator');
    if (termSection) {
      termSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (currentMode !== targetMode) {
      switchMode(targetMode);
    }

    if (isRunningProcess) {
      cancelCurrentProcess();
    }

    cmdInput.focus();
    cmdInput.value = '';

    // Typing effect
    let charIdx = 0;
    const typingInterval = setInterval(() => {
      if (charIdx < commandString.length) {
        cmdInput.value += commandString[charIdx];
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          submitCommand();
        }, 200);
      }
    }, 30);
  }

  return {
    init,
    runCommand,
    switchMode
  };
})();
