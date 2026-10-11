// brain.js - Upgraded Dual Intelligence Engine (Instant Offline + 100% Free Public AI + Gemini)

class JarvisBrain {
    constructor() {
        this.bossName = localStorage.getItem('jarvis_boss_name') || 'Boss';
        this.personality = localStorage.getItem('jarvis_personality') || 'savage';
        this.geminiApiKey = localStorage.getItem('jarvis_gemini_key') || '';
    }

    setBossName(name) {
        if (!name || !name.trim()) return;
        this.bossName = name.trim();
        localStorage.setItem('jarvis_boss_name', this.bossName);
    }

    setPersonality(personality) {
        this.personality = personality;
        localStorage.setItem('jarvis_personality', personality);
    }

    setApiKey(key) {
        this.geminiApiKey = key ? key.trim() : '';
        localStorage.setItem('jarvis_gemini_key', this.geminiApiKey);
    }

    normalize(text) {
        return text
            .toLowerCase()
            .replace(/[.,#!$@\^&;:{}_\`\~()?]/g, '') // Keep + - * / %
            .replace(/\s+/g, ' ')
            .trim();
    }

    async processQuery(rawQuery) {
        const query = this.normalize(rawQuery);

        // 1. Math Calculation Check (Instant Local Zero-Latency Engine)
        const mathRes = this.evaluateMath(query, rawQuery);
        if (mathRes !== null) {
            return {
                text: `Boss, iska hisab hai: ${mathRes}`,
                source: 'math_engine'
            };
        }

        // 2. Offline Priority Intents (Intro, Roasts, Diagnostics, Time, Jokes)
        const offlineResponse = await this.matchOfflineIntent(query, rawQuery);
        if (offlineResponse) {
            return {
                text: offlineResponse,
                source: 'offline'
            };
        }

        // 3. If User has configured their free Gemini API Key, use Gemini 1.5 Flash
        if (this.geminiApiKey) {
            try {
                const geminiResp = await this.queryGemini(rawQuery);
                if (geminiResp) {
                    return {
                        text: geminiResp,
                        source: 'gemini'
                    };
                }
            } catch (err) {
                console.warn('Gemini API failed, switching to Free Public AI:', err);
            }
        }

        // 4. FREE UNLIMITED PUBLIC AI (No API Key Required!)
        // Uses open public AI endpoint with CORS support
        try {
            const freeAiResp = await this.queryFreeAI(rawQuery);
            if (freeAiResp) {
                return {
                    text: freeAiResp,
                    source: 'free_ai'
                };
            }
        } catch (err) {
            console.warn('Free AI error, attempting Wikipedia knowledge proxy:', err);
        }

        // 5. Free Knowledge Base Proxy (Wikipedia / DuckDuckGo Instant Fact Engine)
        try {
            const wikiResp = await this.queryWikipedia(rawQuery);
            if (wikiResp) {
                return {
                    text: wikiResp,
                    source: 'wikipedia'
                };
            }
        } catch (err) {
            console.warn('Wiki lookup failed:', err);
        }

        // 6. Intelligent Fallback
        return {
            text: `Boss ${this.bossName}, maine "${rawQuery}" suna. Internet check kijiye ya mujhse koi calculation, intro ya dost ko roast karne ko boliye!`,
            source: 'fallback'
        };
    }

    async matchOfflineIntent(q, raw) {
        const boss = this.bossName;

        // Intro / Name / Creator
        if (this.includesAny(q, ['who are you', 'tum kaun ho', 'introduce yourself', 'apna intro do', 'apna parichay', 'kaun ho tum', 'what is your name', 'tera naam kya hai'])) {
            return `Namaste! Mera naam Jarvis hai. Mujhe mere Boss ${boss} ne design kiya hai. Main ek advanced voice-reactive AI assistant hoon jo bina kisi paid API ke bhi chalta hai. Boliye, aaj kya poochhna hai?`;
        }

        if (this.includesAny(q, ['who made you', 'kisne banaya', 'tumhe kisne banaya', 'tera boss kaun hai', 'who is your boss', 'kiska app hai', 'creator kaun hai'])) {
            return `Mujhe mere Boss ${boss} ne phone par coding logic aur AI prompt engineering ka use karke build kiya hai. Boss ${boss} ke aage koi bol sakta hai kya!`;
        }

        // Change Boss Name
        const changeNameMatch = raw.match(/(?:mera naam|set boss name to|mera name)\s+([a-zA-Z\u0900-\u097F]+)/i);
        if (changeNameMatch && changeNameMatch[1]) {
            const newName = changeNameMatch[1].trim();
            this.setBossName(newName);
            return `Done! Ab se main aapko Boss ${newName} ke naam se pehchaanunga.`;
        }

        // Roast Mode
        if (this.includesAny(q, ['roast karo', 'dost ko roast', 'mere dost ko kuch bolo', 'isko roast', 'roast my friend', 'insult karo', 'kuch funny bolo dost', 'isko sunao', 'dost ki beizzati'])) {
            const roasts = [
                `Aapke dost ko dekh kar lagta hai inka dimaag flight mode par rehta hai. Jab zaroorat hoti hai tab network hi gayab!`,
                `Inse boliye thoda kam muskuraayein. Bina kisi achievement ke itna glow sirf street light karti hai!`,
                `Aapke dost ki baatein sunkar lagta hai, inka dimaag abhi trial version par hai, full version khareedne ke paise nahi the!`,
                `Inka dimaag 2G network par chal raha hai aur yeh hamare 5G ke zamane me gyaan de rahe hain!`,
                `Bhai inko bol do selfie lete waqt camera saaf kar liya karein, phone ka AI filter bhi confuse ho jata hai!`
            ];
            return roasts[Math.floor(Math.random() * roasts.length)];
        }

        // Praise / Taarif
        if (this.includesAny(q, ['taarif karo', 'meri taarif', 'kuch accha bolo', 'compliment me', 'praise me'])) {
            return `Boss ${boss}, aapki intelligence aur tech swag ka koi muqabala nahi hai. Phone se itna powerful voice AI app live kar dena har kisi ke bas ki baat nahi hoti!`;
        }

        // Shayari
        if (this.includesAny(q, ['shayari sunao', 'kuch shayari', 'attitude shayari', 'shayari'])) {
            const shayaris = [
                `Hunar toh sabhi me hota hai, par chamakta wahi hai jo mehnat karta hai. Aur Boss ${boss} ka swag toh alag hi level ka hai!`,
                `Manzil unhi ko milti hai jinke sapno me jaan hoti hai, pankho se kuch nahi hota hauslo se udaan hoti hai!`,
                `Rukh badal dete hain hum un hawaon ka, jisme chalne ka hausla kisi aam insaan me nahi hota!`
            ];
            return shayaris[Math.floor(Math.random() * shayaris.length)];
        }

        // Jokes
        if (this.includesAny(q, ['chutkula', 'joke', 'koi joke sunao', 'hansa do', 'funny'])) {
            const jokes = [
                `Ek baar phone ne charger se poocha: Tum roz mujhe itna current kyu dete ho? Charger bola: Taaki tu pura din reel dekh kar mera ehsaan na bhoole!`,
                `Master ji ne poocha: Sabse bada andhera kahan hota hai? Pappu bola: Wi-Fi band hone ke baad ghar ke andar!`
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // Time & Date
        if (this.includesAny(q, ['kya time hua', 'time kya hai', 'time batao', 'current time', 'what time is it'])) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
            return `Boss, abhi waqt ho raha hai ${timeStr}.`;
        }

        if (this.includesAny(q, ['konsi date hai', 'aaj ki date', 'aaj konsa din hai', 'today date', 'current date'])) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `Boss, aaj ka din aur taareekh hai: ${dateStr}.`;
        }

        // Battery
        if (this.includesAny(q, ['battery kitni hai', 'battery status', 'charge kitna hai', 'battery percentage'])) {
            if (navigator.getBattery) {
                try {
                    const battery = await navigator.getBattery();
                    const level = Math.round(battery.level * 100);
                    const charging = battery.charging ? 'aur phone charge ho raha hai.' : 'aur battery normal chal rahi hai.';
                    return `Boss, phone ki battery ${level} percent hai, ${charging}`;
                } catch(e) {}
            }
            return `Boss, battery status check karne ke liye system ready hai. All systems nominal!`;
        }

        // System status
        if (this.includesAny(q, ['system status', 'sab theek hai', 'how are you', 'kaise ho', 'kya haal hai'])) {
            return `All systems operational, Boss! Quantum neural visualizer 100 percent active hai aur memory fully optimized hai.`;
        }

        // Motivation
        if (this.includesAny(q, ['motivate karo', 'motivation do', 'mann nahi lag raha', 'bore ho raha'])) {
            return `Boss, mushkilein sirf behtareen logon ke hisse me aati hain, kyunki wahi log unhe behtareen tareeqe se anjaam dene ki taqat rakhte hain. Lag jao kaam pe!`;
        }

        return null;
    }

    // Advanced Universal Math Engine
    evaluateMath(q, raw) {
        try {
            // Percent: "X ka Y percent" or "Y percent of X"
            const pctMatch1 = q.match(/(\d+(?:\.\d+)?)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)/i);
            if (pctMatch1) {
                const total = parseFloat(pctMatch1[1]);
                const rate = parseFloat(pctMatch1[2]);
                const val = (total * rate) / 100;
                return `${val % 1 === 0 ? val : val.toFixed(2)}`;
            }

            const pctMatch2 = q.match(/(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)/i);
            if (pctMatch2) {
                const rate = parseFloat(pctMatch2[1]);
                const total = parseFloat(pctMatch2[2]);
                const val = (total * rate) / 100;
                return `${val % 1 === 0 ? val : val.toFixed(2)}`;
            }

            // Square root: "square root of X" or "X ka square root"
            const sqrtMatch = q.match(/(?:square root of|under root of|\bsqrt\b)\s*(\d+(?:\.\d+)?)/i) || 
                              q.match(/(\d+(?:\.\d+)?)\s*(?:ka square root|ka under root)/i);
            if (sqrtMatch) {
                const num = parseFloat(sqrtMatch[1]);
                const root = Math.sqrt(num);
                return `${root % 1 === 0 ? root : root.toFixed(2)}`;
            }

            // Normal Arithmetic Expressions
            let cleanExpr = q
                .replace(/plus|jod|aur/gi, '+')
                .replace(/minus|ghatao|kam karo/gi, '-')
                .replace(/into|guna|times/gi, '*')
                .replace(/divided by|divide by|bhag/gi, '/');

            // Find valid arithmetic pattern like "50 + 20 * 2" or "3500 / 7" or "25 * 40"
            const mathPattern = /(\d+(?:\.\d+)?(?:\s*[\+\-\*\/]\s*\d+(?:\.\d+)?)+)/;
            const match = cleanExpr.match(mathPattern);
            if (match) {
                const expr = match[1].replace(/\s+/g, '');
                // Sanitize: only allow numbers, dots, and + - * /
                if (/^[\d\+\-\*\/\.]+$/.test(expr)) {
                    // Safe evaluation using Function
                    const computed = Function(`'use strict'; return (${expr})`)();
                    if (typeof computed === 'number' && !isNaN(computed) && isFinite(computed)) {
                        return `${computed % 1 === 0 ? computed : computed.toFixed(2)}`;
                    }
                }
            }
        } catch(e) {}
        return null;
    }

    // 100% Free Public AI Engine (No API Key Required!)
    async queryFreeAI(userPrompt) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8500);

