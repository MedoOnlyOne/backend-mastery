import express from 'express';
import Piscina from 'piscina';
import PQueue from 'p-queue';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000

// worker pool
const pool = new Piscina({
    filename: path.resolve(__dirname, 'worker.js'),
    minThreads: 2,
    maxThreads: os.cpus().length, // scale to CPU cores
});

// Queue with backpressure
const queue = new PQueue({
    concurrency: os.cpus().length // how many jobs run in parallel
});

// System limits (VERY IMPORTANT)
const MAX_QUEUE_SIZE = 100; // protect memory

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.get('/process', async (req, res) => {
    // Backpressure: reject if overloaded
    if (queue.size >= MAX_QUEUE_SIZE) {
        return res.status(503).send('Server busy, try again later');
    }

    try {
        const result = await queue.add(() =>
            pool.run({
                num: 10,
                iterations: 1e10,
            })
        );
        res.send(`Process is done, Result: ${result}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})