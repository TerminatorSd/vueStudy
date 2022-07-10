// 你不知道的js，page48
// 6 6 6 6 6
for (var i = 1; i <= 5; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}
// 5 5 5 5 5
for (var i = 1; i <= 5; i++) {
    var j = i;
    setTimeout(() => {
        console.log(j);
    }, j * 1000);
}
// 6 6 6 6 6
for (var i = 1; i <= 5; i++) {
    (function() {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
    })()
}
// 1 2 3 4 5 
for (var i = 1; i <= 5; i++) {
    (function() {
        var j = i;
        setTimeout(() => {
            console.log(j);
        }, j * 1000);
    })()
}
// 1 2 3 4 5
for (var i = 1; i <= 5; i++) {
    let j = i;
    setTimeout(() => {
        console.log(j);
    }, j * 1000);
}
// 1 2 3 4 5
for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}