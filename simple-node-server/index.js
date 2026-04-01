const express = require('express');

const app = express();
const port = 3000

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})
app.get('/process', (req, res) => {
    for (let i = 0; i < 100000000000; i++){

    }
    res.send('Process is done')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})