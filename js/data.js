// Database Lengkap Tools Termux & Panduan Penggunaan
// Disesuaikan untuk Termux versi F-Droid (Android 7 - 15+)

const CATEGORIES = [
  { id: 'all', name: 'Semua Kategori', icon: 'fa-globe', count: 0 },
  { id: 'dasar', name: 'Dasar & Sistem', icon: 'fa-terminal', count: 0 },
  { id: 'osint', name: 'OSINT & Recon', icon: 'fa-user-secret', count: 0 },
  { id: 'pentest', name: 'Audit & Keamanan', icon: 'fa-shield-halved', count: 0 },
  { id: 'network', name: 'Jaringan & Server', icon: 'fa-network-wired', count: 0 },
  { id: 'media', name: 'Multimedia & Trik', icon: 'fa-wand-magic-sparkles', count: 0 },
  { id: 'allinone', name: 'Installer Paket', icon: 'fa-box-archive', count: 0 }
];

const TERMUX_TOOLS = [
  // --- KATEGORI: DASAR & SISTEM ---
  {
    id: 'termux-essential',
    name: 'Termux Core Setup & Storage',
    category: 'dasar',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-sliders',
    shortDesc: 'Pembaruan paket inti dan izin akses penyimpanan internal Android (/sdcard).',
    longDesc: 'Langkah pertama dan paling krusial setiap kali selesai menginstal aplikasi Termux baru. Memastikan repositori paket terbarui dan memberikan hak akses bagi Termux untuk membaca serta menulis file ke memori HP Anda.',
    tags: ['Dasar', 'Wajib', 'Storage', 'Paket'],
    rootRequired: false,
    quickCommand: 'pkg update -y && pkg upgrade -y && termux-setup-storage',
    dependencies: ['coreutils'],
    steps: [
      {
        title: 'Perbarui Daftar Repositori & Paket',
        cmd: 'pkg update -y && pkg upgrade -y',
        note: 'Jika muncul pilihan konfigurasi (default: keep old), cukup tekan ENTER.'
      },
      {
        title: 'Beri Izin Akses Penyimpanan HP',
        cmd: 'termux-setup-storage',
        note: 'Popup izin penyimpanan Android akan muncul, klik "Izinkan" / "Allow". Folder ~/storage/shared akan terhubung ke memori internal.'
      },
      {
        title: 'Install Alat Pendukung Esensial',
        cmd: 'pkg install git curl wget nano -y',
        note: 'Paket ini sangat sering dibutuhkan oleh hampir semua tools pihak ketiga.'
      }
    ],
    examples: [
      {
        title: 'Cek isi memori internal dari Termux',
        cmd: 'ls ~/storage/shared/Download'
      },
      {
        title: 'Ganti mirror repositori jika pkg error 404',
        cmd: 'termux-change-repo'
      }
    ],
    tips: 'Selalu download Termux dari F-Droid atau GitHub resmi, BUKAN dari Google Play Store (versi Play Store sudah tidak di-update dan repositorinya mati/error).'
  },
  {
    id: 'proot-distro',
    name: 'PRoot Distro (Linux di Android)',
    category: 'dasar',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-linux',
    shortDesc: 'Jalankan OS Linux penuh (Ubuntu, Debian, Kali, Alpine) di dalam Termux tanpa root.',
    longDesc: 'PRoot Distro adalah utilitas resmi Termux untuk menginstal distribusi Linux standar di lingkungan chroot/proot tanpa perlu hak akses root ponsel. Sangat ideal untuk menjalankan paket Linux yang tidak tersedia langsung di Termux.',
    tags: ['Ubuntu', 'Debian', 'Kali Linux', 'Tanpa Root'],
    rootRequired: false,
    quickCommand: 'pkg install proot-distro -y && proot-distro install ubuntu',
    dependencies: ['proot', 'tar', 'curl'],
    steps: [
      {
        title: 'Install PRoot Distro',
        cmd: 'pkg install proot-distro -y',
        note: 'Mengunduh manajer distribusi proot resmi Termux.'
      },
      {
        title: 'Lihat Daftar OS yang Tersedia',
        cmd: 'proot-distro list',
        note: 'Pilihan populer: ubuntu, debian, alpine, archlinux, kali, void.'
      },
      {
        title: 'Install Distro Pilihan (Contoh: Ubuntu)',
        cmd: 'proot-distro install ubuntu',
        note: 'Tunggu proses unduh rootfs sistem operasi hingga selesai.'
      },
      {
        title: 'Masuk ke Dalam Sistem Ubuntu',
        cmd: 'proot-distro login ubuntu',
        note: 'Prompt terminal Anda akan berubah menjadi "root@localhost:~#". Untuk keluar ketik "exit".'
      }
    ],
    examples: [
      {
        title: 'Jalankan perintah langsung di dalam Ubuntu',
        cmd: 'proot-distro login ubuntu -- apt update && apt install neofetch -y'
      },
      {
        title: 'Install Kali Linux tanpa root',
        cmd: 'proot-distro install kali && proot-distro login kali'
      }
    ],
    tips: 'Di dalam PRoot distro, Anda menggunakan manajer paket bawaan distro tersebut (misalnya "apt" untuk Ubuntu/Debian/Kali, atau "pacman" untuk Arch).'
  },
  {
    id: 'oh-my-zsh-termux',
    name: 'Zsh & Termux Styling',
    category: 'dasar',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-palette',
    shortDesc: 'Ubah tampilan Termux membosankan menjadi terminal hacker estetik dengan tema & font keren.',
    longDesc: 'Kombinasi Zsh shell dengan Oh-My-Zsh dan Termux-Styling memberikan fitur auto-suggestion, syntax highlighting, indikator git, serta font monospaced Powerline agar simbol terminal tampil rapi.',
    tags: ['Zsh', 'Styling', 'Theme', 'Font'],
    rootRequired: false,
    quickCommand: 'pkg install zsh git curl -y && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
    dependencies: ['zsh', 'git', 'curl'],
    steps: [
      {
        title: 'Install Zsh & Dependensi',
        cmd: 'pkg install zsh git curl -y',
        note: 'Menginstal shell Zsh.'
      },
      {
        title: 'Pasang Oh-My-Zsh Otomatis',
        cmd: 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
        note: 'Ketik "Y" saat ditanya ingin menjadikan Zsh sebagai shell default.'
      },
      {
        title: 'Pasang Plugin Auto Suggestions & Syntax Highlighting',
        cmd: 'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting',
        note: 'Membuat terminal mengetikkan riwayat otomatis mirip terminal modern.'
      }
    ],
    examples: [
      {
        title: 'Ubah tema di file konfigurasi .zshrc',
        cmd: 'nano ~/.zshrc # Ganti ZSH_THEME="agnoster" atau "robbyrussell"'
      },
      {
        title: 'Terapkan perubahan konfigurasi',
        cmd: 'source ~/.zshrc'
      }
    ],
    tips: 'Anda juga bisa memasang paket termux-styling resmi dengan mengetik "pkg install termux-styling" jika ingin ganti warna dan font via GUI.'
  },
  {
    id: 'neofetch',
    name: 'Neofetch / Fastfetch',
    category: 'dasar',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-circle-info',
    shortDesc: 'Tampilkan logo ASCII keren dan spesifikasi lengkap Android, RAM, kernel, dan uptime.',
    longDesc: 'Tool CLI informasi sistem yang sangat populer untuk menampilkan logo sistem operasi dalam seni ASCII beserta ringkasan CPU, memori, kernel Android, dan waktu aktif perangkat.',
    tags: ['Info', 'Sysadmin', 'Hardware', 'Ascii'],
    rootRequired: false,
    quickCommand: 'pkg install neofetch -y && neofetch',
    dependencies: ['bash'],
    steps: [
      {
        title: 'Install Neofetch',
        cmd: 'pkg install neofetch -y',
        note: 'Ukuran paket sangat kecil dan langsung siap digunakan.'
      },
      {
        title: 'Jalankan Neofetch',
        cmd: 'neofetch',
        note: 'Akan menampilkan informasi sistem lengkap di layar.'
      }
    ],
    examples: [
      {
        title: 'Tampilkan Neofetch otomatis tiap buka Termux',
        cmd: 'echo "neofetch" >> ~/.bashrc'
      },
      {
        title: 'Gunakan Fastfetch (alternatif lebih cepat berbasis C)',
        cmd: 'pkg install fastfetch -y && fastfetch'
      }
    ],
    tips: 'Sangat cocok dipadukan dengan screenshot status atau konfigurasi terminal Anda!'
  },
  {
    id: 'tmux',
    name: 'Tmux (Terminal Multiplexer)',
    category: 'dasar',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-table-columns',
    shortDesc: 'Bagi layar Termux jadi beberapa jendela sekaligus & biarkan proses tetap jalan di background.',
    longDesc: 'Tmux memungkinkan Anda membagi layar terminal menjadi beberapa panel (split horizontally / vertically), menjalankan proses jangka panjang tanpa takut terhenti saat aplikasi Termux terminimalkan, serta multi-tasking dengan mudah.',
    tags: ['Multi-panel', 'Background', 'Productivity'],
    rootRequired: false,
    quickCommand: 'pkg install tmux -y && tmux',
    dependencies: ['libevent', 'ncurses'],
    steps: [
      {
        title: 'Install Tmux',
        cmd: 'pkg install tmux -y',
        note: 'Pemasangan binary tmux resmi.'
      },
      {
        title: 'Buka Sesi Tmux Baru',
        cmd: 'tmux new -s utama',
        note: 'Memulai sesi tmux dengan nama "utama".'
      }
    ],
    examples: [
      {
        title: 'Bagi panel horizontal (Atas / Bawah)',
        cmd: 'Tekan Ctrl + b lalu lepaskan, kemudian tekan "'
      },
      {
        title: 'Bagi panel vertikal (Kiri / Kanan)',
        cmd: 'Tekan Ctrl + b lalu lepaskan, kemudian tekan %'
      },
      {
        title: 'Pindah antar panel',
        cmd: 'Tekan Ctrl + b lalu lepaskan, kemudian gunakan tombol Panah (Arrow)'
      },
      {
        title: 'Lepas sesi (detach) tanpa mematikan proses',
        cmd: 'Tekan Ctrl + b lalu tekan d. Sambung kembali nanti dengan: tmux a -t utama'
      }
    ],
    tips: 'Tmux adalah penyelamat saat Anda menjalankan skrip download besar atau server yang tidak boleh mati ketika layar HP mati.'
  },
  {
    id: 'python-dev',
    name: 'Python & PIP Ecosystem',
    category: 'dasar',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-python',
    shortDesc: 'Lingkungan pemrograman Python 3 lengkap beserta PIP package manager.',
    longDesc: 'Hampir 70% tools keamanan, bot, dan skrip otomatisasi di Termux ditulis menggunakan bahasa pemrograman Python. Mempersiapkan runtime Python dan build-tools adalah fondasi utama.',
    tags: ['Python', 'PIP', 'Scripting', 'Dev'],
    rootRequired: false,
    quickCommand: 'pkg install python python-pip clang make -y',
    dependencies: ['clang', 'make'],
    steps: [
      {
        title: 'Install Python dan Compiler C',
        cmd: 'pkg install python python-pip clang make libffi openssl -y',
        note: 'Clang dan make dibutuhkan jika modul python perlu di-compile (C extensions).'
      },
      {
        title: 'Perbarui Pip ke Versi Terbaru',
        cmd: 'pip install --upgrade pip',
        note: 'Memastikan package installer siap digunakan.'
      }
    ],
    examples: [
      {
        title: 'Jalankan skrip Python',
        cmd: 'python nama_file.py'
      },
      {
        title: 'Install pustaka populer untuk hacking & scraping',
        cmd: 'pip install requests bs4 colorama cryptography'
      }
    ],
    tips: 'Jika saat install modul pip terjadi error compiler, pastikan paket `clang` dan `python-dev` sudah terpasang.'
  },

  // --- KATEGORI: OSINT & RECON ---
  {
    id: 'nmap',
    name: 'Nmap (Network Mapper)',
    category: 'osint',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-satellite-dish',
    shortDesc: 'Alat scanner jaringan terhebat untuk audit port terbuka, deteksi OS, dan evaluasi keamanan.',
    longDesc: 'Nmap adalah standar industri untuk pemetaan jaringan dan audit kerentanan port. Di Termux, Nmap berjalan sangat lancar untuk memindai perangkat di jaringan WiFi lokal maupun domain web eksternal.',
    tags: ['Port Scan', 'Recon', 'Jaringan', 'NSE Script'],
    rootRequired: false,
    quickCommand: 'pkg install nmap -y && nmap -F scanme.nmap.org',
    dependencies: ['libpcap', 'openssl'],
    steps: [
      {
        title: 'Install Nmap di Termux',
        cmd: 'pkg install nmap -y',
        note: 'Nmap tersedia langsung di repositori resmi Termux.'
      },
      {
        title: 'Cek Versi dan Bantuan Perintah',
        cmd: 'nmap --version',
        note: 'Memverifikasi instalasi sukses.'
      }
    ],
    examples: [
      {
        title: 'Scan cepat port populer (Fast Scan)',
        cmd: 'nmap -F 192.168.1.1'
      },
      {
        title: 'Deteksi versi service aplikasi dan OS target',
        cmd: 'nmap -sV -sC -Pn scanme.nmap.org'
      },
      {
        title: 'Scan seluruh perangkat aktif di WiFi lokal (Subnet Sweep)',
        cmd: 'nmap -sn 192.168.1.0/24'
      },
      {
        title: 'Gunakan Script Mesin Vulnerability (NSE)',
        cmd: 'nmap --script vuln 192.168.1.1'
      }
    ],
    tips: 'Untuk pemindaian SYN stealth (-sS), Termux memerlukan akses root. Namun mode TCP Connect standard (-sT) bekerja 100% sempurna tanpa root!'
  },
  {
    id: 'sherlock',
    name: 'Sherlock (OSINT Username Hunter)',
    category: 'osint',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-magnifying-glass-chart',
    shortDesc: 'Lacak jejak digital username target di lebih dari 400 platform media sosial secara serentak.',
    longDesc: 'Sherlock adalah tool OSINT legendaris yang mencari keberadaan nama pengguna (username) di ratusan situs ternama seperti Instagram, TikTok, Twitter/X, GitHub, Reddit, Telegram, dan forum lainnya dalam hitungan detik.',
    tags: ['OSINT', 'Social Media', 'Username', 'Python'],
    rootRequired: false,
    quickCommand: 'pkg install python git -y && git clone https://github.com/sherlock-project/sherlock.git',
    dependencies: ['python', 'git'],
    steps: [
      {
        title: 'Install Python & Git',
        cmd: 'pkg install python git -y',
        note: 'Kebutuhan dasar untuk menjalankan skrip Sherlock.'
      },
      {
        title: 'Clone Repositori Sherlock',
        cmd: 'git clone https://github.com/sherlock-project/sherlock.git',
        note: 'Mengunduh source code dari GitHub resmi.'
      },
      {
        title: 'Masuk Direktori & Pasang Dependensi',
        cmd: 'cd sherlock && pip install -r requirements.txt',
        note: 'Menginstal modul Python yang dibutuhkan.'
      }
    ],
    examples: [
      {
        title: 'Mencari satu username di seluruh situs',
        cmd: 'python sherlock username_target'
      },
      {
        title: 'Hanya tampilkan platform yang ditemukan',
        cmd: 'python sherlock --only-found username_target'
      },
      {
        title: 'Simpan hasil pencarian ke file teks',
        cmd: 'python sherlock -o hasil_stalker.txt username_target'
      }
    ],
    tips: 'Gunakan koneksi internet yang stabil atau VPN jika ada beberapa platform yang menerapkan rate-limiting.'
  },
  {
    id: 'theharvester',
    name: 'TheHarvester',
    category: 'osint',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-envelope-open-text',
    shortDesc: 'Kumpulkan email, subdomain, IP publik, dan nama karyawan dari target domain.',
    longDesc: 'Tool pengumpul informasi publik pasif (passive reconnaissance) yang memanfaatkan berbagai search engine (Google, Bing, Yahoo, DuckDuckGo, Hunter.io, LinkedIn) untuk mengumpulkan data intelijen organisasi.',
    tags: ['Email Recon', 'Subdomain', 'OSINT', 'Domain'],
    rootRequired: false,
    quickCommand: 'pkg install python git -y && git clone https://github.com/laramies/theHarvester',
    dependencies: ['python', 'git'],
    steps: [
      {
        title: 'Install Paket Pendukung',
        cmd: 'pkg install python git clang make libxml2 libxslt -y',
        note: 'Library XML diperlukan oleh theHarvester.'
      },
      {
        title: 'Clone & Install theHarvester',
        cmd: 'git clone https://github.com/laramies/theHarvester.git && cd theHarvester && pip install -r requirements/base.txt',
        note: 'Instalasi paket Python pendukung.'
      }
    ],
    examples: [
      {
        title: 'Cari email & subdomain dari Google & Bing',
        cmd: 'python theHarvester.py -d targetdomain.com -l 200 -b google,bing'
      },
      {
        title: 'Kumpulkan informasi menggunakan semua sumber',
        cmd: 'python theHarvester.py -d targetdomain.com -b all -f hasil_recon.html'
      }
    ],
    tips: 'Hasil recon sangat berguna pada tahap awal penetration testing untuk memetakan permukaan serangan (attack surface).'
  },
  {
    id: 'whois-dns',
    name: 'Whois & Dnsutils',
    category: 'osint',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-globe-americas',
    shortDesc: 'Cek data kepemilikan domain, registrar, nameserver, dan DNS records (A, MX, TXT).',
    longDesc: 'Paket utilitas diagnostik domain standar internet. Menampilkan kontak pendaftar domain, tanggal kedaluwarsa, serta rekaman DNS lengkap seperti mail exchange dan SPF records.',
    tags: ['Whois', 'DNS', 'Dig', 'Host'],
    rootRequired: false,
    quickCommand: 'pkg install whois dnsutils -y',
    dependencies: ['whois', 'dnsutils'],
    steps: [
      {
        title: 'Install Paket Whois & Dnsutils',
        cmd: 'pkg install whois dnsutils -y',
        note: 'Menyediakan perintah whois, dig, host, dan nslookup.'
      }
    ],
    examples: [
      {
        title: 'Cek identitas pemilik & registrar domain',
        cmd: 'whois google.com'
      },
      {
        title: 'Cek DNS record menggunakan Dig',
        cmd: 'dig targetdomain.com ANY'
      },
      {
        title: 'Cek Mail Server (MX Record)',
        cmd: 'host -t mx targetdomain.com'
      }
    ],
    tips: 'Gunakan `dig +short domain.com` untuk mendapatkan alamat IP secara instan dan bersih.'
  },
  {
    id: 'ip-tracer',
    name: 'IP-Tracer',
    category: 'osint',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-location-dot',
    shortDesc: 'Lacak informasi geografis, ISP, negara, kota, dan zona waktu dari alamat IP target.',
    longDesc: 'IP-Tracer mempermudah pencarian detail geolocation IP publik dengan antarmuka terminal yang ramah pemula dan informatif.',
    tags: ['IP Tracker', 'GeoLocation', 'ISP', 'Tracer'],
    rootRequired: false,
    quickCommand: 'pkg install git -y && git clone https://github.com/rajkumardusad/IP-Tracer.git',
    dependencies: ['git', 'php', 'curl'],
    steps: [
      {
        title: 'Install Git & PHP',
        cmd: 'pkg install git php -y',
        note: 'Dibutuhkan untuk menjalankan skrip IP-Tracer.'
      },
      {
        title: 'Download & Setup IP-Tracer',
        cmd: 'git clone https://github.com/rajkumardusad/IP-Tracer.git && cd IP-Tracer && chmod +x install && sh install',
        note: 'Menjalankan skrip installer lokal.'
      }
    ],
    examples: [
      {
        title: 'Lacak IP target tertentu',
        cmd: 'trace -t 8.8.8.8'
      },
      {
        title: 'Cek informasi IP publik Anda sendiri saat ini',
        cmd: 'trace -m'
      }
    ],
    tips: 'Ingat bahwa geolocation berbasis IP hanya menunjukkan lokasi server/gateway penyedia ISP, bukan lokasi koordinat GPS fisik seseorang secara presisi.'
  },

  // --- KATEGORI: AUDIT & KEAMANAN (PENTEST) ---
  {
    id: 'sqlmap',
    name: 'SQLMap (Automatic SQL Injection)',
    category: 'pentest',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-database',
    shortDesc: 'Deteksi dan eksploitasi otomatis celah keamanan SQL Injection pada aplikasi web.',
    longDesc: 'SQLMap adalah alat uji penetrasi sumber terbuka yang mengotomatiskan proses mendeteksi dan memanfaatkan kerentanan SQL injection serta mengambil alih basis data server yang rentan.',
    tags: ['SQL Injection', 'Database', 'Pentest', 'Web Security'],
    rootRequired: false,
    quickCommand: 'pkg install python git -y && git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git',
    dependencies: ['python', 'git'],
    steps: [
      {
        title: 'Install Python & Git',
        cmd: 'pkg install python git -y',
        note: 'Pastikan python sudah terpasang.'
      },
      {
        title: 'Download SQLMap',
        cmd: 'git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git',
        note: 'Mengunduh repositori versi terbaru.'
      },
      {
        title: 'Buat Perintah Pintas (Alias)',
        cmd: 'echo "alias sqlmap=\'python ~/sqlmap/sqlmap.py\'" >> ~/.bashrc && source ~/.bashrc',
        note: 'Agar Anda bisa mengetik "sqlmap" langsung dari folder mana saja.'
      }
    ],
    examples: [
      {
        title: 'Uji kerentanan URL dengan parameter GET',
        cmd: 'sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1" --batch'
      },
      {
        title: 'Dapatkan daftar database (Enumerasi DBMS)',
        cmd: 'sqlmap -u "http://target.com/page?id=1" --dbs'
      },
      {
        title: 'Tampilkan tabel dari database tertentu',
        cmd: 'sqlmap -u "http://target.com/page?id=1" -D namadb --tables'
      }
    ],
    tips: 'Gunakan hanya pada situs web uji coba resmi seperti vulnweb.com atau aplikasi milik sendiri yang memiliki izin tertulis.'
  },
  {
    id: 'hydra',
    name: 'THC-Hydra (Fast Login Cracker)',
    category: 'pentest',
    difficulty: 'Lanjutan',
    difficultyColor: 'red',
    icon: 'fa-key',
    shortDesc: 'Alat penguji kekuatan kata sandi jaringan tercepat untuk protokol SSH, FTP, HTTP, dan Telnet.',
    longDesc: 'Hydra adalah alat audit keamanan yang mendukung serangan kamus (dictionary attack) paralel multi-thread pada lebih dari 50 protokol jaringan untuk menguji ketahanan otentikasi kata sandi sistem.',
    tags: ['Bruteforce', 'Audit Password', 'SSH', 'FTP'],
    rootRequired: false,
    quickCommand: 'pkg install hydra -y',
    dependencies: ['openssl', 'libssh'],
    steps: [
      {
        title: 'Install THC-Hydra di Termux',
        cmd: 'pkg install hydra -y',
        note: 'Tersedia langsung di repo resmi Termux.'
      }
    ],
    examples: [
      {
        title: 'Uji kekuatan password SSH server sendiri',
        cmd: 'hydra -l admin -P wordlist.txt 192.168.1.50 ssh -t 4'
      },
      {
        title: 'Uji login FTP dengan daftar user dan password',
        cmd: 'hydra -L users.txt -P passwords.txt 192.168.1.50 ftp'
      },
      {
        title: 'Uji HTTP Basic Authentication',
        cmd: 'hydra -l admin -P pass.txt 192.168.1.1 http-get /admin'
      }
    ],
    tips: 'Parameter `-t 4` membatasi thread simultan agar tidak membebani memori HP Android dan menghindari blokir IP firewall.'
  },
  {
    id: 'nikto',
    name: 'Nikto (Web Server Scanner)',
    category: 'pentest',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-shield-virus',
    shortDesc: 'Pemindai celah keamanan web server komprehensif untuk mendeteksi file berbahaya & server usang.',
    longDesc: 'Nikto menguji web server terhadap lebih dari 6700 file/program berbahaya potensial, versi server usang, serta masalah konfigurasi spesifik pada Apache, Nginx, IIS, dan lainnya.',
    tags: ['Web Vulnerability', 'Scanner', 'Perl', 'Audit'],
    rootRequired: false,
    quickCommand: 'pkg install perl git -y && git clone https://github.com/sullo/nikto.git',
    dependencies: ['perl', 'git'],
    steps: [
      {
        title: 'Install Perl & Git',
        cmd: 'pkg install perl git -y',
        note: 'Nikto ditulis dalam bahasa Perl.'
      },
      {
        title: 'Download Repositori Nikto',
        cmd: 'git clone https://github.com/sullo/nikto.git',
        note: 'Source code Nikto resmi.'
      }
    ],
    examples: [
      {
        title: 'Scan web server dasar',
        cmd: 'perl ~/nikto/program/nikto.pl -h http://example.com'
      },
      {
        title: 'Scan dengan port spesifik dan output HTML',
        cmd: 'perl ~/nikto/program/nikto.pl -h 192.168.1.10 -p 8080 -o report.html -F htm'
      }
    ],
    tips: 'Nikto bukan pemindai tersembunyi (stealthy). Aksesnya akan tercatat di log web server secara jelas.'
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    category: 'pentest',
    difficulty: 'Lanjutan',
    difficultyColor: 'red',
    icon: 'fa-skull-crossbones',
    shortDesc: 'Platform penetrasi keamanan paling lengkap untuk riset kerentanan dan pengujian exploit.',
    longDesc: 'Framework keamanan siber terlengkap di dunia. Memungkinkan peneliti keamanan untuk memverifikasi kerentanan perangkat lunak, membuat payload pengujian, dan melakukan simulasi serangan resmi.',
    tags: ['Exploit', 'Metasploit', 'Payload', 'Ruby'],
    rootRequired: false,
    quickCommand: 'pkg install metasploit -y',
    dependencies: ['ruby', 'postgresql', 'python'],
    steps: [
      {
        title: 'Aktifkan Repositori unstable/root jika diperlukan',
        cmd: 'pkg install metasploit -y',
        note: 'Ukuran instalasi cukup besar (~500MB+). Pastikan ruang penyimpanan internal HP Anda memiliki minimal 2GB kosong dan gunakan koneksi WiFi.'
      },
      {
        title: 'Jalankan Metasploit Console',
        cmd: 'msfconsole',
        note: 'Inisialisasi database PostgreSQL dan pemuatan modul exploit.'
      }
    ],
    examples: [
      {
        title: 'Cari modul exploit tertentu',
        cmd: 'search type:exploit platform:android'
      },
      {
        title: 'Gunakan modul auxiliary scanner port',
        cmd: 'use auxiliary/scanner/portscan/tcp; set RHOSTS 192.168.1.1; run'
      }
    ],
    tips: 'Jika paket metasploit tidak ditemukan di pkg standar, ganti repositori via `termux-change-repo` atau pasang melalui PRoot Kali Linux untuk kestabilan 100%.'
  },
  {
    id: 'routersploit',
    name: 'Routersploit (IoT Exploitation)',
    category: 'pentest',
    difficulty: 'Lanjutan',
    difficultyColor: 'red',
    icon: 'fa-wifi',
    shortDesc: 'Framework pengujian penetrasi khusus untuk router, modem, kamera IP, dan perangkat IoT.',
    longDesc: 'Mirip seperti Metasploit namun dirancang secara spesifik untuk mengevaluasi kerentanan firmware pada router rumahan, modem ISP, dan perangkat Internet of Things (IoT).',
    tags: ['Router', 'IoT', 'Exploit', 'WiFi'],
    rootRequired: false,
    quickCommand: 'pkg install python git -y && git clone https://github.com/threat9/routersploit',
    dependencies: ['python', 'git', 'clang'],
    steps: [
      {
        title: 'Install Dependensi',
        cmd: 'pkg install python git clang make libffi openssl -y',
        note: 'Menyiapkan modul compiler.'
      },
      {
        title: 'Clone & Pasang Routersploit',
        cmd: 'git clone https://github.com/threat9/routersploit && cd routersploit && pip install -r requirements.txt',
        note: 'Mengunduh dan memasang modul python.'
      },
      {
        title: 'Jalankan Console Routersploit',
        cmd: 'python rsf.py',
        note: 'Akan masuk ke prompt rsf >'
      }
    ],
    examples: [
      {
        title: 'Scan otomatis semua celah router WiFi lokal',
        cmd: 'use scanners/autopwn; set target 192.168.1.1; run'
      },
      {
        title: 'Uji kredensial default router',
        cmd: 'use creds/generic/default_http; set target 192.168.1.1; run'
      }
    ],
    tips: 'Sangat efektif untuk memverifikasi apakah router WiFi di rumah atau kantor Anda masih menggunakan password bawaan pabrik yang rentan.'
  },

  // --- KATEGORI: JARINGAN & SERVER ---
  {
    id: 'cloudflared',
    name: 'Cloudflared (Cloudflare Tunnel)',
    category: 'network',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-cloud',
    shortDesc: 'Expose web server lokal Termux ke internet publik secara gratis & aman tanpa port forwarding.',
    longDesc: 'Cloudflared membuat terowongan terenkripsi (encrypted tunnel) dari Termux langsung ke jaringan global Cloudflare. Anda bisa membagikan web project di Termux ke teman melalui link HTTPS resmi tanpa perlu IP publik statis atau setting router.',
    tags: ['Tunneling', 'Cloudflare', 'Port Forwarding', 'Web Dev'],
    rootRequired: false,
    quickCommand: 'pkg install cloudflared -y && cloudflared tunnel --url http://localhost:8080',
    dependencies: ['cloudflared'],
    steps: [
      {
        title: 'Install Cloudflared di Termux',
        cmd: 'pkg install cloudflared -y',
        note: 'Cloudflared resmi sekarang tersedia di repositori Termux.'
      },
      {
        title: 'Mulai Terowongan (Tunneling) Cepat',
        cmd: 'cloudflared tunnel --url http://localhost:8080',
        note: 'Akan menghasilkan URL publik acak berekstensi .trycloudflare.com yang langsung bisa dibuka siapa saja dari internet.'
      }
    ],
    examples: [
      {
        title: 'Expose web server port 3000',
        cmd: 'cloudflared tunnel --url http://localhost:3000'
      }
    ],
    tips: 'Solusi paling stabil dan gratis tanpa batasan kuota untuk showcase portfolio web yang dihosting dari HP Android!'
  },
  {
    id: 'ngrok',
    name: 'Ngrok',
    category: 'network',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-arrows-split-up-and-left',
    shortDesc: 'Layanan tunneling alternatif terpopuler untuk menghubungkan port lokal Termux ke internet.',
    longDesc: 'Ngrok menyediakan public URL instan untuk server lokal. Sangat sering digunakan untuk webhook testing, demo aplikasi, atau pengujian koneksi jaringan eksternal.',
    tags: ['Tunneling', 'Ngrok', 'Networking', 'Webhook'],
    rootRequired: false,
    quickCommand: 'pkg install nodejs -y && npm install -g ngrok',
    dependencies: ['curl', 'tar'],
    steps: [
      {
        title: 'Download Binary Ngrok untuk Android ARM',
        cmd: 'pkg install wget -y && wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.tgz',
        note: 'Sesuaikan arsitektur CPU ponsel Anda (arm64 untuk kebanyakan HP modern).'
      },
      {
        title: 'Ekstrak dan Pindahkan ke Direktori Bin',
        cmd: 'tar -xvzf ngrok-v3-stable-linux-arm64.tgz && mv ngrok $PREFIX/bin/ && chmod +x $PREFIX/bin/ngrok',
        note: 'Menjadikan ngrok sebagai perintah global.'
      },
      {
        title: 'Hubungkan Authtoken Akun Ngrok Anda',
        cmd: 'ngrok config add-authtoken TOKEN_ANDA_DARI_NGROK_COM',
        note: 'Daftar gratis di ngrok.com untuk mengambil auth token pribadi.'
      }
    ],
    examples: [
      {
        title: 'Membuka akses port web 8080 ke internet',
        cmd: 'ngrok http 8080'
      },
      {
        title: 'Membuka terowongan TCP (contoh: SSH port 8022)',
        cmd: 'ngrok tcp 8022'
      }
    ],
    tips: 'Ngrok memiliki web inspector lokal di http://localhost:4040 untuk menganalisis traffic request HTTP secara live.'
  },
  {
    id: 'openssh',
    name: 'OpenSSH (Remote Terminal)',
    category: 'network',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-network-wired',
    shortDesc: 'Akses dan ketik perintah Termux HP Anda dari layar lebar laptop / PC melalui koneksi SSH.',
    longDesc: 'Bekerja mengetik di keyboard HP sering kali melelahkan. Dengan OpenSSH, Anda bisa menyulap Termux menjadi SSH server dan mengontrolnya dari Windows PowerShell, macOS, atau Linux menggunakan keyboard & monitor penuh.',
    tags: ['SSH', 'Remote', 'Server', 'Productivity'],
    rootRequired: false,
    quickCommand: 'pkg install openssh -y && passwd && sshd',
    dependencies: ['openssh'],
    steps: [
      {
        title: 'Install OpenSSH di Termux',
        cmd: 'pkg install openssh -y',
        note: 'Menginstal klien dan server SSH.'
      },
      {
        title: 'Atur Password Login Termux',
        cmd: 'passwd',
        note: 'Ketik password baru untuk akun Termux Anda (ketikan tidak terlihat di layar demi keamanan).'
      },
      {
        title: 'Cek Username dan IP HP Anda',
        cmd: 'whoami && ifconfig wlan0',
        note: 'Catat username (misal: u0_a234) dan IP lokal HP (misal: 192.168.1.15).'
      },
      {
        title: 'Mulai SSH Server Termux',
        cmd: 'sshd',
        note: 'Port default SSH di Termux adalah 8022 (BUKAN 22!).'
      }
    ],
    examples: [
      {
        title: 'Perintah koneksi dari Laptop (PowerShell / Terminal)',
        cmd: 'ssh u0_a234@192.168.1.15 -p 8022'
      },
      {
        title: 'Matikan SSH server jika sudah selesai',
        cmd: 'pkill sshd'
      }
    ],
    tips: 'Pastikan HP dan Laptop terhubung ke satu jaringan WiFi yang sama saat menghubungkan SSH lokal.'
  },
  {
    id: 'nginx-server',
    name: 'Nginx / Apache Web Server',
    category: 'network',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-server',
    shortDesc: 'Jalankan web server HTTP performa tinggi langsung dari dalam HP Android Anda.',
    longDesc: 'Nginx adalah salah satu web server paling cepat di dunia. Di Termux, Nginx bisa digunakan untuk menghosting website statis HTML/CSS/JS, API backend lokal, atau sharing file unduhan melalui browser.',
    tags: ['Web Server', 'Nginx', 'Hosting', 'HTTP'],
    rootRequired: false,
    quickCommand: 'pkg install nginx -y && nginx',
    dependencies: ['nginx'],
    steps: [
      {
        title: 'Install Nginx di Termux',
        cmd: 'pkg install nginx -y',
        note: 'Pemasangan paket Nginx resmi.'
      },
      {
        title: 'Jalankan Web Server Nginx',
        cmd: 'nginx',
        note: 'Server aktif di port 8080 secara default.'
      },
      {
        title: 'Buka di Browser Ponsel',
        cmd: 'Buka browser Chrome di HP dan ketik: http://localhost:8080',
        note: 'Akan muncul halaman "Welcome to nginx!".'
      }
    ],
    examples: [
      {
        title: 'Lokasi root folder dokumen web default',
        cmd: 'cd $PREFIX/share/nginx/html && ls'
      },
      {
        title: 'Hentikan server Nginx',
        cmd: 'nginx -s stop'
      },
      {
        title: 'Reload konfigurasi setelah edit file',
        cmd: 'nginx -s reload'
      }
    ],
    tips: 'Anda bisa menaruh template web HTML apa saja ke folder `$PREFIX/share/nginx/html` dan web Anda langsung tayang di jaringan lokal!'
  },
  {
    id: 'netcat',
    name: 'Netcat (nc) & Socat',
    category: 'network',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-plug',
    shortDesc: 'Pisau lipat serbaguna untuk koneksi socket TCP/UDP, port listener, dan transfer file raw.',
    longDesc: 'Netcat dijuluki sebagai "Swiss-army knife" jaringan. Berguna untuk mendengarkan port (listener), membaca & mengirim data mentah melalui soket jaringan, serta debugging konektivitas server.',
    tags: ['Netcat', 'Socket', 'TCP', 'Listener'],
    rootRequired: false,
    quickCommand: 'pkg install netcat-openbsd -y',
    dependencies: ['netcat-openbsd'],
    steps: [
      {
        title: 'Install Netcat OpenBSD di Termux',
        cmd: 'pkg install netcat-openbsd -y',
        note: 'Tersedia langsung di repo resmi.'
      }
    ],
    examples: [
      {
        title: 'Membuka listener port di HP pada port 4444',
        cmd: 'nc -lvnp 4444'
      },
      {
        title: 'Menghubungkan ke server dan port target',
        cmd: 'nc -vn 192.168.1.1 80'
      },
      {
        title: 'Chat sederhana antar 2 terminal di WiFi',
        cmd: 'HP 1: nc -l 5000 | HP 2: nc 192.168.1.10 5000'
      }
    ],
    tips: 'Sangat sering digunakan sebagai reverse shell receiver saat mempraktikkan lab keamanan jaringan.'
  },

  // --- KATEGORI: MULTIMEDIA & TRIK KEREN ---
  {
    id: 'yt-dlp',
    name: 'yt-dlp (Media & Video Downloader)',
    category: 'media',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-download',
    shortDesc: 'Download video dan audio dari YouTube, TikTok, Instagram, Twitter tanpa watermark dalam resolusi terbaik.',
    longDesc: 'yt-dlp adalah cabang penerus terbaik dari youtube-dl dengan kecepatan unduh luar biasa, dukungan untuk ribuan situs streaming, konversi otomatis audio MP3, dan kemampuan memilih kualitas video (1080p, 2K, 4K).',
    tags: ['YouTube', 'Downloader', 'Video', 'MP3'],
    rootRequired: false,
    quickCommand: 'pkg install python ffmpeg -y && pip install yt-dlp',
    dependencies: ['python', 'ffmpeg'],
    steps: [
      {
        title: 'Beri Izin Penyimpanan & Pasang Dependensi',
        cmd: 'termux-setup-storage && pkg install python ffmpeg -y',
        note: 'FFmpeg diperlukan untuk menggabungkan stream video dan audio resolusi tinggi.'
      },
      {
        title: 'Install yt-dlp via PIP',
        cmd: 'pip install yt-dlp',
        note: 'Mengunduh versi mutakhir dari PyPI.'
      }
    ],
    examples: [
      {
        title: 'Download video resolusi terbaik langsung ke folder Download HP',
        cmd: 'yt-dlp -P "~/storage/shared/Download" "https://www.youtube.com/watch?v=VIDEO_ID"'
      },
      {
        title: 'Download hanya audio dan ubah otomatis ke MP3',
        cmd: 'yt-dlp -x --audio-format mp3 -P "~/storage/shared/Download" "URL_VIDEO"'
      },
      {
        title: 'Download playlist lengkap',
        cmd: 'yt-dlp --yes-playlist -P "~/storage/shared/Download" "URL_PLAYLIST"'
      }
    ],
    tips: 'Perbarui yt-dlp secara berkala dengan `pip install --upgrade yt-dlp` agar selalu kompatibel dengan algoritma YouTube terbaru.'
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg Audio & Video Swiss Army',
    category: 'media',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-film',
    shortDesc: 'Kompres ukuran video, potong durasi, ekstrak audio, dan ubah format file multimedia.',
    longDesc: 'Tool multimedia paling berdaya di dunia komputasi. Anda bisa memotong video besar, menurunkan ukuran file video WhatsApp tanpa merusak kualitas, atau mengekstrak lagu dari video klip langsung di HP tanpa aplikasi pihak ketiga berisi iklan.',
    tags: ['FFmpeg', 'Video Editor', 'Kompres Video', 'Audio'],
    rootRequired: false,
    quickCommand: 'pkg install ffmpeg -y',
    dependencies: ['ffmpeg'],
    steps: [
      {
        title: 'Install FFmpeg di Termux',
        cmd: 'pkg install ffmpeg -y',
        note: 'Mendukung decoding dan encoding h264, h265/hevc, aac, mp3, opus.'
      }
    ],
    examples: [
      {
        title: 'Kompres ukuran video tanpa kehilangan kualitas drastis',
        cmd: 'ffmpeg -i video_asli.mp4 -vcodec libx264 -crf 28 video_hemat.mp4'
      },
      {
        title: 'Ekstrak suara dari video menjadi MP3 murni',
        cmd: 'ffmpeg -i video.mp4 -vn -ar 44100 -ac 2 -ab 192k audio.mp3'
      },
      {
        title: 'Potong video dari detik ke-10 sepanjang 30 detik',
        cmd: 'ffmpeg -ss 00:00:10 -i input.mp4 -to 00:00:40 -c copy output_potong.mp4'
      }
    ],
    tips: 'Penggunaan `-c copy` memotong video secara instan tanpa re-encoding (hanya butuh 1 detik!).'
  },
  {
    id: 'termux-api',
    name: 'Termux:API (Kontrol Hardware Android)',
    category: 'media',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-mobile-screen-button',
    shortDesc: 'Akses sensor kamera, getar, baterai, flash lampu, SMS, dan lokasi GPS HP via script terminal.',
    longDesc: 'Paket integrasi mendalam yang menghubungkan skrip bash/python di Termux dengan komponen hardware sistem Android. Anda bisa membuat script otomatisasi seperti mengambil foto saat alarm berbunyi, cek status baterai, hingga kirim SMS.',
    tags: ['Hardware', 'Sensor', 'Kamera', 'Baterai', 'Otomasi'],
    rootRequired: false,
    quickCommand: 'pkg install termux-api -y',
    dependencies: ['termux-api'],
    steps: [
      {
        title: 'Pasang Aplikasi APK Termux:API dari F-Droid',
        cmd: 'Buka F-Droid, cari aplikasi "Termux:API" dan pasang.',
        note: 'PENTING: Tanda tangan APK harus sama dengan aplikasi Termux utama yang terinstal.'
      },
      {
        title: 'Install Paket CLI Termux-API',
        cmd: 'pkg install termux-api -y',
        note: 'Menyediakan perintah command-line pendukung.'
      }
    ],
    examples: [
      {
        title: 'Getarkan ponsel selama 1 detik',
        cmd: 'termux-vibrate -d 1000'
      },
      {
        title: 'Cek persentase dan suhu baterai ponsel (format JSON)',
        cmd: 'termux-battery-status'
      },
      {
        title: 'Nyalakan lampu senter / flash HP',
        cmd: 'termux-torch on # Matikan dengan: termux-torch off'
      },
      {
        title: 'Ambil foto diam-diam lewat kamera depan',
        cmd: 'termux-camera-photo -c 1 ~/storage/shared/Download/selfie.jpg'
      },
      {
        title: 'Ubah teks jadi suara speaker (Text to Speech)',
        cmd: 'termux-tts-speak "Halo kawan, selamat datang di Termux Tools Hub"'
      }
    ],
    tips: 'Semua output dari termux-api mengembalikan format JSON murni, sangat mudah diolah dengan tool `jq` atau Python.'
  },
  {
    id: 'cmatrix',
    name: 'CMatrix (Matrix Rain Effect)',
    category: 'media',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-cubes-stacked',
    shortDesc: 'Animasi digital hujan karakter hijau ikonik ala film The Matrix di terminal Anda.',
    longDesc: 'Efek visual terminal paling terkenal sepanjang masa. Membuat layar Termux Anda dipenuhi hujan karakter biner bercahaya hijau mengalir vertikal. Keren untuk screensaver dan pamer tampilan!',
    tags: ['Animasi', 'Matrix', 'Fun', 'Hacker Look'],
    rootRequired: false,
    quickCommand: 'pkg install cmatrix -y && cmatrix',
    dependencies: ['ncurses'],
    steps: [
      {
        title: 'Install CMatrix',
        cmd: 'pkg install cmatrix -y',
        note: 'Instalasi cepat dalam hitungan detik.'
      },
      {
        title: 'Jalankan Efek Matrix',
        cmd: 'cmatrix',
        note: 'Tekan "q" untuk keluar dari animasi.'
      }
    ],
    examples: [
      {
        title: 'Ubah warna menjadi Cyan atau Merah',
        cmd: 'cmatrix -C cyan # atau: cmatrix -C red'
      },
      {
        title: 'Hujan matrix dengan mode karakter tebal (bold)',
        cmd: 'cmatrix -b'
      },
      {
        title: 'Mode pelangi warna-warni',
        cmd: 'cmatrix -r'
      }
    ],
    tips: 'Saat animasi berjalan, Anda bisa menekan tombol angka 0-9 untuk mengatur kecepatan scroll secara realtime!'
  },
  {
    id: 'sl-train',
    name: 'SL (Steam Locomotive)',
    category: 'media',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-train-subway',
    shortDesc: 'Kereta api uap ASCII melintas di layar jika Anda salah ketik perintah `ls` menjadi `sl`.',
    longDesc: 'Program lelucon klasik Linux. Saat Anda terburu-buru dan typo mengetik "sl" alih-alih perintah list file "ls", sebuah lokomotif uap berasap akan melintas membelah layar terminal Anda!',
    tags: ['Animasi', 'Fun', 'Joke', 'Typo'],
    rootRequired: false,
    quickCommand: 'pkg install sl -y && sl',
    dependencies: ['ncurses'],
    steps: [
      {
        title: 'Install SL di Termux',
        cmd: 'pkg install sl -y',
        note: 'Paket ringan penghibur saat coding.'
      },
      {
        title: 'Jalankan Kereta',
        cmd: 'sl',
        note: 'Saksikan lokomotif uap melintasi terminal.'
      }
    ],
    examples: [
      {
        title: 'Kereta api terbang (bintang jatuh)',
        cmd: 'sl -F'
      },
      {
        title: 'Kereta lebih kecil dan lebih cepat',
        cmd: 'sl -l'
      }
    ],
    tips: 'Kombinasikan dengan perintah lain untuk mengejutkan teman yang meminjam HP Anda!'
  },
  {
    id: 'figlet-toilet',
    name: 'Figlet, Toilet & Lolcat (Banner Maker)',
    category: 'media',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-font',
    shortDesc: 'Buat teks banner seni ASCII berukuran besar dengan gradasi warna pelangi neon.',
    longDesc: 'Figlet dan Toilet mengonversi teks biasa menjadi huruf banner ASCII raksasa. Jika disalurkan (pipe) ke Lolcat, banner tersebut akan diberi gradasi spektrum warna pelangi yang memukau.',
    tags: ['ASCII Art', 'Banner', 'Lolcat', 'Styling'],
    rootRequired: false,
    quickCommand: 'pkg install figlet toilet ruby -y && gem install lolcat',
    dependencies: ['ruby'],
    steps: [
      {
        title: 'Install Figlet, Toilet & Ruby',
        cmd: 'pkg install figlet toilet ruby -y',
        note: 'Ruby dibutuhkan untuk memasang tool lolcat.'
      },
      {
        title: 'Install Lolcat via Ruby Gem',
        cmd: 'gem install lolcat',
        note: 'Memberi efek gradasi pelangi pada teks terminal.'
      }
    ],
    examples: [
      {
        title: 'Bikin banner teks warna pelangi',
        cmd: 'figlet "TERMUX ID" | lolcat'
      },
      {
        title: 'Bikin banner font 3D dengan Toilet',
        cmd: 'toilet -f future "CYBER" -F metal'
      },
      {
        title: 'Pasang banner otomatis di awal terminal',
        cmd: 'echo "figlet TERMUX | lolcat" >> ~/.bashrc'
      }
    ],
    tips: 'Ada puluhan jenis font figlet tambahan yang bisa diunduh gratis untuk mempercantik tampilan login Termux.'
  },

  // --- KATEGORI: ALL-IN-ONE & INSTALLER ---
  {
    id: 'tool-x',
    name: 'Tool-X (370+ Tools All-in-One Installer)',
    category: 'allinone',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-toolbox',
    shortDesc: 'Koleksi menu interaktif berisi 370+ tools hacking & utilitas yang siap diinstal dengan 1 klik.',
    longDesc: 'Tool-X dibuat oleh Rajkumardusad untuk memudahkan pengguna Termux menginstal ratusan tools penetration testing tanpa perlu mengetik URL git clone satu per satu. Cukup ketik nomor tool yang diinginkan di menu.',
    tags: ['All-in-One', 'Menu', 'Installer', 'Koleksi'],
    rootRequired: false,
    quickCommand: 'pkg install git -y && git clone https://github.com/rajkumardusad/Tool-X.git',
    dependencies: ['git', 'python'],
    steps: [
      {
        title: 'Install Git di Termux',
        cmd: 'pkg install git -y',
        note: 'Menyiapkan git untuk clone repositori.'
      },
      {
        title: 'Clone & Jalankan Skrip Installer Tool-X',
        cmd: 'git clone https://github.com/rajkumardusad/Tool-X.git && cd Tool-X && chmod +x install && sh install',
        note: 'Proses setup otomatis akan membuat shortcut perintah "Tool-X".'
      },
      {
        title: 'Buka Menu Tool-X',
        cmd: 'Tool-X',
        note: 'Pilih opsi nomor 1 untuk melihat semua 370+ tools yang tersedia.'
      }
    ],
    examples: [
      {
        title: 'Melihat kategori tools di Tool-X',
        cmd: 'Ketik "1" untuk Show All Tools, "2" untuk Tool Categories'
      },
      {
        title: 'Update database Tool-X ke versi terbaru',
        cmd: 'Ketik "0" di dalam menu utama Tool-X'
      }
    ],
    tips: 'Jangan instal semua 370 tools sekaligus karena akan menghabiskan ruang memori HP. Pilih hanya tools yang benar-benar Anda butuhkan!'
  },
  {
    id: 'lazymux',
    name: 'Lazymux (Easy Cyber Tools)',
    category: 'allinone',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-couch',
    shortDesc: 'Menu instalasi otomatis puluhan tool populer yang dikelompokkan berdasarkan kategori.',
    longDesc: 'Lazymux dirancang bagi pemula yang tidak ingin menghafal perintah terminal yang panjang. Dilengkapi pengelompokan rapi: Information Gathering, Vulnerability Scanner, Stress Testing, Password Attacks, dan Exploitation.',
    tags: ['Lazymux', 'Menu', 'Kategori', 'Pemula'],
    rootRequired: false,
    quickCommand: 'pkg install python git -y && git clone https://github.com/Gameye98/Lazymux',
    dependencies: ['python', 'git'],
    steps: [
      {
        title: 'Install Python & Git',
        cmd: 'pkg install python git -y',
        note: 'Kebutuhan runtime Lazymux.'
      },
      {
        title: 'Download Lazymux',
        cmd: 'git clone https://github.com/Gameye98/Lazymux.git && cd Lazymux',
        note: 'Masuk ke folder proyek.'
      },
      {
        title: 'Jalankan Lazymux',
        cmd: 'python lazymux.py',
        note: 'Pilih nomor menu yang ingin Anda pelajari.'
      }
    ],
    examples: [
      {
        title: 'Jalankan menu Lazymux',
        cmd: 'python ~/Lazymux/lazymux.py'
      }
    ],
    tips: 'Setiap tool yang diinstal lewat Lazymux akan tersimpan di direktori home Anda (`~`).'
  },
  {
    id: 'gh-cli',
    name: 'GitHub CLI (gh)',
    category: 'dasar',
    difficulty: 'Menengah',
    difficultyColor: 'blue',
    icon: 'fa-brands fa-github',
    shortDesc: 'Kelola repositori GitHub, Pull Request, Issues, dan Gist langsung dari terminal Android.',
    longDesc: 'Klien resmi GitHub untuk command line. Sangat mempermudah developer dalam membuat repo baru, clone repo private menggunakan token SSH/OAuth, membuat issue, dan push commit tanpa perlu membuka browser.',
    tags: ['GitHub', 'Git', 'CLI', 'Developer'],
    rootRequired: false,
    quickCommand: 'pkg install gh -y && gh auth login',
    dependencies: ['gh', 'git'],
    steps: [
      {
        title: 'Install GitHub CLI di Termux',
        cmd: 'pkg install gh git -y',
        note: 'Tersedia langsung di repo resmi Termux.'
      },
      {
        title: 'Login ke Akun GitHub Anda',
        cmd: 'gh auth login',
        note: 'Pilih opsi "GitHub.com" -> protokol "HTTPS" -> Authenticate via browser/one-time code.'
      }
    ],
    examples: [
      {
        title: 'Buat repositori baru langsung di GitHub dari Termux',
        cmd: 'gh repo create nama-repo --public --source=. --push'
      },
      {
        title: 'Clone repo private milik Anda sendiri',
        cmd: 'gh repo clone username/nama-projek'
      }
    ],
    tips: 'Setelah login dengan `gh auth login`, semua operasi `git push` dan `git pull` tidak akan meminta username & password lagi.'
  },
  {
    id: 'micro-editor',
    name: 'Micro Text Editor',
    category: 'dasar',
    difficulty: 'Pemula',
    difficultyColor: 'green',
    icon: 'fa-file-lines',
    shortDesc: 'Editor teks terminal modern yang ramah pemula dengan dukungan mouse sentuh & tombol Ctrl+S.',
    longDesc: 'Bagi pemula, Nano atau Vim sering kali membingungkan. Micro adalah editor teks terminal modern dengan shortcut intuitif standar (Ctrl+S untuk Simpan, Ctrl+Q untuk Keluar, Ctrl+C untuk Salin) dan mendukung sentuhan layar HP!',
    tags: ['Editor', 'Coding', 'Nano', 'Vim'],
    rootRequired: false,
    quickCommand: 'pkg install micro -y && micro nama_file.py',
    dependencies: ['micro'],
    steps: [
      {
        title: 'Install Micro Editor',
        cmd: 'pkg install micro -y',
        note: 'Editor teks berbobot ringan namun sarat fitur.'
      }
    ],
    examples: [
      {
        title: 'Buka atau buat file skrip baru',
        cmd: 'micro script.py'
      },
      {
        title: 'Jadikan micro sebagai editor default sistem',
        cmd: 'echo "export EDITOR=micro" >> ~/.bashrc'
      }
    ],
    tips: 'Anda bisa menyentuh layar sentuh HP Anda langsung untuk memindahkan kursor atau memilih teks di dalam Micro editor!'
  }
];

