/* ============================================
   Mathe-Trainer Logic v2 (Gamification + Enhancements)
   ============================================ */

let gameState = {
    mode: 'no-carry',
    score: 0,
    timeLeft: 180, // 3 Minuten
    timerInterval: null,
    isPlaying: false,
    currentTask: null,
    colorSupport: false,
    selectedNumber: null // Für Click-to-Fill
};

let subtractionGameState = {
    mode: 'no-borrow',
    score: 0,
    timeLeft: 180,
    timerInterval: null,
    isPlaying: false,
    currentTask: null,
    colorSupport: false,
    selectedNumber: null
};

let multiplicationGameState = {
    mode: '3x2',
    score: 0,
    timeLeft: 600,
    timerInterval: null,
    isPlaying: false,
    currentTask: null,
    colorSupport: false,
    selectedNumber: null
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('Mathe-Trainer v2.2 geladen');

    // Standard: Startbildschirm anzeigen
    showScreen('startScreen');

    // Setup Drag/Click Handlers on initial load
    setupInputMethod();
});

/* ============================================
   Navigation & Spielsteuerung
   ============================================ */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function toggleColorSupport() {
    gameState.colorSupport = !gameState.colorSupport;
    const btn = document.getElementById('colorSupportBtn');
    const text = btn.querySelector('.toggle-text');

    if (gameState.colorSupport) {
        btn.classList.add('active');
        text.textContent = "Farbige Unterstützung aktiv";
    } else {
        btn.classList.remove('active');
        text.textContent = "Farbige Unterstützung einschalten";
    }
}

function toggleColorSupportSubtraction() {
    subtractionGameState.colorSupport = !subtractionGameState.colorSupport;
    const btn = document.getElementById('colorSupportBtnSubtraction');
    const text = btn.querySelector('.toggle-text');

    if (subtractionGameState.colorSupport) {
        btn.classList.add('active');
        text.textContent = "Farbige Unterstützung aktiv";
    } else {
        btn.classList.remove('active');
        text.textContent = "Farbige Unterstützung einschalten";
    }
}

function toggleColorSupportMultiplication() {
    multiplicationGameState.colorSupport = !multiplicationGameState.colorSupport;
    const btn = document.getElementById('colorSupportBtnMultiplication');
    const text = btn.querySelector('.toggle-text');

    if (multiplicationGameState.colorSupport) {
        btn.classList.add('active');
        text.textContent = "Farbige Unterstützung aktiv";
    } else {
        btn.classList.remove('active');
        text.textContent = "Farbige Unterstützung einschalten";
    }
}

function startAdditionExercise(mode) {
    gameState.mode = mode;
    gameState.score = 0;
    gameState.timeLeft = 180;
    gameState.isPlaying = true;
    gameState.selectedNumber = null;

    updateScoreDisplay();
    updateTimerDisplay();

    showScreen('additionScreen');

    const titles = {
        'no-carry': 'Addition ohne Übertrag',
        'with-carry': 'Addition mit Übertrag',
        'multi-summands': 'Addition mit mehreren Summanden',
        'klecks': 'Addition Klecksaufgaben'
    };
    document.getElementById('additionTitle').textContent = titles[mode];

    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(gameTick, 1000);

    generateAdditionTask();
}

function stopGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    document.getElementById('finalScoreValue').textContent = gameState.score;
    const msg = document.getElementById('motivationalMessage');
    if (gameState.score > 20) msg.textContent = "Fantastisch! Du bist ein Rechen-Profi! 🚀";
    else if (gameState.score > 10) msg.textContent = "Super gemacht! Weiter so! 🌟";
    else msg.textContent = "Gut geübt! Beim nächsten Mal schaffst du noch mehr! 💪";
    showScreen('resultScreen');
}

function gameTick() {
    if (!gameState.isPlaying) return;
    gameState.timeLeft--;
    updateTimerDisplay();
    if (gameState.timeLeft <= 0) stopGame();
}

