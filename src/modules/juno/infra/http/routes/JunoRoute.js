"use strict";

const { Router } = require("express");

const { listBanks, createCharge, listCharge, listCharges, cancelCharge } = require("../controllers/JunoController");

const router = Router();

router.get("/api/juno/list/banks", listBanks);
router.get("/api/juno/list/charges", listCharges);
router.get("/api/juno/list/charge/:id", listCharge);
router.post("/api/juno/create/charge", createCharge);
router.put("/api/juno/cancel/charge/:id", cancelCharge);

module.exports = router; 