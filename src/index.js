const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");

const app = express();
const port = process.env.PORT;
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});
