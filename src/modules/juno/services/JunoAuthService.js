"use strict";

const axios = require("axios");

const { setCache, getCache } = require("./RedisService");

module.exports = class JunoAuthService {
    static getAccessToken(sandbox, clientId, clientSecret){
        return new Promise(async (resolve, reject) => {
            const checkAccessToken = await getCache("ACCESS_TOKEN");

            if (!checkAccessToken){
                try {
                    const userHash = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
                    const { data, status } = await axios.post(  
                        `${sandbox ? 'https://sandbox.boletobancario.com/authorization-server/oauth/token' : 'https://api.juno.com.br/authorization-server/oauth/token'}`,
                        'grant_type=client_credentials', 
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded', 
                                Authorization: `Basic ${userHash}`, 
                            },
                        }
                    );

                    if (status !== 200) reject("Failed to request the access token! Check the data and/or try again :(");

                    console.log("Generating new Access Token...");
                    await setCache("ACCESS_TOKEN", data.access_token, sandbox ? 86400 : 3600);
                    resolve(data.access_token);

                }catch(error){
                    reject(error);
                };
            }else{
                console.log("\nAccess Token Already Exists!\n");
                resolve(checkAccessToken);
            };
        });
    }
};