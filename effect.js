// vue.js设计与实现，page50，分支切换与cleanup
let activeEffect;
function effect(fn) {
    activeEffect = fn;
    fn();
}

const bucket = new WeakMap();
function track(target, key) {
    if(!activeEffect) return;
    let depsMap = bucket.get(target);
    if(!depsMap) { bucket.set(target, (depsMap = new Map())); }
    let deps = depsMap.get(key);
    if(!deps) { depsMap.set(key, (deps = new Set())); }
    deps.add(activeEffect);
}

function trigger(target, key) {
    const depsMap = bucket.get(target);
    if(!depsMap) return;
    const effects = depsMap.get(key);
    effects && effects.forEach(fn => { fn(); });
}

const data = { ok: true, text: 'hellow world' };
const obj = new Proxy(data, {
    get(target, key) {
        track(target, key);
        return target[key];
    },
    set(target, key, newVal) {
        target[key] = newVal;
        trigger(target, key);
    }
})

effect(() => {
    console.log('effect');
    console.log(obj.ok ? obj.text : 'not')
})

obj.ok = false;
obj.text = 'jja'