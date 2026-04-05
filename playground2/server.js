const express = require('express');
const userRouter = require('./user/routes');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/users', userRouter);
app.listen(port, () => console.log(`Server is running on port ${port}`));