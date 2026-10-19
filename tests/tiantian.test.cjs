const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const script = readFileSync(require('node:path').join(__dirname, '../assets/tiantian/tiantian.js'), 'utf8');

class Events {
    constructor() { this.listeners = new Map(); }
    addEventListener(name, callback) {
        if (!this.listeners.has(name)) this.listeners.set(name, []);
        this.listeners.get(name).push(callback);
    }
    emit(name) { for (const callback of this.listeners.get(name) || []) callback(); }
}

class Element extends Events {
    constructor() {
        super();
        this.hidden = false;
        this.dataset = {};
        this.attributes = {};
        this.classList = new Set();
        this.classList.remove = this.classList.delete;
        this.complete = true;
        this.naturalWidth = 320;
        this.textContent = '';
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    focus() { this.focused = true; }
}

function setup({ compact = false, reduced = false, saved = null, storageFails = false, loaded = true, posesLoaded = true } = {}) {
    const elements = {};
    for (const key of ['panel', 'cat', 'collapse', 'launcher', 'idle', 'blink', 'rest', 'speak', 'bubble', 'petting', 'resting', 'speaking']) {
        elements[key] = new Element();
    }
    const root = new Element();
    root.hidden = true;
    root.dataset = { petLabel: '摸摸甜甜', wakeLabel: '叫醒甜甜', restText: '休息', wakeText: '唤醒' };
    root.querySelector = selector => elements[selector.replace('.tiantian__', '').replace('pose--', '')];
    elements.bubble.textContent = '喵喵喵';
    elements.idle.complete = loaded;
    elements.idle.naturalWidth = loaded ? 320 : 0;
    for (const key of ['petting', 'resting', 'speaking']) {
        elements[key].complete = posesLoaded;
        elements[key].naturalWidth = posesLoaded ? 320 : 0;
    }
    const document = new Events();
    document.hidden = false;
    document.getElementById = () => root;
    const window = new Events();
    const compactScreen = Object.assign(new Events(), { matches: compact });
    const reducedMotion = Object.assign(new Events(), { matches: reduced });
    window.matchMedia = query => query.includes('reduced-motion') ? reducedMotion : compactScreen;
    const storage = new Map(saved === null ? [] : [['tiantian-collapsed', saved]]);
    const localStorage = {
        getItem: key => { if (storageFails) throw new Error('blocked'); return storage.get(key) ?? null; },
        setItem: (key, value) => { if (storageFails) throw new Error('blocked'); storage.set(key, value); }
    };
    const timers = new Map();
    let id = 0;
    let now = 0;
    vm.runInNewContext(script, {
        document, window, localStorage, Math,
        setTimeout: (callback, delay) => { timers.set(++id, { callback, delay, at: now + delay }); return id; },
        clearTimeout: key => timers.delete(key)
    });
    function next() {
        return [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0];
    }
    function tick() {
        const [key, timer] = next();
        timers.delete(key);
        now = timer.at;
        timer.callback();
        return timer.delay;
    }
    function advance(ms) {
        const target = now + ms;
        while (timers.size && next()[1].at <= target) tick();
        now = target;
    }
    return { root, elements, document, window, compactScreen, reducedMotion, storage, timers, tick, advance };
}

test('starts open on desktop and completes an occasional blink cycle', () => {
    const s = setup();
    assert.equal(s.root.hidden, false);
    assert.equal(s.root.dataset.state, 'idle');
    const wait = s.tick();
    assert.ok(wait >= 4200 && wait <= 9800);
    assert.ok(s.root.classList.has('is-blinking'));
    assert.equal(s.tick(), 160);
    assert.equal(s.root.classList.has('is-blinking'), false);
    assert.equal(s.timers.size, 2);
});

test('petting changes expression and repeated pets restart the reaction without stale timers', () => {
    const s = setup();
    s.elements.cat.emit('click');
    assert.equal(s.root.dataset.state, 'petting');
    assert.equal(s.root.dataset.pose, 'petting');
    assert.equal(s.elements.bubble.hidden, true);
    s.advance(1000);
    s.elements.cat.emit('click');
    s.advance(800);
    assert.equal(s.root.dataset.state, 'petting');
    s.advance(1000);
    assert.equal(s.root.dataset.state, 'idle');
    assert.equal(s.timers.size, 2);
});

test('resting can be requested or reached after 45 seconds, and a click wakes the cat', () => {
    const s = setup();
    s.advance(45000);
    assert.equal(s.root.dataset.state, 'resting');
    assert.equal(s.timers.size, 0);
    assert.equal(s.elements.rest.attributes['aria-label'], '唤醒');
    assert.equal(s.elements.rest.attributes.title, '唤醒');
    assert.equal(s.elements.cat.attributes['aria-label'], '叫醒甜甜');
    s.elements.cat.emit('click');
    assert.equal(s.root.dataset.state, 'idle');
    s.elements.rest.emit('click');
    assert.equal(s.root.dataset.state, 'resting');
    s.elements.rest.emit('click');
    assert.equal(s.root.dataset.state, 'idle');
});

test('speaking shows the exact meow bubble for three seconds and safely interrupts petting', () => {
    const s = setup();
    s.elements.cat.emit('click');
    s.elements.speak.emit('click');
    assert.equal(s.root.dataset.state, 'speaking');
    assert.equal(s.root.dataset.pose, 'speaking');
    assert.equal(s.elements.bubble.hidden, false);
    assert.equal(s.elements.bubble.textContent, '喵喵喵');
    s.advance(2999);
    assert.equal(s.root.dataset.state, 'speaking');
    s.advance(1);
    assert.equal(s.elements.bubble.hidden, true);
    assert.equal(s.root.dataset.state, 'idle');
    s.elements.speak.emit('click');
    s.elements.rest.emit('click');
    s.advance(5000);
    assert.equal(s.root.dataset.state, 'resting');
    assert.equal(s.elements.bubble.hidden, true);
});

test('collapse cancels reactions, hides the bubble, remembers the choice and reopens idle', () => {
    const s = setup();
    s.elements.speak.emit('click');
    s.elements.collapse.emit('click');
    assert.equal(s.elements.panel.hidden, true);
    assert.equal(s.elements.launcher.hidden, false);
    assert.equal(s.elements.launcher.focused, true);
    assert.equal(s.elements.bubble.hidden, true);
    assert.equal(s.timers.size, 0);
    assert.equal(s.storage.get('tiantian-collapsed'), '1');
    assert.equal(setup({ saved: '1' }).root.dataset.collapsed, 'true');
    s.elements.launcher.emit('click');
    assert.equal(s.elements.cat.focused, true);
    assert.equal(s.root.dataset.state, 'idle');
    assert.equal(s.storage.get('tiantian-collapsed'), '0');
    assert.equal(s.timers.size, 2);
});

test('small screens start compact while explicit choices survive resizing', () => {
    const s = setup({ compact: true });
    assert.equal(s.root.dataset.collapsed, 'true');
    assert.equal(s.timers.size, 0);
    s.elements.launcher.emit('click');
    s.compactScreen.emit('change');
    assert.equal(s.root.dataset.collapsed, 'false');
    assert.equal(setup({ compact: true, saved: '0' }).root.dataset.collapsed, 'false');
});

test('background pages clear transient states; reduced motion keeps manual controls working', () => {
    const s = setup();
    s.elements.speak.emit('click');
    s.document.hidden = true;
    s.document.emit('visibilitychange');
    assert.equal(s.root.dataset.paused, 'true');
    assert.equal(s.elements.bubble.hidden, true);
    assert.equal(s.root.dataset.state, 'idle');
    assert.equal(s.timers.size, 0);
    s.document.hidden = false;
    s.document.emit('visibilitychange');
    assert.equal(s.timers.size, 2);
    s.reducedMotion.matches = true;
    s.reducedMotion.emit('change');
    assert.equal(s.timers.size, 0);
    s.elements.cat.emit('click');
    assert.equal(s.root.dataset.state, 'petting');
    s.advance(1800);
    assert.equal(s.root.dataset.state, 'idle');
    assert.equal(s.timers.size, 0);
    s.reducedMotion.matches = false;
    s.reducedMotion.emit('change');
    s.window.emit('pagehide');
    assert.equal(s.timers.size, 0);
    s.window.emit('pageshow');
    assert.equal(s.timers.size, 2);
});

test('delayed or failed poses fall back to idle without losing speech or controls', () => {
    const s = setup({ posesLoaded: false });
    s.elements.speak.emit('click');
    assert.equal(s.root.dataset.pose, 'idle');
    assert.equal(s.elements.bubble.hidden, false);
    s.elements.speaking.complete = true;
    s.elements.speaking.naturalWidth = 320;
    s.elements.speaking.emit('load');
    assert.equal(s.root.dataset.pose, 'speaking');
    s.elements.speaking.naturalWidth = 0;
    s.elements.speaking.emit('error');
    assert.equal(s.root.dataset.pose, 'idle');
    s.elements.rest.emit('click');
    assert.equal(s.root.dataset.state, 'resting');
});

test('unavailable storage and a failed base image do not break the page or leave timers', () => {
    const s = setup({ storageFails: true, loaded: false });
    assert.equal(s.root.hidden, true);
    assert.equal(s.timers.size, 0);
    s.elements.idle.naturalWidth = 320;
    s.elements.idle.emit('load');
    assert.equal(s.root.hidden, false);
    s.elements.collapse.emit('click');
    s.elements.launcher.emit('click');
    s.elements.speak.emit('click');
    s.elements.idle.emit('error');
    assert.equal(s.root.hidden, true);
    assert.equal(s.elements.bubble.hidden, true);
    assert.equal(s.timers.size, 0);
});
