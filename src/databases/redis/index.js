"use strict";

const { createClient } = require("redis");

const client = new createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.on("connect", (error) => {
    if (error) throw new Error(error);
    console.log("\n[+] - Redis Connected!");
});

module.exports = client;