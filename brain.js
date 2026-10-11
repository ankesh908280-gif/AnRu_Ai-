// brain.js - Dual Intelligence Engine (Offline Desi Intelligence + Gemini Cloud AI)
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
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async processQuery(rawQuery) {
        const query = this.normalize(rawQuery);

        const offlineResponse = await this.matchOfflineIntent(query, rawQuery);
        if (offlineResponse) {
            return {
                text: offlineResponse,
                source: 'offline'
            };
        }

        if (this.geminiApiKey) {
            try {
                const onlineResponse = await this.queryGemini(rawQuery);
                if (onlineResponse) {
                    return {
                        text: onlineResponse,
                        source: 'gemini'
                    };
                }
            } catch (err) {
                console.warn('Gemini API Error, falling back to local brain:', err);
            }
        }

        return {
            text: this.getSmartFallback(rawQuery),
            source: 'fallback'
        };
    }

    async matchOfflineIntent(q, raw) {
        const boss = this.bossName;

        // Intro / Name / Creator
        if (this.includesAny(q, ['who are you', 'tum kaun ho', 'introduce yourself', 'apna intro do', 'apna parichay', 'kaun ho tum', 'what is your name', 'tera naam kya hai'])) {
            return `Namaste! Mera naam Jarvis hai. Mujhe mere Boss ${boss} ne design kiya hai. Main ek advanced voice-reactive AI assistant hoon. Boliye, aaj kya madad karoon?`;
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
        if (this.includesAny(q, ['roast karo', 'dost ko roast', 'mere dost ko kuch bolo', 'isko roast', 'roast my friend', 'insult karo', 'kuch funny bolo dost', 'isko sunao'])) {
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
            return `Boss ${boss}, aapki intelligence aur tech swag ka koi muqabala nahi hai. Phone se itna powerful AI app live kar dena har kisi ke bas ki baat nahi hoti!`;
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

        // Math
        const mathRes = this.evaluateMath(q);
        if (mathRes !== null) {
            return `Boss, iska hisab hai: ${mathRes}`;
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
            return `Boss, battery status access karne ke liye system ready hai. All systems nominal!`;
        }

        // System status
        if (this.includesAny(q, ['system status', 'sab theek hai', 'how are you', 'kaise ho', 'kya haal hai'])) {
            return `All systems operational, Boss! Quantum neural visualizer 100 percent active hai aur memory fully optimized hai. Aap bataiye?`;
        }

        // GK
        if (this.includesAny(q, ['google ka ceo', 'ceo of google'])) {
            return `Google ke CEO Sundar Pichai hain, jo Indian-origin ke globally renowned tech leader hain.`;
        }
        if (this.includesAny(q, ['bharat ki rajdhani', 'capital of india'])) {
            return `Bharat ki rajdhani New Delhi hai.`;
        }
        if (this.includesAny(q, ['chand par pehla', 'first man on moon'])) {
            return `Chand par sabse pehla kadam Neil Armstrong ne saal 1969 me rakha tha.`;
        }
        if (this.includesAny(q, ['sabse uncha parvat', 'highest mountain'])) {
            return `Duniya ka sabse uncha parvat Mount Everest hai, jiski unchai lagbhag 8,849 meters hai.`;
        }
        if (this.includesAny(q, ['ai kya hota hai', 'what is artificial intelligence', 'ai kya hai'])) {
            return `Artificial Intelligence machine ko insani dimaag ki tarah seekhne aur smart decisions lene ki capability deta hai, jaise main aapke sath live baat kar raha hoon!`;
        }

        // Motivation
        if (this.includesAny(q, ['motivate karo', 'motivation do', 'mann nahi lag raha', 'bore ho raha'])) {
            return `Boss, mushkilein sirf behtareen logon ke hisse me aati hain, kyunki wahi log unhe behtareen tareeqe se anjaam dene ki taqat rakhte hain. Lag jao kaam pe!`;
        }

        // Goodbye
        if (this.includesAny(q, ['alvida', 'bye', 'good night', 'so jao', 'chalta hoon'])) {
            return `Theek hai Boss ${boss}. Main standby mode me ja raha hoon. Jab bhi bulaoge, ek tap me haazir ho jaunga!`;
        }

        return null;
    }

    evaluateMath(q) {
        try {
            const pctMatch1 = q.match(/(\d+(?:\.\d+)?)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)/);
            if (pctMatch1) {
                const total = parseFloat(pctMatch1[1]);
                const rate = parseFloat(pctMatch1[2]);
                return `${(total * rate) / 100}`;
            }

            const pctMatch2 = q.match(/(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)\s*(?:ka|of)\s*(\d+(?:\.\d+)?)/);
            if (pctMatch2) {
                const rate = parseFloat(pctMatch2[1]);
                const total = parseFloat(pctMatch2[2]);
                return `${(total * rate) / 100}`;
            }

            let cleanExpr = q
                .replace(/plus|jod|aur|\+/g, '+')
                .replace(/minus|ghatao|-/g, '-')
                .replace(/into|guna|times|\*|x/g, '*')
                .replace(/divided by|divide by|bhag|\//g, '/');

            const match = cleanExpr.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
            if (match) {
                const a = parseFloat(match[1]);
                const op = match[2];
                const b = parseFloat(match[3]);
                let res = 0;
                if (op === '+') res = a + b;
                else if (op === '-') res = a - b;
                else if (op === '*') res = a * b;
                else if (op === '/') res = b !== 0 ? (a / b) : 'Infinity';
                return `${res}`;
            }
        } catch(e) {}
        return null;
    }

    includesAny(text, phrases) {
        return phrases.some(p => text.includes(p));
    }

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

    getSmartFallback(rawQuery) {
        const fallbacks = [
            `Maine aapka sawal samjha: "${rawQuery}". Iska live answer paane ke liye Settings me free Gemini API key daal lijiye, ya mujhse Intro, Roast, ya Calculation poochhiye!`,
            `Boss ${this.bossName}, yeh offline command list me nahi hai. Aap mujhse kisi dost ko roast karne, time/date, ya koi math calculation karne ko bol sakte hain!`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

window.JarvisBrain = JarvisBrain;