        const systemPrompt = `You are Jarvis, an ultra-smart Indian voice assistant created by Boss ${this.bossName}.
RULES:
1. Speak in natural, friendly conversational Hinglish or simple Hindi.
2. Answer must be STRICTLY 1 to 2 sentences maximum so it can be read aloud cleanly on mobile.
3. Be loyal to Boss ${this.bossName}.
4. Never use markdown formatting like asterisks or bullet points.`;

        const fullPrompt = `${systemPrompt}\n\nUser Question: ${userPrompt}\nJarvis Response:`;
        const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai&seed=42`;

        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const text = await res.text();
            if (text && text.trim()) {
                let clean = text.trim()
                    .replace(/[\*\#\_]/g, '')
                    .replace(/^jarvis response:\s*/i, '')
                    .replace(/^jarvis:\s*/i, '');
                return clean;
            }
        } catch(e) {
            clearTimeout(timeoutId);
            throw e;
        }
        return null;
    }

    // Free Wikipedia Knowledge Proxy (For facts, people, definitions)
    async queryWikipedia(userPrompt) {
        let topic = userPrompt
            .replace(/(kya hai|kya hota hai|kaun hai|explain karo|batao|what is|who is|kisko bolte hain)/gi, '')
            .trim();

        if (!topic || topic.length < 2) return null;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.extract) {
                    const firstSentence = data.extract.split('. ')[0] + '.';
                    return `Boss, ${topic} ke baare me: ${firstSentence}`;
                }
            }
        } catch(e) {
            clearTimeout(timeoutId);
        }
        return null;
    }

    // Google Gemini 1.5 Flash (When Key is provided)
    async queryGemini(userPrompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const systemInstruction = `You are Jarvis, an ultra-smart, charismatic Indian AI voice assistant created by Boss ${this.bossName}.
Your responses are spoken aloud to the user and their friends.
RULES:
1. Speak in crisp, natural, conversational Hinglish (Hindi written in English alphabets) or simple Hindi.
2. Keep answers concise: STRICTLY 1 to 2 sentences maximum.
3. Be respectful and loyal to Boss ${this.bossName}.
4. If asked to roast someone or be funny, deliver a witty, clever Desi punchline.
5. Never use markdown asterisks or bullet points since your text will be read aloud.`;

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userPrompt }]
                }
            ],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 100
            }
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Gemini HTTP error ${res.status}`);
        }

        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
            return candidateText.trim().replace(/[\*\#\_]/g, '');
        }
        return null;
    }

    includesAny(text, phrases) {
        return phrases.some(p => text.includes(p));
    }
}

window.JarvisBrain = JarvisBrain;