function updateTimerDisplay() {
    const min = Math.floor(gameState.timeLeft / 60);
    const sec = gameState.timeLeft % 60;
    document.getElementById('timerDisplay').textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateScoreDisplay() {
    document.getElementById('additionScore').textContent = gameState.score;
}

function startSubtractionExercise(mode) {
    subtractionGameState.mode = mode;
    subtractionGameState.score = 0;
    subtractionGameState.timeLeft = 180;
    subtractionGameState.isPlaying = true;
    subtractionGameState.selectedNumber = null;

    updateScoreDisplaySubtraction();
    updateTimerDisplaySubtraction();

    showScreen('subtractionScreen');

    const titles = {
        'no-borrow': 'Subtraktion ohne Übertrag',
        'with-borrow': 'Subtraktion mit Übertrag',
        'klecks': 'Subtraktion Klecksaufgaben'
    };
    document.getElementById('subtractionTitle').textContent = titles[mode];

    if (subtractionGameState.timerInterval) clearInterval(subtractionGameState.timerInterval);
    subtractionGameState.timerInterval = setInterval(gameTickSubtraction, 1000);

    generateSubtractionTask();
}

function stopGameSubtraction() {
    subtractionGameState.isPlaying = false;
    clearInterval(subtractionGameState.timerInterval);
    document.getElementById('finalScoreValueSubtraction').textContent = subtractionGameState.score;
    const msg = document.getElementById('motivationalMessageSubtraction');
    if (subtractionGameState.score > 20) msg.textContent = "Fantastisch! Du bist ein Rechen-Profi! 🚀";
    else if (subtractionGameState.score > 10) msg.textContent = "Super gemacht! Weiter so! 🌟";
    else msg.textContent = "Gut geübt! Beim nächsten Mal schaffst du noch mehr! 💪";
    showScreen('resultScreenSubtraction');
}

function gameTickSubtraction() {
    if (!subtractionGameState.isPlaying) return;
    subtractionGameState.timeLeft--;
    updateTimerDisplaySubtraction();
    if (subtractionGameState.timeLeft <= 0) stopGameSubtraction();
}

function updateTimerDisplaySubtraction() {
    const min = Math.floor(subtractionGameState.timeLeft / 60);
    const sec = subtractionGameState.timeLeft % 60;
    document.getElementById('timerDisplaySubtraction').textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateScoreDisplaySubtraction() {
    document.getElementById('subtractionScore').textContent = subtractionGameState.score;
}

/* ============================================
   MULTIPLIKATION - Steuerung
   ============================================ */
function startMultiplicationExercise(mode) {
    multiplicationGameState.mode = mode;
    multiplicationGameState.score = 0;
    multiplicationGameState.timeLeft = 600;
    multiplicationGameState.isPlaying = true;
    multiplicationGameState.selectedNumber = null;

    updateScoreDisplayMultiplication();
    updateTimerDisplayMultiplication();

    showScreen('multiplicationScreen');

    const titles = {
        '3x1': 'Einstellige Multiplikation',
        '3x10': 'Multiplikation mit Zehnerzahl',
        '3x2': 'Zweistellige Multiplikation',
        '4x3': 'Dreistellige Multiplikation'
    };
    document.getElementById('multiplicationTitle').textContent = titles[mode];

    if (multiplicationGameState.timerInterval) clearInterval(multiplicationGameState.timerInterval);
    multiplicationGameState.timerInterval = setInterval(gameTickMultiplication, 1000);

    generateMultiplicationTask();
}

function stopGameMultiplication() {
    multiplicationGameState.isPlaying = false;
    clearInterval(multiplicationGameState.timerInterval);
    document.getElementById('finalScoreValueMultiplication').textContent = multiplicationGameState.score;
    const msg = document.getElementById('motivationalMessageMultiplication');
    if (multiplicationGameState.score >= 100) msg.textContent = "Wow! Du bist ein echtes Multiplikations-Ass! 🏆";
    else if (multiplicationGameState.score >= 50) msg.textContent = "Super gemacht! Das war klasse! 🌟";
    else msg.textContent = "Schon gut! Übe weiter, dann wirst du immer schneller! 💪";
    showScreen('resultScreenMultiplication');
}

function gameTickMultiplication() {
    if (!multiplicationGameState.isPlaying) return;
    multiplicationGameState.timeLeft--;
    updateTimerDisplayMultiplication();
    if (multiplicationGameState.timeLeft <= 0) stopGameMultiplication();
}

function updateTimerDisplayMultiplication() {
    const min = Math.floor(multiplicationGameState.timeLeft / 60);
    const sec = multiplicationGameState.timeLeft % 60;
    document.getElementById('timerDisplayMultiplication').textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function updateScoreDisplayMultiplication() {
    document.getElementById('multiplicationScore').textContent = multiplicationGameState.score;
}

/* ============================================
   ADDITION - Logik
   ============================================ */
function generateAdditionTask() {
    const feedbackArea = document.querySelector('.feedback-area');
    if (feedbackArea) feedbackArea.style.display = 'none';

    const container = document.getElementById('additionTaskContainer');
    container.innerHTML = '';

    let summands = [];
    const mode = gameState.mode;

    if (mode === 'no-carry') {
        const numDigits = Math.random() < 0.5 ? 2 : 3;
        let s1 = [], s2 = [];
        for (let i = 0; i < numDigits; i++) {
            let min = (i === 0) ? 1 : 0;
            let d1 = Math.floor(Math.random() * (9 - min)) + min;
            let d2 = Math.floor(Math.random() * (10 - d1));
            s1.push(d1);
            s2.push(d2);
        }
        summands.push(parseInt(s1.join('')), parseInt(s2.join('')));
    } else if (mode === 'with-carry' || mode === 'klecks') {
        let hasCarry = false;
        while (!hasCarry) {
            const n1 = Math.floor(Math.random() * 800) + 100;
            const n2 = Math.floor(Math.random() * 800) + 100;
            if (hasCarryInSum(n1, n2)) {
                summands = [n1, n2];
                hasCarry = true;
            }
        }
    } else if (mode === 'multi-summands') {
        const count = Math.random() < 0.5 ? 3 : 4;
        for (let i = 0; i < count; i++) {
            summands.push(Math.floor(Math.random() * 800) + 50);
        }
    }

    const correctSum = summands.reduce((a, b) => a + b, 0);
    gameState.currentTask = { summands, correctSum, klecksGaps: [] };

    if (mode === 'klecks') {
        generateKlecksGaps();
    }

    renderTask(summands, container);
}

function hasCarryInSum(n1, n2) {
    const s1 = n1.toString().split('').reverse();
    const s2 = n2.toString().split('').reverse();
    const len = Math.max(s1.length, s2.length);
    let carry = 0;
    for (let i = 0; i < len; i++) {
        const d1 = parseInt(s1[i] || 0);
        const d2 = parseInt(s2[i] || 0);
        if (d1 + d2 + carry >= 10) return true;
        carry = Math.floor((d1 + d2 + carry) / 10);
    }
    return false;
}

function generateKlecksGaps() {
    const { summands, correctSum } = gameState.currentTask;
    const resultStr = correctSum.toString();
    const maxLen = resultStr.length;

    // Pro Spalte (Stellenwert) genau eine Lücke bei Klecksaufgaben
    for (let pos = 0; pos < maxLen; pos++) {
        // Wähle zufällig: Summand 0, Summand 1 oder Ergebnis
        const choices = [0, 1, 2]; // 0,1: Summanden, 2: Ergebnis
        const choice = choices[Math.floor(Math.random() * choices.length)];

        let digit = '';
        if (choice < 2) {
            const sStr = summands[choice].toString();
            const idx = sStr.length - 1 - pos;
            if (idx >= 0) {
                digit = parseInt(sStr[idx]);
                gameState.currentTask.klecksGaps.push({ type: 'summand', summandIdx: choice, pos: pos, digit: digit });
            } else {
                // Ausweichen auf Ergebnis oder anderen Summanden
                const otherChoice = (choice === 0) ? 1 : 2;
                if (otherChoice === 1) {
                    const sStr2 = summands[1].toString();
                    const idx2 = sStr2.length - 1 - pos;
                    if (idx2 >= 0) {
                        gameState.currentTask.klecksGaps.push({ type: 'summand', summandIdx: 1, pos: pos, digit: parseInt(sStr2[idx2]) });
                    } else {
                        gameState.currentTask.klecksGaps.push({ type: 'result', pos: pos, digit: parseInt(resultStr[resultStr.length - 1 - pos]) });
                    }
                } else {
                    const idxRes = resultStr.length - 1 - pos;
                    if (idxRes >= 0) {
                        gameState.currentTask.klecksGaps.push({ type: 'result', pos: pos, digit: parseInt(resultStr[idxRes]) });
                    }
                }
            }
        } else {
            const idx = resultStr.length - 1 - pos;
            if (idx >= 0) {
                digit = parseInt(resultStr[idx]);
                gameState.currentTask.klecksGaps.push({ type: 'result', pos: pos, digit: digit });
            }
        }
    }
}

function renderTask(summands, container) {
    const resultLen = gameState.currentTask.correctSum.toString().length;
    const klecksGaps = gameState.currentTask.klecksGaps || [];
    const isKlecksMode = gameState.mode === 'klecks';

    // --- Summanden ---
    summands.forEach((num, idx) => {
        const row = document.createElement('div');
        row.className = 'calc-row';
        row.style.justifyContent = 'flex-end';

        let html = (idx === summands.length - 1) ? '<span class="operator">+</span>' : '<span style="width:30px; display:inline-block"></span>';

        const s = num.toString();
        const paddingCount = resultLen - s.length;
        for (let i = 0; i < paddingCount; i++) {
            html += `<span class="digit-box" style="visibility:hidden">0</span>`;
        }

        for (let i = 0; i < s.length; i++) {
            const char = s[i];
            const pos = s.length - 1 - i;

            // Klecks-Check
            const gap = klecksGaps.find(g => g.type === 'summand' && g.summandIdx === idx && g.pos === pos);

            if (gap) {
                html += `<div class="result-box klecks" data-type="klecks-summand" data-sumidx="${idx}" data-pos="${pos}"></div>`;
            } else {
                let colorClass = '';
                if (gameState.colorSupport) {
                    if (pos === 0) colorClass = ' color-ones';
                    else if (pos === 1) colorClass = ' color-tens';
                    else if (pos === 2) colorClass = ' color-hundreds';
                    else if (pos === 3) colorClass = ' color-thousands';
                }
                html += `<span class="digit-box${colorClass}">${char}</span>`;
            }
        }
        row.innerHTML = html;
        container.appendChild(row);
    });

    // --- Merkzahlen (Carry) ---
    const carryRow = document.createElement('div');
    carryRow.className = 'carry-row';
    carryRow.style.justifyContent = 'flex-end';
    let carryHtml = '<span style="width:30px; display:inline-block"></span>';
    for (let i = 0; i < resultLen; i++) {
        const pos = resultLen - 1 - i;
        carryHtml += (pos > 0) ? `<div class="carry-box" data-type="carry" data-pos="${pos}"></div>` : `<div style="width:50px; height:40px"></div>`;
    }
    carryRow.innerHTML = carryHtml;
    container.appendChild(carryRow);

    container.appendChild(Object.assign(document.createElement('div'), { className: 'calc-line' }));

    // --- Ergebniszeile ---
    const resRow = document.createElement('div');
    resRow.className = 'calc-row result-row';
    resRow.style.justifyContent = 'flex-end';
    let resHtml = '<span style="width:30px; display:inline-block"></span>';
    const resultStr = gameState.currentTask.correctSum.toString();

    for (let i = 0; i < resultLen; i++) {
        const pos = resultLen - 1 - i;
        const gap = klecksGaps.find(g => g.type === 'result' && g.pos === pos);

        if (gap) {
            resHtml += `<div class="result-box klecks" data-type="klecks-result" data-pos="${pos}"></div>`;
        } else if (isKlecksMode) {
            const char = resultStr[resultStr.length - 1 - pos];
            let colorClass = '';
            if (gameState.colorSupport) {
                if (pos === 0) colorClass = ' color-ones';
                else if (pos === 1) colorClass = ' color-tens';
                else if (pos === 2) colorClass = ' color-hundreds';
                else if (pos === 3) colorClass = ' color-thousands';
            }
            resHtml += `<span class="digit-box${colorClass}">${char}</span>`;
        } else {
            resHtml += `<div class="result-box" data-type="result" data-pos="${pos}"></div>`;
        }
    }
    resRow.innerHTML = resHtml;
    container.appendChild(resRow);
    setupDropZones();
}

function calculateCarries(summands) {
    let carries = {};
    let currentCarry = 0;
    const maxLen = Math.max(...summands.map(s => s.toString().length));
    for (let pos = 0; pos <= maxLen + 1; pos++) {
        let sumCol = currentCarry;
        summands.forEach(s => {
            const sStr = s.toString();
            const idx = sStr.length - 1 - pos;
            if (idx >= 0) sumCol += parseInt(sStr[idx]);
        });
        const newCarry = Math.floor(sumCol / 10);
        if (newCarry > 0) carries[pos + 1] = newCarry;
        currentCarry = newCarry;
    }
    return carries;
}

function validateInput(zone, value) {
    const type = zone.dataset.type;
    const pos = parseInt(zone.dataset.pos);
    const numVal = parseInt(value);
    const task = gameState.currentTask;
    let isCorrect = false;

    if (type === 'result') {
        const correctStr = task.correctSum.toString();
        const strIdx = correctStr.length - 1 - pos;
        if (strIdx >= 0 && numVal === parseInt(correctStr[strIdx])) isCorrect = true;
    } else if (type === 'carry') {
        const carries = calculateCarries(task.summands);
        if (numVal === (carries[pos] || 0)) isCorrect = true;
    } else if (type === 'klecks-result') {
        const gap = task.klecksGaps.find(g => g.type === 'result' && g.pos === pos);
        if (numVal === gap.digit) isCorrect = true;
    } else if (type === 'klecks-summand') {
        const sIdx = parseInt(zone.dataset.sumidx);
        const gap = task.klecksGaps.find(g => g.type === 'summand' && g.summandIdx === sIdx && g.pos === pos);
        if (numVal === gap.digit) isCorrect = true;
    }

    if (isCorrect) {
        // WICHTIG: Die Klasse 'klecks' darf NICHT entfernt werden, 
        // da checkFullCompletion() darauf basiert, um die Ziel-Felder zu finden.
        // Wir entfernen nur 'wrong' und fügen 'correct' hinzu.
        zone.classList.remove('wrong');
        zone.classList.add('correct');
        checkFullCompletion();
    } else {
        zone.classList.add('wrong');
        setTimeout(() => { zone.classList.remove('wrong'); zone.textContent = ''; }, 800);
    }
}

function checkFullCompletion() {
    const container = document.getElementById('additionTaskContainer');
    const isKlecks = gameState.mode === 'klecks';
    const targets = isKlecks ? container.querySelectorAll('.klecks') : container.querySelectorAll('.result-box');

    // Prüfe ob alle Ziel-Boxen korrekt sind
    const allCorrect = Array.from(targets).every(b => b.classList.contains('correct'));

    // Merkzahlen-Check: Nur im Standard-Modus müssen sie zwingend gefüllt sein, 
    // wenn sie für das Ergebnis relevant sind. Im Klecks-Modus sind sie "optional",
    // außer der User hat bereits etwas eingetragen.
    const carries = container.querySelectorAll('.carry-box');
    const allRelevantCarriesCorrect = Array.from(carries).every(c => {
        if (c.textContent === '') {
            // Im Klecks-Modus sind Merkzahlen optional (können im Kopf gerechnet werden)
            if (isKlecks) return true;
            // Im Standard-Modus: Nur okay, wenn der Wert 0 sein müsste
            const pos = parseInt(c.dataset.pos);
            const expected = calculateCarries(gameState.currentTask.summands)[pos] || 0;
            return expected === 0;
        }
        return c.classList.contains('correct');
    });

    if (allCorrect && targets.length > 0 && allRelevantCarriesCorrect) {
        gameState.score++;
        updateScoreDisplay();
        const feedback = document.querySelector('.feedback-area');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.querySelector('.feedback-text').textContent = 'Richtig gelöst!';
        }
        // Neue Aufgabe nach kurzer Verzögerung
        setTimeout(generateAdditionTask, 1000);
    }
}

/* ============================================
   SUBTRAKTION - Logik
   ============================================ */
function generateSubtractionTask() {
    const feedbackArea = document.querySelector('#subtractionScreen .feedback-area');
    if (feedbackArea) feedbackArea.style.display = 'none';
    const container = document.getElementById('subtractionTaskContainer');
    container.innerHTML = '';
    const mode = subtractionGameState.mode;
    let minuend, subtrahend;

    if (mode === 'no-borrow') {
        minuend = Math.floor(Math.random() * 900) + 100;
        const mStr = minuend.toString();
        let sStr = '';
        for (let i = 0; i < mStr.length; i++) sStr += Math.floor(Math.random() * (parseInt(mStr[i]) + 1));
        subtrahend = parseInt(sStr);
    } else {
        do {
            minuend = Math.floor(Math.random() * 800) + 200;
            subtrahend = Math.floor(Math.random() * (minuend - 50)) + 50;
        } while (mode === 'with-borrow' && !requiresBorrowing(minuend, subtrahend));
    }

    const difference = minuend - subtrahend;
    subtractionGameState.currentTask = { minuend, subtrahend, difference, klecksGaps: [] };
    if (mode === 'klecks') generateKlecksGapsSubtraction();
    renderSubtractionTask(minuend, subtrahend, container);
}

function requiresBorrowing(minuend, subtrahend) {
    const mStr = minuend.toString();
    const sStr = subtrahend.toString().padStart(mStr.length, '0');
    for (let i = 0; i < mStr.length; i++) {
        const idx = mStr.length - 1 - i;
        if (parseInt(mStr[mStr.length - 1 - idx]) < parseInt(sStr[sStr.length - 1 - idx])) return true;
    }
    return false;
}

function generateKlecksGapsSubtraction() {
    const { minuend, subtrahend, difference } = subtractionGameState.currentTask;
    const mStr = minuend.toString();
    const sStr = subtrahend.toString();
    const dStr = difference.toString();
    const maxLen = mStr.length;

    for (let pos = 0; pos < maxLen; pos++) {
        const choices = [0, 1, 2]; // 0: Minuend, 1: Subtrahend, 2: Ergebnis
        choices.sort(() => Math.random() - 0.5);

        for (const choice of choices) {
            const strings = [mStr, sStr, dStr];
            const s = strings[choice];
            const idx = s.length - 1 - pos;
            if (idx >= 0) {
                const digit = parseInt(s[idx]);
                const types = ['minuend', 'subtrahend', 'result'];
                subtractionGameState.currentTask.klecksGaps.push({ type: types[choice], pos: pos, digit: digit });
                break;
            }
        }
    }
}

function renderSubtractionTask(minuend, subtrahend, container) {
    const { difference, klecksGaps } = subtractionGameState.currentTask;
    const isKlecksMode = subtractionGameState.mode === 'klecks';
    const mStr = minuend.toString();
    const maxLen = mStr.length;

    const rows = [
        { label: 'minuend', str: mStr, operator: '' },
        { label: 'subtrahend', str: subtrahend.toString(), operator: '−' }
    ];

    rows.forEach(r => {
        const row = document.createElement('div');
        row.className = 'calc-row';
        row.style.justifyContent = 'flex-end';
        let html = r.operator ? `<span class="operator">${r.operator}</span>` : '<span style="width:30px; display:inline-block"></span>';

        const paddingCount = maxLen - r.str.length;
        for (let i = 0; i < paddingCount; i++) {
            html += `<span class="digit-box" style="visibility:hidden">0</span>`;
        }

        for (let i = 0; i < r.str.length; i++) {
            const pos = r.str.length - 1 - i;
            const gap = klecksGaps.find(g => g.type === r.label && g.pos === pos);
            if (gap) {
                html += `<div class="result-box klecks" data-type="klecks-${r.label}" data-pos="${pos}"></div>`;
            } else {
                let colorClass = '';
                if (subtractionGameState.colorSupport) {
                    if (pos === 0) colorClass = ' color-ones';
                    else if (pos === 1) colorClass = ' color-tens';
                    else if (pos === 2) colorClass = ' color-hundreds';
                }
                html += `<span class="digit-box${colorClass}">${r.str[i]}</span>`;
            }
        }
        row.innerHTML = html;
        container.appendChild(row);
    });

    // Merkeins (Borrows)
    const carryRow = document.createElement('div');
    carryRow.className = 'carry-row';
    carryRow.style.justifyContent = 'flex-end';
    let carryHtml = '<span style="width:30px; display:inline-block"></span>';
    for (let i = 0; i < maxLen; i++) {
        const pos = maxLen - 1 - i;
        carryHtml += pos > 0 ? `<div class="carry-box" data-type="borrow" data-pos="${pos}"></div>` : `<div style="width:50px; height:40px"></div>`;
    }
    carryRow.innerHTML = carryHtml;
    container.appendChild(carryRow);

    container.appendChild(Object.assign(document.createElement('div'), { className: 'calc-line' }));

    // Differenz
    const diffRow = document.createElement('div');
    diffRow.className = 'calc-row result-row';
    diffRow.style.justifyContent = 'flex-end';
    const dStr = difference.toString();
    const paddingCount = maxLen - dStr.length;

    let diffHtml = '<span style="width:30px; display:inline-block"></span>';
    for (let i = 0; i < paddingCount; i++) {
        diffHtml += `<span class="digit-box" style="visibility:hidden">0</span>`;
    }

    for (let i = 0; i < dStr.length; i++) {
        const pos = dStr.length - 1 - i;
        const gap = klecksGaps.find(g => g.type === 'result' && g.pos === pos);

        if (gap) {
            diffHtml += `<div class="result-box klecks" data-type="klecks-result" data-pos="${pos}"></div>`;
        } else if (isKlecksMode) {
            let colorClass = '';
            if (subtractionGameState.colorSupport) {
                if (pos === 0) colorClass = ' color-ones';
                else if (pos === 1) colorClass = ' color-tens';
                else if (pos === 2) colorClass = ' color-hundreds';
            }
            diffHtml += `<span class="digit-box${colorClass}">${dStr[i]}</span>`;
        } else {
            diffHtml += `<div class="result-box" data-type="result" data-pos="${pos}"></div>`;
        }
    }
    diffRow.innerHTML = diffHtml;
    container.appendChild(diffRow);

    setupDropZonesSubtraction();
}

function calculateBorrows(minuend, subtrahend) {
    const mStr = minuend.toString();
    const sStr = subtrahend.toString().padStart(mStr.length, '0');
    let borrows = {};
    let borrow = 0;
    for (let i = mStr.length - 1; i >= 0; i--) {
        let mDigit = parseInt(mStr[i]) - borrow;
        let sDigit = parseInt(sStr[i]);
        borrow = 0;
        if (mDigit < sDigit) {
            borrow = 1;
            borrows[mStr.length - 1 - i + 1] = 1;
        }
    }
    return borrows;
}

function validateInputSubtraction(zone, value) {
    const type = zone.dataset.type;
    const pos = parseInt(zone.dataset.pos);
    const numVal = parseInt(value);
    const task = subtractionGameState.currentTask;
    let isCorrect = false;

    if (type === 'result') {
        const s = task.difference.toString().padStart(task.minuend.toString().length, '0');
        if (numVal === parseInt(s[s.length - 1 - pos])) isCorrect = true;
    } else if (type === 'borrow') {
        if (numVal === (calculateBorrows(task.minuend, task.subtrahend)[pos] || 0)) isCorrect = true;
    } else if (type.startsWith('klecks-')) {
        const gap = task.klecksGaps.find(g => g.type === type.replace('klecks-', '') && g.pos === pos);
        if (numVal === gap.digit) isCorrect = true;
    }

    if (isCorrect) {
        // WICHTIG: klecks-Klasse behalten für checkFullCompletionSubtraction
        zone.classList.remove('wrong');
        zone.classList.add('correct');
        checkFullCompletionSubtraction();
    } else {
        zone.classList.add('wrong');
        setTimeout(() => { zone.classList.remove('wrong'); zone.textContent = ''; }, 800);
    }
}

function checkFullCompletionSubtraction() {
    const container = document.getElementById('subtractionTaskContainer');
    const isKlecks = subtractionGameState.mode === 'klecks';
    const targets = isKlecks ? container.querySelectorAll('.klecks') : container.querySelectorAll('.result-box');

    const allCorrect = Array.from(targets).every(b => b.classList.contains('correct'));

    const borrows = container.querySelectorAll('.carry-box');
    const allRelevantBorrowsCorrect = Array.from(borrows).every(b => {
        if (b.textContent === '') {
            // Im Klecks-Modus sind Merkzahlen optional
            if (isKlecks) return true;
            const pos = parseInt(b.dataset.pos);
            const expected = calculateBorrows(subtractionGameState.currentTask.minuend, subtractionGameState.currentTask.subtrahend)[pos] || 0;
            return expected === 0;
        }
        return b.classList.contains('correct');
    });

    if (allCorrect && targets.length > 0 && allRelevantBorrowsCorrect) {
        subtractionGameState.score++;
        updateScoreDisplaySubtraction();
        const feedback = document.querySelector('#subtractionScreen .feedback-area');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.querySelector('.feedback-text').textContent = 'Richtig gelöst!';
        }
        setTimeout(generateSubtractionTask, 1000);
    }
}

/* ============================================
   Input Method: Drag & Drop AND Click-to-Fill
   ============================================ */
let draggedValue = null;
let touchClone = null;

function setupTouchDrag(elem, selectHandler) {
    elem.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draggedValue = elem.dataset.value;
        if (selectHandler) selectHandler(draggedValue);

        if (touchClone) {
            touchClone.remove();
        }
        touchClone = elem.cloneNode(true);
        touchClone.classList.add('touch-drag-clone');
        
        const rect = elem.getBoundingClientRect();
        touchClone.style.width = rect.width + 'px';
        touchClone.style.height = rect.height + 'px';
        touchClone.style.left = (touch.clientX - rect.width / 2) + 'px';
        touchClone.style.top = (touch.clientY - rect.height / 2) + 'px';
        document.body.appendChild(touchClone);
    }, { passive: false });

    elem.addEventListener('touchmove', (e) => {
        if (!touchClone) return;
        e.preventDefault();
        const touch = e.touches[0];
        touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
        touchClone.style.top = (touch.clientY - touchClone.offsetHeight / 2) + 'px';
        
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        if (target && (target.classList.contains('result-box') || target.classList.contains('carry-box') || target.id === 'activeCarryMultiplication' || target.classList.contains('ld-cell') || target.classList.contains('mode2-cell'))) {
            target.classList.add('drag-over');
        }
    }, { passive: false });

    elem.addEventListener('touchend', (e) => {
        if (!touchClone) return;
        const touch = e.changedTouches[0];
        touchClone.remove();
        touchClone = null;

        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && draggedValue) {
            if (target.classList.contains('result-box') || target.classList.contains('carry-box') || target.id === 'activeCarryMultiplication' || target.classList.contains('ld-cell') || target.classList.contains('mode2-cell')) {
                if (!target.classList.contains('correct')) {
                    if (document.getElementById('additionScreen').classList.contains('active')) {
                        handleInput(target, draggedValue);
                    } else if (document.getElementById('subtractionScreen').classList.contains('active')) {
                        handleInputSubtraction(target, draggedValue);
                    } else if (document.getElementById('multiplicationScreen').classList.contains('active')) {
                        if (target.id === 'activeCarryMultiplication') {
                            target.textContent = draggedValue;
                        } else {
                            handleInputMultiplication(target, draggedValue);
                        }
                    } else if (document.getElementById('divisionMode2Screen').classList.contains('active')) {
                        target.textContent = draggedValue;
                        target.classList.remove('wrong');
                    } else if (document.getElementById('divisionMode3Screen').classList.contains('active')) {
                        target.textContent = draggedValue;
                        validateMode3Cell(target);
                    }
                }
            }
        }
    });
}

