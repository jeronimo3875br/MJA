"use strict";

const app = require("../src/app.js"); 

const redis = require("../src/databases/redis/index");
const PostgresDB = require("../src/databases/postgres/index");  

const port = process.env.PORT || "8080"; 
app.listen(port, () => console.log(`\nApplication is running >> Ex: https://address:${port}/\n`));