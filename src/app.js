"use strict";

const path = require("path"); 
const cors = require("cors");  
const helmet = require("helmet"); 
const express = require("express");  
const { config } = require("dotenv"); 
const bodyParser = require("body-parser");

config({ path: ".env" });

const AuthRoute = require("./routes/Auth/AuthRoute");
const JunoRoute = require("./routes/Juno/JunoRoute"); 

const AuthMiddleware = require("./middlewares/Auth/AuthMiddleware");

class App {
    constructor(){
        this.express = express();
        this.middlewares();
        this.routes(); 
    }

    middlewares(){
        this.express.use(cors());
        this.express.use(helmet()); 
        this.express.use(bodyParser.json({ limit: "5mb" })); 
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    routes(){
        this.express.use("/", AuthRoute); 
        this.express.use("/", AuthMiddleware, JunoRoute); 
    }
};

module.exports = new App().express;
