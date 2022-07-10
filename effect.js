// vue.js设计与实现，page50，分支切换与cleanup
let activeEffect;
// effect v1
// function effect(fn) {
//     activeEffect = fn;
//     fn();
// }
// effect v2
/**
 * 参考《你不知道的js-上册》，page45，这就是一个闭包，标准的闭包是返回函数，函数可以是直接return，也可以是通过给全局变量赋值间接返回
 * 外层函数运行结束后，将内层函数通过任何手段传递出去，对外层函数内部作用域的引用还存在，这个引用就叫做闭包
 *  */ 
function effect(fn) {
    const effectFn = () => {
        // 每次副作用执行前，删除引用，执行时通过proxy的get会再次添加，如果走不到的变量就不会被添加上
        // 比如ok为false时走不到text，删除后再添加，就不会添加到text修改的回调中
        cleanup(effectFn);
        activeEffect = effectFn;
        fn();
    }
    effectFn.deps = [];
    effectFn();
}
function cleanup(effectFn) {
    // 作为一个副作用函数，我被哪里用到了，让它们先把我删除
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        deps.delete(effectFn);
    }
    // 每次清除，确保一个key被多次访问后，不会被多次添加到activeEffect.deps中
    effectFn.deps.length = 0;
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
    // 哪个target-key对象用到了我这个副作用函数，记录下来
    activeEffect.deps.push(deps);
}
// 对象的key被设置时，调用副作用函数
function trigger(target, key) {
    const depsMap = bucket.get(target);
    if(!depsMap) return;
    const effects = depsMap.get(key);
    // 使用替身，确保每次清楚后，再添加不会出现死循环，参考书籍page 54
    const effectsToRun = new Set(effects);
    effectsToRun.forEach(effectFn => effectFn());
    // effects && effects.forEach(fn => { fn(); });
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
    console.log(obj.ok ? obj.text : 'not')
})

// ok 为false之后，text的值不应该在触发副作用函数，但是实际上还是触发了
obj.ok = false;
obj.text = 'hello'
obj.ok = true;
obj.text = 'hello ha'

// try cleanup