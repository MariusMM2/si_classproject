"use strict";
/**
 * This file contains the configuration and entry point for the Node.js server.
 */
const express = require("express");
const logger = require("morgan");
// const userRoute = require("./routers/user.router");
const genderRoute = require("./routers/gender.router");
// const passwordRoute = require("./routers/password.router");
const config = require("./server.config");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use("/user", userRoute);
app.use("/gender", genderRoute);
// app.use("/password", passwordRoute);

app.listen(config.port, () => {
    console.log(`listening on port ${(config.port)}`);
});
