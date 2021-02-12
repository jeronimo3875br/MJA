"use strict";

const { Client } = require("pg"); 

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST, 
    database: process.env.PG_DATABASE, 
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

(async () => {

    try {
        await client.connect();
        console.log("[+] - PostgreSQL Connected!");
    }catch(error){
        console.log("[!] - Failure to connect to PostgreSQL");
        throw new Error(error);
    };

})();

module.exports = client;