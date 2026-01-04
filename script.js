document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM ELEMENTS ---
    const btnLong = document.getElementById('btn-long');
    const btnShort = document.getElementById('btn-short');
    const levBtns = document.querySelectorAll('.lev-btn');
    const levInput = document.getElementById('leverage-input'); // The Custom Input
    const calcBtn = document.getElementById('calculate-btn');

    // Inputs
    const inputInvestment = document.getElementById('investment');
    const inputEntry = document.getElementById('entry-price');
    const inputExit = document.getElementById('exit-price');
    const inputTarget = document.getElementById('target-percent'); // The % Input
    const inputMaker = document.getElementById('maker-fee');
    const inputTaker = document.getElementById('taker-fee');

    // Outputs
    const outPnl = document.getElementById('result-pnl');
    const outRoi = document.getElementById('result-roi');
    const outBalance = document.getElementById('result-balance');
    const outFees = document.getElementById('result-fees');
    const outBreakEven = document.getElementById('result-breakeven');

    // --- 2. STATE ---
    let isLong = true; // Default to Long
    let currentLeverage = 10; // Default leverage

    // --- 3. EVENT LISTENERS ---

    // A. Toggle Long/Short
    btnLong.addEventListener('click', () => setMode('long'));
    btnShort.addEventListener('click', () => setMode('short'));

    // B. Leverage Buttons (Preset)
    levBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            levBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Update State & Input
            currentLeverage = parseInt(e.target.dataset.value);
            levInput.value = currentLeverage;
        });
    });

    // C. Custom Leverage Input (THIS WAS MISSING/BROKEN)
    levInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        // Only update if it's a valid number
        if (!isNaN(val) && val > 0) {
            currentLeverage = val;
            
            // Optional: Highlight a button if it matches, otherwise unhighlight all
            levBtns.forEach(btn => {
                if(parseInt(btn.dataset.value) === currentLeverage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });

    // D. Sync Logic: Target % <-> Exit Price
    
    // 1. User types Target % -> Calculate Exit Price
    inputTarget.addEventListener('input', () => {
        const entry = parseFloat(inputEntry.value);
        const percent = parseFloat(inputTarget.value);

        if (!entry || isNaN(percent)) return;

        let newExit = 0;
        if (isLong) {
            // Long: Entry + 1%
            newExit = entry * (1 + (percent / 100));
        } else {
            // Short: Entry - 1%
            newExit = entry * (1 - (percent / 100));
        }
        inputExit.value = newExit.toFixed(2);
    });

    // 2. User types Exit Price -> Calculate Target %
    inputExit.addEventListener('input', () => {
        const entry = parseFloat(inputEntry.value);
        const exit = parseFloat(inputExit.value);

        if (!entry || !exit) return;

        let diffPercent = 0;
        if (isLong) {
            diffPercent = ((exit - entry) / entry) * 100;
        } else {
            diffPercent = ((entry - exit) / entry) * 100;
        }
        inputTarget.value = diffPercent.toFixed(2);
    });

    // 3. User changes Entry Price -> Refresh the target
    inputEntry.addEventListener('input', () => {
        // If we have a target %, keep it and update exit price
        if(inputTarget.value) {
            inputTarget.dispatchEvent(new Event('input'));
        }
    });

    // E. Calculate Trigger
    calcBtn.addEventListener('click', calculateResults);

    // --- 4. FUNCTIONS ---

    function setMode(mode) {
        if (mode === 'long') {
            isLong = true;
            btnLong.classList.add('active-long');
            btnShort.classList.remove('active-short');
            calcBtn.style.backgroundColor = '#0ecb81'; // Green
            calcBtn.style.color = '#fff';
        } else {
            isLong = false;
            btnShort.classList.add('active-short');
            btnLong.classList.remove('active-long');
            calcBtn.style.backgroundColor = '#f6465d'; // Red
            calcBtn.style.color = '#fff';
        }
        // Recalculate target logic if mode switches
        if(inputTarget.value) inputTarget.dispatchEvent(new Event('input'));
    }

    function calculateResults() {
        // 1. Get Values
        const investment = parseFloat(inputInvestment.value) || 0;
        const entry = parseFloat(inputEntry.value) || 0;
        const exit = parseFloat(inputExit.value) || 0;
        const makerRate = (parseFloat(inputMaker.value) || 0) / 100;
        const takerRate = (parseFloat(inputTaker.value) || 0) / 100;

        if (investment === 0 || entry === 0) return;

        // 2. Core Math
        // USE THE GLOBAL currentLeverage VARIABLE
        const positionSize = investment * currentLeverage;
        
        const totalFeeCost = positionSize * (makerRate + takerRate);

        let grossPnl = 0;
        let priceDiffPercent = 0;

        if (isLong) {
            priceDiffPercent = (exit - entry) / entry;
        } else {
            priceDiffPercent = (entry - exit) / entry;
        }

        grossPnl = positionSize * priceDiffPercent;

        // 3. Net Results
        const netPnl = grossPnl - totalFeeCost;
        const finalBalance = investment + netPnl;
        const roi = (netPnl / investment) * 100;

        // 4. Break Even Price
        const priceNeededToCoverFees = (totalFeeCost * entry) / positionSize;
        let breakEvenPrice = 0;

        if (isLong) {
            breakEvenPrice = entry + priceNeededToCoverFees;
        } else {
            breakEvenPrice = entry - priceNeededToCoverFees;
        }

        // --- 5. RENDER ---
        const fmtMoney = (num) => {
            return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        outPnl.innerText = `${fmtMoney(netPnl)} USDT`;
        outRoi.innerText = `${roi.toFixed(2)}%`;
        outBalance.innerText = `${fmtMoney(finalBalance)} USDT`;
        outFees.innerText = `-${fmtMoney(totalFeeCost)} USDT`;
        outBreakEven.innerText = fmtMoney(breakEvenPrice);

        // Coloring
        outPnl.className = 'value'; 
        outRoi.className = 'value'; 
        
        if (netPnl > 0) {
            outPnl.classList.add('text-green');
            outRoi.classList.add('text-green');
        } else if (netPnl < 0) {
            outPnl.classList.add('text-red');
            outRoi.classList.add('text-red');
        }
    }

    // Initialize logic on load
    setMode('long');
    // Set default active button
    document.querySelector('.lev-btn[data-value="10"]').classList.add('active');
});