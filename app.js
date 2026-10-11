// app.js - Master Controller for Jarvis AI PWA
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new window.QuantumVisualizer('orbCanvas');
    const sfx = window.soundFX;
    const brain = new window.JarvisBrain();

    const micBtn = document.getElementById('micBtn');
    const orbStatusLabel = document.getElementById('orbStatusLabel');
    const userSpeechText = document.getElementById('userSpeechText');
    const jarvisResponseText = document.getElementById('jarvisResponseText');
    const connStatus = document.getElementById('connStatus');
    const bossDisplay = document.getElementById('bossDisplay');
    const voiceLangDisplay = document.getElementById('voiceLangDisplay');
    const keyboardToggleBtn = document.getElementById('keyboardToggleBtn');
    const textInputDrawer = document.getElementById('textInputDrawer');
    const manualInput = document.getElementById('manualInput');
    const manualSendBtn = document.getElementById('manualSendBtn');
    const sfxToggleBtn = document.getElementById('sfxToggleBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const inputBossName = document.getElementById('inputBossName');
    const selectPersonality = document.getElementById('selectPersonality');
    const selectLanguage = document.getElementById('selectLanguage');
    const inputApiKey = document.getElementById('inputApiKey');
    const actionChips = document.querySelectorAll('.action-chip');

    let isSfxMuted = false;
    let isProcessing = false;
    let typeInterval = null;

    function updateTelemetry() {
        bossDisplay.textContent = `BOSS: ${brain.bossName.toUpperCase()}`;
        voiceLangDisplay.textContent = (localStorage.getItem('jarvis_lang') || 'hi-IN').toUpperCase();
    }
    updateTelemetry();

    const speech = new window.SpeechController({
        onStart: () => {
            micBtn.classList.add('active');
            orbStatusLabel.textContent = 'LISTENING // SPEAK NOW';
            visualizer.setState('listening');
            sfx.playActivate();
        },
        onInterim: (interimText) => {
            userSpeechText.textContent = interimText;
        },
        onResult: (finalText) => {
            userSpeechText.textContent = finalText;
            handleUserQuery(finalText);
        },
        onEnd: () => {
            micBtn.classList.remove('active');
            if (!isProcessing) {
                orbStatusLabel.textContent = 'STANDBY // READY';
                visualizer.setState('idle');
            }
        },
        onError: (err) => {
            micBtn.classList.remove('active');
            isProcessing = false;
            orbStatusLabel.textContent = 'STANDBY // READY';
            visualizer.setState('idle');
            sfx.playError();
            if (err === 'not_supported') {
                jarvisResponseText.textContent = 'Mic access is not supported in this browser. Please use the text input below.';
            } else if (err === 'not-allowed') {
                jarvisResponseText.textContent = 'Microphone permission blocked. Please allow mic in browser settings.';
            }
        },
        onSpeakStart: () => {
            orbStatusLabel.textContent = 'SPEAKING // TRANSMITTING';
            visualizer.setState('speaking');
        },
        onSpeakEnd: () => {
            isProcessing = false;
            orbStatusLabel.textContent = 'STANDBY // READY';
            visualizer.setState('idle');
        }
    });

    let hasInteracted = false;
    function triggerFirstInteraction() {
        if (!hasInteracted) {
            hasInteracted = true;
            sfx.playBoot();
        }
    }
    document.body.addEventListener('click', triggerFirstInteraction, { once: true });

    async function handleUserQuery(queryText) {
        if (!queryText || !queryText.trim() || isProcessing) return;

        isProcessing = true;
        orbStatusLabel.textContent = 'PROCESSING // NEURAL BRAIN';
        visualizer.setState('processing');
        sfx.playProcessing();

        try {
            const result = await brain.processQuery(queryText);
            const answer = result.text;

            displayTypewriter(answer);
            sfx.playResponse();
            speech.speak(answer);
        } catch (err) {
            console.error('Error handling query:', err);
            isProcessing = false;
            visualizer.setState('idle');
            sfx.playError();
            jarvisResponseText.textContent = 'System error occurred while processing command.';
        }
    }

    function displayTypewriter(fullText) {
        if (typeInterval) clearInterval(typeInterval);
        jarvisResponseText.textContent = '';
        let index = 0;
        
        typeInterval = setInterval(() => {
            if (index < fullText.length) {
                jarvisResponseText.textContent += fullText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 18);
    }

    micBtn.addEventListener('click', () => {
        triggerFirstInteraction();
        speech.toggleListening();
    });

    actionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            triggerFirstInteraction();
            const cmd = chip.getAttribute('data-cmd');
            userSpeechText.textContent = cmd;
            handleUserQuery(cmd);
        });
    });

    keyboardToggleBtn.addEventListener('click', () => {
        textInputDrawer.classList.toggle('open');
        if (textInputDrawer.classList.contains('open')) {
            manualInput.focus();
            keyboardToggleBtn.textContent = '❌ Close Input';
        } else {
            keyboardToggleBtn.textContent = '⌨️ Type Instead';
        }
    });

    manualSendBtn.addEventListener('click', () => {
        const val = manualInput.value.trim();
        if (val) {
            userSpeechText.textContent = val;
            manualInput.value = '';
            handleUserQuery(val);
        }
    });

    manualInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            manualSendBtn.click();
        }
    });

    sfxToggleBtn.addEventListener('click', () => {
        isSfxMuted = !isSfxMuted;
        sfx.setMuted(isSfxMuted);
        sfxToggleBtn.textContent = isSfxMuted ? '🔇' : '🔊';
    });

    settingsBtn.addEventListener('click', () => {
        inputBossName.value = brain.bossName;
        selectPersonality.value = brain.personality;
        selectLanguage.value = speech.language;
        inputApiKey.value = brain.geminiApiKey;
        settingsModal.classList.add('open');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('open');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('open');
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        const newBoss = inputBossName.value.trim() || 'Boss';
        brain.setBossName(newBoss);
        brain.setPersonality(selectPersonality.value);
        brain.setApiKey(inputApiKey.value.trim());

        const newLang = selectLanguage.value;
        speech.setLanguage(newLang);

        updateTelemetry();
        settingsModal.classList.remove('open');

        const confirmMsg = `Settings saved! Namaste Boss ${newBoss}, main ready hoon.`;
        displayTypewriter(confirmMsg);
        speech.speak(confirmMsg);
        sfx.playResponse();
    });

    window.addEventListener('online', () => {
        connStatus.textContent = 'ONLINE // SECURE';
        connStatus.style.color = '#10b981';
    });
    window.addEventListener('offline', () => {
        connStatus.textContent = 'OFFLINE // LOCAL BRAIN';
        connStatus.style.color = '#f59e0b';
    });
});
