"use strict";

const PGDatabase = require("../../databases/postgres/index");

const { getAll } = require("../../services/Time/TimeStampService"); 
const crypto = require("../../services/Crypto/MPCryptoService"); 
const { generateToken } = require("../../services/JWT/TokenService"); 

module.exports = class AuthController {

    static loginClient(req, res){

        const { username, password } = req.body;

        if (!username)
            return res.status(400).send({ 
                responseError: {
                    status: 400,
                    user_login: false,
                    timestamp: getAll(),
                    description: "The username must be informed!"
                }
            });
        
        if (!password)
            return res.status(400).send({ 
                responseError: {
                    status: 400,
                    user_login: false,
                    timestamp: getAll(),
                    description: "The login password must be entered!"
                }
            });
        
        const encode_password = crypto.codif(password.toUpperCase()); 

        PGDatabase.query(`SELECT usucod, usunome, ususenha, nome FROM tblusu WHERE usunome = '${username.toUpperCase()}' AND ususenha = '${encode_password}' AND status <> 'PRESTADOR'`, (error, results) => { 
            
            if (error) throw error; 

            if (results.rows.length < 1)
                return res.status(400).send({ 
                    responseError: {
                        status: 400,
                        user_login: false,
                        requestAt: getAll(),
                        message: "Ops! We could not identify your login, review the data and try again :("
                    }
                });
    
            const userToken = generateToken({ id: results.rows[0].usucod }, 36000); 
            
            return res.status(201).send({
                status: 201,
                timestamp: getAll(),
                user_data: {
                    id: results.rows[0].usucod,
                    name: results.rows[0].nome,
                    username: results.rows[0].usunome,
                    firstName: results.rows[0].nome.split(" ")[0]
                },
                security: {
                    user_login: true,
                    access_token: userToken,
                    message: "Existing user and successfully authenticated :)"
                }
            });
        });
    }
};
