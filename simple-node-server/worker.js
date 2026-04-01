const { parentPort } = require('worker_threads');

function heavyComputation(num) {
    let result = 0;
    for (let i = 0; i < 1e10; i++) {
        result += num;
    }
    return result;
}

parentPort.on('message', (num) => {
    const result = heavyComputation(num);
    parentPort.postMessage(result);
});