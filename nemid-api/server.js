"use strict";
/**
 * This file contains the configuration and entry point for the Node.js server.
 */
const express = require("express");
const logger = require("morgan");
const userRouter = require("./routers/user.router");
const genderRouter = require("./routers/gender.router");
const passwordRouter = require("./routers/password.router");
const config = require("./server.config");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/user", userRouter);
app.use("/gender", genderRouter);
app.use("/password", passwordRouter);

app.listen(config.port, () => {
    console.log(`listening on port ${(config.port)}`);
});
