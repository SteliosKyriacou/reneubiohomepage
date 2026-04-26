const industryData = {
    costs: {
        preclinical: 30, // $M
        phase1: 15,
        phase2: 50,
        phase3: 250
    },
    successRates: {
        phase1: 0.60,
        phase2: 0.35,
        phase3: 0.60
    }
};

const serviceTiers = {
    preclinical: { name: 'Single-Asset', cost: 0.20, id: 'tier-single' },
    phase1: { name: 'Single-Asset', cost: 0.20, id: 'tier-single' },
    phase2: { name: 'Portfolio Screen', cost: 0.50, id: 'tier-portfolio' },
    phase3: { name: 'Recurring Collaboration', cost: 1.5, id: 'tier-recurring' }
};

let savingsChart = null;
let deltaChart = null;

function init() {
    setupEventListeners();
    updateModel();
}

function setupEventListeners() {
    const inputs = ['portfolioSize', 'predictiveLift'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            document.getElementById(id + 'Val').textContent = e.target.value + (id === 'predictiveLift' ? '%' : '');
            updateModel();
        });
    });

    document.querySelectorAll('input[name="focusStage"]').forEach(radio => {
        radio.addEventListener('change', updateModel);
    });
}

function updateModel() {
    const n = parseInt(document.getElementById('portfolioSize').value);
    const lift = parseInt(document.getElementById('predictiveLift').value) / 100;
    const focusStage = document.querySelector('input[name="focusStage"]:checked').value;

    const results = calculateSavings(n, lift, focusStage);
    updateUI(results);
    updateCharts(results);
}

function calculateSavings(n, lift, focusStage) {
    const baseP1 = n;
    const baseP2 = baseP1 * industryData.successRates.phase1;
    const baseP3 = baseP2 * industryData.successRates.phase2;
    const baseMarket = baseP3 * industryData.successRates.phase3;

    const baseCost = (n * industryData.costs.preclinical) + 
                     (baseP1 * industryData.costs.phase1) + 
                     (baseP2 * industryData.costs.phase2) + 
                     (baseP3 * industryData.costs.phase3);

    const totalFailures = n - baseMarket;
    const failP1 = baseP1 - baseP2;
    const failP2 = baseP2 - baseP3;
    const failP3 = baseP3 - baseMarket;

    const saveIfKilledAtPre = industryData.costs.phase1 + industryData.costs.phase2 + industryData.costs.phase3;
    const saveIfKilledAtP1 = industryData.costs.phase2 + industryData.costs.phase3;
    const saveIfKilledAtP2 = industryData.costs.phase3;

    let savings = 0;
    let analysisCost = 0;

    // Analysis cost depends on tier
    const tier = serviceTiers[focusStage];
    if (focusStage === 'phase3') {
        analysisCost = tier.cost; // Annual recurring
        savings = baseP3 * industryData.costs.phase3 * 0.1 * lift;
    } else {
        analysisCost = n * tier.cost; // Cost per asset analyzed in portfolio
        if (focusStage === 'preclinical') {
            savings = totalFailures * lift * saveIfKilledAtPre;
        } else if (focusStage === 'phase1') {
            savings = (failP2 + failP3) * lift * saveIfKilledAtP1;
        } else if (focusStage === 'phase2') {
            savings = failP3 * lift * saveIfKilledAtP2;
        }
    }

    const roiMultiple = savings / analysisCost;

    return {
        totalSavings: savings,
        roiMultiple: roiMultiple,
        analysisCost: analysisCost,
        successCount: baseMarket.toFixed(1),
        stage: focusStage,
        tier: tier
    };
}

function updateUI(res) {
    document.getElementById('totalSavings').textContent = `$${Math.round(res.totalSavings)}M`;
    document.getElementById('roiMultiple').textContent = `${Math.round(res.roiMultiple)}x`;
    document.getElementById('analysisCost').textContent = `$${Math.round(res.analysisCost * 1000)}K`;

    // Highlight active tier
    document.querySelectorAll('.pricing-tiers .stat-card').forEach(card => card.classList.remove('active-tier'));
    const activeCard = document.getElementById(res.tier.id);
    if (activeCard) activeCard.classList.add('active-tier');

    const insightText = document.getElementById('insightText');
    const multipleStr = Math.round(res.roiMultiple);
    
    if (res.stage === 'preclinical') {
        insightText.textContent = `At the Preclinical stage, AlphaForge captures a ${multipleStr}x ROI. For a service fee of $${Math.round(res.analysisCost * 1000)}K, you are shielding over $${Math.round(res.totalSavings)}M in downstream clinical capital from high-risk assets. This is the optimal entry point for high-volume portfolio screens.`;
    } else if (res.stage === 'phase1') {
        insightText.textContent = `Phase 1 analysis provides a ${multipleStr}x return. By filtering out non-viable candidates before the expensive Phase 2 'Chasm', AlphaForge preserves $${Math.round(res.totalSavings)}M in capital that can be reallocated to stronger candidates.`;
    } else if (res.stage === 'phase2') {
        insightText.textContent = `Phase 2 analysis targets the $250M+ Phase 3 disaster. Even with a higher-tier Portfolio Screen ($${Math.round(res.analysisCost * 1000)}K), the ${multipleStr}x ROI remains substantial, primarily by avoiding the extreme cost of failed late-stage trials.`;
    } else {
        insightText.textContent = `Recurring Collaboration at Phase 3 focuses on optimization and strategic de-risking. While the ROI multiple (${multipleStr}x) is lower than earlier stages, the absolute dollar value preserved ($${Math.round(res.totalSavings)}M) remains critical for final-stage success and platform licensing paths.`;
    }
}

function updateCharts(res) {
    const ctxSavings = document.getElementById('savingsChart').getContext('2d');
    const ctxDelta = document.getElementById('deltaChart').getContext('2d');
    
    const n = parseInt(document.getElementById('portfolioSize').value);
    const lift = parseInt(document.getElementById('predictiveLift').value) / 100;
    const stages = ['preclinical', 'phase1', 'phase2', 'phase3'];
    
    const allResults = stages.map(s => calculateSavings(n, lift, s));

    // Chart 1: Cumulative Savings
    if (savingsChart) savingsChart.destroy();
    savingsChart = new Chart(ctxSavings, {
        type: 'bar',
        data: {
            labels: ['Preclinical', 'Phase 1', 'Phase 2', 'Phase 3'],
            datasets: [{
                label: 'Potential Savings ($M)',
                data: allResults.map(r => r.totalSavings),
                backgroundColor: stages.map(s => s === res.stage ? '#00d2ff' : 'rgba(255, 255, 255, 0.1)'),
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Cumulative Capital Preserved ($M)', color: '#fff' }, legend: { display: false } },
            scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } }, x: { ticks: { color: '#8b949e' } } }
        }
    });

    // Chart 2: Savings Delta (Savings vs Cost)
    if (deltaChart) deltaChart.destroy();
    deltaChart = new Chart(ctxDelta, {
        type: 'line',
        data: {
            labels: ['Preclinical', 'Phase 1', 'Phase 2', 'Phase 3'],
            datasets: [
                {
                    label: 'Savings Delta ($M)',
                    data: allResults.map(r => r.totalSavings - r.analysisCost),
                    borderColor: '#00d2ff',
                    backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Service Cost ($M)',
                    data: allResults.map(r => r.analysisCost),
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Net Savings Delta (Savings - Cost)', color: '#fff' }, legend: { labels: { color: '#8b949e' } } },
            scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } }, x: { ticks: { color: '#8b949e' } } }
        }
    });
}

window.onload = init;