function setupInputMethod() {
    document.querySelectorAll('.draggable-number').forEach(elem => {
        elem.addEventListener('dragstart', (e) => {
            draggedValue = e.target.dataset.value;
            e.dataTransfer.setData('text/plain', draggedValue);
            selectNumber(draggedValue);
        });
        elem.addEventListener('click', () => {
            const val = elem.dataset.value;
            selectNumber(gameState.selectedNumber === val ? null : val);
        });
        setupTouchDrag(elem, selectNumber);
    });
}

function selectNumber(val) {
    gameState.selectedNumber = val;
    subtractionGameState.selectedNumber = val; // Synchronize with subtraction
    multiplicationGameState.selectedNumber = val; // Synchronize with multiplication
    document.querySelectorAll('.draggable-number').forEach(el => {
        el.classList.toggle('selected', el.dataset.value === val);
    });
}

function setupDropZones() {
    document.querySelectorAll('#additionTaskContainer .result-box, #additionTaskContainer .carry-box').forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val) handleInput(zone, val);
        });
        zone.addEventListener('click', () => {
            if (gameState.selectedNumber !== null) handleInput(zone, gameState.selectedNumber);
        });
    });
}

function setupDropZonesSubtraction() {
    document.querySelectorAll('#subtractionTaskContainer .result-box, #subtractionTaskContainer .carry-box').forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val) handleInputSubtraction(zone, val);
        });
        zone.addEventListener('click', () => {
            if (gameState.selectedNumber !== null) handleInputSubtraction(zone, gameState.selectedNumber);
        });
    });
}

