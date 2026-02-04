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

function setupInputMethod() {
    document.querySelectorAll('.draggable-number').forEach(elem => {
        elem.addEventListener('dragstart', (e) => {
            draggedValue = e.target.dataset.value;
            e.dataTransfer.setData('text/plain', draggedValue);
            selectNumber(draggedValue);
        });
        elem.addEventListener('touchstart', (e) => {
            draggedValue = e.target.dataset.value;
            selectNumber(draggedValue);
        }, { passive: true });
        elem.addEventListener('click', () => {
            const val = elem.dataset.value;
            selectNumber(gameState.selectedNumber === val ? null : val);
        });
    });
}

function selectNumber(val) {
    gameState.selectedNumber = val;
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

// Global Exports
window.showScreen = showScreen;
window.toggleColorSupport = toggleColorSupport;
window.toggleColorSupportSubtraction = toggleColorSupportSubtraction;
window.startAdditionExercise = startAdditionExercise;
window.startSubtractionExercise = startSubtractionExercise;
window.openMultiplicationApp = function () { window.location.href = '../schriftliche Multiplikation- zweistellige Zahl/index.html'; };
