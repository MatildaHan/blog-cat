(() => {
    const root = document.getElementById('tiantian');
    if (!root) return;

    const panel = root.querySelector('.tiantian__panel');
    const cat = root.querySelector('.tiantian__cat');
    const collapseButton = root.querySelector('.tiantian__collapse');
    const launcher = root.querySelector('.tiantian__launcher');
    const idleImage = root.querySelector('.tiantian__idle');
    const blinkImage = root.querySelector('.tiantian__blink');
    const restButton = root.querySelector('.tiantian__rest');
    const speakButton = root.querySelector('.tiantian__speak');
    const bubble = root.querySelector('.tiantian__bubble');
    const poses = {
        petting: root.querySelector('.tiantian__pose--petting'),
        resting: root.querySelector('.tiantian__pose--resting'),
        speaking: root.querySelector('.tiantian__pose--speaking')
    };
    const durations = { petting: 1800, speaking: 3000 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactScreen = window.matchMedia('(max-width: 1200px)');
    const storageKey = 'tiantian-collapsed';
    let saved = null;
    try { saved = localStorage.getItem(storageKey); } catch (_) {}
    let hasPreference = saved === '1' || saved === '0';
    let collapsed = hasPreference ? saved === '1' : compactScreen.matches;
    let state = 'idle';
    let shown = false;
    let nextBlink = null;
    let endBlink = null;
    let restTimer = null;
    let stateTimer = null;

    function clearBlink() {
        clearTimeout(nextBlink);
        clearTimeout(endBlink);
        nextBlink = null;
        endBlink = null;
        root.classList.remove('is-blinking');
    }

    function clearAutomatic() {
        clearBlink();
        clearTimeout(restTimer);
        restTimer = null;
    }

    function clearAll() {
        clearAutomatic();
        clearTimeout(stateTimer);
        stateTimer = null;
    }

    function isActive() {
        return !root.hidden && !collapsed && !document.hidden;
    }

    function readyToBlink() {
        return isActive() && state === 'idle' &&
            blinkImage.complete && blinkImage.naturalWidth > 0;
    }

    function scheduleBlink() {
        if (!readyToBlink() || reducedMotion.matches) return;
        nextBlink = setTimeout(blink, 4200 + Math.random() * 5600);
    }

    function blink() {
        clearBlink();
        if (!readyToBlink()) return;
        root.classList.add('is-blinking');
        endBlink = setTimeout(() => {
            root.classList.remove('is-blinking');
            endBlink = null;
            scheduleBlink();
        }, 160);
    }

    function updatePose() {
        const pose = poses[state];
        root.dataset.pose = pose && pose.complete && pose.naturalWidth > 0 ? state : 'idle';
    }

    function renderState() {
        root.dataset.state = state;
        updatePose();
        bubble.hidden = state !== 'speaking';
        const restLabel = state === 'resting' ? root.dataset.wakeText : root.dataset.restText;
        restButton.setAttribute('aria-label', restLabel);
        restButton.setAttribute('title', restLabel);
        restButton.setAttribute('aria-pressed', String(state === 'resting'));
        const label = state === 'resting' ? root.dataset.wakeLabel : root.dataset.petLabel;
        cat.setAttribute('aria-label', label);
        cat.setAttribute('title', label);
    }

    function syncAnimation() {
        clearAutomatic();
        root.dataset.paused = String(collapsed || document.hidden || reducedMotion.matches);
        if (isActive() && state === 'idle' && !reducedMotion.matches) {
            scheduleBlink();
            restTimer = setTimeout(() => setState('resting'), 45000);
        }
    }

    function setState(next) {
        clearTimeout(stateTimer);
        stateTimer = null;
        state = next;
        renderState();
        syncAnimation();
        if (durations[state] && isActive()) {
            stateTimer = setTimeout(() => setState('idle'), durations[state]);
        }
    }

    function setCollapsed(value, remember = false, focus = false) {
        collapsed = value;
        root.dataset.collapsed = String(value);
        panel.hidden = value;
        launcher.hidden = !value;
        launcher.setAttribute('aria-expanded', String(!value));
        if (remember) {
            hasPreference = true;
            try { localStorage.setItem(storageKey, value ? '1' : '0'); } catch (_) {}
        }
        if (value) setState('idle');
        else syncAnimation();
        if (focus) (value ? launcher : cat).focus({ preventScroll: true });
    }

    function show() {
        if (shown || idleImage.naturalWidth === 0) return;
        shown = true;
        root.hidden = false;
        setCollapsed(collapsed);
    }

    function pausePage() {
        if (state === 'petting' || state === 'speaking') setState('idle');
        clearAll();
        root.dataset.paused = 'true';
    }

    renderState();
    collapseButton.addEventListener('click', () => setCollapsed(true, true, true));
    launcher.addEventListener('click', () => setCollapsed(false, true, true));
    cat.addEventListener('click', () => {
        if (isActive()) setState(state === 'resting' ? 'idle' : 'petting');
    });
    restButton.addEventListener('click', () => {
        if (isActive()) setState(state === 'resting' ? 'idle' : 'resting');
    });
    speakButton.addEventListener('click', () => {
        if (isActive()) setState('speaking');
    });
    for (const [name, image] of Object.entries(poses)) {
        image.addEventListener('load', () => { if (state === name) updatePose(); });
        image.addEventListener('error', () => { if (state === name) updatePose(); });
    }
    blinkImage.addEventListener('load', syncAnimation);
    blinkImage.addEventListener('error', clearBlink);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pausePage();
        else syncAnimation();
    });
    reducedMotion.addEventListener('change', syncAnimation);
    compactScreen.addEventListener('change', () => {
        if (!hasPreference) setCollapsed(compactScreen.matches);
    });
    window.addEventListener('pagehide', pausePage);
    window.addEventListener('pageshow', syncAnimation);
    idleImage.addEventListener('load', show, { once: true });
    idleImage.addEventListener('error', () => {
        root.hidden = true;
        clearAll();
        state = 'idle';
        renderState();
    });
    if (idleImage.complete) show();
})();
