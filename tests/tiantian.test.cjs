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
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    focus() { this.focused = true; }
}

function setup({ compact = false, reduced = false, saved = null, storageFails = false, loaded = true } = {}) {
    const elements = {};
    for (const key of ['panel', 'cat', 'collapse', 'launcher', 'idle', 'blink']) elements[key] = new Element();
    const root = new Element();
    root.hidden = true;
    root.querySelector = selector => elements[selector.replace('.tiantian__', '')];
    elements.idle.complete = loaded;
    elements.idle.naturalWidth = loaded ? 320 : 0;
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
    vm.runInNewContext(script, {
        document, window, localStorage, Math,
        setTimeout: (callback, delay) => { timers.set(++id, { callback, delay }); return id; },
        clearTimeout: key => timers.delete(key)
    });
    function tick() {
        const [key, timer] = timers.entries().next().value;
        timers.delete(key);
        timer.callback();
        return timer.delay;
    }
    return { root, elements, document, window, compactScreen, reducedMotion, storage, timers, tick };
}

test('starts open on desktop and completes an occasional blink cycle', () => {
    const s = setup();
    assert.equal(s.root.hidden, false);
    assert.equal(s.root.dataset.collapsed, 'false');
    const wait = s.tick();
    assert.ok(wait >= 4200 && wait <= 9800);
    assert.ok(s.root.classList.has('is-blinking'));
    assert.equal(s.tick(), 160);
    assert.equal(s.root.classList.has('is-blinking'), false);
    assert.equal(s.timers.size, 1);
});

test('collapse cancels pending motion, remembers the choice, and can reopen by keyboard button', () => {
    const s = setup();
    s.elements.collapse.emit('click');
    assert.equal(s.elements.panel.hidden, true);
    assert.equal(s.elements.launcher.hidden, false);
    assert.equal(s.elements.launcher.focused, true);
    assert.equal(s.timers.size, 0);
    assert.equal(s.storage.get('tiantian-collapsed'), '1');
    assert.equal(setup({ saved: '1' }).root.dataset.collapsed, 'true');
    s.elements.launcher.emit('click');
    assert.equal(s.elements.panel.hidden, false);
    assert.equal(s.elements.cat.focused, true);
    assert.equal(s.storage.get('tiantian-collapsed'), '0');
    assert.equal(s.timers.size, 1);
});

test('small screens start compact while an explicit choice survives resizing', () => {
    const s = setup({ compact: true });
    assert.equal(s.root.dataset.collapsed, 'true');
    assert.equal(s.timers.size, 0);
    s.elements.launcher.emit('click');
    s.compactScreen.emit('change');
    assert.equal(s.root.dataset.collapsed, 'false');
    assert.equal(setup({ compact: true, saved: '0' }).root.dataset.collapsed, 'false');
});

test('hidden tabs and reduced motion stop automatic blinking and resume safely', () => {
    const s = setup();
    s.document.hidden = true;
    s.document.emit('visibilitychange');
    assert.equal(s.root.dataset.paused, 'true');
    assert.equal(s.timers.size, 0);
    s.document.hidden = false;
    s.document.emit('visibilitychange');
    assert.equal(s.timers.size, 1);
    s.reducedMotion.matches = true;
    s.reducedMotion.emit('change');
    assert.equal(s.timers.size, 0);
    s.elements.cat.emit('click');
    assert.ok(s.root.classList.has('is-blinking'));
    assert.equal(s.tick(), 260);
    assert.equal(s.timers.size, 0);
    s.reducedMotion.matches = false;
    s.reducedMotion.emit('change');
    s.window.emit('pagehide');
    assert.equal(s.timers.size, 0);
    s.window.emit('pageshow');
    assert.equal(s.timers.size, 1);
});

test('unavailable storage or images do not break the page or leave live timers', () => {
    const s = setup({ storageFails: true, loaded: false });
    assert.equal(s.root.hidden, true);
    assert.equal(s.timers.size, 0);
    s.elements.idle.naturalWidth = 320;
    s.elements.idle.emit('load');
    assert.equal(s.root.hidden, false);
    s.elements.collapse.emit('click');
    assert.equal(s.root.dataset.collapsed, 'true');
    s.elements.launcher.emit('click');
    s.elements.idle.emit('error');
    assert.equal(s.root.hidden, true);
    assert.equal(s.timers.size, 0);
});
