"use strict";

const { Router } = require("express"); 

const { loginClient } = require("../../controllers/Auth/AuthController"); 

const router = Router();

router.post("/api/user/login", loginClient);

module.exports = router;