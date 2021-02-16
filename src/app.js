"use strict";

const path = require("path"); 
const cors = require("cors");  
const helmet = require("helmet"); 
const express = require("express");  
const { config } = require("dotenv"); 
const bodyParser = require("body-parser");

config({ path: ".env" });

const AuthRoute = require("./modules/user/routes/AuthRoute");
const JunoRoute = require("./modules/juno/routes/JunoRoute"); 

const AuthMiddleware = require("./shared/middlewares/AuthMiddleware");

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
