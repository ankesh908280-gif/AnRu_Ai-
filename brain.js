// brain.js - Ultimate Zero-API-Key Intelligence Engine (Puter.js + Hindi Wikipedia + Desi GK Vault)

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
            .replace(/[.,#!$@\^&;:{}_\`\~()?]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async processQuery(rawQuery) {
        const query = this.normalize(rawQuery);

        // Tier 1: Instant Local Math Calculator (0-ms Latency, zero-internet)
        const mathRes = this.evaluateMath(query, rawQuery);
        if (mathRes !== null) {
            return {
                text: `Boss, iska hisab hai: ${mathRes}`,
                source: 'math_engine'
            };
        }

        // Tier 2: Core Assistant Commands (Intro, Roasts, Identity, Time, Date, Battery)
        const offlineCoreResp = await this.matchCoreIntents(query, rawQuery);
        if (offlineCoreResp) {
            return {
                text: offlineCoreResp,
                source: 'offline_core'
            };
        }

        // Tier 3: Desi GK & Word Meaning Vault (Instant offline knowledge)
        const desiGkResp = this.matchDesiGkVault(query, rawQuery);
        if (desiGkResp) {
            return {
                text: desiGkResp,
                source: 'desi_gk_vault'
            };
        }

        // Tier 4: Optional Gemini API (If user entered a key in settings)
        if (this.geminiApiKey) {
            try {
                const geminiResp = await this.queryGemini(rawQuery);
                if (geminiResp) {
                    return { text: geminiResp, source: 'gemini' };
                }
            } catch (err) {
                console.warn('Gemini API call failed, falling back to Puter AI:', err);
            }
        }

        // Tier 5: 100% Free Puter.js AI (No API Key Required!)
        try {
            const puterResp = await this.queryPuterAI(rawQuery);
            if (puterResp) {
                return { text: puterResp, source: 'puter_ai' };
            }
        } catch (err) {
            console.warn('Puter.js AI failed or loading, falling back to Hindi Wikipedia:', err);
        }

        // Tier 6: Dual Hindi & English Wikipedia Search (Open free encyclopedia)
        try {
            const wikiResp = await this.queryWikipedia(rawQuery);
            if (wikiResp) {
                return { text: wikiResp, source: 'wikipedia' };
            }
        } catch (err) {
            console.warn('Wikipedia lookup failed:', err);
        }

        // Tier 7: Free Pollinations.ai Backup
        try {
            const freeAiResp = await this.queryPollinationsAI(rawQuery);
            if (freeAiResp) {
                return { text: freeAiResp, source: 'pollinations_ai' };
            }
        } catch (err) {}

        // Tier 8: Safe Smart Fallback
        return {
            text: `Boss ${this.bossName}, maine "${rawQuery}" suna. Iska hisab ya info paane ke liye internet on rakhiye ya mujhse calculation ya dost ko roast karne ko boliye!`,
            source: 'fallback'
        };
    }

    // --- Core Assistant Intents ---
    async matchCoreIntents(q, raw) {
        const boss = this.bossName;

        if (this.includesAny(q, ['who are you', 'tum kaun ho', 'introduce yourself', 'apna intro do', 'apna parichay', 'kaun ho tum', 'what is your name', 'tera naam kya hai'])) {
            return `Namaste! Mera naam Jarvis hai. Mujhe mere Boss ${boss} ne design kiya hai. Main ek advanced voice-reactive AI assistant hoon jo bina kisi API key ke bhi chalta hai. Boliye, aaj kya poochhna hai?`;
        }

        if (this.includesAny(q, ['who made you', 'kisne banaya', 'tumhe kisne banaya', 'tera boss kaun hai', 'who is your boss', 'kiska app hai', 'creator kaun hai'])) {
            return `Mujhe mere Boss ${boss} ne phone par coding logic aur AI prompt engineering ka use karke build kiya hai. Boss ${boss} ke aage koi bol sakta hai kya!`;
        }

        const changeNameMatch = raw.match(/(?:mera naam|set boss name to|mera name)\s+([a-zA-Z\u0900-\u097F]+)/i);
        if (changeNameMatch && changeNameMatch[1]) {
            const newName = changeNameMatch[1].trim();
            this.setBossName(newName);
            return `Done! Ab se main aapko Boss ${newName} ke naam se pehchaanunga.`;
        }

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

        if (this.includesAny(q, ['taarif karo', 'meri taarif', 'kuch accha bolo', 'compliment me', 'praise me'])) {
            return `Boss ${boss}, aapki intelligence aur tech swag ka koi muqabala nahi hai. Phone se itna powerful voice AI app live kar dena har kisi ke bas ki baat nahi hoti!`;
        }

        if (this.includesAny(q, ['shayari sunao', 'kuch shayari', 'attitude shayari', 'shayari'])) {
            const shayaris = [
                `Hunar toh sabhi me hota hai, par chamakta wahi hai jo mehnat karta hai. Aur Boss ${boss} ka swag toh alag hi level ka hai!`,
                `Manzil unhi ko milti hai jinke sapno me jaan hoti hai, pankho se kuch nahi hota hauslo se udaan hoti hai!`,
                `Rukh badal dete hain hum un hawaon ka, jisme chalne ka hausla kisi aam insaan me nahi hota!`
            ];
            return shayaris[Math.floor(Math.random() * shayaris.length)];
        }

        if (this.includesAny(q, ['chutkula', 'joke', 'koi joke sunao', 'hansa do', 'funny'])) {
            const jokes = [
                `Ek baar phone ne charger se poocha: Tum roz mujhe itna current kyu dete ho? Charger bola: Taaki tu pura din reel dekh kar mera ehsaan na bhoole!`,
                `Master ji ne poocha: Sabse bada andhera kahan hota hai? Pappu bola: Wi-Fi band hone ke baad ghar ke andar!`
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

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

        if (this.includesAny(q, ['system status', 'sab theek hai', 'how are you', 'kaise ho', 'kya haal hai'])) {
            return `All systems operational, Boss! Quantum neural visualizer 100 percent active hai aur memory fully optimized hai.`;
        }

        return null;
    }

    // --- Pre-loaded Desi GK & Word Meaning Vault ---
    matchDesiGkVault(q, raw) {
        const lower = (q + ' ' + raw).toLowerCase();

        // 1. Prime Minister (PM)
        if (lower.includes('pradhanmantri') || lower.includes('प्रधानमंत्री') || lower.includes('prime minister')) {
            return `Bharat ke Pradhan Mantri Shri Narendra Modi hain.`;
        }

        // 2. President
        if (lower.includes('rashtrapati') || lower.includes('राष्ट्रपति') || lower.includes('president of india')) {
            return `Bharat ki Rashtrapati Smt. Droupadi Murmu hain.`;
        }

        // 3. Uttar Pradesh CM
        if (lower.includes('uttar pradesh') || lower.includes('up ke') || lower.includes('उत्तर प्रदेश')) {
            if (lower.includes('mukhyamantri') || lower.includes('मुख्यमंत्री') || lower.includes('cm')) {
                return `Uttar Pradesh ke Mukhya Mantri Shri Yogi Adityanath hain.`;
            }
        }

        // 4. Bihar CM
        if (lower.includes('bihar') || lower.includes('बिहार')) {
            if (lower.includes('mukhyamantri') || lower.includes('मुख्यमंत्री') || lower.includes('cm')) {
                return `Bihar ke Mukhya Mantri Shri Nitish Kumar hain.`;
            }
        }

        // 5. Capitals
        if (lower.includes('bharat ki rajdhani') || lower.includes('capital of india') || lower.includes('भारत की राजधानी')) {
            return `Bharat ki rajdhani New Delhi hai.`;
        }
        if (lower.includes('up ki rajdhani') || lower.includes('uttar pradesh ki rajdhani')) {
            return `Uttar Pradesh ki rajdhani Lucknow hai.`;
        }
        if (lower.includes('bihar ki rajdhani')) {
            return `Bihar ki rajdhani Patna hai.`;
        }

        // 6. Technology & AI
        if (lower.includes('generative ai') || lower.includes('जेनेरेटिव आई') || lower.includes('जनरेटिव एआई')) {
            return `Generative AI ek aisi technology hai jo naye text, images, code aur audio ko bina insani madad ke khud generate kar sakti hai.`;
        }
        if (lower.includes('ai kya hai') || lower.includes('artificial intelligence') || lower.includes('एआई क्या है')) {
            return `Artificial Intelligence machine ko insani dimaag ki tarah seekhne aur smart decision lene ki taqat deta hai, jaise main aapke sath live baat kar raha hoon!`;
        }
        if (lower.includes('google ka ceo') || lower.includes('ceo of google')) {
            return `Google ke CEO Sundar Pichai hain, jo Indian-origin ke globally renowned tech visionary hain.`;
        }
        if (lower.includes('microsoft ka ceo') || lower.includes('ceo of microsoft')) {
            return `Microsoft ke CEO Satya Nadella hain.`;
        }

        // 7. General Knowledge
        if (lower.includes('chand par pehla') || lower.includes('chand par kaun') || lower.includes('moon')) {
            return `Chand par sabse pehla kadam Neil Armstrong ne saal 1969 me Apollo 11 mission ke dauran rakha tha.`;
        }
        if (lower.includes('suraj kya hai') || lower.includes('sun kya hai') || lower.includes('सूर्य क्या है')) {
            return `Suraj hamare solar system ka sabse bada tara hai, jo energy aur roshni ka mukhya source hai.`;
        }

        // 8. Word Meanings (Dictionary)
        const meaningMatch = raw.match(/([a-zA-Z]+)\s*(?:ka matlab|ka hindi meaning|meaning in hindi|ka arth)/i);
        if (meaningMatch && meaningMatch[1]) {
            const word = meaningMatch[1].toLowerCase();
            const dict = {
                'generative': 'Nirmaankari ya naya banane wala',
                'intelligence': 'Buddhimatta ya samajhdaari',
                'artificial': 'Kritrim ya banawati',
                'assistant': 'Sahayak ya madadgaar',
                'developer': 'Vikaaskarta ya software banane wala',
                'explore': 'Khoj karna ya naye cheezon ko dekhna',
                'achieve': 'Haasil karna ya paana',
                'freedom': 'Azaadi ya swatantrata',
                'knowledge': 'Gyaan ya jaankari'
            };
            if (dict[word]) {
                return `"${word}" ka Hindi me matlab hota hai: ${dict[word]}.`;
            }
        }

        return null;
    }

    // --- Math Engine ---
    evaluateMath(q, raw) {
        try {
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

            const sqrtMatch = q.match(/(?:square root of|under root of|\bsqrt\b)\s*(\d+(?:\.\d+)?)/i) || 
                              q.match(/(\d+(?:\.\d+)?)\s*(?:ka square root|ka under root)/i);
            if (sqrtMatch) {
                const num = parseFloat(sqrtMatch[1]);
                const root = Math.sqrt(num);
                return `${root % 1 === 0 ? root : root.toFixed(2)}`;
            }

            let cleanExpr = q
                .replace(/plus|jod|aur/gi, '+')
                .replace(/minus|ghatao|kam karo/gi, '-')
                .replace(/into|guna|times/gi, '*')
                .replace(/divided by|divide by|bhag/gi, '/');

            const mathPattern = /(\d+(?:\.\d+)?(?:\s*[\+\-\*\/]\s*\d+(?:\.\d+)?)+)/;
            const match = cleanExpr.match(mathPattern);
            if (match) {
                const expr = match[1].replace(/\s+/g, '');
                if (/^[\d\+\-\*\/\.]+$/.test(expr)) {
                    const computed = Function(`'use strict'; return (${expr})`)();
                    if (typeof computed === 'number' && !isNaN(computed) && isFinite(computed)) {
                        return `${computed % 1 === 0 ? computed : computed.toFixed(2)}`;
                    }
                }
            }
        } catch(e) {}
        return null;
    }

    // --- Puter.js Zero-API-Key Free AI ---
    async queryPuterAI(userPrompt) {
        if (typeof window.puter === 'undefined' || !window.puter.ai) {
            return null;
        }

        const systemPrompt = `You are Jarvis, a charismatic Indian AI voice assistant created by Boss ${this.bossName}.
Respond in conversational Hindi / Hinglish. Keep answers strictly 1-2 sentences so they are read aloud cleanly.
Be helpful, clever and polite. Never use markdown asterisks or bullet points.`;

        const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\nJarvis:`;

        const responsePromise = window.puter.ai.chat(fullPrompt);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Puter AI timeout')), 9000)
        );

        const res = await Promise.race([responsePromise, timeoutPromise]);

        if (typeof res === 'string') {
            return res.trim().replace(/[\*\#\_]/g, '');
        } else if (res && res.message && res.message.content) {
            return res.message.content.trim().replace(/[\*\#\_]/g, '');
        } else if (res && res.text) {
            return res.text.trim().replace(/[\*\#\_]/g, '');
        }
        return null;
    }

    // --- Dual Hindi & English Wikipedia Search ---
    async queryWikipedia(userPrompt) {
        // Clean topic query
        let topic = userPrompt
            .replace(/(kya hai|kya hota hai|kaun hai|explain karo|batao|what is|who is|kisko bolte hain|bataiye|ke baare me batao)/gi, '')
            .trim();

        if (!topic || topic.length < 2) return null;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {
            // Step 1: Try Hindi Wikipedia Search API
            const hiSearchUrl = `https://hi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
            const hiRes = await fetch(hiSearchUrl, { signal: controller.signal });
            if (hiRes.ok) {
                const hiData = await hiRes.json();
                if (hiData.query && hiData.query.search && hiData.query.search.length > 0) {
                    const snippet = hiData.query.search[0].snippet.replace(/<[^>]*>?/gm, '');
                    if (snippet && snippet.length > 15) {
                        clearTimeout(timeoutId);
                        return `Boss, ${topic} ke baare me: ${snippet.split('. ')[0]}.`;
                    }
                }
            }

            // Step 2: Try English Wikipedia Summary API
            const enSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const enRes = await fetch(enSummaryUrl, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (enRes.ok) {
                const enData = await enRes.json();
                if (enData.extract) {
                    const firstSentence = enData.extract.split('. ')[0] + '.';
                    return `Boss, ${topic} ke baare me: ${firstSentence}`;
                }
            }
        } catch(e) {
            clearTimeout(timeoutId);
        }
        return null;
    }

    // --- Pollinations AI Fallback ---
    async queryPollinationsAI(userPrompt) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7500);

        const systemPrompt = `You are Jarvis, an ultra-smart Indian voice assistant created by Boss ${this.bossName}.
Speak in conversational Hinglish or simple Hindi. Answer strictly 1 to 2 sentences. No asterisks or formatting.`;

        const fullPrompt = `${systemPrompt}\n\nUser: ${userPrompt}\nJarvis:`;
        const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai&seed=42`;

        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const text = await res.text();
                if (text && text.trim()) {
                    return text.trim()
                        .replace(/[\*\#\_]/g, '')
                        .replace(/^jarvis:\s*/i, '');
                }
            }
        } catch(e) {
            clearTimeout(timeoutId);
        }
        return null;
    }

    // --- Gemini 1.5 Flash (If key provided) ---
    async queryGemini(userPrompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const systemInstruction = `You are Jarvis, an ultra-smart, charismatic Indian AI voice assistant created by Boss ${this.bossName}.
Speak in crisp conversational Hinglish. Answer strictly in 1 to 2 sentences maximum. No markdown formatting.`;

        const payload = {
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.8, maxOutputTokens: 100 }
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`Gemini status ${res.status}`);
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
