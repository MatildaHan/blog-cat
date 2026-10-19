(() => {
    const root = document.getElementById('tiantian');
    if (!root) return;

    const panel = root.querySelector('.tiantian__panel');
    const cat = root.querySelector('.tiantian__cat');
    const collapseButton = root.querySelector('.tiantian__collapse');
    const launcher = root.querySelector('.tiantian__launcher');
    const idleImage = root.querySelector('.tiantian__idle');
    const blinkImage = root.querySelector('.tiantian__blink');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactScreen = window.matchMedia('(max-width: 1200px)');
    const storageKey = 'tiantian-collapsed';
    let saved = null;
    try { saved = localStorage.getItem(storageKey); } catch (_) {}
    let hasPreference = saved === '1' || saved === '0';
    let collapsed = hasPreference ? saved === '1' : compactScreen.matches;
    let nextBlink = null;
    let endBlink = null;

    function clearBlink() {
        clearTimeout(nextBlink);
        clearTimeout(endBlink);
        nextBlink = null;
        endBlink = null;
        root.classList.remove('is-blinking');
    }

    function readyToBlink() {
        return !root.hidden && !collapsed && !document.hidden &&
            blinkImage.complete && blinkImage.naturalWidth > 0;
    }

    function scheduleBlink() {
        if (!readyToBlink() || reducedMotion.matches) return;
        nextBlink = setTimeout(() => blink(), 4200 + Math.random() * 5600);
    }

    function blink(manual = false) {
        clearBlink();
        if (!readyToBlink()) return;
        root.classList.add('is-blinking');
        endBlink = setTimeout(() => {
            root.classList.remove('is-blinking');
            endBlink = null;
            scheduleBlink();
        }, manual ? 260 : 160);
    }

    function syncAnimation() {
        clearBlink();
        root.dataset.paused = String(collapsed || document.hidden || reducedMotion.matches);
        scheduleBlink();
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
        syncAnimation();
        if (focus) (value ? launcher : cat).focus({ preventScroll: true });
    }

    function show() {
        if (idleImage.naturalWidth === 0) return;
        root.hidden = false;
        setCollapsed(collapsed);
    }

    collapseButton.addEventListener('click', () => setCollapsed(true, true, true));
    launcher.addEventListener('click', () => setCollapsed(false, true, true));
    cat.addEventListener('click', () => blink(true));
    blinkImage.addEventListener('load', syncAnimation);
    blinkImage.addEventListener('error', clearBlink);
    document.addEventListener('visibilitychange', syncAnimation);
    reducedMotion.addEventListener('change', syncAnimation);
    compactScreen.addEventListener('change', () => {
        if (!hasPreference) setCollapsed(compactScreen.matches);
    });
    window.addEventListener('pagehide', () => {
        clearBlink();
        root.dataset.paused = 'true';
    });
    window.addEventListener('pageshow', syncAnimation);
    idleImage.addEventListener('load', show, { once: true });
    idleImage.addEventListener('error', () => {
        root.hidden = true;
        clearBlink();
    });
    if (idleImage.complete) show();
})();
