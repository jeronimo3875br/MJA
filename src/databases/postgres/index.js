"use strict";

const { Client } = require("pg"); 

class PGDatabase {
    constructor(config){
        this.client;
        this.config = config;
        
        this.connectServer(); 
    }

    async connectServer(){
        this.client = new Client(this.config);

        try {
            await this.client.connect();
            console.log("[+] - PostgreSQL Connected!");
        }catch(error){
            console.log("[!] - Failure to connect to PostgreSQL");
            throw new Error(error);
        };
    }

    closeConnection(){
        this.client.end();
    }
};

module.exports = new PGDatabase({
    user: process.env.PG_USER,
    host: process.env.PG_HOST, 
    database: process.env.PG_DATABASE, 
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT 
}).client;
