"use strict";

const redis = require("redis");

class Redis {
    constructor(port){
        this.client = new redis.createClient({
            port: port
        });
        
        this.createConnection();
    }

    createConnection(){
        this.client.on("connect", (error) => {
            if (error) throw new Error(error);
            console.log("\n[+] - Redis Connected!");
        });
    }
};

module.exports = new Redis(6379).client;