// Data Panduan & Troubleshooting Umum Termux
const TERMUX_GUIDES = [
  {
    id: 'f-droid-vs-playstore',
    title: 'Wajib Tahu: Kenapa Jangan Download Termux dari Play Store?',
    category: 'Dasar Penting',
    icon: 'fa-triangle-exclamation',
    content: `
      <p>Banyak pemula mengalami error <em>"Repository under maintenance"</em> atau <em>"404 Not Found"</em> karena menginstal Termux dari <strong>Google Play Store</strong>.</p>
      <div class="alert-box alert-warning">
        <strong>PENTING:</strong> Versi Termux di Google Play Store sudah <strong>DEPRECATED (Dihentikan sejak 2020)</strong> karena kebijakan baru Android SDK Google Play.
      </div>
      <h4>Solusi Benar:</h4>
      <ol>
        <li>Hapus (Uninstall) Termux versi Play Store dari HP Anda.</li>
        <li>Unduh aplikasi <strong>F-Droid</strong> di <a href="https://f-droid.org" target="_blank" class="glow-link">f-droid.org</a> atau unduh file APK Termux langsung dari <a href="https://github.com/termux/termux-app/releases" target="_blank" class="glow-link">GitHub Resmi Termux</a>.</li>
        <li>Instal APK Termux dari F-Droid / GitHub.</li>
        <li>Buka Termux dan jalankan <code>pkg update && pkg upgrade</code>. Repositori akan bekerja 100% normal!</li>
      </ol>
    `
  },
  {
    id: 'fix-repo-404',
    title: 'Cara Mengatasi Error Repository 404 / Failed to Fetch',
    category: 'Troubleshooting',
    icon: 'fa-wrench',
    content: `
      <p>Jika saat menjalankan <code>pkg update</code> muncul error mirror repository tidak bisa diakses, gunakan perintah resmi pengubah mirror:</p>
      <pre><code>termux-change-repo</code></pre>
      <h4>Langkah-langkah:</h4>
      <ol>
        <li>Ketik <code>termux-change-repo</code> di terminal.</li>
        <li>Pilih repositori yang ingin diganti (Main repository, Root, X11) dengan tombol Spasi lalu tekan Enter.</li>
        <li>Pilih server mirror alternatif seperti <strong>"Mirrors by A1batross"</strong> atau <strong>"Grimler"</strong> atau <strong>"BFSU"</strong>.</li>
        <li>Tekan OK/Enter. Repositori akan otomatis sinkron kembali.</li>
      </ol>
    `
  },
  {
    id: 'shortcuts-keyboard',
    title: 'Tabel Tombol Pintasan (Keyboard Shortcuts) Wajib',
    category: 'Produktivitas',
    icon: 'fa-keyboard',
    content: `
      <p>Mengoperasikan terminal di HP jauh lebih cepat dengan menguasai tombol kombinasi berikut:</p>
      <div class="table-container">
        <table class="cyber-table">
          <thead>
            <tr>
              <th>Kombinasi Tombol</th>
              <th>Fungsi Utama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Ctrl + C</code></td>
              <td>Hentikan paksa proses yang sedang berjalan (Interrupt signal).</td>
            </tr>
            <tr>
              <td><code>Ctrl + Z</code></td>
              <td>Tangguhkan (suspend) proses ke background.</td>
            </tr>
            <tr>
              <td><code>Ctrl + L</code> atau <code>clear</code></td>
              <td>Bersihkan tampilan layar terminal dari teks lama.</td>
            </tr>
            <tr>
              <td><code>TAB</code></td>
              <td>Auto-complete nama perintah atau file secara otomatis.</td>
            </tr>
            <tr>
              <td><code>Volume Bawah + C</code></td>
              <td>Sama dengan fungsi Ctrl + C (jika keyboard tidak punya tombol Ctrl).</td>
            </tr>
            <tr>
              <td><code>Volume Atas + Q</code></td>
              <td>Tampilkan / sembunyikan baris tombol ekstra (ESC, TAB, CTRL, ALT, Panah).</td>
            </tr>
            <tr>
              <td><code>Volume Atas + W</code></td>
              <td>Panah ATAS (melihat riwayat perintah sebelumnya).</td>
            </tr>
            <tr>
              <td><code>Volume Atas + S</code></td>
              <td>Panah BAWAH.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: 'storage-permission',
    title: 'Cara Akses & Pindahkan File Antara HP dan Termux',
    category: 'Penyimpanan',
    icon: 'fa-folder-tree',
    content: `
      <p>Secara default, file di dalam Termux berada di folder internal aplikasi yang tersembunyi. Agar bisa memindahkan file hasil download / script ke folder yang terlihat di File Manager HP (seperti folder Download):</p>
      <ol>
        <li>Jalankan perintah: <pre><code>termux-setup-storage</code></pre></li>
        <li>Klik tombol <strong>Izinkan / Allow</strong> pada notifikasi popup Android.</li>
        <li>Termux akan membuat folder pintasan di <code>~/storage/shared</code> yang mengarah langsung ke memori internal HP Anda.</li>
      </ol>
      <h4>Contoh Praktis:</h4>
      <ul>
        <li>Pindahkan file hasil script ke folder Download HP:
          <pre><code>cp hasil.txt ~/storage/shared/Download/</code></pre>
        </li>
        <li>Jalankan script Python yang ada di folder Download HP:
          <pre><code>python ~/storage/shared/Download/myscript.py</code></pre>
        </li>
      </ul>
    `
  },
  {
    id: 'why-tools-fail',
    title: '⚠️ Mengapa Banyak Tools Termux Tidak Work? (Solusi Lengkap 2026)',
    category: 'Solusi Utama',
    icon: 'fa-triangle-exclamation',
    content: `
      <div class="alert-box alert-danger">
        <strong>4 PENYEBAB UTAMA TOOLS TERMUX ERROR / GAGAL:</strong>
      </div>
      <ol>
        <li>
          <strong>1. Menggunakan Termux versi Google Play Store (SUDAH MATI):</strong>
          <p>Jika Anda menginstal Termux dari Play Store, hampir semua perintah <code>pkg install</code> akan menghasilkan error <code>404 Not Found</code> atau <code>Repository is under maintenance</code>. Repositori Play Store sudah dimatikan sejak 2020 karena batasan kebijakan Google target SDK 29.</p>
          <p><span class="t-green t-bold">Solusinya:</span> Hapus Termux Play Store, lalu download dan instal Termux versi resmi dari <strong><a href="https://f-droid.org/en/packages/com.termux/" target="_blank" class="glow-link">F-Droid</a></strong> atau <strong><a href="https://github.com/termux/termux-app/releases" target="_blank" class="glow-link">GitHub Resmi Termux</a></strong>.</p>
        </li>
        <li>
          <strong>2. Error PIP / Python: "Building wheel for ... failed" atau "error: metadata-generation-failed":</strong>
          <p>Banyak tool Python (seperti Sherlock, SQLMap, bot script) membutuhkan compiler C/C++ dan pustaka enkripsi agar modul Python bisa ter-compile di arsitektur HP (ARM64).</p>
          <p><span class="t-cyan t-bold">Solusinya (Jalankan paket build esensial):</span></p>
          <pre><code>pkg install python python-pip clang make libffi openssl rust libcrypt libxml2 libxslt -y</code></pre>
          <p>Jika masih gagal menginstall lewat <code>pip install -r requirements.txt</code>, tambahkan opsi build:</p>
          <pre><code>export CFLAGS="-Wno-error=incompatible-function-pointer-types"
pip install --upgrade pip wheel setuptools
pip install -r requirements.txt</code></pre>
        </li>
        <li>
          <strong>3. Termux Sering Force Close / Terhenti Sendiri di Android 12, 13, 14, 15+:</strong>
          <p>Android versi baru memiliki fitur penghemat baterai agresif bernama <em>"Phantom Process Killer"</em> yang otomatis mematikan proses Termux yang memakan CPU di background.</p>
          <p><span class="t-yellow t-bold">Solusinya:</span></p>
          <ul>
            <li>Masuk ke Pengaturan HP -> Aplikasi -> Termux -> Penggunaan Baterai -> Pilih <strong>"Tidak Dibatasi" (Unrestricted)</strong>.</li>
            <li>Kunci aplikasi Termux di menu Recent Apps agar tidak tertutup otomatis.</li>
            <li>Jika ada akses PC/ADB, matikan phantom killer dengan perintah:
              <pre><code>adb shell "/system/bin/device_config put activity_manager max_phantom_processes 2147483647"</code></pre>
            </li>
          </ul>
        </li>
        <li>
          <strong>4. Script GitHub Sudah Lawas (Author Tidak Update):</strong>
          <p>Banyak script hacker populer di internet dibuat bertahun-tahun lalu dan mengandalkan Python 2 yang sudah punah (EOL) atau API pihak ketiga yang sudah ditutup.</p>
          <p><span class="t-purple t-bold">Solusinya:</span> Selalu gunakan tool modern yang terdaftar di katalog website ini, atau gunakan <strong>PRoot Distro Ubuntu/Kali</strong> untuk menjalankan tool yang butuh lingkungan Linux penuh tanpa root:</p>
          <pre><code>pkg install proot-distro -y && proot-distro install ubuntu && proot-distro login ubuntu</code></pre>
        </li>
      </ol>
    `
  },
  {
    id: 'fix-pip-rust-error',
    title: 'Solusi Error "externally-managed-environment" & Pip di Termux Terbaru',
    category: 'Troubleshooting',
    icon: 'fa-wrench',
    content: `
      <p>Di versi Termux terbaru, Python menerapkan standar PEP 668 yang membatasi penggunaan <code>pip install</code> langsung di global environment untuk mencegah konflik paket sistem.</p>
      <h4>Cara Mengatasinya:</h4>
      <ol>
        <li><strong>Cara Cepat (Flag Break System Packages):</strong>
          <pre><code>pip install nama_paket --break-system-packages</code></pre>
        </li>
        <li><strong>Cara Bersih (Gunakan Virtual Environment):</strong>
          <pre><code>python -m venv myenv
source myenv/bin/activate
pip install nama_paket</code></pre>
        </li>
      </ol>
    `
  },
  {
    id: 'ethical-warning',
    title: 'Aturan Etika & Keamanan Penggunaan Tools (Wajib Dibaca)',
    category: 'Disclaimer',
    icon: 'fa-shield-halved',
    content: `
      <div class="alert-box alert-danger">
        <strong>PERINGATAN HUKUM & ETIKA (CYBER LAW):</strong>
        <p>Semua tools keamanan siber (Nmap, SQLMap, Hydra, Metasploit, dll.) yang dirangkum di website ini disediakan semata-mata untuk <strong>tujuan edukasi, pembelajaran etikal hacking, audit keamanan sistem milik pribadi, atau pengujian yang telah memiliki izin tertulis resmi</strong>.</p>
      </div>
      <p>Melakukan scanning, probing, atau penyerangan terhadap jaringan, server, atau perangkat orang lain tanpa persetujuan merupakan tindakan melanggar hukum (termasuk UU ITE di Indonesia dan undang-undang kejahatan siber internasional).</p>
      <p>Gunakanlah pengetahuan ini untuk memperkuat pertahanan dan menjadi pakar keamanan digital yang bertanggung jawab!</p>
    `
  }
];

// Database Perintah & Tools PowerShell / Windows Terminal
const POWERSHELL_DATA = {
  categories: [
    { id: 'all-ps', name: 'Semua PowerShell', icon: 'fa-cubes' },
    { id: 'package-mgr', name: 'Package Manager (Winget/Choco)', icon: 'fa-box' },
    { id: 'sysadmin', name: 'Sistem & Diagnosis', icon: 'fa-microchip' },
    { id: 'network-ps', name: 'Jaringan & Koneksi', icon: 'fa-network-wired' },
    { id: 'wsl-interop', name: 'WSL (Linux di Windows)', icon: 'fa-linux' },
    { id: 'security-ps', name: 'Keamanan & Port Audit', icon: 'fa-user-shield' }
  ],
  commands: [
    {
      id: 'winget-install',
      name: 'Winget (Windows Package Manager)',
      category: 'package-mgr',
      icon: 'fa-box-archive',
      difficulty: 'Pemula',
      shortDesc: 'Install software Windows otomatis tanpa buka browser atau klik wizard installer.',
      longDesc: 'Winget adalah package manager resmi bawaan Windows 10 & 11. Sangat cepat untuk menginstal ratusan aplikasi (Chrome, VSCode, Git, Python, Nmap) secara silent dan otomatis.',
      quickCommand: 'winget install -e --id Git.Git',
      examples: [
        { title: 'Cari aplikasi', cmd: 'winget search "visual studio code"' },
        { title: 'Update semua aplikasi terinstall di PC sekaligus', cmd: 'winget upgrade --all' },
        { title: 'Install Python 3', cmd: 'winget install -e --id Python.Python.3.12' },
        { title: 'Install Nmap di Windows', cmd: 'winget install Insecure.Nmap' }
      ],
      equivalentTermux: 'pkg install <nama_paket>'
    },
    {
      id: 'choco-scoop',
      name: 'Chocolatey & Scoop Package Manager',
      category: 'package-mgr',
      icon: 'fa-cookie-bite',
      difficulty: 'Menengah',
      shortDesc: 'Alternatif manajer paket Windows terpopuler untuk developer & sysadmin.',
      longDesc: 'Scoop dan Chocolatey memungkinkan instalasi CLI tools portabel ke direktori user tanpa popup UAC admin.',
      quickCommand: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm get.scoop.sh | iex',
      examples: [
        { title: 'Install Scoop', cmd: 'iwr -useb get.scoop.sh | iex' },
        { title: 'Install tools via Scoop', cmd: 'scoop install curl git 7zip neofetch' },
        { title: 'Install Chocolatey (Admin)', cmd: 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))' }
      ],
      equivalentTermux: 'pkg install / apt install'
    },
    {
      id: 'wsl-setup',
      name: 'WSL 2 (Windows Subsystem for Linux)',
      category: 'wsl-interop',
      icon: 'fa-linux',
      difficulty: 'Menengah',
      shortDesc: 'Jalankan Ubuntu / Kali Linux langsung di samping Windows dengan performa native.',
      longDesc: 'WSL 2 menghadirkan kernel Linux asli di dalam Windows 10/11. Anda bisa menjalankan Kali Linux atau Ubuntu dengan GUI dan semua tool Termux/Linux secara native!',
      quickCommand: 'wsl --install -d Ubuntu',
      examples: [
        { title: 'Install WSL dengan Kali Linux', cmd: 'wsl --install -d kali-linux' },
        { title: 'Cek daftar distro yang terpasang', cmd: 'wsl -l -v' },
        { title: 'Masuk ke terminal Linux', cmd: 'wsl' },
        { title: 'Update kernel WSL', cmd: 'wsl --update' }
      ],
      equivalentTermux: 'proot-distro install ubuntu'
    },
    {
      id: 'test-netconnection',
      name: 'Test-NetConnection (TNC) / Port Ping',
      category: 'network-ps',
      icon: 'fa-satellite-dish',
      difficulty: 'Pemula',
      shortDesc: 'Pengganti modern untuk Telnet & Ping di Windows untuk cek port terbuka & rute trace.',
      longDesc: 'Cmdlet bawaan PowerShell untuk memeriksa apakah server/web tertentu aktif dan apakah port spesifik (seperti 80, 443, 22, 3389) terbuka.',
      quickCommand: 'Test-NetConnection google.com -Port 443',
      examples: [
        { title: 'Cek port web HTTPS', cmd: 'Test-NetConnection scanme.nmap.org -Port 80' },
        { title: 'Cek port SSH server', cmd: 'Test-NetConnection 192.168.1.1 -Port 22' },
        { title: 'Trace rute jaringan (Traceroute)', cmd: 'Test-NetConnection 8.8.8.8 -TraceRoute' }
      ],
      equivalentTermux: 'nc -zv <host> <port> / ping'
    },
    {
      id: 'get-process-service',
      name: 'Get-Process & Stop-Process (Task Manager CLI)',
      category: 'sysadmin',
      icon: 'fa-gears',
      difficulty: 'Pemula',
      shortDesc: 'Pantau penggunaan RAM, CPU, dan bunuh program yang hang melalui CLI.',
      longDesc: 'Perintah PowerShell untuk melihat daftar aplikasi yang memakan resource terbesar dan mematikannya seketika.',
      quickCommand: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10',
      examples: [
        { title: 'Cari proses tertentu (misal: chrome)', cmd: 'Get-Process -Name chrome' },
        { title: 'Hentikan proses yang macet', cmd: 'Stop-Process -Name notepad -Force' },
        { title: 'Lihat status layanan Windows (Services)', cmd: 'Get-Service | Where-Object {$_.Status -eq "Running"}' }
      ],
      equivalentTermux: 'top / htop / ps aux / kill'
    },
    {
      id: 'get-netstat-ports',
      name: 'Get-NetTCPConnection (Netstat Modern)',
      category: 'security-ps',
      icon: 'fa-network-wired',
      difficulty: 'Menengah',
      shortDesc: 'Deteksi port listening dan koneksi mencurigakan di PC Windows Anda.',
      longDesc: 'Cmdlet untuk mengaudit port jaringan komputer yang sedang terbuka (LISTENING) beserta PID aplikasi yang membukanya, krusial untuk analisis keamanan malware atau trojan.',
      quickCommand: 'Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess',
      examples: [
        { title: 'Cari aplikasi pemilik port tertentu', cmd: 'Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess' },
        { title: 'Lihat semua koneksi aktif internet', cmd: 'Get-NetTCPConnection -State Established' }
      ],
      equivalentTermux: 'netstat -tulnp / ss -tulwn'
    },
    {
      id: 'get-clipboard-history',
      name: 'Get-Clipboard & Set-Clipboard',
      category: 'sysadmin',
      icon: 'fa-paste',
      difficulty: 'Pemula',
      shortDesc: 'Interaksi clipboard langsung dari pipeline terminal PowerShell.',
      longDesc: 'Ambil atau kirim data teks dari/ke clipboard Windows secara otomatis.',
      quickCommand: 'Get-Process | Set-Clipboard',
      examples: [
        { title: 'Kirim IP publik ke clipboard', cmd: '(Invoke-RestMethod ipinfo.io/ip) | Set-Clipboard' },
        { title: 'Baca teks yang sedang dicopy', cmd: 'Get-Clipboard' }
      ],
      equivalentTermux: 'termux-clipboard-get / termux-clipboard-set'
    },
    {
      id: 'invoke-webrequest-ps',
      name: 'Invoke-WebRequest & Invoke-RestMethod (Curl PS)',
      category: 'network-ps',
      icon: 'fa-globe',
      difficulty: 'Pemula',
      shortDesc: 'Download file dari internet dan request REST API layaknya curl/wget.',
      longDesc: 'Cmdlet bawaan PowerShell untuk interaksi web, download installer, dan parsing respons JSON dari API.',
      quickCommand: 'Invoke-RestMethod -Uri "https://api.github.com/repos/termux/termux-app" | Select-Object name, description, stargazers_count',
      examples: [
        { title: 'Download file langsung', cmd: 'Invoke-WebRequest -Uri "https://example.com/file.zip" -OutFile "file.zip"' },
        { title: 'Cek IP Publik Anda', cmd: 'Invoke-RestMethod -Uri "https://ipinfo.io/json"' }
      ],
      equivalentTermux: 'curl -s / wget'
    },
    {
      id: 'execution-policy',
      name: 'Set-ExecutionPolicy (Izin Menjalankan Script .ps1)',
      category: 'security-ps',
      icon: 'fa-shield-halved',
      difficulty: 'Pemula',
      shortDesc: 'Aktifkan izin eksekusi script PowerShell jika muncul error "running scripts is disabled".',
      longDesc: 'Windows secara default memblokir eksekusi script .ps1 pihak ketiga. Perintah ini memberikan izin aman bagi user saat ini.',
      quickCommand: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser',
      examples: [
        { title: 'Bypass izin sementara di sesi terminal saat ini', cmd: 'powershell -ExecutionPolicy Bypass -File .\\script.ps1' },
        { title: 'Cek status kebijakan saat ini', cmd: 'Get-ExecutionPolicy -List' }
      ],
      equivalentTermux: 'chmod +x script.sh'
    }
  ],
  comparisonTable: [
    { termux: 'pkg install <pkg>', ps: 'winget install <id> / scoop install <pkg>', desc: 'Menginstal aplikasi / paket' },
    { termux: 'pkg update && pkg upgrade', ps: 'winget upgrade --all', desc: 'Memperbarui semua software di sistem' },
    { termux: 'ls -la', ps: 'Get-ChildItem -Force / dir', desc: 'Melihat isi folder beserta file tersembunyi' },
    { termux: 'pwd', ps: 'Get-Location / pwd', desc: 'Menampilkan direktori kerja saat ini' },
    { termux: 'clear / ctrl+l', ps: 'Clear-Host / cls', desc: 'Membersihkan layar terminal' },
    { termux: 'cat file.txt', ps: 'Get-Content file.txt / type', desc: 'Membaca isi file teks' },
    { termux: 'grep "teks" file', ps: 'Select-String -Path file -Pattern "teks"', desc: 'Mencari teks atau pola regex' },
    { termux: 'curl wttr.in', ps: 'Invoke-RestMethod wttr.in / curl.exe wttr.in', desc: 'Request HTTP / cuaca di terminal' },
    { termux: 'ps aux / top', ps: 'Get-Process / tasklist', desc: 'Melihat proses yang berjalan di komputer' },
    { termux: 'kill -9 <PID>', ps: 'Stop-Process -Id <PID> -Force', desc: 'Menghentikan proses secara paksa' },
    { termux: 'proot-distro install ubuntu', ps: 'wsl --install -d Ubuntu', desc: 'Menjalankan Linux lengkap di dalam sistem' },
    { termux: 'termux-setup-storage', ps: 'cd C:\\Users\\$env:USERNAME', desc: 'Akses folder user / internal' }
  ]
};
