"use strict";

const jwt = require("jsonwebtoken"); 

module.exports = class Token {
    static generateToken(payload, time){
        const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: time });
        return token;
    }

    static verifyToken(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error){
                    reject("Token inválido, não autorizado!");
                }else{
                    resolve(decoded); 
                };
            });
        });
    }
};