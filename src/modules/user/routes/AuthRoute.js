"use strict";

const { Router } = require("express"); 

const { loginClient } = require("../controllers/AuthController"); 

const router = Router();

router.post("/api/user/login", loginClient);

module.exports = router;