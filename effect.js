// vue.js设计与实现，page50，分支切换与cleanup
let activeEffect;
// effect v1
// function effect(fn) {
//     activeEffect = fn;
//     fn();
// }
// effect v2
function effect(fn) {
    const effectFn = () => {
        activeEffect = effectFn;
        fn();
    }
    effectFn.deps = [];
    effectFn();
}
// 对象的key被读取时，添加副作用函数，所谓的副作用函，描述了对象的key发生变化时，要随之变化的东西
const bucket = new WeakMap();
function track(target, key) {
    if(!activeEffect) return;
    let depsMap = bucket.get(target);
    if(!depsMap) { bucket.set(target, (depsMap = new Map())); }
    let deps = depsMap.get(key);
    if(!deps) { depsMap.set(key, (deps = new Set())); }
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
}
// 对象的key被设置时，调用副作用函数
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

// ok 为false之后，text的值不应该在触发副作用函数，但是实际上还是触发了
obj.ok = false;
obj.text = 'hello'

// try cleanup