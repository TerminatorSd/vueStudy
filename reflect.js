// page 86
// const obj = { foo: 1 };
const obj = {
    get foo() {
        return this.foo;
    }
}
console.log(Reflect.get(obj, 'foo', { foo: 2 }));