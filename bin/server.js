"use strict";

const app = require("../src/app.js"); 

const redis = require("../src/shared/databases/postgres");
const PostgresDB = require("../src/shared/databases/redis");  

const port = process.env.PORT || "8080"; 
app.listen(port, () => console.log(`\nApplication is running >> Ex: https://address:${port}/\n`));