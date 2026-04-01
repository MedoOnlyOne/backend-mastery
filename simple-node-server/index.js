const express = require('express');
const { Worker } = require('worker_threads');
const path = require('path');

const app = express();
const port = 3000

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.get('/process', async (req, res) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));

    worker.postMessage(10); // send input

    worker.on('message', (result) => {
        res.send(`Result: ${result}`);
        worker.terminate(); // cleanup
    });

    worker.on('error', (err) => {
        res.status(500).send(err.message);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})