function handleInput(targetZone, value) {
    if (gameState.isPlaying && !targetZone.classList.contains('correct')) {
        targetZone.textContent = value;
        validateInput(targetZone, value);
    }
}

function handleInputSubtraction(targetZone, value) {
    if (subtractionGameState.isPlaying && !targetZone.classList.contains('correct')) {
        targetZone.textContent = value;
        validateInputSubtraction(targetZone, value);
    }
}

/* ============================================
   MULTIPLIKATION - Logik & Rendering
   ============================================ */
const MultiplicationLogic = {
    generateTask(mode) {
        let num1, num2;
        if (mode === '3x1') {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * 9) + 1;
        } else if (mode === '3x10') {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = (Math.floor(Math.random() * 9) + 1) * 10;
        } else if (mode === '3x2') {
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * 90) + 10;
        } else {
            num1 = Math.floor(Math.random() * 9000) + 1000;
            num2 = Math.floor(Math.random() * 900) + 100;
        }
        return { num1, num2 };
    },

    calculateSolution(num1, num2) {
        const digits2 = String(num2).split('').map(Number);
        const steps = [];
        for (let i = 0; i < digits2.length; i++) {
            const digit = digits2[i];
            const powerOfTen = digits2.length - 1 - i;
            const product = num1 * digit * Math.pow(10, powerOfTen);
            steps.push({ digit, powerOfTen, value: product });
        }
        const finalResult = num1 * num2;
        return { num1, num2, steps, finalResult, totalLength: String(finalResult).length };
    }
};

function generateMultiplicationTask() {
    const feedbackArea = document.querySelector('#multiplicationScreen .feedback-area');
    if (feedbackArea) feedbackArea.style.display = 'none';

    const raw = MultiplicationLogic.generateTask(multiplicationGameState.mode);
    multiplicationGameState.currentTask = MultiplicationLogic.calculateSolution(raw.num1, raw.num2);

    renderMultiplicationTask();
}

