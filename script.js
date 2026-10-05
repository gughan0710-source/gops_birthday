/**
 * Interactive Birthday Surprise Experience
 * Theme: Warm Yellow, Gold & Cream
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. CONFIGURATION & URL PERSONALIZATION
    // ==========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get('name') || urlParams.get('to') || 'My special girl💛';
    const customSender = urlParams.get('from') || '';

    // Update personalized names in DOM
    const nameDisplays = [
        document.getElementById('welcome-name-display'),
        document.getElementById('celebration-name-display')
    ];
    nameDisplays.forEach(el => {
        if (el) {
            el.textContent = customName.endsWith('💛') ? customName : `${customName} 💛`;
        }
    });

    const letterSalutation = document.querySelector('.letter-salutation');
    if (letterSalutation) {
        letterSalutation.textContent = `Dear ${customName},`;
    }

    if (customSender) {
        const letterSig = document.querySelector('.letter-signature');
        if (letterSig) {
            letterSig.textContent = `With love, ${customSender} 💛`;
        }
    }

    // ==========================================================================
    // 2. STATE MANAGEMENT
    // ==========================================================================
    const state = {
        currentScene: 1,
        totalScenes: 9,
        isUnlocked: false,
        cardsUnlocked: false,
        candleBlown: false,
        giftOpened: false,
        envelopeOpened: false,
        currentCardIndex: 0,
        musicPlaying: false,
        audioContext: null
    };

    // Personal message cards deck data
    const cardsData = [
        {
            text: "chloo....💝 unna naan expect eh pannala da 👀, aana nee vandha timing mattum perfect 🌼, yadhuvum plan pannama, slow ah en life-la  oru beautiful part aayita..!💛",
            icon: "✨"
        },
        {
            text: "Unkooda pesura sila nimishangal kooda enakku romba spcl da🧚🏻, Sometimes nee en kooda irundha podhum nu thonum chlo ... 🫴🏻 ",
            icon: "🌻"
        },
        {
            text: "Un smile, un voice, un presence,unkoda travel pandrathu ☃️,unkoda place explore pandrathu 🫂... idhellam enakku romba pudekum alaghu pulla ..🤍",
            icon: "💝"
        },
        {
            text: "alaghii ... namma Kochi poitu vanthathu remember panni paaren da 🫂,nee vera bus nan vera bus but explore pannathu yallame together ha ,angha nee ellana yanaku empty ha irunthurukum ....💛",
            icon: "🌟"
        },
        {
            text: "mhu..!! nee yevlo time miss u solleruka aana nee IV poitu clg vantha udane yanna parthu eyes-tears oda sonna --miss u💖-- ennum yanaku remember la iruku paithekare....!!",
            icon: "🫂"
        },
        {
            text: "Ammu👑 unkitta enna feel panrennu exact-ah words 🫧 la  enakku solla theriyala da 👉🏻... aana oru vishayam mattum romba sure en life-la evlo per vandhaalum 🫳🏻, evlo per ponaalum nee yanaku yapavum spcl mha..🩵",
            icon: "🎀"
        },
        {
            text: "Alaghii❣️....paithekaree🤌🏻..... chlooo💞.... alaghu pulla💖...Ivyyy....🩵 chlo yana maranthuratha.. ",
            icon: "💗"
        }
    ];

    // ==========================================================================
    // 3. AMBIENT PARTICLES ENGINE
    // ==========================================================================
    const particlesCanvas = document.getElementById('particles-canvas');
    const pCtx = particlesCanvas ? particlesCanvas.getContext('2d') : null;
    let particles = [];
    let pWidth = 0, pHeight = 0;

    function resizeParticlesCanvas() {
        if (!particlesCanvas) return;
        pWidth = particlesCanvas.width = window.innerWidth;
        pHeight = particlesCanvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor(pWidth * 0.05), 45);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * pWidth,
                y: Math.random() * pHeight,
                radius: Math.random() * 2.8 + 1,
                alpha: Math.random() * 0.6 + 0.2,
                speedY: Math.random() * 0.4 + 0.15,
                speedX: (Math.random() - 0.5) * 0.3,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02 + 0.01,
                color: Math.random() > 0.4 ? 'rgba(245, 184, 0, ' : 'rgba(255, 235, 150, '
            });
        }
    }

    function updateAndDrawParticles() {
        if (!pCtx) return;
        pCtx.clearRect(0, 0, pWidth, pHeight);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.wobble += p.wobbleSpeed;
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.wobble) * 0.3;

            // Loop back to bottom if off top
            if (p.y < -10) {
                p.y = pHeight + 10;
                p.x = Math.random() * pWidth;
            }
            if (p.x < -10) p.x = pWidth + 10;
            if (p.x > pWidth + 10) p.x = -10;

            const glow = Math.sin(p.wobble) * 0.2 + p.alpha;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            pCtx.fillStyle = p.color + Math.max(0.1, glow) + ')';
            pCtx.shadowColor = 'rgba(245, 184, 0, 0.4)';
            pCtx.shadowBlur = p.radius * 3;
            pCtx.fill();
        }

        requestAnimationFrame(updateAndDrawParticles);
    }

    if (particlesCanvas) {
        window.addEventListener('resize', () => {
            resizeParticlesCanvas();
            createParticles();
        });
        resizeParticlesCanvas();
        createParticles();
        requestAnimationFrame(updateAndDrawParticles);
    }

    // ==========================================================================
    // 4. CONFETTI ENGINE (Realistic 3D Physics)
    // ==========================================================================
    const confettiCanvas = document.getElementById('confetti-canvas');
    const cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
    let confettiList = [];
    let cWidth = 0, cHeight = 0;

    function resizeConfettiCanvas() {
        if (!confettiCanvas) return;
        cWidth = confettiCanvas.width = window.innerWidth;
        cHeight = confettiCanvas.height = window.innerHeight;
    }

    if (confettiCanvas) {
        window.addEventListener('resize', resizeConfettiCanvas);
        resizeConfettiCanvas();
    }

    const confettiColors = [
        '#F5B800', '#FFCA28', '#FFE082', '#FFF59D',
        '#FFFFFF', '#E65100', '#FFA000', '#FFF8E1'
    ];

    function createConfettiPiece(x, y, vx, vy, color) {
        return {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: Math.random() * 8 + 6,
            color: color || confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            tilt: Math.random() * 360,
            tiltSpeed: (Math.random() - 0.5) * 8,
            shape: Math.random() > 0.3 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star'),
            alpha: 1,
            gravity: 0.22,
            drag: 0.985
        };
    }

    function fireConfettiBurst(originX, originY, count = 75) {
        const x = originX !== undefined ? originX : window.innerWidth / 2;
        const y = originY !== undefined ? originY : window.innerHeight * 0.45;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 12 + 4;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - Math.random() * 4;
            confettiList.push(createConfettiPiece(x, y, vx, vy));
        }

        playSparkleSound();
    }

    function fireCannons() {
        // Left cannon
        for (let i = 0; i < 50; i++) {
            const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6;
            const speed = Math.random() * 16 + 8;
            confettiList.push(createConfettiPiece(
                0,
                window.innerHeight * 0.85,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            ));
        }
        // Right cannon
        for (let i = 0; i < 50; i++) {
            const angle = -3 * Math.PI / 4 + (Math.random() - 0.5) * 0.6;
            const speed = Math.random() * 16 + 8;
            confettiList.push(createConfettiPiece(
                window.innerWidth,
                window.innerHeight * 0.85,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            ));
        }
        playSparkleSound();
    }

    function updateAndDrawConfetti() {
        if (!cCtx) return;
        cCtx.clearRect(0, 0, cWidth, cHeight);

        for (let i = confettiList.length - 1; i >= 0; i--) {
            const c = confettiList[i];
            c.vx *= c.drag;
            c.vy *= c.drag;
            c.vy += c.gravity;
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotationSpeed;
            c.tilt += c.tiltSpeed;

            // Fade near bottom
            if (c.y > cHeight - 80) {
                c.alpha -= 0.02;
            }

            if (c.y > cHeight || c.alpha <= 0) {
                confettiList.splice(i, 1);
                continue;
            }

            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate((c.rotation * Math.PI) / 180);
            cCtx.scale(Math.cos((c.tilt * Math.PI) / 180), 1);
            cCtx.globalAlpha = Math.max(0, c.alpha);
            cCtx.fillStyle = c.color;

            if (c.shape === 'rect') {
                cCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else if (c.shape === 'circle') {
                cCtx.beginPath();
                cCtx.arc(0, 0, c.size / 3, 0, Math.PI * 2);
                cCtx.fill();
            } else {
                // Little sparkle star
                cCtx.beginPath();
                for (let s = 0; s < 5; s++) {
                    cCtx.lineTo(Math.cos((18 + s * 72) * 0.01745) * c.size * 0.6, -Math.sin((18 + s * 72) * 0.01745) * c.size * 0.6);
                    cCtx.lineTo(Math.cos((54 + s * 72) * 0.01745) * c.size * 0.25, -Math.sin((54 + s * 72) * 0.01745) * c.size * 0.25);
                }
                cCtx.closePath();
                cCtx.fill();
            }

            cCtx.restore();
        }

        requestAnimationFrame(updateAndDrawConfetti);
    }

    if (confettiCanvas) {
        requestAnimationFrame(updateAndDrawConfetti);
    }

    // Global Confetti Action: trigger celebration confetti burst on genuine tap/click anywhere on the website (ignoring scroll drags)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let lastGlobalTapTime = 0;

    document.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        pointerStartX = e.clientX !== undefined ? e.clientX : 0;
        pointerStartY = e.clientY !== undefined ? e.clientY : 0;
        pointerStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('pointerup', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        const now = performance.now();
        if (now - lastGlobalTapTime < 80) return; // Prevent duplicate triggers on synthetic multi-events

        const clientX = e.clientX !== undefined ? e.clientX : pointerStartX;
        const clientY = e.clientY !== undefined ? e.clientY : pointerStartY;
        const moveDist = Math.hypot(clientX - pointerStartX, clientY - pointerStartY);
        const duration = now - pointerStartTime;

        // Only fire confetti if it was a genuine tap/click, not a scroll or swipe gesture
        if (moveDist < 10 && duration < 500) {
            lastGlobalTapTime = now;
            const x = clientX || window.innerWidth / 2;
            const y = clientY || window.innerHeight / 2;
            fireConfettiBurst(x, y, 32);
        }
    }, { passive: true });

    // ==========================================================================
    // 5. WEB AUDIO SYNTHESIZER (Music Box Birthday Melody & SFX)
    // ==========================================================================
    const bgAudioElement = document.getElementById('bg-audio');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const audioLabel = document.getElementById('audio-label');

    if (bgAudioElement) {
        bgAudioElement.loop = true;
        bgAudioElement.volume = 0.75;
    }

    let isSynthesizerActive = false;
    let melodyTimeoutId = null;

    function getAudioContext() {
        if (!state.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                state.audioContext = new AudioContextClass();
            }
        }
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
        return state.audioContext;
    }

    // Play chime note (music box timbre)
    function playChimeNote(frequency, startTime, duration = 0.8, volume = 0.15) {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        // Sine base + gentle overtone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);

        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(frequency * 2, startTime);

        // Music box bell envelope: fast attack, exponential decay
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        oscHarmonic.start(startTime);

        osc.stop(startTime + duration);
        oscHarmonic.stop(startTime + duration);
    }

    // Happy Birthday melody in C Major (Notes & Beats)
    const HAPPY_BIRTHDAY_NOTES = [
        // "Hap-py birth-day to you"
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'A4', dur: 0.65, pause: 0.1 },
        { note: 'G4', dur: 0.65, pause: 0.1 },
        { note: 'C5', dur: 0.65, pause: 0.1 },
        { note: 'B4', dur: 1.10, pause: 0.4 },

        // "Hap-py birth-day to you"
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'A4', dur: 0.65, pause: 0.1 },
        { note: 'G4', dur: 0.65, pause: 0.1 },
        { note: 'D5', dur: 0.65, pause: 0.1 },
        { note: 'C5', dur: 1.10, pause: 0.4 },

        // "Hap-py birth-day dear friend"
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'G4', dur: 0.35, pause: 0.1 },
        { note: 'G5', dur: 0.70, pause: 0.1 },
        { note: 'E5', dur: 0.70, pause: 0.1 },
        { note: 'C5', dur: 0.70, pause: 0.1 },
        { note: 'B4', dur: 0.70, pause: 0.1 },
        { note: 'A4', dur: 1.10, pause: 0.4 },

        // "Hap-py birth-day to you"
        { note: 'F5', dur: 0.35, pause: 0.1 },
        { note: 'F5', dur: 0.35, pause: 0.1 },
        { note: 'E5', dur: 0.70, pause: 0.1 },
        { note: 'C5', dur: 0.70, pause: 0.1 },
        { note: 'D5', dur: 0.70, pause: 0.1 },
        { note: 'C5', dur: 1.40, pause: 1.2 }
    ];

    const NOTE_FREQS = {
        'G4': 392.00,
        'A4': 440.00,
        'B4': 493.88,
        'C5': 523.25,
        'D5': 587.33,
        'E5': 659.25,
        'F5': 698.46,
        'G5': 783.99
    };

    function scheduleMelodyLoop() {
        if (!state.musicPlaying) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        let currentTime = ctx.currentTime + 0.1;

        HAPPY_BIRTHDAY_NOTES.forEach(item => {
            const freq = NOTE_FREQS[item.note];
            if (freq) {
                playChimeNote(freq, currentTime, item.dur, 0.12);
                // Add soft lower octave bass chord on strong beats
                if (item.dur >= 0.7) {
                    playChimeNote(freq * 0.5, currentTime, item.dur * 1.2, 0.08);
                }
            }
            currentTime += item.dur + item.pause;
        });

        const loopDurationMs = (currentTime - ctx.currentTime) * 1000;
        melodyTimeoutId = setTimeout(() => {
            if (state.musicPlaying) {
                scheduleMelodyLoop();
            }
        }, Math.max(1000, loopDurationMs));
    }

    function startMusic() {
        state.musicPlaying = true;
        if (audioToggleBtn) {
            audioToggleBtn.classList.add('playing');
            if (audioLabel) audioLabel.textContent = 'Pause';
        }

        // Try playing the audio file if available
        if (bgAudioElement) {
            bgAudioElement.play().then(() => {
                isSynthesizerActive = false;
            }).catch(() => {
                // Fallback to beautiful built-in Web Audio chime synthesizer
                isSynthesizerActive = true;
                scheduleMelodyLoop();
            });
        } else {
            isSynthesizerActive = true;
            scheduleMelodyLoop();
        }
    }

    function stopMusic() {
        state.musicPlaying = false;
        if (audioToggleBtn) {
            audioToggleBtn.classList.remove('playing');
            if (audioLabel) audioLabel.textContent = 'Music';
        }
        if (bgAudioElement) {
            bgAudioElement.pause();
        }
        if (melodyTimeoutId) {
            clearTimeout(melodyTimeoutId);
            melodyTimeoutId = null;
        }
    }

    function toggleMusic() {
        if (state.musicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // Auto-start background music smoothly on first user interaction (browser policy compliant)
    const handleFirstMusicGesture = () => {
        if (!state.musicPlaying) {
            startMusic();
        }
        document.removeEventListener('click', handleFirstMusicGesture);
        document.removeEventListener('touchstart', handleFirstMusicGesture);
        document.removeEventListener('keydown', handleFirstMusicGesture);
    };
    document.addEventListener('click', handleFirstMusicGesture, { once: true });
    document.addEventListener('touchstart', handleFirstMusicGesture, { once: true });
    document.addEventListener('keydown', handleFirstMusicGesture, { once: true });

    // Sound FX
    let lastSparkleSoundTime = 0;
    function playSparkleSound() {
        const now = performance.now();
        if (now - lastSparkleSoundTime < 100) return;
        lastSparkleSoundTime = now;

        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        let t = ctx.currentTime;
        notes.forEach((f, i) => {
            playChimeNote(f, t + i * 0.06, 0.4, 0.08);
        });
    }

    function playBlowSound() {
        const ctx = getAudioContext();
        if (!ctx) return;
        // White noise puff for blowing candle
        const bufferSize = ctx.sampleRate * 0.35;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        setTimeout(playSparkleSound, 200);
    }

    function playPopSound() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    }

    // ==========================================================================
    // 6. SCENE TRANSITION SYSTEM
    // ==========================================================================
    const allScenes = document.querySelectorAll('.scene-card');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressStepIndicator = document.getElementById('progress-step-indicator');

    function updateProgress(step) {
        if (progressBarFill) {
            const percentage = ((step - 1) / (state.totalScenes - 1)) * 100;
            progressBarFill.style.width = `${percentage}%`;
        }
        if (progressStepIndicator) {
            progressStepIndicator.textContent = `Step ${step} of ${state.totalScenes}`;
        }
    }

    function relockSection7() {
        state.cardsUnlocked = false;
        const cardsLock = document.getElementById('cards-lock-view');
        const cardsDeck = document.getElementById('cards-deck-container');
        const cardsPasscode = document.getElementById('cards-secret-passcode');
        const cardsWrapper = document.getElementById('cards-passcode-input-wrapper');
        const cardsErrMsg = document.getElementById('cards-passcode-error-msg');
        const cardsBtn = document.getElementById('cards-unlock-btn');

        if (cardsLock) {
            cardsLock.classList.remove('unlocking');
            cardsLock.style.display = 'block';
        }
        if (cardsDeck) {
            cardsDeck.style.display = 'none';
        }
        if (cardsPasscode) {
            cardsPasscode.value = '';
        }
        if (cardsWrapper) {
            cardsWrapper.classList.remove('success', 'shake');
        }
        if (cardsErrMsg) {
            cardsErrMsg.textContent = '';
            cardsErrMsg.style.color = '';
        }
        if (cardsBtn) {
            cardsBtn.innerHTML = '<span>Unlock Notes</span><span class="btn-arrow">✨</span>';
            cardsBtn.disabled = false;
        }
        if (typeof renderCard === 'function') {
            renderCard(0);
        }
    }

    function goToScene(targetStep, direction = 'next') {
        if (!state.isUnlocked && targetStep > 1) return;
        if (targetStep < 1 || targetStep > state.totalScenes) return;

        // Whenever leaving Section 7 (backward or forward), automatically relock it
        if (state.currentScene === 7 && targetStep !== 7) {
            relockSection7();
        }

        const currentEl = document.querySelector(`.scene-card[data-step="${state.currentScene}"]`);
        const nextEl = document.querySelector(`.scene-card[data-step="${targetStep}"]`);

        if (!nextEl) return;

        // Animate out current scene
        if (currentEl) {
            currentEl.classList.remove('active');
            currentEl.classList.add(direction === 'next' ? 'exit-prev' : 'exit-next');
            setTimeout(() => {
                currentEl.classList.remove('exit-prev', 'exit-next');
            }, 500);
        }

        // Animate in next scene
        nextEl.classList.add('active');
        state.currentScene = targetStep;
        updateProgress(targetStep);

        // Scroll to top nicely
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger special effects per scene
        onSceneEnter(targetStep);
    }

    function onSceneEnter(step) {
        if (step === 9) {
            // Grand celebration finale
            setTimeout(fireCannons, 300);
            setTimeout(() => fireConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 80), 900);
            setTimeout(fireCannons, 1600);
        }
    }

    // ==========================================================================
    // 7. SPECIFIC SCENE INTERACTION HANDLERS
    // ==========================================================================

    // Scene 1: Lock Gate / Alphanumeric Passcode ("jsammu")
    const passcodeForm = document.getElementById('passcode-form');
    const secretPasscodeInput = document.getElementById('secret-passcode');
    const passcodeUnlockBtn = document.getElementById('passcode-unlock-btn');
    const passcodeInputWrapper = document.getElementById('passcode-input-wrapper');
    const passcodeErrorMsg = document.getElementById('passcode-error-msg');

    const SECRET_KEY = "jsammu";

    function verifyPassword() {
        if (!secretPasscodeInput) return;
        const entered = secretPasscodeInput.value.trim().toLowerCase();

        if (entered === SECRET_KEY) {
            state.isUnlocked = true;
            if (passcodeInputWrapper) {
                passcodeInputWrapper.classList.remove('shake');
                passcodeInputWrapper.classList.add('success');
            }
            if (passcodeErrorMsg) {
                passcodeErrorMsg.style.color = '#2E7D32';
                passcodeErrorMsg.textContent = "✨ Secret unlocked! Welcome inside... 💛";
            }
            if (passcodeUnlockBtn) {
                passcodeUnlockBtn.innerHTML = '<span>Unlocked ✓</span>';
                passcodeUnlockBtn.disabled = true;
            }

            playSparkleSound();
            fireConfettiBurst();

            if (!state.musicPlaying) {
                startMusic();
            }

            setTimeout(() => {
                goToScene(2, 'next');
            }, 600);
        } else {
            if (passcodeInputWrapper) {
                passcodeInputWrapper.classList.remove('shake');
                void passcodeInputWrapper.offsetWidth; // trigger reflow
                passcodeInputWrapper.classList.add('shake');
            }
            if (passcodeErrorMsg) {
                passcodeErrorMsg.style.color = '#D32F2F';
                passcodeErrorMsg.textContent = "Incorrect password! Only gop's💛 can access 🔒";
            }
            secretPasscodeInput.focus();
            secretPasscodeInput.select();
        }
    }

    if (passcodeForm) {
        passcodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            verifyPassword();
        });
    }

    if (passcodeUnlockBtn) {
        passcodeUnlockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            verifyPassword();
        });
    }

    const togglePasswordBtn = document.getElementById('toggle-password-visibility');
    const togglePasswordIcon = document.getElementById('toggle-password-icon');

    if (togglePasswordBtn && secretPasscodeInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = secretPasscodeInput.type === 'password';
            secretPasscodeInput.type = isPassword ? 'text' : 'password';
            if (togglePasswordIcon) {
                togglePasswordIcon.textContent = isPassword ? '🙈' : '👁️';
            }
        });
    }

    // Scene 2: Welcome / Start
    const startStoryBtn = document.getElementById('start-story-btn');
    if (startStoryBtn) {
        startStoryBtn.addEventListener('click', () => {
            getAudioContext();
            if (!state.musicPlaying) {
                startMusic();
            }
            playSparkleSound();
            fireConfettiBurst();
            goToScene(3, 'next');
        });
    }

    // Scene 3: Greeting
    const greetingPrevBtn = document.getElementById('greeting-prev-btn');
    const greetingNextBtn = document.getElementById('greeting-next-btn');
    if (greetingPrevBtn) {
        greetingPrevBtn.addEventListener('click', () => {
            goToScene(2, 'prev');
        });
    }
    if (greetingNextBtn) {
        greetingNextBtn.addEventListener('click', () => {
            goToScene(4, 'next');
        });
    }

    // Scene 4: Cake & Candle
    const cakeContainer = document.getElementById('interactive-cake');
    const candle = document.getElementById('birthday-candle');
    const cakeHint = document.getElementById('cake-hint');
    const cakeWishDisplay = document.getElementById('cake-wish-display');
    const cakePhotoCaption = document.getElementById('cake-photo-caption');
    const cakePrevBtn = document.getElementById('cake-prev-btn');
    const cakeNextBtn = document.getElementById('cake-next-btn');

    function blowOutCandle() {
        if (state.candleBlown) return;
        state.candleBlown = true;

        if (candle) {
            candle.classList.add('blown');
        }
        playBlowSound();

        // Confetti burst from candle flame position
        if (candle) {
            const candleRect = candle.getBoundingClientRect();
            fireConfettiBurst(candleRect.left + candleRect.width / 2, candleRect.top + candleRect.height / 2, 85);
        } else if (cakeContainer) {
            const rect = cakeContainer.getBoundingClientRect();
            fireConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 85);
        } else {
            fireConfettiBurst();
        }

        if (cakeHint) {
            cakeHint.innerHTML = "✨ Your wish is made! May all your dreams come true! 💛";
            cakeHint.style.color = '#B28300';
            cakeHint.style.fontWeight = '700';
        }

        if (cakeWishDisplay) {
            cakeWishDisplay.textContent = "Wish made just only fr u ...! da 🎂✨";
        }

        if (cakePhotoCaption) {
            cakePhotoCaption.style.opacity = '0';
            setTimeout(() => {
                cakePhotoCaption.textContent = "hpy bornday gop's..hu 💛";
                cakePhotoCaption.classList.add('revealed');
                cakePhotoCaption.style.opacity = '1';
            }, 250);
        }
    }

    if (cakeContainer) {
        cakeContainer.addEventListener('click', blowOutCandle);
    }
    if (candle) {
        candle.addEventListener('click', (e) => {
            e.stopPropagation();
            blowOutCandle();
        });
    }

    if (cakePrevBtn) {
        cakePrevBtn.addEventListener('click', () => goToScene(3, 'prev'));
    }
    if (cakeNextBtn) {
        cakeNextBtn.addEventListener('click', () => {
            if (!state.candleBlown) {
                blowOutCandle();
            }
            goToScene(5, 'next');
        });
    }

    // Scene 5: Gift Box (3D Unbox)
    const giftBox = document.getElementById('interactive-gift-box');
    const giftContinueZone = document.getElementById('gift-continue-zone');
    const giftPrevBtn = document.getElementById('gift-prev-btn');
    const giftNextBtn = document.getElementById('gift-next-btn');

    function openGiftBox() {
        if (state.giftOpened) return;
        state.giftOpened = true;

        if (giftBox) {
            giftBox.classList.add('opened');
        }

        playPopSound();
        setTimeout(playSparkleSound, 150);

        if (giftBox) {
            const rect = giftBox.getBoundingClientRect();
            fireConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
        } else {
            fireConfettiBurst();
        }

        const giftHint = document.querySelector('#scene-gift .interactive-hint');
        if (giftHint) {
            giftHint.innerHTML = "✨ Dai gop's ! 💛";
            giftHint.style.color = '#B28300';
            giftHint.style.fontWeight = '700';
        }

        if (giftContinueZone) {
            giftContinueZone.classList.add('show');
        }
    }

    if (giftBox) {
        giftBox.addEventListener('click', openGiftBox);
        giftBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGiftBox();
            }
        });
    }

    if (giftPrevBtn) {
        giftPrevBtn.addEventListener('click', () => goToScene(4, 'prev'));
    }
    if (giftNextBtn) {
        giftNextBtn.addEventListener('click', () => goToScene(6, 'next'));
    }

    // Scene 6: Envelope & Letter
    const interactiveEnvelope = document.getElementById('interactive-envelope');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const openLetterBtn = document.getElementById('open-letter-btn');
    const waxSeal = document.getElementById('wax-seal');
    const envelopePrevBtn = document.getElementById('envelope-prev-btn');
    const envelopeNextBtn = document.getElementById('envelope-next-btn');

    function openEnvelope() {
        if (state.envelopeOpened) return;
        state.envelopeOpened = true;

        if (envelopeWrapper) {
            envelopeWrapper.classList.add('opened');
        }

        playSparkleSound();
        if (waxSeal) {
            const rect = waxSeal.getBoundingClientRect();
            fireConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
        } else {
            fireConfettiBurst();
        }

        const envelopeHint = document.querySelector('#scene-envelope .interactive-hint');
        if (envelopeHint) {
            envelopeHint.innerHTML = "✨ Letter opened! Read your special message 💛";
            envelopeHint.style.color = '#B28300';
            envelopeHint.style.fontWeight = '700';
        }

        if (openLetterBtn) {
            openLetterBtn.innerHTML = '<span>Letter Opened 💌</span>';
            openLetterBtn.style.opacity = '0.7';
            openLetterBtn.style.pointerEvents = 'none';
        }
    }

    if (interactiveEnvelope) {
        interactiveEnvelope.addEventListener('click', openEnvelope);
        interactiveEnvelope.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
    }

    if (openLetterBtn) {
        openLetterBtn.addEventListener('click', openEnvelope);
    }
    if (waxSeal) {
        waxSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            openEnvelope();
        });
    }
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', openEnvelope);
    }

    if (envelopePrevBtn) {
        envelopePrevBtn.addEventListener('click', () => goToScene(5, 'prev'));
    }
    if (envelopeNextBtn) {
        envelopeNextBtn.addEventListener('click', () => {
            if (!state.envelopeOpened) {
                openEnvelope();
            }
            goToScene(7, 'next');
        });
    }

    // Scene 7: Personal Message Cards Deck (Password Protected)
    const cardsLockView = document.getElementById('cards-lock-view');
    const cardsDeckContainer = document.getElementById('cards-deck-container');
    const cardsPasscodeForm = document.getElementById('cards-passcode-form');
    const cardsSecretPasscode = document.getElementById('cards-secret-passcode');
    const cardsUnlockBtn = document.getElementById('cards-unlock-btn');
    const cardsPasscodeInputWrapper = document.getElementById('cards-passcode-input-wrapper');
    const cardsPasscodeErrorMsg = document.getElementById('cards-passcode-error-msg');
    const cardsTogglePassword = document.getElementById('cards-toggle-password');
    const cardsTogglePasswordIcon = document.getElementById('cards-toggle-password-icon');

    const cardMessageText = document.getElementById('card-message-text');
    const cardCounterDisplay = document.getElementById('card-counter-display');
    const cardPrevItemBtn = document.getElementById('card-prev-item-btn');
    const cardNextItemBtn = document.getElementById('card-next-item-btn');
    const cardDisplayBox = document.getElementById('message-card-box');
    const cardDotsContainer = document.getElementById('card-dots-container');
    const cardsPrevBtn = document.getElementById('cards-prev-btn');
    const cardsNextBtn = document.getElementById('cards-next-btn');

    // Accepted passwords for Section 7 (paithekara, ratna, gugan, chellapulla)
    const CARDS_ACCEPTED_PASSWORDS = [
        'paithekara',
        'ratna',
        'gugan',
        'chellapulla',
    ];

    function verifyCardsPassword() {
        if (!cardsSecretPasscode) return;
        const entered = cardsSecretPasscode.value.trim().toLowerCase();

        if (CARDS_ACCEPTED_PASSWORDS.includes(entered)) {
            state.cardsUnlocked = true;
            if (cardsPasscodeInputWrapper) {
                cardsPasscodeInputWrapper.classList.remove('shake');
                cardsPasscodeInputWrapper.classList.add('success');
            }
            if (cardsPasscodeErrorMsg) {
                cardsPasscodeErrorMsg.style.color = '#2E7D32';
                cardsPasscodeErrorMsg.textContent = "✨ Secret unlocked! Notes for you... 💛";
            }
            if (cardsUnlockBtn) {
                cardsUnlockBtn.innerHTML = '<span>Unlocked ✓</span>';
                cardsUnlockBtn.disabled = true;
            }

            playSparkleSound();
            fireConfettiBurst();

            setTimeout(() => {
                if (cardsLockView) {
                    cardsLockView.classList.add('unlocking');
                    setTimeout(() => {
                        cardsLockView.style.display = 'none';
                        if (cardsDeckContainer) {
                            cardsDeckContainer.style.display = 'block';
                            renderCard(0);
                        }
                    }, 350);
                } else if (cardsDeckContainer) {
                    cardsDeckContainer.style.display = 'block';
                    renderCard(0);
                }
            }, 450);
        } else {
            if (cardsPasscodeInputWrapper) {
                cardsPasscodeInputWrapper.classList.remove('shake');
                void cardsPasscodeInputWrapper.offsetWidth; // trigger reflow
                cardsPasscodeInputWrapper.classList.add('shake');
            }
            if (cardsPasscodeErrorMsg) {
                cardsPasscodeErrorMsg.style.color = '#D32F2F';
                cardsPasscodeErrorMsg.textContent = "Incorrect password! Only nicknames accepted 🔒";
            }
            cardsSecretPasscode.focus();
            cardsSecretPasscode.select();
        }
    }

    if (cardsPasscodeForm) {
        cardsPasscodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            verifyCardsPassword();
        });
    }

    if (cardsUnlockBtn) {
        cardsUnlockBtn.addEventListener('click', (e) => {
            e.preventDefault();
            verifyCardsPassword();
        });
    }

    if (cardsTogglePassword && cardsSecretPasscode) {
        cardsTogglePassword.addEventListener('click', () => {
            const isPassword = cardsSecretPasscode.type === 'password';
            cardsSecretPasscode.type = isPassword ? 'text' : 'password';
            if (cardsTogglePasswordIcon) {
                cardsTogglePasswordIcon.textContent = isPassword ? '🙈' : '👁️';
            }
        });
    }

    function renderCard(index) {
        state.currentCardIndex = index;
        const item = cardsData[index];

        if (cardDisplayBox) {
            cardDisplayBox.classList.add('animating');
            setTimeout(() => {
                if (cardMessageText) {
                    cardMessageText.textContent = item.text;
                }
                const heartIcon = cardDisplayBox.querySelector('.card-heart');
                if (heartIcon) heartIcon.textContent = item.icon;
                cardDisplayBox.classList.remove('animating');
            }, 180);
        }

        if (cardCounterDisplay) {
            cardCounterDisplay.textContent = `${index + 1} / ${cardsData.length}`;
        }

        if (cardPrevItemBtn) {
            cardPrevItemBtn.disabled = (index === 0);
        }
        if (cardNextItemBtn) {
            cardNextItemBtn.disabled = (index === cardsData.length - 1);
        }

        // Update dot indicators
        if (cardDotsContainer) {
            const dots = cardDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    if (cardPrevItemBtn) {
        cardPrevItemBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (state.currentCardIndex > 0) {
                renderCard(state.currentCardIndex - 1);
                playPopSound();
            }
        });
    }

    if (cardNextItemBtn) {
        cardNextItemBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (state.currentCardIndex < cardsData.length - 1) {
                renderCard(state.currentCardIndex + 1);
                playPopSound();
            }
        });
    }

    // Touch Swipe Gesture directly on Message Card Box for easy phone swiping
    let cardTouchStartX = 0;
    let cardTouchStartY = 0;
    if (cardDisplayBox) {
        cardDisplayBox.addEventListener('touchstart', (e) => {
            cardTouchStartX = e.changedTouches[0].screenX;
            cardTouchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        cardDisplayBox.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].screenX - cardTouchStartX;
            const diffY = e.changedTouches[0].screenY - cardTouchStartY;
            if (Math.abs(diffX) > 40 && Math.abs(diffY) < 55) {
                if (diffX < 0 && state.currentCardIndex < cardsData.length - 1) {
                    // Swipe Left -> Next Card
                    renderCard(state.currentCardIndex + 1);
                    playPopSound();
                } else if (diffX > 0 && state.currentCardIndex > 0) {
                    // Swipe Right -> Prev Card
                    renderCard(state.currentCardIndex - 1);
                    playPopSound();
                }
            }
        }, { passive: true });
    }

    // Click on dots
    if (cardDotsContainer) {
        const dots = cardDotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.style.cursor = 'pointer';
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderCard(idx);
                playPopSound();
            });
        });
    }

    if (cardsPrevBtn) {
        cardsPrevBtn.addEventListener('click', () => goToScene(6, 'prev'));
    }
    if (cardsNextBtn) {
        cardsNextBtn.addEventListener('click', () => goToScene(8, 'next'));
    }

    // Scene 8: Memories / Photos
    const memoriesPrevBtn = document.getElementById('memories-prev-btn');
    const memoriesNextBtn = document.getElementById('memories-next-btn');

    if (memoriesPrevBtn) {
        memoriesPrevBtn.addEventListener('click', () => goToScene(7, 'prev'));
    }
    if (memoriesNextBtn) {
        memoriesNextBtn.addEventListener('click', () => {
            goToScene(9, 'next');
        });
    }

    // Interactive Photo Reveal (Section 3 & Section 8)
    const revealOverlays = document.querySelectorAll('.photo-reveal-overlay');
    revealOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!overlay.classList.contains('revealed')) {
                overlay.classList.add('revealed');
                const rect = overlay.getBoundingClientRect();
                fireConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
            }
        });
    });

    // Scene 9: Celebration & Replay
    const replayBtn = document.getElementById('replay-btn');
    const fireConfettiBtn = document.getElementById('fire-confetti-btn');

    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            // Reset states
            state.candleBlown = false;
            state.giftOpened = false;
            state.envelopeOpened = false;
            state.cardsUnlocked = false;

            // Reset photo reveal overlays
            revealOverlays.forEach(o => o.classList.remove('revealed'));

            if (candle) candle.classList.remove('blown');
            if (cakeHint) {
                cakeHint.textContent = "The little candle is waiting fr ur wishes....blow it out ...🕯️✨ !!";
                cakeHint.style.color = '';
                cakeHint.style.fontWeight = '';
            }
            if (cakeWishDisplay) cakeWishDisplay.textContent = "Make a wish... 🎂✨";
            if (cakePhotoCaption) {
                cakePhotoCaption.textContent = "have a beautiful day ✨";
                cakePhotoCaption.classList.remove('revealed');
                cakePhotoCaption.style.opacity = '1';
            }

            if (giftBox) giftBox.classList.remove('opened');
            if (giftContinueZone) giftContinueZone.classList.remove('show');

            if (envelopeWrapper) envelopeWrapper.classList.remove('opened');
            const envelopeHint = document.querySelector('#scene-envelope .interactive-hint');
            if (envelopeHint) {
                envelopeHint.textContent = "Envelope ha click pannu da..!";
                envelopeHint.style.color = '';
                envelopeHint.style.fontWeight = '';
            }
            if (openLetterBtn) {
                openLetterBtn.innerHTML = '<span>Open Letter ✉️</span>';
                openLetterBtn.style.opacity = '1';
                openLetterBtn.style.pointerEvents = 'auto';
            }

            // Reset Section 7 password view
            if (cardsLockView) {
                cardsLockView.classList.remove('unlocking');
                cardsLockView.style.display = 'block';
            }
            if (cardsDeckContainer) {
                cardsDeckContainer.style.display = 'none';
            }
            if (cardsSecretPasscode) {
                cardsSecretPasscode.value = '';
            }
            if (cardsPasscodeInputWrapper) {
                cardsPasscodeInputWrapper.classList.remove('success', 'shake');
            }
            if (cardsPasscodeErrorMsg) {
                cardsPasscodeErrorMsg.textContent = '';
                cardsPasscodeErrorMsg.style.color = '';
            }
            if (cardsUnlockBtn) {
                cardsUnlockBtn.innerHTML = '<span>Unlock Notes</span><span class="btn-arrow">✨</span>';
                cardsUnlockBtn.disabled = false;
            }

            renderCard(0);
            goToScene(2, 'prev');
        });
    }

    if (fireConfettiBtn) {
        fireConfettiBtn.addEventListener('click', () => {
            fireCannons();
        });
    }

    // ==========================================================================
    // 8. GLOBAL KEYBOARD & SWIPE NAVIGATION
    // ==========================================================================
    window.addEventListener('keydown', (e) => {
        if (!state.isUnlocked) return; // Locked until password verified

        // If in Section 7 and viewing cards, Left/Right arrow keys navigate through cards
        if (state.currentScene === 7 && state.cardsUnlocked) {
            if (e.key === 'ArrowRight') {
                if (state.currentCardIndex < cardsData.length - 1) {
                    renderCard(state.currentCardIndex + 1);
                    playPopSound();
                    return;
                }
            } else if (e.key === 'ArrowLeft') {
                if (state.currentCardIndex > 0) {
                    renderCard(state.currentCardIndex - 1);
                    playPopSound();
                    return;
                }
            }
        }

        if (e.key === 'ArrowRight') {
            if (state.currentScene < state.totalScenes) {
                goToScene(state.currentScene + 1, 'next');
            }
        } else if (e.key === 'ArrowLeft') {
            if (state.currentScene > 2) {
                goToScene(state.currentScene - 1, 'prev');
            }
        }
    });

    // Touch Swipe Gesture Detection
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!state.isUnlocked) return; // Locked until password verified

        // Don't trigger full scene change swipe if touching within card deck container when unlocked
        if (state.currentScene === 7 && state.cardsUnlocked) {
            const target = e.target;
            if (target && target.closest && target.closest('.cards-deck-container')) {
                return;
            }
        }

        const diffX = e.changedTouches[0].screenX - touchStartX;
        const diffY = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(diffX) > 60 && Math.abs(diffY) < 50) {
            if (diffX < 0 && state.currentScene < state.totalScenes) {
                // Swipe Left -> Next
                goToScene(state.currentScene + 1, 'next');
            } else if (diffX > 0 && state.currentScene > 2) {
                // Swipe Right -> Prev
                goToScene(state.currentScene - 1, 'prev');
            }
        }
    }, { passive: true });

    // Initialize Card Deck
    renderCard(0);
    updateProgress(1);

    // Initial audio resume trigger on first window interaction
    const unlockAudio = () => {
        getAudioContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

})();
