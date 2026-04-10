const express = require('express');
const userRouter = require('./app/user/routes');
const correlationId = require('./common/correlation/correlationId');
const errorHandler = require('./common/error/errorHandler');
const app = express();
const port = 3000;

app.use(correlationId);
app.use(express.json());
app.use('/users', userRouter);
app.use(errorHandler);
app.listen(port, () => console.log(`Server is running on port ${port}`));