function renderMultiplicationTask() {
    const container = document.getElementById('multiplicationTaskContainer');
    container.innerHTML = '';
    const task = multiplicationGameState.currentTask;

    const num1Str = String(task.num1);
    const num2Str = String(task.num2);
    const taskStr = `${num1Str}×${num2Str}`;
    const totalWidth = Math.max(task.totalLength, taskStr.length) + 1;

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${totalWidth}, 50px)`;
    container.style.gap = '5px';

    // 1. Aufgabenzeile
    const taskPadding = totalWidth - taskStr.length;
    for (let i = 0; i < taskPadding; i++) container.appendChild(createGridCell('', 'borderless'));

    num1Str.split('').forEach(char => container.appendChild(createGridCell(char, 'digit-box constant')));
    container.appendChild(createGridCell('×', 'operator constant'));
    num2Str.split('').forEach((char, idx) => {
        const p10 = num2Str.length - 1 - idx;
        let colorClass = '';
        if (multiplicationGameState.colorSupport) {
            if (p10 === 0) colorClass = ' color-ones';
            else if (p10 === 1) colorClass = ' color-tens';
            else if (p10 === 2) colorClass = ' color-hundreds';
        }
        container.appendChild(createGridCell(char, `digit-box constant${colorClass}`));
    });

    // Trennlinie 1
    const line1 = document.createElement('div');
    line1.className = 'calc-line';
    line1.style.gridColumn = `1 / span ${totalWidth}`;
    line1.style.width = '100%';
    line1.style.height = '3px';
    line1.style.backgroundColor = '#333';
    container.appendChild(line1);

    // 2. Zwischenschritte (nur wenn num2 > 9)
    if (task.num2 > 9 || task.num2 === 10 || multiplicationGameState.mode === '3x10') {
        task.steps.forEach(step => {
            const valStr = String(step.value);
            const padding = totalWidth - valStr.length;

            for (let i = 0; i < totalWidth; i++) {
                if (i < padding) {
                    container.appendChild(createGridCell('', 'borderless'));
                } else {
                    const digitIdx = i - padding;
                    const isTrailingZero = (digitIdx >= valStr.length - step.powerOfTen);
                    if (isTrailingZero) {
                        container.appendChild(createGridCell('0', 'digit-box constant muted'));
                    } else {
                        container.appendChild(createGridCell('', 'result-box empty', { expected: valStr[digitIdx] }));
                    }
                }
            }
        });

        // Trennlinie 2
        const line2 = document.createElement('div');
        line2.className = 'calc-line';
        line2.style.gridColumn = `1 / span ${totalWidth}`;
        line2.style.width = '100%';
        line2.style.height = '3px';
        line2.style.backgroundColor = '#333';
        container.appendChild(line2);
    }

    // 3. Ergebniszeile
    const sumStr = String(task.finalResult);
    const sumPadding = totalWidth - sumStr.length;
    for (let i = 0; i < totalWidth; i++) {
        if (i < sumPadding) {
            container.appendChild(createGridCell('', 'borderless'));
        } else {
            container.appendChild(createGridCell('', 'result-box empty', { expected: sumStr[i - sumPadding] }));
        }
    }

    setupDropZonesMultiplication();
}

function createGridCell(content, className, data = null) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = content;

    // Explicit styles for grid cells if not already in CSS
    if (className.includes('digit-box') || className.includes('result-box')) {
        div.style.width = '50px';
        div.style.height = '60px';
        div.style.lineHeight = '60px';
        div.style.textAlign = 'center';
        div.style.fontSize = '2rem';
        div.style.fontWeight = '600';
        div.style.fontFamily = 'Courier New, monospace';
        div.style.border = className.includes('borderless') ? 'none' : '2px solid #bdbdbd';
        div.style.borderRadius = '8px';
        div.style.background = className.includes('constant') ? '#fff' : '#f1f8f4';
    }

    if (className.includes('result-box')) {
        div.classList.add('multiplication-result-box');
        div.style.borderWidth = '3px';
        div.style.borderColor = '#FFA726';
    }

    if (className.includes('muted')) {
        div.style.opacity = '0.4';
    }

    if (data) {
        div.dataset.expected = data.expected;
    }
    return div;
}

function setupDropZonesMultiplication() {
    document.querySelectorAll('#multiplicationTaskContainer .result-box').forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val) handleInputMultiplication(zone, val);
        });
        zone.addEventListener('click', () => {
            if (multiplicationGameState.selectedNumber !== null) handleInputMultiplication(zone, multiplicationGameState.selectedNumber);
        });
    });

    // Carry Box large
    const carryBox = document.getElementById('activeCarryMultiplication');
    carryBox.addEventListener('click', () => {
        if (multiplicationGameState.selectedNumber !== null) carryBox.textContent = multiplicationGameState.selectedNumber;
    });
    carryBox.addEventListener('dragover', (e) => e.preventDefault());
    carryBox.addEventListener('drop', (e) => {
        e.preventDefault();
        const val = e.dataTransfer.getData('text/plain') || draggedValue;
        if (val) carryBox.textContent = val;
    });
}

function handleInputMultiplication(zone, value) {
    if (multiplicationGameState.isPlaying && !zone.classList.contains('correct')) {
        zone.textContent = value;
        validateInputMultiplication(zone, value);
    }
}

function validateInputMultiplication(zone, value) {
    if (value == zone.dataset.expected) {
        zone.classList.remove('wrong');
        zone.classList.add('correct');
        // Apply success styles manually as well
        zone.style.borderColor = '#2e7d32';
        zone.style.background = '#c8e6c9';
        zone.style.color = '#1b5e20';

        // Auto-clear carry box
        document.getElementById('activeCarryMultiplication').textContent = '';

        checkFullCompletionMultiplication();
    } else {
        zone.classList.add('wrong');
        setTimeout(() => { if (!zone.classList.contains('correct')) { zone.classList.remove('wrong'); zone.textContent = ''; } }, 800);
    }
}

function checkFullCompletionMultiplication() {
    const emptyCells = document.querySelectorAll('#multiplicationTaskContainer .empty');
    if (emptyCells.length === 0) return;

    const allCorrect = Array.from(emptyCells).every(c => c.classList.contains('correct'));

    if (allCorrect) {
        multiplicationGameState.score += 10;
        updateScoreDisplayMultiplication();
        const feedback = document.querySelector('#multiplicationScreen .feedback-area');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.querySelector('.feedback-text').textContent = 'Super gemacht! +10 Punkte';
        }
        setTimeout(generateMultiplicationTask, 2000);
    }
}

/* ============================================
   DIVISION – States & Config
   ============================================ */
let divisionMode1State = {
    score: 0,
    wrong: 0,
    timeLeft: 180,
    timerInterval: null,
    isPlaying: false,
    currentTask: null,
    lastTask: null,
    answers: []
};

let divisionMode2State = {
    rangeMax: 100,
    colorSupport: false,
    currentTask: null,
    score: 0,
    total: 0,
    startTs: null
};

let divisionMode3State = {
    modulType: 'modul1',
    rangeMax: 100,
    colorSupport: false,
    currentTask: null,
    score: 0,
    total: 0,
    startTs: null,
    timeLeft: 300,
    timerInterval: null,
    isPlaying: false
};


/* ============================================
   DIVISION – Generator (shared)
   ============================================ */
function generateDivisionTask(rangeOrModul) {
    let rangeMax = 1000;
    let modulType = null;
    if (typeof rangeOrModul === 'string') {
        modulType = rangeOrModul;
    } else {
        rangeMax = rangeOrModul;
    }

    const divisorMin = 2, divisorMax = 9;
    let divisor, dividend, quotient;

    if (modulType === 'modul1') {
        // Modul 1: Dividend ≤ 100, erste Ziffer > Divisor
        // Das bedeutet der Quotient ist immer ≥ 10.
        let attempts = 0;
        do {
            divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
            // Wir suchen einen Dividenden, der durch divisor teilbar ist und die Bedingung erfüllt
            // Erste Ziffer f > divisor. f kann also von divisor+1 bis 9 sein.
            const minF = divisor + 1;
            if (minF > 9) { // Falls divisor=9, gibt es keine Ziffer > 9. Wir nehmen divisor=2..8.
                divisor = Math.floor(Math.random() * 7) + 2; // 2..8
            }
            const f = Math.floor(Math.random() * (9 - (divisor + 1) + 1)) + (divisor + 1);
            const s = Math.floor(Math.random() * 10);
            dividend = f * 10 + s;
            quotient = dividend / divisor;
            attempts++;
        } while ((dividend % divisor !== 0 || dividend > 100) && attempts < 100);

        // Fallback falls kein Treffer (sollte bei 100 Versuchen klappen)
        if (dividend % divisor !== 0) {
            divisor = 7;
            dividend = 84;
            quotient = 12;
        }
    } else if (modulType === 'modul2') {
        // Modul 2: 2-stelliges Ergebnis, erste Ziffer < Divisor
        // Das bedeutet Dividend ist 3-stellig (100-999) und Q ist 2-stellig (10-99).
        let attempts = 0;
        do {
            divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
            // Wir wählen einen 2-stelligen Quotienten (11-99)
            quotient = Math.floor(Math.random() * (99 - 11 + 1)) + 11;
            dividend = divisor * quotient;
            attempts++;
        } while ((dividend < 100 || dividend > 999) && attempts < 100);

        if (attempts >= 100) {
            divisor = 6;
            dividend = 126;
            quotient = 21;
        }
    } else {
        // Modul 3 oder herkömmlicher Range (Halbschriftlich)
        rangeMax = (modulType === 'modul3') ? 1000 : rangeMax;

        // Für Modul 3 wollen wir Aufgaben, die mehrstufig sind (Quotient ≥ 11)
        divisor = Math.floor(Math.random() * (divisorMax - divisorMin + 1)) + divisorMin;
        const maxQuotient = Math.floor(rangeMax / divisor);
        const minQuotient = 11;
        const effectiveMin = Math.min(minQuotient, maxQuotient);
        quotient = Math.floor(Math.random() * (maxQuotient - effectiveMin + 1)) + effectiveMin;
        dividend = divisor * quotient;
    }

    return { dividend, divisor, quotient };
}

/* ============================================
   MODE 1 – Division üben (3-Minuten-Spiel)
   ============================================ */
function startDivisionMode1() {
    divisionMode1State.score = 0;
    divisionMode1State.wrong = 0;
    divisionMode1State.timeLeft = 180;
    divisionMode1State.isPlaying = true;
    divisionMode1State.lastTask = null;
    divisionMode1State.answers = [];

    document.getElementById('divisionMode1Score').textContent = '0';
    updateTimerDivisionMode1();
    showScreen('divisionMode1Screen');

    // Create answer buttons 1–10
    const grid = document.getElementById('divisionMode1AnswerGrid');
    grid.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = i;
        btn.dataset.value = i;
        btn.addEventListener('click', () => handleMode1Answer(i));
        grid.appendChild(btn);
    }

    if (divisionMode1State.timerInterval) clearInterval(divisionMode1State.timerInterval);
    divisionMode1State.timerInterval = setInterval(gameTickDivisionMode1, 1000);

    generateDivisionMode1Task();
}

function generateDivisionMode1Task() {
    let task;
    do {
        const quotient = Math.floor(Math.random() * 10) + 1; // 1–10
        const divisor = Math.floor(Math.random() * 9) + 2;   // 2–10
        const dividend = divisor * quotient;
        task = { dividend, divisor, quotient };
    } while (
        divisionMode1State.lastTask &&
        divisionMode1State.lastTask.dividend === task.dividend &&
        divisionMode1State.lastTask.divisor === task.divisor
    );

    divisionMode1State.currentTask = task;
    divisionMode1State.lastTask = task;

    const display = document.getElementById('divisionMode1TaskDisplay');
    display.innerHTML = `<span class="task-number">${task.dividend}</span> <span class="task-operator">:</span> <span class="task-number">${task.divisor}</span> <span class="task-operator">=</span> <span class="task-number">?</span>`;

    // Reset button states
    document.querySelectorAll('#divisionMode1AnswerGrid .answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
}

function handleMode1Answer(userAnswer) {
    if (!divisionMode1State.isPlaying) return;
    const task = divisionMode1State.currentTask;
    const correct = (userAnswer === task.quotient);

    divisionMode1State.answers.push({ task, userAnswer, correct });

    // Find clicked button to highlight
    const buttons = document.querySelectorAll('#divisionMode1AnswerGrid .answer-btn');
    buttons.forEach(btn => {
        if (parseInt(btn.dataset.value) === userAnswer) {
            btn.classList.add(correct ? 'correct' : 'wrong');
        }
        btn.disabled = true; // disable all briefly
    });

    if (correct) {
        divisionMode1State.score++;
        document.getElementById('divisionMode1Score').textContent = divisionMode1State.score;
    } else {
        divisionMode1State.wrong++;
        // Highlight correct answer too
        buttons.forEach(btn => {
            if (parseInt(btn.dataset.value) === task.quotient) {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        if (divisionMode1State.isPlaying) generateDivisionMode1Task();
    }, correct ? 600 : 1200);
}

function gameTickDivisionMode1() {
    if (!divisionMode1State.isPlaying) return;
    divisionMode1State.timeLeft--;
    updateTimerDivisionMode1();
    if (divisionMode1State.timeLeft <= 0) stopDivisionMode1();
}

function updateTimerDivisionMode1() {
    const min = Math.floor(divisionMode1State.timeLeft / 60);
    const sec = divisionMode1State.timeLeft % 60;
    document.getElementById('timerDisplayDivisionMode1').textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function stopDivisionMode1() {
    divisionMode1State.isPlaying = false;
    clearInterval(divisionMode1State.timerInterval);

    const total = divisionMode1State.score + divisionMode1State.wrong;
    const accuracy = total > 0 ? Math.round((divisionMode1State.score / total) * 100) : 0;

    document.getElementById('divMode1Total').textContent = total;
    document.getElementById('divMode1Correct').textContent = divisionMode1State.score;
    document.getElementById('divMode1Wrong').textContent = divisionMode1State.wrong;
    document.getElementById('divMode1Accuracy').textContent = accuracy + '%';

    const msg = document.getElementById('divMode1MotivationalMessage');
    if (accuracy >= 90) msg.textContent = 'Super gemacht! 🌟';
    else if (accuracy >= 70) msg.textContent = 'Schon ganz gut! 👍';
    else msg.textContent = 'Übe fleißig weiter … 💪';

    showScreen('resultScreenDivisionMode1');
}

function backFromDivisionMode1() {
    divisionMode1State.isPlaying = false;
    clearInterval(divisionMode1State.timerInterval);
    showScreen('divisionScreen');
}

/* ============================================
   MODE 2 – Halbschriftliche Division
   ============================================ */
function toggleColorSupportDivisionMode2() {
    divisionMode2State.colorSupport = !divisionMode2State.colorSupport;
    const btn = document.getElementById('colorSupportBtnDivisionMode2');
    const text = btn.querySelector('.toggle-text');
    if (divisionMode2State.colorSupport) {
        btn.classList.add('active');
        text.textContent = 'Farbige Unterstützung aktiv';
    } else {
        btn.classList.remove('active');
        text.textContent = 'Farbige Unterstützung einschalten';
    }
}

function startDivisionMode2(rangeMax) {
    divisionMode2State.rangeMax = rangeMax;
    divisionMode2State.score = 0;
    divisionMode2State.total = 0;
    divisionMode2State.startTs = Date.now();

    showScreen('divisionMode2Screen');
    document.getElementById('divisionMode2Title').textContent =
        `Halbschriftliche Division (bis ${rangeMax})`;

    setupDivisionMode2DragBar();
    generateDivisionMode2Task();
}

function setupDivisionMode2DragBar() {
    document.querySelectorAll('#divisionMode2DragBar .draggable-number').forEach(elem => {
        // Remove old listeners by cloning
        const newElem = elem.cloneNode(true);
        elem.parentNode.replaceChild(newElem, elem);

        newElem.addEventListener('dragstart', (e) => {
            draggedValue = newElem.dataset.value;
            e.dataTransfer.setData('text/plain', draggedValue);
            selectNumberDivision(draggedValue, 'mode2');
        });

        newElem.addEventListener('click', () => {
            const val = newElem.dataset.value;
            selectNumberDivision(divisionMode2State.selectedNumber === val ? null : val, 'mode2');
        });
        
        setupTouchDrag(newElem, (val) => selectNumberDivision(val, 'mode2'));
    });
    divisionMode2State.selectedNumber = null;
}

function selectNumberDivision(val, mode) {
    if (mode === 'mode2') {
        divisionMode2State.selectedNumber = val;
        document.querySelectorAll('#divisionMode2DragBar .draggable-number').forEach(el => {
            el.classList.toggle('selected', el.dataset.value === val);
        });
    } else if (mode === 'mode3') {
        divisionMode3State.selectedNumber = val;
        document.querySelectorAll('#divisionMode3DragBar .draggable-number').forEach(el => {
            el.classList.toggle('selected', el.dataset.value === val);
        });
    }
}

function generateDivisionMode2Task() {
    const task = generateDivisionTask(divisionMode2State.rangeMax);
    divisionMode2State.currentTask = task;
    divisionMode2State.total++;

    document.getElementById('divisionMode2TaskNum').textContent = divisionMode2State.total;

    // Show main task with fillable quotient boxes
    // Show main task with fillable quotient boxes
    const mainTaskEl = document.getElementById('divisionMode2MainTask');

    // Build dividend digits with color support
    const dividendStr = task.dividend.toString();
    let dividendHtml = '';
    dividendStr.split('').forEach((d, i) => {
        const pos = dividendStr.length - 1 - i;
        let colorClass = '';
        if (divisionMode2State.colorSupport) {
            if (pos === 0) colorClass = ' color-ones';
            else if (pos === 1) colorClass = ' color-tens';
            else if (pos === 2) colorClass = ' color-hundreds';
        }
        dividendHtml += `<span class="task-number${colorClass}">${d}</span>`;
    });

    // Build quotient input boxes
    const qDigits = task.quotient.toString().split('');
    let quotientBoxes = '';
    qDigits.forEach((d, i) => {
        const pos = qDigits.length - 1 - i;
        let colorClass = '';
        if (divisionMode2State.colorSupport) {
            if (pos === 0) colorClass = ' color-ones';
            else if (pos === 1) colorClass = ' color-tens';
            else if (pos === 2) colorClass = ' color-hundreds';
        }
        quotientBoxes += `<div class="result-box small mode2-cell mode2-quotient-cell${colorClass}" data-field="mainQuotient" data-expected="${d}" data-digit="${i}"></div>`;
    });

    mainTaskEl.innerHTML = `<span class="task-number-container">${dividendHtml}</span> <span class="task-operator">:</span> <span class="task-number">${task.divisor}</span> <span class="task-operator">=</span> <span class="main-quotient-boxes">${quotientBoxes}</span>`;

    // Setup click and drop handlers for quotient boxes
    mainTaskEl.querySelectorAll('.mode2-quotient-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            if (divisionMode2State.selectedNumber !== null && !cell.classList.contains('correct')) {
                cell.textContent = divisionMode2State.selectedNumber;
                cell.classList.remove('wrong');
            }
        });
        cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val && !cell.classList.contains('correct')) {
                cell.textContent = val;
                cell.classList.remove('wrong');
            }
        });
    });

    // Reset feedback & buttons
    document.getElementById('divisionMode2Feedback').style.display = 'none';
    document.getElementById('checkBtnMode2').style.display = '';
    document.getElementById('nextBtnMode2').style.display = 'none';

    // Create initial rows based on number of quotient digits
    const rowsContainer = document.getElementById('divisionMode2Rows');
    rowsContainer.innerHTML = '';
    const numRows = task.quotient.toString().length;
    for (let i = 0; i < numRows; i++) {
        addDivisionMode2Row();
    }
}

let mode2RowCount = 0;
function addDivisionMode2Row() {
    const task = divisionMode2State.currentTask;
    const rowsContainer = document.getElementById('divisionMode2Rows');
    const rowDiv = document.createElement('div');
    rowDiv.className = 'partial-division-row';
    rowDiv.dataset.rowIndex = rowsContainer.children.length;

    const dividendDigits = task.dividend.toString().length;
    const quotientDigits = task.quotient.toString().length;

    // Determine row color based on current row index and total expected rows
    // Stage 1: Hundreds/Thousands -> Red
    // Stage 2: Tens -> Blue
    // Stage 3: Ones -> Green
    // Simple heuristic: if we have 3 rows total, 0=Red, 1=Blue, 2=Green.
    // If we have 2 rows, 0=Blue, 1=Green.
    const totalRowsNeeded = quotientDigits;
    const currentRowIndex = rowsContainer.children.length;
    let stageColorClass = '';

    if (divisionMode2State.colorSupport) {
        if (quotientDigits === 3) {
            if (currentRowIndex === 0) stageColorClass = ' color-hundreds';
            else if (currentRowIndex === 1) stageColorClass = ' color-tens';
            else if (currentRowIndex === 2) stageColorClass = ' color-ones';
        } else if (quotientDigits === 2) {
            if (currentRowIndex === 0) stageColorClass = ' color-tens';
            else if (currentRowIndex === 1) stageColorClass = ' color-ones';
        } else {
            stageColorClass = ' color-ones';
        }
    }

    // subDividend input fields
    let subDivHtml = '';
    for (let i = 0; i < dividendDigits; i++) {
        subDivHtml += `<div class="result-box small mode2-cell${stageColorClass}" data-field="subDividend" data-digit="${i}"></div>`;
    }

    // subQuotient input fields
    let subQuoHtml = '';
    for (let i = 0; i < quotientDigits; i++) {
        subQuoHtml += `<div class="result-box small mode2-cell${stageColorClass}" data-field="subQuotient" data-digit="${i}"></div>`;
    }

    rowDiv.innerHTML = `
        <div class="partial-row-fields">
            <div class="partial-dividend">${subDivHtml}</div>
            <span class="task-operator">:</span>
            <span class="task-number-fixed">${task.divisor}</span>
            <span class="task-operator">=</span>
            <div class="partial-quotient">${subQuoHtml}</div>
        </div>
    `;

    rowsContainer.appendChild(rowDiv);

    // Setup click and drop handlers for new cells
    rowDiv.querySelectorAll('.mode2-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            if (divisionMode2State.selectedNumber !== null && !cell.classList.contains('correct')) {
                cell.textContent = divisionMode2State.selectedNumber;
                cell.classList.remove('wrong');
            }
        });
        cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val && !cell.classList.contains('correct')) {
                cell.textContent = val;
                cell.classList.remove('wrong');
            }
        });
    });
}

function checkDivisionMode2() {
    const task = divisionMode2State.currentTask;
    const rowsContainer = document.getElementById('divisionMode2Rows');
    const rows = rowsContainer.querySelectorAll('.partial-division-row');
    const feedbackEl = document.getElementById('divisionMode2Feedback');
    const feedbackText = feedbackEl.querySelector('.feedback-text');

    let allValid = true;
    let sumSubDividends = 0;
    let sumSubQuotients = 0;
    let hasEmptyFields = false;

    rows.forEach(row => {
        // Read subDividend
        const sdCells = row.querySelectorAll('[data-field="subDividend"]');
        let sdStr = '';
        sdCells.forEach(c => { sdStr += c.textContent; });
        const subDividend = parseInt(sdStr) || 0;

        // Read subQuotient
        const sqCells = row.querySelectorAll('[data-field="subQuotient"]');
        let sqStr = '';
        sqCells.forEach(c => { sqStr += c.textContent; });
        const subQuotient = parseInt(sqStr) || 0;

        // Empty check
        if (sdStr.trim() === '' || sqStr.trim() === '') {
            hasEmptyFields = true;
            return;
        }

        // Validate: subDividend divisible by divisor, subQuotient correct
        const isRowCorrect = (subDividend % task.divisor === 0) &&
            (subDividend / task.divisor === subQuotient) &&
            (subDividend > 0);

        if (isRowCorrect) {
            sdCells.forEach(c => { c.classList.remove('wrong'); c.classList.add('correct'); });
            sqCells.forEach(c => { c.classList.remove('wrong'); c.classList.add('correct'); });
            sumSubDividends += subDividend;
            sumSubQuotients += subQuotient;
        } else {
            allValid = false;
            sdCells.forEach(c => { c.classList.add('wrong'); c.classList.remove('correct'); });
            sqCells.forEach(c => { c.classList.add('wrong'); c.classList.remove('correct'); });
        }
    });

    if (hasEmptyFields) {
        feedbackEl.style.display = 'block';
        feedbackText.textContent = 'Bitte fülle alle Felder aus.';
        return;
    }

    // Check main quotient result fields
    const mainTaskEl = document.getElementById('divisionMode2MainTask');
    const quotientCells = mainTaskEl.querySelectorAll('[data-field="mainQuotient"]');
    let quotientStr = '';
    quotientCells.forEach(c => { quotientStr += c.textContent; });
    const enteredQuotient = parseInt(quotientStr) || 0;

    if (quotientStr.trim().length < quotientCells.length) {
        hasEmptyFields = true;
    }

    if (hasEmptyFields) {
        feedbackEl.style.display = 'block';
        feedbackText.textContent = 'Bitte fülle alle Felder aus.';
        return;
    }

    const quotientCorrect = (enteredQuotient === task.quotient);
    if (quotientCorrect) {
        quotientCells.forEach(c => { c.classList.remove('wrong'); c.classList.add('correct'); });
    } else {
        quotientCells.forEach(c => { c.classList.add('wrong'); c.classList.remove('correct'); });
    }

    // Check sums
    if (allValid && quotientCorrect && sumSubDividends === task.dividend && sumSubQuotients === task.quotient) {
        feedbackEl.style.display = 'block';
        feedbackText.textContent = '✅ Super! Alles richtig!';
        divisionMode2State.score++;
        document.getElementById('checkBtnMode2').style.display = 'none';
        document.getElementById('nextBtnMode2').style.display = '';
        document.getElementById('addRowBtnMode2').style.display = 'none';
    } else if (allValid) {
        // Rows individually correct but sums don't match
        feedbackEl.style.display = 'block';
        if (sumSubDividends !== task.dividend) {
            feedbackText.textContent = `❌ Die Teildividenden ergeben zusammen ${sumSubDividends}, aber es müssen ${task.dividend} sein.`;
        } else {
            feedbackText.textContent = `❌ Die Teilquotienten ergeben zusammen ${sumSubQuotients}, aber es müssen ${task.quotient} sein.`;
        }
    } else {
        feedbackEl.style.display = 'block';
        feedbackText.textContent = '❌ Einige Zeilen sind nicht korrekt. Prüfe die roten Felder.';
    }
}

function nextDivisionMode2Task() {
    document.getElementById('addRowBtnMode2').style.display = '';
    generateDivisionMode2Task();
}

function backFromDivisionMode2() {
    showScreen('divisionMode2SelectionScreen');
}

/* ============================================
   MODE 3 – Schriftliche Division (Long Division)
   ============================================ */
function toggleColorSupportDivisionMode3() {
    divisionMode3State.colorSupport = !divisionMode3State.colorSupport;
    const btn = document.getElementById('colorSupportBtnDivisionMode3');
    const text = btn.querySelector('.toggle-text');
    if (divisionMode3State.colorSupport) {
        btn.classList.add('active');
        text.textContent = 'Farbige Unterstützung aktiv';
    } else {
        btn.classList.remove('active');
        text.textContent = 'Farbige Unterstützung einschalten';
    }
}

function startDivisionMode3(modulType) {
    divisionMode3State.modulType = modulType;
    divisionMode3State.score = 0;
    divisionMode3State.total = 0;
    divisionMode3State.startTs = Date.now();

    const rangeMax = (modulType === 'modul1') ? 100 : 1000;
    divisionMode3State.rangeMax = rangeMax;

    showScreen('divisionMode3Screen');

    const titles = {
        'modul1': 'Modul 1: Erste Ziffer größer (bis 100)',
        'modul2': 'Modul 2: Erste Ziffer kleiner (bis 1000)',
        'modul3': 'Modul 3: Gemischt (bis 1000)'
    };
    document.getElementById('divisionMode3Title').textContent = titles[modulType] || 'Schriftliche Division';

    divisionMode3State.timeLeft = 300; // 5 Minuten
    divisionMode3State.isPlaying = true;
    updateTimerDivisionMode3();
    if (divisionMode3State.timerInterval) clearInterval(divisionMode3State.timerInterval);
    divisionMode3State.timerInterval = setInterval(gameTickDivisionMode3, 1000);

    setupDivisionMode3DragBar();
    generateDivisionMode3Task();
}

function updateTimerDivisionMode3() {
    const min = Math.floor(divisionMode3State.timeLeft / 60);
    const sec = divisionMode3State.timeLeft % 60;
    const timerDisplay = document.getElementById('timerDisplayDivisionMode3');
    if (timerDisplay) {
        timerDisplay.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
}

function stopGameDivisionMode3() {
    divisionMode3State.isPlaying = false;
    clearInterval(divisionMode3State.timerInterval);
    document.getElementById('divMode3Score').textContent = divisionMode3State.score;
    document.getElementById('divMode3Total').textContent = divisionMode3State.total;
    const msg = document.getElementById('divMode3MotivationalMessage');
    if (divisionMode3State.score > 10) msg.textContent = "Wahnsinn! Du bist ein echter Profi! 🚀";
    else if (divisionMode3State.score > 5) msg.textContent = "Klasse gemacht! Weiter so! 🌟";
    else msg.textContent = "Gut geübt! Beim nächsten Mal schaffst du noch mehr! 💪";
    showScreen('resultScreenDivisionMode3');
}

function gameTickDivisionMode3() {
    if (!divisionMode3State.isPlaying) return;
    divisionMode3State.timeLeft--;
    updateTimerDivisionMode3();
    if (divisionMode3State.timeLeft <= 0) stopGameDivisionMode3();
}

function setupDivisionMode3DragBar() {
    document.querySelectorAll('#divisionMode3DragBar .draggable-number').forEach(elem => {
        const newElem = elem.cloneNode(true);
        elem.parentNode.replaceChild(newElem, elem);

        newElem.addEventListener('dragstart', (e) => {
            draggedValue = newElem.dataset.value;
            e.dataTransfer.setData('text/plain', draggedValue);
            selectNumberDivision(draggedValue, 'mode3');
        });

        newElem.addEventListener('click', () => {
            const val = newElem.dataset.value;
            selectNumberDivision(divisionMode3State.selectedNumber === val ? null : val, 'mode3');
        });

        setupTouchDrag(newElem, (val) => selectNumberDivision(val, 'mode3'));
    });
    divisionMode3State.selectedNumber = null;
}

function generateDivisionMode3Task() {
    const task = generateDivisionTask(divisionMode3State.modulType);
    divisionMode3State.currentTask = task;
    divisionMode3State.total++;

    document.getElementById('divisionMode3TaskNum').textContent = divisionMode3State.total;
    document.getElementById('divisionMode3Feedback').style.display = 'none';
    document.getElementById('nextBtnMode3').style.display = 'none';

    renderLongDivision(task);
}

function renderLongDivision(task) {
    const container = document.getElementById('divisionMode3Grid');
    container.innerHTML = '';

    const dividendStr = task.dividend.toString();
    const quotientStr = task.quotient.toString();
    const divisor = task.divisor;
    const numDigits = dividendStr.length;

    // Compute all long division steps
    const steps = computeLongDivisionSteps(task.dividend, divisor);

    // Build a CSS Grid
    // Columns: [minus/space] [digits...] [:] [divisor] [=] [quotient digits...]
    const quotientLen = quotientStr.length;
    const gridEl = document.createElement('div');
    gridEl.className = 'long-division-grid';
    gridEl.style.display = 'grid';
    gridEl.style.gridTemplateColumns = `30px repeat(${numDigits}, 50px) 40px auto 40px repeat(${quotientLen}, 50px)`;
    gridEl.style.gap = '4px 2px';
    gridEl.style.justifyContent = 'start';
    gridEl.style.alignItems = 'center';

    // Helper to get color class based on column index (0-based from first digit)
    const getColColorClass = (colIndex) => {
        if (!divisionMode3State.colorSupport) return '';
        const place = numDigits - 1 - colIndex; // 0=Ones, 1=Tens, 2=Hundreds
        if (place === 0) return ' color-ones';
        if (place === 1) return ' color-tens';
        if (place === 2) return ' color-hundreds';
        return '';
    };

    let currentRow = 1; // Row 1 is for the header

    // === Header Row (integrated into grid) ===
    // Dividend digits
    dividendStr.split('').forEach((d, i) => {
        const cell = document.createElement('div');
        cell.className = `digit-box${getColColorClass(i)}`;
        cell.textContent = d;
        cell.style.gridRow = '1';
        cell.style.gridColumn = (i + 2).toString();
        gridEl.appendChild(cell);
    });

    // Operator :
    const opColon = document.createElement('span');
    opColon.className = 'ld-operator';
    opColon.textContent = ':';
    opColon.style.gridRow = '1';
    opColon.style.gridColumn = (numDigits + 2).toString();
    gridEl.appendChild(opColon);

    // Divisor
    const divisorEl = document.createElement('span');
    divisorEl.className = 'ld-divisor';
    divisorEl.textContent = divisor;
    divisorEl.style.gridRow = '1';
    divisorEl.style.gridColumn = (numDigits + 3).toString();
    gridEl.appendChild(divisorEl);

    // Operator =
    const opEquals = document.createElement('span');
    opEquals.className = 'ld-operator';
    opEquals.textContent = '=';
    opEquals.style.gridRow = '1';
    opEquals.style.gridColumn = (numDigits + 4).toString();
    gridEl.appendChild(opEquals);

    // Quotient digits (as result boxes)
    quotientStr.split('').forEach((d, i) => {
        const pos = quotientStr.length - 1 - i;
        let colorClass = '';
        if (divisionMode3State.colorSupport) {
            if (pos === 0) colorClass = ' color-ones';
            else if (pos === 1) colorClass = ' color-tens';
            else if (pos === 2) colorClass = ' color-hundreds';
        }
        const box = document.createElement('div');
        box.className = `result-box small ld-cell${colorClass}`;
        box.dataset.expected = d;
        box.dataset.stepType = 'quotient';
        box.dataset.stepIndex = i;
        box.style.gridRow = '1';
        box.style.gridColumn = (numDigits + 5 + i).toString();
        gridEl.appendChild(box);
    });

    currentRow++; // Start calculation steps from Row 2

    // === Step rows ===
    steps.forEach((step, idx) => {
        // --- Partial Product Row ---
        const ppStr = step.partialProduct.toString();
        const ppEndCol = step.position;

        // Minus sign
        const minusEl = document.createElement('span');
        minusEl.className = 'ld-minus';
        minusEl.textContent = '−';
        minusEl.style.gridRow = currentRow.toString();
        minusEl.style.gridColumn = '1';
        gridEl.appendChild(minusEl);

        // Partial product digits
        ppStr.split('').forEach((d, di) => {
            const col = ppEndCol - ppStr.length + 1 + di;
            const cell = document.createElement('div');
            // Use color of the step's primary column (DECOMPOSITION logic)
            cell.className = `result-box small ld-cell${getColColorClass(step.position)}`;
            cell.dataset.expected = d;
            cell.dataset.stepType = 'partialProduct';
            cell.dataset.stepIndex = idx;
            cell.dataset.digit = di;
            cell.style.gridRow = currentRow.toString();
            cell.style.gridColumn = (col + 2).toString();
            gridEl.appendChild(cell);
        });
        currentRow++;

        // Calc line
        const line = document.createElement('div');
        line.className = 'calc-line ld-line';
        line.style.gridRow = currentRow.toString();
        const lineStartCol = Math.max(1, ppEndCol - ppStr.length + 2);
        const lineEndCol = ppEndCol + 3;
        line.style.gridColumn = `${lineStartCol} / ${lineEndCol}`;
        gridEl.appendChild(line);
        currentRow++;

        // --- Remainder Row ---
        let remVal;
        if (idx < steps.length - 1) {
            remVal = steps[idx + 1].partialDividend;
        } else {
            remVal = step.remainder;
        }

        if (idx < steps.length - 1) {
            const remainderStr = step.remainder.toString();
            // Remainder digits
            remainderStr.split('').forEach((d, di) => {
                const col = step.position - remainderStr.length + 1 + di;
                const cell = document.createElement('div');
                // Color based on the step that produced this remainder
                cell.className = `result-box small ld-cell${getColColorClass(step.position)}`;
                cell.dataset.expected = d;
                cell.dataset.stepType = 'remainder';
                cell.dataset.stepIndex = idx;
                cell.dataset.digit = di;
                cell.style.gridRow = currentRow.toString();
                cell.style.gridColumn = (col + 2).toString();
                gridEl.appendChild(cell);
            });
            // Brought-down digit
            const broughtDown = dividendStr[step.position + 1];
            const nextPos = step.position + 1;
            const bdCell = document.createElement('div');
            bdCell.className = `result-box small ld-cell${getColColorClass(nextPos)}`;
            bdCell.dataset.expected = broughtDown;
            bdCell.dataset.stepType = 'bringDown';
            bdCell.dataset.stepIndex = idx;
            bdCell.dataset.digit = remainderStr.length.toString();
            bdCell.style.gridRow = currentRow.toString();
            bdCell.style.gridColumn = (nextPos + 2).toString();
            gridEl.appendChild(bdCell);
        } else {
            // Final remainder
            const remStr = remVal.toString();
            remStr.split('').forEach((d, di) => {
                const col = step.position - remStr.length + 1 + di;
                const cell = document.createElement('div');
                // Final remainder is always green (ones)
                cell.className = `result-box small ld-cell color-ones`;
                cell.dataset.expected = d;
                cell.dataset.stepType = 'finalRemainder';
                cell.dataset.stepIndex = idx;
                cell.dataset.digit = di;
                cell.style.gridRow = currentRow.toString();
                cell.style.gridColumn = (col + 2).toString();
                gridEl.appendChild(cell);
            });
        }
        currentRow++;
    });

    container.appendChild(gridEl);

    // Setup click and drop handlers
    container.querySelectorAll('.ld-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            if (divisionMode3State.selectedNumber !== null && !cell.classList.contains('correct')) {
                cell.textContent = divisionMode3State.selectedNumber;
                validateMode3Cell(cell);
            }
        });
        cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const val = e.dataTransfer.getData('text/plain') || draggedValue;
            if (val && !cell.classList.contains('correct')) {
                cell.textContent = val;
                validateMode3Cell(cell);
            }
        });
    });
}

function computeLongDivisionSteps(dividend, divisor) {
    const digits = dividend.toString().split('').map(Number);
    const steps = [];
    let currentValue = 0;

    for (let i = 0; i < digits.length; i++) {
        currentValue = currentValue * 10 + digits[i];

        if (currentValue >= divisor || steps.length > 0) {
            const quotientDigit = Math.floor(currentValue / divisor);
            const partialProduct = quotientDigit * divisor;
            const remainder = currentValue - partialProduct;

            steps.push({
                position: i,
                partialDividend: currentValue,
                quotientDigit: quotientDigit,
                partialProduct: partialProduct,
                remainder: remainder
            });

            currentValue = remainder;
        }
    }

    return steps;
}

function validateMode3Cell(cell) {
    const expected = cell.dataset.expected;
    const value = cell.textContent;

    if (value === expected) {
        cell.classList.remove('wrong');
        cell.classList.add('correct');
        checkFullCompletionMode3();
    } else {
        cell.classList.add('wrong');
        setTimeout(() => {
            if (!cell.classList.contains('correct')) {
                cell.classList.remove('wrong');
                cell.textContent = '';
            }
        }, 800);
    }
}

function checkFullCompletionMode3() {
    const container = document.getElementById('divisionMode3Grid');
    const allCells = container.querySelectorAll('.ld-cell');
    if (allCells.length === 0) return;

    const allCorrect = Array.from(allCells).every(c => c.classList.contains('correct'));

    if (allCorrect) {
        divisionMode3State.score++;
        const feedbackEl = document.getElementById('divisionMode3Feedback');
        feedbackEl.style.display = 'block';
        feedbackEl.querySelector('.feedback-text').textContent = '✅ Richtig gelöst! Super!';
        document.getElementById('nextBtnMode3').style.display = '';
    }
}

function nextDivisionMode3Task() {
    generateDivisionMode3Task();
}

function backFromDivisionMode3() {
    divisionMode3State.isPlaying = false;
    if (divisionMode3State.timerInterval) clearInterval(divisionMode3State.timerInterval);
    showScreen('divisionMode3SelectionScreen');
}

// Global Exports
window.showScreen = showScreen;
window.toggleColorSupport = toggleColorSupport;
window.toggleColorSupportSubtraction = toggleColorSupportSubtraction;
window.toggleColorSupportMultiplication = toggleColorSupportMultiplication;
window.startAdditionExercise = startAdditionExercise;
window.startSubtractionExercise = startSubtractionExercise;
window.startMultiplicationExercise = startMultiplicationExercise;
window.openMultiplicationApp = function () { window.location.href = '../schriftliche Multiplikation- zweistellige Zahl/index.html'; };
// Division exports
window.startDivisionMode1 = startDivisionMode1;
window.backFromDivisionMode1 = backFromDivisionMode1;
window.startDivisionMode2 = startDivisionMode2;
window.backFromDivisionMode2 = backFromDivisionMode2;
window.toggleColorSupportDivisionMode2 = toggleColorSupportDivisionMode2;
window.addDivisionMode2Row = addDivisionMode2Row;
window.checkDivisionMode2 = checkDivisionMode2;
window.nextDivisionMode2Task = nextDivisionMode2Task;
window.startDivisionMode3 = startDivisionMode3;
window.backFromDivisionMode3 = backFromDivisionMode3;
window.toggleColorSupportDivisionMode3 = toggleColorSupportDivisionMode3;
window.nextDivisionMode3Task = nextDivisionMode3Task;
