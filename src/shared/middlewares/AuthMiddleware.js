"use strict";

const jwt = require("jsonwebtoken"); 

const { verifyToken } = require("../services/TokenService"); 

const { getAll } = require("../services/TimeStampService");

module.exports = async (req, res, next) => {

    const requestAt = new Date();

    const authorization = req.headers.authorization;

    if (!authorization)
        return res.status(401).send({ 
            responseError: {
                status: 401,
                timestamp: getAll(),
                description: "Token not provided!" 
            }
        });
    
    const parts = authorization.split(" ");

    if (!parts.length == 2)
        return res.status(401).send({
            responseError: {
                status: 401,
                timestamp: getAll(),
                description: "Malformed token!" 
            }
        });
    
    const [ schema, token ] = parts;

    if (!/^Bearer$/i.test(schema))
        return res.status(401).send({ 
            responseError: {
                status: 401,
                timestamp: getAll(),
                description: "Malformed token!"
            }
        });

    try {

        const validation = await verifyToken(token); 
        next(); 
        
    }catch(error){ 
        return res.status(401).send({
            responseError: {
                status: 401,
                timestamp: getAll(),
                description: "Token invalid, access denied!"
            }
        });
    }
};