document.addEventListener('DOMContentLoaded', () => {

    function updateClock() {
        const clockEl = document.getElementById('real-clock');
        if (clockEl) {
            const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const timeStr = new Date().toLocaleTimeString('id-ID', options);
            clockEl.innerText = `${timeStr} WIB`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    const mainLinks = [
        { title: "TIKTOK", url: "https://tiktok.com/@nimzz_bocil_pokemon", icon: "ph-tiktok-logo" },
        { title: "TELEGRAM", url: "https://t.me/Nimzz4", icon: "ph-telegram-logo" },
        { title: "GITHUB", url: "https://github.com/NimzzMihate", icon: "ph-github-logo" },
        { title: "WHATSAPP", url: "https://wa.me/6282137487477", icon: "ph-whatsapp-logo" },
        { title: "WA_CHANNEL", url: "https://whatsapp.com/channel/0029VbBhZWdGJP8HlbGaE63Q", icon: "ph-broadcast" },
        { title: "WA_GROUP_BOT", url: "https://chat.whatsapp.com/KoP1P1JnKUTCdxVRestOIZ", icon: "ph-users" }
    ];

    const waifuLinks = [
        { title: "CHITOSE", url: "./halaman2/chitose.html", icon: "ph-heart" },
        { title: "SAKAYANAGI", url: "./halaman2/sakayanagi.html", icon: "ph-crown" }
    ];

    const playlist = [
        { title: "DJ PARTY WITH A JAGABAN REMIX", artist: "FEXD RMX", src: "./src/lagu6.mp3" },
        { title: "DJ DIANTARA SENYUMANMU", artist: "-", src: "./src/lagu5.mp3" },
        { title: "DJ DIA MASALALU MU AKU MASA DEPAN MU", artist: "-", src: "./src/lagu4.mp3" },
        { title: "I'm Still Standing", artist: "Elton John", src: "./src/lagu3.mp3" },
        { title: "Kings & Queens (TikTok Ver)", artist: "-", src: "./src/lagu2.mp3" },
        { title: "It's My Life X Mashup", artist: "DJ NANSUYA", src: "./src/lagu1.mp3" }
    ];

    const audio = document.getElementById('audio-element');
    const btnPlay = document.getElementById('btn-play');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const progressBar = document.getElementById('progress');
    const progCont = document.getElementById('progress-container');
    const trackNameUI = document.getElementById('track-name');
    const trackArtistUI = document.getElementById('track-artist');
    const playlistUI = document.getElementById('playlist-list');
    const timeCurrent = document.getElementById('time-current');
    const timeTotal = document.getElementById('time-total');
    const spectrum = document.getElementById('spectrum');
    const albumImg = document.getElementById('album-img');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    let currentTrack = 0, isPlaying = false;

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "00:00";
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function initPlaylist() {
        if (!playlistUI) return;
        playlistUI.innerHTML = "";
        playlist.forEach((track, i) => {
            const div = document.createElement('div');
            div.className = `track-item ${i === currentTrack ? 'active' : ''}`;
            div.onclick = () => { currentTrack = i; loadSong(i); togglePlay(true); };
            div.innerHTML = `
                <div class="text-[10px] text-gray-600 font-mono">${(i + 1).toString().padStart(2, '0')}</div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-white truncate track-title">${track.title}</div>
                    <div class="text-[9px] text-gray-500 font-mono">${track.artist}</div>
                </div>
                <i class="ph ph-play-circle text-gray-700"></i>
            `;
            playlistUI.appendChild(div);
        });
    }

    function loadSong(idx) {
        if (trackNameUI) trackNameUI.innerText = playlist[idx].title;
        if (trackArtistUI) trackArtistUI.innerText = playlist[idx].artist;
        if (audio) {
            audio.src = playlist[idx].src;
            audio.load();
            if (progressBar) progressBar.style.width = '0%';
            if (timeCurrent) timeCurrent.innerText = "00:00";
            if (timeTotal) timeTotal.innerText = "00:00";
        }
        initPlaylist();
    }

    function togglePlay(forcePlay = false) {
        if (!audio || !btnPlay) return;
        if (isPlaying && !forcePlay) {
            audio.pause();
            btnPlay.innerHTML = '<i class="ph-fill ph-play text-2xl ml-1"></i>';
            if (spectrum) spectrum.classList.remove('playing');
            if (albumImg) albumImg.classList.remove('playing');
            isPlaying = false;
        } else {
            audio.play().catch(err => {
                printCLI("<span class='text-red-500'>[ERR] Autoplay diblokir. Tekan play manual.</span>");
            });
            btnPlay.innerHTML = '<i class="ph-fill ph-pause text-2xl"></i>';
            if (spectrum) spectrum.classList.add('playing');
            if (albumImg) albumImg.classList.add('playing');
            isPlaying = true;
        }
    }

    if (btnPlay) btnPlay.addEventListener('click', () => togglePlay());
    if (btnNext) btnNext.addEventListener('click', () => { currentTrack = (currentTrack + 1) % playlist.length; loadSong(currentTrack); togglePlay(true); });
    if (btnPrev) btnPrev.addEventListener('click', () => { currentTrack = (currentTrack - 1 + playlist.length) % playlist.length; loadSong(currentTrack); togglePlay(true); });

    if (audio) {
        audio.addEventListener('loadedmetadata', () => {
            if (timeTotal && audio.duration && isFinite(audio.duration)) {
                timeTotal.innerText = formatTime(audio.duration);
            }
        });
        audio.addEventListener('timeupdate', () => {
            if (audio.duration && isFinite(audio.duration)) {
                const percent = (audio.currentTime / audio.duration) * 100;
                if (progressBar) progressBar.style.width = percent + '%';
                if (timeCurrent) timeCurrent.innerText = formatTime(audio.currentTime);
                if (timeTotal && (timeTotal.innerText === "00:00" || timeTotal.innerText.includes("NaN"))) {
                    timeTotal.innerText = formatTime(audio.duration);
                }
            }
        });
        audio.addEventListener('ended', () => { if (btnNext) btnNext.click(); });
    }

    if (progCont) {
        progCont.addEventListener('click', (e) => {
            if (audio && audio.duration && isFinite(audio.duration)) {
                const rect = progCont.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                audio.currentTime = (clickX / rect.width) * audio.duration;
            }
        });
    }

    function printCLI(text, isAI = false) {
        if (!cliOutput) return;
        const p = document.createElement('p');
        p.className = isAI ? "text-blue-300" : "";
        cliOutput.appendChild(p);
        if (isAI) {
            const chars = Array.from(text);
            let i = 0, currentText = "";
            const interval = setInterval(() => {
                currentText += chars[i];
                p.innerHTML = `Claude: ${currentText}<span class="animate-pulse">_</span>`;
                i++;
                if (i >= chars.length) {
                    clearInterval(interval);
                    p.innerHTML = `Claude: ${currentText}`;
                    cliOutput.scrollTop = cliOutput.scrollHeight;
                }
            }, 20);
        } else {
            p.innerHTML = text;
        }
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    async function fetchClaudeAPI(query) {
        const loadingId = "load-" + Date.now();
        if (cliOutput) {
            const pLoad = document.createElement('p');
            pLoad.id = loadingId;
            pLoad.className = "text-blue-500 italic opacity-70 animate-pulse";
            pLoad.innerHTML = "Claude is thinking...";
            cliOutput.appendChild(pLoad);
            cliOutput.scrollTop = cliOutput.scrollHeight;
        }
        try {
            const response = await fetch(`https://api.nexray.web.id/ai/claude?text=${encodeURIComponent(query)}`);
            const data = await response.json();
            const loadEl = document.getElementById(loadingId);
            if (loadEl) loadEl.remove();
            if (data.status && data.result) {
                printCLI(data.result, true);
            } else {
                printCLI("<span class='text-red-500'>[ERR] API mengembalikan status error.</span>");
            }
        } catch (error) {
            const loadEl = document.getElementById(loadingId);
            if (loadEl) loadEl.remove();
            printCLI("<span class='text-red-500'>[ERR] Gagal terhubung ke API (Server down/CORS).</span>");
        }
    }

    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = cliInput.value.trim();
                const valLower = val.toLowerCase();
                cliInput.value = "";
                if (!val) return;
                printCLI(`<span class=\"text-white\">guest@nimzz:~$</span> ${val}`);
                if (valLower.startsWith("claude ") || valLower.startsWith("ai ")) {
                    const cmdLength = valLower.startsWith("claude ") ? 7 : 3;
                    const query = val.substring(cmdLength).trim();
                    if (!query) {
                        printCLI("<span class='text-red-500'>[ERR] Masukkan pesan. Contoh: claude siapa kamu?</span>");
                    } else { fetchClaudeAPI(query); }
                    return;
                }
                switch (valLower) {
                    case 'help':
                        printCLI("Commands: <br><span class='text-[#00ff41]'>claude [pesan]</span> : Chat API Claude<br><span class='text-[#00ff41]'>play</span> : Putar lagu<br><span class='text-[#00ff41]'>next / prev</span> : Ganti lagu<br><span class='text-[#00ff41]'>spotify</span> : Buka list lagu<br><span class='text-[#00ff41]'>about</span> : Tentang Nimzz<br><span class='text-[#00ff41]'>neofetch</span> : Info sistem<br><span class='text-[#00ff41]'>clear</span> : Bersihkan layar");
                        break;
                    case 'about':
                        printCLI("System Bio Data:<br><span class='text-green-code'>Nama:</span> Muhammad Na'im<br><span class='text-green-code'>Kelas:</span> X (10) SMK<br><span class='text-green-code'>Jurusan:</span> TKJ<br>Saya hanya seorang coding dan editor Alight Motion.");
                        break;
                    case 'clear':
                        if (cliOutput) cliOutput.innerHTML = "";
                        break;
                    case 'play':
                        togglePlay();
                        break;
                    case 'next':
                        if (btnNext) btnNext.click();
                        break;
                    case 'prev':
                        if (btnPrev) btnPrev.click();
                        break;
                    case 'spotify':
                        if (playlistUI) playlistUI.scrollTop = 0;
                        printCLI("Membuka playlist musik...");
                        break;
                    case 'neofetch':
                        printCLI("<span class='text-green-code'>OS:</span> Nimzz_Core_v5<br><span class='text-green-code'>AI:</span> Claude by NexRay<br><span class='text-green-code'>Host:</span> Vercel_Network");
                        break;
                    case 'sudo su':
                        printCLI("<span class='text-red-500'>[ACCESS DENIED] User is not in the sudoers file.</span>");
                        break;
                    default:
                        printCLI(`bash: ${valLower}: command not found. Ketik 'help'.`);
                }
            }
        });
    }

    try {
        const lCont = document.getElementById('links-container');
        const wCont = document.getElementById('waifu-container');
        if (lCont) {
            mainLinks.forEach((l, i) => {
                lCont.innerHTML += `<a href="${l.url}" target="_blank" class="link-item flex items-center gap-2" style="animation-delay: ${i * 0.1}s"><i class="ph ${l.icon} text-lg"></i> ${l.title}</a>`;
            });
        }
        if (wCont) {
            waifuLinks.forEach((w, i) => {
                wCont.innerHTML += `<a href="${w.url}" class="link-item flex items-center gap-2 border-pink-900/30 text-pink-200" style="animation-delay: ${(mainLinks.length + i) * 0.1}s"><i class="ph-fill ${w.icon} text-lg"></i> ${w.title}</a>`;
            });
        }
        initPlaylist();
        loadSong(0);
    } catch (err) {
        console.warn("Minor render error, bypassing...");
    }

    setTimeout(() => {
        const skeleton = document.getElementById('skeleton-ui');
        const mainUI = document.getElementById('main-ui');
        if (skeleton) skeleton.classList.add('hide-skeleton');
        if (mainUI) mainUI.classList.add('show-content');
        let headerTxt = "root@nimzz:~/home", hIdx = 0;
        const hElem = document.getElementById('header-typing');
        if (hElem) {
            const hInterval = setInterval(() => {
                hElem.innerHTML = headerTxt.slice(0, hIdx) + "_";
                hIdx++;
                if (hIdx > headerTxt.length) { clearInterval(hInterval); hElem.innerHTML = headerTxt; }
            }, 100);
        }
        document.querySelectorAll('.link-item').forEach(el => el.classList.add('link-animate'));
    }, 1500);

});