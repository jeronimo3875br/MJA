"use strict";

const ejs = require("ejs");
const path = require("path");

const JunoService = require("../../../services/JunoService");
const { getAccessToken } = require("../../../services/JunoAuthService");
const { getAll } = require("../../../../../shared/services/TimeStampService");

module.exports = class JunoController {
    static async listBanks(req, res){
        try {

            const token = await getAccessToken(true, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

            const Juno = new JunoService(true, token, process.env.PRIVATE_TOKEN);

            return res.status(200).send({
                status: 200,
                timestamp: getAll(),
                banks: await Juno.listBanks()
            });

        }catch(error){
            return res.status(400).send({
                responseError: {
                    status: 400,
                    timestamp: getAll(),
                    description: error
                }
            });
        };
    }

    static async createCharge(req, res){
        try {

            const token = await getAccessToken(true, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

            const Juno = new JunoService(true, token, process.env.PRIVATE_TOKEN);

            const newCharge = await Juno.createCharge(req.body.charge, req.body.billing);
            
            return res.status(201).send({
                status: 201,
                timestamp: getAll(),
                chargeData: newCharge
            });

        }catch(error){
            return res.status(400).send({
                responseError: {
                    status: 400,
                    timestamp: getAll(),
                    description: error
                }
            });
        };
    }

    static async listCharge(req, res){
        try {

            const { id } = req.params;

            const token = await getAccessToken(true, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

            const Juno = new JunoService(true, token, process.env.PRIVATE_TOKEN);

            const charge = await Juno.listCharge(id);

            return res.status(200).send({
                status: 200,
                timestamp: getAll(),
                charge: charge
            });

        }catch(error){
            return res.status(400).send({
                responseError: {
                    status: 400,
                    timestamp: getAll(),
                    description: error
                }
            });
        };
    }

    static async listCharges(req, res){
        try {

            const token = await getAccessToken(true, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

            const Juno = new JunoService(true, token, process.env.PRIVATE_TOKEN);

            const charges = await Juno.listCharges();

            return res.status(200).send({
                status: 200,
                timestamp: getAll(),
                charges: charges
            });

        }catch(error){
            throw error;
            return res.status(400).send({
                responseError: {
                    status: 400,
                    timestamp: getAll(),
                    description: error
                }
            });
        };
    }

    static async cancelCharge(req, res){
        try {

            const { id } = req.params;

            const token = await getAccessToken(true, process.env.CLIENT_ID, process.env.CLIENT_SECRET);

            const Juno = new JunoService(true, token, process.env.PRIVATE_TOKEN);

            const cancel = await Juno.cancelCharge(id);

            return res.status(204).send({
                status: 204,
                timestamp: getAll()
            });

        }catch(error){
            return res.status(400).send({
                responseError: {
                    status: 400,
                    timestamp: getAll(),
                    description: error
                }
            });
        };
    }
}